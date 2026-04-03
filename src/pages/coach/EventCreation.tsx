import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { api } from '../../data/db';
import { EventType } from '../../data/types';
export const EventCreation: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    type: 'Training' as EventType,
    date: '',
    time: '',
    location: ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // Combine date and time into ISO string
      const dateTimeString = `${formData.date}T${formData.time}:00`;
      const dateObj = new Date(dateTimeString);
      await api.createEvent({
        title: formData.title,
        type: formData.type,
        date: dateObj.toISOString(),
        location: formData.location
      });
      navigate('/coach/events');
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };
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
      className="max-w-2xl mx-auto space-y-6">
      
      <Link
        to="/coach/events"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
        
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-500 mt-1">
          Schedule a new match or training session.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {error &&
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        }

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value
              })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. League Match vs Thunder United" />
            
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                setFormData({
                  ...formData,
                  type: 'Training'
                })
                }
                className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${formData.type === 'Training' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                
                Training
              </button>
              <button
                type="button"
                onClick={() =>
                setFormData({
                  ...formData,
                  type: 'Match'
                })
                }
                className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${formData.type === 'Match' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                
                Match
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  date: e.target.value
                })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-emerald-500 focus:border-emerald-500" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  time: e.target.value
                })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-emerald-500 focus:border-emerald-500" />
              
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) =>
              setFormData({
                ...formData,
                location: e.target.value
              })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. Riverside Stadium" />
            
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              to="/coach/events"
              className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors disabled:opacity-70">
              
              {isLoading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>);

};