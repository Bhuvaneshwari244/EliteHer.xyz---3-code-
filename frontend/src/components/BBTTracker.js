import React, { useState, useEffect } from 'react';
import { Thermometer, TrendingUp, Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';

function BBTTracker() {
  const [temperatures, setTemperatures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    temperature: '',
    time: '06:00',
    notes: ''
  });

  useEffect(() => {
    loadTemperatures();
  }, []);

  const loadTemperatures = () => {
    const saved = localStorage.getItem('bbt_temperatures');
    if (saved) {
      setTemperatures(JSON.parse(saved));
    }
  };

  const saveTemperatures = (newTemps) => {
    setTemperatures(newTemps);
    localStorage.setItem('bbt_temperatures', JSON.stringify(newTemps));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTemp = {
      id: Date.now(),
      ...formData,
      temperature: parseFloat(formData.temperature),
      created_at: new Date().toISOString()
    };
    saveTemperatures([...temperatures, newTemp]);
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      temperature: '',
      time: '06:00',
      notes: ''
    });
  };

  const deleteTemperature = (id) => {
    if (window.confirm('Delete this temperature reading?')) {
      saveTemperatures(temperatures.filter(t => t.id !== id));
    }
  };

  const getAverageTemp = () => {
    if (temperatures.length === 0) return 0;
    const sum = temperatures.reduce((acc, t) => acc + t.temperature, 0);
    return (sum / temperatures.length).toFixed(2);
  };

  const detectOvulation = () => {
    if (temperatures.length < 6) return null;
    
    // Sort by date
    const sorted = [...temperatures].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Look for temperature shift (0.4°F or 0.2°C increase sustained for 3+ days)
    for (let i = 3; i < sorted.length; i++) {
      const prevAvg = (sorted[i-3].temperature + sorted[i-2].temperature + sorted[i-1].temperature) / 3;
      const currentAvg = (sorted[i].temperature + sorted[i+1]?.temperature + sorted[i+2]?.temperature) / 3;
      
      if (currentAvg - prevAvg >= 0.4) {
        return sorted[i].date;
      }
    }
    return null;
  };

  const getTemperatureRange = () => {
    if (temperatures.length === 0) return { min: 0, max: 0 };
    const temps = temperatures.map(t => t.temperature);
    return {
      min: Math.min(...temps).toFixed(2),
      max: Math.max(...temps).toFixed(2)
    };
  };

  const ovulationDate = detectOvulation();
  const range = getTemperatureRange();

  return (
    <div className="bbt-tracker-card">
      <div className="bbt-header">
        <div className="header-left">
          <Thermometer size={28} color="#f59e0b" />
          <div>
            <h3>BBT Tracker</h3>
            <p className="bbt-subtitle">Basal Body Temperature monitoring</p>
          </div>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} /> Log Temperature
        </button>
      </div>

      {/* Info Banner */}
      <div className="bbt-info-banner">
        <AlertCircle size={20} />
        <div>
          <h4>How to measure BBT</h4>
          <p>Take your temperature first thing in the morning before getting out of bed. Use the same thermometer at the same time each day for accurate results.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bbt-stats">
        <div className="stat-box">
          <span className="stat-label">Average</span>
          <span className="stat-value">{getAverageTemp()}°F</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Range</span>
          <span className="stat-value">{range.min} - {range.max}°F</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Readings</span>
          <span className="stat-value">{temperatures.length}</span>
        </div>
      </div>

      {/* Ovulation Detection */}
      {ovulationDate && (
        <div className="ovulation-detected">
          <TrendingUp size={20} />
          <div>
            <h4>Ovulation Detected</h4>
            <p>Temperature shift detected on {new Date(ovulationDate).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bbt-form-card">
          <h4>Log Temperature</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
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
                <label>Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Temperature (°F)</label>
              <input
                type="number"
                step="0.01"
                min="95"
                max="100"
                value={formData.temperature}
                onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                placeholder="97.50"
                required
              />
              <small>Normal range: 96.0 - 99.0°F</small>
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Sleep quality, illness, stress, etc."
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
                Save Temperature
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Temperature Chart */}
      {temperatures.length > 0 && (
        <div className="bbt-chart">
          <h4>Temperature Chart</h4>
          <div className="chart-container">
            {temperatures
              .slice()
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(-14) // Show last 14 days
              .map((temp, index) => {
                const minTemp = 96;
                const maxTemp = 100;
                const height = ((temp.temperature - minTemp) / (maxTemp - minTemp)) * 100;
                
                return (
                  <div key={temp.id} className="chart-bar-container">
                    <div 
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                      title={`${temp.temperature}°F`}
                    >
                      <span className="bar-value">{temp.temperature}</span>
                    </div>
                    <span className="bar-date">
                      {new Date(temp.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Temperature History */}
      <div className="bbt-history">
        <h4>Temperature History</h4>
        {temperatures.length === 0 ? (
          <div className="empty-state">
            <Thermometer size={48} color="#ccc" />
            <p>No temperatures logged yet</p>
            <p className="empty-subtitle">Start tracking to detect ovulation patterns</p>
          </div>
        ) : (
          <div className="temperature-list">
            {temperatures
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((temp) => (
                <div key={temp.id} className="temperature-item">
                  <div className="temp-header">
                    <div className="temp-date">
                      <Calendar size={16} />
                      <span>
                        {new Date(temp.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="temp-time">{temp.time}</span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTemperature(temp.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="temp-reading">
                    <Thermometer size={24} />
                    <span className="temp-value">{temp.temperature}°F</span>
                  </div>

                  {temp.notes && (
                    <p className="temp-notes">{temp.notes}</p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="bbt-tip">
        <AlertCircle size={16} />
        <p>
          Track for at least 3 cycles to identify your ovulation pattern. 
          A sustained temperature rise of 0.4°F or more typically indicates ovulation has occurred.
        </p>
      </div>
    </div>
  );
}

export default BBTTracker;
