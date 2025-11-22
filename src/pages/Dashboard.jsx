import { useState } from "react";

export default function Dashboard() {
  // FINANCIAL STATE (AI-ready)
  const [savings, setSavings] = useState(8450);
  const [salary, setSalary] = useState(2800);
  const [expenses, setExpenses] = useState(1620);
  const [debt, setDebt] = useState(3200);

  // Which field is being edited?
  const [editingField, setEditingField] = useState(null);

  const maxSavings = 20000;
  const savingsPercent = (savings / maxSavings) * 100;

  // SAVINGS MILESTONES
  const savingsMilestones = [
    { id: 1, title: "First €1,000", point: 1000 },
    { id: 2, title: "€5,000 Saved", point: 5000 },
    { id: 3, title: "€10,000 Saved", point: 10000 },
    { id: 4, title: "€20,000 Goal", point: 20000, goal: true }
  ];

  // Renders a horizontal timeline
  const renderProgressLine = (percentValue, milestones, title, valueDisplay) => (
    <div style={{ width: "100%", marginTop: "2rem", position: "relative" }}>
      <p style={{ fontWeight: "bold", marginBottom: "1rem", fontSize: "1.2rem" }}>
        {title} {valueDisplay && `(${valueDisplay})`}
      </p>

      {/* TRACK */}
      <div
        style={{
          width: "100%",
          height: "20px",
          background: "#e0e0e0",
          borderRadius: "12px",
          position: "relative"
        }}
      >
        {/* FILL */}
        <div
          style={{
            width: `${percentValue}%`,
            height: "100%",
            background: "linear-gradient(90deg, #9df79dff, #83e858ff, #05c511ff)",
            borderRadius: "12px",
            transition: "width 0.4s ease"
          }}
        />
      </div>

      {/* MILESTONES */}
      {milestones.map((ms) => {
        const percent = (ms.point / maxSavings) * 100;
        const reached = savings >= ms.point;

        return (
          <div
            key={ms.id}
            style={{
              position: "absolute",
              top: "45px",
              left: percent === 100 ? "calc(100% - 13px)" : `calc(${percent}% - 18px)`,
              textAlign: "center",
              width: "80px"
            }}
          >
            <div
              style={{
                width: ms.goal ? "26px" : "22px",
                height: ms.goal ? "26px" : "22px",
                borderRadius: "50%",
                background: reached ? "#067b06ff" : "#ccc",
                border: ms.goal ? "3px solid #219b25ff" : "2px solid #bbb",
                margin: "0 auto",
                boxShadow: reached ? "0 3px 10px rgba(0,0,0,0.3)" : "none"
              }}
            />
            <p style={{ marginTop: "6px", fontSize: "0.85rem", color: reached ? "#1cab4cff" : "#555" }}>
              {ms.title}
            </p>
          </div>
        );
      })}
    </div>
  );

  // Editable field renderer
  const renderEditableField = (label, value, setter, fieldId) => {
    const isEditing = editingField === fieldId;

    return (
      <p style={{ color: "#444", fontSize: "1rem", marginBottom: "0.8rem" }}>
        <strong>{label}:</strong>{" "}
        {isEditing ? (
          <input
            type="number"
            autoFocus
            defaultValue={value}
            onBlur={(e) => {
              setter(Number(e.target.value));
              setEditingField(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setter(Number(e.target.value));
                setEditingField(null);
              }
            }}
            style={{
              padding: "4px 6px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "130px"
            }}
          />
        ) : (
          <>
            €{value.toLocaleString()}
            <span
              onClick={() => setEditingField(fieldId)}
              style={{ cursor: "pointer", marginLeft: "8px", color: "#ff9800" }}
            >
              ✏️
            </span>
          </>
        )}
      </p>
    );
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>

      {/* SAVINGS TIMELINE (MAIN PROGRESS BAR) */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "900px" }}>
          {renderProgressLine(
            savingsPercent,
            savingsMilestones,
            "Savings Progress",
            `€${savings.toLocaleString()}`
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          marginTop: "3rem"
        }}
      >

        {/* Add Life Event Button */}
        <button
          style={{
            padding: "0.8rem 3rem",
            borderRadius: "10px",
            background: "#ff9800",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            width: "100%",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
        >
          + Life Event
        </button>

        {/* FINANCIAL PARAMETERS */}
        <div
          style={{
            background: "#fafafa",
            borderRadius: "14px",
            border: "1px solid #eee",
            padding: "2rem",
            boxShadow: "0 3px 10px rgba(0,0,0,0.05)"
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>Financial Overview</h3>

          {renderEditableField("Savings", savings, setSavings, "savings")}
          {renderEditableField("Salary", salary, setSalary, "salary")}
          {renderEditableField("Expenses", expenses, setExpenses, "expenses")}
          {renderEditableField("Debt", debt, setDebt, "debt")}
        </div>

        {/* AI INSIGHTS CARD */}
        <div
          style={{
            background: "#fafafa",
            borderRadius: "14px",
            border: "1px solid #eee",
            padding: "2rem",
            boxShadow: "0 3px 10px rgba(0,0,0,0.05)"
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>AI Insights (coming soon)</h3>
          <p style={{ color: "#888" }}>
            When AI is added, this panel will automatically:
            <br />• Update financial values
            <br />• Adjust the savings progress bar
            <br />• Predict home-buying readiness
            <br />• Provide warnings & tips
          </p>
        </div>
      </div>
    </div>
  );
}
