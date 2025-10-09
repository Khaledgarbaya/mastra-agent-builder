import type { SchemaField } from './workflow';

/**
 * Tool configuration in the visual builder
 */
export interface ToolBuilderConfig {
  id: string;
  description: string;
  inputSchema?: SchemaField[];
  outputSchema?: SchemaField[];
  suspendSchema?: SchemaField[];
  resumeSchema?: SchemaField[];
  executeCode: string;
  requireApproval?: boolean;
  category?: ToolCategory;
  tags?: string[];
}

export type ToolCategory = 'api' | 'database' | 'file' | 'email' | 'math' | 'string' | 'data' | 'ai' | 'custom';

/**
 * Tool validation result
 */
export interface ToolValidationResult {
  valid: boolean;
  errors: ToolValidationError[];
  warnings: ToolValidationError[];
}

export interface ToolValidationError {
  type: 'error' | 'warning';
  field: string;
  message: string;
}

/**
 * Tool templates
 */
export interface ToolTemplate {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  config: Partial<ToolBuilderConfig>;
  tags: string[];
}

/**
 * Tool execution test
 */
export interface ToolTestConfig {
  input: Record<string, any>;
  expectedOutput?: Record<string, any>;
}

export interface ToolTestResult {
  success: boolean;
  output?: any;
  error?: string;
  duration: number;
}
