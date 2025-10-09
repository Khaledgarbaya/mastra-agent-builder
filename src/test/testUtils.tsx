import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import type { CanvasNode, AgentBuilderConfig, StepBuilderConfig, ToolBuilderConfig } from '../types';

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Custom render function if needed in the future
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { ...options });
}

// Mock data factories for testing
export const createMockAgentNode = (overrides?: Partial<CanvasNode>): CanvasNode => ({
  id: 'agent-1',
  type: 'agent',
  position: { x: 0, y: 0 },
  data: {
    type: 'agent',
    config: {
      id: 'testAgent',
      name: 'Test Agent',
      description: 'A test agent',
      instructions: 'Test instructions',
      model: {
        provider: 'openai',
        name: 'gpt-4o-mini',
      },
      tools: [],
      workflows: [],
      agents: [],
    } as AgentBuilderConfig,
  },
  ...overrides,
});

export const createMockStepNode = (overrides?: Partial<CanvasNode>): CanvasNode => ({
  id: 'step-1',
  type: 'step',
  position: { x: 0, y: 0 },
  data: {
    type: 'step',
    config: {
      id: 'testStep',
      description: 'A test step',
      executeCode: 'async ({ input }) => { return { output: input }; }',
    } as StepBuilderConfig,
  },
  ...overrides,
});

export const createMockToolNode = (overrides?: Partial<CanvasNode>): CanvasNode => ({
  id: 'tool-1',
  type: 'tool',
  position: { x: 0, y: 0 },
  data: {
    type: 'tool',
    config: {
      id: 'testTool',
      description: 'A test tool',
      executeCode: 'async ({ input }) => { return { result: input }; }',
    } as ToolBuilderConfig,
  },
  ...overrides,
});
