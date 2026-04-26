import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cyclesAPI, symptomsAPI } from '../services/api';
import { Shield, ArrowLeft } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { CyclePhaseIndicator } from '../components/CyclePhaseIndicator';
import { SymptomInsights } from '../components/SymptomInsights';
import { MoodTrends } from '../components/MoodTrends';
import { HealthInsights } from '../components/HealthInsights';
import Navigation from '../components/Navigation';
import DataVisualization from '../components/DataVisualization';
import FertilityCalculator from '../components/FertilityCalculator';
import SymptomPrediction from '../components/SymptomPrediction';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

function HealthInsightsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, cyclesRes, symptomsRes] = await Promise.all([
        cyclesAPI.getStats(),
        cyclesAPI.getCycles(),
        symptomsAPI.getSymptoms()
      ]);
      
      setStats(statsRes.data);
      setCycles(cyclesRes.data.cycles || []);
      setSymptoms(symptomsRes.data.symptoms || []);
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
    return <div className="loading">Loading insights...</div>;
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
            <span className="logo-icon">📊</span>
            <div>
              <h1 className="logo-title">Health Insights</h1>
              <p className="logo-subtitle">Analyze your patterns</p>
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

      {/* Cycle Phase Indicator */}
      <CyclePhaseIndicator cycles={cycles} />

      {/* Fertility Calculator */}
      <FertilityCalculator cycles={cycles} />

      {/* Data Visualization */}
      <DataVisualization cycles={cycles} symptoms={symptoms} />

      {/* Health Insights Analysis */}
      <HealthInsights cycles={cycles} symptoms={symptoms} stats={stats} />

      {/* Insights Grid */}
      <div className="insights-grid">
        <SymptomInsights symptoms={symptoms} />
        <MoodTrends symptoms={symptoms} />
      </div>

      {/* Symptom Predictions */}
      <SymptomPrediction />

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
  );
}

export default HealthInsightsPage;
