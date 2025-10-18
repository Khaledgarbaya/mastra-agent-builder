import React, { useState, useEffect } from 'react';
import {
  Bot,
  Settings,
  Wrench,
  GitBranch,
  GitMerge,
  ListOrdered,
  Clock,
  Calendar,
  Radio,
  ArrowRightLeft,
  Search,
  Star,
  Clock as ClockIcon,
} from 'lucide-react';
import { BuilderSidebar, SidebarSection } from '../builder/BuilderSidebar';
import { cn } from '../../lib/utils';

interface NodePaletteItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  isFavorite?: boolean;
  lastUsed?: number;
}

type PaletteView = 'nodes' | 'favorites' | 'recent';
type NodeCategory = 'all' | 'agents' | 'steps' | 'control' | 'timing' | 'tools';

const nodeCategories = {
  Agents: [
    {
      type: 'agent',
      label: 'Agent',
      icon: <Bot className="h-4 w-4" />,
      description: 'AI agent that can reason and use tools',
      color: 'bg-primary',
    },
  ],
  Steps: [
    {
      type: 'step',
      label: 'Step',
      icon: <Settings className="h-4 w-4" />,
      description: 'Execute custom logic',
      color: 'bg-secondary',
    },
    {
      type: 'map',
      label: 'Map',
      icon: <ArrowRightLeft className="h-4 w-4" />,
      description: 'Transform and map data',
      color: 'bg-accent',
    },
  ],
  'Control Flow': [
    {
      type: 'loop',
      label: 'Loop',
      icon: <GitBranch className="h-4 w-4" />,
      description: 'While, until, dowhile, dountil',
      color: 'bg-destructive',
    },
    {
      type: 'foreach',
      label: 'For Each',
      icon: <ListOrdered className="h-4 w-4" />,
      description: 'Iterate over array items',
      color: 'bg-muted',
    },
    {
      type: 'parallel',
      label: 'Parallel',
      icon: <GitBranch className="h-4 w-4" />,
      description: 'Execute branches in parallel',
      color: 'bg-primary/80',
    },
    {
      type: 'router',
      label: 'Branch',
      icon: <GitMerge className="h-4 w-4" />,
      description: 'Conditional branching',
      color: 'bg-secondary/80',
    },
  ],
  Timing: [
    {
      type: 'sleep',
      label: 'Sleep',
      icon: <Clock className="h-4 w-4" />,
      description: 'Pause for duration',
      color: 'bg-accent/80',
    },
    {
      type: 'sleepuntil',
      label: 'Sleep Until',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Pause until specific time',
      color: 'bg-destructive/80',
    },
    {
      type: 'waitforevent',
      label: 'Wait For Event',
      icon: <Radio className="h-4 w-4" />,
      description: 'Wait for external event',
      color: 'bg-muted/80',
    },
  ],
  Tools: [
    {
      type: 'tool',
      label: 'Tool',
      icon: <Wrench className="h-4 w-4" />,
      description: 'Reusable tool for agents to execute',
      color: 'bg-primary/60',
    },
  ],
};

export function NodePalette() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<PaletteView>('nodes');
  const [selectedCategory, setSelectedCategory] = useState<NodeCategory>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentNodes, setRecentNodes] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Load favorites and recent nodes from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('mastra-palette-favorites');
    const savedRecent = localStorage.getItem('mastra-palette-recent');

    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
    if (savedRecent) {
      setRecentNodes(JSON.parse(savedRecent));
    }
  }, []);

  // Save favorites and recent nodes to localStorage
  useEffect(() => {
    localStorage.setItem('mastra-palette-favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('mastra-palette-recent', JSON.stringify(recentNodes));
  }, [recentNodes]);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';

    // Update recent nodes
    if (!recentNodes.includes(nodeType)) {
      setRecentNodes(prev => [nodeType, ...prev.slice(0, 9)]); // Keep last 10
    }
  };

  const toggleFavorite = (nodeType: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(nodeType)) {
      newFavorites.delete(nodeType);
    } else {
      newFavorites.add(nodeType);
    }
    setFavorites(newFavorites);
  };

  // Get recent node items
  const recentItems: NodePaletteItem[] = React.useMemo(() => {
    const allNodes: NodePaletteItem[] = Object.values(nodeCategories).flat();
    return recentNodes
      .map(nodeType => allNodes.find(node => node.type === nodeType))
      .filter(Boolean) as NodePaletteItem[];
  }, [recentNodes]);

  // Get favorite items
  const favoriteItems: NodePaletteItem[] = React.useMemo(() => {
    const allNodes: NodePaletteItem[] = Object.values(nodeCategories).flat();
    return Array.from(favorites)
      .map(nodeType => allNodes.find(node => node.type === nodeType))
      .filter(Boolean) as NodePaletteItem[];
  }, [favorites]);

  // Filter nodes based on search query and category
  const filteredCategories = React.useMemo(() => {
    let categoriesToFilter: Record<string, NodePaletteItem[]> = nodeCategories;

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryMap: Record<NodeCategory, string> = {
        all: '',
        agents: 'Agents',
        steps: 'Steps',
        control: 'Control Flow',
        timing: 'Timing',
        tools: 'Tools',
      };
      const targetCategory = categoryMap[selectedCategory];
      if (targetCategory && nodeCategories[targetCategory as keyof typeof nodeCategories]) {
        const categoryData = nodeCategories[targetCategory as keyof typeof nodeCategories];
        categoriesToFilter = { [targetCategory]: categoryData };
      }
    }

    if (!searchQuery.trim()) return categoriesToFilter;

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, NodePaletteItem[]> = {};

    Object.entries(categoriesToFilter).forEach(([category, nodes]) => {
      const matchingNodes = nodes.filter(
        node =>
          node.label.toLowerCase().includes(query) ||
          node.description.toLowerCase().includes(query) ||
          node.type.toLowerCase().includes(query),
      );

      if (matchingNodes.length > 0) {
        filtered[category] = matchingNodes;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory]);

  return (
    <BuilderSidebar title="Components">
      {/* View Tabs */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex gap-1">
          {[
            { id: 'nodes', label: 'Nodes', icon: Settings },
            { id: 'favorites', label: 'Favorites', icon: Star },
            { id: 'recent', label: 'Recent', icon: ClockIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as PaletteView)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors',
                currentView === tab.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="px-3 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Category Filter (for nodes view) */}
      {currentView === 'nodes' && (
        <div className="px-3 py-2 border-b border-border">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'agents', label: 'Agents' },
              { id: 'steps', label: 'Steps' },
              { id: 'control', label: 'Control' },
              { id: 'timing', label: 'Timing' },
              { id: 'tools', label: 'Tools' },
            ].map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as NodeCategory)}
                className={cn(
                  'px-2 py-1 text-xs rounded whitespace-nowrap transition-colors',
                  selectedCategory === category.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-2">
        {/* Nodes View */}
        {currentView === 'nodes' && (
          <>
            {Object.entries(filteredCategories).length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No nodes found matching "{searchQuery}"
              </div>
            )}
            {Object.entries(filteredCategories).map(([category, items]) => (
              <SidebarSection key={category} title={category} defaultExpanded={true}>
                <div className="space-y-2">
                  {items.map((item: NodePaletteItem) => (
                    <NodePaletteItem
                      key={item.type}
                      item={item}
                      onDragStart={e => onDragStart(e, item.type)}
                      onToggleFavorite={e => toggleFavorite(item.type, e)}
                      isFavorite={favorites.has(item.type)}
                      onMouseEnter={() => setHoveredNode(item.type)}
                      onMouseLeave={() => setHoveredNode(null)}
                      showPreview={hoveredNode === item.type}
                    />
                  ))}
                </div>
              </SidebarSection>
            ))}
          </>
        )}

        {/* Favorites View */}
        {currentView === 'favorites' && (
          <>
            {favoriteItems.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No favorite nodes yet. Star some nodes to add them here.
              </div>
            )}
            <SidebarSection title="Favorites" defaultExpanded={true}>
              <div className="space-y-2">
                {favoriteItems.map((item: NodePaletteItem) => (
                  <NodePaletteItem
                    key={item.type}
                    item={item}
                    onDragStart={e => onDragStart(e, item.type)}
                    onToggleFavorite={e => toggleFavorite(item.type, e)}
                    isFavorite={true}
                  />
                ))}
              </div>
            </SidebarSection>
          </>
        )}

        {/* Recent View */}
        {currentView === 'recent' && (
          <>
            {recentItems.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">No recently used nodes yet.</div>
            )}
            <SidebarSection title="Recent" defaultExpanded={true}>
              <div className="space-y-2">
                {recentItems.map((item: NodePaletteItem) => (
                  <NodePaletteItem
                    key={item.type}
                    item={item}
                    onDragStart={e => onDragStart(e, item.type)}
                    onToggleFavorite={e => toggleFavorite(item.type, e)}
                    isFavorite={favorites.has(item.type)}
                  />
                ))}
              </div>
            </SidebarSection>
          </>
        )}
      </div>
    </BuilderSidebar>
  );
}

interface NodePaletteItemProps {
  item: NodePaletteItem;
  onDragStart: (e: React.DragEvent) => void;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  isFavorite?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  showPreview?: boolean;
}

function NodePaletteItem({
  item,
  onDragStart,
  onToggleFavorite,
  isFavorite = false,
  onMouseEnter,
  onMouseLeave,
  showPreview = false,
}: NodePaletteItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'p-3 rounded-md border cursor-move transition-all relative group',
        'hover:border-primary hover:shadow-md',
        'bg-card border-border',
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={cn('p-1.5 rounded-md', item.color)}>
          <div className={cn('text-muted-foreground')}>{item.icon}</div>
        </div>
        <div className="font-medium text-sm flex-1 text-foreground">{item.label}</div>
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={cn(
              'p-1 rounded hover:bg-accent transition-colors opacity-0 group-hover:opacity-100',
              isFavorite ? 'text-primary opacity-100' : 'text-muted-foreground',
            )}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={cn('h-3 w-3', isFavorite && 'fill-current')} />
          </button>
        )}
      </div>
      <div className="text-xs text-muted-foreground">{item.description}</div>

      {/* Preview on hover */}
      {showPreview && (
        <div className="absolute left-full top-0 ml-2 w-64 p-3 bg-popover border border-border rounded-md shadow-lg z-50">
          <div className="text-sm font-medium mb-1">{item.label}</div>
          <div className="text-xs text-muted-foreground mb-2">{item.description}</div>
          <div className="text-xs">
            <strong>Type:</strong> {item.type}
          </div>
        </div>
      )}
    </div>
  );
}
