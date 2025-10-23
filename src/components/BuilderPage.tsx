import { useEffect, useState, useRef } from 'react';
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
import { ApiKeysDialog, PreviewPanel } from './execute';
import { ToastContainer, useToasts, Portal, showToast } from './ui';
import { useBuilderState, useKeyboardShortcuts } from '../hooks';
import { autoSaveProject } from '../lib/storage';
import { WebContainerManager, FileSystemGenerator } from '../lib/web-container';
import type { ProjectConfig, ApiKeysConfig } from '../types';
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
    togglePreview,
    setPreviewStatus,
    addPreviewLog,
    clearPreviewLogs,
  } = useBuilderState();
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showApiKeysDialog, setShowApiKeysDialog] = useState(false);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const { toasts, removeToast } = useToasts();
  
  const webContainerManagerRef = useRef<WebContainerManager | null>(null);

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

  // Initialize WebContainer manager
  useEffect(() => {
    if (!webContainerManagerRef.current) {
      webContainerManagerRef.current = new WebContainerManager();
    }
  }, []);

  // Detect required API providers from agents
  const getRequiredProviders = (): string[] => {
    if (!project) return [];
    const providers = new Set<string>();
    
    project.nodes.forEach(node => {
      if (node.type === 'agent') {
        const config = (node.data as any).config;
        if (config?.model?.provider) {
          providers.add(config.model.provider);
        }
      }
    });
    
    return Array.from(providers);
  };

  // Handle preview button click
  const handlePreviewClick = () => {
    if (!project) {
      showToast('warning', 'Please create a project first');
      return;
    }
    
    // Show API keys dialog
    setShowApiKeysDialog(true);
  };

  // Start preview with API keys
  const handleStartPreview = async (apiKeys: ApiKeysConfig) => {
    setShowApiKeysDialog(false);
    
    if (!project) return;
    
    try {
      // Open preview panel
      togglePreview();
      clearPreviewLogs();
      
      const manager = webContainerManagerRef.current!;
      
      // Log callback
      const onLog = (message: string, level: 'info' | 'warning' | 'error') => {
        addPreviewLog(`[${level.toUpperCase()}] ${message}`);
      };
      
      // Status callback
      const onStatus = (status: 'booting' | 'installing' | 'starting' | 'running' | 'error') => {
        setPreviewStatus(status);
      };
      
      // Boot WebContainer
      setPreviewStatus('booting');
      await manager.boot(onLog);
      
      // Generate files
      onLog('Generating project files...', 'info');
      const fileGenerator = new FileSystemGenerator();
      const files = fileGenerator.generateWebContainerFiles(project, apiKeys);
      
      // Mount files
      await manager.mountProject(files, onLog);
      
      // Install dependencies
      setPreviewStatus('installing');
      await manager.installDependencies(onLog);
      
      // Start dev server
      setPreviewStatus('starting');
      const url = await manager.startDevServer(onLog, onStatus);
      setServerUrl(url);
      
      showToast('success', 'Preview started successfully!');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addPreviewLog(`[ERROR] ${errorMsg}`);
      setPreviewStatus('error');
      showToast('error', `Preview failed: ${errorMsg}`);
    }
  };

  // Stop preview
  const handleStopPreview = async () => {
    try {
      const manager = webContainerManagerRef.current;
      if (manager) {
        await manager.stopDevServer((msg) => addPreviewLog(`[INFO] ${msg}`));
        setPreviewStatus('idle');
        setServerUrl(null);
        showToast('info', 'Preview stopped');
      }
    } catch (error) {
      console.error('Failed to stop preview:', error);
    }
  };

  // Restart preview
  const handleRestartPreview = async () => {
    await handleStopPreview();
    setShowApiKeysDialog(true);
  };

  // Close preview
  const handleClosePreview = async () => {
    await handleStopPreview();
    togglePreview();
  };

  return (
    <>
      <BuilderLayout
        toolbar={
          <BuilderToolbar
            onPreview={handlePreviewClick}
            previewStatus={ui.previewStatus}
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

      {/* API Keys Dialog */}
      {showApiKeysDialog && (
        <ApiKeysDialog
          requiredProviders={getRequiredProviders()}
          onSubmit={handleStartPreview}
          onCancel={() => setShowApiKeysDialog(false)}
        />
      )}

      {/* Preview Panel */}
      {ui.isPreviewOpen && (
        <PreviewPanel
          status={ui.previewStatus}
          logs={ui.previewLogs}
          serverUrl={serverUrl}
          onClose={handleClosePreview}
          onRestart={handleRestartPreview}
          onStop={handleStopPreview}
          onClearLogs={clearPreviewLogs}
        />
      )}

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
            <CodePreview />
          </div>
        </>
      )}

      {/* Save/Load Modal - Centered */}
      {isSaveDialogOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 z-[99999]" onClick={toggleSaveDialog} />
          <div
            className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] overflow-y-auto bg-card border border-border rounded-lg z-[99999] shadow-2xl"
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
            className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-1/2 max-h-[80vh] overflow-y-auto bg-card border border-border rounded-lg z-[99999] shadow-2xl"
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
            className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-card border border-border rounded-lg z-[99999] shadow-2xl"
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
            className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] bg-card border border-border rounded-lg z-[99999] shadow-2xl"
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
