export default function DecisionSettingsModal({
  open,
  decision,
  text,
  setText,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Decision Details</h3>

        <label>Description for AI (optional)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />

        <button className="btn" style={{ marginTop: "12px" }} onClick={onClose}>
          Save
        </button>
      </div>
    </div>
  );
}
