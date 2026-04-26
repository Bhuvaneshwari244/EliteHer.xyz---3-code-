import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Activity, AlertCircle, FileDown, Calendar } from 'lucide-react';
import RippleButton from './RippleButton';
import { useLanguage } from '../context/LanguageContext';

export function QuickActions() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const actions = [
    {
      id: 'log-period',
      icon: Plus,
      label: t('quickActions.logPeriod'),
      color: 'var(--coral)',
      onClick: () => navigate('/cycles')
    },
    {
      id: 'log-symptom',
      icon: Activity,
      label: t('quickActions.logSymptoms'),
      color: 'var(--warm)',
      onClick: () => navigate('/symptoms')
    },
    {
      id: 'pcod-check',
      icon: AlertCircle,
      label: t('quickActions.pcodCheck'),
      color: 'var(--rose)',
      onClick: () => navigate('/pcod-assessment')
    },
    {
      id: 'view-calendar',
      icon: Calendar,
      label: t('quickActions.viewCalendar'),
      color: 'var(--sage)',
      onClick: () => navigate('/cycles')
    }
  ];

  return (
    <div className="quick-actions-card fade-in-delay-2">
      <h3 className="quick-actions-title">{t('quickActions.title')}</h3>
      <div className="quick-actions-grid">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <RippleButton
              key={action.id}
              onClick={action.onClick}
              className={`quick-action-btn scale-on-hover stagger-item`}
              style={{ 
                '--action-color': action.color,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="quick-action-icon">
                <Icon size={24} className="float" />
              </div>
              <span className="quick-action-label">{action.label}</span>
            </RippleButton>
          );
        })}
      </div>
    </div>
  );
}
