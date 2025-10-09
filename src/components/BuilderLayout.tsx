import React from 'react';
import { cn } from '../lib/utils';
import { useBuilderState } from '../hooks';

export interface BuilderLayoutProps {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
}

/**
 * Main layout component for the visual builder
 * Features:
 * - Resizable left and right panels
 * - Top toolbar
 * - Main canvas area in the center
 */
export function BuilderLayout({ children, leftPanel, rightPanel, toolbar, className }: BuilderLayoutProps) {
  const { ui, setLeftPanelWidth, setRightPanelWidth } = useBuilderState();

  const handleLeftResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = ui.leftPanelWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(200, Math.min(600, startWidth + delta));
      setLeftPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRightResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = ui.rightPanelWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX;
      const newWidth = Math.max(200, Math.min(800, startWidth + delta));
      setRightPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={cn('flex h-screen flex-col bg-background', className)}>
      {/* Toolbar */}
      {toolbar && <div className="border-b border-border bg-card">{toolbar}</div>}

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        {leftPanel && (
          <>
            <div
              className="flex flex-col border-r border-border bg-card overflow-hidden"
              style={{ width: ui.leftPanelWidth }}
            >
              {leftPanel}
            </div>
            {/* Left resize handle */}
            <div
              className="w-1 cursor-col-resize bg-border hover:bg-primary transition-colors"
              onMouseDown={handleLeftResize}
            />
          </>
        )}

        {/* Main canvas */}
        <div className="flex-1 overflow-hidden bg-background">{children}</div>

        {/* Right panel */}
        {rightPanel && (
          <>
            {/* Right resize handle */}
            <div
              className="w-1 cursor-col-resize bg-border hover:bg-primary transition-colors"
              onMouseDown={handleRightResize}
            />
            <div
              className="flex flex-col border-l border-border bg-card overflow-hidden"
              style={{ width: ui.rightPanelWidth }}
            >
              {rightPanel}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
