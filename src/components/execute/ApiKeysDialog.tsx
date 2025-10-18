import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { ApiKeysConfig } from '../../types';

interface ApiKeysDialogProps {
  onSubmit: (apiKeys: ApiKeysConfig) => void;
  onCancel: () => void;
  requiredProviders?: string[];
}

const STORAGE_KEY = 'mastra-preview-api-keys';

/**
 * Dialog for collecting API keys before starting preview
 */
export function ApiKeysDialog({ onSubmit, onCancel, requiredProviders = [] }: ApiKeysDialogProps) {
  const [apiKeys, setApiKeys] = useState<ApiKeysConfig>({
    openai: '',
    anthropic: '',
    google: '',
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    google: false,
  });
  const [errors, setErrors] = useState<string[]>([]);

  // Load saved API keys from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ApiKeysConfig;
        setApiKeys(parsed);
      }
    } catch (error) {
      console.error('Failed to load saved API keys:', error);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required keys
    const newErrors: string[] = [];
    if (requiredProviders.includes('openai') && !apiKeys.openai) {
      newErrors.push('OpenAI API key is required for your agents');
    }
    if (requiredProviders.includes('anthropic') && !apiKeys.anthropic) {
      newErrors.push('Anthropic API key is required for your agents');
    }
    if (requiredProviders.includes('google') && !apiKeys.google) {
      newErrors.push('Google AI API key is required for your agents');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if at least one key is provided
    if (!apiKeys.openai && !apiKeys.anthropic && !apiKeys.google) {
      setErrors(['Please provide at least one API key']);
      return;
    }

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apiKeys));
    } catch (error) {
      console.error('Failed to save API keys:', error);
    }

    onSubmit(apiKeys);
  };

  const toggleShowKey = (provider: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Configure API Keys</h2>
              <p className="text-sm text-muted-foreground">Enter your AI provider API keys to run the preview</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.length > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm text-destructive">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OpenAI */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              OpenAI API Key
              {requiredProviders.includes('openai') && <span className="text-destructive">*</span>}
            </label>
            <div className="relative">
              <input
                type={showKeys.openai ? 'text' : 'password'}
                value={apiKeys.openai || ''}
                onChange={e => setApiKeys({ ...apiKeys, openai: e.target.value })}
                placeholder="sk-..."
                className="w-full px-3 py-2 pr-10 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => toggleShowKey('openai')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
              >
                {showKeys.openai ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Anthropic */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              Anthropic API Key
              {requiredProviders.includes('anthropic') && <span className="text-destructive">*</span>}
            </label>
            <div className="relative">
              <input
                type={showKeys.anthropic ? 'text' : 'password'}
                value={apiKeys.anthropic || ''}
                onChange={e => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                placeholder="sk-ant-..."
                className="w-full px-3 py-2 pr-10 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => toggleShowKey('anthropic')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
              >
                {showKeys.anthropic ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Google AI */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              Google AI API Key
              {requiredProviders.includes('google') && <span className="text-destructive">*</span>}
            </label>
            <div className="relative">
              <input
                type={showKeys.google ? 'text' : 'password'}
                value={apiKeys.google || ''}
                onChange={e => setApiKeys({ ...apiKeys, google: e.target.value })}
                placeholder="AI..."
                className="w-full px-3 py-2 pr-10 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => toggleShowKey('google')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
              >
                {showKeys.google ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            <p>Your API keys are stored locally in your browser and never sent to our servers.</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Start Preview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

