export type { SchemaField } from './workflow';

/**
 * Agent configuration in the visual builder
 */
export interface AgentBuilderConfig {
  id: string;
  name: string;
  description?: string;
  instructions: string;
  model: ModelConfig;
  maxRetries?: number;
  tools: string[]; // Simplified: just tool IDs for now
  workflows: string[]; // Simplified: just workflow IDs for now
  agents: string[]; // Simplified: just agent IDs for now
  memory?: MemoryConfig;
  enableTracing?: boolean;
  defaultGenerateOptions?: GenerateOptions;
  defaultStreamOptions?: StreamOptions;
  scorers?: ScorerReference[];
  voice?: VoiceConfig;
  inputProcessors?: ProcessorConfig[];
  outputProcessors?: ProcessorConfig[];
}

export interface ModelConfig {
  provider: ModelProvider;
  name: string;
  // Fallback models
  fallbacks?: ModelConfig[];
  // Model settings
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stopSequences?: string[];
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'mistral' | 'groq' | 'cohere' | 'custom';

export interface ToolReference {
  toolId: string;
  toolName: string;
  toolDescription?: string;
  config?: Record<string, any>;
}

export interface WorkflowReference {
  workflowId: string;
  workflowName: string;
  workflowDescription?: string;
  config?: Record<string, any>;
}

export interface AgentReference {
  agentId: string;
  agentName: string;
  agentDescription?: string;
}

export interface MemoryConfig {
  type: 'none' | 'buffer' | 'summary' | 'token' | 'vector' | 'custom';
  maxMessages?: number;
  storage?: {
    type: 'inmemory' | 'redis' | 'postgres' | 'libsql';
    config?: Record<string, any>;
  };
  retrieval?: {
    lastMessages?: number;
    similarityThreshold?: number;
    maxResults?: number;
  };
  threadConfig?: {
    autoCreate?: boolean;
    persistThreads?: boolean;
  };
}

export interface GenerateOptions {
  maxSteps?: number;
  onStepFinish?: string; // Code string
}

export interface StreamOptions {
  maxSteps?: number;
  onStepFinish?: string; // Code string
}

export interface ScorerReference {
  scorerId: string;
  scorerName: string;
  config?: Record<string, any>;
}

export interface VoiceConfig {
  provider: 'elevenlabs' | 'custom';
  config?: Record<string, any>;
}

export interface ProcessorConfig {
  name: string;
  code: string; // Function code as string
}

/**
 * Agent validation result
 */
export interface AgentValidationResult {
  valid: boolean;
  errors: AgentValidationError[];
  warnings: AgentValidationError[];
}

export interface AgentValidationError {
  type: 'error' | 'warning';
  field: string;
  message: string;
}

/**
 * Agent templates
 */
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'customer-service' | 'research' | 'coding' | 'data-analysis' | 'content' | 'custom';
  config: Partial<AgentBuilderConfig>;
  tags: string[];
}
