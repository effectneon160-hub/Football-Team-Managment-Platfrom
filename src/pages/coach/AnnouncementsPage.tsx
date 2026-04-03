import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Plus } from 'lucide-react';
import { api } from '../../data/db';
import { Announcement } from '../../data/types';
import { useAuth } from '../../context/AuthContext';
export const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: ''
  });
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
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await api.createAnnouncement({
        title: newAnnouncement.title,
        message: newAnnouncement.message,
        author: user.name
      });
      setNewAnnouncement({
        title: '',
        message: ''
      });
      setIsCreating(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to create announcement', error);
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
      className="space-y-6 max-w-4xl mx-auto">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 mt-1">
            Broadcast messages to the entire team.
          </p>
        </div>
        {!isCreating &&
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
          
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        }
      </div>

      {isCreating &&
      <motion.div
        initial={{
          opacity: 0,
          height: 0
        }}
        animate={{
          opacity: 1,
          height: 'auto'
        }}
        className="bg-white p-6 rounded-xl shadow-sm border border-emerald-200">
        
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Post New Announcement
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
              type="text"
              required
              value={newAnnouncement.title}
              onChange={(e) =>
              setNewAnnouncement({
                ...newAnnouncement,
                title: e.target.value
              })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. Training Cancelled Today" />
            
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
              required
              rows={4}
              value={newAnnouncement.message}
              onChange={(e) =>
              setNewAnnouncement({
                ...newAnnouncement,
                message: e.target.value
              })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Write your message here..." />
            
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              
                Cancel
              </button>
              <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
              
                Post
              </button>
            </div>
          </form>
        </motion.div>
      }

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
            <p className="mt-1 text-sm text-gray-500">
              Create one to notify the team.
            </p>
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