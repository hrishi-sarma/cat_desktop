import { storage } from './storage';

async function isTauriAvailable() {
  return (
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  );
}

export async function startWindowDrag(): Promise<void> {
  if (!(await isTauriAvailable())) return;
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('drag_window');
    saveCurrentPosition();
  } catch (e) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().startDragging();
      saveCurrentPosition();
    } catch (err) {
      console.warn('Window drag failed', err);
    }
  }
}

export async function saveCurrentPosition(): Promise<void> {
  if (!(await isTauriAvailable())) return;
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const pos = await getCurrentWindow().outerPosition();
    storage.saveWindowPosition({ x: pos.x, y: pos.y });
  } catch (e) {
    console.warn('Failed to get outer position', e);
  }
}

export async function initializeWindowPosition(): Promise<void> {
  if (!(await isTauriAvailable())) return;
  try {
    const savedSettings = storage.getSettings();
    await setAlwaysOnTop(savedSettings.alwaysOnTop);

    const savedPos = storage.getWindowPosition();
    if (savedPos) {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const { PhysicalPosition } = await import('@tauri-apps/api/dpi');
      await getCurrentWindow().setPosition(
        new PhysicalPosition(savedPos.x, savedPos.y)
      );
    } else {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().center();
      } catch (e) {
        console.warn('Center failed', e);
      }
    }
  } catch (e) {
    console.warn('Failed to initialize window position', e);
  }
}

export async function setAlwaysOnTop(onTop: boolean): Promise<void> {
  if (!(await isTauriAvailable())) return;
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('set_always_on_top', { alwaysOnTop: onTop });
  } catch (e) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().setAlwaysOnTop(onTop);
    } catch (err) {
      console.warn('Failed to set always on top', err);
    }
  }
}

export async function closeAppWindow(): Promise<void> {
  if (await isTauriAvailable()) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().close();
      return;
    } catch (e) {
      console.warn('Failed to close window via Tauri API', e);
    }
  }
  window.close();
}

export async function setWindowSize(width: number, height: number): Promise<void> {
  if (!(await isTauriAvailable())) return;
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const { PhysicalSize } = await import('@tauri-apps/api/dpi');
    await getCurrentWindow().setSize(new PhysicalSize(width, height));
  } catch (e) {
    console.warn('Failed to resize window', e);
  }
}

export async function minimizeWindow(): Promise<void> {
  if (!(await isTauriAvailable())) return;
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    await getCurrentWindow().minimize();
  } catch (e) {
    console.warn('Failed to minimize window', e);
  }
}

// Auto initialize position on module load
initializeWindowPosition();
