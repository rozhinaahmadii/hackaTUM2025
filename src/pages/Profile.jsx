import { useState } from "react";
import { usePlanner } from "../context/PlannerContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Profile() {
  const { finances, setFinances, dreamHome, setDreamHome, propertyCostEstimate } = usePlanner();

  const [openSection, setOpenSection] = useState("profile");
  const toggle = (s) => setOpenSection(openSection === s ? null : s);

  const update = (path, value) => {
    const parts = path.split(".");
    const updated = { ...finances };
    let ref = updated;

    for (let i = 0; i < parts.length - 1; i++) {
      ref[parts[i]] = { ...ref[parts[i]] };
      ref = ref[parts[i]];
    }

    ref[parts[parts.length - 1]] = value;
    setFinances(updated);
  };

  /* CALCULATIONS */
  const totalExpenses = Object.values(finances.expenses).reduce(
    (sum, v) => sum + Number(v || 0),
    0
  );

  const totalDebtPayments = finances.debts.reduce(
    (sum, d) => sum + Number(d.monthlyPayment || 0),
    0
  );

  const autoMonthlySavings = finances.salary - totalExpenses - totalDebtPayments;

  const monthlySavings =
    finances.monthlySavings !== "" && finances.monthlySavings !== undefined
      ? finances.monthlySavings
      : Math.max(0, autoMonthlySavings);

  const currentSavings = finances.savings || 0;
  const targetPrice = finances.target || propertyCostEstimate || 300000;

  const amountNeeded = Math.max(0, targetPrice - currentSavings);
  const monthsToGoal = monthlySavings > 0 ? amountNeeded / monthlySavings : 0;
  const yearsToGoal = monthsToGoal / 12;

  const currentYear = new Date().getFullYear();
  const projectionYears = Math.min(Math.ceil(yearsToGoal) + 2, 50);

  const chartData = Array.from({ length: projectionYears + 1 }, (_, i) => ({
    year: currentYear + i,
    savings: currentSavings + monthlySavings * 12 * i,
    target: targetPrice,
  }));

  return (
    <div className="profile-page">
      
      {/* SIDEBAR */}
      <div className="profile-sidebar">

{/* PROFILE (always visible) */}
{/* PROFILE (STATIC) */}
<div className="profile-header-row">
  <h3 className="sidebar-title">Profile</h3>
  <button className="edit-btn">Edit</button>
</div>

<div className="sidebar-profile-static">
  <div className="profile-static-row">
    <span className="static-label">Name:</span>
    <span className="static-value">John Doe</span>
  </div>

  <div className="profile-static-row">
    <span className="static-label">City:</span>
    <span className="static-value">{dreamHome.city || "Barcelona"}</span>
  </div>
</div>


        {/* FINANCIALS */}
        <div className="accordion-section">
          <div className="accordion-header" onClick={() => toggle("financials")}>
            <span>Financials</span>
            <span>{openSection === "financials" ? "▼" : "▶"}</span>
          </div>

          {openSection === "financials" && (
            <div className="accordion-content profile-grid-2">
              <div>
                <label>Salary (€ / month)</label>
                <input
                  type="number"
                  value={finances.salary}
                  onChange={(e) => update("salary", Number(e.target.value))}
                />
              </div>
              <div>
                <label>Current Savings (€)</label>
                <input
                  type="number"
                  value={finances.savings}
                  onChange={(e) => update("savings", Number(e.target.value))}
                />
              </div>

              <div>
                <label>Target Home Price (€)</label>
                <input
                  type="number"
                  value={finances.target}
                  onChange={(e) => update("target", Number(e.target.value))}
                />
              </div>

              <div>
                <label>Monthly Savings (auto)</label>
                <input
                  type="number"
                  value={finances.monthlySavings}
                  onChange={(e) => update("monthlySavings", Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>

        {/* EXPENSES */}
        <div className="accordion-section">
          <div className="accordion-header" onClick={() => toggle("expenses")}>
            <span>Monthly Expenses</span>
            <span>{openSection === "expenses" ? "▼" : "▶"}</span>
          </div>

          {openSection === "expenses" && (
            <div className="accordion-content profile-grid-3">
              {Object.entries(finances.expenses).map(([key, val]) => (
                <div key={key}>
                  <label>{key}</label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => update(`expenses.${key}`, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DEBTS */}
        <div className="accordion-section">
          <div className="accordion-header" onClick={() => toggle("debts")}>
            <span>Debts</span>
            <span>{openSection === "debts" ? "▼" : "▶"}</span>
          </div>

          {openSection === "debts" && (
            <div className="accordion-content">

              <button
                className="btn-outline"
                onClick={() =>
                  update("debts", [
                    ...finances.debts,
                    { type: "", balance: 0, monthlyPayment: 0, interest: 0 },
                  ])
                }
              >
                + Add Debt
              </button>
            </div>
          )}
        </div>

        {/* INVESTMENT */}
        <div className="accordion-section">
          <div className="accordion-header" onClick={() => toggle("investment")}>
            <span>Investment Growth</span>
            <span>{openSection === "investment" ? "▼" : "▶"}</span>
          </div>

          {openSection === "investment" && (
            <div className="accordion-content profile-grid-2">
              <div>
                <label>Return %</label>
                <input
                  type="number"
                  value={finances.investment.expectedReturn}
                  onChange={(e) => update("investment.expectedReturn", Number(e.target.value))}
                />
              </div>

              <div>
                <label>Inflation %</label>
                <input
                  type="number"
                  value={finances.investment.inflation}
                  onChange={(e) => update("investment.inflation", Number(e.target.value))}
                />
              </div>


            </div>
          )}
        </div>

        {/* MORTGAGE */}
        <div className="accordion-section">
          <div className="accordion-header" onClick={() => toggle("mortgage")}>
            <span>Mortgage</span>
            <span>{openSection === "mortgage" ? "▼" : "▶"}</span>
          </div>

          {openSection === "mortgage" && (
            <div className="accordion-content profile-grid-2">
              <div>
                <label>Down Payment %</label>
                <input
                  type="number"
                  value={finances.mortgage.downPaymentPercent}
                  onChange={(e) =>
                    update("mortgage.downPaymentPercent", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label>APR %</label>
                <input
                  type="number"
                  value={finances.mortgage.mortgageInterest}
                  onChange={(e) =>
                    update("mortgage.mortgageInterest", Number(e.target.value))
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="profile-main">
        <h2>Home Goal Projection</h2>

        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Years to Home</div>
            <div className="kpi-value">{monthlySavings > 0 ? yearsToGoal.toFixed(1) : "--"}</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Monthly Savings</div>
            <div className="kpi-value">{monthlySavings.toLocaleString()} €</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Total Expenses</div>
            <div className="kpi-value">{totalExpenses.toLocaleString()} €</div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Savings Projection</div>
          <div className="chart-box">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => `${v.toLocaleString()} €`} />
                <Line type="monotone" dataKey="savings" stroke="#4a6cf7" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
