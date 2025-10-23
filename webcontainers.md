# Implementation Task: Add WebContainer Preview to Mastra Visual Builder

## Context
I have a React-based visual workflow builder for Mastra AI agents. Users can drag/drop nodes to create agents and workflows, and download the generated Mastra project. Now I need to add a **live preview feature** that runs the generated code in the browser using WebContainers (StackBlitz's in-browser Node.js runtime).

## What WebContainers Are
- Browser-native Node.js runtime using WebAssembly
- Runs npm install, TypeScript compilation, and Node.js servers entirely in the browser
- Requires specific HTTP headers: `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin`
- No backend servers needed for code execution

## Current State
- ✅ Visual node editor built with React + ReactFlow
- ✅ Node types: Agent nodes, Tool nodes, Workflow nodes
- ✅ Can generate Mastra project files and zip for download
- ✅ Project hosted on Cloudflare Pages

## Goal: Add Live Preview
When users click "Preview", I want to:
1. Generate Mastra TypeScript code from visual nodes
2. Boot a WebContainer instance in the browser
3. Mount generated files into WebContainer's virtual filesystem
4. Run `npm install` and `mastra dev` inside WebContainer
5. Display Mastra's playground UI in an iframe
6. Stream execution logs to a terminal component
7. Save/restore WebContainer state across page reloads

## Technical Requirements

### 1. WebContainer Setup
```typescript
import { WebContainer } from '@webcontainer/api';

// Boot once (singleton pattern)
const webcontainer = await WebContainer.boot({
  coep: 'require-corp',
  workdirName: 'mastra-project'
});

// Mount Mastra project structure
await webcontainer.mount({
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: 'mastra-preview',
        type: 'module',
        scripts: {
          dev: 'mastra dev --port 4111'
        },
        dependencies: {
          '@mastra/core': 'latest',
          'mastra': 'latest',
          '@ai-sdk/openai': '^1.3.16'
        }
      }, null, 2)
    }
  },
  'src': {
    directory: {
      'mastra': {
        directory: {
          'index.ts': { file: { contents: generatedIndexCode } },
          'agents': {
            directory: {
              'agent-1.ts': { file: { contents: generatedAgentCode } }
            }
          }
        }
      }
    }
  }
});

// Install deps and start dev server
const installProcess = await webcontainer.spawn('npm', ['install']);
await installProcess.exit;

const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);

// Stream logs
devProcess.output.pipeTo(new WritableStream({
  write(data) {
    console.log(data);
  }
}));

// Listen for server ready
webcontainer.on('server-ready', (port, url) => {
  iframe.src = url; // Load Mastra playground
});
```

### 2. Code Generation from Nodes
Generate TypeScript using ts-morph or templates:

**Agent file structure:**
```typescript
// src/mastra/agents/my-agent.ts
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";

export const myAgent = new Agent({
  name: "my-agent",
  instructions: "You are a helpful assistant",
  model: openai("gpt-4o-mini"),
  tools: { toolName }
});
```

**Main index structure:**
```typescript
// src/mastra/index.ts
import { Mastra } from "@mastra/core/mastra";
import { myAgent } from "./agents/my-agent";

export const mastra = new Mastra({
  agents: { myAgent },
  workflows: {},
  tools: {}
});
```

### 3. Required HTTP Headers
**For Vite dev server (vite.config.ts):**
```typescript
export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
```

**For Cloudflare Pages (add _headers file):**
```
/*
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
```

### 4. State Persistence
```typescript
// Save to IndexedDB before page unload
window.addEventListener('beforeunload', async () => {
  const files = await captureFileSystem(webcontainer);
  await saveToIndexedDB(sessionId, files);
});

// Restore on load
const savedFiles = await loadFromIndexedDB(sessionId);
if (savedFiles) {
  await webcontainer.mount(savedFiles);
}
```

## Implementation Steps

### Phase 1: WebContainer Integration (Start Here)
1. Install dependency: `npm install @webcontainer/api`
2. Add COOP/COEP headers to Vite config
3. Create `WebContainerManager` class with:
   - `boot()` - singleton WebContainer instance
   - `mountProject(files)` - mount file tree
   - `installDeps()` - run npm install
   - `startDevServer()` - run mastra dev
4. Create basic UI with "Start Preview" button
5. Add iframe for displaying Mastra playground
6. Add terminal component (use xterm.js) for logs

### Phase 2: Code Generation
1. Create `MastraCodeGenerator` class
2. Implement methods:
   - `generateAgentFile(agentNode)` → TypeScript string
   - `generateWorkflowFile(workflowNodes)` → TypeScript string
   - `generateIndexFile(allNodes)` → TypeScript string
   - `generatePackageJson()` → JSON string
3. Map visual node properties to Mastra code structure
4. Test generated code outside WebContainer first

### Phase 3: Real-time Logs
1. Parse stdout/stderr from dev process
2. Look for patterns:
   - `Server ready on port` → show playground
   - `ERROR` → highlight in red
   - `[STEP:START]` → highlight active node
3. Update terminal UI with streaming logs
4. Add visual feedback on workflow graph

### Phase 4: State Management
1. Implement IndexedDB persistence
2. Save file tree on beforeunload
3. Restore on page load
4. Add session switching support
5. Memory monitoring (Chrome only)

## Key Files to Create

```
src/
├── lib/
│   ├── webcontainer/
│   │   ├── WebContainerManager.ts
│   │   ├── MastraCodeGenerator.ts
│   │   ├── ExecutionMonitor.ts
│   │   └── StateManager.ts
├── components/
│   ├── PreviewPanel.tsx
│   ├── TerminalOutput.tsx
│   └── PreviewIframe.tsx
```

## Example Node Structure
```typescript
interface AgentNode {
  id: string;
  type: 'agent';
  data: {
    name: string;
    instructions: string;
    model: 'gpt-4o-mini' | 'claude-3-5-sonnet';
    tools: string[]; // tool node IDs
  };
}
```

## Critical Gotchas
1. **Headers must be set correctly** or WebContainer.boot() fails silently
2. **Boot WebContainer only once** - it's expensive, reuse the instance
3. **Mount entire file tree at once** - don't use fs.writeFile repeatedly
4. **Process output is combined stdout+stderr** - can't separate them
5. **Mastra dev runs on port 4111** by default
6. **Safari mobile has memory issues** - implement cleanup redirect

## Testing Checklist
- [ ] WebContainer boots successfully
- [ ] Generated code is valid TypeScript
- [ ] npm install completes without errors
- [ ] mastra dev starts and shows playground
- [ ] Logs stream to terminal in real-time
- [ ] Iframe loads Mastra playground UI
- [ ] Can chat with generated agents
- [ ] State persists across page reloads
- [ ] Works in Chrome, Firefox, Edge
- [ ] Graceful error handling

## API Keys Handling
For preview, either:
1. Inject user's API keys into .env file (less secure)
2. Proxy AI calls through your backend (recommended)

## Start Command
Begin with Phase 1: Set up headers, install WebContainer, create basic manager class, and get a simple Node.js process running with logs displayed.