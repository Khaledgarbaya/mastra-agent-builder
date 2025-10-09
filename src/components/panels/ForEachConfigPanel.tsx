import { useEffect, useState } from 'react';
import { useBuilderState } from '../../hooks';

interface ForEachConfigPanelProps {
  nodeId: string;
}

interface ForEachConfig {
  concurrency: number;
  description?: string;
}

export function ForEachConfigPanel({ nodeId }: ForEachConfigPanelProps) {
  const { project, updateNode } = useBuilderState();
  const node = project?.nodes.find(n => n.id === nodeId);
  const currentConfig: ForEachConfig = (node?.data?.config as any) || {
    concurrency: 1,
  };

  const [formData, setFormData] = useState<ForEachConfig>(currentConfig);

  useEffect(() => {
    if (node?.data?.config) {
      setFormData(node.data.config as any);
    }
  }, [node?.data?.config]);

  const handleChange = (field: keyof ForEachConfig, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateNode(nodeId, { data: { ...node?.data, config: newData } as any });
  };

  return (
    <div className="h-full w-full p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">For Each Configuration</h2>

      <div className="space-y-4">
        {/* Concurrency Slider */}
        <div>
          <label className="block text-sm font-medium mb-2">Concurrency: {formData.concurrency}</label>
          <input
            type="range"
            min={1}
            max={10}
            value={formData.concurrency}
            onChange={e => handleChange('concurrency', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Sequential (1)</span>
            <span>Parallel (10)</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {formData.concurrency === 1
              ? 'Items will be processed one at a time (sequential)'
              : `Up to ${formData.concurrency} items will be processed simultaneously`}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={formData.description || ''}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Describe what this foreach loop does..."
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="p-3 bg-secondary/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> The previous step must output an array. This node will iterate over each item in that
            array and execute the connected step for each item.
          </p>
        </div>

        {/* Mastra API Reference */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Mastra API</h4>
          <code className="block text-xs bg-secondary p-3 rounded-md font-mono whitespace-pre">
            {`workflow.foreach(step, { 
  concurrency: ${formData.concurrency} 
})`}
          </code>
        </div>
      </div>
    </div>
  );
}
