import { create } from 'zustand';
import { AppData, Room, InspirationItem, UserRole, AboutUs, HomeConcept, Blueprint, AppSettings } from '../types';

interface StoreState {
  userRole: UserRole | null;
  isAuthenticated: boolean;
  setAuthenticated: (role: UserRole) => void;
  logout: () => void;
  data: AppData;
  initializeData: (data: AppData) => void;
  loadDataFromLocalStorage: () => void;
  saveDataToLocalStorage: () => void;
  updateAboutUs: (aboutUs: AboutUs) => void;
  updateHomeConcept: (homeConcept: HomeConcept) => void;
  updateBlueprint: (blueprint: Blueprint) => void;
  deleteBlueprint: () => void;
  addRoom: (room: Room) => void;
  updateRoom: (roomId: string, room: Partial<Room>) => void;
  deleteRoom: (roomId: string) => void;
  getRoomById: (roomId: string) => Room | undefined;
  getRoomsSorted: () => Room[];
  addInspirationItem: (roomId: string, item: InspirationItem) => void;
  updateInspirationItem: (roomId: string, itemId: string, item: Partial<InspirationItem>) => void;
  deleteInspirationItem: (roomId: string, itemId: string) => void;
  getInspirationItemsByRoom: (roomId: string) => InspirationItem[];
  updateSettings: (settings: AppSettings) => void;
}

const defaultSettings: AppSettings = {
  id: 'settings-001',
  adminPassword: 'admin123',
  viewerPassword: 'viewer123',
  updatedAt: Date.now(),
};

const defaultAppData: AppData = {
  aboutUs: null,
  homeConcept: null,
  blueprint: null,
  rooms: [],
  settings: defaultSettings,
};

export const useAppStore = create<StoreState>((set, get) => ({
  userRole: null,
  isAuthenticated: false,
  setAuthenticated: (role: UserRole) =>
    set({ userRole: role, isAuthenticated: true }),
  logout: () =>
    set({ userRole: null, isAuthenticated: false }),
  data: defaultAppData,
  initializeData: (data: AppData) => set({ data }),
  loadDataFromLocalStorage: () => {
    const saved = localStorage.getItem('homeDesignData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        set({ data });
      } catch (e) {
        console.error('Failed to load data from localStorage:', e);
      }
    }
  },
  saveDataToLocalStorage: () => {
    const { data } = get();
    localStorage.setItem('homeDesignData', JSON.stringify(data));
  },
  updateAboutUs: (aboutUs: AboutUs) =>
    set((state) => ({
      data: { ...state.data, aboutUs: { ...aboutUs, updatedAt: Date.now() } },
    })),
  updateHomeConcept: (homeConcept: HomeConcept) =>
    set((state) => ({
      data: { ...state.data, homeConcept: { ...homeConcept, updatedAt: Date.now() } },
    })),
  updateBlueprint: (blueprint: Blueprint) =>
    set((state) => ({
      data: { ...state.data, blueprint: { ...blueprint, updatedAt: Date.now() } },
    })),
  deleteBlueprint: () =>
    set((state) => ({
      data: { ...state.data, blueprint: null },
    })),
  addRoom: (room: Room) =>
    set((state) => ({
      data: {
        ...state.data,
        rooms: [...state.data.rooms, { ...room, createdAt: Date.now(), updatedAt: Date.now() }],
      },
    })),
  updateRoom: (roomId: string, updates: Partial<Room>) =>
    set((state) => ({
      data: {
        ...state.data,
        rooms: state.data.rooms.map((room) =>
          room.id === roomId
            ? { ...room, ...updates, updatedAt: Date.now() }
            : room
        ),
      },
    })),
  deleteRoom: (roomId: string) =>
    set((state) => ({
      data: {
        ...state.data,
        rooms: state.data.rooms.filter((room) => room.id !== roomId),
      },
    })),
  getRoomById: (roomId: string) => {
    const { data } = get();
    return data.rooms.find((room) => room.id === roomId);
  },
  getRoomsSorted: () => {
    const { data } = get();
    return [...data.rooms].sort((a, b) => a.sortOrder - b.sortOrder);
  },
  addInspirationItem: (roomId: string, item: InspirationItem) =>
    set((state) => ({
      data: {
        ...state.data,
        rooms: state.data.rooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                inspirationItems: [
                  ...room.inspirationItems,
                  { ...item, createdAt: Date.now(), updatedAt: Date.now() },
                ],
                updatedAt: Date.now(),
              }
            : room
        ),
      },
    })),
  updateInspirationItem: (roomId: string, itemId: string, updates: Partial<InspirationItem>) =>
    set((state) => ({
      data: {
        ...state.data,
        rooms: state.data.rooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                inspirationItems: room.inspirationItems.map((item) =>
                  item.id === itemId
                    ? { ...item, ...updates, updatedAt: Date.now() }
                    : item
                ),
                updatedAt: Date.now(),
              }
            : room
        ),
      },
    })),
  deleteInspirationItem: (roomId: string, itemId: string) =>
    set((state) => ({
      data: {
        ...state.data,
        rooms: state.data.rooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                inspirationItems: room.inspirationItems.filter((item) => item.id !== itemId),
                updatedAt: Date.now(),
              }
            : room
        ),
      },
    })),
  getInspirationItemsByRoom: (roomId: string) => {
    const { data } = get();
    const room = data.rooms.find((r) => r.id === roomId);
    return room?.inspirationItems || [];
  },
  updateSettings: (settings: AppSettings) =>
    set((state) => ({
      data: { ...state.data, settings: { ...settings, updatedAt: Date.now() } },
    })),
}));
