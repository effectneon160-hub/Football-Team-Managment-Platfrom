import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Activity,
  Target,
  Calendar,
  Star,
  Award,
  AlertCircle,
  Hash } from
'lucide-react';
import { api } from '../../data/db';
import { Player } from '../../data/types';
const statusColors: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-800',
  Injured: 'bg-red-100 text-red-800',
  Suspended: 'bg-orange-100 text-orange-800',
  Reserve: 'bg-gray-100 text-gray-700'
};
export const PlayerProfile: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchPlayer = async () => {
      if (!id) return;
      try {
        const data = await api.getPlayer(id);
        setPlayer(data || null);
      } catch (error) {
        console.error('Failed to fetch player', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>);

  }
  if (!player) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Player not found</h2>
        <Link
          to="/coach/team"
          className="text-emerald-600 hover:underline mt-4 inline-block">
          
          Return to Team Management
        </Link>
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
      className="space-y-6">
      
      <Link
        to="/coach/team"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
        
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Team
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-emerald-800"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-700 shadow-sm">
                {player.jerseyNumber}
              </div>
              <div className="mb-2 flex items-center gap-2">
                {player.isCaptain &&
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                    <Star className="w-3 h-3" fill="currentColor" /> Captain
                  </span>
                }
                {player.isViceCaptain &&
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    <Award className="w-3 h-3" /> Vice-Captain
                  </span>
                }
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[player.status]}`}>
                  
                  {player.status}
                </span>
              </div>
            </div>
            <span className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold border border-gray-200">
              {player.position}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
            <p className="text-gray-500 mt-1">
              #{player.jerseyNumber} • Joined{' '}
              {new Date(player.joinedDate).toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {player.appearances}
              </p>
              <p className="text-xs font-medium text-gray-500 mt-1">
                Appearances
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-900">{player.goals}</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Goals</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {player.assists}
              </p>
              <p className="text-xs font-medium text-gray-500 mt-1">Assists</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {player.appearances > 0 ?
                (player.goals / player.appearances).toFixed(2) :
                '0.00'}
              </p>
              <p className="text-xs font-medium text-gray-500 mt-1">
                Goals/Game
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-4 h-5 bg-yellow-400 rounded-sm"></div>
                <p className="text-2xl font-bold text-gray-900">
                  {player.yellowCards}
                </p>
              </div>
              <p className="text-xs font-medium text-gray-500 mt-1">Yellows</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-4 h-5 bg-red-500 rounded-sm"></div>
                <p className="text-2xl font-bold text-gray-900">
                  {player.redCards}
                </p>
              </div>
              <p className="text-xs font-medium text-gray-500 mt-1">Reds</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>);

};