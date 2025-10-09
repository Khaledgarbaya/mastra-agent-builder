# Visual Builder Architecture

## Overview

The Mastra Visual Builder is a React-based visual interface for creating AI agents, workflows, and tools. It uses a node-based canvas powered by ReactFlow and generates production-ready TypeScript code.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         BuilderPage                              │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │   Toolbar  │  │    Canvas    │  │   Config Panel         │ │
│  │            │  │              │  │                         │ │
│  │  - Save    │  │  - ReactFlow │  │  - Dynamic based on    │ │
│  │  - Export  │  │  - Nodes     │  │    selected node       │ │
│  │  - Import  │  │  - Edges     │  │  - Schema builders     │ │
│  │  - Validate│  │  - Minimap   │  │  - Code editors        │ │
│  └────────────┘  └──────────────┘  └─────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Zustand Store                            │ │
│  │  - Project state (nodes, edges, settings)                  │ │
│  │  - History (undo/redo)                                     │ │
│  │  - UI state                                                │ │
│  │  - Validation state                                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────────┐   │
│  │  Templates    │  │  Code Gen      │  │  Validation      │   │
│  │  - Agents     │  │  - Agents      │  │  - Nodes         │   │
│  │  - Workflows  │  │  - Steps       │  │  - Graphs        │   │
│  │  - Tools      │  │  - Tools       │  │  - Schemas       │   │
│  └───────────────┘  └────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Core Technologies

- **React 19** - UI framework
- **ReactFlow (@xyflow/react)** - Node-based canvas
- **Zustand** - State management
- **Zod** - Schema validation
- **Vite** - Build tool
- **Vitest** - Testing framework
- **TypeScript** - Type safety

## Directory Structure

```
src/
├── components/           # React components
│   ├── builder/         # Builder-specific components
│   │   └── BuilderToolbar.tsx
│   ├── canvas/          # Canvas components
│   │   ├── UnifiedCanvas.tsx
│   │   └── nodes/       # Node implementations
│   ├── panels/          # Configuration panels
│   │   ├── DynamicConfigPanel.tsx
│   │   ├── AgentConfigPanel.tsx
│   │   ├── StepConfigPanel.tsx
│   │   └── ToolConfigPanel.tsx
│   ├── palette/         # Node palette
│   │   └── NodePalette.tsx
│   ├── code-preview/    # Code preview
│   ├── export/          # Export functionality
│   ├── import/          # Import functionality
│   ├── save-load/       # Save/load functionality
│   ├── templates/       # Template library
│   ├── validation/      # Validation panel
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
│   ├── useBuilderState.ts
│   ├── useKeyboardShortcuts.ts
│   └── useHistoryState.ts
├── lib/                 # Core logic
│   ├── code-generation/ # Code generators
│   │   ├── AgentCodeGenerator.ts
│   │   ├── StepCodeGenerator.ts
│   │   ├── ToolCodeGenerator.ts
│   │   ├── WorkflowCodeGenerator.ts
│   │   └── MastraInstanceGenerator.ts
│   ├── validators/      # Validation logic
│   │   ├── nodeValidators.ts
│   │   └── graphValidators.ts
│   ├── templates/       # Template definitions
│   │   ├── agentTemplates.ts
│   │   └── workflowTemplates.ts
│   └── storage/         # Local storage utilities
├── store/               # Zustand stores
│   └── builderStore.ts
├── types/               # TypeScript types
│   ├── builder.ts
│   ├── agent.ts
│   ├── workflow.ts
│   └── tool.ts
└── test/                # Test utilities
    ├── setup.ts
    └── testUtils.tsx
```

## State Management

### Zustand Store (`builderStore.ts`)

The central state management uses Zustand with the following structure:

```typescript
interface BuilderStore {
  // Project state
  project: ProjectConfig | null;
  isDirty: boolean;

  // History (undo/redo)
  history: {
    past: BuilderSnapshot[];
    future: BuilderSnapshot[];
  };

  // UI state
  ui: {
    selectedNodeId?: string;
    isCodePreviewOpen: boolean;
    isExportDialogOpen: boolean;
    // ... more UI flags
  };

  // Validation state
  validationErrors: Record<string, ValidationError[]>;

  // Actions
  addNode: (node: CanvasNode) => void;
  updateNode: (id: string, updates: Partial<CanvasNode>) => void;
  deleteNode: (id: string) => void;
  // ... more actions
}
```

### State Flow

1. **User Action** → Component
2. **Component** → Zustand Action
3. **Zustand Action** → Update State
4. **State Update** → Re-render Components
5. **History** → Snapshot for Undo/Redo

## Data Models

### ProjectConfig

```typescript
interface ProjectConfig {
  id: string;
  name: string;
  description?: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  settings: ProjectSettings;
}
```

### CanvasNode

```typescript
interface CanvasNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

type NodeType =
  | 'agent'
  | 'step'
  | 'tool'
  | 'loop'
  | 'foreach'
  | 'parallel'
  | 'router'
  | 'sleep'
  | 'sleepUntil'
  | 'waitForEvent'
  | 'map';
```

### Node Data Structures

Each node type has its own data structure:

**AgentNodeData:**

```typescript
interface AgentNodeData {
  type: 'agent';
  config: AgentBuilderConfig;
}

interface AgentBuilderConfig {
  id: string;
  name: string;
  instructions: string;
  model?: ModelConfig;
  tools?: string[];
  workflows?: string[];
  memory?: MemoryConfig;
}
```

**StepNodeData:**

```typescript
interface StepNodeData {
  type: 'step';
  config: StepBuilderConfig;
}

interface StepBuilderConfig {
  id: string;
  description?: string;
  inputSchema?: SchemaField[];
  outputSchema?: SchemaField[];
  executeCode: string;
}
```

## Code Generation Pipeline

### 1. Node Traversal

- Start from entry nodes
- Follow edges to build execution graph
- Handle branching and loops

### 2. Code Generation

Each generator class handles its node type:

**AgentCodeGenerator:**

- Imports
- Agent constructor
- Model configuration
- Tools/workflows attachment
- Memory setup

**StepCodeGenerator:**

- Imports
- Zod schema generation
- createStep() call
- Execute function

**WorkflowCodeGenerator:**

- Analyzes node connections
- Generates workflow chain
- Handles .then(), .parallel(), .branch(), etc.

**MastraInstanceGenerator:**

- Combines all components
- Generates index.ts
- Mastra instance configuration

### 3. File Structure Generation

```typescript
{
  'src/mastra/index.ts': mastraInstanceCode,
  'src/mastra/agents/agentName.ts': agentCode,
  'src/mastra/workflows/workflowName.ts': workflowCode,
  'src/mastra/tools/toolName.ts': toolCode,
  'package.json': packageJsonCode,
  'tsconfig.json': tsconfigCode,
  'README.md': readmeCode
}
```

## Validation System

### Two-Layer Validation

**1. Node Validation:**

- Per-node configuration checks
- Required fields
- Type validation
- Code syntax (basic)

**2. Graph Validation:**

- Cycle detection (DFS algorithm)
- Duplicate ID detection
- Isolated node detection
- Connection validity

### Validation Flow

```
User Edit → Validate Node → Update Errors
                ↓
         Validate Graph → Update Errors
                ↓
         Display in Validation Panel
```

## Component Patterns

### Dynamic Configuration Panel

The config panel adapts to the selected node:

```typescript
function DynamicConfigPanel() {
  const { selectedNode } = useBuilderState();

  if (!selectedNode) return <EmptyState />;

  switch (selectedNode.type) {
    case 'agent':
      return <AgentConfigPanel node={selectedNode} />;
    case 'step':
      return <StepConfigPanel node={selectedNode} />;
    case 'tool':
      return <ToolConfigPanel node={selectedNode} />;
    // ...more cases
  }
}
```

### Node Components

Each node is a React component:

```typescript
function AgentNode({ data, selected }: NodeProps<AgentNodeData>) {
  const { updateNode } = useBuilderState();

  return (
    <div className={cn('node', selected && 'selected')}>
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        {/* Node UI */}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

## Event Flow

### User Interactions

**Add Node:**

```
Palette Drag → Canvas Drop → addNode() → State Update → Render
```

**Edit Node:**

```
Select Node → Config Panel → Edit Field → updateNode() → State Update
```

**Connect Nodes:**

```
Drag Handle → Drop on Target → addEdge() → State Update
```

**Save Project:**

```
Click Save → Serialize State → localStorage/File → Success Toast
```

**Export Code:**

```
Click Export → Generate Code → Create Files → ZIP/Download
```

## Performance Optimizations

### Memoization

- React.memo() for expensive components
- useMemo() for computed values
- useCallback() for stable function references

### Lazy Loading

- Code editor lazy loaded
- Templates lazy loaded
- Heavy components split

### Debouncing

- Auto-save debounced (30s)
- Search input debounced (300ms)
- Validation debounced (500ms)

## Testing Strategy

### Unit Tests

- **Validators:** Test all validation logic
- **Code Generators:** Test code generation
- **Utilities:** Test helper functions

### Component Tests (Future)

- UI component rendering
- User interactions
- State updates

### Integration Tests (Future)

- Full workflow creation
- Export/import cycle
- Template application

## Extension Points

### Adding New Node Types

1. Define node data structure in `types/`
2. Create node component in `components/canvas/nodes/`
3. Add config panel in `components/panels/`
4. Update node palette in `components/palette/`
5. Add code generator in `lib/code-generation/`
6. Update store actions in `store/builderStore.ts`

### Adding New Templates

1. Define template in `lib/templates/`
2. Add to appropriate category (agent/workflow/tool)
3. Export from `lib/templates/index.ts`
4. Appears automatically in Template Library

### Adding New Validators

1. Create validator function in `lib/validators/`
2. Add to validation chain
3. Export from `lib/validators/index.ts`
4. Integrate in Validation Panel

## Security Considerations

- **Code Execution:** User code is never executed in the browser
- **Input Sanitization:** All inputs are validated before storage
- **XSS Prevention:** React's built-in XSS protection
- **Storage:** Local storage only, no server communication

## Browser Compatibility

- **Modern Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **File System Access API:** Progressive enhancement (fallback to download)
- **LocalStorage:** Required for auto-save feature
- **ES2020:** Minimum JavaScript version

## Future Improvements

### Planned Features

- Real-time collaboration
- Cloud save/sync
- Visual debugging
- Performance profiling
- A/B testing for agents
- Version control integration

### Performance Enhancements

- Virtual scrolling for large canvases
- Web Workers for code generation
- IndexedDB for larger projects
- Canvas rendering optimization

---

Last Updated: October 8, 2025
