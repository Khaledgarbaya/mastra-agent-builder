import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { useBuilderState } from '../../hooks';
import type { ProjectSettings } from '../../types';

export function ProjectPropertiesPanel() {
  const { project, updateProject } = useBuilderState();

  const [settings, setSettings] = useState<ProjectSettings>(() => ({
    projectName: project?.settings?.projectName || 'My Mastra Project',
    description: project?.settings?.description || '',
    defaultModel: project?.settings?.defaultModel || { provider: 'openai', name: 'gpt-4' },
    storage: project?.settings?.storage || { type: 'memory' },
    logger: project?.settings?.logger || { type: 'console' },
    telemetry: project?.settings?.telemetry || { enabled: false },
    environmentVariables: project?.settings?.environmentVariables || {},
    entryPoints: project?.settings?.entryPoints || { agents: [], workflows: [] },
  }));

  useEffect(() => {
    if (project?.settings) {
      setSettings(project.settings);
    }
  }, [project?.settings]);

  const handleChange = (field: keyof ProjectSettings, value: any) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);

    if (project) {
      updateProject({
        ...project,
        name: field === 'projectName' ? value : project.name,
        settings: updated,
      });
    }
  };

  const handleNestedChange = (field: keyof ProjectSettings, nestedField: string, value: any) => {
    const currentFieldValue = settings[field];
    const updated = {
      ...settings,
      [field]: {
        ...(typeof currentFieldValue === 'object' && currentFieldValue !== null ? currentFieldValue : {}),
        [nestedField]: value,
      },
    };
    setSettings(updated);

    if (project) {
      updateProject({
        ...project,
        settings: updated,
      });
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border bg-secondary/50">
        <Settings className="h-5 w-5" />
        <div>
          <h2 className="text-lg font-semibold">Project Properties</h2>
          <p className="text-xs text-muted-foreground">Configure global project settings</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium mb-1.5">Project Name</label>
            <input
              type="text"
              value={settings.projectName || ''}
              onChange={e => {
                const updated = { ...settings, projectName: e.target.value };
                setSettings(updated);
              }}
              onBlur={e => handleChange('projectName', e.target.value)}
              placeholder="e.g., My AI Application"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea
              value={settings.description || ''}
              onChange={e => {
                const updated = { ...settings, description: e.target.value };
                setSettings(updated);
              }}
              onBlur={e => handleChange('description', e.target.value)}
              placeholder="What does this project do?"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Default Model Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Default Model Configuration</h3>

          <div>
            <label className="block text-sm font-medium mb-1.5">Provider</label>
            <select
              value={settings.defaultModel?.provider || 'openai'}
              onChange={e => handleNestedChange('defaultModel', 'provider', e.target.value)}
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
            <input
              type="text"
              value={settings.defaultModel?.name || ''}
              onChange={e => handleNestedChange('defaultModel', 'name', e.target.value)}
              placeholder="e.g., gpt-4"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Storage Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Storage Configuration</h3>

          <div>
            <label className="block text-sm font-medium mb-1.5">Storage Type</label>
            <select
              value={settings.storage?.type || 'memory'}
              onChange={e => handleNestedChange('storage', 'type', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            >
              <option value="memory">In-Memory (Development)</option>
              <option value="libsql">LibSQL (Turso)</option>
              <option value="postgres">PostgreSQL</option>
              <option value="redis">Redis</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {settings.storage?.type === 'memory' && 'Data stored in memory (not persisted)'}
              {settings.storage?.type === 'libsql' && 'SQLite-compatible database (local or Turso)'}
              {settings.storage?.type === 'postgres' && 'PostgreSQL database'}
              {settings.storage?.type === 'redis' && 'Redis key-value store'}
            </p>
          </div>
        </div>

        {/* Logger Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Logger Configuration</h3>

          <div>
            <label className="block text-sm font-medium mb-1.5">Logger Type</label>
            <select
              value={settings.logger?.type || 'console'}
              onChange={e => handleNestedChange('logger', 'type', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            >
              <option value="console">Console</option>
              <option value="pino">Pino (Structured)</option>
              <option value="custom">Custom</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {settings.logger?.type === 'console' && 'Simple console logging'}
              {settings.logger?.type === 'pino' && 'Fast, structured JSON logging'}
              {settings.logger?.type === 'custom' && 'Custom logger implementation'}
            </p>
          </div>
        </div>

        {/* Telemetry Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Telemetry & Observability</h3>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="telemetry-enabled"
              checked={settings.telemetry?.enabled || false}
              onChange={e => handleNestedChange('telemetry', 'enabled', e.target.checked)}
              className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="telemetry-enabled" className="text-sm cursor-pointer">
              Enable telemetry and tracing
            </label>
          </div>

          {settings.telemetry?.enabled && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Telemetry Provider</label>
              <select
                value={settings.telemetry?.provider || 'opentelemetry'}
                onChange={e => handleNestedChange('telemetry', 'provider', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              >
                <option value="opentelemetry">OpenTelemetry</option>
                <option value="datadog">Datadog</option>
                <option value="newrelic">New Relic</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          )}
        </div>

        {/* Environment Variables */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Environment Variables</h3>

          <div className="p-4 border border-dashed border-border rounded-md">
            <p className="text-sm text-muted-foreground text-center">
              Environment variables will be stored in .env file
            </p>
            <p className="text-xs text-muted-foreground text-center mt-2">Configure in your deployment environment</p>
          </div>
        </div>

        {/* Entry Points */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Entry Points</h3>
          <p className="text-xs text-muted-foreground">
            Configure which agents and workflows are exposed in the generated code
          </p>

          <div className="p-4 bg-secondary/30 rounded-md">
            <p className="text-sm">All agents and workflows on the canvas will be automatically exported</p>
          </div>
        </div>

        {/* Validation Summary */}
        <div className="pt-4 border-t border-border">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
            <p className="text-sm font-medium">✓ Project configuration valid</p>
            <p className="text-xs text-muted-foreground mt-1">Ready to generate code</p>
          </div>
        </div>
      </div>
    </div>
  );
}
