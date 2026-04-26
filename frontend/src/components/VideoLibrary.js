import React, { useState } from 'react';
import { Play, Clock, Users, Star, Filter } from 'lucide-react';

function VideoLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');

  const videoCategories = [
    { id: 'all', name: 'All Videos', icon: '🎬' },
    { id: 'yoga', name: 'Yoga & Exercise', icon: '🧘‍♀️' },
    { id: 'nutrition', name: 'Healthy Recipes', icon: '🥗' },
    { id: 'meditation', name: 'Meditation', icon: '🧠' },
    { id: 'pcod', name: 'PCOD Management', icon: '💊' },
    { id: 'cycle', name: 'Cycle Education', icon: '📚' },
    { id: 'wellness', name: 'General Wellness', icon: '🌸' }
  ];

  const videos = [
    // Yoga & Exercise Videos - ONLY YOUR CONFIRMED WORKING VIDEOS + GUARANTEED ONES
    {
      id: 1,
      title: "Yoga for Cramps and PMS",
      category: 'yoga',
      duration: '20 min',
      difficulty: 'Beginner',
      rating: 4.8,
      views: '2.1M',
      thumbnail: 'https://img.youtube.com/vi/2X78NWuRfJU/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/2X78NWuRfJU',
      description: 'Gentle, loving yoga practice specifically designed to support you during menstrual discomfort. This restorative sequence includes hip openers, gentle twists, and calming poses to ease cramps and reduce PMS symptoms. Perfect for when you need extra self-care and comfort.',
      instructor: 'Yoga with Adriene'
    },
    {
      id: 2,
      title: "Yoga for Cramps Relief - Quick Poses",
      category: 'yoga',
      duration: '1 min',
      difficulty: 'Beginner',
      rating: 4.9,
      views: '890K',
      thumbnail: 'https://img.youtube.com/vi/p42yQehyN5A/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/p42yQehyN5A',
      description: 'Quick and effective yoga poses you can do anywhere to instantly relieve menstrual cramps. This YouTube Short demonstrates simple stretches and poses that target the lower back and pelvis to provide immediate relief from period pain.',
      instructor: 'Yoga Shorts'
    },
    {
      id: 3,
      title: "Yoga for Complete Beginners",
      category: 'yoga',
      duration: '20 min',
      difficulty: 'Beginner',
      rating: 4.9,
      views: '12M',
      thumbnail: 'https://img.youtube.com/vi/v7AYKMP6rOE/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/v7AYKMP6rOE',
      description: 'Perfect introduction to yoga for absolute beginners. This 20-minute session covers foundational poses, proper breathing techniques, and basic alignment. Adriene guides you through each movement with clear instructions, making it ideal for those starting their yoga journey.',
      instructor: 'Yoga with Adriene'
    },
    {
      id: 4,
      title: "Yoga for Weight Loss",
      category: 'yoga',
      duration: '37 min',
      difficulty: 'Intermediate',
      rating: 4.6,
      views: '8.2M',
      thumbnail: 'https://img.youtube.com/vi/oBu-pQG6sTY/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/oBu-pQG6sTY',
      description: 'Dynamic yoga flow designed to boost metabolism and support healthy weight management. This energizing practice combines strength-building poses with cardio elements to help burn calories while building lean muscle. Great for PCOS management and overall fitness.',
      instructor: 'Yoga with Adriene'
    },

    // Meditation Videos - GUARANTEED WORKING IDs
    {
      id: 5,
      title: "Period Pain Relief Meditation",
      category: 'meditation',
      duration: '11 hours',
      difficulty: 'Beginner',
      rating: 4.9,
      views: '567K',
      thumbnail: 'https://img.youtube.com/vi/SVLBOoKajto/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/SVLBOoKajto',
      description: 'Extended subliminal meditation specifically designed for natural period pain and cramp relief. This long-form meditation uses gentle frequencies and affirmations to help your body release tension and reduce menstrual discomfort. Perfect for overnight listening or extended relaxation sessions.',
      instructor: 'Cloud Meditation'
    },
    {
      id: 6,
      title: "Relaxing Music for Stress Relief",
      category: 'meditation',
      duration: '3 hours',
      difficulty: 'Beginner',
      rating: 4.8,
      views: '50M',
      thumbnail: 'https://img.youtube.com/vi/lFcSrYw-ARY/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/lFcSrYw-ARY',
      description: 'Peaceful and relaxing music perfect for meditation, stress relief, and creating a calming atmosphere. This gentle instrumental music helps reduce anxiety and promotes deep relaxation, making it ideal for managing PMS symptoms and daily stress.',
      instructor: 'Relaxing Music'
    },
    {
      id: 7,
      title: "Guided Meditation for Sleep",
      category: 'meditation',
      duration: '30 min',
      difficulty: 'Beginner',
      rating: 4.7,
      views: '10M',
      thumbnail: 'https://img.youtube.com/vi/WHzzeDuoNfI/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/WHzzeDuoNfI',
      description: 'Deeply relaxing sleep meditation designed to help you fall asleep naturally and peacefully. This guided practice helps calm the nervous system, reduce stress, and support natural sleep cycles. Perfect for those dealing with hormonal changes, PMS, or sleep disturbances.',
      instructor: 'Sleep Meditation'
    },

    // Nutrition & Health Education - SIMPLE GUARANTEED VIDEOS
    {
      id: 8,
      title: "Healthy Eating Basics",
      category: 'nutrition',
      duration: '10 min',
      difficulty: 'Educational',
      rating: 4.6,
      views: '5M',
      thumbnail: 'https://img.youtube.com/vi/I94SJM07PSE/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/I94SJM07PSE',
      description: 'Essential guide to healthy eating principles and nutrition basics. Learn about balanced meals, portion control, and foods that support overall health and hormonal balance. Great foundation for anyone starting their wellness journey and managing PCOS symptoms through diet.',
      instructor: 'Health Education'
    },
    {
      id: 13,
      title: "PCOD-Friendly Breakfast Ideas",
      category: 'nutrition',
      duration: '1 min',
      difficulty: 'Easy',
      rating: 4.9,
      views: '125K',
      thumbnail: 'https://img.youtube.com/vi/xEfks1IgPB4/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/xEfks1IgPB4',
      description: 'Quick and easy PCOD-friendly breakfast ideas that help balance hormones and manage symptoms. These nutritious breakfast options are specifically designed for women with PCOS, featuring low-glycemic ingredients, high protein, and healthy fats to keep blood sugar stable throughout the morning.',
      instructor: 'PCOD Nutrition Expert'
    },
    {
      id: 18,
      title: "PCOS Breakfast Ideas - Quick & Healthy",
      category: 'nutrition',
      duration: '1 min',
      difficulty: 'Easy',
      rating: 4.9,
      views: '98K',
      thumbnail: 'https://img.youtube.com/vi/M1V1ILCR814/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/M1V1ILCR814',
      description: 'More delicious PCOS-friendly breakfast ideas perfect for busy mornings. Learn quick recipes that support hormone balance, reduce inflammation, and provide sustained energy. These breakfast options focus on whole foods, lean proteins, and complex carbohydrates ideal for managing PCOS symptoms.',
      instructor: 'PCOS Health Coach'
    },
    {
      id: 19,
      title: "PCOS Breakfast Recipes - Hormone Balance",
      category: 'nutrition',
      duration: '1 min',
      difficulty: 'Easy',
      rating: 4.8,
      views: '87K',
      thumbnail: 'https://img.youtube.com/vi/A0LMBsQNug0/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/A0LMBsQNug0',
      description: 'Simple and nutritious PCOS-friendly breakfast recipes designed to balance hormones naturally. These easy-to-prepare meals help manage insulin resistance, reduce inflammation, and support weight management. Perfect for women looking for practical breakfast solutions that fit their PCOS diet plan.',
      instructor: 'PCOS Wellness Guide'
    },
    {
      id: 20,
      title: "PCOS-Friendly Breakfast Options",
      category: 'nutrition',
      duration: '1 min',
      difficulty: 'Easy',
      rating: 4.9,
      views: '156K',
      thumbnail: 'https://img.youtube.com/vi/sINBiSJ2gVA/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/sINBiSJ2gVA',
      description: 'Discover more PCOS-friendly breakfast options that are both delicious and nutritious. These breakfast ideas focus on balancing blood sugar, supporting hormone health, and providing long-lasting energy. Learn how to create satisfying morning meals that help manage PCOS symptoms effectively.',
      instructor: 'PCOS Diet Specialist'
    },
    {
      id: 21,
      title: "PCOD Breakfast Ideas by Nutritionist",
      category: 'nutrition',
      duration: '1 min',
      difficulty: 'Easy',
      rating: 4.9,
      views: '142K',
      thumbnail: 'https://img.youtube.com/vi/AJ-WXpbn1_0/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/AJ-WXpbn1_0',
      description: 'Expert nutritionist-approved PCOD breakfast ideas that are scientifically designed to support hormone balance and metabolic health. These breakfast recipes are carefully crafted to manage insulin levels, reduce inflammation, and provide optimal nutrition for women with PCOD/PCOS.',
      instructor: 'Certified Nutritionist'
    },
    {
      id: 22,
      title: "Anti-Inflammatory Foods Guide",
      category: 'nutrition',
      duration: '1 min',
      difficulty: 'Easy',
      rating: 4.9,
      views: '215K',
      thumbnail: 'https://img.youtube.com/vi/Ckwejm_Vc9Q/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/Ckwejm_Vc9Q',
      description: 'Quick guide to anti-inflammatory foods that help reduce inflammation in the body. Learn which foods to include in your diet to combat chronic inflammation, support immune health, and manage conditions like PCOS, arthritis, and other inflammatory disorders. Perfect for creating an anti-inflammatory meal plan.',
      instructor: 'Nutrition Expert'
    },
    {
      id: 23,
      title: "Iron-Rich Foods Guide",
      category: 'nutrition',
      duration: '1 min',
      difficulty: 'Easy',
      rating: 4.9,
      views: '178K',
      thumbnail: 'https://img.youtube.com/vi/YGkQU3f-bng/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/YGkQU3f-bng',
      description: 'Quick guide to iron-rich foods essential for women, especially during menstruation. Learn which foods are highest in iron to prevent anemia, boost energy levels, and support healthy blood production. Perfect for managing heavy periods and maintaining optimal iron levels.',
      instructor: 'Health & Nutrition'
    },
    {
      id: 24,
      title: "Healthy Dinner Ideas - Quick & Easy",
      category: 'nutrition',
      duration: '1 min',
      difficulty: 'Easy',
      rating: 4.9,
      views: '189K',
      thumbnail: 'https://img.youtube.com/vi/E6rf9c3GsIc/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/E6rf9c3GsIc',
      description: 'Quick and healthy dinner ideas perfect for busy weeknights. These nutritious meal options are easy to prepare, delicious, and support overall wellness. Great for maintaining a balanced diet and managing weight while enjoying satisfying dinners.',
      instructor: 'Healthy Cooking'
    },
    {
      id: 9,
      title: "Understanding PCOS - Complete Guide",
      category: 'pcod',
      duration: '15 min',
      difficulty: 'Educational',
      rating: 4.8,
      views: '2M',
      thumbnail: 'https://img.youtube.com/vi/IvbjjJdKWTg/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/IvbjjJdKWTg',
      description: 'Comprehensive explanation of PCOS (Polycystic Ovary Syndrome) covering symptoms, causes, diagnosis, and management strategies. Essential viewing for anyone wanting to understand this common hormonal condition and its impact on women\'s health, fertility, and overall well-being.',
      instructor: 'Medical Education'
    },
    {
      id: 10,
      title: "Menstrual Cycle Education - Complete Guide",
      category: 'cycle',
      duration: '12 min',
      difficulty: 'Educational',
      rating: 4.7,
      views: '3M',
      thumbnail: 'https://img.youtube.com/vi/zcvo9VLVHWc/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/zcvo9VLVHWc',
      description: 'Comprehensive educational video about the menstrual cycle, hormonal changes, and reproductive health. Learn about the four phases of your cycle, ovulation timing, and what happens in your body throughout the month. Perfect for understanding your reproductive health and cycle tracking.',
      instructor: 'Health Education'
    },

    // Wellness & General Health
    {
      id: 11,
      title: "Breathing Exercises for Wellness",
      category: 'wellness',
      duration: '8 min',
      difficulty: 'Beginner',
      rating: 4.5,
      views: '1M',
      thumbnail: 'https://img.youtube.com/vi/LiUnFJ8P4gM/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/LiUnFJ8P4gM',
      description: 'Simple and effective breathing techniques to manage stress, anxiety, and promote overall wellness. These exercises can help reduce cortisol levels, improve focus, and provide natural pain relief for menstrual discomfort. Perfect for daily stress management and relaxation.',
      instructor: 'Wellness Guide'
    },
    {
      id: 12,
      title: "Natural Pain Relief Methods",
      category: 'wellness',
      duration: '14 min',
      difficulty: 'Beginner',
      rating: 4.6,
      views: '800K',
      thumbnail: 'https://img.youtube.com/vi/LIsYbDCMfDc/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/LIsYbDCMfDc',
      description: 'Natural, drug-free methods to relieve period pain and menstrual discomfort. Learn about heat therapy, gentle exercises, dietary approaches, and lifestyle changes that can significantly reduce menstrual cramps and PMS symptoms without medication.',
      instructor: 'Natural Health'
    }
  ];

  const filteredVideos = videos.filter(video => {
    const categoryMatch = selectedCategory === 'all' || video.category === selectedCategory;
    const durationMatch = selectedDuration === 'all' || 
      (selectedDuration === 'short' && parseInt(video.duration) <= 15) ||
      (selectedDuration === 'medium' && parseInt(video.duration) > 15 && parseInt(video.duration) <= 25) ||
      (selectedDuration === 'long' && parseInt(video.duration) > 25);
    
    return categoryMatch && durationMatch;
  });

  const [selectedVideo, setSelectedVideo] = useState(null);

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="video-library">
      <div className="video-library-header">
        <h2>🎬 Wellness Video Library</h2>
        <p>Expert-curated videos for your health journey</p>
      </div>

      {/* Filters */}
      <div className="video-filters">
        <div className="filter-group">
          <Filter size={18} />
          <span>Category:</span>
          <div className="filter-buttons">
            {videoCategories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <Clock size={18} />
          <span>Duration:</span>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedDuration === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedDuration('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${selectedDuration === 'short' ? 'active' : ''}`}
              onClick={() => setSelectedDuration('short')}
            >
              Short (≤15 min)
            </button>
            <button
              className={`filter-btn ${selectedDuration === 'medium' ? 'active' : ''}`}
              onClick={() => setSelectedDuration('medium')}
            >
              Medium (16-25 min)
            </button>
            <button
              className={`filter-btn ${selectedDuration === 'long' ? 'active' : ''}`}
              onClick={() => setSelectedDuration('long')}
            >
              Long (25+ min)
            </button>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="video-grid">
        {filteredVideos.map(video => (
          <div key={video.id} className="video-card" onClick={() => openVideo(video)}>
            <div className="video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="play-overlay">
                <Play size={32} />
              </div>
              <div className="video-duration">{video.duration}</div>
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p className="video-instructor">by {video.instructor}</p>
              <div className="video-stats">
                <div className="rating">
                  <Star size={14} fill="currentColor" />
                  <span>{video.rating}</span>
                </div>
                <div className="views">
                  <Users size={14} />
                  <span>{video.views}</span>
                </div>
                <div className="difficulty">{video.difficulty}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeVideo}>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeVideo}>×</button>
            <div className="video-player">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                style={{ border: 'none' }}
                allowFullScreen
              />
            </div>
            <div className="video-details">
              <h2>{selectedVideo.title}</h2>
              <p className="instructor">Instructor: {selectedVideo.instructor}</p>
              <p className="description">{selectedVideo.description}</p>
              <div className="video-meta">
                <span className="duration">⏱️ {selectedVideo.duration}</span>
                <span className="difficulty">📊 {selectedVideo.difficulty}</span>
                <span className="rating">⭐ {selectedVideo.rating}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoLibrary;