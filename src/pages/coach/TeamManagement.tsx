import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit2,
  ChevronRight,
  Star,
  Award } from
'lucide-react';
import { api } from '../../data/db';
import { Player, Position, PlayerStatus } from '../../data/types';
import { Link } from 'react-router-dom';
const statusColors: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-800',
  Injured: 'bg-red-100 text-red-800',
  Suspended: 'bg-orange-100 text-orange-800',
  Reserve: 'bg-gray-100 text-gray-700'
};
export const TeamManagement: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: 'Midfielder' as Position,
    jerseyNumber: 99,
    status: 'Active' as PlayerStatus,
    joinedDate: new Date().toISOString()
  });
  const fetchPlayers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPlayers();
      setPlayers(data);
    } catch (error) {
      console.error('Failed to fetch players', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPlayers();
  }, []);
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addPlayer(newPlayer);
      setIsAddModalOpen(false);
      setNewPlayer({
        name: '',
        position: 'Midfielder',
        jerseyNumber: 99,
        status: 'Active',
        joinedDate: new Date().toISOString()
      });
      fetchPlayers();
    } catch (error) {
      console.error('Failed to add player', error);
    }
  };
  const handleDeletePlayer = async (id: string) => {
    if (
    window.confirm(
      'Are you sure you want to remove this player from the team?'
    ))
    {
      try {
        await api.deletePlayer(id);
        fetchPlayers();
      } catch (error) {
        console.error('Failed to delete player', error);
      }
    }
  };
  const filteredPlayers = players.filter(
    (p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.position.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Goalkeeper':
        return 'bg-yellow-100 text-yellow-800';
      case 'Defender':
        return 'bg-blue-100 text-blue-800';
      case 'Midfielder':
        return 'bg-green-100 text-green-800';
      case 'Forward':
      case 'Striker':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500 mt-1">
            Manage your squad, view stats, and assign positions.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
          
          <Plus className="w-4 h-4" />
          Add Player
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search players by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                  Player
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                  Position
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                  Appearances
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  
                  Goals
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ?
              <tr>
                  <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500">
                  
                    Loading players...
                  </td>
                </tr> :
              filteredPlayers.length === 0 ?
              <tr>
                  <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500">
                  
                    No players found.
                  </td>
                </tr> :

              filteredPlayers.map((player) =>
              <tr
                key={player.id}
                className="hover:bg-gray-50 transition-colors group">
                
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm">
                        {player.jerseyNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                            {player.name.
                        split(' ').
                        map((n) => n[0]).
                        join('').
                        substring(0, 2)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                            {player.name}
                            {player.isCaptain &&
                        <Star
                          className="w-3.5 h-3.5 text-amber-500"
                          fill="currentColor" />

                        }
                            {player.isViceCaptain &&
                        <Award className="w-3.5 h-3.5 text-blue-500" />
                        }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPositionColor(player.position)}`}>
                    
                        {player.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${statusColors[player.status]}`}>
                    
                        {player.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.appearances}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.goals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                      to={`/coach/team/${player.id}`}
                      className="text-emerald-600 hover:text-emerald-900">
                      
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                        <button
                      onClick={() => handleDeletePlayer(player.id)}
                      className="text-red-500 hover:text-red-700">
                      
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Player Modal */}
      {isAddModalOpen &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
          initial={{
            scale: 0.95,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
          
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Player
              </h3>
              <button
              onClick={() => setIsAddModalOpen(false)}
              className="text-gray-400 hover:text-gray-600">
              
                &times;
              </button>
            </div>
            <form onSubmit={handleAddPlayer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                type="text"
                required
                value={newPlayer.name}
                onChange={(e) =>
                setNewPlayer({
                  ...newPlayer,
                  name: e.target.value
                })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g. John Doe" />
              
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                  value={newPlayer.position}
                  onChange={(e) =>
                  setNewPlayer({
                    ...newPlayer,
                    position: e.target.value as Position
                  })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500">
                  
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Forward">Forward</option>
                    <option value="Striker">Striker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jersey #
                  </label>
                  <input
                  type="number"
                  required
                  min={1}
                  max={99}
                  value={newPlayer.jerseyNumber}
                  onChange={(e) =>
                  setNewPlayer({
                    ...newPlayer,
                    jerseyNumber: parseInt(e.target.value) || 0
                  })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500" />
                
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                value={newPlayer.status}
                onChange={(e) =>
                setNewPlayer({
                  ...newPlayer,
                  status: e.target.value as PlayerStatus
                })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500">
                
                  <option value="Active">Active</option>
                  <option value="Reserve">Reserve</option>
                  <option value="Injured">Injured</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                
                  Cancel
                </button>
                <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                
                  Add Player
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      }
    </motion.div>);

};