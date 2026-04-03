import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, AlertCircle } from 'lucide-react';
import { api } from '../../data/db';
import { Player } from '../../data/types';
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
const badgeColors: Record<string, string> = {
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  red: 'bg-red-500'
};
const headerColors: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-900 border-amber-200',
  blue: 'bg-blue-100 text-blue-900 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  red: 'bg-red-100 text-red-900 border-red-200'
};
const bgColors: Record<string, string> = {
  amber: 'bg-amber-50 border-amber-200',
  blue: 'bg-blue-50 border-blue-200',
  emerald: 'bg-emerald-50 border-emerald-200',
  red: 'bg-red-50 border-red-200'
};
export function PlayerRoster() {
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
        {[1, 2, 3].map((i) =>
        <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
        )}
      </div>);

  }
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
          Meet the Falcon FC squad — {players.length} players.
        </p>
      </div>

      {positionGroups.map((group) => {
        const groupPlayers = players.filter((p) =>
        group.positions.includes(p.position)
        );
        if (groupPlayers.length === 0) return null;
        return (
          <div
            key={group.label}
            className={`rounded-xl border overflow-hidden ${bgColors[group.color]}`}>
            
            <div className={`px-6 py-3 ${headerColors[group.color]} border-b`}>
              <h2 className="font-bold text-sm uppercase tracking-wider">
                {group.label}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {groupPlayers.map((player) =>
              <div
                key={player.id}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div
                      className={`w-12 h-12 rounded-full ${badgeColors[group.color]} text-white flex items-center justify-center font-bold text-lg`}>
                      
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
                        <p className="font-semibold text-gray-900 truncate">
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
                      </div>
                      <div className="mt-2">
                        <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[player.status]}`}>
                        
                          {player.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>);

      })}
    </motion.div>);

}