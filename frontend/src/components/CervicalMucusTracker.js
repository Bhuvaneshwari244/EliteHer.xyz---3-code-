import React, { useState, useEffect } from 'react';
import { Droplet, Calendar, Plus, Trash2, AlertCircle, Heart } from 'lucide-react';

function CervicalMucusTracker() {
  const [observations, setObservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'dry',
    amount: 'none',
    notes: ''
  });

  const mucusTypes = [
    { 
      value: 'dry', 
      label: 'Dry', 
      emoji: '🏜️',
      fertility: 'low',
      description: 'No mucus present',
      color: '#e5e7eb'
    },
    { 
      value: 'sticky', 
      label: 'Sticky', 
      emoji: '🍯',
      fertility: 'low',
      description: 'Thick, sticky, breaks easily',
      color: '#fef3c7'
    },
    { 
      value: 'creamy', 
      label: 'Creamy', 
      emoji: '🥛',
      fertility: 'medium',
      description: 'Lotion-like, white or yellow',
      color: '#dbeafe'
    },
    { 
      value: 'watery', 
      label: 'Watery', 
      emoji: '💧',
      fertility: 'high',
      description: 'Clear, stretchy, slippery',
      color: '#bfdbfe'
    },
    { 
      value: 'egg_white', 
      label: 'Egg White', 
      emoji: '🥚',
      fertility: 'peak',
      description: 'Clear, very stretchy, slippery',
      color: '#86efac'
    }
  ];

  const amounts = [
    { value: 'none', label: 'None' },
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'heavy', label: 'Heavy' }
  ];

  useEffect(() => {
    loadObservations();
  }, []);

  const loadObservations = () => {
    const saved = localStorage.getItem('cervical_mucus');
    if (saved) {
      setObservations(JSON.parse(saved));
    }
  };

  const saveObservations = (newObs) => {
    setObservations(newObs);
    localStorage.setItem('cervical_mucus', JSON.stringify(newObs));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newObs = {
      id: Date.now(),
      ...formData,
      created_at: new Date().toISOString()
    };
    saveObservations([...observations, newObs]);
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'dry',
      amount: 'none',
      notes: ''
    });
  };

  const deleteObservation = (id) => {
    if (window.confirm('Delete this observation?')) {
      saveObservations(observations.filter(o => o.id !== id));
    }
  };

  const getCurrentFertility = () => {
    if (observations.length === 0) return null;
    
    const sorted = [...observations].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    const latest = sorted[0];
    const mucusType = mucusTypes.find(t => t.value === latest.type);
    return mucusType?.fertility;
  };

  const getFertilityColor = (fertility) => {
    switch(fertility) {
      case 'peak': return '#10b981';
      case 'high': return '#3b82f6';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const getFertilityLabel = (fertility) => {
    switch(fertility) {
      case 'peak': return 'Peak Fertility';
      case 'high': return 'High Fertility';
      case 'medium': return 'Medium Fertility';
      case 'low': return 'Low Fertility';
      default: return 'Unknown';
    }
  };

  const currentFertility = getCurrentFertility();

  return (
    <div className="cervical-mucus-card">
      <div className="mucus-header">
        <div className="header-left">
          <Droplet size={28} color="#3b82f6" />
          <div>
            <h3>Cervical Mucus Tracker</h3>
            <p className="mucus-subtitle">Track fertility signs</p>
          </div>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} /> Log Observation
        </button>
      </div>

      {/* Info Banner */}
      <div className="mucus-info-banner">
        <AlertCircle size={20} />
        <div>
          <h4>Understanding Cervical Mucus</h4>
          <p>Cervical mucus changes throughout your cycle. Egg-white consistency indicates peak fertility and is the best time for conception.</p>
        </div>
      </div>

      {/* Current Fertility Status */}
      {currentFertility && (
        <div 
          className="fertility-status-card"
          style={{ 
            background: `${getFertilityColor(currentFertility)}20`,
            borderColor: getFertilityColor(currentFertility)
          }}
        >
          <Heart size={24} color={getFertilityColor(currentFertility)} />
          <div>
            <h4>Current Status</h4>
            <p style={{ color: getFertilityColor(currentFertility) }}>
              {getFertilityLabel(currentFertility)}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mucus-form-card">
          <h4>Log Observation</h4>
          <form onSubmit={handleSubmit}>
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

            <div className="form-group">
              <label>Mucus Type</label>
              <div className="mucus-type-grid">
                {mucusTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    className={`mucus-type-btn ${formData.type === type.value ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, type: type.value})}
                    style={{
                      borderColor: formData.type === type.value ? type.color : '#e0e0e0',
                      background: formData.type === type.value ? `${type.color}40` : 'white'
                    }}
                  >
                    <span className="type-emoji">{type.emoji}</span>
                    <span className="type-label">{type.label}</span>
                    <span className="type-description">{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <div className="amount-options">
                {amounts.map(amount => (
                  <button
                    key={amount.value}
                    type="button"
                    className={`amount-btn ${formData.amount === amount.value ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, amount: amount.value})}
                  >
                    {amount.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional observations..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Observation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mucus Pattern Guide */}
      <div className="mucus-guide">
        <h4>Fertility Guide</h4>
        <div className="guide-items">
          {mucusTypes.map(type => (
            <div key={type.value} className="guide-item">
              <div 
                className="guide-indicator"
                style={{ background: type.color }}
              >
                {type.emoji}
              </div>
              <div className="guide-info">
                <h5>{type.label}</h5>
                <p>{type.description}</p>
                <span 
                  className="fertility-badge"
                  style={{ 
                    background: `${getFertilityColor(type.fertility)}20`,
                    color: getFertilityColor(type.fertility)
                  }}
                >
                  {getFertilityLabel(type.fertility)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observation History */}
      <div className="mucus-history">
        <h4>Observation History</h4>
        {observations.length === 0 ? (
          <div className="empty-state">
            <Droplet size={48} color="#ccc" />
            <p>No observations logged yet</p>
            <p className="empty-subtitle">Start tracking to identify your fertility window</p>
          </div>
        ) : (
          <div className="observation-list">
            {observations
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((obs) => {
                const mucusType = mucusTypes.find(t => t.value === obs.type);
                const amount = amounts.find(a => a.value === obs.amount);
                
                return (
                  <div key={obs.id} className="observation-item">
                    <div className="obs-header">
                      <div className="obs-date">
                        <Calendar size={16} />
                        <span>
                          {new Date(obs.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => deleteObservation(obs.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="obs-details">
                      <div 
                        className="mucus-badge"
                        style={{ 
                          background: mucusType?.color,
                          borderColor: mucusType?.color
                        }}
                      >
                        <span className="badge-emoji">{mucusType?.emoji}</span>
                        <span>{mucusType?.label}</span>
                      </div>

                      <div className="amount-badge">
                        {amount?.label} Amount
                      </div>

                      <div 
                        className="fertility-badge"
                        style={{ 
                          background: `${getFertilityColor(mucusType?.fertility)}20`,
                          color: getFertilityColor(mucusType?.fertility)
                        }}
                      >
                        {getFertilityLabel(mucusType?.fertility)}
                      </div>
                    </div>

                    {obs.notes && (
                      <p className="obs-notes">{obs.notes}</p>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div className="mucus-tip">
        <AlertCircle size={16} />
        <p>
          Check cervical mucus daily, ideally at the same time. The presence of egg-white mucus 
          indicates your most fertile days, typically 1-2 days before ovulation.
        </p>
      </div>
    </div>
  );
}

export default CervicalMucusTracker;
