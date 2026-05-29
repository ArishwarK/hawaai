import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';


export default function AdminPage() {
  const [menu, setMenu] = useState(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatData, setNewCatData] = useState({ name: '', image: '', color: '#FF6B6B' });
  // New Modal States
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editingCategoryData, setEditingCategoryData] = useState(null);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editingItemData, setEditingItemData] = useState(null); // { catId, index, name, price, desc }
  const { token, logout: authLogout } = useAuth();
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
      const [menuRes, reelsRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/reels')
      ]);

      
      if (!menuRes.ok) throw new Error("Failed to fetch menu");
      if (!reelsRes.ok) throw new Error("Failed to fetch reels");

      const menuData = await menuRes.json();
      const reelsData = await reelsRes.json();

      if (menuData) setMenu(menuData);
      if (reelsData) {
        setReels(reelsData);
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


      const [menuRes, reelsRes] = await Promise.all([
        fetch('/api/menu', {
          method: 'POST',
          headers,
          body: JSON.stringify(menu)
        }),
        fetch('/api/reels', {
          method: 'POST',
          headers,
          body: JSON.stringify(reels.filter(id => id.trim() !== ""))
        })
      ]);


      if (menuRes.ok && reelsRes.ok) {
        setMessage({ type: 'success', text: 'All changes saved to database!' });
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

  const handleImageUpload = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': token },
        body: formData
      });
      const data = await res.json();
      if (res.ok) return data.url;
      alert("Upload error: " + data.error);
      return null;
    } catch (err) {
      alert("Upload failed. Connect backend properly.");
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
            <button 
              onClick={() => setShowAddCategory(true)}
              style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', background: '#00C9E8', color: 'var(--charcoal)', fontWeight: 700, cursor: 'pointer' }}
            >
              + Category
            </button>
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




        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              🎬 Instagram Reels
            </h2>
            <button 
              onClick={addReel}
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
              + Add Reel
            </button>
          </div>
          <div className="reels-grid">
            {reels.map((id, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Reel {idx + 1}</label>
                  <button 
                    onClick={() => deleteReel(idx)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#ff4d4d', opacity: 0.6 }}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0.6}
                  >
                    🗑️
                  </button>
                </div>
                <input 
                  value={id}
                  onChange={(e) => {
                    const newReels = [...reels];
                    newReels[idx] = e.target.value;
                    setReels(newReels);
                  }}
                  placeholder="Enter Reel ID (e.g. C1a2b3c4d5e)"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.9rem', outline: 'none', background: '#fcfcfc' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--tropical-pink)'}
                  onBlur={(e) => e.target.style.borderColor = '#eee'}
                />
              </div>
            ))}
            {reels.length === 0 && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#aaa', padding: '20px', margin: 0 }}>No reels added yet. Click "+ Add Reel" to begin.</p>
            )}
          </div>
        </div>

        {/* Menu Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.entries(menu).map(([catId, cat]) => (
            <div key={catId} className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>

                <div style={{ flex: 1 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: cat.color }}></div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{cat.label}</h2>
                      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                        <button 
                          onClick={() => openEditCategory(catId)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.5 }}
                          onMouseEnter={(e) => e.target.style.opacity = 1}
                          onMouseLeave={(e) => e.target.style.opacity = 0.5}
                          title="Edit Category"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteCategory(catId)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#ff4d4d', opacity: 0.5 }}
                          onMouseEnter={(e) => e.target.style.opacity = 1}
                          onMouseLeave={(e) => e.target.style.opacity = 0.5}
                          title="Delete Category"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => addItem(catId)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#e3f2fd',
                    color: '#1976d2',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    marginLeft: '24px'
                  }}
                >
                  + Add Item
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cat.items.map((item, idx) => {
                  return (
                    <div key={idx} className="menu-item-row">

                        <>
                          <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.name}</div>
                          <div style={{ color: 'var(--tropical-pink)', fontWeight: 700 }}>{item.price}</div>
                          <div style={{ color: '#666', fontSize: '0.9rem' }}>{item.desc}</div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => openEditItem(catId, idx)}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                              title="Edit Item"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => deleteItem(catId, idx)}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4d', fontSize: '1.2rem' }}
                              title="Delete Item"
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                    </div>
                  );
                })}
                {cat.items.length === 0 && <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem', padding: '20px' }}>No items in this category yet.</p>}
              </div>
            </div>
          ))}
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
                      <label style={{ background: '#e3f2fd', color: '#1976d2', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        <span>📷 Upload</span>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                          const span = e.target.previousSibling;
                          span.innerText = "⏳ Uploading...";
                          handleImageUpload(e.target.files[0]).then(url => {
                            if(url) setNewCatData({ ...newCatData, image: url });
                            span.innerText = "📷 Upload";
                          });
                        }} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Theme Color</label>
                    <input type="color" value={newCatData.color} onChange={(e) => setNewCatData({ ...newCatData, color: e.target.value })} style={{ width: '64px', height: '48px', border: 'none', borderRadius: '12px', cursor: 'pointer', padding: 0 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                    <button onClick={addCategory} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'var(--tropical-pink)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,143,171,0.3)' }}>Create Category</button>
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
                      <label style={{ background: '#e3f2fd', color: '#1976d2', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        <span>📷 Upload</span>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                          const span = e.target.previousSibling;
                          span.innerText = "⏳ Uploading...";
                          handleImageUpload(e.target.files[0]).then(url => {
                            if(url) setEditingCategoryData({ ...editingCategoryData, image: url });
                            span.innerText = "📷 Upload";
                          });
                        }} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Theme Color</label>
                    <input type="color" value={editingCategoryData.color} onChange={(e) => setEditingCategoryData({ ...editingCategoryData, color: e.target.value })} style={{ width: '64px', height: '48px', border: 'none', borderRadius: '12px', cursor: 'pointer', padding: 0 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                    <button onClick={saveCategoryEdit} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'var(--tropical-pink)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,143,171,0.3)' }}>Save Changes</button>
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
