import { useState, useRef, useEffect } from 'react';
import {
  Undo,
  Redo,
  Save,
  Download,
  Upload,
  Code,
  Play,
  Settings,
  Edit2,
  Check,
  X,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useBuilderState } from '../../hooks';
import { KeyboardShortcutsHelp } from '../KeyboardShortcutsHelp';

export interface BuilderToolbarProps {
  onSave?: () => void;
  onTest?: () => void;
  onOpenProjectSettings?: () => void;
  onOpenCodePreview?: () => void;
  onOpenTemplates?: () => void;
  onOpenValidation?: () => void;
  className?: string;
}

/**
 * Toolbar component with common actions
 */
export function BuilderToolbar({
  onSave,
  onTest,
  onOpenProjectSettings,
  onOpenCodePreview,
  onOpenTemplates,
  onOpenValidation,
  className,
}: BuilderToolbarProps) {
  const {
    project,
    updateProject,
    isDirty,
    canUndo,
    canRedo,
    undo,
    redo,
    toggleExportDialog,
    toggleImportDialog,
    toggleSaveDialog,
  } = useBuilderState();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const getTitle = () => {
    return project?.settings?.projectName || project?.name || 'Mastra Visual Builder';
  };

  const handleStartEdit = () => {
    setEditedName(getTitle());
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (project && editedName.trim()) {
      updateProject({
        ...project,
        name: editedName.trim(),
        settings: {
          ...project.settings,
          projectName: editedName.trim(),
        },
      });
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  return (
    <div className={cn('flex items-center justify-between px-4 py-2', className)}>
      {/* Left section - Title */}
      <div className="flex items-center gap-4">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveName}
              className="px-2 py-1 text-lg font-semibold bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              style={{ width: `${Math.max(editedName.length * 10, 150)}px` }}
            />
            <button onClick={handleSaveName} className="p-1 hover:bg-accent rounded-md" title="Save (Enter)">
              <Check className="h-4 w-4 text-primary" />
            </button>
            <button onClick={handleCancelEdit} className="p-1 hover:bg-accent rounded-md" title="Cancel (Esc)">
              <X className="h-4 w-4 text-destructive" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartEdit}
            className="flex items-center gap-2 group hover:bg-accent px-2 py-1 rounded-md transition-colors"
            title="Click to edit project name"
          >
            <h1 className="text-lg font-semibold text-foreground">{getTitle()}</h1>
            <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          </button>
        )}
        {isDirty && <span className="text-xs text-muted-foreground">• Unsaved changes</span>}
      </div>

      {/* Center section - Actions */}
      <div className="flex items-center gap-1">
        {/* Undo/Redo */}
        <ToolbarButton onClick={undo} disabled={!canUndo} tooltip="Undo (Ctrl+Z)" icon={<Undo className="h-4 w-4" />} />
        <ToolbarButton onClick={redo} disabled={!canRedo} tooltip="Redo (Ctrl+Y)" icon={<Redo className="h-4 w-4" />} />

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Import/Export */}
        <ToolbarButton onClick={toggleImportDialog} tooltip="Import" icon={<Upload className="h-4 w-4" />} />
        <ToolbarButton onClick={toggleExportDialog} tooltip="Export" icon={<Download className="h-4 w-4" />} />

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Code Preview */}
        {onOpenCodePreview && (
          <ToolbarButton
            onClick={onOpenCodePreview}
            tooltip="View Generated Code"
            icon={<Code className="h-4 w-4" />}
          />
        )}

        {/* Test */}
        {onTest && <ToolbarButton onClick={onTest} tooltip="Test" icon={<Play className="h-4 w-4" />} />}

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Project Settings */}
        {onOpenProjectSettings && (
          <ToolbarButton
            onClick={onOpenProjectSettings}
            tooltip="Project Settings"
            icon={<Settings className="h-4 w-4" />}
          />
        )}

        {/* Templates */}
        {onOpenTemplates && (
          <ToolbarButton onClick={onOpenTemplates} tooltip="Template Library" icon={<Sparkles className="h-4 w-4" />} />
        )}

        {/* Validation */}
        {onOpenValidation && (
          <ToolbarButton
            onClick={onOpenValidation}
            tooltip="Validate Project"
            icon={<AlertCircle className="h-4 w-4" />}
          />
        )}

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp />
      </div>

      {/* Right section - Save */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave || toggleSaveDialog}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          disabled={!isDirty}
        >
          <div className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save
          </div>
        </button>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  icon: React.ReactNode;
}

function ToolbarButton({ onClick, disabled, tooltip, icon }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={cn(
        'p-2 rounded-md transition-colors',
        'text-muted-foreground',
        'hover:bg-accent hover:text-accent-foreground',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
      )}
    >
      {icon}
    </button>
  );
}
