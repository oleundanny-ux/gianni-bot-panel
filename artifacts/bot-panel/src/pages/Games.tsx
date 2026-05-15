import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface GamesCfg {
  economy: {
    posao:  { enabled: boolean; cooldown_min: number; reward_min: number; reward_max: number };
    daily:  { enabled: boolean; cooldown_hours: number; reward_min: number; reward_max: number };
    kradi:  { enabled: boolean; cooldown_hours: number; success_rate: number; steal_min: number; steal_max: number };
  };
  gambling: {
    slots:        { enabled: boolean; cooldown_sec: number; max_bet: number };
    blackjack:    { enabled: boolean; cooldown_sec: number };
    poker:        { enabled: boolean; min_bet: number; max_bet: number };
    kviz:         { enabled: boolean; min_bet: number };
    geografija:   { enabled: boolean; min_bet: number };
    kpm:          { enabled: boolean };
    vjasala:      { enabled: boolean };
    kaladont:     { enabled: boolean; reward: number };
    toplo_hladno: { enabled: boolean };
    amogus:       { enabled: boolean };
  };
  animals: {
    hunt: { enabled: boolean; cooldown_sec: number };
  };
  social: { enabled: boolean };
  updatedAt: string | null;
}

const DEFAULTS: GamesCfg = {
  economy: {
    posao:  { enabled: true, cooldown_min: 30,  reward_min: 150, reward_max: 600 },
    daily:  { enabled: true, cooldown_hours: 24, reward_min: 300, reward_max: 800 },
    kradi:  { enabled: true, cooldown_hours: 2,  success_rate: 38, steal_min: 50, steal_max: 300 },
  },
  gambling: {
    slots:        { enabled: true, cooldown_sec: 15, max_bet: 1000000000 },
    blackjack:    { enabled: true, cooldown_sec: 30 },
    poker:        { enabled: true, min_bet: 50,  max_bet: 50000 },
    kviz:         { enabled: true, min_bet: 10 },
    geografija:   { enabled: true, min_bet: 10 },
    kpm:          { enabled: true },
    vjasala:      { enabled: true },
    kaladont:     { enabled: true, reward: 1500 },
    toplo_hladno: { enabled: true },
    amogus:       { enabled: true },
  },
  animals: {
    hunt: { enabled: true, cooldown_sec: 7 },
  },
  social: { enabled: true },
  updatedAt: null,
};

type Tab = "ekonomija" | "kockanje" | "zivotinje" | "socijalno";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
      style={{ background: value ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.08)" }}
    >
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: value ? "calc(100% - 22px)" : "2px", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
    </button>
  );
}

function NumInput({ value, onChange, min, max, suffix }: { value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(Number(e.target.value))}
        className="w-24 px-3 py-1.5 rounded-lg text-sm text-white text-right outline-none"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}
        onFocus={e => e.currentTarget.style.border = "1px solid rgba(99,102,241,0.5)"}
        onBlur={e => e.currentTarget.style.border = "1px solid rgba(99,102,241,0.2)"}
      />
      {suffix && <span className="text-xs" style={{ color: "#6b7280" }}>{suffix}</span>}
    </div>
  );
}

function Card({ title, icon, badge, enabled, onToggle, children }: {
  title: string; icon: string; badge?: string; enabled: boolean;
  onToggle: (v: boolean) => void; children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-4" style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
      opacity: enabled ? 1 : 0.55, transition: "opacity 0.2s"
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl leading-none">{icon}</span>
          <div>
            <span className="text-sm font-semibold text-white">{title}</span>
            {badge && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>{badge}</span>}
          </div>
        </div>
        <Toggle value={enabled} onChange={onToggle} />
      </div>
      {children && enabled && <div className="space-y-2.5 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>{children}</div>}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: "#9ca3af" }}>{label}</span>
      {children}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
      style={{
        background: active ? "rgba(99,102,241,0.2)" : "transparent",
        color: active ? "#a5b4fc" : "#6b7280",
        border: active ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
      }}
    >
      {children}
    </button>
  );
}

export default function Games() {
  const [cfg, setCfg] = useState<GamesCfg>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch(`${BASE}/api/games`)
      .then(r => r.json())
      .then(d => setCfg(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const [tab, setTab] = useState<Tab>("ekonomija");

  function setEco<K extends keyof GamesCfg["economy"]>(cmd: K, field: string, val: unknown) {
    setCfg(c => ({ ...c, economy: { ...c.economy, [cmd]: { ...c.economy[cmd], [field]: val } } }));
  }
  function setGamble<K extends keyof GamesCfg["gambling"]>(cmd: K, field: string, val: unknown) {
    setCfg(c => ({ ...c, gambling: { ...c.gambling, [cmd]: { ...c.gambling[cmd], [field]: val } } }));
  }
  function setAnimals(field: string, val: unknown) {
    setCfg(c => ({ ...c, animals: { ...c.animals, hunt: { ...c.animals.hunt, [field]: val } } }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const r = await fetch(`${BASE}/api/games`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cfg)
      });
      if (!r.ok) throw new Error();
      const updated = await r.json();
      setCfg(updated);
      toast({ title: "Sačuvano!", description: "Bot preuzima promjene za 5 minuta." });
    } catch {
      toast({ title: "Greška!", description: "Nije moguće sačuvati podešavanja.", variant: "destructive" });
    } finally { setSaving(false); }
  }

  function handleReset() {
    setCfg(DEFAULTS);
    toast({ title: "Resetovano", description: "Vraćene su zadane vrijednosti (još nije sačuvano)." });
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex gap-1.5">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#6366f1", animationDelay: `${i*0.15}s` }} />)}</div>
    </div>
  );

  const eco = cfg.economy;
  const gam = cfg.gambling;
  const ani = cfg.animals;

  const gameCmds = [
    { key: "slots", icon: "🎰", name: "Slots", badge: "/slots" },
    { key: "blackjack", icon: "🃏", name: "Blackjack", badge: "/blackjack" },
    { key: "poker", icon: "♠️", name: "Poker", badge: "/poker" },
    { key: "kviz", icon: "❓", name: "Kviz", badge: "/kviz" },
    { key: "geografija", icon: "🌍", name: "Geografija", badge: "/geografija" },
    { key: "kpm", icon: "✊", name: "Kamen-Papir-Makaze", badge: "/kpm" },
    { key: "vjasala", icon: "🎭", name: "Vješala", badge: "/vjasala" },
    { key: "kaladont", icon: "🔤", name: "Kaladont", badge: "/kaladont" },
    { key: "toplo_hladno", icon: "🌡️", name: "Toplo-Hladno", badge: "/toplo-hladno" },
    { key: "amogus", icon: "🚀", name: "Among Us", badge: "/amogus" },
  ] as const;

  const socialCmds = [
    { icon: "🤗", name: "/zagrljaj", desc: "Zagrli korisnika" },
    { icon: "💋", name: "/poljubac", desc: "Poljubi korisnika" },
    { icon: "🥰", name: "/mazi", desc: "Pogali korisnika" },
    { icon: "👋", name: "/tapsi", desc: "Tapni korisnika" },
    { icon: "🙏", name: "/high5", desc: "High five!" },
    { icon: "👉", name: "/cudan", desc: "Diraj korisnika" },
    { icon: "❤️", name: "/srce", desc: "Pošalji srce" },
    { icon: "💍", name: "/brak", desc: "Zaprositi korisnika" },
    { icon: "😄", name: "/kompli", desc: "Kompliment" },
    { icon: "😂", name: "/fora", desc: "Ispričaj foru" },
    { icon: "😏", name: "/muv", desc: "Napravi muv" },
    { icon: "💘", name: "/crush", desc: "Nasumičan crush sa servera" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
            🎮
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Igre & Ekonomija</h1>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Konfiguracija svih igara i ekonomije — bot čita promjene svakih 5 minuta</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: "rgba(255,255,255,0.04)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}>
            ↺ Resetuj
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Čuvanje..." : "💾 Sačuvaj"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <TabBtn active={tab === "ekonomija"} onClick={() => setTab("ekonomija")}>💰 Ekonomija</TabBtn>
        <TabBtn active={tab === "kockanje"}  onClick={() => setTab("kockanje")}>🎲 Kockanje</TabBtn>
        <TabBtn active={tab === "zivotinje"} onClick={() => setTab("zivotinje")}>🦊 Životinje</TabBtn>
        <TabBtn active={tab === "socijalno"} onClick={() => setTab("socijalno")}>💬 Socijalno</TabBtn>
      </div>

      {/* ── EKONOMIJA ── */}
      {tab === "ekonomija" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card icon="💼" title="Posao" badge="/posao" enabled={eco.posao.enabled} onToggle={v => setEco("posao", "enabled", v)}>
            <Row label="Cooldown"><NumInput value={eco.posao.cooldown_min} onChange={v => setEco("posao","cooldown_min",v)} min={1} max={1440} suffix="min" /></Row>
            <Row label="Min nagrada"><NumInput value={eco.posao.reward_min} onChange={v => setEco("posao","reward_min",v)} min={1} suffix="💶" /></Row>
            <Row label="Max nagrada"><NumInput value={eco.posao.reward_max} onChange={v => setEco("posao","reward_max",v)} min={1} suffix="💶" /></Row>
            <div className="text-[10px] px-2 py-1.5 rounded" style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8" }}>
              Nagrada: <b>{eco.posao.reward_min}–{eco.posao.reward_max} 💶</b> · CD: <b>{eco.posao.cooldown_min}min</b>
            </div>
          </Card>

          <Card icon="🎁" title="Daily" badge="/daily" enabled={eco.daily.enabled} onToggle={v => setEco("daily","enabled",v)}>
            <Row label="Cooldown"><NumInput value={eco.daily.cooldown_hours} onChange={v => setEco("daily","cooldown_hours",v)} min={1} max={72} suffix="h" /></Row>
            <Row label="Min nagrada"><NumInput value={eco.daily.reward_min} onChange={v => setEco("daily","reward_min",v)} min={1} suffix="💶" /></Row>
            <Row label="Max nagrada"><NumInput value={eco.daily.reward_max} onChange={v => setEco("daily","reward_max",v)} min={1} suffix="💶" /></Row>
            <div className="text-[10px] px-2 py-1.5 rounded" style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8" }}>
              Nagrada: <b>{eco.daily.reward_min}–{eco.daily.reward_max} 💶</b> · CD: <b>{eco.daily.cooldown_hours}h</b>
            </div>
          </Card>

          <Card icon="🕵️" title="Kradi" badge="/kradi" enabled={eco.kradi.enabled} onToggle={v => setEco("kradi","enabled",v)}>
            <Row label="Cooldown"><NumInput value={eco.kradi.cooldown_hours} onChange={v => setEco("kradi","cooldown_hours",v)} min={1} max={48} suffix="h" /></Row>
            <Row label="Šansa uspjeha"><NumInput value={eco.kradi.success_rate} onChange={v => setEco("kradi","success_rate",v)} min={1} max={99} suffix="%" /></Row>
            <Row label="Min krađa"><NumInput value={eco.kradi.steal_min} onChange={v => setEco("kradi","steal_min",v)} min={1} suffix="💶" /></Row>
            <Row label="Max krađa"><NumInput value={eco.kradi.steal_max} onChange={v => setEco("kradi","steal_max",v)} min={1} suffix="💶" /></Row>
            <div className="text-[10px] px-2 py-1.5 rounded" style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8" }}>
              Šansa: <b>{eco.kradi.success_rate}%</b> · Krađa: <b>{eco.kradi.steal_min}–{eco.kradi.steal_max} 💶</b>
            </div>
          </Card>

          {/* Info cards for non-configurable */}
          {[
            { icon: "🏦", name: "/baki", desc: "Provjera balansa", info: "Prikazuje balans i zadnji rad" },
            { icon: "🤝", name: "/daj", desc: "Transfer para", info: "Pošalji pare drugaru" },
            { icon: "📈", name: "/rank", desc: "Level & XP", info: "Prikazuje tvoj rank i napredak" },
            { icon: "📊", name: "/aktivnost", desc: "Aktivnost", info: "Detaljna statistika aktivnosti" },
            { icon: "🏆", name: "/leaderboard", desc: "Top lista", info: "Top 10 po XP-u ili bogatstvu" },
            { icon: "🛒", name: "/shop", desc: "Shop", info: "Kupovina boost predmeta" },
            { icon: "📋", name: "/quests", desc: "Zadaci", info: "3 dnevna zadatka s nagradama" },
          ].map(c => (
            <div key={c.name} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <span className="text-sm font-semibold text-white">{c.desc}</span>
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>{c.name}</span>
                </div>
              </div>
              <p className="text-xs" style={{ color: "#6b7280" }}>{c.info}</p>
              <div className="mt-2 text-[10px] px-2 py-1 rounded inline-block" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.15)" }}>
                ✓ Uvijek aktivno
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── KOCKANJE ── */}
      {tab === "kockanje" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card icon="🎰" title="Slots" badge="/slots" enabled={gam.slots.enabled} onToggle={v => setGamble("slots","enabled",v)}>
            <Row label="Cooldown"><NumInput value={gam.slots.cooldown_sec} onChange={v => setGamble("slots","cooldown_sec",v)} min={1} max={3600} suffix="sek" /></Row>
            <Row label="Max opklada"><NumInput value={gam.slots.max_bet} onChange={v => setGamble("slots","max_bet",v)} min={20} suffix="💶" /></Row>
            <div className="text-[10px] px-2 py-1.5 rounded" style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8" }}>
              CD: <b>{gam.slots.cooldown_sec}s</b> · Max: <b>{gam.slots.max_bet.toLocaleString()} 💶</b>
            </div>
          </Card>

          <Card icon="🃏" title="Blackjack" badge="/blackjack" enabled={gam.blackjack.enabled} onToggle={v => setGamble("blackjack","enabled",v)}>
            <Row label="Cooldown"><NumInput value={gam.blackjack.cooldown_sec} onChange={v => setGamble("blackjack","cooldown_sec",v)} min={1} max={3600} suffix="sek" /></Row>
            <div className="text-[10px] px-2 py-1.5 rounded" style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8" }}>
              CD: <b>{gam.blackjack.cooldown_sec}s</b>
            </div>
          </Card>

          <Card icon="♠️" title="Poker" badge="/poker" enabled={gam.poker.enabled} onToggle={v => setGamble("poker","enabled",v)}>
            <Row label="Min opklada"><NumInput value={gam.poker.min_bet} onChange={v => setGamble("poker","min_bet",v)} min={1} suffix="💶" /></Row>
            <Row label="Max opklada"><NumInput value={gam.poker.max_bet} onChange={v => setGamble("poker","max_bet",v)} min={1} suffix="💶" /></Row>
            <div className="text-[10px] px-2 py-1.5 rounded" style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8" }}>
              Opklada: <b>{gam.poker.min_bet}–{gam.poker.max_bet.toLocaleString()} 💶</b>
            </div>
          </Card>

          <Card icon="❓" title="Kviz" badge="/kviz" enabled={gam.kviz.enabled} onToggle={v => setGamble("kviz","enabled",v)}>
            <Row label="Min opklada"><NumInput value={gam.kviz.min_bet} onChange={v => setGamble("kviz","min_bet",v)} min={1} suffix="💶" /></Row>
          </Card>

          <Card icon="🌍" title="Geografija" badge="/geografija" enabled={gam.geografija.enabled} onToggle={v => setGamble("geografija","enabled",v)}>
            <Row label="Min opklada"><NumInput value={gam.geografija.min_bet} onChange={v => setGamble("geografija","min_bet",v)} min={1} suffix="💶" /></Row>
          </Card>

          <Card icon="🔤" title="Kaladont" badge="/kaladont" enabled={gam.kaladont.enabled} onToggle={v => setGamble("kaladont","enabled",v)}>
            <Row label="Nagrada za pobjedu"><NumInput value={gam.kaladont.reward} onChange={v => setGamble("kaladont","reward",v)} min={0} suffix="💶" /></Row>
            <div className="text-[10px] px-2 py-1.5 rounded" style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8" }}>
              Pobjednička nagrada: <b>{gam.kaladont.reward} 💶 + 200 XP</b>
            </div>
          </Card>

          {gameCmds.filter(g => ["kpm","vjasala","toplo_hladno","amogus"].includes(g.key)).map(g => (
            <Card key={g.key} icon={g.icon} title={g.name} badge={g.badge}
              enabled={gam[g.key as keyof typeof gam].enabled}
              onToggle={v => setGamble(g.key as keyof GamesCfg["gambling"], "enabled", v)}
            />
          ))}
        </div>
      )}

      {/* ── ŽIVOTINJE ── */}
      {tab === "zivotinje" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card icon="🏹" title="Hunt" badge="/hunt" enabled={ani.hunt.enabled} onToggle={v => setAnimals("enabled",v)}>
              <Row label="Cooldown"><NumInput value={ani.hunt.cooldown_sec} onChange={v => setAnimals("cooldown_sec",v)} min={1} max={600} suffix="sek" /></Row>
              <div className="text-[10px] px-2 py-1.5 rounded" style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8" }}>
                CD: <b>{ani.hunt.cooldown_sec}s</b> · Lovstvo od Common do Mythical
              </div>
            </Card>

            {[
              { icon: "🦁", name: "Zoo", cmd: "/zoo", desc: "Prikazuje kolekciju uhvaćenih životinja i ukupnu moć" },
              { icon: "⚔️", name: "Battle", cmd: "/battle", desc: "Dvoboj sa drugim korisnikom na osnovu Zoo Power-a" },
              { icon: "💰", name: "Sell", cmd: "/sell", desc: "Prodaj životinje za 💶" },
              { icon: "📖", name: "Animals", cmd: "/animals", desc: "Lista svih životinja s raritetom i vrijednostima" },
              { icon: "🙏", name: "Pray", cmd: "/pray", desc: "Pomoli se za korisnika — nasumičan 💶 bonus 20–100" },
            ].map(c => (
              <div key={c.cmd} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xl">{c.icon}</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{c.name}</span>
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>{c.cmd}</span>
                  </div>
                </div>
                <p className="text-xs" style={{ color: "#6b7280" }}>{c.desc}</p>
                <div className="mt-2 text-[10px] px-2 py-1 rounded inline-block" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.15)" }}>✓ Uvijek aktivno</div>
              </div>
            ))}
          </div>

          {/* Rarity table */}
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-sm font-semibold text-white mb-4">📊 Raritet životinja</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { r: "Common",    color: "#9ca3af", emoji: "🐇" },
                { r: "Uncommon",  color: "#22c55e", emoji: "🦊" },
                { r: "Rare",      color: "#3b82f6", emoji: "🐯" },
                { r: "Epic",      color: "#8b5cf6", emoji: "🦁" },
                { r: "Legendary", color: "#f59e0b", emoji: "🐉" },
                { r: "Mythical",  color: "#ef4444", emoji: "🦄" },
              ].map(x => (
                <div key={x.r} className="rounded-lg p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${x.color}33` }}>
                  <div className="text-2xl mb-1">{x.emoji}</div>
                  <div className="text-xs font-semibold" style={{ color: x.color }}>{x.r}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SOCIJALNO ── */}
      {tab === "socijalno" && (
        <div className="space-y-4">
          {/* Global toggle */}
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div>
              <div className="text-sm font-semibold text-white">Sve socijalne komande</div>
              <div className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Uključi ili isključi cijelu kategoriju odjednom</div>
            </div>
            <Toggle value={cfg.social.enabled} onChange={v => setCfg(c => ({ ...c, social: { enabled: v } }))} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" style={{ opacity: cfg.social.enabled ? 1 : 0.5, transition: "opacity 0.2s" }}>
            {socialCmds.map(c => (
              <div key={c.name} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-sm font-mono font-semibold" style={{ color: "#a5b4fc" }}>{c.name}</span>
                </div>
                <p className="text-xs" style={{ color: "#6b7280" }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Vers & Giveaway */}
          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-sm font-semibold text-white mb-3">🎤 Specijalne komande</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg p-3" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎤</span>
                  <span className="font-mono text-sm" style={{ color: "#a5b4fc" }}>/vers</span>
                </div>
                <p className="text-xs" style={{ color: "#6b7280" }}>Pošalji hip-hop vers u poseban kanal (VERS_CHANNEL_ID)</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎉</span>
                  <span className="font-mono text-sm" style={{ color: "#a5b4fc" }}>/giveaway</span>
                </div>
                <p className="text-xs" style={{ color: "#6b7280" }}>Pokretanje i završetak nagradnih igara</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last saved */}
      {cfg.updatedAt && (
        <p className="text-xs text-center" style={{ color: "#374151" }}>
          Zadnje sačuvano: {new Date(cfg.updatedAt).toLocaleString("bs-BA")}
        </p>
      )}
    </div>
  );
}
