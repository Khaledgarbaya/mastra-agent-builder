import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BuilderSidebarProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable sidebar component for left/right panels
 */
export function BuilderSidebar({ title, children, className }: BuilderSidebarProps) {
  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * Collapsible section within a sidebar
 */
export function SidebarSection({ title, children, defaultExpanded = true, className }: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('border-b border-border', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isExpanded && <div className="px-4 py-3 bg-background/50">{children}</div>}
    </div>
  );
}

export interface SidebarItemProps {
  label: string;
  value?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  active?: boolean;
  className?: string;
}

/**
 * Individual item within a sidebar section
 */
export function SidebarItem({ label, value, onClick, icon, active, className }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors',
        active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 text-foreground',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span>{label}</span>
      </div>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
    </div>
  );
}
