import { useBuilderStore } from '../store/builderStore';

/**
 * Hook to access and manipulate builder state - Unified Canvas
 */
export function useBuilderState() {
  const state = useBuilderStore();

  return {
    // Current state
    project: state.project,
    isDirty: state.isDirty,
    ui: state.ui,
    isSaveDialogOpen: state.ui.isSaveDialogOpen,
    validationErrors: state.validationErrors,

    // Project actions
    createProject: state.createProject,
    setProject: state.setProject,
    updateProject: state.updateProject,
    reset: state.reset,

    // Node actions
    addNode: state.addNode,
    updateNode: state.updateNode,
    deleteNode: state.deleteNode,
    deleteNodes: state.deleteNodes,
    duplicateNode: state.duplicateNode,
    moveNode: state.moveNode,

    // Edge actions
    addEdge: state.addEdge,
    updateEdge: state.updateEdge,
    deleteEdge: state.deleteEdge,
    deleteEdges: state.deleteEdges,

    // Settings actions
    updateSettings: state.updateSettings,

    // History actions
    undo: state.undo,
    redo: state.redo,
    canUndo: state.canUndo(),
    canRedo: state.canRedo(),

    // UI actions
    setSelectedNode: state.setSelectedNode,
    toggleCodePreview: state.toggleCodePreview,
    toggleExportDialog: state.toggleExportDialog,
    toggleImportDialog: state.toggleImportDialog,
    toggleSaveDialog: state.toggleSaveDialog,
    toggleTemplateLibrary: state.toggleTemplateLibrary,
    togglePreview: state.togglePreview,
    setPreviewStatus: state.setPreviewStatus,
    addPreviewLog: state.addPreviewLog,
    clearPreviewLogs: state.clearPreviewLogs,
    applyTemplate: state.applyTemplate,
    setLeftPanelWidth: state.setLeftPanelWidth,
    setRightPanelWidth: state.setRightPanelWidth,
    setZoom: state.setZoom,
    setViewport: state.setViewport,

    // Validation actions
    validateProject: state.validateProject,
    clearValidation: state.clearValidation,

    // Dirty state
    markDirty: state.markDirty,
    markClean: state.markClean,
  };
}

/**
 * Hook to access only UI state (for performance)
 */
export function useBuilderUIState() {
  return useBuilderStore(state => state.ui);
}

/**
 * Hook to access validation state
 */
export function useValidationState() {
  return useBuilderStore(state => ({
    errors: state.validationErrors,
    validate: state.validateProject,
    clear: state.clearValidation,
  }));
}
