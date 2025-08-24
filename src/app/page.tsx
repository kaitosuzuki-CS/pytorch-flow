
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
  NodeProps,
  OnConnectStartParams,
  useStore,
  SelectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Header } from '@/components/flow/Header';
import { ComponentSidebar } from '@/components/flow/Sidebar';
import { ConfigPanel } from '@/components/flow/ConfigPanel';
import { CustomNode } from '@/components/flow/nodes/CustomNode';
import { getComponentByType } from '@/lib/flow-components';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { SelectionToolbar } from '@/components/flow/SelectionToolbar';

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
  const { screenToFlowPosition, toObject, getNodes, getEdges } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const connectingNodeId = useRef<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const selectedNodeCount = useStore(s => s.nodeInternals.size > 0 && Array.from(s.nodeInternals.values()).filter(n => n.selected).length);
  const selectedEdgeCount = useStore(s => s.edges.filter(e => e.selected).length);
  const hasSelection = selectedNodeCount > 0 || selectedEdgeCount > 0;

  const onSettingsClick = useCallback((node: Node) => {
    setSelectedNode(node);
  }, []);

  const nodeTypes = useMemo(() => ({
    start: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNodeId.current === props.id} />,
    end: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNodeId.current === props.id} />,
    process: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNodeId.current === props.id} />,
    decision: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNodeId.current === props.id} />,
    io: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNodeId.current === props.id} />,
    document: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNodeId.current === props.id} />,
  }), [onSettingsClick]);


  const onConnectStart = useCallback((_: any, { nodeId }: OnConnectStartParams) => {
    connectingNodeId.current = nodeId!;
    setIsConnecting(true);
  }, []);

  const onConnectEnd = useCallback((event: any) => {
    // This is a workaround to detect clicks on the pane to cancel connection
    if (!event.target.closest('.react-flow__handle')) {
        if(connectingNodeId.current){
             onNodesChange([{ id: connectingNodeId.current, type: 'select', selected: false }]);
        }
       connectingNodeId.current = null;
       setIsConnecting(false);
    }
  }, [onNodesChange]);
  
  const onConnect = useCallback(
    (params: Edge | Connection) => {
        setEdges((eds) => addEdge(params, eds));
        if (connectingNodeId.current) {
            onNodesChange([{ id: connectingNodeId.current, type: 'select', selected: false }]);
        }
        connectingNodeId.current = null;
        setIsConnecting(false);
    },
    [setEdges, onNodesChange]
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

  const onDeleteSelection = () => {
    const selectedNodes = getNodes().filter(n => n.selected);
    const selectedEdges = getEdges().filter(e => e.selected);
    
    setNodes(nodes => nodes.filter(n => !n.selected));
    setEdges(edges => edges.filter(e => !e.selected));

    toast({
      title: "Selection Deleted",
      description: `Deleted ${selectedNodes.length} nodes and ${selectedEdges.length} edges.`,
    });
  };

  const onCancelConnection = () => {
    if (connectingNodeId.current) {
        onNodesChange([{ id: connectingNodeId.current, type: 'select', selected: false }]);
    }
    connectingNodeId.current = null;
    setIsConnecting(false);
  }

  const handlePaneClick = () => {
    setSelectedNode(null);
    onCancelConnection();
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header onExport={handleExport} />
      <main className="flex flex-1 overflow-hidden">
        <ComponentSidebar />
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.4 }}
            className={cn(isConnecting && 'connecting')}
            selectionOnDrag
            selectionMode={SelectionMode.Partial}
            nodesDraggable
          >
            <Controls />
            <MiniMap />
            <Background gap={16} />
            <SelectionToolbar 
              isVisible={hasSelection || isConnecting}
              isConnecting={isConnecting}
              onDelete={onDeleteSelection}
              onCancelConnection={onCancelConnection}
              nodeCount={selectedNodeCount || 0}
              edgeCount={selectedEdgeCount || 0}
            />
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
}

export default function Home() {
    return (
        <ReactFlowProvider>
            <FlowForgeCanvas />
        </ReactFlowProvider>
    );
}
