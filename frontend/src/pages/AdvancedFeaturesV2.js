import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Trophy, Mic, Camera, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import HealthGoals from '../components/HealthGoals';
import HealthChallenges from '../components/HealthChallenges';
import VoiceJournal from '../components/VoiceJournal';
import PhotoSymptomTracker from '../components/PhotoSymptomTracker';

const AdvancedFeaturesV2 = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('goals');

  const tabs = [
    { id: 'goals', label: 'Health Goals', icon: Target, color: '#667eea' },
    { id: 'challenges', label: 'Challenges', icon: Trophy, color: '#f59e0b' },
    { id: 'voice', label: 'Voice Journal', icon: Mic, color: '#ef4444' },
    { id: 'photo', label: 'Photo Tracker', icon: Camera, color: '#ec4899' }
  ];

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
            <span className="logo-icon">🎯</span>
            <div>
              <h1 className="logo-title">Goals & Achievements</h1>
              <p className="logo-subtitle">Track progress, earn rewards, and stay motivated</p>
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
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-icon">🎯</div>
          <h2 className="hero-title">Goals & Achievements</h2>
          <p className="hero-description">
            Set health goals, complete challenges, journal with your voice, and track symptoms with photos. 
            Stay motivated with rewards and visual progress tracking.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <Sparkles size={20} />
              <span>4 New Features</span>
            </div>
            <div className="hero-feature">
              <Shield size={20} />
              <span>100% Private</span>
            </div>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="advanced-features-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`feature-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : 'none'
                }}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Feature Content */}
        <div className="feature-content">
          {activeTab === 'goals' && <HealthGoals />}
          {activeTab === 'challenges' && <HealthChallenges />}
          {activeTab === 'voice' && <VoiceJournal />}
          {activeTab === 'photo' && <PhotoSymptomTracker />}
        </div>

        {/* Info Section */}
        <div className="phase4-info">
          <div className="info-card">
            <h3>💡 What's Inside</h3>
            <p>
              Set personalized goals, complete challenges for XP and achievements, 
              use voice journaling with mood detection, and track symptoms with photos.
            </p>
            <div className="feature-highlights">
              <div className="highlight">
                <Target size={20} />
                <span>Set and track personalized health goals</span>
              </div>
              <div className="highlight">
                <Trophy size={20} />
                <span>Complete challenges and earn achievements</span>
              </div>
              <div className="highlight">
                <Mic size={20} />
                <span>Voice-powered journal with mood detection</span>
              </div>
              <div className="highlight">
                <Camera size={20} />
                <span>Photo tracking for skin conditions and symptoms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <span className="footer-logo">🌸</span>
          <p>For informational purposes only. Always consult a healthcare professional for medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdvancedFeaturesV2;
