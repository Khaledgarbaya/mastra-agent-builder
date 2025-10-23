import { useEffect, useRef, useState } from 'react';
import { Copy, Trash2, Check } from 'lucide-react';
import { showToast } from '../ui';

interface LogViewerProps {
  logs: string[];
  onClear?: () => void;
}

/**
 * Simple log viewer with color-coded messages and auto-scroll
 */
export function LogViewer({ logs, onClear }: LogViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Detect manual scroll to disable auto-scroll
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  };

  const handleCopyLogs = async () => {
    try {
      await navigator.clipboard.writeText(logs.join('\n'));
      setCopied(true);
      showToast('success', 'Logs copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast('error', 'Failed to copy logs');
    }
  };

  const getLogLevel = (message: string): 'error' | 'warning' | 'info' => {
    const lowerMessage = message.toLowerCase();
    if (
      lowerMessage.includes('error') ||
      lowerMessage.includes('failed') ||
      lowerMessage.includes('fatal')
    ) {
      return 'error';
    }
    if (lowerMessage.includes('warn') || lowerMessage.includes('warning')) {
      return 'warning';
    }
    return 'info';
  };

  const getLogColor = (level: 'error' | 'warning' | 'info'): string => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {logs.length} {logs.length === 1 ? 'line' : 'lines'}
          </span>
          {!autoScroll && (
            <span className="text-xs text-yellow-500">• Scroll paused</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLogs}
            disabled={logs.length === 0}
            className="p-1.5 hover:bg-accent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copy logs"
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={onClear}
            disabled={logs.length === 0}
            className="p-1.5 hover:bg-accent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear logs"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Logs container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-black/50 p-3 font-mono text-xs"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No logs yet. Logs will appear here when the preview starts.</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {logs.map((log, index) => {
              const level = getLogLevel(log);
              const color = getLogColor(level);
              return (
                <div key={index} className={`${color} whitespace-pre-wrap break-words`}>
                  {log}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

