import { useState, useRef, useEffect } from "react";
import { processClaim } from "./services/claimService";
import BillTable from "./components/BillTable";
import DischargeCard from "./components/DischargedCard"
import PatientCard from "./components/PatientCard";
import SupportingDocs from "./components/Supportingdocs";
import "./App.css";

const TABS = ["Patient Summary", "Bills & Items", "Classified Pages"];

/* ── tiny icon helpers ── */
const Icon = {
  back: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  thumb_up: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  ),
  thumb_down: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
    </svg>
  ),
  edit: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  timer: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  user: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  file: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  grid: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  copy: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  zoomIn: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  ),
  zoomOut: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  ),
  download: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  print: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
  ),
  more: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
    </svg>
  ),
  upload: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="12" y1="18" x2="12" y2="12"/>
      <polyline points="9 15 12 12 15 15"/>
    </svg>
  ),
};

/* ── Elapsed timer hook ── */
function useElapsed(running) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  return { mins: Math.floor(secs / 60), secs: secs % 60 };
}

/* ══════════════════════════════
   APP
══════════════════════════════ */
export default function App() {
  const [claimId, setClaimId]   = useState("");
  const [file, setFile]         = useState(null);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [pdfUrl, setPdfUrl]     = useState(null);
  const [activeTab, setActiveTab] = useState("Patient Summary");
  const [dragOver, setDragOver] = useState(false);
  const [claimStart]            = useState(Date.now());
  const fileInputRef = useRef(null);

  const elapsed = useElapsed(!!result);
  const pendingMins = Math.floor((Date.now() - claimStart) / 60000);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") {
      setFile(f); setPdfUrl(URL.createObjectURL(f)); setError(null);
    } else if (f) {
      setError("Only PDF files are allowed");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") {
      setFile(f); setPdfUrl(URL.createObjectURL(f)); setError(null);
    } else {
      setError("Only PDF files are allowed");
    }
  };

  const handleSubmit = async () => {
    if (!file || !claimId.trim()) { setError("Provide Claim ID and PDF"); return; }
    try {
      setLoading(true); setError(null);
      const data = await processClaim({ claimId, file });
      console.log("API RESPONSE:", data);
      setResult(data);
      setActiveTab("Patient Summary");
    } catch (err) {
      setError(err?.message || "Processing failed");
    } finally {
      setLoading(false);
    }
  };

  const identity   = result?.identity_data;
  const discharge  = result?.discharge_data;
  const bill       = result?.bill_data;
  const classified = result?.classified_pages;

  const totalAmount = bill?.total ?? "—";
  const patientName = identity?.patient_name ?? null;

  return (
    <div className="app">

      {/* ════════════════════════════
          HEADER
      ════════════════════════════ */}
      <header className="header">

        {/* Left */}
        <div className="header-left">
          <button className="back-btn">Dashboard</button>
          <div className="h-divider" />
          <div className="session-block">
            <div className="session-top">
              <span className="session-title">Review Session</span>
              {claimId && (
                <span className="session-id">({claimId})</span>
              )}
              <button className="icon-ghost" title="Copy ID">{Icon.copy}</button>
            </div>
            {patientName && (
              <div className="session-patient">Patient: {patientName}</div>
            )}
          </div>
        </div>

        {/* Center — amounts */}
        {/* <div className="header-center">
          {result && (
            <>
              <div className="amount-pair">
                <span className="amount-label">Total Sum:</span>
                <span className="amount-val green">₹{totalAmount}</span>
              </div>
              <button className="icon-ghost">{Icon.edit}</button>
              <div className="amount-pair">
                <span className="amount-label">Claimed Amount:</span>
                <span className="amount-val">₹{totalAmount}</span>
              </div>
              <div className="amount-pair">
                <span className="amount-label">Difference:</span>
                <span className="amount-val muted">₹0.00</span>
              </div>
            </>
          )}
        </div> */}

        {/* Right — stat badges + actions */}
        {/* <div className="header-right">
          <div className="stat-badge">
            <span className="stat-num">{result ? "100%" : "—"}</span>
            <span className="stat-lbl">Bills</span>
          </div>
          <div className="stat-badge">
            <span className="stat-num">{result ? "100%" : "—"}</span>
            <span className="stat-lbl">Amount</span>
          </div>
          <div className="stat-badge accent">
            <span className="stat-num">{result ? "OK" : "—"}</span>
            <span className="stat-lbl">Status</span>
          </div>
          <div className="h-divider" />
          <button className="action-btn approve" title="Approve">{Icon.thumb_up}</button>
          <button className="action-btn reject"  title="Reject">{Icon.thumb_down}</button>
        </div> */}
      </header>

      {/* ════════════════════════════
          TAB BAR
      ════════════════════════════ */}
      <nav className="tabbar">
        <div className="tabbar-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Patient Summary"   && Icon.user}
              {tab === "Bills & Items"     && Icon.file}
              {tab === "Classified Pages"  && Icon.grid}
              {tab}
            </button>
          ))}
        </div>

        {/* <div className="tabbar-right">
          <span className="timer-label">Claim pending since</span>
          <div className="time-chip">
            <span className="t-num">{pendingMins}</span>
            <span className="t-unit">Mins</span>
          </div>
          <div className="time-chip">
            <span className="t-num">00</span>
            <span className="t-unit">Secs</span>
          </div>
          <div className="timer-sep" />
          <span className="timer-label">Time spent on claim</span>
          <div className="time-chip">
            <span className="t-num">{elapsed.mins}</span>
            <span className="t-unit">Mins</span>
          </div>
          <div className="time-chip">
            <span className="t-num">{String(elapsed.secs).padStart(2,"0")}</span>
            <span className="t-unit">Secs</span>
          </div>
          <button className="icon-ghost timer-icon">{Icon.timer}</button>
        </div> */}
      </nav>

      {/* ════════════════════════════
          BODY — split layout
      ════════════════════════════ */}
      <div className="body-split">

        {/* ── LEFT: PDF panel ── */}
        <div className="pdf-panel">

          {/* Toolbar */}
          <div className="pdf-toolbar">
            <div className="pdf-toolbar-left">
              <button className="tool-btn">{Icon.zoomOut}</button>
              <div className="page-ctrl">
                <button className="tool-btn">‹</button>
                <input className="page-input" defaultValue="1" readOnly />
                <span className="page-total">/ {file ? "—" : "0"}</span>
                <button className="tool-btn">›</button>
              </div>
              <button className="tool-btn">{Icon.zoomIn}</button>
              <span className="zoom-label">100%</span>
            </div>
            <div className="pdf-toolbar-right">
              <button className="tool-btn">{Icon.download}</button>
              <button className="tool-btn">{Icon.print}</button>
              <button className="tool-btn">{Icon.more}</button>
            </div>
          </div>

          {/* Viewer area */}
          <div
            className={`pdf-area ${dragOver ? "drag-over" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            {pdfUrl ? (
              <iframe src={pdfUrl} title="PDF Preview" className="pdf-frame" />
            ) : (
              <div className="drop-zone" onClick={() => fileInputRef.current?.click()}>
                <div className="drop-zone-icon">{Icon.upload}</div>
                <p className="drop-zone-title">Drop PDF here</p>
                <p className="drop-zone-sub">or click to browse</p>
                <span className="drop-zone-pill">PDF files only</span>
              </div>
            )}
          </div>

          {/* File status bar */}
          {file && (
            <div className="pdf-status-bar">
              {Icon.file}
              <span className="pdf-status-name">{file.name}</span>
              <button
                className="pdf-status-clear"
                onClick={() => { setFile(null); setPdfUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              >✕</button>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: "none" }} />
        </div>

        {/* ── RIGHT: Content panel ── */}
        <div className="content-panel">

          {/* ── Claim intake form (before any result) ── */}
          {!result && (
            <div className="intake-card">
              <div className="intake-header">
                <span className="intake-title">{Icon.file} Claim Intake</span>
                <span className="intake-badge">New</span>
              </div>

              <div className="intake-row">
                <label className="intake-lbl">#</label>
                <input
                  className="intake-input"
                  placeholder="Enter Claim ID"
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              <div className="intake-row">
                <label className="intake-lbl">{Icon.file}</label>
                <span className="intake-file-display">
                  {file ? file.name : "No document selected"}
                </span>
                <button className="intake-browse" onClick={() => fileInputRef.current?.click()}>
                  Browse
                </button>
              </div>

              {error && (
                <div className="intake-error">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <div className="intake-footer">
                <button
                  className={`process-btn${loading ? " loading" : ""}`}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner" /> Processing...</>
                  ) : (
                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Process Claim</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── PATIENT SUMMARY TAB ── */}
          {/* ✅ Fixed: was checking "Classified Pages" instead of "Patient Summary" */}
          {result && activeTab === "Patient Summary" && (
            <div className="tab-content">
              <PatientCard identity={identity} />
              <DischargeCard discharge={discharge} />
            </div>
          )}

          {/* ── BILLS & ITEMS TAB ── */}
          {result && activeTab === "Bills & Items" && (
            <div className="tab-content">
              <BillTable bill={bill} />
            </div>
          )}

          {/* ── CLASSIFIED PAGES TAB ── */}
          {/* ✅ Fixed: removed duplicate old block, now only SupportingDocs */}
          {result && activeTab === "Classified Pages" && (
            <div className="tab-content">
              <SupportingDocs classified={classified} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}