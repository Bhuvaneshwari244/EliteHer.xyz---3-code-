import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { authAPI, syncUtils } from './services/api';
import SyncManager from './components/SyncManager';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CycleTracker from './pages/CycleTracker';
import SymptomLogger from './pages/SymptomLogger';
import PCODAssessment from './pages/PCODAssessment';
import HealthInsightsPage from './pages/HealthInsightsPage';
import WellnessHub from './pages/WellnessHub';
import CalendarView from './pages/CalendarView';
import Journal from './pages/Journal';
import DoctorConsultation from './pages/DoctorConsultation';
import Settings from './pages/Settings';
import AdvancedFeatures from './pages/AdvancedFeatures';
import AdvancedFeaturesV2 from './pages/AdvancedFeaturesV2';
import VideoLibraryPage from './pages/VideoLibraryPage';
import Trackers from './pages/Trackers';
import HealthDataHub from './pages/HealthDataHub';
import PregnancyMode from './pages/PregnancyMode';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token is still valid by making a test API call
          await authAPI.getProfile();
          setIsAuthenticated(true);
          
          // Update sync time on successful login verification
          syncUtils.updateSyncTime();
        } catch (error) {
          // Only clear token if it's actually invalid (401), not for network errors
          if (error.response?.status === 401) {
            // Token is invalid, remove it and clear all local data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('lastSyncTime');
            setIsAuthenticated(false);
          } else {
            // Network error or server down - keep user logged in
            console.warn('Could not verify token, but keeping session:', error.message);
            setIsAuthenticated(true);
          }
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Handle data refresh from sync manager
  const handleDataRefresh = () => {
    setDataRefreshTrigger(prev => prev + 1);
  };

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }
    return isAuthenticated ? (
      <>
        {children}
        <SyncManager onDataUpdate={handleDataRefresh} />
      </>
    ) : (
      <Navigate to="/login" />
    );
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
              <Route path="/register" element={<Register setAuth={setIsAuthenticated} />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/symptoms" element={
              <ProtectedRoute>
                <SymptomLogger />
              </ProtectedRoute>
            } />
            <Route path="/health-data" element={
              <ProtectedRoute>
                <HealthDataHub />
              </ProtectedRoute>
            } />
            <Route path="/pcod-assessment" element={
              <ProtectedRoute>
                <PCODAssessment />
              </ProtectedRoute>
            } />
            <Route path="/health-insights" element={
              <ProtectedRoute>
                <HealthInsightsPage />
              </ProtectedRoute>
            } />
            <Route path="/wellness-hub" element={
              <ProtectedRoute>
                <WellnessHub />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <CalendarView />
              </ProtectedRoute>
            } />
            <Route path="/journal" element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            } />
            <Route path="/doctor-consultation" element={
              <ProtectedRoute>
                <DoctorConsultation />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/advanced-features" element={
              <ProtectedRoute>
                <AdvancedFeatures />
              </ProtectedRoute>
            } />
            <Route path="/video-library" element={
              <ProtectedRoute>
                <VideoLibraryPage />
              </ProtectedRoute>
            } />
            <Route path="/trackers" element={
              <ProtectedRoute>
                <Trackers />
              </ProtectedRoute>
            } />
            <Route path="/pregnancy" element={
              <ProtectedRoute>
                <PregnancyMode />
              </ProtectedRoute>
            } />
            <Route path="/phase4" element={
              <ProtectedRoute>
                <AdvancedFeaturesV2 />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
