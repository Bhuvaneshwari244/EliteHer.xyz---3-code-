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
import { useLanguage } from '../context/LanguageContext';

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [nextPeriod, setNextPeriod] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="loading">Loading your health dashboard...</div>;
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
              <h1 className="logo-title">Aura</h1>
              <p className="logo-subtitle">Smart period tracking</p>
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

      {/* Hero when empty */}
      {cycles.length === 0 && (
        <div className="hero-section">
          <div className="hero-icon">🌸</div>
          <h2 className="hero-title">Welcome to Aura</h2>
          <p className="hero-description">
            Track your menstrual cycles, predict upcoming periods, and gain
            insights into your reproductive health. Start by logging your
            first period below.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <TrendingUp size={20} />
              <span>Smart Predictions</span>
            </div>
            <div className="hero-feature">
              <Shield size={20} />
              <span>100% Private</span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="card" onClick={() => navigate('/trackers')}>
          <div className="card-icon">
            <Calendar size={32} />
          </div>
          <h3>Cycle Tracking</h3>
          {stats && stats.total_cycles > 0 ? (
            <>
              <p className="stat-value">{stats.average_cycle_length} days</p>
              <p className="stat-label">Average Cycle Length</p>
              {stats.is_irregular && (
                <span className="badge badge-warning">Irregular</span>
              )}
            </>
          ) : (
            <p className="stat-label">Start tracking your cycles</p>
          )}
        </div>

        <div className="card" onClick={() => navigate('/health-data')}>
          <div className="card-icon">
            <Activity size={32} />
          </div>
          <h3>Health Data Hub</h3>
          <p className="stat-label">Symptoms, Calendar, Insights & Journal - All in One</p>
        </div>

        <div className="card" onClick={() => navigate('/pcod-assessment')}>
          <div className="card-icon">
            <AlertCircle size={32} />
          </div>
          <h3>PCOD Risk Assessment</h3>
          {riskAssessment ? (
            <>
              <p className={`stat-value risk-${riskAssessment.risk_level.toLowerCase()}`}>
                {riskAssessment.risk_level} Risk
              </p>
              <p className="stat-label">{Math.round(riskAssessment.probability * 100)}% probability</p>
            </>
          ) : (
            <p className="stat-label">Get your risk assessment</p>
          )}
        </div>

        <div className="card">
          <div className="card-icon">
            <TrendingUp size={32} />
          </div>
          <h3>Next Period Prediction</h3>
          {nextPeriod && nextPeriod.predicted_start_date ? (
            <>
              <p className="stat-value">
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
      <div className="module-navigation">
        <h2>Explore More Features</h2>
        <div className="dashboard-grid">
          <div className="card module-card" onClick={() => navigate('/calendar')}>
            <div className="card-icon">
              <span style={{fontSize: '32px'}}>📅</span>
            </div>
            <h3>Calendar View</h3>
            <p className="stat-label">Visual cycle tracking</p>
          </div>

          <div className="card module-card" onClick={() => navigate('/health-insights')}>
            <div className="card-icon">
              <span style={{fontSize: '32px'}}>📊</span>
            </div>
            <h3>Health Insights</h3>
            <p className="stat-label">View detailed analytics and patterns</p>
          </div>

          <div className="card module-card" onClick={() => navigate('/wellness-hub')}>
            <div className="card-icon">
              <span style={{fontSize: '32px'}}>🌸</span>
            </div>
            <h3>Wellness Hub</h3>
            <p className="stat-label">Tips, reminders & AI chatbot</p>
          </div>

          <div className="card module-card" onClick={() => navigate('/advanced-features')}>
            <div className="card-icon">
              <span style={{fontSize: '32px'}}>✨</span>
            </div>
            <h3>Advanced Features</h3>
            <p className="stat-label">Voice logger, pain map, horoscope & more</p>
          </div>

          <div className="card module-card" onClick={() => navigate('/trackers')}>
            <div className="card-icon">
              <span style={{fontSize: '32px'}}>📊</span>
            </div>
            <h3>Health Trackers</h3>
            <p className="stat-label">Medication, exercise, sleep, nutrition & more</p>
          </div>
        </div>
      </div>

      {/* Medication Tracker */}
      <MedicationTracker />

      {/* Data Backup */}
      <DataBackup />

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
    </div>
    </>
  );
}

export default Dashboard;
