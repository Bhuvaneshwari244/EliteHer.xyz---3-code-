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
    { path: '/health-data', icon: Database, label: t('nav.healthDataHub') },
    { path: '/trackers', icon: BarChart3, label: t('nav.healthTrackers') },
    { path: '/pregnancy', icon: Baby, label: t('nav.pregnancyMode') },
    { path: '/pcod-assessment', icon: AlertCircle, label: t('nav.pcod') },
    { path: '/doctor-consultation', icon: Stethoscope, label: t('nav.doctors') },
    { path: '/wellness-hub', icon: Heart, label: t('nav.wellness') },
    { path: '/video-library', icon: Play, label: t('nav.videoLibrary') },
    { path: '/advanced-features', icon: Sparkles, label: t('nav.advanced') },
    { path: '/phase4', icon: Rocket, label: t('nav.goalsAchievements') },
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
      <nav className={`navigation-bar ${isOpen ? 'open slide-in-left' : ''}`}>
        {/* Brand Logo */}
        <div className="nav-brand scale-on-hover" onClick={() => navigate('/dashboard')}>
          <span className="nav-logo heartbeat">🌸</span>
          <div className="nav-brand-text">
            <h2>{t('common.appName')}</h2>
            <p>{t('nav.periodTracker')}</p>
          </div>
        </div>
        
        <div className="nav-divider"></div>
        
        <div className="nav-items">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`nav-item stagger-item scale-on-hover glow-on-focus ${isActive(item.path) ? 'active bounce-in' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Icon size={20} className={isActive(item.path) ? 'pulse' : 'rotate-on-hover'} />
                <span>{item.label}</span>
                {isActive(item.path) && <div className="active-indicator"></div>}
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
