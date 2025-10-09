import { useEffect, useState } from 'react';
import { Plus, X, Wrench, GitBranch, Wand2 } from 'lucide-react';
import { useBuilderState } from '../../hooks';
import type { AgentBuilderConfig } from '../../types';
import { ModelSettings } from './agent/ModelSettings';
import { InstructionTemplates } from './agent/InstructionTemplates';

interface AgentConfigPanelProps {
  nodeId: string;
}

export function AgentConfigPanel({ nodeId }: AgentConfigPanelProps) {
  const { project, updateNode } = useBuilderState();

  const node = project?.nodes.find(n => n.id === nodeId);
  const config = (node?.data as any)?.config as AgentBuilderConfig | undefined;

  const [formData, setFormData] = useState<AgentBuilderConfig>({
    id: config?.id || '',
    name: config?.name || '',
    description: config?.description || '',
    instructions: config?.instructions || '',
    model: config?.model || { provider: 'openai', name: 'gpt-4' },
    tools: config?.tools || [],
    workflows: config?.workflows || [],
    agents: config?.agents || [],
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  // Update local state only
  const updateLocalState = (field: keyof AgentBuilderConfig, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
  };

  // Update store (call on blur or specific actions)
  const updateStore = (updated: AgentBuilderConfig) => {
    updateNode(nodeId, {
      data: {
        type: 'agent',
        config: updated,
      } as any,
    });
  };

  const handleChange = (field: keyof AgentBuilderConfig, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    updateStore(updated);
  };

  const handleModelChange = (field: 'provider' | 'name', value: string) => {
    const updated = {
      ...formData,
      model: {
        ...formData.model,
        [field]: value,
      },
    };
    setFormData(updated);
    updateStore(updated);
  };

  const generateId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Agent Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => {
              const name = e.target.value;
              const updated = { ...formData, name };
              // Auto-generate ID if current ID is empty or matches previous auto-generated pattern
              if (!formData.id || formData.id === generateId(formData.name)) {
                updated.id = generateId(name);
              }
              setFormData(updated);
            }}
            onBlur={e => {
              const name = e.target.value;
              const updated = { ...formData, name };
              // Auto-generate ID if current ID is empty or matches previous auto-generated pattern
              if (!formData.id || formData.id === generateId(formData.name)) {
                updated.id = generateId(name);
              }
              updateStore(updated);
            }}
            placeholder="e.g., Customer Service Agent"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium">Agent ID</label>
            <button
              onClick={() => handleChange('id', generateId(formData.name))}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
              title="Auto-generate ID from name"
            >
              <Wand2 className="h-3 w-3" />
              Auto-generate
            </button>
          </div>
          <input
            type="text"
            value={formData.id}
            onChange={e => handleChange('id', e.target.value)}
            placeholder="e.g., customer-service-agent"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">Unique identifier for this agent</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            value={formData.description || ''}
            onChange={e => updateLocalState('description', e.target.value)}
            onBlur={e => handleChange('description', e.target.value)}
            placeholder="What does this agent do?"
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Model Configuration */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Model Configuration</h4>

        <div>
          <label className="block text-sm font-medium mb-1.5">Provider</label>
          <select
            value={formData.model.provider}
            onChange={e => handleModelChange('provider', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
            <option value="mistral">Mistral</option>
            <option value="groq">Groq</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Model Name</label>
          <select
            value={formData.model.name}
            onChange={e => handleModelChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          >
            {formData.model.provider === 'openai' && (
              <>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </>
            )}
            {formData.model.provider === 'anthropic' && (
              <>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="claude-3-haiku">Claude 3 Haiku</option>
              </>
            )}
            {formData.model.provider === 'google' && (
              <>
                <option value="gemini-pro">Gemini Pro</option>
                <option value="gemini-pro-vision">Gemini Pro Vision</option>
              </>
            )}
            {formData.model.provider === 'mistral' && (
              <>
                <option value="mistral-large">Mistral Large</option>
                <option value="mistral-medium">Mistral Medium</option>
                <option value="mistral-small">Mistral Small</option>
              </>
            )}
            {formData.model.provider === 'groq' && (
              <>
                <option value="llama-3-70b">Llama 3 70B</option>
                <option value="mixtral-8x7b">Mixtral 8x7B</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Instructions</h4>

        {/* Instruction Templates */}
        <InstructionTemplates onSelect={instructions => handleChange('instructions', instructions)} />

        <div>
          <textarea
            value={formData.instructions}
            onChange={e => updateLocalState('instructions', e.target.value)}
            onBlur={e => handleChange('instructions', e.target.value)}
            placeholder="Enter agent instructions (supports markdown)..."
            rows={8}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">Define how the agent should behave and respond</p>
        </div>
      </div>

      {/* Model Settings */}
      <ModelSettings model={formData.model} onChange={model => handleChange('model', model)} />

      {/* Tools Attachment */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Tools</h4>
          <button
            onClick={() => {
              const toolId = prompt('Enter tool ID to attach:');
              if (toolId) {
                handleChange('tools', [...formData.tools, toolId]);
              }
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Plus className="h-3 w-3" />
            Add Tool
          </button>
        </div>

        {formData.tools.length === 0 ? (
          <div className="p-4 border border-dashed border-border rounded-md text-center">
            <Wrench className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No tools attached</p>
            <p className="text-xs text-muted-foreground mt-1">Add tools that this agent can use</p>
          </div>
        ) : (
          <div className="space-y-2">
            {formData.tools.map((toolId, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-md bg-secondary/30"
              >
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{toolId}</span>
                </div>
                <button
                  onClick={() => {
                    handleChange(
                      'tools',
                      formData.tools.filter((_, i) => i !== index),
                    );
                  }}
                  className="p-1 hover:bg-destructive/20 text-destructive rounded-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workflows Attachment */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Workflows</h4>
          <button
            onClick={() => {
              const workflowId = prompt('Enter workflow ID to attach:');
              if (workflowId) {
                handleChange('workflows', [...formData.workflows, workflowId]);
              }
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Plus className="h-3 w-3" />
            Add Workflow
          </button>
        </div>

        {formData.workflows.length === 0 ? (
          <div className="p-4 border border-dashed border-border rounded-md text-center">
            <GitBranch className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No workflows attached</p>
            <p className="text-xs text-muted-foreground mt-1">Add workflows this agent can execute</p>
          </div>
        ) : (
          <div className="space-y-2">
            {formData.workflows.map((workflowId, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-md bg-secondary/30"
              >
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{workflowId}</span>
                </div>
                <button
                  onClick={() => {
                    handleChange(
                      'workflows',
                      formData.workflows.filter((_, i) => i !== index),
                    );
                  }}
                  className="p-1 hover:bg-destructive/20 text-destructive rounded-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Memory Configuration */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Memory Configuration</h4>

        <div>
          <label className="block text-sm font-medium mb-1.5">Memory Type</label>
          <select
            value={formData.memory?.type || 'none'}
            onChange={e => handleChange('memory', { ...formData.memory, type: e.target.value as any })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          >
            <option value="none">No Memory</option>
            <option value="buffer">Buffer Memory</option>
            <option value="summary">Summary Memory</option>
            <option value="token">Token Buffer</option>
          </select>
        </div>

        {formData.memory?.type && formData.memory.type !== 'none' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5">Max Messages</label>
              <input
                type="number"
                value={formData.memory?.maxMessages || 10}
                onChange={e => handleChange('memory', { ...formData.memory, maxMessages: parseInt(e.target.value) })}
                min={1}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">Number of messages to keep in memory</p>
            </div>
          </>
        )}
      </div>

      {/* Advanced Options */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Advanced Options</h4>

        <div>
          <label className="block text-sm font-medium mb-1.5">Max Retries</label>
          <input
            type="number"
            value={formData.maxRetries || 3}
            onChange={e => handleChange('maxRetries', parseInt(e.target.value))}
            min={0}
            max={10}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">Number of times to retry on failure</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enable-tracing"
            checked={formData.enableTracing || false}
            onChange={e => handleChange('enableTracing', e.target.checked)}
            className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="enable-tracing" className="text-sm cursor-pointer">
            Enable tracing and observability
          </label>
        </div>
      </div>
    </div>
  );
}
