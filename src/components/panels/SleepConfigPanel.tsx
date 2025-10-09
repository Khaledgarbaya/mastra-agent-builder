import { useEffect, useState } from 'react';
import { useBuilderState } from '../../hooks';

interface SleepConfigPanelProps {
  nodeId: string;
}

interface SleepConfig {
  mode: 'duration' | 'until';
  duration?: number; // milliseconds
  date?: string; // ISO string
  useDynamicValue?: boolean;
  description?: string;
}

export function SleepConfigPanel({ nodeId }: SleepConfigPanelProps) {
  const { project, updateNode } = useBuilderState();
  const node = project?.nodes.find(n => n.id === nodeId);

  // Determine mode based on node type
  const nodeType = node?.type;
  const defaultMode: 'duration' | 'until' = nodeType === 'sleepuntil' ? 'until' : 'duration';

  const currentConfig: SleepConfig = (node?.data?.config as any) || {
    mode: defaultMode,
    duration: 1000,
    date: new Date(Date.now() + 60000).toISOString(),
    useDynamicValue: false,
  };

  const [formData, setFormData] = useState<SleepConfig>(currentConfig);

  useEffect(() => {
    if (node?.data?.config) {
      setFormData(node.data.config as any);
    }
  }, [node?.data?.config]);

  const handleChange = (field: keyof SleepConfig, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateNode(nodeId, { data: { ...node?.data, config: newData } as any });
  };

  return (
    <div className="h-full w-full p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">
        {formData.mode === 'until' ? 'Sleep Until Configuration' : 'Sleep Configuration'}
      </h2>

      <div className="space-y-4">
        {formData.mode === 'duration' ? (
          <>
            {/* Duration Mode */}
            <div>
              <label className="block text-sm font-medium mb-2">Duration (milliseconds)</label>
              <input
                type="number"
                value={formData.duration || 1000}
                onChange={e => handleChange('duration', parseInt(e.target.value))}
                min={0}
                step={100}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.duration ? `${formData.duration / 1000} seconds` : '0 seconds'}
              </p>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium mb-2">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChange('duration', 1000)}
                  className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary"
                >
                  1 second
                </button>
                <button
                  onClick={() => handleChange('duration', 5000)}
                  className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary"
                >
                  5 seconds
                </button>
                <button
                  onClick={() => handleChange('duration', 60000)}
                  className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary"
                >
                  1 minute
                </button>
                <button
                  onClick={() => handleChange('duration', 300000)}
                  className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary"
                >
                  5 minutes
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Until Mode */}
            <div>
              <label className="block text-sm font-medium mb-2">Sleep Until Date/Time</label>
              <input
                type="datetime-local"
                value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
                onChange={e => handleChange('date', new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">Workflow will pause until this date/time</p>
            </div>
          </>
        )}

        {/* Dynamic Value Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="dynamic-value"
            checked={formData.useDynamicValue}
            onChange={e => handleChange('useDynamicValue', e.target.checked)}
            className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="dynamic-value" className="text-sm cursor-pointer">
            Use dynamic value from function
          </label>
        </div>

        {formData.useDynamicValue && (
          <div className="p-3 bg-secondary/50 rounded-md">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> When using a dynamic value, the{' '}
              {formData.mode === 'duration' ? 'duration' : 'date'} will be calculated at runtime using an async function
              that receives the workflow context.
            </p>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={formData.description || ''}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Describe why this pause is needed..."
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Mastra API Reference */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Mastra API</h4>
          <code className="block text-xs bg-secondary p-3 rounded-md font-mono whitespace-pre">
            {formData.mode === 'duration'
              ? formData.useDynamicValue
                ? `workflow.sleep(async ({ inputData }) => {\n  return ${formData.duration};\n})`
                : `workflow.sleep(${formData.duration})`
              : formData.useDynamicValue
                ? `workflow.sleepUntil(async ({ inputData }) => {\n  return new Date('${formData.date}');\n})`
                : `workflow.sleepUntil(new Date('${formData.date}'))`}
          </code>
        </div>
      </div>
    </div>
  );
}
