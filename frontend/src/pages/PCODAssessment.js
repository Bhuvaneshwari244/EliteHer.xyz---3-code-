import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionsAPI, cyclesAPI, symptomsAPI } from '../services/api';
import { AlertTriangle, CheckCircle, Info, Shield, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import { PDFExport } from '../components/PDFExport';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

function PCODAssessment() {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cycles, setCycles] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    cycle_irregularity_score: 5,
    avg_cycle_length: 28,
    weight_gain: 0,
    acne_severity: 0,
    hair_growth_score: 0,
    hair_loss: 0,
    mood_swings: 0,
    fatigue_level: 0,
    sleep_quality: 7,
    stress_level: 5
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cyclesRes, symptomsRes, statsRes] = await Promise.all([
        cyclesAPI.getCycles(),
        symptomsAPI.getSymptoms(),
        cyclesAPI.getStats()
      ]);
      setCycles(cyclesRes.data.cycles || []);
      setSymptoms(symptomsRes.data.symptoms || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAutoAssess = async () => {
    setLoading(true);
    try {
      const response = await predictionsAPI.autoAssess();
      setAssessment(response.data);
    } catch (error) {
      console.error('Error getting assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualAssess = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await predictionsAPI.assessPCODRisk(formData);
      setAssessment(response.data);
    } catch (error) {
      console.error('Error getting assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskIcon = (level) => {
    switch(level?.toLowerCase()) {
      case 'low': return <CheckCircle size={48} color="#10b981" />;
      case 'moderate': return <Info size={48} color="#f59e0b" />;
      case 'high': return <AlertTriangle size={48} color="#ef4444" />;
      default: return <Info size={48} />;
    }
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
            <span className="logo-icon">🔬</span>
            <div>
              <h1 className="logo-title">PCOD Assessment</h1>
              <p className="logo-subtitle">Risk screening & analysis</p>
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

      <div className="page-container">
      <header className="page-header">
        <h2>Get Your Risk Assessment</h2>
      </header>

      <div className="assessment-intro">
        <p>Get your personalized PCOD risk assessment based on your tracked data or manual input.</p>
        <button onClick={handleAutoAssess} className="btn-primary" disabled={loading}>
          {loading ? 'Analyzing...' : 'Auto Assess from My Data'}
        </button>
      </div>

      <div className="divider">OR</div>

      <div className="form-card">
        <h3>Manual Assessment</h3>
        <form onSubmit={handleManualAssess}>
          <div className="form-group">
            <label>Cycle Irregularity (0-10): {formData.cycle_irregularity_score}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={formData.cycle_irregularity_score}
              onChange={(e) => setFormData({...formData, cycle_irregularity_score: parseInt(e.target.value)})}
            />
            <small>0 = Very regular, 10 = Very irregular</small>
          </div>

          <div className="form-group">
            <label>Average Cycle Length (days)</label>
            <input
              type="number"
              min="15"
              max="60"
              value={formData.avg_cycle_length}
              onChange={(e) => setFormData({...formData, avg_cycle_length: parseInt(e.target.value)})}
            />
          </div>

          <div className="form-group">
            <label>Recent Weight Gain (kg): {formData.weight_gain}</label>
            <input
              type="range"
              min="0"
              max="20"
              value={formData.weight_gain}
              onChange={(e) => setFormData({...formData, weight_gain: parseInt(e.target.value)})}
            />
          </div>

          <div className="form-group">
            <label>Acne Severity (0-10): {formData.acne_severity}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={formData.acne_severity}
              onChange={(e) => setFormData({...formData, acne_severity: parseInt(e.target.value)})}
            />
          </div>

          <div className="form-group">
            <label>Excessive Hair Growth (0-10): {formData.hair_growth_score}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={formData.hair_growth_score}
              onChange={(e) => setFormData({...formData, hair_growth_score: parseInt(e.target.value)})}
            />
          </div>

          <div className="form-group">
            <label>Hair Loss (0-10): {formData.hair_loss}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={formData.hair_loss}
              onChange={(e) => setFormData({...formData, hair_loss: parseInt(e.target.value)})}
            />
          </div>

          <div className="form-group">
            <label>Stress Level (0-10): {formData.stress_level}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={formData.stress_level}
              onChange={(e) => setFormData({...formData, stress_level: parseInt(e.target.value)})}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Analyzing...' : 'Get Assessment'}
          </button>
        </form>
      </div>

      {assessment && assessment.risk_assessment && (
        <div className="assessment-result">
          <div className="risk-card" style={{borderColor: getRiskColor(assessment.risk_assessment.risk_level)}}>
            <div className="risk-icon">
              {getRiskIcon(assessment.risk_assessment.risk_level)}
            </div>
            <h2>{assessment.risk_assessment.risk_level} Risk</h2>
            <p className="risk-probability">
              {Math.round(assessment.risk_assessment.probability * 100)}% probability
            </p>
          </div>

          {assessment.risk_assessment.recommendations && (
            <div className="recommendations-section">
              <h3>Personalized Recommendations</h3>
              {assessment.risk_assessment.recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                  <div className="rec-header">
                    <strong>{rec.category}</strong>
                    <span className={`priority-badge priority-${rec.priority}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p>{rec.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="disclaimer">
            <AlertTriangle size={20} />
            <p>{assessment.disclaimer}</p>
          </div>

          {/* PDF Export Section */}
          <div style={{marginTop: '2rem'}}>
            <h3 style={{color: 'var(--coral)', marginBottom: '1rem'}}>Export Your Report</h3>
            <PDFExport 
              cycles={cycles}
              symptoms={symptoms}
              stats={stats}
              riskAssessment={assessment.risk_assessment}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default PCODAssessment;
