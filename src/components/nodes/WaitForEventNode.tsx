import { Handle, Position, NodeProps } from '@xyflow/react';
import { Radio, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export function WaitForEventNode({ data, selected }: NodeProps) {
  const config = (data as any).config || {};

  // Determine configuration status
  const getStatus = () => {
    if (!config.event) return 'incomplete';
    return 'complete';
  };

  const status = getStatus();

  const statusConfig = {
    complete: {
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/10',
      tooltip: 'Event configured',
    },
    incomplete: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      tooltip: 'Event name not set',
    },
  };

  const StatusIcon = statusConfig[status].icon;

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
          <Radio className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Wait For Event</div>
          <div className="font-semibold text-sm truncate">{config.event || 'Not configured'}</div>
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
        {config.timeout && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Timeout</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-violet-500" />
              <span className="font-medium">{config.timeout}ms</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs">
          <div className="px-2 py-1 rounded-md bg-violet-500/10 text-violet-600 w-full text-center">
            📡 Waits for event
          </div>
        </div>

        {config.stepToExecute && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">On Event</span>
            <span className="font-medium truncate">{config.stepToExecute}</span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
