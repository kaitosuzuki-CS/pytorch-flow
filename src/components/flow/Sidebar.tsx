
"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { components } from '@/lib/flow-components';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';
import { Import } from 'lucide-react';
import Link from 'next/link';

export function ComponentSidebar({ projectId }: { projectId: string }) {
  const onDragStart = (event: React.DragEvent, nodeType: string, componentName: string) => {
    const data = JSON.stringify({ nodeType, componentName });
    event.dataTransfer.setData('application/reactflow', data);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-80 border-r bg-card flex flex-col z-10">
        <div className="p-4 border-b h-16 flex items-center justify-between">
            <h2 className="text-lg font-semibold font-headline">Components</h2>
            <Link href={`/explore?projectId=${projectId}`} passHref>
              <Button variant="outline" size="sm">
                  <Import className="w-4 h-4 mr-2" />
                  Import Project
              </Button>
            </Link>
        </div>
      <TooltipProvider>
        <ScrollArea className="flex-grow">
          <Accordion type="multiple" defaultValue={components.map(c => c.name)} className="w-full p-2">
            {components.map((category) => (
              <AccordionItem value={category.name} key={category.name}>
                <AccordionTrigger className="text-base px-2 hover:no-underline">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-2 p-1">
                    {category.components.map((component) => (
                      <Tooltip key={component.type} delayDuration={300}>
                        <TooltipTrigger asChild>
                          <div
                            className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-accent hover:shadow-md hover:cursor-grab active:cursor-grabbing transition-all"
                            onDragStart={(event) => onDragStart(event, component.type, component.name)}
                            draggable
                          >
                            <component.icon className="w-6 h-6 text-primary" />
                            <span className="font-medium">{component.name}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                          <p className="max-w-xs">{component.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </TooltipProvider>
    </aside>
  );
}
