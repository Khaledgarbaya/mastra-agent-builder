import { useEffect, useState } from 'react';
import { useBuilderState } from '../../hooks';
import type { StepBuilderConfig } from '../../types';
import { SchemaBuilder } from '../schema';

interface StepConfigPanelProps {
  nodeId: string;
}

export function StepConfigPanel({ nodeId }: StepConfigPanelProps) {
  const { project, updateNode } = useBuilderState();

  const node = project?.nodes.find(n => n.id === nodeId);
  const config = (node?.data as any)?.config as StepBuilderConfig | undefined;

  const [formData, setFormData] = useState<StepBuilderConfig>({
    id: config?.id || '',
    description: config?.description || '',
    executeCode: config?.executeCode || '// Add your code here',
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleChange = (field: keyof StepBuilderConfig, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    updateNode(nodeId, {
      data: {
        type: 'step',
        config: updated,
      } as any,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Step ID</label>
          <input
            type="text"
            value={formData.id}
            onChange={e => handleChange('id', e.target.value)}
            placeholder="e.g., process-data"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="What does this step do?"
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Execute Function</label>
          <textarea
            value={formData.executeCode}
            onChange={e => handleChange('executeCode', e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">TypeScript/JavaScript code for this step</p>
        </div>
      </div>

      <div className="space-y-4">
        <SchemaBuilder
          title="Input Schema"
          fields={formData.inputSchema || []}
          onChange={fields => handleChange('inputSchema', fields)}
        />
      </div>

      <div className="space-y-4">
        <SchemaBuilder
          title="Output Schema"
          fields={formData.outputSchema || []}
          onChange={fields => handleChange('outputSchema', fields)}
        />
      </div>
    </div>
  );
}
