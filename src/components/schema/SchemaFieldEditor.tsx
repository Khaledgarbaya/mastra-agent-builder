import { ChevronDown, ChevronRight, Trash2, ChevronUp, ChevronDown as MoveDown } from 'lucide-react';
import type { SchemaField, SchemaFieldType } from '../../types';

interface SchemaFieldEditorProps {
  field: SchemaField;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<SchemaField>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const fieldTypes: { value: SchemaFieldType; label: string }[] = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'object', label: 'Object' },
  { value: 'array', label: 'Array' },
  { value: 'enum', label: 'Enum' },
  { value: 'any', label: 'Any' },
];

export function SchemaFieldEditor({
  field,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SchemaFieldEditorProps) {
  return (
    <div className="border border-border rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-2 bg-secondary/50 hover:bg-secondary/70 transition-colors">
        <button onClick={onToggleExpand} className="p-1 hover:bg-secondary rounded-sm transition-colors">
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>

        <div className="flex-1 flex items-center gap-2">
          <code className="text-xs font-mono font-semibold">{field.name}</code>
          <span className="text-xs text-muted-foreground">:</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{field.type}</span>
          {field.optional && <span className="text-xs text-muted-foreground italic">optional</span>}
        </div>

        <div className="flex items-center gap-1">
          {onMoveUp && (
            <button onClick={onMoveUp} className="p-1 hover:bg-secondary rounded-sm transition-colors" title="Move up">
              <ChevronUp className="h-3 w-3" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-1 hover:bg-secondary rounded-sm transition-colors"
              title="Move down"
            >
              <MoveDown className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1 hover:bg-destructive/20 text-destructive rounded-sm transition-colors"
            title="Delete field"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 space-y-3 border-t border-border bg-card">
          <div>
            <label className="block text-xs font-medium mb-1">Field Name</label>
            <input
              type="text"
              value={field.name}
              onChange={e => onUpdate({ name: e.target.value })}
              placeholder="fieldName"
              className="w-full px-2 py-1 border border-border rounded-md bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Type</label>
            <select
              value={field.type}
              onChange={e => onUpdate({ type: e.target.value as SchemaFieldType })}
              className="w-full px-2 py-1 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea
              value={field.description || ''}
              onChange={e => onUpdate({ description: e.target.value })}
              placeholder="Describe this field..."
              rows={2}
              className="w-full px-2 py-1 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`optional-${field.id}`}
              checked={field.optional}
              onChange={e => onUpdate({ optional: e.target.checked })}
              className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor={`optional-${field.id}`} className="text-sm cursor-pointer">
              Optional field
            </label>
          </div>

          {field.type === 'string' && (
            <div className="pt-2 border-t border-border">
              <label className="block text-xs font-medium mb-1">Default Value</label>
              <input
                type="text"
                value={field.defaultValue || ''}
                onChange={e => onUpdate({ defaultValue: e.target.value })}
                placeholder="Default value..."
                className="w-full px-2 py-1 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}

          {field.type === 'number' && (
            <div className="pt-2 border-t border-border space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Min</label>
                  <input
                    type="number"
                    placeholder="Min value"
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Max</label>
                  <input
                    type="number"
                    placeholder="Max value"
                    className="w-full px-2 py-1 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
