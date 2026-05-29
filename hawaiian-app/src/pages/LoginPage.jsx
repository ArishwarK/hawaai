import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../App';


export default function LoginPage() {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        navigate('/admin');
      } else {

        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FF6B6B 0%, #00C9E8 100%)',
      padding: '24px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(30px)',
          borderRadius: '48px',
          padding: '56px',
          boxShadow: '0 30px 70px rgba(0,0,0,0.12)',
          border: '1px solid rgba(255,255,255,0.4)',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '80px', width: 'auto' }} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#333', marginBottom: '8px' }}>Admin Access</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>Enter your password to manage the menu.</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#555', marginBottom: '8px', marginLeft: '4px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter the password"
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '16px',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                fontSize: '1rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                outline: 'none',
                transition: 'box-shadow 0.2s'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(255, 143, 171, 0.3)'}
              onBlur={(e) => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'}
              required
            />
          </div>

          {error && (
            <div style={{
              color: '#ff4d4d',
              fontSize: '0.9rem',
              marginBottom: '24px',
              padding: '12px',
              background: 'rgba(255, 77, 77, 0.1)',
              borderRadius: '12px',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              background: 'var(--tropical-pink)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(255, 143, 171, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 143, 171, 0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 143, 171, 0.3)'; }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
