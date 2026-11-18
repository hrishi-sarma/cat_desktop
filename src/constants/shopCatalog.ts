import { ShopItem, RoomTheme } from '../types/cat';

export const SHOP_ITEMS: ShopItem[] = [
  // Toys
  {
    id: 'yarn_ball',
    name: 'Red Yarn Ball',
    category: 'toy',
    price: 30,
    unlockedLevel: 1,
    icon: '🧶',
    description: 'A fuzzy ball of yarn for the cat to chase around.',
  },
  {
    id: 'cardboard_box',
    name: 'Cardboard Box',
    category: 'toy',
    price: 60,
    unlockedLevel: 2,
    icon: '📦',
    description: 'Every cat’s dream haven. Fits perfectly!',
  },
  {
    id: 'toy_mouse',
    name: 'Squeaky Mouse',
    category: 'toy',
    price: 100,
    unlockedLevel: 3,
    icon: '🐭',
    description: 'Guaranteed to trigger playful instincts.',
  },

  // Beds & Comfort
  {
    id: 'cat_cushion',
    name: 'Cozy Cushion',
    category: 'bed',
    price: 50,
    unlockedLevel: 1,
    icon: '🛋️',
    description: 'Soft pillow for daytime cat naps.',
  },
  {
    id: 'cat_bed',
    name: 'Wooden Cat Bed',
    category: 'bed',
    price: 150,
    unlockedLevel: 4,
    icon: '🛏️',
    description: 'Handcrafted wooden bed with a warm blanket.',
  },
  {
    id: 'cat_tree',
    name: 'Luxury Cat Tree',
    category: 'bed',
    price: 300,
    unlockedLevel: 6,
    icon: '🏰',
    description: 'Multi-story climbing tower with hammocks.',
  },

  // Plants
  {
    id: 'potted_plant',
    name: 'Monstera Plant',
    category: 'plant',
    price: 40,
    unlockedLevel: 2,
    icon: '🪴',
    description: 'Brings fresh nature vibes into the room.',
  },
  {
    id: 'succulent',
    name: 'Mini Succulent',
    category: 'plant',
    price: 80,
    unlockedLevel: 3,
    icon: '🌵',
    description: 'Low maintenance, very cute desktop plant.',
  },
  {
    id: 'bonsai',
    name: 'Zen Bonsai Tree',
    category: 'plant',
    price: 200,
    unlockedLevel: 5,
    icon: '🪴',
    description: 'Peaceful bonsai tree for deep focus.',
  },

  // Furniture
  {
    id: 'scratch_post',
    name: 'Scratching Post',
    category: 'furniture',
    price: 90,
    unlockedLevel: 2,
    icon: '🪵',
    description: 'Keeps claws sharp and furniture safe.',
  },
  {
    id: 'cozy_rug',
    name: 'Patterned Rug',
    category: 'furniture',
    price: 120,
    unlockedLevel: 3,
    icon: '🧹',
    description: 'Soft woven carpet for stretching out.',
  },
  {
    id: 'bookshelf',
    name: 'Mini Bookshelf',
    category: 'furniture',
    price: 250,
    unlockedLevel: 5,
    icon: '📚',
    description: 'Holds tiny books and knick-knacks.',
  },

  // Hats & Cosmetics
  {
    id: 'birthday_hat',
    name: 'Birthday Party Hat',
    category: 'hat',
    price: 0, // Unlocked via birthday or level 1
    unlockedLevel: 1,
    icon: '🎉',
    description: 'Festive party cone hat!',
  },
  {
    id: 'pink_bow',
    name: 'Cute Bow',
    category: 'hat',
    price: 100,
    unlockedLevel: 2,
    icon: '🎀',
    description: 'A stylish ribbon bow.',
  },
  {
    id: 'wizard_hat',
    name: 'Star Wizard Hat',
    category: 'hat',
    price: 220,
    unlockedLevel: 4,
    icon: '🧙‍♂️',
    description: 'Magical blue hat with golden stars.',
  },
  {
    id: 'golden_crown',
    name: 'Royal Crown',
    category: 'hat',
    price: 500,
    unlockedLevel: 8,
    icon: '👑',
    description: 'Fit for desktop royalty!',
  },
  {
    id: 'star_bow',
    name: 'Starlight Bow ⭐',
    category: 'hat',
    price: 180,
    unlockedLevel: 3,
    icon: '🎀',
    description: 'A glittery star-shaped bow that sparkles like the night sky!',
  },
  {
    id: 'star_crown',
    name: 'Celestial Star Crown',
    category: 'hat',
    price: 400,
    unlockedLevel: 6,
    icon: '⭐',
    description: 'A regal crown made of five golden stars. Pure cosmic royalty!',
  },
];

export interface RoomMetadata {
  id: RoomTheme;
  name: string;
  icon: string;
  unlockedLevel: number;
  bgGradient: string;
  floorColor: string;
  description: string;
}

export const ROOM_THEMES: Record<RoomTheme, RoomMetadata> = {
  bedroom: {
    id: 'bedroom',
    name: 'Cozy Bedroom',
    icon: '🛏️',
    unlockedLevel: 1,
    bgGradient: 'linear-gradient(180deg, #2b2d42 0%, #3d3f58 60%, #4a4e69 100%)',
    floorColor: '#353852',
    description: 'Warm, comfy bedroom setting.',
  },
  living: {
    id: 'living',
    name: 'Living Room',
    icon: '🏠',
    unlockedLevel: 2,
    bgGradient: 'linear-gradient(180deg, #1e293b 0%, #334155 60%, #475569 100%)',
    floorColor: '#2b3649',
    description: 'Modern relaxed living space.',
  },
  garden: {
    id: 'garden',
    name: 'Sunlit Garden',
    icon: '🌿',
    unlockedLevel: 4,
    bgGradient: 'linear-gradient(180deg, #14532d 0%, #166534 60%, #15803d 100%)',
    floorColor: '#0f3d21',
    description: 'Lush outdoor garden with grass.',
  },
  cafe: {
    id: 'cafe',
    name: 'Cat Café',
    icon: '☕',
    unlockedLevel: 6,
    bgGradient: 'linear-gradient(180deg, #451a03 0%, #78350f 60%, #92400e 100%)',
    floorColor: '#361503',
    description: 'Warm coffee shop with aroma of roasted beans.',
  },
  library: {
    id: 'library',
    name: 'Quiet Library',
    icon: '📚',
    unlockedLevel: 8,
    bgGradient: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
    floorColor: '#141236',
    description: 'Peaceful sanctuary full of wisdom.',
  },
  starry: {
    id: 'starry',
    name: 'Starry Night',
    icon: '🌌',
    unlockedLevel: 5,
    bgGradient: 'linear-gradient(180deg, #020617 0%, #0f172a 60%, #1e1b4b 100%)',
    floorColor: '#0d1117',
    description: 'A cozy room under a breathtaking starry night sky.',
  },
  galaxy: {
    id: 'galaxy',
    name: 'Galaxy Nebula',
    icon: '🔭',
    unlockedLevel: 9,
    bgGradient: 'linear-gradient(180deg, #09090b 0%, #1a0533 60%, #2e0854 100%)',
    floorColor: '#12011f',
    description: 'Float through swirling galaxies and cosmic nebulae.',
  },
};
