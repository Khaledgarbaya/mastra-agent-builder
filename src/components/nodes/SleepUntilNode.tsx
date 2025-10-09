import { Handle, Position, NodeProps } from '@xyflow/react';
import { Calendar, CheckCircle2, AlertCircle, CalendarClock } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SleepUntilNode({ data, selected }: NodeProps) {
  const config = (data as any).config || {};

  // Determine configuration status
  const getStatus = () => {
    if (!config.date) return 'incomplete';
    return 'complete';
  };

  const status = getStatus();

  const statusConfig = {
    complete: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      tooltip: 'Date configured',
    },
    incomplete: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      tooltip: 'Date not set',
    },
  };

  const StatusIcon = statusConfig[status].icon;

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
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
          <Calendar className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Sleep Until</div>
          <div className="font-semibold text-sm">Pause Until Date</div>
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
          <span className="text-muted-foreground">Target Date</span>
          <div className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3 text-sky-500" />
          </div>
        </div>

        {config.date ? (
          <div className="text-xs font-mono p-2 bg-secondary/30 rounded truncate">{formatDate(config.date)}</div>
        ) : (
          <div className="text-xs text-muted-foreground text-center">No date set</div>
        )}

        <div className="flex items-center gap-2 text-xs">
          <div className="px-2 py-1 rounded-md bg-sky-500/10 text-sky-600 w-full text-center">📅 Waits until date</div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
