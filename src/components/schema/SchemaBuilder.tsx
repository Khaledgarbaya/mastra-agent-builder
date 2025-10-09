import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { SchemaField } from '../../types';
import { SchemaFieldEditor } from './SchemaFieldEditor';

interface SchemaBuilderProps {
  fields: SchemaField[];
  onChange: (fields: SchemaField[]) => void;
  title?: string;
}

export function SchemaBuilder({ fields, onChange, title = 'Schema' }: SchemaBuilderProps) {
  const [expandedFieldId, setExpandedFieldId] = useState<string | undefined>();

  const handleAddField = () => {
    const newField: SchemaField = {
      id: `field-${Date.now()}`,
      name: 'newField',
      type: 'string',
      optional: false,
      description: '',
    };
    onChange([...fields, newField]);
    setExpandedFieldId(newField.id);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<SchemaField>) => {
    onChange(fields.map(field => (field.id === fieldId ? { ...field, ...updates } : field)));
  };

  const handleDeleteField = (fieldId: string) => {
    onChange(fields.filter(field => field.id !== fieldId));
    if (expandedFieldId === fieldId) {
      setExpandedFieldId(undefined);
    }
  };

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(f => f.id === fieldId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const newFields = [...fields];
    const currentField = newFields[index];
    const targetField = newFields[targetIndex];

    if (!currentField || !targetField) return;

    newFields[index] = targetField;
    newFields[targetIndex] = currentField;

    onChange(newFields);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        <button
          onClick={handleAddField}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add Field
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded-md">
          No fields defined. Click "Add Field" to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <SchemaFieldEditor
              key={field.id}
              field={field}
              isExpanded={expandedFieldId === field.id}
              onToggleExpand={() => setExpandedFieldId(expandedFieldId === field.id ? undefined : field.id)}
              onUpdate={updates => handleUpdateField(field.id, updates)}
              onDelete={() => handleDeleteField(field.id)}
              onMoveUp={index > 0 ? () => handleMoveField(field.id, 'up') : undefined}
              onMoveDown={index < fields.length - 1 ? () => handleMoveField(field.id, 'down') : undefined}
            />
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <strong>{fields.length}</strong> field{fields.length !== 1 ? 's' : ''} defined
          </div>
        </div>
      )}
    </div>
  );
}
