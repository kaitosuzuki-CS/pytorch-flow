<<<<<<< Updated upstream
"use client";

import React, { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  Connection,
} from 'reactflow';

import { Header } from '@/components/flow/Header';
import { ComponentSidebar } from '@/components/flow/Sidebar';
import { ConfigPanel } from '@/components/flow/ConfigPanel';
import { CustomNode } from '@/components/flow/nodes/CustomNode';
import { getComponentByType } from '@/lib/flow-components';
import { useToast } from "@/hooks/use-toast";

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 150 },
    data: { label: 'Start', componentType: 'start', params: {} },
  },
];
const initialEdges: Edge[] = [];

function FlowForgeCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, toObject } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { toast } = useToast();

  const nodeTypes = useMemo(() => ({
    start: CustomNode,
    end: CustomNode,
    process: CustomNode,
    decision: CustomNode,
    io: CustomNode,
    document: CustomNode,
  }), []);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;
      
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const { nodeType, componentName } = JSON.parse(type);
      const componentInfo = getComponentByType(nodeType);
      if (!componentInfo) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const params = componentInfo.params.reduce((acc, param) => {
        acc[param.name] = param.defaultValue;
        return acc;
      }, {} as Record<string, any>);

      const newNode: Node = {
        id: `${nodeType}-${+new Date()}`,
        type: nodeType,
        position,
        data: { label: componentName, componentType: nodeType, params },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );
  
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onSaveConfig = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, params: data };
        }
        return node;
      })
    );
    toast({
        title: "Configuration Saved",
        description: `Changes to "${getComponentByType(selectedNode!.data.componentType)?.name}" have been saved.`,
    });
    setSelectedNode(null);
  };

  const handleExport = () => {
    const flowObject = toObject();
    const jsonString = JSON.stringify(flowObject, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowforge-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({
        title: "Flow Exported",
        description: "Your flowchart has been successfully exported as a JSON file.",
    });
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <Header onExport={handleExport} />
      <main className="flex flex-1 pt-16">
        <ComponentSidebar />
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={16} />
          </ReactFlow>
        </div>
        <ConfigPanel 
            node={selectedNode} 
            onClose={() => setSelectedNode(null)}
            onSave={onSaveConfig}
        />
      </main>
    </div>
  );
=======
import HomeScreen from "@/components/screens/homeScreen";

export default function HomePage() {
  return <HomeScreen />;
>>>>>>> Stashed changes
}

export default function Home() {
    return (
        <ReactFlowProvider>
            <FlowForgeCanvas />
        </ReactFlowProvider>
    );
}
