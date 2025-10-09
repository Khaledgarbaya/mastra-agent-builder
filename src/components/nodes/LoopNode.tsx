import { Handle, Position, NodeProps } from '@xyflow/react';
import { Repeat, CheckCircle2, AlertCircle, Infinity } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LoopNode({ data, selected }: NodeProps) {
  const config = (data as any).config || {};

  // Determine configuration status
  const getStatus = () => {
    if (!config.type) return 'incomplete';
    if (!config.condition && config.type !== 'dowhile' && config.type !== 'dountil') return 'incomplete';
    return 'complete';
  };

  const status = getStatus();

  const statusConfig = {
    complete: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      tooltip: 'Fully configured',
    },
    incomplete: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      tooltip: 'Missing required fields',
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
          <Repeat className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Loop</div>
          <div className="font-semibold text-sm capitalize truncate">{config.type || 'while'}</div>
        </div>
        <div title={statusConfig[status].tooltip}>
          <StatusIcon className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
      </div>

      {/* Condition Preview */}
      {config.condition && (
        <div className="text-xs text-muted-foreground mb-2 p-2 bg-secondary/30 rounded font-mono line-clamp-2">
          {config.condition}
        </div>
      )}

      {/* Configuration Preview */}
      <div className="space-y-1.5 mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Max Iterations</span>
          <div className="flex items-center gap-1">
            {config.maxIterations ? (
              <span className="font-medium">{config.maxIterations}</span>
            ) : (
              <>
                <Infinity className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">Unlimited</span>
              </>
            )}
          </div>
        </div>

        {config.description && <div className="text-xs text-muted-foreground pt-2">{config.description}</div>}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
