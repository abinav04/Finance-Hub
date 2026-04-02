import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import Dropdown from './Dropdown';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function DashboardOverview({ transactions }) {
  const [selectedMonth, setSelectedMonth] = React.useState('all');

  const monthOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'All Time' }];
    const monthsFound = new Set();
    
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!monthsFound.has(key)) {
        monthsFound.add(key);
        options.push({
          value: key,
          label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        });
      }
    });
    
    // Sort options by date (newest first, keeping 'all' at top)
    const [all, ...others] = options;
    others.sort((a, b) => {
      const [yearA, monthA] = a.value.split('-').map(Number);
      const [yearB, monthB] = b.value.split('-').map(Number);
      return yearB !== yearA ? yearB - yearA : monthB - monthA;
    });
    
    return [all, ...others];
  }, [transactions]);

  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      if (t.type === 'expense') expenses += Number(t.amount);
    });
    return {
      balance: income - expenses,
      income,
      expenses
    };
  }, [transactions]);

  // Aggregate for Pie Chart (Expense breakdown)
  const expenseData = useMemo(() => {
    const categories = {};
    let filtered = transactions.filter(t => t.type === 'expense');
    
    if (selectedMonth !== 'all') {
      const [year, month] = selectedMonth.split('-').map(Number);
      filtered = filtered.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === year && (d.getMonth() + 1) === month;
      });
    }

    filtered.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
    });
    return Object.keys(categories).map(key => ({
      name: key,
      value: categories[key]
    })).sort((a, b) => b.value - a.value);
  }, [transactions, selectedMonth]);

  // Aggregate for Area chart (Balance trend over time proxy)
  // Just sorting by date and keeping a running balance
  const trendData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentBalance = 0;
    const data = [];
    
    // Group by date to avoid multiple points on same day
    const groupedByDate = {};
    sorted.forEach(t => {
      if (!groupedByDate[t.date]) {
        groupedByDate[t.date] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') groupedByDate[t.date].income += Number(t.amount);
      if (t.type === 'expense') groupedByDate[t.date].expense -= Number(t.amount); // negative for easy math
    });

    Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b)).forEach(date => {
      const dayNet = groupedByDate[date].income + groupedByDate[date].expense;
      currentBalance += dayNet;
      data.push({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: currentBalance
      });
    });
    return data;
  }, [transactions]);

  return (
    <div>
      <div className="summary-grid">
        <div className="solid-card summary-card">
          <div className="summary-card-header">
            <span>Total Balance</span>
            <Wallet size={20} className="text-secondary" color="var(--accent-primary)" />
          </div>
          <div className="summary-card-amount">
            ${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="solid-card summary-card">
          <div className="summary-card-header">
            <span>Total Income</span>
            <TrendingUp size={20} color="var(--success)" />
          </div>
          <div className="summary-card-amount" style={{ color: 'var(--success)' }}>
            +${stats.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="solid-card summary-card">
          <div className="summary-card-header">
            <span>Total Expenses</span>
            <TrendingDown size={20} color="var(--danger)" />
          </div>
          <div className="summary-card-amount" style={{ color: 'var(--text-primary)' }}>
            -${stats.expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ minWidth: 0, overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: 600 }}>Balance Trend</h3>
          <div style={{ height: '300px', width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="balance" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Spending Breakdown</h3>
            <div className="input-group" style={{ padding: '2px 8px', maxWidth: '180px' }}>
              <Calendar size={16} color="var(--text-tertiary)" />
              <Dropdown 
                value={selectedMonth} 
                onChange={setSelectedMonth}
                options={monthOptions}
                buttonStyle={{ padding: '4px 8px', minWidth: '120px' }}
              />
            </div>
          </div>
          <div style={{ height: '300px', display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `$${value}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-secondary">
                No expense data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
