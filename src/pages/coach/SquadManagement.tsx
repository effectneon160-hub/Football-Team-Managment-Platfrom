import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Award,
  Hash,
  AlertCircle,
  CheckCircle2,
  Save } from
'lucide-react';
import { api } from '../../data/db';
import { Player, PlayerStatus, Position } from '../../data/types';
const statusOptions: PlayerStatus[] = [
'Active',
'Injured',
'Suspended',
'Reserve'];

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Injured: 'bg-red-100 text-red-800 border-red-200',
  Suspended: 'bg-orange-100 text-orange-800 border-orange-200',
  Reserve: 'bg-gray-100 text-gray-700 border-gray-200'
};
export function SquadManagement() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingJersey, setEditingJersey] = useState<string | null>(null);
  const [jerseyValue, setJerseyValue] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fetchPlayers = async () => {
    try {
      const data = await api.getPlayers();
      setPlayers(data.sort((a, b) => a.jerseyNumber - b.jerseyNumber));
    } catch (err) {
      console.error('Failed to fetch players', err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPlayers();
  }, []);
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };
  const handleSetCaptain = async (playerId: string) => {
    try {
      await api.setCaptain(playerId);
      await fetchPlayers();
      showSuccess('Captain updated successfully.');
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleSetViceCaptain = async (playerId: string) => {
    try {
      await api.setViceCaptain(playerId);
      await fetchPlayers();
      showSuccess('Vice-captain updated successfully.');
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleStatusChange = async (playerId: string, status: PlayerStatus) => {
    try {
      await api.updatePlayerStatus(playerId, status);
      await fetchPlayers();
      showSuccess('Player status updated.');
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleJerseySave = async (playerId: string) => {
    const num = parseInt(jerseyValue);
    if (isNaN(num) || num < 1 || num > 99) {
      setError('Jersey number must be between 1 and 99.');
      return;
    }
    try {
      setError('');
      await api.updateJerseyNumber(playerId, num);
      setEditingJersey(null);
      await fetchPlayers();
      showSuccess(`Jersey number updated to #${num}.`);
    } catch (err: any) {
      setError(err.message);
    }
  };
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-96 bg-gray-200 rounded-xl"></div>
      </div>);

  }
  const captain = players.find((p) => p.isCaptain);
  const viceCaptain = players.find((p) => p.isViceCaptain);
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
        <h1 className="text-2xl font-bold text-gray-900">Squad Management</h1>
        <p className="text-gray-500 mt-1">
          Manage jersey numbers, captaincy, and player status.
        </p>
      </div>

      {error &&
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
          onClick={() => setError('')}
          className="text-red-400 hover:text-red-600">
          
            &times;
          </button>
        </div>
      }

      {successMsg &&
      <motion.div
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md flex items-center gap-3">
        
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <p className="text-sm text-emerald-700">{successMsg}</p>
        </motion.div>
      }

      {/* Captain & Vice-Captain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
            <h3 className="font-semibold text-gray-900">Team Captain</h3>
          </div>
          {captain ?
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
                {captain.jerseyNumber}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {captain.name}
                </p>
                <p className="text-sm text-gray-500">{captain.position}</p>
              </div>
            </div> :

          <p className="text-gray-400 text-sm">
              No captain assigned. Select one below.
            </p>
          }
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Vice-Captain</h3>
          </div>
          {viceCaptain ?
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl">
                {viceCaptain.jerseyNumber}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {viceCaptain.name}
                </p>
                <p className="text-sm text-gray-500">{viceCaptain.position}</p>
              </div>
            </div> :

          <p className="text-gray-400 text-sm">
              No vice-captain assigned. Select one below.
            </p>
          }
        </div>
      </div>

      {/* Full Squad Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Full Squad</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {players.map((player) =>
              <tr
                key={player.id}
                className="hover:bg-gray-50 transition-colors">
                
                  {/* Jersey Number */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingJersey === player.id ?
                  <div className="flex items-center gap-1">
                        <input
                      type="number"
                      min={1}
                      max={99}
                      value={jerseyValue}
                      onChange={(e) => setJerseyValue(e.target.value)}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:ring-emerald-500 focus:border-emerald-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleJerseySave(player.id);
                        if (e.key === 'Escape') setEditingJersey(null);
                      }} />
                    
                        <button
                      onClick={() => handleJerseySave(player.id)}
                      className="text-emerald-600 hover:text-emerald-800">
                      
                          <Save className="w-4 h-4" />
                        </button>
                      </div> :

                  <button
                    onClick={() => {
                      setEditingJersey(player.id);
                      setJerseyValue(String(player.jerseyNumber));
                      setError('');
                    }}
                    className="w-10 h-10 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center font-bold text-sm hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                    title="Click to edit jersey number">
                    
                        {player.jerseyNumber}
                      </button>
                  }
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {player.name}
                      </span>
                      {player.isCaptain &&
                    <Star
                      className="w-4 h-4 text-amber-500"
                      fill="currentColor" />

                    }
                      {player.isViceCaptain &&
                    <Award className="w-4 h-4 text-blue-500" />
                    }
                    </div>
                  </td>

                  {/* Position */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {player.position}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                    value={player.status}
                    onChange={(e) =>
                    handleStatusChange(
                      player.id,
                      e.target.value as PlayerStatus
                    )
                    }
                    className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer ${statusColors[player.status]}`}>
                    
                      {statusOptions.map((s) =>
                    <option key={s} value={s}>
                          {s}
                        </option>
                    )}
                    </select>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {player.isCaptain ?
                  <span className="text-amber-700 font-medium">
                        Captain
                      </span> :
                  player.isViceCaptain ?
                  <span className="text-blue-700 font-medium">
                        Vice-Captain
                      </span> :

                  <span className="text-gray-400">—</span>
                  }
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {!player.isCaptain &&
                    <button
                      onClick={() => handleSetCaptain(player.id)}
                      className="text-xs px-2.5 py-1 rounded border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                      title="Make Captain">
                      
                          <Star className="w-3 h-3 inline mr-1" />
                          Captain
                        </button>
                    }
                      {!player.isViceCaptain && !player.isCaptain &&
                    <button
                      onClick={() => handleSetViceCaptain(player.id)}
                      className="text-xs px-2.5 py-1 rounded border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                      title="Make Vice-Captain">
                      
                          <Award className="w-3 h-3 inline mr-1" />
                          Vice
                        </button>
                    }
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>);

}