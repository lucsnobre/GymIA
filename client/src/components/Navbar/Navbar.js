import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  MessageCircle, 
  FileText, 
  Home,
  Info,
  Mail,
  Dumbbell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'Sobre', icon: Info },
    { path: '/chat', label: 'Chat IA', icon: MessageCircle },
    ...(isAuthenticated ? [{ path: '/plans', label: 'Meus Planos', icon: FileText }] : []),
    { path: '/contact', label: 'Contato', icon: Mail }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar glass-card">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <Dumbbell className="brand-icon" />
            <span className="brand-text">GymIA</span>
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
                  aria-label={item.label}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="profile-menu">
                <button
                  className="profile-button btn btn-ghost"
                  onClick={toggleProfileMenu}
                  aria-label="Menu do usuário"
                  aria-expanded={isProfileMenuOpen}
                >
                  <User size={18} />
                  <span className="profile-name">{user?.name}</span>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      className="profile-dropdown glass-card"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="profile-info">
                        <div className="profile-avatar">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="profile-name-full">{user?.name}</div>
                          <div className="profile-email">{user?.email}</div>
                        </div>
                      </div>
                      
                      <div className="profile-divider"></div>
                      
                      <Link
                        to="/profile"
                        className="profile-menu-item"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User size={16} />
                        <span>Perfil</span>
                      </Link>
                      
                      <Link
                        to="/plans"
                        className="profile-menu-item"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FileText size={16} />
                        <span>Meus Planos</span>
                      </Link>
                      
                      <div className="profile-divider"></div>
                      
                      <button
                        className="profile-menu-item logout-item"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Sair</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Entrar
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button btn btn-ghost"
              onClick={toggleMenu}
              aria-label="Menu de navegação"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-nav-content">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {!isAuthenticated && (
                  <div className="mobile-auth-section">
                    <div className="mobile-divider"></div>
                    <Link
                      to="/login"
                      className="mobile-nav-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>Entrar</span>
                    </Link>
                    <Link
                      to="/register"
                      className="mobile-nav-link primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>Cadastrar</span>
                    </Link>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="mobile-auth-section">
                    <div className="mobile-divider"></div>
                    <div className="mobile-profile-info">
                      <User size={20} />
                      <div>
                        <div className="mobile-profile-name">{user?.name}</div>
                        <div className="mobile-profile-email">{user?.email}</div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="mobile-nav-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>Perfil</span>
                    </Link>
                    <button
                      className="mobile-nav-link logout"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut size={20} />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close menus */}
      {(isMenuOpen || isProfileMenuOpen) && (
        <div
          className="navbar-overlay"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
}

export default Navbar;
