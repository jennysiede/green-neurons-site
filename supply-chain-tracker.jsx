import { useState } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
// Edit this single object to restyle the entire app.
const THEME = {
  pageBg:       "#f5f1eb",   // warm cream canvas
  surfaceBg:    "#ffffff",   // card white
  surfaceAlt:   "#f0ece4",   // sand — secondary cards, footer tray
  borderColor:  "#d6cfc4",   // warm gray rule
  borderStrong: "#b8aea0",   // stronger divider

  textPrimary:   "#1a1612",  // near-black, warm undertone
  textSecondary: "#6b6258",  // mid warm gray
  textMuted:     "#9e9288",  // labels / captions
  textInverse:   "#f5f1eb",  // cream on dark bg

  accent:        "#3d5a80",  // slate blue — buttons, borders, highlights
  accentLight:   "#e8eef5",  // slate tint — selected state bg
  accentMid:     "#6b8cae",  // lighter slate

  headerBg:      "#1a2535",  // deep navy
  headerText:    "#f5f1eb",
  headerMuted:   "#8899aa",

  risk: {
    low: {
      bg:     "#f0f7f0",
      border: "#7aaa7a",
      text:   "#2d6b2d",
      badge:  "#dff0df",
    },
    medium: {
      bg:     "#fdf6ec",
      border: "#d4922a",
      text:   "#8a5a10",
      badge:  "#faebd7",
    },
    critical: {
      bg:     "#fdf0ef",
      border: "#c45c5c",
      text:   "#8b2020",
      badge:  "#fce8e8",
    },
  },

  status: {
    operational: { color: "#2d6b2d", border: "#7aaa7a", bg: "#dff0df" },
    disrupted:   { color: "#8b2020", border: "#c45c5c", bg: "#fce8e8" },
  },

  fontSerif: "'Georgia', 'Times New Roman', serif",
  fontSans:  "'Helvetica Neue', 'Arial', sans-serif",
  fontMono:  "'Courier New', monospace",
};
// ─────────────────────────────────────────────────────────────────────────────

const ROUTES_DATA = {
  Bangladesh: {
    flag: "🇧🇩",
    port: "Chittagong",
    routes: [
      {
        name: "Trans-Pacific (US West Coast)",
        path: "Chittagong → Singapore/Colombo → Pacific → LA/Long Beach",
        legs: ["Chittagong", "Singapore", "Pacific Ocean", "Los Angeles"],
        status: "operational", riskLevel: "low",
        transitDays: "28–35", costIndex: 1.2,
        disruptions: ["Port congestion at LA/Long Beach (+3–5 days)"],
        notes: "Best option for Fort Worth. Avoids Middle East & Canada entirely. Inland rail from LA to DFW ~2 days.",
        recommended: true,
      },
      {
        name: "Cape of Good Hope (East Coast)",
        path: "Chittagong → Indian Ocean → Cape Town → Atlantic → NYC/Savannah",
        legs: ["Chittagong", "Indian Ocean", "Cape of Good Hope", "New York/Savannah"],
        status: "operational", riskLevel: "medium",
        transitDays: "38–48", costIndex: 1.6,
        disruptions: ["Adds ~10–14 days vs Suez", "Higher fuel surcharges", "Port congestion at Savannah"],
        notes: "Reliable detour used by all major carriers since Red Sea closure. More expensive than Trans-Pacific.",
        recommended: false,
      },
      {
        name: "Suez Canal / Red Sea ⚠️",
        path: "Chittagong → Indian Ocean → Gulf of Aden → Red Sea → Suez → Mediterranean",
        legs: ["Chittagong", "Gulf of Aden", "Red Sea", "Suez Canal", "Mediterranean"],
        status: "disrupted", riskLevel: "critical",
        transitDays: "25–30 (if available)", costIndex: 2.4,
        disruptions: [
          "Houthi attacks ongoing — 190+ incidents since Nov 2023",
          "75% drop in Suez container traffic",
          "Major carriers suspended operations",
          "Insurance premiums 5×–8× normal",
        ],
        notes: "DO NOT USE. All major carriers (Maersk, MSC, CMA CGM) have suspended Red Sea operations. Route is effectively closed for commercial shipping.",
        recommended: false,
      },
    ],
  },
  China: {
    flag: "🇨🇳",
    port: "Shanghai / Shenzhen / Ningbo",
    routes: [
      {
        name: "Trans-Pacific Direct (US West Coast)",
        path: "Shanghai/Shenzhen → Pacific → LA/Long Beach/Seattle",
        legs: ["Shanghai", "Pacific Ocean", "Los Angeles"],
        status: "operational", riskLevel: "low",
        transitDays: "14–21", costIndex: 1.0,
        disruptions: [
          "Blank sailings from Lunar New Year surge",
          "Port congestion +3–7 days at USWC",
          "US tariffs on Chinese goods: 145%+ (verify current rate)",
        ],
        notes: "Fastest route. China–US East Coast uses Panama Canal, not affected by Red Sea. Check current tariff rates — China-specific tariffs are significant for apparel.",
        recommended: true,
      },
      {
        name: "China–Europe Railway (CRE)",
        path: "Shanghai → Zhengzhou → Kazakhstan → Russia → Hamburg → Atlantic",
        legs: ["Shanghai", "Zhengzhou Hub", "Central Asia", "Hamburg", "Atlantic"],
        status: "operational", riskLevel: "medium",
        transitDays: "18–25 (to Europe hub)", costIndex: 1.3,
        disruptions: [
          "Not direct to US — requires transship via Europe",
          "Russia sanctions may complicate routing",
          "30% volume increase since Red Sea crisis",
        ],
        notes: "Good for Europe-bound goods. For US, still needs an ocean leg. CRE volumes up 30% since 2024.",
        recommended: false,
      },
    ],
  },
  Korea: {
    flag: "🇰🇷",
    port: "Busan",
    routes: [
      {
        name: "Trans-Pacific (US West Coast)",
        path: "Busan → Pacific → LA/Long Beach/Seattle",
        legs: ["Busan", "Pacific Ocean", "Los Angeles"],
        status: "operational", riskLevel: "low",
        transitDays: "12–18", costIndex: 1.0,
        disruptions: [
          "Busan port delays: 10–14 days due to congestion",
          "Alliance restructuring causing schedule changes",
        ],
        notes: "Shortest route to US West Coast. Busan is a major transshipment hub. Strong option for technical/functional fabrics from Korea.",
        recommended: true,
      },
      {
        name: "Trans-Pacific (US East Coast via Panama)",
        path: "Busan → Pacific → Panama Canal → Gulf Coast / East Coast",
        legs: ["Busan", "Pacific Ocean", "Panama Canal", "Houston/Savannah"],
        status: "operational", riskLevel: "low",
        transitDays: "22–28", costIndex: 1.15,
        disruptions: ["Panama Canal drought levels normalized in 2025", "Minor vessel queue delays"],
        notes: "Good option routing to Gulf ports near Fort Worth (Houston, Galveston). Avoids Red Sea entirely.",
        recommended: true,
      },
    ],
  },
  Japan: {
    flag: "🇯🇵",
    port: "Tokyo (Yokohama) / Osaka / Kobe",
    routes: [
      {
        name: "Trans-Pacific (US West Coast)",
        path: "Yokohama/Kobe → Pacific → LA/Long Beach/Seattle",
        legs: ["Yokohama", "Pacific Ocean", "Los Angeles"],
        status: "operational", riskLevel: "low",
        transitDays: "11–16", costIndex: 1.0,
        disruptions: ["Minor port congestion at USWC", "Alliance schedule adjustments"],
        notes: "Clean route, no major disruptions. Japan is excellent for technical textile sourcing (high-performance wovens). Fastest Asian lane to US West Coast.",
        recommended: true,
      },
    ],
  },
  India: {
    flag: "🇮🇳",
    port: "Mumbai (Nhava Sheva) / Chennai / Mundra",
    routes: [
      {
        name: "Trans-Pacific via Singapore",
        path: "Mumbai → Singapore → Pacific → LA/Long Beach",
        legs: ["Mumbai", "Singapore", "Pacific Ocean", "Los Angeles"],
        status: "operational", riskLevel: "low",
        transitDays: "28–38", costIndex: 1.3,
        disruptions: ["Nhava Sheva/Mundra delays up to 12 days", "Equipment shortages at Indian ports"],
        notes: "Best US-bound route from India. Avoids Red Sea entirely by going east. Growing alternative to China for apparel, especially post-tariff.",
        recommended: true,
      },
      {
        name: "Cape of Good Hope (US East Coast)",
        path: "Mumbai → Indian Ocean → Cape of Good Hope → Atlantic → NYC/Savannah",
        legs: ["Mumbai", "Indian Ocean", "Cape of Good Hope", "New York"],
        status: "operational", riskLevel: "medium",
        transitDays: "35–45", costIndex: 1.55,
        disruptions: [
          "~10 extra days vs Suez route",
          "Higher fuel surcharges",
          "Jebel Ali/Salalah congestion if transshipping",
        ],
        notes: "Viable but slow. India to US East Coast originally used Suez — now all rerouted via Cape. PREMIERE Alliance IOX service (Feb 2025) adds new North Europe options.",
        recommended: false,
      },
    ],
  },
};

const LAST_MILE = [
  { port: "Los Angeles / Long Beach", mode: "Rail — UP/BNSF", days: "2–4 days" },
  { port: "Houston / Galveston",       mode: "Truck / Rail",   days: "4–6 hours" },
  { port: "Savannah, GA",              mode: "Rail / Truck",   days: "2–3 days"  },
];

function CostBar({ value }) {
  const pct   = Math.min((value / 2.4) * 100, 100);
  const color = value <= 1.2 ? THEME.risk.low.border
              : value <= 1.6 ? THEME.risk.medium.border
              : THEME.risk.critical.border;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ width: "80px", height: "5px", background: THEME.borderColor, borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "3px" }} />
      </div>
      <span style={{ fontSize: "12px", fontFamily: THEME.fontMono, color: THEME.textSecondary }}>
        {value}×
      </span>
    </div>
  );
}

export default function SupplyChainTracker() {
  const [selected, setSelected]   = useState("Bangladesh");
  const [expanded, setExpanded]   = useState(null);
  const [dismissed, setDismissed] = useState(false);

  const origin    = ROUTES_DATA[selected];
  const countries = Object.keys(ROUTES_DATA);

  return (
    <div style={{ minHeight: "100vh", background: THEME.pageBg, color: THEME.textPrimary, fontFamily: THEME.fontSans }}>

      {/* HEADER */}
      <div style={{ background: THEME.headerBg, padding: "28px 36px 24px", borderBottom: `3px solid ${THEME.accent}` }}>
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: THEME.headerMuted, marginBottom: "8px" }}>
          NEUROWĒV™ · GREEN NEURONS · SUPPLY INTELLIGENCE
        </div>
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 400, fontFamily: THEME.fontSerif, color: THEME.headerText, letterSpacing: "0.3px" }}>
          Apparel Supply Chain Route Tracker
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: "12px", color: THEME.headerMuted, letterSpacing: "1px" }}>
          Asia → USA · Active Disruption Status · Q1 2026
        </p>
      </div>

      <div style={{ padding: "28px 36px", maxWidth: "980px" }}>

        {/* ALERT BANNER */}
        {!dismissed && (
          <div style={{
            display: "flex", gap: "1px", marginBottom: "28px",
            borderRadius: "4px", overflow: "hidden",
            border: `1px solid ${THEME.borderColor}`,
            position: "relative",
          }}>
            <button
              onClick={() => setDismissed(true)}
              style={{
                position: "absolute", top: "10px", right: "14px",
                background: "none", border: "none",
                color: THEME.textMuted, cursor: "pointer", fontSize: "18px", lineHeight: 1,
              }}
            >×</button>
            <div style={{ flex: 1, background: THEME.surfaceBg, padding: "16px 20px", borderLeft: `4px solid ${THEME.risk.medium.border}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", color: THEME.risk.medium.text, marginBottom: "6px" }}>
                ⚠ CANADA BORDER — ACTIVE
              </div>
              <p style={{ margin: "0 0 5px", fontSize: "13px", color: THEME.textPrimary, lineHeight: 1.5 }}>
                US–Canada trade war (Mar 4, 2025). 35% tariff on non-CUSMA goods as of Aug 1, 2025. Border delays, customs complexity.
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: THEME.textMuted }}>
                → Route directly to US ports. Avoid Canadian transshipment hubs.
              </p>
            </div>
            <div style={{ flex: 1, background: THEME.surfaceBg, padding: "16px 20px", borderLeft: `4px solid ${THEME.risk.critical.border}` }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", color: THEME.risk.critical.text, marginBottom: "6px" }}>
                🚨 RED SEA / SUEZ — CLOSED
              </div>
              <p style={{ margin: "0 0 5px", fontSize: "13px", color: THEME.textPrimary, lineHeight: 1.5 }}>
                Houthi attacks ongoing since Nov 2023. 75% drop in Suez traffic. All major carriers rerouted via Cape of Good Hope.
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: THEME.textMuted }}>
                → Adds 10–14 days + significant cost uplift to affected routes.
              </p>
            </div>
          </div>
        )}

        {/* ORIGIN SELECTOR */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "3px", color: THEME.textMuted, marginBottom: "12px", textTransform: "uppercase" }}>
            Origin Country
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {countries.map(c => {
              const active = selected === c;
              return (
                <button key={c}
                  onClick={() => { setSelected(c); setExpanded(null); }}
                  style={{
                    padding: "9px 18px",
                    border: active ? `1.5px solid ${THEME.accent}` : `1px solid ${THEME.borderColor}`,
                    background: active ? THEME.accentLight : THEME.surfaceBg,
                    color: active ? THEME.accent : THEME.textSecondary,
                    borderRadius: "3px", cursor: "pointer",
                    fontSize: "13px", fontFamily: THEME.fontSans,
                    fontWeight: active ? 600 : 400,
                    transition: "all 0.15s ease",
                  }}
                >
                  {ROUTES_DATA[c].flag} {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* ORIGIN LABEL */}
        <div style={{ borderLeft: `3px solid ${THEME.accent}`, paddingLeft: "14px", marginBottom: "20px" }}>
          <div style={{ fontSize: "20px", fontFamily: THEME.fontSerif, color: THEME.textPrimary, marginBottom: "3px" }}>
            {origin.flag} {selected}
          </div>
          <div style={{ fontSize: "11px", color: THEME.textMuted, letterSpacing: "1px" }}>
            MAIN EXPORT PORT · {origin.port}
          </div>
        </div>

        {/* SECTION HEADER */}
        <div style={{
          fontSize: "10px", letterSpacing: "3px", color: THEME.textMuted,
          marginBottom: "12px", textTransform: "uppercase",
          borderBottom: `1px solid ${THEME.borderColor}`, paddingBottom: "8px",
        }}>
          Available Routes — {origin.routes.length} option{origin.routes.length > 1 ? "s" : ""}
        </div>

        {/* ROUTE CARDS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {origin.routes.map((route, i) => {
            const risk   = THEME.risk[route.riskLevel];
            const status = THEME.status[route.status];
            const isOpen = expanded === i;

            return (
              <div key={i} style={{
                border: `1px solid ${isOpen ? risk.border : THEME.borderColor}`,
                borderRadius: "4px",
                background: isOpen ? risk.bg : THEME.surfaceBg,
                transition: "border-color 0.15s, background 0.15s",
                overflow: "hidden",
                boxShadow: isOpen ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              }}>

                {/* Card row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{
                    padding: "16px 20px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap",
                  }}
                >
                  {route.recommended && (
                    <span style={{
                      fontSize: "9px", letterSpacing: "1.5px", fontWeight: 600,
                      background: THEME.accentLight, color: THEME.accent,
                      border: `1px solid ${THEME.accentMid}`,
                      padding: "3px 8px", borderRadius: "2px", whiteSpace: "nowrap",
                    }}>✓ RECOMMENDED</span>
                  )}
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <div style={{ fontSize: "15px", fontFamily: THEME.fontSerif, color: THEME.textPrimary, marginBottom: "4px" }}>
                      {route.name}
                    </div>
                    <div style={{ fontSize: "11px", color: THEME.textMuted }}>
                      {route.path}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: "9px", color: THEME.textMuted, letterSpacing: "2px", marginBottom: "2px" }}>TRANSIT</div>
                      <div style={{ fontSize: "14px", fontFamily: THEME.fontMono, color: THEME.textPrimary }}>{route.transitDays}d</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "9px", color: THEME.textMuted, letterSpacing: "2px", marginBottom: "2px" }}>RISK</div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: risk.text, letterSpacing: "0.5px" }}>
                        {route.riskLevel.toUpperCase()}
                      </div>
                    </div>
                    <div style={{
                      fontSize: "10px", fontWeight: 600,
                      color: status.color, background: status.bg,
                      border: `1px solid ${status.border}`,
                      padding: "4px 10px", borderRadius: "2px",
                      letterSpacing: "0.5px", whiteSpace: "nowrap",
                    }}>
                      {route.status === "disrupted" ? "⚠ DISRUPTED" : "OPERATIONAL"}
                    </div>
                    <span style={{ color: THEME.textMuted, fontSize: "12px" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div style={{ borderTop: `1px solid ${risk.border}`, padding: "20px" }}>

                    {/* Legs */}
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ fontSize: "9px", letterSpacing: "2px", color: THEME.textMuted, marginBottom: "10px", textTransform: "uppercase" }}>Route Path</div>
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                        {route.legs.map((leg, li) => (
                          <span key={li} style={{ display: "flex", alignItems: "center" }}>
                            <span style={{
                              fontSize: "11px", padding: "4px 12px",
                              border: `1px solid ${risk.border}`, borderRadius: "2px",
                              color: risk.text, background: risk.badge,
                              whiteSpace: "nowrap", margin: "2px 0",
                            }}>{leg}</span>
                            {li < route.legs.length - 1 && (
                              <span style={{ color: THEME.borderStrong, margin: "0 6px", fontSize: "13px" }}>→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: "flex", gap: "32px", marginBottom: "20px", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: "9px", color: THEME.textMuted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Transit Time</div>
                        <div style={{ fontSize: "20px", fontFamily: THEME.fontSerif, color: THEME.textPrimary }}>
                          {route.transitDays} <span style={{ fontSize: "12px", color: THEME.textMuted }}>days</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "9px", color: THEME.textMuted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Cost Index</div>
                        <CostBar value={route.costIndex} />
                      </div>
                    </div>

                    {/* Disruptions */}
                    {route.disruptions.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "9px", color: THEME.textMuted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Active Disruptions</div>
                        {route.disruptions.map((d, di) => (
                          <div key={di} style={{
                            fontSize: "12px", color: risk.text,
                            padding: "6px 0",
                            borderBottom: `1px solid ${THEME.borderColor}`,
                            display: "flex", gap: "10px", alignItems: "flex-start",
                          }}>
                            <span style={{ color: risk.border, marginTop: "1px" }}>▸</span>
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Analyst note */}
                    <div style={{
                      background: THEME.surfaceAlt,
                      border: `1px solid ${THEME.borderColor}`,
                      borderRadius: "3px", padding: "14px 16px",
                    }}>
                      <div style={{ fontSize: "9px", color: THEME.textMuted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Analyst Note</div>
                      <p style={{ margin: 0, fontSize: "13px", fontFamily: THEME.fontSerif, color: THEME.textSecondary, lineHeight: 1.65 }}>
                        {route.notes}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* LAST MILE */}
        <div style={{ marginTop: "28px", border: `1px solid ${THEME.borderColor}`, borderRadius: "4px", background: THEME.surfaceBg, overflow: "hidden" }}>
          <div style={{ background: THEME.accent, padding: "10px 20px", fontSize: "10px", letterSpacing: "3px", color: THEME.textInverse, textTransform: "uppercase" }}>
            📍 Fort Worth, TX — Last-Mile Routing
          </div>
          <div style={{ display: "flex", padding: "16px 20px", flexWrap: "wrap", gap: "0" }}>
            {LAST_MILE.map((r, i) => (
              <div key={i} style={{
                flex: 1, minWidth: "150px",
                padding: "0 20px 0 0",
                borderRight: i < LAST_MILE.length - 1 ? `1px solid ${THEME.borderColor}` : "none",
                marginRight: i < LAST_MILE.length - 1 ? "20px" : 0,
              }}>
                <div style={{ fontSize: "13px", fontFamily: THEME.fontSerif, color: THEME.textPrimary, marginBottom: "4px" }}>{r.port}</div>
                <div style={{ fontSize: "11px", color: THEME.textMuted }}>via {r.mode}</div>
                <div style={{ fontSize: "11px", fontFamily: THEME.fontMono, color: THEME.accent, marginTop: "4px" }}>{r.days}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          marginTop: "20px", padding: "14px 0",
          borderTop: `1px solid ${THEME.borderColor}`,
          fontSize: "10px", color: THEME.textMuted,
          letterSpacing: "0.5px", lineHeight: 1.8,
        }}>
          Data sources: Project44 · CH Robinson · Röhlig Logistics · NNR Global · Atlas Institute for International Affairs · Updated Q1 2026
          <br />
          Transit times and tariff rates are indicative. Verify current rates with your freight forwarder before placing orders.
        </div>

      </div>
    </div>
  );
}
