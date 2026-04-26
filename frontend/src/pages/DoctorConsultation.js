import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Video, MessageCircle, Calendar, Phone, User, Clock, Star, Send, X, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

function DoctorConsultation() {
  // Enhanced appointment management with automatic status updates and reminders
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doctors');
  const [appointments, setAppointments] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    date: '',
    timeSlot: '',
    type: 'video',
    reason: '',
    paymentMethod: 'card'
  });

  // Available time slots for doctors (9 AM to 5 PM)
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Gynecologist',
      experience: '15 years',
      rating: 4.9,
      reviews: 234,
      availability: 'Available Today',
      consultationFee: '$50',
      languages: ['English', 'Spanish'],
      image: '👩‍⚕️',
      about: 'Specialized in reproductive health, PCOD/PCOS treatment, and menstrual disorders.'
    },
    {
      id: 2,
      name: 'Dr. Emily Chen',
      specialty: 'Reproductive Endocrinologist',
      experience: '12 years',
      rating: 4.8,
      reviews: 189,
      availability: 'Available Tomorrow',
      consultationFee: '$60',
      languages: ['English', 'Mandarin'],
      image: '👩‍⚕️',
      about: 'Expert in hormonal disorders, fertility issues, and PCOD management.'
    },
    {
      id: 3,
      name: 'Dr. Priya Sharma',
      specialty: 'Gynecologist & Obstetrician',
      experience: '18 years',
      rating: 4.9,
      reviews: 312,
      availability: 'Available Today',
      consultationFee: '$55',
      languages: ['English', 'Hindi'],
      image: '👩‍⚕️',
      about: 'Comprehensive women\'s health care, pregnancy, and menstrual health specialist.'
    },
    {
      id: 4,
      name: 'Dr. Maria Rodriguez',
      specialty: 'Adolescent Gynecologist',
      experience: '10 years',
      rating: 4.7,
      reviews: 156,
      availability: 'Available Today',
      consultationFee: '$45',
      languages: ['English', 'Spanish'],
      image: '👩‍⚕️',
      about: 'Specialized in adolescent reproductive health and menstrual disorders.'
    }
  ];

  const loadAppointments = () => {
    const saved = localStorage.getItem('appointments');
    if (saved) {
      setAppointments(JSON.parse(saved));
    }
  };

  const loadChatHistory = () => {
    const saved = localStorage.getItem('doctor_chats');
    if (saved) {
      setChatMessages(JSON.parse(saved));
    }
  };

  const saveAppointments = (newAppointments) => {
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
    setAppointments(newAppointments);
  };

  const saveChatMessages = (messages) => {
    localStorage.setItem('doctor_chats', JSON.stringify(messages));
    setChatMessages(messages);
  };

  const showNotification = (title, message) => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body: message, icon: '👩‍⚕️' });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body: message, icon: '👩‍⚕️' });
          }
        });
      }
    }
    
    // Also show in-app alert
    alert(`${title}\n\n${message}`);
  };

  const updateAppointmentStatuses = () => {
    setAppointments(prevAppointments => {
      const now = new Date();
      let updated = false;
      
      const updatedAppointments = prevAppointments.map(appointment => {
        if (appointment.status === 'scheduled') {
          const appointmentDateTime = new Date(`${appointment.date}T${appointment.timeSlot}`);
          const timeDiff = appointmentDateTime - now;
          
          // If appointment time has passed by more than 15 minutes, mark as missed
          if (timeDiff < -15 * 60 * 1000) {
            updated = true;
            return { ...appointment, status: 'missed' };
          }
        }
        return appointment;
      });

      if (updated) {
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        return updatedAppointments;
      }
      return prevAppointments;
    });
  };

  const checkUpcomingReminders = () => {
    setAppointments(prevAppointments => {
      const now = new Date();
      let updated = false;
      
      const updatedAppointments = prevAppointments.map(appointment => {
        if (appointment.status === 'scheduled') {
          const appointmentDateTime = new Date(`${appointment.date}T${appointment.timeSlot}`);
          const timeDiff = appointmentDateTime - now;
          
          // Only send reminders if appointment is in the future
          if (timeDiff > 0) {
            // Remind 15 minutes before (only once)
            if (timeDiff <= 15 * 60 * 1000 && timeDiff > 14 * 60 * 1000 && !appointment.reminded15min) {
              showNotification(
                'Appointment Reminder',
                `Your appointment with ${appointment.doctorName} is in 15 minutes!`
              );
              updated = true;
              return { ...appointment, reminded15min: true };
            }
            
            // Remind 1 hour before (only once)
            if (timeDiff <= 60 * 60 * 1000 && timeDiff > 59 * 60 * 1000 && !appointment.reminded1hour) {
              showNotification(
                'Appointment Reminder',
                `Your appointment with ${appointment.doctorName} is in 1 hour!`
              );
              updated = true;
              return { ...appointment, reminded1hour: true };
            }
          }
        }
        return appointment;
      });

      if (updated) {
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        return updatedAppointments;
      }
      return prevAppointments;
    });
  };

  useEffect(() => {
    loadAppointments();
    loadChatHistory();
    
    // Check appointment statuses every minute
    const statusInterval = setInterval(() => {
      updateAppointmentStatuses();
      checkUpcomingReminders();
    }, 60000); // Check every minute

    // Initial check after 1 second to allow state to load
    const initialCheck = setTimeout(() => {
      updateAppointmentStatuses();
      checkUpcomingReminders();
    }, 1000);

    return () => {
      clearInterval(statusInterval);
      clearTimeout(initialCheck);
    };
  }, []); // Empty dependency array - only run once on mount

  const canJoinCall = (appointment) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.timeSlot}`);
    const timeDiff = appointmentDateTime - now;
    
    // Can join 15 minutes before to 15 minutes after
    return timeDiff >= -15 * 60 * 1000 && timeDiff <= 15 * 60 * 1000;
  };

  const getTimeUntilAppointment = (appointment) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.timeSlot}`);
    const timeDiff = appointmentDateTime - now;
    
    if (timeDiff < 0) {
      return 'Time passed';
    }
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    } else {
      return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingForm({ ...bookingForm, doctorId: doctor.id });
    setShowBookingForm(true);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    
    // Validate payment method is selected
    if (!bookingForm.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Process payment (in real app, integrate with payment gateway)
    const paymentSuccess = processPayment(bookingForm.paymentMethod, selectedDoctor.consultationFee);
    
    if (!paymentSuccess) {
      alert('Payment failed. Please try again.');
      return;
    }

    const newAppointment = {
      id: Date.now(),
      ...bookingForm,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      consultationFee: selectedDoctor.consultationFee,
      status: 'scheduled',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString()
    };
    
    saveAppointments([...appointments, newAppointment]);
    setShowBookingForm(false);
    setBookingForm({ doctorId: '', date: '', timeSlot: '', type: 'video', reason: '', paymentMethod: 'card' });
    alert(`Appointment booked successfully!\n\nPayment of ${selectedDoctor.consultationFee} processed.\nYou will receive reminders before your appointment.`);
  };

  const processPayment = (method, amount) => {
    // Simulate payment processing
    // In real app, integrate with Stripe, PayPal, etc.
    console.log(`Processing payment: ${amount} via ${method}`);
    
    // Simulate payment success
    return true;
  };

  const handleJoinCall = (appointment) => {
    if (!canJoinCall(appointment)) {
      alert('You can only join the call 15 minutes before to 15 minutes after the scheduled time.');
      return;
    }

    // Simulate joining a video call
    const callUrl = `https://meet.google.com/new`; // Or use any video conferencing service
    alert(`Joining video call with ${appointment.doctorName}...\n\nIn a real application, this would:\n1. Open a video call interface\n2. Connect you with the doctor\n3. Enable audio/video communication\n\nFor demo purposes, opening a new meeting link...`);
    window.open(callUrl, '_blank');
  };

  const handleCompleteAppointment = (id) => {
    const updatedAppointments = appointments.map(a => 
      a.id === id ? { ...a, status: 'completed' } : a
    );
    saveAppointments(updatedAppointments);
  };

  const handleCancelAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      saveAppointments(appointments.filter(a => a.id !== id));
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...chatMessages, newMessage];
    saveChatMessages(updatedMessages);
    setMessageInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: 'Thank you for your message. Our AI assistant is analyzing your query. For immediate assistance, try our video or voice call options above!',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      saveChatMessages([...updatedMessages, aiResponse]);
    }, 1500);
  };

  const handleAICall = (type) => {
    const callType = type === 'video' ? 'Video' : 'Voice';
    
    alert(`🤖 Starting AI ${callType} Call...\n\n✅ FREE - No charges\n✅ Available now - No waiting\n✅ Instant connection\n\nIn a real application, this would:\n1. Open ${callType.toLowerCase()} call interface\n2. Connect you with AI assistant\n3. Enable ${type === 'video' ? 'video and audio' : 'audio only'} communication\n4. Provide real-time AI medical guidance\n\nFor demo purposes, opening call interface...`);
    
    // Simulate opening call interface
    const callUrl = type === 'video' 
      ? 'https://meet.google.com/new' 
      : 'https://meet.google.com/new';
    
    window.open(callUrl, '_blank');
    
    // Log the call in chat
    const callMessage = {
      id: Date.now(),
      text: `Started AI ${callType} Call - FREE consultation`,
      sender: 'system',
      timestamp: new Date().toISOString()
    };
    saveChatMessages([...chatMessages, callMessage]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return '#10b981';
      case 'upcoming': return '#3b82f6';
      case 'completed': return '#6b7280';
      case 'missed': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (appointment) => {
    if (appointment.status === 'scheduled') {
      const now = new Date();
      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const timeDiff = appointmentDateTime - now;
      
      // If within 1 hour, show as "Upcoming"
      if (timeDiff > 0 && timeDiff <= 60 * 60 * 1000) {
        return 'upcoming';
      }
    }
    return appointment.status;
  };

  return (
    <div className="dashboard">
      <Navigation />
      <AnimatedBackground />
      
      <button onClick={() => navigate(-1)} className="back-button" title="Go back">
        <ArrowLeft size={20} />
      </button>
      
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="logo-icon">👩‍⚕️</span>
            <div>
              <h1 className="logo-title">Doctor Consultation</h1>
              <p className="logo-subtitle">Connect with gynecology experts</p>
            </div>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <div className="privacy-badge">
              <Shield size={16} />
              <span>Private & Secure</span>
            </div>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <div className="page-container">
        {/* Tabs */}
        <div className="consultation-tabs">
          <button 
            className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <User size={20} />
            Find Doctors
          </button>
          <button 
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={20} />
            My Appointments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle size={20} />
            Chat Support
          </button>
        </div>

        {/* Doctors List */}
        {activeTab === 'doctors' && (
          <div className="doctors-grid">
            {doctors.map(doctor => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-header">
                  <div className="doctor-avatar">{doctor.image}</div>
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <p className="doctor-specialty">{doctor.specialty}</p>
                    <div className="doctor-rating">
                      <Star size={16} fill="#fbbf24" color="#fbbf24" />
                      <span>{doctor.rating}</span>
                      <span className="reviews">({doctor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="doctor-details">
                  <div className="detail-row">
                    <Clock size={16} />
                    <span>{doctor.experience} experience</span>
                  </div>
                  <div className="detail-row">
                    <span className="availability-badge">{doctor.availability}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Languages:</strong> {doctor.languages.join(', ')}
                  </div>
                  <p className="doctor-about">{doctor.about}</p>
                </div>

                <div className="doctor-footer">
                  <div className="consultation-fee">
                    <span className="fee-label">Consultation Fee</span>
                    <span className="fee-amount">{doctor.consultationFee}</span>
                  </div>
                  <div className="doctor-actions">
                    <button 
                      onClick={() => handleBookAppointment(doctor)}
                      className="btn-primary"
                    >
                      <Video size={18} />
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appointments */}
        {activeTab === 'appointments' && (
          <div className="appointments-section">
            {appointments.length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} color="#ccc" />
                <p>No appointments scheduled</p>
                <p className="empty-subtitle">Book a consultation with a doctor</p>
                <button 
                  onClick={() => setActiveTab('doctors')}
                  className="btn-primary"
                >
                  Find Doctors
                </button>
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.map(appointment => {
                  const statusText = getStatusText(appointment);
                  const timeUntil = getTimeUntilAppointment(appointment);
                  const joinable = canJoinCall(appointment);

                  return (
                    <div key={appointment.id} className="appointment-card">
                      <div className="appointment-header">
                        <div>
                          <h3>{appointment.doctorName}</h3>
                          <p className="appointment-specialty">{appointment.doctorSpecialty}</p>
                        </div>
                        <span 
                          className="status-badge"
                          style={{background: getStatusColor(statusText)}}
                        >
                          {statusText}
                        </span>
                      </div>

                      <div className="appointment-details">
                        <div className="detail-item">
                          <Calendar size={16} />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-item">
                          <Clock size={16} />
                          <span>{appointment.timeSlot}</span>
                        </div>
                        <div className="detail-item">
                          {appointment.type === 'video' ? <Video size={16} /> : <Phone size={16} />}
                          <span>{appointment.type === 'video' ? 'Video Call' : 'Phone Call'}</span>
                        </div>
                        {appointment.paymentStatus && (
                          <div className="detail-item">
                            <span className="payment-badge">✓ Paid {appointment.consultationFee}</span>
                          </div>
                        )}
                      </div>

                      {appointment.status === 'scheduled' && (
                        <div className="appointment-countdown">
                          <Clock size={16} />
                          <span>{timeUntil}</span>
                          {!joinable && (
                            <span className="join-window-info">
                              (Join available 15 min before)
                            </span>
                          )}
                        </div>
                      )}

                      {appointment.reason && (
                        <div className="appointment-reason">
                          <strong>Reason:</strong> {appointment.reason}
                        </div>
                      )}

                      <div className="appointment-actions">
                        {appointment.status === 'scheduled' && (
                          <>
                            <button 
                              className={`btn-primary ${!joinable ? 'disabled' : ''}`}
                              onClick={() => handleJoinCall(appointment)}
                              disabled={!joinable}
                              title={!joinable ? 'Available 15 minutes before appointment' : 'Join video call'}
                            >
                              <Video size={18} />
                              {joinable ? 'Join Call' : 'Not Available Yet'}
                            </button>
                            {joinable && (
                              <button 
                                onClick={() => handleCompleteAppointment(appointment.id)}
                                className="btn-secondary"
                              >
                                Mark Complete
                              </button>
                            )}
                            <button 
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === 'missed' && (
                          <div className="missed-info">
                            <span>⚠️ You missed this appointment. Please reschedule.</span>
                            <button 
                              onClick={() => setActiveTab('doctors')}
                              className="btn-primary"
                            >
                              Book New Appointment
                            </button>
                          </div>
                        )}
                        {appointment.status === 'completed' && (
                          <div className="completed-info">
                            <span>✅ Consultation completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Chat Support */}
        {activeTab === 'chat' && (
          <div className="chat-section">
            <div className="ai-chat-notice">
              <div className="notice-icon">🤖</div>
              <div className="notice-content">
                <h4>AI Medical Assistant - Always Available & FREE</h4>
                <p>
                  Our AI assistant is available 24/7 for FREE consultations via chat, voice, or video call. 
                  No appointment needed, no payment required!
                </p>
              </div>
            </div>

            {/* AI Call Options */}
            <div className="ai-call-options">
              <h4>Connect with AI Assistant</h4>
              <div className="call-options-grid">
                <button 
                  className="call-option-btn video-call"
                  onClick={() => handleAICall('video')}
                >
                  <Video size={32} />
                  <span>Video Call</span>
                  <small>Face-to-face AI consultation</small>
                  <div className="free-badge">FREE</div>
                </button>
                <button 
                  className="call-option-btn voice-call"
                  onClick={() => handleAICall('voice')}
                >
                  <Phone size={32} />
                  <span>Voice Call</span>
                  <small>Audio-only AI consultation</small>
                  <div className="free-badge">FREE</div>
                </button>
                <button 
                  className="call-option-btn text-chat active"
                  onClick={() => {}}
                >
                  <MessageCircle size={32} />
                  <span>Text Chat</span>
                  <small>Message-based support</small>
                  <div className="free-badge">FREE</div>
                </button>
              </div>
            </div>

            <div className="chat-container">
              <div className="chat-header">
                <MessageCircle size={20} />
                <h3>Chat with AI Medical Support</h3>
                <span className="online-badge">● Always Online</span>
              </div>

              <div className="chat-messages">
                {chatMessages.length === 0 ? (
                  <div className="chat-empty">
                    <MessageCircle size={48} color="#ccc" />
                    <p>No messages yet</p>
                    <p className="empty-subtitle">Start a conversation with our AI medical assistant</p>
                  </div>
                ) : (
                  chatMessages.map(message => (
                    <div 
                      key={message.id} 
                      className={`chat-message ${message.sender}`}
                    >
                      <div className="message-bubble">
                        <p>{message.text}</p>
                        <span className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="chat-input"
                />
                <button type="submit" className="send-btn">
                  <Send size={20} />
                </button>
              </form>
            </div>

            <div className="chat-info">
              <h4>AI Assistant Features</h4>
              <ul>
                <li>✅ Available 24/7 - No waiting time</li>
                <li>✅ Completely FREE - No charges</li>
                <li>✅ Instant responses via chat</li>
                <li>✅ Video & voice call support</li>
                <li>✅ General health guidance</li>
                <li>⚠️ For serious issues, consult a real doctor</li>
              </ul>
            </div>
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="modal-overlay" onClick={() => setShowBookingForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Book Consultation</h3>
                <button onClick={() => setShowBookingForm(false)} className="close-btn">
                  <X size={24} />
                </button>
              </div>

              <div className="doctor-summary">
                <span className="doctor-avatar-small">{selectedDoctor.image}</span>
                <div>
                  <h4>{selectedDoctor.name}</h4>
                  <p>{selectedDoctor.specialty}</p>
                </div>
              </div>

              <form onSubmit={handleSubmitBooking} className="booking-form">
                <div className="form-group">
                  <label>Consultation Type *</label>
                  <select
                    value={bookingForm.type}
                    onChange={(e) => setBookingForm({...bookingForm, type: e.target.value})}
                    required
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Date *</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Time Slot *</label>
                  <select
                    value={bookingForm.timeSlot}
                    onChange={(e) => setBookingForm({...bookingForm, timeSlot: e.target.value})}
                    required
                  >
                    <option value="">Choose a time slot</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  <small>Doctor available: 9:00 AM - 5:00 PM</small>
                </div>

                <div className="form-group">
                  <label>Reason for Consultation *</label>
                  <textarea
                    value={bookingForm.reason}
                    onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                    placeholder="Describe your symptoms or concerns..."
                    rows="4"
                    required
                  />
                </div>

                <div className="payment-section">
                  <div className="payment-header">
                    <h4>Payment Details</h4>
                    <div className="consultation-fee-display">
                      <span>Consultation Fee:</span>
                      <strong>{selectedDoctor.consultationFee}</strong>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Payment Method *</label>
                    <select
                      value={bookingForm.paymentMethod}
                      onChange={(e) => setBookingForm({...bookingForm, paymentMethod: e.target.value})}
                      required
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="netbanking">Net Banking</option>
                      <option value="wallet">Digital Wallet</option>
                    </select>
                  </div>

                  {bookingForm.paymentMethod === 'card' && (
                    <>
                      <div className="form-group">
                        <label>Card Number *</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry *</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength="5"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV *</label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength="3"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {bookingForm.paymentMethod === 'upi' && (
                    <div className="form-group">
                      <label>UPI ID *</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        required
                      />
                    </div>
                  )}

                  <div className="payment-note">
                    <span>🔒</span>
                    <p>Your payment information is secure and encrypted</p>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    Pay {selectedDoctor.consultationFee} & Confirm Booking
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowBookingForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🌸</span>
            <span className="footer-name">Aura</span>
          </div>
          <p className="footer-disclaimer">
            Consultations are for informational purposes. Always follow your doctor's advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default DoctorConsultation;
