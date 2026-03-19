import { useState } from "react";
import "../assets/css/Dishargecard.css"


const Icons = {
  hospital: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  stethoscope: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  calendar: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  diagnosis: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  doctor: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  arrow: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  chevron: (collapsed) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

/* ── Duration calculator ── */
function calcDays(admitStr, dischargeStr) {
  try {
    const a = new Date(admitStr);
    const d = new Date(dischargeStr);
    const diff = Math.round((d - a) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  } catch {
    return null;
  }
}

/* ── Main Component ── */
export default function DischargeCard({ discharge }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!discharge) return null;

  const {
    hospital_name,
    doctor_name,
    diagnosis,
    admit_date,
    discharge_date,
  } = discharge;

  const stayDays = calcDays(admit_date, discharge_date);

  return (
    <div className="dc-card">

      {/* ── Card Header ── */}
      <div className="dc-header">
        <div className="dc-header-left">
          <span className="dc-tag">Discharge Summary</span>
          <div className="dc-header-title">
            <span className="dc-icon purple">{Icons.hospital}</span>
            <span className="dc-hospital-name">{hospital_name ?? "—"}</span>
          </div>
        </div>

        <div className="dc-header-right">
          {stayDays && (
            <div className="dc-stay-chip">
              <span className="dc-stay-num">{stayDays}</span>
              <span className="dc-stay-label">day stay</span>
            </div>
          )}
          <button
            className="dc-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {Icons.chevron(collapsed)}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      {!collapsed && (
        <div className="dc-body">

          {/* ── Diagnosis Banner ── */}
          <div className="dc-diagnosis-banner">
            <div className="dc-diag-icon">{Icons.diagnosis}</div>
            <div className="dc-diag-content">
              <span className="dc-diag-label">Primary Diagnosis</span>
              <span className="dc-diag-value">{diagnosis ?? "—"}</span>
            </div>
          </div>

          {/* ── Info Grid ── */}
          <div className="dc-info-grid">

            {/* Doctor */}
            <div className="dc-info-row">
              <div className="dc-info-icon-wrap purple">{Icons.doctor}</div>
              <div className="dc-info-content">
                <span className="dc-info-label">Attending Physician</span>
                <span className="dc-info-value">{doctor_name ?? "—"}</span>
              </div>
            </div>

            {/* Admission Date */}
            <div className="dc-info-row">
              <div className="dc-info-icon-wrap teal">{Icons.calendar}</div>
              <div className="dc-info-content">
                <span className="dc-info-label">Admission Date</span>
                <span className="dc-info-value mono">{admit_date ?? "—"}</span>
              </div>
              <div className="dc-date-arrow">{Icons.arrow}</div>
              <div className="dc-info-content">
                <span className="dc-info-label">Discharge Date</span>
                <span className="dc-info-value mono">{discharge_date ?? "—"}</span>
              </div>
            </div>

          </div>

          {/* ── Footer Timeline Bar ── */}
          <div className="dc-timeline-bar">
            <div className="dc-tl-dot admit" />
            <div className="dc-tl-line">
              {stayDays && (
                <span className="dc-tl-mid-label">{stayDays} days</span>
              )}
            </div>
            <div className="dc-tl-dot discharge" />
            <div className="dc-tl-dates">
              <span>{admit_date ?? "—"}</span>
              <span>{discharge_date ?? "—"}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}