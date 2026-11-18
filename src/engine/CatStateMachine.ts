import { CatState, CatPersonalityType, CatStats } from '../types/cat';

export interface StateChangeEvent {
  newState: CatState;
  targetX?: number;
  targetY?: number;
  durationMs?: number;
}

const VALID_STATES: CatState[] = [
  'IDLE', 'WALK', 'RUN', 'SIT', 'LOOK_AROUND', 'SCRATCH',
  'STRETCH', 'PLAY', 'EAT', 'SLEEP', 'WAKE', 'HAPPY',
  'SAD', 'CURIOUS', 'MEOW', 'LICK',
];

export class CatStateMachine {
  private currentState: CatState = 'IDLE';
  private stateTimer: number = 5000;
  private personality: CatPersonalityType = 'affectionate';
  private onStateChange: ((event: StateChangeEvent) => void) | null = null;

  constructor(personality: CatPersonalityType, onChange: (event: StateChangeEvent) => void) {
    this.personality = personality || 'affectionate';
    this.onStateChange = onChange;
    this.stateTimer = 5000;
  }

  public setPersonality(p: CatPersonalityType) {
    this.personality = p || 'affectionate';
  }

  public getCurrentState(): CatState {
    return this.currentState || 'IDLE';
  }

  public setState(state: CatState, durationMs: number = 5000, targetX?: number, targetY?: number) {
    try {
      const validState = VALID_STATES.includes(state) ? state : 'IDLE';
      const validDuration = Math.max(1000, Math.min(60000, durationMs || 5000));

      this.currentState = validState;
      this.stateTimer = validDuration;

      if (this.onStateChange) {
        this.onStateChange({ newState: validState, targetX, targetY, durationMs: validDuration });
      }
    } catch (e) {
      console.warn('CatStateMachine setState safety fallback triggered', e);
      this.currentState = 'IDLE';
      this.stateTimer = 5000;
    }
  }

  public update(deltaMs: number, currentX: number, roomWidth: number, _roomHeight: number, stats: CatStats) {
    try {
      const safeDelta = Math.max(0, Math.min(1000, deltaMs || 16));
      this.stateTimer -= safeDelta;

      if (this.stateTimer <= 0) {
        this.decideNextState(currentX || 160, roomWidth || 320, _roomHeight || 240, stats);
      }
    } catch (e) {
      console.warn('CatStateMachine update error caught safely', e);
      this.currentState = 'IDLE';
      this.stateTimer = 5000;
    }
  }

  private decideNextState(currentX: number, roomWidth: number, _roomHeight: number, stats: CatStats) {
    // Low energy fallback (< 20)
    if (stats && stats.energy < 20 && this.currentState !== 'SLEEP') {
      this.setState('SLEEP', 10000);
      return;
    }

    const rand = Math.random();
    let nextState: CatState = 'IDLE';
    let duration = 6000;
    let targetX: number | undefined;

    const minX = 50;
    const maxX = Math.max(minX + 20, roomWidth - 50);
    const randomOffset = (Math.random() - 0.5) * 100;
    const clampedTarget = Math.max(minX, Math.min(maxX, currentX + randomOffset));

    switch (this.personality) {
      case 'lazy':
        if (rand < 0.35) {
          nextState = 'SIT';
          duration = 8000;
        } else if (rand < 0.65) {
          nextState = 'SLEEP';
          duration = 10000;
        } else if (rand < 0.85) {
          nextState = 'LICK';
          duration = 5000;
        } else {
          nextState = 'WALK';
          duration = 6000;
          targetX = clampedTarget;
        }
        break;

      case 'energetic':
        if (rand < 0.35) {
          nextState = 'WALK';
          duration = 5000;
          targetX = clampedTarget;
        } else if (rand < 0.55) {
          nextState = 'RUN';
          duration = 4000;
          targetX = clampedTarget;
        } else if (rand < 0.75) {
          nextState = 'STRETCH';
          duration = 4000;
        } else if (rand < 0.9) {
          nextState = 'LOOK_AROUND';
          duration = 4000;
        } else {
          nextState = 'SIT';
          duration = 5000;
        }
        break;

      case 'mischievous':
        if (rand < 0.25) {
          nextState = 'SCRATCH';
          duration = 4000;
        } else if (rand < 0.5) {
          nextState = 'WALK';
          duration = 5000;
          targetX = clampedTarget;
        } else if (rand < 0.7) {
          nextState = 'MEOW';
          duration = 3000;
        } else if (rand < 0.85) {
          nextState = 'LOOK_AROUND';
          duration = 4000;
        } else {
          nextState = 'SIT';
          duration = 6000;
        }
        break;

      case 'grumpy':
        if (rand < 0.4) {
          nextState = 'SIT';
          duration = 9000;
        } else if (rand < 0.7) {
          nextState = 'LOOK_AROUND';
          duration = 5000;
        } else {
          nextState = 'WALK';
          duration = 5000;
          targetX = clampedTarget;
        }
        break;

      case 'curious':
        if (rand < 0.4) {
          nextState = 'LOOK_AROUND';
          duration = 5000;
        } else if (rand < 0.7) {
          nextState = 'WALK';
          duration = 5000;
          targetX = clampedTarget;
        } else {
          nextState = 'STRETCH';
          duration = 4000;
        }
        break;

      case 'affectionate':
      default:
        if (rand < 0.3) {
          nextState = 'SIT';
          duration = 7000;
        } else if (rand < 0.55) {
          nextState = 'WALK';
          duration = 5000;
          targetX = clampedTarget;
        } else if (rand < 0.75) {
          nextState = 'HAPPY';
          duration = 3500;
        } else if (rand < 0.9) {
          nextState = 'STRETCH';
          duration = 4000;
        } else {
          nextState = 'LOOK_AROUND';
          duration = 4000;
        }
        break;
    }

    this.setState(nextState, duration, targetX);
  }
}
