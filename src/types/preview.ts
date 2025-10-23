import type { FileSystemTree } from '@webcontainer/api';

/**
 * Preview status states
 */
export type PreviewStatus = 'idle' | 'booting' | 'installing' | 'starting' | 'running' | 'error';

/**
 * API keys configuration for preview
 */
export interface ApiKeysConfig {
  openai?: string;
  anthropic?: string;
  google?: string;
}

/**
 * Preview state for persistence
 */
export interface PreviewState {
  sessionId: string;
  files: FileSystemTree;
  apiKeys: ApiKeysConfig;
  timestamp: number;
}

/**
 * Log entry for preview logs
 */
export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warning' | 'error';
  message: string;
}

/**
 * WebContainer server info
 */
export interface ServerInfo {
  port: number;
  url: string;
}

