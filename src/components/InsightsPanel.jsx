import React, { useMemo } from 'react';
import { AlertCircle, TrendingDown, Target, Zap, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InsightsPanel({ transactions }) {
  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Highest spending category
    const categoryTotals = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    });
    
    let highestCategory = { name: 'N/A', amount: 0 };
    Object.keys(categoryTotals).forEach(cat => {
      if (categoryTotals[cat] > highestCategory.amount) {
        highestCategory = { name: cat, amount: categoryTotals[cat] };
      }
    });

    // Biggest single expense
    let biggestExpense = { merchant: 'N/A', amount: 0 };
    expenses.forEach(t => {
      if (Number(t.amount) > biggestExpense.amount) {
        biggestExpense = { merchant: t.merchant, amount: Number(t.amount) };
      }
    });

    // Total counts
    const incomeCount = transactions.filter(t => t.type === 'income').length;
    const expenseCount = expenses.length;

    // Monthly Comparison
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();

    const getMonthData = (m, y) => {
      const monthTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === m && d.getFullYear() === y;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
        
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
        
      return { income, expense };
    };

    const currentData = getMonthData(currentMonth, currentYear);
    const prevData = getMonthData(lastMonth, lastMonthYear);

    const calculateChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    const incomeChange = calculateChange(currentData.income, prevData.income);
    const expenseChange = calculateChange(currentData.expense, prevData.expense);

    return {
      highestCategory,
      biggestExpense,
      incomeCount,
      expenseCount,
      currentData,
      prevData,
      incomeChange,
      expenseChange
    };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="glass-panel flex items-center justify-center p-6" style={{ height: '300px', color: 'var(--text-tertiary)' }}>
        No data available to generate insights.
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <div className="glass-panel">
        <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
          <Zap size={28} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '22px', fontWeight: 700 }}>Smart Insights</h3>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="insight-item">
            <div className="flex items-center gap-4 flex-1">
              <div className="insight-icon-wrapper" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                <TrendingDown size={24} />
              </div>
              <div className="insight-content">
                <span className="insight-title">Highest Spending Category</span>
                <div>
                  <span className="insight-value">{insights.highestCategory.name}</span>
                  <span className="insight-amount">(${insights.highestCategory.amount.toFixed(2)})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="insight-item">
            <div className="flex items-center gap-4 flex-1">
              <div className="insight-icon-wrapper" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                <AlertCircle size={24} />
              </div>
              <div className="insight-content">
                <span className="insight-title">Largest Single Expense</span>
                <div>
                  <span className="insight-value">{insights.biggestExpense.merchant}</span>
                  <span className="insight-amount">(${insights.biggestExpense.amount.toFixed(2)})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="insight-item">
            <div className="flex items-center gap-4 flex-1">
              <div className="insight-icon-wrapper" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                <Target size={24} />
              </div>
              <div className="insight-content">
                <span className="insight-title">Activity Summary</span>
                <div>
                  <span className="insight-value">{insights.incomeCount} Incomes <span style={{color: 'var(--text-tertiary)', fontWeight: '400'}}>vs</span> {insights.expenseCount} Expenses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: 700 }}>Observations</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '16px' }}>
          Based on your recent activity, a significant portion of your spending goes towards <strong>{insights.highestCategory.name}</strong>. 
          Consider reviewing these expenses if you're looking to increase your savings.
        </p>
        <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            borderLeft: '4px solid var(--accent-primary)', 
            backgroundColor: 'var(--bg-tertiary)', 
            borderRadius: '0 var(--radius-lg) var(--radius-lg) 0' 
        }}>
          <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            "Tracking your expenses is the first step towards financial freedom."
          </p>
        </div>
      </div>

      {/* Monthly Comparison Card */}
      <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <TrendingDown size={24} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Monthly Performance</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Income Comparison */}
          <div style={{ 
            padding: '24px', 
            borderRadius: 'var(--radius-xl)', 
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Income vs Last Month</span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 700,
                backgroundColor: insights.incomeChange >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: insights.incomeChange >= 0 ? 'var(--success)' : 'var(--danger)'
              }}>
                {insights.incomeChange > 0 ? <ArrowUpRight size={14} /> : (insights.incomeChange < 0 ? <ArrowDownRight size={14} /> : <Minus size={14} />)}
                {Math.abs(insights.incomeChange).toFixed(1)}%
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h4 style={{ fontSize: '28px', fontWeight: 800 }}>${insights.currentData.income.toFixed(2)}</h4>
              <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>from ${insights.prevData.income.toFixed(2)}</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (insights.currentData.income / (insights.prevData.income || 1)) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ height: '100%', backgroundColor: 'var(--success)' }}
              />
            </div>
          </div>

          {/* Expense Comparison */}
          <div style={{ 
            padding: '24px', 
            borderRadius: 'var(--radius-xl)', 
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Expense vs Last Month</span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 700,
                backgroundColor: insights.expenseChange <= 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: insights.expenseChange <= 0 ? 'var(--success)' : 'var(--danger)'
              }}>
                {insights.expenseChange < 0 ? <ArrowDownRight size={14} /> : (insights.expenseChange > 0 ? <ArrowUpRight size={14} /> : <Minus size={14} />)}
                {Math.abs(insights.expenseChange).toFixed(1)}%
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h4 style={{ fontSize: '28px', fontWeight: 800 }}>${insights.currentData.expense.toFixed(2)}</h4>
              <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>from ${insights.prevData.expense.toFixed(2)}</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (insights.currentData.expense / (insights.prevData.expense || 1)) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ height: '100%', backgroundColor: insights.expenseChange <= 0 ? 'var(--success)' : 'var(--danger)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
