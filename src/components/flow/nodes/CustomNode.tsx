"use client";

import { getComponentByType } from '@/lib/flow-components';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

type NodeData = {
  label: string;
  componentType: string;
  params: Record<string, any>;
};

const handlePositions = [
  { position: Position.Top, style: { left: '50%' } },
  { position: Position.Right, style: { top: '50%' } },
  { position: Position.Bottom, style: { left: '50%' } },
  { position: Position.Left, style: { top: '50%' } },
  { position: Position.Top, style: { left: '25%' } },
  { position: Position.Top, style: { left: '75%' } },
  { position: Position.Bottom, style: { left: '25%' } },
  { position: Position.Bottom, style: { left: '75%' } },
];

export function CustomNode({ data, selected }: NodeProps<NodeData>) {
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

  return (
    <div className="group">
      <Card className={cn("w-48 shadow-md hover:shadow-lg transition-shadow border-2 border-transparent", selected && "border-primary/80 shadow-lg")}>
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
      </Card>
      {handlePositions.map((handle, index) => (
        <React.Fragment key={index}>
            <Handle
              type="source"
              position={handle.position}
              id={`source-${index}`}
              style={handle.style}
            />
            <Handle
              type="target"
              position={handle.position}
              id={`target-${index}`}
              style={handle.style}
            />
        </React.Fragment>
      ))}
    </div>
  );
}
