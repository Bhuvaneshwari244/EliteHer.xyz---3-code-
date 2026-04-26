import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

function DataVisualization({ cycles, symptoms }) {
  const [cycleLengths, setCycleLengths] = useState([]);
  const [symptomFrequency, setSymptomFrequency] = useState({});
  const [moodDistribution, setMoodDistribution] = useState({});

  useEffect(() => {
    if (cycles && cycles.length > 0) {
      const lengths = cycles.map(c => {
        if (c.end_date) {
          const start = new Date(c.start_date);
          const end = new Date(c.end_date);
          return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        }
        return null;
      }).filter(l => l !== null);
      setCycleLengths(lengths);
    }

    if (symptoms && symptoms.length > 0) {
      const freq = {};
      const moods = {};
      
      symptoms.forEach(s => {
        // Handle different symptom data structures
        if (s.symptoms && Array.isArray(s.symptoms)) {
          s.symptoms.forEach(symptom => {
            if (typeof symptom === 'string') {
              freq[symptom] = (freq[symptom] || 0) + 1;
            }
          });
        } else {
          // Extract from individual properties
          Object.keys(s).forEach(key => {
            if (s[key] && typeof s[key] === 'object' && s[key].active) {
              freq[key] = (freq[key] || 0) + 1;
            }
          });
        }
        
        if (s.mood) {
          moods[s.mood] = (moods[s.mood] || 0) + 1;
        }
      });
      
      setSymptomFrequency(freq);
      setMoodDistribution(moods);
    }
  }, [cycles, symptoms]);

  const getAverage = (arr) => {
    if (arr.length === 0) return 0;
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  };

  const getMax = (obj) => {
    const values = Object.values(obj);
    return values.length > 0 ? Math.max(...values) : 1;
  };

  return (
    <div className="data-visualization-card">
      <h3>
        <BarChart3 size={24} />
        Data Visualization
      </h3>

      {/* Cycle Length Trend */}
      <div className="viz-section">
        <h4>
          <TrendingUp size={20} />
          Cycle Length Trend
        </h4>
        {cycleLengths.length > 0 ? (
          <>
            <div className="cycle-trend-chart">
              {cycleLengths.map((length, idx) => (
                <div key={idx} className="trend-bar-container">
                  <div 
                    className="trend-bar"
                    style={{
                      height: `${(length / 40) * 100}%`,
                      background: length < 21 || length > 35 ? 'var(--rose)' : 'var(--coral)'
                    }}
                  >
                    <span className="bar-label">{length}</span>
                  </div>
                  <span className="bar-index">C{idx + 1}</span>
                </div>
              ))}
            </div>
            <div className="trend-stats">
              <div className="stat-box">
                <span className="stat-label">Average</span>
                <span className="stat-value">{getAverage(cycleLengths)} days</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Shortest</span>
                <span className="stat-value">{Math.min(...cycleLengths)} days</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Longest</span>
                <span className="stat-value">{Math.max(...cycleLengths)} days</span>
              </div>
            </div>
          </>
        ) : (
          <p className="no-data">Not enough cycle data to display trends</p>
        )}
      </div>

      {/* Symptom Frequency */}
      <div className="viz-section">
        <h4>
          <BarChart3 size={20} />
          Most Common Symptoms
        </h4>
        {Object.keys(symptomFrequency).length > 0 ? (
          <div className="symptom-bars">
            {Object.entries(symptomFrequency)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([symptom, count]) => (
                <div key={symptom} className="symptom-bar-row">
                  <span className="symptom-name">{symptom}</span>
                  <div className="symptom-bar-bg">
                    <div 
                      className="symptom-bar-fill"
                      style={{width: `${(count / getMax(symptomFrequency)) * 100}%`}}
                    >
                      <span className="symptom-count">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="no-data">No symptom data available</p>
        )}
      </div>

      {/* Mood Distribution */}
      <div className="viz-section">
        <h4>
          <PieChart size={20} />
          Mood Distribution
        </h4>
        {Object.keys(moodDistribution).length > 0 ? (
          <div className="mood-distribution">
            {Object.entries(moodDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([mood, count]) => {
                const total = Object.values(moodDistribution).reduce((a, b) => a + b, 0);
                const percentage = ((count / total) * 100).toFixed(1);
                return (
                  <div key={mood} className="mood-item">
                    <div className="mood-header">
                      <span className="mood-emoji">{getMoodEmoji(mood)}</span>
                      <span className="mood-label">{mood}</span>
                    </div>
                    <div className="mood-bar-bg">
                      <div 
                        className="mood-bar-fill"
                        style={{width: `${percentage}%`}}
                      />
                    </div>
                    <span className="mood-percentage">{percentage}%</span>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="no-data">No mood data available</p>
        )}
      </div>
    </div>
  );
}

function getMoodEmoji(mood) {
  const emojis = {
    'happy': '😊',
    'sad': '😢',
    'anxious': '😰',
    'irritable': '😤',
    'calm': '😌',
    'energetic': '⚡',
    'tired': '😴',
    'neutral': '😐'
  };
  return emojis[mood.toLowerCase()] || '😐';
}

export default DataVisualization;
