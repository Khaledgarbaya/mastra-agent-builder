import { describe, it, expect } from 'vitest';
import {
  validateAgentNode,
  validateStepNode,
  validateToolNode,
  validateAllNodes,
  hasErrors,
  hasWarnings,
  getNodeErrors,
} from '../nodeValidators';
import { createMockAgentNode, createMockStepNode, createMockToolNode } from '../../../test/testUtils';

describe('nodeValidators', () => {
  describe('validateAgentNode', () => {
    it('should pass validation for a valid agent node', () => {
      const node = createMockAgentNode();
      const errors = validateAgentNode(node);

      expect(errors).toHaveLength(0);
    });

    it('should fail when agent ID is missing', () => {
      const node = createMockAgentNode();
      (node.data.config as any).id = '';
      const errors = validateAgentNode(node);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('id');
      expect(errors[0].severity).toBe('error');
      expect(errors[0].message).toContain('ID is required');
    });

    it('should fail when agent name is missing', () => {
      const node = createMockAgentNode();
      (node.data.config as any).name = '';
      const errors = validateAgentNode(node);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('name');
      expect(errors[0].severity).toBe('error');
    });

    it('should warn when instructions are missing', () => {
      const node = createMockAgentNode();
      (node.data.config as any).instructions = '';
      const errors = validateAgentNode(node);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('instructions');
      expect(errors[0].severity).toBe('warning');
    });

    it('should warn when model configuration is incomplete', () => {
      const node = createMockAgentNode();
      (node.data.config as any).model = null;
      const errors = validateAgentNode(node);

      expect(errors.some(e => e.field === 'model')).toBe(true);
      expect(errors.find(e => e.field === 'model')?.severity).toBe('warning');
    });

    it('should return empty array for non-agent nodes', () => {
      const node = createMockStepNode();
      const errors = validateAgentNode(node);

      expect(errors).toHaveLength(0);
    });
  });

  describe('validateStepNode', () => {
    it('should pass validation for a valid step node', () => {
      const node = createMockStepNode();
      const errors = validateStepNode(node);

      expect(errors).toHaveLength(0);
    });

    it('should fail when step ID is missing', () => {
      const node = createMockStepNode();
      (node.data.config as any).id = '';
      const errors = validateStepNode(node);

      expect(errors.some(e => e.field === 'id' && e.severity === 'error')).toBe(true);
    });

    it('should fail when execute code is missing', () => {
      const node = createMockStepNode();
      (node.data.config as any).executeCode = '';
      const errors = validateStepNode(node);

      expect(errors.some(e => e.field === 'executeCode' && e.severity === 'error')).toBe(true);
    });

    it('should provide info when description is missing', () => {
      const node = createMockStepNode();
      (node.data.config as any).description = '';
      const errors = validateStepNode(node);

      expect(errors.some(e => e.field === 'description' && e.severity === 'info')).toBe(true);
    });

    it('should warn when execute code does not look like a function', () => {
      const node = createMockStepNode();
      (node.data.config as any).executeCode = 'invalid code here';
      const errors = validateStepNode(node);

      expect(errors.some(e => e.field === 'executeCode' && e.severity === 'warning')).toBe(true);
    });
  });

  describe('validateToolNode', () => {
    it('should pass validation for a valid tool node', () => {
      const node = createMockToolNode();
      const errors = validateToolNode(node);

      expect(errors).toHaveLength(0);
    });

    it('should fail when tool ID is missing', () => {
      const node = createMockToolNode();
      (node.data.config as any).id = '';
      const errors = validateToolNode(node);

      expect(errors.some(e => e.field === 'id' && e.severity === 'error')).toBe(true);
    });

    it('should warn when description is missing', () => {
      const node = createMockToolNode();
      (node.data.config as any).description = '';
      const errors = validateToolNode(node);

      expect(errors.some(e => e.field === 'description' && e.severity === 'warning')).toBe(true);
    });

    it('should fail when execute code is missing', () => {
      const node = createMockToolNode();
      (node.data.config as any).executeCode = '';
      const errors = validateToolNode(node);

      expect(errors.some(e => e.field === 'executeCode' && e.severity === 'error')).toBe(true);
    });
  });

  describe('validateAllNodes', () => {
    it('should validate multiple nodes', () => {
      const nodes = [
        createMockAgentNode({ id: 'agent-1' }),
        createMockStepNode({ id: 'step-1' }),
        createMockToolNode({ id: 'tool-1' }),
      ];

      const errors = validateAllNodes(nodes);
      expect(errors).toHaveLength(0);
    });

    it('should collect errors from multiple nodes', () => {
      const agentNode = createMockAgentNode({ id: 'agent-1' });
      (agentNode.data.config as any).id = '';

      const stepNode = createMockStepNode({ id: 'step-1' });
      (stepNode.data.config as any).executeCode = '';

      const nodes = [agentNode, stepNode];
      const errors = validateAllNodes(nodes);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.nodeId === 'agent-1')).toBe(true);
      expect(errors.some(e => e.nodeId === 'step-1')).toBe(true);
    });
  });

  describe('helper functions', () => {
    it('hasErrors should detect error severity', () => {
      const errors = [
        { nodeId: 'node-1', message: 'Error', severity: 'error' as const },
        { nodeId: 'node-2', message: 'Warning', severity: 'warning' as const },
      ];

      expect(hasErrors('node-1', errors)).toBe(true);
      expect(hasErrors('node-2', errors)).toBe(false);
    });

    it('hasWarnings should detect warning severity', () => {
      const errors = [
        { nodeId: 'node-1', message: 'Error', severity: 'error' as const },
        { nodeId: 'node-2', message: 'Warning', severity: 'warning' as const },
      ];

      expect(hasWarnings('node-1', errors)).toBe(false);
      expect(hasWarnings('node-2', errors)).toBe(true);
    });

    it('getNodeErrors should return errors for specific node', () => {
      const errors = [
        { nodeId: 'node-1', message: 'Error 1', severity: 'error' as const },
        { nodeId: 'node-2', message: 'Error 2', severity: 'error' as const },
        { nodeId: 'node-1', message: 'Error 3', severity: 'warning' as const },
      ];

      const node1Errors = getNodeErrors('node-1', errors);
      expect(node1Errors).toHaveLength(2);
      expect(node1Errors.every(e => e.nodeId === 'node-1')).toBe(true);
    });
  });
});
