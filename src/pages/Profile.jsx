import { usePlanner } from "../context/PlannerContext";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const JOB_TYPES = [
  { label: "Select Job Type", value: "", salary: 0 },
  { label: "Student", value: "Student", salary: 1200 },
  { label: "Junior Developer", value: "Junior Developer", salary: 2500 },
  { label: "Senior Developer", value: "Senior Developer", salary: 4500 },
  { label: "Manager", value: "Manager", salary: 5500 },
  { label: "Executive", value: "Executive", salary: 8000 },
  { label: "Other", value: "Other", salary: 0 },
];

export default function Profile() {
  const { finances, setFinances, propertyCostEstimate } = usePlanner();
  const navigate = useNavigate();

  // Default values for calculation
  const currentSavings = finances.savings || 0;
  const monthlySavings = finances.monthlySavings || (finances.salary * 0.3) || 0; // Default to 30% of salary if not set
  const targetPrice = finances.target || propertyCostEstimate || 500000; // Default target if not set

  // Calculate time to goal
  const amountNeeded = Math.max(0, targetPrice - currentSavings);
  const monthsToGoal = monthlySavings > 0 ? amountNeeded / monthlySavings : 0;
  const yearsToGoal = monthsToGoal / 12;

  // Generate chart data
  const currentYear = new Date().getFullYear();
  const chartData = [];
  const yearsToProject = Math.min(Math.ceil(yearsToGoal) + 2, 50); // Cap at 50 years

  for (let i = 0; i <= yearsToProject; i++) {
    const year = currentYear + i;
    const savings = currentSavings + (monthlySavings * 12 * i);
    chartData.push({
      year: year,
      savings: savings,
      target: targetPrice
    });
  }

  return (
    <div>
      <h2>Profile & Financials</h2>

      <div className="grid-2">
        <div className="card">
          <label>Job Type</label>
          <select
            value={finances.jobType}
            onChange={(e) => {
              const selectedJob = JOB_TYPES.find(j => j.value === e.target.value);
              setFinances({ 
                ...finances, 
                jobType: e.target.value,
                salary: selectedJob && selectedJob.salary > 0 ? selectedJob.salary : finances.salary 
              });
            }}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            {JOB_TYPES.map((job) => (
              <option key={job.label} value={job.value}>
                {job.label}
              </option>
            ))}
          </select>

          <label>Salary (€ / month)</label>
          <input
            type="number"
            value={finances.salary}
            onChange={(e) =>
              setFinances({ ...finances, salary: Number(e.target.value) })
            }
          />

          <label>Target Property Price (€)</label>
          <input
            type="number"
            value={finances.target || ''}
            placeholder={targetPrice}
            onChange={(e) =>
              setFinances({ ...finances, target: Number(e.target.value) })
            }
          />

          <label>Monthly Savings (€ / month)</label>
          <input
            type="number"
            value={finances.monthlySavings || ''}
            placeholder={monthlySavings}
            onChange={(e) =>
              setFinances({ ...finances, monthlySavings: Number(e.target.value) })
            }
          />

          <label>Current Savings (€)</label>
          <input
            type="number"
            value={finances.savings}
            onChange={(e) =>
              setFinances({ ...finances, savings: Number(e.target.value) })
            }
          />

          <button className="btn" onClick={() => alert("Data saved!")}>
            Save
          </button>
        </div>

        <div className="panel">
          <h3>"Time to Home" Prediction</h3>
          
          <div style={{ marginBottom: "20px" }}>
            {monthlySavings > 0 ? (
              <p className="prediction-text">
                At your current pace, you can afford a home in <strong>~{yearsToGoal.toFixed(1)} years</strong>.
              </p>
            ) : (
              <p>Please enter your salary and savings to see a prediction.</p>
            )}
            <p style={{ fontSize: "0.9em", color: "#666" }}>
              Target: {targetPrice.toLocaleString()} €
            </p>
          </div>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis 
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} €`, "Savings"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Projected Savings"
                />
                {/* Reference line for target could be added, but simple line is cleaner for now */}
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#82ca9d" 
                  strokeDasharray="5 5" 
                  name="Home Price"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
