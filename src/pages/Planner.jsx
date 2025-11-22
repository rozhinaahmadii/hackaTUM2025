import { usePlanner } from "../context/PlannerContext"; 
import AISuggestedPlans from "../components/AISuggestedPlans";

export default function Planner() {
  const { finances, setFinances, dreamHome } = usePlanner();

  // Values fetched DIRECTLY from Profile page (context)
  const savings = finances?.savings || 0;
  const salary = finances?.salary || 0;
  const expenses = finances?.expenses || 0;
  const debt = finances?.debt || 0;
  const goalAmount = dreamHome?.goalPrice || 20000;

  // Derived percentage
  const savingsPercent = (savings / goalAmount) * 100;

  // Milestones
  const savingsMilestones = [
    { id: 1, title: "€1,000", point: 1000 },
    { id: 2, title: "€5,000", point: 5000 },
    { id: 3, title: "Halfway", point: goalAmount / 2 },
    { id: 4, title: "Goal!", point: goalAmount, goal: true }
  ];

  // Horizontal progress bar
  const renderProgress = () => (
    <div style={{ width: "100%", marginTop: "2rem", position: "relative" }}>
      <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Savings Progress (€{savings.toLocaleString()} / €{goalAmount.toLocaleString()})
      </p>

      {/* Track */}
      <div
        style={{
          width: "100%",
          height: "22px",
          background: "#e0e0e0",
          borderRadius: "14px",
          position: "relative"
        }}
      >
        <div
          style={{
            width: `${savingsPercent}%`,
            height: "100%",
            background: "linear-gradient(90deg, #9df79d, #83e858, #05c511)",
            borderRadius: "14px",
            transition: "width 0.4s ease"
          }}
        />
      </div>

      {/* Milestones */}
      {savingsMilestones.map((m) => {
        const percent = (m.point / goalAmount) * 100;
        const iconSize = m.goal ? 30 : 22;
        const reached = savings >= m.point;

        return (
          <div
            key={m.id}
            style={{
              position: "absolute",
              top: "40px",
              left: `${percent}%`,
              transform: `translateX(-${iconSize / 2}px)`,
              textAlign: "center"
            }}
          >
            <div
              style={{
                width: iconSize,
                height: iconSize,
                borderRadius: "50%",
                background: reached ? "#067b06" : "#ccc",
                border: m.goal ? "3px solid #219b25" : "2px solid #bbb",
                margin: "0 auto"
              }}
            />
            <p style={{ marginTop: 5, fontSize: "0.85rem" }}>{m.title}</p>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ width: "100%", paddingBottom: "5rem" }}>

      {/* AI SUGGESTION PANEL (unchanged from before) */}
      <AISuggestedPlans
        userProfile={{
          monthlyIncome: salary,
          savings: savings,
          location: dreamHome?.city || "Munich",
          propertyType: dreamHome?.propertyType || "Apartment",
          timeline: "ASAP"
        }}
      />

      <h2 style={{ marginTop: "3rem" }}>Your Financial Dashboard</h2>

      {/* + LIFE EVENT BUTTON */}
      <button
        style={{
          padding: "0.9rem 3rem",
          borderRadius: "10px",
          background: "#ff9800",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1.1rem",
          marginTop: "1rem",
          boxShadow: "0 3px 10px rgba(0,0,0,0.15)"
        }}
      >
        + Life Event
      </button>

      {/* PROGRESS BAR */}
      <div style={{ marginTop: "3rem" }}>
        {renderProgress()}
      </div>

      {/* SUMMARY PANEL */}
      <div
        style={{
          marginTop: "3rem",
          background: "#fafafa",
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid #eee",
          maxWidth: "600px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>Financial Summary</h3>

        <div style={{ display: "grid", gap: "1.3rem" }}>
        
          {/* Salary */}
          <label>
            <strong>Monthly Salary:</strong><br />
            <input
              type="number"
              value={salary}
              onChange={(e) =>
                setFinances({ ...finances, salary: Number(e.target.value) })
              }
              style={inputStyle}
            />
          </label>

          {/* Expenses */}
          <label>
            <strong>Monthly Expenses:</strong><br />
            <input
              type="number"
              value={expenses}
              onChange={(e) =>
                setFinances({ ...finances, expenses: Number(e.target.value) })
              }
              style={inputStyle}
            />
          </label>

          {/* Debt */}
          <label>
            <strong>Debt:</strong><br />
            <input
              type="number"
              value={debt}
              onChange={(e) =>
                setFinances({ ...finances, debt: Number(e.target.value) })
              }
              style={inputStyle}
            />
          </label>

          {/* Goal */}
          <label>
            <strong>Savings Goal:</strong><br />
            <input
              type="number"
              value={goalAmount}
              onChange={(e) =>
                setDreamHome({ ...dreamHome, goalPrice: Number(e.target.value) })
              }
              style={inputStyle}
            />
          </label>

          {/* Savings */}
          <label>
            <strong>Current Savings:</strong><br />
            <input
              type="number"
              value={savings}
              onChange={(e) =>
                setFinances({ ...finances, savings: Number(e.target.value) })
              }
              style={inputStyle}
            />
          </label>

        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid",
  marginTop: "4px",
  fontSize: "1rem"
};
