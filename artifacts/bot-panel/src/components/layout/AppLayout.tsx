import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, TerminalSquare, LayoutTemplate, Settings, Users, Server, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, emoji: "⚡" },
  { href: "/commands", label: "Komande", icon: TerminalSquare, emoji: "🎮" },
  { href: "/embeds", label: "Embeds", icon: LayoutTemplate, emoji: "📋" },
  { href: "/members", label: "Članovi", icon: Users, emoji: "👥" },
  { href: "/server", label: "Server", icon: Server, emoji: "🌐" },
  { href: "/permissions", label: "Permisije", icon: Shield, emoji: "🛡️" },
  { href: "/settings", label: "Podešavanja", icon: Settings, emoji: "⚙️" },
];

interface GuildInfo {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number | null;
}

function useGuildInfo() {
  return useQuery<GuildInfo>({
    queryKey: ["guild-info"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/discord/guild`);
      if (!res.ok) throw new Error("Failed to fetch guild");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: guild } = useGuildInfo();

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#080910", color: "#e2e8f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Global decorative background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div style={{ position: "absolute", top: "-120px", left: "-80px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "-100px", right: "-60px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "300px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.4,
        }} />
      </div>

      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col relative z-10 overflow-hidden" style={{ background: "rgba(10,11,15,0.95)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Purple ambient top glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% -5%, rgba(99,102,241,0.22) 0%, transparent 60%)" }} />
        <div className="absolute top-0 right-0 w-px h-full pointer-events-none" style={{ background: "linear-gradient(180deg, transparent, rgba(99,102,241,0.3) 30%, rgba(139,92,246,0.2) 70%, transparent)" }} />

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 relative z-10">
          {guild?.icon ? (
            <img
              src={guild.icon}
              alt={guild.name}
              className="w-9 h-9 rounded-xl flex-shrink-0 object-cover"
              style={{ boxShadow: "0 0 24px rgba(99,102,241,0.55), 0 0 60px rgba(99,102,241,0.2)" }}
            />
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 relative" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 24px rgba(99,102,241,0.55), 0 0 60px rgba(99,102,241,0.2)" }}>
              G
              <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15), transparent)", borderRadius: "inherit" }} />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-bold text-white text-sm tracking-tight">GIANNI Panel</div>
            <div className="text-xs font-medium" style={{ color: "#818cf8" }}>Bot v2.0</div>
          </div>
        </div>

        {/* Bot status pill */}
        <div className="mx-4 mb-4 px-3 py-2.5 rounded-lg relative z-10" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="relative flex-shrink-0">
              <div className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
              <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ background: "#22c55e", opacity: 0.5 }} />
            </div>
            <span className="text-xs font-semibold text-white">GIANNI · Online</span>
          </div>
          <div className="flex items-center gap-2">
            {guild?.icon && (
              <img src={guild.icon} alt="" className="w-4 h-4 rounded-full flex-shrink-0" />
            )}
            <div className="text-xs truncate" style={{ color: "#4b5563" }}>
              {guild?.name ?? "GIAN · Discord"}
            </div>
          </div>
          {guild?.memberCount && (
            <div className="text-[10px] mt-0.5 font-medium" style={{ color: "#374151" }}>
              {guild.memberCount.toLocaleString()} članova
            </div>
          )}
        </div>

        {/* Nav section label */}
        <div className="px-5 mb-2 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#2d3048" }}>Navigacija</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5 relative z-10 overflow-y-auto">
          {NAV.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full relative overflow-hidden"
                style={{
                  background: active
                    ? "linear-gradient(90deg, rgba(99,102,241,0.22), rgba(139,92,246,0.08))"
                    : "transparent",
                  color: active ? "#a5b4fc" : "#6b7280",
                  borderLeft: active ? "2px solid #6366f1" : "2px solid transparent",
                  display: "flex",
                  boxShadow: active ? "inset 0 0 20px rgba(99,102,241,0.06)" : "none",
                }}
              >
                {active && (
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.08), transparent)" }} />
                )}
                <span className="text-base leading-none relative z-10">{item.emoji}</span>
                <span className="flex-1 relative z-10">{item.label}</span>
                {active && (
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 relative z-10" style={{ background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer user */}
        <div className="px-4 py-4 relative z-10 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2.5">
            {guild?.icon ? (
              <img src={guild.icon} alt="" className="w-8 h-8 rounded-lg flex-shrink-0 object-cover" style={{ boxShadow: "0 0 12px rgba(99,102,241,0.25)" }} />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0 relative" style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", color: "#a5b4fc", boxShadow: "0 0 12px rgba(99,102,241,0.25)" }}>
                G
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">Gianni Bot</div>
              <div className="flex items-center gap-1 text-xs" style={{ color: "#22c55e" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 4px #22c55e" }} />
                Online
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top header bar */}
        <div className="flex-shrink-0 px-6 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(8,9,16,0.6)", backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#374151" }}>
            <span style={{ color: "#4b5563" }}>gian.today</span>
            <span>/</span>
            <span style={{ color: "#6366f1" }}>{NAV.find(n => n.href === location)?.label ?? "Panel"}</span>
          </div>
          <div className="flex items-center gap-3">
            {guild?.name && (
              <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", color: "#818cf8" }}>
                {guild.icon && <img src={guild.icon} alt="" className="w-3.5 h-3.5 rounded-full" />}
                {guild.name}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.16)", color: "#22c55e" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 4px #22c55e" }} />
              Sistem aktivan
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto" style={{ animation: "fadeSlideUp 0.35s ease both" }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
