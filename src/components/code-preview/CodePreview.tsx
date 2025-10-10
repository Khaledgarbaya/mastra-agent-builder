import { useState, useMemo, useRef, useEffect } from 'react';
import { Code, Copy, Download, Check, FileCode, Package, ChevronDown } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useBuilderState } from '../../hooks';
import {
  AgentCodeGenerator,
  ToolCodeGenerator,
  StepCodeGenerator,
  MastraInstanceGenerator,
} from '../../lib/code-generation';
import { ExportDialog } from '../export';
import { FileExplorer } from './FileExplorer';

interface CodeFile {
  path: string;
  content: string;
}

// Helper function to determine language from file extension
function getLanguageFromFile(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'sql':
      return 'sql';
    case 'py':
      return 'python';
    case 'sh':
      return 'bash';
    default:
      return 'text';
  }
}

export function CodePreview() {
  const { project } = useBuilderState();
  const [selectedFile, setSelectedFile] = useState<string>('index.ts');
  const [copied, setCopied] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportHandler, setExportHandler] = useState<(() => void) | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [canExport, setCanExport] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportDialog(false);
      }
    };

    if (showExportDialog) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }

    return undefined;
  }, [showExportDialog]);

  // Generate all code files
  const codeFiles = useMemo<CodeFile[]>(() => {
    if (!project) return [];

    const files: CodeFile[] = [];
    const skippedNodes: string[] = [];

    // Generate agent files
    const agentNodes = project.nodes.filter(n => n.type === 'agent');
    agentNodes.forEach(node => {
      const config = (node.data as any).config;
      if (config && config.id && config.name) {
        const generator = new AgentCodeGenerator();
        const code = generator.generate(config);
        files.push({
          path: `agents/${config.id}.ts`,
          content: code,
        });
      } else {
        skippedNodes.push(`Agent node (missing: ${!config?.id ? 'id' : 'name'})`);
      }
    });

    // Generate tool files
    const toolNodes = project.nodes.filter(n => n.type === 'tool');
    toolNodes.forEach(node => {
      const config = (node.data as any).config;
      if (config && config.id && config.description) {
        const generator = new ToolCodeGenerator();
        const code = generator.generate(config);
        files.push({
          path: `tools/${config.id}.ts`,
          content: code,
        });
      } else {
        skippedNodes.push(`Tool node (missing: ${!config?.id ? 'id' : 'description'})`);
      }
    });

    // Generate step files
    const stepNodes = project.nodes.filter(n => n.type === 'step');
    stepNodes.forEach(node => {
      const config = (node.data as any).config;
      if (config && config.id && config.id.trim() !== '') {
        const generator = new StepCodeGenerator();
        const code = generator.generate(config);
        files.push({
          path: `steps/${config.id}.ts`,
          content: code,
        });
      } else {
        skippedNodes.push(`Step node (missing: id)`);
      }
    });

    // Generate mastra instance
    const instanceGenerator = new MastraInstanceGenerator();
    const instanceCode = instanceGenerator.generate(project);
    files.push({
      path: 'index.ts',
      content: instanceCode,
    });

    // Add info about skipped nodes if any
    if (skippedNodes.length > 0) {
      files.push({
        path: '_NOTES.md',
        content: `# Code Generation Notes

## Skipped Nodes

The following nodes were not included in the generated code because they are missing required configuration:

${skippedNodes.map((msg, i) => `${i + 1}. ${msg}`).join('\n')}

**To include these nodes:**
1. Select each node on the canvas
2. Configure the required fields in the right panel
3. The code will update automatically

---
_This file is for informational purposes only and should not be included in your final project._
`,
      });
    }

    // Generate package.json
    files.push({
      path: 'package.json',
      content: generatePackageJson(project),
    });

    // Generate README.md
    files.push({
      path: 'README.md',
      content: generateReadme(project),
    });

    return files;
  }, [project]);

  const currentFile = codeFiles.find(f => f.path === selectedFile);

  const handleCopy = async () => {
    if (currentFile) {
      await navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadAll = () => {
    // For now, just download current file
    // TODO: Implement ZIP download in Phase 6
    if (currentFile) {
      const blob = new Blob([currentFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFile.path.split('/').pop() || 'file.ts';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No project loaded</p>
      </div>
    );
  }

  if (codeFiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Add nodes to the canvas to generate code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Generated Code</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-all duration-200 shadow-sm hover:shadow-md text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-all duration-200 shadow-sm hover:shadow-md text-foreground"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowExportDialog(!showExportDialog)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Package className="h-4 w-4" />
              Export Project
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${showExportDialog ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Export Dropdown */}
            {showExportDialog && (
              <div className="absolute top-full right-0 mt-2 w-[45rem] max-w-[95vw] h-[700px] max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col backdrop-blur-sm">
                <div className="p-4 flex-shrink-0 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Export Project</h2>
                      <p className="text-sm text-muted-foreground">Choose format and select files to export</p>
                    </div>
                    <button
                      onClick={() => {
                        if (exportHandler) {
                          exportHandler();
                        }
                      }}
                      disabled={isExporting || !canExport}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Package className="h-4 w-4" />
                      {isExporting ? 'Exporting...' : 'Export'}
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-h-0 p-4">
                  <ExportDialog
                    files={codeFiles}
                    projectName={project?.settings?.projectName || 'mastra-project'}
                    onClose={() => setShowExportDialog(false)}
                    onExportReady={(handler, exporting, canExportFiles) => {
                      setExportHandler(() => handler);
                      setIsExporting(exporting);
                      setCanExport(canExportFiles);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content area with file explorer and code view */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar */}
        <FileExplorer files={codeFiles} selectedFile={selectedFile} onSelectFile={setSelectedFile} />

        {/* Code content area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* File header */}
          <div className="p-3 border-b border-border bg-secondary/20 flex-shrink-0">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{selectedFile}</span>
              {currentFile && (
                <span className="text-xs text-muted-foreground">{currentFile.content.split('\n').length} lines</span>
              )}
            </div>
          </div>

          {/* Code content */}
          <div className="flex-1 overflow-auto bg-secondary/30 min-w-0">
            {currentFile ? (
              <div className="w-full overflow-x-auto" style={{ maxWidth: '100%', width: '100%' }}>
                <SyntaxHighlighter
                  language={getLanguageFromFile(currentFile.path)}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    background: 'transparent',
                    minWidth: '100%',
                    width: 'max-content',
                    maxWidth: 'none',
                    overflow: 'auto',
                  }}
                  showLineNumbers={true}
                  wrapLines={false}
                  wrapLongLines={false}
                  PreTag={({ children, ...props }) => (
                    <pre {...props} style={{ margin: 0, overflow: 'auto', maxWidth: '100%' }}>
                      {children}
                    </pre>
                  )}
                >
                  {currentFile.content}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="text-center text-muted-foreground p-8">File not found</div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-secondary/50 text-xs text-muted-foreground flex-shrink-0">
        {codeFiles.length} file{codeFiles.length !== 1 ? 's' : ''} generated •{' '}
        {currentFile && `${currentFile.content.split('\n').length} lines`}
      </div>
    </div>
  );
}

/**
 * Generate package.json content
 */
function generatePackageJson(project: any): string {
  return JSON.stringify(
    {
      name: project.settings?.projectName?.toLowerCase().replace(/\s+/g, '-') || 'mastra-project',
      version: '1.0.0',
      description: project.settings?.description || 'Generated by Mastra Visual Builder',
      main: 'index.ts',
      scripts: {
        dev: 'tsx watch index.ts',
        build: 'tsc',
        start: 'node dist/index.js',
      },
      dependencies: {
        '@mastra/core': '^0.1.0',
        zod: '^3.22.0',
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        typescript: '^5.0.0',
        tsx: '^4.0.0',
      },
    },
    null,
    2,
  );
}

/**
 * Generate README.md content
 */
function generateReadme(project: any): string {
  const projectName = project.settings?.projectName || 'Mastra Project';
  const description = project.settings?.description || 'AI application built with Mastra';

  return `# ${projectName}

${description}

## Generated by Mastra Visual Builder

This project was generated from the Mastra Visual Builder.

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Usage

\`\`\`typescript
import { mastra } from './index';

// Use your agents
const agent = mastra.getAgent('your-agent-id');
const result = await agent.generate('Your prompt');

// Use your workflows
const workflow = mastra.getWorkflow('your-workflow-id');
const workflowResult = await workflow.execute({ /* input */ });
\`\`\`

## Structure

- \`agents/\` - Agent definitions
- \`workflows/\` - Workflow definitions
- \`tools/\` - Tool definitions
- \`steps/\` - Workflow step definitions
- \`index.ts\` - Main Mastra instance

## Learn More

- [Mastra Documentation](https://mastra.ai/docs)
`;
}
