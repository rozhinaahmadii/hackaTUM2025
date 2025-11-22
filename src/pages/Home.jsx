import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        A guided, data-driven path to home ownership
      </h1>

      <p style={{ maxWidth: "600px", marginBottom: "20px" }}>
        Interfox combines real market data with smart financial planning to show
        you exactly when you can buy your dream home.
      </p>

      <button className="btn" onClick={() => navigate("/dream-home")}>
        Start Your Journey
      </button>
    </div>
  );
}
