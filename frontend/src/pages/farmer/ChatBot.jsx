import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../../services/api';

/* ─── Styles injected once ─────────────────────────────────────────────────── */
const VOICE_STYLES = `
@keyframes micPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
  50%       { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
}
@keyframes speakPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
.mic-btn-active { animation: micPulse 1s infinite; }
.speak-anim    { animation: speakPulse 0.8s infinite; }
`;

const injectStyles = (() => {
  let injected = false;
  return () => {
    if (injected) return;
    const el = document.createElement('style');
    el.textContent = VOICE_STYLES;
    document.head.appendChild(el);
    injected = true;
  };
})();

/* ─── Speech helpers ────────────────────────────────────────────────────────── */
const getSpeechRecognition = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return SR ? new SR() : null;
};

const speak = (text, onStart, onEnd) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  // Prefer a natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => /natural|google/i.test(v.name) && v.lang.startsWith('en'));
  if (preferred) utterance.voice = preferred;
  if (onStart) utterance.onstart = onStart;
  if (onEnd)   utterance.onend  = onEnd;
  window.speechSynthesis.speak(utterance);
};

/* ─── ChatBot Component ─────────────────────────────────────────────────────── */
const ChatBot = () => {
  injectStyles();

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! 👋 I\'m your Agriculture AI Assistant. Ask me anything about farming, crops, soil, weather, pest management, or market prices!' }
  ]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [voiceSupport, setVoiceSupport] = useState({ stt: false, tts: false });

  const chatEndRef  = useRef(null);
  const recognitionRef = useRef(null);

  /* detect browser support */
  useEffect(() => {
    setVoiceSupport({
      stt: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      tts: !!window.speechSynthesis,
    });
    // Pre-load voices
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* ── Text-to-Speech helpers ─────────────────────────────────────────────── */
  const speakMessage = useCallback((text, idx) => {
    if (!voiceSupport.tts) return;
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    setSpeakingIdx(idx);
    speak(
      text,
      () => setSpeakingIdx(idx),
      () => setSpeakingIdx(null)
    );
  }, [speakingIdx, voiceSupport.tts]);

  /* ── Speech-to-Text ─────────────────────────────────────────────────────── */
  const toggleListening = () => {
    if (!voiceSupport.stt) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = getSpeechRecognition();
    if (!rec) return;
    rec.lang = 'en-IN';
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    rec.onerror = () => { setIsListening(false); };
    rec.onend   = () => { setIsListening(false); };

    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  /* ── Send message ───────────────────────────────────────────────────────── */
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Stop mic if still listening
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
    // Stop any ongoing speech
    window.speechSynthesis?.cancel();
    setSpeakingIdx(null);

    const userMsg   = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/intelligence/chatbot', { messages: newMessages });
      const reply = data.choices?.[0]?.message;
      if (reply) {
        const replyIdx = newMessages.length; // index of the new assistant msg
        setMessages(prev => {
          const updated = [...prev, reply];
          if (autoSpeak && voiceSupport.tts) {
            speak(
              reply.content,
              () => setSpeakingIdx(replyIdx),
              () => setSpeakingIdx(null)
            );
          }
          return updated;
        });
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Error: Could not reach the AI. Please ensure your GROQ_API_KEY is set correctly in backend .env and restart the server.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel(); setSpeakingIdx(null);
    setMessages([{ role: 'assistant', content: 'Chat cleared! Ask me anything about agriculture. 🌾' }]);
  };

  const copyText = (text) => navigator.clipboard.writeText(text).catch(() => {});

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="container mt-8 animate-fade-in" style={{ maxWidth: 900, margin: '2rem auto' }}>
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '80vh' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
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
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
            }}>🤖</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Agriculture AI ChatBot</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>
                Powered by Groq • Ask anything about farming
                {voiceSupport.stt && <span style={{ marginLeft: 6, color: '#4ade80' }}>• 🎤 Voice Ready</span>}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Auto-Speak Toggle */}
            {voiceSupport.tts && (
              <button
                onClick={() => { setAutoSpeak(p => !p); window.speechSynthesis?.cancel(); setSpeakingIdx(null); }}
                title={autoSpeak ? 'Auto-Speak ON — click to disable' : 'Auto-Speak OFF — click to enable'}
                style={{
                  background: autoSpeak ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${autoSpeak ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.15)'}`,
                  color: autoSpeak ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                  padding: '0.35rem 0.8rem', borderRadius: 6,
                  fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.3rem'
                }}
              >
                {autoSpeak ? '🔊 Auto-Speak ON' : '🔇 Auto-Speak'}
              </button>
            )}
            <button onClick={() => window.print()} style={{
              background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)',
              color: '#93c5fd', padding: '0.35rem 0.8rem', borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer'
            }}>🖨 Print</button>
            <button onClick={clearChat} style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', padding: '0.35rem 0.8rem', borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer'
            }}>🗑 Clear</button>
          </div>
        </div>

        {/* ── Messages ───────────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              gap: '0.5rem', alignItems: 'flex-end'
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem'
                }}>🤖</div>
              )}

              <div style={{
                maxWidth: '70%', padding: '0.75rem 1rem',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                  : 'rgba(255,255,255,0.08)',
                color: msg.role === 'user' ? '#1a2e1a' : '#fff',
                fontSize: '0.9rem', lineHeight: 1.5, wordBreak: 'break-word',
                border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                position: 'relative'
              }}>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>

                {/* Action buttons for assistant messages */}
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '0.4rem', justifyContent: 'flex-end' }}>
                    {/* Copy */}
                    <button
                      onClick={() => copyText(msg.content)}
                      title="Copy"
                      style={{
                        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                        cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem',
                        padding: '2px 6px', borderRadius: 4, transition: 'all 0.15s'
                      }}
                    >📋</button>
                    {/* Speak / Stop */}
                    {voiceSupport.tts && (
                      <button
                        onClick={() => speakMessage(msg.content, idx)}
                        title={speakingIdx === idx ? 'Stop speaking' : 'Read aloud'}
                        className={speakingIdx === idx ? 'speak-anim' : ''}
                        style={{
                          background: speakingIdx === idx ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.08)',
                          border: `1px solid ${speakingIdx === idx ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.12)'}`,
                          cursor: 'pointer', color: speakingIdx === idx ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                          fontSize: '0.72rem', padding: '2px 6px', borderRadius: 4, transition: 'all 0.15s'
                        }}
                      >{speakingIdx === idx ? '⏹ Stop' : '🔊'}</button>
                    )}
                  </div>
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

        {/* ── Input Area ─────────────────────────────────────────────────── */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex', gap: '0.75rem', alignItems: 'flex-end'
        }}>
          {/* Mic button */}
          {voiceSupport.stt && (
            <button
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              className={isListening ? 'mic-btn-active' : ''}
              style={{
                width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                background: isListening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)',
                border: `2px solid ${isListening ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                color: isListening ? '#ef4444' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer', fontSize: '1.1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              {isListening ? '⏹' : '🎤'}
            </button>
          )}

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={isListening ? '🎤 Listening... speak now' : 'Ask about crops, pests, soil, weather... (Enter to send)'}
            style={{
              flex: 1, padding: '0.75rem 1rem',
              background: isListening ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${isListening ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 10, color: '#fff', fontSize: '0.9rem',
              resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
              transition: 'all 0.2s'
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '0.75rem 1.25rem',
              background: (loading || !input.trim()) ? 'rgba(74,222,128,0.3)' : 'linear-gradient(135deg, #4ade80, #22c55e)',
              color: '#1a2e1a', border: 'none', borderRadius: 10,
              fontWeight: 700, cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem', transition: 'all 0.2s', flexShrink: 0, height: 42
            }}
          >
            {loading ? '⏳' : '🚀 Send'}
          </button>
        </div>

        {/* ── Voice status banner ─────────────────────────────────────────── */}
        {isListening && (
          <div style={{
            padding: '0.4rem 1.5rem',
            background: 'rgba(239,68,68,0.1)',
            borderTop: '1px solid rgba(239,68,68,0.2)',
            color: '#fca5a5', fontSize: '0.78rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <span className="speak-anim">🔴</span>
            Listening… speak clearly, then click ⏹ or press Enter to send.
          </div>
        )}
        {!voiceSupport.stt && (
          <div style={{
            padding: '0.35rem 1.5rem',
            background: 'rgba(251,191,36,0.08)',
            borderTop: '1px solid rgba(251,191,36,0.15)',
            color: 'rgba(251,191,36,0.7)', fontSize: '0.75rem'
          }}>
            ⚠️ Your browser doesn't support voice input. Please use Chrome or Edge for full voice features.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
