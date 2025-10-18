import { Handle, Position, NodeProps } from '@xyflow/react';
import { Clock, CheckCircle2, AlertCircle, Timer } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SleepNode({ data, selected }: NodeProps) {
  const config = (data as any).config || {};

  // Determine configuration status
  const getStatus = () => {
    if (!config.duration) return 'incomplete';
    return 'complete';
  };

  const status = getStatus();

  const statusConfig = {
    complete: {
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/10',
      tooltip: 'Duration configured',
    },
    incomplete: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      tooltip: 'Duration not set',
    },
  };

  const StatusIcon = statusConfig[status].icon;

  // Format duration for display
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 bg-card min-w-[220px] shadow-lg transition-all hover:shadow-xl',
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      {/* Header with status */}
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('p-2 rounded-md', statusConfig[status].bg)}>
          <Clock className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Sleep</div>
          <div className="font-semibold text-sm">Pause Execution</div>
        </div>
        <div title={statusConfig[status].tooltip}>
          <StatusIcon className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
      </div>

      {config.description && (
        <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{config.description}</div>
      )}

      {/* Configuration Preview */}
      <div className="space-y-1.5 mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Duration</span>
          <div className="flex items-center gap-1">
            <Timer className="h-3 w-3 text-cyan-500" />
            <span className="font-medium">{config.duration ? formatDuration(config.duration) : 'Not set'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-600 w-full text-center">⏸️ Pauses workflow</div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
