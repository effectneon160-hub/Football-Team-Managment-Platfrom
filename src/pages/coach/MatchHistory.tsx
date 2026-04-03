import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Plus } from 'lucide-react';
import { api } from '../../data/db';
import { MatchResult, Event, Player } from '../../data/types';
export const MatchHistory: React.FC = () => {
  const [results, setResults] = useState<MatchResult[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  // Form state
  const [selectedEventId, setSelectedEventId] = useState('');
  const [teamScore, setTeamScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [scorers, setScorers] = useState<
    {
      playerId: string;
      goals: number;
    }[]>(
    []);
  const fetchData = async () => {
    try {
      const [resultsData, eventsData, playersData] = await Promise.all([
      api.getMatchResults(),
      api.getEvents(),
      api.getPlayers()]
      );
      setResults(resultsData);
      setEvents(
        eventsData.filter(
          (e) => e.type === 'Match' && new Date(e.date) < new Date()
        )
      ); // Only past matches
      setPlayers(playersData);
    } catch (error) {
      console.error('Failed to fetch match data', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayers((prev) =>
    prev.includes(playerId) ?
    prev.filter((id) => id !== playerId) :
    [...prev, playerId]
    );
    // Remove from scorers if unselected
    if (selectedPlayers.includes(playerId)) {
      setScorers((prev) => prev.filter((s) => s.playerId !== playerId));
    }
  };
  const handleScorerChange = (playerId: string, goals: number) => {
    if (goals <= 0) {
      setScorers((prev) => prev.filter((s) => s.playerId !== playerId));
      return;
    }
    setScorers((prev) => {
      const existing = prev.find((s) => s.playerId === playerId);
      if (existing) {
        return prev.map((s) =>
        s.playerId === playerId ?
        {
          ...s,
          goals
        } :
        s
        );
      }
      return [
      ...prev,
      {
        playerId,
        goals
      }];

    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;
    const event = events.find((e) => e.id === selectedEventId);
    if (!event) return;
    // Extract opponent from title (e.g. "Match vs Opponent")
    const opponent = event.title.split('vs')[1]?.trim() || 'Unknown Opponent';
    try {
      await api.recordMatchResult({
        eventId: selectedEventId,
        opponent,
        teamScore,
        opponentScore,
        date: event.date,
        participatingPlayers: selectedPlayers,
        scorers
      });
      setIsRecording(false);
      // Reset form
      setSelectedEventId('');
      setTeamScore(0);
      setOpponentScore(0);
      setSelectedPlayers([]);
      setScorers([]);
      fetchData();
    } catch (error) {
      console.error('Failed to record result', error);
    }
  };
  const getResultBadge = (team: number, opp: number) => {
    if (team > opp)
    return (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
          WIN
        </span>);

    if (team < opp)
    return (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
          LOSS
        </span>);

    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded">
        DRAW
      </span>);

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
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Match History</h1>
          <p className="text-gray-500 mt-1">
            View past results and record new match stats.
          </p>
        </div>
        {!isRecording &&
        <button
          onClick={() => setIsRecording(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
          
            <Plus className="w-4 h-4" />
            Record Result
          </button>
        }
      </div>

      {isRecording &&
      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="bg-white p-6 rounded-xl shadow-sm border border-emerald-200">
        
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Record Match Result
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Past Match
                </label>
                <select
                required
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500">
                
                  <option value="">-- Select Event --</option>
                  {events.map((e) =>
                <option key={e.id} value={e.id}>
                      {e.title} ({new Date(e.date).toLocaleDateString()})
                    </option>
                )}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Falcon FC Score
                  </label>
                  <input
                  type="number"
                  min="0"
                  required
                  value={teamScore}
                  onChange={(e) =>
                  setTeamScore(parseInt(e.target.value) || 0)
                  }
                  className="w-24 border border-gray-300 rounded-lg px-4 py-2 text-center text-xl font-bold" />
                
                </div>
                <span className="text-2xl font-bold text-gray-400 mt-6">-</span>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opponent Score
                  </label>
                  <input
                  type="number"
                  min="0"
                  required
                  value={opponentScore}
                  onChange={(e) =>
                  setOpponentScore(parseInt(e.target.value) || 0)
                  }
                  className="w-24 border border-gray-300 rounded-lg px-4 py-2 text-center text-xl font-bold" />
                
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participating Players & Goals
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                {players.map((player) =>
              <div
                key={player.id}
                className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={selectedPlayers.includes(player.id)}
                    onChange={() => handlePlayerToggle(player.id)}
                    className="rounded text-emerald-600 focus:ring-emerald-500" />
                  
                      <span className="text-sm font-medium truncate w-24">
                        {player.name}
                      </span>
                    </label>
                    {selectedPlayers.includes(player.id) &&
                <input
                  type="number"
                  min="0"
                  placeholder="Goals"
                  value={
                  scorers.find((s) => s.playerId === player.id)?.
                  goals || ''
                  }
                  onChange={(e) =>
                  handleScorerChange(
                    player.id,
                    parseInt(e.target.value) || 0
                  )
                  }
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center" />

                }
                  </div>
              )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
              type="button"
              onClick={() => setIsRecording(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              
                Cancel
              </button>
              <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
              
                Save Result
              </button>
            </div>
          </form>
        </motion.div>
      }

      <div className="space-y-4">
        {isLoading ?
        <div className="animate-pulse space-y-4">
            {[1, 2].map((i) =>
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          )}
          </div> :
        results.length === 0 ?
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Trophy className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No match results
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Record your first match result to see it here.
            </p>
          </div> :

        results.map((result) =>
        <div
          key={result.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
              <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {new Date(result.date).toLocaleDateString()}
                  </span>
                  <div className="mt-2 flex items-center justify-center md:justify-start gap-4">
                    <div className="text-right w-32">
                      <p className="font-bold text-gray-900 text-lg">
                        Falcon FC
                      </p>
                    </div>
                    <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xl font-black tracking-widest">
                      {result.teamScore} - {result.opponentScore}
                    </div>
                    <div className="text-left w-32">
                      <p className="font-bold text-gray-900 text-lg">
                        {result.opponent}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                  {getResultBadge(result.teamScore, result.opponentScore)}
                  {result.scorers.length > 0 &&
              <div className="text-sm text-gray-600 mt-2 text-center md:text-right">
                      <span className="font-medium">Scorers: </span>
                      {result.scorers.map((s, i) => {
                  const player = players.find((p) => p.id === s.playerId);
                  return (
                    <span key={s.playerId}>
                            {player?.name} ({s.goals})
                            {i < result.scorers.length - 1 ? ', ' : ''}
                          </span>);

                })}
                    </div>
              }
                </div>
              </div>
            </div>
        )
        }
      </div>
    </motion.div>);

};