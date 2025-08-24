"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, MousePointerSquare, Move, Workflow } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export type InteractionMode = 'selection' | 'pan';

type HeaderProps = {
  onExport: () => void;
  interactionMode: InteractionMode;
  onInteractionModeChange: (mode: InteractionMode) => void;
};

export function Header({ onExport, interactionMode, onInteractionModeChange }: HeaderProps) {
  
  const toggleInteractionMode = () => {
    onInteractionModeChange(interactionMode === 'selection' ? 'pan' : 'selection');
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-background border-b z-20">
      <div className="flex items-center gap-3">
        <Workflow className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          FlowForge
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={toggleInteractionMode} variant="outline" size="icon" title={interactionMode === 'selection' ? 'Switch to Pan Mode' : 'Switch to Selection Mode'}>
            {interactionMode === 'selection' ? <MousePointerSquare className="w-4 h-4" /> : <Move className="w-4 h-4" />}
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button onClick={onExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
        </Button>
      </div>
    </header>
  );
}
