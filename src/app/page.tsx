
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

import { Header, InteractionMode } from '@/components/flow/Header';
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

const panOnDragWithRightButton = [2];
const panOnDragWithLeftButton = [1];


function FlowForgeCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, toObject, getNodes, getEdges } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [connectingNode, setConnectingNode] = useState<OnConnectStartParams | null>(null);
  const { toast } = useToast();
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('selection');

  const selectedNodeCount = useStore(s => s.nodeInternals.size > 0 && Array.from(s.nodeInternals.values()).filter(n => n.selected).length);
  const selectedEdgeCount = useStore(s => s.edges.filter(e => e.selected).length);
  const hasSelection = selectedNodeCount > 0 || selectedEdgeCount > 0;

  const onNodeClick = useCallback((_: React.MouseEvent, node: NodeProps) => {
    const componentInfo = getComponentByType(node.data.componentType);
    if(componentInfo && componentInfo.params.length > 0){
      setSelectedNode(node as Node);
    }
  }, []);

  const nodeTypes = useMemo(() => ({
    start: (props: any) => <CustomNode {...props} onNodeClick={onNodeClick} isConnecting={connectingNode?.nodeId === props.id} />,
    end: (props: any) => <CustomNode {...props} onNodeClick={onNodeClick} isConnecting={connectingNode?.nodeId === props.id} />,
    process: (props: any) => <CustomNode {...props} onNodeClick={onNodeClick} isConnecting={connectingNode?.nodeId === props.id} />,
    decision: (props: any) => <CustomNode {...props} onNodeClick={onNodeClick} isConnecting={connectingNode?.nodeId === props.id} />,
    io: (props: any) => <CustomNode {...props} onNodeClick={onNodeClick} isConnecting={connectingNode?.nodeId === props.id} />,
    document: (props: any) => <CustomNode {...props} onNodeClick={onNodeClick} isConnecting={connectingNode?.nodeId === props.id} />,
  }), [onNodeClick, connectingNode]);

  const onConnectStart = useCallback((_: React.MouseEvent, params: OnConnectStartParams) => {
    setConnectingNode(params);
  }, []);

  const onConnectEnd = useCallback(() => {
    setConnectingNode(null);
  }, []);
  
  const onConnect = useCallback(
    (params: Edge | Connection) => {
        // Handle click-to-connect
        if (connectingNode) {
            const newEdge = {
                ...params,
                source: connectingNode.nodeId!,
                sourceHandle: connectingNode.handleId,
            };
            setEdges((eds) => addEdge(newEdge, eds));
            setConnectingNode(null);
        } else {
            // Handle drag-to-connect
            setEdges((eds) => addEdge(params, eds));
        }
    },
    [setEdges, connectingNode]
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
    setConnectingNode(null);
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header onExport={handleExport} interactionMode={interactionMode} onInteractionModeChange={setInteractionMode} />
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
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            className={cn(connectingNode && 'connecting')}
            panOnDrag={interactionMode === 'pan' ? panOnDragWithLeftButton : panOnDragWithRightButton}
            selectionOnDrag={interactionMode === 'selection'}
            selectionMode={SelectionMode.Partial}
            nodesDraggable={interactionMode === 'selection'}
          >
            <Controls />
            <MiniMap />
            <Background gap={16} />
            <SelectionToolbar 
              isVisible={hasSelection || !!connectingNode}
              isConnecting={!!connectingNode}
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
