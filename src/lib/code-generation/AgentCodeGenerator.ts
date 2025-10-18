import type { AgentBuilderConfig } from '../../types';

/**
 * Generates Mastra agent code from visual configuration
 */
export class AgentCodeGenerator {
  /**
   * Generate Agent constructor from agent configuration
   */
  generate(config: AgentBuilderConfig): string {
    const lines: string[] = [];

    // Import statements
    lines.push(`import { Agent } from '@mastra/core';`);
    
    // Import model from appropriate SDK based on provider
    const provider = config.model.provider.toLowerCase();
    if (provider === 'openai') {
      lines.push(`import { openai } from '@ai-sdk/openai';`);
    } else if (provider === 'anthropic') {
      lines.push(`import { anthropic } from '@ai-sdk/anthropic';`);
    } else if (provider === 'google') {
      lines.push(`import { google } from '@ai-sdk/google';`);
    }

    // Add tool imports if tools are attached
    if (config.tools && config.tools.length > 0) {
      const toolImports = config.tools.map(toolId => {
        const varName = this.toCamelCase(toolId) + 'Tool';
        return varName;
      });
      lines.push(`import { ${toolImports.join(', ')} } from '../tools';`);
    }

    // Add workflow imports if workflows are attached
    if (config.workflows && config.workflows.length > 0) {
      const workflowImports = config.workflows.map(wfId => {
        const varName = this.toCamelCase(wfId) + 'Workflow';
        return varName;
      });
      lines.push(`import { ${workflowImports.join(', ')} } from '../workflows';`);
    }

    lines.push(``);

    // Generate agent
    lines.push(`export const ${this.getAgentVarName(config.id)} = new Agent({`);
    lines.push(`  name: '${config.name}',`);
    lines.push(`  instructions: \``);
    lines.push(this.escapeBackticks(config.instructions));
    lines.push(`  \`,`);

    if (config.description) {
      lines.push(`  description: '${this.escapeString(config.description)}',`);
    }

    // Model configuration - use proper AI SDK model instance
    const modelName = config.model.name;
    
    if (provider === 'openai') {
      lines.push(`  model: openai('${modelName}'),`);
    } else if (provider === 'anthropic') {
      lines.push(`  model: anthropic('${modelName}'),`);
    } else if (provider === 'google') {
      lines.push(`  model: google('${modelName}'),`);
    } else {
      // Fallback to openai if unknown provider
      lines.push(`  model: openai('gpt-4o-mini'),`);
    }

    // Tools
    if (config.tools && config.tools.length > 0) {
      lines.push(`  tools: {`);
      config.tools.forEach(toolId => {
        const varName = this.toCamelCase(toolId) + 'Tool';
        lines.push(`    ${varName},`);
      });
      lines.push(`  },`);
    }

    // Workflows
    if (config.workflows && config.workflows.length > 0) {
      lines.push(`  workflows: {`);
      config.workflows.forEach(wfId => {
        const varName = this.toCamelCase(wfId) + 'Workflow';
        lines.push(`    ${varName},`);
      });
      lines.push(`  },`);
    }

    // Memory configuration
    if (config.memory && config.memory.type !== 'none') {
      lines.push(`  memory: {`);
      lines.push(`    type: '${config.memory.type}',`);
      if (config.memory.maxMessages) {
        lines.push(`    maxMessages: ${config.memory.maxMessages},`);
      }
      lines.push(`  },`);
    }

    // Max retries
    if (config.maxRetries !== undefined) {
      lines.push(`  maxRetries: ${config.maxRetries},`);
    }

    // Enable tracing
    if (config.enableTracing) {
      lines.push(`  enableTracing: true,`);
    }

    lines.push(`});`);

    return lines.join('\n');
  }

  /**
   * Generate variable name for agent
   */
  private getAgentVarName(id: string): string {
    return this.toCamelCase(id) + 'Agent';
  }

  /**
   * Convert kebab-case to camelCase
   */
  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
  }

  /**
   * Escape string for code generation
   */
  private escapeString(str: string): string {
    return str.replace(/'/g, "\\'").replace(/\n/g, '\\n');
  }

  /**
   * Escape backticks in template literals
   */
  private escapeBackticks(str: string): string {
    return str.replace(/`/g, '\\`').replace(/\${/g, '\\${');
  }
}
