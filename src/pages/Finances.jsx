import { usePlanner } from "../context/PlannerContext";
import { useNavigate } from "react-router-dom";

export default function Finances() {
  const { finances, setFinances, propertyCostEstimate } = usePlanner();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Financial Onboarding</h2>

      <div className="grid-2">
        <div className="card">
          <label>Job Type</label>
          <input
            type="text"
            value={finances.jobType}
            onChange={(e) => setFinances({ ...finances, jobType: e.target.value })}
          />

          <label>Salary (€ / month)</label>
          <input
            type="number"
            value={finances.salary}
            onChange={(e) =>
              setFinances({ ...finances, salary: Number(e.target.value) })
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
          <h3>Summary</h3>
          <div className="row">
            <span className="row-label">Estimated home cost</span>
            <span className="row-value">
              {propertyCostEstimate ? propertyCostEstimate.toLocaleString() : "0"} €
            </span>
          </div>

          <button className="btn-outline" onClick={() => navigate("/planner")}>
            View Plan
          </button>
        </div>
      </div>
    </div>
  );
}
