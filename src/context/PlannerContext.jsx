import { createContext, useContext, useState } from "react";
import { searchProperties } from "../api/thinkImmo";

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
    city: "Munich",
  });

  // ⭐ UPDATED + COMPLETE FINANCIAL MODEL
  const [finances, setFinances] = useState({
    jobType: "",
    salary: 5000,
    savings: 5000,
    monthlySavings: 2000,
    target: 500000,

    // NEW: Monthly expenses
    expenses: {
      rent: 900,
      groceries: 300,
      utilities: 120,
      transport: 120,
      subscriptions: 40,
      others: 100,
    },

    // NEW: Debt
    debts: [
      {
        type: "Student Loan",
        balance: 12000,
        monthlyPayment: 160,
        interest: 3.2,
      },
      {
        type: "Credit Card",
        balance: 1500,
        monthlyPayment: 50,
        interest: 19.5,
      },
    ],

    // NEW: Investment growth settings
    investment: {
      expectedReturn: 4.2,   // %
      inflation: 2.1,         // %
      compound: true,
    },

    // NEW: Mortgage settings
    mortgage: {
      downPaymentPercent: 20,
      mortgageInterest: 3.0,
    }
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
      const firstHundred = results.slice(0, 100);
      const avg =
        firstHundred.reduce((sum, item) => sum + (item.buyingPrice || 0), 0) /
        firstHundred.length;

      setAvgPrice(Math.round(avg));
    }
  }

  return (
    <PlannerContext.Provider
      value={{
        properties,
        avgPrice,
        propertyCostEstimate: avgPrice,
        dreamHome,
        setDreamHome,
        finances,
        setFinances,
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
