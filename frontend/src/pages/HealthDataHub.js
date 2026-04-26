import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Activity, Calendar, TrendingUp, BookOpen, ArrowLeft, Shield } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import SymptomLogger from './SymptomLogger';
import CalendarView from './CalendarView';
import HealthInsightsPage from './HealthInsightsPage';
import Journal from './Journal';

function HealthDataHub() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 'symptom-logger',
      title: 'Symptom Logger',
      description: 'Track daily symptoms, pain levels, and mood',
      icon: Activity,
      color: '#FF6B9D',
      component: SymptomLogger
    },
    {
      id: 'calendar',
      title: 'Calendar View',
      description: 'Visual calendar with periods, symptoms, and predictions',
      icon: Calendar,
      color: '#4ECDC4',
      component: CalendarView
    },
    {
      id: 'insights',
      title: 'Health Insights',
      description: 'AI-powered analysis, patterns, and recommendations',
      icon: TrendingUp,
      color: '#95E1D3',
      component: HealthInsightsPage
    },
    {
      id: 'journal',
      title: 'Personal Journal',
      description: 'Write notes, reflections, and track your journey',
      icon: BookOpen,
      color: '#FFB6C1',
      component: Journal
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <>
      <AnimatedBackground />
      <Navigation />
      
      <div className="dashboard">
        <button onClick={() => navigate('/dashboard')} className="back-button" title="Go back">
          <ArrowLeft size={20} />
        </button>
        
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-logo">
              <span className="logo-icon">📊</span>
              <div>
                <h1 className="logo-title">Health Data Hub</h1>
                <p className="logo-subtitle">Your complete health tracking and analysis center</p>
              </div>
            </div>
            <div className="header-actions">
              <ThemeToggle />
              <div className="privacy-badge">
                <Shield size={16} />
                <span>Private & Secure</span>
              </div>
              <button onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }} className="btn-secondary">Logout</button>
              <div className="mobile-language-selector">
                <LanguageSelector />
              </div>
            </div>
            <div className="desktop-language-selector">
              <LanguageSelector />
            </div>
          </div>
        </header>

      <div className="hub-hero">
        <h2>Track, Visualize, and Understand Your Health</h2>
        <p>
          All your health data in one place. Log symptoms, view patterns on the calendar, 
          get AI-powered insights, and journal your experiences. Everything syncs automatically 
          across all sections.
        </p>
        <div className="hub-stats">
          <button className="stat-badge" onClick={() => toggleSection('symptom-logger')}>
            <span className="stat-icon">📝</span>
            <span>Daily Logging</span>
          </button>
          <button className="stat-badge" onClick={() => toggleSection('calendar')}>
            <span className="stat-icon">📅</span>
            <span>Visual Calendar</span>
          </button>
          <button className="stat-badge" onClick={() => toggleSection('insights')}>
            <span className="stat-icon">🤖</span>
            <span>AI Insights</span>
          </button>
          <button className="stat-badge" onClick={() => toggleSection('journal')}>
            <span className="stat-icon">📖</span>
            <span>Personal Journal</span>
          </button>
        </div>
      </div>

      <div className="hub-sections">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          const Component = section.component;

          return (
            <div key={section.id} className={`hub-section-card ${isExpanded ? 'expanded' : ''}`}>
              <div 
                className="hub-section-header"
                onClick={() => toggleSection(section.id)}
                style={{ borderLeftColor: section.color }}
              >
                <div className="section-header-left">
                  <div className="section-icon" style={{ backgroundColor: section.color }}>
                    <Icon size={24} color="white" />
                  </div>
                  <div className="section-info">
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                </div>
                <div className="section-toggle">
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {isExpanded && (
                <div className="hub-section-content">
                  <Component />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hub-footer">
        <div className="footer-card">
          <h3>🔄 Data Synchronization</h3>
          <p>
            All data logged in any section automatically appears in other related sections. 
            Log a symptom here, see it on the calendar. Mark a period day on the calendar, 
            see it in insights. Everything stays in sync!
          </p>
        </div>
        <div className="footer-card">
          <h3>🔒 Privacy First</h3>
          <p>
            Your health data is encrypted and stored securely. Only you can access your 
            information. Export reports for doctors, but your data never leaves your control.
          </p>
        </div>
      </div>
      </div>
    </>
  );
}

export default HealthDataHub;
