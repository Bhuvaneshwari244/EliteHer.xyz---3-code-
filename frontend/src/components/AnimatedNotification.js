import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const AnimatedNotification = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  show = false 
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'notification-success';
      case 'error':
        return 'notification-error';
      case 'info':
        return 'notification-info';
      default:
        return 'notification-success';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`animated-notification ${getTypeClass()} ${
        isAnimating ? 'notification-enter-active' : 'notification-exit-active'
      }`}
    >
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-message">
          {message}
        </div>
        <button 
          className="notification-close"
          onClick={handleClose}
        >
          <X size={16} />
        </button>
      </div>
      
      <style jsx>{`
        .animated-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          min-width: 300px;
          max-width: 500px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          backdrop-filter: blur(10px);
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .notification-enter-active {
          transform: translateX(0);
          opacity: 1;
        }

        .notification-exit-active {
          transform: translateX(100%);
          opacity: 0;
        }

        .notification-success {
          background: linear-gradient(135deg, #4caf50, #45a049);
          color: white;
        }

        .notification-error {
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
        }

        .notification-info {
          background: linear-gradient(135deg, #2196f3, #1976d2);
          color: white;
        }

        .notification-content {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          gap: 12px;
        }

        .notification-icon {
          flex-shrink: 0;
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .notification-message {
          flex: 1;
          font-weight: 500;
          line-height: 1.4;
        }

        .notification-close {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
          flex-shrink: 0;
        }

        .notification-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .animated-notification {
            left: 20px;
            right: 20px;
            min-width: auto;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedNotification;