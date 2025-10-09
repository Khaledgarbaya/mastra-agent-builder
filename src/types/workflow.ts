import type { Node, Edge } from '@xyflow/react';

/**
 * Schema field definition for the visual schema builder
 */
export interface SchemaField {
  id: string;
  name: string;
  type: SchemaFieldType;
  description?: string;
  optional: boolean;
  defaultValue?: any;
  validation?: ValidationRule[];
  // For nested objects
  children?: SchemaField[];
  // For arrays
  arrayItemType?: SchemaFieldType;
  arrayItemSchema?: SchemaField[];
}

export type SchemaFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'object'
  | 'array'
  | 'enum'
  | 'any'
  | 'unknown'
  | 'null'
  | 'undefined';

export interface ValidationRule {
  type: 'min' | 'max' | 'length' | 'regex' | 'email' | 'url' | 'uuid' | 'custom';
  value?: any;
  message?: string;
}

/**
 * Step configuration in the visual builder
 * Note: This is just the configuration data, not the canvas node itself
 */
export interface StepBuilderConfig {
  id: string;
  description?: string;
  inputSchema?: SchemaField[];
  outputSchema?: SchemaField[];
  resumeSchema?: SchemaField[];
  suspendSchema?: SchemaField[];
  executeCode?: string;
  // For conditional steps
  condition?: ConditionalConfig;
  // For loop steps
  loopConfig?: LoopConfig;
  // For parallel steps
  parallelSteps?: StepBuilderConfig[];
  // For sleep/wait steps
  sleepConfig?: SleepConfig;
  // For foreach steps
  mapConfig?: MapConfig;
  // For wait for event steps
  eventConfig?: EventConfig;
  // For nested workflows
  nestedWorkflowId?: string;
}

export type StepType =
  | 'step'
  | 'conditional'
  | 'loop'
  | 'parallel'
  | 'sleep'
  | 'sleepUntil'
  | 'waitForEvent'
  | 'foreach';

export interface ConditionalConfig {
  id: string;
  conditions: Array<{
    type: 'if' | 'else' | 'when';
    expression: string;
    stepId?: string;
  }>;
}

export interface LoopConfig {
  type: 'while' | 'until' | 'dowhile' | 'dountil';
  condition: string;
  maxIterations?: number;
}

export interface SleepConfig {
  type: 'sleep' | 'sleepUntil';
  duration?: number; // milliseconds
  date?: string; // ISO date string
}

export interface MapConfig {
  iteratorName: string;
  arrayPath: string;
}

export interface EventConfig {
  eventName: string;
  timeoutMs?: number;
}

/**
 * Workflow configuration in the visual builder
 */
export interface WorkflowBuilderConfig {
  id: string;
  description?: string;
  inputSchema?: SchemaField[];
  outputSchema?: SchemaField[];
  stateSchema?: SchemaField[];
  steps: StepBuilderConfig[];
  connections: WorkflowConnection[];
  retryConfig?: {
    attempts?: number;
    delay?: number;
  };
  // Canvas state
  nodes: Node[];
  edges: Edge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface WorkflowConnection {
  sourceStepId: string;
  targetStepId: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  type?: 'then' | 'if' | 'else' | 'parallel';
}

/**
 * Validation error types
 */
export interface ValidationError {
  type: 'error' | 'warning';
  field: string;
  message: string;
  stepId?: string;
}

export interface WorkflowValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
