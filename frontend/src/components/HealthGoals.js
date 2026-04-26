import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Edit2, CheckCircle, TrendingUp, Calendar, Award } from 'lucide-react';

const HealthGoals = () => {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'cycle',
    target: '',
    unit: 'days',
    deadline: '',
    priority: 'medium'
  });

  const goalCategories = [
    { value: 'cycle', label: 'Cycle Regularity', icon: '📅', color: '#ff6b9d' },
    { value: 'symptoms', label: 'Symptom Reduction', icon: '💊', color: '#667eea' },
    { value: 'fitness', label: 'Fitness & Exercise', icon: '🏃‍♀️', color: '#10b981' },
    { value: 'nutrition', label: 'Nutrition & Diet', icon: '🥗', color: '#f59e0b' },
    { value: 'sleep', label: 'Sleep Quality', icon: '😴', color: '#8b5cf6' },
    { value: 'weight', label: 'Weight Management', icon: '⚖️', color: '#ec4899' },
    { value: 'mental', label: 'Mental Health', icon: '🧘‍♀️', color: '#06b6d4' },
    { value: 'other', label: 'Other', icon: '🎯', color: '#6b7280' }
  ];

  const units = ['days', 'times', 'kg', 'lbs', 'hours', '%', 'points'];
  const priorities = ['low', 'medium', 'high'];

  useEffect(() => {
    const savedGoals = localStorage.getItem('healthGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    localStorage.setItem('healthGoals', JSON.stringify(updatedGoals));
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) {
      alert('Please fill in title and target!');
      return;
    }

    const goal = {
      id: Date.now(),
      ...newGoal,
      progress: 0,
      createdAt: new Date().toISOString(),
      completed: false
    };

    saveGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'cycle',
      target: '',
      unit: 'days',
      deadline: '',
      priority: 'medium'
    });
    setShowAddGoal(false);
  };

  const handleUpdateProgress = (goalId, newProgress) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const progress = Math.min(parseFloat(newProgress), parseFloat(goal.target));
        const completed = progress >= parseFloat(goal.target);
        
        if (completed && !goal.completed) {
          alert(`🎉 Goal Completed: ${goal.title}!`);
        }
        
        return { ...goal, progress, completed };
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Delete this goal?')) {
      saveGoals(goals.filter(goal => goal.id !== goalId));
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      target: goal.target,
      unit: goal.unit,
      deadline: goal.deadline,
      priority: goal.priority
    });
    setShowAddGoal(true);
  };

  const handleSaveEdit = () => {
    if (!newGoal.title || !newGoal.target) {
      alert('Please fill in title and target!');
      return;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === editingGoal.id) {
        return { ...goal, ...newGoal };
      }
      return goal;
    });

    saveGoals(updatedGoals);
    setEditingGoal(null);
    setNewGoal({
      title: '',
      description: '',
      category: 'cycle',
      target: '',
      unit: 'days',
      deadline: '',
      priority: 'medium'
    });
    setShowAddGoal(false);
  };

  const getCategoryInfo = (category) => {
    return goalCategories.find(c => c.value === category) || goalCategories[0];
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className="health-goals-container">
      <div className="goals-header">
        <h2>🎯 Health Goals</h2>
        <p>Set and track your personalized health goals</p>
      </div>

      <button 
        className="add-goal-btn"
        onClick={() => {
          setShowAddGoal(!showAddGoal);
          setEditingGoal(null);
          setNewGoal({
            title: '',
            description: '',
            category: 'cycle',
            target: '',
            unit: 'days',
            deadline: '',
            priority: 'medium'
          });
        }}
      >
        <Plus size={20} />
        {showAddGoal ? 'Cancel' : 'Add New Goal'}
      </button>

      {showAddGoal && (
        <div className="add-goal-form">
          <h3>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h3>
          
          <div className="form-group">
            <label>Goal Title *</label>
            <input
              type="text"
              placeholder="e.g., Regular 28-day cycles"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe your goal in detail..."
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
              >
                {goalCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
              >
                {priorities.map(p => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Target *</label>
              <input
                type="number"
                placeholder="e.g., 28"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
              >
                {units.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <button 
            className="save-goal-btn"
            onClick={editingGoal ? handleSaveEdit : handleAddGoal}
          >
            {editingGoal ? 'Save Changes' : 'Create Goal'}
          </button>
        </div>
      )}

      {/* Active Goals */}
      <div className="goals-section">
        <h3>🎯 Active Goals ({activeGoals.length})</h3>
        {activeGoals.length === 0 ? (
          <div className="empty-state">
            <Target size={48} />
            <p>No active goals yet</p>
            <p className="empty-hint">Create your first goal to get started!</p>
          </div>
        ) : (
          <div className="goals-grid">
            {activeGoals.map(goal => {
              const categoryInfo = getCategoryInfo(goal.category);
              const progressPercent = (goal.progress / goal.target) * 100;
              const daysRemaining = getDaysRemaining(goal.deadline);

              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <div className="goal-category" style={{ backgroundColor: categoryInfo.color }}>
                      <span>{categoryInfo.icon}</span>
                    </div>
                    <div className="goal-actions">
                      <button onClick={() => handleEditGoal(goal)}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteGoal(goal.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h4>{goal.title}</h4>
                  {goal.description && <p className="goal-description">{goal.description}</p>}

                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${Math.min(progressPercent, 100)}%`,
                          backgroundColor: categoryInfo.color
                        }}
                      ></div>
                    </div>
                    <div className="progress-info">
                      <span>{goal.progress} / {goal.target} {goal.unit}</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                  </div>

                  <div className="goal-update">
                    <label>Update Progress:</label>
                    <input
                      type="number"
                      value={goal.progress}
                      onChange={(e) => handleUpdateProgress(goal.id, e.target.value)}
                      max={goal.target}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="goal-footer">
                    <span 
                      className="priority-badge" 
                      style={{ backgroundColor: getPriorityColor(goal.priority) }}
                    >
                      {goal.priority}
                    </span>
                    {daysRemaining !== null && (
                      <span className={`deadline-badge ${daysRemaining < 7 ? 'urgent' : ''}`}>
                        <Calendar size={14} />
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="goals-section">
          <h3>✅ Completed Goals ({completedGoals.length})</h3>
          <div className="goals-grid">
            {completedGoals.map(goal => {
              const categoryInfo = getCategoryInfo(goal.category);

              return (
                <div key={goal.id} className="goal-card completed">
                  <div className="goal-header">
                    <div className="goal-category" style={{ backgroundColor: categoryInfo.color }}>
                      <span>{categoryInfo.icon}</span>
                    </div>
                    <div className="completed-badge">
                      <CheckCircle size={20} />
                      Completed
                    </div>
                  </div>

                  <h4>{goal.title}</h4>
                  {goal.description && <p className="goal-description">{goal.description}</p>}

                  <div className="goal-achievement">
                    <Award size={24} />
                    <span>Goal Achieved!</span>
                    <span className="achievement-value">
                      {goal.target} {goal.unit}
                    </span>
                  </div>

                  <button 
                    className="delete-goal-btn"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Goal Statistics */}
      {goals.length > 0 && (
        <div className="goal-stats">
          <h3>📊 Goal Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <TrendingUp size={32} />
              <span className="stat-value">{activeGoals.length}</span>
              <span className="stat-label">Active Goals</span>
            </div>
            <div className="stat-card">
              <CheckCircle size={32} />
              <span className="stat-value">{completedGoals.length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card">
              <Target size={32} />
              <span className="stat-value">
                {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
              </span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthGoals;
