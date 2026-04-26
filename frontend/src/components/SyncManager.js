import { useEffect, useCallback } from 'react';
import { syncUtils } from '../services/api';

function SyncManager({ onDataUpdate }) {
  // Check for updates from other devices
  const checkForUpdates = useCallback(async () => {
    try {
      // This would typically check a server endpoint for data changes
      // For now, we'll use visibility change to trigger refresh
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }, [onDataUpdate]);

  useEffect(() => {
    // Listen for page visibility changes (user switching back to tab/app)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible - check for updates
        setTimeout(checkForUpdates, 1000); // Small delay to ensure proper loading
      }
    };

    // Listen for focus events (user switching back to window)
    const handleFocus = () => {
      checkForUpdates();
    };

    // Listen for custom force refresh events
    const handleForceRefresh = () => {
      checkForUpdates();
    };

    // Listen for online/offline events
    const handleOnline = () => {
      // When coming back online, sync data
      checkForUpdates();
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('forceDataRefresh', handleForceRefresh);
    window.addEventListener('online', handleOnline);

    // Periodic sync check (every 5 minutes when page is active)
    const syncInterval = setInterval(() => {
      if (!document.hidden) {
        checkForUpdates();
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('forceDataRefresh', handleForceRefresh);
      window.removeEventListener('online', handleOnline);
      clearInterval(syncInterval);
    };
  }, [checkForUpdates]);

  // This component doesn't render anything
  return null;
}

export default SyncManager;