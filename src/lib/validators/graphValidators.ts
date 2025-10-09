import type { CanvasNode, CanvasEdge } from '../../types';
import type { ValidationError } from './nodeValidators';

/**
 * Check for cycles in the workflow graph
 */
export function detectCycles(nodes: CanvasNode[], edges: CanvasEdge[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const adjacency: Map<string, string[]> = new Map();

  // Build adjacency list
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    const targets = adjacency.get(edge.source) || [];
    targets.push(edge.target);
    adjacency.set(edge.source, targets);
  }

  // Detect cycles using DFS
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycleDFS(nodeId: string, path: string[]): boolean {
    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjacency.get(nodeId) || [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycleDFS(neighbor, [...path, neighbor])) {
          return true;
        }
      } else if (recStack.has(neighbor)) {
        // Cycle detected
        errors.push({
          nodeId,
          message: `Cycle detected in workflow: ${[...path, neighbor].join(' → ')}`,
          severity: 'error',
        });
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      hasCycleDFS(node.id, [node.id]);
    }
  }

  return errors;
}

/**
 * Check for isolated (disconnected) nodes
 */
export function detectIsolatedNodes(nodes: CanvasNode[], edges: CanvasEdge[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const connectedNodes = new Set<string>();

  // Collect all nodes that are connected via edges
  for (const edge of edges) {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  }

  // Find isolated nodes (excluding agent nodes which can be standalone)
  for (const node of nodes) {
    if (!connectedNodes.has(node.id) && node.type !== 'agent') {
      errors.push({
        nodeId: node.id,
        message: 'Node is not connected to any other nodes',
        severity: 'info',
      });
    }
  }

  return errors;
}

/**
 * Check for duplicate node IDs (for agents, steps, tools)
 */
export function detectDuplicateIds(nodes: CanvasNode[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const ids = new Map<string, string[]>(); // id -> [nodeIds]

  for (const node of nodes) {
    const nodeData = node.data as any;
    const configId = nodeData.config?.id;

    if (configId) {
      const nodeIds = ids.get(configId) || [];
      nodeIds.push(node.id);
      ids.set(configId, nodeIds);
    }
  }

  // Find duplicates
  for (const [configId, nodeIds] of ids.entries()) {
    if (nodeIds.length > 1) {
      for (const nodeId of nodeIds) {
        errors.push({
          nodeId,
          field: 'id',
          message: `Duplicate ID "${configId}" found in ${nodeIds.length} nodes`,
          severity: 'error',
        });
      }
    }
  }

  return errors;
}

/**
 * Validate the entire workflow graph
 */
export function validateWorkflowGraph(nodes: CanvasNode[], edges: CanvasEdge[]): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for cycles
  errors.push(...detectCycles(nodes, edges));

  // Check for isolated nodes
  errors.push(...detectIsolatedNodes(nodes, edges));

  // Check for duplicate IDs
  errors.push(...detectDuplicateIds(nodes));

  return errors;
}
