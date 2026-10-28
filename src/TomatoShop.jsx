import { useState, useRef, useEffect } from "react";

// ============================================================
// CONFIGURAZIONE PRODUTTORE — modifica questi dati
// ============================================================
const PRODUCER_CONFIG = {
  name: "Sandro Lecca",
  location: "Uta, Cagliari",
  phone: "+39 347 123 4567",
  whatsapp: "https://wa.me/39347123456",
  zone: "Campidano, Sardegna",
  products: [
    {
      id: "cdb",
      name: "Pomodoro Cuore di Bue",
      emoji: "🍅",
      description: "Varietà antica, polpa densa, quasi senza semi. Ideale crudo, in insalata o farcito.",
      price: 8.0,
      unit: "cassa da 10 kg",
      minOrder: 1,
      available: true,
      stock: "Disponibile",
      harvest: "Luglio – Settembre",
    },
    {
      id: "dat",
      name: "Pomodorino Datterino",
      emoji: "🍒",
      description: "Piccolo, zuccherino, a forma di dattero. Perfetto per sughi, arrosti o da mangiare così.",
      price: 10.0,
      unit: "confezione da 3 kg",
      minOrder: 1,
      available: true,
      stock: "Disponibile",
      harvest: "Giugno – Ottobre",
    },
  ],
  delivery: {
    zones: ["Uta", "Cagliari", "Assemini", "Capoterra", "Decimomannu", "Villasor", "Serramanna"],
    cost: 3.0,
    freeAbove: 30,
    days: ["Martedì", "Venerdì"],
    notes: "Consegna a domicilio nei giorni indicati. Ritiro diretto in azienda disponibile tutti i giorni (solo su appuntamento).",
  },
  payment: ["Contanti alla consegna", "Bonifico bancario", "PayPal"],
};

// ============================================================
// SYSTEM PROMPT per l'AI
// ============================================================
function buildSystemPrompt() {
  const p = PRODUCER_CONFIG;
  const prodList = p.products
    .map(
      (pr) =>
        `- ${pr.name} (${pr.emoji}): ${pr.description} | Prezzo: €${pr.price}/${pr.unit} | Ordine minimo: ${pr.minOrder} ${pr.unit} | Disponibilità: ${pr.stock}`
    )
    .join("\n");

  return `Sei l'assistente virtuale dell'${p.name}, azienda agricola a ${p.location} che coltiva pomodori di qualità nel ${p.zone}.

Il tuo compito è aiutare i clienti privati a:
1. Scoprire i prodotti disponibili
2. Conoscere prezzi e disponibilità
3. Capire come funziona la consegna
4. Comporre e confermare un ordine

## I NOSTRI PRODOTTI:
${prodList}

## CONSEGNA:
- Zone servite: ${p.delivery.zones.join(", ")}
- Costo spedizione: €${p.delivery.cost} (GRATUITA sopra €${p.delivery.freeAbove})
- Giorni di consegna: ${p.delivery.days.join(" e ")}
- ${p.delivery.notes}
- Ritiro diretto in azienda: sempre disponibile su appuntamento

## PAGAMENTO:
${p.payment.join(", ")}

## CONTATTI:
Telefono/WhatsApp: ${p.phone}

## ISTRUZIONI COMPORTAMENTO:
- Rispondi SEMPRE in italiano, tono cordiale e diretto come un contadino sardo gentile
- Quando un cliente vuole ordinare, raccoglie: prodotto, quantità, nome, indirizzo di consegna, numero di telefono
- Quando hai tutti i dati ordine, mostra un riepilogo STRUTTURATO con i tag speciali:
  [ORDINE_PRONTO]
  - Prodotto: ...
  - Quantità: ...
  - Totale: €...
  - Consegna: ...
  - Cliente: ...
  - Telefono: ...
  [/ORDINE_PRONTO]
- Non inventare prodotti o prezzi non elencati
- Se chiedono qualcosa che non sai, invita a chiamare direttamente al ${p.phone}
- Sii conciso: massimo 3-4 frasi per risposta, a meno che non stai mostrando un riepilogo ordine`;
}

// ============================================================
// COMPONENTI UI
// ============================================================

function ProductCard({ product }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,200,100,0.2)",
        borderRadius: 14,
        padding: "14px 16px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: 32, lineHeight: 1 }}>{product.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#FFD580", marginBottom: 3 }}>
          {product.name}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.4, marginBottom: 6 }}>
          {product.description}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#FF6B35" }}>
            €{product.price}/{product.unit}
          </span>
          <span
            style={{
              fontSize: 11,
              background: product.available ? "rgba(100,200,100,0.2)" : "rgba(200,100,100,0.2)",
              color: product.available ? "#7FD47F" : "#FF9999",
              borderRadius: 6,
              padding: "2px 8px",
            }}
          >
            {product.stock}
          </span>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ text }) {
  const lines = text
    .replace("[ORDINE_PRONTO]", "")
    .replace("[/ORDINE_PRONTO]", "")
    .trim()
    .split("\n")
    .filter((l) => l.trim());

  const wa = PRODUCER_CONFIG.whatsapp;
  const msg = encodeURIComponent("Ciao! Ho appena fatto un ordine tramite l'app. " + lines.join(" | "));

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(100,200,80,0.15), rgba(50,150,50,0.1))",
        border: "1.5px solid rgba(100,220,100,0.4)",
        borderRadius: 16,
        padding: "16px 18px",
        marginTop: 6,
      }}
    >
      <div style={{ fontFamily: "'Playfair Display', serif", color: "#7FD47F", fontSize: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        ✅ Ordine Riepilogato
      </div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 4, paddingLeft: 8, borderLeft: "2px solid rgba(100,220,100,0.3)" }}>
          {l.replace(/^-\s*/, "")}
        </div>
      ))}
      <a
        href={`${wa}?text=${msg}`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 14,
          background: "#25D366",
          color: "#fff",
          borderRadius: 10,
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
          letterSpacing: "0.3px",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Conferma su WhatsApp
      </a>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  const hasOrder = msg.content?.includes("[ORDINE_PRONTO]");

  let displayText = msg.content || "";
  let orderText = "";

  if (hasOrder) {
    const match = displayText.match(/\[ORDINE_PRONTO\]([\s\S]*?)\[\/ORDINE_PRONTO\]/);
    if (match) {
      orderText = match[1];
      displayText = displayText.replace(/\[ORDINE_PRONTO\][\s\S]*?\[\/ORDINE_PRONTO\]/, "").trim();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 12,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B35, #e8503a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
            marginRight: 8,
            marginTop: 2,
          }}
        >
          🍅
        </div>
      )}
      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 4 }}>
        {displayText && (
          <div
            style={{
              background: isUser
                ? "linear-gradient(135deg, #FF6B35, #e8503a)"
                : "rgba(255,255,255,0.1)",
              color: "#fff",
              borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "10px 14px",
              fontSize: 14,
              lineHeight: 1.5,
              backdropFilter: "blur(4px)",
              border: isUser ? "none" : "1px solid rgba(255,255,255,0.1)",
              whiteSpace: "pre-wrap",
            }}
          >
            {displayText}
          </div>
        )}
        {hasOrder && <OrderSummary text={orderText} />}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div
        style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF6B35, #e8503a)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}
      >🍅</div>
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "18px 18px 18px 4px",
          padding: "12px 16px",
          display: "flex", gap: 5, alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "rgba(255,200,100,0.7)",
              animation: "bounce 1.2s infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// QUICK REPLIES
// ============================================================
const QUICK_REPLIES = [
  { label: "📋 Vedi prodotti e prezzi", text: "Cosa vendete e a che prezzo?" },
  { label: "🚚 Info consegna", text: "Come funziona la consegna?" },
  { label: "📦 Voglio ordinare", text: "Vorrei fare un ordine" },
  { label: "🗓 Quando raccogliete?", text: "Quando raccogliete i pomodori?" },
];

// ============================================================
// APP PRINCIPALE
// ============================================================
export default function TomatoShop() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Ciao! 👋 Sono l'assistente dell'${PRODUCER_CONFIG.name}.\n\nTi aiuto a scoprire i nostri pomodori coltivati nel ${PRODUCER_CONFIG.zone}, conoscere prezzi e disponibilità, e fare il tuo ordine direttamente da qui.\n\nCome posso aiutarti?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Mi dispiace, non ho capito. Puoi ripetere?";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Ops, c'è stato un problema di connessione. Riprova o chiamaci al " + PRODUCER_CONFIG.phone },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #1a0a00 0%, #2d1200 40%, #1a0800 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Inter', sans-serif",
        color: "#fff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.3); border-radius: 2px; }
        textarea:focus { outline: none; }
        textarea { resize: none; }
      `}</style>

      {/* HEADER */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,80,30,0.08))",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,107,53,0.2)",
          padding: "16px 20px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #FF6B35, #c94420)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
            }}
          >
            🍅
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#FFD580", fontWeight: 600 }}>
              {PRODUCER_CONFIG.name}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>
              📍 {PRODUCER_CONFIG.location} · Pomodori dal campo
            </div>
          </div>
          <button
            onClick={() => setShowProducts(!showProducts)}
            style={{
              marginLeft: "auto", background: "rgba(255,107,53,0.2)",
              border: "1px solid rgba(255,107,53,0.3)", color: "#FF9966",
              borderRadius: 8, padding: "6px 12px", fontSize: 12,
              cursor: "pointer", fontWeight: 600,
            }}
          >
            {showProducts ? "✕ Chiudi" : "🛒 Prodotti"}
          </button>
        </div>

        {/* PRODUCT PANEL */}
        {showProducts && (
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10, animation: "fadeIn 0.2s ease" }}>
            {PRODUCER_CONFIG.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,200,100,0.1)",
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.5,
              }}
            >
              🚚 <strong style={{ color: "rgba(255,255,255,0.75)" }}>Consegna:</strong>{" "}
              {PRODUCER_CONFIG.delivery.days.join(" e ")} · €{PRODUCER_CONFIG.delivery.cost} (gratis sopra €{PRODUCER_CONFIG.delivery.freeAbove})<br />
              Zone: {PRODUCER_CONFIG.delivery.zones.slice(0, 4).join(", ")}…
            </div>
          </div>
        )}
      </div>

      {/* CHAT AREA */}
      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 480,
          padding: "20px 16px 8px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ animation: "fadeIn 0.3s ease" }}>
            <Message msg={msg} />
          </div>
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK REPLIES */}
      {messages.length <= 2 && !loading && (
        <div
          style={{
            width: "100%", maxWidth: 480,
            padding: "0 16px 8px",
            display: "flex", gap: 8, flexWrap: "wrap",
          }}
        >
          {QUICK_REPLIES.map((qr) => (
            <button
              key={qr.text}
              onClick={() => sendMessage(qr.text)}
              style={{
                background: "rgba(255,107,53,0.12)",
                border: "1px solid rgba(255,107,53,0.25)",
                borderRadius: 20,
                color: "#FFB088",
                padding: "7px 14px",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              {qr.label}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div
        style={{
          width: "100%", maxWidth: 480,
          padding: "8px 16px 20px",
          background: "linear-gradient(to top, rgba(26,8,0,0.95), transparent)",
        }}
      >
        <div
          style={{
            display: "flex", gap: 10, alignItems: "flex-end",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,107,53,0.25)",
            borderRadius: 20,
            padding: "8px 8px 8px 16px",
            backdropFilter: "blur(8px)",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Scrivi un messaggio…"
            rows={1}
            style={{
              flex: 1, background: "transparent",
              border: "none", color: "#fff",
              fontSize: 14, lineHeight: 1.5,
              fontFamily: "inherit", maxHeight: 100,
              overflowY: "auto",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #FF6B35, #e84020)"
                : "rgba(255,255,255,0.1)",
              border: "none", cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease", flexShrink: 0,
              boxShadow: input.trim() ? "0 4px 16px rgba(255,107,53,0.4)" : "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
          Assistente AI · {PRODUCER_CONFIG.name}
        </div>
      </div>
    </div>
  );
}
