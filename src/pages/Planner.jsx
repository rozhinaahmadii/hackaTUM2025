import { useState } from "react";
import { usePlanner } from "../context/PlannerContext"; 
import AISuggestedPlans from "../components/AISuggestedPlans";

export default function Planner() {
  const { finances, setFinances, dreamHome } = usePlanner();
  
  // State for Life Event Modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventText, setEventText] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);

  // Values fetched DIRECTLY from Profile page (context)
  const savings = finances?.savings || 0;
  const salary = finances?.salary || 0;
  const expenses = finances?.expenses || 0;
  const debt = finances?.debt || 0;
  const goalAmount = finances?.target || 400000;

  // Derived percentage
  const savingsPercent = (savings / goalAmount) * 100;

  // Milestones
  const savingsMilestones = [
    { id: 1, title: "25%", point: goalAmount * 0.25 },
    { id: 2, title: "Halfway", point: goalAmount * 0.5 },
    { id: 3, title: "75%", point: goalAmount * 0.75 },
    { id: 4, title: "Goal!", point: goalAmount, goal: true }
  ];

  // Horizontal progress bar
  const renderProgress = () => (
    <div style={{ width: "100%", marginTop: "2rem" }}>
      <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "1.5rem" }}>
        Savings Progress (€{savings.toLocaleString()} / €{goalAmount.toLocaleString()})
      </p>

      {/* Visualization Container */}
      <div style={{ position: "relative", height: "22px", marginBottom: "3rem" }}>
        
        {/* Track */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#e0e0e0",
            borderRadius: "14px",
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "hidden"
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
          const topOffset = 11 - (iconSize / 2); // Center on 22px track

          return (
            <div
              key={m.id}
              style={{
                position: "absolute",
                top: `${topOffset}px`,
                left: `${percent}%`,
                transform: "translateX(-50%)",
                textAlign: "center",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  width: iconSize,
                  height: iconSize,
                  borderRadius: "50%",
                  background: reached ? "#067b06" : "#ccc",
                  border: m.goal ? "3px solid #219b25" : "2px solid #bbb",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}
              />
              <p style={{ marginTop: 5, fontSize: "0.85rem", whiteSpace: "nowrap" }}>{m.title}</p>
            </div>
          );
        })}
      </div>
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
        onClick={() => setShowEventModal(true)}
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

      {/* LIFE EVENT MODAL */}
      {showEventModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "500px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
          }}>
            <h3>Add a Life Event</h3>
            <p style={{ color: "#666", marginBottom: "1rem" }}>
              Describe what happened (e.g., "I got a €5000 bonus" or "I spent €2000 on a vacation").
            </p>
            
            <textarea
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="Type your event here..."
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "1rem",
                fontFamily: "inherit"
              }}
            />
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setShowEventModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!eventText.trim()) return;
                  
                  setIsClassifying(true);
                  try {
                    const response = await fetch('http://localhost:3001/api/classify-event', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ eventText })
                    });
                    
                    const data = await response.json();
                    
                    if (data.event_type && data.amount) {
                      const amount = Number(data.amount);
                      let newSavings = finances.savings || 0;
                      let message = "";

                      if (data.event_type === 'income') {
                        newSavings += amount;
                        message = `Life Event: Added €${amount.toLocaleString()} to your savings!`;
                      } else {
                        newSavings -= amount;
                        message = `Life Event: Deducted €${amount.toLocaleString()} from your savings.`;
                      }

                      setFinances({ ...finances, savings: newSavings });
                      alert(message);
                      setShowEventModal(false);
                      setEventText("");
                    }
                  } catch (error) {
                    console.error("Error classifying event:", error);
                    alert("Failed to process life event. Please try again.");
                  } finally {
                    setIsClassifying(false);
                  }
                }}
                disabled={isClassifying}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: isClassifying ? "#ccc" : "#ff9800",
                  color: "white",
                  cursor: isClassifying ? "not-allowed" : "pointer",
                  fontWeight: "bold"
                }}
              >
                {isClassifying ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                setFinances({ ...finances, target: Number(e.target.value) })
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
