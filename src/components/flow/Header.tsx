"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Workflow } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type HeaderProps = {
  onExport: () => void;
};

export function Header({ onExport }: HeaderProps) {
  
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-background border-b z-20">
      <div className="flex items-center gap-3">
        <Workflow className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          FlowForge
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
        </Button>
      </div>
    </header>
  );
}
