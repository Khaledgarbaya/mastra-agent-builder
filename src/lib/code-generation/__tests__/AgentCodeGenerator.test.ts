import { describe, it, expect } from 'vitest';
import { AgentCodeGenerator } from '../AgentCodeGenerator';
import { createMockAgentNode } from '../../../test/testUtils';
import type { AgentBuilderConfig } from '../../../types';

describe('AgentCodeGenerator', () => {
  it('should generate basic agent code', () => {
    const node = createMockAgentNode();
    const generator = new AgentCodeGenerator();
    const code = generator.generate(node.data.config as AgentBuilderConfig);

    expect(code).toContain('new Agent');
    expect(code).toContain('testAgent');
    expect(code).toContain('Test Agent');
    expect(code).toContain('Test instructions');
    expect(code).toContain('gpt-4o-mini');
  });

  it('should include model configuration', () => {
    const node = createMockAgentNode();
    (node.data.config as any).model = {
      provider: 'anthropic',
      name: 'claude-3-5-sonnet-latest',
    };

    const generator = new AgentCodeGenerator();
    const code = generator.generate(node.data.config as AgentBuilderConfig);
    expect(code).toContain('claude-3-5-sonnet-latest');
  });

  it('should include tools when specified', () => {
    const node = createMockAgentNode();
    (node.data.config as any).tools = ['tool1', 'tool2'];

    const generator = new AgentCodeGenerator();
    const code = generator.generate(node.data.config as AgentBuilderConfig);
    expect(code).toContain('tools:');
    expect(code).toContain('tool1');
    expect(code).toContain('tool2');
  });

  it('should include workflows when specified', () => {
    const node = createMockAgentNode();
    (node.data.config as any).workflows = ['workflow1'];

    const generator = new AgentCodeGenerator();
    const code = generator.generate(node.data.config as AgentBuilderConfig);
    expect(code).toContain('workflows:');
    expect(code).toContain('workflow1');
  });

  it('should include memory configuration', () => {
    const node = createMockAgentNode();
    (node.data.config as any).memory = {
      type: 'buffer',
      maxMessages: 20,
    };

    const generator = new AgentCodeGenerator();
    const code = generator.generate(node.data.config as AgentBuilderConfig);
    expect(code).toContain('memory:');
    expect(code).toContain('buffer');
    expect(code).toContain('20');
  });

  it('should handle agents with minimal config', () => {
    const node = createMockAgentNode();
    delete (node.data.config as any).tools;
    delete (node.data.config as any).workflows;
    delete (node.data.config as any).memory;

    const generator = new AgentCodeGenerator();
    const code = generator.generate(node.data.config as AgentBuilderConfig);
    expect(code).toContain('new Agent');
    expect(code).toContain('testAgent');
  });

  it('should properly format instructions', () => {
    const node = createMockAgentNode();
    (node.data.config as any).instructions = `Multi-line
instructions
here`;

    const generator = new AgentCodeGenerator();
    const code = generator.generate(node.data.config as AgentBuilderConfig);
    expect(code).toContain('`');
    expect(code).toContain('Multi-line');
  });

  it('should generate agent without errors when model settings provided', () => {
    const node = createMockAgentNode();
    (node.data.config as any).modelSettings = {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 1000,
    };

    const generator = new AgentCodeGenerator();
    const code = generator.generate(node.data.config as AgentBuilderConfig);
    expect(code).toContain('new Agent');
    expect(code).toContain('testAgent');
    // Note: modelSettings may not be directly in agent code based on current implementation
  });
});
