import { useNavigate } from "react-router-dom";
import homeImg from "../assets/home.png";

export default function Home() {
  const navigate = useNavigate();

  // Add console.log to verify component is rendering
  console.log("Home component is rendering");

  return (
    <div style={{ padding: "20px", minHeight: "400px", display: "flex", alignItems: "center", gap: "40px" }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ 
          fontSize: "30px", 
          marginBottom: "10px", 
          color: "#333",
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
      <div style={{ flex: 1 }}>
        <img 
          src={homeImg} 
          alt="Home" 
          style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }} 
        />
      </div>
    </div>
  );
}
