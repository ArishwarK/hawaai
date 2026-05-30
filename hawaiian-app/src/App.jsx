import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigationType } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Home as HomeIcon, Coffee, MapPin, Mail } from 'lucide-react';
import Home from './pages/Home';
import MenuListing from './pages/MenuListing';
import CategoryMenu from './pages/CategoryMenu';
import ReviewsPage from './pages/ReviewsPage';
import LoginPage from './pages/LoginPage';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPage from './pages/AdminPage';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkStyle = {
    color: '#333', fontWeight: 600, fontSize: '1rem',
    textDecoration: 'none', letterSpacing: '0.3px',
    transition: 'all 0.3s ease',
    padding: '12px 0',
    display: 'block'
  };

  const desktopNavLinkStyle = {
    ...navLinkStyle,
    fontSize: '0.9rem',
    padding: '4px 0',
    display: 'inline-block',
    borderBottom: '2px solid transparent',
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <style>{`
        .drawer-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
          background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);
          z-index: 200;
        }
        .mobile-drawer {
          position: fixed; top: 0; right: 0; width: 85%; max-width: 320px; height: 100vh;
          background: linear-gradient(180deg, var(--pastel-blue), #dcf7ff);
          z-index: 300; padding: 0;
          display: flex; flex-direction: column;
          box-shadow: -10px 0 30px rgba(0,0,0,0.1);
          color: var(--charcoal);
          animation: slideInRight 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .drawer-header {
          padding: 24px; display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .drawer-body { padding: 32px 24px; flex: 1; overflow-y: auto; }
        .drawer-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 0; color: #444; font-weight: 600;
          text-decoration: none; border-bottom: 1px solid rgba(0,0,0,0.05);
          font-size: 1.1rem; transition: color 0.2s;
        }
        .drawer-item:hover { color: var(--tropical-pink); }
        .hamburger {
          display: none; cursor: pointer; border: none; background: transparent;
          width: 30px; height: 24px; position: relative; z-index: 160;
          flex-direction: column; justify-content: space-between;
        }
        .hamburger span {
          display: block; width: 100%; height: 3px; background: #333;
          border-radius: 3px; transition: all 0.3s;
        }
        @media (max-width: 992px) {
          .hamburger { display: flex; }
          .desktop-links, .desktop-cta { display: none !important; }
        }
      `}</style>
      
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 150,
        background: 'white', borderBottom: '1px solid #eee',
        height: '70px', display: 'flex', alignItems: 'center'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          
          <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '40px', padding: '4px' }} />
          </Link>

          {/* Desktop Links */}
          <div className="desktop-links" style={{ display: 'flex', gap: '32px' }}>
            <Link to="/" style={desktopNavLinkStyle}>Home</Link>
            <Link to="/about" style={desktopNavLinkStyle}>About Us</Link>
            <Link to="/menu" style={desktopNavLinkStyle}>Our Menu</Link>
            <Link to="/reviews" style={desktopNavLinkStyle}>Reviews</Link>
          </div>

          <Link to="/contact" className="desktop-cta" style={{
            padding: '10px 24px', borderRadius: '99px', background: 'var(--tropical-pink)', color: 'white', fontWeight: 700, textDecoration: 'none'
          }}>
            Visit Location
          </Link>

          {/* Hamburger Toggle */}
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>
            <span></span>
            <span style={{ margin: '6px 0' }}></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (CIT STYLE) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              className="drawer-overlay" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="drawer-header">
                <img src="/logo.png" alt="Logo" style={{ height: '45px', padding: '4px' }} />
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--charcoal)', fontSize: '2rem', cursor: 'pointer' }}
                >
                  <X size={32} />
                </button>

              </div>
              <div className="drawer-body">
                <Link to="/" onClick={toggleMenu} className="drawer-item">Home <ChevronRight size={18} opacity={0.5} /></Link>
                <Link to="/about" onClick={toggleMenu} className="drawer-item">About Us <ChevronRight size={18} opacity={0.5} /></Link>
                <Link to="/menu" onClick={toggleMenu} className="drawer-item">Our Menu <ChevronRight size={18} opacity={0.5} /></Link>
                <Link to="/reviews" onClick={toggleMenu} className="drawer-item">Customer Reviews <ChevronRight size={18} opacity={0.5} /></Link>
                
                <a href="https://maps.app.goo.gl/dTrLvj3d6qQVNSVe6" target="_blank" rel="noreferrer" onClick={toggleMenu} className="primary-btn" style={{ marginTop: '40px', width: '100%', background: 'linear-gradient(to right, var(--tropical-pink), #FF8585)', border: 'none' }}>
                  Visit Our Location
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}




function Footer() {
  return (
    <footer className="footer" style={{ background: 'var(--charcoal)', color: 'var(--white)', padding: '80px 0 24px', marginTop: '64px' }}>
      <div className="container grid-3" style={{ gap: '48px', marginBottom: '48px' }}>
        <div className="footer-brand">
          <Link to="/" className="logo footer-logo" style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--white)', marginBottom: '16px' }}>
            🌺 Hawaii'n Delight
          </Link>
          <p style={{ color: '#ccc', marginBottom: '24px', lineHeight: 1.6 }}>Your mini Hawaii in the middle of the city. Join us for the best Bubble Tea and Shaved Ice.</p>
          <div className="social-links" style={{ display: 'flex', gap: '16px' }}>
            <a href="https://www.instagram.com/hawaii_n_delight?igsh=MW82OWh4NDExcGtsaQ==" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: 'var(--tropical-pink)' }}><InstagramIcon size={24} /></a>
            <a href="mailto:hawaiindelight30@gmail.com" aria-label="Email" style={{ color: 'var(--pastel-blue)' }}><Mail size={24} /></a>
          </div>
        </div>
        <div className="footer-links">
          <h4 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: 600 }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
            <li><Link to="/" style={{ color: '#aaa', transition: 'color 0.2s' }}>Home</Link></li>
            <li><Link to="/about" style={{ color: '#aaa', transition: 'color 0.2s' }}>About Us</Link></li>
            <li><Link to="/menu" style={{ color: '#aaa', transition: 'color 0.2s' }}>Our Menu</Link></li>
            <li><Link to="/contact" style={{ color: '#aaa', transition: 'color 0.2s' }}>Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center container" style={{ borderTop: '1px solid #444', paddingTop: '24px', color: '#888', fontSize: '0.875rem' }}>
        <p>&copy; 2026 Hawaii'n Delight. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

function FloatingActions() {
  const { pathname } = useLocation();
  
  // Hide the WhatsApp button on the admin page
  if (pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  return (
    <div className="floating-actions" style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 100 }}>
      <a href="https://wa.me/919442728028" className="float-btn" aria-label="Chat on WhatsApp" target="_blank" rel="noreferrer" style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(37,211,102,0.4)', transition: 'transform 0.2s', textDecoration: 'none' }}>
        <span style={{ fontSize: '32px', marginBottom: '2px' }}>💬</span>
      </a>
    </div>
  );
}



const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menuCategories, setMenuCategories] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [menuError, setMenuError] = useState(null);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`/api/menu?cb=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setMenuCategories(Object.values(data));
        setMenuError(null);
      } else {
        setMenuError(`Server returned an error (${response.status}: ${response.statusText}).`);
      }
    } catch (err) {
      console.error('Failed to fetch menu', err);
      setMenuError('Network error: Cannot reach the database. This usually means the PC Firewall is blocking your phone.');
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Expose refresh function
  const refreshMenu = async () => {
    setLoadingMenu(true);
    await fetchMenu();
  };

  return (
    <MenuContext.Provider value={{ menuCategories, loadingMenu, menuError, refreshMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenuContext = () => useContext(MenuContext);

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <LoginPage />; // showing login page directly on protected route
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const action = useNavigationType();

  useEffect(() => {
    if (action !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, action]);

  return null;
}

function MobileBottomNav() {
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path ? 'var(--tropical-pink)' : '#888';

  return (
    <>
      <style>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: white;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
          z-index: 1000;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .nav-items {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 65px;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 0.7rem;
          font-weight: 700;
          gap: 4px;
          flex: 1;
        }
        @media (max-width: 768px) {
          .mobile-bottom-nav { display: block; }
          .floating-actions { bottom: 80px !important; }
        }
      `}</style>
      <div className="mobile-bottom-nav">
        <div className="nav-items">
          <Link to="/" className="nav-item" style={{ color: isActive('/') }}>
            <HomeIcon size={22} color={isActive('/')} />
            <span>Home</span>
          </Link>
          <Link to="/menu" className="nav-item" style={{ color: isActive('/menu') }}>
            <Coffee size={22} color={isActive('/menu')} />
            <span>Menu</span>
          </Link>
          <a href="https://maps.app.goo.gl/dTrLvj3d6qQVNSVe6" target="_blank" rel="noreferrer" className="nav-item" style={{ color: '#888' }}>
            <MapPin size={22} color="#888" />
            <span>Location</span>
          </a>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuListing />} />
            <Route path="/menu/:category" element={<CategoryMenu />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
          <FloatingActions />
          <MobileBottomNav />
        </BrowserRouter>
      </MenuProvider>
    </AuthProvider>
  );
}


function InstagramIcon({ size }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
}
