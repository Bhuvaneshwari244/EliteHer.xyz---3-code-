// Animation utility functions for consistent animations across all pages

export const pageAnimationClasses = {
  // Page entrance animations
  pageContainer: 'fade-in',
  heroSection: 'slide-in-down',
  contentSection: 'fade-in-delay-1',
  
  // Card animations
  card: 'stagger-item scale-on-hover',
  cardIcon: 'float',
  cardTitle: 'fade-in-delay-2',
  
  // Form animations
  formContainer: 'slide-in-up',
  formGroup: 'stagger-item',
  formInput: 'glow-on-focus',
  formButton: 'scale-on-hover',
  
  // Navigation animations
  navItem: 'stagger-item scale-on-hover',
  navIcon: 'rotate-on-hover',
  
  // Interactive elements
  button: 'scale-on-hover',
  iconButton: 'rotate-on-hover',
  actionButton: 'bounce-in',
  
  // Status animations
  success: 'bounce-in',
  error: 'shake',
  loading: 'pulse',
  
  // List animations
  listItem: 'stagger-item',
  listIcon: 'float',
  
  // Header animations
  headerTitle: 'fade-in-delay-1',
  headerSubtitle: 'fade-in-delay-2',
  headerIcon: 'heartbeat'
};

export const iconAnimations = {
  // Icon-specific animations based on context
  heart: 'heartbeat',
  calendar: 'pulse',
  activity: 'float',
  settings: 'rotate-on-hover',
  notification: 'wobble',
  success: 'bounce-in',
  loading: 'pulse',
  menu: 'scale-on-hover',
  close: 'rotate-on-hover',
  add: 'scale-on-hover',
  edit: 'float',
  delete: 'shake',
  save: 'bounce-in',
  cancel: 'fade-in'
};

export const getStaggerDelay = (index, baseDelay = 0.1) => ({
  animationDelay: `${index * baseDelay}s`
});

export const addRippleEffect = (event) => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.width = size + 'px';
  ripple.style.height = size + 'px';
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
};

export const animateCounter = (element, start, end, duration = 2000) => {
  let startTime = null;
  
  const animate = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = start + (end - start) * easeOut;
    
    element.textContent = Math.round(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

export const showNotification = (message, type = 'success', duration = 3000) => {
  // This would integrate with your notification system
  const event = new CustomEvent('showNotification', {
    detail: { message, type, duration }
  });
  window.dispatchEvent(event);
};

export const triggerSuccessAnimation = (message = 'Success!') => {
  const event = new CustomEvent('showSuccess', {
    detail: { message }
  });
  window.dispatchEvent(event);
};

// Animation presets for common page layouts
export const pageLayouts = {
  dashboard: {
    container: 'fade-in',
    hero: 'slide-in-down',
    stats: 'fade-in-delay-1',
    actions: 'fade-in-delay-2',
    cards: 'stagger-item scale-on-hover'
  },
  
  form: {
    container: 'slide-in-up',
    header: 'fade-in-delay-1',
    fields: 'stagger-item',
    button: 'bounce-in'
  },
  
  list: {
    container: 'fade-in',
    header: 'slide-in-down',
    items: 'stagger-item scale-on-hover',
    actions: 'fade-in-delay-2'
  },
  
  detail: {
    container: 'fade-in',
    header: 'slide-in-down',
    content: 'fade-in-delay-1',
    sidebar: 'slide-in-right'
  }
};

// Utility to apply animations to page elements
export const applyPageAnimations = (layout = 'dashboard') => {
  const animations = pageLayouts[layout];
  
  return {
    container: animations.container,
    hero: animations.hero,
    content: animations.content || animations.stats,
    actions: animations.actions,
    items: animations.items || animations.cards || animations.fields
  };
};

export default {
  pageAnimationClasses,
  iconAnimations,
  getStaggerDelay,
  addRippleEffect,
  animateCounter,
  showNotification,
  triggerSuccessAnimation,
  pageLayouts,
  applyPageAnimations
};