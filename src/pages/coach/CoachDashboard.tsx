import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Megaphone, Activity } from 'lucide-react';
import { api } from '../../data/db';
import { Player, Event, Announcement } from '../../data/types';
import { Link } from 'react-router-dom';
export const CoachDashboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersData, eventsData, announcementsData] = await Promise.all([
        api.getPlayers(),
        api.getEvents(),
        api.getAnnouncements()]
        );
        setPlayers(playersData);
        setEvents(eventsData);
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) =>
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          )}
        </div>
      </div>);

  }
  const upcomingEvents = events.
  filter((e) => new Date(e.date) > new Date()).
  slice(0, 3);
  const recentAnnouncements = announcements.slice(0, 2);
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, Coach. Here's what's happening with Falcon FC.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Squad</p>
            <p className="text-2xl font-bold text-gray-900">{players.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-900">
              {upcomingEvents.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Goals</p>
            <p className="text-2xl font-bold text-gray-900">
              {players.reduce((sum, p) => sum + p.goals, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Next Events</h2>
            <Link
              to="/coach/events"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingEvents.length > 0 ?
            upcomingEvents.map((event) =>
            <div
              key={event.id}
              className="p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors">
              
                  <div
                className={`mt-1 w-2 h-2 rounded-full ${event.type === 'Match' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
              
                  <div>
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <div className="mt-1 text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-4">
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
            ) :

            <div className="p-6 text-center text-gray-500">
                No upcoming events scheduled.
              </div>
            }
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Announcements
            </h2>
            <Link
              to="/coach/announcements"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAnnouncements.length > 0 ?
            recentAnnouncements.map((announcement) =>
            <div
              key={announcement.id}
              className="p-6 hover:bg-gray-50 transition-colors">
              
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">
                      {announcement.title}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {announcement.message}
                  </p>
                </div>
            ) :

            <div className="p-6 text-center text-gray-500">
                No recent announcements.
              </div>
            }
          </div>
        </div>
      </div>
    </motion.div>);

};