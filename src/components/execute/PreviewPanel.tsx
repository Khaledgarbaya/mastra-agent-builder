import { useState } from 'react';
import { X, RefreshCw, Square, Loader2, Terminal, Globe } from 'lucide-react';
import type { PreviewStatus } from '../../types';
import { LogViewer } from './LogViewer';

interface PreviewPanelProps {
  status: PreviewStatus;
  logs: string[];
  serverUrl: string | null;
  onClose: () => void;
  onRestart: () => void;
  onStop: () => void;
  onClearLogs: () => void;
}

/**
 * Preview panel with iframe for Mastra playground and tabs for logs
 */
export function PreviewPanel({
  status,
  logs,
  serverUrl,
  onClose,
  onRestart,
  onStop,
  onClearLogs,
}: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'playground' | 'logs'>('playground');

  const getStatusInfo = () => {
    switch (status) {
      case 'booting':
        return { label: 'Booting WebContainer...', color: 'text-blue-400', showSpinner: true };
      case 'installing':
        return { label: 'Installing dependencies...', color: 'text-blue-400', showSpinner: true };
      case 'starting':
        return { label: 'Starting dev server...', color: 'text-blue-400', showSpinner: true };
      case 'running':
        return { label: 'Running', color: 'text-green-400', showSpinner: false };
      case 'error':
        return { label: 'Error', color: 'text-red-400', showSpinner: false };
      default:
        return { label: 'Idle', color: 'text-muted-foreground', showSpinner: false };
    }
  };

  const statusInfo = getStatusInfo();
  const isLoading = ['booting', 'installing', 'starting'].includes(status);
  const canShowPlayground = status === 'running' && serverUrl;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="bg-background border border-border rounded-lg shadow-xl w-[95vw] h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Mastra Preview</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className={statusInfo.color}>{statusInfo.label}</span>
                {statusInfo.showSpinner && <Loader2 className="h-3 w-3 animate-spin" />}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRestart}
              disabled={isLoading}
              className="p-2 hover:bg-accent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Restart preview"
            >
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={onStop}
              disabled={status === 'idle' || isLoading}
              className="p-2 hover:bg-accent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Stop preview"
            >
              <Square className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Close preview"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'playground'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Playground
            </div>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'logs'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Logs
              {logs.length > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                  {logs.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'playground' ? (
            <div className="w-full h-full">
              {canShowPlayground ? (
                <iframe
                  src={serverUrl}
                  className="w-full h-full border-0"
                  title="Mastra Playground"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-secondary/20">
                  <div className="text-center space-y-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                        <p className="text-muted-foreground">{statusInfo.label}</p>
                        <p className="text-sm text-muted-foreground">
                          This may take a few minutes...
                        </p>
                      </>
                    ) : status === 'error' ? (
                      <>
                        <div className="p-3 bg-destructive/10 rounded-full inline-block">
                          <X className="h-8 w-8 text-destructive" />
                        </div>
                        <p className="text-foreground font-medium">Preview failed to start</p>
                        <p className="text-sm text-muted-foreground">
                          Check the logs tab for more details
                        </p>
                      </>
                    ) : (
                      <>
                        <Globe className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">
                          Playground will appear here when the server is ready
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <LogViewer logs={logs} onClear={onClearLogs} />
          )}
        </div>
      </div>
    </div>
  );
}

