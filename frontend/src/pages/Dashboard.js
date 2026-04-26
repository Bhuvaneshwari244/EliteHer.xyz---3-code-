import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cyclesAPI, predictionsAPI } from '../services/api';
import { Calendar, Activity, AlertCircle, TrendingUp, Shield } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { QuickActions } from '../components/QuickActions';
import Navigation from '../components/Navigation';
import ThemeToggle from '../components/ThemeToggle';
import DataBackup from '../components/DataBackup';
import MedicationTracker from '../components/MedicationTracker';
import QuickStats from '../components/QuickStats';
import HealthScore from '../components/HealthScore';
import LanguageSelector from '../components/LanguageSelector';
import RippleButton from '../components/RippleButton';
import AnimatedNotification from '../components/AnimatedNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [nextPeriod, setNextPeriod] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, cyclesRes, predictionRes, riskRes] = await Promise.all([
        cyclesAPI.getStats(),
        cyclesAPI.getCycles(),
        cyclesAPI.predictNext(),
        predictionsAPI.autoAssess()
      ]);
      
      setStats(statsRes.data);
      setCycles(cyclesRes.data.cycles || []);
      setNextPeriod(predictionRes.data);
      setRiskAssessment(riskRes.data.risk_assessment);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner 
          size="large" 
          text={t('dashboard.loadingDashboard')}
          overlay={true}
        />
      </div>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <Navigation />
      <div className="dashboard">
      
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="logo-icon">🌸</span>
            <div>
              <h1 className="logo-title">{t('common.appName')}</h1>
              <p className="logo-subtitle">{t('dashboard.smartPeriodTracking')}</p>
            </div>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <div className="privacy-badge">
              <Shield size={16} />
              <span>{t('common.privateSecure')}</span>
            </div>
            <button onClick={handleLogout} className="btn-secondary">{t('common.logout')}</button>
            <div className="mobile-language-selector">
              <LanguageSelector />
            </div>
          </div>
          <div className="desktop-language-selector">
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Hero when empty */}
      {cycles.length === 0 && (
        <div className="hero-section slide-in-down">
          <div className="hero-icon bounce-in">🌸</div>
          <h2 className="hero-title fade-in-delay-1">{t('dashboard.welcomeTitle')}</h2>
          <p className="hero-description fade-in-delay-2">
            {t('dashboard.welcomeSubtitle')} {t('dashboard.startTracking')}
          </p>
          <div className="hero-features fade-in-delay-3">
            <div className="hero-feature stagger-item">
              <TrendingUp size={20} className="float" />
              <span>{t('dashboard.smartPredictions')}</span>
            </div>
            <div className="hero-feature stagger-item">
              <Shield size={20} className="float" />
              <span>{t('dashboard.privateData')}</span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid fade-in-delay-2">
        <div className="card stagger-item scale-on-hover" onClick={() => navigate('/trackers')}>
          <div className="card-icon">
            <Calendar size={32} className="rotate-on-hover" />
          </div>
          <h3>{t('dashboard.cycleTracking')}</h3>
          {stats && stats.total_cycles > 0 ? (
            <>
              <p className="stat-value bounce-in">{stats.average_cycle_length} {t('cycles.days')}</p>
              <p className="stat-label">{t('dashboard.avgCycleLength')}</p>
              {stats.is_irregular && (
                <span className="badge badge-warning wobble">Irregular</span>
              )}
            </>
          ) : (
            <p className="stat-label">Start tracking your cycles</p>
          )}
        </div>

        <div className="card stagger-item scale-on-hover" onClick={() => navigate('/health-data')}>
          <div className="card-icon">
            <Activity size={32} className="pulse" />
          </div>
          <h3>{t('dashboard.healthDataHub')}</h3>
          <p className="stat-label">{t('dashboard.symptomsCalendarInsights')}</p>
        </div>

        <div className="card stagger-item scale-on-hover" onClick={() => navigate('/pcod-assessment')}>
          <div className="card-icon">
            <AlertCircle size={32} className="heartbeat" />
          </div>
          <h3>{t('dashboard.riskAssessment')}</h3>
          {riskAssessment ? (
            <>
              <p className={`stat-value risk-${riskAssessment.risk_level.toLowerCase()} bounce-in`}>
                {riskAssessment.risk_level} Risk
              </p>
              <p className="stat-label">{Math.round(riskAssessment.probability * 100)}% probability</p>
            </>
          ) : (
            <p className="stat-label">Get your risk assessment</p>
          )}
        </div>

        <div className="card stagger-item scale-on-hover">
          <div className="card-icon">
            <TrendingUp size={32} className="float" />
          </div>
          <h3>{t('dashboard.nextPeriodPrediction')}</h3>
          {nextPeriod && nextPeriod.predicted_start_date ? (
            <>
              <p className="stat-value bounce-in">
                {new Date(nextPeriod.predicted_start_date).toLocaleDateString()}
              </p>
              <p className="stat-label">Confidence: {nextPeriod.confidence}</p>
            </>
          ) : (
            <p className="stat-label">Need more data for prediction</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Quick Stats */}
      <QuickStats />

      {/* Health Score */}
      <HealthScore />



      {/* Navigation Cards for New Modules */}
      <div className="module-navigation fade-in-delay-3">
        <h2>{t('dashboard.exploreMoreFeatures')}</h2>
        <div className="dashboard-grid">
          <div className="card module-card stagger-item scale-on-hover" onClick={() => navigate('/calendar')}>
            <div className="card-icon">
              <span style={{fontSize: '32px'}} className="float">📅</span>
            </div>
            <h3>{t('dashboard.calendarView')}</h3>
            <p className="stat-label">{t('dashboard.visualCycleTracking')}</p>
          </div>

          <div className="card module-card stagger-item scale-on-hover" onClick={() => navigate('/health-insights')}>
            <div className="card-icon">
              <span style={{fontSize: '32px'}} className="pulse">📊</span>
            </div>
            <h3>{t('nav.insights')}</h3>
            <p className="stat-label">{t('dashboard.viewDetailedAnalytics')}</p>
          </div>

          <div className="card module-card stagger-item scale-on-hover" onClick={() => navigate('/wellness-hub')}>
            <div className="card-icon">
              <span style={{fontSize: '32px'}} className="heartbeat">🌸</span>
            </div>
            <h3>{t('nav.wellness')}</h3>
            <p className="stat-label">{t('dashboard.tipsRemindersAIChatbot')}</p>
          </div>

          <div className="card module-card stagger-item scale-on-hover" onClick={() => navigate('/advanced-features')}>
            <div className="card-icon">
              <span style={{fontSize: '32px'}} className="float">✨</span>
            </div>
            <h3>{t('nav.advanced')}</h3>
            <p className="stat-label">{t('dashboard.voiceLoggerPainMap')}</p>
          </div>

          <div className="card module-card stagger-item scale-on-hover" onClick={() => navigate('/trackers')}>
            <div className="card-icon">
              <span style={{fontSize: '32px'}} className="rotate-on-hover">📊</span>
            </div>
            <h3>{t('nav.healthTrackers')}</h3>
            <p className="stat-label">{t('dashboard.medicationExerciseSleep')}</p>
          </div>
        </div>
      </div>

      {/* Medication Tracker */}
      <MedicationTracker />

      {/* Data Backup */}
      <DataBackup />

      {/* Footer */}
      <footer className="dashboard-footer fade-in-delay-3">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo heartbeat">🌸</span>
            <span className="footer-name">Aura</span>
          </div>
          <p className="footer-disclaimer">
            For informational purposes only. Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </footer>

      <AnimatedNotification 
        message={notificationMessage}
        type={notificationType}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
    </>
  );
}

export default Dashboard;
