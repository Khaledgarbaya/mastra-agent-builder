import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitMerge, CheckCircle2, AlertCircle, Route } from 'lucide-react';
import { cn } from '../../lib/utils';

export function RouterNode({ data, selected }: NodeProps) {
  const config = (data as any).config || {};
  const routes = config.routes || [];

  // Determine configuration status
  const getStatus = () => {
    if (routes.length === 0) return 'incomplete';
    // Check if all routes have conditions
    const hasConditions = routes.every((r: any) => r.condition);
    if (!hasConditions) return 'incomplete';
    return 'complete';
  };

  const status = getStatus();

  const statusConfig = {
    complete: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      tooltip: 'All routes configured',
    },
    incomplete: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      tooltip: 'Missing route conditions',
    },
  };

  const StatusIcon = statusConfig[status].icon;
  const routeCount = routes.length || 2;

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 bg-card min-w-[220px] shadow-lg transition-all hover:shadow-xl',
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
        'relative',
      )}
      style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)' }}
    >
      <div style={{ clipPath: 'none' }}>
        <Handle type="target" position={Position.Top} className="w-3 h-3" />

        {/* Header with status */}
        <div className="flex items-center gap-2 mb-2">
          <div className={cn('p-2 rounded-md', statusConfig[status].bg)}>
            <GitMerge className={cn('h-4 w-4', statusConfig[status].color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Router</div>
            <div className="font-semibold text-sm truncate">Conditional Branch</div>
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
            <span className="text-muted-foreground">Routes</span>
            <div className="flex items-center gap-1">
              <Route className="h-3 w-3 text-pink-500" />
              <span className="font-medium">{routeCount} paths</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="px-2 py-1 rounded-md bg-pink-500/10 text-pink-600 w-full text-center">
              🔀 Conditional routing
            </div>
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" id="default" />
        <Handle type="source" position={Position.Right} className="w-3 h-3" id="route-1" style={{ top: '40%' }} />
        <Handle type="source" position={Position.Left} className="w-3 h-3" id="route-2" style={{ top: '40%' }} />
      </div>
    </div>
  );
}
