import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Shield, Calendar, Pill, Dumbbell, Moon, Droplets, Apple, Tablet, Weight, ChevronDown, ChevronUp, Heart, Bell, Thermometer, Droplet } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import MedicationTracker from '../components/MedicationTracker';
import ExerciseLogger from '../components/ExerciseLogger';
import SleepTracker from '../components/SleepTracker';
import WaterTracker from '../components/WaterTracker';
import NutritionTracker from '../components/NutritionTracker';
import SupplementTracker from '../components/SupplementTracker';
import PCODWeightTracker from '../components/PCODWeightTracker';
import SmartReminders from '../components/SmartReminders';
import IntimateActivityTracker from '../components/IntimateActivityTracker';
import BBTTracker from '../components/BBTTracker';
import CervicalMucusTracker from '../components/CervicalMucusTracker';
import CycleTracker from '../pages/CycleTracker';
import AnimatedPage from '../components/AnimatedPage';
import RippleButton from '../components/RippleButton';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import { pageAnimationClasses, getStaggerDelay } from '../utils/animationUtils';

function Trackers() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [expandedTracker, setExpandedTracker] = useState(null);

  const trackers = [
    {
      id: 'cycle',
      title: 'Cycle Tracker',
      description: 'Track menstrual cycles, periods, and reproductive health',
      icon: Calendar,
      color: '#ff6b6b',
      component: CycleTracker
    },
    {
      id: 'reminders',
      title: 'Smart Reminders',
      description: 'Period, ovulation, PMS, and medication reminders',
      icon: Bell,
      color: '#667eea',
      component: SmartReminders
    },
    {
      id: 'bbt',
      title: 'BBT Tracker',
      description: 'Basal body temperature for ovulation detection',
      icon: Thermometer,
      color: '#f59e0b',
      component: BBTTracker
    },
    {
      id: 'cervical_mucus',
      title: 'Cervical Mucus',
      description: 'Track fertility signs and mucus patterns',
      icon: Droplet,
      color: '#3b82f6',
      component: CervicalMucusTracker
    },
    {
      id: 'intimate',
      title: 'Intimate Activity',
      description: 'Private tracking with pregnancy risk indicators',
      icon: Heart,
      color: '#ff6b9d',
      component: IntimateActivityTracker
    },
    {
      id: 'medication',
      title: 'Medication Tracker',
      description: 'Track medications, dosages, and schedules',
      icon: Pill,
      color: '#4ecdc4',
      component: MedicationTracker
    },
    {
      id: 'exercise',
      title: 'Exercise Logger',
      description: 'Log workouts and physical activities',
      icon: Dumbbell,
      color: '#45b7d1',
      component: ExerciseLogger
    },
    {
      id: 'sleep',
      title: 'Sleep Tracker',
      description: 'Monitor sleep patterns and quality',
      icon: Moon,
      color: '#9b59b6',
      component: SleepTracker
    },
    {
      id: 'water',
      title: 'Water Tracker',
      description: 'Track daily water intake and hydration',
      icon: Droplets,
      color: '#3498db',
      component: WaterTracker
    },
    {
      id: 'nutrition',
      title: 'Nutrition Tracker',
      description: 'Log meals and nutritional information',
      icon: Apple,
      color: '#2ecc71',
      component: NutritionTracker
    },
    {
      id: 'supplements',
      title: 'Supplement Tracker',
      description: 'Track vitamins and supplements',
      icon: Tablet,
      color: '#f39c12',
      component: SupplementTracker
    },
    {
      id: 'weight',
      title: 'Weight Tracker',
      description: 'Monitor weight changes and PCOD management',
      icon: Weight,
      color: '#e74c3c',
      component: PCODWeightTracker
    }
  ];

  const toggleTracker = (trackerId) => {
    setExpandedTracker(expandedTracker === trackerId ? null : trackerId);
  };

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
            <span className="logo-icon">📊</span>
            <div>
              <h1 className="logo-title">Health Trackers</h1>
              <p className="logo-subtitle">Comprehensive health and wellness tracking</p>
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
          <div className="hero-icon">📊</div>
          <h2 className="hero-title">All Health Trackers</h2>
          <p className="hero-description">
            Comprehensive health tracking in one place. Click on any tracker below to expand and start logging your health data.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <Activity size={20} />
              <span>12 Trackers</span>
            </div>
            <div className="hero-feature">
              <Shield size={20} />
              <span>100% Private</span>
            </div>
          </div>
        </div>

        {/* Tracker Cards */}
        <div className="trackers-grid">
          {trackers.map((tracker) => {
            const IconComponent = tracker.icon;
            const TrackerComponent = tracker.component;
            const isExpanded = expandedTracker === tracker.id;
            
            return (
              <div key={tracker.id} className="tracker-card-container">
                {/* Tracker Header Card */}
                <div 
                  className={`tracker-card ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleTracker(tracker.id)}
                  style={{ '--tracker-color': tracker.color }}
                >
                  <div className="tracker-card-header">
                    <div className="tracker-icon">
                      <IconComponent size={24} />
                    </div>
                    <div className="tracker-info">
                      <h3 className="tracker-title">{tracker.title}</h3>
                      <p className="tracker-description">{tracker.description}</p>
                    </div>
                    <div className="tracker-toggle">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                  
                  {/* Expanded Tracker Content - moved inside the card */}
                  {isExpanded && (
                    <div className="tracker-content" onClick={(e) => e.stopPropagation()}>
                      {tracker.id === 'cycle' ? (
                        <div className="cycle-tracker-wrapper">
                          <CycleTracker />
                        </div>
                      ) : (
                        <TrackerComponent />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
}

export default Trackers;