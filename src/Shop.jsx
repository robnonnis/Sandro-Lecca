import { useState, useEffect } from "react";
import { loadData } from "./data.js";

function ProductCard({ product, onOrder }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,180,80,0.2)",
      borderRadius: 20,
      overflow: "hidden",
    }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(180,60,20,0.1))",
        padding: "24px 20px 16px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{product.emoji}</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20,
          fontWeight: 600,
          color: "#FFD580",
          marginBottom: 4,
        }}>{product.name}</div>
        <div style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.5,
          maxWidth: 220,
          margin: "0 auto",
        }}>{product.description}</div>
      </div>
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}>
          <div>
            <span style={{ fontSize: 26, fontWeight: 800, color: "#FF6B35" }}>
              €{product.price.toFixed(2)}
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>
              / {product.unit}
            </span>
          </div>
          <span style={{
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 20,
            background: product.available ? "rgba(100,210,100,0.15)" : "rgba(200,80,80,0.15)",
            color: product.available ? "#7FD47F" : "#FF9999",
            border: `1px solid ${product.available ? "rgba(100,210,100,0.3)" : "rgba(200,80,80,0.3)"}`,
            fontWeight: 600,
          }}>
            {product.available ? "Disponibile" : "Esaurito"}
          </span>
        </div>
        {product.available && (
          <button
            onClick={() => onOrder(product)}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #25D366, #1da855)",
              border: "none",
              borderRadius: 12,
              padding: "13px",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              letterSpacing: "0.3px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Ordina su WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}

export default function Shop() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
    // Ricarica se i dati cambiano (admin aperto in altra tab)
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
      `🛒 ${product.emoji} ${product.name}\n` +
      `💰 €${product.price.toFixed(2)} / ${product.unit}\n\n` +
      `Potresti confermarmi disponibilità e dettagli consegna? Grazie!`
    );
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #120600 0%, #2a1000 50%, #120500 100%)",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* BANNER STAGIONALITÀ */}
      {info.bannerActive && info.banner && (
        <div style={{
          background: "linear-gradient(90deg, rgba(255,107,53,0.9), rgba(220,70,20,0.9))",
          padding: "10px 20px",
          textAlign: "center",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.3px",
        }}>
          {info.banner}
        </div>
      )}

      {/* HEADER */}
      <div style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "36px 20px 24px",
        textAlign: "center",
        animation: "fadeUp 0.5s ease",
      }}>
        <div style={{
          width: 72, height: 72,
          borderRadius: 20,
          background: "linear-gradient(135deg, #FF6B35, #c94420)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36,
          margin: "0 auto 16px",
          boxShadow: "0 8px 32px rgba(255,107,53,0.35)",
        }}>🍅</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          fontWeight: 700,
          color: "#FFD580",
          marginBottom: 6,
        }}>{info.name}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          📍 {info.location} · Pomodori dal campo
        </div>
      </div>

      {/* PRODOTTI */}
      <div style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "0 16px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        animation: "fadeUp 0.5s ease 0.1s both",
      }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} onOrder={handleOrder} />
        ))}
      </div>

      {/* CONSEGNA */}
      <div style={{
        maxWidth: 480,
        margin: "24px auto 0",
        padding: "0 16px 40px",
        animation: "fadeUp 0.5s ease 0.2s both",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "18px 20px",
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: 12,
          }}>Info Consegna</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: "📍", label: "Zone", value: delivery.zones },
              { icon: "📅", label: "Giorni", value: delivery.days },
              { icon: "🚚", label: "Costo", value: `€${delivery.cost} (gratis sopra €${delivery.freeAbove})` },
              { icon: "ℹ️", label: "Note", value: delivery.notes },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{label}: </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTATTO DIRETTO */}
        <a
          href={`https://wa.me/${info.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 12,
            padding: "13px",
            background: "rgba(37,211,102,0.1)",
            border: "1px solid rgba(37,211,102,0.3)",
            borderRadius: 12,
            color: "#25D366",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Scrivi direttamente su WhatsApp
        </a>
      </div>
    </div>
  );
}
