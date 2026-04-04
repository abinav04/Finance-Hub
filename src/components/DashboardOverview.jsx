import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import Dropdown from './Dropdown';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function DashboardOverview({ transactions }) {
  const [trendViewType, setTrendViewType] = React.useState('Monthly');

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

  const expenseMetrics = useMemo(() => {
    let daily = 0; let weekly = 0; let monthly = 0;
    let latestTimestamp = 0;
    transactions.forEach(t => {
      const ts = new Date(t.date).getTime();
      if (ts > latestTimestamp) latestTimestamp = ts;
    });
    const latestDate = latestTimestamp > 0 ? new Date(latestTimestamp) : new Date();

    transactions.forEach(t => {
      if (t.type === 'expense') {
        const d = new Date(t.date);
        const diffDays = Math.abs(latestDate - d) / (1000 * 60 * 60 * 24); 
        if (diffDays <= 1) daily += Number(t.amount);
        if (diffDays <= 7) weekly += Number(t.amount);
        if (diffDays <= 30) monthly += Number(t.amount);
      }
    });
    return { daily, weekly, monthly };
  }, [transactions]);

  const expenseRadialData = useMemo(() => {
    const categories = {};
    const filtered = transactions.filter(t => t.type === 'expense');
    let totalExpense = 0;
    
    filtered.forEach(t => {
      const val = Number(t.amount);
      categories[t.category] = (categories[t.category] || 0) + val;
      totalExpense += val;
    });
    
    let sorted = Object.keys(categories).map(key => ({
      name: key,
      realValue: categories[key],
    })).sort((a, b) => b.realValue - a.realValue);
    
    if (sorted.length > 4) sorted = sorted.slice(0, 4);
    // Array remains in descending order, mapping the largest percentages securely to the innermost rings
    
    const colors = ['#22c55e', '#ef4444', '#f97316', '#0ea5e9']; // Green, Red, Orange, Blue
    
    return sorted.map((item, index) => {
      const percentage = totalExpense > 0 ? (item.realValue / totalExpense) * 100 : 0;
      return {
        ...item,
        value: percentage, // Enforced mathematically against PolarAngleAxis
        displayPercentage: percentage,
        fill: colors[index % colors.length]
      };
    });
  }, [transactions]);

  const statisticsData = useMemo(() => {
    const data = [];
    let latestTimestamp = 0;
    let minYear = new Date().getFullYear();
    
    transactions.forEach(t => {
      const ts = new Date(t.date).getTime();
      if (ts > latestTimestamp) latestTimestamp = ts;
      
      const y = new Date(t.date).getFullYear();
      if (y < minYear) minYear = y;
    });
    const latestDate = latestTimestamp > 0 ? new Date(latestTimestamp) : new Date();

    if (trendViewType === 'Monthly') {
      const targetYear = latestDate.getFullYear();
      for (let i = 0; i < 12; i++) {
        const d = new Date(targetYear, i, 1);
        data.push({
          monthKey: `${d.getFullYear()}-${d.getMonth() + 1}`,
          date: d.toLocaleDateString('en-US', { month: 'short' }),
          income: 0,
          expenses: 0
        });
      }
    } else {
      const startYear = Math.min(minYear, latestDate.getFullYear() - 4);
      for (let y = startYear; y <= latestDate.getFullYear(); y++) {
        data.push({
          monthKey: `Y-${y}`,
          date: y.toString(),
          income: 0,
          expenses: 0
        });
      }
    }

    transactions.forEach(t => {
      const d = new Date(t.date);
      let target;
      if (trendViewType === 'Monthly') {
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        target = data.find(m => m.monthKey === key);
      } else {
        const key = `Y-${d.getFullYear()}`;
        target = data.find(m => m.monthKey === key);
      }
      
      if (target) {
        if (t.type === 'income') target.income += Number(t.amount);
        else if (t.type === 'expense') target.expenses += Number(t.amount);
      }
    });

    return data;
  }, [transactions, trendViewType]);

  const { avgIncome, avgExpenses, incomeGrowth, expenseGrowth } = useMemo(() => {
    let totalInc = 0;
    let totalExp = 0;
    
    statisticsData.forEach(d => {
      totalInc += d.income;
      totalExp += d.expenses;
    });
    
    const count = statisticsData.length;
    const avgInc = count ? totalInc / count : 0;
    const avgExp = count ? totalExp / count : 0;

    let incGrowth = 0;
    let expGrowth = 0;
    if (count >= 2) {
      const last = statisticsData[count - 1];
      const prev = statisticsData[count - 2];
      
      if (prev.income > 0) incGrowth = ((last.income - prev.income) / prev.income) * 100;
      else if (last.income > 0) incGrowth = 100;

      if (prev.expenses > 0) expGrowth = ((last.expenses - prev.expenses) / prev.expenses) * 100;
      else if (last.expenses > 0) expGrowth = 100;
    }

    return { 
      avgIncome: avgInc, 
      avgExpenses: avgExp, 
      incomeGrowth: incGrowth, 
      expenseGrowth: expGrowth 
    };
  }, [statisticsData]);

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
        <div className="glass-panel" style={{ minWidth: 0, overflow: 'hidden', padding: '32px', backgroundColor: '#fff', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1b25' }}>Balance Trend</h3>
            <div className="input-group" style={{ padding: '2px 8px', maxWidth: '140px' }}>
              <Calendar size={16} color="var(--text-tertiary)" />
              <Dropdown 
                value={trendViewType} 
                onChange={setTrendViewType}
                options={[
                  { value: 'Monthly', label: 'Monthly' },
                  { value: 'Yearly', label: 'Yearly' }
                ]}
                buttonStyle={{ padding: '4px 8px', minWidth: '70px' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
              <span style={{ fontSize: '14px', color: '#8e90a0', fontWeight: 500 }}>Total income</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f97316' }}></div>
              <span style={{ fontSize: '14px', color: '#8e90a0', fontWeight: 500 }}>Total expenses</span>
            </div>
          </div>

          <div style={{ height: '260px', width: '100%', minWidth: 0, marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statisticsData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#8e90a0', fontWeight: 500 }} dy={10} />
                <Tooltip 
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {payload.map((entry, index) => {
                            const isIncome = entry.dataKey === 'income';
                            return (
                              <div key={index} style={{
                                backgroundColor: isIncome ? '#1a1b25' : '#ffffff',
                                color: isIncome ? '#ffffff' : '#1a1b25',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                border: isIncome ? 'none' : '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                fontSize: '14px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                whiteSpace: 'nowrap'
                              }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
                                ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#22c55e' }} />
                <Line type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '16px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', color: '#8e90a0', fontWeight: 500 }}>Average income</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#1a1b25', marginTop: '4px', letterSpacing: '-0.02em' }}>
                ${avgIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px', color: '#8e90a0' }}>
                <span style={{ color: incomeGrowth >= 0 ? '#22c55e' : '#ef4444', marginRight: '6px', fontWeight: 600 }}>
                  {incomeGrowth > 0 ? '+' : ''}{incomeGrowth.toFixed(1)}%
                </span> 
                compare to last {trendViewType === 'Monthly' ? 'month' : 'year'}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', color: '#8e90a0', fontWeight: 500 }}>Average expenses</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#1a1b25', marginTop: '4px', letterSpacing: '-0.02em' }}>
                ${avgExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px', color: '#8e90a0' }}>
                <span style={{ color: expenseGrowth >= 0 ? '#ef4444' : '#22c55e', marginRight: '6px', fontWeight: 600 }}>
                  {expenseGrowth > 0 ? '+' : ''}{expenseGrowth.toFixed(1)}%
                </span> 
                compare to last {trendViewType === 'Monthly' ? 'month' : 'year'}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ minWidth: 0, overflow: 'hidden', padding: '32px', backgroundColor: '#fff', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1b25', marginBottom: '32px' }}>All expenses</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#8e90a0', fontWeight: 500, marginBottom: '8px' }}>Daily</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1b25' }}>${expenseMetrics.daily.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#8e90a0', fontWeight: 500, marginBottom: '8px' }}>Weekly</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1b25' }}>${expenseMetrics.weekly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#8e90a0', fontWeight: 500, marginBottom: '8px' }}>Monthly</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1b25' }}>${expenseMetrics.monthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div style={{ position: 'relative', height: '260px', display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0, alignItems: 'center', justifyContent: 'center' }}>
            {expenseRadialData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="35%" 
                  outerRadius="100%" 
                  barSize={12} 
                  data={expenseRadialData} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    minAngle={15}
                    background={{ fill: '#f8fafc' }}
                    clockWise
                    dataKey="value"
                    cornerRadius={12}
                  />
                  <Tooltip 
                    cursor={false}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div style={{
                            backgroundColor: '#ffffff',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                            border: '1px solid #f1f5f9'
                          }}>
                            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginBottom: '4px' }}>{data.name}</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>${data.realValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-secondary">
                No expense data available
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
            {expenseRadialData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.fill }}></div>
                  <span style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>{item.name}</span>
                </div>
                <div style={{ fontSize: '15px', color: '#1a1b25', fontWeight: 700 }}>
                  {item.displayPercentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
