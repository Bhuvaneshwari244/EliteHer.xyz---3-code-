import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Calendar } from 'lucide-react';

function PCODSymptomTracker() {
  const [symptoms, setSymptoms] = useState({
    irregularPeriods: 0,
    excessiveHairGrowth: 0,
    hairLoss: 0,
    acne: 0,
    weightGain: 0,
    darkPatches: 0,
    moodSwings: 0,
    fatigue: 0,
    sleepIssues: 0,
    cravings: 0
  });

  const [trackingHistory, setTrackingHistory] = useState([]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('pcodSymptoms');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setTrackingHistory(parsedData);
      }
    } catch (error) {
      console.error('Error loading PCOD symptoms:', error);
    }
  }, []);

  const symptomLabels = {
    irregularPeriods: 'Irregular Periods',
    excessiveHairGrowth: 'Excessive Hair Growth (Hirsutism)',
    hairLoss: 'Hair Loss/Thinning',
    acne: 'Acne/Oily Skin',
    weightGain: 'Weight Gain/Difficulty Losing Weight',
    darkPatches: 'Dark Skin Patches (Acanthosis)',
    moodSwings: 'Mood Swings/Anxiety',
    fatigue: 'Chronic Fatigue',
    sleepIssues: 'Sleep Problems',
    cravings: 'Sugar/Carb Cravings'
  };

  const handleSymptomChange = (symptom, value) => {
    setSymptoms({ ...symptoms, [symptom]: parseInt(value) });
  };

  const calculatePCODScore = () => {
    const total = Object.values(symptoms).reduce((sum, val) => sum + val, 0);
    const maxScore = Object.keys(symptoms).length * 10;
    return Math.round((total / maxScore) * 100);
  };

  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: '#4caf50', message: 'Symptoms are minimal' };
    if (score < 60) return { level: 'Moderate', color: '#ff9800', message: 'Monitor symptoms closely' };
    return { level: 'High', color: '#f44336', message: 'Consult a doctor soon' };
  };

  const saveTracking = () => {
    // Check if any symptoms are tracked
    const hasData = Object.values(symptoms).some(val => val > 0);
    
    if (!hasData) {
      alert('⚠️ Please rate at least one symptom before saving!');
      return;
    }

    const entry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      symptoms: { ...symptoms },
      score: calculatePCODScore()
    };
    
    const updatedHistory = [entry, ...trackingHistory];
    setTrackingHistory(updatedHistory);
    
    // Save to localStorage
    try {
      localStorage.setItem('pcodSymptoms', JSON.stringify(updatedHistory));
      alert('✅ PCOD symptoms tracked successfully!\n\nYour data has been saved.');
    } catch (error) {
      console.error('Error saving PCOD symptoms:', error);
      alert('❌ Error saving data. Please try again.');
    }
  };

  const score = calculatePCODScore();
  const risk = getRiskLevel(score);

  return (
    <div className="pcod-symptom-tracker">
      <div className="tracker-header">
        <AlertCircle size={24} />
        <h3>PCOD Symptom Tracker</h3>
      </div>

      <div className="info-card">
        <p>Track your PCOD-related symptoms daily to monitor patterns and share with your doctor.</p>
        <p><strong>Rate each symptom from 0 (none) to 10 (severe)</strong></p>
      </div>

      <div className="score-card" style={{ borderColor: risk.color }}>
        <div className="score-display" style={{ background: risk.color }}>
          <span className="score-number">{score}%</span>
          <span className="score-label">Symptom Severity</span>
        </div>
        <div className="risk-info">
          <strong style={{ color: risk.color }}>{risk.level} Risk</strong>
          <p>{risk.message}</p>
        </div>
      </div>

      <div className="symptoms-grid">
        {Object.entries(symptomLabels).map(([key, label]) => (
          <div key={key} className="symptom-item">
            <div className="symptom-header">
              <label>{label}</label>
              <span className="slider-value">{symptoms[key]}/10</span>
            </div>
            <div className="slider-container">
              <input 
                type="range"
                min="0"
                max="10"
                value={symptoms[key]}
                onChange={(e) => handleSymptomChange(key, e.target.value)}
                style={{
                  background: `linear-gradient(to right, #ff6b6b ${symptoms[key] * 10}%, #ddd ${symptoms[key] * 10}%)`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="save-btn" onClick={saveTracking}>
        <Calendar size={18} />
        Save Today's Tracking
      </button>

      {trackingHistory.length > 0 && (
        <div className="tracking-history">
          <h4>
            <TrendingUp size={18} />
            Tracking History
          </h4>
          <div className="history-chart">
            {trackingHistory.slice(0, 7).map((entry, index) => (
              <div key={index} className="history-bar">
                <div 
                  className="bar-fill" 
                  style={{ 
                    height: `${entry.score}%`,
                    background: getRiskLevel(entry.score).color
                  }}
                />
                <span className="bar-date">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pcod-tips">
        <h4>💡 Managing PCOD Symptoms:</h4>
        <ul>
          <li><strong>Diet:</strong> Low GI foods, reduce sugar and processed carbs</li>
          <li><strong>Exercise:</strong> 30 minutes daily, especially strength training</li>
          <li><strong>Weight:</strong> Even 5-10% weight loss can improve symptoms</li>
          <li><strong>Supplements:</strong> Inositol, Vitamin D, Omega-3</li>
          <li><strong>Stress:</strong> Practice yoga, meditation, adequate sleep</li>
          <li><strong>Medical:</strong> Consult gynecologist for treatment options</li>
        </ul>
      </div>

      <style jsx>{`
        .pcod-symptom-tracker {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin: 20px 0;
        }

        .tracker-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: #ff6b6b;
        }

        .info-card {
          background: #fff5f5;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #ff6b6b;
        }

        .info-card p {
          margin: 4px 0;
          color: #666;
        }

        .score-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border: 3px solid;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .score-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          color: white;
        }

        .score-number {
          font-size: 36px;
          font-weight: bold;
        }

        .score-label {
          font-size: 12px;
          margin-top: 4px;
        }

        .risk-info {
          flex: 1;
        }

        .risk-info strong {
          font-size: 20px;
          display: block;
          margin-bottom: 8px;
        }

        .risk-info p {
          margin: 0;
          color: #666;
        }

        .symptoms-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 1024px) {
          .symptoms-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .symptoms-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .symptoms-grid {
            grid-template-columns: 1fr;
          }
        }

        .symptom-item {
          margin-bottom: 0;
          padding: 16px;
          background: rgba(255, 107, 107, 0.05);
          border: 1px solid rgba(255, 107, 107, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .symptom-item:hover {
          background: rgba(255, 107, 107, 0.08);
          border-color: rgba(255, 107, 107, 0.2);
          transform: none;
        }

        .symptom-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 8px;
          min-height: 40px;
        }

        .symptom-item label {
          font-weight: 600;
          color: #333;
          margin: 0;
          flex: 1;
          font-size: 13px;
          line-height: 1.3;
          padding-right: 4px;
          word-break: break-word;
          max-width: calc(100% - 60px);
        }

        .slider-value {
          min-width: 48px;
          max-width: 48px;
          text-align: center;
          font-weight: 700;
          font-size: 14px;
          color: #ff6b6b;
          background: white;
          padding: 4px 6px;
          border-radius: 6px;
          border: 2px solid #ff6b6b;
          flex-shrink: 0;
          height: fit-content;
        }

        .slider-container {
          width: 100%;
        }

        .slider-container input[type="range"] {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          outline: none;
          -webkit-appearance: none;
        }

        .slider-container input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ff6b6b;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-container input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ff6b6b;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .save-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .tracking-history {
          margin-top: 24px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .tracking-history h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 16px 0;
        }

        .history-chart {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          height: 150px;
          padding: 10px 0;
        }

        .history-bar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .bar-fill {
          width: 100%;
          border-radius: 4px 4px 0 0;
          transition: height 0.3s ease;
          margin-top: auto;
        }

        .bar-date {
          font-size: 11px;
          color: #666;
          margin-top: 8px;
        }

        .pcod-tips {
          background: #fff5f5;
          padding: 16px;
          border-radius: 8px;
          margin-top: 24px;
        }

        .pcod-tips h4 {
          margin: 0 0 12px 0;
        }

        .pcod-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .pcod-tips li {
          padding: 8px 0;
          color: #666;
          font-size: 14px;
        }

        .pcod-tips strong {
          color: #ff6b6b;
        }

        @media (max-width: 768px) {
          .score-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default PCODSymptomTracker;
