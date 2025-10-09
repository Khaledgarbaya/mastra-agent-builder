import type { AgentBuilderConfig } from './agent';
import type { ToolBuilderConfig } from './tool';

/**
 * Main builder state - Unified Canvas Approach
 */
export interface BuilderState {
  // Current project being built
  project: ProjectConfig | null;
  // History for undo/redo
  history: BuilderHistory;
  // UI state
  ui: BuilderUIState;
  // Validation
  validationErrors: Record<string, any>;
  // Dirty state (unsaved changes)
  isDirty: boolean;
}

/**
 * Complete project configuration on the unified canvas
 */
export interface ProjectConfig {
  id: string;
  name: string;
  description?: string;
  // All nodes on the canvas (agents, steps, tools, etc.)
  nodes: CanvasNode[];
  // Connections between nodes
  edges: CanvasEdge[];
  // Global project settings
  settings: ProjectSettings;
  // Canvas viewport state
  viewport?: { x: number; y: number; zoom: number };
}

/**
 * Global project settings
 */
export interface ProjectSettings {
  projectName?: string;
  description?: string;
  defaultModel?: {
    provider: string;
    name: string;
  };
  storage?: {
    type: 'libsql' | 'postgres' | 'redis' | 'memory';
    config?: Record<string, any>;
  };
  logger?: {
    type: 'pino' | 'console' | 'custom';
    config?: Record<string, any>;
  };
  telemetry?: {
    enabled: boolean;
    provider?: string;
    config?: Record<string, any>;
  };
  environmentVariables?: Record<string, string>;
  entryPoints?: {
    agents?: string[];
    workflows?: string[];
  };
}

/**
 * Universal node type on the canvas
 */
export interface CanvasNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  selected?: boolean;
  dragging?: boolean;
}

export type NodeType =
  | 'agent'
  | 'step'
  | 'tool'
  | 'loop'
  | 'foreach'
  | 'parallel'
  | 'router'
  | 'conditional'
  | 'sleep'
  | 'sleepuntil'
  | 'waitforevent'
  | 'map';

/**
 * Node data varies by type
 */
export type NodeData = AgentNodeData | StepNodeData | ToolNodeData | TriggerNodeData | LogicNodeData;

export interface AgentNodeData {
  type: 'agent';
  config: AgentBuilderConfig;
}

export interface StepNodeData {
  type: 'step';
  config: {
    id: string;
    description?: string;
    inputSchema?: any;
    outputSchema?: any;
    executeCode?: string;
  };
}

export interface ToolNodeData {
  type: 'tool';
  config: ToolBuilderConfig;
}

export interface TriggerNodeData {
  type: 'trigger';
  config: {
    triggerType: 'webhook' | 'event' | 'schedule' | 'manual';
    config?: Record<string, any>;
  };
}

export interface LogicNodeData {
  type: 'logic';
  config: {
    logicType: 'conditional' | 'router' | 'loop';
    condition?: string;
    routes?: Array<{ condition: string; label: string }>;
  };
}

/**
 * Edge/Connection between nodes
 */
export interface CanvasEdge {
  id: string;
  source: string; // source node ID
  target: string; // target node ID
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  type?: 'default' | 'conditional' | 'loop';
}

export interface BuilderHistory {
  past: BuilderSnapshot[];
  future: BuilderSnapshot[];
  maxSize: number;
}

export interface BuilderSnapshot {
  project: ProjectConfig | null;
  timestamp: number;
}

export interface BuilderUIState {
  selectedNodeId?: string;
  selectedStepId?: string;
  isCodePreviewOpen: boolean;
  isExportDialogOpen: boolean;
  isImportDialogOpen: boolean;
  isSaveDialogOpen: boolean;
  isTemplateLibraryOpen: boolean;
  leftPanelWidth: number;
  rightPanelWidth: number;
  zoom: number;
  viewport: { x: number; y: number };
}

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormat;
  includeFiles: ExportFile[];
  projectName: string;
  targetDirectory?: string; // For file system access
}

export type ExportFormat = 'zip' | 'clipboard' | 'filesystem';

export type ExportFile = 'agent' | 'workflow' | 'tool' | 'mastra-config' | 'package-json' | 'tsconfig' | 'readme';

/**
 * Import options
 */
export interface ImportOptions {
  source: ImportSource;
  content?: string; // For code paste
  files?: File[]; // For file upload
  url?: string; // For GitHub URL
}

export type ImportSource = 'file' | 'paste' | 'github' | 'template';

/**
 * Code generation result
 */
export interface CodeGenerationResult {
  files: GeneratedFile[];
  errors: string[];
  warnings: string[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: 'typescript' | 'json' | 'markdown';
}

/**
 * Builder actions for state management - Unified Canvas
 */
export interface BuilderActions {
  // Project actions
  createProject: (name: string, description?: string) => void;
  setProject: (project: ProjectConfig, markClean?: boolean) => void;
  updateProject: (updates: Partial<ProjectConfig>) => void;
  reset: () => void;

  // Node actions
  addNode: (node: CanvasNode) => void;
  updateNode: (nodeId: string, updates: Partial<CanvasNode>) => void;
  deleteNode: (nodeId: string) => void;
  deleteNodes: (nodeIds: string[]) => void;
  duplicateNode: (nodeId: string) => void;
  moveNode: (nodeId: string, position: { x: number; y: number }) => void;

  // Edge actions
  addEdge: (edge: CanvasEdge) => void;
  updateEdge: (edgeId: string, updates: Partial<CanvasEdge>) => void;
  deleteEdge: (edgeId: string) => void;
  deleteEdges: (edgeIds: string[]) => void;

  // Settings actions
  updateSettings: (settings: Partial<ProjectSettings>) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // UI actions
  setSelectedNode: (nodeId?: string) => void;
  toggleCodePreview: () => void;
  toggleExportDialog: () => void;
  toggleImportDialog: () => void;
  toggleSaveDialog: () => void;
  toggleTemplateLibrary: () => void;
  applyTemplate: (templateProject: ProjectConfig) => void;
  setLeftPanelWidth: (width: number) => void;
  setRightPanelWidth: (width: number) => void;
  setZoom: (zoom: number) => void;
  setViewport: (viewport: { x: number; y: number }) => void;

  // Validation actions
  validateProject: () => void;
  clearValidation: () => void;

  // Dirty state
  markDirty: () => void;
  markClean: () => void;
}
