import { useState } from "react";

export default function FollowUpImpact({ onSubmit, onCancel }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const value = Number(amount);
    if (!isNaN(value)) {
      onSubmit(value);
      setAmount("");
    }
  };

  return (
    <div style={{
      padding: "1.5rem",
      borderRadius: "12px",
      background: "#ffffff",
      boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      marginTop: "1rem"
    }}>
      <h3 style={{ marginBottom: "0.8rem" }}>
        How much did this event affect you financially?
      </h3>

      <input
        type="number"
        placeholder="Enter amount (example: -300 or +150)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: "0.6rem 0.8rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "1rem"
        }}
      />

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            padding: "0.6rem",
            background: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Submit
        </button>

        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "0.6rem",
            background: "#ccc",
            color: "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
