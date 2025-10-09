import { X, Copy } from 'lucide-react';
import { useBuilderState } from '../../hooks';
import { AgentConfigPanel } from './AgentConfigPanel';
import { StepConfigPanel } from './StepConfigPanel';
import { ToolConfigPanel } from './ToolConfigPanel';
import { LoopConfigPanel } from './LoopConfigPanel';
import { ForEachConfigPanel } from './ForEachConfigPanel';
import { BranchConfigPanel } from './BranchConfigPanel';
import { SleepConfigPanel } from './SleepConfigPanel';
import { WaitForEventConfigPanel } from './WaitForEventConfigPanel';
import { MapConfigPanel } from './MapConfigPanel';

export function DynamicConfigPanel() {
  const { project, ui, setSelectedNode, duplicateNode } = useBuilderState();

  if (!ui.selectedNodeId) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 text-center">
        <div className="text-muted-foreground">
          <p className="text-sm">Select a node to configure its properties</p>
        </div>
      </div>
    );
  }

  const selectedNode = project?.nodes.find(n => n.id === ui.selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 text-center">
        <div className="text-muted-foreground">
          <p className="text-sm">Node not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-sm">Node Configuration</h3>
          <p className="text-xs text-muted-foreground capitalize">{selectedNode.type} Node</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => duplicateNode(selectedNode.id)}
            className="p-1 hover:bg-accent rounded-sm transition-colors"
            aria-label="Duplicate node"
            title="Duplicate node (Ctrl/Cmd+D)"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSelectedNode(undefined)}
            className="p-1 hover:bg-accent rounded-sm transition-colors"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedNode.type === 'agent' && <AgentConfigPanel nodeId={selectedNode.id} />}
        {selectedNode.type === 'step' && <StepConfigPanel nodeId={selectedNode.id} />}
        {selectedNode.type === 'tool' && <ToolConfigPanel nodeId={selectedNode.id} />}
        {selectedNode.type === 'loop' && <LoopConfigPanel nodeId={selectedNode.id} />}
        {selectedNode.type === 'foreach' && <ForEachConfigPanel nodeId={selectedNode.id} />}
        {(selectedNode.type === 'router' || selectedNode.type === 'conditional') && (
          <BranchConfigPanel nodeId={selectedNode.id} />
        )}
        {(selectedNode.type === 'sleep' || selectedNode.type === 'sleepuntil') && (
          <SleepConfigPanel nodeId={selectedNode.id} />
        )}
        {selectedNode.type === 'waitforevent' && <WaitForEventConfigPanel nodeId={selectedNode.id} />}
        {selectedNode.type === 'map' && <MapConfigPanel nodeId={selectedNode.id} />}
        {selectedNode.type === 'parallel' && (
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Parallel Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Connect multiple steps to this parallel node. All connected steps will execute simultaneously.
            </p>
            <div className="p-3 bg-secondary/50 rounded-md">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Parallel execution waits for all branches to complete before continuing.
              </p>
            </div>
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Mastra API</h4>
              <code className="block text-xs bg-secondary p-3 rounded-md font-mono">
                workflow.parallel([step1, step2, step3])
              </code>
            </div>
          </div>
        )}
        {![
          'agent',
          'step',
          'tool',
          'loop',
          'foreach',
          'parallel',
          'router',
          'conditional',
          'sleep',
          'sleepuntil',
          'waitforevent',
          'map',
        ].includes(selectedNode.type) && (
          <div className="p-4 text-sm text-muted-foreground">
            Configuration panel for {selectedNode.type} nodes not implemented.
          </div>
        )}
      </div>
    </div>
  );
}
