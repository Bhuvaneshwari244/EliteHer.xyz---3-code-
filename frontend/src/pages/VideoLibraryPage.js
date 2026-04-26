import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import VideoLibrary from '../components/VideoLibrary';
import { useLanguage } from '../context/LanguageContext';

function VideoLibraryPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <Navigation />
      <AnimatedBackground />
      
      <button onClick={() => navigate(-1)} className="back-button" title="Go back">
        <ArrowLeft size={20} />
      </button>
      
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="logo-icon">🎬</span>
            <div>
              <h1 className="logo-title">Video Library</h1>
              <p className="logo-subtitle">Wellness videos for your health journey</p>
            </div>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <div className="privacy-badge">
              <Shield size={16} />
              <span>Private & Secure</span>
            </div>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
            <div className="mobile-language-selector">
              <LanguageSelector />
            </div>
          </div>
          <div className="desktop-language-selector">
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="page-container">
        <VideoLibrary />
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <span className="footer-logo">🌸</span>
          <p>For informational purposes only. Always consult a healthcare professional for medical advice.</p>
        </div>
      </footer>
    </div>
  );
}

export default VideoLibraryPage;