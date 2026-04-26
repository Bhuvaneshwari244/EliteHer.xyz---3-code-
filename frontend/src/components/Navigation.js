import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Activity, AlertCircle, TrendingUp, Heart, Menu, X, CalendarDays, BookOpen, Stethoscope, Settings, Sparkles, Play, BarChart3, Database, Baby, Rocket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', icon: Home, label: t('nav.dashboard') },
    { path: '/health-data', icon: Database, label: 'Health Data Hub' },
    { path: '/trackers', icon: BarChart3, label: 'Health Trackers' },
    { path: '/pregnancy', icon: Baby, label: 'Pregnancy Mode' },
    { path: '/pcod-assessment', icon: AlertCircle, label: t('nav.pcod') },
    { path: '/doctor-consultation', icon: Stethoscope, label: t('nav.doctors') },
    { path: '/wellness-hub', icon: Heart, label: t('nav.wellness') },
    { path: '/video-library', icon: Play, label: 'Video Library' },
    { path: '/advanced-features', icon: Sparkles, label: t('nav.advanced') },
    { path: '/phase4', icon: Rocket, label: 'Goals & Achievements' },
    { path: '/settings', icon: Settings, label: t('nav.settings') }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Bar */}
      <nav className={`navigation-bar ${isOpen ? 'open' : ''}`}>
        {/* Brand Logo */}
        <div className="nav-brand" onClick={() => navigate('/dashboard')}>
          <span className="nav-logo">🌸</span>
          <div className="nav-brand-text">
            <h2>Aura</h2>
            <p>Period Tracker</p>
          </div>
        </div>
        
        <div className="nav-divider"></div>
        
        <div className="nav-items">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="nav-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Navigation;
