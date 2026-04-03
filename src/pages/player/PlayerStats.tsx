import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, Calendar, Trophy } from 'lucide-react';
import { api } from '../../data/db';
import { Player, MatchResult } from '../../data/types';
import { useAuth } from '../../context/AuthContext';
export const PlayerStats: React.FC = () => {
  const { user } = useAuth();
  const [playerInfo, setPlayerInfo] = useState<Player | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.playerId) return;
      try {
        const [playerData, resultsData] = await Promise.all([
        api.getPlayer(user.playerId),
        api.getMatchResults()]
        );
        setPlayerInfo(playerData || null);
        // Filter matches where this player participated
        const myMatches = resultsData.filter((m) =>
        m.participatingPlayers.includes(user.playerId!)
        );
        setMatchHistory(myMatches);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) =>
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          )}
        </div>
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
        <h1 className="text-2xl font-bold text-gray-900">
          My Performance Stats
        </h1>
        <p className="text-gray-500 mt-1">
          Track your progress and match history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Appearances
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {playerInfo?.appearances}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-xl">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Goals Scored</p>
            <p className="text-3xl font-bold text-gray-900">
              {playerInfo?.goals}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Goals per Game</p>
            <p className="text-3xl font-bold text-gray-900">
              {playerInfo && playerInfo.appearances > 0 ?
              (playerInfo.goals / playerInfo.appearances).toFixed(2) :
              '0.00'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            My Match History
          </h2>
        </div>

        {matchHistory.length === 0 ?
        <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No matches played yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your match history will appear here.
            </p>
          </div> :

        <div className="divide-y divide-gray-100">
            {matchHistory.map((match) => {
            const myGoals =
            match.scorers.find((s) => s.playerId === user?.playerId)?.
            goals || 0;
            const isWin = match.teamScore > match.opponentScore;
            const isDraw = match.teamScore === match.opponentScore;
            return (
              <div
                key={match.id}
                className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div
                    className={`w-2 h-12 rounded-full ${isWin ? 'bg-green-500' : isDraw ? 'bg-gray-400' : 'bg-red-500'}`}>
                  </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(match.date).toLocaleDateString()}
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        vs {match.opponent}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                        Result
                      </p>
                      <p className="font-bold text-xl">
                        {match.teamScore} - {match.opponentScore}
                      </p>
                    </div>

                    {myGoals > 0 &&
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
                        <Target className="w-4 h-4" />
                        <span className="font-bold text-sm">
                          {myGoals} Goal{myGoals > 1 ? 's' : ''}
                        </span>
                      </div>
                  }
                  </div>
                </div>);

          })}
          </div>
        }
      </div>
    </motion.div>);

};