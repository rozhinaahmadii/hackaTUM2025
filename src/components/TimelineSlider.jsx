// src/components/TimelineSlider.jsx
import React from "react";

export default function TimelineSlider({
  baselineYear,
  projectedYear,
  expectedYear,
  minYear,
  maxYear,
}) {
  const clamp = (v) => Math.min(maxYear, Math.max(minYear, v));

  const baseline = clamp(baselineYear);
  const projected = clamp(projectedYear);
  const expected = clamp(expectedYear);

  const baselinePos = ((baseline - minYear) / (maxYear - minYear)) * 100;
  const projectedPos = ((projected - minYear) / (maxYear - minYear)) * 100;
  const expectedPos = ((expected - minYear) / (maxYear - minYear)) * 100;

  return (
    <div className="timeline-container-upgraded">
      <h3 className="timeline-title">Purchase Timeline</h3>

      {/* LABELS ABOVE */}
      <div className="timeline-labels">
        <div className="timeline-label baseline-label" style={{ left: `${baselinePos}%` }}>
          Baseline {baseline}
        </div>
        <div className="timeline-label projected-label" style={{ left: `${projectedPos}%` }}>
          Projected {projected}
        </div>
        <div className="timeline-label expected-label" style={{ left: `${expectedPos}%` }}>
          Expected {expected}
        </div>
      </div>

      {/* TRACK */}
      <div className="timeline-track">
        <div className="marker-dot baseline-dot" style={{ left: `${baselinePos}%` }} />
        <div className="marker-dot projected-dot" style={{ left: `${projectedPos}%` }} />
        <div className="expected-ball" style={{ left: `${expectedPos}%` }} />
      </div>

      {/* MIN/MAX */}
      <div className="timeline-years">
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </div>
  );
}
