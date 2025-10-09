import type { CanvasNode, CanvasEdge } from '../../types';

/**
 * Generates Mastra workflow code from visual configuration
 */
export class WorkflowCodeGenerator {
  /**
   * Generate workflow code from canvas nodes and edges
   */
  generate(nodes: CanvasNode[], edges: CanvasEdge[], workflowId: string, workflowName: string): string {
    const lines: string[] = [];

    // Import statements
    lines.push(`import { createWorkflow } from '@mastra/core';`);

    // Import all steps used in this workflow
    const stepNodes = nodes.filter(n => n.type === 'step');
    if (stepNodes.length > 0) {
      const stepImports = stepNodes.map(node => {
        const stepId = (node.data as any).config?.id || node.id;
        return this.toCamelCase(stepId) + 'Step';
      });
      lines.push(`import { ${stepImports.join(', ')} } from '../steps';`);
    }

    lines.push(``);

    // Generate workflow
    lines.push(`export const ${this.toCamelCase(workflowId)}Workflow = createWorkflow({`);
    lines.push(`  name: '${workflowName}',`);
    lines.push(`  triggerSchema: z.object({`);
    lines.push(`    // TODO: Define workflow trigger schema`);
    lines.push(`  }),`);
    lines.push(`})`);

    // Build workflow chain
    const chain = this.buildWorkflowChain(nodes, edges);
    if (chain.length > 0) {
      chain.forEach(line => {
        lines.push(line);
      });
    } else {
      lines.push(`  // TODO: Connect workflow steps`);
    }

    lines.push(`;`);

    return lines.join('\n');
  }

  /**
   * Build workflow chain from nodes and edges
   */
  private buildWorkflowChain(nodes: CanvasNode[], edges: CanvasEdge[]): string[] {
    const lines: string[] = [];

    // Find the first step (no incoming edges or connected to a start node)
    const firstStep = this.findFirstStep(nodes, edges);

    if (!firstStep) {
      return lines;
    }

    // Build chain starting from first step
    let currentNode: CanvasNode | null = firstStep;
    let indent = '  ';

    while (currentNode) {
      const nodeConfig = (currentNode.data as any).config || {};

      switch (currentNode.type) {
        case 'step': {
          const stepVar = this.toCamelCase(nodeConfig.id) + 'Step';
          lines.push(`${indent}.then(${stepVar})`);
          break;
        }

        case 'loop': {
          const condition = nodeConfig.condition || 'true';
          const loopType = nodeConfig.type || 'while';

          if (loopType === 'while') {
            lines.push(`${indent}.while({`);
            lines.push(`${indent}  condition: (context) => ${condition},`);
            if (nodeConfig.maxIterations) {
              lines.push(`${indent}  maxIterations: ${nodeConfig.maxIterations},`);
            }
            lines.push(`${indent}})`);
          } else if (loopType === 'until') {
            lines.push(`${indent}.until({`);
            lines.push(`${indent}  condition: (context) => ${condition},`);
            if (nodeConfig.maxIterations) {
              lines.push(`${indent}  maxIterations: ${nodeConfig.maxIterations},`);
            }
            lines.push(`${indent}})`);
          }
          break;
        }

        case 'foreach': {
          const concurrency = nodeConfig.concurrency || 1;
          lines.push(`${indent}.foreach({`);
          lines.push(`${indent}  concurrency: ${concurrency},`);
          lines.push(`${indent}})`);
          break;
        }

        case 'parallel': {
          lines.push(`${indent}.parallel([`);
          // TODO: Handle parallel branches
          lines.push(`${indent}  // TODO: Define parallel branches`);
          lines.push(`${indent}])`);
          break;
        }

        case 'router': {
          const routes = nodeConfig.routes || [];
          if (routes.length > 0) {
            lines.push(`${indent}.branch({`);
            routes.forEach((route: any, index: number) => {
              lines.push(`${indent}  '${route.name || `route${index}`}': {`);
              lines.push(`${indent}    condition: (context) => ${route.condition || 'false'},`);
              lines.push(`${indent}  },`);
            });
            lines.push(`${indent}})`);
          }
          break;
        }

        case 'sleep': {
          const duration = nodeConfig.duration || 1000;
          lines.push(`${indent}.sleep(${duration})`);
          break;
        }

        case 'sleepuntil': {
          if (nodeConfig.date) {
            lines.push(`${indent}.sleepUntil(new Date('${nodeConfig.date}'))`);
          }
          break;
        }

        case 'waitforevent': {
          if (nodeConfig.event) {
            lines.push(`${indent}.waitForEvent({`);
            lines.push(`${indent}  event: '${nodeConfig.event}',`);
            if (nodeConfig.timeout) {
              lines.push(`${indent}  timeout: ${nodeConfig.timeout},`);
            }
            lines.push(`${indent}})`);
          }
          break;
        }

        case 'map': {
          if (nodeConfig.fields && Object.keys(nodeConfig.fields).length > 0) {
            lines.push(`${indent}.map({`);
            Object.entries(nodeConfig.fields).forEach(([key, value]: [string, any]) => {
              if (value.source === 'constant') {
                lines.push(`${indent}  ${key}: '${value.value}',`);
              } else {
                lines.push(`${indent}  ${key}: (context) => context.${value.step}.${value.path},`);
              }
            });
            lines.push(`${indent}})`);
          }
          break;
        }
      }

      // Find next node
      const nextEdge = edges.find(e => e.source === currentNode!.id);
      currentNode = nextEdge ? nodes.find(n => n.id === nextEdge.target) || null : null;
    }

    return lines;
  }

  /**
   * Find the first step in the workflow
   */
  private findFirstStep(nodes: CanvasNode[], edges: CanvasEdge[]): CanvasNode | null {
    // Find node with no incoming edges
    const targetIds = new Set(edges.map(e => e.target));

    for (const node of nodes) {
      if (!targetIds.has(node.id)) {
        return node;
      }
    }

    // If all nodes have incoming edges, return the first one
    return nodes[0] || null;
  }

  /**
   * Convert kebab-case to camelCase
   */
  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
  }
}
