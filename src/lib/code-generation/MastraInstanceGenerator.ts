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
      // Deduplicate agent imports by ID
      const uniqueAgentIds = [...new Set(agentNodes.map(node => (node.data as any).config.id))];
      const agentImports = uniqueAgentIds.map(agentId => {
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
      // Deduplicate tool imports by ID
      const uniqueToolIds = [...new Set(toolNodes.map(node => (node.data as any).config.id))];
      const toolImports = uniqueToolIds.map(toolId => {
        return this.toCamelCase(toolId) + 'Tool';
      });
      lines.push(`import { ${toolImports.join(', ')} } from './tools';`);
    }

    lines.push(``);

    // Create Mastra instance
    lines.push(`export const mastra = new Mastra({`);

    // Add agents (already filtered above, deduplicate by ID)
    if (agentNodes.length > 0) {
      const uniqueAgentIds = [...new Set(agentNodes.map(node => (node.data as any).config.id))];
      lines.push(`  agents: {`);
      uniqueAgentIds.forEach(agentId => {
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

    // Add tools (already filtered above, deduplicate by ID)
    if (toolNodes.length > 0) {
      const uniqueToolIds = [...new Set(toolNodes.map(node => (node.data as any).config.id))];
      lines.push(`  tools: {`);
      uniqueToolIds.forEach(toolId => {
        const varName = this.toCamelCase(toolId) + 'Tool';
        lines.push(`    '${toolId}': ${varName},`);
      });
      lines.push(`  },`);
    }

    // Skip storage and logger configuration for WebContainer preview
    // These require additional setup and dependencies that may not be available
    
    // Add telemetry (disabled in WebContainer to avoid network errors)
    lines.push(`  telemetry: {`);
    lines.push(`    enabled: false,`);
    lines.push(`  },`);

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
   * Convert kebab-case to camelCase
   */
  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
  }
}
