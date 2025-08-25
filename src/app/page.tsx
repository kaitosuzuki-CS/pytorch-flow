
"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";

import { Header } from "@/components/flow/Header";
import { ComponentSidebar } from "@/components/flow/Sidebar";
import { ConfigPanel } from "@/components/flow/ConfigPanel";
import { CustomNode } from "@/components/flow/nodes/CustomNode";
import { getComponentByType } from "@/lib/flow-components";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SelectionToolbar } from "@/components/flow/SelectionToolbar";
import { InteractionMode } from "@/lib/type";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "start",
    position: { x: 250, y: 150 },
    data: { label: "Start", componentType: "start", params: {} },
  },
];
const initialEdges: Edge[] = [];

function FlowForgeCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, toObject, getNodes, getEdges, setViewport } = useReactFlow();

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const connectingNode = useRef<{
    nodeId: string;
    handleId: string | null;
    handleType: HandleType;
  } | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [justConnected, setJustConnected] = useState(false);
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("selection");
  const { toast } = useToast();

  const selectedNodeCount = useStore((s) =>
    s.nodeInternals.size > 0
      ? Array.from(s.nodeInternals.values()).filter((n) => n.selected).length
      : 0
  );
  const selectedEdgeCount = useStore(
    (s) => s.edges.filter((e) => e.selected).length
  );
  const hasSelection = selectedNodeCount > 0 || selectedEdgeCount > 0;

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  const onSettingsClick = useCallback((node: Node) => {
    setSelectedNode(node);
  }, []);

  const nodeTypes = useMemo(
    () => ({
      start: (props: NodeProps) => (
        <CustomNode
          {...props}
          onSettingsClick={onSettingsClick}
          isConnecting={connectingNode.current?.nodeId === props.id}
        />
      ),
      end: (props: NodeProps) => (
        <CustomNode
          {...props}
          onSettingsClick={onSettingsClick}
          isConnecting={connectingNode.current?.nodeId === props.id}
        />
      ),
      process: (props: NodeProps) => (
        <CustomNode
          {...props}
          onSettingsClick={onSettingsClick}
          isConnecting={connectingNode.current?.nodeId === props.id}
        />
      ),
      decision: (props: NodeProps) => (
        <CustomNode
          {...props}
          onSettingsClick={onSettingsClick}
          isConnecting={connectingNode.current?.nodeId === props.id}
        />
      ),
      delay: (props: NodeProps) => (
        <CustomNode
          {...props}
          onSettingsClick={onSettingsClick}
          isConnecting={connectingNode.current?.nodeId === props.id}
        />
      ),
      io: (props: NodeProps) => (
        <CustomNode
          {...props}
          onSettingsClick={onSettingsClick}
          isConnecting={connectingNode.current?.nodeId === props.id}
        />
      ),
      document: (props: NodeProps) => (
        <CustomNode
          {...props}
          onSettingsClick={onSettingsClick}
          isConnecting={connectingNode.current?.nodeId === props.id}
        />
      ),
    }),
    [onSettingsClick]
  );

  const onConnectStart = useCallback(
    (
      _: React.MouseEvent | React.TouchEvent,
      { nodeId, handleId, handleType }: OnConnectStartParams
    ) => {
      if (nodeId && handleType) {
        connectingNode.current = { nodeId, handleId, handleType };
        setIsConnecting(true);
      }
    },
    []
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // This is a workaround to detect clicks on the pane to cancel connection
      if (!(event.target as HTMLElement).closest(".react-flow__handle")) {
        if (connectingNode.current) {
          onNodesChange([
            {
              id: connectingNode.current.nodeId,
              type: "select",
              selected: false,
            },
          ]);
        }
        connectingNode.current = null;
        setIsConnecting(false);
      }
    },
    [onNodesChange]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge(params, eds));
      setJustConnected(true);
      setTimeout(() => setJustConnected(false), 500); // Reset after animation
      connectingNode.current = null;
      setIsConnecting(false);
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
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
      description: `Changes to "${
        getComponentByType(selectedNode!.data.componentType)?.name
      }" have been saved.`,
    });
    setSelectedNode(null);
  };

  const handleExport = () => {
    const flowObject = toObject();
    const jsonString = JSON.stringify(flowObject, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flowforge-export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Flow Exported",
      description:
        "Your flowchart has been successfully exported as a JSON file.",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flow = JSON.parse(e.target?.result as string);
        if (flow && flow.nodes && flow.edges) {
          const { nodes: newNodes, edges: newEdges, viewport } = flow;
          
          const remappedNodes = newNodes.map((node: Node) => ({
            ...node,
            id: `${node.id}-${+new Date()}`,
          }));
  
          const remappedEdges = newEdges.map((edge: Edge) => ({
            ...edge,
            id: `${edge.id}-${+new Date()}`,
            source: `${edge.source}-${+new Date()}`,
            target: `${edge.target}-${+new Date()}`,
          }));

          setNodes((nds) => nds.concat(remappedNodes));
          setEdges((eds) => eds.concat(remappedEdges));

          toast({
            title: "Flow Imported",
            description: "The flowchart has been successfully imported.",
          });
        } else {
          throw new Error("Invalid JSON structure");
        }
      } catch (error) {
        console.error("Error importing JSON:", error);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "The selected file is not a valid FlowForge JSON.",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };


  const onDeleteSelection = () => {
    const selectedNodes = getNodes()
      .filter((n) => n.selected)
      .map((n) => n.id);
    const selectedEdges = getEdges()
      .filter((e) => e.selected)
      .map((e) => e.id);

    setNodes((nds) => nds.filter((n) => !selectedNodes.includes(n.id)));
    setEdges((eds) => eds.filter((e) => !selectedEdges.includes(e.id)));

    toast({
      title: "Selection Deleted",
      description: `Deleted ${selectedNodes.length} nodes and ${selectedEdges.length} edges.`,
    });
  };

  const onCancelConnection = () => {
    if (connectingNode.current) {
      onNodesChange([
        { id: connectingNode.current.nodeId, type: "select", selected: false },
      ]);
    }
    connectingNode.current = null;
    setIsConnecting(false);
  };

  const handlePaneClick = () => {
    setSelectedNode(null);
    onCancelConnection();
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header
        onExport={handleExport}
        onImport={handleImport}
        interactionMode={interactionMode}
        onInteractionModeChange={setInteractionMode}
      />
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
              isConnecting && "connecting",
              justConnected && "connected"
            )}
            selectionMode={SelectionMode.Partial}
            nodesDraggable
            panOnScroll={interactionMode === "selection"}
            selectionOnDrag={interactionMode === "selection"}
            panOnDrag={interactionMode === "pan"}
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
