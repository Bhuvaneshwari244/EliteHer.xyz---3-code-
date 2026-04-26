import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cyclesAPI } from '../services/api';
import { Shield, ArrowLeft } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { WellnessTips } from '../components/WellnessTips';
import SmartReminders from '../components/SmartReminders';
import { HealthChatbot } from '../components/HealthChatbot';
import Navigation from '../components/Navigation';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import WaterTracker from '../components/WaterTracker';
import ExerciseLogger from '../components/ExerciseLogger';
import SleepTracker from '../components/SleepTracker';
import NutritionTracker from '../components/NutritionTracker';
import GoalTracker from '../components/GoalTracker';
import CommunitySupport from '../components/CommunitySupport';

function WellnessHub() {
  const navigate = useNavigate();
  const [cycles, setCycles] = useState([]);
  const [nextPeriod, setNextPeriod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cyclesRes, predictionRes] = await Promise.all([
        cyclesAPI.getCycles(),
        cyclesAPI.predictNext()
      ]);
      
      setCycles(cyclesRes.data.cycles || []);
      setNextPeriod(predictionRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading wellness hub...</div>;
  }

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
            <span className="logo-icon">🌸</span>
            <div>
              <h1 className="logo-title">Wellness Hub</h1>
              <p className="logo-subtitle">Your health companion</p>
            </div>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <div className="privacy-badge">
              <Shield size={16} />
              <span>Private & Secure</span>
            </div>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-icon">💚</div>
        <h2 className="hero-title">Your Wellness Companion</h2>
        <p className="hero-description">
          Get personalized health tips, smart reminders, and chat with our AI health assistant
          for guidance on your menstrual health journey.
        </p>
      </div>

      {/* Smart Reminders */}
      <SmartReminders cycles={cycles} nextPeriod={nextPeriod} />

      {/* Water Tracker */}
      <WaterTracker />

      {/* Exercise Logger */}
      <ExerciseLogger />

      {/* Sleep Tracker */}
      <SleepTracker />

      {/* Nutrition Tracker */}
      <NutritionTracker />

      {/* Goal Tracker */}
      <GoalTracker />

      {/* Community Support */}
      <CommunitySupport />

      {/* Wellness Tips */}
      <WellnessTips />

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🌸</span>
            <span className="footer-name">Aura</span>
          </div>
          <p className="footer-disclaimer">
            For informational purposes only. Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </footer>

      {/* Health Chatbot */}
      <HealthChatbot />
    </div>
  );
}

export default WellnessHub;
