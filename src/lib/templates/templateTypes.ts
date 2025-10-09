import type { ProjectConfig } from '../../types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  icon: string;
  tags: string[];
  project: ProjectConfig;
  preview?: string; // Base64 image or URL
}

export type TemplateCategory = 'agent' | 'workflow' | 'tool' | 'complete';

export interface AgentTemplate extends Template {
  category: 'agent';
  agentConfig: {
    name: string;
    description: string;
    instructions: string;
    model?: {
      provider: string;
      name: string;
    };
    tools?: string[];
    workflows?: string[];
    memory?: {
      type: 'buffer' | 'summary';
      maxMessages?: number;
    };
  };
}

export interface WorkflowTemplate extends Template {
  category: 'workflow';
  workflowConfig: {
    name: string;
    description: string;
    steps: Array<{
      id: string;
      type: string;
      config: any;
    }>;
    connections: Array<{
      source: string;
      target: string;
    }>;
  };
}

export interface ToolTemplate extends Template {
  category: 'tool';
  toolConfig: {
    id: string;
    description: string;
    inputSchema: any;
    outputSchema: any;
    executeCode: string;
    requireApproval?: boolean;
  };
}

export interface CompleteTemplate extends Template {
  category: 'complete';
  completeConfig: {
    name: string;
    description: string;
    agents: AgentTemplate['agentConfig'][];
    workflows: WorkflowTemplate['workflowConfig'][];
    tools: ToolTemplate['toolConfig'][];
    projectSettings: any;
  };
}
