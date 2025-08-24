
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
    onClick: (event: React.MouseEvent, node: Node<NodeData>) => void;
    isConnecting: boolean;
};


const handlePositionsDefault = [
  { position: Position.Top, style: { left: '50%' }, type: 'source' },
  { position: Position.Right, style: { top: '50%' }, type: 'source' },
  { position: Position.Bottom, style: { left: '50%' }, type: 'source' },
  { position: Position.Left, style: { top: '50%' }, type: 'source' },
  { position: Position.Top, style: { left: '25%' }, type: 'target' },
  { position: Position.Top, style: { left: '75%' }, type: 'target' },
  { position: Position.Bottom, style: { left: '25%' }, type: 'target' },
  { position: Position.Bottom, style: { left: '75%' }, type: 'target' },
];

const startHandlePositions = [
    { position: Position.Bottom, style: { left: '25%' }, type: 'source' },
    { position: Position.Bottom, style: { left: '50%' }, type: 'source' },
    { position: Position.Bottom, style: { left: '75%' }, type: 'source' },
];

const endHandlePositions = [
    { position: Position.Top, style: { left: '25%' }, type: 'target' },
    { position: Position.Top, style: { left: '50%' }, type: 'target' },
    { position: Position.Top, style: { left: '75%' }, type: 'target' },
];

export function CustomNode({ data, selected, id, type, onClick, isConnecting }: CustomNodeProps) {
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
  
  const getHandlePositions = () => {
      switch (data.componentType) {
          case 'start':
              return startHandlePositions;
          case 'end':
              return endHandlePositions;
          default:
              return handlePositionsDefault;
      }
  }

  const hasParams = componentInfo.params.length > 0;
  
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const node: Node<NodeData> = { id, data, position: {x:0, y:0}, type };
    onClick(e, node);
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const node: Node<NodeData> = { id, data, position: {x:0, y:0}, type };
    onClick(e, node);
  }

  return (
    <div className="group" onClick={handleNodeClick}>
      <Card 
        className={cn(
            "w-48 shadow-md hover:shadow-lg transition-shadow border-2 border-transparent relative", 
            selected && "border-primary/80 shadow-lg",
            isConnecting && "border-primary/80 shadow-lg"
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
      {getHandlePositions().map((handle, index) => (
        <Handle
            key={index}
            type={handle.type as any}
            position={handle.position}
            id={`${handle.type}-${index}`}
            style={handle.style}
        />
      ))}
    </div>
  );
}
