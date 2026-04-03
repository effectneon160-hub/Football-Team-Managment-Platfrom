import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
// Coach Pages
import { CoachDashboard } from './pages/coach/CoachDashboard';
import { TeamManagement } from './pages/coach/TeamManagement';
import { PlayerProfile } from './pages/coach/PlayerProfile';
import { EventList } from './pages/coach/EventList';
import { EventCreation } from './pages/coach/EventCreation';
import { AvailabilityView } from './pages/coach/AvailabilityView';
import { AnnouncementsPage } from './pages/coach/AnnouncementsPage';
import { MatchHistory } from './pages/coach/MatchHistory';
import { TeamRoster } from './pages/coach/TeamRoster';
import { TeamStatistics } from './pages/coach/TeamStatistics';
import { SquadManagement } from './pages/coach/SquadManagement';
// Player Pages
import { PlayerDashboard } from './pages/player/PlayerDashboard';
import { PlayerEventList } from './pages/player/PlayerEventList';
import { PlayerAnnouncements } from './pages/player/PlayerAnnouncements';
import { PlayerStats } from './pages/player/PlayerStats';
import { PlayerRoster } from './pages/player/PlayerRoster';
// Root redirect component
const RootRedirect = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'coach' ? '/coach' : '/player'} replace />;
};
export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<RootRedirect />} />

          {/* Coach Routes */}
          <Route
            path="/coach"
            element={
            <ProtectedRoute allowedRoles={['coach']}>
                <Layout />
              </ProtectedRoute>
            }>
            
            <Route index element={<CoachDashboard />} />
            <Route path="roster" element={<TeamRoster />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="team/:id" element={<PlayerProfile />} />
            <Route path="squad" element={<SquadManagement />} />
            <Route path="statistics" element={<TeamStatistics />} />
            <Route path="events" element={<EventList />} />
            <Route path="events/new" element={<EventCreation />} />
            <Route path="availability" element={<AvailabilityView />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="matches" element={<MatchHistory />} />
          </Route>

          {/* Player Routes */}
          <Route
            path="/player"
            element={
            <ProtectedRoute allowedRoles={['player']}>
                <Layout />
              </ProtectedRoute>
            }>
            
            <Route index element={<PlayerDashboard />} />
            <Route path="roster" element={<PlayerRoster />} />
            <Route path="events" element={<PlayerEventList />} />
            <Route path="announcements" element={<PlayerAnnouncements />} />
            <Route path="stats" element={<PlayerStats />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>);

}