import {
  User,
  Player,
  Event,
  Availability,
  Announcement,
  MatchResult,
  AvailabilityStatus,
  PlayerStatus,
  TeamStats } from
'./types';

// --- SEED DATA ---

const users: User[] = [
{
  id: 'u1',
  username: 'coach',
  password: 'coach123',
  name: 'James Mitchell',
  role: 'coach'
} as any,
{
  id: 'u2',
  username: 'marcus',
  password: 'player123',
  name: 'Marcus Johnson',
  role: 'player',
  playerId: 'p1'
} as any,
{
  id: 'u3',
  username: 'sarah',
  password: 'player123',
  name: 'Sarah Williams',
  role: 'player',
  playerId: 'p2'
} as any,
{
  id: 'u4',
  username: 'daniel',
  password: 'player123',
  name: 'Daniel Carter',
  role: 'player',
  playerId: 'p3'
} as any];


let players: Player[] = [
{
  id: 'p1',
  name: 'Marcus Johnson',
  position: 'Striker',
  jerseyNumber: 9,
  goals: 12,
  appearances: 18,
  assists: 4,
  yellowCards: 2,
  redCards: 0,
  status: 'Active',
  isCaptain: true,
  isViceCaptain: false,
  joinedDate: '2023-08-15T00:00:00Z'
},
{
  id: 'p2',
  name: 'Sarah Williams',
  position: 'Midfielder',
  jerseyNumber: 8,
  goals: 5,
  appearances: 20,
  assists: 11,
  yellowCards: 1,
  redCards: 0,
  status: 'Active',
  isCaptain: false,
  isViceCaptain: true,
  joinedDate: '2022-06-01T00:00:00Z'
},
{
  id: 'p3',
  name: 'Daniel Carter',
  position: 'Goalkeeper',
  jerseyNumber: 1,
  goals: 0,
  appearances: 22,
  assists: 0,
  yellowCards: 0,
  redCards: 0,
  status: 'Active',
  isCaptain: false,
  isViceCaptain: false,
  joinedDate: '2021-09-10T00:00:00Z'
},
{
  id: 'p4',
  name: 'Emma Rodriguez',
  position: 'Defender',
  jerseyNumber: 4,
  goals: 2,
  appearances: 19,
  assists: 3,
  yellowCards: 4,
  redCards: 1,
  status: 'Active',
  isCaptain: false,
  isViceCaptain: false,
  joinedDate: '2023-01-20T00:00:00Z'
},
{
  id: 'p5',
  name: "James O'Brien",
  position: 'Midfielder',
  jerseyNumber: 10,
  goals: 7,
  appearances: 17,
  assists: 8,
  yellowCards: 3,
  redCards: 0,
  status: 'Active',
  isCaptain: false,
  isViceCaptain: false,
  joinedDate: '2022-07-15T00:00:00Z'
},
{
  id: 'p6',
  name: 'Aisha Patel',
  position: 'Forward',
  jerseyNumber: 11,
  goals: 9,
  appearances: 16,
  assists: 5,
  yellowCards: 1,
  redCards: 0,
  status: 'Active',
  isCaptain: false,
  isViceCaptain: false,
  joinedDate: '2023-03-01T00:00:00Z'
},
{
  id: 'p7',
  name: 'Ryan Thompson',
  position: 'Defender',
  jerseyNumber: 5,
  goals: 1,
  appearances: 21,
  assists: 2,
  yellowCards: 5,
  redCards: 0,
  status: 'Injured',
  isCaptain: false,
  isViceCaptain: false,
  joinedDate: '2021-08-01T00:00:00Z'
},
{
  id: 'p8',
  name: 'Chloe Bennett',
  position: 'Midfielder',
  jerseyNumber: 7,
  goals: 4,
  appearances: 15,
  assists: 6,
  yellowCards: 0,
  redCards: 0,
  status: 'Active',
  isCaptain: false,
  isViceCaptain: false,
  joinedDate: '2024-01-10T00:00:00Z'
}];


let events: Event[] = [
{
  id: 'e1',
  title: 'League Match vs Thunder United',
  type: 'Match',
  date: '2026-04-12T15:00:00Z',
  location: 'Riverside Stadium'
},
{
  id: 'e2',
  title: 'Weekly Training Session',
  type: 'Training',
  date: '2026-04-08T18:00:00Z',
  location: 'Training Ground A'
},
{
  id: 'e3',
  title: 'Cup Quarter-Final vs City Rangers',
  type: 'Match',
  date: '2026-04-19T14:00:00Z',
  location: 'Central Arena'
},
{
  id: 'e4',
  title: 'Tactical Training',
  type: 'Training',
  date: '2026-04-15T18:30:00Z',
  location: 'Training Ground A'
},
{
  id: 'e5',
  title: 'Friendly vs Hilltop FC',
  type: 'Match',
  date: '2026-04-26T16:00:00Z',
  location: 'Riverside Stadium'
}];


let availabilities: Availability[] = [
{ eventId: 'e1', playerId: 'p1', status: 'Available' },
{ eventId: 'e1', playerId: 'p2', status: 'Available' },
{ eventId: 'e1', playerId: 'p3', status: 'Available' },
{ eventId: 'e1', playerId: 'p4', status: 'Not Available' },
{ eventId: 'e2', playerId: 'p1', status: 'Available' },
{ eventId: 'e2', playerId: 'p2', status: 'Not Available' },
{ eventId: 'e2', playerId: 'p3', status: 'Available' }];


let announcements: Announcement[] = [
{
  id: 'a1',
  title: 'New Season Kickoff',
  message: "Welcome message for the new season. Let's make it a great one!",
  date: '2026-03-01T10:00:00Z',
  author: 'James Mitchell'
},
{
  id: 'a2',
  title: 'Kit Collection',
  message: 'Pick up new kits from the clubhouse this weekend.',
  date: '2026-03-05T14:30:00Z',
  author: 'James Mitchell'
},
{
  id: 'a3',
  title: 'Fitness Assessment',
  message: 'Mandatory fitness tests next week during training.',
  date: '2026-03-10T09:15:00Z',
  author: 'James Mitchell'
},
{
  id: 'a4',
  title: 'Captain Announcement',
  message: 'Marcus Johnson has been named team captain for this season.',
  date: '2026-03-12T18:00:00Z',
  author: 'James Mitchell'
},
{
  id: 'a5',
  title: 'Training Schedule Update',
  message: 'Tuesday sessions moved to 6:30 PM starting next week.',
  date: '2026-03-20T11:45:00Z',
  author: 'James Mitchell'
}];


let matchResults: MatchResult[] = [
{
  id: 'mr1',
  eventId: 'past1',
  opponent: 'Riverside Rovers',
  teamScore: 3,
  opponentScore: 1,
  date: '2026-03-15T15:00:00Z',
  scorers: [
  { playerId: 'p1', goals: 2 },
  { playerId: 'p6', goals: 1 }],

  participatingPlayers: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8']
},
{
  id: 'mr2',
  eventId: 'past2',
  opponent: 'Metro Stars',
  teamScore: 0,
  opponentScore: 2,
  date: '2026-03-22T14:00:00Z',
  scorers: [],
  participatingPlayers: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']
},
{
  id: 'mr3',
  eventId: 'past3',
  opponent: 'Valley United',
  teamScore: 2,
  opponentScore: 2,
  date: '2026-03-29T16:00:00Z',
  scorers: [
  { playerId: 'p5', goals: 1 },
  { playerId: 'p1', goals: 1 }],

  participatingPlayers: ['p1', 'p2', 'p3', 'p5', 'p6', 'p7', 'p8']
}];


// --- HELPER: SIMULATE NETWORK DELAY ---
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// --- API FUNCTIONS ---

export const api = {
  // Auth
  login: async (username: string, password: string): Promise<User> => {
    await delay();
    const user = (users as any[]).find(
      (u) => u.username === username && u.password === password
    );
    if (!user) throw new Error('Invalid credentials');
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  // Players
  getPlayers: async (): Promise<Player[]> => {
    await delay();
    return [...players];
  },
  getPlayer: async (id: string): Promise<Player | undefined> => {
    await delay();
    return players.find((p) => p.id === id);
  },
  addPlayer: async (
  player: Omit<
    Player,
    'id' |
    'goals' |
    'appearances' |
    'assists' |
    'yellowCards' |
    'redCards' |
    'isCaptain' |
    'isViceCaptain'>)

  : Promise<Player> => {
    await delay();
    const newPlayer: Player = {
      ...player,
      id: `p${Date.now()}`,
      goals: 0,
      appearances: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      isCaptain: false,
      isViceCaptain: false
    };
    players.push(newPlayer);
    return newPlayer;
  },
  updatePlayer: async (
  id: string,
  updates: Partial<Player>)
  : Promise<Player> => {
    await delay();
    const index = players.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Player not found');
    players[index] = { ...players[index], ...updates };
    return players[index];
  },
  deletePlayer: async (id: string): Promise<void> => {
    await delay();
    players = players.filter((p) => p.id !== id);
  },

  // Squad Management
  setCaptain: async (playerId: string): Promise<void> => {
    await delay();
    players.forEach((p) => {
      p.isCaptain = p.id === playerId;
    });
  },
  setViceCaptain: async (playerId: string): Promise<void> => {
    await delay();
    players.forEach((p) => {
      p.isViceCaptain = p.id === playerId;
    });
  },
  updatePlayerStatus: async (
  playerId: string,
  status: PlayerStatus)
  : Promise<Player> => {
    await delay();
    const player = players.find((p) => p.id === playerId);
    if (!player) throw new Error('Player not found');
    player.status = status;
    return player;
  },
  updateJerseyNumber: async (
  playerId: string,
  jerseyNumber: number)
  : Promise<Player> => {
    await delay();
    const existing = players.find(
      (p) => p.jerseyNumber === jerseyNumber && p.id !== playerId
    );
    if (existing)
    throw new Error(
      `Jersey #${jerseyNumber} is already assigned to ${existing.name}`
    );
    const player = players.find((p) => p.id === playerId);
    if (!player) throw new Error('Player not found');
    player.jerseyNumber = jerseyNumber;
    return player;
  },

  // Team Statistics
  getTeamStats: async (): Promise<TeamStats> => {
    await delay();
    const results = [...matchResults];
    const totalMatches = results.length;
    const wins = results.filter((r) => r.teamScore > r.opponentScore).length;
    const draws = results.filter((r) => r.teamScore === r.opponentScore).length;
    const losses = results.filter((r) => r.teamScore < r.opponentScore).length;
    const goalsScored = results.reduce((sum, r) => sum + r.teamScore, 0);
    const goalsConceded = results.reduce((sum, r) => sum + r.opponentScore, 0);
    const cleanSheets = results.filter((r) => r.opponentScore === 0).length;
    const winRate =
    totalMatches > 0 ? Math.round(wins / totalMatches * 100) : 0;

    // Top scorers from current player data
    const topScorers = [...players].
    filter((p) => p.goals > 0).
    sort((a, b) => b.goals - a.goals).
    slice(0, 5).
    map((p) => ({ player: p, goals: p.goals }));

    const topAssists = [...players].
    filter((p) => p.assists > 0).
    sort((a, b) => b.assists - a.assists).
    slice(0, 5).
    map((p) => ({ player: p, assists: p.assists }));

    // Recent form (last 5 matches)
    const recentForm = results.
    sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).
    slice(0, 5).
    map((r) => {
      if (r.teamScore > r.opponentScore) return 'W' as const;
      if (r.teamScore === r.opponentScore) return 'D' as const;
      return 'L' as const;
    });

    return {
      totalMatches,
      wins,
      draws,
      losses,
      goalsScored,
      goalsConceded,
      cleanSheets,
      winRate,
      topScorers,
      topAssists,
      recentForm
    };
  },

  // Events
  getEvents: async (): Promise<Event[]> => {
    await delay();
    // Sort by date ascending
    return [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  },
  getEvent: async (id: string): Promise<Event | undefined> => {
    await delay();
    return events.find((e) => e.id === id);
  },
  createEvent: async (event: Omit<Event, 'id'>): Promise<Event> => {
    await delay();

    // Clash detection: check if any event is within 2 hours of the new event
    const newEventTime = new Date(event.date).getTime();
    const twoHours = 2 * 60 * 60 * 1000;

    const clash = events.find((e) => {
      const existingTime = new Date(e.date).getTime();
      return Math.abs(existingTime - newEventTime) < twoHours;
    });

    if (clash) {
      throw new Error(`Time clash detected with event: ${clash.title}`);
    }

    const newEvent: Event = {
      ...event,
      id: `e${Date.now()}`
    };
    events.push(newEvent);
    return newEvent;
  },

  // Availability
  getAvailabilities: async (eventId: string): Promise<Availability[]> => {
    await delay();
    return availabilities.filter((a) => a.eventId === eventId);
  },
  getPlayerAvailabilities: async (
  playerId: string)
  : Promise<Availability[]> => {
    await delay();
    return availabilities.filter((a) => a.playerId === playerId);
  },
  updateAvailability: async (
  eventId: string,
  playerId: string,
  status: AvailabilityStatus)
  : Promise<Availability> => {
    await delay();
    const existingIndex = availabilities.findIndex(
      (a) => a.eventId === eventId && a.playerId === playerId
    );

    if (existingIndex >= 0) {
      availabilities[existingIndex].status = status;
      return availabilities[existingIndex];
    } else {
      const newAvailability: Availability = { eventId, playerId, status };
      availabilities.push(newAvailability);
      return newAvailability;
    }
  },

  // Announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    await delay();
    // Sort by date descending
    return [...announcements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
  createAnnouncement: async (
  announcement: Omit<Announcement, 'id' | 'date'>)
  : Promise<Announcement> => {
    await delay();
    const newAnnouncement: Announcement = {
      ...announcement,
      id: `a${Date.now()}`,
      date: new Date().toISOString()
    };
    announcements.push(newAnnouncement);
    return newAnnouncement;
  },

  // Match Results
  getMatchResults: async (): Promise<MatchResult[]> => {
    await delay();
    // Sort by date descending
    return [...matchResults].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
  recordMatchResult: async (
  result: Omit<MatchResult, 'id'>)
  : Promise<MatchResult> => {
    await delay();
    const newResult: MatchResult = {
      ...result,
      id: `mr${Date.now()}`
    };
    matchResults.push(newResult);

    // Update player stats
    result.participatingPlayers.forEach((playerId) => {
      const player = players.find((p) => p.id === playerId);
      if (player) {
        player.appearances += 1;
      }
    });

    result.scorers.forEach((scorer) => {
      const player = players.find((p) => p.id === scorer.playerId);
      if (player) {
        player.goals += scorer.goals;
      }
    });

    return newResult;
  }
};