import { useState, useRef, useEffect } from 'react';
import api from '../../services/api';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! 👋 I\'m your Agriculture AI Assistant. Ask me anything about farming, crops, soil, weather, pest management, or market prices!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/intelligence/chatbot', { messages: newMessages });
      const reply = data.choices?.[0]?.message;
      if (reply) setMessages(prev => [...prev, reply]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error: Could not reach the AI. Please ensure your GROQ_API_KEY is set correctly in backend .env and restart the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat cleared! Ask me anything about agriculture. 🌾' }]);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="container mt-8 animate-fade-in" style={{ maxWidth: 900, margin: '2rem auto' }}>
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '80vh' }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(34,197,94,0.05))',
          borderBottom: '1px solid rgba(74,222,128,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4ade80, #22c55e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem'
            }}>🤖</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Agriculture AI ChatBot</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>
                Powered by GPT-3.5 • Ask anything about farming
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => window.print()} style={{
              background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)',
              color: '#93c5fd', padding: '0.35rem 0.8rem', borderRadius: 6,
              fontSize: '0.8rem', cursor: 'pointer'
            }}>🖨 Print</button>
            <button onClick={clearChat} style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', padding: '0.35rem 0.8rem', borderRadius: 6,
              fontSize: '0.8rem', cursor: 'pointer'
            }}>🗑 Clear</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              gap: '0.5rem',
              alignItems: 'flex-end'
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem'
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: '70%',
                padding: '0.75rem 1rem',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                  : 'rgba(255,255,255,0.08)',
                color: msg.role === 'user' ? '#1a2e1a' : '#fff',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                wordBreak: 'break-word',
                border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                position: 'relative'
              }}>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyText(msg.content)}
                    title="Copy"
                    style={{
                      position: 'absolute', top: 4, right: 4,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', padding: 2
                    }}
                  >📋</button>
                )}
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(96,165,250,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem'
                }}>👤</div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #4ade80, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
              <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '16px 16px 16px 4px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                <span style={{ animation: 'pulse 1s infinite' }}>⠋ Thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex', gap: '0.75rem'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask about crops, pests, soil, weather, market prices... (Enter to send)"
            style={{
              flex: 1, padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 10, color: '#fff', fontSize: '0.9rem',
              resize: 'none', outline: 'none', fontFamily: 'inherit',
              lineHeight: 1.4
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '0.75rem 1.25rem',
              background: loading || !input.trim() ? 'rgba(74,222,128,0.3)' : 'linear-gradient(135deg, #4ade80, #22c55e)',
              color: '#1a2e1a', border: 'none', borderRadius: 10,
              fontWeight: 700, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem', transition: 'all 0.2s', flexShrink: 0
            }}
          >
            {loading ? '⏳' : '🚀 Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

