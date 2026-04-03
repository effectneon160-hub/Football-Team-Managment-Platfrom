import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Activity, Megaphone } from 'lucide-react';
import { api } from '../../data/db';
import { Event, Player, Announcement } from '../../data/types';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
export const PlayerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [playerInfo, setPlayerInfo] = useState<Player | null>(null);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [recentAnnouncement, setRecentAnnouncement] =
  useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.playerId) return;
      try {
        const [playerData, eventsData, announcementsData] = await Promise.all([
        api.getPlayer(user.playerId),
        api.getEvents(),
        api.getAnnouncements()]
        );
        setPlayerInfo(playerData || null);
        const upcoming = eventsData.filter((e) => new Date(e.date) > new Date());
        setNextEvent(upcoming.length > 0 ? upcoming[0] : null);
        setRecentAnnouncement(
          announcementsData.length > 0 ? announcementsData[0] : null
        );
      } catch (error) {
        console.error('Failed to fetch player dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded-xl"></div>
          <div className="h-48 bg-gray-200 rounded-xl"></div>
        </div>
      </div>);

  }
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
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's your overview for Falcon FC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-700 text-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Position</p>
            <p className="text-2xl font-bold mt-1">{playerInfo?.position}</p>
          </div>
          <div className="p-3 bg-emerald-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Appearances</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {playerInfo?.appearances}
            </p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Goals</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {playerInfo?.goals}
            </p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Event Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Next Event</h2>
            <Link
              to="/player/events"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              
              View Schedule
            </Link>
          </div>
          <div className="p-6">
            {nextEvent ?
            <div className="flex items-start gap-4">
                <div
                className={`mt-1 flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white ${nextEvent.type === 'Match' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                
                  <span className="text-xs font-semibold uppercase">
                    {new Date(nextEvent.date).toLocaleString('default', {
                    month: 'short'
                  })}
                  </span>
                  <span className="text-xl font-bold leading-none">
                    {new Date(nextEvent.date).getDate()}
                  </span>
                </div>
                <div>
                  <span
                  className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${nextEvent.type === 'Match' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  
                    {nextEvent.type}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {nextEvent.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(nextEvent.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}{' '}
                    • {nextEvent.location}
                  </p>
                  <Link
                  to="/player/events"
                  className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  
                    Update Availability &rarr;
                  </Link>
                </div>
              </div> :

            <p className="text-gray-500 text-center py-4">
                No upcoming events scheduled.
              </p>
            }
          </div>
        </div>

        {/* Latest Announcement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Latest Announcement
            </h2>
            <Link
              to="/player/announcements"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              
              View all
            </Link>
          </div>
          <div className="p-6">
            {recentAnnouncement ?
            <div>
                <div className="flex items-center gap-2 mb-2">
                  <Megaphone className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-gray-900">
                    {recentAnnouncement.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {recentAnnouncement.message}
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  Posted by {recentAnnouncement.author} on{' '}
                  {new Date(recentAnnouncement.date).toLocaleDateString()}
                </p>
              </div> :

            <p className="text-gray-500 text-center py-4">
                No recent announcements.
              </p>
            }
          </div>
        </div>
      </div>
    </motion.div>);

};