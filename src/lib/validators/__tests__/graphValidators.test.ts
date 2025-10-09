import { describe, it, expect } from 'vitest';
import { detectCycles, detectIsolatedNodes, detectDuplicateIds, validateWorkflowGraph } from '../graphValidators';
import { createMockStepNode, createMockAgentNode } from '../../../test/testUtils';
import type { CanvasEdge } from '../../../types';

describe('graphValidators', () => {
  describe('detectCycles', () => {
    it('should not detect cycles in a linear graph', () => {
      const nodes = [
        createMockStepNode({ id: 'step-1' }),
        createMockStepNode({ id: 'step-2' }),
        createMockStepNode({ id: 'step-3' }),
      ];

      const edges: CanvasEdge[] = [
        { id: 'e1', source: 'step-1', target: 'step-2' },
        { id: 'e2', source: 'step-2', target: 'step-3' },
      ];

      const errors = detectCycles(nodes, edges);
      expect(errors).toHaveLength(0);
    });

    it('should detect a simple cycle', () => {
      const nodes = [createMockStepNode({ id: 'step-1' }), createMockStepNode({ id: 'step-2' })];

      const edges: CanvasEdge[] = [
        { id: 'e1', source: 'step-1', target: 'step-2' },
        { id: 'e2', source: 'step-2', target: 'step-1' },
      ];

      const errors = detectCycles(nodes, edges);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].severity).toBe('error');
      expect(errors[0].message).toContain('Cycle detected');
    });

    it('should detect cycles in a complex graph', () => {
      const nodes = [
        createMockStepNode({ id: 'step-1' }),
        createMockStepNode({ id: 'step-2' }),
        createMockStepNode({ id: 'step-3' }),
      ];

      const edges: CanvasEdge[] = [
        { id: 'e1', source: 'step-1', target: 'step-2' },
        { id: 'e2', source: 'step-2', target: 'step-3' },
        { id: 'e3', source: 'step-3', target: 'step-1' },
      ];

      const errors = detectCycles(nodes, edges);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('detectIsolatedNodes', () => {
    it('should not detect isolated nodes when all are connected', () => {
      const nodes = [createMockStepNode({ id: 'step-1' }), createMockStepNode({ id: 'step-2' })];

      const edges: CanvasEdge[] = [{ id: 'e1', source: 'step-1', target: 'step-2' }];

      const errors = detectIsolatedNodes(nodes, edges);
      expect(errors).toHaveLength(0);
    });

    it('should detect isolated step nodes', () => {
      const nodes = [
        createMockStepNode({ id: 'step-1' }),
        createMockStepNode({ id: 'step-2' }),
        createMockStepNode({ id: 'step-3' }),
      ];

      const edges: CanvasEdge[] = [{ id: 'e1', source: 'step-1', target: 'step-2' }];

      const errors = detectIsolatedNodes(nodes, edges);
      expect(errors).toHaveLength(1);
      expect(errors[0].nodeId).toBe('step-3');
      expect(errors[0].severity).toBe('info');
    });

    it('should not report isolated agent nodes', () => {
      const nodes = [createMockAgentNode({ id: 'agent-1' }), createMockStepNode({ id: 'step-1' })];

      const edges: CanvasEdge[] = [];

      const errors = detectIsolatedNodes(nodes, edges);
      // Agent should not be reported, only step
      expect(errors).toHaveLength(1);
      expect(errors[0].nodeId).toBe('step-1');
    });
  });

  describe('detectDuplicateIds', () => {
    it('should not detect duplicates when all IDs are unique', () => {
      const nodes = [createMockStepNode({ id: 'step-1' }), createMockStepNode({ id: 'step-2' })];

      // Set unique config IDs
      (nodes[0].data.config as any).id = 'uniqueId1';
      (nodes[1].data.config as any).id = 'uniqueId2';

      const errors = detectDuplicateIds(nodes);
      expect(errors).toHaveLength(0);
    });

    it('should detect duplicate config IDs', () => {
      const nodes = [
        createMockStepNode({ id: 'step-1' }),
        createMockStepNode({ id: 'step-2' }),
        createMockStepNode({ id: 'step-3' }),
      ];

      // Set duplicate config IDs
      (nodes[0].data.config as any).id = 'duplicateId';
      (nodes[1].data.config as any).id = 'duplicateId';
      (nodes[2].data.config as any).id = 'uniqueId';

      const errors = detectDuplicateIds(nodes);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.filter(e => e.message.includes('duplicateId')).length).toBe(2);
    });
  });

  describe('validateWorkflowGraph', () => {
    it('should run all validations', () => {
      const nodes = [createMockStepNode({ id: 'step-1' }), createMockStepNode({ id: 'step-2' })];

      (nodes[0].data.config as any).id = 'step1';
      (nodes[1].data.config as any).id = 'step2';

      const edges: CanvasEdge[] = [{ id: 'e1', source: 'step-1', target: 'step-2' }];

      const errors = validateWorkflowGraph(nodes, edges);
      // Should pass all validations
      expect(errors).toHaveLength(0);
    });

    it('should collect errors from all validators', () => {
      const nodes = [
        createMockStepNode({ id: 'step-1' }),
        createMockStepNode({ id: 'step-2' }),
        createMockStepNode({ id: 'step-3' }),
      ];

      // Create duplicate IDs
      (nodes[0].data.config as any).id = 'duplicateId';
      (nodes[1].data.config as any).id = 'duplicateId';
      (nodes[2].data.config as any).id = 'uniqueId';

      // Create a cycle
      const edges: CanvasEdge[] = [
        { id: 'e1', source: 'step-1', target: 'step-2' },
        { id: 'e2', source: 'step-2', target: 'step-1' },
      ];

      const errors = validateWorkflowGraph(nodes, edges);
      // Should have errors from both cycle detection and duplicate detection
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.message.includes('Cycle'))).toBe(true);
      expect(errors.some(e => e.message.includes('Duplicate'))).toBe(true);
    });
  });
});
