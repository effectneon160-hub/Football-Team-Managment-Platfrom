import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import { api } from '../../data/db';
import { Announcement } from '../../data/types';
export const PlayerAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await api.getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="space-y-6 max-w-4xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Announcements</h1>
        <p className="text-gray-500 mt-1">
          Stay up to date with the latest news from the coach.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ?
        <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) =>
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          )}
          </div> :
        announcements.length === 0 ?
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No announcements
            </h3>
            <p className="mt-1 text-sm text-gray-500">You're all caught up.</p>
          </div> :

        announcements.map((announcement) =>
        <div
          key={announcement.id}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Posted by {announcement.author}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(announcement.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {announcement.message}
              </p>
            </div>
        )
        }
      </div>
    </motion.div>);

};