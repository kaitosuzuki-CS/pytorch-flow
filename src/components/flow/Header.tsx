
"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Download,
  Workflow,
  MousePointer,
  Move,
  Upload,
} from "lucide-react";
import { InteractionMode } from "@/lib/type";

type HeaderProps = {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  interactionMode: InteractionMode;
  onInteractionModeChange: (mode: InteractionMode) => void;
};

export function Header({
  onExport,
  onImport,
  interactionMode,
  onInteractionModeChange,
}: HeaderProps) {
  const toggleInteractionMode = () => {
    onInteractionModeChange(
      interactionMode === "selection" ? "pan" : "selection"
    );
  };
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-background border-b z-20">
      <Link href="/" className="flex items-center gap-3">
        <Workflow className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          FlowForge
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        <Button
          onClick={toggleInteractionMode}
          variant="outline"
          size="icon"
          title={
            interactionMode === "selection"
              ? "Switch to Pan Mode"
              : "Switch to Selection Mode"
          }
        >
          {interactionMode === "selection" ? (
            <MousePointer className="w-6 h-6" />
          ) : (
            <Move className="w-6 h-6" />
          )}
        </Button>
        <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={onImport}
        />
        <Button onClick={handleImportClick} variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import JSON
        </Button>
        <Button onClick={onExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export JSON
        </Button>
      </div>
    </header>
  );
}
