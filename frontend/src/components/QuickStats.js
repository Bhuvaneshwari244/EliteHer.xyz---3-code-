import React, { useState, useEffect } from 'react';
import { Calendar, Activity, Droplet, Moon, Apple, Target, TrendingUp } from 'lucide-react';
import AnimatedCounter, { PercentageCounter, DaysCounter } from './AnimatedCounter';
import { useLanguage } from '../context/LanguageContext';

function QuickStats() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    cyclesLogged: 0,
    symptomsLogged: 0,
    waterToday: 0,
    exerciseThisWeek: 0,
    sleepAverage: 0,
    mealsToday: 0,
    activeGoals: 0,
    streakDays: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    calculateStats();
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const calculateStats = () => {
    const cycles = JSON.parse(localStorage.getItem('cycles') || '[]');
    const symptoms = JSON.parse(localStorage.getItem('symptoms') || '[]');
    const water = JSON.parse(localStorage.getItem('water_tracker') || '[]');
    const exercise = JSON.parse(localStorage.getItem('exercise_logs') || '[]');
    const sleep = JSON.parse(localStorage.getItem('sleep_tracker') || '[]');
    const nutrition = JSON.parse(localStorage.getItem('nutrition_tracker') || '[]');
    const goals = JSON.parse(localStorage.getItem('health_goals') || '[]');

    const today = new Date().toISOString().split('T')[0];
    const last7Days = getLast7Days();

    // Water today
    const todayWater = water.find(w => w.date === today);
    const waterCount = todayWater ? todayWater.glasses : 0;

    // Exercise this week
    const weekExercise = exercise.filter(e => last7Days.includes(e.date));
    const totalMinutes = weekExercise.reduce((sum, e) => sum + e.duration, 0);

    // Sleep average
    const recentSleep = sleep.filter(s => last7Days.includes(s.date));
    const avgSleep = recentSleep.length > 0
      ? (recentSleep.reduce((sum, s) => sum + s.duration, 0) / recentSleep.length).toFixed(1)
      : 0;

    // Meals today
    const todayMeals = nutrition.filter(n => n.date === today);

    // Active goals
    const activeGoals = goals.filter(g => !g.completed);

    // Calculate streak
    const streak = calculateStreak(symptoms);

    setStats({
      cyclesLogged: cycles.length,
      symptomsLogged: symptoms.length,
      waterToday: waterCount,
      exerciseThisWeek: totalMinutes,
      sleepAverage: avgSleep,
      mealsToday: todayMeals.length,
      activeGoals: activeGoals.length,
      streakDays: streak
    });
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

  const calculateStreak = (symptoms) => {
    if (symptoms.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasLog = symptoms.some(s => s.date === dateStr);
      if (hasLog) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className={`quick-stats-card fade-in-delay-2 ${isVisible ? 'stats-visible' : ''}`}>
      <div className="quick-stats-header slide-in-down">
        <h3>
          <TrendingUp size={24} className="pulse" />
          {t('quickStats.title')}
        </h3>
        <p className="quick-stats-subtitle">{t('quickStats.subtitle')}</p>
      </div>

      <div className="stats-grid-compact">
        <div className="stat-compact stagger-item scale-on-hover">
          <div className="stat-icon float" style={{ background: '#fef3c7' }}>
            <Calendar size={20} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <span className="stat-number">
              <AnimatedCounter end={isVisible ? stats.cyclesLogged : 0} duration={1000} />
            </span>
            <span className="stat-text">{t('quickStats.cyclesLogged')}</span>
          </div>
        </div>

        <div className="stat-compact stagger-item scale-on-hover">
          <div className="stat-icon pulse" style={{ background: '#fce7f3' }}>
            <Activity size={20} color="#ec4899" />
          </div>
          <div className="stat-content">
            <span className="stat-number">
              <AnimatedCounter end={isVisible ? stats.symptomsLogged : 0} duration={1200} />
            </span>
            <span className="stat-text">{t('quickStats.symptomsLogged')}</span>
          </div>
        </div>

        <div className="stat-compact stagger-item scale-on-hover">
          <div className="stat-icon heartbeat" style={{ background: '#dbeafe' }}>
            <Droplet size={20} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <span className="stat-number">
              <AnimatedCounter end={isVisible ? stats.waterToday : 0} duration={800} />/8
            </span>
            <span className="stat-text">{t('quickStats.waterToday')}</span>
          </div>
        </div>

        <div className="stat-compact stagger-item scale-on-hover">
          <div className="stat-icon rotate-on-hover" style={{ background: '#d1fae5' }}>
            <Activity size={20} color="#10b981" />
          </div>
          <div className="stat-content">
            <span className="stat-number">
              <AnimatedCounter end={isVisible ? stats.exerciseThisWeek : 0} duration={1500} />m
            </span>
            <span className="stat-text">{t('quickStats.exerciseWeek')}</span>
          </div>
        </div>

        <div className="stat-compact stagger-item scale-on-hover">
          <div className="stat-icon float" style={{ background: '#e0e7ff' }}>
            <Moon size={20} color="#6366f1" />
          </div>
          <div className="stat-content">
            <span className="stat-number">
              <AnimatedCounter 
                end={isVisible ? parseFloat(stats.sleepAverage) : 0} 
                duration={1000} 
                decimals={1}
              />h
            </span>
            <span className="stat-text">{t('quickStats.avgSleep')}</span>
          </div>
        </div>

        <div className="stat-compact stagger-item scale-on-hover">
          <div className="stat-icon bounce-in" style={{ background: '#fef3c7' }}>
            <Apple size={20} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <span className="stat-number">
              <AnimatedCounter end={isVisible ? stats.mealsToday : 0} duration={600} />
            </span>
            <span className="stat-text">{t('quickStats.mealsToday')}</span>
          </div>
        </div>

        <div className="stat-compact stagger-item scale-on-hover">
          <div className="stat-icon wobble" style={{ background: '#fce7f3' }}>
            <Target size={20} color="#ec4899" />
          </div>
          <div className="stat-content">
            <span className="stat-number">
              <AnimatedCounter end={isVisible ? stats.activeGoals : 0} duration={900} />
            </span>
            <span className="stat-text">{t('quickStats.activeGoals')}</span>
          </div>
        </div>

        <div className="stat-compact streak-stat stagger-item scale-on-hover">
          <div className="stat-icon heartbeat" style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)' }}>
            <span className="streak-emoji">🔥</span>
          </div>
          <div className="stat-content">
            <span className="stat-number">
              <DaysCounter value={isVisible ? stats.streakDays : 0} duration={2000} />
            </span>
            <span className="stat-text">{t('quickStats.dayStreak')}</span>
          </div>
        </div>
      </div>

      {stats.streakDays >= 7 && (
        <div className="streak-celebration bounce-in">
          <span className="celebration-emoji heartbeat">🎉</span>
          <span className="celebration-text">
            {t('quickStats.amazing')} {t('quickStats.loggedDays').replace('days', stats.streakDays)}
          </span>
        </div>
      )}
    </div>
  );
}

export default QuickStats;
