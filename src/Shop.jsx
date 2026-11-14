import { useState, useEffect } from "react";
import { loadData } from "./data.js";

const C = {
  bg: "#F7F3EE",
  card: "#FFFFFF",
  border: "#E8E0D5",
  text: "#1A1208",
  textMid: "#6B5B45",
  textLight: "#A8977E",
  red: "#C8352A",
  redLight: "#FAEAE9",
  green: "#2A7A3B",
  greenLight: "#E8F5EB",
  wa: "#25D366",
  waLight: "#E8FAF0",
  accent: "#E8A020",
};

function ProductCard({ product, onOrder }) {
  return (
    <div style={{
      background: C.card,
      border: `1.5px solid ${C.border}`,
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}>
      {/* Top strip */}
      <div style={{
        background: C.redLight,
        padding: "22px 20px 16px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          width: 60, height: 60,
          borderRadius: 16,
          background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 34,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          flexShrink: 0,
        }}>{product.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.2,
            marginBottom: 4,
          }}>{product.name}</div>
          <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5 }}>
            {product.description}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: C.red, lineHeight: 1 }}>
            €{product.price.toFixed(2)}
          </span>
          <span style={{ fontSize: 13, color: C.textLight }}>/ {product.unit}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 20,
            background: product.available ? C.greenLight : C.redLight,
            color: product.available ? C.green : C.red,
          }}>
            {product.available ? "● Disponibile" : "○ Esaurito"}
          </span>
          {product.available && (
            <button
              onClick={() => onOrder(product)}
              style={{
                background: C.wa,
                border: "none",
                borderRadius: 12,
                padding: "10px 16px",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(37,211,102,0.3)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Ordina
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
    const handler = () => setData(loadData());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!data) return null;
  const { info, products, delivery } = data;

  function handleOrder(product) {
    const wa = info.whatsapp.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Ciao ${info.name}! Vorrei ordinare:\n\n` +
      `${product.emoji} *${product.name}*\n` +
      `Prezzo: €${product.price.toFixed(2)} / ${product.unit}\n\n` +
      `Potresti confermarmi disponibilità e dettagli consegna? Grazie!`
    );
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        body { background: ${C.bg}; }
      `}</style>

      {/* BANNER */}
      {info.bannerActive && info.banner && (
        <div style={{
          background: C.red,
          color: "#fff",
          padding: "11px 20px",
          textAlign: "center",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.2px",
        }}>
          {info.banner}
        </div>
      )}

      {/* HEADER */}
      <div style={{
        background: "#fff",
        borderBottom: `1px solid ${C.border}`,
        padding: "28px 20px 24px",
        textAlign: "center",
        animation: "fadeUp 0.4s ease",
      }}>
        <div style={{
          width: 68, height: 68,
          borderRadius: 18,
          background: C.redLight,
          border: `2px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 34,
          margin: "0 auto 14px",
        }}>🍅</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 30,
          fontWeight: 700,
          color: C.text,
          marginBottom: 4,
        }}>{info.name}</div>
        <div style={{ fontSize: 13, color: C.textLight }}>
          📍 {info.location} · Pomodori freschi dal campo
        </div>
      </div>

      {/* PRODOTTI */}
      <div style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        animation: "fadeUp 0.4s ease 0.1s both",
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.textLight,
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          marginBottom: 4,
          paddingLeft: 2,
        }}>I nostri prodotti</div>

        {products.map(p => (
          <ProductCard key={p.id} product={p} onOrder={handleOrder} />
        ))}
      </div>

      {/* CONSEGNA */}
      <div style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "0 16px 40px",
        animation: "fadeUp 0.4s ease 0.2s both",
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.textLight,
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          marginBottom: 10,
          paddingLeft: 2,
        }}>Consegna & Ritiro</div>

        <div style={{
          background: "#fff",
          border: `1.5px solid ${C.border}`,
          borderRadius: 20,
          padding: "18px 20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          marginBottom: 10,
        }}>
          {[
            { icon: "📍", label: "Zone", value: delivery.zones },
            { icon: "📅", label: "Giorni", value: delivery.days },
            { icon: "🚚", label: "Spedizione", value: `€${delivery.cost} · gratuita sopra €${delivery.freeAbove}` },
            { icon: "ℹ️", label: "Note", value: delivery.notes },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{
              display: "flex",
              gap: 12,
              paddingBottom: 12,
              marginBottom: 12,
              borderBottom: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, color: C.text, lineHeight: 1.4 }}>{value}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, paddingTop: 0 }}>
            <span style={{ fontSize: 16 }}>💳</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 2 }}>Pagamento</div>
              <div style={{ fontSize: 14, color: C.text }}>Contanti alla consegna · Bonifico · PayPal</div>
            </div>
          </div>
        </div>

        <a
          href={`https://wa.me/${info.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px",
            background: C.waLight,
            border: `1.5px solid ${C.wa}`,
            borderRadius: 14,
            color: C.green,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill={C.wa}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Scrivi direttamente su WhatsApp
        </a>
      </div>
    </div>
  );
}
