import { Pencil } from "lucide-react";

export default function DecisionNode({
  id,
  label,
  description,
  active,
  onToggle,
  onEdit,
}) {
  return (
    <div
      className={`decision-card ${active ? "active" : ""}`}
      onClick={() => onToggle(id)}
    >
      <div className="decision-card-header">
        <h4>{label}</h4>

        <span
          className="decision-edit-icon"
          onClick={(e) => {
            e.stopPropagation(); 
            onEdit(id);
          }}
        >
          <Pencil size={16} />
        </span>
      </div>

      <p>{description}</p>
    </div>
  );
}
