import type { StepBuilderConfig, SchemaField } from '../../types';

/**
 * Generates Mastra step code from visual configuration
 */
export class StepCodeGenerator {
  /**
   * Generate createStep() call from step configuration
   */
  generate(config: StepBuilderConfig): string {
    const lines: string[] = [];

    // Import statement
    lines.push(`import { createStep } from '@mastra/core';`);
    lines.push(`import { z } from 'zod';`);
    lines.push(``);

    // Generate input schema
    if (config.inputSchema && config.inputSchema.length > 0) {
      lines.push(`const ${this.getSchemaVarName(config.id, 'input')} = z.object({`);
      config.inputSchema.forEach(field => {
        lines.push(`  ${field.name}: ${this.generateZodType(field)},`);
      });
      lines.push(`});`);
      lines.push(``);
    }

    // Generate output schema
    if (config.outputSchema && config.outputSchema.length > 0) {
      lines.push(`const ${this.getSchemaVarName(config.id, 'output')} = z.object({`);
      config.outputSchema.forEach(field => {
        lines.push(`  ${field.name}: ${this.generateZodType(field)},`);
      });
      lines.push(`});`);
      lines.push(``);
    }

    // Generate step
    lines.push(`export const ${this.getStepVarName(config.id)} = createStep({`);
    lines.push(`  id: '${config.id}',`);

    if (config.description) {
      lines.push(`  description: '${this.escapeString(config.description)}',`);
    }

    // Add schemas
    if (config.inputSchema && config.inputSchema.length > 0) {
      lines.push(`  inputSchema: ${this.getSchemaVarName(config.id, 'input')},`);
    }
    if (config.outputSchema && config.outputSchema.length > 0) {
      lines.push(`  outputSchema: ${this.getSchemaVarName(config.id, 'output')},`);
    }

    // Add execute function
    if (config.executeCode) {
      lines.push(`  execute: ${config.executeCode},`);
    } else {
      // Default execute function
      lines.push(`  execute: async ({ context }) => {`);
      lines.push(`    // TODO: Implement step logic`);
      lines.push(`    throw new Error('Step not implemented');`);
      lines.push(`  },`);
    }

    lines.push(`});`);

    return lines.join('\n');
  }

  /**
   * Generate variable name for step
   */
  private getStepVarName(id: string): string {
    return this.toCamelCase(id) + 'Step';
  }

  /**
   * Generate variable name for schema
   */
  private getSchemaVarName(id: string, type: 'input' | 'output'): string {
    return this.toCamelCase(id) + type.charAt(0).toUpperCase() + type.slice(1) + 'Schema';
  }

  /**
   * Convert kebab-case to camelCase
   */
  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
  }

  /**
   * Generate Zod type from field configuration
   */
  private generateZodType(field: SchemaField): string {
    let type = '';

    switch (field.type) {
      case 'string':
        type = 'z.string()';
        break;
      case 'number':
        type = 'z.number()';
        if (field.validation) {
          const minRule = field.validation.find(v => v.type === 'min');
          const maxRule = field.validation.find(v => v.type === 'max');
          if (minRule && minRule.value !== undefined) type += `.min(${minRule.value})`;
          if (maxRule && maxRule.value !== undefined) type += `.max(${maxRule.value})`;
        }
        break;
      case 'boolean':
        type = 'z.boolean()';
        break;
      case 'date':
        type = 'z.date()';
        break;
      case 'array':
        type = 'z.array(z.any())';
        break;
      case 'object':
        type = 'z.record(z.any())';
        break;
      default:
        type = 'z.any()';
    }

    // Add optional/required
    if (field.optional) {
      type += '.optional()';
    }

    // Add description
    if (field.description) {
      type += `.describe('${this.escapeString(field.description)}')`;
    }

    // Add default value
    if (field.defaultValue !== undefined && field.defaultValue !== '') {
      const defaultValue =
        typeof field.defaultValue === 'string' ? `'${this.escapeString(field.defaultValue)}'` : field.defaultValue;
      type += `.default(${defaultValue})`;
    }

    return type;
  }

  /**
   * Escape string for code generation
   */
  private escapeString(str: string): string {
    return str.replace(/'/g, "\\'").replace(/\n/g, '\\n');
  }
}
