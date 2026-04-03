export type Role = 'coach' | 'player';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  playerId?: string;
}

export type Position =
'Goalkeeper' |
'Defender' |
'Midfielder' |
'Forward' |
'Striker';

export type PlayerStatus = 'Active' | 'Injured' | 'Suspended' | 'Reserve';

export interface Player {
  id: string;
  name: string;
  position: Position;
  jerseyNumber: number;
  goals: number;
  appearances: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  status: PlayerStatus;
  isCaptain: boolean;
  isViceCaptain: boolean;
  joinedDate: string; // ISO string
}

export type EventType = 'Match' | 'Training';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO string
  location: string;
}

export type AvailabilityStatus = 'Available' | 'Not Available' | 'Pending';

export interface Availability {
  eventId: string;
  playerId: string;
  status: AvailabilityStatus;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string; // ISO string
  author: string;
}

export interface MatchResult {
  id: string;
  eventId: string;
  opponent: string;
  teamScore: number;
  opponentScore: number;
  date: string; // ISO string
  scorers: {playerId: string;goals: number;}[];
  participatingPlayers: string[]; // array of player IDs
}

export interface TeamStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  winRate: number;
  topScorers: {player: Player;goals: number;}[];
  topAssists: {player: Player;assists: number;}[];
  recentForm: ('W' | 'D' | 'L')[]; // last 5 results
}