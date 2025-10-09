import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  BuilderState,
  BuilderActions,
  BuilderSnapshot,
  ProjectConfig,
  CanvasNode,
  CanvasEdge,
  ProjectSettings,
} from '../types';

interface BuilderStore extends BuilderState, BuilderActions {}

const MAX_HISTORY_SIZE = 50;

const initialState: BuilderState = {
  project: null,
  history: {
    past: [],
    future: [],
    maxSize: MAX_HISTORY_SIZE,
  },
  ui: {
    selectedNodeId: undefined,
    isCodePreviewOpen: false,
    isExportDialogOpen: false,
    isImportDialogOpen: false,
    isSaveDialogOpen: false,
    isTemplateLibraryOpen: false,
    leftPanelWidth: 300,
    rightPanelWidth: 400,
    zoom: 1,
    viewport: { x: 0, y: 0 },
  },
  validationErrors: {},
  isDirty: false,
};

export const useBuilderStore = create<BuilderStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Project actions
      createProject: (name: string, description?: string) => {
        const newProject: ProjectConfig = {
          id: `project-${Date.now()}`,
          name,
          description,
          nodes: [],
          edges: [],
          settings: {
            storage: { type: 'libsql' },
            logger: { type: 'pino' },
            telemetry: { enabled: true },
          },
        };

        const snapshot: BuilderSnapshot = {
          project: null,
          timestamp: Date.now(),
        };

        set({
          project: newProject,
          history: {
            ...get().history,
            past: [snapshot],
            future: [],
          },
          isDirty: true,
        });
      },

      setProject: (project: ProjectConfig, markClean?: boolean) => {
        const state = get();
        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        set({
          project,
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: markClean ? false : true,
        });
      },

      updateProject: (updates: Partial<ProjectConfig>) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        set({
          project: { ...state.project, ...updates },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      reset: () => {
        set(initialState);
      },

      // Node actions
      addNode: (node: CanvasNode) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        set({
          project: {
            ...state.project,
            nodes: [...state.project.nodes, node],
          },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      updateNode: (nodeId: string, updates: Partial<CanvasNode>) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        set({
          project: {
            ...state.project,
            nodes: state.project.nodes.map(node => (node.id === nodeId ? { ...node, ...updates } : node)),
          },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      deleteNode: (nodeId: string) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        // Also remove connected edges
        const updatedEdges = state.project.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);

        set({
          project: {
            ...state.project,
            nodes: state.project.nodes.filter(node => node.id !== nodeId),
            edges: updatedEdges,
          },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      deleteNodes: (nodeIds: string[]) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        const nodeIdSet = new Set(nodeIds);
        const updatedEdges = state.project.edges.filter(
          edge => !nodeIdSet.has(edge.source) && !nodeIdSet.has(edge.target),
        );

        set({
          project: {
            ...state.project,
            nodes: state.project.nodes.filter(node => !nodeIdSet.has(node.id)),
            edges: updatedEdges,
          },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      duplicateNode: (nodeId: string) => {
        const state = get();
        if (!state.project) return;

        const nodeToDuplicate = state.project.nodes.find(n => n.id === nodeId);
        if (!nodeToDuplicate) return;

        const newNode: CanvasNode = {
          ...nodeToDuplicate,
          id: `${nodeToDuplicate.type}-${Date.now()}`,
          position: {
            x: nodeToDuplicate.position.x + 50,
            y: nodeToDuplicate.position.y + 50,
          },
        };

        get().addNode(newNode);
      },

      moveNode: (nodeId: string, position: { x: number; y: number }) => {
        get().updateNode(nodeId, { position });
      },

      // Edge actions
      addEdge: (edge: CanvasEdge) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        set({
          project: {
            ...state.project,
            edges: [...state.project.edges, edge],
          },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      updateEdge: (edgeId: string, updates: Partial<CanvasEdge>) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        set({
          project: {
            ...state.project,
            edges: state.project.edges.map(edge => (edge.id === edgeId ? { ...edge, ...updates } : edge)),
          },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      deleteEdge: (edgeId: string) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        set({
          project: {
            ...state.project,
            edges: state.project.edges.filter(edge => edge.id !== edgeId),
          },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      deleteEdges: (edgeIds: string[]) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        const edgeIdSet = new Set(edgeIds);

        set({
          project: {
            ...state.project,
            edges: state.project.edges.filter(edge => !edgeIdSet.has(edge.id)),
          },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      // Settings actions
      updateSettings: (settings: Partial<ProjectSettings>) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        set({
          project: {
            ...state.project,
            settings: { ...state.project.settings, ...settings },
          },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      // History actions
      undo: () => {
        const state = get();
        const { past, future } = state.history;

        if (past.length === 0) return;

        const previous = past[past.length - 1];
        if (!previous) return;

        const newPast = past.slice(0, -1);

        const currentSnapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        set({
          project: previous.project,
          history: {
            ...state.history,
            past: newPast,
            future: [currentSnapshot, ...future],
          },
        });
      },

      redo: () => {
        const state = get();
        const { past, future } = state.history;

        if (future.length === 0) return;

        const next = future[0];
        if (!next) return;

        const newFuture = future.slice(1);

        const currentSnapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        set({
          project: next.project,
          history: {
            ...state.history,
            past: [...past, currentSnapshot],
            future: newFuture,
          },
        });
      },

      canUndo: () => {
        return get().history.past.length > 0;
      },

      canRedo: () => {
        return get().history.future.length > 0;
      },

      // UI actions
      setSelectedNode: (nodeId?: string) => {
        set(state => ({
          ui: { ...state.ui, selectedNodeId: nodeId },
        }));
      },

      toggleCodePreview: () => {
        set(state => ({
          ui: { ...state.ui, isCodePreviewOpen: !state.ui.isCodePreviewOpen },
        }));
      },

      toggleExportDialog: () => {
        set(state => ({
          ui: { ...state.ui, isExportDialogOpen: !state.ui.isExportDialogOpen },
        }));
      },

      toggleImportDialog: () => {
        set(state => ({
          ui: { ...state.ui, isImportDialogOpen: !state.ui.isImportDialogOpen },
        }));
      },

      toggleSaveDialog: () => {
        set(state => ({
          ui: { ...state.ui, isSaveDialogOpen: !state.ui.isSaveDialogOpen },
        }));
      },

      toggleTemplateLibrary: () => {
        set(state => ({
          ui: { ...state.ui, isTemplateLibraryOpen: !state.ui.isTemplateLibraryOpen },
        }));
      },

      applyTemplate: (templateProject: ProjectConfig) => {
        const state = get();
        if (!state.project) return;

        const snapshot: BuilderSnapshot = {
          project: state.project,
          timestamp: Date.now(),
        };

        // Apply template by merging nodes and edges
        const existingNodes = state.project.nodes || [];
        const existingEdges = state.project.edges || [];

        // Offset template nodes to avoid overlap
        const offsetX = 100;
        const offsetY = 100;

        const templateNodes = templateProject.nodes.map(node => ({
          ...node,
          position: {
            x: node.position.x + offsetX,
            y: node.position.y + offsetY,
          },
        }));

        set({
          project: {
            ...state.project,
            nodes: [...existingNodes, ...templateNodes],
            edges: [...existingEdges, ...templateProject.edges],
          },
          history: {
            ...state.history,
            past: [...state.history.past, snapshot].slice(-MAX_HISTORY_SIZE),
            future: [],
          },
          isDirty: true,
        });
      },

      setLeftPanelWidth: (width: number) => {
        set(state => ({
          ui: { ...state.ui, leftPanelWidth: width },
        }));
      },

      setRightPanelWidth: (width: number) => {
        set(state => ({
          ui: { ...state.ui, rightPanelWidth: width },
        }));
      },

      setZoom: (zoom: number) => {
        set(state => ({
          ui: { ...state.ui, zoom },
        }));
      },

      setViewport: (viewport: { x: number; y: number }) => {
        set(state => ({
          ui: { ...state.ui, viewport },
        }));
      },

      // Validation actions
      validateProject: () => {
        // TODO: Implement validation logic
        set({ validationErrors: {} });
      },

      clearValidation: () => {
        set({ validationErrors: {} });
      },

      // Dirty state
      markDirty: () => {
        set({ isDirty: true });
      },

      markClean: () => {
        set({ isDirty: false });
      },
    }),
    { name: 'MastraBuilderStore' },
  ),
);
