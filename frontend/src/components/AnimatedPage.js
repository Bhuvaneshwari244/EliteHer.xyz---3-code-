import React, { useEffect, useState } from 'react';
import { applyPageAnimations } from '../utils/animationUtils';
import AnimatedNotification from './AnimatedNotification';
import SuccessAnimation from './SuccessAnimation';

const AnimatedPage = ({ 
  children, 
  layout = 'dashboard', 
  className = '',
  showNotifications = true 
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const animations = applyPageAnimations(layout);

  useEffect(() => {
    // Listen for global notification events
    const handleNotification = (event) => {
      const { message, type, duration } = event.detail;
      setNotificationMessage(message);
      setNotificationType(type);
      setShowNotification(true);
    };

    const handleSuccess = (event) => {
      const { message } = event.detail;
      setSuccessMessage(message);
      setShowSuccess(true);
    };

    if (showNotifications) {
      window.addEventListener('showNotification', handleNotification);
      window.addEventListener('showSuccess', handleSuccess);
    }

    return () => {
      if (showNotifications) {
        window.removeEventListener('showNotification', handleNotification);
        window.removeEventListener('showSuccess', handleSuccess);
      }
    };
  }, [showNotifications]);

  return (
    <div className={`animated-page ${animations.container} ${className}`}>
      {children}
      
      {showNotifications && (
        <>
          <AnimatedNotification 
            message={notificationMessage}
            type={notificationType}
            show={showNotification}
            onClose={() => setShowNotification(false)}
          />

          <SuccessAnimation 
            show={showSuccess}
            message={successMessage}
            onComplete={() => setShowSuccess(false)}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedPage;