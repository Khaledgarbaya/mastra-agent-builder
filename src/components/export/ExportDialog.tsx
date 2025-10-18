import { useState, useEffect } from 'react';
import { FileDown, FolderDown, Copy, Check } from 'lucide-react';
import JSZip from 'jszip';
import { showToast } from '../ui';

interface ExportDialogProps {
  files: Array<{ path: string; content: string }>;
  projectName?: string;
  onClose?: () => void;
  onExportReady?: (exportHandler: () => void, isExporting: boolean, canExport: boolean) => void;
}

export function ExportDialog({ files, projectName = 'mastra-project', onClose, onExportReady }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<'zip' | 'folder' | 'clipboard'>('zip');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(files.map(f => f.path)));
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Notify parent component about export state
  useEffect(() => {
    if (onExportReady) {
      onExportReady(handleExport, isExporting, selectedFiles.size > 0);
    }
  }, [onExportReady, isExporting, selectedFiles.size]);

  const toggleFile = (path: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(path)) {
      newSelection.delete(path);
    } else {
      newSelection.add(path);
    }
    setSelectedFiles(newSelection);
  };

  const selectAll = () => {
    setSelectedFiles(new Set(files.map(f => f.path)));
  };

  const deselectAll = () => {
    setSelectedFiles(new Set());
  };

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Add selected files to zip
      files
        .filter(f => selectedFiles.has(f.path))
        .forEach(file => {
          zip.file(file.path, file.content);
        });

      // Generate zip file
      const blob = await zip.generateAsync({ type: 'blob' });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('success', `ZIP file downloaded successfully!`);
      onClose?.();
    } catch (error) {
      console.error('Error creating ZIP:', error);
      showToast('error', 'Failed to create ZIP file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportFolder = async () => {
    setIsExporting(true);
    try {
      // Check if File System Access API is supported
      if ('showDirectoryPicker' in window) {
        // @ts-ignore - File System Access API
        const dirHandle = await window.showDirectoryPicker();

        // Write selected files
        for (const file of files.filter(f => selectedFiles.has(f.path))) {
          const pathParts = file.path.split('/');
          let currentDir = dirHandle;

          // Create nested directories
          for (let i = 0; i < pathParts.length - 1; i++) {
            try {
              currentDir = await currentDir.getDirectoryHandle(pathParts[i], { create: true });
            } catch (e) {
              console.error('Error creating directory:', e);
            }
          }

          // Write file
          const fileHandle = await currentDir.getFileHandle(pathParts[pathParts.length - 1], { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(file.content);
          await writable.close();
        }

        showToast('success', `Successfully exported ${selectedFiles.size} files to the selected folder!`);
        onClose?.();
      } else {
        showToast(
          'error',
          'File System Access API is not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser.',
        );
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error saving to folder:', error);
        showToast('error', 'Failed to save files. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setIsExporting(true);
    try {
      const selectedContent = files
        .filter(f => selectedFiles.has(f.path))
        .map(f => {
          return `// ========================================\n// File: ${f.path}\n// ========================================\n\n${f.content}\n`;
        })
        .join('\n\n');

      await navigator.clipboard.writeText(selectedContent);
      setCopied(true);
      showToast('success', 'Code copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        onClose?.();
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast('error', 'Failed to copy to clipboard. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    if (selectedFiles.size === 0) {
      showToast('warning', 'Please select at least one file to export.');
      return;
    }

    switch (exportFormat) {
      case 'zip':
        handleExportZip();
        break;
      case 'folder':
        handleExportFolder();
        break;
      case 'clipboard':
        handleCopyToClipboard();
        break;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Export Format Selection */}
      <div>
        <h3 className="text-sm font-medium mb-3">Export Format</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setExportFormat('zip')}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              exportFormat === 'zip' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <FileDown className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium text-foreground">ZIP File</span>
            <span className="text-xs text-muted-foreground text-center">Download as .zip</span>
          </button>

          <button
            onClick={() => setExportFormat('folder')}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              exportFormat === 'folder' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <FolderDown className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium text-foreground">Folder</span>
            <span className="text-xs text-muted-foreground text-center">Save to directory</span>
          </button>

          <button
            onClick={() => setExportFormat('clipboard')}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              exportFormat === 'clipboard' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            {copied ? <Check className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5 text-foreground" />}
            <span className="text-xs font-medium text-foreground">Clipboard</span>
            <span className="text-xs text-muted-foreground text-center">Copy all files</span>
          </button>
        </div>
      </div>

      {/* File Selection */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Select Files</h3>
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-xs text-primary hover:underline">
              Select All
            </button>
            <span className="text-xs text-muted-foreground">|</span>
            <button onClick={deselectAll} className="text-xs text-primary hover:underline">
              Deselect All
            </button>
          </div>
        </div>

        <div className="border border-border rounded-lg h-64 overflow-y-auto">
          {files.map(file => (
            <label
              key={file.path}
              className="flex items-center gap-3 p-3 hover:bg-secondary/50 cursor-pointer border-b border-border last:border-b-0"
            >
              <input
                type="checkbox"
                checked={selectedFiles.has(file.path)}
                onChange={() => toggleFile(file.path)}
                className="rounded border-border"
              />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm truncate text-foreground">{file.path}</div>
                <div className="text-xs text-muted-foreground">{file.content.split('\n').length} lines</div>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          {selectedFiles.size} of {files.length} files selected
        </div>
      </div>
    </div>
  );
}
