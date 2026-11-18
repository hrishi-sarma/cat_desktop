export type CatPersonalityType = 'lazy' | 'energetic' | 'mischievous' | 'affectionate' | 'grumpy' | 'curious';

export type CatState = 
  | 'IDLE' 
  | 'WALK' 
  | 'RUN' 
  | 'SIT' 
  | 'LOOK_AROUND' 
  | 'SCRATCH' 
  | 'STRETCH' 
  | 'PLAY' 
  | 'EAT' 
  | 'SLEEP' 
  | 'WAKE' 
  | 'HAPPY' 
  | 'SAD' 
  | 'CURIOUS' 
  | 'MEOW' 
  | 'LICK';

export type CatSkin = 'orange' | 'tuxedo' | 'calico' | 'black' | 'snow' | 'grey_tabby';

export type CatHat = 'none' | 'birthday' | 'party' | 'crown' | 'wizard' | 'beanie' | 'bow' | 'star_bow' | 'star_crown';

export interface CatStats {
  happiness: number; // 0-100
  energy: number;    // 0-100
  hunger: number;    // 0-100 (100 = full)
  friendship: number;// 0-100
  xp: number;
  level: number;
  coins: number;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  isDaily?: boolean;
  createdAt: number;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export type ItemCategory = 'furniture' | 'toy' | 'plant' | 'bed' | 'hat' | 'wallpaper';

export interface ShopItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  unlockedLevel: number;
  icon: string;
  description: string;
}

export interface PlacedItem {
  id: string;
  itemId: string;
  x: number; // Percentage 0..100 inside room
  y: number; // Percentage 0..100 inside room
}

export type RoomTheme = 'bedroom' | 'living' | 'garden' | 'cafe' | 'library' | 'starry' | 'galaxy';

export type ViewMode = 'room' | 'transparent' | 'minimal';

export interface CatDeskSettings {
  catName: string;
  ownerName: string;
  personality: CatPersonalityType;
  skin: CatSkin;
  hat: CatHat;
  birthday: string; // YYYY-MM-DD
  soundEnabled: boolean;
  performanceMode: boolean; // low FPS for energy saving
  alwaysOnTop: boolean;
  viewMode: ViewMode;
  currentRoom: RoomTheme;
  firstLaunch: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface DialogueMessage {
  id: string;
  text: string;
  speaker: string;
  durationMs: number;
}
