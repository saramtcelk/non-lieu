import { useState, useRef, useEffect } from "react";

// ─── THÈMES ───────────────────────────────────────────────────────────────────
const FREE_THEMES = [
  { id: "manoir", label: "Meurtre dans un manoir", icon: "🏚️", prompt: "meurtre dans un manoir victorien isolé" },
  { id: "musee", label: "Vol au musée", icon: "🖼️", prompt: "vol mystérieux dans un grand musée parisien" },
  { id: "village", label: "Disparition en village", icon: "🏘️", prompt: "disparition inexpliquée dans un petit village de province français" },
  { id: "yacht", label: "Crime sur un yacht", icon: "⛵", prompt: "meurtre sur un yacht de luxe en Méditerranée" },
  { id: "diner", label: "Empoisonnement mondain", icon: "🍷", prompt: "empoisonnement lors d'un dîner mondain dans un hôtel particulier parisien" },
];

const PREMIUM_THEMES = [
  { id: "enfant", label: "Enfant disparu", icon: "👦", prompt: "disparition inexpliquée d'un enfant dans un hameau isolé de montagne, toute la communauté est suspecte" },
  { id: "famille", label: "Famille volatilisée", icon: "👨‍👩‍👧", prompt: "une famille entière disparaît du jour au lendemain sans laisser de trace, les voisins cachent quelque chose" },
  { id: "notable", label: "Le notable intouchable", icon: "🎩", prompt: "un homme influent et respecté est soupçonné d'un meurtre mais personne n'ose l'accuser" },
  { id: "jeune", label: "Jeune femme retrouvée", icon: "🌹", prompt: "une jeune femme retrouvée morte dans des circonstances mystérieuses, son passé cache des secrets" },
  { id: "innocent", label: "L'innocent accusé", icon: "⚖️", prompt: "un homme accusé à tort d'un meurtre en province, la vérité est enfouie dans le passé du village" },
  { id: "casino", label: "Nuit au casino", icon: "🎰", prompt: "meurtre dans un casino de luxe à Monaco, tout le monde avait un mobile" },
  { id: "train", label: "Meurtre dans le train", icon: "🚂", prompt: "meurtre dans un train de nuit Paris-Nice, le coupable est forcément l'un des passagers" },
  { id: "chateau", label: "Château de la Loire", icon: "🏰", prompt: "mort suspecte lors d'une réception dans un château de la Loire, héritage en jeu" },
  { id: "cannes", label: "Scandale à Cannes", icon: "🎬", prompt: "disparition mystérieuse d'une actrice pendant le Festival de Cannes" },
  { id: "couvent", label: "Secret au couvent", icon: "⛪", prompt: "mort inexpliquée dans un couvent isolé, les sœurs gardent un lourd secret" },
  { id: "mine", label: "Mystère à la mine", icon: "⛏️", prompt: "disparition dans une mine abandonnée du nord de la France, vieilles rancunes ouvrières" },
  { id: "versailles", label: "Versailles 1700s", icon: "👑", prompt: "complot et meurtre à la cour de Versailles sous Louis XIV, intrigues de palais" },
  { id: "guerre", label: "Espion en guerre", icon: "🪖", prompt: "agent double assassiné pendant la Seconde Guerre Mondiale dans Paris occupé" },
  { id: "startup", label: "Trahison en startup", icon: "💻", prompt: "mort suspecte du fondateur d'une startup parisienne valorisée à des millions" },
  { id: "provence", label: "Ferme en Provence", icon: "🌻", prompt: "triple meurtre dans une ferme isolée de Provence, les témoins se contredisent tous" },
];

const ALL_THEMES = [...FREE_THEMES, ...PREMIUM_THEMES];

const DIFFICULTY = {
  facile: { label: "Inspecteur", icon: "🔎", questions: 12 },
  moyen: { label: "Commissaire", icon: "🕵️", questions: 8 },
  difficile: { label: "Maître", icon: "💀", questions: 5 },
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0d0b08",
  card: "rgba(15,12,8,0.97)",
  border: "rgba(180,140,80,0.15)",
  gold: "#b48c50",
  goldLight: "#d4aa70",
  text: "#c8b89a",
  textMuted: "#5a4a30",
  textDim: "#8a7a60",
  red: "#c05040",
  green: "#6a9a60",
};

const s = {
  app: {
    minHeight: "100vh", background: C.bg,
    fontFamily: "'Palatino Linotype', Palatino, serif",
    color: C.text, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "20px", position: "relative", overflow: "hidden",
  },
  fog: {
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at 20% 10%, #1a080820 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, #08100a20 0%, transparent 60%)",
  },
  card: (maxW = 600) => ({
    position: "relative", zIndex: 1,
    background: C.card, border: `1px solid ${C.border}`,
    borderTop: `3px solid ${C.gold}`,
    maxWidth: maxW, width: "100%",
    boxShadow: `0 0 80px rgba(180,140,80,0.05), 0 30px 80px rgba(0,0,0,0.8)`,
  }),
  header: {
    padding: "24px 28px 18px",
    borderBottom: `1px solid ${C.border}`,
  },
  body: { padding: "22px 28px" },
  badge: {
    display: "inline-block", fontSize: "0.58rem",
    letterSpacing: "0.35em", textTransform: "uppercase",
    color: C.gold, border: `1px solid rgba(180,140,80,0.3)`,
    padding: "3px 10px", marginBottom: "8px",
  },
  title: {
    fontSize: "1.9rem", fontWeight: "normal",
    color: "#e8d8b8", letterSpacing: "0.05em", lineHeight: 1.2,
  },
  sub: {
    fontSize: "0.7rem", letterSpacing: "0.2em",
    textTransform: "uppercase", color: C.textMuted, marginTop: "4px",
  },
  label: {
    fontSize: "0.58rem", letterSpacing: "0.3em",
    textTransform: "uppercase", color: C.textMuted,
    marginBottom: "10px", display: "block",
  },
  btn: (active, color = C.gold) => ({
    padding: "11px 10px",
    background: active ? `${color}18` : "transparent",
    border: `1px solid ${active ? color : "rgba(180,140,80,0.15)"}`,
    color: active ? color : C.textMuted,
    cursor: "pointer", fontSize: "0.78rem",
    letterSpacing: "0.05em", transition: "all 0.2s",
    fontFamily: "inherit",
  }),
  primaryBtn: {
    width: "100%", padding: "15px",
    background: "rgba(180,140,80,0.1)",
    border: `1px solid rgba(180,140,80,0.4)`,
    color: C.gold, cursor: "pointer",
    fontSize: "0.68rem", letterSpacing: "0.35em",
    textTransform: "uppercase", fontFamily: "inherit",
    transition: "all 0.3s",
  },
  infoBox: {
    background: "rgba(180,140,80,0.04)",
    border: `1px solid rgba(180,140,80,0.1)`,
    padding: "14px 16px", fontSize: "0.8rem",
    lineHeight: 1.7, color: C.textDim,
  },
  premiumTag: {
    fontSize: "0.55rem", letterSpacing: "0.2em",
    background: "rgba(180,140,80,0.15)",
    border: `1px solid rgba(180,140,80,0.3)`,
    color: C.gold, padding: "2px 6px",
    textTransform: "uppercase",
  },
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function Enqueteur() {
  const [screen, setScreen] = useState("home");
  const [isPremium, setIsPremium] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [difficulty, setDifficulty] = useState("moyen");
  const [caseData, setCaseData] = useState(null);
  const [qLeft, setQLeft] = useState(8);
  const [notebook, setNotebook] = useState([]);
  const [accusation, setAccusation] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [notebook]);

  async function startGame() {
    if (!selectedTheme) return;
    if (!isPremium && dailyCount >= 3) { setError("Limite de 3 enquêtes atteinte aujourd'hui. Passez Premium !"); return; }
    setError(null);
    setScreen("loading");

    const theme = ALL_THEMES.find(t => t.id === selectedTheme);
    const maxQ = DIFFICULTY[difficulty].questions;

    const prompt = `Tu es le créateur d'un jeu d'enquête policière français. Génère une affaire complète sur : "${theme.prompt}".

IMPORTANT : Génère aussi les réponses aux ${maxQ} questions les plus probables qu'un joueur poserait.

Réponds UNIQUEMENT en JSON valide, sans markdown ni explication :
{
  "titre": "Titre accrocheur style roman noir",
  "introduction": "Scène d'ouverture immersive en 4 phrases, style polar français",
  "suspects": [
    {"nom": "Prénom Nom", "role": "son rôle", "description": "apparence et personnalité en 1 phrase", "secret": "ce qu'il cache vraiment"},
    {"nom": "Prénom Nom", "role": "son rôle", "description": "apparence et personnalité en 1 phrase", "secret": "ce qu'il cache vraiment"},
    {"nom": "Prénom Nom", "role": "son rôle", "description": "apparence et personnalité en 1 phrase", "secret": "ce qu'il cache vraiment"},
    {"nom": "Prénom Nom", "role": "son rôle", "description": "apparence et personnalité en 1 phrase", "secret": "ce qu'il cache vraiment"}
  ],
  "coupable": "Prénom Nom exact du coupable (doit être dans la liste)",
  "mobile": "Le mobile du crime en 1 phrase",
  "indices": ["indice visible 1", "indice visible 2", "indice visible 3", "indice visible 4"],
  "fausses_pistes": ["fausse piste 1", "fausse piste 2"],
  "qa": [
    {"q": "question probable du joueur", "r": "réponse du narrateur en 2-3 phrases style polar"},
    {"q": "question probable", "r": "réponse"},
    {"q": "question probable", "r": "réponse"},
    {"q": "question probable", "r": "réponse"},
    {"q": "question probable", "r": "réponse"},
    {"q": "question probable", "r": "réponse"},
    {"q": "question probable", "r": "réponse"},
    {"q": "question probable", "r": "réponse"},
    {"q": "question probable", "r": "réponse"},
    {"q": "question probable", "r": "réponse"},
    {"q": "question probable", "r": "réponse"},
    {"q": "question probable", "r": "réponse"}
  ],
  "solution": "Explication complète du crime en 4-5 phrases"
}`;

    try {
      const res = await fetch("https://non-lieu.versel.app/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setCaseData(parsed);
      setQLeft(maxQ);
      setNotebook([{ type: "intro", text: parsed.introduction }]);
      setAccusation("");
      setResult(null);
      setInput("");
      setDailyCount(c => c + 1);
      setHistory(h => [...h, { titre: parsed.titre, theme: theme.label }]);
      setScreen("game");
    } catch (e) {
      setError("Erreur de génération. Réessaie !");
      setScreen("home");
    }
  }

  function askQuestion() {
    if (!input.trim() || qLeft <= 0) return;
    const q = input.trim();
    setInput("");
    setQLeft(n => n - 1);

    // Cherche la meilleure réponse dans le QA pré-généré
    const match = caseData.qa.find(item =>
      item.q.toLowerCase().split(" ").some(word =>
        word.length > 4 && q.toLowerCase().includes(word)
      )
    );

    const answer = match
      ? match.r
      : `Les témoins restent évasifs sur ce point... Essayez d'interroger directement l'un des suspects ou d'examiner les indices disponibles.`;

    setNotebook(n => [...n,
      { type: "question", text: q },
      { type: "answer", text: answer }
    ]);
  }

  function accuse() {
    if (!accusation.trim()) return;
    const found = caseData.suspects.find(s =>
      s.nom.toLowerCase().includes(accusation.toLowerCase()) ||
      accusation.toLowerCase().includes(s.nom.toLowerCase().split(" ")[0].toLowerCase())
    );
    const correct = found && found.nom === caseData.coupable;
    setResult({ correct, accused: accusation });
    setScreen("result");
  }

  // ── LOADING ──
  if (screen === "loading") return (
    <div style={s.app}>
      <div style={s.fog} />
      <div style={s.card()}>
        <div style={s.header}>
          <div style={s.badge}>Dossier confidentiel</div>
          <div style={s.title}>Ouverture de l'enquête</div>
        </div>
        <div style={{ ...s.body, textAlign: "center", padding: "40px 28px" }}>
          <div style={s.label}>Collecte des indices en cours</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "16px" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: "7px", height: "7px", borderRadius: "50%", background: C.gold,
                animation: "p 1.4s ease-in-out infinite", animationDelay: `${i*0.2}s`
              }} />
            ))}
          </div>
          <style>{`@keyframes p{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}`}</style>
        </div>
      </div>
    </div>
  );

  // ── GAME ──
  if (screen === "game" && caseData) return (
    <div style={s.app}>
      <div style={s.fog} />
      <div style={{ ...s.card(700), display: "flex", flexDirection: "column", height: "92vh", maxHeight: "720px" }}>

        {/* Header */}
        <div style={{ ...s.header, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: C.textMuted, textTransform: "uppercase", marginBottom: "2px" }}>Non Lieu</div>
            <div style={{ fontSize: "1rem", color: C.goldLight }}>🔍 {caseData.titre}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: qLeft <= 2 ? C.red : C.textMuted, textTransform: "uppercase" }}>
              {qLeft} question{qLeft > 1 ? "s" : ""} restante{qLeft > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Suspects */}
        <div style={{ padding: "10px 24px", borderBottom: `1px solid rgba(180,140,80,0.07)`, display: "flex", gap: "6px", flexWrap: "wrap", flexShrink: 0 }}>
          <span style={{ ...s.label, marginBottom: 0, alignSelf: "center", marginRight: "4px" }}>Suspects :</span>
          {caseData.suspects.map(sus => (
            <div key={sus.nom} title={`${sus.role} — ${sus.description}`} style={{
              fontSize: "0.65rem", padding: "3px 10px",
              border: `1px solid rgba(180,140,80,0.2)`, color: C.textDim,
              letterSpacing: "0.05em", cursor: "help",
            }}>{sus.nom}</div>
          ))}
        </div>

        {/* Indices */}
        <div style={{ padding: "10px 24px", borderBottom: `1px solid rgba(180,140,80,0.07)`, flexShrink: 0 }}>
          <span style={s.label}>Indices visibles</span>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {caseData.indices.map((ind, i) => (
              <div key={i} style={{
                fontSize: "0.65rem", padding: "3px 10px",
                background: "rgba(180,140,80,0.05)",
                border: `1px solid rgba(180,140,80,0.15)`, color: C.gold,
              }}>📍 {ind}</div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "18px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {notebook.map((entry, i) => (
            <div key={i} style={
              entry.type === "intro" ? { ...s.infoBox, fontStyle: "italic" } :
              entry.type === "question" ? {
                alignSelf: "flex-end", maxWidth: "80%",
                background: "rgba(180,140,80,0.08)", border: `1px solid rgba(180,140,80,0.2)`,
                padding: "10px 14px", fontSize: "0.85rem", color: C.goldLight,
              } : {
                alignSelf: "flex-start", maxWidth: "88%",
                background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.06)`,
                padding: "10px 14px", fontSize: "0.83rem", color: C.textDim, lineHeight: 1.65,
              }
            }>
              {entry.type === "question" && <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textMuted, marginBottom: "4px" }}>DÉTECTIVE</div>}
              {entry.type === "answer" && <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "#3a2a10", marginBottom: "4px" }}>TÉMOIN</div>}
              {entry.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "14px 24px", borderTop: `1px solid rgba(180,140,80,0.1)`, flexShrink: 0 }}>
          {qLeft > 0 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <input
                style={{ flex: 1, padding: "11px 14px", background: "rgba(255,255,255,0.03)", border: `1px solid rgba(180,140,80,0.2)`, color: C.text, fontSize: "0.83rem", outline: "none", fontFamily: "inherit" }}
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && askQuestion()}
                placeholder="Interrogez un suspect, examinez un indice..."
              />
              <button style={{ ...s.btn(false), padding: "11px 18px" }} onClick={askQuestion}>→</button>
            </div>
          )}
          {qLeft === 0 && (
            <div style={{ fontSize: "0.72rem", color: C.red, marginBottom: "10px", letterSpacing: "0.1em" }}>
              ⏱ Plus de questions — il est temps d'accuser !
            </div>
          )}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              style={{ flex: 1, padding: "10px 14px", background: "rgba(180,40,40,0.05)", border: `1px solid rgba(180,40,40,0.2)`, color: "#c88070", fontSize: "0.8rem", outline: "none", fontFamily: "inherit" }}
              value={accusation} onChange={e => setAccusation(e.target.value)}
              onKeyDown={e => e.key === "Enter" && accuse()}
              placeholder="Nom du coupable..."
            />
            <button style={{ ...s.btn(false, C.red), padding: "10px 16px", fontSize: "0.68rem", letterSpacing: "0.1em" }} onClick={accuse}>
              Accuser ⚖️
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── RESULT ──
  if (screen === "result" && caseData) return (
    <div style={s.app}>
      <div style={s.fog} />
      <div style={s.card()}>
        <div style={s.header}>
          <div style={s.badge}>{result.correct ? "Affaire résolue" : "Affaire classée"}</div>
          <div style={{ fontSize: "2.8rem", textAlign: "center", margin: "10px 0 6px" }}>{result.correct ? "🏆" : "💀"}</div>
          <div style={{ ...s.title, textAlign: "center", fontSize: "1.5rem" }}>
            {result.correct ? "Brillant, Détective !" : "Le coupable s'est échappé..."}
          </div>
          <div style={{ textAlign: "center", fontSize: "0.82rem", color: C.textMuted, marginTop: "6px" }}>
            {result.correct
              ? `${caseData.coupable} est bien le coupable.`
              : `Vous avez accusé ${result.accused}. Le coupable était ${caseData.coupable}.`}
          </div>
        </div>
        <div style={s.body}>
          <span style={s.label}>Solution complète</span>
          <div style={{ ...s.infoBox, marginBottom: "8px" }}>
            <strong style={{ color: C.goldLight }}>Mobile :</strong> {caseData.mobile}
          </div>
          <div style={{ ...s.infoBox, marginBottom: "20px" }}>{caseData.solution}</div>
          <button style={s.primaryBtn} onClick={() => setScreen("home")}>
            Nouvelle enquête →
          </button>
        </div>
      </div>
    </div>
  );

  // ── HOME ──
  const canPlay = isPremium || dailyCount < 3;

  return (
    <div style={s.app}>
      <div style={s.fog} />
      <div style={s.card()}>

        {/* Header */}
        <div style={s.header}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={s.badge}>Non Lieu — Jeu d'enquête IA</div>
              <div style={s.title}>Non Lieu</div>
              <div style={s.sub}>Chaque affaire générée par l'IA — unique</div>
            </div>
            <button
              style={{ ...s.btn(isPremium, C.gold), fontSize: "0.65rem", padding: "8px 14px", whiteSpace: "nowrap" }}
              onClick={() => setIsPremium(p => !p)}
            >
              {isPremium ? "✦ PREMIUM" : "Passer Premium"}
            </button>
          </div>
          {!isPremium && (
            <div style={{ marginTop: "10px", fontSize: "0.7rem", color: C.textMuted, letterSpacing: "0.05em" }}>
              {3 - dailyCount} enquête{3 - dailyCount > 1 ? "s" : ""} gratuite{3 - dailyCount > 1 ? "s" : ""} restante{3 - dailyCount > 1 ? "s" : ""} aujourd'hui
            </div>
          )}
        </div>

        <div style={s.body}>

          {/* Difficulté */}
          <span style={s.label}>Votre grade</span>
          <div style={{ display: "flex", gap: "8px", marginBottom: "22px" }}>
            {Object.entries(DIFFICULTY).map(([key, val]) => (
              <button key={key} style={{ ...s.btn(difficulty === key), flex: 1, textAlign: "center" }} onClick={() => setDifficulty(key)}>
                <div>{val.icon} {val.label}</div>
                <div style={{ fontSize: "0.6rem", opacity: 0.6, marginTop: "2px" }}>{val.questions} questions</div>
              </button>
            ))}
          </div>

          {/* Thèmes gratuits */}
          <span style={s.label}>Thèmes disponibles</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "14px" }}>
            {FREE_THEMES.map(t => (
              <button key={t.id} style={{ ...s.btn(selectedTheme === t.id), textAlign: "left", padding: "10px 12px" }} onClick={() => setSelectedTheme(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Thèmes premium */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={s.label}>Thèmes Premium</span>
            {!isPremium && <span style={s.premiumTag}>🔒 Premium</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "20px" }}>
            {PREMIUM_THEMES.map(t => (
              <button key={t.id}
                style={{ ...s.btn(selectedTheme === t.id, isPremium ? C.gold : C.textMuted), textAlign: "left", padding: "10px 12px", opacity: isPremium ? 1 : 0.45, cursor: isPremium ? "pointer" : "not-allowed" }}
                onClick={() => isPremium && setSelectedTheme(t.id)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Historique premium */}
          {isPremium && history.length > 0 && (
            <>
              <span style={s.label}>Vos affaires résolues</span>
              <div style={{ ...s.infoBox, marginBottom: "16px" }}>
                {history.map((h, i) => (
                  <div key={i} style={{ fontSize: "0.75rem", color: C.textDim, padding: "3px 0", borderBottom: i < history.length-1 ? `1px solid rgba(180,140,80,0.08)` : "none" }}>
                    🗂 {h.titre} <span style={{ color: C.textMuted }}>— {h.theme}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {error && <div style={{ color: C.red, fontSize: "0.78rem", marginBottom: "12px", letterSpacing: "0.05em" }}>{error}</div>}

          <button style={{ ...s.primaryBtn, opacity: canPlay && selectedTheme ? 1 : 0.4, cursor: canPlay && selectedTheme ? "pointer" : "not-allowed" }}
            onClick={startGame}>
            {!selectedTheme ? "Choisir un thème →" : !canPlay ? "Limite atteinte — Passez Premium →" : "Ouvrir le dossier →"}
          </button>

          {!isPremium && (
            <div style={{ ...s.infoBox, marginTop: "12px", fontSize: "0.72rem", textAlign: "center" }}>
              ✦ Premium — 2,99€/mois · Enquêtes illimitées · 20 thèmes · Historique · Bientôt : mode co-op
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
