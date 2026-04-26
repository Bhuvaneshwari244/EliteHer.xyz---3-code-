import React, { useState, useEffect } from 'react';

const AnimatedProgressBar = ({ 
  progress = 0, 
  max = 100, 
  height = 8, 
  color = 'primary',
  showPercentage = true,
  animated = true,
  striped = false,
  label = '',
  className = ''
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  const percentage = Math.min(Math.max((animatedProgress / max) * 100, 0), 100);

  const getColorClass = () => {
    switch (color) {
      case 'success':
        return 'progress-success';
      case 'warning':
        return 'progress-warning';
      case 'error':
        return 'progress-error';
      case 'info':
        return 'progress-info';
      default:
        return 'progress-primary';
    }
  };

  return (
    <div className={`animated-progress-container ${className}`}>
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          {showPercentage && (
            <span className="progress-percentage">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div 
        className="progress-bar-container"
        style={{ height: `${height}px` }}
      >
        <div 
          className={`progress-bar-fill ${getColorClass()} ${striped ? 'striped' : ''} ${animated ? 'animated' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          {animated && <div className="progress-shimmer"></div>}
        </div>
      </div>

      <style jsx>{`
        .animated-progress-container {
          width: 100%;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .progress-percentage {
          font-weight: 600;
          color: #667eea;
        }

        .progress-bar-container {
          width: 100%;
          background: #f0f0f0;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 10px;
          position: relative;
          transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          overflow: hidden;
        }

        .progress-primary {
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .progress-success {
          background: linear-gradient(90deg, #4caf50, #45a049);
        }

        .progress-warning {
          background: linear-gradient(90deg, #ff9800, #f57c00);
        }

        .progress-error {
          background: linear-gradient(90deg, #f44336, #d32f2f);
        }

        .progress-info {
          background: linear-gradient(90deg, #2196f3, #1976d2);
        }

        .progress-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .striped {
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
          );
          background-size: 20px 20px;
        }

        .striped.animated {
          animation: stripes 1s linear infinite;
        }

        @keyframes stripes {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 0;
          }
        }

        /* Pulse effect for low progress */
        .progress-bar-fill[style*="width: 0%"],
        .progress-bar-fill[style*="width: 1%"],
        .progress-bar-fill[style*="width: 2%"] {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* Glow effect for high progress */
        .progress-bar-fill[style*="width: 9"],
        .progress-bar-fill[style*="width: 100%"] {
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from {
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
          }
          to {
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
          }
        }

        /* Dark mode support */
        .dark-mode .progress-label {
          color: #fff;
        }

        .dark-mode .progress-bar-container {
          background: #333;
        }

        .dark-mode .progress-percentage {
          color: #8fa7ff;
        }
      `}</style>
    </div>
  );
};

// Circular Progress Bar Component
export const CircularProgressBar = ({ 
  progress = 0, 
  max = 100, 
  size = 120, 
  strokeWidth = 8,
  color = 'primary',
  showPercentage = true,
  label = '',
  className = ''
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const percentage = Math.min(Math.max((animatedProgress / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    switch (color) {
      case 'success': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'error': return '#f44336';
      case 'info': return '#2196f3';
      default: return '#667eea';
    }
  };

  return (
    <div className={`circular-progress ${className}`}>
      <svg width={size} height={size} className="circular-progress-svg">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="progress-circle"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      
      <div className="circular-progress-content">
        {showPercentage && (
          <div className="circular-progress-percentage">
            {Math.round(percentage)}%
          </div>
        )}
        {label && (
          <div className="circular-progress-label">
            {label}
          </div>
        )}
      </div>

      <style jsx>{`
        .circular-progress {
          position: relative;
          display: inline-block;
        }

        .circular-progress-svg {
          transform: rotate(-90deg);
        }

        .progress-circle {
          transition: stroke-dashoffset 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .circular-progress-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .circular-progress-percentage {
          font-size: ${size * 0.15}px;
          font-weight: 600;
          color: ${getColor()};
          line-height: 1;
        }

        .circular-progress-label {
          font-size: ${size * 0.08}px;
          color: #666;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default AnimatedProgressBar;