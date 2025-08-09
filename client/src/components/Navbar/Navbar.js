import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  MessageCircle, 
  BookOpen, 
  User, 
  Phone, 
  Info, 
  LogIn, 
  UserPlus,
  LogOut,
  Settings,
  Bell,
  Search,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const publicNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'Sobre', icon: Info },
    { path: '/contact', label: 'Contato', icon: Phone }
  ];

  const privateNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/chat', label: 'Chat IA', icon: MessageCircle },
    { path: '/plans', label: 'Meus Planos', icon: BookOpen },
    { path: '/profile', label: 'Perfil', icon: User }
  ];

  const navItems = isAuthenticated ? privateNavItems : publicNavItems;

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Zap size={28} />
          </div>
          <span className="logo-text">GymIA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions desktop-actions">
          {isAuthenticated ? (
            <>
              {/* Search Button */}
              <button className="action-btn search-btn" title="Buscar">
                <Search size={20} />
              </button>

              {/* Notifications */}
              <button className="action-btn notification-btn" title="Notificações">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="notification-badge">{notifications}</span>
                )}
              </button>

              {/* User Menu */}
              <div className="user-menu">
                <button className="user-menu-trigger">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="user-avatar" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      <User size={20} />
                    </div>
                  )}
                  <span className="user-name">{user?.name || 'Usuário'}</span>
                </button>
                
                <div className="user-menu-dropdown">
                  <Link to="/profile" className="menu-item">
                    <User size={16} />
                    <span>Perfil</span>
                  </Link>
                  <Link to="/profile?tab=preferences" className="menu-item">
                    <Settings size={16} />
                    <span>Configurações</span>
                  </Link>
                  <hr className="menu-divider" />
                  <button onClick={handleLogout} className="menu-item logout">
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                <LogIn size={18} />
                <span>Entrar</span>
              </Link>
              <Link to="/register" className="btn btn-primary">
                <UserPlus size={18} />
                <span>Cadastrar</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-menu-content">
              {/* Mobile Navigation */}
              <div className="mobile-nav">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="mobile-actions">
                {isAuthenticated ? (
                  <>
                    {/* User Info */}
                    <div className="mobile-user-info">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="mobile-user-avatar" />
                      ) : (
                        <div className="mobile-user-avatar-placeholder">
                          <User size={24} />
                        </div>
                      )}
                      <div className="mobile-user-details">
                        <span className="mobile-user-name">{user?.name || 'Usuário'}</span>
                        <span className="mobile-user-email">{user?.email}</span>
                      </div>
                    </div>

                    {/* Mobile Menu Items */}
                    <div className="mobile-menu-items">
                      <button className="mobile-menu-item">
                        <Search size={20} />
                        <span>Buscar</span>
                      </button>
                      <button className="mobile-menu-item">
                        <Bell size={20} />
                        <span>Notificações</span>
                        {notifications > 0 && (
                          <span className="notification-badge">{notifications}</span>
                        )}
                      </button>
                      <Link to="/profile?tab=preferences" className="mobile-menu-item">
                        <Settings size={20} />
                        <span>Configurações</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <button onClick={handleLogout} className="mobile-logout-btn">
                      <LogOut size={20} />
                      <span>Sair</span>
                    </button>
                  </>
                ) : (
                  <div className="mobile-auth-buttons">
                    <Link to="/login" className="btn btn-ghost mobile-auth-btn">
                      <LogIn size={20} />
                      <span>Entrar</span>
                    </Link>
                    <Link to="/register" className="btn btn-primary mobile-auth-btn">
                      <UserPlus size={20} />
                      <span>Cadastrar</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
