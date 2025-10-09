import { useEffect, useState } from 'react';
import { BuilderLayout } from './BuilderLayout';
import { BuilderToolbar } from './builder/BuilderToolbar';
import { NodePalette } from './palette/NodePalette';
import { UnifiedCanvasWrapper } from './canvas/UnifiedCanvas';
import { DynamicConfigPanel } from './panels/DynamicConfigPanel';
import { ProjectPropertiesPanel } from './panels/ProjectPropertiesPanel';
import { CodePreview } from './code-preview';
import { SaveLoadDialog } from './save-load';
import { ImportDialog } from './import';
import { TemplateLibrary } from './templates/TemplateLibrary';
import { ValidationPanel } from './validation/ValidationPanel';
import { ToastContainer, useToasts, Portal } from './ui';
import { useBuilderState, useKeyboardShortcuts } from '../hooks';
import { autoSaveProject } from '../lib/storage';
import type { ProjectConfig } from '../types';
import type { Template } from '../lib/templates';
import { X } from 'lucide-react';

export function BuilderPage() {
  const {
    project,
    setProject,
    isSaveDialogOpen,
    toggleSaveDialog,
    ui,
    toggleImportDialog,
    toggleTemplateLibrary,
    applyTemplate,
  } = useBuilderState();
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const { toasts, removeToast } = useToasts();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Auto-save project every 30 seconds
  useEffect(() => {
    if (!project) return;

    const interval = setInterval(() => {
      autoSaveProject(project);
      console.log('Auto-saved project');
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [project]);

  // Initialize with a default project if none exists
  useEffect(() => {
    if (!project) {
      const defaultProject: ProjectConfig = {
        id: `project-${Date.now()}`,
        name: 'My Mastra Project',
        description: 'Build your AI experience',
        nodes: [],
        edges: [],
        settings: {
          storage: {
            type: 'libsql',
            config: { url: 'file:./mastra.db' },
          },
          logger: {
            type: 'pino',
          },
          telemetry: {
            enabled: true,
          },
        },
      };
      setProject(defaultProject);
    }
  }, [project, setProject]);

  return (
    <>
      <BuilderLayout
        toolbar={
          <BuilderToolbar
            onOpenProjectSettings={() => setShowProjectSettings(true)}
            onOpenCodePreview={() => setShowCodePreview(true)}
            onOpenTemplates={toggleTemplateLibrary}
            onOpenValidation={() => setShowValidation(true)}
          />
        }
        leftPanel={<NodePalette />}
        rightPanel={<DynamicConfigPanel />}
      >
        <UnifiedCanvasWrapper />
      </BuilderLayout>

      {/* Project Settings Modal */}
      {showProjectSettings && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowProjectSettings(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-[500px] bg-card border-l border-border z-50 shadow-2xl">
            <button
              onClick={() => setShowProjectSettings(false)}
              className="absolute top-4 right-4 p-2 hover:bg-accent rounded-md z-10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <ProjectPropertiesPanel />
          </div>
        </>
      )}

      {/* Code Preview Modal */}
      {showCodePreview && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCodePreview(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-1/2 bg-card border-l border-border z-50 shadow-2xl">
            <button
              onClick={() => setShowCodePreview(false)}
              className="absolute top-4 right-4 p-2 hover:bg-accent rounded-md z-10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <CodePreview />
          </div>
        </>
      )}

      {/* Save/Load Modal - Centered */}
      {isSaveDialogOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 z-[99999]" onClick={toggleSaveDialog} />
          <div
            className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] overflow-y-auto bg-card border border-border rounded-lg z-[99999] shadow-2xl dark:bg-card dark:border-border"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Save / Load Project</h2>
                <button onClick={toggleSaveDialog} className="p-2 hover:bg-accent rounded-md" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SaveLoadDialog onClose={toggleSaveDialog} />
            </div>
          </div>
        </Portal>
      )}

      {/* Import Modal */}
      {ui.isImportDialogOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 z-[99999]" onClick={toggleImportDialog} />
          <div
            className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-1/2 max-h-[80vh] overflow-y-auto bg-card border border-border rounded-lg z-[99999] shadow-2xl dark:bg-card dark:border-border"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Import Project</h2>
                  <p className="text-sm text-muted-foreground">Import from file, code, or template</p>
                </div>
                <button onClick={toggleImportDialog} className="p-2 hover:bg-accent rounded-md" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ImportDialog onClose={toggleImportDialog} />
            </div>
          </div>
        </Portal>
      )}

      {/* Template Library Modal */}
      {ui.isTemplateLibraryOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 z-[99999]" onClick={toggleTemplateLibrary} />
          <div
            className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-card border border-border rounded-lg z-[99999] shadow-2xl dark:bg-card dark:border-border"
            onClick={e => e.stopPropagation()}
          >
            <TemplateLibrary
              onApplyTemplate={(template: Template) => {
                applyTemplate(template.project);
              }}
              onClose={toggleTemplateLibrary}
            />
          </div>
        </Portal>
      )}

      {/* Validation Panel Modal */}
      {showValidation && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 z-[99999]" onClick={() => setShowValidation(false)} />
          <div
            className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] bg-card border border-border rounded-lg z-[99999] shadow-2xl dark:bg-card dark:border-border"
            onClick={e => e.stopPropagation()}
          >
            <ValidationPanel onClose={() => setShowValidation(false)} />
          </div>
        </Portal>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
