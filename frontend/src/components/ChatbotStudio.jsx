import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Mic, MicOff, Volume2, VolumeX, Copy, Check, 
  Trash2, Download, BookOpen, ChevronDown, ChevronUp, Sparkles, 
  Database, ShieldCheck, HelpCircle, Layers, ArrowRight, Zap, RefreshCw
} from 'lucide-react';
import { sendChatMessage, streamChatMessage, getLiveBackendStats } from '../services/api';
import MarkdownRenderer from './MarkdownRenderer';

export default function ChatbotStudio({ setActiveTab, isEmbedded = false }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('gt_studio_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'studio-init',
        role: 'assistant',
        content: "### Welcome to the Gram Tarang AI Knowledge Studio! 🎓\n\nI am connected to the live **279-vector FAISS Knowledge Base** containing official Gram Tarang curricula, placement records, centre directories, and government scheme data.\n\n**Here are popular questions you can ask me right now:**\n• *\"Where are your 13 centres located and who are the contact persons?\"*\n• *\"Tell me about the Ashok Leyland Commercial Vehicle Technician course.\"*\n• *\"Are courses under PMKVY and DDU-GKY completely free with hostels?\"*\n• *\"What machines and skills are taught in the CNC Lathe and Milling trades?\"*\n• *\"What is the placement record, salary range, and which companies hire?\"*",
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [useStreaming, setUseStreaming] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedSourceId, setExpandedSourceId] = useState(null);
  const [backendStats, setBackendStats] = useState({
    online: true,
    totalVectors: 279,
    sourceDocuments: 13,
    model: 'all-MiniLM-L6-v2 (384d)'
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gt_studio_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Fetch live backend stats
  useEffect(() => {
    getLiveBackendStats().then(stats => {
      setBackendStats(stats);
    });
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
      } catch (e) {
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
    setIsLoading(true);

    const historyContext = newHistory.slice(-4).map(m => ({
      role: m.role,
      content: m.content
    }));

    // If streaming enabled
    if (useStreaming) {
      const botMsgId = `bot-${Date.now()}`;
      let accumulatedAnswer = '';

      const placeholderBotMsg = {
        id: botMsgId,
        role: 'assistant',
        content: '',
        sources: [],
        sourceType: 'rag',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, placeholderBotMsg]);
      setIsLoading(false);
      setIsStreaming(true);

      try {
        await streamChatMessage(
          text,
          historyContext,
          (chunk) => {
            accumulatedAnswer += chunk;
            setMessages(prev => prev.map(m => 
              m.id === botMsgId ? { ...m, content: accumulatedAnswer } : m
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
                content: accumulatedAnswer || "⚠️ I am currently having trouble processing your query. Please contact Gram Tarang directly at +91-674-2386827 or info@gramtarang.org.in."
              } : m
            ));
          }
        );
      } catch (streamErr) {
        setIsStreaming(false);
      }
      return;
    }

    // Standard Non-Streaming Path
    try {
      const res = await sendChatMessage(text, historyContext);

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        sources: res.sources || [],
        sourceType: res.source_type,
        latencyMs: res.latency_ms,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: "⚠️ I am unable to connect to the backend server. Please verify your connection or contact Gram Tarang directly at +91 94386 03040 / info@gramtarang.org.in.",
          sources: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'studio-init',
        role: 'assistant',
        content: "Chat history cleared. How can I assist you today with Gram Tarang vocational training, schemes, or placements?",
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    localStorage.removeItem('gt_studio_chat_history');
  };

  const exportChat = () => {
    const text = messages.map(m => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gramtarang-ai-chat-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const topics = [
    { label: "13 Training Centres", query: "Where are all your 13 centres located in Odisha, AP, Telangana, Jharkhand, and Assam?" },
    { label: "Ashok Leyland Joint Program", query: "Tell me about the Ashok Leyland Commercial Vehicle Technician residential course." },
    { label: "PMKVY & DDU-GKY Free Courses", query: "Are courses under PMKVY and DDU-GKY free of cost, and do you provide hostels?" },
    { label: "CNC Lathe & Milling Training", query: "What machines and skills are taught in the CNC Operator and Machinist courses?" },
    { label: "Placement Statistics (80%)", query: "What is your placement record, salary range, and which companies hire from Gram Tarang?" },
    { label: "6-Step Teaching Methodology", query: "Explain the 6-step teaching methodology used at Gram Tarang." },
    { label: "Differently Abled Training (CCD)", query: "Tell me about skills training for differently abled youth and the Café Coffee Day brewmaster story." }
  ];

  const followUpChips = [
    "How do I apply for admission?",
    "Are hostel facilities free of cost?",
    "What is the starting salary after placement?",
    "Show Gram Tarang contact numbers"
  ];

  return (
    <div className={isEmbedded ? "" : "container"} style={{ padding: isEmbedded ? '8px 0 32px 0' : '40px 24px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-gold" style={{ marginBottom: '10px' }}>
            <Sparkles size={13} /> {isEmbedded ? 'Admin AI Assistant Studio & Diagnostic Console' : 'Interactive RAG Knowledge Studio'}
          </div>
          <h1 style={{ fontSize: isEmbedded ? '2rem' : '2.4rem', marginBottom: '8px' }}>Gram Tarang AI Assistant Studio</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', maxWidth: '750px' }}>
            {isEmbedded 
              ? 'Admins can directly test prompt responses, inspect real-time FAISS vector retrieval & candidate citations, test audio speech, and benchmark AI generation quality.'
              : 'Instant semantic search across 279 verified knowledge vectors. Ask about admissions, course syllabus, government schemes, hostel lodging, and recruiter placements.'}
          </p>
        </div>

        {/* Live System Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(18, 30, 58, 0.75)',
          padding: '10px 16px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: backendStats.online ? '#10B981' : '#F59E0B',
            boxShadow: backendStats.online ? '0 0 10px #10B981' : 'none'
          }} />
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 600, color: '#F8FAFC' }}>
              {backendStats.online ? 'RAG Engine Online' : 'Connecting Engine...'}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.76rem' }}>
              {backendStats.totalVectors} Vectors • {backendStats.sourceDocuments} Docs
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 320px) 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Side: Stats & Suggested Topics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* RAG Knowledge Status Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={18} color="#38BDF8" />
                <h3 style={{ fontSize: '0.96rem', margin: 0 }}>Vector Knowledge Base</h3>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>Active</span>
            </div>

            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Indexed Vectors:</span>
                <strong style={{ color: '#F8FAFC' }}>{backendStats.totalVectors} Chunks</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Knowledge Docs:</span>
                <strong style={{ color: '#F8FAFC' }}>{backendStats.sourceDocuments} Files</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Embedding Model:</span>
                <strong style={{ color: '#38BDF8', fontSize: '0.78rem' }}>all-MiniLM-L6-v2</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• LLM Synthesis:</span>
                <strong style={{ color: '#F59E0B' }}>Gemini 2.5 Flash</strong>
              </div>
            </div>

            {/* Streaming Mode Toggle */}
            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color={useStreaming ? '#F59E0B' : 'var(--text-dim)'} />
                Live Word Streaming
              </span>
              <button
                type="button"
                onClick={() => setUseStreaming(!useStreaming)}
                style={{
                  background: useStreaming ? '#2563EB' : 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {useStreaming ? 'ENABLED' : 'OFF'}
              </button>
            </div>

            <button
              onClick={() => setActiveTab('docs')}
              className="btn-secondary"
              style={{ width: '100%', marginTop: '14px', fontSize: '0.82rem', padding: '8px 12px' }}
            >
              Manage / Upload Documents <ArrowRight size={14} />
            </button>
          </div>

          {/* Suggested Topics Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.96rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={16} color="#F59E0B" /> Frequently Asked Topics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {topics.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(t.query)}
                  style={{
                    textAlign: 'left',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    transition: 'all 0.16s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37, 99, 235, 0.18)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Utility actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={exportChat}
              className="btn-secondary"
              style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}
              title="Download conversation transcript"
            >
              <Download size={13} /> Export Chat
            </button>
            <button
              onClick={clearChat}
              className="btn-secondary"
              style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}
              title="Clear conversation"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>

        {/* Right Side: Chat Container */}
        <div className="glass-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '760px',
          overflow: 'hidden'
        }}>
          {/* Studio Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`msg-row ${isUser ? 'user' : 'bot'}`} style={{ maxWidth: '92%' }}>
                  <div className="msg-bubble" style={{ fontSize: '0.96rem' }}>
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
                            width: '8px',
                            height: '16px',
                            background: '#38BDF8',
                            marginLeft: '4px',
                            verticalAlign: 'middle',
                            animation: 'blink 0.8s infinite'
                          }} />
                        )}
                      </>
                    )}

                    {/* Sources Badge & Details */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                        <button
                          onClick={() => setExpandedSourceId(expandedSourceId === msg.id ? null : msg.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.76rem',
                            color: '#93C5FD',
                            background: 'rgba(59, 130, 246, 0.12)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid rgba(59, 130, 246, 0.25)'
                          }}
                        >
                          <BookOpen size={13} />
                          <span>Sources: {msg.sources.length} Grounded Passage{msg.sources.length > 1 ? 's' : ''}</span>
                          {expandedSourceId === msg.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {expandedSourceId === msg.id && (
                          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {msg.sources.map((src, i) => (
                              <div key={i} style={{
                                fontSize: '0.78rem',
                                background: 'rgba(11, 19, 43, 0.85)',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                borderLeft: '3px solid var(--primary-light)'
                              }}>
                                <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{src.document}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>
                                  Page {src.page} • Relevance: {Math.round(src.relevance_score * 100)}%
                                </div>
                                <div style={{ color: 'var(--text-dim)', fontSize: '0.74rem', marginTop: '4px', fontStyle: 'italic' }}>
                                  "{src.preview}"
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="msg-meta">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <>
                        {msg.latencyMs && <span>• {msg.latencyMs}ms response time</span>}
                        <button 
                          onClick={() => handleCopy(msg.id, msg.content)} 
                          title="Copy message"
                          style={{ color: 'var(--text-dim)', padding: '2px' }}
                        >
                          {copiedId === msg.id ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                        </button>
                        <button 
                          onClick={() => handleSpeak(msg.content)} 
                          title={isSpeaking ? "Stop read-aloud" : "Read aloud"}
                          style={{ color: isSpeaking ? '#EF4444' : 'var(--text-dim)', padding: '2px' }}
                        >
                          {isSpeaking ? <VolumeX size={13} color="#EF4444" /> : <Volume2 size={13} />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="msg-row bot">
                <div className="msg-bubble" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={18} className="spin-slow" color="#F59E0B" />
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                    Searching 279 FAISS vectors &amp; generating answer...
                  </span>
                </div>
              </div>
            )}

            {/* Dynamic Follow-up Action Chips */}
            {!isLoading && !isStreaming && messages.length > 1 && (
              <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {followUpChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip)}
                    style={{
                      background: 'rgba(37, 99, 235, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      color: '#93C5FD',
                      borderRadius: '16px',
                      padding: '4px 12px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37, 99, 235, 0.25)'; e.currentTarget.style.color = '#FFFFFF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)'; e.currentTarget.style.color = '#93C5FD'; }}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Studio Input Area */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '16px 24px',
              background: 'rgba(18, 30, 58, 0.95)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="chat-input-field"
              placeholder={isListening ? "Listening to your voice..." : "Ask any question about courses, hostels, schemes, or placements..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || isStreaming}
              style={{ fontSize: '0.96rem' }}
            />

            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className="icon-btn"
              title={isListening ? "Stop listening" : "Voice input"}
              style={isListening ? { color: '#EF4444', background: 'rgba(239, 68, 68, 0.15)' } : {}}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <button
              type="submit"
              className="icon-btn primary"
              disabled={!input.trim() || isLoading || isStreaming}
              title="Send message"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
