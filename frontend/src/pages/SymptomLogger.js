import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { symptomsAPI } from '../services/api';
import { Plus, Shield, ArrowLeft, Activity, Heart, Brain, Zap, Coffee, Moon } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

function SymptomLogger() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('physical');
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    
    // Physical Symptoms
    cramps: { active: false, intensity: 1 },
    bloating: { active: false, intensity: 1 },
    headache: { active: false, intensity: 1 },
    breast_tenderness: { active: false, intensity: 1 },
    acne: { active: false, intensity: 1 },
    back_pain: { active: false, intensity: 1 },
    nausea: { active: false, intensity: 1 },
    dizziness: { active: false, intensity: 1 },
    
    // Emotional Symptoms
    mood_swings: { active: false, intensity: 1 },
    anxiety: { active: false, intensity: 1 },
    depression: { active: false, intensity: 1 },
    irritability: { active: false, intensity: 1 },
    crying: { active: false, intensity: 1 },
    stress: { active: false, intensity: 1 },
    
    // Digestive Symptoms
    nausea_digestive: { active: false, intensity: 1 },
    diarrhea: { active: false, intensity: 1 },
    constipation: { active: false, intensity: 1 },
    food_cravings: { active: false, intensity: 1 },
    appetite_changes: { active: false, intensity: 1 },
    
    // Sleep & Energy
    insomnia: { active: false, intensity: 1 },
    oversleeping: { active: false, intensity: 1 },
    restless_sleep: { active: false, intensity: 1 },
    fatigue: { active: false, intensity: 1 },
    low_energy: { active: false, intensity: 1 },
    high_energy: { active: false, intensity: 1 },
    
    // Overall
    mood: 'neutral',
    energy_level: 'normal',
    pain_level: 0,
    notes: ''
  });

  const symptomCategories = {
    physical: {
      name: 'Physical',
      icon: Activity,
      color: '#ff6b9d',
      symptoms: [
        { key: 'cramps', label: 'Cramps', emoji: '🤕' },
        { key: 'bloating', label: 'Bloating', emoji: '🎈' },
        { key: 'headache', label: 'Headache', emoji: '🤯' },
        { key: 'breast_tenderness', label: 'Breast Tenderness', emoji: '💢' },
        { key: 'acne', label: 'Acne', emoji: '🔴' },
        { key: 'back_pain', label: 'Back Pain', emoji: '🦴' },
        { key: 'nausea', label: 'Nausea', emoji: '🤢' },
        { key: 'dizziness', label: 'Dizziness', emoji: '😵' }
      ]
    },
    emotional: {
      name: 'Emotional',
      icon: Heart,
      color: '#667eea',
      symptoms: [
        { key: 'mood_swings', label: 'Mood Swings', emoji: '🎭' },
        { key: 'anxiety', label: 'Anxiety', emoji: '😰' },
        { key: 'depression', label: 'Depression', emoji: '😢' },
        { key: 'irritability', label: 'Irritability', emoji: '😠' },
        { key: 'crying', label: 'Crying', emoji: '😭' },
        { key: 'stress', label: 'Stress', emoji: '😫' }
      ]
    },
    digestive: {
      name: 'Digestive',
      icon: Coffee,
      color: '#10b981',
      symptoms: [
        { key: 'nausea_digestive', label: 'Nausea', emoji: '🤮' },
        { key: 'diarrhea', label: 'Diarrhea', emoji: '💩' },
        { key: 'constipation', label: 'Constipation', emoji: '🚫' },
        { key: 'food_cravings', label: 'Food Cravings', emoji: '🍫' },
        { key: 'appetite_changes', label: 'Appetite Changes', emoji: '🍽️' }
      ]
    },
    sleep: {
      name: 'Sleep & Energy',
      icon: Moon,
      color: '#f59e0b',
      symptoms: [
        { key: 'insomnia', label: 'Insomnia', emoji: '😴' },
        { key: 'oversleeping', label: 'Oversleeping', emoji: '😪' },
        { key: 'restless_sleep', label: 'Restless Sleep', emoji: '🌙' },
        { key: 'fatigue', label: 'Fatigue', emoji: '🥱' },
        { key: 'low_energy', label: 'Low Energy', emoji: '🔋' },
        { key: 'high_energy', label: 'High Energy', emoji: '⚡' }
      ]
    }
  };

  const moodOptions = [
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' },
    { value: 'irritable', label: 'Irritable', emoji: '😠' },
    { value: 'energetic', label: 'Energetic', emoji: '🤩' },
    { value: 'tired', label: 'Tired', emoji: '😴' },
    { value: 'calm', label: 'Calm', emoji: '😌' },
    { value: 'stressed', label: 'Stressed', emoji: '😫' },
    { value: 'romantic', label: 'Romantic', emoji: '😍' },
    { value: 'confident', label: 'Confident', emoji: '😎' },
    { value: 'sensitive', label: 'Sensitive', emoji: '🥺' }
  ];

  const energyLevels = [
    { value: 'very_low', label: 'Very Low', emoji: '🪫' },
    { value: 'low', label: 'Low', emoji: '🔋' },
    { value: 'normal', label: 'Normal', emoji: '🔌' },
    { value: 'high', label: 'High', emoji: '⚡' },
    { value: 'very_high', label: 'Very High', emoji: '⚡⚡' }
  ];

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await symptomsAPI.getSymptoms();
      setSymptoms(response.data.symptoms);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      // Load from localStorage as fallback
      const savedSymptoms = localStorage.getItem('symptoms');
      if (savedSymptoms) {
        setSymptoms(JSON.parse(savedSymptoms));
      }
    }
  };

  const handleSymptomToggle = (symptomKey) => {
    setFormData({
      ...formData,
      [symptomKey]: {
        ...formData[symptomKey],
        active: !formData[symptomKey].active
      }
    });
  };

  const handleIntensityChange = (symptomKey, intensity) => {
    setFormData({
      ...formData,
      [symptomKey]: {
        ...formData[symptomKey],
        intensity: parseInt(intensity)
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const symptomData = {
      date: formData.date,
      mood: formData.mood,
      energy_level: formData.energy_level,
      pain_level: formData.pain_level,
      notes: formData.notes,
      symptoms: {}
    };

    // Collect active symptoms with their intensities
    Object.keys(formData).forEach(key => {
      if (formData[key].active !== undefined && formData[key].active) {
        symptomData.symptoms[key] = formData[key].intensity;
      }
    });

    try {
      await symptomsAPI.logSymptom(symptomData);
      setShowForm(false);
      resetForm();
      fetchSymptoms();
    } catch (error) {
      console.error('Error logging symptom:', error);
      // Save to localStorage as fallback
      const savedSymptoms = JSON.parse(localStorage.getItem('symptoms') || '[]');
      savedSymptoms.push({
        id: Date.now(),
        ...symptomData,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('symptoms', JSON.stringify(savedSymptoms));
      setSymptoms(savedSymptoms);
      setShowForm(false);
      resetForm();
    }
  };

  const resetForm = () => {
    const resetData = {
      date: new Date().toISOString().split('T')[0],
      mood: 'neutral',
      energy_level: 'normal',
      pain_level: 0,
      notes: ''
    };

    // Reset all symptoms
    Object.keys(symptomCategories).forEach(category => {
      symptomCategories[category].symptoms.forEach(symptom => {
        resetData[symptom.key] = { active: false, intensity: 1 };
      });
    });

    setFormData(resetData);
  };

  const getActiveSymptomCount = () => {
    let count = 0;
    Object.keys(formData).forEach(key => {
      if (formData[key].active) count++;
    });
    return count;
  };

  const moodEmojis = {
    happy: '😊', neutral: '😐', sad: '😢', anxious: '😰', irritable: '😠',
    energetic: '🤩', tired: '😴', calm: '😌', stressed: '😫', romantic: '😍',
    confident: '😎', sensitive: '🥺'
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
            <span className="logo-icon">📝</span>
            <div>
              <h1 className="logo-title">Symptom Logger</h1>
              <p className="logo-subtitle">Track daily symptoms</p>
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
        <h2>Symptom Tracker</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={20} /> Log Symptoms
        </button>
      </header>

      {showForm && (
        <div className="form-card symptom-form-card">
          <div className="form-header">
            <h3>Log Today's Symptoms</h3>
            <div className="symptom-counter">
              {getActiveSymptomCount()} symptoms selected
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Date Selection */}
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Mood Selection */}
            <div className="form-group">
              <label>How are you feeling today?</label>
              <div className="mood-grid">
                {moodOptions.map(mood => (
                  <button
                    key={mood.value}
                    type="button"
                    className={`mood-option ${formData.mood === mood.value ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, mood: mood.value})}
                  >
                    <span className="mood-emoji">{mood.emoji}</span>
                    <span className="mood-label">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level */}
            <div className="form-group">
              <label>Energy Level</label>
              <div className="energy-grid">
                {energyLevels.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    className={`energy-option ${formData.energy_level === level.value ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, energy_level: level.value})}
                  >
                    <span className="energy-emoji">{level.emoji}</span>
                    <span className="energy-label">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Overall Pain Level */}
            <div className="form-group">
              <label>Overall Pain Level: {formData.pain_level}/10</label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.pain_level}
                onChange={(e) => setFormData({...formData, pain_level: parseInt(e.target.value)})}
                className="pain-slider"
                style={{
                  background: `linear-gradient(to right, #ff6b9d 0%, #ff6b9d ${formData.pain_level * 10}%, #e0e0e0 ${formData.pain_level * 10}%, #e0e0e0 100%)`
                }}
              />
              <div className="pain-labels">
                <span>No Pain</span>
                <span>Severe</span>
              </div>
            </div>

            {/* Symptom Categories */}
            <div className="symptom-categories">
              <div className="category-tabs">
                {Object.keys(symptomCategories).map(categoryKey => {
                  const category = symptomCategories[categoryKey];
                  const Icon = category.icon;
                  return (
                    <button
                      key={categoryKey}
                      type="button"
                      className={`category-tab ${activeCategory === categoryKey ? 'active' : ''}`}
                      onClick={() => setActiveCategory(categoryKey)}
                      style={{
                        borderColor: activeCategory === categoryKey ? category.color : 'transparent',
                        color: activeCategory === categoryKey ? category.color : '#666'
                      }}
                    >
                      <Icon size={20} />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="category-content">
                {Object.keys(symptomCategories).map(categoryKey => {
                  const category = symptomCategories[categoryKey];
                  if (activeCategory !== categoryKey) return null;

                  return (
                    <div key={categoryKey} className="symptom-list">
                      {category.symptoms.map(symptom => (
                        <div key={symptom.key} className="symptom-item">
                          <div className="symptom-header-row">
                            <button
                              type="button"
                              className={`symptom-toggle ${formData[symptom.key].active ? 'active' : ''}`}
                              onClick={() => handleSymptomToggle(symptom.key)}
                            >
                              <span className="symptom-emoji">{symptom.emoji}</span>
                              <span className="symptom-name">{symptom.label}</span>
                              <span className="toggle-indicator">
                                {formData[symptom.key].active ? '✓' : '+'}
                              </span>
                            </button>
                          </div>
                          
                          {formData[symptom.key].active && (
                            <div className="intensity-selector">
                              <label>Intensity:</label>
                              <div className="intensity-buttons">
                                {[1, 2, 3, 4, 5].map(level => (
                                  <button
                                    key={level}
                                    type="button"
                                    className={`intensity-btn ${formData[symptom.key].intensity === level ? 'active' : ''}`}
                                    onClick={() => handleIntensityChange(symptom.key, level)}
                                    style={{
                                      background: formData[symptom.key].intensity === level 
                                        ? category.color 
                                        : 'transparent',
                                      borderColor: category.color
                                    }}
                                  >
                                    {level}
                                  </button>
                                ))}
                              </div>
                              <div className="intensity-labels">
                                <span>Mild</span>
                                <span>Severe</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional details about how you're feeling..."
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Symptoms
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="symptoms-list">
        <h3>Symptom History</h3>
        {symptoms.length === 0 ? (
          <div className="empty-state">
            <Activity size={48} color="#ccc" />
            <p>No symptoms logged yet</p>
            <p className="empty-subtitle">Start tracking to identify patterns</p>
          </div>
        ) : (
          <div className="symptoms-grid">
            {symptoms.slice().reverse().map((symptom) => (
              <div key={symptom.id} className="symptom-card">
                <div className="symptom-header">
                  <span className="symptom-date">
                    {new Date(symptom.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="symptom-mood">{moodEmojis[symptom.mood] || '😐'}</span>
                </div>
                
                <div className="symptom-stats">
                  {symptom.pain_level > 0 && (
                    <div className="stat-badge pain">
                      Pain: {symptom.pain_level}/10
                    </div>
                  )}
                  {symptom.energy_level && (
                    <div className="stat-badge energy">
                      Energy: {symptom.energy_level.replace('_', ' ')}
                    </div>
                  )}
                </div>

                {(() => {
                  // Handle different symptom data structures
                  let symptomDisplay = null;
                  
                  if (symptom.symptoms && Array.isArray(symptom.symptoms)) {
                    // Array format (from voice logger)
                    if (symptom.symptoms.length > 0) {
                      symptomDisplay = (
                        <div className="symptom-details">
                          {symptom.symptoms.map((s, idx) => (
                            <span key={idx} className="symptom-badge">
                              {typeof s === 'string' ? s.replace(/_/g, ' ') : s}
                            </span>
                          ))}
                        </div>
                      );
                    }
                  } else if (symptom.symptoms && typeof symptom.symptoms === 'object') {
                    // Object format with intensities
                    const entries = Object.entries(symptom.symptoms);
                    if (entries.length > 0) {
                      symptomDisplay = (
                        <div className="symptom-details">
                          {entries.map(([key, intensity]) => (
                            <span key={key} className="symptom-badge">
                              {key.replace(/_/g, ' ')} ({intensity}/5)
                            </span>
                          ))}
                        </div>
                      );
                    }
                  } else {
                    // Individual properties format (from symptom logger)
                    const activeSymptoms = [];
                    Object.keys(symptom).forEach(key => {
                      if (symptom[key] && typeof symptom[key] === 'object' && symptom[key].active) {
                        activeSymptoms.push({ key, intensity: symptom[key].intensity || 1 });
                      }
                    });
                    
                    if (activeSymptoms.length > 0) {
                      symptomDisplay = (
                        <div className="symptom-details">
                          {activeSymptoms.map(({ key, intensity }) => (
                            <span key={key} className="symptom-badge">
                              {key.replace(/_/g, ' ')} ({intensity}/5)
                            </span>
                          ))}
                        </div>
                      );
                    }
                  }
                  
                  return symptomDisplay;
                })()}
                
                {symptom.notes && <p className="symptom-notes">{symptom.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default SymptomLogger;
