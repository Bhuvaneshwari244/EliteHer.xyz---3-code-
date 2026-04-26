import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cyclesAPI } from '../services/api';
import { Plus, Shield, ArrowLeft, Calendar, Heart, TrendingUp, AlertCircle, Bell, Droplet, Activity } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

function CycleTracker() {
  const navigate = useNavigate();
  const [cycles, setCycles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    flow_intensity: 'medium',
    flow_type: 'normal' // spotting, light, medium, heavy, very_heavy
  });

  // Cycle predictions and insights
  const [cycleInsights, setCycleInsights] = useState({
    nextPeriod: null,
    daysUntilPeriod: 0,
    currentPhase: '',
    fertileWindow: { start: null, end: null },
    ovulationDay: null,
    pregnancyChance: 'low',
    cycleLength: 28,
    periodLength: 5,
    isRegular: true
  });

  useEffect(() => {
    fetchCycles();
  }, []);

  useEffect(() => {
    if (cycles.length > 0) {
      calculateCycleInsights();
    }
  }, [cycles]);

  const fetchCycles = async () => {
    try {
      const response = await cyclesAPI.getCycles();
      setCycles(response.data.cycles);
    } catch (error) {
      console.error('Error fetching cycles:', error);
      // Load from localStorage as fallback
      const savedCycles = localStorage.getItem('cycles');
      if (savedCycles) {
        setCycles(JSON.parse(savedCycles));
      }
    }
  };

  const calculateCycleInsights = () => {
    if (cycles.length === 0) return;

    // Sort cycles by date
    const sortedCycles = [...cycles].sort((a, b) => 
      new Date(b.start_date) - new Date(a.start_date)
    );

    const lastCycle = sortedCycles[0];
    const lastStartDate = new Date(lastCycle.start_date);
    
    // Calculate average cycle length
    let totalLength = 0;
    let cycleLengths = [];
    for (let i = 0; i < sortedCycles.length - 1; i++) {
      const current = new Date(sortedCycles[i].start_date);
      const next = new Date(sortedCycles[i + 1].start_date);
      const length = Math.ceil((current - next) / (1000 * 60 * 60 * 24));
      cycleLengths.push(length);
      totalLength += length;
    }
    
    const avgCycleLength = cycleLengths.length > 0 
      ? Math.round(totalLength / cycleLengths.length) 
      : 28;

    // Check cycle regularity
    const isRegular = cycleLengths.length > 0 
      ? Math.max(...cycleLengths) - Math.min(...cycleLengths) <= 7
      : true;

    // Calculate next period date
    const nextPeriodDate = new Date(lastStartDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
    
    const today = new Date();
    const daysUntil = Math.ceil((nextPeriodDate - today) / (1000 * 60 * 60 * 24));

    // Calculate current cycle day
    const daysSinceLastPeriod = Math.ceil((today - lastStartDate) / (1000 * 60 * 60 * 24));
    
    // Determine current phase
    let currentPhase = '';
    if (daysSinceLastPeriod <= 5) {
      currentPhase = 'Menstrual';
    } else if (daysSinceLastPeriod <= 13) {
      currentPhase = 'Follicular';
    } else if (daysSinceLastPeriod <= 15) {
      currentPhase = 'Ovulation';
    } else {
      currentPhase = 'Luteal';
    }

    // Calculate ovulation day (typically day 14)
    const ovulationDate = new Date(lastStartDate);
    ovulationDate.setDate(ovulationDate.getDate() + 14);

    // Calculate fertile window (5 days before ovulation + ovulation day)
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);

    // Determine pregnancy chance
    let pregnancyChance = 'low';
    if (today >= fertileStart && today <= fertileEnd) {
      if (Math.abs(today - ovulationDate) <= 1) {
        pregnancyChance = 'high';
      } else {
        pregnancyChance = 'medium';
      }
    }

    setCycleInsights({
      nextPeriod: nextPeriodDate,
      daysUntilPeriod: daysUntil,
      currentPhase,
      fertileWindow: { start: fertileStart, end: fertileEnd },
      ovulationDay: ovulationDate,
      pregnancyChance,
      cycleLength: avgCycleLength,
      periodLength: lastCycle.end_date 
        ? Math.ceil((new Date(lastCycle.end_date) - new Date(lastCycle.start_date)) / (1000 * 60 * 60 * 24))
        : 5,
      isRegular
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cyclesAPI.addCycle(formData);
      setShowForm(false);
      setFormData({ start_date: '', end_date: '', flow_intensity: 'medium', flow_type: 'normal' });
      fetchCycles();
    } catch (error) {
      console.error('Error adding cycle:', error);
      // Save to localStorage as fallback
      const savedCycles = JSON.parse(localStorage.getItem('cycles') || '[]');
      const newCycle = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString()
      };
      savedCycles.push(newCycle);
      localStorage.setItem('cycles', JSON.stringify(savedCycles));
      setCycles(savedCycles);
      setShowForm(false);
      setFormData({ start_date: '', end_date: '', flow_intensity: 'medium', flow_type: 'normal' });
    }
  };

  const getPhaseColor = (phase) => {
    switch(phase) {
      case 'Menstrual': return '#ff6b9d';
      case 'Follicular': return '#4ecdc4';
      case 'Ovulation': return '#95e1d3';
      case 'Luteal': return '#ffb6c1';
      default: return '#ccc';
    }
  };

  const getPregnancyChanceColor = (chance) => {
    switch(chance) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#ccc';
    }
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
            <span className="logo-icon">📅</span>
            <div>
              <h1 className="logo-title">Cycle Tracker</h1>
              <p className="logo-subtitle">Track your menstrual cycles</p>
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
      
      {/* Cycle Insights Dashboard */}
      <div className="cycle-insights-dashboard">
        {/* Period Countdown Card */}
        <div className="insight-card period-countdown">
          <div className="insight-icon">
            <Calendar size={32} color="#ff6b9d" />
          </div>
          <div className="insight-content">
            <h3>Next Period</h3>
            {cycleInsights.daysUntilPeriod > 0 ? (
              <>
                <div className="countdown-number">{cycleInsights.daysUntilPeriod}</div>
                <p className="countdown-label">days away</p>
                <small>{cycleInsights.nextPeriod?.toLocaleDateString()}</small>
              </>
            ) : cycleInsights.daysUntilPeriod === 0 ? (
              <p className="period-today">Expected Today!</p>
            ) : (
              <div className="period-late">
                <AlertCircle size={20} />
                <p>{Math.abs(cycleInsights.daysUntilPeriod)} days late</p>
              </div>
            )}
          </div>
          {!cycleInsights.isRegular && (
            <div className="irregular-badge">
              <Bell size={14} />
              <span>Irregular Cycle</span>
            </div>
          )}
        </div>

        {/* Current Phase Card */}
        <div className="insight-card cycle-phase" style={{borderColor: getPhaseColor(cycleInsights.currentPhase)}}>
          <div className="insight-icon">
            <Activity size={32} color={getPhaseColor(cycleInsights.currentPhase)} />
          </div>
          <div className="insight-content">
            <h3>Current Phase</h3>
            <div className="phase-name" style={{color: getPhaseColor(cycleInsights.currentPhase)}}>
              {cycleInsights.currentPhase}
            </div>
            <div className="phase-description">
              {cycleInsights.currentPhase === 'Menstrual' && 'Your period is here. Rest and self-care time.'}
              {cycleInsights.currentPhase === 'Follicular' && 'Energy rising! Great time for new activities.'}
              {cycleInsights.currentPhase === 'Ovulation' && 'Peak fertility window. High energy levels.'}
              {cycleInsights.currentPhase === 'Luteal' && 'Winding down. PMS may start soon.'}
            </div>
          </div>
        </div>

        {/* Fertility Window Card */}
        <div className="insight-card fertility-window">
          <div className="insight-icon">
            <Heart size={32} color="#10b981" />
          </div>
          <div className="insight-content">
            <h3>Fertility Status</h3>
            <div className="fertility-status">
              <div className={`pregnancy-chance ${cycleInsights.pregnancyChance}`}>
                <span className="chance-dot" style={{background: getPregnancyChanceColor(cycleInsights.pregnancyChance)}}></span>
                <span className="chance-text">{cycleInsights.pregnancyChance.toUpperCase()} Chance</span>
              </div>
            </div>
            {cycleInsights.ovulationDay && (
              <small>
                Ovulation: {cycleInsights.ovulationDay.toLocaleDateString()}
              </small>
            )}
          </div>
        </div>

        {/* Cycle Stats Card */}
        <div className="insight-card cycle-stats">
          <div className="insight-icon">
            <TrendingUp size={32} color="#667eea" />
          </div>
          <div className="insight-content">
            <h3>Cycle Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Avg Cycle</span>
                <span className="stat-value">{cycleInsights.cycleLength} days</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Period Length</span>
                <span className="stat-value">{cycleInsights.periodLength} days</span>
              </div>
            </div>
            <div className="regularity-indicator">
              <span className={`regularity-badge ${cycleInsights.isRegular ? 'regular' : 'irregular'}`}>
                {cycleInsights.isRegular ? '✓ Regular' : '⚠ Irregular'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <header className="page-header">
        <h2>Track Your Cycle</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={20} /> Log Period
        </button>
      </header>

      {showForm && (
        <div className="form-card">
          <h3>Log New Period</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Period Start Date *</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Period End Date (optional)</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                max={new Date().toISOString().split('T')[0]}
              />
              <small>Leave empty if period is ongoing</small>
            </div>

            <div className="form-group">
              <label>Flow Type *</label>
              <div className="flow-options">
                {['spotting', 'light', 'medium', 'heavy', 'very_heavy'].map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`flow-option ${formData.flow_type === type ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, flow_type: type})}
                  >
                    <Droplet size={20} />
                    <span>{type.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Flow Intensity</label>
              <select
                value={formData.flow_intensity}
                onChange={(e) => setFormData({...formData, flow_intensity: e.target.value})}
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Period
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cycles-list">
        <h3>Period History</h3>
        {cycles.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} color="#ccc" />
            <p>No periods tracked yet</p>
            <p className="empty-subtitle">Start tracking to get personalized insights</p>
          </div>
        ) : (
          <div className="cycles-grid">
            {cycles.map((cycle) => (
              <div key={cycle.id} className="cycle-card">
                <div className="cycle-date">
                  {new Date(cycle.start_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                {cycle.end_date && (
                  <div className="cycle-duration">
                    <Calendar size={14} />
                    <span>{Math.ceil((new Date(cycle.end_date) - new Date(cycle.start_date)) / (1000 * 60 * 60 * 24))} days</span>
                  </div>
                )}
                <div className={`flow-badge flow-${cycle.flow_intensity}`}>
                  <Droplet size={14} />
                  {cycle.flow_intensity} flow
                </div>
                {cycle.flow_type && (
                  <div className="flow-type-badge">
                    {cycle.flow_type.replace('_', ' ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default CycleTracker;
