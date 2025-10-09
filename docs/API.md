# Visual Builder API Reference

Complete API documentation for the Mastra Visual Builder.

## Table of Contents

- [Components](#components)
- [Hooks](#hooks)
- [Types](#types)
- [Utilities](#utilities)
- [Code Generators](#code-generators)
- [Validators](#validators)

## Components

### `<BuilderPage />`

Main builder interface component. This is the primary entry point for the visual builder.

```tsx
import { BuilderPage } from '@mastra/visual-builder';
import '@mastra/visual-builder/styles.css';

function App() {
  return <BuilderPage />;
}
```

**Props:** None

**Features:**

- Unified canvas with all node types
- Dynamic configuration panels
- Toolbar with all actions
- Auto-save functionality
- Template library integration
- Validation panel
- Export/import capabilities

---

## Hooks

### `useBuilderState()`

Access and manipulate builder state.

```tsx
import { useBuilderState } from '@mastra/visual-builder';

function MyComponent() {
  const {
    project,
    nodes,
    edges,
    addNode,
    updateNode,
    deleteNode,
    // ... more
  } = useBuilderState();
}
```

**Returns:**

```typescript
{
  // State
  project: ProjectConfig | null;
  isDirty: boolean;
  isSaveDialogOpen: boolean;
  ui: BuilderUIState;
  validationErrors: Record<string, ValidationError[]>;

  // Project actions
  createProject: (name: string, description?: string) => void;
  setProject: (project: ProjectConfig, markClean?: boolean) => void;
  updateProject: (updates: Partial<ProjectConfig>) => void;
  reset: () => void;

  // Node actions
  addNode: (node: CanvasNode) => void;
  updateNode: (nodeId: string, updates: Partial<CanvasNode>) => void;
  deleteNode: (nodeId: string) => void;
  deleteNodes: (nodeIds: string[]) => void;
  duplicateNode: (nodeId: string) => void;
  moveNode: (nodeId: string, position: { x: number; y: number }) => void;

  // Edge actions
  addEdge: (edge: CanvasEdge) => void;
  updateEdge: (edgeId: string, updates: Partial<CanvasEdge>) => void;
  deleteEdge: (edgeId: string) => void;
  deleteEdges: (edgeIds: string[]) => void;

  // Settings actions
  updateSettings: (settings: Partial<ProjectSettings>) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // UI actions
  setSelectedNode: (nodeId?: string) => void;
  toggleCodePreview: () => void;
  toggleExportDialog: () => void;
  toggleImportDialog: () => void;
  toggleSaveDialog: () => void;
  toggleTemplateLibrary: () => void;
  applyTemplate: (templateProject: ProjectConfig) => void;

  // Dirty state
  markDirty: () => void;
  markClean: () => void;
}
```

### `useBuilderUIState()`

Access only UI state (performance optimization).

```tsx
import { useBuilderUIState } from '@mastra/visual-builder';

function MyUIComponent() {
  const ui = useBuilderUIState();
  // ui.selectedNodeId, ui.isCodePreviewOpen, etc.
}
```

**Returns:** `BuilderUIState`

### `useHistoryState()`

Access undo/redo state.

```tsx
import { useHistoryState } from '@mastra/visual-builder';

function HistoryControls() {
  const { canUndo, canRedo, undo, redo } = useHistoryState();
}
```

**Returns:**

```typescript
{
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  history: {
    past: BuilderSnapshot[];
    future: BuilderSnapshot[];
  };
}
```

### `useValidationState()`

Access validation state and actions.

```tsx
import { useValidationState } from '@mastra/visual-builder';

function ValidationStatus() {
  const { errors, validate, clear } = useValidationState();
}
```

**Returns:**

```typescript
{
  errors: Record<string, ValidationError[]>;
  validate: () => void;
  clear: () => void;
}
```

### `useKeyboardShortcuts()`

Enable keyboard shortcuts (automatically enabled in BuilderPage).

```tsx
import { useKeyboardShortcuts } from '@mastra/visual-builder';

function MyBuilder() {
  useKeyboardShortcuts();
  // Keyboard shortcuts now active
}
```

---

## Types

### Core Types

#### `ProjectConfig`

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

#### `CanvasNode`

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

#### `CanvasEdge`

```typescript
interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
```

#### `ProjectSettings`

```typescript
interface ProjectSettings {
  projectName?: string;
  description?: string;
  model?: ModelConfig;
  storage?: StorageConfig;
  logger?: LoggerConfig;
  telemetry?: TelemetryConfig;
  environmentVariables?: Record<string, string>;
}
```

### Node Data Types

#### `AgentBuilderConfig`

```typescript
interface AgentBuilderConfig {
  id: string;
  name: string;
  description?: string;
  instructions: string;
  model?: {
    provider: string;
    name: string;
  };
  modelSettings?: {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    stopSequences?: string[];
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  tools?: string[];
  workflows?: string[];
  agents?: string[];
  memory?: {
    type: 'buffer' | 'summary';
    maxMessages?: number;
  };
  maxRetries?: number;
  enableTracing?: boolean;
}
```

#### `StepBuilderConfig`

```typescript
interface StepBuilderConfig {
  id: string;
  description?: string;
  inputSchema?: SchemaField[];
  outputSchema?: SchemaField[];
  executeCode: string;
}
```

#### `ToolBuilderConfig`

```typescript
interface ToolBuilderConfig {
  id: string;
  description: string;
  inputSchema?: SchemaField[];
  outputSchema?: SchemaField[];
  executeCode: string;
  requireApproval?: boolean;
}
```

#### `SchemaField`

```typescript
interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
  required: boolean;
  description?: string;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
```

### Validation Types

#### `ValidationError`

```typescript
interface ValidationError {
  nodeId: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}
```

### Template Types

#### `Template`

```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  category: 'agent' | 'workflow' | 'tool' | 'complete';
  icon: string;
  tags: string[];
  project: ProjectConfig;
  preview?: string;
}
```

---

## Utilities

### Storage

#### `saveProject()`

```typescript
function saveProject(projectId: string, project: ProjectConfig): void;
```

Save project to browser localStorage.

**Example:**

```tsx
import { saveProject } from '@mastra/visual-builder';

saveProject('my-project', projectConfig);
```

#### `loadProject()`

```typescript
function loadProject(projectId: string): ProjectConfig | null;
```

Load project from browser localStorage.

#### `listProjects()`

```typescript
function listProjects(): Array<{
  id: string;
  name: string;
  lastModified: number;
}>;
```

List all saved projects.

#### `deleteProject()`

```typescript
function deleteProject(projectId: string): void;
```

Delete a saved project.

#### `exportProjectToFile()`

```typescript
function exportProjectToFile(project: ProjectConfig, filename: string): void;
```

Export project as `.mastra.json` file.

#### `importProjectFromFile()`

```typescript
function importProjectFromFile(file: File): Promise<ProjectConfig>;
```

Import project from `.mastra.json` file.

### Code Generation

#### `generateProjectCode()`

```typescript
function generateProjectCode(project: ProjectConfig): Record<string, string>;
```

Generate all code files for a project.

**Returns:** Object with file paths as keys and code as values.

**Example:**

```tsx
import { generateProjectCode } from '@mastra/visual-builder';

const files = generateProjectCode(project);
// {
//   'src/mastra/index.ts': '...',
//   'src/mastra/agents/myAgent.ts': '...',
//   'package.json': '...'
// }
```

#### `exportAsZip()`

```typescript
function exportAsZip(files: Record<string, string>, projectName: string): Promise<void>;
```

Export code files as ZIP archive.

---

## Code Generators

### `AgentCodeGenerator`

```typescript
class AgentCodeGenerator {
  generate(config: AgentBuilderConfig): string;
}
```

**Usage:**

```tsx
import { AgentCodeGenerator } from '@mastra/visual-builder';

const generator = new AgentCodeGenerator();
const code = generator.generate(agentConfig);
```

### `StepCodeGenerator`

```typescript
class StepCodeGenerator {
  generate(config: StepBuilderConfig): string;
}
```

### `ToolCodeGenerator`

```typescript
class ToolCodeGenerator {
  generate(config: ToolBuilderConfig): string;
}
```

### `WorkflowCodeGenerator`

```typescript
class WorkflowCodeGenerator {
  generate(nodes: CanvasNode[], edges: CanvasEdge[]): string;
}
```

### `MastraInstanceGenerator`

```typescript
class MastraInstanceGenerator {
  generate(project: ProjectConfig): string;
}
```

---

## Validators

### Node Validators

#### `validateAgentNode()`

```typescript
function validateAgentNode(node: CanvasNode): ValidationError[];
```

Validate agent node configuration.

#### `validateStepNode()`

```typescript
function validateStepNode(node: CanvasNode): ValidationError[];
```

Validate step node configuration.

#### `validateToolNode()`

```typescript
function validateToolNode(node: CanvasNode): ValidationError[];
```

Validate tool node configuration.

#### `validateAllNodes()`

```typescript
function validateAllNodes(nodes: CanvasNode[]): ValidationError[];
```

Validate all nodes in a project.

### Graph Validators

#### `detectCycles()`

```typescript
function detectCycles(nodes: CanvasNode[], edges: CanvasEdge[]): ValidationError[];
```

Detect circular dependencies in workflow.

#### `detectIsolatedNodes()`

```typescript
function detectIsolatedNodes(nodes: CanvasNode[], edges: CanvasEdge[]): ValidationError[];
```

Find nodes with no connections.

#### `detectDuplicateIds()`

```typescript
function detectDuplicateIds(nodes: CanvasNode[]): ValidationError[];
```

Find nodes with duplicate IDs.

#### `validateWorkflowGraph()`

```typescript
function validateWorkflowGraph(nodes: CanvasNode[], edges: CanvasEdge[]): ValidationError[];
```

Run all graph validations.

### Helper Functions

#### `hasErrors()`

```typescript
function hasErrors(nodeId: string, errors: ValidationError[]): boolean;
```

Check if a node has any errors.

#### `hasWarnings()`

```typescript
function hasWarnings(nodeId: string, errors: ValidationError[]): boolean;
```

Check if a node has any warnings.

#### `getNodeErrors()`

```typescript
function getNodeErrors(nodeId: string, errors: ValidationError[]): ValidationError[];
```

Get all errors for a specific node.

---

## Advanced Usage

### Custom Node Types

To add a custom node type:

1. **Define the type:**

```typescript
// types/myCustomNode.ts
export interface MyCustomNodeData {
  type: 'myCustom';
  config: MyCustomConfig;
}

export interface MyCustomConfig {
  id: string;
  // custom fields
}
```

2. **Create the node component:**

```tsx
// components/canvas/nodes/MyCustomNode.tsx
export function MyCustomNode({ data }: NodeProps<MyCustomNodeData>) {
  return <div className="custom-node">{/* Node UI */}</div>;
}
```

3. **Create config panel:**

```tsx
// components/panels/MyCustomConfigPanel.tsx
export function MyCustomConfigPanel({ node }: { node: CanvasNode }) {
  // Config UI
}
```

4. **Create code generator:**

```tsx
// lib/code-generation/MyCustomCodeGenerator.ts
export class MyCustomCodeGenerator {
  generate(config: MyCustomConfig): string {
    // Generate code
  }
}
```

5. **Register in store:**

```typescript
// Add to builderStore.ts node types
```

### Programmatic Project Creation

```tsx
import { useBuilderState } from '@mastra/visual-builder';

function createProjectProgrammatically() {
  const { createProject, addNode, addEdge } = useBuilderState();

  // Create project
  createProject('My Project', 'Description');

  // Add agent node
  addNode({
    id: 'agent-1',
    type: 'agent',
    position: { x: 100, y: 100 },
    data: {
      type: 'agent',
      config: {
        id: 'myAgent',
        name: 'My Agent',
        instructions: 'Do something',
        tools: [],
        workflows: [],
        agents: [],
      },
    },
  });

  // Add step node
  addNode({
    id: 'step-1',
    type: 'step',
    position: { x: 300, y: 100 },
    data: {
      type: 'step',
      config: {
        id: 'myStep',
        description: 'Process data',
        executeCode: 'async ({ input }) => { return { output: input }; }',
      },
    },
  });

  // Connect nodes
  addEdge({
    id: 'edge-1',
    source: 'agent-1',
    target: 'step-1',
  });
}
```

---

## Events & Callbacks

The builder emits events that you can listen to:

```typescript
// Future API (not yet implemented)
interface BuilderEvents {
  onProjectSave?: (project: ProjectConfig) => void;
  onProjectLoad?: (project: ProjectConfig) => void;
  onCodeGenerate?: (files: Record<string, string>) => void;
  onValidationChange?: (errors: ValidationError[]) => void;
  onNodeAdd?: (node: CanvasNode) => void;
  onNodeDelete?: (nodeId: string) => void;
}
```

---

**Version:** 0.1.0  
**Last Updated:** October 8, 2025
