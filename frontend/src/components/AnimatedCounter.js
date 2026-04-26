import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ 
  end = 0, 
  start = 0, 
  duration = 2000, 
  prefix = '', 
  suffix = '',
  className = '',
  decimals = 0,
  separator = ',',
  onComplete
}) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (end !== start) {
      setIsAnimating(true);
      let startTime = null;
      const startValue = start;
      const endValue = end;
      const difference = endValue - startValue;

      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = startValue + (difference * easeOut);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
          setIsAnimating(false);
          if (onComplete) onComplete();
        }
      };

      requestAnimationFrame(animate);
    }
  }, [end, start, duration, onComplete]);

  const formatNumber = (num) => {
    const fixed = Number(num).toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };

  return (
    <span className={`animated-counter ${className} ${isAnimating ? 'counting' : ''}`}>
      {prefix}{formatNumber(count)}{suffix}
      
      <style jsx>{`
        .animated-counter {
          display: inline-block;
          font-variant-numeric: tabular-nums;
          transition: color 0.3s ease;
        }

        .animated-counter.counting {
          color: #667eea;
          text-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
        }

        /* Pulse effect while counting */
        .counting {
          animation: counterPulse 0.5s ease-in-out infinite alternate;
        }

        @keyframes counterPulse {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.05);
          }
        }
      `}</style>
    </span>
  );
};

// Preset counter components
export const PercentageCounter = ({ value, ...props }) => (
  <AnimatedCounter end={value} suffix="%" {...props} />
);

export const CurrencyCounter = ({ value, currency = '$', ...props }) => (
  <AnimatedCounter end={value} prefix={currency} decimals={2} {...props} />
);

export const DaysCounter = ({ value, ...props }) => (
  <AnimatedCounter 
    end={value} 
    suffix={value === 1 ? ' day' : ' days'} 
    {...props} 
  />
);

export default AnimatedCounter;