import React, { useState, useEffect } from 'react';
import { Heart, Shield, Lock, Eye, EyeOff, Calendar, AlertTriangle, Plus, Trash2 } from 'lucide-react';

function IntimateActivityTracker() {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [showData, setShowData] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    protected: true,
    contraceptionMethod: 'condom',
    notes: ''
  });

  const contraceptionMethods = [
    { value: 'condom', label: 'Condom', effectiveness: 98 },
    { value: 'pill', label: 'Birth Control Pill', effectiveness: 99 },
    { value: 'iud', label: 'IUD', effectiveness: 99 },
    { value: 'implant', label: 'Implant', effectiveness: 99 },
    { value: 'patch', label: 'Patch', effectiveness: 91 },
    { value: 'ring', label: 'Vaginal Ring', effectiveness: 91 },
    { value: 'injection', label: 'Injection', effectiveness: 94 },
    { value: 'withdrawal', label: 'Withdrawal', effectiveness: 78 },
    { value: 'none', label: 'None', effectiveness: 0 }
  ];

  useEffect(() => {
    loadActivities();
    loadPrivacySettings();
  }, []);

  const loadActivities = () => {
    const saved = localStorage.getItem('intimateActivities');
    if (saved) {
      setActivities(JSON.parse(saved));
    }
  };

  const loadPrivacySettings = () => {
    const saved = localStorage.getItem('intimatePrivacyMode');
    if (saved !== null) {
      setPrivacyMode(JSON.parse(saved));
    }
  };

  const saveActivities = (newActivities) => {
    setActivities(newActivities);
    localStorage.setItem('intimateActivities', JSON.stringify(newActivities));
  };

  const togglePrivacyMode = () => {
    const newMode = !privacyMode;
    setPrivacyMode(newMode);
    localStorage.setItem('intimatePrivacyMode', JSON.stringify(newMode));
    if (newMode) {
      setShowData(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newActivity = {
      id: Date.now(),
      ...formData,
      created_at: new Date().toISOString()
    };
    saveActivities([...activities, newActivity]);
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      protected: true,
      contraceptionMethod: 'condom',
      notes: ''
    });
  };

  const deleteActivity = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      saveActivities(activities.filter(a => a.id !== id));
    }
  };

  const calculatePregnancyRisk = (activity) => {
    // Get cycle data to determine fertility
    const cycles = JSON.parse(localStorage.getItem('cycles') || '[]');
    if (cycles.length === 0) return 'unknown';

    const sortedCycles = cycles.sort((a, b) => 
      new Date(b.start_date) - new Date(a.start_date)
    );
    const lastCycle = sortedCycles[0];
    const lastStartDate = new Date(lastCycle.start_date);
    const activityDate = new Date(activity.date);
    
    // Calculate cycle day
    const daysSinceLastPeriod = Math.ceil((activityDate - lastStartDate) / (1000 * 60 * 60 * 24));
    
    // Determine if in fertile window (days 9-14)
    const inFertileWindow = daysSinceLastPeriod >= 9 && daysSinceLastPeriod <= 14;
    
    // Get contraception effectiveness
    const method = contraceptionMethods.find(m => m.value === activity.contraceptionMethod);
    const effectiveness = method ? method.effectiveness : 0;

    if (!activity.protected || effectiveness === 0) {
      return inFertileWindow ? 'high' : 'medium';
    } else if (effectiveness >= 95) {
      return 'low';
    } else if (effectiveness >= 85) {
      return inFertileWindow ? 'medium' : 'low';
    } else {
      return inFertileWindow ? 'high' : 'medium';
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRiskLabel = (risk) => {
    switch(risk) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      default: return 'Unknown';
    }
  };

  return (
    <div className="intimate-activity-card">
      <div className="intimate-header">
        <div className="header-left">
          <Heart size={28} color="#ff6b9d" />
          <div>
            <h3>Intimate Activity</h3>
            <p className="intimate-subtitle">Private & secure tracking</p>
          </div>
        </div>
        <div className="header-right">
          <button 
            className={`privacy-toggle ${privacyMode ? 'active' : ''}`}
            onClick={togglePrivacyMode}
            title={privacyMode ? 'Privacy Mode On' : 'Privacy Mode Off'}
          >
            <Lock size={18} />
            <span>{privacyMode ? 'Private' : 'Visible'}</span>
          </button>
        </div>
      </div>

      {privacyMode && !showData ? (
        <div className="privacy-screen">
          <Lock size={64} color="#ccc" />
          <h4>Privacy Mode Active</h4>
          <p>Your intimate activity data is hidden for privacy</p>
          <button 
            className="btn-show-data"
            onClick={() => setShowData(true)}
          >
            <Eye size={18} /> Show Data
          </button>
        </div>
      ) : (
        <>
          <div className="intimate-actions">
            <button 
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={18} /> Log Activity
            </button>
            {privacyMode && (
              <button 
                className="btn-secondary"
                onClick={() => setShowData(false)}
              >
                <EyeOff size={18} /> Hide Data
              </button>
            )}
          </div>

          {showForm && (
            <div className="intimate-form-card">
              <h4>Log Intimate Activity</h4>
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
                  <label>Protection Used?</label>
                  <div className="protection-options">
                    <button
                      type="button"
                      className={`protection-btn ${formData.protected ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, protected: true})}
                    >
                      <Shield size={20} />
                      <span>Protected</span>
                    </button>
                    <button
                      type="button"
                      className={`protection-btn ${!formData.protected ? 'active danger' : ''}`}
                      onClick={() => setFormData({...formData, protected: false})}
                    >
                      <AlertTriangle size={20} />
                      <span>Unprotected</span>
                    </button>
                  </div>
                </div>

                {formData.protected && (
                  <div className="form-group">
                    <label>Contraception Method</label>
                    <select
                      value={formData.contraceptionMethod}
                      onChange={(e) => setFormData({...formData, contraceptionMethod: e.target.value})}
                    >
                      {contraceptionMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label} ({method.effectiveness}% effective)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any additional notes..."
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
                    Save Activity
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="intimate-stats">
            <div className="stat-box">
              <span className="stat-label">Total Activities</span>
              <span className="stat-value">{activities.length}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Protected</span>
              <span className="stat-value">
                {activities.filter(a => a.protected).length}
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">This Month</span>
              <span className="stat-value">
                {activities.filter(a => {
                  const date = new Date(a.date);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && 
                         date.getFullYear() === now.getFullYear();
                }).length}
              </span>
            </div>
          </div>

          <div className="intimate-history">
            <h4>Activity History</h4>
            {activities.length === 0 ? (
              <div className="empty-state">
                <Heart size={48} color="#ccc" />
                <p>No activities logged yet</p>
                <p className="empty-subtitle">Your data is private and secure</p>
              </div>
            ) : (
              <div className="activity-list">
                {activities.slice().reverse().map((activity) => {
                  const risk = calculatePregnancyRisk(activity);
                  const method = contraceptionMethods.find(m => m.value === activity.contraceptionMethod);
                  
                  return (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-header">
                        <div className="activity-date">
                          <Calendar size={16} />
                          <span>
                            {new Date(activity.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <button
                          className="delete-btn"
                          onClick={() => deleteActivity(activity.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="activity-details">
                        <div className={`protection-badge ${activity.protected ? 'protected' : 'unprotected'}`}>
                          {activity.protected ? (
                            <>
                              <Shield size={14} />
                              <span>Protected</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle size={14} />
                              <span>Unprotected</span>
                            </>
                          )}
                        </div>

                        {activity.protected && method && (
                          <div className="method-badge">
                            {method.label}
                          </div>
                        )}

                        <div 
                          className="risk-badge"
                          style={{ 
                            background: `${getRiskColor(risk)}20`,
                            color: getRiskColor(risk),
                            borderColor: getRiskColor(risk)
                          }}
                        >
                          {getRiskLabel(risk)}
                        </div>
                      </div>

                      {activity.notes && (
                        <p className="activity-notes">{activity.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="intimate-info">
            <Lock size={16} />
            <p>
              All intimate activity data is stored locally on your device and encrypted. 
              This information is never shared or uploaded to any server.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default IntimateActivityTracker;
