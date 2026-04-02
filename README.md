# Finance Dashboard UI

A premium, responsive, and interactive frontend demonstration of a modern Finance Dashboard. Built with React.js, Vite, and Framer Motion, this project emphasizes contemporary design principles, seamless micro-animations, and robust state management.

## ✨ Features

- **At-a-Glance Dashboard:** Summary metrics for total balance, income, and expenses accompanied by a balance trend area chart and spending breakdown pie chart.
- **Transaction Management:** A fully searchable and filterable history of financial activity.
- **Smart Insights:** Automatically surfaces the highest spending category, largest single expense, and overarching activity summaries.
- **Simulated Role-Based Access Control (RBAC):** 
  - *Viewer:* Restricted to read-only access.
  - *Admin:* Granted privileges to add and delete transaction records.
- **Interactive UI:** Smooth, animated modals via Framer Motion for data entry and transitions.
- **Theming:** Native dark/light mode functionality using CSS variables.
- **Data Persistence:** Local storage integration ensures user state and transaction history are saved across sessions.

## 🛠 Tech Stack

- **React.js (Vite):** Leveraging a component-based architecture for efficient rendering and rapid development.
- **Recharts:** Composable and responsive data visualizations.
- **Lucide-React:** Lightweight, crisp SVG typography and icon system.
- **Framer Motion:** Engineering fluid UI transitions and component animations.
- **Vanilla CSS:** Custom variable-driven styling for total control over the design system, omitting utility frameworks to demonstrate core design competencies.

## 🚀 Getting Started

1. **Clone or Download the Repository**
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Run the Development Server**
   ```bash
   npm run dev
   ```
4. **View the Application**
   Open your browser and navigate to `http://localhost:5173`.

## 💡 Architectural Approach

- **Design-First Methodology:** Established a robust CSS token system (`index.css`) outlining color palettes, typography, and glassmorphic utilities prior to implementation.
- **Component Modularity:** Encapsulated logic and presentation within isolated components (e.g., `DashboardOverview`, `TransactionsList`, `InsightsPanel`).
- **Performance Optimization:** Implemented `useMemo` hooks for complex calculations (transaction filtering, insights derivation, chart data aggregation) to mitigate unnecessary re-renders.
- **Centralized State:** Utilized a "Lifting State Up" strategy, positioning core financial state within `App.jsx` for predictable downhill data flow.

## 🔮 Future Roadmap

- Backend API integration comprehensively paired with strict RBAC enforcement.
- Export functionality for reports and transaction histories (CSV/JSON formats).
- Enhanced data visualizations, including month-over-month comparative analysis.
