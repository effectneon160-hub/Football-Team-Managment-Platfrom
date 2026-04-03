import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { api } from '../../data/db';
import { Event } from '../../data/types';
import { Link } from 'react-router-dom';
export const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);
  const filteredEvents = events.filter((event) => {
    const isUpcoming = new Date(event.date) > new Date();
    if (filter === 'upcoming') return isUpcoming;
    if (filter === 'past') return !isUpcoming;
    return true;
  });
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Schedule</h1>
          <p className="text-gray-500 mt-1">
            Manage matches, training sessions, and team events.
          </p>
        </div>
        <Link
          to="/coach/events/new"
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
          
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-4">
        {(['all', 'upcoming', 'past'] as const).map((f) =>
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          
            {f}
          </button>
        )}
      </div>

      {isLoading ?
      <div className="grid gap-4">
          {[1, 2, 3].map((i) =>
        <div
          key={i}
          className="h-24 bg-gray-200 rounded-xl animate-pulse">
        </div>
        )}
        </div> :
      filteredEvents.length === 0 ?
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No events found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new event.
          </p>
        </div> :

      <div className="grid gap-4">
          {filteredEvents.map((event) => {
          const date = new Date(event.date);
          const isPast = date < new Date();
          return (
            <div
              key={event.id}
              className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md ${isPast ? 'opacity-75' : ''}`}>
              
                <div className="flex items-start gap-4">
                  <div
                  className={`mt-1 flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white ${event.type === 'Match' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                  
                    <span className="text-xs font-semibold uppercase">
                      {date.toLocaleString('default', {
                      month: 'short'
                    })}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {date.getDate()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                      className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${event.type === 'Match' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      
                        {event.type}
                      </span>
                      {isPast &&
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          Past
                        </span>
                    }
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
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
              </div>);

        })}
        </div>
      }
    </motion.div>);

};