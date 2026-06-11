import { useSelector } from "react-redux";

const BagSummary = () => {
  const bagItemIds = useSelector((state) => state.bag);
  const items = useSelector((state) => state.items);

  const finalItems = items.filter((item) => bagItemIds.indexOf(item.id) >= 0);

  const CONVENIENCE_FEES = 99;
  let totalItem = finalItems.length;
  let totalMRP = 0;
  let totalDiscount = 0;

  // Advanced ingredient trackers
  let hasRetinol = false;
  let hasAHA_BHA = false;
  let hasVitaminC = false;
  let hasNiacinamide = false;
  let hasHyaluronic = false;

  finalItems.forEach((bagItem) => {
    totalMRP += bagItem.original_price;
    totalDiscount += bagItem.original_price - bagItem.current_price;

    const itemText = `${bagItem.item_name} ${bagItem.company}`.toLowerCase();

    if (itemText.includes("retinol") || itemText.includes("retinoid"))
      hasRetinol = true;
    if (
      itemText.includes("salicylic") ||
      itemText.includes("glycolic") ||
      itemText.includes("aha") ||
      itemText.includes("bha") ||
      itemText.includes("exfoliat")
    )
      hasAHA_BHA = true;
    if (
      itemText.includes("vitamin c") ||
      itemText.includes("vit c") ||
      itemText.includes("ascorbic")
    )
      hasVitaminC = true;
    if (itemText.includes("niacinamide")) hasNiacinamide = true;
    if (itemText.includes("hyaluronic") || itemText.includes("snail"))
      hasHyaluronic = true;
  });

  let finalPayment =
    totalMRP - totalDiscount + (totalItem > 0 ? CONVENIENCE_FEES : 0);

  // 1. Calculate Dynamic Routine Compatibility Metrics
  let safetyScore = 100;
  let safetyStatus = "Perfectly Balanced";
  let safetyColor = "#15803d"; // Green
  let analysisNotes = [];
  let amRoutine = [];
  let pmRoutine = [];

  // 2. Build Smart AM/PM Scheduling Engine
  finalItems.forEach((item) => {
    const name = item.item_name.toLowerCase();

    if (
      name.includes("sunscreen") ||
      name.includes("vit c") ||
      name.includes("vitamin c")
    ) {
      amRoutine.push(item.item_name);
    } else if (name.includes("retinol") || name.includes("retinoid")) {
      pmRoutine.push(item.item_name);
    } else {
      // General items can be used in both, but let's balance them visually
      if (amRoutine.length <= pmRoutine.length) {
        amRoutine.push(item.item_name);
      } else {
        pmRoutine.push(item.item_name);
      }
    }
  });

  // 3. Clinical Conflict Detection Rules Engine
  if (hasRetinol && hasAHA_BHA) {
    safetyScore -= 40;
    analysisNotes.push(
      "⚠️ Retinol + BHA conflict: High risk of over-exfoliation and peeling."
    );
  }
  if (hasRetinol && hasVitaminC) {
    safetyScore -= 30;
    analysisNotes.push(
      "⚠️ Retinol + Vitamin C conflict: Layering these together destabilizes pH formulas."
    );
  }
  if (hasAHA_BHA && hasVitaminC) {
    safetyScore -= 25;
    analysisNotes.push(
      "⚠️ AHA/BHA + Vitamin C conflict: May cause immediate skin stinging and flushing."
    );
  }
  if (hasNiacinamide && hasVitaminC) {
    analysisNotes.push(
      "💡 Optimization tip: Niacinamide & Vitamin C can be used together, but spacing them 10 mins apart yields maximum radiance!"
    );
  }
  if (hasHyaluronic) {
    analysisNotes.push(
      "✨ Hydration Boost: Snail Mucin / Hyaluronic Acid detected! Excellent for barrier defense."
    );
  }

  // Adjust safety tier thresholds
  if (safetyScore <= 60) {
    safetyStatus = "High Irritation Risk";
    safetyColor = "#b91c1c"; // Red
  } else if (safetyScore < 100) {
    safetyStatus = "Caution Required";
    safetyColor = "#d97706"; // Amber
  }

  return (
    <div className='bag-summary' style={{ width: "100%", maxWidth: "450px" }}>
      {/* SECTION A: FINANCIAL SUMMARY */}
      <div className='bag-details-container'>
        <div className='price-header'>PRICE DETAILS ({totalItem} Items) </div>
        <div className='price-item'>
          <span>Total MRP</span>
          <span>Rs {totalMRP}</span>
        </div>
        <div className='price-item'>
          <span>Discount on MRP</span>
          <span className='priceDetail-base-discount'>-Rs {totalDiscount}</span>
        </div>
        <div className='price-item'>
          <span>Convenience Fee</span>
          <span>Rs {totalItem > 0 ? CONVENIENCE_FEES : 0}</span>
        </div>
        <hr />
        <div className='price-footer'>
          <span>Total Amount</span>
          <span>Rs {finalPayment}</span>
        </div>
      </div>

      {/* SECTION B: CLINICAL LABELS & VISUAL METRICS */}
      {totalItem > 0 && (
        <div
          className='routine-analyzer-panel'
          style={{
            background: "#f8fafc",
            borderRadius: "8px",
            padding: "16px",
            marginTop: "15px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "700",
              marginBottom: "12px",
              color: "#1e293b",
              letterSpacing: "0.5px",
            }}
          >
            🔬 AI ROUTINE LAB ANALYSIS
          </h4>

          {/* Safety Bar Meter */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              marginBottom: "4px",
              fontWeight: "600",
            }}
          >
            <span>Skin Barrier Safety Score:</span>
            <span style={{ color: safetyColor }}>
              {safetyScore}% ({safetyStatus})
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "#cbd5e1",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                width: `${safetyScore}%`,
                height: "100%",
                background: safetyColor,
                transition: "width 0.4s ease",
              }}
            ></div>
          </div>

          {/* Conflict Analysis Log */}
          {analysisNotes.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  fontWeight: "700",
                  marginBottom: "5px",
                }}
              >
                DETECTION LOGS:
              </div>
              {analysisNotes.map((note, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: "11px",
                    color: "#334155",
                    marginBottom: "4px",
                    paddingLeft: "6px",
                    borderLeft: `2px solid ${safetyColor}`,
                  }}
                >
                  {note}
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Smart Routine Calendar Mapping */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              borderTop: "1px dashed #cbd5e1",
              paddingTop: "12px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#0284c7",
                }}
              >
                ☀️ AM ROUTINE
              </div>
              {amRoutine.length === 0 ? (
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>Empty</div>
              ) : (
                amRoutine.map((name, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "10px",
                      color: "#475569",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    • {name.split("-")[0]}
                  </div>
                ))
              )}
            </div>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#4f46e5",
                }}
              >
                🌙 PM ROUTINE
              </div>
              {pmRoutine.length === 0 ? (
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>Empty</div>
              ) : (
                pmRoutine.map((name, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "10px",
                      color: "#475569",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    • {name.split("-")[0]}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <button
        className='btn-place-order'
        style={{ marginTop: "15px" }}
        onClick={() => alert("Order Placed Successfully!")}
      >
        PLACE ORDER
      </button>
    </div>
  );
};

export default BagSummary;
