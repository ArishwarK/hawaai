import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMenuContext } from '../App';

export default function CategoryMenu() {
  const { category } = useParams();
  const { menuCategories, loadingMenu: loading } = useMenuContext();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading menu items...</p>
      </div>
    );
  }

  const data = menuCategories.find(cat => cat.id === category) || { name: "Category Not Found", items: [], color: "#ccc" };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '128px', paddingBottom: '96px', background: 'var(--white)' }} className="container">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link 
          to="/menu" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '40px', 
            color: '#666', 
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '1rem',
            padding: '8px 16px',
            background: 'var(--light-grey)',
            borderRadius: '12px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--tropical-pink)'; e.currentTarget.style.transform = 'translateX(-4px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; e.currentTarget.style.transform = 'none'; }}
        >
          ← Back to All Categories
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '64px' }}>
          <div style={{ width: '12px', height: '60px', borderRadius: '6px', backgroundColor: data.color || '#ccc', boxShadow: `0 0 20px ${data.color}44` }}></div>
          <div>
            <h1 className="section-title" style={{ margin: 0, fontSize: '2.5rem' }}>{data.name.replace(/^\d+\.\s*/, '')}</h1>
            <p style={{ color: '#888', marginTop: '4px', fontSize: '1.1rem' }}>{data.items.length} delicious varieties to choose from</p>
          </div>
        </div>

        <div className="grid-2" style={{alignItems: 'stretch', gap: '24px'}}>
          {data.items.map((item, i) => (
            <motion.div key={i} className="item-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div style={{paddingRight: '16px'}}>
                <h3 className="item-name">{item.name}</h3>
                <p className="item-desc">{item.desc}</p>
              </div>
              <div className="item-price">{item.price}</div>
            </motion.div>
          ))}
        </div>
        
        {data.items.length === 0 && (
          <div style={{textAlign: 'center', padding: '64px', backgroundColor: 'var(--white)', borderRadius: '24px', color: '#888'}}>
            More items coming soon to this category!
          </div>
        )}
      </div>
    </div>
  );
}
