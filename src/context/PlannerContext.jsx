import { createContext, useContext, useState } from "react";
import { searchProperties } from "../api/thinkImmo"; // <-- adjust path if needed

const PlannerContext = createContext();

export function PlannerProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [avgPrice, setAvgPrice] = useState(null);

  // store edited descriptions (decisions)
  const [decisionTexts, setDecisionTexts] = useState({});
  const [activeDecisions, setActiveDecisions] = useState([]);

  // Dream home data
  const [dreamHome, setDreamHome] = useState({
    propertyType: "APARTMENTBUY",
    city: "",
  });

  // FETCH PROPERTIES + CALCULATE AVERAGE
  async function fetchPropertiesFromAPI(params) {
    const data = await searchProperties(params);
    const results = data?.results || [];

    const withImages = results.map((p, i) => ({
      ...p,
      id: i + 1,
      image: `https://source.unsplash.com/random/800x60${i}?house`,
    }));

    setProperties(withImages);

    if (results.length > 0) {
      const firstTen = results.slice(0, 100);
      const avg =
        firstTen.reduce((sum, item) => sum + (item.buyingPrice || 0), 0) /
        firstTen.length;
      setAvgPrice(Math.round(avg));
    }
  }

  return (
    <PlannerContext.Provider
      value={{
        properties,
        avgPrice,
        dreamHome,
        setDreamHome,
        fetchPropertiesFromAPI,
        decisionTexts,
        setDecisionTexts,
        activeDecisions,
        setActiveDecisions,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used inside PlannerProvider");
  return ctx;
}
