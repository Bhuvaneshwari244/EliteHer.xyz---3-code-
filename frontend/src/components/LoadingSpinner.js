import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '', 
  overlay = false 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'spinner-small';
      case 'large':
        return 'spinner-large';
      default:
        return 'spinner-medium';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'white':
        return 'spinner-white';
      case 'secondary':
        return 'spinner-secondary';
      default:
        return 'spinner-primary';
    }
  };

  const SpinnerComponent = () => (
    <div className={`loading-container ${overlay ? 'loading-overlay' : ''}`}>
      <div className="spinner-wrapper">
        <div className={`loading-spinner ${getSizeClass()} ${getColorClass()}`}>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        {text && <div className="loading-text">{text}</div>}
      </div>
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(5px);
          z-index: 9999;
        }

        .spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .loading-spinner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner-small {
          width: 24px;
          height: 24px;
        }

        .spinner-medium {
          width: 40px;
          height: 40px;
        }

        .spinner-large {
          width: 60px;
          height: 60px;
        }

        .spinner-circle {
          position: absolute;
          border-radius: 50%;
          animation: spinner-pulse 1.5s ease-in-out infinite;
        }

        .spinner-small .spinner-circle {
          width: 24px;
          height: 24px;
        }

        .spinner-medium .spinner-circle {
          width: 40px;
          height: 40px;
        }

        .spinner-large .spinner-circle {
          width: 60px;
          height: 60px;
        }

        .spinner-primary .spinner-circle {
          background: linear-gradient(45deg, #667eea, #764ba2);
        }

        .spinner-secondary .spinner-circle {
          background: linear-gradient(45deg, #f093fb, #f5576c);
        }

        .spinner-white .spinner-circle {
          background: linear-gradient(45deg, #ffffff, #f0f0f0);
        }

        .spinner-circle:nth-child(1) {
          animation-delay: 0s;
        }

        .spinner-circle:nth-child(2) {
          animation-delay: 0.5s;
        }

        .spinner-circle:nth-child(3) {
          animation-delay: 1s;
        }

        @keyframes spinner-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(0);
          }
          50% {
            opacity: 0.7;
            transform: scale(1);
          }
        }

        .loading-text {
          color: #666;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          animation: fadeInOut 2s ease-in-out infinite;
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        /* Alternative Spinner Styles */
        .loading-spinner.spinner-dots {
          display: flex;
          gap: 4px;
        }

        .spinner-dots .spinner-circle {
          position: relative;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: spinner-bounce 1.4s ease-in-out infinite both;
        }

        .spinner-dots .spinner-circle:nth-child(1) { animation-delay: -0.32s; }
        .spinner-dots .spinner-circle:nth-child(2) { animation-delay: -0.16s; }
        .spinner-dots .spinner-circle:nth-child(3) { animation-delay: 0s; }

        @keyframes spinner-bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        /* Rotating Spinner */
        .loading-spinner.spinner-rotate {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spinner-rotate 1s linear infinite;
        }

        @keyframes spinner-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Wave Spinner */
        .loading-spinner.spinner-wave {
          display: flex;
          gap: 2px;
        }

        .spinner-wave .spinner-circle {
          position: relative;
          width: 4px;
          height: 20px;
          border-radius: 2px;
          animation: spinner-wave 1.2s ease-in-out infinite;
        }

        .spinner-wave .spinner-circle:nth-child(1) { animation-delay: 0s; }
        .spinner-wave .spinner-circle:nth-child(2) { animation-delay: 0.1s; }
        .spinner-wave .spinner-circle:nth-child(3) { animation-delay: 0.2s; }

        @keyframes spinner-wave {
          0%, 40%, 100% {
            transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );

  return <SpinnerComponent />;
};

// Preset spinner components
export const DotsSpinner = (props) => (
  <div className="loading-spinner spinner-dots">
    <div className="spinner-circle"></div>
    <div className="spinner-circle"></div>
    <div className="spinner-circle"></div>
  </div>
);

export const RotateSpinner = (props) => (
  <div className="loading-spinner spinner-rotate"></div>
);

export const WaveSpinner = (props) => (
  <div className="loading-spinner spinner-wave">
    <div className="spinner-circle"></div>
    <div className="spinner-circle"></div>
    <div className="spinner-circle"></div>
  </div>
);

export default LoadingSpinner;