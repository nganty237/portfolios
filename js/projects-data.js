/**
 * Gabriel Nganty — Portfolio Project Catalog
 * High-fidelity case study specifications
 */
const projectsData = {
  'campus-cart': {
    title: 'CampusCart - University E-Commerce & Marketplace',
    category: 'UI/UX Web Design & Full-Stack',
    badge: 'Figma Showcase',
    image: 'images/project_campuscart.svg',
    description: 'A modern, student-centric marketplace and campus delivery application prototype designed entirely in Figma with high-fidelity component libraries and interactive micro-flows, engineered with React and Node.js.',
    stack: ['Figma (UI/UX)', 'React.js', 'Node.js', 'Express', 'Tailwind CSS', 'REST API'],
    highlights: [
      'Complete end-to-end Figma UI/UX design system with reusable atomic components',
      'Intuitive checkout workflow optimized for mobile and desktop screens',
      'Vendor management dashboard and real-time student order tracking'
    ],
    figmaUrl: 'https://www.figma.com/design/S0E17hfNZxYAsqbafPcT9C/CampusCart?node-id=6-4&t=EUFiT4vO5WAvM3xE-1',
    liveUrl: 'https://www.figma.com/design/S0E17hfNZxYAsqbafPcT9C/CampusCart?node-id=6-4&t=EUFiT4vO5WAvM3xE-1',
    codeUrl: 'https://github.com/'
  },
  'poly-connect': {
    title: 'PolyConnect - ENSPD Engineering Collaboration Hub',
    category: 'Full-Stack JavaScript (Angular + Node.js)',
    badge: 'Polytechnique Douala',
    image: 'images/project_polyconnect.svg',
    description: 'An academic collaboration and project workspace platform built specifically for students and professors at the National Advanced School of Engineering of Douala (ENSPD).',
    stack: ['Angular (TypeScript)', 'Node.js / Express', 'PostgreSQL', 'Socket.io', 'Docker'],
    highlights: [
      'Real-time student chat channels and course file repository',
      'Secure JWT authentication with role-based permissions',
      'Automated grade computation and schedule reminder system'
    ],
    liveUrl: '#',
    codeUrl: 'https://github.com/'
  },
  'agri-smart': {
    title: 'AgroSmart - IoT & Agricultural Telemetry Dashboard',
    category: 'Full-Stack JavaScript (React + Node.js)',
    badge: 'Analytics & IoT',
    image: 'images/project_agrosmart.svg',
    description: 'A responsive agricultural monitoring web application providing Cameroonian cooperatives with soil sensor metrics, weather telemetry, and harvest predictive charts.',
    stack: ['React.js', 'Node.js', 'Express', 'Chart.js', 'MongoDB', 'PWA'],
    highlights: [
      'Interactive live metric visualizer with dynamic alert thresholds',
      'Offline-first PWA caching for remote farming regions',
      'Modular RESTful backend architecture'
    ],
    liveUrl: '#',
    codeUrl: 'https://github.com/'
  },
  'logix-route': {
    title: 'LogixRoute - Dispatch & Urban Delivery Optimizer',
    category: 'Full-Stack JavaScript & Systems',
    badge: 'Algorithms',
    image: 'images/project_logixroute.svg',
    description: 'An interactive route calculation and delivery dispatch system for Douala urban couriers, featuring interactive maps and graph algorithm calculations.',
    stack: ['React.js', 'Node.js', 'Leaflet.js', 'PostGIS', 'Graph Algorithms'],
    highlights: [
      'Custom Dijkstra and A* shortest path calculation heuristics',
      'Real-time driver location simulation on interactive vector maps',
      'High-throughput asynchronous dispatch endpoints'
    ],
    liveUrl: '#',
    codeUrl: 'https://github.com/'
  }
};
