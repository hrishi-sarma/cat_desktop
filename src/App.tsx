import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CatDeskSettings,
  CatStats,
  TaskItem,
  NoteItem,
  PlacedItem,
  CatState,
  RoomTheme,
  CatHat,
  Position,
} from './types/cat';
import { storage } from './services/storage';
import { soundManager } from './services/SoundManager';
import { CatStateMachine } from './engine/CatStateMachine';
import { CatRenderer, Particle } from './engine/CatRenderer';
import { FloatingControls } from './components/FloatingControls';
import { InteractionMenu } from './components/InteractionMenu';
import { TaskPanel } from './components/TaskPanel';
import { FocusPanel } from './components/FocusPanel';
import { NotesPanel } from './components/NotesPanel';
import { ShopRoomPanel } from './components/ShopRoomPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { BirthdayModal } from './components/BirthdayModal';
import { FirstLaunchModal } from './components/FirstLaunchModal';
import { DialogueBubble } from './components/DialogueBubble';
import { BirthdayBanner } from './components/BirthdayBanner';
import { setAlwaysOnTop } from './services/windowManager';
import './App.css';

export function App() {
  // 1. Persistent State
  const [settings, setSettings] = useState<CatDeskSettings>(storage.getSettings());
  const [stats] = useState<CatStats>(storage.getStats());
  const [tasks, setTasks] = useState<TaskItem[]>(storage.getTasks());
  const [notes, setNotes] = useState<NoteItem[]>(storage.getNotes());
  const [inventory, setInventory] = useState<string[]>(storage.getInventory());
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>(storage.getPlacedItems());

  // 2. Window Dimensions & Resize Listener
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth || 380,
    height: window.innerHeight || 240,
  });

  // 3. Cat Engine State
  const [catState, setCatState] = useState<CatState>('IDLE');
  const [catX, setCatX] = useState<number>(180);
  const [catY, setCatY] = useState<number>((window.innerHeight || 240) - 55);
  const [facingLeft, setFacingLeft] = useState<boolean>(false);

  // Refs for values the RAF loop needs without re-mounting the effect
  const catXRef = useRef<number>(180);
  const targetXRef = useRef<number | null>(null);
  const catStateRef = useRef<CatState>('IDLE');
  const activeYarnRef = useRef<Position | null>(null);
  const activeFoodRef = useRef<Position | null>(null);
  const dimensionsRef = useRef({ width: window.innerWidth || 380, height: window.innerHeight || 240 });
  const statsRef = useRef<CatStats>(stats);

  // Keep refs in sync with state
  useEffect(() => { catStateRef.current = catState; }, [catState]);
  useEffect(() => { statsRef.current = stats; }, [stats]);
  useEffect(() => { dimensionsRef.current = dimensions; }, [dimensions]);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });
      setCatY(h - 55);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Interaction Props
  const [activeYarn, setActiveYarn] = useState<Position | null>(null);
  const [activeFood, setActiveFood] = useState<Position | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<Position | null>(null);

  // Keep yarn/food refs in sync
  useEffect(() => { activeYarnRef.current = activeYarn; }, [activeYarn]);
  useEffect(() => { activeFoodRef.current = activeFood; }, [activeFood]);

  // Active Overlay Panel
  const [activePanel, setActivePanel] = useState<
    'tasks' | 'focus' | 'notes' | 'shop' | 'settings' | null
  >(null);
  const [showInteractionMenu, setShowInteractionMenu] = useState<boolean>(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState<boolean>(false);
  const [isBirthdayActive, setIsBirthdayActive] = useState<boolean>(false);
  const [showFirstLaunch, setShowFirstLaunch] = useState<boolean>(settings.firstLaunch);

  // 4. Focus Timer State (Persistent background timer)
  const [focusWorkMins, setFocusWorkMins] = useState<number>(25);
  const [focusBreakMins, setFocusBreakMins] = useState<number>(5);
  const [focusSecondsLeft, setFocusSecondsLeft] = useState<number>(25 * 60);
  const [focusIsActive, setFocusIsActive] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<'work' | 'break'>('work');

  // Background Focus Timer Countdown Interval
  useEffect(() => {
    let interval: any = null;
    if (focusIsActive) {
      interval = setInterval(() => {
        setFocusSecondsLeft((prev) => {
          if (prev <= 1) {
            soundManager.playTaskComplete();
            soundManager.playMeow();
            addParticle('sparkle', catXRef.current, catY - 30);

            if (focusMode === 'work') {
              showCatDialogue('Focus session complete! Great work! 🎉');
              setFocusMode('break');
              return focusBreakMins * 60;
            } else {
              showCatDialogue('Break time over! Ready to focus again? 😸');
              setFocusMode('work');
              return focusWorkMins * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusIsActive, focusMode, focusWorkMins, focusBreakMins]);

  const handleToggleFocusActive = () => {
    setFocusIsActive((prev) => {
      const next = !prev;
      if (next) {
        setCatState('SIT');
      } else {
        setCatState('IDLE');
      }
      return next;
    });
  };

  const handleResetFocusTimer = () => {
    setFocusIsActive(false);
    setCatState('IDLE');
    setFocusSecondsLeft(focusMode === 'work' ? focusWorkMins * 60 : focusBreakMins * 60);
  };

  const handleSetFocusWorkMins = (mins: number) => {
    setFocusWorkMins(mins);
    if (focusMode === 'work' && !focusIsActive) {
      setFocusSecondsLeft(mins * 60);
    }
  };

  const handleSetFocusBreakMins = (mins: number) => {
    setFocusBreakMins(mins);
    if (focusMode === 'break' && !focusIsActive) {
      setFocusSecondsLeft(mins * 60);
    }
  };

  const handleSetFocusMode = (mode: 'work' | 'break') => {
    setFocusMode(mode);
    setFocusIsActive(false);
    setCatState('IDLE');
    setFocusSecondsLeft(mode === 'work' ? focusWorkMins * 60 : focusBreakMins * 60);
  };

  // State Machine Ref
  const stateMachineRef = useRef<CatStateMachine | null>(null);

  // Initialize Sound settings
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Trigger Birthday Celebration (Sound, Confetti, Hat, Banner, Dialogue)
  const triggerBirthdayEvent = useCallback(() => {
    setIsBirthdayActive(true);
    updateSettings({ hat: 'birthday' });
    soundManager.playPartyFanfare();

    // Spawn 35 Confetti Particles across the screen
    const newParticles: Particle[] = [];
    for (let i = 0; i < 35; i++) {
      newParticles.push({
        id: `confetti-${Date.now()}-${i}`,
        type: Math.random() < 0.5 ? 'sparkle' : 'heart',
        x: Math.random() * dimensionsRef.current.width,
        y: Math.random() * (dimensionsRef.current.height - 40),
        vx: (Math.random() - 0.5) * 3,
        vy: -1 - Math.random() * 2,
        life: 1.0,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
    showCatDialogue('🎉 HAPPY BIRTHDAY UMAMAH! Party time! 🥳🎂');
  }, []);

  // Check Birthday on Mount / Midnight (Midnight 12 AM on August 21st)
  useEffect(() => {
    const checkMidnightBirthday = () => {
      const now = new Date();
      const monthDay = now.toISOString().slice(5, 10); // MM-DD
      const hours = now.getHours();
      const mins = now.getMinutes();

      // Active ONLY on August 21st (08-21)
      if (monthDay === '08-21') {
        setIsBirthdayActive(true);
        if (settings.hat !== 'birthday') {
          updateSettings({ hat: 'birthday' });
        }
        // Trigger party fanfare & confetti exactly at Midnight 12 AM
        if (hours === 0 && mins === 0 && !isBirthdayActive) {
          triggerBirthdayEvent();
        }
      } else {
        // Automatically end birthday mode after August 21st passes!
        setIsBirthdayActive(false);
      }
    };

    checkMidnightBirthday();
    const interval = setInterval(checkMidnightBirthday, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [settings.hat, isBirthdayActive, triggerBirthdayEvent]);

  // Handle Cat State Changes
  const handleStateChange = useCallback((evt: any) => {
    setCatState(evt.newState);
    catStateRef.current = evt.newState;
    if (evt.targetX !== undefined) {
      targetXRef.current = evt.targetX;
    }
  }, []);

  // Initialize State Machine
  useEffect(() => {
    stateMachineRef.current = new CatStateMachine(settings.personality, handleStateChange);
  }, [settings.personality, handleStateChange]);

  // ========================================================
  // SINGLE STABLE RAF LOOP — never re-mounted by state changes
  // ========================================================
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const WALK_SPEED = 0.035;  // px per ms (~35 px/s)
    const RUN_SPEED = 0.07;    // px per ms (~70 px/s)

    const clampX = (val: number) => {
      const minX = 45;
      const maxX = dimensionsRef.current.width - 45;
      return Math.max(minX, Math.min(maxX, val));
    };

    const loop = (now: number) => {
      const rawDelta = now - lastTime;
      lastTime = now;
      const deltaMs = Math.min(rawDelta, 100);

      // --- Update State Machine ---
      if (stateMachineRef.current) {
        stateMachineRef.current.update(
          deltaMs,
          catXRef.current,
          dimensionsRef.current.width,
          dimensionsRef.current.height,
          statsRef.current
        );
      }

      let moved = false;

      // --- Normal target-based movement ---
      if (targetXRef.current !== null && !activeYarnRef.current && !activeFoodRef.current) {
        const dx = targetXRef.current - catXRef.current;
        const speed = catStateRef.current === 'RUN' ? RUN_SPEED : WALK_SPEED;

        if (Math.abs(dx) > 2) {
          setFacingLeft(dx < 0);
          const dir = dx > 0 ? 1 : -1;
          const step = dir * speed * deltaMs;

          if (Math.abs(step) >= Math.abs(dx)) {
            catXRef.current = targetXRef.current;
            targetXRef.current = null;
          } else {
            catXRef.current += step;
          }
          catXRef.current = clampX(catXRef.current);
          moved = true;
        } else {
          targetXRef.current = null;
        }
      }

      // --- Yarn chase ---
      if (activeYarnRef.current) {
        const dx = activeYarnRef.current.x - catXRef.current;
        if (Math.abs(dx) > 12) {
          setFacingLeft(dx < 0);
          setCatState('RUN');
          catStateRef.current = 'RUN';
          const step = (dx > 0 ? 1 : -1) * RUN_SPEED * deltaMs;
          catXRef.current = clampX(catXRef.current + step);
          moved = true;
        } else {
          // Reached yarn!
          setActiveYarn(null);
          activeYarnRef.current = null;
          setCatState('HAPPY');
          catStateRef.current = 'HAPPY';
          soundManager.playPurr();
          setParticles((prev) => [...prev, {
            id: `p-${Date.now()}`, type: 'heart' as const,
            x: catXRef.current, y: dimensionsRef.current.height - 75,
            vx: (Math.random() - 0.5) * 1.5, vy: -1 - Math.random() * 1.5, life: 1.0,
          }]);
        }
      }

      // --- Food chase ---
      if (activeFoodRef.current) {
        const dx = activeFoodRef.current.x - catXRef.current;
        if (Math.abs(dx) > 12) {
          setFacingLeft(dx < 0);
          setCatState('WALK');
          catStateRef.current = 'WALK';
          const step = (dx > 0 ? 1 : -1) * WALK_SPEED * deltaMs;
          catXRef.current = clampX(catXRef.current + step);
          moved = true;
        } else {
          // Reached food!
          setActiveFood(null);
          activeFoodRef.current = null;
          setCatState('EAT');
          catStateRef.current = 'EAT';
          soundManager.playEat();
        }
      }

      if (moved) {
        setCatX(catXRef.current);
      }

      // Update Particles
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.015,
          }))
          .filter((p) => p.life > 0)
      );

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Helper to add particles safely
  const addParticle = (type: Particle['type'], x: number, y: number, text?: string) => {
    const newP: Particle = {
      id: `p-${Date.now()}-${Math.random()}`,
      type,
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: -1.5 - Math.random(),
      life: 1.0,
      text,
    };
    setParticles((prev) => [...prev.slice(-15), newP]);
  };

  const dialogueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to show Cat Speech Dialogue (auto-dismisses after 4.5s)
  const showCatDialogue = (msg: string) => {
    if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
    setDialogue(msg);
    dialogueTimerRef.current = setTimeout(() => {
      setDialogue(null);
    }, 4500);
  };

  // User Actions
  const handlePetCat = () => {
    setCatState('HAPPY');
    catStateRef.current = 'HAPPY';
    soundManager.playMeow();
    soundManager.playPurr();
    addParticle('heart', catX, catY - 25);
    showCatDialogue(`Purrr... I love you, ${settings.ownerName}! ❤️`);
  };

  const handlePlayYarn = () => {
    const targetYarnX = 40 + Math.random() * (dimensions.width - 80);
    setActiveYarn({ x: targetYarnX, y: dimensions.height - 50 });
    soundManager.playClick();
    showCatDialogue('Yay! Yarn ball chase! 🧶');
  };

  const handleFeedCat = () => {
    const foodX = 50 + Math.random() * (dimensions.width - 100);
    setActiveFood({ x: foodX, y: dimensions.height - 45 });
    soundManager.playClick();
    showCatDialogue('Snack time! Delicious! 🍗');
  };

  // Canvas Click Handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const dist = Math.hypot(clickX - catX, clickY - catY);
    if (dist < 40) {
      setShowInteractionMenu((prev) => !prev);
    } else {
      setShowInteractionMenu(false);
    }
  };

  // Productivity Task Handlers
  const handleAddTask = (text: string, priority: 'low' | 'medium' | 'high', isDaily: boolean) => {
    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      text,
      completed: false,
      priority,
      isDaily,
      createdAt: Date.now(),
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    storage.saveTasks(updated);
    soundManager.playClick();
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          soundManager.playTaskComplete();
          addParticle('sparkle', catX, catY - 30);
          setCatState('HAPPY');
          showCatDialogue(`Great job finishing that task! 🎉`);
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });
    setTasks(updated);
    storage.saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    storage.saveTasks(updated);
  };

  // Accessory Handlers
  const handleEquipItem = (itemId: string) => {
    if (!inventory.includes(itemId)) {
      const newInv = [...inventory, itemId];
      setInventory(newInv);
      storage.saveInventory(newInv);
    }
    soundManager.playClick();
  };

  const handlePlaceItem = (itemId: string) => {
    const newPlaced: PlacedItem = {
      id: `p-${Date.now()}`,
      itemId,
      x: 20 + Math.random() * 60,
      y: 65 + Math.random() * 15,
    };
    const updated = [...placedItems, newPlaced];
    setPlacedItems(updated);
    storage.savePlacedItems(updated);
    soundManager.playClick();
  };

  const handleRemoveItem = (placedId: string) => {
    const updated = placedItems.filter((p) => p.id !== placedId);
    setPlacedItems(updated);
    storage.savePlacedItems(updated);
  };

  const handleSelectHat = (hat: CatHat) => {
    updateSettings({ hat });
    soundManager.playClick();
  };

  const handleChangeRoom = (room: RoomTheme) => {
    updateSettings({ currentRoom: room });
    soundManager.playClick();
  };

  const updateSettings = (newSt: Partial<CatDeskSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSt };
      storage.saveSettings(updated);
      return updated;
    });
  };

  const handleTogglePin = () => {
    const nextVal = !settings.alwaysOnTop;
    updateSettings({ alwaysOnTop: nextVal });
    setAlwaysOnTop(nextVal);
    soundManager.playClick();
    showCatDialogue(nextVal ? 'Widget pinned on top! 📌' : "Unpinned. I'll stay cozy in the background! 🛋️");
  };

  return (
    <div
      data-tauri-drag-region
      onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setCursorPos(null)}
      className={`relative w-full h-full overflow-hidden select-none font-sans ${
        settings.viewMode === 'transparent' ? 'bg-transparent' : 'bg-slate-900'
      }`}
    >
      {/* Top Floating Control Bar */}
      {settings.viewMode !== 'minimal' && (
        <FloatingControls
          onOpenPanel={(p) => setActivePanel(activePanel === p ? null : p)}
          activePanel={activePanel}
          catName={settings.catName}
          alwaysOnTop={settings.alwaysOnTop}
          onTogglePin={handleTogglePin}
        />
      )}

      {/* Birthday Top Banner */}
      {isBirthdayActive && <BirthdayBanner />}

      {/* Main Interactive Canvas */}
      <CatRenderer
        width={dimensions.width}
        height={dimensions.height}
        catState={catState}
        skin={settings.skin}
        hat={settings.hat}
        catX={catX}
        catY={catY}
        facingLeft={facingLeft}
        placedItems={settings.viewMode === 'transparent' ? [] : placedItems}
        currentRoom={settings.currentRoom}
        cursorPos={cursorPos}
        activeYarn={activeYarn}
        activeFood={activeFood}
        particles={particles}
        onCatClick={handleCanvasClick}
      />

      {/* Cat Dialogue Speech Bubble */}
      {dialogue && (
        <DialogueBubble
          text={dialogue}
          x={catX}
          y={catY}
          catName={settings.catName}
          onClose={() => setDialogue(null)}
        />
      )}

      {/* Compact Cat Action Radial Menu */}
      {showInteractionMenu && !activePanel && (
        <InteractionMenu
          onPet={handlePetCat}
          onPlay={handlePlayYarn}
          onFeed={handleFeedCat}
          onClose={() => setShowInteractionMenu(false)}
        />
      )}

      {/* Overlay Panels */}
      {activePanel === 'tasks' && (
        <TaskPanel
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onClose={() => setActivePanel(null)}
          catName={settings.catName}
        />
      )}

      {activePanel === 'focus' && (
        <FocusPanel
          workMinutes={focusWorkMins}
          breakMinutes={focusBreakMins}
          secondsLeft={focusSecondsLeft}
          isActive={focusIsActive}
          mode={focusMode}
          onToggleActive={handleToggleFocusActive}
          onReset={handleResetFocusTimer}
          onSetWorkMinutes={handleSetFocusWorkMins}
          onSetBreakMinutes={handleSetFocusBreakMins}
          onSetMode={handleSetFocusMode}
          onClose={() => setActivePanel(null)}
          catName={settings.catName}
        />
      )}

      {activePanel === 'notes' && (
        <NotesPanel
          notes={notes}
          onSaveNote={(note) => {
            const exists = notes.some((n) => n.id === note.id);
            const updated = exists
              ? notes.map((n) => (n.id === note.id ? note : n))
              : [note, ...notes];
            setNotes(updated);
            storage.saveNotes(updated);
          }}
          onDeleteNote={(id) => {
            const updated = notes.filter((n) => n.id !== id);
            setNotes(updated);
            storage.saveNotes(updated);
          }}
          onClose={() => setActivePanel(null)}
          catName={settings.catName}
        />
      )}

      {activePanel === 'shop' && (
        <ShopRoomPanel
          inventory={inventory}
          placedItems={placedItems}
          currentRoom={settings.currentRoom}
          currentHat={settings.hat}
          onEquipItem={handleEquipItem}
          onPlaceItem={handlePlaceItem}
          onRemoveItem={handleRemoveItem}
          onSelectHat={handleSelectHat}
          onChangeRoom={handleChangeRoom}
          onClose={() => setActivePanel(null)}
          catName={settings.catName}
        />
      )}

      {activePanel === 'settings' && (
        <SettingsPanel
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={() => setActivePanel(null)}
        />
      )}

      {/* Special Event Modals */}
      {showBirthdayModal && (
        <BirthdayModal
          catName={settings.catName}
          ownerName={settings.ownerName}
          onClose={() => {
            setShowBirthdayModal(false);
            updateSettings({ hat: 'birthday' });
          }}
        />
      )}

      {showFirstLaunch && (
        <FirstLaunchModal onComplete={(name, personality, skin) => {
          updateSettings({ catName: name, personality, skin, firstLaunch: false });
          setShowFirstLaunch(false);
          showCatDialogue(`Hi! I'm ${name}. Happy to be your companion!`);
        }} />
      )}
    </div>
  );
}

export default App;
