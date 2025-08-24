
"use client";

import { getComponentByType } from '@/lib/flow-components';
import { Handle, Position, NodeProps, Node } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NodeData = {
  label: string;
  componentType: string;
  params: Record<string, any>;
};

type CustomNodeProps = NodeProps<NodeData> & {
    onSettingsClick: (node: Node<NodeData>) => void;
    isConnecting: boolean;
};

const handlePositionsDefault = [
    { pos: Position.Top, style: { left: '33%' } },
    { pos: Position.Top, style: { left: '66%' } },
    { pos: Position.Right, style: { top: '50%' } },
    { pos: Position.Bottom, style: { left: '33%' } },
    { pos: Position.Bottom, style: { left: '66%' } },
    { pos: Position.Left, style: { top: '50%' } },
];

const startHandlePositions = [
    { pos: Position.Bottom, style: { left: '25%' }, type: 'source' },
    { pos: Position.Bottom, style: { left: '50%' }, type: 'source' },
    { pos: Position.Bottom, style: { left: '75%' }, type: 'source' },
];

const endHandlePositions = [
    { pos: Position.Top, style: { left: '25%' }, type: 'target' },
    { pos: Position.Top, style: { left: '50%' }, type: 'target' },
    { pos: Position.Top, style: { left: '75%' }, type: 'target' },
];

export function CustomNode({ data, selected, id, type, onSettingsClick, isConnecting }: CustomNodeProps) {
  const componentInfo = getComponentByType(data.componentType);

  if (!componentInfo) {
    return <div>Unknown Component</div>;
  }

  const Icon = componentInfo.icon;

  const getLabel = () => {
    if (data.params) {
        const paramKey = Object.keys(data.params)[0];
        if (data.params[paramKey]) {
            return data.params[paramKey];
        }
    }
    return data.label;
  }
  
  const renderHandles = () => {
      switch (data.componentType) {
          case 'start':
              return startHandlePositions.map((handle, index) => (
                  <Handle
                      key={index}
                      type="source"
                      position={handle.pos}
                      id={`${handle.pos}-source-${index}`}
                      style={handle.style}
                  />
              ));
          case 'end':
              return endHandlePositions.map((handle, index) => (
                  <Handle
                      key={index}
                      type="target"
                      position={handle.pos}
                      id={`${handle.pos}-target-${index}`}
                      style={handle.style}
                  />
              ));
          default:
              return handlePositionsDefault.flatMap((handle, index) => [
                  <Handle
                      key={`source-${index}`}
                      type="source"
                      position={handle.pos}
                      id={`${handle.pos}-source-${index}`}
                      style={handle.style}
                  />,
                  <Handle
                      key={`target-${index}`}
                      type="target"
                      position={handle.pos}
                      id={`${handle.pos}-target-${index}`}
                      style={handle.style}
                  />
              ]);
      }
  }

  const hasParams = componentInfo.params.length > 0;

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const node: Node<NodeData> = { id, data, position: {x:0, y:0}, type };
    onSettingsClick(node);
  }

  return (
    <div className="group">
      <Card 
        className={cn(
            "w-48 shadow-md hover:shadow-lg transition-shadow border-2 relative", 
            selected ? "border-primary/80" : "border-transparent",
            isConnecting && "border-primary shadow-lg ring-4 ring-primary/20"
        )}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-md">
                  <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{getLabel()}</p>
                  <p className="text-xs text-muted-foreground">{componentInfo.name}</p>
              </div>
          </div>
        </CardContent>
        {hasParams && (
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleSettingsClick}
            >
                <Settings className="w-4 h-4" />
            </Button>
        )}
      </Card>
      {renderHandles()}
    </div>
  );
}
