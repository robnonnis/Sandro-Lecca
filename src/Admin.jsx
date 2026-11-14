import { useState, useEffect } from "react";
import { loadData, saveData, DEFAULT_DATA } from "./data.js";

const ADMIN_PASSWORD = "sandro2024"; // cambia con password sicura

function Field({ label, value, onChange, type = "text", textarea = false }) {
  const style = {
    width: "100%",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#fff",
    fontSize: 14,
    fontFamily: "inherit",
    marginTop: 6,
    outline: "none",
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
        {label}
      </label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={{ ...style, resize: "vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={style} />
      }
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "20px",
      marginBottom: 16,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD580", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Login({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #120600 0%, #2a1000 50%, #120500 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 340, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍅</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#FFD580", marginBottom: 4 }}>
          Sandro Lecca
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>Pannello Amministratore</div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              width: "100%",
              background: error ? "rgba(255,80,80,0.1)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${error ? "rgba(255,80,80,0.5)" : "rgba(255,255,255,0.15)"}`,
              borderRadius: 12,
              padding: "13px 16px",
              color: "#fff",
              fontSize: 16,
              fontFamily: "inherit",
              outline: "none",
              textAlign: "center",
              letterSpacing: "4px",
              transition: "all 0.2s",
              marginBottom: 12,
            }}
          />
          <button type="submit" style={{
            width: "100%",
            background: "linear-gradient(135deg, #FF6B35, #c94420)",
            border: "none",
            borderRadius: 12,
            padding: 13,
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
          }}>
            Accedi
          </button>
          {error && <div style={{ color: "#FF9999", fontSize: 13, marginTop: 10 }}>Password errata</div>}
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [logged, setLogged] = useState(false);
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (logged) setData(loadData());
  }, [logged]);

  function update(path, value) {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function updateProduct(id, field, value) {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, [field]: field === "price" ? parseFloat(value) || 0 : value } : p),
    }));
  }

  function handleSave() {
    saveData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    if (confirm("Ripristinare i dati di default?")) {
      setData(DEFAULT_DATA);
      saveData(DEFAULT_DATA);
    }
  }

  if (!logged) return <Login onLogin={() => setLogged(true)} />;
  if (!data) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #120600 0%, #2a1000 50%, #120500 100%)",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      padding: "24px 16px 60px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        input:focus, textarea:focus { border-color: rgba(255,107,53,0.5) !important; }
      `}</style>

      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#FFD580" }}>Pannello Admin</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Sandro Lecca</div>
          </div>
          <a href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>← Vedi negozio</a>
        </div>

        {/* BANNER */}
        <Section title="🌿 Banner stagionalità">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Banner attivo</label>
            <div
              onClick={() => update("info.bannerActive", !data.info.bannerActive)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: data.info.bannerActive ? "#FF6B35" : "rgba(255,255,255,0.15)",
                cursor: "pointer", position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                position: "absolute", top: 3,
                left: data.info.bannerActive ? 23 : 3,
                width: 18, height: 18, borderRadius: "50%",
                background: "#fff", transition: "left 0.2s",
              }} />
            </div>
          </div>
          <Field label="Testo banner" value={data.info.banner} onChange={v => update("info.banner", v)} />
        </Section>

        {/* PRODOTTI */}
        <Section title="🍅 Prodotti">
          {data.products.map(p => (
            <div key={p.id} style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              paddingBottom: 16,
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FFD580", marginBottom: 10 }}>
                {p.emoji} {p.name}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field
                  label="Prezzo (€)"
                  type="number"
                  value={p.price}
                  onChange={v => updateProduct(p.id, "price", v)}
                />
                <Field
                  label="Unità"
                  value={p.unit}
                  onChange={v => updateProduct(p.id, "unit", v)}
                />
              </div>
              <Field
                label="Descrizione"
                value={p.description}
                onChange={v => updateProduct(p.id, "description", v)}
                textarea
              />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Disponibile</label>
                <div
                  onClick={() => updateProduct(p.id, "available", !p.available)}
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    background: p.available ? "#25D366" : "rgba(255,255,255,0.15)",
                    cursor: "pointer", position: "relative", transition: "background 0.2s",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 3,
                    left: p.available ? 23 : 3,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#fff", transition: "left 0.2s",
                  }} />
                </div>
              </div>
            </div>
          ))}
        </Section>

        {/* CONSEGNA */}
        <Section title="🚚 Consegna">
          <Field label="Zone servite" value={data.delivery.zones} onChange={v => update("delivery.zones", v)} textarea />
          <Field label="Giorni di consegna" value={data.delivery.days} onChange={v => update("delivery.days", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Costo (€)" type="number" value={data.delivery.cost} onChange={v => update("delivery.cost", parseFloat(v) || 0)} />
            <Field label="Gratuita sopra (€)" type="number" value={data.delivery.freeAbove} onChange={v => update("delivery.freeAbove", parseFloat(v) || 0)} />
          </div>
          <Field label="Note" value={data.delivery.notes} onChange={v => update("delivery.notes", v)} textarea />
        </Section>

        {/* INFO */}
        <Section title="📞 Contatti">
          <Field label="WhatsApp" value={data.info.whatsapp} onChange={v => update("info.whatsapp", v)} />
          <Field label="Località" value={data.info.location} onChange={v => update("info.location", v)} />
        </Section>

        {/* SALVA */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            background: saved ? "linear-gradient(135deg, #25D366, #1da855)" : "linear-gradient(135deg, #FF6B35, #c94420)",
            border: "none",
            borderRadius: 14,
            padding: "15px",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 10,
            transition: "background 0.3s",
          }}
        >
          {saved ? "✓ Salvato!" : "Salva modifiche"}
        </button>
        <button
          onClick={handleReset}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: "12px",
            color: "rgba(255,255,255,0.3)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Ripristina dati default
        </button>
      </div>
    </div>
  );
}
