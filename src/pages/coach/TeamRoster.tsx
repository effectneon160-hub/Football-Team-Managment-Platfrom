import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Award, AlertCircle } from 'lucide-react';
import { api } from '../../data/db';
import { Player } from '../../data/types';
import { Link } from 'react-router-dom';
const positionGroups = [
{
  label: 'Goalkeepers',
  positions: ['Goalkeeper'],
  color: 'amber'
},
{
  label: 'Defenders',
  positions: ['Defender'],
  color: 'blue'
},
{
  label: 'Midfielders',
  positions: ['Midfielder'],
  color: 'emerald'
},
{
  label: 'Forwards',
  positions: ['Forward', 'Striker'],
  color: 'red'
}];

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-800',
  Injured: 'bg-red-100 text-red-800',
  Suspended: 'bg-orange-100 text-orange-800',
  Reserve: 'bg-gray-100 text-gray-700'
};
const groupAccentColors: Record<
  string,
  {
    bg: string;
    border: string;
    badge: string;
    headerBg: string;
  }> =
{
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-500',
    headerBg: 'bg-amber-100 text-amber-900'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-500',
    headerBg: 'bg-blue-100 text-blue-900'
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-500',
    headerBg: 'bg-emerald-100 text-emerald-900'
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-500',
    headerBg: 'bg-red-100 text-red-900'
  }
};
export function TeamRoster() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await api.getPlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Failed to fetch players', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayers();
  }, []);
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        {[1, 2, 3, 4].map((i) =>
        <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
        )}
      </div>);

  }
  const activePlayers = players.filter((p) => p.status === 'Active').length;
  const injuredPlayers = players.filter((p) => p.status === 'Injured').length;
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Roster</h1>
        <p className="text-gray-500 mt-1">
          Full squad overview for Falcon FC — {players.length} players
          registered.
        </p>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-900">{players.length}</p>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
            Total Squad
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-emerald-700">{activePlayers}</p>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
            Active
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{injuredPlayers}</p>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
            Injured
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-600">
            {players.reduce((s, p) => s + p.goals, 0)}
          </p>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
            Total Goals
          </p>
        </div>
      </div>

      {/* Position Groups */}
      {positionGroups.map((group) => {
        const groupPlayers = players.filter((p) =>
        group.positions.includes(p.position)
        );
        if (groupPlayers.length === 0) return null;
        const accent = groupAccentColors[group.color];
        return (
          <div
            key={group.label}
            className={`rounded-xl border ${accent.border} overflow-hidden`}>
            
            <div
              className={`px-6 py-3 ${accent.headerBg} flex items-center justify-between`}>
              
              <h2 className="font-bold text-sm uppercase tracking-wider">
                {group.label}
              </h2>
              <span className="text-xs font-medium opacity-70">
                {groupPlayers.length} player
                {groupPlayers.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className={`${accent.bg}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {groupPlayers.map((player) =>
                <Link
                  key={player.id}
                  to={`/coach/team/${player.id}`}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div
                        className={`w-12 h-12 rounded-full ${accent.badge} text-white flex items-center justify-center font-bold text-lg`}>
                        
                          {player.jerseyNumber}
                        </div>
                        {player.status === 'Injured' &&
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-3 h-3 text-white" />
                          </div>
                      }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                            {player.name}
                          </p>
                          {player.isCaptain &&
                        <Star
                          className="w-4 h-4 text-amber-500 flex-shrink-0"
                          fill="currentColor" />

                        }
                          {player.isViceCaptain &&
                        <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        }
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {player.position}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{player.appearances} apps</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{player.goals} goals</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{player.assists} assists</span>
                        </div>
                        <div className="mt-2">
                          <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[player.status]}`}>
                          
                            {player.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>);

      })}
    </motion.div>);

}