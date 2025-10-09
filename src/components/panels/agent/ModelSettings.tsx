import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ModelConfig } from '../../../types';

interface ModelSettingsProps {
  model: ModelConfig;
  onChange: (model: ModelConfig) => void;
}

export function ModelSettings({ model, onChange }: ModelSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: keyof ModelConfig, value: any) => {
    onChange({
      ...model,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 border border-border rounded-md hover:bg-accent/50 transition-colors"
      >
        <span className="text-sm font-medium">Advanced Model Settings</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isExpanded && (
        <div className="space-y-4 p-4 border border-border rounded-md bg-secondary/20">
          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Temperature</label>
              <span className="text-xs text-muted-foreground">{model.temperature ?? 0.7}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={model.temperature ?? 0.7}
              onChange={e => handleChange('temperature', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Controls randomness: 0 = focused, 2 = creative</p>
          </div>

          {/* Top P */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Top P</label>
              <span className="text-xs text-muted-foreground">{model.topP ?? 1.0}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={model.topP ?? 1.0}
              onChange={e => handleChange('topP', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Nucleus sampling: lower = more deterministic</p>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Max Tokens</label>
            <input
              type="number"
              value={model.maxTokens ?? 1000}
              onChange={e => handleChange('maxTokens', parseInt(e.target.value))}
              min={1}
              max={32000}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Maximum response length</p>
          </div>

          {/* Frequency Penalty */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Frequency Penalty</label>
              <span className="text-xs text-muted-foreground">{model.frequencyPenalty ?? 0}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={model.frequencyPenalty ?? 0}
              onChange={e => handleChange('frequencyPenalty', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Penalize repeated tokens</p>
          </div>

          {/* Presence Penalty */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Presence Penalty</label>
              <span className="text-xs text-muted-foreground">{model.presencePenalty ?? 0}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={model.presencePenalty ?? 0}
              onChange={e => handleChange('presencePenalty', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Encourage topic diversity</p>
          </div>

          {/* Stop Sequences */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Stop Sequences</label>
            <input
              type="text"
              value={model.stopSequences?.join(', ') || ''}
              onChange={e =>
                handleChange(
                  'stopSequences',
                  e.target.value
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean),
                )
              }
              placeholder="e.g., \n\n, END, ###"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">Comma-separated. Generation stops at these tokens.</p>
          </div>
        </div>
      )}
    </div>
  );
}
