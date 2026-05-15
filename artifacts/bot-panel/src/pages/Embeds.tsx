import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useListEmbeds, useUpdateEmbed, getListEmbedsQueryKey } from "@workspace/api-client-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Smile, X, Search, RefreshCw, LayoutTemplate, Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { EmbedTemplate, EmbedField } from "@workspace/api-client-react";

const EMBED_DISPLAY_NAMES: Record<string, string> = {
  // Sistem
  welcome:          "Dobrodošao na server",
  leave:            "Clan je napustio server",
  "dm-welcome":     "DM Dobrodošlica",
  boost:            "Novi Boost! 💜",
  birthday:         "Sretan Rodjendan! 🎂",
  starboard:        "Zvjezdana poruka ⭐",
  aotw:             "Aktivni Član Sedmice 👑",
  // Log
  "log-join":       "Novi Član (Log) 📥",
  "log-edit":       "Poruka Editovana ✏️",
  "log-delete":     "Poruka Obrisana 🗑️",
  report:           "Prijava člana 🚨",
  // Moderacija
  warn:             "Upozorenje ⚠️",
  ban:              "Član Banovan 🔨",
  // XP
  levelup:          "Level Up! 🌟",
  "vatrica-nova":   "Nova Vatrica! 🔥",
  aktivnost:        "Aktivnost 📊",
  rank:             "Rank Profil 📈",
  "leaderboard-xp":     "Top Lista — XP 🏅",
  "leaderboard-novac":  "Top Lista — Novac 💰",
  // Ekonomija
  heist:            "Razboj u pripremi 💰",
  lottery:          "Sedmična Loto 🎰",
  quests:           "Dnevni Zadaci 📋",
  giveaway:         "Nagradna Igra 🎉",
  // Igre
  slots:            "Slot Mašina 🎰",
  blackjack:        "Blackjack 🃏",
  "poker-lobby":    "Poker — Lobby 🃏",
  "poker-game":     "Poker — Igra 🃏",
  "poker-showdown": "Poker — Showdown 🏆",
  "among-us-lobby": "Among Us — Lobby 🚀",
  "among-us-game":  "Among Us — U Toku 🚀",
  "among-us-end":   "Among Us — Kraj 🏁",
  "kaladont-start":  "Kaladont — Start 🔤",
  "kaladont-active": "Kaladont — Aktivna igra 🔤",
  "kaladont-word":   "Kaladont — Word Card 🔤",
  "kaladont-win":    "Kaladont — Pobjeda 👑",
  bingo:            "Bingo 🎱",
  // Fun
  hunt:             "Lov — Ulovio životinju 🏹",
  zoo:              "Zoo — Zbirka 🦁",
  battle:           "Bitka ⚔️",
  pray:             "Molitva 🙏",
  vers:             "Vers — Hip Hop 🎤",
  kompli:           "Kompliment 🌹",
  fora:             "Fora 😂",
  muv:              "Muv 😏",
  crush:            "Crush 💘",
  // Ljubavne
  zagrljaj:         "Zagrljaj 🤗",
  poljubac:         "Poljubac 💋",
  mazi:             "Mazi 🥰",
  tapsi:            "Tapsi 👋",
  high5:            "High Five 🙌",
  cudan:            "Ćudan 😠",
  srce:             "Srce ❤️",
  brak:             "Brak / Prosidba 💍",
  // Info
  spotify:          "Spotify 🎵",
  invite:           "Statistika 📊",
  avatar:           "Avatar 🖼️",
  "brojanje-info":  "Brojanje — stanje 🔢",
  // Sistem paneli
  ticket:           "Tiket — Panel 🎫",
  "ticket-otvoren": "Tiket — Otvoren ✅",
  "staff-prijava":  "Staff Prijava 📋",
  "private-vc":     "Privatni Voice Kanal 🔊",
  // Vatrice
  "vatrice-pup":    "Top Lista Vatrica 🔥",
  "vatrice-start":  "Vatrica Sistem — Start 🔥",
  "vatrice-kanal":  "Vatrica Kanal Postavljen ✅",
  "vatrice-oblik":  "Vatrica Emoji Promijenjen 🔥",
  // Ekonomija (dopune)
  "giveaway-end":   "Nagradna Igra — Završena 🏆",
  // Igre (dopune)
  "vjasala":        "Vješala — Igra 📝",
  "vjasala-kraj":   "Vješala — Pogodak! 🎉",
  "toplo-hladno":   "Toplo ili Hladno 🌡️",
  "kviz":           "Kviz — Balkan Pitanje 🧠",
  "geografija":     "Geografija Kviz 🌍",
  "mafia-lobby":    "Mafia — Lobby 🕵️",
  "mafia-end":      "Mafia — Kraj Igre 🏆",
  // Poo
  "poo":            "Poo — Stanje Kreature 💩",
  "poo-zadaci":     "Poo — Zadaci 📋",
  "poo-top":        "Poo — Top Čuvari 🏆",
  "poo-hrani":      "Poo — Hranjen! 🍖",
  "poo-info":       "Poo — Moj Doprinos 📊",
  // Admin
  "backup":         "Backup — Snimljen 💾",
  "backup-restore": "Backup — Vraćen ♻️",
  "backup-status":  "Backup — Status 📊",
};

interface DiscordEmoji {
  id: string;
  name: string;
  animated: boolean;
}

const EMBED_CATEGORY_COLORS: Record<string, string> = {
  "Sistem":        "#6366f1",
  "Log":           "#f59e0b",
  "Moderacija":    "#ef4444",
  "XP":            "#22c55e",
  "Ekonomija":     "#f97316",
  "Igre":          "#3b82f6",
  "Fun":           "#ec4899",
  "Ljubavne":      "#e879f9",
  "Info":          "#14b8a6",
  "Sistem paneli": "#a78bfa",
  "Vatrice":       "#FF6A00",
  "Poo":           "#92400e",
  "Admin":         "#64748b",
};

function getCategoryColor(cat: string) {
  return EMBED_CATEGORY_COLORS[cat] ?? "#6366f1";
}

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

function useDiscordEmojis() {
  return useQuery<DiscordEmoji[]>({
    queryKey: ["discord-emojis"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/discord/emojis`);
      if (!res.ok) throw new Error("Failed to fetch emojis");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

async function forceRefreshEmojis(): Promise<number> {
  const res = await fetch(`${BASE_URL}/api/discord/emojis?refresh=1`);
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

function emojiUrl(emoji: DiscordEmoji) {
  const ext = emoji.animated ? "gif" : "png";
  return `https://cdn.discordapp.com/emojis/${emoji.id}.${ext}?size=32`;
}

function emojiMarkdown(emoji: DiscordEmoji) {
  return emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`;
}

interface EmojiPickerProps {
  onSelect: (markdown: string) => void;
  onClose: () => void;
}

function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const { data: emojis, isLoading, isError } = useDiscordEmojis();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshMsg(null);
    try {
      const count = await forceRefreshEmojis();
      setRefreshMsg(`✅ ${count} emojia učitano`);
      qc.invalidateQueries({ queryKey: ["discord-emojis"] });
    } catch {
      setRefreshMsg("❌ Greška — pokušaj ponovo");
    } finally {
      setRefreshing(false);
    }
  };

  // Split animated vs static for display
  const animated = emojis?.filter(e => e.animated) ?? [];
  const staticEmojis = emojis?.filter(e => !e.animated) ?? [];

  const filterFn = (e: DiscordEmoji) =>
    !search || e.name.toLowerCase().includes(search.toLowerCase());

  const filteredAnimated = animated.filter(filterFn);
  const filteredStatic = staticEmojis.filter(filterFn);
  const filtered = [...filteredAnimated, ...filteredStatic];

  return (
    <div
      ref={ref}
      className="absolute z-50 bottom-full mb-2 left-0 w-80 bg-[#1E1F22] border border-[#2B2D31] rounded-lg shadow-2xl overflow-hidden"
      data-testid="emoji-picker"
    >
      {/* Search row */}
      <div className="p-2 border-b border-[#2B2D31] flex items-center gap-1">
        <div className="flex items-center gap-2 bg-[#313338] rounded px-2 flex-1">
          <Search className="w-3.5 h-3.5 text-[#949BA4] flex-shrink-0" />
          <input
            autoFocus
            placeholder="Pretraži emoji..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#F2F3F5] placeholder:text-[#949BA4] py-1.5 outline-none"
            data-testid="input-emoji-search"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[#949BA4] hover:text-[#F2F3F5]">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title="Osvježi emojie (učitaj sve sa Dev Portala)"
          className="p-1.5 rounded text-[#949BA4] hover:text-[#F1C40F] hover:bg-[#313338] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Refresh message */}
      {refreshMsg && (
        <div className="px-3 py-1.5 text-[11px] text-center border-b border-[#2B2D31]"
          style={{ color: refreshMsg.startsWith("✅") ? "#43B581" : "#E74C3C" }}>
          {refreshMsg}
        </div>
      )}

      <div className="overflow-y-auto" style={{ maxHeight: "240px" }}>
        {isLoading && (
          <div className="flex items-center justify-center h-24 text-[#949BA4] text-sm">
            Učitavam emoji-je...
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center h-24 text-red-400 text-sm text-center px-4">
            Greška — klikni ↺ za ponovni pokušaj
          </div>
        )}

        {/* Animated GIF section */}
        {filteredAnimated.length > 0 && (
          <div className="p-2">
            <div className="text-[10px] text-[#949BA4] uppercase tracking-wider mb-1 px-1">
              GIF Emojii ({filteredAnimated.length})
            </div>
            <div className="grid grid-cols-9 gap-0.5">
              {filteredAnimated.map(emoji => (
                <button
                  key={emoji.id}
                  title={`:${emoji.name}:`}
                  data-testid={`emoji-${emoji.name}`}
                  onClick={() => { onSelect(emojiMarkdown(emoji)); onClose(); }}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#313338] transition-colors"
                >
                  <img
                    src={emojiUrl(emoji)}
                    alt={emoji.name}
                    className="w-6 h-6 object-contain"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Static section */}
        {filteredStatic.length > 0 && (
          <div className="p-2 border-t border-[#2B2D31]">
            <div className="text-[10px] text-[#949BA4] uppercase tracking-wider mb-1 px-1">
              Statični ({filteredStatic.length})
            </div>
            <div className="grid grid-cols-9 gap-0.5">
              {filteredStatic.map(emoji => (
                <button
                  key={emoji.id}
                  title={`:${emoji.name}:`}
                  data-testid={`emoji-${emoji.name}`}
                  onClick={() => { onSelect(emojiMarkdown(emoji)); onClose(); }}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#313338] transition-colors"
                >
                  <img
                    src={emojiUrl(emoji)}
                    alt={emoji.name}
                    className="w-6 h-6 object-contain"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="flex items-center justify-center h-20 text-[#949BA4] text-sm">
            Nema rezultata
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-[#2B2D31] text-[10px] text-[#949BA4] flex items-center justify-between">
        <span>{filtered.length}{emojis ? ` / ${emojis.length}` : ""} emoji-ja</span>
        {emojis && emojis.length < 500 && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-[#5865F2] hover:underline disabled:opacity-50"
          >
            {refreshing ? "Osvježavam..." : "↺ Učitaj sve"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Emoji token detection ────────────────────────────────────────────────────

interface EmojiToken {
  raw: string;       // original text matched
  index: number;     // start position in string
  isCustom: boolean;
  isAnimated: boolean;
  id?: string;
  name?: string;
}

/** Find all emojis (Unicode + custom Discord) in a string with their positions */
function findEmojisInText(text: string): EmojiToken[] {
  const results: EmojiToken[] = [];

  // 1. Discord custom emoji: <:name:id>  or  <a:name:id>
  const customRe = /<(a?):([^:>\s]+):(\d+)>/g;
  let m: RegExpExecArray | null;
  while ((m = customRe.exec(text)) !== null) {
    results.push({
      raw: m[0],
      index: m.index,
      isCustom: true,
      isAnimated: m[1] === "a",
      id: m[3],
      name: m[2],
    });
  }

  // 2. Unicode emoji — use \p{Emoji_Presentation} (u flag, supported in modern browsers)
  try {
    const unicodeRe = /\p{Emoji_Presentation}(?:\uFE0F|\u20E3)?(?:\u200D\p{Emoji_Presentation}(?:\uFE0F|\u20E3)?)*/gu;
    while ((m = unicodeRe.exec(text)) !== null) {
      const idx = m.index;
      // Skip if this position falls inside a custom emoji token already found
      const inCustom = results.some(
        r => r.isCustom && idx >= r.index && idx < r.index + r.raw.length
      );
      if (!inCustom) {
        results.push({
          raw: m[0],
          index: idx,
          isCustom: false,
          isAnimated: false,
        });
      }
    }
  } catch {}

  return results.sort((a, b) => a.index - b.index);
}

/** Replace one token in the text with new markdown */
function replaceToken(text: string, token: EmojiToken, replacement: string): string {
  return text.slice(0, token.index) + replacement + text.slice(token.index + token.raw.length);
}

// ── Inline emoji chip + mini-picker ─────────────────────────────────────────

interface EmojiChipProps {
  token: EmojiToken;
  onReplace: (newMarkdown: string) => void;
}

function EmojiChip({ token, onReplace }: EmojiChipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const display = token.isCustom && token.id ? (
    <img
      src={`https://cdn.discordapp.com/emojis/${token.id}.${token.isAnimated ? "gif" : "png"}?size=32`}
      alt={token.name}
      className="w-5 h-5 object-contain"
    />
  ) : (
    <span className="text-base leading-none">{token.raw}</span>
  );

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        title="Zamijeni emoji"
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium transition-colors ${
          open
            ? "border-[#5865F2] bg-[#5865F2]/20 text-[#5865F2]"
            : "border-[#404249] bg-[#1E1F22] text-[#949BA4] hover:border-[#5865F2] hover:text-[#5865F2]"
        }`}
      >
        {display}
        <RefreshCw className="w-2.5 h-2.5 flex-shrink-0" />
      </button>
      {open && (
        <EmojiPicker
          onSelect={(md) => { onReplace(md); setOpen(false); }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

// ── TextFieldWithEmoji ───────────────────────────────────────────────────────

interface TextFieldWithEmojiProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  testId: string;
}

function TextFieldWithEmoji({ label, value, onChange, multiline, testId }: TextFieldWithEmojiProps) {
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  const tokens = useMemo(() => findEmojisInText(value ?? ""), [value]);

  const insertEmoji = useCallback((markdown: string) => {
    const el = inputRef.current;
    if (!el) { onChange(value + markdown); return; }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + markdown + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + markdown.length;
      el.setSelectionRange(pos, pos);
    });
  }, [value, onChange]);

  const replaceEmoji = useCallback((token: EmojiToken, newMarkdown: string) => {
    onChange(replaceToken(value ?? "", token, newMarkdown));
  }, [value, onChange]);

  const commonClass = "bg-[#1E1F22] border border-[#2B2D31] text-[#F2F3F5] placeholder:text-[#949BA4] focus:border-[#5865F2] focus:ring-0 rounded-md text-sm";

  return (
    <div className="space-y-1.5">
      <Label className="text-[#B5BAC1] text-xs font-semibold uppercase tracking-wide">{label}</Label>
      <div className="relative">
        {multiline ? (
          <Textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            value={value ?? ""}
            onChange={e => onChange(e.target.value)}
            className={`${commonClass} h-28 resize-none pr-9`}
            data-testid={testId}
          />
        ) : (
          <Input
            ref={inputRef as React.Ref<HTMLInputElement>}
            value={value ?? ""}
            onChange={e => onChange(e.target.value)}
            className={`${commonClass} pr-9`}
            data-testid={testId}
          />
        )}
        <button
          type="button"
          onClick={() => setShowPicker(p => !p)}
          className="absolute right-2 bottom-2 text-[#949BA4] hover:text-[#F1C40F] transition-colors"
          data-testid={`button-emoji-${testId}`}
          title="Umetni emoji"
        >
          <Smile className="w-4 h-4" />
        </button>

        {showPicker && (
          <EmojiPicker
            onSelect={insertEmoji}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>

      {/* Emoji replace chips — shown when emojis are detected in the text */}
      {tokens.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5">
          <span className="text-[10px] text-[#5C5F66] self-center">zamijeni:</span>
          {tokens.map((token, i) => (
            <EmojiChip
              key={`${token.index}-${i}`}
              token={token}
              onReplace={(md) => replaceEmoji(token, md)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DiscordEmbedPreview({ embed, title, description, color, fields: fieldsProp }: {
  embed: EmbedTemplate;
  title: string;
  description: string;
  color: string;
  fields?: EmbedTemplate["fields"];
}) {
  function renderText(text: string) {
    // Render custom emoji markdown <:name:id> or <a:name:id> as actual images
    const parts = text.split(/(<a?:[^:]+:\d+>)/g);
    return parts.map((part, i) => {
      const match = part.match(/^<(a?):([^:]+):(\d+)>$/);
      if (match) {
        const animated = match[1] === "a";
        const name = match[2];
        const id = match[3];
        const ext = animated ? "gif" : "png";
        return (
          <img
            key={i}
            src={`https://cdn.discordapp.com/emojis/${id}.${ext}?size=32`}
            alt={`:${name}:`}
            title={`:${name}:`}
            className="inline-block w-5 h-5 object-contain align-middle mx-0.5"
          />
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div className="bg-[#313338] rounded-lg p-4">
      {/* Message row */}
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F1C40F] flex-shrink-0 flex items-center justify-center font-bold text-black text-sm select-none">
          G
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-medium text-[#F2F3F5] text-sm">GIANNI (Custom)</span>
            <span className="bg-[#5865F2] text-white text-[9px] px-1 py-px rounded font-bold uppercase leading-none tracking-wide">
              BOT
            </span>
            <span className="text-[11px] text-[#949BA4]">Danas u 12:00</span>
          </div>

          {/* Embed card — matches Discord layout exactly */}
          <div
            className="rounded overflow-hidden inline-flex max-w-[480px] w-full mt-0.5"
            style={{ borderLeft: `4px solid ${color}`, backgroundColor: "#2B2D31" }}
          >
            <div className="p-3 flex-1 min-w-0">
              {/* Author line (optional — blank for now) */}

              {/* Title */}
              {title && (
                <div className="font-semibold text-[#F2F3F5] text-sm leading-snug mb-1">
                  {renderText(title)}
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="text-[#DBDEE1] text-sm leading-relaxed whitespace-pre-wrap mb-2">
                  {renderText(description)}
                </div>
              )}

              {/* Fields */}
              {(() => {
                const displayFields = (fieldsProp ?? embed.fields) ?? [];
                return displayFields.length > 0 && (
                  <div className="grid gap-x-4 gap-y-2 mt-2" style={{
                    gridTemplateColumns: displayFields.every(f => f.inline)
                      ? "repeat(3, 1fr)"
                      : "1fr"
                  }}>
                    {displayFields.map((f, i) => (
                      <div key={i} className={f.inline ? "" : "col-span-full"}>
                        <div className="text-[12px] font-bold text-[#F2F3F5] mb-0.5">{renderText(f.name)}</div>
                        <div className="text-[12px] text-[#DBDEE1]">{renderText(f.value)}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Footer */}
              {embed.footer && (
                <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-[#949BA4] flex items-center gap-1.5">
                  {embed.footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmbedEditor({ embed, isFullscreen, onToggleFullscreen }: {
  embed: EmbedTemplate;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateEmbedMutation = useUpdateEmbed();

  const [title, setTitle] = useState(embed.title ?? "");
  const [description, setDescription] = useState(embed.description ?? "");
  const [color, setColor] = useState(embed.color ?? "#2B2D42");
  const [fields, setFields] = useState<EmbedField[]>(embed.fields ?? []);

  // Resizable panel state
  const [formWidth, setFormWidth] = useState(280);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onResizeStart = (e: React.MouseEvent) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = formWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = e.clientX - startX.current;
      setFormWidth(Math.max(200, Math.min(480, startWidth.current + delta)));
    };
    const onUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    setTitle(embed.title ?? "");
    setDescription(embed.description ?? "");
    setColor(embed.color ?? "#2B2D42");
    setFields(embed.fields ?? []);
  }, [embed.name]);

  const updateField = (i: number, key: "name" | "value", val: string) => {
    setFields((fs: EmbedField[]) => fs.map((f: EmbedField, idx: number) => idx === i ? { ...f, [key]: val } : f));
  };

  const handleSave = () => {
    updateEmbedMutation.mutate(
      { name: embed.name, data: { title, description, color, fields } },
      {
        onSuccess: () => {
          toast({ title: "Embed sacuvan" });
          queryClient.invalidateQueries({ queryKey: getListEmbedsQueryKey() });
        },
        onError: () => toast({ title: "Greska pri cuvanju", variant: "destructive" }),
      }
    );
  };

  const catColor = getCategoryColor(embed.category ?? "");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: `${catColor}15`, border: `1px solid ${catColor}30` }}>
            📝
          </div>
          <div>
            <span className="font-black text-white text-sm">
              {EMBED_DISPLAY_NAMES[embed.name] ?? embed.title ?? embed.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catColor }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: catColor }}>
                {embed.category}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Izlaz iz fullscreen (Esc)" : "Fullscreen editor"}
              className="p-2 rounded-lg transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#a5b4fc"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#6b7280"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateEmbedMutation.isPending}
            data-testid="button-save-embed"
            className="border-0 font-bold"
            style={{ background: catColor, color: "#fff" }}
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {updateEmbedMutation.isPending ? "Čuvanje..." : "Sačuvaj"}
          </Button>
        </div>
      </div>

      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Form */}
        <div className="flex-shrink-0 p-5 space-y-5 border-r border-[#1E1F22] overflow-y-auto" style={{ width: formWidth }}>
          <TextFieldWithEmoji
            label="Naslov"
            value={title}
            onChange={setTitle}
            testId="input-embed-title"
          />
          <TextFieldWithEmoji
            label="Opis"
            value={description}
            onChange={setDescription}
            multiline
            testId="input-embed-description"
          />
          <div className="space-y-1.5">
            <Label className="text-[#B5BAC1] text-xs font-semibold uppercase tracking-wide">Boja</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-9 h-9 p-0.5 rounded cursor-pointer border-0 bg-transparent"
                data-testid="input-embed-color-picker"
              />
              <Input
                value={color}
                onChange={e => setColor(e.target.value)}
                className="flex-1 bg-[#1E1F22] border-[#2B2D31] text-[#F2F3F5] font-mono text-sm uppercase"
                data-testid="input-embed-color-text"
              />
            </div>
          </div>

          {fields.length > 0 && (
            <div className="space-y-3">
              <Label className="text-[#B5BAC1] text-xs font-semibold uppercase tracking-wide">Polja</Label>
              {fields.map((f, i) => (
                <div key={i} className="bg-[#1E1F22] rounded-md p-2.5 space-y-2 border border-[#2B2D31]">
                  <TextFieldWithEmoji
                    label={`Naslov polja ${i + 1}`}
                    value={f.name}
                    onChange={v => updateField(i, "name", v)}
                    testId={`input-field-name-${i}`}
                  />
                  <TextFieldWithEmoji
                    label="Vrijednost"
                    value={f.value}
                    onChange={v => updateField(i, "value", v)}
                    multiline
                    testId={`input-field-value-${i}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={onResizeStart}
          className="w-1 flex-shrink-0 relative group cursor-col-resize"
          style={{ background: "#1E1F22" }}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-[#5865F2]/30 transition-colors" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "#5865F2" }} />
        </div>

        {/* Preview */}
        <div className="flex-1 p-5 overflow-y-auto bg-[#2B2D31]">
          <div className="text-xs text-[#949BA4] font-semibold uppercase tracking-wider mb-3">Pregled — Discord izgled</div>
          <DiscordEmbedPreview
            embed={embed}
            title={title}
            description={description}
            color={color}
            fields={fields}
          />

          <div className="mt-4 text-[11px] text-[#949BA4] space-y-1">
            <div>Varijable poput <code className="bg-[#1E1F22] px-1 rounded text-[#F1C40F]">{"{user}"}</code> zamjenjuje bot pri slanju.</div>
            <div>Emoji format: <code className="bg-[#1E1F22] px-1 rounded text-[#F1C40F]">{"<:ime:id>"}</code> — koristi pikač desno od polja.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Embeds() {
  const { data: embeds, isLoading } = useListEmbeds();
  const [selectedEmbed, setSelectedEmbed] = useState<EmbedTemplate | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Escape to exit fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsFullscreen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Resizable sidebar
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const sidebarResizing = useRef(false);
  const sidebarStartX = useRef(0);
  const sidebarStartW = useRef(0);

  const onSidebarResizeStart = (e: React.MouseEvent) => {
    sidebarResizing.current = true;
    sidebarStartX.current = e.clientX;
    sidebarStartW.current = sidebarWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!sidebarResizing.current) return;
      const delta = e.clientX - sidebarStartX.current;
      setSidebarWidth(Math.max(180, Math.min(380, sidebarStartW.current + delta)));
    };
    const onUp = () => {
      sidebarResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Auto-select first embed once loaded
  useEffect(() => {
    if (embeds && embeds.length > 0 && !selectedEmbed) {
      setSelectedEmbed(embeds[0]);
    }
  }, [embeds]);

  // Group embeds by category
  const grouped = useMemo(() => {
    if (!embeds) return [];
    const map = new Map<string, EmbedTemplate[]>();
    for (const embed of embeds) {
      const cat = embed.category ?? "Ostalo";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(embed);
    }
    return Array.from(map.entries()).map(([cat, items]) => ({ cat, items }));
  }, [embeds]);

  const filteredGrouped = useMemo(() => {
    const q = sidebarSearch.toLowerCase();
    if (!q) return grouped;
    return grouped.map(({ cat, items }) => ({
      cat,
      items: items.filter(e =>
        (EMBED_DISPLAY_NAMES[e.name] ?? e.title ?? e.name).toLowerCase().includes(q)
      ),
    })).filter(g => g.items.length > 0);
  }, [grouped, sidebarSearch]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="flex gap-4">
          <Skeleton className="h-[500px] w-56 flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)" }} />
          <Skeleton className="h-[500px] flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>
    );
  }

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 flex flex-col"
    : "flex flex-col h-full -m-6";

  return (
    <div className={containerClass} style={{ background: isFullscreen ? "#0a0b0f" : undefined }}>
      <div className="flex h-full min-h-0">
        {/* ── Sidebar ── */}
        <div
          className="flex-shrink-0 flex flex-col overflow-hidden"
          style={{
            width: sidebarWidth,
            background: "rgba(255,255,255,0.02)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Sidebar header */}
          <div className="px-3 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 mb-3">
              <LayoutTemplate className="w-4 h-4" style={{ color: "#6366f1" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6366f1" }}>
                Embed Templates
              </span>
              <div className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
                {embeds?.length ?? 0}
              </div>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5" style={{ color: "#4b5563" }} />
              <input
                placeholder="Pretraži..."
                value={sidebarSearch}
                onChange={e => setSidebarSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs text-white placeholder:text-gray-600 outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            </div>
          </div>

          {/* Grouped list */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
            {filteredGrouped.map(({ cat, items }) => {
              const color = getCategoryColor(cat);
              return (
                <div key={cat}>
                  {/* Category header */}
                  <div className="flex items-center gap-2 px-1 mb-1.5">
                    <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] flex-shrink-0"
                      style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                      {cat === "Sistem" ? "⚙️" : cat === "Log" ? "📋" : cat === "Moderacija" ? "🛡️" :
                       cat === "XP" ? "⭐" : cat === "Ekonomija" ? "💰" : cat === "Igre" ? "🎮" :
                       cat === "Fun" ? "😄" : cat === "Ljubavne" ? "💕" : cat === "Info" ? "ℹ️" : "📌"}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color }}>{cat}</span>
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}30, transparent)` }} />
                    <span className="text-[9px] font-bold" style={{ color: `${color}80` }}>{items.length}</span>
                  </div>

                  {/* Embed buttons */}
                  <div className="space-y-0.5 pl-1">
                    {items.map(embed => {
                      const isSelected = selectedEmbed?.name === embed.name;
                      return (
                        <button
                          key={embed.name}
                          onClick={() => setSelectedEmbed(embed)}
                          data-testid={`select-embed-${embed.name}`}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-all text-xs group"
                          style={{
                            background: isSelected ? `${color}15` : "transparent",
                            border: isSelected ? `1px solid ${color}30` : "1px solid transparent",
                            color: isSelected ? "#F2F3F5" : "#6b7280",
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) {
                              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                              (e.currentTarget as HTMLElement).style.color = "#d1d5db";
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                              (e.currentTarget as HTMLElement).style.color = "#6b7280";
                            }
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: isSelected ? color : embed.color ?? color, opacity: isSelected ? 1 : 0.6 }}
                          />
                          <span className="truncate font-medium">
                            {EMBED_DISPLAY_NAMES[embed.name] ?? embed.title ?? embed.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Sidebar resize handle ── */}
        <div
          onMouseDown={onSidebarResizeStart}
          className="w-1 flex-shrink-0 relative group cursor-col-resize"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-indigo-500/20 transition-colors" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "#6366f1" }} />
        </div>

        {/* ── Main editor ── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden" style={{ background: "#1a1b1e" }}>
          {selectedEmbed ? (
            <EmbedEditor
              key={selectedEmbed.name}
              embed={selectedEmbed}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(f => !f)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                📝
              </div>
              <div className="text-white font-semibold">Odaberi embed template</div>
              <div className="text-xs" style={{ color: "#4b5563" }}>Klikni na template s lijeve strane</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
