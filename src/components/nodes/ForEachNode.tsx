import { Handle, Position, NodeProps } from '@xyflow/react';
import { ListOrdered, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ForEachNode({ data, selected }: NodeProps) {
  const config = (data as any).config || {};

  // Simple status - ForEach is generally complete if it exists
  const status = 'complete';

  const statusConfig = {
    complete: {
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/10',
      tooltip: 'Configured',
    },
    incomplete: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      tooltip: 'Missing configuration',
    },
  };

  const StatusIcon = statusConfig[status].icon;
  const concurrency = config.concurrency || 1;
  const isParallel = concurrency > 1;

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
          <ListOrdered className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">For Each</div>
          <div className="font-semibold text-sm">Iterate Array</div>
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
          <span className="text-muted-foreground">Concurrency</span>
          <div className="flex items-center gap-1">
            {isParallel && <Zap className="h-3 w-3 text-yellow-500" />}
            <span className="font-medium">{concurrency === 1 ? 'Sequential' : `${concurrency} parallel`}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Mode</span>
          <span className="font-medium">{isParallel ? '⚡ Parallel' : '→ Sequential'}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
