import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-primary" />,
    error: <XCircle className="h-5 w-5 text-destructive" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const colors = {
    success: 'bg-primary/10 border-primary/20',
    error: 'bg-destructive/10 border-destructive/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-lg shadow-lg transition-all duration-300 bg-card border-border ${
        colors[toast.type]
      } ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm text-foreground">{toast.message}</div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(toast.id), 300);
        }}
        className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Toast manager hook
let toastCounter = 0;
const toastListeners: Set<(toasts: ToastMessage[]) => void> = new Set();
let currentToasts: ToastMessage[] = [];

export function showToast(type: ToastType, message: string, duration?: number) {
  const id = `toast-${++toastCounter}`;
  const newToast: ToastMessage = { id, type, message, duration };
  currentToasts = [...currentToasts, newToast];
  toastListeners.forEach(listener => listener(currentToasts));
}

export function removeToast(id: string) {
  currentToasts = currentToasts.filter(t => t.id !== id);
  toastListeners.forEach(listener => listener(currentToasts));
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>(currentToasts);

  useEffect(() => {
    toastListeners.add(setToasts);
    return () => {
      toastListeners.delete(setToasts);
    };
  }, []);

  return { toasts, removeToast };
}
