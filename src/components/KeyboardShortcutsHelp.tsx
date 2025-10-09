import { Keyboard } from 'lucide-react';
import { useState } from 'react';

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['⌘', 'Z'], description: 'Undo last action' },
    { keys: ['⌘', '⇧', 'Z'], description: 'Redo last action' },
    { keys: ['⌘', 'C'], description: 'Copy selected node' },
    { keys: ['⌘', 'V'], description: 'Paste copied node' },
    { keys: ['⌘', 'D'], description: 'Duplicate selected node' },
    { keys: ['Del'], description: 'Delete selected node' },
    { keys: ['Esc'], description: 'Deselect node' },
    { keys: ['Space'], description: 'Pan canvas (drag)' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-accent rounded-md transition-colors"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-border rounded-lg shadow-lg p-6 min-w-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <kbd
                        key={keyIndex}
                        className="px-2 py-1 text-xs font-semibold bg-secondary border border-border rounded"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
              <p>Replace ⌘ with Ctrl on Windows/Linux</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
