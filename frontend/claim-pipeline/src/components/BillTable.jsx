import { useState } from "react";
import "../assets/css/Billtable.css";

/* ── helpers ── */
const isPharmacy = (item) =>
  typeof item.cost === "string" && item.cost.trim().startsWith("$");

const parseCost = (cost) => {
  if (!cost) return 0;
  return parseFloat(cost.toString().replace(/[$₹,]/g, "")) || 0;
};

const formatINR = (num) =>
  "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ── sub-table ── */
function ItemTable({ title, tag, tagClass, icon, items, startIndex = 1 }) {
  const [collapsed, setCollapsed] = useState(false);
  const subtotal = items.reduce((s, i) => s + parseCost(i.cost), 0);

  return (
    <div className={`bt-section ${tagClass}`}>

      {/* Section header */}
      <div className="bt-section-header">
        <div className="bt-section-left">
          <span className={`bt-tag ${tagClass}`}>{tag}</span>
          <span className="bt-icon">{icon}</span>
          <span className="bt-section-title">{title}</span>
          <span className="bt-count">{items.length} items</span>
        </div>
        <div className="bt-section-right">
          <span className="bt-subtotal">{formatINR(subtotal)}</span>
          <button
            className="bt-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      {!collapsed && (
        <div className="bt-table-wrap">
          <table className="bt-table">
            <thead>
              <tr>
                <th className="col-num">#</th>
                <th className="col-name">Item / Description</th>
                <th className="col-amt">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "alt"}>
                  <td className="col-num">{startIndex + i}</td>
                  <td className="col-name">{item.name}</td>
                  <td className="col-amt">{formatINR(parseCost(item.cost))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Subtotal footer */}
          <div className="bt-subtotal-bar">
            <span className="bt-subtotal-label">Subtotal — {title}</span>
            <span className="bt-subtotal-value">{formatINR(subtotal)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */
export default function BillTable({ bill }) {
  if (!bill || !bill.items || bill.items.length === 0) {
    return (
      <div className="bt-empty">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p>No bill items found</p>
      </div>
    );
  }

  const hospitalItems = bill.items.filter((i) => !isPharmacy(i));
  const pharmacyItems = bill.items.filter((i) => isPharmacy(i));

  const hospitalTotal = hospitalItems.reduce((s, i) => s + parseCost(i.cost), 0);
  const pharmacyTotal = pharmacyItems.reduce((s, i) => s + parseCost(i.cost), 0);
  const grandTotal    = hospitalTotal + pharmacyTotal;

  /* reconcile with bill.total if provided */
  const declaredTotal = bill.total ? parseCost(bill.total) : null;
  const hasDiscrepancy =
    declaredTotal !== null && Math.abs(declaredTotal - grandTotal) > 0.5;

  return (
    <div className="bt-wrapper">

      {/* ── Card header ── */}
      <div className="bt-card-header">
        <div className="bt-card-header-left">
          <span className="bt-main-tag">Itemized Bill</span>
          <span className="bt-total-items">{bill.items.length} line items</span>
        </div>
        <div className="bt-grand-chip">
          <span className="bt-grand-label">Grand Total</span>
          <span className="bt-grand-value">{formatINR(grandTotal)}</span>
        </div>
      </div>

      {/* ── Summary bar ── */}
      <div className="bt-summary-bar">
        <div className="bt-summary-block blue">
          <span className="bt-sum-label">Hospital Charges</span>
          <span className="bt-sum-value">{formatINR(hospitalTotal)}</span>
          <span className="bt-sum-count">{hospitalItems.length} items</span>
        </div>
        <div className="bt-summary-divider">+</div>
        <div className="bt-summary-block teal">
          <span className="bt-sum-label">Pharmacy</span>
          <span className="bt-sum-value">{formatINR(pharmacyTotal)}</span>
          <span className="bt-sum-count">{pharmacyItems.length} items</span>
        </div>
        <div className="bt-summary-divider">=</div>
        <div className="bt-summary-block green">
          <span className="bt-sum-label">Grand Total</span>
          <span className="bt-sum-value grand">{formatINR(grandTotal)}</span>
          <span className="bt-sum-count">{bill.items.length} items</span>
        </div>
      </div>

      {/* ── Hospital table ── */}
      <ItemTable
        title="Hospital & Medical Charges"
        tag="Hospital"
        tagClass="blue"
        startIndex={1}
        items={hospitalItems}
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        }
      />

      {/* ── Pharmacy table ── */}
      <ItemTable
        title="Pharmacy Items"
        tag="Pharmacy"
        tagClass="teal"
        startIndex={hospitalItems.length + 1}
        items={pharmacyItems}
        icon={
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          </svg>
        }
      />

      {/* ── Grand total footer ── */}
      <div className="bt-grand-footer">
        <div className="bt-grand-footer-left">
          {hasDiscrepancy && (
            <div className="bt-discrepancy">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Declared total {formatINR(declaredTotal)} differs from computed {formatINR(grandTotal)}
            </div>
          )}
        </div>
        <div className="bt-grand-footer-right">
          <span className="bt-grand-footer-label">Grand Total</span>
          <span className="bt-grand-footer-value">{formatINR(grandTotal)}</span>
        </div>
      </div>

    </div>
  );
}