import { useState } from "react";

export default function Dashboard() {
  // Static demo data for locked houses
  const lockedHouses = [
    { id: 1, name: "Tiny Studio", cost: 60000 },
    { id: 2, name: "Cozy Apartment", cost: 120000 },
    { id: 3, name: "City Apartment", cost: 180000 },
    { id: 4, name: "Modern Loft", cost: 250000 },
  ];

  // Goal home
  const goalHome = {
    name: "Penthouse",
    cost: 350000,
    estimatedYears: 6.5
  };

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "600px",
      margin: "0 auto"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Dream.Plan.Buy
      </h1>

      {/* Vertical Line Container */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "2rem",
        marginBottom: "3rem",
        position: "relative"
      }}>
        {/* Vertical Line */}
        <div style={{
          width: "4px",
          background: "#ccc",
          minHeight: "400px",
          position: "relative",
          borderRadius: "5px"
        }}>
          {/* Locked Houses */}
          {lockedHouses.map((house, index) => (
            <div key={house.id} style={{
              position: "absolute",
              top: `${index * 22}%`,
              left: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <div style={{
                width: "20px",
                height: "20px",
                background: "#bbb",
                borderRadius: "50%",
                border: "2px solid #888"
              }} />

              <div style={{
                padding: "0.5rem 1rem",
                background: "#f3f3f3",
                borderRadius: "8px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  {house.name} (Locked)
                </p>
                <p style={{ margin: 0 }}>€{house.cost.toLocaleString()}</p>
              </div>
            </div>
          ))}

          {/* Goal House at the Bottom */}
          <div style={{
            position: "absolute",
            bottom: "0",
            left: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <div style={{
              width: "26px",
              height: "26px",
              background: "#4caf50",
              borderRadius: "50%",
              border: "3px solid #2e7d32"
            }} />

            <div style={{
              padding: "0.8rem 1.2rem",
              background: "#e8f5e9",
              borderRadius: "10px",
              border: "1px solid #c8e6c9",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>
                Your Goal: {goalHome.name}
              </p>
              <p style={{ margin: 0 }}>
                Price: €{goalHome.cost.toLocaleString()}
              </p>
              <p style={{ margin: 0, color: "#2e7d32", fontWeight: "bold" }}>
                Estimated time: {goalHome.estimatedYears} years
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
