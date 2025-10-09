import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useBuilderState } from '../../hooks';

interface MapConfigPanelProps {
  nodeId: string;
}

interface FieldMapping {
  id: string;
  targetField: string;
  sourceType: 'step' | 'constant' | 'function';
  sourceStep?: string;
  sourcePath?: string;
  constantValue?: string;
  functionCode?: string;
}

interface MapConfig {
  fields: FieldMapping[];
  description?: string;
}

export function MapConfigPanel({ nodeId }: MapConfigPanelProps) {
  const { project, updateNode } = useBuilderState();
  const node = project?.nodes.find(n => n.id === nodeId);
  const currentConfig: MapConfig = (node?.data?.config as any) || {
    fields: [{ id: '1', targetField: 'result', sourceType: 'step', sourceStep: 'previous', sourcePath: 'output' }],
  };

  const [formData, setFormData] = useState<MapConfig>(currentConfig);

  useEffect(() => {
    if (node?.data?.config) {
      setFormData(node.data.config as any);
    }
  }, [node?.data?.config]);

  const handleChange = (field: keyof MapConfig, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateNode(nodeId, { data: { ...node?.data, config: newData } as any });
  };

  const handleAddField = () => {
    const newField: FieldMapping = {
      id: Date.now().toString(),
      targetField: 'newField',
      sourceType: 'constant',
      constantValue: '',
    };
    handleChange('fields', [...formData.fields, newField]);
  };

  const handleUpdateField = (id: string, updates: Partial<FieldMapping>) => {
    const newFields = formData.fields.map(f => (f.id === id ? { ...f, ...updates } : f));
    handleChange('fields', newFields);
  };

  const handleDeleteField = (id: string) => {
    if (formData.fields.length > 1) {
      handleChange(
        'fields',
        formData.fields.filter(f => f.id !== id),
      );
    }
  };

  return (
    <div className="h-full w-full p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Map Configuration</h2>

      <div className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={formData.description || ''}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Describe this data mapping..."
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Field Mappings */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Field Mappings</label>
            <button
              onClick={handleAddField}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Plus className="h-3 w-3" />
              Add Field
            </button>
          </div>

          <div className="space-y-3">
            {formData.fields.map((field, index) => (
              <div key={field.id} className="p-3 border border-border rounded-md bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Field {index + 1}</span>
                  {formData.fields.length > 1 && (
                    <button
                      onClick={() => handleDeleteField(field.id)}
                      className="p-1 hover:bg-destructive/20 text-destructive rounded-sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {/* Target Field Name */}
                  <div>
                    <label className="block text-xs font-medium mb-1">Target Field Name</label>
                    <input
                      type="text"
                      value={field.targetField}
                      onChange={e => handleUpdateField(field.id, { targetField: e.target.value })}
                      placeholder="fieldName"
                      className="w-full px-2 py-1 border border-border rounded-md bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Source Type */}
                  <div>
                    <label className="block text-xs font-medium mb-1">Source Type</label>
                    <select
                      value={field.sourceType}
                      onChange={e => handleUpdateField(field.id, { sourceType: e.target.value as any })}
                      className="w-full px-2 py-1 border border-border rounded-md bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="step">From Previous Step</option>
                      <option value="constant">Constant Value</option>
                      <option value="function">Custom Function</option>
                    </select>
                  </div>

                  {/* Source-specific inputs */}
                  {field.sourceType === 'step' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium mb-1">Source Step</label>
                        <input
                          type="text"
                          value={field.sourceStep || ''}
                          onChange={e => handleUpdateField(field.id, { sourceStep: e.target.value })}
                          placeholder="stepId"
                          className="w-full px-2 py-1 border border-border rounded-md bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Path (use '.' for entire output)</label>
                        <input
                          type="text"
                          value={field.sourcePath || ''}
                          onChange={e => handleUpdateField(field.id, { sourcePath: e.target.value })}
                          placeholder="output.nested.field"
                          className="w-full px-2 py-1 border border-border rounded-md bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </>
                  )}

                  {field.sourceType === 'constant' && (
                    <div>
                      <label className="block text-xs font-medium mb-1">Constant Value</label>
                      <input
                        type="text"
                        value={field.constantValue || ''}
                        onChange={e => handleUpdateField(field.id, { constantValue: e.target.value })}
                        placeholder="value"
                        className="w-full px-2 py-1 border border-border rounded-md bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}

                  {field.sourceType === 'function' && (
                    <div>
                      <label className="block text-xs font-medium mb-1">Function Code</label>
                      <textarea
                        value={field.functionCode || ''}
                        onChange={e => handleUpdateField(field.id, { functionCode: e.target.value })}
                        placeholder="async ({ inputData }) => inputData.value * 2"
                        rows={3}
                        className="w-full px-2 py-1 border border-border rounded-md bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 bg-secondary/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            <strong>Map Node:</strong> Transforms data from previous steps into a new structure. Each field mapping
            creates a new field in the output object.
          </p>
        </div>

        {/* Mastra API Reference */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Mastra API</h4>
          <code className="block text-xs bg-secondary p-3 rounded-md font-mono whitespace-pre overflow-auto">
            {`workflow.map({
${formData.fields
  .map(f => {
    if (f.sourceType === 'step') {
      return `  ${f.targetField}: { step: ${f.sourceStep || 'stepName'}, path: '${f.sourcePath || 'output'}' }`;
    } else if (f.sourceType === 'constant') {
      return `  ${f.targetField}: { value: '${f.constantValue || ''}' }`;
    } else {
      return `  ${f.targetField}: { fn: ${f.functionCode || 'async () => {}'} }`;
    }
  })
  .join(',\n')}
})`}
          </code>
        </div>
      </div>
    </div>
  );
}
