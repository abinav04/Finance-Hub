# Finance Dashboard UI

A clean, responsive, and interactive Finance Dashboard UI built with React.js, Vite, and Framer Motion. This project is a frontend-only demonstration showcasing modern design principles, reusable components, and robust state management.

## Features

* **Dashboard Overview**: Summary cards showing total balance, income, and expenses. Includes a balance trend area chart and a spending breakdown pie chart.
* **Transactions Section**: A searchable and filterable list of mock transactions.
* **Smart Insights Panel**: Automatically identifies highest spending category, largest single expense, and overall activity summary.
* **Role-Based UI (Simulation)**: 
  * *Viewer*: Can only see data.
  * *Admin*: Can add or delete transactions.
* **Interactive Modals**: Seamless animated modals using Framer Motion for adding new transactions.
* **Dark Mode**: Toggleable dark mode supported via standard CSS variables.
* **Local Storage Persistence**: Your transactions and state are saved in the browser's local storage.

## Tech Stack

* **React.js (Vite)**: For fast bootstrapping and efficient rendering with a component-based architecture.
* **Recharts**: For simple, composable, and responsive charts.
* **Lucide-React**: For clean SVG icons.
* **Framer Motion**: For smooth micro-animations during tab transitions and modal rendering.
* **Vanilla CSS**: Used CSS variables for custom styling and theming (dark mode), explicitly without Tailwind, to demonstrate core CSS competency and flexibility.

## Setup Instructions

1. **Clone or Download the Repository**
2. **Navigate to the Project Directory**:
   ```bash
   cd AntigravityTrial
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** and visit `http://localhost:5173` (or the port specified by Vite).

## Overview of Approach

1. **Design First**: Designed the CSS variables and base tokens (`index.css`) to enforce a premium, glassmorphic aesthetic before writing React code. A light/dark palette was carefully selected.
2. **Component Modularity**: Broke the UI down into well-defined, isolated components (`DashboardOverview`, `TransactionsList`, `InsightsPanel`, etc.).
3. **Optimized Renders**: Used `useMemo` hooks extensively for filtering transactions, calculating insights, and aggregating data for charts, preventing unnecessary recalculation on unrelated state changes.
4. **State Management**: Simple but highly effective Lifting State Up approach. All core financial data is managed in `App.jsx` and injected where needed.

## Future Enhancements
* Backend integration and full RBAC (Role-Based Access Control).
* Exporting transactions via CSV/JSON.
* More advanced charting, like monthly grouping overlay visualizations.
