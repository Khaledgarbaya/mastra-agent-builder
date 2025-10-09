import { useMemo } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { useBuilderState } from '../../hooks';
import { validateAllNodes, validateWorkflowGraph, type ValidationError } from '../../lib/validators';

interface ValidationPanelProps {
  onClose?: () => void;
}

export function ValidationPanel({ onClose }: ValidationPanelProps) {
  const { project, setSelectedNode } = useBuilderState();

  // Run all validations
  const errors = useMemo(() => {
    if (!project) return [];

    const nodeErrors = validateAllNodes(project.nodes);
    const graphErrors = validateWorkflowGraph(project.nodes, project.edges);

    return [...nodeErrors, ...graphErrors];
  }, [project]);

  // Group errors by severity
  const errorsBySeverity = useMemo(() => {
    return {
      error: errors.filter(e => e.severity === 'error'),
      warning: errors.filter(e => e.severity === 'warning'),
      info: errors.filter(e => e.severity === 'info'),
    };
  }, [errors]);

  const handleErrorClick = (error: ValidationError) => {
    if (error.nodeId) {
      setSelectedNode(error.nodeId);
    }
  };

  const totalIssues = errors.length;
  const isValid = errorsBySeverity.error.length === 0;

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold">Validation</h2>
          <p className="text-sm text-muted-foreground">
            {isValid ? 'All checks passed' : `${totalIssues} issue${totalIssues !== 1 ? 's' : ''} found`}
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-md" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 space-y-3 border-b border-border bg-secondary/20">
        <div className="flex items-center gap-3">
          {isValid ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">All validations passed!</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">Issues found</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-muted-foreground">{errorsBySeverity.error.length} Errors</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground">{errorsBySeverity.warning.length} Warnings</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">{errorsBySeverity.info.length} Info</span>
          </div>
        </div>
      </div>

      {/* Error List */}
      <div className="flex-1 overflow-y-auto">
        {totalIssues === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-4 text-green-500/50" />
            <p className="text-lg font-medium mb-2">All Clear!</p>
            <p className="text-sm text-center">No validation issues found in your project</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Errors */}
            {errorsBySeverity.error.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Errors ({errorsBySeverity.error.length})
                </h3>
                <div className="space-y-2">
                  {errorsBySeverity.error.map((error, index) => (
                    <ValidationErrorItem key={`error-${index}`} error={error} onClick={handleErrorClick} />
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {errorsBySeverity.warning.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Warnings ({errorsBySeverity.warning.length})
                </h3>
                <div className="space-y-2">
                  {errorsBySeverity.warning.map((error, index) => (
                    <ValidationErrorItem key={`warning-${index}`} error={error} onClick={handleErrorClick} />
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            {errorsBySeverity.info.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  Info ({errorsBySeverity.info.length})
                </h3>
                <div className="space-y-2">
                  {errorsBySeverity.info.map((error, index) => (
                    <ValidationErrorItem key={`info-${index}`} error={error} onClick={handleErrorClick} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ValidationErrorItemProps {
  error: ValidationError;
  onClick: (error: ValidationError) => void;
}

function ValidationErrorItem({ error, onClick }: ValidationErrorItemProps) {
  const getIcon = () => {
    switch (error.severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    }
  };

  return (
    <button
      onClick={() => onClick(error)}
      className="w-full text-left p-3 border border-border rounded-md hover:bg-accent transition-colors"
    >
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{error.message}</p>
          {error.field && <p className="text-xs text-muted-foreground mt-1">Field: {error.field}</p>}
        </div>
      </div>
    </button>
  );
}
