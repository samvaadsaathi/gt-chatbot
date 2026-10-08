import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, X, Send, Maximize2, Minimize2, Trash2, Volume2, 
  VolumeX, Mic, MicOff, Copy, Check, ChevronDown, ChevronUp, Sparkles, BookOpen
} from 'lucide-react';
import { sendChatMessage, streamChatMessage, getLiveBackendStats } from '../services/api';
import MarkdownRenderer from './MarkdownRenderer';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('gt_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'init-1',
        role: 'assistant',
        content: "👋 Hello! I am the Gram Tarang AI Assistant. How can I help you today?\n\nYou can ask me about our 13 training centres, PMKVY / DDU-GKY schemes, free hostels, admissions, or our 80% placement record!",
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedSourceId, setExpandedSourceId] = useState(null);
  const [liveStats, setLiveStats] = useState({ online: true, totalVectors: 279 });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('gt_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isStreaming]);

  // Fetch live RAG stats
  useEffect(() => {
    getLiveBackendStats().then(s => setLiveStats(s));
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Listen for open events from other pages
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-gt-chatbot', handleOpen);
    window.openGtChatWidget = handleOpen;
    return () => {
      window.removeEventListener('open-gt-chatbot', handleOpen);
    };
  }, []);

  // Speech Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const clean = text.replace(/[*#•_`|]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.lang = 'en-IN';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (customQuery = input) => {
    const text = (customQuery || '').trim();
    if (!text || isLoading || isStreaming) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');

    const historyContext = newHistory.slice(-4).map(m => ({
      role: m.role,
      content: m.content
    }));

    const botMsgId = `bot-${Date.now()}`;
    let accumulated = '';

    const placeholderMsg = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      sources: [],
      sourceType: 'rag',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, placeholderMsg]);
    setIsStreaming(true);

    try {
      await streamChatMessage(
        text,
        historyContext,
        (chunk) => {
          accumulated += chunk;
          setMessages(prev => prev.map(m => 
            m.id === botMsgId ? { ...m, content: accumulated } : m
          ));
        },
        (finalRes) => {
          setIsStreaming(false);
          if (finalRes && finalRes.sources) {
            setMessages(prev => prev.map(m => 
              m.id === botMsgId ? { 
                ...m, 
                sources: finalRes.sources, 
                sourceType: finalRes.source_type,
                latencyMs: finalRes.latency_ms 
              } : m
            ));
          }
        },
        (err) => {
          setIsStreaming(false);
          setMessages(prev => prev.map(m => 
            m.id === botMsgId ? { 
              ...m, 
              content: accumulated || "⚠️ I am unable to connect to the backend server. Please contact Gram Tarang at +91-674-2386827 / info@gramtarang.org.in."
            } : m
          ));
        }
      );
    } catch (err) {
      setIsStreaming(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init-1',
        role: 'assistant',
        content: "Chat history cleared. How can I assist you today with Gram Tarang training and admissions?",
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    localStorage.removeItem('gt_chat_history');
  };

  const quickPrompts = [
    "Where are your 13 centres located?",
    "Tell me about Ashok Leyland joint program",
    "Are courses under PMKVY and DDU-GKY free?",
    "What is your placement record?"
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div 
          className="chat-fab"
          onClick={() => setIsOpen(true)}
          title="Chat with Gram Tarang AI Assistant"
        >
          <Bot size={28} />
          <div className="chat-fab-badge">1</div>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className={`chat-modal-window ${isMaximized ? 'maximized' : ''}`}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar-icon" style={{ overflow: 'hidden', background: '#000' }}>
                <img src="/gt-logo.png" alt="GT" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Gram Tarang Assistant
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>RAG AI</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <span className="chat-status-dot" /> Online • {liveStats.totalVectors} Vectors Active
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                onClick={clearChat} 
                className="icon-btn" 
                style={{ width: 32, height: 32 }}
                title="Clear Chat History"
              >
                <Trash2 size={15} />
              </button>
              <button 
                onClick={() => setIsMaximized(!isMaximized)} 
                className="icon-btn" 
                style={{ width: 32, height: 32 }}
                title={isMaximized ? "Restore Size" : "Maximize Window"}
              >
                {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="icon-btn" 
                style={{ width: 32, height: 32 }}
                title="Close Chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Messages Flow */}
          <div className="chat-messages-container">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`msg-row ${isUser ? 'user' : 'bot'}`}>
                  <div className="msg-bubble">
                    {isUser ? (
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                        {msg.content}
                      </div>
                    ) : (
                      <>
                        <MarkdownRenderer content={msg.content} />
                        {isStreaming && msg.id === messages[messages.length - 1]?.id && (
                          <span style={{
                            display: 'inline-block',
                            width: '6px',
                            height: '14px',
                            background: '#38BDF8',
                            marginLeft: '4px',
                            verticalAlign: 'middle',
                            animation: 'blink 0.8s infinite'
                          }} />
                        )}
                      </>
                    )}

                    {/* RAG Sources Dropdown */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                        <button
                          onClick={() => setExpandedSourceId(expandedSourceId === msg.id ? null : msg.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.75rem',
                            color: '#93C5FD',
                            background: 'rgba(59, 130, 246, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                          }}
                        >
                          <BookOpen size={13} />
                          <span>Sources: {msg.sources.length} Verified Document{msg.sources.length > 1 ? 's' : ''}</span>
                          {expandedSourceId === msg.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {expandedSourceId === msg.id && (
                          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {msg.sources.map((src, i) => (
                              <div key={i} style={{
                                fontSize: '0.73rem',
                                background: 'rgba(15, 23, 42, 0.75)',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                borderLeft: '3px solid var(--primary-light)'
                              }}>
                                <div style={{ fontWeight: 600, color: '#E2E8F0' }}>{src.document}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '2px' }}>
                                  Page {src.page} • Relevance: {Math.round(src.relevance_score * 100)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="msg-meta">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <>
                        {msg.latencyMs && <span>• {msg.latencyMs}ms</span>}
                        <button 
                          onClick={() => handleCopy(msg.id, msg.content)} 
                          title="Copy text"
                          style={{ color: 'var(--text-dim)', padding: '2px' }}
                        >
                          {copiedId === msg.id ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                        </button>
                        <button 
                          onClick={() => handleSpeak(msg.content)} 
                          title={isSpeaking ? "Stop audio" : "Read aloud"}
                          style={{ color: isSpeaking ? '#EF4444' : 'var(--text-dim)', padding: '2px' }}
                        >
                          {isSpeaking ? <VolumeX size={12} color="#EF4444" /> : <Volume2 size={12} />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div className="msg-row bot">
                <div className="msg-bubble" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={16} className="spin-slow" color="#F59E0B" />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Searching RAG vector store &amp; streaming response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="chat-quick-chips">
            {quickPrompts.map((q, i) => (
              <button key={i} className="chip-btn" onClick={() => handleSend(q)}>
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="chat-input-bar"
          >
            <input
              ref={inputRef}
              type="text"
              className="chat-input-field"
              placeholder={isListening ? "Listening to your voice..." : "Ask anything about Gram Tarang courses..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
            />

            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className="icon-btn"
              title={isListening ? "Stop Listening" : "Voice Input"}
              style={isListening ? { color: '#EF4444', background: 'rgba(239, 68, 68, 0.15)' } : {}}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              type="submit"
              className="icon-btn primary"
              disabled={!input.trim() || isStreaming}
              title="Send Message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
