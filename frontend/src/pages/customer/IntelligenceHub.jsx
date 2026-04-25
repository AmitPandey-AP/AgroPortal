import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api, { BACKEND_URL } from '../../services/api';

/* ─── Voice styles (injected once) ─────────────────────────────────────────── */
const VOICE_STYLES_HUB = `
@keyframes micPulseHub {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
  50%       { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
}
@keyframes speakPulseHub {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}
.mic-pulse-hub  { animation: micPulseHub  1s infinite; }
.speak-hub      { animation: speakPulseHub 0.8s infinite; }
`;
let _hubStylesInjected = false;
const injectHubStyles = () => {
  if (_hubStylesInjected) return;
  const el = document.createElement('style');
  el.textContent = VOICE_STYLES_HUB;
  document.head.appendChild(el);
  _hubStylesInjected = true;
};

/* ─── Voice helpers ─────────────────────────────────────────────────────────── */
const getSR = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return SR ? new SR() : null;
};
const speakText = (text, onStart, onEnd) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-IN'; u.rate = 0.95; u.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const pref = voices.find(v => /natural|google/i.test(v.name) && v.lang.startsWith('en'));
  if (pref) u.voice = pref;
  if (onStart) u.onstart = onStart;
  if (onEnd)   u.onend   = onEnd;
  window.speechSynthesis.speak(u);
};

// ─── Weather Widget ───────────────────────────────────────────────────────────
const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Mumbai');
  const [input, setInput] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (c) => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get(`/intelligence/weather?city=${encodeURIComponent(c)}`);
      setWeather(data);
    } catch {
      setError('City not found or weather service unavailable.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchWeather(city); }, []);

  // Backend returns { city, list: [{dt_txt, main:{temp_max,temp_min,humidity}, weather:[{main,description}], wind:{speed}}] }
  const current = weather?.list?.[0];
  const wMain   = current?.weather?.[0]?.main || '';
  const icon    = wMain === 'Rain' ? '🌧' : wMain === 'Clear' ? '☀️' : wMain === 'Clouds' ? '☁️' : wMain === 'Thunderstorm' ? '⚡' : wMain === 'Snow' ? '❄️' : '🌡';

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>🌤 Live Weather</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          className="form-control" value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter city..."
          onKeyDown={e => { if (e.key === 'Enter') { setCity(input); fetchWeather(input); } }}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
          onClick={() => { setCity(input); fetchWeather(input); }}>Search</button>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '1.5rem', color: 'rgba(255,255,255,0.4)' }}>Loading weather...</div>}
      {error && <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>⚠️ {error}</div>}

      {weather && current && !loading && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>{icon}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#60a5fa' }}>
              {Math.round(current.main?.temp_max ?? current.main?.temp ?? 0)}°C
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
              {current.weather?.[0]?.description} — <strong style={{ color: '#fff' }}>{weather.city}</strong>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
            {[
              { label: 'Humidity',  value: `${current.main?.humidity}%`,              icon: '💧' },
              { label: 'Wind',      value: `${current.wind?.speed} m/s`,              icon: '💨' },
              { label: 'Min Temp',  value: `${Math.round(current.main?.temp_min ?? 0)}°C`, icon: '🌡' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem' }}>{s.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Next 3 forecasts */}
          {weather.list?.length > 1 && (
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {weather.list.slice(1, 4).map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>
                    {new Date(item.dt_txt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{Math.round(item.main?.temp_max ?? 0)}°C</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{item.weather?.[0]?.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Mini Chatbot ─────────────────────────────────────────────────────────────
const MiniChat = () => {
  injectHubStyles();

  const [messages, setMessages]     = useState([
    { role: 'assistant', text: "👋 Hi! I'm AgroBot. Ask me anything about crops, farming, or market prices!" }
  ]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [voiceSupport, setVoiceSupport] = useState({ stt: false, tts: false });

  const bottomRef      = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setVoiceSupport({
      stt: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      tts: !!window.speechSynthesis,
    });
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  /* ── STT ─────────────────────────────────────────────────────────────────── */
  const toggleListening = () => {
    if (!voiceSupport.stt) return;
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const rec = getSR();
    if (!rec) return;
    rec.lang = 'en-IN'; rec.interimResults = true; rec.continuous = false;
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      setInput(transcript);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend   = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  /* ── TTS ─────────────────────────────────────────────────────────────────── */
  const speakMsg = useCallback((text, idx) => {
    if (!voiceSupport.tts) return;
    if (speakingIdx === idx) { window.speechSynthesis.cancel(); setSpeakingIdx(null); return; }
    setSpeakingIdx(idx);
    speakText(text, () => setSpeakingIdx(idx), () => setSpeakingIdx(null));
  }, [speakingIdx, voiceSupport.tts]);

  /* ── Send ─────────────────────────────────────────────────────────────────── */
  const send = async () => {
    if (!input.trim() || loading) return;
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
    window.speechSynthesis?.cancel(); setSpeakingIdx(null);

    const userMsg = input.trim();
    setInput('');
    const newHistory = [...chatHistory, { role: 'user', content: userMsg }];
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatHistory(newHistory);
    setLoading(true);
    try {
      const { data } = await api.post('/intelligence/chatbot', { messages: newHistory });
      const reply = data.choices?.[0]?.message?.content || 'No response received.';
      setMessages(prev => {
        const updated = [...prev, { role: 'assistant', text: reply }];
        return updated;
      });
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const errMsg = '⚠️ ' + (err.response?.data?.message || 'Could not reach AI. Check GROQ_API_KEY.');
      setMessages(prev => [...prev, { role: 'assistant', text: errMsg }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 420 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexShrink: 0 }}>
        <h3 style={{ margin: 0 }}>🤖 AgroBot — Ask Anything</h3>
        {voiceSupport.stt && (
          <span style={{ fontSize: '0.72rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            🎤 Voice Ready
          </span>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.75rem', paddingRight: '0.25rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '88%',
          }}>
            <div style={{
              background: m.role === 'user' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${m.role === 'user' ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              padding: '0.5rem 0.85rem', fontSize: '0.85rem', lineHeight: 1.5
            }}>{m.text}</div>

            {/* Speak button for assistant messages */}
            {m.role === 'assistant' && voiceSupport.tts && (
              <button
                onClick={() => speakMsg(m.text, i)}
                title={speakingIdx === i ? 'Stop' : 'Read aloud'}
                className={speakingIdx === i ? 'speak-hub' : ''}
                style={{
                  marginTop: '3px', background: 'none', border: 'none',
                  cursor: 'pointer', color: speakingIdx === i ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                  fontSize: '0.72rem', padding: '1px 4px', transition: 'color 0.15s'
                }}
              >{speakingIdx === i ? '⏹ Stop' : '🔊 Read'}</button>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
            AgroBot is thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }}>
        {/* Mic Button */}
        {voiceSupport.stt && (
          <button
            onClick={toggleListening}
            title={isListening ? 'Stop listening' : 'Speak your question'}
            className={isListening ? 'mic-pulse-hub' : ''}
            style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: isListening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)',
              border: `2px solid ${isListening ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
              color: isListening ? '#ef4444' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            {isListening ? '⏹' : '🎤'}
          </button>
        )}

        <input
          className="form-control"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={isListening ? '🎤 Listening… speak now' : 'Ask about crops, seasons, pests...'}
          style={{
            flex: 1,
            background: isListening ? 'rgba(239,68,68,0.07)' : undefined,
            borderColor: isListening ? 'rgba(239,68,68,0.4)' : undefined,
            transition: 'all 0.2s'
          }}
        />
        <button
          className="btn btn-primary"
          style={{ padding: '0.5rem 1rem', flexShrink: 0 }}
          onClick={send}
          disabled={loading}
        >Send</button>
      </div>

      {/* Listening banner */}
      {isListening && (
        <div style={{
          marginTop: '0.5rem', padding: '0.3rem 0.6rem', borderRadius: 6,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#fca5a5', fontSize: '0.75rem',
          display: 'flex', alignItems: 'center', gap: '0.4rem'
        }}>
          <span className="speak-hub">🔴</span> Listening… speak clearly, then press Enter or click Send.
        </div>
      )}
    </div>
  );
};

// ─── News Snippet ─────────────────────────────────────────────────────────────
const NewsSnippet = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/intelligence/news')
      .then(r => setArticles((r.data.articles || []).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>📰 Latest Agri News</h3>
        <Link to="/farmer/tools/news" style={{ fontSize: '0.8rem', color: '#4ade80', textDecoration: 'none' }}>View All →</Link>
      </div>
      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>Loading news...</div>
      ) : articles.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>News unavailable. Check your NEWS_API_KEY.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {articles.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', gap: '0.75rem', textDecoration: 'none', padding: '0.6rem', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              {a.urlToImage && <img src={a.urlToImage} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} onError={e => e.currentTarget.style.display = 'none'} />}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', marginBottom: '0.2rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{a.source?.name || 'AgriNews'}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Seasonal Crops ───────────────────────────────────────────────────────────
const SEASON_DATA = {
  Kharif: {
    months: [5, 6, 7, 8, 9, 10], // June–November (0-indexed)
    label: 'Kharif Season',
    period: 'June – November',
    desc: 'Monsoon crops sown in June–July, harvested October–November. High demand now.',
    color: '#34d399',
    bgColor: 'rgba(52,211,153,0.08)',
    borderColor: 'rgba(52,211,153,0.25)',
    icon: '🌧',
    crops: [
      { name: 'Rice',         icon: '🍚', tip: 'Staple crop, peak harvest Oct–Nov' },
      { name: 'Maize',        icon: '🌽', tip: 'High demand in Oct' },
      { name: 'Cotton',       icon: '🌿', tip: 'Raw cotton available Sep–Nov' },
      { name: 'Groundnut',    icon: '🥜', tip: 'Oil crop, harvest Oct' },
      { name: 'Soyabean',     icon: '🫘', tip: 'Protein-rich, good ROI' },
      { name: 'Jowar',        icon: '🌾', tip: 'Drought-resistant millet' },
      { name: 'Bajra',        icon: '🌾', tip: 'Pearl millet, nutritious' },
      { name: 'Ragi',         icon: '🌾', tip: 'Calcium-rich finger millet' },
      { name: 'Sugarcane',    icon: '🎋', tip: 'Year-round but peak Oct–Nov' },
      { name: 'Turmeric',     icon: '🟡', tip: 'High demand, good margins' },
      { name: 'Moong Dal',    icon: '🫘', tip: 'Green gram, fast growing' },
      { name: 'Urad Dal',     icon: '🫘', tip: 'Black gram, high value' },
    ]
  },
  Rabi: {
    months: [10, 11, 0, 1, 2, 3], // November–April
    label: 'Rabi Season',
    period: 'November – April',
    desc: 'Winter crops sown in Oct–Nov, harvested March–April. Cold-weather produce available.',
    color: '#60a5fa',
    bgColor: 'rgba(96,165,250,0.08)',
    borderColor: 'rgba(96,165,250,0.25)',
    icon: '❄️',
    crops: [
      { name: 'Wheat',        icon: '🌾', tip: 'India\'s most-traded grain, peak Mar–Apr' },
      { name: 'Gram / Chana', icon: '🫘', tip: 'Chickpea, highest Rabi pulse' },
      { name: 'Mustard',      icon: '🌼', tip: 'Oilseed, peak Feb–Mar' },
      { name: 'Barley',       icon: '🌾', tip: 'Used in food & brewing' },
      { name: 'Linseed',      icon: '🌿', tip: 'Omega-rich oilseed' },
      { name: 'Peas',         icon: '🫛', tip: 'Fresh peas Jan–Mar' },
      { name: 'Potato',       icon: '🥔', tip: 'Major vegetable, Jan–Mar' },
      { name: 'Onion',        icon: '🧅', tip: 'High-demand Jan–March' },
      { name: 'Tomato',       icon: '🍅', tip: 'Winter tomatoes, good quality' },
      { name: 'Sunflower',    icon: '🌻', tip: 'Rabi oilseed in South India' },
      { name: 'Safflower',    icon: '🌸', tip: 'Industrial oilseed' },
      { name: 'Coriander',    icon: '🌿', tip: 'Spice, peak Feb–Mar' },
    ]
  },
  Zaid: {
    months: [3, 4], // April–May (transition)
    label: 'Zaid / Summer Season',
    period: 'April – June',
    desc: 'Short summer crops between Rabi & Kharif. Vegetables and fruits peak now.',
    color: '#fbbf24',
    bgColor: 'rgba(251,191,36,0.08)',
    borderColor: 'rgba(251,191,36,0.25)',
    icon: '☀️',
    crops: [
      { name: 'Watermelon',   icon: '🍉', tip: 'Peak summer fruit, May–Jun' },
      { name: 'Muskmelon',    icon: '🍈', tip: 'Cooling summer melon' },
      { name: 'Cucumber',     icon: '🥒', tip: 'High demand in summer' },
      { name: 'Bitter Gourd', icon: '🥬', tip: 'Medicinal vegetable' },
      { name: 'Moong Dal',    icon: '🫘', tip: 'Short-duration summer pulse' },
      { name: 'Pumpkin',      icon: '🎃', tip: 'Good summer storage vegetable' },
      { name: 'Cowpea',       icon: '🫘', tip: 'Heat-tolerant legume' },
      { name: 'Cluster Bean', icon: '🌿', tip: 'Guar, industrial + food use' },
    ]
  }
};

const getCurrentSeason = () => {
  const month = new Date().getMonth(); // 0-indexed
  for (const [key, s] of Object.entries(SEASON_DATA)) {
    if (s.months.includes(month)) return { key, ...s };
  }
  return { key: 'Kharif', ...SEASON_DATA.Kharif }; // fallback
};

const SeasonalCrops = () => {
  const season = getCurrentSeason();
  const monthName = new Date().toLocaleString('en-IN', { month: 'long' });

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{season.icon}</span>
            <h3 style={{ margin: 0 }}>🏷️ Seasonal Crops in India</h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{season.desc}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: 20,
            background: season.bgColor, border: `1px solid ${season.borderColor}`,
            color: season.color, fontWeight: 700, fontSize: '0.8rem'
          }}>{season.icon} {season.label}</div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem' }}>
            {monthName} · {season.period}
          </div>
        </div>
      </div>

      {/* Crop chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {season.crops.map(crop => (
          <Link
            key={crop.name}
            to={`/marketplace?keyword=${encodeURIComponent(crop.name)}`}
            title={crop.tip}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.35rem 0.85rem', borderRadius: 20,
              background: season.bgColor, border: `1px solid ${season.borderColor}`,
              color: '#fff', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
              transition: 'all 0.18s', cursor: 'pointer'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = season.borderColor; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = season.bgColor;    e.currentTarget.style.transform = ''; }}
          >
            <span>{crop.icon}</span>
            {crop.name}
          </Link>
        ))}
      </div>

      {/* Tip row */}
      <div style={{ marginTop: '1rem', padding: '0.6rem 0.9rem', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
        💡 <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Buying tip:</strong> Click any crop to find available listings in the marketplace. Hover a chip to see buying insight.
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const IntelligenceHub = () => (
  <div className="container mt-8 animate-fade-in" style={{ paddingBottom: '3rem' }}>
    <h1 style={{ marginBottom: '0.25rem' }}>🧠 AI Intelligence Hub</h1>
    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
      Your smart farming companion — live weather, AI chatbot, and latest agriculture news.
    </p>

    {/* Quick links */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
      {[
        { to: '/marketplace', icon: '🛒', label: 'Buy Crops' },
        { to: '/customer/stocks', icon: '📦', label: 'View Stocks' },
        { to: '/cart', icon: '🛍️', label: 'My Cart' },
        { to: '/contact', icon: '📩', label: 'Contact Us' },
      ].map(link => (
        <Link key={link.to} to={link.to} style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.75rem 1rem', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
          transition: 'all 0.2s'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.1)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
          <span style={{ fontSize: '1.2rem' }}>{link.icon}</span> {link.label}
        </Link>
      ))}
    </div>

    {/* Seasonal crops — full width above the grid */}
    <SeasonalCrops />

    {/* Main grid */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <WeatherWidget />
      <MiniChat />
    </div>

    <div style={{ marginTop: '1.5rem' }}>
      <NewsSnippet />
    </div>
  </div>
);

export default IntelligenceHub;
