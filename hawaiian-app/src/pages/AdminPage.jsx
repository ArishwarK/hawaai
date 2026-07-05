import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { useAuth, useMenuContext } from '../App';

const DraggableCategory = ({ catId, cat, setSelectedCategory, openEditCategory, deleteCategory }) => {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      value={catId} 
      style={{ position: 'relative' }} 
      dragListener={false} 
      dragControls={controls}
    >
      <div 
        className="admin-card" 
        style={{ marginBottom: 0, cursor: 'pointer', transition: 'box-shadow 0.2s', paddingBottom: '24px' }}
        onClick={(e) => {
          if (e.target.closest('button')) return;
          setSelectedCategory(catId);
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'}
        title="Click to manage items"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  style={{ cursor: 'grab', fontSize: '1.5rem', padding: '0 8px', color: '#bbb', display: 'flex', alignItems: 'center', touchAction: 'none' }} 
                  title="Drag to reorder" 
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    controls.start(e);
                  }}
                >
                  ☰
                </div>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: cat.color }}></div>
                <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 800, margin: 0 }}>{cat.label}</h2>
                <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                  <button onClick={() => openEditCategory(catId)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.5 }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.5} title="Edit Category">✏️</button>
                  <button onClick={() => deleteCategory(catId)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#ff4d4d', opacity: 0.5 }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.5} title="Delete Category">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};

const AboutImageItem = ({ imgObj, idx, aboutImages, setAboutImages, isUploadingImage, handleImageUpload }) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item 
      key={imgObj.id} 
      value={imgObj} 
      dragListener={false} 
      dragControls={dragControls}
      style={{ background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', overflow: 'hidden' }}
    >
      <div 
        onPointerDown={(e) => dragControls.start(e)} 
        style={{ cursor: 'grab', fontSize: '1.5rem', color: '#bbb', touchAction: 'none', userSelect: 'none', flexShrink: 0, padding: '4px' }} 
        title="Drag to reorder"
      >☰</div>
      {imgObj.url && <img src={imgObj.url} alt={`Preview ${idx}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Image {idx + 1}</label>
          <button 
            onClick={() => {
              const newImages = [...aboutImages];
              newImages.splice(idx, 1);
              setAboutImages(newImages);
            }}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#ff4d4d', opacity: 0.6, flexShrink: 0 }}
            onMouseEnter={(e) => e.target.style.opacity = 1}
            onMouseLeave={(e) => e.target.style.opacity = 0.6}
          >
            🗑️
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            value={imgObj.url}
            onChange={(e) => {
              const newImages = [...aboutImages];
              newImages[idx] = { ...newImages[idx], url: e.target.value };
              setAboutImages(newImages);
            }}
            placeholder="Paste image URL or upload →"
            style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid #eee', fontSize: '0.8rem', outline: 'none', background: '#fcfcfc', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--tropical-pink)'}
            onBlur={(e) => e.target.style.borderColor = '#eee'}
          />
          <label style={{ background: isUploadingImage ? '#f5f5f5' : '#e3f2fd', color: isUploadingImage ? '#888' : '#1976d2', padding: '8px 12px', borderRadius: '8px', cursor: isUploadingImage ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', opacity: isUploadingImage ? 0.7 : 1, flexShrink: 0 }}>
            <span>{isUploadingImage ? "⏳" : "📷"}</span>
            <input type="file" accept="image/*" disabled={isUploadingImage} style={{ display: 'none' }} onChange={(e) => {
              if (e.target.files[0]) {
                handleImageUpload(e.target.files[0]).then(url => {
                  if(url) {
                    const newImages = [...aboutImages];
                    newImages[idx] = { ...newImages[idx], url };
                    setAboutImages(newImages);
                  }
                });
              }
            }} />
          </label>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default function AdminPage() {
  const [menu, setMenu] = useState(null);
  const [reels, setReels] = useState([]);
  const [aboutImages, setAboutImages] = useState([]);
  const [vibeConfig, setVibeConfig] = useState({
    reviews_pid: '4ff91ea4-3ae6-4fa5-b7d0-73da36500483',
    best_sellers: ['Cookie Wave Bubble Tea', 'Classic Veg Sandwich', 'Volcano Veg/Crispy Chicken Burger', 'Volcano Fries', 'Brownie with Ice Cream'],
    offers: [
      { icon: '🍩', title: 'Mochi Donut 50% OFF', desc: 'Limited-time offer on all donuts!' },
      { icon: '🎉', title: 'Birthday Special', desc: 'Celebrate with exclusive treats on your birthday.' },
      { icon: '🍹', title: 'Combo Meals', desc: 'Enjoy your favorite tropical combos at special prices.' },
      { icon: '🎓', title: 'Student Discount - 10% OFF', desc: 'Get 10% OFF on your bill with a valid student ID.' }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCatData, setNewCatData] = useState({ name: '', image: '', color: '#FF6B6B' });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  // New Modal States
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editingCategoryData, setEditingCategoryData] = useState(null);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editingItemData, setEditingItemData] = useState(null); // { catId, index, name, price, desc }
  const [vibeActiveBlock, setVibeActiveBlock] = useState(null);
  const { token, logout: authLogout } = useAuth();
  const { refreshMenu } = useMenuContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const logout = () => {
    authLogout();
    navigate('/login');
  };



  const [errorDetails, setErrorDetails] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setErrorDetails(null);
    try {
      const [menuRes, reelsRes, aboutRes, vibeRes] = await Promise.all([
        fetch(`/api/menu?cb=${Date.now()}`),
        fetch('/api/reels'),
        fetch('/api/about-images'),
        fetch('/api/vibe')
      ]);

      
      if (!menuRes.ok) throw new Error("Failed to fetch menu");
      if (!reelsRes.ok) throw new Error("Failed to fetch reels");

      const menuData = await menuRes.json();
      const reelsData = await reelsRes.json();
      const aboutData = aboutRes.ok ? await aboutRes.json() : [];
      const vibeData = vibeRes.ok ? await vibeRes.json() : null;

      if (menuData) setMenu(menuData);
      if (reelsData) {
        setReels(reelsData);
      }
      if (aboutData) {
        setAboutImages(aboutData.map(url => ({ id: Math.random().toString(36).substr(2, 9), url })));
      }
      if (vibeData) {
        setVibeConfig(vibeData);
      }
    } catch (err) {
      console.error("Failed to fetch data from API", err);
      setErrorDetails(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
      };


      const menuRes = await fetch('/api/menu', {
        method: 'POST',
        headers,
        body: JSON.stringify(menu)
      });
      
      const reelsRes = await fetch('/api/reels', {
        method: 'POST',
        headers,
        body: JSON.stringify(reels.filter(id => id.trim() !== ""))
      });
      
      const aboutRes = await fetch('/api/about-images', {
        method: 'POST',
        headers,
        body: JSON.stringify(aboutImages.map(img => img.url).filter(url => url.trim() !== ""))
      });

      const vibeRes = await fetch('/api/vibe', {
        method: 'POST',
        headers,
        body: JSON.stringify(vibeConfig)
      });

      if (menuRes.ok && reelsRes.ok && aboutRes.ok && vibeRes.ok) {
        setMessage({ type: 'success', text: 'All changes saved to database!' });
        // Refetch the latest data to update UI
        await fetchData();
        await refreshMenu();

      } else {
        setMessage({ type: 'error', text: 'Failed to save changes.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const addCategory = () => {
    if (!newCatData.name) return;
    const catId = newCatData.name.toLowerCase().replace(/\s+/g, '-');
    const newMenu = { ...menu };
    newMenu[catId] = {
      id: catId,
      label: newCatData.name,
      name: newCatData.name,
      image: newCatData.image || 'https://images.unsplash.com/photo-1558857563-b37103ebced1?auto=format&fit=crop&q=80',
      color: newCatData.color,
      items: []
    };
    setMenu(newMenu);
    setNewCatData({ name: '', image: '', color: '#FF6B6B' });
    setShowAddCategory(false);
  };

  const deleteCategory = (catId) => {
    if (window.confirm(`Are you sure you want to delete the "${menu[catId].label}" category and all its items?`)) {
      const newMenu = { ...menu };
      delete newMenu[catId];
      setMenu(newMenu);
    }
  };

  const updateCategory = (catId, field, value) => {
    const newMenu = { ...menu };
    newMenu[catId][field] = value;
    if (field === 'label') newMenu[catId].name = value;
    setMenu(newMenu);
  };

  const updateItem = (catId, index, field, value) => {
    const newMenu = { ...menu };
    newMenu[catId].items[index][field] = value;
    setMenu(newMenu);
  };

  const deleteItem = (catId, index) => {
    const newMenu = { ...menu };
    newMenu[catId].items.splice(index, 1);
    setMenu(newMenu);
  };

  const openEditCategory = (catId) => {
    setEditingCategoryData({ ...menu[catId], originalId: catId });
    setShowEditCategory(true);
  };

  const saveCategoryEdit = () => {
    const { originalId, label, image, color } = editingCategoryData;
    const newMenu = { ...menu };
    newMenu[originalId] = { ...newMenu[originalId], label, name: label, image, color };
    setMenu(newMenu);
    setShowEditCategory(false);
  };

  const openEditItem = (catId, index) => {
    setEditingItemData({ catId, index, ...menu[catId].items[index] });
    setShowEditItem(true);
  };

  const saveItemEdit = () => {
    const { catId, index, name, price, desc } = editingItemData;
    const newMenu = { ...menu };
    newMenu[catId].items[index] = { name, price, desc };
    setMenu(newMenu);
    setShowEditItem(false);
  };

  const addItem = (catId) => {
    const newMenu = { ...menu };
    const newIdx = newMenu[catId].items.length;
    // Start with empty strings so placeholders work
    newMenu[catId].items.push({ name: '', price: '', desc: '' });
    setMenu(newMenu);
    openEditItem(catId, newIdx);
  };

  const addReel = () => {
    setReels([...reels, ""]);
  };

  const deleteReel = (index) => {
    const newReels = [...reels];
    newReels.splice(index, 1);
    setReels(newReels);
  };

  // Compress and convert any image to JPEG, resize if too large (Vercel has 4.5MB limit)
  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      // If file is already small enough and is jpg/png, skip conversion
      if (file.size < 500000 && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          // Resize if wider than maxWidth
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              const newName = file.name.replace(/\.[^.]+$/, '.jpg');
              const compressedFile = new File([blob], newName, { type: 'image/jpeg' });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', quality);
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    setIsUploadingImage(true);
    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressedFile);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': token },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setIsUploadingImage(false);
        return data.url;
      }
      setIsUploadingImage(false);
      alert("Upload error: " + data.error);
      return null;
    } catch (err) {
      setIsUploadingImage(false);
      alert("Upload failed: " + err.message);
      return null;
    }
  };



  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Dashboard...</div>;
  if (!menu) return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <h2 style={{ color: '#ff4d4d' }}>Error loading menu data</h2>
      <p style={{ color: '#666' }}>{errorDetails || "Could not connect to the database."}</p>
      <button onClick={fetchData} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '12px', border: '1px solid #ddd', cursor: 'pointer' }}>Try Again</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', paddingTop: '80px', paddingBottom: '80px', paddingLeft: '16px', paddingRight: '16px' }}>
      <div className="admin-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <style>{`
          .admin-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 40px; 
            gap: 20px;
          }
          .admin-header-left { flex: 1; }
          .admin-header-actions { 
            display: flex; 
            gap: 10px; 
            flex-wrap: wrap; 
            justify-content: flex-end;
          }
          .admin-card { background: white; border-radius: 24px; padding: 32px; margin-bottom: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.02); }
          .reels-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
          .menu-item-row { display: grid; grid-template-columns: 1fr 100px 1.5fr auto; gap: 20px; align-items: center; padding: 20px; border-radius: 20px; border: 1px solid #efefef; margin-bottom: 16px; background: #fff; transition: transform 0.1s; }
          .menu-item-row:active { transform: scale(0.99); }
          
          input { height: 44px; padding: 0 16px; border-radius: 12px; }

          @media (max-width: 768px) {
            .admin-header { 
              flex-direction: column; 
              align-items: flex-start; 
              margin-bottom: 32px;
              gap: 16px;
            }
            .admin-header-actions { 
              width: 100%; 
              justify-content: flex-start;
              gap: 8px;
            }
            .admin-header-actions button {
              flex: 1;
              padding: 10px 12px !important;
              font-size: 0.85rem !important;
              white-space: nowrap;
            }
            .menu-item-row { grid-template-columns: 1fr; gap: 12px; padding: 16px; }
            .admin-card { padding: 20px; border-radius: 20px; }
            .admin-header h1 { font-size: 1.8rem; }
          }
        `}</style>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: message.type === 'error' ? '#fee2e2' : '#dcfce7',
                color: message.type === 'error' ? '#ef4444' : '#22c55e',
                padding: '12px 24px',
                borderRadius: '99px',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 9999,
                border: `1px solid ${message.type === 'error' ? '#fca5a5' : '#86efac'}`
              }}
            >
              {message.type === 'error' ? '❌ ' : '✅ '}{message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">

        <img src="/logo.png" alt="Hawaii'n Delight Logo" style={{ height: '60px', width: 'auto', marginTop: '8px' }} />

          </div>
          <div className="admin-header-actions">
            {!selectedCategory && (
              <button 
                onClick={() => setShowAddCategory(true)}
                style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: '#00C9E8', color: 'var(--charcoal)', fontWeight: 700, cursor: 'pointer' }}
              >
                + Category
              </button>
            )}
            <button 
              onClick={handleSave} 
              disabled={saving}
              style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: 'var(--tropical-pink)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(255, 143, 171, 0.2)' }}
            >
              {saving ? 'Saving...' : 'Save All'}
            </button>
            <button 
              onClick={logout}
              style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', color: '#666', fontWeight: 600, cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </div>




        {/* Catch the Vibe Config - Unified 4-Block Editor */}
        {!selectedCategory && (
          <div className="admin-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              🌴 Catch the Vibe Config
            </h2>

            {/* 4 Clickable Block Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: vibeActiveBlock ? '24px' : '0' }}>
              {[
                { key: 'insta', icon: '📸', label: 'Instagram Feed', bg: '#f8f9ff', count: `${reels.length} Reels` },
                { key: 'reviews', icon: '⭐', label: 'Customer Reviews', bg: '#fff8f0', count: 'Widget PID' },
                { key: 'sellers', icon: '🌟', label: 'Best Sellers', bg: '#f0fff4', count: `${vibeConfig.best_sellers.length} Items` },
                { key: 'offers', icon: '🎁', label: 'Offers', bg: '#fff0f9', count: `${vibeConfig.offers.length} Offers` }
              ].map(block => (
                <div
                  key={block.key}
                  onClick={() => setVibeActiveBlock(vibeActiveBlock === block.key ? null : block.key)}
                  style={{
                    background: vibeActiveBlock === block.key ? 'var(--tropical-pink)' : block.bg,
                    color: vibeActiveBlock === block.key ? 'white' : 'var(--charcoal)',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: vibeActiveBlock === block.key ? '2px solid var(--tropical-pink)' : '2px solid transparent',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{block.icon}</div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 4px 0' }}>{block.label}</h3>
                  <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.7 }}>{block.count}</p>
                </div>
              ))}
            </div>

            {/* Expanded Editor for Instagram Feed */}
            {vibeActiveBlock === 'insta' && (
              <div style={{ background: '#f8f9ff', borderRadius: '16px', padding: '20px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>📸 Instagram Reels</h3>
                  <button
                    onClick={addReel}
                    style={{ padding: '6px 14px', borderRadius: '10px', border: 'none', background: '#e3f2fd', color: '#1976d2', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                  >+ Add Reel</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {reels.map((id, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#fff', padding: '8px', borderRadius: '12px', border: '1px solid #eee' }}>
                      <input
                        value={id}
                        onChange={(e) => {
                          const newReels = [...reels];
                          newReels[idx] = e.target.value;
                          setReels(newReels);
                        }}
                        placeholder={`Reel ${idx + 1} ID`}
                        style={{ flex: 1, minWidth: 0, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: 'transparent' }}
                      />
                      <button
                        onClick={() => deleteReel(idx)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#ff4d4d', padding: '0 4px' }}
                      >🗑️</button>
                    </div>
                  ))}
                  {reels.length === 0 && (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#aaa', padding: '20px', margin: 0 }}>No reels added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Expanded Editor for Customer Reviews */}
            {vibeActiveBlock === 'reviews' && (
              <div style={{ background: '#fff8f0', borderRadius: '16px', padding: '20px', marginTop: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', margin: '0 0 12px 0' }}>⭐ Customer Reviews</h3>
                <input
                  value={vibeConfig.reviews_pid}
                  onChange={(e) => setVibeConfig({ ...vibeConfig, reviews_pid: e.target.value })}
                  placeholder="Common Ninja Widget PID"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}

            {/* Expanded Editor for Best Sellers */}
            {vibeActiveBlock === 'sellers' && (
              <div style={{ background: '#f0fff4', borderRadius: '16px', padding: '20px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>🌟 Best Sellers</h3>
                  <button
                    onClick={() => setVibeConfig({ ...vibeConfig, best_sellers: [...vibeConfig.best_sellers, ''] })}
                    style={{ padding: '6px 14px', borderRadius: '10px', border: 'none', background: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                  >+ Add Item</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {vibeConfig.best_sellers.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        value={item}
                        onChange={(e) => {
                          const updated = [...vibeConfig.best_sellers];
                          updated[i] = e.target.value;
                          setVibeConfig({ ...vibeConfig, best_sellers: updated });
                        }}
                        placeholder="Item name"
                        style={{ flex: 1, minWidth: 0, padding: '10px', borderRadius: '10px', border: '1px solid #eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <button
                        onClick={() => setVibeConfig({ ...vibeConfig, best_sellers: vibeConfig.best_sellers.filter((_, j) => j !== i) })}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4d', fontSize: '1.1rem', padding: '0 4px' }}
                      >🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expanded Editor for Offers */}
            {vibeActiveBlock === 'offers' && (
              <div style={{ background: '#fff0f9', borderRadius: '16px', padding: '20px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>🎁 Offers</h3>
                  <button
                    onClick={() => setVibeConfig({ ...vibeConfig, offers: [...vibeConfig.offers, { icon: '🎁', title: '', desc: '' }] })}
                    style={{ padding: '6px 14px', borderRadius: '10px', border: 'none', background: '#fce7f3', color: '#9d174d', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                  >+ Add Offer</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                  {vibeConfig.offers.map((offer, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '12px', border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                          value={offer.icon}
                          onChange={(e) => {
                            const updated = [...vibeConfig.offers];
                            updated[i] = { ...updated[i], icon: e.target.value };
                            setVibeConfig({ ...vibeConfig, offers: updated });
                          }}
                          placeholder="Icon"
                          style={{ width: '48px', minWidth: '48px', padding: '8px', borderRadius: '10px', border: '1px solid #eee', textAlign: 'center', fontSize: '1.2rem', outline: 'none', boxSizing: 'border-box' }}
                        />
                        <input
                          value={offer.title}
                          onChange={(e) => {
                            const updated = [...vibeConfig.offers];
                            updated[i] = { ...updated[i], title: e.target.value };
                            setVibeConfig({ ...vibeConfig, offers: updated });
                          }}
                          placeholder="Offer title"
                          style={{ flex: 1, minWidth: 0, padding: '8px', borderRadius: '10px', border: '1px solid #eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                        />
                        <button
                          onClick={() => setVibeConfig({ ...vibeConfig, offers: vibeConfig.offers.filter((_, j) => j !== i) })}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4d', fontSize: '1.1rem', padding: '0 4px' }}
                        >🗑️</button>
                      </div>
                      <input
                        value={offer.desc}
                        onChange={(e) => {
                          const updated = [...vibeConfig.offers];
                          updated[i] = { ...updated[i], desc: e.target.value };
                          setVibeConfig({ ...vibeConfig, offers: updated });
                        }}
                        placeholder="Description"
                        style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* About Images Editor */}
        {!selectedCategory && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                📸 About Us Images
              </h2>
              <button 
                onClick={() => setAboutImages([...aboutImages, { id: Math.random().toString(36).substr(2, 9), url: '' }])}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#e3f2fd',
                  color: '#1976d2',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                + Add Image
              </button>
            </div>
            <Reorder.Group 
              axis="y" 
              values={aboutImages} 
              onReorder={setAboutImages}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', padding: 0, margin: 0 }}
            >
              {aboutImages.map((imgObj, idx) => (
                <AboutImageItem
                  key={imgObj.id}
                  imgObj={imgObj}
                  idx={idx}
                  aboutImages={aboutImages}
                  setAboutImages={setAboutImages}
                  isUploadingImage={isUploadingImage}
                  handleImageUpload={handleImageUpload}
                />
              ))}
            </Reorder.Group>
            {aboutImages.length === 0 && (
              <p style={{ textAlign: 'center', color: '#aaa', padding: '20px', margin: 0 }}>No images added yet. Click "+ Add Image" to begin.</p>
            )}
          </div>
        )}

        {/* Menu Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {selectedCategory && (
            <div style={{ marginBottom: '-16px' }}>
              <button 
                onClick={() => setSelectedCategory(null)}
                style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', color: '#333', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ⬅ Back to Categories
              </button>
            </div>
          )}

          {!selectedCategory ? (
            <Reorder.Group 
              axis="y" 
              values={Object.keys(menu)} 
              onReorder={(newOrder) => {
                const reordered = {};
                newOrder.forEach(k => { reordered[k] = menu[k]; });
                setMenu(reordered);
              }}
              style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              {Object.keys(menu).map((catId) => (
                <DraggableCategory 
                  key={catId} 
                  catId={catId} 
                  cat={menu[catId]} 
                  setSelectedCategory={setSelectedCategory} 
                  openEditCategory={openEditCategory} 
                  deleteCategory={deleteCategory} 
                />
              ))}
            </Reorder.Group>
          ) : (
            // Render just the selected category
            Object.entries(menu).filter(([catId]) => catId === selectedCategory).map(([catId, cat]) => (
              <div key={catId} className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: cat.color }}></div>
                        <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 800, margin: 0 }}>{cat.label}</h2>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => addItem(catId)} style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#e3f2fd', color: '#1976d2', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', marginLeft: '24px' }}>
                    + Add Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="menu-item-row">
                      <>
                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.name}</div>
                        <div style={{ color: 'var(--tropical-pink)', fontWeight: 700 }}>{item.price}</div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>{item.desc}</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEditItem(catId, idx)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Edit Item">✏️</button>
                          <button onClick={() => deleteItem(catId, idx)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4d', fontSize: '1.2rem' }} title="Delete Item">🗑️</button>
                        </div>
                      </>
                    </div>
                  ))}
                  {cat.items.length === 0 && <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem', padding: '20px' }}>No items in this category yet.</p>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Category Modal */}
        <AnimatePresence>
          {showAddCategory && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              >
                <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>Add New Category</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Category Name</label>
                    <input value={newCatData.name} onChange={(e) => setNewCatData({ ...newCatData, name: e.target.value })} placeholder="e.g. Snacks, Fresh Juices" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Header Image URL</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input value={newCatData.image} onChange={(e) => setNewCatData({ ...newCatData, image: e.target.value })} placeholder="https://unsplash.com/..." style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', minWidth: 0 }} />
                      <label style={{ background: isUploadingImage ? '#f5f5f5' : '#e3f2fd', color: isUploadingImage ? '#888' : '#1976d2', padding: '12px 16px', borderRadius: '12px', cursor: isUploadingImage ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', opacity: isUploadingImage ? 0.7 : 1 }}>
                        <span>{isUploadingImage ? "⏳ Uploading..." : "📷 Upload"}</span>
                        <input type="file" accept="image/*" disabled={isUploadingImage} style={{ display: 'none' }} onChange={(e) => {
                          if (e.target.files[0]) {
                            handleImageUpload(e.target.files[0]).then(url => {
                              if(url) setNewCatData({ ...newCatData, image: url });
                            });
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Theme Color</label>
                    <input type="color" value={newCatData.color} onChange={(e) => setNewCatData({ ...newCatData, color: e.target.value })} style={{ width: '64px', height: '48px', border: 'none', borderRadius: '12px', cursor: 'pointer', padding: 0 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                    <button disabled={isUploadingImage} onClick={addCategory} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: isUploadingImage ? '#ccc' : 'var(--tropical-pink)', color: 'white', fontWeight: 700, cursor: isUploadingImage ? 'not-allowed' : 'pointer', boxShadow: isUploadingImage ? 'none' : '0 4px 12px rgba(255,143,171,0.3)' }}>Create Category</button>
                    <button onClick={() => setShowAddCategory(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #ddd', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {showEditCategory && editingCategoryData && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              >
                <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>Edit Category</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Category Name</label>
                    <input value={editingCategoryData.label} onChange={(e) => setEditingCategoryData({ ...editingCategoryData, label: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Header Image URL</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input value={editingCategoryData.image || ''} onChange={(e) => setEditingCategoryData({ ...editingCategoryData, image: e.target.value })} style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', minWidth: 0 }} />
                      <label style={{ background: isUploadingImage ? '#f5f5f5' : '#e3f2fd', color: isUploadingImage ? '#888' : '#1976d2', padding: '12px 16px', borderRadius: '12px', cursor: isUploadingImage ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', opacity: isUploadingImage ? 0.7 : 1 }}>
                        <span>{isUploadingImage ? "⏳ Uploading..." : "📷 Upload"}</span>
                        <input type="file" accept="image/*" disabled={isUploadingImage} style={{ display: 'none' }} onChange={(e) => {
                          if (e.target.files[0]) {
                            handleImageUpload(e.target.files[0]).then(url => {
                              if(url) setEditingCategoryData({ ...editingCategoryData, image: url });
                            });
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Theme Color</label>
                    <input type="color" value={editingCategoryData.color} onChange={(e) => setEditingCategoryData({ ...editingCategoryData, color: e.target.value })} style={{ width: '64px', height: '48px', border: 'none', borderRadius: '12px', cursor: 'pointer', padding: 0 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                    <button disabled={isUploadingImage} onClick={saveCategoryEdit} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: isUploadingImage ? '#ccc' : 'var(--tropical-pink)', color: 'white', fontWeight: 700, cursor: isUploadingImage ? 'not-allowed' : 'pointer', boxShadow: isUploadingImage ? 'none' : '0 4px 12px rgba(255,143,171,0.3)' }}>Save Changes</button>
                    <button onClick={() => setShowEditCategory(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #ddd', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {showEditItem && editingItemData && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              >
                <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>Edit Item</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Item Name</label>
                    <input value={editingItemData.name} onChange={(e) => setEditingItemData({ ...editingItemData, name: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Price (e.g. ₹90)</label>
                    <input value={editingItemData.price} onChange={(e) => setEditingItemData({ ...editingItemData, price: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Description</label>
                    <textarea value={editingItemData.desc} onChange={(e) => setEditingItemData({ ...editingItemData, desc: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '80px', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                    <button onClick={saveItemEdit} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'var(--tropical-pink)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,143,171,0.3)' }}>Save Changes</button>
                    <button onClick={() => setShowEditItem(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #ddd', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
