import { useState, useEffect } from "react";
import { loadData } from "./data.js";

// Foto Unsplash via CDN (libere da copyright)
const PRODUCT_PHOTOS = {
  cdb: "https://images.unsplash.com/photo-1587394987765-5b4b5c0ad83e?w=600&q=80&fit=crop",
  dat: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&q=80&fit=crop",
  cri: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80&fit=crop",
};

const PICKUP_POINTS = [
  "Assemini — Piazza Santa Lucia",
  "Uta — Piazza Sollivario",
];

const C = {
  bg: "#F5F0EB",
  card: "#FFFFFF",
  border: "#E5DBD0",
  text: "#1C1208",
  textMid: "#6B5740",
  textLight: "#A89070",
  red: "#C0311F",
  redLight: "#FDF0EE",
  green: "#2A6B38",
  greenLight: "#EBF5EE",
  wa: "#25D366",
  waLight: "#E8FAF0",
};

// ── Carrello globale (semplice state lifting) ──────────────────
function useCart() {
  const [items, setItems] = useState([]);
  function addItem(product, kg) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, kg: i.kg + kg } : i);
      return [...prev, { ...product, kg }];
    });
  }
  function removeItem(id) { setItems(prev => prev.filter(i => i.id !== id)); }
  function clear() { setItems([]); }
  const total = items.reduce((sum, i) => sum + i.price * i.kg, 0);
  return { items, addItem, removeItem, clear, total };
}

// ── Card prodotto ──────────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  const [open, setOpen] = useState(false);
  const [kg, setKg] = useState(1);

  return (
    <div style={{
      background: C.card,
      border: `1.5px solid ${C.border}`,
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      {/* Foto */}
      <div style={{
        height: 180,
        background: `url(${PRODUCT_PHOTOS[product.id]}) center/cover no-repeat`,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", bottom: 12, left: 16, right: 16,
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, fontWeight: 700, color: "#fff",
            textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }}>{product.name}</div>
          <span style={{
            fontSize: 11, fontWeight: 700,
            padding: "3px 10px", borderRadius: 20,
            background: product.available ? "rgba(37,211,102,0.85)" : "rgba(200,80,80,0.85)",
            color: "#fff",
          }}>
            {product.available ? "Disponibile" : "Esaurito"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5, marginBottom: 12 }}>
          {product.description}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: C.red }}>€{product.price.toFixed(2)}</span>
            <span style={{ fontSize: 13, color: C.textLight }}>/ {product.unit}</span>
          </div>
          {product.available && (
            <button
              onClick={() => setOpen(!open)}
              style={{
                background: open ? C.red : C.redLight,
                border: `1.5px solid ${C.red}`,
                borderRadius: 10, padding: "8px 16px",
                color: open ? "#fff" : C.red,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {open ? "✕ Chiudi" : "+ Aggiungi"}
            </button>
          )}
        </div>

        {/* Selettore quantità */}
        {open && (
          <div style={{
            marginTop: 14,
            padding: 14,
            background: C.bg,
            borderRadius: 12,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 12, color: C.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
              Quanti kg vuoi?
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <button
                onClick={() => setKg(Math.max(1, kg - 1))}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#fff", border: `1.5px solid ${C.border}`,
                  fontSize: 18, cursor: "pointer", color: C.text,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >−</button>
              <span style={{ fontSize: 20, fontWeight: 800, color: C.text, minWidth: 32, textAlign: "center" }}>{kg}</span>
              <button
                onClick={() => setKg(kg + 1)}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: C.red, border: "none",
                  fontSize: 18, cursor: "pointer", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >+</button>
              <span style={{ fontSize: 13, color: C.textMid }}>
                = <strong style={{ color: C.red }}>€{(product.price * kg).toFixed(2)}</strong>
              </span>
            </div>
            <button
              onClick={() => { onAdd(product, kg); setOpen(false); setKg(1); }}
              style={{
                width: "100%", background: C.red, border: "none",
                borderRadius: 10, padding: "11px",
                color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}
            >
              Aggiungi al carrello 🛒
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Carrello / Form ordine ─────────────────────────────────────
function Cart({ items, total, onRemove, onSend, onClose, whatsapp }) {
  const [name, setName] = useState("");
  const [delivery, setDelivery] = useState("ritiro_azienda");
  const [pickup, setPickup] = useState(PICKUP_POINTS[0]);

  function buildMessage() {
    const rows = items.map(i => `• ${i.name}: ${i.kg} kg — €${(i.price * i.kg).toFixed(2)}`).join("\n");
    let dove = "";
    if (delivery === "ritiro_azienda") dove = "Ritiro in azienda (giorno/ora da concordare)";
    else if (delivery === "punto_ritiro") dove = `Punto di ritiro: ${pickup}`;
    else dove = "Consegna a domicilio (da concordare)";

    return encodeURIComponent(
      `Ciao Sandro! Vorrei fare un ordine 🍅\n\n` +
      `*ORDINE:*\n${rows}\n\n` +
      `*Totale:* €${total.toFixed(2)}\n\n` +
      `*Nome:* ${name}\n` +
      `*Consegna:* ${dove}\n\n` +
      `Fammi sapere quando possiamo organizzarci. Grazie!`
    );
  }

  const wa = whatsapp.replace(/\D/g, "");
  const canSend = name.trim().length > 0;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: "100%", maxWidth: 520,
        background: "#fff",
        borderRadius: "24px 24px 0 0",
        padding: "24px 20px 36px",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: C.text }}>
            🛒 Il tuo ordine
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.textLight }}>✕</button>
        </div>

        {/* Riepilogo prodotti */}
        {items.map(i => (
          <div key={i.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 0", borderBottom: `1px solid ${C.border}`,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{i.name}</div>
              <div style={{ fontSize: 12, color: C.textLight }}>{i.kg} kg × €{i.price.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.red }}>€{(i.price * i.kg).toFixed(2)}</span>
              <button onClick={() => onRemove(i.id)} style={{ background: "none", border: "none", color: C.textLight, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          </div>
        ))}

        <div style={{
          display: "flex", justifyContent: "space-between",
          padding: "14px 0", marginBottom: 20,
          borderBottom: `2px solid ${C.border}`,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Totale</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: C.red }}>€{total.toFixed(2)}</span>
        </div>

        {/* Form */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 6 }}>
            Il tuo nome
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Come ti chiami?"
            style={{
              width: "100%", padding: "11px 14px",
              border: `1.5px solid ${C.border}`, borderRadius: 10,
              fontSize: 14, color: C.text, background: "#fff",
              fontFamily: "inherit", outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 10 }}>
            Come preferisci ricevere l'ordine?
          </label>

          {[
            { value: "ritiro_azienda", icon: "🏡", label: "Ritiro in azienda", sub: "Giorno e ora da concordare con Sandro" },
            { value: "punto_ritiro", icon: "📍", label: "Punto di ritiro", sub: "Scegli il punto più vicino a te" },
            { value: "domicilio", icon: "🚚", label: "Consegna a domicilio", sub: "Giorno e indirizzo da concordare con Sandro" },
          ].map(opt => (
            <div
              key={opt.value}
              onClick={() => setDelivery(opt.value)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", marginBottom: 8,
                border: `1.5px solid ${delivery === opt.value ? C.red : C.border}`,
                borderRadius: 12, cursor: "pointer",
                background: delivery === opt.value ? C.redLight : "#fff",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 20 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: C.textMid }}>{opt.sub}</div>
              </div>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `2px solid ${delivery === opt.value ? C.red : C.border}`,
                background: delivery === opt.value ? C.red : "#fff",
                flexShrink: 0,
              }} />
            </div>
          ))}

          {/* Selezione punto di ritiro */}
          {delivery === "punto_ritiro" && (
            <div style={{ marginTop: 4, padding: "12px 14px", background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
                Scegli il punto
              </div>
              {PICKUP_POINTS.map(p => (
                <div
                  key={p}
                  onClick={() => setPickup(p)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", marginBottom: 6,
                    border: `1.5px solid ${pickup === p ? C.red : C.border}`,
                    borderRadius: 10, cursor: "pointer",
                    background: pickup === p ? C.redLight : "#fff",
                  }}
                >
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    border: `2px solid ${pickup === p ? C.red : C.border}`,
                    background: pickup === p ? C.red : "#fff",
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, color: C.text, fontWeight: pickup === p ? 600 : 400 }}>{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <a
          href={canSend ? `https://wa.me/${wa}?text=${buildMessage()}` : undefined}
          target="_blank" rel="noreferrer"
          onClick={e => !canSend && e.preventDefault()}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "15px",
            background: canSend ? C.wa : "#ccc",
            border: "none", borderRadius: 14,
            color: "#fff", fontSize: 15, fontWeight: 700,
            textDecoration: "none",
            cursor: canSend ? "pointer" : "not-allowed",
            boxShadow: canSend ? "0 4px 16px rgba(37,211,102,0.3)" : "none",
            transition: "all 0.2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {canSend ? "Invia ordine su WhatsApp" : "Inserisci il tuo nome per continuare"}
        </a>
      </div>
    </div>
  );
}

// ── App principale ─────────────────────────────────────────────
export default function Shop() {
  const [data, setData] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const { items, addItem, removeItem, clear, total } = useCart();

  useEffect(() => {
    setData(loadData());
    const handler = () => setData(loadData());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!data) return null;
  const { info, products, delivery } = data;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
        input:focus { border-color: ${C.red} !important; outline: none; }
      `}</style>

      {/* BANNER */}
      {info.bannerActive && info.banner && (
        <div style={{ background: C.red, color: "#fff", padding: "10px 20px", textAlign: "center", fontSize: 13, fontWeight: 600 }}>
          {info.banner}
        </div>
      )}

      {/* HEADER */}
      <div style={{
        background: "#fff",
        borderBottom: `1px solid ${C.border}`,
        padding: "32px 20px 28px",
        textAlign: "center",
        animation: "fadeUp 0.4s ease",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: C.redLight, border: `2px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 16px",
        }}>🍅</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 6 }}>
          {info.name}
        </div>
        <div style={{ fontSize: 13, color: C.textLight, marginBottom: 16 }}>
          📍 {info.location}
        </div>
        {/* BIO */}
        <div style={{
          maxWidth: 420, margin: "0 auto",
          padding: "14px 18px",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          fontSize: 13,
          color: C.textMid,
          lineHeight: 1.65,
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: 15,
        }}>
          Un'azienda agricola di famiglia da decenni, nel cuore del Campidano. Coltiviamo pomodori con cura e passione, con un occhio attento alla qualità e all'innovazione. Dal campo direttamente a tavola tua.
        </div>
      </div>

      {/* PRODOTTI */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 16px 16px", animation: "fadeUp 0.4s ease 0.1s both" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 12, paddingLeft: 2 }}>
          I nostri prodotti
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addItem} />
          ))}
        </div>
      </div>

      {/* CONSEGNA */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "8px 16px 100px", animation: "fadeUp 0.4s ease 0.2s both" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 10, paddingLeft: 2 }}>
          Consegna & Ritiro
        </div>
        <div style={{
          background: "#fff", border: `1.5px solid ${C.border}`,
          borderRadius: 20, padding: "18px 20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          {[
            { icon: "🏡", label: "Ritiro in azienda", value: "Giorno e ora da concordare con Sandro" },
            { icon: "📍", label: "Punti di ritiro", value: "Assemini (P.za Santa Lucia) · Uta (P.za Sollivario)" },
            { icon: "🚚", label: "Consegna a domicilio", value: "Da concordare direttamente con Sandro" },
            { icon: "📅", label: "Zone servite", value: delivery.zones },
          ].map(({ icon, label, value }, i, arr) => (
            <div key={label} style={{
              display: "flex", gap: 12, paddingBottom: i < arr.length - 1 ? 12 : 0,
              marginBottom: i < arr.length - 1 ? 12 : 0,
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CARRELLO FISSO IN BASSO */}
      {items.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
          padding: "12px 16px 24px",
          background: "linear-gradient(to top, #fff 70%, transparent)",
          display: "flex", justifyContent: "center",
        }}>
          <button
            onClick={() => setShowCart(true)}
            style={{
              width: "100%", maxWidth: 520,
              background: C.red, border: "none",
              borderRadius: 16, padding: "15px 20px",
              color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: "0 4px 20px rgba(192,49,31,0.35)",
            }}
          >
            <span style={{
              background: "rgba(255,255,255,0.25)",
              borderRadius: "50%", width: 26, height: 26,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800,
            }}>{items.length}</span>
            <span>Vedi carrello e ordina</span>
            <span>€{total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* MODALE CARRELLO */}
      {showCart && (
        <Cart
          items={items}
          total={total}
          onRemove={removeItem}
          onClose={() => setShowCart(false)}
          whatsapp={info.whatsapp}
        />
      )}
    </div>
  );
}
