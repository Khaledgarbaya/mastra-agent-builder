import { useEffect, useState } from 'react';
import { useBuilderState } from '../../hooks';

interface LoopConfigPanelProps {
  nodeId: string;
}

type LoopType = 'while' | 'until' | 'dowhile' | 'dountil';

interface LoopConfig {
  type: LoopType;
  condition?: string;
  maxIterations?: number;
  description?: string;
}

export function LoopConfigPanel({ nodeId }: LoopConfigPanelProps) {
  const { project, updateNode } = useBuilderState();
  const node = project?.nodes.find(n => n.id === nodeId);
  const currentConfig: LoopConfig = (node?.data?.config as any) || {
    type: 'while',
    condition: 'count < 10',
    maxIterations: 100,
  };

  const [formData, setFormData] = useState<LoopConfig>(currentConfig);

  useEffect(() => {
    if (node?.data?.config) {
      setFormData(node.data.config as any);
    }
  }, [node?.data?.config]);

  const handleChange = (field: keyof LoopConfig, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateNode(nodeId, { data: { ...node?.data, config: newData } as any });
  };

  return (
    <div className="h-full w-full p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Loop Configuration</h2>

      <div className="space-y-4">
        {/* Loop Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Loop Type</label>
          <select
            value={formData.type}
            onChange={e => handleChange('type', e.target.value as LoopType)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="while">While (condition checked before)</option>
            <option value="until">Until (condition checked before)</option>
            <option value="dowhile">Do While (condition checked after)</option>
            <option value="dountil">Do Until (condition checked after)</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            {formData.type === 'while' && 'Repeats while condition is true'}
            {formData.type === 'until' && 'Repeats until condition becomes true'}
            {formData.type === 'dowhile' && 'Executes at least once, repeats while condition is true'}
            {formData.type === 'dountil' && 'Executes at least once, repeats until condition becomes true'}
          </p>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium mb-2">Loop Condition</label>
          <textarea
            value={formData.condition || ''}
            onChange={e => handleChange('condition', e.target.value)}
            placeholder="count < 10"
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">JavaScript expression that returns boolean</p>
        </div>

        {/* Max Iterations */}
        <div>
          <label className="block text-sm font-medium mb-2">Max Iterations</label>
          <input
            type="number"
            value={formData.maxIterations || 100}
            onChange={e => handleChange('maxIterations', parseInt(e.target.value))}
            min={1}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">Safety limit to prevent infinite loops</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={formData.description || ''}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Describe what this loop does..."
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Mastra API Reference */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Mastra API</h4>
          <code className="block text-xs bg-secondary p-3 rounded-md font-mono">
            workflow.{formData.type}(step, async (ctx) =&gt; {'{'}
            <br />
            &nbsp;&nbsp;return {formData.condition || 'condition'};
            <br />
            {'}'})
          </code>
        </div>
      </div>
    </div>
  );
}
