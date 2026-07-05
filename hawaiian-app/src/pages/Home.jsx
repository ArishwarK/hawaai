import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Check, Wallet, Camera, Users, ArrowRight, ChevronDown, Globe, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useMenuContext } from '../App';

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const heroWord = {
  hidden: { opacity: 0, y: 80, rotateX: -30 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};




// Using local API backed by OracleDB

export default function Home() {
  const { menuCategories } = useMenuContext();
  const [reels, setReels] = useState(["DWyeM0BTA6h", "DWqwIDugU1G", "DRzRwqZAToa", "DQwJY-IAS8D"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedReel, setSelectedReel] = useState(null);
  const [activeVibeTab, setActiveVibeTab] = useState('Instagram Feed');
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
  
  const [aboutImageIndex, setAboutImageIndex] = useState(0);
  const [aboutImages, setAboutImages] = useState([]);

  // Preload about images for instant transitions
  useEffect(() => {
    aboutImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [aboutImages]);

  useEffect(() => {
    if (aboutImages.length === 0) return;
    const aboutTimer = setInterval(() => {
      setAboutImageIndex((prev) => (prev + 1) % aboutImages.length);
    }, 4000);
    return () => clearInterval(aboutTimer);
  }, [aboutImages]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reelsRes, aboutRes, vibeRes] = await Promise.all([
          fetch('/api/reels'),
          fetch('/api/about-images'),
          fetch('/api/vibe')
        ]);
        
        if (reelsRes.ok) {
          const reelsData = await reelsRes.json();
          setReels(reelsData);
        }
        if (aboutRes.ok) {
          const aboutData = await aboutRes.json();
          setAboutImages(aboutData);
        }
        if (vibeRes.ok) {
          const vibeData = await vibeRes.json();
          setVibeConfig(vibeData);
        }
      } catch (err) {
        console.error("Failed to fetch data from API", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeVibeTab === 'Customer Reviews') {
      const script = document.createElement('script');
      script.src = "https://cdn.commoninja.com/sdk/latest/commonninja.js";
      script.defer = true;
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [activeVibeTab]);

  const nextSlide = () => {
    if (menuCategories.length === 0) return;
    setCurrentIndex((prev) => (prev === menuCategories.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (menuCategories.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? menuCategories.length - 1 : prev - 1));
  };

  const activeCategory = menuCategories[currentIndex];

  // Preload next category image for instant transitions
  useEffect(() => {
    if (menuCategories.length <= 1) return;
    const nextIndex = (currentIndex + 1) % menuCategories.length;
    const prevIndex = currentIndex === 0 ? menuCategories.length - 1 : currentIndex - 1;
    [nextIndex, prevIndex].forEach(idx => {
      const img = new Image();
      img.src = menuCategories[idx]?.image;
    });
  }, [currentIndex, menuCategories]);

  // Preload all category images on first load
  useEffect(() => {
    if (menuCategories.length === 0) return;
    menuCategories.forEach(cat => {
      const img = new Image();
      img.src = cat.image;
    });
  }, [menuCategories]);

  useEffect(() => {
    if (menuCategories.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentIndex, menuCategories]);

  return (
    <div>
      {/* 🌴 HERO SECTION */}
      <header className="hero" id="home" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background image with Ken Burns */}
        <div className="hero-bg">
          <div className="hero-overlay"></div>
        </div>


        {/* Aesthetic animated gradient orbs */}
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '8%', left: '-4%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,143,171,0.35) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }}
        />
        <motion.div
          animate={{ x: [0, -25, 20, 0], y: [0, 25, -15, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ position: 'absolute', top: '10%', right: '-6%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(174,230,249,0.35) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }}
        />
        <motion.div
          animate={{ x: [0, 20, -30, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', bottom: '-5%', left: '25%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(183,245,197,0.3) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }}
        />

        {/* Geometric accent lines */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.4, duration: 1.5, ease: 'easeOut' }}
          style={{ position: 'absolute', top: '18%', left: '5%', width: 140, height: 2, background: 'linear-gradient(90deg, rgba(255,143,171,0.8), transparent)', transformOrigin: 'left', zIndex: 2, borderRadius: 2 }}
        />
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.6, duration: 1.5, ease: 'easeOut' }}
          style={{ position: 'absolute', bottom: '22%', right: '5%', width: 110, height: 2, background: 'linear-gradient(270deg, rgba(174,230,249,0.8), transparent)', transformOrigin: 'right', zIndex: 2, borderRadius: 2 }}
        />
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
          style={{ position: 'absolute', top: '25%', right: '8%', width: 2, height: 80, background: 'linear-gradient(180deg, rgba(255,143,171,0.7), transparent)', transformOrigin: 'top', zIndex: 2, borderRadius: 2 }}
        />
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.7, 0.4, 0.7] }} transition={{ delay: 1.2, duration: 4, repeat: Infinity }}
          style={{ position: 'absolute', top: '30%', left: '7%', width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,143,171,0.9)', zIndex: 2, boxShadow: '0 0 16px rgba(255,143,171,0.6)' }}
        />
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0.3, 0.6] }} transition={{ delay: 2, duration: 5, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '30%', right: '9%', width: 8, height: 8, borderRadius: '50%', background: 'rgba(174,230,249,0.9)', zIndex: 2, boxShadow: '0 0 12px rgba(174,230,249,0.6)' }}
        />



        {/* Hero content */}
        <div className="hero-content container text-center" style={{ position: 'relative', zIndex: 3 }}>


          <motion.h1
            className="hero-title"
            style={{ fontSize: 'clamp(2.1rem, 8vw, 4.2rem)', fontWeight: 800, color: 'var(--charcoal)', marginBottom: '10px' }}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
          >
            Tropical <span className="text-gradient">Delight</span>
          </motion.h1>

          <motion.p
            style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', color: '#444', fontWeight: 600, marginBottom: '16px', maxWidth: '600px', marginInline: 'auto' }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          >
            Coimbatore's Home of Island-Inspired Bites, Sips & Desserts
          </motion.p>
          
          <motion.p
            style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)', color: '#666', fontWeight: 500, marginBottom: '32px', maxWidth: '700px', marginInline: 'auto' }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.7 }}
          >
            Bubble Tea • Hawaiian Shaved Ice • Mochi Donuts • Burgers • Sandwiches • Bites & Dessert
          </motion.p>


          {/* Explore Our Varieties - Product Slider */}
          <motion.div
            style={{ marginTop: '20px', marginBottom: '16px' }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }}
          >
            <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', height: 'clamp(250px, 55vw, 450px)', borderRadius: 'clamp(16px, 4vw, 28px)', overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}>
              {menuCategories.length > 0 && activeCategory ? (
                <>
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: '100%', scale: 1.1 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: '-100%', scale: 0.9 }}
                      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                      style={{ width: '100%', height: '100%', position: 'absolute' }}
                    >
                      <Link to={`/menu/${activeCategory.id}`} style={{ display: 'block', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                        <motion.img
                          src={activeCategory.image}
                          alt={activeCategory.label}
                          fetchpriority="high"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1558857563-b37103ebced1?auto=format&fit=crop&q=80'; }}
                          animate={{ scale: [1, 1.15] }}
                          transition={{ duration: 6, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer', objectPosition: 'center center' }}
                        />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '60px 16px 16px', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                          <motion.h3
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            style={{ fontSize: 'clamp(1.4rem, 6vw, 2.2rem)', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.3)', margin: 0, textAlign: 'center', lineHeight: 1.1, paddingBottom: '12px' }}
                          >
                            {activeCategory.label}
                          </motion.h3>
                        </div>
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', width: 'clamp(36px, 9vw, 52px)', height: 'clamp(36px, 9vw, 52px)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', zIndex: 10 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--tropical-pink)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', width: 'clamp(36px, 9vw, 52px)', height: 'clamp(36px, 9vw, 52px)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', zIndex: 10 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--tropical-pink)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '90%', gap: 'clamp(3px, 1.2vw, 6px)', zIndex: 10 }}>
                    {menuCategories.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        style={{
                          width: i === currentIndex ? 'clamp(14px, 4vw, 28px)' : 'clamp(5px, 1.2vw, 7px)',
                          height: 'clamp(5px, 1.2vw, 7px)',
                          borderRadius: '4px',
                          background: i === currentIndex ? 'var(--tropical-pink)' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888', background: '#f9f9f9' }}>
                  Loading menu varieties...
                </div>
              )}
            </div>
          </motion.div>

          {/* Rating badge - bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}
          >
            <div className="glass-panel" style={{ padding: '4px 12px', textAlign: 'center', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', borderRadius: '99px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ color: '#FACC15', display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} fill="currentColor" size={10} />
                ))}
              </div>
              <span style={{ fontSize: '0.6rem', color: '#555', fontWeight: 600 }}>Loved by Customers</span>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
            style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#666' }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>Scroll Down</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </div>
      </header>


      
      {/* 🌴 ABOUT SECTION */}
      <section className="section" id="about">
        <div className="container">
          <div className="grid-2">
            <motion.div className="about-img-wrap" style={{ position: 'relative' }}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeInLeft}>
              
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
                {aboutImages.length > 0 ? (
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={aboutImageIndex}
                      initial={{ opacity: 0, x: '100%', scale: 1.1 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: '-100%', scale: 0.9 }}
                      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                    >
                      <motion.img 
                        src={aboutImages[aboutImageIndex]} 
                        alt="Hawaii'n Delight Storefront" 
                        loading="eager"
                        animate={{ scale: [1, 1.08] }}
                        transition={{ duration: 5, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }}>
                    <span style={{ color: '#ccc' }}>No images available</span>
                  </div>
                )}
              </div>


            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeInRight}>
              <h2 className="section-title">A Slice of Hawaii, <br /><span className="text-gradient">Right Here</span></h2>
              <p className="about-text">Hawaii'n Delight brings you globally loved flavors like bubble tea and Hawaiian shaved ice — crafted with care and served in a relaxing, joyful atmosphere.</p>
              <p className="about-text">Whether you're hanging out with friends or treating your family, every visit feels like a mini getaway. Escape the city noise and indulge in affordable premium treats!</p>
              <motion.ul className="feature-list" style={{ marginTop: '24px' }}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }}>
                {[
                  "Globally Loved Flavors",
                  "Joyful Atmosphere",
                  "Perfect for Hangouts"
                ].map((item, i) => (
                  <motion.li key={i} className="feature-item" 
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120 } } }}>
                    <div className="check-icon"><Check size={18} color="#166534" strokeWidth={3} /></div> <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 📸 CATCH THE VIBE SECTION */}
      <section className="section container" style={{ padding: '80px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ flex: 1 }}>
            <div className="text-center" style={{ marginBottom: '40px' }}>
              {/* Removed Catch the Vibe section title */}
            </div>
            
            {/* Tabs List */}
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', borderBottom: '2px solid #eee', marginBottom: '32px' }}>
              {['Instagram Feed', 'Best Sellers', 'Offers'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveVibeTab(tab)}
                  style={{
                    background: activeVibeTab === tab ? 'var(--tropical-pink)' : 'transparent',
                    color: activeVibeTab === tab ? 'white' : '#666',
                    border: 'none',
                    padding: '8px 24px',
                    borderRadius: '99px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div>
              {activeVibeTab === 'Instagram Feed' && (
                <div style={{ position: 'relative', marginTop: '20px' }}>
                  <div 
                    id="reels-scroll-container"
                    style={{ 
                      display: 'flex', 
                      gap: '24px', 
                      overflowX: 'auto', 
                      padding: '24px 0',
                      scrollSnapType: 'x mandatory',
                      scrollBehavior: 'smooth',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    {/* Dynamically managed reels from the dashboard */}
                    {reels.map((reelId, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setSelectedReel(reelId)}
                        style={{
                          minWidth: 'clamp(180px, 50vw, 240px)',
                          width: 'clamp(180px, 50vw, 240px)',
                          height: 'clamp(320px, 55vh, 420px)',
                          scrollSnapAlign: 'center',
                          flexShrink: 0,
                          overflow: 'hidden',
                          borderRadius: '24px',
                          position: 'relative',
                          cursor: 'pointer',
                          background: '#000',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
                        }}
                      >
                        {/* Peek Iframe (Shows the real starting image) */}
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: '#000' }}>
                          <iframe
                            title={`peek-${i}`}
                            src={`https://www.instagram.com/reel/${reelId}/embed/?hidecaption=1`}
                            frameBorder="0"
                            scrolling="no"
                            style={{
                              width: '100%',
                              height: '110%', 
                              border: 'none',
                              transform: 'translateY(-5%)'
                            }}
                          />
                        </div>

                        {/* Interaction Overlay */}
                        <div 
                          style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 2,
                            background: 'rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.3s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        >
                          <div style={{ 
                            width: '60px', 
                            height: '60px', 
                            borderRadius: '50%', 
                            background: 'rgba(255,255,255,0.3)', 
                            backdropFilter: 'blur(10px)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            border: '1.5px solid rgba(255,255,255,0.5)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                          }}>
                            <div style={{ 
                              width: 0, 
                              height: 0, 
                              borderTop: '12px solid transparent', 
                              borderBottom: '12px solid transparent', 
                              borderLeft: '18px solid white', 
                              marginLeft: '6px' 
                            }}></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button 
                    onClick={() => document.getElementById('reels-scroll-container').scrollBy({ left: -324, behavior: 'smooth' })}
                    style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', width: '50px', height: '50px', borderRadius: '50%', background: 'white', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                  >
                    <ChevronLeft size={24} color="var(--charcoal)" />
                  </button>
                  <button 
                    onClick={() => document.getElementById('reels-scroll-container').scrollBy({ left: 324, behavior: 'smooth' })}
                    style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', width: '50px', height: '50px', borderRadius: '50%', background: 'white', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                  >
                    <ChevronRight size={24} color="var(--charcoal)" />
                  </button>
                </div>
              )}

              {activeVibeTab === 'Best Sellers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--charcoal)', marginBottom: '16px' }}>★ Most Ordered</h3>
                  {vibeConfig.best_sellers.map((item, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '16px 24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                    >
                      <span style={{ color: 'var(--tropical-pink)' }}>★</span>
                      <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeVibeTab === 'Offers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
                  {vibeConfig.offers.map((offer, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                    >
                      <div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--charcoal)', marginBottom: '4px' }}>{offer.title}</h4>
                        <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.5 }}>{offer.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* REEL LIGHTBOX MODAL */}
        <AnimatePresence>
          {selectedReel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.92)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
              onClick={() => setSelectedReel(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: '80vh',
                  background: 'black',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedReel(null)}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    zIndex: 10,
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <X size={20} />
                </button>

                <iframe
                  title="Instagram Reel"
                  src={`https://www.instagram.com/reel/${selectedReel}/embed/?hidecaption=1`}
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency="true"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ⭐ CUSTOMER REVIEWS SECTION */}
      <section className="section" style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: '32px', padding: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', maxWidth: '1000px', margin: '0 auto' }}>
            <div className={`commonninja_component pid-${vibeConfig.reviews_pid}`}></div>
          </div>
        </div>
      </section>

      {/* 📍 LOCATION SECTION */}
      <section id="visit" className="section location-sec" style={{ padding: '96px 0', background: 'var(--charcoal)', color: 'white' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2 className="section-title">Your go-to Spot for <span className="text-gradient">Refreshment</span></h2>
            <p className="loc-text" style={{ fontSize: '1.125rem', color: '#ccc', marginBottom: '40px' }}>Ready for a refreshing break? Drop by today and treat yourself to something delightful.</p>

            <div className="loc-details flex-col gap-8" style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '40px' }}>
              <div className="loc-item flex" style={{ gap: '16px' }}>
                <MapPin color="var(--tropical-pink)" size={28} style={{ marginTop: '4px' }} />
                <div>
                  <h4 className="loc-item-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Address</h4>
                  <p className="loc-item-desc" style={{ color: '#aaa', lineHeight: 1.5 }}>JB Towers, 77/1, Avinashi Rd, opp. Coimbatore Medical College, Dr. Jaganathan Nagar, Peelamedu, Coimbatore, Tamil Nadu 641014, India</p>
                </div>
              </div>
              <div className="loc-item flex" style={{ gap: '16px' }}>
                <ClockIcon color="var(--pastel-blue)" size={28} />
                <div>
                  <h4 className="loc-item-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Open Hours</h4>
                  <p className="loc-item-desc" style={{ color: '#aaa', lineHeight: 1.5, margin: 0 }}>11:00 AM – 11:00 PM (Monday to Thursday)</p>
                  <p className="loc-item-desc" style={{ color: '#aaa', lineHeight: 1.5, margin: 0 }}>11:00 AM – 11:30 PM (Friday & Saturday)</p>
                  <p className="loc-item-desc" style={{ color: '#aaa', lineHeight: 1.5, margin: 0 }}>11:00 AM – 10:00 PM (Sunday)</p>
                </div>
              </div>
              <div className="loc-item flex" style={{ gap: '16px' }}>
                <DeliveryIcon color="var(--fresh-mint)" size={28} />
                <div>
                  <h4 className="loc-item-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Services</h4>
                  <p className="loc-item-desc" style={{ color: '#aaa', lineHeight: 1.5 }}>Dine-in | Takeaway | Delivery</p>
                </div>
              </div>
              <div className="loc-item flex" style={{ gap: '16px' }}>
                <Star color="var(--tropical-pink)" size={28} />
                <div>
                  <h4 className="loc-item-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Amenities</h4>
                  <p className="loc-item-desc" style={{ color: '#aaa', lineHeight: 1.5 }}>Free Wifi | Laptop Charging | Mobile Charging Station</p>
                </div>
              </div>
              <div className="loc-item flex" style={{ gap: '16px' }}>
                <Users color="var(--pastel-blue)" size={28} />
                <div>
                  <h4 className="loc-item-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>The Best Place For</h4>
                  <p className="loc-item-desc" style={{ color: '#aaa', lineHeight: 1.5 }}>Birthday Parties | Business Meetings | Family Gatherings</p>
                </div>
              </div>
            </div>

            <div className="loc-btns flex gap-4" style={{ flexWrap: 'wrap' }}>
              <a href="https://maps.app.goo.gl/dTrLvj3d6qQVNSVe6" target="_blank" rel="noreferrer" className="primary-btn" style={{ padding: '12px 32px', background: 'white', color: 'var(--charcoal)', fontWeight: 700, display: 'inline-block' }}>Get Directions</a>
              <a href="tel:+919442728028" className="secondary-btn" style={{ padding: '12px 32px', background: 'transparent', color: 'white', border: '1px solid white', fontWeight: 700, display: 'inline-block' }}>Call Now</a>
            </div>
          </div>
          <div className="loc-map" style={{ width: '100%', height: '400px', borderRadius: '24px', overflow: 'hidden', background: '#333' }}>
            <iframe title="Map location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.273155827668!2d77.02240297480877!3d11.02813768913636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a72d1f4d99%3A0xc6cb5a5bce9fa73d!2sHawaii'n%20Delight!5e0!3m2!1sen!2sin!4v1711294801234!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>

        </div>
      </section>
    </div>
  );
}

function ClockIcon({ color, size }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
}
function DeliveryIcon({ color, size }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
}
