import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle } from
'lucide-react';
import { api } from '../../data/db';
import { Event, AvailabilityStatus } from '../../data/types';
import { useAuth } from '../../context/AuthContext';
export const PlayerEventList: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [availabilities, setAvailabilities] = useState<
    Record<string, AvailabilityStatus>>(
    {});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.playerId) return;
      try {
        const [eventsData, availData] = await Promise.all([
        api.getEvents(),
        api.getPlayerAvailabilities(user.playerId)]
        );
        // Only show upcoming events for availability toggling
        const upcoming = eventsData.filter((e) => new Date(e.date) > new Date());
        setEvents(upcoming);
        const availMap: Record<string, AvailabilityStatus> = {};
        availData.forEach((a) => {
          availMap[a.eventId] = a.status;
        });
        setAvailabilities(availMap);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);
  const handleStatusChange = async (
  eventId: string,
  status: AvailabilityStatus) =>
  {
    if (!user?.playerId) return;
    // Optimistic update
    setAvailabilities((prev) => ({
      ...prev,
      [eventId]: status
    }));
    try {
      await api.updateAvailability(eventId, user.playerId, status);
    } catch (error) {
      console.error('Failed to update availability', error);
      // Revert on failure (simplified)
    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-500 mt-1">
          View upcoming events and mark your availability.
        </p>
      </div>

      {isLoading ?
      <div className="grid gap-4">
          {[1, 2, 3].map((i) =>
        <div
          key={i}
          className="h-32 bg-gray-200 rounded-xl animate-pulse">
        </div>
        )}
        </div> :
      events.length === 0 ?
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No upcoming events
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Check back later for new matches and training sessions.
          </p>
        </div> :

      <div className="grid gap-4">
          {events.map((event) => {
          const date = new Date(event.date);
          const status = availabilities[event.id] || 'Pending';
          return (
            <div
              key={event.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
                <div className="flex items-start gap-4">
                  <div
                  className={`mt-1 flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white ${event.type === 'Match' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                  
                    <span className="text-xs font-semibold uppercase">
                      {date.toLocaleString('default', {
                      month: 'short'
                    })}
                    </span>
                    <span className="text-xl font-bold leading-none">
                      {date.getDate()}
                    </span>
                  </div>
                  <div>
                    <span
                    className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${event.type === 'Match' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    
                      {event.type}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">
                      {event.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {date.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 lg:border-l lg:border-gray-100 lg:pl-6">
                  <p className="text-sm font-medium text-gray-500 w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
                    Are you available?
                  </p>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                    onClick={() => handleStatusChange(event.id, 'Available')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${status === 'Available' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
                    
                      <CheckCircle2 className="w-4 h-4" /> Yes
                    </button>
                    <button
                    onClick={() =>
                    handleStatusChange(event.id, 'Not Available')
                    }
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${status === 'Not Available' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
                    
                      <XCircle className="w-4 h-4" /> No
                    </button>
                  </div>
                </div>
              </div>);

        })}
        </div>
      }
    </motion.div>);

};