import { useEffect, useState } from 'react';
import { useBuilderState } from '../../hooks';

interface WaitForEventConfigPanelProps {
  nodeId: string;
}

interface WaitForEventConfig {
  event: string;
  timeout?: number;
  description?: string;
}

export function WaitForEventConfigPanel({ nodeId }: WaitForEventConfigPanelProps) {
  const { project, updateNode } = useBuilderState();
  const node = project?.nodes.find(n => n.id === nodeId);
  const currentConfig: WaitForEventConfig = (node?.data?.config as any) || {
    event: 'user-action',
    timeout: 30000,
  };

  const [formData, setFormData] = useState<WaitForEventConfig>(currentConfig);

  useEffect(() => {
    if (node?.data?.config) {
      setFormData(node.data.config as any);
    }
  }, [node?.data?.config]);

  const handleChange = (field: keyof WaitForEventConfig, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateNode(nodeId, { data: { ...node?.data, config: newData } as any });
  };

  return (
    <div className="h-full w-full p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Wait For Event Configuration</h2>

      <div className="space-y-4">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Event Name</label>
          <input
            type="text"
            value={formData.event}
            onChange={e => handleChange('event', e.target.value)}
            placeholder="user-action"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">The event name that this workflow will wait for</p>
        </div>

        {/* Common Event Presets */}
        <div>
          <label className="block text-sm font-medium mb-2">Common Events</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleChange('event', 'user-approval')}
              className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary text-left"
            >
              user-approval
            </button>
            <button
              onClick={() => handleChange('event', 'payment-complete')}
              className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary text-left"
            >
              payment-complete
            </button>
            <button
              onClick={() => handleChange('event', 'data-received')}
              className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary text-left"
            >
              data-received
            </button>
            <button
              onClick={() => handleChange('event', 'webhook-trigger')}
              className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary text-left"
            >
              webhook-trigger
            </button>
          </div>
        </div>

        {/* Timeout */}
        <div>
          <label className="block text-sm font-medium mb-2">Timeout (milliseconds)</label>
          <input
            type="number"
            value={formData.timeout || 30000}
            onChange={e => handleChange('timeout', parseInt(e.target.value))}
            min={0}
            step={1000}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.timeout ? `${formData.timeout / 1000} seconds` : 'No timeout (wait indefinitely)'}
          </p>
        </div>

        {/* Timeout Presets */}
        <div>
          <label className="block text-sm font-medium mb-2">Timeout Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleChange('timeout', 30000)}
              className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary"
            >
              30 seconds
            </button>
            <button
              onClick={() => handleChange('timeout', 60000)}
              className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary"
            >
              1 minute
            </button>
            <button
              onClick={() => handleChange('timeout', 300000)}
              className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary"
            >
              5 minutes
            </button>
            <button
              onClick={() => handleChange('timeout', 0)}
              className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary"
            >
              No timeout
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={formData.description || ''}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Describe what event you're waiting for..."
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="p-3 bg-secondary/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> The workflow will pause execution until the specified event is triggered. Connect a
            step after this node to process the event data.
          </p>
        </div>

        {/* Mastra API Reference */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Mastra API</h4>
          <code className="block text-xs bg-secondary p-3 rounded-md font-mono whitespace-pre">
            {`workflow.waitForEvent('${formData.event}', step${formData.timeout ? `,\n  { timeout: ${formData.timeout} }` : ''})`}
          </code>
        </div>
      </div>
    </div>
  );
}
