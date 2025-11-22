import { useState } from "react";
import { usePlanner } from "../context/PlannerContext"; // Import context
import DecisionNode from "../components/DecisionNode"; 
import DecisionSettingsModal from "../components/DecisionSettingsModal";
import AISuggestedPlans from "../components/AISuggestedPlans";
import { predefinedDecisions } from "../data/decisions";
import TimelineSlider from "../components/TimelineSlider";

export default function Planner() {
  const { finances, dreamHome } = usePlanner(); // Get real data
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null);

  // store edited text
  const [decisionTexts, setDecisionTexts] = useState(
    Object.fromEntries(predefinedDecisions.map((d) => [d.id, d.defaultText]))
  );

  // active decisions (toggled ON)
  const [activeDecisions, setActiveDecisions] = useState([]);

  // Construct user profile from context data
  const userProfile = {
    monthlyIncome: finances?.salary || 0,
    savings: finances?.savings || 0,
    location: dreamHome?.city || 'Munich',
    propertyType: dreamHome?.propertyType || 'Apartment',
    timeline: 'ASAP' // You might want to add a timeline input to Profile page later
  };

  // toggle ON/OFF
  const handleDecisionToggle = (id) => {
    if (activeDecisions.includes(id)) {
      setActiveDecisions(activeDecisions.filter((x) => x !== id));
    } else {
      setActiveDecisions([...activeDecisions, id]);
    }
  };

  // open edit modal
  const handleEditClick = (id) => {
    setSelectedDecision(id);
    setModalOpen(true);
  };

  // TIMELINE DUMMY IMPACT (just visual for now)
  const baselineYear = 2035;
  let expectedYear = baselineYear;

  // fake logic: each decision ON delays by +2 years (temporary)
  expectedYear += activeDecisions.length * 2;

  return (
    <div>
      {/* AI SUGGESTED PLANS SECTION */}
      <AISuggestedPlans userProfile={userProfile} />

      <h2>Life Decisions</h2>
      <p>Select a decision to see its impact on your timeline.</p>

      {/* DECISIONS */}
      <div className="decision-grid">
        {predefinedDecisions.map((d) => (
          <DecisionNode
            key={d.id}
            id={d.id}
            label={d.title}
            description={decisionTexts[d.id]}
            active={activeDecisions.includes(d.id)}
            onToggle={handleDecisionToggle}
            onEdit={handleEditClick}
          />
        ))}
      </div>

      {/* TIMELINE */}
      <div className="timeline-wrapper">
        <TimelineSlider
          baselineYear={baselineYear}
          projectedYear={expectedYear}
          expectedYear={expectedYear}
          minYear={new Date().getFullYear()}
          maxYear={new Date().getFullYear() + 50}
        />
      </div>

      {/* EDIT MODAL */}
      <DecisionSettingsModal
        open={modalOpen}
        decision={selectedDecision}
        text={selectedDecision ? decisionTexts[selectedDecision] : ""}
        setText={(value) =>
          setDecisionTexts({
            ...decisionTexts,
            [selectedDecision]: value,
          })
        }
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
