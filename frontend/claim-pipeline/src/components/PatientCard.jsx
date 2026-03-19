import { useState } from "react";
import "../assets/css/Patientcard.css"

/* ── SVG Icons ── */
const Icons = {
  user: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  id: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
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
  policy: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  chevron: (collapsed) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

/* ── Age calculator from DOB string ── */
function calcAge(dobStr) {
  if (!dobStr) return null;
  try {
    const dob = new Date(dobStr);
    if (isNaN(dob)) return null;
    const diff = Date.now() - dob.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age > 0 && age < 130 ? age : null;
  } catch {
    return null;
  }
}

/* ── Initials from name ── */
function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/* ── Main Component ── */
export default function PatientCard({ identity }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!identity) return null;

  const { patient_name, dob, id_number, policy_number } = identity;
  const age = calcAge(dob);
  const initials = getInitials(patient_name);

  const fields = [
    {
      icon: Icons.calendar,
      iconClass: "blue",
      label: "Date of Birth",
      value: dob ?? "—",
      mono: true,
      suffix: age ? `${age} yrs` : null,
    },
    {
      icon: Icons.id,
      iconClass: "teal",
      label: "Patient / ID Number",
      value: id_number ?? "—",
      mono: true,
    },
    {
      icon: Icons.policy,
      iconClass: "green",
      label: "Policy Number",
      value: policy_number ?? "—",
      mono: true,
    },
  ];

  return (
    <div className="pc-card">

      {/* ── Header ── */}
      <div className="pc-header">
        <div className="pc-header-left">
          <span className="pc-tag">Patient Identity</span>

          {/* Avatar + Name */}
          <div className="pc-name-group">
            <div className="pc-avatar">{initials}</div>
            <span className="pc-patient-name">{patient_name ?? "—"}</span>
          </div>
        </div>

        <div className="pc-header-right">
          {age && (
            <div className="pc-age-chip">
              <span className="pc-age-num">{age}</span>
              <span className="pc-age-label">yrs</span>
            </div>
          )}
          <button
            className="pc-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {Icons.chevron(collapsed)}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      {!collapsed && (
        <div className="pc-body">

          {/* ── Hero strip: full name ── */}
          <div className="pc-hero-strip">
            <div className="pc-hero-icon">{Icons.user}</div>
            <div className="pc-hero-content">
              <span className="pc-hero-label">Full Name</span>
              <span className="pc-hero-value">{patient_name ?? "—"}</span>
            </div>
            <div className="pc-verified-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Verified
            </div>
          </div>

          {/* ── Field rows ── */}
          <div className="pc-fields">
            {fields.map((f, i) => (
              <div className="pc-field-row" key={i}>
                <div className={`pc-field-icon ${f.iconClass}`}>{f.icon}</div>
                <div className="pc-field-content">
                  <span className="pc-field-label">{f.label}</span>
                  <div className="pc-field-value-group">
                    <span className={`pc-field-value${f.mono ? " mono" : ""}`}>
                      {f.value}
                    </span>
                    {f.suffix && (
                      <span className="pc-field-suffix">{f.suffix}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}