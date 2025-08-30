"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectionToolbarProps = {
  isVisible: boolean;
  onDelete: () => void;
  onCancelConnection: () => void;
  isConnecting: boolean;
  nodeCount: number;
  edgeCount: number;
};

export function SelectionToolbar({
  isVisible,
  onDelete,
  onCancelConnection,
  isConnecting,
  nodeCount,
  edgeCount,
}: SelectionToolbarProps) {
  return (
    <div
      className={cn(
        "absolute top-4 left-1/2 -translate-x-1/2 z-30 p-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg flex items-center gap-4 transition-all duration-300",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-12 pointer-events-none"
      )}
    >
      {isConnecting ? (
        <>
          <div className="text-sm font-medium">
            <span>Connecting...</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancelConnection}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </>
      ) : (
        <>
          <div className="text-sm font-medium">
            <span>Selected: </span>
            {nodeCount > 0 && <span>{nodeCount} Nodes</span>}
            {nodeCount > 0 && edgeCount > 0 && <span>, </span>}
            {edgeCount > 0 && <span>{edgeCount} Edges</span>}
          </div>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </>
      )}
    </div>
  );
}
