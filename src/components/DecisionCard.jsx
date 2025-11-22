export default function DecisionCard({ title, description, active, onClick }) {
  return (
    <div
      className={`decision-card ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="decision-card-content">
        <h4 className="decision-title">{title}</h4>
        <p className="decision-description">{description}</p>
      </div>
    </div>
  );
}
