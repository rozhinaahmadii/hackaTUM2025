import { useState } from "react";
import { usePlanner } from "../context/PlannerContext";

export default function DreamHome() {
  const { properties, avgPrice, fetchPropertiesFromAPI } = usePlanner();

  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("APARTMENTBUY");
  const [rooms, setRooms] = useState("");
  const [balcony, setBalcony] = useState(false);
  const [garden, setGarden] = useState(false);
  const [cellar, setCellar] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [lift, setLift] = useState(false);

  async function handleSearch() {
    if (!city.trim()) {
      alert("Please enter a city before searching.");
      return;
    }

    const params = {
      active: true,
      type,
      sortBy: "asc",
      sortKey: "pricePerSqm",
      from: 0,
      size: 800,
      geoSearches: {
        geoSearchQuery: city,
        geoSearchType: "town",
        ...(region && { region }),
      },
    };

    await fetchPropertiesFromAPI(params);
  }

  return (
    <div>
      <h2>Your Dream Home Search</h2>

      <div className="card">

        {/* GRID: FIRST ROW */}
        <div className="input-grid-2">
          <div>
            <label>City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="München"
            />
          </div>

          <div>
            <label>Region</label>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Bayern"
            />
          </div>
        </div>

        {/* GRID: SECOND ROW */}
        <div className="input-grid-2">
          <div>
            <label>Property Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="APARTMENTBUY">Apartment</option>
              <option value="HOUSEBUY">House</option>
            </select>
          </div>

          <div>
            <label>Rooms</label>
            <input
              type="number"
              placeholder="e.g. 2"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />
          </div>
        </div>

        {/* FILTER TOGGLES */}
        <label>Features</label>
        <div className="filter-toggles">
          <button
            className={balcony ? "toggle active" : "toggle"}
            onClick={() => setBalcony(!balcony)}
          >
            Balcony
          </button>
          <button
            className={garden ? "toggle active" : "toggle"}
            onClick={() => setGarden(!garden)}
          >
            Garden
          </button>
          <button
            className={cellar ? "toggle active" : "toggle"}
            onClick={() => setCellar(!cellar)}
          >
            Cellar
          </button>
                    <button
            className={cellar ? "toggle active" : "toggle"}
            onClick={() => setCellar(!cellar)}
          >
            Lift
          </button>

          {/* <input
            type="number"
            className="min-price"
            placeholder="Min price"
          />


          <input
            type="number"
            className="max-price"
            placeholder="Max price"
          /> */}

        </div>

        <button className="btn" type="button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* AVERAGE PRICE */}
      {avgPrice && (
        <div className="panel">
          <h3>Estimated Market Price</h3>
          <p>
            Based on the first 50 listings:
            <strong> {avgPrice.toLocaleString()} €</strong>
          </p>
        </div>
      )}

      {/* PROPERTY RESULTS */}
      <h3 style={{ marginTop: "20px" }}>Property Results</h3>
      <div className="grid-2">
        {properties.map((p) => (
          <div className="card" key={p.id}>
            <img
              src={
                p.images?.[0]?.originalUrl ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt="property"
            />
            <h4>{p.address?.displayName}</h4>
            <p><strong>{p.buyingPrice?.toLocaleString()} €</strong></p>
            <p>{p.squareMeter} m²</p>
          </div>
        ))}
      </div>
    </div>
  );
}
