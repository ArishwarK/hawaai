import React, { useEffect } from 'react';

export default function ReviewsPage() {
  useEffect(() => {
    // Load Common Ninja script
    const script = document.createElement('script');
    script.src = "https://cdn.commoninja.com/sdk/latest/commonninja.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingTop: '120px', 
      paddingBottom: '80px', 
      background: 'var(--white)',
      color: 'var(--charcoal)'
    }}>
      <div className="container">
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '60px', 
          fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
          fontWeight: 800,
          color: 'var(--charcoal)'
        }}>
          What Our Customers Say <span style={{ color: 'var(--tropical-pink)' }}>❤️</span>
        </h1>

        <section id="reviews" style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '32px',
          padding: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
          marginBottom: '40px'
        }}>
          <div className="commonninja_component pid-4ff91ea4-3ae6-4fa5-b7d0-73da36500483"></div>
        </section>

        <div style={{ textAlign: 'center' }}>
          <a 
            href="https://www.google.com/search?q=Hawaii%27n+Delight+Coimbatore+Google+Reviews" 
            target="_blank" 
            rel="noreferrer"
            className="secondary-btn"
            style={{ 
              padding: '14px 32px', 
              fontSize: '1rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px',
              border: '1px solid #ddd'
            }}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px', height: '18px' }} />
            View All Live Reviews on Google
          </a>
        </div>
      </div>
    </div>
  );
}
