import React, { useMemo } from 'react';
import { AlertCircle, TrendingDown, Target, Zap } from 'lucide-react';

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

    return {
      highestCategory,
      biggestExpense,
      incomeCount,
      expenseCount
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
    </div>
  );
}
