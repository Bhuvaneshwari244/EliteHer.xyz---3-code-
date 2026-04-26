import React, { useState, useEffect } from 'react';
import { Camera, Image, Trash2, Calendar, TrendingUp, Eye, X } from 'lucide-react';

const PhotoSymptomTracker = () => {
  const [photos, setPhotos] = useState([]);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [newPhoto, setNewPhoto] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'acne',
    severity: 'moderate',
    location: 'face',
    notes: '',
    imageData: null
  });

  const categories = [
    { value: 'acne', label: 'Acne', icon: '🔴', color: '#ef4444' },
    { value: 'skin', label: 'Skin Condition', icon: '🌸', color: '#ec4899' },
    { value: 'hair', label: 'Hair Loss', icon: '💇‍♀️', color: '#8b5cf6' },
    { value: 'hirsutism', label: 'Excess Hair', icon: '🪒', color: '#f59e0b' },
    { value: 'rash', label: 'Rash/Irritation', icon: '🔥', color: '#dc2626' },
    { value: 'other', label: 'Other', icon: '📸', color: '#6b7280' }
  ];

  const severityLevels = ['mild', 'moderate', 'severe'];
  
  const locations = [
    'face', 'forehead', 'cheeks', 'chin', 'jawline', 'neck', 
    'chest', 'back', 'arms', 'legs', 'scalp', 'other'
  ];

  useEffect(() => {
    const savedPhotos = localStorage.getItem('photoSymptomTracker');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  const savePhotos = (updatedPhotos) => {
    setPhotos(updatedPhotos);
    localStorage.setItem('photoSymptomTracker', JSON.stringify(updatedPhotos));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto({ ...newPhoto, imageData: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = () => {
    if (!newPhoto.imageData) {
      alert('Please upload a photo!');
      return;
    }

    const photo = {
      id: Date.now(),
      ...newPhoto,
      timestamp: new Date().toISOString()
    };

    savePhotos([photo, ...photos]);
    setNewPhoto({
      date: new Date().toISOString().split('T')[0],
      category: 'acne',
      severity: 'moderate',
      location: 'face',
      notes: '',
      imageData: null
    });
    setShowAddPhoto(false);
  };

  const handleDeletePhoto = (id) => {
    if (window.confirm('Delete this photo entry?')) {
      savePhotos(photos.filter(photo => photo.id !== id));
    }
  };

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'severe': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const groupPhotosByCategory = () => {
    const grouped = {};
    photos.forEach(photo => {
      if (!grouped[photo.category]) {
        grouped[photo.category] = [];
      }
      grouped[photo.category].push(photo);
    });
    return grouped;
  };

  const getProgressAnalysis = (category) => {
    const categoryPhotos = photos.filter(p => p.category === category);
    if (categoryPhotos.length < 2) return null;

    const recent = categoryPhotos[0];
    const older = categoryPhotos[categoryPhotos.length - 1];

    const severityMap = { mild: 1, moderate: 2, severe: 3 };
    const recentSeverity = severityMap[recent.severity];
    const olderSeverity = severityMap[older.severity];

    if (recentSeverity < olderSeverity) return 'improving';
    if (recentSeverity > olderSeverity) return 'worsening';
    return 'stable';
  };

  const groupedPhotos = groupPhotosByCategory();

  return (
    <div className="photo-symptom-tracker-container">
      <div className="photo-tracker-header">
        <h2>📸 Photo Symptom Tracker</h2>
        <p>Track skin conditions and symptoms with photos</p>
      </div>

      <button 
        className="add-photo-btn"
        onClick={() => setShowAddPhoto(!showAddPhoto)}
      >
        <Camera size={20} />
        {showAddPhoto ? 'Cancel' : 'Add New Photo'}
      </button>

      {showAddPhoto && (
        <div className="add-photo-form">
          <h3>Add Photo Entry</h3>

          <div className="image-upload-section">
            <label className="image-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {newPhoto.imageData ? (
                <div className="image-preview">
                  <img src={newPhoto.imageData} alt="Preview" />
                  <div className="image-overlay">
                    <Camera size={32} />
                    <span>Click to change photo</span>
                  </div>
                </div>
              ) : (
                <div className="image-placeholder">
                  <Image size={48} />
                  <span>Click to upload photo</span>
                  <span className="upload-hint">Max size: 5MB</span>
                </div>
              )}
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newPhoto.date}
                onChange={(e) => setNewPhoto({ ...newPhoto, date: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={newPhoto.category}
                onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Severity</label>
              <select
                value={newPhoto.severity}
                onChange={(e) => setNewPhoto({ ...newPhoto, severity: e.target.value })}
              >
                {severityLevels.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <select
                value={newPhoto.location}
                onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc.charAt(0).toUpperCase() + loc.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              placeholder="Add any notes about this symptom..."
              value={newPhoto.notes}
              onChange={(e) => setNewPhoto({ ...newPhoto, notes: e.target.value })}
              rows="3"
            />
          </div>

          <button className="save-photo-btn" onClick={handleAddPhoto}>
            Save Photo Entry
          </button>
        </div>
      )}

      {/* Photo Gallery by Category */}
      {Object.keys(groupedPhotos).length === 0 ? (
        <div className="empty-state">
          <Camera size={48} />
          <p>No photo entries yet</p>
          <p className="empty-hint">Start tracking your symptoms with photos!</p>
        </div>
      ) : (
        <div className="photo-categories">
          {Object.entries(groupedPhotos).map(([category, categoryPhotos]) => {
            const categoryInfo = getCategoryInfo(category);
            const progress = getProgressAnalysis(category);

            return (
              <div key={category} className="category-section">
                <div className="category-header">
                  <div className="category-title">
                    <span className="category-icon" style={{ backgroundColor: categoryInfo.color }}>
                      {categoryInfo.icon}
                    </span>
                    <h3>{categoryInfo.label}</h3>
                    <span className="photo-count">({categoryPhotos.length} photos)</span>
                  </div>
                  {progress && (
                    <div className={`progress-indicator ${progress}`}>
                      <TrendingUp size={16} />
                      {progress === 'improving' && '✓ Improving'}
                      {progress === 'worsening' && '⚠ Worsening'}
                      {progress === 'stable' && '→ Stable'}
                    </div>
                  )}
                </div>

                <div className="photo-grid">
                  {categoryPhotos.map(photo => (
                    <div key={photo.id} className="photo-card">
                      <div className="photo-image" onClick={() => setSelectedPhoto(photo)}>
                        <img src={photo.imageData} alt={`${photo.category} - ${photo.date}`} />
                        <div className="photo-overlay">
                          <Eye size={24} />
                          <span>View Details</span>
                        </div>
                      </div>
                      <div className="photo-info">
                        <div className="photo-date">
                          <Calendar size={14} />
                          {new Date(photo.date).toLocaleDateString()}
                        </div>
                        <div className="photo-details">
                          <span 
                            className="severity-badge" 
                            style={{ backgroundColor: getSeverityColor(photo.severity) }}
                          >
                            {photo.severity}
                          </span>
                          <span className="location-badge">{photo.location}</span>
                        </div>
                      </div>
                      <button 
                        className="delete-photo-btn"
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPhoto(null)}>
              <X size={24} />
            </button>
            <img src={selectedPhoto.imageData} alt="Full size" />
            <div className="modal-details">
              <h3>{getCategoryInfo(selectedPhoto.category).label}</h3>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span>{new Date(selectedPhoto.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Severity:</span>
                <span 
                  className="severity-badge" 
                  style={{ backgroundColor: getSeverityColor(selectedPhoto.severity) }}
                >
                  {selectedPhoto.severity}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span>{selectedPhoto.location}</span>
              </div>
              {selectedPhoto.notes && (
                <div className="detail-notes">
                  <span className="detail-label">Notes:</span>
                  <p>{selectedPhoto.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="photo-tracker-tips">
        <h4>💡 Tips for Photo Tracking:</h4>
        <ul>
          <li>Take photos in good lighting for best results</li>
          <li>Use the same angle and distance for comparison</li>
          <li>Track regularly to see progress over time</li>
          <li>Add detailed notes about treatments or changes</li>
          <li>Photos are stored locally on your device</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoSymptomTracker;
