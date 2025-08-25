
"use client";

import React from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Workflow } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/lib/type';
import { Badge } from '../ui/badge';
import { useSearchParams } from 'next/navigation';

interface ProjectViewerProps {
    project: Project;
    nodes: Node[];
    edges: Edge[];
    nodeTypes: Record<string, React.ComponentType<NodeProps>>;
}

export function ProjectViewer({ project, nodes, edges, nodeTypes }: ProjectViewerProps) {
  const searchParams = useSearchParams();
  const fromProjectId = searchParams.get('fromProjectId');

  const backLink = fromProjectId ? `/explore?projectId=${fromProjectId}` : '/explore';

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between h-16 px-6 bg-background border-b z-20">
        <div className="flex items-center gap-3 min-w-0">
            <Workflow className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-foreground hidden sm:block">
                FlowForge
            </h1>
        </div>
        <div className="flex items-center gap-2">
            <Link href={backLink} passHref>
                <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Explore
                </Button>
            </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className='flex flex-col items-center mb-4'>
            <h2 className="text-2xl font-bold font-headline">{project.name}</h2>
            <Badge variant='secondary' className='mt-1'>Public (View-only)</Badge>
        </div>
        <div className="w-full h-[calc(100vh-12rem)] border rounded-lg">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.4 }}
                nodesDraggable={false}
                nodesConnectable={false}
                nodesFocusable={false}
                edgesFocusable={false}
                panOnDrag={true}
                zoomOnScroll={true}
                zoomOnPinch={true}
                zoomOnDoubleClick={true}
                panOnScroll={true}
                preventScrolling={false}
            >
                <Controls showInteractive={false} />
                <MiniMap />
                <Background gap={16} />
            </ReactFlow>
        </div>
      </main>
    </div>
  );
}
