import React, { useState, useEffect } from 'react';
import { Trophy, Target, Star, Award, TrendingUp, Calendar, CheckCircle, Lock } from 'lucide-react';

const HealthChallenges = () => {
  const [userProgress, setUserProgress] = useState({
    level: 1,
    xp: 0,
    totalXP: 0,
    streak: 0,
    achievements: [],
    activeChallenges: []
  });

  const [challenges] = useState([
    {
      id: 'daily-log',
      title: 'Daily Logger',
      description: 'Log your symptoms for 7 days in a row',
      type: 'daily',
      target: 7,
      xp: 100,
      icon: '📝',
      difficulty: 'easy'
    },
    {
      id: 'water-warrior',
      title: 'Water Warrior',
      description: 'Drink 8 glasses of water daily for 5 days',
      type: 'daily',
      target: 5,
      xp: 150,
      icon: '💧',
      difficulty: 'easy'
    },
    {
      id: 'cycle-tracker',
      title: 'Cycle Master',
      description: 'Track 3 complete cycles',
      type: 'milestone',
      target: 3,
      xp: 300,
      icon: '📅',
      difficulty: 'medium'
    },
    {
      id: 'exercise-enthusiast',
      title: 'Exercise Enthusiast',
      description: 'Log exercise 10 times',
      type: 'count',
      target: 10,
      xp: 200,
      icon: '🏃‍♀️',
      difficulty: 'medium'
    },
    {
      id: 'mood-tracker',
      title: 'Mood Master',
      description: 'Track your mood for 14 days straight',
      type: 'daily',
      target: 14,
      xp: 250,
      icon: '😊',
      difficulty: 'medium'
    },
    {
      id: 'sleep-champion',
      title: 'Sleep Champion',
      description: 'Log 8+ hours of sleep for 7 nights',
      type: 'daily',
      target: 7,
      xp: 200,
      icon: '😴',
      difficulty: 'medium'
    },
    {
      id: 'wellness-warrior',
      title: 'Wellness Warrior',
      description: 'Complete all daily trackers for 30 days',
      type: 'daily',
      target: 30,
      xp: 500,
      icon: '🌟',
      difficulty: 'hard'
    },
    {
      id: 'health-hero',
      title: 'Health Hero',
      description: 'Reach level 10',
      type: 'milestone',
      target: 10,
      xp: 1000,
      icon: '🦸‍♀️',
      difficulty: 'hard'
    }
  ]);

  const [achievements] = useState([
    { id: 'first-log', title: 'First Steps', description: 'Log your first entry', icon: '🎯', xp: 50 },
    { id: 'week-streak', title: 'Week Warrior', description: '7-day logging streak', icon: '🔥', xp: 100 },
    { id: 'month-streak', title: 'Monthly Master', description: '30-day logging streak', icon: '💪', xp: 300 },
    { id: 'cycle-complete', title: 'Cycle Complete', description: 'Track a complete cycle', icon: '🌙', xp: 150 },
    { id: 'symptom-expert', title: 'Symptom Expert', description: 'Log 50 symptoms', icon: '📊', xp: 200 },
    { id: 'water-master', title: 'Hydration Master', description: 'Log water 30 times', icon: '💦', xp: 150 },
    { id: 'exercise-pro', title: 'Exercise Pro', description: 'Log 25 workouts', icon: '🏋️‍♀️', xp: 250 },
    { id: 'level-5', title: 'Rising Star', description: 'Reach level 5', icon: '⭐', xp: 200 },
    { id: 'level-10', title: 'Health Champion', description: 'Reach level 10', icon: '🏆', xp: 500 },
    { id: 'all-trackers', title: 'Complete Tracker', description: 'Use all 12 trackers', icon: '✨', xp: 300 }
  ]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('healthChallengesProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    } else {
      // Initialize with default progress
      const initialProgress = {
        level: 1,
        xp: 0,
        totalXP: 0,
        streak: 0,
        achievements: [],
        activeChallenges: challenges.slice(0, 3).map(c => ({ ...c, progress: 0 }))
      };
      setUserProgress(initialProgress);
      localStorage.setItem('healthChallengesProgress', JSON.stringify(initialProgress));
    }
  }, []);

  const calculateLevel = (totalXP) => {
    return Math.floor(totalXP / 500) + 1;
  };

  const getXPForNextLevel = () => {
    return userProgress.level * 500;
  };

  const addXP = (amount) => {
    const newTotalXP = userProgress.totalXP + amount;
    const newLevel = calculateLevel(newTotalXP);
    const newXP = newTotalXP % 500;

    const updatedProgress = {
      ...userProgress,
      xp: newXP,
      totalXP: newTotalXP,
      level: newLevel
    };

    setUserProgress(updatedProgress);
    localStorage.setItem('healthChallengesProgress', JSON.stringify(updatedProgress));

    if (newLevel > userProgress.level) {
      alert(`🎉 Level Up! You're now level ${newLevel}!`);
    }
  };

  const unlockAchievement = (achievementId) => {
    if (!userProgress.achievements.includes(achievementId)) {
      const achievement = achievements.find(a => a.id === achievementId);
      const updatedProgress = {
        ...userProgress,
        achievements: [...userProgress.achievements, achievementId]
      };
      setUserProgress(updatedProgress);
      localStorage.setItem('healthChallengesProgress', JSON.stringify(updatedProgress));
      addXP(achievement.xp);
      alert(`🏆 Achievement Unlocked: ${achievement.title}! +${achievement.xp} XP`);
    }
  };

  const updateChallengeProgress = (challengeId, increment = 1) => {
    const updatedChallenges = userProgress.activeChallenges.map(challenge => {
      if (challenge.id === challengeId) {
        const newProgress = Math.min(challenge.progress + increment, challenge.target);
        if (newProgress === challenge.target && challenge.progress < challenge.target) {
          addXP(challenge.xp);
          alert(`✅ Challenge Complete: ${challenge.title}! +${challenge.xp} XP`);
        }
        return { ...challenge, progress: newProgress };
      }
      return challenge;
    });

    const updatedProgress = {
      ...userProgress,
      activeChallenges: updatedChallenges
    };

    setUserProgress(updatedProgress);
    localStorage.setItem('healthChallengesProgress', JSON.stringify(updatedProgress));
  };

  const activateChallenge = (challenge) => {
    if (userProgress.activeChallenges.length >= 3) {
      alert('You can only have 3 active challenges at a time!');
      return;
    }

    if (userProgress.activeChallenges.find(c => c.id === challenge.id)) {
      alert('This challenge is already active!');
      return;
    }

    const updatedProgress = {
      ...userProgress,
      activeChallenges: [...userProgress.activeChallenges, { ...challenge, progress: 0 }]
    };

    setUserProgress(updatedProgress);
    localStorage.setItem('healthChallengesProgress', JSON.stringify(updatedProgress));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const availableChallenges = challenges.filter(
    c => !userProgress.activeChallenges.find(ac => ac.id === c.id)
  );

  return (
    <div className="health-challenges-container">
      <div className="challenges-header">
        <h2>🏆 Health Challenges</h2>
        <p>Complete challenges, earn XP, and level up!</p>
      </div>

      {/* User Progress Card */}
      <div className="user-progress-card">
        <div className="level-badge">
          <Trophy size={32} />
          <div className="level-info">
            <span className="level-number">Level {userProgress.level}</span>
            <span className="total-xp">{userProgress.totalXP} Total XP</span>
          </div>
        </div>

        <div className="xp-progress">
          <div className="xp-bar-container">
            <div 
              className="xp-bar-fill" 
              style={{ width: `${(userProgress.xp / getXPForNextLevel()) * 100}%` }}
            ></div>
          </div>
          <span className="xp-text">{userProgress.xp} / {getXPForNextLevel()} XP</span>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <TrendingUp size={20} />
            <span className="stat-value">{userProgress.streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-item">
            <Award size={20} />
            <span className="stat-value">{userProgress.achievements.length}</span>
            <span className="stat-label">Achievements</span>
          </div>
          <div className="stat-item">
            <Target size={20} />
            <span className="stat-value">{userProgress.activeChallenges.length}</span>
            <span className="stat-label">Active Challenges</span>
          </div>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="active-challenges-section">
        <h3>🎯 Active Challenges</h3>
        {userProgress.activeChallenges.length === 0 ? (
          <div className="empty-state">
            <Target size={48} />
            <p>No active challenges</p>
            <p className="empty-hint">Select up to 3 challenges below to get started!</p>
          </div>
        ) : (
          <div className="challenges-grid">
            {userProgress.activeChallenges.map(challenge => (
              <div key={challenge.id} className="challenge-card active">
                <div className="challenge-icon">{challenge.icon}</div>
                <h4>{challenge.title}</h4>
                <p>{challenge.description}</p>
                <div className="challenge-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {challenge.progress} / {challenge.target}
                  </span>
                </div>
                <div className="challenge-footer">
                  <span className="xp-reward">+{challenge.xp} XP</span>
                  <span 
                    className="difficulty-badge" 
                    style={{ backgroundColor: getDifficultyColor(challenge.difficulty) }}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Challenges */}
      <div className="available-challenges-section">
        <h3>📋 Available Challenges</h3>
        <div className="challenges-grid">
          {availableChallenges.map(challenge => (
            <div key={challenge.id} className="challenge-card">
              <div className="challenge-icon">{challenge.icon}</div>
              <h4>{challenge.title}</h4>
              <p>{challenge.description}</p>
              <div className="challenge-footer">
                <span className="xp-reward">+{challenge.xp} XP</span>
                <span 
                  className="difficulty-badge" 
                  style={{ backgroundColor: getDifficultyColor(challenge.difficulty) }}
                >
                  {challenge.difficulty}
                </span>
              </div>
              <button 
                className="activate-challenge-btn"
                onClick={() => activateChallenge(challenge)}
                disabled={userProgress.activeChallenges.length >= 3}
              >
                {userProgress.activeChallenges.length >= 3 ? (
                  <>
                    <Lock size={16} />
                    Max Challenges
                  </>
                ) : (
                  <>
                    <Star size={16} />
                    Activate
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h3>🏅 Achievements</h3>
        <div className="achievements-grid">
          {achievements.map(achievement => {
            const isUnlocked = userProgress.achievements.includes(achievement.id);
            return (
              <div 
                key={achievement.id} 
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
                <span className="achievement-xp">+{achievement.xp} XP</span>
                {isUnlocked && (
                  <div className="unlocked-badge">
                    <CheckCircle size={20} />
                    Unlocked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HealthChallenges;
