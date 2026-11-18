import {
  CatDeskSettings,
  CatStats,
  TaskItem,
  NoteItem,
  PlacedItem,
  Position,
} from '../types/cat';

const STORAGE_KEYS = {
  SETTINGS: 'catdesk_settings_v1',
  STATS: 'catdesk_stats_v1',
  TASKS: 'catdesk_tasks_v1',
  NOTES: 'catdesk_notes_v1',
  INVENTORY: 'catdesk_inventory_v1',
  PLACED_ITEMS: 'catdesk_placed_v1',
  WINDOW_POS: 'catdesk_window_pos_v1',
};

export const DEFAULT_SETTINGS: CatDeskSettings = {
  catName: 'Katto',
  ownerName: 'Friend',
  personality: 'affectionate',
  skin: 'orange',
  hat: 'none',
  birthday: '2026-08-21',
  soundEnabled: true,
  performanceMode: false,
  alwaysOnTop: false,
  viewMode: 'room',
  currentRoom: 'bedroom',
  firstLaunch: true,
};

export const DEFAULT_STATS: CatStats = {
  happiness: 85,
  energy: 90,
  hunger: 80,
  friendship: 90,
  xp: 120,
  level: 1,
  coins: 150,
};

export const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 't-1',
    text: 'Welcome to CatDesk! Click your cat to interact 🐾',
    completed: false,
    priority: 'high',
    isDaily: true,
    createdAt: Date.now(),
  },
  {
    id: 't-2',
    text: 'Try petting, playing, or feeding your cat ❤️',
    completed: false,
    priority: 'medium',
    createdAt: Date.now() - 1000,
  },
  {
    id: 't-3',
    text: 'Try out the Focus timer for a study session ⏱️',
    completed: false,
    priority: 'low',
    createdAt: Date.now() - 2000,
  },
];

export const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'n-1',
    title: 'Quick Note',
    content: 'Welcome to CatDesk! Use this space for quick reminders and ideas.',
    updatedAt: Date.now(),
  },
];

export const DEFAULT_INVENTORY: string[] = [
  'yarn_ball', 'cardboard_box', 'toy_mouse',
  'cat_cushion', 'cat_bed', 'cat_tree',
  'potted_plant', 'succulent', 'bonsai',
  'scratch_post', 'cozy_rug', 'bookshelf',
  'birthday_hat', 'pink_bow', 'wizard_hat', 'golden_crown',
];

export const DEFAULT_PLACED: PlacedItem[] = [
  { id: 'p-1', itemId: 'cat_cushion', x: 20, y: 72 },
  { id: 'p-2', itemId: 'potted_plant', x: 80, y: 65 },
  { id: 'p-3', itemId: 'yarn_ball', x: 65, y: 78 },
];

class StorageService {
  getSettings(): CatDeskSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: CatDeskSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  getStats(): CatStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  }

  saveStats(stats: CatStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats', e);
    }
  }

  getTasks(): TaskItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  }

  saveTasks(tasks: TaskItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }

  getNotes(): NoteItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  }

  saveNotes(notes: NoteItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }

  getInventory(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return data ? JSON.parse(data) : DEFAULT_INVENTORY;
    } catch {
      return DEFAULT_INVENTORY;
    }
  }

  saveInventory(inventory: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      console.error('Failed to save inventory', e);
    }
  }

  getPlacedItems(): PlacedItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLACED_ITEMS);
      return data ? JSON.parse(data) : DEFAULT_PLACED;
    } catch {
      return DEFAULT_PLACED;
    }
  }

  savePlacedItems(items: PlacedItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLACED_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save placed items', e);
    }
  }

  getWindowPosition(): Position | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WINDOW_POS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  saveWindowPosition(pos: Position): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WINDOW_POS, JSON.stringify(pos));
    } catch (e) {
      console.error('Failed to save window position', e);
    }
  }
}

export const storage = new StorageService();
