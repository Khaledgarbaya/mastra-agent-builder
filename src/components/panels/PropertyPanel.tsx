import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PropertyPanelProps {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Base property panel component for configuring selected items
 */
export function PropertyPanel({ title, onClose, children, className }: PropertyPanelProps) {
  return (
    <div className={cn('flex flex-col h-full bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}

export interface PropertyFieldProps {
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Individual field within a property panel
 */
export function PropertyField({ label, description, required, error, children, className }: PropertyFieldProps) {
  return (
    <div className={cn('mb-4', className)}>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {description && <p className="text-xs text-muted-foreground mb-2">{description}</p>}
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export interface PropertyGroupProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Group related fields within a property panel
 */
export function PropertyGroup({ title, children, className }: PropertyGroupProps) {
  return (
    <div className={cn('mb-6', className)}>
      {title && <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{title}</h4>}
      {children}
    </div>
  );
}
