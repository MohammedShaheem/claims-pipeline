import { useState } from "react";
import "../assets/css/Supportingdocs.css";

/* ══════════════════════════════
   CONFIG — one entry per doc type
══════════════════════════════ */
const DOC_CONFIG = {
  claim_forms: {
    label: "Claim Forms",
    tag: "Forms",
    tagClass: "blue",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  investigation_report: {
    label: "Investigation Reports",
    tag: "Reports",
    tagClass: "purple",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
  },
  cash_receipt: {
    label: "Cash Receipts",
    tag: "Receipt",
    tagClass: "green",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  cheque_or_bank_details: {
    label: "Bank / Cheque Details",
    tag: "Bank",
    tagClass: "teal",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
};

/* ── Grab first non-empty line as a title from raw text ── */
function extractTitle(text) {
  if (!text) return "Document";
  const firstLine = text.split("\n").find((l) => l.trim().length > 2);
  return firstLine ? firstLine.trim().slice(0, 60) : "Document";
}

/* ── Render a single document row ── */
function DocRow({ doc, index, tagClass }) {
  const [expanded, setExpanded] = useState(false);
  const title = extractTitle(doc.text);
  const lineCount = doc.text ? doc.text.split("\n").filter((l) => l.trim()).length : 0;

  return (
    <div className={`sd-doc-row ${expanded ? "expanded" : ""}`}>
      <div
        className="sd-doc-header"
        onClick={() => setExpanded((e) => !e)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
      >
        {/* Left */}
        <div className="sd-doc-left">
          <span className="sd-doc-index">{index}</span>
          <div className="sd-doc-meta">
            <span className="sd-doc-title">{title}</span>
            <div className="sd-doc-chips">
              <span className="sd-chip page">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Page {doc.page_number}
              </span>
              <span className="sd-chip lines">{lineCount} lines</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="sd-doc-right">
          <span className={`sd-expand-hint ${expanded ? "hide" : ""}`}>Preview</span>
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="sd-chevron"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Expanded text preview */}
      {expanded && (
        <div className="sd-doc-preview">
          <pre className="sd-doc-text">{doc.text?.trim()}</pre>
        </div>
      )}
    </div>
  );
}

/* ── One section per document category ── */
function DocSection({ configKey, items }) {
  const [collapsed, setCollapsed] = useState(false);
  const cfg = DOC_CONFIG[configKey] || {
    label: configKey.replace(/_/g, " "),
    tag: "Docs",
    tagClass: "blue",
    icon: null,
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`sd-section accent-${cfg.tagClass}`}>
      {/* Section header */}
      <div className="sd-section-header">
        <div className="sd-section-left">
          <span className={`sd-tag ${cfg.tagClass}`}>{cfg.tag}</span>
          <span className="sd-section-icon">{cfg.icon}</span>
          <span className="sd-section-label">{cfg.label}</span>
          <span className="sd-section-count">{items.length}</span>
        </div>
        <button
          className="sd-collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {/* Doc rows */}
      {!collapsed && (
        <div className="sd-doc-list">
          {items.map((doc, i) => (
            <DocRow key={i} doc={doc} index={i + 1} tagClass={cfg.tagClass} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════
   MAIN COMPONENT
══════════════════════════════ */
export default function SupportingDocs({ classified }) {
  if (!classified) return null;

  /* Render in a defined order */
  const ORDER = [
    "claim_forms",
    "investigation_report",
    "cash_receipt",
    "cheque_or_bank_details",
  ];

  /* Count total documents */
  const totalDocs = ORDER.reduce(
    (sum, key) => sum + (classified[key]?.length || 0),
    0
  );

  if (totalDocs === 0) return null;

  /* Page coverage */
  const allPages = ORDER.flatMap((key) =>
    (classified[key] || []).map((d) => d.page_number)
  ).sort((a, b) => a - b);

  return (
    <div className="sd-wrapper">

      {/* ── Card header ── */}
      <div className="sd-card-header">
        <div className="sd-card-header-left">
          <span className="sd-main-tag">Supporting Documents</span>
          <span className="sd-total-count">{totalDocs} documents</span>
        </div>

        {/* Page map chips */}
        <div className="sd-page-map">
          <span className="sd-page-map-label">Pages</span>
          {allPages.map((pg, i) => (
            <span key={i} className="sd-page-chip">{pg}</span>
          ))}
        </div>
      </div>

      {/* ── Summary strip ── */}
      <div className="sd-summary-strip">
        {ORDER.map((key) => {
          const cfg = DOC_CONFIG[key];
          const count = classified[key]?.length || 0;
          if (!count) return null;
          return (
            <div key={key} className={`sd-summary-item ${cfg.tagClass}`}>
              <span className="sd-sum-icon">{cfg.icon}</span>
              <div className="sd-sum-text">
                <span className="sd-sum-count">{count}</span>
                <span className="sd-sum-label">{cfg.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Sections ── */}
      <div className="sd-sections">
        {ORDER.map((key) => (
          <DocSection key={key} configKey={key} items={classified[key]} />
        ))}
      </div>

    </div>
  );
}