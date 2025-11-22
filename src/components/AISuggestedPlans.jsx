import { useState } from 'react';

export default function AISuggestedPlans({ userProfile }) {
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePlans = async () => {
    if (!userProfile) {
      setError('Please provide your financial information first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query = `Help me buy a home with the following details:
        Monthly income: €${userProfile.monthlyIncome || 'not specified'}
        Current savings: €${userProfile.savings || 'not specified'}
        Target location: ${userProfile.location || 'not specified'}
        Property type: ${userProfile.propertyType || 'not specified'}
        Timeline: ${userProfile.timeline || 'not specified'}`;

      // Call the backend API instead of running agents directly
      const response = await fetch('http://localhost:3001/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuery: query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate plan');
      }

      const result = await response.json();
      setPlans(result);
    } catch (err) {
      console.error('Error generating plans:', err);
      setError(`Failed to generate AI plans: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'financial': return '#10b981';
      case 'market_research': return '#3b82f6';
      case 'preparation': return '#f59e0b';
      case 'execution': return '#8b5cf6';
      case 'lifestyle': return '#ec4899'; // Pink
      case 'legal': return '#ef4444';     // Red
      case 'market': return '#8b5cf6';    // Purple (same as execution or similar)
      default: return '#6b7280';
    }
  };

  return (
    <div className="ai-suggested-plans">
      <div className="ai-header">
        <h3>🤖 AI-Suggested Action Plan</h3>
        <button 
          onClick={generatePlans}
          disabled={loading}
          className="generate-btn"
        >
          {loading ? 'Generating...' : 'Generate AI Plan'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {plans && (
        <div className="plans-container">
          {/* Budget Analysis */}
          <div className="budget-section">
            <h4>💰 Budget Analysis</h4>
            <div className="budget-grid">
              <div className="budget-item">
                <span>Price Range:</span>
                <strong>{plans.budget_analysis.affordable_price_range}</strong>
              </div>
              <div className="budget-item">
                <span>Monthly Payment:</span>
                <strong>{plans.budget_analysis.monthly_payment_estimate}</strong>
              </div>
              <div className="budget-item">
                <span>Down Payment:</span>
                <strong>{plans.budget_analysis.down_payment_needed}</strong>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="actions-section">
            <h4>📋 Prioritized Action Items</h4>
            <div className="action-items">
              {plans.action_items.map((item) => (
                <div key={item.priority} className="action-item">
                  <div className="action-header">
                    <span className="priority-badge">{item.priority}</span>
                    <h5>{item.title}</h5>
                    <span className="timeline-badge">{item.timeline_months} months</span>
                  </div>
                  <div className="action-body">
                    <span 
                      className="category-tag"
                      style={{ backgroundColor: getCategoryColor(item.category) }}
                    >
                      {item.category.replace('_', ' ')}
                    </span>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Wins & Next Steps */}
          <div className="quick-actions">
            <div className="quick-wins">
              <h4>⚡ Quick Wins</h4>
              <ul>
                {plans.quick_wins.map((win, index) => (
                  <li key={index}>{win}</li>
                ))}
              </ul>
            </div>
            <div className="next-steps">
              <h4>🎯 Next Immediate Steps</h4>
              <ul>
                {plans.next_immediate_steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .ai-suggested-plans {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          color: white;
        }

        .ai-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .ai-header h3 {
          margin: 0;
          font-size: 1.5rem;
        }

        .generate-btn {
          background: white;
          color: #667eea;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .generate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .generate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .plans-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .budget-section, .actions-section {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 20px;
        }

        .budget-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 12px;
        }

        .budget-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .budget-item span {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .action-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
        }

        .action-item {
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 16px;
        }

        .action-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .priority-badge {
          background: rgba(255,255,255,0.2);
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          min-width: 24px;
          text-align: center;
        }

        .timeline-badge {
          background: rgba(16, 185, 129, 0.3);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          margin-left: auto;
        }

        .action-header h5 {
          margin: 0;
          flex: 1;
        }

        .category-tag {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: white;
          text-transform: capitalize;
        }

        .action-body p {
          margin: 0;
          opacity: 0.9;
          line-height: 1.4;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .quick-wins, .next-steps {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 20px;
        }

        .quick-wins h4, .next-steps h4 {
          margin-top: 0;
          margin-bottom: 12px;
        }

        .quick-wins ul, .next-steps ul {
          margin: 0;
          padding-left: 16px;
        }

        .quick-wins li, .next-steps li {
          margin-bottom: 8px;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .ai-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .budget-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .action-header {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}