import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DietPage from './pages/DietPage';
import WorkoutPage from './pages/WorkoutPage';
import StatsPage from './pages/StatsPage';
import AICoachPage from './pages/AICoachPage';
import PhotosPage from './pages/PhotosPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/diet" element={<DietPage />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/ai" element={<AICoachPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
