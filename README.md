# Mastra Visual Builder

A powerful visual interface for building AI agents, workflows, and tools without writing code. The Visual Builder provides a drag-and-drop canvas where you can design complete Mastra applications and export production-ready TypeScript code.

## 🚀 Features

- **Visual Canvas** - Drag-and-drop interface with 11 Mastra node types
- **Code Generation** - Export production-ready TypeScript code
- **Template Library** - 7+ pre-built templates to get started quickly
- **Real-time Validation** - Catch errors before export
- **Project Management** - Save, load, import, and export projects
- **Keyboard Shortcuts** - Efficient workflow with keyboard navigation
- **Auto-save** - Never lose your work
- **Dark Theme** - Beautiful dark interface with excellent contrast
- **Responsive Design** - Works on desktop and tablet devices
- **Accessibility** - High contrast ratios and keyboard navigation support

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/mastra-ai/mastra-agent-builder.git
cd mastra-agent-builder

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🎯 Quick Start

### Development Setup

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

### Basic Usage

```tsx
import { BuilderPage } from './components/BuilderPage';
import './styles.css';

function App() {
  return (
    <div className="dark h-screen w-screen overflow-hidden">
      <BuilderPage />
    </div>
  );
}
```

### Integration with Existing React App

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BuilderPage } from './components/BuilderPage';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/builder" element={
          <div className="dark h-screen w-screen overflow-hidden">
            <BuilderPage />
          </div>
        } />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

## 🎨 Node Types

### Primary Nodes

#### Agent Node

Create AI agents with custom instructions, models, tools, and workflows.

**Configuration:**

- Name & ID
- Instructions (markdown supported)
- Model selection (OpenAI, Anthropic, Google, etc.)
- Tools attachment
- Workflows attachment
- Memory configuration (buffer/summary)
- Model settings (temperature, topP, maxTokens)

#### Step Node

Create workflow steps with custom logic.

**Configuration:**

- Step ID & description
- Input/output schemas
- Execute function (TypeScript/JavaScript)

#### Tool Node

Create reusable tools for agents.

**Configuration:**

- Tool ID & description
- Input/output schemas
- Execute function
- Require approval toggle

### Control Flow Nodes

#### Loop Node

Create loops with conditions (`while`, `until`, `dowhile`, `dountil`).

**Configuration:**

- Loop type selection
- Condition function
- Max iterations

#### ForEach Node

Iterate over arrays with optional concurrency.

**Configuration:**

- Concurrency level (1-10)
- Input array configuration

#### Parallel Node

Execute multiple steps in parallel.

**Configuration:**

- Max concurrent executions

#### Router/Branch Node

Conditional branching based on conditions.

**Configuration:**

- Add/remove routes
- Condition functions
- Default path

### Timing Nodes

#### Sleep Node

Pause workflow execution for a duration.

**Configuration:**

- Duration (milliseconds or function)

#### Sleep Until Node

Pause until a specific date/time.

**Configuration:**

- Date/time picker

#### Wait For Event Node

Wait for an event before continuing.

**Configuration:**

- Event name
- Timeout duration
- Step to execute after event

### Data Nodes

#### Map Node

Transform and map data between steps.

**Configuration:**

- Field mappings
- Source step selection
- Path selectors for nested data
- Constant values

## ⌨️ Keyboard Shortcuts

| Shortcut               | Action                       |
| ---------------------- | ---------------------------- |
| `Delete` / `Backspace` | Delete selected node         |
| `Ctrl/Cmd + Z`         | Undo                         |
| `Ctrl/Cmd + Y`         | Redo                         |
| `Ctrl/Cmd + C`         | Copy selected node           |
| `Ctrl/Cmd + V`         | Paste node                   |
| `Ctrl/Cmd + D`         | Duplicate selected node      |
| `Escape`               | Deselect all                 |
| `?`                    | Show keyboard shortcuts help |

## 💾 Project Management

### Save Project

**To Browser Storage:**

1. Click "Save" in toolbar (or `Ctrl/Cmd + S`)
2. Enter project name
3. Click "Save to Browser"

**To File:**

1. Click "Save" in toolbar
2. Enter project name
3. Click "Download as File"
4. `.mastra.json` file will be downloaded

### Load Project

**From Browser Storage:**

1. Click "Save" → "Load" tab
2. Select project from list
3. Click "Load"

**From File:**

1. Click "Save" → "Load" tab
2. Click "Choose File"
3. Select `.mastra.json` file
4. Click "Load from File"

### Import Project

**From File:**

1. Click "Import" in toolbar
2. Upload `.mastra.json` file
3. Project loads onto canvas

**From Code:**

1. Click "Import" → "Paste Code" tab
2. Paste JSON configuration
3. Click "Import"

### Export Code

1. Click "View Code" in toolbar
2. Review generated files
3. Choose export method:
   - **Download as ZIP** - Complete project structure
   - **Save to Folder** - Use File System Access API
   - **Copy to Clipboard** - Copy individual files

## 📚 Template Library

Access pre-built templates via the "Templates" button in the toolbar.

### Agent Templates

1. **Customer Service Agent** - Handle customer inquiries and support
2. **Research Agent** - Conduct research and analysis
3. **Coding Assistant** - Help with programming tasks
4. **Data Analyst** - Analyze data and generate insights
5. **Content Writer** - Create high-quality written content

### Workflow Templates

1. **Data Processing Pipeline** - ETL workflow for data processing
2. **Content Generation Workflow** - Automated content creation

### Using Templates

1. Click "Templates" in toolbar
2. Browse or search templates
3. Click "Apply Template"
4. Template nodes appear on canvas
5. Customize as needed

## ✅ Validation

Real-time validation catches errors before export.

**Access Validation:**

1. Click "Validate" button in toolbar
2. View errors, warnings, and info messages
3. Click on issues to navigate to problem nodes

**Validation Checks:**

- Required fields (ID, name, descriptions)
- Code syntax (basic validation)
- Workflow structure (cycles, duplicates)
- Isolated nodes
- Schema consistency

## 🎨 Canvas Operations

### Adding Nodes

**Drag from Palette:**

1. Find node in left sidebar
2. Drag onto canvas
3. Configure in right panel

**Search Palette:**

- Use search bar to filter nodes
- Filter by category

### Connecting Nodes

1. Click and drag from node output handle
2. Connect to target node input handle
3. Connection creates workflow relationship

### Editing Nodes

**Double-click:** Open configuration panel

**Select & Configure:**

1. Click node to select
2. Edit in right panel
3. Changes update instantly

### Organizing Canvas

- **Pan:** Click and drag on empty canvas
- **Zoom:** Mouse wheel or zoom controls
- **Minimap:** Use minimap for navigation
- **Align:** Use grid for alignment

## 🔧 Configuration Panels

### Dynamic Config Panel (Right Sidebar)

Adapts to selected node type:

**Agent Configuration:**

- Basic properties
- Instructions editor
- Model selector
- Tools/workflows attachment
- Memory settings

**Step Configuration:**

- Step ID & description
- Input/output schemas
- Code editor

**Tool Configuration:**

- Tool properties
- Schemas
- Execute function
- Approval settings

### Project Properties

Access via settings icon in toolbar.

**Global Settings:**

- Project name & description
- Default model
- Storage configuration (LibSQL, Postgres, etc.)
- Logger (Pino, Console)
- Telemetry
- Environment variables

## 📋 Schema Builder

Visual interface for creating Zod schemas.

**Features:**

- Add/remove fields
- Field types (string, number, boolean, object, array, date)
- Optional/required toggle
- Default values
- Validation rules (min, max, etc.)
- Field reordering

**Usage:**

1. In Step/Tool config, click "Add Field"
2. Configure field properties
3. Schemas auto-generate in code

## 🔄 Auto-save

Projects auto-save every 30 seconds to browser storage.

**Features:**

- Unsaved changes indicator (dot on save button)
- Automatic recovery on reload
- Manual save always available

## 🚢 Export & Deployment

### Generated Project Structure

```
my-mastra-project/
├── src/
│   ├── agents/
│   │   └── myAgent.ts
│   ├── workflows/
│   │   └── myWorkflow.ts
│   ├── tools/
│   │   └── myTool.ts
│   ├── steps/
│   │   └── myStep.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Using Generated Code

1. Extract ZIP file
2. Install dependencies: `pnpm install`
3. Run your Mastra app: `pnpm dev`

## 🧪 Testing

The Visual Builder includes comprehensive test coverage:

```bash
# Run tests
pnpm test

# Run with UI
pnpm test:ui

# Generate coverage
pnpm test:coverage
```

**Test Coverage:**

- Unit tests for validators
- Code generator tests
- Component integration tests
- End-to-end workflow tests

## 🎯 Best Practices

### Naming Conventions

- **IDs:** Use camelCase (e.g., `myAgent`, `processData`)
- **Names:** Use Title Case (e.g., "My Agent", "Process Data")
- **Descriptive:** Make names self-documenting

### Workflow Design

1. **Start Simple:** Begin with linear workflows
2. **Add Complexity:** Introduce branching/loops as needed
3. **Validate Often:** Use validation panel regularly
4. **Test Incrementally:** Export and test workflows early

### Agent Configuration

1. **Clear Instructions:** Write detailed, structured instructions
2. **Model Selection:** Choose appropriate model for task
3. **Tool Attachment:** Only attach necessary tools
4. **Memory Management:** Configure based on conversation length

### Schema Design

1. **Required Fields:** Mark essential fields as required
2. **Validation:** Add min/max constraints
3. **Documentation:** Use field descriptions
4. **Type Safety:** Choose specific types

## 🐛 Troubleshooting

### Common Issues

**Nodes won't connect:**

- Ensure nodes are compatible
- Check for circular dependencies
- Validate node configurations

**Validation errors:**

- Check required fields
- Verify code syntax
- Review error messages in validation panel

**Code generation fails:**

- Ensure all nodes are configured
- Check for duplicate IDs
- Validate workflow structure

**Import not working:**

- Verify `.mastra.json` format
- Check JSON validity
- Ensure compatible schema version

## 📖 API Reference

### Main Components

#### `<BuilderPage />`

Main builder interface component.

```tsx
import { BuilderPage } from './components/BuilderPage';

<BuilderPage />;
```

### Hooks

#### `useBuilderState()`

Access builder state and actions.

```tsx
import { useBuilderState } from './hooks/useBuilderState';

const {
  project,
  nodes,
  edges,
  addNode,
  updateNode,
  deleteNode,
  // ...more actions
} = useBuilderState();
```

### Types

```tsx
import type {
  ProjectConfig,
  CanvasNode,
  CanvasEdge,
  AgentBuilderConfig,
  StepBuilderConfig,
  ToolBuilderConfig,
} from './types';
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

### Development Setup

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Generate test coverage
pnpm test:coverage

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📝 License

MIT License - see [LICENSE](./LICENSE.md)

## 🔗 Links

- [Mastra Documentation](https://docs.mastra.ai)

## 🆘 Feature requests

- create an issue

---

Built with ❤️ by Khaled Garbaya
