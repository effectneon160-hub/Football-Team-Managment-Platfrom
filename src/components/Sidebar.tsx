import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  Megaphone,
  Trophy,
  LogOut,
  ShieldHalf,
  ClipboardList,
  BarChart3,
  UserCog } from
'lucide-react';
export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;
  const coachLinks = [
  {
    to: '/coach',
    icon: LayoutDashboard,
    label: 'Dashboard',
    end: true
  },
  {
    to: '/coach/roster',
    icon: ClipboardList,
    label: 'Team Roster'
  },
  {
    to: '/coach/team',
    icon: Users,
    label: 'Team Management'
  },
  {
    to: '/coach/squad',
    icon: UserCog,
    label: 'Squad Management'
  },
  {
    to: '/coach/statistics',
    icon: BarChart3,
    label: 'Statistics'
  },
  {
    to: '/coach/events',
    icon: Calendar,
    label: 'Events'
  },
  {
    to: '/coach/availability',
    icon: CheckSquare,
    label: 'Availability'
  },
  {
    to: '/coach/announcements',
    icon: Megaphone,
    label: 'Announcements'
  },
  {
    to: '/coach/matches',
    icon: Trophy,
    label: 'Match History'
  }];

  const playerLinks = [
  {
    to: '/player',
    icon: LayoutDashboard,
    label: 'Dashboard',
    end: true
  },
  {
    to: '/player/roster',
    icon: ClipboardList,
    label: 'Team Roster'
  },
  {
    to: '/player/events',
    icon: Calendar,
    label: 'My Events'
  },
  {
    to: '/player/announcements',
    icon: Megaphone,
    label: 'Announcements'
  },
  {
    to: '/player/stats',
    icon: Trophy,
    label: 'My Stats'
  }];

  const links = user.role === 'coach' ? coachLinks : playerLinks;
  return (
    <div className="flex flex-col w-64 bg-emerald-900 text-white h-screen sticky top-0 shadow-xl">
      <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
        <div className="bg-white p-2 rounded-lg">
          <ShieldHalf className="w-6 h-6 text-emerald-800" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">Falcon FC</h1>
          <p className="text-emerald-300 text-xs font-medium uppercase tracking-wider">
            Management
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) =>
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-800 text-white font-medium' : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'}`
          }>
          
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-emerald-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-emerald-300 capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full text-left text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors">
          
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>);

};