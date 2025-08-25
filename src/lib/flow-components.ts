import type { LucideIcon } from 'lucide-react';
import { GitBranch, Database, FileText, Play, StopCircle, Square, Timer } from 'lucide-react';

export type Param = {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select';
  label: string;
  defaultValue: string | number | boolean;
  required?: boolean;
  optional?: boolean;
  options?: string[];
};

export type FlowComponent = {
  name: string;
  type: string;
  description: string;
  icon: LucideIcon;
  params: Param[];
};

export type ComponentCategory = {
  name: string;
  components: FlowComponent[];
};

export const components: ComponentCategory[] = [
  {
    name: "Flow Control",
    components: [
      {
        name: "Start",
        type: "start",
        description: "Marks the beginning of a process flow.",
        icon: Play,
        params: [],
      },
      {
        name: "End",
        type: "end",
        description: "Marks the termination of a process flow.",
        icon: StopCircle,
        params: [],
      },
    ],
  },
  {
    name: "Operations",
    components: [
      {
        name: "Process",
        type: "process",
        description: "Represents a single step or operation in the process.",
        icon: Square,
        params: [
          { name: "processName", type: "text", label: "Process Name", defaultValue: "Untitled Process", required: true },
          { name: "details", type: "textarea", label: "Details", defaultValue: "Add process details here...", optional: true },
        ],
      },
      {
        name: "Decision",
        type: "decision",
        description: "A point where the flow branches based on a condition.",
        icon: GitBranch,
        params: [
          { name: "condition", type: "text", label: "Condition", defaultValue: "Is condition true?", required: true },
          { name: "isAutomated", type: "boolean", label: "Automated", defaultValue: true, optional: true },
        ],
      },
      {
        name: "Delay",
        type: "delay",
        description: "Represents a delay or wait period in the process.",
        icon: Timer,
        params: [
            { name: "duration", type: "number", label: "Duration (ms)", defaultValue: 1000, required: true },
        ],
    },
    ],
  },
  {
    name: "Data",
    components: [
      {
        name: "Input/Output",
        type: "io",
        description: "Represents data being input to or output from the process.",
        icon: Database,
        params: [
          { name: "dataName", type: "text", label: "Data Name", defaultValue: "Data", required: true },
          { name: "source", type: "select", label: "Data Source", defaultValue: "database", options: ["database", "api", "file", "user_input"] }
        ],
      },
      {
        name: "Document",
        type: "document",
        description: "Represents a document or report.",
        icon: FileText,
        params: [
          { name: "documentName", type: "text", label: "Document Name", defaultValue: "Untitled Document", required: true },
        ],
      },
    ],
  },
];

export const allComponents = components.flatMap(category => category.components);

export const getComponentByType = (type: string) => {
  return allComponents.find(c => c.type === type);
}
