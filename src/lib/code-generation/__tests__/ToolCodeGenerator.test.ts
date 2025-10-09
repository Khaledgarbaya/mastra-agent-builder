import { describe, it, expect } from 'vitest';
import { ToolCodeGenerator } from '../ToolCodeGenerator';
import { createMockToolNode } from '../../../test/testUtils';
import type { ToolBuilderConfig } from '../../../types';

describe('ToolCodeGenerator', () => {
  it('should generate basic tool code', () => {
    const node = createMockToolNode();
    const generator = new ToolCodeGenerator();
    const code = generator.generate(node.data.config as ToolBuilderConfig);

    expect(code).toContain('createTool');
    expect(code).toContain('testTool');
    expect(code).toContain('A test tool');
    expect(code).toContain('async ({ input }) => { return { result: input }; }');
  });

  it('should include input schema', () => {
    const node = createMockToolNode();
    (node.data.config as any).inputSchema = [{ name: 'query', type: 'string', required: true }];

    const generator = new ToolCodeGenerator();
    const code = generator.generate(node.data.config as ToolBuilderConfig);
    expect(code).toContain('inputSchema:');
    expect(code).toContain('z.object');
    expect(code).toContain('query');
    expect(code).toContain('z.string()');
  });

  it('should include output schema', () => {
    const node = createMockToolNode();
    (node.data.config as any).outputSchema = [{ name: 'data', type: 'object', required: true }];

    const generator = new ToolCodeGenerator();
    const code = generator.generate(node.data.config as ToolBuilderConfig);
    expect(code).toContain('outputSchema:');
    expect(code).toContain('z.object');
    expect(code).toContain('data');
  });

  it('should include requireApproval when true', () => {
    const node = createMockToolNode();
    (node.data.config as any).requireApproval = true;

    const generator = new ToolCodeGenerator();
    const code = generator.generate(node.data.config as ToolBuilderConfig);
    expect(code).toContain('requireApproval: true');
  });

  it('should not include requireApproval when false', () => {
    const node = createMockToolNode();
    (node.data.config as any).requireApproval = false;

    const generator = new ToolCodeGenerator();
    const code = generator.generate(node.data.config as ToolBuilderConfig);
    expect(code).not.toContain('requireApproval');
  });

  it('should properly format execute function', () => {
    const node = createMockToolNode();
    (node.data.config as any).executeCode = `async ({ query }) => {
  // Fetch data
  const response = await fetch(query);
  return await response.json();
}`;

    const generator = new ToolCodeGenerator();
    const code = generator.generate(node.data.config as ToolBuilderConfig);
    expect(code).toContain('Fetch data');
    expect(code).toContain('fetch(query)');
    expect(code).toContain('response.json()');
  });

  it('should handle complex schema types', () => {
    const node = createMockToolNode();
    (node.data.config as any).inputSchema = [
      { name: 'items', type: 'array', required: true },
      { name: 'count', type: 'number', required: false },
      { name: 'active', type: 'boolean', required: true },
    ];

    const generator = new ToolCodeGenerator();
    const code = generator.generate(node.data.config as ToolBuilderConfig);
    expect(code).toContain('z.array');
    expect(code).toContain('z.number()');
    expect(code).toContain('z.boolean()');
    expect(code).toContain('items');
    expect(code).toContain('count');
    expect(code).toContain('active');
  });
});
