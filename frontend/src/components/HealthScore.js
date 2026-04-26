import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Award, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function HealthScore() {
  const { t } = useLanguage();
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const [trend, setTrend] = useState('stable');

  useEffect(() => {
    calculateHealthScore();
  }, []);

  const calculateHealthScore = () => {
    // Get all health data
    const cycles = JSON.parse(localStorage.getItem('cycles') || '[]');
    const symptoms = JSON.parse(localStorage.getItem('symptoms') || '[]');
    const water = JSON.parse(localStorage.getItem('water_tracker') || '[]');
    const exercise = JSON.parse(localStorage.getItem('exercise_logs') || '[]');
    const sleep = JSON.parse(localStorage.getItem('sleep_tracker') || '[]');
    const nutrition = JSON.parse(localStorage.getItem('nutrition_tracker') || '[]');
    const goals = JSON.parse(localStorage.getItem('health_goals') || '[]');

    const today = new Date().toISOString().split('T')[0];
    const last7Days = getLast7Days();

    // Calculate component scores (0-100)
    const scores = {
      cycleTracking: calculateCycleScore(cycles),
      symptomLogging: calculateSymptomScore(symptoms, last7Days),
      hydration: calculateHydrationScore(water, today),
      exercise: calculateExerciseScore(exercise, last7Days),
      sleep: calculateSleepScore(sleep, last7Days),
      nutrition: calculateNutritionScore(nutrition, last7Days),
      goals: calculateGoalScore(goals)
    };

    // Weighted average
    const weights = {
      cycleTracking: 0.20,
      symptomLogging: 0.15,
      hydration: 0.10,
      exercise: 0.15,
      sleep: 0.15,
      nutrition: 0.15,
      goals: 0.10
    };

    const totalScore = Object.keys(scores).reduce((sum, key) => {
      return sum + (scores[key] * weights[key]);
    }, 0);

    setScore(Math.round(totalScore));
    setBreakdown(scores);

    // Calculate trend
    const previousScore = localStorage.getItem('previous_health_score');
    if (previousScore) {
      const diff = totalScore - parseInt(previousScore);
      setTrend(diff > 5 ? 'improving' : diff < -5 ? 'declining' : 'stable');
    }
    localStorage.setItem('previous_health_score', Math.round(totalScore).toString());
  };

  const getLast7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const calculateCycleScore = (cycles) => {
    if (cycles.length === 0) return 0;
    if (cycles.length >= 3) return 100;
    return (cycles.length / 3) * 100;
  };

  const calculateSymptomScore = (symptoms, last7Days) => {
    const recentLogs = symptoms.filter(s => last7Days.includes(s.date));
    return Math.min(100, (recentLogs.length / 7) * 100);
  };

  const calculateHydrationScore = (water, today) => {
    const todayData = water.find(w => w.date === today);
    if (!todayData) return 0;
    return Math.min(100, (todayData.glasses / 8) * 100);
  };

  const calculateExerciseScore = (exercise, last7Days) => {
    const recentExercise = exercise.filter(e => last7Days.includes(e.date));
    const totalMinutes = recentExercise.reduce((sum, e) => sum + e.duration, 0);
    return Math.min(100, (totalMinutes / 150) * 100); // 150 min/week recommended
  };

  const calculateSleepScore = (sleep, last7Days) => {
    const recentSleep = sleep.filter(s => last7Days.includes(s.date));
    if (recentSleep.length === 0) return 0;
    const avgDuration = recentSleep.reduce((sum, s) => sum + s.duration, 0) / recentSleep.length;
    const avgQuality = recentSleep.reduce((sum, s) => sum + s.quality, 0) / recentSleep.length;
    const durationScore = Math.min(100, (avgDuration / 8) * 100);
    const qualityScore = (avgQuality / 10) * 100;
    return (durationScore + qualityScore) / 2;
  };

  const calculateNutritionScore = (nutrition, last7Days) => {
    const recentMeals = nutrition.filter(n => last7Days.includes(n.date));
    return Math.min(100, (recentMeals.length / 21) * 100); // 3 meals/day
  };

  const calculateGoalScore = (goals) => {
    if (goals.length === 0) return 50;
    const avgProgress = goals.reduce((sum, g) => sum + g.progress, 0) / goals.length;
    return avgProgress;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return t('healthScore.excellent');
    if (score >= 60) return t('healthScore.good');
    if (score >= 40) return t('healthScore.fair');
    return t('healthScore.needsAttention');
  };

  const getTrendIcon = () => {
    if (trend === 'improving') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  const getTrendText = () => {
    if (trend === 'improving') return t('healthScore.improving');
    if (trend === 'declining') return t('healthScore.declining');
    return t('healthScore.stable');
  };

  return (
    <div className="health-score-card">
      <div className="score-header">
        <div>
          <h3>
            <Activity size={24} />
            {t('healthScore.title')}
          </h3>
          <p className="score-subtitle">{t('healthScore.subtitle')}</p>
        </div>
      </div>

      <div className="score-display">
        <div className="score-circle" style={{ borderColor: getScoreColor(score) }}>
          <div className="score-inner">
            <span className="score-value" style={{ color: getScoreColor(score) }}>
              {score}
            </span>
            <span className="score-max">/100</span>
          </div>
        </div>
        <div className="score-info">
          <div className="score-label" style={{ color: getScoreColor(score) }}>
            <Award size={20} />
            {getScoreLabel(score)}
          </div>
          <div className="score-trend">
            <span className="trend-icon">{getTrendIcon()}</span>
            <span className="trend-text">{getTrendText()}</span>
          </div>
        </div>
      </div>

      <div className="score-breakdown">
        <h4>
          <Target size={18} />
          {t('healthScore.scoreBreakdown')}
        </h4>
        <div className="breakdown-list">
          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>📅 {t('healthScore.cycleTracking')}</span>
              <span className="breakdown-value">{Math.round(breakdown.cycleTracking || 0)}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${breakdown.cycleTracking || 0}%`,
                  background: getScoreColor(breakdown.cycleTracking || 0)
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>🩺 {t('healthScore.symptomLogging')}</span>
              <span className="breakdown-value">{Math.round(breakdown.symptomLogging || 0)}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${breakdown.symptomLogging || 0}%`,
                  background: getScoreColor(breakdown.symptomLogging || 0)
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>💧 {t('healthScore.hydration')}</span>
              <span className="breakdown-value">{Math.round(breakdown.hydration || 0)}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${breakdown.hydration || 0}%`,
                  background: getScoreColor(breakdown.hydration || 0)
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>🏃‍♀️ {t('healthScore.exercise')}</span>
              <span className="breakdown-value">{Math.round(breakdown.exercise || 0)}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${breakdown.exercise || 0}%`,
                  background: getScoreColor(breakdown.exercise || 0)
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>😴 {t('healthScore.sleepQuality')}</span>
              <span className="breakdown-value">{Math.round(breakdown.sleep || 0)}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${breakdown.sleep || 0}%`,
                  background: getScoreColor(breakdown.sleep || 0)
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>🍎 {t('healthScore.nutrition')}</span>
              <span className="breakdown-value">{Math.round(breakdown.nutrition || 0)}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${breakdown.nutrition || 0}%`,
                  background: getScoreColor(breakdown.nutrition || 0)
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>🎯 {t('healthScore.goalProgress')}</span>
              <span className="breakdown-value">{Math.round(breakdown.goals || 0)}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${breakdown.goals || 0}%`,
                  background: getScoreColor(breakdown.goals || 0)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="score-tips">
        <h4>
          <TrendingUp size={18} />
          {t('healthScore.howToImprove')}
        </h4>
        <ul>
          {breakdown.cycleTracking < 80 && <li>📅 {t('healthScore.logCycles')}</li>}
          {breakdown.symptomLogging < 80 && <li>🩺 {t('healthScore.trackSymptoms')}</li>}
          {breakdown.hydration < 80 && <li>💧 {t('healthScore.drinkWater')}</li>}
          {breakdown.exercise < 80 && <li>🏃‍♀️ {t('healthScore.exerciseGoal')}</li>}
          {breakdown.sleep < 80 && <li>😴 {t('healthScore.sleepGoal')}</li>}
          {breakdown.nutrition < 80 && <li>🍎 {t('healthScore.logMeals')}</li>}
          {breakdown.goals < 80 && <li>🎯 {t('healthScore.setGoals')}</li>}
        </ul>
      </div>
    </div>
  );
}

export default HealthScore;
