import { useState, useRef } from 'react';
import { Upload, FileText, Github, Sparkles, AlertCircle } from 'lucide-react';
import { useBuilderState } from '../../hooks';
import { loadProjectFromFile } from '../../lib/storage';
import { showToast } from '../ui';
import type { ProjectConfig } from '../../types';

interface ImportDialogProps {
  onClose?: () => void;
}

type ImportMethod = 'file' | 'paste' | 'github' | 'template';

export function ImportDialog({ onClose }: ImportDialogProps) {
  const { setProject } = useBuilderState();
  const [importMethod, setImportMethod] = useState<ImportMethod>('file');
  const [pastedCode, setPastedCode] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);

    try {
      // Check file extension
      if (file.name.endsWith('.mastra.json') || file.name.endsWith('.json')) {
        // Load Mastra project file
        const project = await loadProjectFromFile(file);
        setProject(project, true); // Mark as clean after importing
        showToast('success', 'Project imported successfully!');
        onClose?.();
      } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        // TypeScript file - future implementation
        setError(
          'TypeScript file import is coming soon! For now, please export your project as .mastra.json and import that file.',
        );
      } else {
        setError('Unsupported file type. Please upload a .mastra.json or .ts file.');
      }
    } catch (err: any) {
      setError(err.message || "Failed to import file. Please ensure it's a valid Mastra project file.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePasteImport = () => {
    if (!pastedCode.trim()) {
      setError('Please paste some code first.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Try to parse as JSON (Mastra project)
      const project = JSON.parse(pastedCode) as ProjectConfig;

      // Validate it's a Mastra project
      if (project.nodes && project.edges) {
        setProject(project, true); // Mark as clean after importing
        showToast('success', 'Project imported successfully!');
        onClose?.();
      } else {
        setError('Invalid project format. Please paste a valid Mastra project JSON.');
      }
    } catch (err) {
      // Not JSON, might be TypeScript code
      setError('TypeScript code import is coming soon! For now, please paste Mastra project JSON.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubImport = () => {
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub URL.');
      return;
    }

    setError('GitHub import is coming soon! For now, please download the file from GitHub and import it directly.');
  };

  return (
    <div className="space-y-6">
      {/* Import Method Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => {
            setImportMethod('file');
            setError(null);
          }}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            importMethod === 'file' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <Upload className="h-4 w-4 inline mr-1.5" />
          Upload File
        </button>
        <button
          onClick={() => {
            setImportMethod('paste');
            setError(null);
          }}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            importMethod === 'paste' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-1.5" />
          Paste Code
        </button>
        <button
          onClick={() => {
            setImportMethod('github');
            setError(null);
          }}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            importMethod === 'github' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <Github className="h-4 w-4 inline mr-1.5" />
          From GitHub
        </button>
        <button
          onClick={() => {
            setImportMethod('template');
            setError(null);
          }}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            importMethod === 'template' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <Sparkles className="h-4 w-4 inline mr-1.5" />
          Templates
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm text-destructive">{error}</div>
        </div>
      )}

      {/* File Upload */}
      {importMethod === 'file' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a Mastra project file (.mastra.json) or TypeScript file (.ts)
          </p>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Click to upload file</p>
            <p className="text-xs text-muted-foreground">Supports .mastra.json and .ts files</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.mastra.json,.ts,.tsx"
            onChange={handleFileUpload}
            className="hidden"
          />

          {isLoading && <div className="text-center text-sm text-muted-foreground">Loading project...</div>}
        </div>
      )}

      {/* Paste Code */}
      {importMethod === 'paste' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Paste Mastra project JSON or TypeScript code</p>

          <textarea
            value={pastedCode}
            onChange={e => setPastedCode(e.target.value)}
            placeholder="Paste your code here... (JSON or TypeScript)"
            rows={12}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-none text-foreground placeholder:text-muted-foreground"
          />

          <button
            onClick={handlePasteImport}
            disabled={isLoading || !pastedCode.trim()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Importing...' : 'Import Code'}
          </button>
        </div>
      )}

      {/* GitHub Import */}
      {importMethod === 'github' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Import from a GitHub repository or file URL</p>

          <input
            type="url"
            value={githubUrl}
            onChange={e => setGithubUrl(e.target.value)}
            placeholder="https://github.com/user/repo/blob/main/mastra.ts"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />

          <button
            onClick={handleGithubImport}
            disabled={isLoading || !githubUrl.trim()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Importing...' : 'Import from GitHub'}
          </button>

          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary">
              💡 <strong>Coming Soon:</strong> Direct GitHub import will fetch and parse files automatically.
            </p>
          </div>
        </div>
      )}

      {/* Templates */}
      {importMethod === 'template' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Start with a pre-built template</p>

          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left bg-card">
              <div className="font-medium text-sm mb-1 text-foreground">Customer Service</div>
              <div className="text-xs text-muted-foreground">AI customer support agent</div>
            </button>

            <button className="p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left bg-card">
              <div className="font-medium text-sm mb-1 text-foreground">Data Processing</div>
              <div className="text-xs text-muted-foreground">ETL workflow template</div>
            </button>

            <button className="p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left bg-card">
              <div className="font-medium text-sm mb-1 text-foreground">Content Writer</div>
              <div className="text-xs text-muted-foreground">Content generation agent</div>
            </button>

            <button className="p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left bg-card">
              <div className="font-medium text-sm mb-1 text-foreground">API Integration</div>
              <div className="text-xs text-muted-foreground">API tools & workflows</div>
            </button>
          </div>

          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary">
              💡 <strong>Coming Soon:</strong> Click a template to add it to your canvas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
