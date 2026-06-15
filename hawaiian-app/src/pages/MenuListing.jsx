import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMenuContext } from '../App';

export default function MenuListing() {
  const { menuCategories, loadingMenu: loading, menuError: error } = useMenuContext();

  if (loading && !error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--light-grey)', padding: '24px', textAlign: 'center' }}>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--light-grey)', padding: '40px', textAlign: 'center' }}>
        <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxWidth: '450px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📡</div>
          <h2 style={{ marginBottom: '12px', color: '#ef4444' }}>Connectivity Issue</h2>
          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
            {error}
            <br /><br />
            <strong>Fix 1:</strong> On your PC, allow "Python" or "Port 5000" through Windows Firewall.<br />
            <strong>Fix 2:</strong> Ensure you are using the same Wi-Fi network.
          </p>
          <button onClick={() => window.location.reload()} className="primary-btn" style={{ width: '100%' }}>Retry Connection</button>
        </div>
      </div>
    );
  }


  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px', background: 'var(--light-grey)' }} className="container">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="section-header text-center" style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Fresh <span className="text-gradient">Varieties</span></h1>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', color: '#666', maxWidth: '500px', marginInline: 'auto' }}>
            Select a category to explore our authentic tropical treats.
          </p>
        </div>


        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {menuCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                to={`/menu/${cat.id}`}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--white)',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  height: '100%'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-12px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden', background: '#eee' }}>
                  <img
                    src={cat.image}
                    alt={cat.label}
                    loading="lazy"
                    onLoad={(e) => e.target.classList.add('img-loaded')}
                    className="img-loading"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.9)', padding: '6px 16px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--charcoal)', backdropFilter: 'blur(4px)' }}>
                    {cat.items.length} Items
                  </div>
                </div>
                <div style={{ padding: '32px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--charcoal)', marginBottom: '8px' }}>{cat.label.replace(/^\d+\.\s*/, '')}</h3>
                  <p style={{ color: '#888', fontSize: '1rem', lineHeight: 1.5, marginBottom: '20px' }}>Explore the best {cat.label.replace(/^\d+\.\s*/, '')} varieties in town.</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--tropical-pink)', fontWeight: 700 }}>
                    View Details ➜
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
