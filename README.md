# CloudView – Dynamic Dashboard Widget Management System

CloudView is a cloud security operations dashboard (CNAPP) built with React.js and Vite. It provides real-time visibility across Cloud Security Posture Management (CSPM), Cloud Workload Protection (CWPP), Registry Scanning, and Ticket Management, featuring a dynamic widget management engine that enables users to add, assign, toggle, search, and remove widgets seamlessly with persistent local storage.

The dashboard layout and functionality faithfully follow the design reference and requirements from the Frontend Assignment specification.

---

## Features

- **Dynamic JSON-Driven Dashboard**:
  - Dynamically renders 4 primary security categories:
    1. **CSPM Executive Dashboard** (Cloud Accounts, Risk Assessment)
    2. **CWPP Dashboard** (Namespace Specific Alerts, Workload Alerts)
    3. **Registry Scan** (Image Risk Assessment, Image Security Issues)
    4. **Ticket Management** (Open Tickets, Ticket Resolution Rate)
  - All widget cards and visual data structures are mapped dynamically from separate JSON configuration (`src/data/dashboardData.js`).

- **Interactive Visualizations (CSS & SVG)**:
  - Custom donut charts with centered total counts and interactive color-coded status legends (Failed, Warning, Not Available, Passed).
  - Multi-segment horizontal stacked progress bars displaying vulnerability severities (Critical, High, Medium, Low).
  - Circular resolution progress gauges with real-time percentages.
  - Severity status badge grids.
  - Zero-state data visualizer ("No Graph data available!").

- **Add Widget Drawer (Slide-out Panel)**:
  - Slide-out management drawer styled with a dark navy header banner matching the reference design.
  - Tabbed interface (`CSPM`, `CWPP`, `Image`, `Ticket`, `+ New Widget`).
  - Keyboard accessible with Escape key dismiss.
  - Form validation for creating new custom widgets:
    - Widget Name (required, with duplicate detection per category)
    - Widget Text/Description (required)
    - Multi-category checkboxes (at least one category required)
  - Generates unique IDs and allows a single widget to be assigned across multiple categories simultaneously.

- **Category Checkbox Assignment & Management**:
  - Checkbox-driven widget assignment per category:
    - **Checked**: Widget is displayed on the dashboard for that category.
    - **Unchecked**: Widget is removed from that category view.
  - Master widget catalog maintains unassigned widgets, allowing users to re-enable them at any time.
  - Includes a collapsible section to assign widgets from other categories.

- **Instant Widget Removal**:
  - Each widget card features a dedicated remove (`X`) icon button.
  - Removes the widget from its current category while preserving its existence in other categories and master catalog.

- **Real-Time Global Search**:
  - Live search bar in the header ("Search anything...").
  - Searches dynamically across all categories by widget name, category name, and content text as you type.
  - Displays search results banner with match count.
  - Features an empty search state ("No Widgets Found") when no results match.
  - One-click clear search button restores the complete dashboard view.

- **Dynamic Summary Statistics**:
  - Top metric summary cards displaying:
    - **Total Categories** (dynamic count)
    - **Total Widget Assignments** (total cards displayed across categories)
    - **Total Unique Widgets** (deduplicated unique modules)

- **Local Storage Persistence & Reset**:
  - All changes (widget additions, removals, category checkbox toggles) automatically persist to `localStorage`.
  - Survives page refreshes and browser restarts.
  - Safe fallback to initial seed data if storage is empty or invalid.
  - Features a "Reset to Default State" option in the toolbar options menu to restore initial template anytime.

- **Responsive Design**:
  - **Desktop**: Collapsible navigation sidebar, 3-column widget card grid, right-side management drawer.
  - **Tablet**: 2-column widget card grid, responsive controls.
  - **Mobile**: Single-column responsive layout, slide-out mobile drawer, clean header controls.

---

## Technology Stack

- **React.js** (v19)
- **JavaScript (ES6+ / JSX)**
- **Vite** (Next Generation Frontend Tooling)
- **React Context API** (`createContext`, `useContext`)
- **useReducer** (Predictable immutable state management)
- **useState, useEffect, useMemo, useCallback**
- **Lucide React** (Clean, modern iconography)
- **Custom CSS** (CSS Variables, Flexbox, CSS Grid, Conic Gradients, Transitions)
- **HTML5 LocalStorage**

---

## Folder Structure

```
cloudview-dashboard/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AddWidgetDrawer.jsx     # Slide-out drawer with tabs, checkboxes & add form
│   │   ├── CategorySection.jsx    # Category grid & "+ Add Widget" card
│   │   ├── DashboardStats.jsx     # Summary KPI statistics cards
│   │   ├── EmptyState.jsx         # Empty graph placeholder
│   │   ├── Header.jsx             # Breadcrumb, global search, notifications, avatar
│   │   ├── SearchBar.jsx          # Live search input with clear trigger
│   │   ├── Sidebar.jsx            # Left navigation sidebar with mobile drawer
│   │   └── WidgetCard.jsx         # Donut, stacked bar, circular & badge widgets
│   ├── context/
│   │   └── DashboardContext.jsx   # Global state, useReducer, localStorage sync
│   ├── data/
│   │   └── dashboardData.js       # Initial seed data for CNAPP categories & widgets
│   ├── hooks/
│   │   └── useDashboard.js        # Custom hook consuming DashboardContext
│   ├── styles/
│   │   ├── components.css         # Sidebar, header, toolbar, drawer & modal styles
│   │   ├── dashboard.css          # Cards, grids, charts, empty states, toasts
│   │   └── global.css             # CSS reset, typography, CSS variables
│   ├── App.css
│   ├── App.jsx                    # Main dashboard layout, search filters & toolbar
│   ├── index.css
│   └── main.jsx                   # Entry point wrapping DashboardProvider
├── index.html
├── package.json
├── vercel.json
├── vite.config.js
└── README.md
```

---

## Installation & Setup Instructions

### 1. Prerequisites
- Node.js (version 18 or higher recommended)
- npm (Node Package Manager)

### 2. Install Dependencies
Open a terminal in the project directory and run:

```bash
npm install
```

### 3. Run Development Server
Start the local Vite development server:

```bash
npm run dev
```

Open your browser at the local URL displayed in your terminal (typically `http://localhost:5173/`).

### 4. Build for Production
Create an optimized production bundle:

```bash
npm run build
```

The compiled files will be output to the `dist/` folder.

### 5. Preview Production Build
Preview the production build locally:

```bash
npm run preview
```

