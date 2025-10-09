# Standalone Visual Agent Builder - Maintenance & Enhancement Plan

## Overview

This document outlines the architecture, features, and future enhancement roadmap for the **Standalone Mastra Visual Agent Builder**. This is a production-ready application extracted from the Mastra monorepo, enabling users to create agents, workflows, and tools visually and export generated Mastra code.

---

## Current State (Production Ready ✅)

The Standalone Visual Builder is a complete, production-ready application with:

- ✅ **Visual Canvas** - Drag-and-drop interface with 11 Mastra node types
- ✅ **Code Generation** - Export production-ready TypeScript code
- ✅ **Template Library** - 26+ pre-built templates
- ✅ **Real-time Validation** - Catch errors before export
- ✅ **Project Management** - Save/Load/Import/Export
- ✅ **Keyboard Shortcuts** - 8 shortcuts for efficient workflow
- ✅ **Auto-save** - Never lose work (30-second intervals)
- ✅ **Testing** - 51 unit tests, 100% passing
- ✅ **Documentation** - Complete guides and API reference

**Build Stats:**
- Size: 759 KB (164 KB gzipped)
- Tests: 51/51 passing
- TypeScript Errors: 0
- Ready for deployment

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│              Standalone Visual Builder                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Single Canvas / Workspace                │  │
│  │                                                        │  │
│  │  ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐       │  │
│  │  │Agent │───▶│Step  │───▶│Tool  │───▶│Agent │       │  │
│  │  │ Node │    │ Node │    │ Node │    │ Node │       │  │
│  │  └──────┘    └──────┘    └──────┘    └──────┘       │  │
│  │                                                        │  │
│  │  Mix agents, workflows, tools, and other components   │  │
│  │  on one canvas to build complete experiences          │  │
│  └──────────────────────────────────────────────────────┘  │
│         │                                                   │
│         │                                                   │
│  ┌──────▼────────┐                                         │
│  │ Code Generator │                                         │
│  │  (Full Mastra  │                                         │
│  │   Project)     │                                         │
│  └───────┬────────┘                                         │
│          │                                                   │
│  ┌───────▼────────┐                                         │
│  │  Export/Save   │                                         │
│  │  (ZIP/JSON)    │                                         │
│  └────────────────┘                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Application Structure

```
mastra-agent-builder/              # Standalone application
├── src/
│   ├── components/
│   │   ├── builder/               # Main builder UI
│   │   │   ├── BuilderSidebar.tsx
│   │   │   └── BuilderToolbar.tsx
│   │   ├── canvas/                # Flow canvas
│   │   │   └── UnifiedCanvas.tsx
│   │   ├── nodes/                 # 11 node type components
│   │   │   ├── AgentNode.tsx
│   │   │   ├── StepNode.tsx
│   │   │   ├── ToolNode.tsx
│   │   │   ├── LoopNode.tsx
│   │   │   ├── ForEachNode.tsx
│   │   │   ├── ParallelNode.tsx
│   │   │   ├── RouterNode.tsx
│   │   │   ├── SleepNode.tsx
│   │   │   ├── SleepUntilNode.tsx
│   │   │   ├── WaitForEventNode.tsx
│   │   │   └── MapNode.tsx
│   │   ├── panels/                # Configuration panels
│   │   │   ├── AgentConfigPanel.tsx
│   │   │   ├── StepConfigPanel.tsx
│   │   │   ├── ToolConfigPanel.tsx
│   │   │   ├── LoopConfigPanel.tsx
│   │   │   ├── ForEachConfigPanel.tsx
│   │   │   ├── BranchConfigPanel.tsx
│   │   │   ├── MapConfigPanel.tsx
│   │   │   ├── SleepConfigPanel.tsx
│   │   │   ├── WaitForEventConfigPanel.tsx
│   │   │   ├── DynamicConfigPanel.tsx
│   │   │   └── ProjectPropertiesPanel.tsx
│   │   ├── palette/               # Node palette & templates
│   │   │   └── NodePalette.tsx
│   │   ├── code-preview/          # Code generation preview
│   │   │   ├── CodePreview.tsx
│   │   │   └── FileExplorer.tsx
│   │   ├── export/                # Export functionality
│   │   │   └── ExportDialog.tsx
│   │   ├── import/                # Import functionality
│   │   │   └── ImportDialog.tsx
│   │   ├── save-load/             # Save/Load state
│   │   │   └── SaveLoadDialog.tsx
│   │   ├── schema/                # Visual schema builder
│   │   │   ├── SchemaBuilder.tsx
│   │   │   └── SchemaFieldEditor.tsx
│   │   ├── templates/             # Template library
│   │   │   └── TemplateLibrary.tsx
│   │   ├── validation/            # Validation UI
│   │   │   └── ValidationPanel.tsx
│   │   ├── BuilderLayout.tsx
│   │   └── BuilderPage.tsx
│   ├── lib/
│   │   ├── code-generation/       # Code generators
│   │   │   ├── AgentCodeGenerator.ts
│   │   │   ├── StepCodeGenerator.ts
│   │   │   ├── ToolCodeGenerator.ts
│   │   │   ├── WorkflowCodeGenerator.ts
│   │   │   └── MastraInstanceGenerator.ts
│   │   ├── validators/            # Validation logic
│   │   │   ├── nodeValidators.ts
│   │   │   └── graphValidators.ts
│   │   ├── templates/             # Template definitions
│   │   │   ├── agentTemplates.ts
│   │   │   ├── workflowTemplates.ts
│   │   │   ├── toolTemplates.ts
│   │   │   └── experienceTemplates.ts
│   │   ├── storage/               # Local storage
│   │   │   └── projectStorage.ts
│   │   └── utils.ts
│   ├── hooks/                     # React hooks
│   │   ├── useBuilderState.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── store/                     # Zustand state
│   │   └── builderStore.ts
│   ├── types/                     # TypeScript types
│   │   ├── agent.ts
│   │   ├── workflow.ts
│   │   ├── tool.ts
│   │   └── builder.ts
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── styles.css                 # Global styles
├── public/                        # Static assets
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── KEYBOARD_SHORTCUTS.md
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Technical Stack

| Component           | Technology                            | Purpose                        |
| ------------------- | ------------------------------------- | ------------------------------ |
| **Framework**       | React 19                              | UI framework                   |
| **Build Tool**      | Vite 6                                | Fast builds & HMR              |
| **Language**        | TypeScript 5.8                        | Type safety                    |
| **Canvas**          | @xyflow/react 12.8                    | Flow-based canvas              |
| **Forms**           | React Hook Form 7.54                  | Form management                |
| **State**           | Zustand 5.0                           | State management               |
| **Validation**      | Zod 4.1                               | Schema validation              |
| **UI Components**   | Radix UI                              | Accessible components          |
| **Styling**         | Tailwind CSS 3.4                      | Utility-first CSS              |
| **Code Editor**     | @uiw/react-codemirror                 | Code editing                   |
| **Icons**           | Lucide React                          | Icon library                   |
| **Notifications**   | Sonner                                | Toast notifications            |
| **Export**          | JSZip                                 | ZIP file generation            |
| **Testing**         | Vitest + Testing Library              | Unit testing                   |

---

## Core Features (Implemented ✅)

### 1. Visual Canvas

**11 Mastra Node Types:**
- ✅ Agent Node (`new Agent()`)
- ✅ Step Node (`createStep()`)
- ✅ Tool Node (`createTool()`)
- ✅ Loop Node (`.while()`, `.until()`, `.dowhile()`, `.dountil()`)
- ✅ ForEach Node (`.foreach()`)
- ✅ Parallel Node (`.parallel()`)
- ✅ Router Node (`.branch()`)
- ✅ Sleep Node (`.sleep()`)
- ✅ SleepUntil Node (`.sleepUntil()`)
- ✅ WaitForEvent Node (`.waitForEvent()`)
- ✅ Map Node (`.map()`)

**Canvas Features:**
- ✅ Drag-and-drop nodes from palette
- ✅ Connect nodes with edges
- ✅ Multi-select and delete
- ✅ Copy/paste nodes
- ✅ Zoom and pan controls
- ✅ Minimap
- ✅ Background grid
- ✅ Undo/redo (10 states)

### 2. Node Configuration Panels

**9 Dynamic Configuration Panels:**
- ✅ Agent Configuration (name, model, instructions, tools, workflows, memory)
- ✅ Step Configuration (ID, schemas, execute function)
- ✅ Tool Configuration (ID, schemas, execute function, approval)
- ✅ Loop Configuration (type, condition, max iterations)
- ✅ ForEach Configuration (concurrency)
- ✅ Branch Configuration (routes, conditions)
- ✅ Map Configuration (field mappings)
- ✅ Sleep Configuration (duration, date)
- ✅ WaitForEvent Configuration (event name, timeout)

**Shared Components:**
- ✅ Visual Schema Builder (create Zod schemas visually)
- ✅ Code Editor (syntax highlighting, multi-line)
- ✅ Model Selector (popular models + custom)
- ✅ Instruction Templates (pre-built templates)

### 3. Code Generation

**5 Code Generators:**
- ✅ AgentCodeGenerator - Generates Agent class instances
- ✅ StepCodeGenerator - Generates createStep() calls
- ✅ ToolCodeGenerator - Generates createTool() calls
- ✅ WorkflowCodeGenerator - Generates workflow chains
- ✅ MastraInstanceGenerator - Generates complete Mastra instance

**Export Formats:**
- ✅ Download as ZIP (complete project structure)
- ✅ Copy to clipboard (single or multiple files)
- ✅ Save to file system (File System Access API)

**Generated Files:**
- ✅ `src/mastra/agents/*.ts` - Agent definitions
- ✅ `src/mastra/workflows/*.ts` - Workflow definitions
- ✅ `src/mastra/tools/*.ts` - Tool definitions
- ✅ `src/mastra/index.ts` - Mastra instance
- ✅ `package.json` - Dependencies
- ✅ `README.md` - Usage instructions
- ✅ `tsconfig.json` - TypeScript config

### 4. Template Library

**26+ Pre-built Templates:**

**Agent Templates (7):**
- Customer Service Agent
- Research Agent
- Code Assistant
- Data Analyst
- Content Writer
- Sales Agent
- Support Agent

**Workflow Templates (7):**
- Data Processing Pipeline
- Content Generation
- Multi-step Approval
- ETL Workflow
- Notification System
- Data Analysis
- Multi-step Process

**Tool Templates (7):**
- HTTP Request Tool
- Database Query Tool
- File Operations Tool
- Email Sender Tool
- Calculator Tool
- Slack Notification Tool
- Discord Webhook Tool

**Complete Experience Templates (5):**
- Customer Support System
- Content Creation Pipeline
- Data Analysis Workflow
- Email Automation System
- Multi-Agent Research System

### 5. Project Management

**Save/Load:**
- ✅ Save to localStorage (auto-save every 30s)
- ✅ Save to file (.mastra.json)
- ✅ Load from localStorage
- ✅ Load from file
- ✅ Unsaved changes indicator

**Import/Export:**
- ✅ Import .mastra.json files
- ✅ Export entire project as ZIP
- ✅ Export individual files
- ✅ Paste JSON directly

### 6. Validation

**Real-time Validation:**
- ✅ Node validation (Agent, Step, Tool)
- ✅ Graph validation (cycles, isolation, duplicates)
- ✅ Schema validation
- ✅ Code syntax validation (basic)

**Validation Panel:**
- ✅ Error/Warning/Info display
- ✅ Click to navigate to issue
- ✅ Validation count badges

### 7. User Experience

**Keyboard Shortcuts:**
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Ctrl/Cmd + C` - Copy node
- `Ctrl/Cmd + V` - Paste node
- `Ctrl/Cmd + D` - Duplicate node
- `Delete` - Delete selected node
- `Escape` - Deselect all
- `Ctrl/Cmd + K` - Show shortcuts help

**Additional Features:**
- ✅ Tooltips on all controls
- ✅ Keyboard shortcuts help dialog
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

---

## Enhancement Roadmap

### Phase 8: Advanced Features (Optional)

These are optional enhancements for the standalone app. All core features are already complete and production-ready.

#### 8.1 Enhanced Code Preview

- [ ] Integrate Monaco Editor for better syntax highlighting
- [ ] Add file tree view
- [ ] Show line numbers
- [ ] Add code folding
- [ ] Prettier formatting integration
- [ ] Live TypeScript error checking

#### 8.2 Advanced Schema Builder

- [ ] Nested object support
- [ ] Array item type configuration
- [ ] Complex validation rules (regex, custom validators)
- [ ] Schema preview with examples
- [ ] Import/export schemas

#### 8.3 Testing & Runtime Preview

**Note:** Requires runtime environment setup

- [ ] Test runner interface
- [ ] Agent chat testing (requires Mastra runtime)
- [ ] Workflow execution preview (requires Mastra runtime)
- [ ] Tool execution testing
- [ ] Debug mode with breakpoints
- [ ] Step-through execution
- [ ] Execution replay

#### 8.4 UI/UX Enhancements

- [ ] Loading states for all async operations
- [ ] Empty states with helpful prompts
- [ ] Onboarding tour for new users
- [ ] Contextual help links
- [ ] Responsive design (mobile/tablet)
- [ ] Dark/light mode toggle
- [ ] Resizable panels (drag handles)
- [ ] Canvas context menu (right-click)

#### 8.5 Performance Optimizations

- [ ] Virtualization for large node lists
- [ ] Debounced code generation
- [ ] Memoization of expensive computations
- [ ] Lazy loading of code editor
- [ ] React.memo optimization
- [ ] Service worker for offline support

#### 8.6 Advanced Validation

- [ ] Show validation errors on canvas nodes
- [ ] Inline validation messages
- [ ] Validation severity levels
- [ ] Custom validation rules
- [ ] Validation rule editor

#### 8.7 Collaboration Features

**Note:** Requires backend infrastructure

- [ ] Cloud save/sync
- [ ] Share projects via URL
- [ ] Real-time collaboration (multiple users)
- [ ] Version history
- [ ] Compare versions (visual diff)
- [ ] Comments/annotations on canvas
- [ ] Team workspaces

#### 8.8 AI-Assisted Building

**Note:** Requires AI API integration

- [ ] Natural language → visual builder
- [ ] AI-generated agent instructions
- [ ] Workflow optimization suggestions
- [ ] Tool recommendations
- [ ] Schema generation from descriptions
- [ ] Code review and suggestions
- [ ] Auto-fix validation errors

#### 8.9 Advanced Export Options

- [ ] Export to GitHub repository (via GitHub API)
- [ ] Deploy to Vercel/Netlify directly
- [ ] Create Docker container
- [ ] Generate CI/CD pipelines
- [ ] Create documentation site
- [ ] Export as npm package

#### 8.10 Analytics & Monitoring

- [ ] Usage analytics (PostHog, Mixpanel)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] A/B testing for features

---

## Integration Opportunities

### Optional Mastra Playground Integration

If you want to integrate back with the Mastra playground:

**Benefits:**
- Live testing with Mastra runtime
- Direct access to existing agents/workflows
- Share state between builder and playground

**Implementation:**
```tsx
// In standalone app - add optional playground mode
<Route path="/playground" element={<PlaygroundIntegration />} />

// Communicate via postMessage or shared state
window.parent.postMessage({
  type: 'MASTRA_PROJECT_UPDATE',
  payload: generatedCode
}, '*');
```

### Backend API (Optional)

For advanced features like cloud save, collaboration:

**Endpoints needed:**
- `POST /api/projects` - Save project
- `GET /api/projects/:id` - Load project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/versions` - Version history
- `POST /api/projects/:id/share` - Generate share link

### Authentication (Optional)

For user-specific features:

**Options:**
- Auth0
- Clerk
- Firebase Auth
- Supabase Auth
- NextAuth.js

---

## Deployment Architecture

### Static Deployment (Current)

```
┌─────────────────────────────────────┐
│         CDN (Vercel/Netlify)        │
│                                     │
│  ├── index.html                     │
│  ├── assets/                        │
│  │   ├── main-[hash].js            │
│  │   ├── vendor-[hash].js          │
│  │   └── styles-[hash].css         │
│  └── ...                            │
└─────────────────────────────────────┘
                │
                ▼
         ┌──────────────┐
         │   Browser    │
         │  (Client)    │
         └──────────────┘
```

**Advantages:**
- ✅ Simple deployment
- ✅ Low cost ($0-20/month)
- ✅ Fast global delivery
- ✅ No backend needed

### With Backend (Future)

```
┌─────────────────────────────────────┐
│         CDN (Frontend)              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Backend API (Optional)         │
│  ├── /api/projects                  │
│  ├── /api/auth                      │
│  └── /api/analytics                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Database (PostgreSQL/Mongo)    │
└─────────────────────────────────────┘
```

**Use cases:**
- Cloud project storage
- User authentication
- Team collaboration
- Analytics tracking

---

## Testing Strategy

### Current Coverage ✅

**51 Unit Tests (100% passing):**
- 21 Code Generator tests
  - AgentCodeGenerator (8 tests)
  - StepCodeGenerator (6 tests)
  - ToolCodeGenerator (7 tests)
- 30 Validator tests
  - Node validators (20 tests)
  - Graph validators (10 tests)

**Test Utilities:**
- Mock data factories
- Test helpers
- Vitest setup
- Testing Library

### Future Testing (Phase 8)

**Component Tests:**
- [ ] BuilderPage integration tests
- [ ] Node component tests
- [ ] Panel component tests
- [ ] Canvas interaction tests

**E2E Tests:**
- [ ] Complete user flows (Playwright/Cypress)
- [ ] Template application
- [ ] Export functionality
- [ ] Import functionality
- [ ] Save/load projects

**Visual Regression:**
- [ ] Chromatic or Percy
- [ ] Screenshot comparison
- [ ] Component library storybook

---

## Success Metrics

### Current Achievements ✅

- ✅ Build size < 1MB gzipped (164 KB achieved)
- ✅ 100% test passing (51/51)
- ✅ Zero TypeScript errors
- ✅ Production-ready deployment

### Future Goals

**Technical:**
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] 90%+ code coverage

**Business:**
- [ ] User adoption > 1000 users/month
- [ ] Code export rate > 50%
- [ ] Template usage > 30%
- [ ] User satisfaction > 4.5/5

**Performance:**
- [ ] Support 100+ nodes on canvas
- [ ] Code generation < 500ms
- [ ] Validation < 100ms
- [ ] Zero runtime errors

---

## Maintenance Guidelines

### Regular Updates

**Monthly:**
- Update npm dependencies
- Security patches
- Performance optimization
- Bug fixes

**Quarterly:**
- Feature additions
- Template library expansion
- Documentation updates
- User feedback integration

### Monitoring

**Recommended Tools:**
- **Error Tracking:** Sentry
- **Analytics:** PostHog or Mixpanel
- **Uptime:** UptimeRobot
- **Performance:** Vercel Analytics or Google Lighthouse CI

### Contribution Guidelines

**For Contributors:**
1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Run linter before commit
5. Create detailed PRs

**Code Standards:**
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- No console.log in production

---

## Key Design Decisions

1. **Unified Canvas Approach**: Single workspace for all component types
2. **Client-Side Only**: No backend required, fully browser-based
3. **Mastra API Alignment**: 1:1 mapping between nodes and Mastra API
4. **Visual-First**: Code generation is secondary to visual design
5. **Template-Driven**: Pre-built templates for quick start
6. **Local Storage**: Projects saved in browser (with file export)
7. **Production Code**: Generated code matches hand-written quality
8. **Type Safety**: Full TypeScript throughout
9. **Accessibility**: Keyboard navigation and ARIA labels
10. **Performance**: Optimized for large canvases (100+ nodes)

---

## Differences from Monorepo Version

### Removed Features
- ❌ Playground integration (can be added back as optional)
- ❌ Mastra server dependency
- ❌ Live testing with runtime (requires backend)

### Added Features
- ✅ Standalone deployment configs
- ✅ File System Access API for exports
- ✅ Complete documentation package
- ✅ Independent versioning
- ✅ Simplified build process

### Changed Architecture
- **Before:** Package in monorepo, used by playground
- **After:** Standalone SPA, independent deployment
- **State:** Self-contained (no external state sync)
- **Deployment:** Static hosting (Vercel, Netlify, etc.)

---

## Future Vision

### Short-term (3-6 months)
- Enhanced code preview with Monaco
- Advanced schema builder
- UI/UX improvements
- Performance optimizations

### Medium-term (6-12 months)
- Optional backend API
- Cloud save/sync
- Team collaboration
- Advanced validation

### Long-term (12+ months)
- AI-assisted building
- Real-time collaboration
- Template marketplace
- Visual debugging
- Cost estimation
- Performance profiling

---

## Resources

### Documentation
- [Architecture Guide](../docs/ARCHITECTURE.md)
- [API Reference](../docs/API.md)
- [Keyboard Shortcuts](../docs/KEYBOARD_SHORTCUTS.md)
- [README](../README.md)

### External Resources
- [Mastra Documentation](https://mastra.ai/docs)
- [React Flow](https://reactflow.dev)
- [Zustand](https://zustand-demo.pmnd.rs)
- [Vite](https://vitejs.dev)

### Community
- Mastra Discord
- GitHub Issues
- Stack Overflow (`mastra` tag)

---

## Conclusion

The Standalone Visual Agent Builder is a **production-ready application** with all core features implemented and tested. Future enhancements are entirely optional and can be prioritized based on user feedback and business needs.

**Current Status:**
- ✅ Production ready
- ✅ 51 tests passing
- ✅ Zero errors
- ✅ Complete documentation
- ✅ Multiple deployment options
- ✅ Full feature set

**Next Steps:**
1. Deploy to production
2. Gather user feedback
3. Prioritize Phase 8 enhancements
4. Build community

---

**Document Version:** 1.0  
**Last Updated:** October 9, 2025  
**Status:** Production Ready ✅  
**Extracted From:** Mastra Monorepo v0.1.0

