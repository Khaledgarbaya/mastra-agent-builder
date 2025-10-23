import type { PreviewState } from '../../types';

const STORAGE_KEY_PREFIX = 'mastra-preview-';

/**
 * Manages preview state persistence using sessionStorage
 */
export class StateManager {
  /**
   * Save preview state to sessionStorage
   */
  savePreviewState(sessionId: string, state: Omit<PreviewState, 'sessionId'>): void {
    try {
      const fullState: PreviewState = {
        sessionId,
        ...state,
      };
      sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${sessionId}`, JSON.stringify(fullState));
    } catch (error) {
      console.error('Failed to save preview state:', error);
    }
  }

  /**
   * Load preview state from sessionStorage
   */
  loadPreviewState(sessionId: string): PreviewState | null {
    try {
      const data = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
      if (!data) return null;

      const state = JSON.parse(data) as PreviewState;
      return state;
    } catch (error) {
      console.error('Failed to load preview state:', error);
      return null;
    }
  }

  /**
   * Clear preview state from sessionStorage
   */
  clearPreviewState(sessionId: string): void {
    try {
      sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
    } catch (error) {
      console.error('Failed to clear preview state:', error);
    }
  }

  /**
   * Clear all preview states
   */
  clearAllPreviewStates(): void {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear all preview states:', error);
    }
  }

  /**
   * Get current session ID (based on project ID)
   */
  getSessionId(projectId: string): string {
    return `${projectId}-${Date.now()}`;
  }
}

