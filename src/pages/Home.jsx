import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Add console.log to verify component is rendering
  console.log("Home component is rendering");

  return (
    <div style={{ padding: "20px", backgroundColor: "#fff", minHeight: "400px" }}>
      <h1 style={{ 
        fontSize: "32px", 
        marginBottom: "10px", 
        color: "#333",
        border: "2px solid red" // Temporary red border to make it visible
      }}>
        A guided, data-driven path to home ownership
      </h1>

      <p style={{ 
        maxWidth: "600px", 
        marginBottom: "20px",
        color: "#333",
        backgroundColor: "#f0f0f0",
        padding: "10px"
      }}>
        Interfox combines real market data with smart financial planning to show
        you exactly when you can buy your dream home.
      </p>

      <button 
        className="btn" 
        onClick={() => navigate("/dream-home")}
        style={{ backgroundColor: "green", color: "white", padding: "15px 30px" }}
      >
        Start Your Journey
      </button>
    </div>
  );
}
