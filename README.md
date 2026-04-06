# Finance Hub | Global Financial Intelligence Dashboard

A high-performance, responsive finance management suite built for precision and clarity. Finance Hub transforms raw transaction data into actionable financial insights through a premium, dark-mode-first interface inspired by the world's leading fintech platforms.

This project was built from the ground up with a focus on **Responsive Engineering**—ensuring a "desktop-class" experience even on the smallest handheld devices.

---

##  Key Implementations

### Advanced Data Visualization
*   **Balance Trend Engine**: Real-time area charts tracking your net worth over time.
*   **Smart Spending Breakdown**: Dynamic pie charts that auto-categorize your expenses with hover-state intelligence.
*   **Monthly Analytics**: Automated year-over-year performance comparisons and average spending metrics.

### Responsive Engineering (Tablet & Mobile Optimized)
Unlike standard dashboards that simply "stack" elements, Finance Hub uses a custom-built responsive matrix:
*   **Table-to-Card Transformation**: On mobile, complex transaction grids automatically morph into clean, informative cards using CSS pseudo-elements and data attributes.
*   **Single-Row Mobile Navigation**: A proprietary alignment system for the Header and Tabs that fits all actions (Export, Role Switch, Theme Toggle) into a single, centered line without overcrowding.
*   **Tablet-Laptop Parity**: Large tablets (like iPads) maintain the full "space-between" laptop layout, while smaller devices gracefully transition to a centered, mobile-first stack.
*   **Fluid Typography**: Uses CSS `clamp()` and a custom design tokens system to ensure text remains legible and perfectly scaled across any viewport width.

### Transaction & Role Management
*   **Full CRUD Operations**: Intuitive modals for adding, editing, and deleting transactions with built-in confirmation workflows.
*   **Role-Based UI**: Toggle between **Admin** (full control) and **Viewer** (read-only) modes to simulate professional access environments.
*   **Excel Power Reporting**: One-click generation of detailed financial reports (XLSX) including full transaction logs and automated summary sheets.

---

##  Theme & Aesthetic
Finance Hub uses a bespoke **Glassmorphic Design System**:
*   **Dual-Theme Logic**: Seamless transition between high-contrast Dark Mode and soft, accessible Light Mode.
*   **Micro-Animations**: Powered by Framer Motion for smooth modal entries, layout transitions, and hover interactions.
*   **Zero Placeholders**: Every icon, chart, and byte of data is live and interactive.

---

## 🛠 Tech Mastery
*   **Framework**: React.js 18 (Vite-powered)
*   **State**: Centralized data management with Local Storage persistence.
*   **Analytics**: Recharts for SVG-based, performance-optimized data viz.
*   **Styling**: Pure Vanilla CSS using a custom CSS Variables architecture for the design system.
*   **Reporting**: SheetJS (XLSX) for heavy-duty browser-side report generation.

---

## ⚙️ Installation

1. **Clone the repository**
2. **Setup Dependencies**
   ```bash
   npm install
   ```
3. **Launch the Engine**
   ```bash
   npm run dev
   ```
4. **Access the Interface**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗 Project Structure
*   `/src/components`: Modular React components (Charts, Modals, Lists).
*   `/src/data.js`: Core transaction datasets and category definitions.
*   `/src/index.css`: The heart of the design system—global variables, responsive media queries, and utility classes.
*   `/src/App.jsx`: Main application orchestrator and state controller.


