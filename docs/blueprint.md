# **App Name**: FlowForge

## Core Features:

- Canvas Interface: Provide a drag-and-drop interface using React Flow for creating flowcharts.
- Component Sidebar: A sidebar with collapsible categories to organize available flowchart components.
- Component Description Popups: Display a detailed description of each component on hover in the sidebar.
- Multiple Connection Points: Enable components to have multiple connection points (e.g., 8 spots) for creating links to other components.
- Configuration Popup: Display a configuration panel when a component is clicked, allowing users to modify parameters.
- JSON Export: Allow users to export the flowchart as a JSON file, including position and configuration details.
- components.json: make a components.json file with all available components organized by category: [{component: {name: , description: , params: [], paramTypes: []}

## Style Guidelines:

- Primary color: Slate Blue (#737CA1), a muted yet distinctive choice that aligns with creativity.
- Background color: Off-white (#F5F5F5), ensuring a light interface that is easy on the eyes.
- Accent color: Lavender (#E6E6FA) provides a soft contrast, marking interactive components.
- Font pairing: 'Space Grotesk' (sans-serif) for headers, and 'Inter' (sans-serif) for body text. (Note: currently only Google Fonts are supported.)
- Use simple, outlined icons for components in the sidebar to ensure clarity.
- The screen is divided into a 3:7 ratio with the sidebar taking up the smaller portion and the canvas the larger.
- Use subtle animations on hover and selection to improve user experience, highlighting interactive elements.