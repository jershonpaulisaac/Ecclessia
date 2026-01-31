import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './Navigation.css';

const Navigation = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/qa", label: "Q&A" },
    { to: "/quiet-time", label: "Quiet Time" },
    { to: "/teachings", label: "Teachings" },
    { to: "/contribution", label: "Contribution" },
    { to: "/contact", label: "Contact" },
  ];

  if (!user && !loading) {
    links.push({ to: "/join", label: "Join" });
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <NavLink to="/" className="logo">
          Ecclesia
        </NavLink>

        <div className="desktop-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="desktop-auth">
          {loading ? (
            <div className="nav-link auth-link">
              <div className="nav-skeleton" title="Checking authentication status..."></div>
            </div>
          ) : user ? (
            <div className="auth-nav-group">
              {user.role === 'admin' && (
                <NavLink to="/admin" className="nav-link auth-link" title="Admin Dashboard">
                  <Settings size={18} /> Admin
                </NavLink>
              )}
              <NavLink to="/profile" className="nav-link auth-link">
                <User size={18} /> Profile
              </NavLink>
              <button onClick={handleLogout} className="nav-link logout-btn" title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="nav-link auth-link btn-login">
              <LogIn size={18} /> Login
            </NavLink>
          )}
        </div>

        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            {loading ? (
              <div className="mobile-link nav-skeleton" style={{ width: '120px', margin: '0 auto' }}></div>
            ) : user ? (
              <>
                <NavLink to="/profile" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </NavLink>
                <button onClick={handleLogout} className="mobile-link text-left w-full logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Login / Sign Up
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
