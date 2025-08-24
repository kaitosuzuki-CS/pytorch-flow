"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Workflow } from 'lucide-react';

type HeaderProps = {
  onExport: () => void;
};

export function Header({ onExport }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex items-center gap-3">
        <Workflow className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          FlowForge
        </h1>
      </div>
      <Button onClick={onExport} variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Export JSON
      </Button>
    </header>
  );
}
