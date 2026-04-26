import React, { useState, useEffect } from 'react';

const SuccessAnimation = ({ show = false, message = 'Success!', onComplete }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="success-animation-overlay">
      <div className="success-animation-container">
        <div className="success-checkmark-container">
          <svg className="checkmark" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <div className="success-message">
          <h3 className="success-title bounce-in">{message}</h3>
          <div className="success-confetti">
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .success-animation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease-out;
        }

        .success-animation-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          max-width: 400px;
          width: 90%;
        }

        .success-checkmark-container {
          margin-bottom: 20px;
        }

        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #4caf50;
          stroke-miterlimit: 10;
          margin: 0 auto;
          box-shadow: inset 0px 0px 0px #4caf50;
          animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
        }

        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #4caf50;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke: #4caf50;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }

        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 30px #4caf50;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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

        .success-message {
          position: relative;
        }

        .success-title {
          color: #333;
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s both;
        }

        .success-confetti {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 100px;
          pointer-events: none;
        }

        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #4caf50;
          animation: confetti-fall 2s ease-out forwards;
        }

        .confetti-piece:nth-child(1) {
          left: 10%;
          background: #ff6b6b;
          animation-delay: 0.1s;
        }

        .confetti-piece:nth-child(2) {
          left: 30%;
          background: #4ecdc4;
          animation-delay: 0.2s;
        }

        .confetti-piece:nth-child(3) {
          left: 50%;
          background: #45b7d1;
          animation-delay: 0.3s;
        }

        .confetti-piece:nth-child(4) {
          left: 70%;
          background: #f9ca24;
          animation-delay: 0.4s;
        }

        .confetti-piece:nth-child(5) {
          left: 90%;
          background: #6c5ce7;
          animation-delay: 0.5s;
        }

        .confetti-piece:nth-child(6) {
          left: 20%;
          background: #a29bfe;
          animation-delay: 0.6s;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100px) rotate(720deg);
            opacity: 0;
          }
        }

        /* Dark mode support */
        .dark-mode .success-animation-container {
          background: #2d3748;
          color: white;
        }

        .dark-mode .success-title {
          color: white;
        }
      `}</style>
    </div>
  );
};

export default SuccessAnimation;