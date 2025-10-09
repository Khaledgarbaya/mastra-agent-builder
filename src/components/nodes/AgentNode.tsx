import { Handle, Position, NodeProps } from '@xyflow/react';
import { Bot, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function AgentNode({ data, selected }: NodeProps) {
  const agent = (data as any).config;

  // Determine configuration status
  const getStatus = () => {
    if (!agent.name || !agent.id || !agent.instructions) {
      return 'incomplete';
    }
    if (!agent.model?.name) {
      return 'incomplete';
    }
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
    error: {
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      tooltip: 'Configuration error',
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
          <Bot className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Agent</div>
          <div className="font-semibold text-sm truncate">{agent.name || 'Unnamed Agent'}</div>
        </div>
        <div title={statusConfig[status].tooltip}>
          <StatusIcon className={cn('h-4 w-4', statusConfig[status].color)} />
        </div>
      </div>

      {/* ID Badge */}
      {agent.id && (
        <div className="mb-2 px-2 py-0.5 bg-secondary/50 rounded text-xs font-mono truncate">{agent.id}</div>
      )}

      {/* Description */}
      {agent.description && <div className="text-xs text-muted-foreground mb-2 line-clamp-2">{agent.description}</div>}

      {/* Configuration Preview */}
      <div className="space-y-1.5 mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Model</span>
          <span className="font-medium">{agent.model?.name || 'Not set'}</span>
        </div>

        {agent.tools && agent.tools.length > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Tools</span>
            <span className="font-medium">{agent.tools.length} attached</span>
          </div>
        )}

        {agent.workflows && agent.workflows.length > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Workflows</span>
            <span className="font-medium">{agent.workflows.length} attached</span>
          </div>
        )}

        {agent.memory && agent.memory.type !== 'none' && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Memory</span>
            <span className="font-medium capitalize">{agent.memory.type}</span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
