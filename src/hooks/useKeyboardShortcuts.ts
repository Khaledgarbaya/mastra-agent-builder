import { useEffect, useState } from 'react';
import { useBuilderState } from './useBuilderState';
import type { CanvasNode } from '../types';

/**
 * Hook to handle keyboard shortcuts for the builder
 */
export function useKeyboardShortcuts() {
  const { project, ui, deleteNode, duplicateNode, addNode, undo, redo, canUndo, canRedo } = useBuilderState();

  const [copiedNode, setCopiedNode] = useState<CanvasNode | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;

      // Cmd/Ctrl + Z - Undo
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        if (canUndo) {
          event.preventDefault();
          undo();
        }
        return;
      }

      // Cmd/Ctrl + Shift + Z - Redo
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && event.shiftKey) {
        if (canRedo) {
          event.preventDefault();
          redo();
        }
        return;
      }

      // Cmd/Ctrl + Y - Alternative Redo (Windows)
      if ((event.metaKey || event.ctrlKey) && event.key === 'y') {
        if (canRedo) {
          event.preventDefault();
          redo();
        }
        return;
      }

      // Delete/Backspace - Delete selected node (only if not typing)
      if ((event.key === 'Delete' || event.key === 'Backspace') && !isTyping) {
        if (ui.selectedNodeId) {
          event.preventDefault();
          deleteNode(ui.selectedNodeId);
        }
        return;
      }

      // Cmd/Ctrl + C - Copy node
      if ((event.metaKey || event.ctrlKey) && event.key === 'c' && !isTyping) {
        if (ui.selectedNodeId) {
          const nodeToCopy = project?.nodes.find(n => n.id === ui.selectedNodeId);
          if (nodeToCopy) {
            event.preventDefault();
            setCopiedNode(nodeToCopy);
          }
        }
        return;
      }

      // Cmd/Ctrl + V - Paste node
      if ((event.metaKey || event.ctrlKey) && event.key === 'v' && !isTyping) {
        if (copiedNode) {
          event.preventDefault();
          const newNode: CanvasNode = {
            ...copiedNode,
            id: `${copiedNode.type}-${Date.now()}`,
            position: {
              x: copiedNode.position.x + 50,
              y: copiedNode.position.y + 50,
            },
          };
          addNode(newNode);
        }
        return;
      }

      // Cmd/Ctrl + D - Duplicate node
      if ((event.metaKey || event.ctrlKey) && event.key === 'd' && !isTyping) {
        if (ui.selectedNodeId) {
          event.preventDefault();
          duplicateNode(ui.selectedNodeId);
        }
        return;
      }

      // Escape - Deselect node
      if (event.key === 'Escape') {
        // This will be handled by the canvas
        return;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, ui.selectedNodeId, copiedNode, deleteNode, duplicateNode, addNode, undo, redo, canUndo, canRedo]);
}
