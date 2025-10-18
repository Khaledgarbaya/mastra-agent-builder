import { useState, useRef } from 'react';
import { Save, FolderOpen, Upload, Download, AlertTriangle } from 'lucide-react';
import { useBuilderState } from '../../hooks';
import {
  saveProjectToLocalStorage,
  saveProjectToFile,
  loadProjectFromFile,
  clearSavedProject,
  hasSavedProject,
} from '../../lib/storage';
import { showToast } from '../ui';

interface SaveLoadDialogProps {
  onClose?: () => void;
}

export function SaveLoadDialog({ onClose }: SaveLoadDialogProps) {
  const { project, setProject, markClean } = useBuilderState();
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveToLocalStorage = () => {
    if (!project) return;

    try {
      saveProjectToLocalStorage(project);
      markClean();
      showToast('success', 'Project saved successfully to browser storage!');
      onClose?.();
    } catch (error) {
      showToast('error', 'Failed to save project. Please try again.');
    }
  };

  const handleSaveToFile = () => {
    if (!project) return;

    try {
      saveProjectToFile(project);
      markClean();
      showToast('success', 'Project downloaded successfully!');
      onClose?.();
    } catch (error) {
      showToast('error', 'Failed to download project. Please try again.');
    }
  };

  const handleLoadFromFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const loadedProject = await loadProjectFromFile(file);
      setProject(loadedProject, true); // Mark as clean after loading
      showToast('success', 'Project loaded successfully!');
      onClose?.();
    } catch (error) {
      showToast('error', 'Failed to load project. Please ensure the file is a valid Mastra project file.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearStorage = () => {
    clearSavedProject();
    setShowConfirm(false);
    showToast('success', 'Browser storage cleared successfully!');
  };

  const hasSaved = hasSavedProject();

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('save')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'save' ? 'border-primary text-primary' : 'border-transparent hover:text-foreground'
          }`}
        >
          Save Project
        </button>
        <button
          onClick={() => setActiveTab('load')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'load' ? 'border-primary text-primary' : 'border-transparent hover:text-foreground'
          }`}
        >
          Load Project
        </button>
      </div>

      {/* Save Tab */}
      {activeTab === 'save' && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Save your project to continue working on it later. You can save to your browser's storage or download as a
            file.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSaveToLocalStorage}
              className="flex flex-col items-center gap-3 p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Save className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Browser Storage</div>
                <div className="text-xs text-muted-foreground mt-1">Quick save to this browser</div>
              </div>
            </button>

            <button
              onClick={handleSaveToFile}
              className="flex flex-col items-center gap-3 p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Download className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Download File</div>
                <div className="text-xs text-muted-foreground mt-1">Save as .mastra.json file</div>
              </div>
            </button>
          </div>

          {hasSaved && (
            <div className="mt-6 p-4 border border-border rounded-lg bg-secondary/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Saved project found</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    A project is already saved in browser storage. Saving will overwrite it.
                  </div>
                  {!showConfirm ? (
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="mt-2 text-xs text-destructive hover:underline"
                    >
                      Clear saved project
                    </button>
                  ) : (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={handleClearStorage}
                        className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                      >
                        Confirm Clear
                      </button>
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="text-xs px-2 py-1 border border-border rounded hover:bg-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Load Tab */}
      {activeTab === 'load' && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Load a previously saved project. You can load from a file or from browser storage.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Upload className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Upload File</div>
                <div className="text-xs text-muted-foreground mt-1">Load from .mastra.json file</div>
              </div>
            </button>

            <button
              onClick={() => {
                const saved = localStorage.getItem('mastra-visual-builder-project');
                if (saved) {
                  const project = JSON.parse(saved);
                  setProject(project, true); // Mark as clean after loading
                  showToast('success', 'Project loaded from browser storage!');
                  onClose?.();
                } else {
                  showToast('warning', 'No saved project found in browser storage.');
                }
              }}
              disabled={!hasSaved}
              className="flex flex-col items-center gap-3 p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FolderOpen className="h-8 w-8 text-primary" />
              <div className="text-center">
                <div className="font-medium">Browser Storage</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {hasSaved ? 'Load saved project' : 'No saved project'}
                </div>
              </div>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.mastra.json"
            onChange={handleLoadFromFile}
            className="hidden"
          />

          {hasSaved && (
            <div className="mt-6 p-3 border border-primary/20 rounded-lg bg-primary/5">
              <div className="flex items-center gap-2 text-sm text-primary">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Saved project available in browser storage
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
