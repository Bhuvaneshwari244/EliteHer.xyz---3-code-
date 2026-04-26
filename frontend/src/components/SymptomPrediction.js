import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Calendar, Activity } from 'lucide-react';

function SymptomPrediction() {
  const [predictions, setPredictions] = useState([]);
  const [patterns, setPatterns] = useState(null);

  useEffect(() => {
    analyzePatternsAndPredict();
  }, []);

  const analyzePatternsAndPredict = () => {
    try {
      const symptoms = JSON.parse(localStorage.getItem('symptoms') || '[]');
      const cycles = JSON.parse(localStorage.getItem('cycles') || '[]');

      if (!Array.isArray(symptoms) || symptoms.length < 3) {
        setPredictions([]);
        setPatterns(null);
        return;
      }

      // Analyze symptom patterns by cycle phase
      const phaseSymptoms = {
        menstrual: {},
        follicular: {},
        ovulation: {},
        luteal: {}
      };

      symptoms.forEach(symptom => {
        try {
          const date = new Date(symptom.date || symptom.created_at);
          if (isNaN(date.getTime())) return; // Skip invalid dates
          
          const phase = determinePhase(date, cycles);
          
          // Handle different symptom data structures
          let activeSymptoms = [];
          
          if (symptom.symptoms && Array.isArray(symptom.symptoms)) {
            // If symptoms is an array (from voice logger)
            activeSymptoms = symptom.symptoms;
          } else {
            // If symptoms are stored as individual properties (from symptom logger)
            Object.keys(symptom).forEach(key => {
              if (symptom[key] && typeof symptom[key] === 'object' && symptom[key].active) {
                activeSymptoms.push(key);
              }
            });
          }
          
          activeSymptoms.forEach(s => {
            if (typeof s === 'string') {
              if (!phaseSymptoms[phase][s]) {
                phaseSymptoms[phase][s] = 0;
              }
              phaseSymptoms[phase][s]++;
            }
          });
        } catch (error) {
          console.warn('Error processing symptom:', symptom, error);
        }
      });

    // Generate predictions for next 7 days
    const today = new Date();
    const nextWeek = [];
    
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const phase = determinePhase(futureDate, cycles);
      
      const likelySymptoms = Object.entries(phaseSymptoms[phase] || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([symptom, count]) => ({
          symptom,
          probability: Math.min(95, (count / symptoms.length) * 100)
        }));

      if (likelySymptoms.length > 0) {
        nextWeek.push({
          date: futureDate,
          phase,
          symptoms: likelySymptoms
        });
      }
    }

    setPredictions(nextWeek);
    
    // Calculate overall patterns
    let allSymptoms = [];
    symptoms.forEach(symptom => {
      try {
        if (symptom.symptoms && Array.isArray(symptom.symptoms)) {
          allSymptoms = allSymptoms.concat(symptom.symptoms.filter(s => typeof s === 'string'));
        } else {
          Object.keys(symptom).forEach(key => {
            if (symptom[key] && typeof symptom[key] === 'object' && symptom[key].active) {
              allSymptoms.push(key);
            }
          });
        }
      } catch (error) {
        console.warn('Error processing symptom for patterns:', symptom, error);
      }
    });
    
    const symptomCounts = {};
    allSymptoms.forEach(s => {
      if (typeof s === 'string') {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      }
    });

    const mostCommon = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setPatterns({
      mostCommon,
      totalLogs: symptoms.length,
      avgSymptomsPerDay: allSymptoms.length > 0 ? (allSymptoms.length / symptoms.length).toFixed(1) : '0'
    });
  } catch (error) {
    console.error('Error in analyzePatternsAndPredict:', error);
    setPredictions([]);
    setPatterns(null);
  }
};

  const determinePhase = (date, cycles) => {
    if (cycles.length === 0) return 'follicular';
    
    const lastCycle = cycles[0];
    const lastPeriod = new Date(lastCycle.start_date);
    const daysSince = Math.floor((date - lastPeriod) / (1000 * 60 * 60 * 24));
    
    if (daysSince < 0) return 'follicular';
    if (daysSince <= 5) return 'menstrual';
    if (daysSince <= 13) return 'follicular';
    if (daysSince <= 16) return 'ovulation';
    return 'luteal';
  };

  const getPhaseColor = (phase) => {
    const colors = {
      menstrual: '#ef4444',
      follicular: '#10b981',
      ovulation: '#f59e0b',
      luteal: '#8b5cf6'
    };
    return colors[phase] || '#6366f1';
  };

  const getPhaseEmoji = (phase) => {
    const emojis = {
      menstrual: '🩸',
      follicular: '🌱',
      ovulation: '🌸',
      luteal: '🌙'
    };
    return emojis[phase] || '📅';
  };

  return (
    <div className="symptom-prediction-card">
      <div className="prediction-header">
        <div>
          <h3>
            <TrendingUp size={24} />
            Symptom Predictions
          </h3>
          <p className="prediction-subtitle">AI-powered insights based on your patterns</p>
        </div>
      </div>

      {patterns && (
        <div className="pattern-summary">
          <div className="pattern-stat">
            <Activity size={20} />
            <div>
              <span className="pattern-value">{patterns.totalLogs}</span>
              <span className="pattern-label">Total Logs</span>
            </div>
          </div>
          <div className="pattern-stat">
            <Calendar size={20} />
            <div>
              <span className="pattern-value">{patterns.avgSymptomsPerDay}</span>
              <span className="pattern-label">Avg Symptoms/Day</span>
            </div>
          </div>
        </div>
      )}

      {predictions.length > 0 ? (
        <div className="predictions-timeline">
          <h4>📅 Next 7 Days Forecast</h4>
          {predictions.map((pred, idx) => (
            <div key={idx} className="prediction-day">
              <div className="prediction-date">
                <span className="date-text">
                  {pred.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span 
                  className="phase-badge"
                  style={{ background: getPhaseColor(pred.phase) }}
                >
                  {getPhaseEmoji(pred.phase)} {pred.phase}
                </span>
              </div>
              <div className="prediction-symptoms">
                {pred.symptoms.map((s, i) => (
                  <div key={i} className="predicted-symptom">
                    <span className="symptom-name">{s.symptom}</span>
                    <div className="probability-bar">
                      <div 
                        className="probability-fill"
                        style={{ width: `${s.probability}%` }}
                      />
                    </div>
                    <span className="probability-text">{s.probability.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <AlertCircle size={48} color="#ccc" />
          <p>Not enough data yet</p>
          <p className="empty-subtitle">Log symptoms for at least 3 days to see predictions</p>
        </div>
      )}

      {patterns && patterns.mostCommon.length > 0 && (
        <div className="common-symptoms">
          <h4>🔍 Your Most Common Symptoms</h4>
          <div className="common-list">
            {patterns.mostCommon.map(([symptom, count], idx) => (
              <div key={idx} className="common-item">
                <span className="rank">#{idx + 1}</span>
                <span className="symptom-text">{symptom}</span>
                <span className="count-badge">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="prediction-disclaimer">
        <AlertCircle size={16} />
        <span>Predictions are based on your historical data and may vary</span>
      </div>
    </div>
  );
}

export default SymptomPrediction;
