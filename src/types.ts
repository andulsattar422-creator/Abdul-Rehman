export interface UpcomingFeature {
  id: string;
  title: string;
  category: string;
  status: string;
  desc: string;
  skill: string;
  balanceScore: number;
}

export interface WeaponAttributes {
  name: string;
  damage: number;
  fireRate: number;
  range: number;
  accuracy: number;
  specialPerk: string;
  rarity?: string;
  lore?: string;
  aiAssessmentRating?: string;
}

export interface CharacterConfig {
  name: string;
  activeSkill: string;
  level: number;
  avatarPlaceholder: string;
}

export interface MatchSimulationResult {
  winner: string;
  winRate: number;
  matchLogs: string[];
  balanceAssessment: string;
  qaVerdict: string;
}

export interface PatchNotesResult {
  version: string;
  title: string;
  highlights: string[];
  detailedNotes: string;
  releasingDate: string;
}

export interface BugDiagnostics {
  errorCode: string;
  rootCause: string;
  reproductionSteps: string;
  hotfixSuggestion: string;
  severity: string;
}
