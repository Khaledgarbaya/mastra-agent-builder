import { describe, it, expect } from 'vitest';
import { StepCodeGenerator } from '../StepCodeGenerator';
import { createMockStepNode } from '../../../test/testUtils';
import type { StepBuilderConfig } from '../../../types';

describe('StepCodeGenerator', () => {
  it('should generate basic step code', () => {
    const node = createMockStepNode();
    const generator = new StepCodeGenerator();
    const code = generator.generate(node.data.config as StepBuilderConfig);

    expect(code).toContain('createStep');
    expect(code).toContain('testStep');
    expect(code).toContain('A test step');
    expect(code).toContain('async ({ input }) => { return { output: input }; }');
  });

  it('should handle steps without description', () => {
    const node = createMockStepNode();
    delete (node.data.config as any).description;

    const generator = new StepCodeGenerator();
    const code = generator.generate(node.data.config as StepBuilderConfig);
    expect(code).toContain('createStep');
    expect(code).toContain('testStep');
  });

  it('should properly format execute code', () => {
    const node = createMockStepNode();
    (node.data.config as any).executeCode = `async ({ input }) => {
  const result = input * 2;
  return { output: result };
}`;

    const generator = new StepCodeGenerator();
    const code = generator.generate(node.data.config as StepBuilderConfig);
    expect(code).toContain('input * 2');
    expect(code).toContain('return { output: result }');
  });

  it('should include input schema when provided', () => {
    const node = createMockStepNode();
    (node.data.config as any).inputSchema = [{ name: 'value', type: 'number', required: true }];

    const generator = new StepCodeGenerator();
    const code = generator.generate(node.data.config as StepBuilderConfig);
    expect(code).toContain('inputSchema:');
    expect(code).toContain('z.object');
    expect(code).toContain('value');
    expect(code).toContain('z.number()');
  });

  it('should include output schema when provided', () => {
    const node = createMockStepNode();
    (node.data.config as any).outputSchema = [{ name: 'result', type: 'string', required: true }];

    const generator = new StepCodeGenerator();
    const code = generator.generate(node.data.config as StepBuilderConfig);
    expect(code).toContain('output:');
    expect(code).toContain('z.object');
    expect(code).toContain('result');
    expect(code).toContain('z.string()');
  });

  it('should include optional schema fields', () => {
    const node = createMockStepNode();
    (node.data.config as any).inputSchema = [{ name: 'optionalField', type: 'string', required: false }];

    const generator = new StepCodeGenerator();
    const code = generator.generate(node.data.config as StepBuilderConfig);
    expect(code).toContain('optionalField');
    expect(code).toContain('z.string()');
  });
});
