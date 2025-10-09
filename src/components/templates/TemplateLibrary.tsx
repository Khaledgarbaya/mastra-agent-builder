import { useState } from 'react';
import { Search, Filter, Star, Clock, Plus, X } from 'lucide-react';
import {
  agentTemplates,
  workflowTemplates,
  httpRequestToolTemplate,
  databaseQueryToolTemplate,
  fileOperationsToolTemplate,
  emailSenderToolTemplate,
  calculatorToolTemplate,
  slackNotificationToolTemplate,
  discordWebhookToolTemplate,
  customerSupportSystemTemplate,
  contentCreationPipelineTemplate,
  dataAnalysisWorkflowTemplate,
  emailAutomationSystemTemplate,
  multiAgentResearchSystemTemplate,
  type Template,
} from '../../lib/templates';
import { showToast } from '../ui';

interface TemplateLibraryProps {
  onApplyTemplate: (template: Template) => void;
  onClose?: () => void;
}

type TemplateCategory = 'all' | 'agent' | 'workflow' | 'tool' | 'complete';

export function TemplateLibrary({ onApplyTemplate, onClose }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Combine all templates
  const allTemplates: Template[] = [
    ...agentTemplates,
    ...workflowTemplates,
    httpRequestToolTemplate,
    databaseQueryToolTemplate,
    fileOperationsToolTemplate,
    emailSenderToolTemplate,
    calculatorToolTemplate,
    slackNotificationToolTemplate,
    discordWebhookToolTemplate,
    customerSupportSystemTemplate,
    contentCreationPipelineTemplate,
    dataAnalysisWorkflowTemplate,
    emailAutomationSystemTemplate,
    multiAgentResearchSystemTemplate,
  ];

  // Filter templates based on search and category
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toolTemplates = [
    httpRequestToolTemplate,
    databaseQueryToolTemplate,
    fileOperationsToolTemplate,
    emailSenderToolTemplate,
    calculatorToolTemplate,
    slackNotificationToolTemplate,
    discordWebhookToolTemplate,
  ];

  const completeTemplates = [
    customerSupportSystemTemplate,
    contentCreationPipelineTemplate,
    dataAnalysisWorkflowTemplate,
    emailAutomationSystemTemplate,
    multiAgentResearchSystemTemplate,
  ];

  const categories = [
    { id: 'all', label: 'All Templates', count: allTemplates.length },
    { id: 'agent', label: 'Agents', count: agentTemplates.length },
    { id: 'workflow', label: 'Workflows', count: workflowTemplates.length },
    { id: 'tool', label: 'Tools', count: toolTemplates.length },
    { id: 'complete', label: 'Complete', count: completeTemplates.length },
  ];

  const handleApplyTemplate = (template: Template) => {
    onApplyTemplate(template);
    showToast('success', `${template.name} template applied successfully!`);
    onClose?.();
  };

  const toggleFavorite = (templateId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="h-full flex flex-col bg-card dark:bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border dark:border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground">Template Library</h2>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">Choose from pre-built templates</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-md" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-4 border-b border-border dark:border-border">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as TemplateCategory)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === category.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Filter className="h-3 w-3" />
              {category.label}
              <span className="text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Search className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No templates found</p>
            <p className="text-sm text-center">Try adjusting your search query or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="group border border-border rounded-lg p-4 bg-card hover:border-primary hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleApplyTemplate(template)}
              >
                {/* Template Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <h3 className="font-medium text-sm text-foreground">{template.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{template.category} Template</p>
                    </div>
                  </div>
                  <button
                    onClick={e => toggleFavorite(template.id, e)}
                    className={`p-1 rounded hover:bg-accent transition-colors ${
                      favorites.has(template.id) ? 'text-yellow-500' : 'text-muted-foreground'
                    }`}
                    aria-label={favorites.has(template.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`h-4 w-4 ${favorites.has(template.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded">
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleApplyTemplate(template)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Apply Template
                  </button>
                  <span className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Ready to use
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-secondary/20 dark:border-border dark:bg-secondary/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground">
          <span>
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </span>
          <span>Click to apply to your canvas</span>
        </div>
      </div>
    </div>
  );
}
