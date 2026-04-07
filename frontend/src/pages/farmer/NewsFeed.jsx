import { useState, useEffect } from 'react';
import api from '../../services/api';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80';

const NewsCard = ({ article, index }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animationDelay: `${index * 0.05}s`,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: 'rgba(74,222,128,0.05)' }}>
        <img
          src={(!imgError && article.urlToImage) ? article.urlToImage : PLACEHOLDER_IMG}
          alt={article.title}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Date badge */}
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
          padding: '0.2rem 0.6rem', borderRadius: 20,
          fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)'
        }}>
          📅 {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
        <h4 style={{
          margin: 0, fontSize: '0.9rem', lineHeight: 1.45, fontWeight: 600,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {article.title}
        </h4>

        {article.description && (
          <p style={{
            margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {article.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
            ✍️ {article.author || 'AgriNews'}
          </span>
          {article.url && article.url !== '#' ? (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.75rem', fontWeight: 600,
                padding: '0.3rem 0.75rem',
                background: 'rgba(74,222,128,0.15)',
                border: '1px solid rgba(74,222,128,0.3)',
                color: '#4ade80', borderRadius: 20,
                textDecoration: 'none', flexShrink: 0,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.15)'; }}
            >
              Read More →
            </a>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>Preview only</span>
          )}
        </div>
      </div>
    </div>
  );
};

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await api.get('/intelligence/news');
        setArticles(data.articles || []);
      } catch (err) {
        setError('Could not load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filtered = articles.filter(a =>
    !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-8 animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          📰 Agriculture News Feed
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          Latest farming news, government schemes & market updates
        </p>

        {/* Search bar */}
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            className="form-control"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Stats bar */}
      {!loading && !error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '0.75rem 1.25rem', marginBottom: '1.5rem',
          background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)',
          borderRadius: 10, fontSize: '0.85rem'
        }}>
          <span style={{ color: '#4ade80', fontWeight: 600 }}>📡 Live Feed</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>{filtered.length} of {articles.length} articles</span>
          {search && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>— filtered by "{search}"</span>}
        </div>
      )}

      {/* States */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 10, padding: '1rem 1.25rem', color: '#fca5a5', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="page-loading"><div className="spinner"></div><p>Loading news...</p></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>No articles found{search ? ` for "${search}"` : ''}.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {filtered.map((article, i) => (
            <NewsCard key={i} article={article} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
