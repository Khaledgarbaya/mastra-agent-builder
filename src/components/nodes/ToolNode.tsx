import { Handle, Position, NodeProps } from '@xyflow/react';
import { Wrench, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ToolNode({ data, selected }: NodeProps) {
  const tool = (data as any).config;

  // Determine configuration status
  const getStatus = () => {
    if (!tool.id || !tool.description) return 'incomplete';
    if (!tool.inputSchema || !tool.outputSchema) return 'incomplete';
    if (!tool.execute) return 'incomplete';
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
          <Wrench className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Tool</div>
          <div className="font-semibold text-sm truncate">{tool.id || 'Unnamed Tool'}</div>
        </div>
        <div title={statusConfig[status].tooltip}>
          <StatusIcon className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
      </div>

      {/* Description */}
      {tool.description && <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{tool.description}</div>}

      {/* Configuration Preview */}
      <div className="space-y-1.5 mt-3 pt-3 border-t border-border">
        {/* Approval Status */}
        {tool.requireApproval && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10">
            <AlertCircle className="h-3 w-3 text-yellow-600" />
            <span className="text-xs text-yellow-600">Requires approval</span>
          </div>
        )}

        {/* Schema Info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Input Fields</span>
          <span className="font-medium">{tool.inputSchema?.length || 0}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Output Fields</span>
          <span className="font-medium">{tool.outputSchema?.length || 0}</span>
        </div>

        {tool.execute && (
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
