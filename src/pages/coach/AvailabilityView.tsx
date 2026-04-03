import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { api } from '../../data/db';
import { Event, Player, Availability } from '../../data/types';
export const AvailabilityView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [eventsData, playersData] = await Promise.all([
        api.getEvents(),
        api.getPlayers()]
        );
        // Filter out past events for availability checking
        const upcomingEvents = eventsData.filter(
          (e) => new Date(e.date) > new Date()
        );
        setEvents(upcomingEvents);
        setPlayers(playersData);
        if (upcomingEvents.length > 0) {
          setSelectedEventId(upcomingEvents[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);
  useEffect(() => {
    if (!selectedEventId) return;
    const fetchAvailabilities = async () => {
      try {
        const data = await api.getAvailabilities(selectedEventId);
        setAvailabilities(data);
      } catch (error) {
        console.error('Failed to fetch availabilities', error);
      }
    };
    fetchAvailabilities();
  }, [selectedEventId]);
  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded-xl"></div>;
  }
  const selectedEvent = events.find((e) => e.id === selectedEventId);
  // Combine players with their availability status
  const playerStatuses = players.map((player) => {
    const status =
    availabilities.find((a) => a.playerId === player.id)?.status || 'Pending';
    return {
      ...player,
      status
    };
  });
  const availableCount = playerStatuses.filter(
    (p) => p.status === 'Available'
  ).length;
  const notAvailableCount = playerStatuses.filter(
    (p) => p.status === 'Not Available'
  ).length;
  const pendingCount = playerStatuses.filter(
    (p) => p.status === 'Pending'
  ).length;
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
        <h1 className="text-2xl font-bold text-gray-900">
          Player Availability
        </h1>
        <p className="text-gray-500 mt-1">
          Check who is available for upcoming events.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Event
        </label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-emerald-500 focus:border-emerald-500">
          
          {events.map((event) =>
          <option key={event.id} value={event.id}>
              {event.title} - {new Date(event.date).toLocaleDateString()}
            </option>
          )}
          {events.length === 0 && <option value="">No upcoming events</option>}
        </select>
      </div>

      {selectedEvent &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />{' '}
                    Available
                  </span>
                  <span className="font-bold text-gray-900">
                    {availableCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-sm text-gray-600">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" /> Not
                    Available
                  </span>
                  <span className="font-bold text-gray-900">
                    {notAvailableCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" /> Pending
                  </span>
                  <span className="font-bold text-gray-900">
                    {pendingCount}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                    className="bg-emerald-500 h-2.5 rounded-full"
                    style={{
                      width: `${availableCount / players.length * 100}%`
                    }}>
                  </div>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    {Math.round(availableCount / players.length * 100)}% Squad
                    Available
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Player Responses</h3>
            </div>
            <ul className="divide-y divide-gray-100">
              {playerStatuses.map((player) =>
            <li
              key={player.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      {player.name.
                  split(' ').
                  map((n) => n[0]).
                  join('').
                  substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {player.name}
                      </p>
                      <p className="text-xs text-gray-500">{player.position}</p>
                    </div>
                  </div>
                  <div>
                    {player.status === 'Available' &&
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Available
                      </span>
                }
                    {player.status === 'Not Available' &&
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" /> Not Available
                      </span>
                }
                    {player.status === 'Pending' &&
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                      </span>
                }
                  </div>
                </li>
            )}
            </ul>
          </div>
        </div>
      }
    </motion.div>);

};