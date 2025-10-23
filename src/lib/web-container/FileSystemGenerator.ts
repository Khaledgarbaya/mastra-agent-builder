import type { FileSystemTree } from '@webcontainer/api';
import type { ProjectConfig, ApiKeysConfig } from '../../types';
import { AgentCodeGenerator } from '../code-generation/AgentCodeGenerator';
import { ToolCodeGenerator } from '../code-generation/ToolCodeGenerator';
import { StepCodeGenerator } from '../code-generation/StepCodeGenerator';
import { MastraInstanceGenerator } from '../code-generation/MastraInstanceGenerator';
import { toCamelCase } from '../code-generation/codeGenUtils';

/**
 * Generates WebContainer-compatible file system tree from project configuration
 */
export class FileSystemGenerator {
  /**
   * Generate complete file system tree for WebContainer
   */
  generateWebContainerFiles(project: ProjectConfig, apiKeys: ApiKeysConfig): FileSystemTree {
    const files: FileSystemTree = {
      'package.json': {
        file: {
          contents: this.generatePackageJson(project),
        },
      },
      '.env': {
        file: {
          contents: this.generateEnvFile(apiKeys),
        },
      },
      'src': {
        directory: {
          'mastra': {
            directory: this.generateMastraDirectory(project),
          },
        },
      },
    };

    return files;
  }

  /**
   * Generate package.json content
   */
  private generatePackageJson(_project: ProjectConfig): string {
    const packageJson = {
      name: 'mastra-preview',
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'mastra dev',
      },
      dependencies: {
        '@mastra/core': 'latest',
        mastra: 'latest',
        '@ai-sdk/openai': 'latest',
        '@ai-sdk/anthropic': 'latest',
        '@ai-sdk/google': 'latest',
        zod: 'latest',
      },
    };

    return JSON.stringify(packageJson, null, 2);
  }

  /**
   * Generate .env file content
   */
  private generateEnvFile(apiKeys: ApiKeysConfig): string {
    const lines: string[] = [];

    // Add API keys
    if (apiKeys.openai) {
      lines.push(`OPENAI_API_KEY=${apiKeys.openai}`);
    }
    if (apiKeys.anthropic) {
      lines.push(`ANTHROPIC_API_KEY=${apiKeys.anthropic}`);
    }
    if (apiKeys.google) {
      lines.push(`GOOGLE_GENERATIVE_AI_API_KEY=${apiKeys.google}`);
    }

    // Set port for Mastra dev server (if it supports PORT env var)
    lines.push('PORT=4111');

    return lines.join('\n');
  }

  /**
   * Generate Mastra directory structure
   */
  private generateMastraDirectory(project: ProjectConfig): FileSystemTree {
    const mastraDir: FileSystemTree = {
      'index.ts': {
        file: {
          contents: this.generateMastraIndex(project),
        },
      },
    };

    // Generate agents directory
    const agentNodes = project.nodes.filter(n => {
      const config = (n.data as any).config;
      return n.type === 'agent' && config && config.id && config.name;
    });

    if (agentNodes.length > 0) {
      const agentsDir: FileSystemTree = {};
      const agentGenerator = new AgentCodeGenerator();

      // Get list of available tool IDs from tool nodes
      const toolNodes = project.nodes.filter(n => {
        const config = (n.data as any).config;
        return n.type === 'tool' && config && config.id && config.description;
      });
      const availableToolIds = new Set(toolNodes.map(node => (node.data as any).config.id));

      // Workflows are not implemented as separate nodes yet, so no workflows are available
      // Agent config may reference them, but we filter them out
      const availableWorkflowIds = new Set<string>();

      // Deduplicate agents by ID
      const uniqueAgentIds = [...new Set(agentNodes.map(node => (node.data as any).config.id))];
      
      uniqueAgentIds.forEach(agentId => {
        const node = agentNodes.find(n => (n.data as any).config.id === agentId);
        if (node) {
          const config = (node.data as any).config;
          
          // Filter out tool and workflow references that don't have corresponding nodes
          const filteredConfig = {
            ...config,
            tools: config.tools ? config.tools.filter((toolId: string) => availableToolIds.has(toolId)) : [],
            workflows: config.workflows ? config.workflows.filter((wfId: string) => availableWorkflowIds.has(wfId)) : [],
          };
          
          const code = agentGenerator.generate(filteredConfig);
          agentsDir[`${config.id}.ts`] = {
            file: {
              contents: code,
            },
          };
        }
      });

      // Create index.ts for agents (deduplicated)
      const agentExports = uniqueAgentIds
        .map(agentId => {
          const varName = toCamelCase(agentId) + 'Agent';
          return `export { ${varName} } from './${agentId}';`;
        })
        .join('\n');

      agentsDir['index.ts'] = {
        file: {
          contents: agentExports,
        },
      };

      mastraDir['agents'] = {
        directory: agentsDir,
      };
    }

    // Generate tools directory
    const toolNodes = project.nodes.filter(n => {
      const config = (n.data as any).config;
      return n.type === 'tool' && config && config.id && config.description;
    });

    if (toolNodes.length > 0) {
      const toolsDir: FileSystemTree = {};
      const toolGenerator = new ToolCodeGenerator();

      // Deduplicate tools by ID
      const uniqueToolIds = [...new Set(toolNodes.map(node => (node.data as any).config.id))];
      
      uniqueToolIds.forEach(toolId => {
        const node = toolNodes.find(n => (n.data as any).config.id === toolId);
        if (node) {
          const config = (node.data as any).config;
          const code = toolGenerator.generate(config);
          toolsDir[`${config.id}.ts`] = {
            file: {
              contents: code,
            },
          };
        }
      });

      // Create index.ts for tools (deduplicated)
      const toolExports = uniqueToolIds
        .map(toolId => {
          const varName = toCamelCase(toolId) + 'Tool';
          return `export { ${varName} } from './${toolId}';`;
        })
        .join('\n');

      toolsDir['index.ts'] = {
        file: {
          contents: toolExports,
        },
      };

      mastraDir['tools'] = {
        directory: toolsDir,
      };
    }

    // Generate steps directory
    const stepNodes = project.nodes.filter(n => {
      const config = (n.data as any).config;
      return n.type === 'step' && config && config.id && config.id.trim() !== '';
    });

    if (stepNodes.length > 0) {
      const stepsDir: FileSystemTree = {};
      const stepGenerator = new StepCodeGenerator();

      // Deduplicate steps by ID
      const uniqueStepIds = [...new Set(stepNodes.map(node => (node.data as any).config.id))];
      
      uniqueStepIds.forEach(stepId => {
        const node = stepNodes.find(n => (n.data as any).config.id === stepId);
        if (node) {
          const config = (node.data as any).config;
          const code = stepGenerator.generate(config);
          stepsDir[`${config.id}.ts`] = {
            file: {
              contents: code,
            },
          };
        }
      });

      // Create index.ts for steps (deduplicated)
      const stepExports = uniqueStepIds
        .map(stepId => {
          const varName = toCamelCase(stepId) + 'Step';
          return `export { ${varName} } from './${stepId}';`;
        })
        .join('\n');

      stepsDir['index.ts'] = {
        file: {
          contents: stepExports,
        },
      };

      mastraDir['steps'] = {
        directory: stepsDir,
      };
    }

    // Check if any agents reference workflows
    const hasWorkflowReferences = agentNodes.some(node => {
      const config = (node.data as any).config;
      return config.workflows && config.workflows.length > 0;
    });

    // Create empty workflows directory if agents reference them but none exist
    if (hasWorkflowReferences && !mastraDir['workflows']) {
      mastraDir['workflows'] = {
        directory: {
          'index.ts': {
            file: {
              contents: '// Workflows will be defined here\n',
            },
          },
        },
      };
    }

    return mastraDir;
  }

  /**
   * Generate main Mastra index.ts file
   */
  private generateMastraIndex(project: ProjectConfig): string {
    const generator = new MastraInstanceGenerator();
    return generator.generate(project);
  }
}

