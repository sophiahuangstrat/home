// Authentication & Session
export type UserRole = 'admin' | 'viewer';

export interface SessionState {
  role: UserRole | null;
  isAuthenticated: boolean;
}

// About Us
export interface AboutUs {
  id: string;
  coupleIntroduction: string;
  livingRoutines: string;
  lifestyleHabits: string;
  idealHomeVibe: string;
  updatedAt: number;
}

// Home Concept
export interface HomeConcept {
  id: string;
  designVision: string;
  moodPalette: string;
  overallReferences: string;
  updatedAt: number;
}

// Blueprint
export interface Blueprint {
  id: string;
  fileName: string;
  fileSize: number;
  fileData: string;
  dimensionalNotes: string;
  uploadedAt: number;
  updatedAt: number;
}

// Inspiration Item
export interface InspirationItem {
  id: string;
  roomId: string;
  type: 'photo' | 'link';
  photoFileName?: string;
  photoData?: string;
  externalUrl?: string;
  annotation: string;
  createdAt: number;
  updatedAt: number;
}

// Room
export interface Room {
  id: string;
  name: string;
  sortOrder: number;
  moodBoardFileName?: string;
  moodBoardData?: string;
  mustHaves: string;
  niceToHaves: string;
  thingsToAvoid: string;
  inspirationItems: InspirationItem[];
  createdAt: number;
  updatedAt: number;
}

// Settings (for passwords)
export interface AppSettings {
  id: string;
  adminPassword: string;
  viewerPassword: string;
  updatedAt: number;
}

// Entire app data structure
export interface AppData {
  aboutUs: AboutUs | null;
  homeConcept: HomeConcept | null;
  blueprint: Blueprint | null;
  rooms: Room[];
  settings: AppSettings;
}
