import { useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ReactFlowProvider,
  BackgroundVariant,
  OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useBuilderState } from '../../hooks';
import type { CanvasNode } from '../../types';

// Import custom node components
import { AgentNode } from '../nodes/AgentNode';
import { StepNode } from '../nodes/StepNode';
import { ToolNode } from '../nodes/ToolNode';
import { LoopNode } from '../nodes/LoopNode';
import { ParallelNode } from '../nodes/ParallelNode';
import { RouterNode } from '../nodes/RouterNode';
import { ForEachNode } from '../nodes/ForEachNode';
import { SleepNode } from '../nodes/SleepNode';
import { SleepUntilNode } from '../nodes/SleepUntilNode';
import { WaitForEventNode } from '../nodes/WaitForEventNode';
import { MapNode } from '../nodes/MapNode';

const nodeTypes = {
  agent: AgentNode,
  step: StepNode,
  tool: ToolNode,
  loop: LoopNode,
  parallel: ParallelNode,
  router: RouterNode,
  conditional: RouterNode, // Use router for conditional
  foreach: ForEachNode,
  sleep: SleepNode,
  sleepuntil: SleepUntilNode,
  waitforevent: WaitForEventNode,
  map: MapNode,
};

export function UnifiedCanvas() {
  const { project, addNode, addEdge: addProjectEdge, setSelectedNode } = useBuilderState();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Initialize nodes and edges from project state
  const initialNodes = project?.nodes || [];
  const initialEdges = project?.edges || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data as any,
    })),
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      label: e.label,
    })),
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        id: `edge-${Date.now()}`,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
      };

      setEdges(eds => addEdge(params, eds));
      addProjectEdge(newEdge);
    },
    [setEdges, addProjectEdge],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: CanvasNode = {
        id: `${type}-${Date.now()}`,
        type: type as any,
        position,
        data: {
          type,
          config: getDefaultConfigForType(type),
        } as any,
      };

      setNodes(nds =>
        nds.concat({
          id: newNode.id,
          type: newNode.type,
          position: newNode.position,
          data: newNode.data as any,
        }),
      );

      addNode(newNode);
    },
    [setNodes, addNode],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode],
  );

  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      // Double-click to focus on configuration
      setSelectedNode(node.id);
    },
    [setSelectedNode],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(undefined);
  }, [setSelectedNode]);

  // Sync ReactFlow nodes with project state
  useEffect(() => {
    if (project?.nodes) {
      setNodes(
        project.nodes.map(n => ({
          id: n.id,
          type: n.type,
          position: n.position,
          data: n.data as any,
        })),
      );
    }
  }, [project?.nodes, setNodes]);

  // Sync ReactFlow edges with project state
  useEffect(() => {
    if (project?.edges) {
      setEdges(
        project.edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle,
          targetHandle: e.targetHandle,
          label: e.label,
        })),
      );
    }
  }, [project?.edges, setEdges]);

  // Handle Escape key to deselect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedNode(undefined);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedNode]);

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

// Helper function to get default config for each node type
function getDefaultConfigForType(type: string) {
  switch (type) {
    case 'agent':
      return {
        id: '',
        name: 'New Agent',
        description: '',
        instructions: '',
        model: { provider: 'openai', name: 'gpt-4' },
        tools: [],
        workflows: [],
        agents: [],
      };
    case 'step':
      return {
        id: '',
        description: 'New Step',
        executeCode: '// Add your code here',
      };
    case 'tool':
      return {
        id: '',
        description: 'New Tool',
        executeCode: '// Add your tool logic here',
        requireApproval: false,
      };
    case 'loop':
      return {
        type: 'while',
        condition: 'count < 10',
        maxIterations: 100,
      };
    case 'parallel':
      return {
        description: 'Parallel execution',
      };
    case 'router':
    case 'conditional':
      return {
        description: 'Conditional router',
        routes: [],
      };
    case 'foreach':
      return {
        description: 'For each iteration',
        concurrency: 1,
      };
    case 'sleep':
      return {
        description: 'Sleep/pause',
        duration: 1000,
      };
    case 'sleepuntil':
      return {
        description: 'Sleep until',
        date: new Date(Date.now() + 60000).toISOString(),
      };
    case 'waitforevent':
      return {
        description: 'Wait for event',
        event: 'event-name',
        timeout: 30000,
      };
    case 'map':
      return {
        description: 'Map data',
        fields: {},
      };
    default:
      return {};
  }
}

// Wrapper component with ReactFlowProvider
export function UnifiedCanvasWrapper() {
  return (
    <ReactFlowProvider>
      <UnifiedCanvas />
    </ReactFlowProvider>
  );
}
