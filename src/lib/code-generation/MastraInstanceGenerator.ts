import type { ProjectConfig, CanvasNode } from '../../types';

/**
 * Generates complete Mastra instance configuration
 */
export class MastraInstanceGenerator {
  /**
   * Generate Mastra instance from project configuration
   */
  generate(project: ProjectConfig): string {
    const lines: string[] = [];

    // Import Mastra
    lines.push(`import { Mastra } from '@mastra/core';`);

    // Import agents (only those with valid config)
    const agentNodes = project.nodes.filter(n => {
      const config = (n.data as any).config;
      return n.type === 'agent' && config && config.id && config.name;
    });
    if (agentNodes.length > 0) {
      const agentImports = agentNodes.map(node => {
        const agentId = (node.data as any).config.id;
        return this.toCamelCase(agentId) + 'Agent';
      });
      lines.push(`import { ${agentImports.join(', ')} } from './agents';`);
    }

    // Import workflows (if any workflow-like structures exist)
    const workflowNodes = this.findWorkflows(project.nodes);
    if (workflowNodes.length > 0) {
      const workflowImports = workflowNodes.map(wf => {
        return this.toCamelCase(wf.id) + 'Workflow';
      });
      lines.push(`import { ${workflowImports.join(', ')} } from './workflows';`);
    }

    // Import tools (only those with valid config)
    const toolNodes = project.nodes.filter(n => {
      const config = (n.data as any).config;
      return n.type === 'tool' && config && config.id && config.description;
    });
    if (toolNodes.length > 0) {
      const toolImports = toolNodes.map(node => {
        const toolId = (node.data as any).config.id;
        return this.toCamelCase(toolId) + 'Tool';
      });
      lines.push(`import { ${toolImports.join(', ')} } from './tools';`);
    }

    // Import storage, logger if configured
    if (project.settings?.storage?.type) {
      const storageType = project.settings.storage.type;
      if (storageType === 'libsql') {
        lines.push(`import { LibSQLStore } from '@mastra/core';`);
      } else if (storageType === 'postgres') {
        lines.push(`import { PostgresStore } from '@mastra/core';`);
      } else if (storageType === 'redis') {
        lines.push(`import { RedisStore } from '@mastra/core';`);
      }
    }

    if (project.settings?.logger?.type === 'pino') {
      lines.push(`import { PinoLogger } from '@mastra/core';`);
    }

    lines.push(``);

    // Create Mastra instance
    lines.push(`export const mastra = new Mastra({`);

    // Add agents (already filtered above)
    if (agentNodes.length > 0) {
      lines.push(`  agents: {`);
      agentNodes.forEach(node => {
        const agentId = (node.data as any).config.id;
        const varName = this.toCamelCase(agentId) + 'Agent';
        lines.push(`    '${agentId}': ${varName},`);
      });
      lines.push(`  },`);
    }

    // Add workflows
    if (workflowNodes.length > 0) {
      lines.push(`  workflows: {`);
      workflowNodes.forEach(wf => {
        const varName = this.toCamelCase(wf.id) + 'Workflow';
        lines.push(`    ${wf.id}: ${varName},`);
      });
      lines.push(`  },`);
    }

    // Add tools (already filtered above)
    if (toolNodes.length > 0) {
      lines.push(`  tools: {`);
      toolNodes.forEach(node => {
        const toolId = (node.data as any).config.id;
        const varName = this.toCamelCase(toolId) + 'Tool';
        lines.push(`    '${toolId}': ${varName},`);
      });
      lines.push(`  },`);
    }

    // Add storage
    if (project.settings?.storage?.type && project.settings.storage.type !== 'memory') {
      lines.push(`  storage: ${this.generateStorageConfig(project.settings.storage)},`);
    }

    // Add logger
    if (project.settings?.logger?.type && project.settings.logger.type !== 'console') {
      lines.push(`  logger: ${this.generateLoggerConfig(project.settings.logger)},`);
    }

    // Add telemetry
    if (project.settings?.telemetry?.enabled) {
      lines.push(`  telemetry: {`);
      lines.push(`    enabled: true,`);
      if (project.settings.telemetry.provider) {
        lines.push(`    provider: '${project.settings.telemetry.provider}',`);
      }
      lines.push(`  },`);
    }

    lines.push(`});`);

    return lines.join('\n');
  }

  /**
   * Find workflow structures from nodes
   * (Groups of connected steps, loops, etc.)
   */
  private findWorkflows(_nodes: CanvasNode[]): { id: string; name: string }[] {
    // For now, return empty array - workflows will be generated separately
    // In future, analyze connected step nodes to identify workflows
    return [];
  }

  /**
   * Generate storage configuration code
   */
  private generateStorageConfig(storage: { type?: string }): string {
    switch (storage.type) {
      case 'libsql':
        return `new LibSQLStore({ url: process.env.LIBSQL_URL || 'file:./mastra.db' })`;
      case 'postgres':
        return `new PostgresStore({ connectionString: process.env.DATABASE_URL })`;
      case 'redis':
        return `new RedisStore({ url: process.env.REDIS_URL })`;
      default:
        return `undefined`;
    }
  }

  /**
   * Generate logger configuration code
   */
  private generateLoggerConfig(logger: { type?: string }): string {
    switch (logger.type) {
      case 'pino':
        return `new PinoLogger({ name: 'mastra' })`;
      case 'console':
        return `console`;
      default:
        return `console`;
    }
  }

  /**
   * Convert kebab-case to camelCase
   */
  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
  }
}
