import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Shield, AlertTriangle, Award } from 'lucide-react';
import { api } from '../../data/db';
import { TeamStats, Player } from '../../data/types';
const formColors = {
  W: 'bg-emerald-500',
  D: 'bg-gray-400',
  L: 'bg-red-500'
};
const formLabels = {
  W: 'Win',
  D: 'Draw',
  L: 'Loss'
};
export function TeamStatistics() {
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, playersData] = await Promise.all([
        api.getTeamStats(),
        api.getPlayers()]
        );
        setStats(statsData);
        setPlayers(playersData);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading || !stats) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) =>
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          )}
        </div>
      </div>);

  }
  const goalDifference = stats.goalsScored - stats.goalsConceded;
  const totalCards = players.reduce((s, p) => s + p.yellowCards, 0);
  const totalReds = players.reduce((s, p) => s + p.redCards, 0);
  // Position breakdown
  const positionCounts = [
  {
    label: 'GK',
    count: players.filter((p) => p.position === 'Goalkeeper').length,
    color: 'bg-amber-500'
  },
  {
    label: 'DEF',
    count: players.filter((p) => p.position === 'Defender').length,
    color: 'bg-blue-500'
  },
  {
    label: 'MID',
    count: players.filter((p) => p.position === 'Midfielder').length,
    color: 'bg-emerald-500'
  },
  {
    label: 'FWD',
    count: players.filter((p) => ['Forward', 'Striker'].includes(p.position)).
    length,
    color: 'bg-red-500'
  }];

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
        <h1 className="text-2xl font-bold text-gray-900">Team Statistics</h1>
        <p className="text-gray-500 mt-1">
          Season performance overview for Falcon FC.
        </p>
      </div>

      {/* Recent Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Recent Form
        </h3>
        <div className="flex items-center gap-3">
          {stats.recentForm.length > 0 ?
          stats.recentForm.map((result, i) =>
          <div key={i} className="flex flex-col items-center gap-1.5">
                <div
              className={`w-10 h-10 rounded-full ${formColors[result]} text-white flex items-center justify-center font-bold text-sm`}>
              
                  {result}
                </div>
                <span className="text-xs text-gray-400">
                  {formLabels[result]}
                </span>
              </div>
          ) :

          <p className="text-gray-400 text-sm">No matches played yet.</p>
          }
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-500">Win Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.winRate}%</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Goals Scored
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.goalsScored}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Clean Sheets
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.cleanSheets}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-500">Goal Diff</span>
          </div>
          <p
            className={`text-3xl font-bold ${goalDifference >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            
            {goalDifference > 0 ? '+' : ''}
            {goalDifference}
          </p>
        </div>
      </div>

      {/* Match Record & Discipline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Match Record */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Match Record
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <p className="text-4xl font-black text-emerald-600">
                  {stats.wins}
                </p>
                <p className="text-xs text-gray-500 font-medium uppercase mt-1">
                  Wins
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-gray-400">
                  {stats.draws}
                </p>
                <p className="text-xs text-gray-500 font-medium uppercase mt-1">
                  Draws
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-red-500">
                  {stats.losses}
                </p>
                <p className="text-xs text-gray-500 font-medium uppercase mt-1">
                  Losses
                </p>
              </div>
            </div>
            {/* Visual bar */}
            {stats.totalMatches > 0 &&
            <div className="flex rounded-full overflow-hidden h-4">
                <div
                className="bg-emerald-500 transition-all"
                style={{
                  width: `${stats.wins / stats.totalMatches * 100}%`
                }}>
              </div>
                <div
                className="bg-gray-300 transition-all"
                style={{
                  width: `${stats.draws / stats.totalMatches * 100}%`
                }}>
              </div>
                <div
                className="bg-red-400 transition-all"
                style={{
                  width: `${stats.losses / stats.totalMatches * 100}%`
                }}>
              </div>
              </div>
            }
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Goals Scored</p>
                <p className="font-bold text-gray-900 text-lg">
                  {stats.goalsScored}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500">Goals Conceded</p>
                <p className="font-bold text-gray-900 text-lg">
                  {stats.goalsConceded}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Discipline & Squad Composition */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Discipline
              </h2>
            </div>
            <div className="p-6 flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-8 bg-yellow-400 rounded-sm"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCards}
                  </p>
                  <p className="text-xs text-gray-500">Yellow Cards</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-8 bg-red-500 rounded-sm"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalReds}
                  </p>
                  <p className="text-xs text-gray-500">Red Cards</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Squad Composition
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {positionCounts.map((pc) =>
                <div key={pc.label} className="flex-1 text-center">
                    <div
                    className={`${pc.color} text-white rounded-lg py-3 font-bold text-xl`}>
                    
                      {pc.count}
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-2">
                      {pc.label}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Scorers & Assists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Top Scorers</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {stats.topScorers.map((entry, i) =>
            <li
              key={entry.player.id}
              className="px-6 py-4 flex items-center justify-between">
              
                <div className="flex items-center gap-4">
                  <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                  
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      {entry.player.jerseyNumber}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {entry.player.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.player.position}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="font-bold text-gray-900 text-lg">
                  {entry.goals}
                </span>
              </li>
            )}
            {stats.topScorers.length === 0 &&
            <li className="px-6 py-8 text-center text-gray-400 text-sm">
                No goals scored yet.
              </li>
            }
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Top Assists</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {stats.topAssists.map((entry, i) =>
            <li
              key={entry.player.id}
              className="px-6 py-4 flex items-center justify-between">
              
                <div className="flex items-center gap-4">
                  <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                  
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      {entry.player.jerseyNumber}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {entry.player.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.player.position}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="font-bold text-gray-900 text-lg">
                  {entry.assists}
                </span>
              </li>
            )}
            {stats.topAssists.length === 0 &&
            <li className="px-6 py-8 text-center text-gray-400 text-sm">
                No assists recorded yet.
              </li>
            }
          </ul>
        </div>
      </div>
    </motion.div>);

}