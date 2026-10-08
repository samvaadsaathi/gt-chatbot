import React from 'react';
import { Phone, Mail, Award, CheckCircle2, FileText } from 'lucide-react';

/**
 * Enterprise Markdown & Rich Content Renderer
 * Zero-dependency parser for headings, tables, bullet points, bold/italic,
 * code blocks, blockquotes, phone numbers, and email badges.
 */
export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Split into block tokens (paragraphs, tables, lists, headers, dividers)
  const blocks = parseBlocks(content);

  return (
    <div className="gt-markdown-container" style={{ lineHeight: '1.7', fontSize: '0.96rem' }}>
      {blocks.map((block, idx) => (
        <RenderBlock key={idx} block={block} />
      ))}
    </div>
  );
}

function parseBlocks(text) {
  const lines = text.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Headings
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4) });
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3) });
      i++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', text: trimmed.slice(2) });
      i++;
      continue;
    }

    // 3. Dividers
    if (/^[-=_*]{3,}$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // 4. Blockquotes / Callout notes
    if (trimmed.startsWith('> ') || trimmed.startsWith('💡 ') || trimmed.startsWith('⚠️ ')) {
      blocks.push({ 
        type: 'callout', 
        text: trimmed.replace(/^>\s*/, '') 
      });
      i++;
      continue;
    }

    // 5. Tables (| col 1 | col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        blocks.push({ type: 'table', lines: tableLines });
        continue;
      }
    }

    // 6. Bullet / Numbered Lists
    if (/^([•\-*]|\d+\.)\s/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^([•\-*]|\d+\.)\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^([•\-*]|\d+\.)\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', items: listItems });
      continue;
    }

    // 7. Regular paragraph
    let paraLines = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('>') &&
      !/^([•\-*]|\d+\.)\s/.test(lines[i].trim()) &&
      !/^[-=_*]{3,}$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'p', text: paraLines.join('\n') });
  }

  return blocks;
}

function RenderBlock({ block }) {
  switch (block.type) {
    case 'h1':
      return (
        <h1 style={{ fontSize: '1.45rem', margin: '14px 0 8px', color: '#F8FAFC', fontWeight: 700 }}>
          {renderInline(block.text)}
        </h1>
      );
    case 'h2':
      return (
        <h2 style={{ fontSize: '1.25rem', margin: '14px 0 6px', color: '#60A5FA', fontWeight: 650 }}>
          {renderInline(block.text)}
        </h2>
      );
    case 'h3':
      return (
        <h3 style={{ fontSize: '1.08rem', margin: '12px 0 6px', color: '#93C5FD', fontWeight: 600 }}>
          {renderInline(block.text)}
        </h3>
      );
    case 'hr':
      return (
        <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }} />
      );
    case 'callout':
      return (
        <div style={{
          background: 'rgba(37, 99, 235, 0.1)',
          borderLeft: '3px solid #3B82F6',
          borderRadius: '0 8px 8px 0',
          padding: '10px 14px',
          margin: '10px 0',
          fontSize: '0.92rem',
          color: '#E2E8F0'
        }}>
          {renderInline(block.text)}
        </div>
      );
    case 'list':
      return (
        <ul style={{ margin: '8px 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {block.items.map((item, idx) => (
            <li key={idx} style={{ color: '#F1F5F9' }}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    case 'table':
      return <RenderTable lines={block.lines} />;
    case 'p':
    default:
      return (
        <p style={{ margin: '8px 0', whiteSpace: 'pre-wrap', color: '#F8FAFC' }}>
          {renderInline(block.text)}
        </p>
      );
  }
}

function RenderTable({ lines }) {
  if (lines.length < 2) return null;

  const headerCells = lines[0].split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
  const bodyRows = lines.slice(2).map(row => 
    row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
  );

  return (
    <div style={{ overflowX: 'auto', margin: '14px 0', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.86rem',
        textAlign: 'left',
        background: 'rgba(15, 23, 42, 0.75)'
      }}>
        <thead>
          <tr style={{ background: 'rgba(30, 58, 138, 0.45)', borderBottom: '2px solid rgba(59, 130, 246, 0.3)' }}>
            {headerCells.map((head, i) => (
              <th key={i} style={{ padding: '10px 12px', fontWeight: 600, color: '#93C5FD' }}>
                {renderInline(head)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rIdx) => (
            <tr 
              key={rIdx} 
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'
              }}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} style={{ padding: '9px 12px', color: '#E2E8F0' }}>
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Render inline tokens: Bold (**text**), Italic (*text*), Code (`code`),
 * Phone numbers (+91-...), and Emails (info@...)
 */
function renderInline(text) {
  if (!text) return '';

  // Tokenize string with regex
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\+91[- ]?[0-9]{3,5}[- ]?[0-9]{4,6}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} style={{ color: '#FFFFFF', fontWeight: 700 }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} style={{ color: '#CBD5E1', fontStyle: 'italic' }}>
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} style={{
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.85em',
          color: '#38BDF8'
        }}>
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('+91')) {
      parts.push(
        <a 
          key={match.index} 
          href={`tel:${token.replace(/[^0-9+]/g, '')}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: '#34D399',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: '3px'
          }}
          title="Click to call Gram Tarang Helpline"
        >
          <Phone size={12} /> {token}
        </a>
      );
    } else if (token.includes('@')) {
      parts.push(
        <a 
          key={match.index} 
          href={`mailto:${token}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: '#38BDF8',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: '3px'
          }}
          title="Click to email Gram Tarang"
        >
          <Mail size={12} /> {token}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
