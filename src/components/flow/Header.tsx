
"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Workflow, Undo, Redo } from 'lucide-react';

type HeaderProps = {
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export function Header({ onExport, onUndo, onRedo, canUndo, canRedo }: HeaderProps) {
  
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-background border-b z-20">
      <div className="flex items-center gap-3">
        <Workflow className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          FlowForge
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onUndo} variant="outline" size="icon" disabled={!canUndo} aria-label="Undo">
            <Undo className="w-4 h-4" />
        </Button>
        <Button onClick={onRedo} variant="outline" size="icon" disabled={!canRedo} aria-label="Redo">
            <Redo className="w-4 h-4" />
        </Button>
        <Button onClick={onExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
        </Button>
      </div>
    </header>
  );
}
