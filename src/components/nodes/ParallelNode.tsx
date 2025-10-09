import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ParallelNode({ data, selected }: NodeProps) {
  const config = (data as any).config || {};

  // Parallel nodes are always complete when placed
  const status = 'complete';

  const statusConfig = {
    complete: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      tooltip: 'Configured',
    },
  };

  const StatusIcon = statusConfig[status].icon;

  // Count branches (2 default handles)
  const branchCount = 2;

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
          <GitBranch className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Parallel</div>
          <div className="font-semibold text-sm">Run in Parallel</div>
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
          <span className="text-muted-foreground">Branches</span>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span className="font-medium">{branchCount} parallel</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-600 w-full text-center">
            ⚡ Executes simultaneously
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" id="a" style={{ left: '33%' }} />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" id="b" style={{ left: '66%' }} />
    </div>
  );
}
