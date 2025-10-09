import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useBuilderState } from '../../hooks';

interface BranchConfigPanelProps {
  nodeId: string;
}

interface Branch {
  id: string;
  condition: string;
  description?: string;
}

interface BranchConfig {
  branches: Branch[];
  hasDefaultPath: boolean;
  description?: string;
}

export function BranchConfigPanel({ nodeId }: BranchConfigPanelProps) {
  const { project, updateNode } = useBuilderState();
  const node = project?.nodes.find(n => n.id === nodeId);
  const currentConfig: BranchConfig = (node?.data?.config as any) || {
    branches: [
      { id: '1', condition: 'value > 10', description: 'Branch 1' },
      { id: '2', condition: 'value <= 10', description: 'Branch 2' },
    ],
    hasDefaultPath: false,
  };

  const [formData, setFormData] = useState<BranchConfig>(currentConfig);

  useEffect(() => {
    if (node?.data?.config) {
      setFormData(node.data.config as any);
    }
  }, [node?.data?.config]);

  const handleChange = (field: keyof BranchConfig, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateNode(nodeId, { data: { ...node?.data, config: newData } as any });
  };

  const handleAddBranch = () => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      condition: 'true',
      description: `Branch ${formData.branches.length + 1}`,
    };
    handleChange('branches', [...formData.branches, newBranch]);
  };

  const handleUpdateBranch = (id: string, updates: Partial<Branch>) => {
    const newBranches = formData.branches.map(b => (b.id === id ? { ...b, ...updates } : b));
    handleChange('branches', newBranches);
  };

  const handleDeleteBranch = (id: string) => {
    if (formData.branches.length > 1) {
      handleChange(
        'branches',
        formData.branches.filter(b => b.id !== id),
      );
    }
  };

  return (
    <div className="h-full w-full p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Branch Configuration</h2>

      <div className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={formData.description || ''}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Describe this branching logic..."
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Branches */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Conditional Branches</label>
            <button
              onClick={handleAddBranch}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Plus className="h-3 w-3" />
              Add Branch
            </button>
          </div>

          <div className="space-y-3">
            {formData.branches.map((branch, index) => (
              <div key={branch.id} className="p-3 border border-border rounded-md bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Branch {index + 1}</span>
                  {formData.branches.length > 1 && (
                    <button
                      onClick={() => handleDeleteBranch(branch.id)}
                      className="p-1 hover:bg-destructive/20 text-destructive rounded-sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Condition</label>
                    <textarea
                      value={branch.condition}
                      onChange={e => handleUpdateBranch(branch.id, { condition: e.target.value })}
                      placeholder="inputData.value > 10"
                      rows={2}
                      className="w-full px-2 py-1 border border-border rounded-md bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Description</label>
                    <input
                      type="text"
                      value={branch.description || ''}
                      onChange={e => handleUpdateBranch(branch.id, { description: e.target.value })}
                      placeholder="Branch description..."
                      className="w-full px-2 py-1 border border-border rounded-md bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Default Path */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="has-default"
            checked={formData.hasDefaultPath}
            onChange={e => handleChange('hasDefaultPath', e.target.checked)}
            className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="has-default" className="text-sm cursor-pointer">
            Include default/fallback path
          </label>
        </div>

        {/* Mastra API Reference */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Mastra API</h4>
          <code className="block text-xs bg-secondary p-3 rounded-md font-mono whitespace-pre">
            {`workflow.branch([
${formData.branches.map((b, i) => `  [async () => ${b.condition}, step${i + 1}]`).join(',\n')}
])`}
          </code>
        </div>
      </div>
    </div>
  );
}
