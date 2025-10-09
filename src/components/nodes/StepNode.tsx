import { Handle, Position, NodeProps } from '@xyflow/react';
import { Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StepNode({ data, selected }: NodeProps) {
  const step = (data as any).config;

  // Determine configuration status
  const getStatus = () => {
    if (!step.id || !step.description) return 'incomplete';
    if (!step.execute) return 'incomplete';
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
          <Settings className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Step</div>
          <div className="font-semibold text-sm truncate">{step.id || 'Unnamed Step'}</div>
        </div>
        <div title={statusConfig[status].tooltip}>
          <StatusIcon className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
      </div>

      {/* Description */}
      {step.description && <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{step.description}</div>}

      {/* Configuration Preview */}
      <div className="space-y-1.5 mt-3 pt-3 border-t border-border">
        {/* Schema Info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Input Fields</span>
          <span className="font-medium">{step.inputSchema?.length || 0}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Output Fields</span>
          <span className="font-medium">{step.outputSchema?.length || 0}</span>
        </div>

        {step.execute && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Execute</span>
            <span className="font-medium text-green-600">✓ Configured</span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
