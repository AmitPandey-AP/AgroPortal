import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';

const WeatherForecast = () => {
  const { user } = useSelector(state => state.auth);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [error, setError] = useState('');

  const weatherIcons = {
    'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
    'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Haze': '🌫️',
    'Fog': '🌫️',
  };

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/intelligence/weather?city=${encodeURIComponent(cityName)}`);
      setForecast(data);
      setCity(data.city || cityName);
    } catch (err) {
      setError('Could not fetch weather data. Please try another city.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userCity = user?.district || user?.city || 'Mysore';
    setSearchCity(userCity);
    fetchWeather(userCity);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) fetchWeather(searchCity.trim());
  };

  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>🌤 Weather Forecast</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
          5-day weather forecast for your farming location
        </p>

        {/* Search Bar */}
        <form onSubmit={onSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <input
            type="text"
            className="form-control"
            value={searchCity}
            onChange={e => setSearchCity(e.target.value)}
            placeholder="Enter city or district name..."
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            🔍 Search
          </button>
        </form>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 8, padding: '1rem', marginBottom: '1rem', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="page-loading"><div className="spinner"></div><p>Fetching weather data...</p></div>
        ) : forecast && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(59,130,246,0.1))',
              border: '1px solid rgba(96,165,250,0.3)',
              borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem'
            }}>
              <span style={{ fontSize: '2.5rem' }}>📍</span>
              <div>
                <h2 style={{ margin: 0 }}>{city}</h2>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                  Showing 5-day forecast • {forecast.list?.length} data points
                </p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(74,222,128,0.1)', borderBottom: '1px solid rgba(74,222,128,0.2)' }}>
                      {['Date', 'Time', 'Condition', 'Temp Max / Min', 'Humidity', 'Wind Speed'].map(h => (
                        <th key={h} style={{ padding: '1rem', textAlign: 'center', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.list?.map((item, i) => {
                      const dtParts = item.dt_txt?.split(' ') || [];
                      const date = dtParts[0] || '-';
                      const time = dtParts[1]?.slice(0, 5) || '-';
                      const main = item.weather?.[0]?.main || 'Clear';
                      const icon = weatherIcons[main] || '🌡️';
                      const desc = item.weather?.[0]?.description || '-';

                      return (
                        <tr key={i} style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                          transition: 'background 0.2s'
                        }}>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 500 }}>{date}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>{time}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <span title={desc}>{icon} {main}</span>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{desc}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <span style={{ color: '#f87171', fontWeight: 600 }}>{item.main?.temp_max}°C</span>
                            {' / '}
                            <span style={{ color: '#60a5fa', fontWeight: 600 }}>{item.main?.temp_min}°C</span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <span style={{ color: '#4ade80' }}>{item.main?.humidity}%</span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                            {item.wind?.speed} km/h
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherForecast;

