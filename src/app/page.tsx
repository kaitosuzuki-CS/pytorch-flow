
"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
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
  HandleType,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
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
import { useHistory } from '@/hooks/use-history';

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
  const {
    state,
    setState,
    canUndo,
    canRedo,
    undo,
    redo
  } = useHistory({ nodes: initialNodes, edges: initialEdges });

  const { nodes, edges } = state;

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  const connectingNode = useRef<{nodeId: string, handleId: string | null, handleType: HandleType} | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [justConnected, setJustConnected] = useState(false);
  const { toast } = useToast();

  const selectedNodeCount = useStore(s => s.nodeInternals.size > 0 && Array.from(s.nodeInternals.values()).filter(n => n.selected).length);
  const selectedEdgeCount = useStore(s => s.edges.filter(e => e.selected).length);
  const hasSelection = selectedNodeCount > 0 || selectedEdgeCount > 0;

  const onNodesChange = useCallback((changes: NodeChange[]) => {
      setState(current => ({
          ...current,
          nodes: applyNodeChanges(changes, current.nodes)
      }), {
          skip: changes.every(change => (change.type === 'position' && change.dragging) || change.type === 'select')
      });
  }, [setState]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
      setState(current => ({
          ...current,
          edges: applyEdgeChanges(changes, current.edges)
      }), { skip: changes.every(change => change.type === 'select') });
  }, [setState]);
  
  const onSettingsClick = useCallback((node: Node) => {
    setSelectedNode(node);
  }, []);

  const nodeTypes = useMemo(() => ({
    start: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNode.current?.nodeId === props.id} />,
    end: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNode.current?.nodeId === props.id} />,
    process: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNode.current?.nodeId === props.id} />,
    decision: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNode.current?.nodeId === props.id} />,
    io: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNode.current?.nodeId === props.id} />,
    document: (props: NodeProps) => <CustomNode {...props} onSettingsClick={onSettingsClick} isConnecting={connectingNode.current?.nodeId === props.id} />,
  }), [onSettingsClick]);


  const onConnectStart = useCallback((_: React.MouseEvent, { nodeId, handleId, handleType }: OnConnectStartParams) => {
    if (nodeId && handleType) {
      connectingNode.current = { nodeId, handleId, handleType };
      setIsConnecting(true);
    }
  }, []);

  const onConnectEnd = useCallback((event: MouseEvent) => {
     // This is a workaround to detect clicks on the pane to cancel connection
     if (!(event.target as HTMLElement).closest('.react-flow__handle')) {
        if(connectingNode.current){
             onNodesChange([{ id: connectingNode.current.nodeId, type: 'select', selected: false }]);
        }
       connectingNode.current = null;
       setIsConnecting(false);
    }
  }, [onNodesChange]);
  
  const onConnect = useCallback(
    (params: Edge | Connection) => {
        setState(current => ({ ...current, edges: addEdge(params, current.edges) }));
        setJustConnected(true);
        setTimeout(() => setJustConnected(false), 500); // Reset after animation
        connectingNode.current = null;
        setIsConnecting(false);
    },
    [setState]
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

      setState(current => ({ ...current, nodes: current.nodes.concat(newNode) }));
    },
    [screenToFlowPosition, setState]
  );
  

  const onSaveConfig = (nodeId: string, data: any) => {
    setState(current => ({
      ...current,
      nodes: current.nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, params: data };
        }
        return node;
      })
    }));

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
    const selectedNodes = getNodes().filter(n => n.selected).map(n => n.id);
    const selectedEdges = getEdges().filter(e => e.selected).map(e => e.id);
    
    setState(current => ({
        ...current,
        nodes: current.nodes.filter(n => !selectedNodes.includes(n.id)),
        edges: current.edges.filter(e => !selectedEdges.includes(e.id))
    }));

    toast({
      title: "Selection Deleted",
      description: `Deleted ${selectedNodes.length} nodes and ${selectedEdges.length} edges.`,
    });
  };

  const onCancelConnection = () => {
    if (connectingNode.current) {
        onNodesChange([{ id: connectingNode.current.nodeId, type: 'select', selected: false }]);
    }
    connectingNode.current = null;
    setIsConnecting(false);
  }

  const handlePaneClick = () => {
    setSelectedNode(null);
    onCancelConnection();
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        if (!event.shiftKey) {
          undo();
        } else {
          redo();
        }
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);


  return (
    <div className="flex h-screen flex-col bg-background">
      <Header onExport={handleExport} onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
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
            className={cn(
              isConnecting && 'connecting',
              justConnected && 'connected'
            )}
            selectionOnDrag
            selectionMode={SelectionMode.Partial}
            panOnDrag
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
