import { Router } from "express";
import { eq } from "drizzle-orm";

const router = Router();

// Lazy DB — works fine when DATABASE_URL is set, falls back silently when not.
let _db: typeof import("@workspace/db").db | null = null;
let _embedsTable: typeof import("@workspace/db").embedsTable | null = null;
let _dbAvailable: boolean | null = null;

async function getDb() {
  if (_dbAvailable === false) return null;
  if (_db && _embedsTable) return { db: _db, embedsTable: _embedsTable };
  try {
    const mod = await import("@workspace/db");
    _db = mod.db;
    _embedsTable = mod.embedsTable;
    _dbAvailable = true;
    return { db: _db, embedsTable: _embedsTable };
  } catch {
    _dbAvailable = false;
    return null;
  }
}

export const DEFAULT_EMBEDS = [

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━ SISTEM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "welcome",
    title: "👑  Dobrodošao/la, {user}!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ Drago nam je što si ovdje! 💕\n" +
      "➜ Pogledaj kanale i upoznaj zajednicu!\n" +
      "🐾 **discord.gg/gian**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Dobrodošao/la!",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "💜 Član #{count}", value: "Hvala što si nam se pridružio/la!", inline: false },
      { name: "⭐ Registracija",       value: "{accountAge}",                    inline: true  },
      { name: "🔒 Pridružio/la se",     value: "{joinedAt}",                      inline: true  },
    ],
  },
  {
    name: "leave",
    title: "➜  {user} je napustio/la server",
    description:
      "💜 Žao nam je što si otišao/la. 💕\n" +
      "🐾 Uvijek si dobrodošao/la nazad!",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Do viđenja!",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "⭐ Proveo/la na serveru", value: "{timeOnServer}", inline: true },
      { name: "💎 Preostalo članova",      value: "`{memberCount}`", inline: true },
    ],
  },
  {
    name: "dm-welcome",
    title: "✨  Dobrodošao/la na GIAN, {user}!",
    description:
      "💕 Hvala ti što si se pridružio/la!\n\n" +
      "👑 **discord.gg/gian**\n\n" +
      "🐾 Pročitaj pravila u kanalu `#pravila` i uživaj!\n" +
      "💜 Za pomoć, pišite u `#podrška`.",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI (Custom) • Dobrodošao/la!",
    thumbnail: null,
    fields: [],
  },
  {
    name: "boost",
    title: "✨  BOOST — Hvala ti, {user}!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 **{user}** je boostao/la server!\n" +
      "✨ Zahvaljujući tebi server raste!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI (Custom) • Server Boost",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "⭐ Ukupno boostova",  value: "`{boostCount}`",     inline: true },
      { name: "⭐ Nivo servera",    value: "Nivo `{serverLevel}`", inline: true },
      { name: "💕 Nagrada",          value: "<@&{rewardRole}>",   inline: false },
    ],
  },
  {
    name: "birthday",
    title: "✨  Sretan Rođendan, {user}!",
    description:
      "✨ Danas je poseban dan — **{user}** slavi **{years}. rođendan!**\n" +
      "💕 Svi čestitajmo! ✨\n" +
      "👑 Uži i neka ti je sretan dan!",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI (Custom) • Rođendan",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "🪙 Poklon od bota", value: "`+{poklon}` 🪙",  inline: true },
      { name: "⭐ Uloga dana",   value: "<@&{bdayRole}>", inline: true },
    ],
  },
  {
    name: "starboard",
    title: "⭐  Starboard — {stars} zvjezdica",
    description:
      "✨ Popularna poruka od **{author}** je istaknuta!\n" +
      "➜ [{previewText}]({jumpUrl})",
    color: "#f59e0b",
    category: "Sistem",
    footer: "GIANNI (Custom) • Starboard • #{channel}",
    thumbnail: null,
    fields: [
      { name: "⭐ Zvjezdica",       value: "`{stars}`",       inline: true  },
      { name: "⭐ Kanal",            value: "<#{channelId}>",  inline: true  },
      { name: "➜ Skoči", value: "[Idi na poruku]({jumpUrl})", inline: false },
    ],
  },
  {
    name: "aotw",
    title: "👑  Član Sedmice!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{user}** je odabran/a za člana sedmice!\n" +
      "✨ Svako glasanje je važilo — hvala svima!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI (Custom) • Član Sedmice",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "⭐ Pobjednik/ca", value: "{user}",         inline: true },
      { name: "⭐ Glasova",       value: "`{votes}`",      inline: true },
      { name: "🪙 Nagrada",          value: "`+{nagrada}` 🪙", inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ SISTEM PANELI ━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "ticket",
    title: "🔒  Podrška — Otvori Ticket",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "💜 Trebaš pomoć? Klikni dugme ispod!\n" +
      "➜ Staff će ti odgovoriti što prije.\n" +
      "🐾 Svaki ticket je privatan i siguran.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI (Custom) • Ticket Sistem",
    thumbnail: null,
    fields: [
      { name: "⭐ Dostupnost",        value: "Uvijek otvoreni",   inline: true },
      { name: "✅ Odgovor",    value: "Što brže moguće",   inline: true },
      { name: "💎 Privatnost",    value: "Samo ti i staff",   inline: true },
    ],
  },
  {
    name: "ticket-otvoren",
    title: "🔒  Ticket #{id} — Otvoren",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "➜ Tvoj ticket je kreiran, **{user}**!\n" +
      "💜 Opiši problem u detalje i staff će se javiti.\n" +
      "🐾 Budi strpljiv/a!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI (Custom) • Ticket #{id}",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "✅ Otvorio/la", value: "{user}",     inline: true },
      { name: "⭐ Datum",             value: "{date}",     inline: true },
      { name: "💎 Kategorija",    value: "{category}", inline: true },
    ],
  },
  {
    name: "staff-prijava",
    title: "👑  Staff Prijava",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ Zanimaju te staff pozicije na GIAN serveru?\n" +
      "➜ Popuni formu klikom na dugme ispod!\n" +
      "💜 Tražimo posvećene i aktivne članove.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI (Custom) • Staff Prijava",
    thumbnail: null,
    fields: [
      { name: "⭐ Min. aktivnost", value: "30 dana na serveru",  inline: true },
      { name: "✅ Potrebno",      value: "Dobre komunikacije",  inline: true },
      { name: "💕 Benefiti",       value: "Ekskluzivne uloge",   inline: true },
    ],
  },
  {
    name: "private-vc",
    title: "🔒  Privatni Voice Kanal",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "💜 Upravljaj svojim privatnim kanalom!\n" +
      "➜ Koristi dugmad ispod za postavke.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI (Custom) • Privatni VC",
    thumbnail: null,
    fields: [
      { name: "✅ Vlasnik",  value: "{owner}",   inline: true },
      { name: "🐾 Korisnici", value: "`{count}`", inline: true },
      { name: "💎 Limit",       value: "`{limit}`", inline: true },
    ],
  },
  {
    name: "voice-pravila",
    title: "💜  Voice Kanali — Pravila",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "➜ **Uvažavaj ostale korisnike**\n" +
      "➜ **Ne ometaj razgovor namjerno**\n" +
      "➜ **Zabranjen je eksplicitni sadržaj**\n" +
      "➜ **Ne snimai bez pristanka**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 Kršenje = mute / kick",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI (Custom) • Voice Pravila",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━ LOG ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "log-join",
    title: "✨  Novi Član",
    description:
      "✨ **{user}** se pridružio/la serveru!\n" +
      "⭐ Datum kreiranja računa: `{accountAge}`",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI (Custom) • Log • Join",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "✅ ID",           value: "`{userId}`",     inline: true },
      { name: "⭐ Pridružio/la",        value: "{joinedAt}",     inline: true },
      { name: "💎 Ukupno članova",  value: "`{memberCount}`", inline: true },
    ],
  },
  {
    name: "log-edit",
    title: "⭐  Poruka Izmijenjena",
    description:
      "💜 **{user}** je izmijenio/la poruku u <#{channel}>.",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI (Custom) • Log • Edit",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "✨ Stara poruka",      value: "```{before}```", inline: false },
      { name: "✨ Nova poruka",     value: "```{after}```",  inline: false },
      { name: "⭐ Datum",                           value: "{date}",         inline: true  },
    ],
  },
  {
    name: "log-delete",
    title: "✨  Poruka Obrisana",
    description:
      "🛡️ **{user}** je obrisao/la poruku u <#{channel}>.",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI (Custom) • Log • Delete",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "⭐ Sadržaj", value: "```{content}```", inline: false },
      { name: "💎 Kanal",    value: "<#{channel}>",    inline: true  },
      { name: "⭐ Datum",        value: "{date}",          inline: true  },
    ],
  },
  {
    name: "report",
    title: "⭐  Nova Prijava",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "🛡️ Korisnik je prijavljen stafu!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "💜 Razlog: **{reason}**",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI (Custom) • Report",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "🛡️ Prijavljeni", value: "{target}",   inline: true },
      { name: "🐾 Prijavio/la",      value: "{reporter}", inline: true },
      { name: "⭐ Datum",                  value: "{date}",     inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ MODERACIJA ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "warn",
    title: "⭐  Upozorenje!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{target}** je dobio/la upozorenje!\n" +
      "🛡️ Razlog: **{reason}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "💜 Ponavljanje prekršaja = ban.",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "🛡️ Moderator", value: "{mod}",              inline: true },
      { name: "⭐ Datum",                value: "{date}",             inline: true },
      { name: "⭐ Warn #{n}",       value: "od max `{max}`",     inline: true },
    ],
  },
  {
    name: "ban",
    title: "⭐  Član Banovan",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{target}** je banovan/a sa servera.\n" +
      "🛡️ Razlog: **{reason}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "🛡️ Izvršio",  value: "{mod}",      inline: true },
      { name: "⭐ Datum",               value: "{date}",     inline: true },
      { name: "✨ Trajanje",       value: "{duration}", inline: true },
    ],
  },
  {
    name: "mod-kick",
    title: "⭐  Član Kickovan",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{target}** je kickovan/a sa servera.\n" +
      "🛡️ Razlog: **{reason}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "🛡️ Izvršio", value: "{mod}",  inline: true },
      { name: "⭐ Datum",              value: "{date}", inline: true },
    ],
  },
  {
    name: "mod-mute",
    title: "⭐  Član Mutovan",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{target}** ne može slati poruke **{duration}**.\n" +
      "🛡️ Razlog: **{reason}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "🛡️ Izvršio", value: "{mod}",      inline: true },
      { name: "⭐ Trajanje",           value: "{duration}", inline: true },
      { name: "✨ Ističe",        value: "{expires}",  inline: true },
    ],
  },
  {
    name: "mod-unmute",
    title: "⭐  Član Odmutovan",
    description:
      "✨ **{target}** može ponovo slati poruke!\n" +
      "✅ Mute je uklonjen od strane moderatora.",
    color: "#22c55e",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "🛡️ Izvršio", value: "{mod}",  inline: true },
      { name: "⭐ Datum",              value: "{date}", inline: true },
    ],
  },
  {
    name: "mod-timeout",
    title: "⭐  Timeout",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{target}** je u timeoutu na **{duration}**.\n" +
      "🛡️ Razlog: **{reason}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "🛡️ Izvršio", value: "{mod}",      inline: true },
      { name: "⭐ Trajanje",           value: "{duration}", inline: true },
      { name: "✨ Ističe",        value: "{expires}",  inline: true },
    ],
  },
  {
    name: "mod-purge",
    title: "⭐  Poruke Obrisane",
    description:
      "✨ Obrisano **{count}** poruka u <#{channel}>.\n" +
      "🛡️ Izvršio: **{mod}**",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Purge",
    thumbnail: null,
    fields: [
      { name: "💎 Obrisano", value: "`{count}` poruka", inline: true },
      { name: "⭐ Kanal",        value: "<#{channel}>",     inline: true },
    ],
  },
  {
    name: "mod-unban",
    title: "⭐  Član Odbanovan",
    description:
      "✨ **{target}** je odbanovan/a sa servera.\n" +
      "✅ Može se ponovo pridružiti serveru.",
    color: "#22c55e",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: null,
    fields: [
      { name: "🛡️ Izvršio", value: "{mod}",  inline: true },
      { name: "⭐ Datum",              value: "{date}", inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ XP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "levelup",
    title: "✨  Level Up!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{user}** je dostigao/la nivo **{level}**!\n" +
      "💕 Nastavi biti aktivan/na!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • XP Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "⭐ Novi nivo",      value: "`{level}`",      inline: true },
      { name: "⭐ Ukupno XP", value: "`{xp}`",        inline: true },
      { name: "🪙 Nagrada",           value: "`+{reward}` 🪙", inline: true },
    ],
  },
  {
    name: "vatrica-nova",
    title: "🔥  Nova Vatrica!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{user}** je zaslužio/la novu vatricu!\n" +
      "🔥🔥🔥 Ukupno vatrica: **{count}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • Vatrice",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "🔥 Vatrice",               value: "`{count}`",    inline: true },
      { name: "⭐ Poruka",    value: "`{messages}`", inline: true },
    ],
  },
  {
    name: "aktivnost",
    title: "⭐  Aktivnost — Podsjetnik",
    description:
      "➜ **{user}**, nisi bio/la aktivan/na neko vrijeme!\n" +
      "🐾 Chati, igraj igre i prikupljaj XP!",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • XP Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "⭐ Neaktivan/na", value: "{inactive}", inline: true },
      { name: "⭐ XP",     value: "`{xp}`",    inline: true },
    ],
  },
  {
    name: "rank",
    title: "⭐  Rang — {user}",
    description:
      "➜ Tvoj trenutni rang i XP statistika:",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • XP Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "⭐ Rang",           value: "`#{rank}`",         inline: true },
      { name: "⭐ Nivo",            value: "`{level}`",         inline: true },
      { name: "⭐ XP",        value: "`{xp} / {nextXp}`", inline: true },
      { name: "🐾 Progres",         value: "`{progressBar}`",   inline: false },
    ],
  },
  {
    name: "leaderboard-xp",
    title: "⭐  Top Lista — XP",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 **{top1}** — Nivo `{top1lvl}` · `{top1xp}` XP\n" +
      "⭐ **{top2}** — Nivo `{top2lvl}` · `{top2xp}` XP\n" +
      "✅ **{top3}** — Nivo `{top3lvl}` · `{top3xp}` XP\n" +
      "⭐ **{top4}** — Nivo `{top4lvl}` · `{top4xp}` XP\n" +
      "➜ **{top5}** — Nivo `{top5lvl}` · `{top5xp}` XP\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "⭐ Tvoje mjesto: **#{myRank}**",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • XP Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "leaderboard-novac",
    title: "⭐  Top Lista — Novac",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 **{top1}** — `{top1coins}` 🪙\n" +
      "⭐ **{top2}** — `{top2coins}` 🪙\n" +
      "✅ **{top3}** — `{top3coins}` 🪙\n" +
      "⭐ **{top4}** — `{top4coins}` 🪙\n" +
      "➜ **{top5}** — `{top5coins}` 🪙\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "🪙 Tvoje mjesto: **#{myRank}** · `{myCoins}` 🪙",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • Novac Top Lista",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ EKONOMIJA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "heist",
    title: "⭐  RAZBOJ — U Pripremi!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "🔒 **{user}** organizuje razboj!\n" +
      "✨ Klikni **Pridruži se** i osvoji nagradu!\n" +
      "⭐ Potrebno **3 ili više** učesnika.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "⭐ Kreće za **30 sekundi!**",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: null,
    fields: [
      { name: "🐾 Učesnici",  value: "`{count}/10`",             inline: true },
      { name: "🪙 Ciljna suma",  value: "`{target}` 🪙",            inline: true },
      { name: "⭐ Rizik",      value: "`{risk}%` šansa propasti", inline: true },
    ],
  },
  {
    name: "lottery",
    title: "✨  Sedmična Loto",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "🎉 Kupi tiket i osvoji **JACKPOT!**\n" +
      "🪙 Svaki tiket košta **100 coina**.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • /lottery buy",
    thumbnail: null,
    fields: [
      { name: "🪙 Jackpot",           value: "`{pot}` 🪙",        inline: true },
      { name: "✨ Moji tiketi",           value: "`{my}` / `{total}`", inline: true },
      { name: "✨ Šansa pobjede", value: "`{chance}%`",        inline: true },
      { name: "⭐ Sljedeći žrijeb",      value: "{nextDraw}",         inline: false },
    ],
  },
  {
    name: "quests",
    title: "⭐  Dnevni Zadaci",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ Završi zadatke i osvoji nagrade!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "⭐ **Pošalji 10 poruka**\n`░░░░░░░░░░` `0/10` · 🪙 `+200`\n\n" +
      "✅ **Odigraj 3 igre**\n`██████████` `3/3` · 🪙 `+500` ✅\n\n" +
      "⭐ **Pošalji kompliment**\n`░░░░░░░░░░` `0/1` · 🪙 `+300`",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Resetuju se u ponoć UTC",
    thumbnail: null,
    fields: [
      { name: "✅ Završeno", value: "`{done}/3`",    inline: true },
      { name: "🪙 Zarađeno",     value: "`{ukupno}` 🪙", inline: true },
      { name: "⭐ Reset",           value: "Sutra 00:00",   inline: true },
    ],
  },
  {
    name: "giveaway",
    title: "✨  NAGRADNA IGRA!",
    description:
      "## 👑  {nagrada}\n\n" +
      "✨ Klikni **Učestvuj** i osvoji nagradu!\n" +
      "💕 Sretno svima!",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Giveaway",
    thumbnail: null,
    fields: [
      { name: "⭐ Završava",           value: "{kraj}",       inline: true },
      { name: "🐾 Učesnici",     value: "`{ucesnici}`", inline: true },
      { name: "⭐ Pobjednika",  value: "`{count}`",    inline: true },
      { name: "✨ Domaćin",             value: "{domaćin}",   inline: false },
    ],
  },
  {
    name: "giveaway-end",
    title: "⭐  Nagradna Igra — ZAVRŠENA!",
    description:
      "## 💕  {nagrada}\n\n" +
      "✨ Čestitamo pobjedniku! ✨",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Giveaway završen",
    thumbnail: null,
    fields: [
      { name: "⭐ Pobjednik/ca", value: "{pobjednik}",  inline: true },
      { name: "🐾 Učesnici",      value: "`{ucesnici}`", inline: true },
      { name: "✨ Domaćin",              value: "{domaćin}",   inline: true },
    ],
  },
  {
    name: "eco-balance",
    title: "⭐  Novčanik — {user}",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "🪙 Pregled tvog financijskog stanja:\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "🪙 Gotovina",      value: "`{cash}` 🪙",  inline: true },
      { name: "💎 Banka",        value: "`{bank}` 🪙",  inline: true },
      { name: "⭐ Ukupno",    value: "`{total}` 🪙", inline: true },
    ],
  },
  {
    name: "eco-daily",
    title: "⭐  Dnevna Nagrada",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{user}** je preuzeo/la dnevnu nagradu!\n" +
      "💕 Streak: **{streak} dana** zaredom!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Sutra možeš ponovo",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "🪙 Nagrada",         value: "`+{amount}` 🪙",     inline: true },
      { name: "⭐ Streak bonus", value: "`+{bonus}` 🪙",      inline: true },
      { name: "💎 Novi balans",    value: "`{total}` 🪙",       inline: true },
    ],
  },
  {
    name: "eco-work",
    title: "⭐  Posao — {job}",
    description:
      "✨ **{user}** je radio/la kao **{job}**!\n" +
      "🪙 Zaradio/la: **{amount}** kovanica!",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Sljedeći posao za {cooldown}",
    thumbnail: null,
    fields: [
      { name: "🪙 Zarada",  value: "`+{amount}` 🪙", inline: true },
      { name: "💎 Balans", value: "`{total}` 🪙",   inline: true },
    ],
  },
  {
    name: "eco-shop",
    title: "⭐  S H O P — Prodavnica",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ Dobrodošao/la u GIAN prodavnicu!\n" +
      "🪙 Kupi role, iteme i privilegije.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Shop",
    thumbnail: null,
    fields: [
      { name: "⭐ VIP Role",              value: "`5.000` 🪙",  inline: true },
      { name: "👑 Premium",        value: "`10.000` 🪙", inline: true },
      { name: "💎 Dijamant",                        value: "`25.000` 🪙", inline: true },
    ],
  },
  {
    name: "eco-buy",
    title: "⭐  Kupovina Uspješna!",
    description:
      "✨ **{user}** je kupio/la **{item}**!\n" +
      "💕 Uživaj u kupovini!",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Shop",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "🪙 Plaćeno",   value: "`-{price}` 🪙",   inline: true },
      { name: "💎 Ostalo",   value: "`{balance}` 🪙",  inline: true },
    ],
  },
  {
    name: "eco-transfer",
    title: "⭐  Transfer Kovanica",
    description:
      "🪙 **{from}** je poslao/la **{amount}** 🪙 → **{to}**\n" +
      "✅ Transfer uspješno izvršen!",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: null,
    fields: [
      { name: "🪙 Iznos",                         value: "`{amount}` 🪙", inline: true },
      { name: "⭐ Pošiljalac",         value: "{from}",        inline: true },
      { name: "➜ Primalac",         value: "{to}",          inline: true },
    ],
  },
  {
    name: "eco-rob",
    title: "⭐  Pljačka!",
    description:
      "✨ **{user}** je pokušao/la opljačkati **{target}**!\n" +
      "{result}",
    color: "#ef4444",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: null,
    fields: [
      { name: "🪙 Ukradeno", value: "`{stolen}` 🪙", inline: true },
      { name: "⭐ Kazna",  value: "`{fine}` 🪙",   inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━ IGRE — NE DIRATI! ━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "slots",
    title: "⭐ S L O T  M A Š I N A",
    description: "𓉘  ⭐  │  ⭐  │  ⭐  𓉝\n\n🎉 Sva tri ista — **JACKPOT!**",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "🪙 Ulog",    value: "`{ulog} 🪙`",                                              inline: true },
      { name: "⭐ Rezultat", value: "🎉 **+{dobitak} 🪙** *(×3)*", inline: true },
      { name: "🔒 Balans", value: "`{balans} 🪙`",                                          inline: true },
    ],
  },
  {
    name: "blackjack",
    title: "⭐ Blackjack",
    description: null,
    color: "#9B59B6",
    category: "Igre",
    footer: "Oklada: {oklada} 🪙 • GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "Tvoje karte  (17)", value: "🂡 🂮", inline: false },
      { name: "Dealer  (?)",       value: "🂫 🎴", inline: false },
      { name: "Rezultat",          value: "🎉 **BLACKJACK!** `+{dobitak} 🪙`!", inline: false },
    ],
  },
  {
    name: "poker-lobby",
    title: "⭐ POKER — Texas Hold'em",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n🪙 **Ulog po igraču:** `{ulog} 🪙`\n⭐ **Trenutni pot:** `{pot} 🪙`\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🐾 **Igrači ({count}/9):**\n▸ **{player1}**\n▸ **{player2}**\n\n▸ Klikni **Ulazi u igru** da se pridružiš\n▸ Domaćin klika **Počni igru** kad je spreman\n▸ Igra automatski kreće za **60 sekundi**",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Poker • Min 2, Max 9 igrača",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poker-game",
    title: "⭐ Pre-Flop — Kartice podijeljene",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n⭐ **Zajedničke kartice:**\n`?` `?` `?` `?` `?`\n🪙 **Pot:** `{pot} 🪙`\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🐾 **Aktivni:**\n⭐ **{player1}**\n⭐ **{player2}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔒 **Čekamo potez:**\n⭐ {player1}",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • Klikni 'Vidi kartice' za svoju ruku",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poker-showdown",
    title: "⭐ SHOWDOWN — Poker",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n⭐ **Zajedničke kartice:**\n🂡 🂺 🂳 🃈 🃑\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n⭐ **{winner}**\n   Ruka: 🂡 🂮\n   → **Royal Flush**\n\n⭐ **{loser}**\n   Ruka: 🃁 🃎\n   → **Dva Para**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🪙 **Dobitak:** `{dobitak} 🪙` po pobjedniku",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Poker završen",
    thumbnail: null,
    fields: [],
  },
  {
    name: "among-us-lobby",
    title: "⭐ Among Us — Lobby",
    description: "Pridruži se i čekaj da host pokrene igru!\n**Min 4 • Max 10 igrača**",
    color: "#9B59B6",
    category: "Igre",
    footer: "Host: klikni Pokreni igru kad ste svi tu!",
    thumbnail: null,
    fields: [
      { name: "🐾 Igrači (2/10)", value: "🛡️ Player1\n⭐ Player2", inline: false },
    ],
  },
  {
    name: "among-us-game",
    title: "⭐ Among Us — U Toku",
    description: null,
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Among Us",
    thumbnail: null,
    fields: [
      { name: "🐾 Igrači",          value: "🛡️ Player1\n⭐ Player2\n🔒 ~~Player3~~", inline: false },
      { name: "⭐ Zadaci", value: "⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ `3/10`", inline: true },
      { name: "⭐ Živi",         value: "2 crew | 1 imp", inline: true },
    ],
  },
  {
    name: "among-us-end",
    title: "⭐ CREWMATI POBIJEDE!",
    description: "Svi impostori eliminirani! ⭐",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Among Us",
    thumbnail: null,
    fields: [
      { name: "🐾 Otkrivene uloge", value: "⭐ **Player1** — CREWMATE\n🔒 **Player2** — IMPOSTOR", inline: false },
    ],
  },
  {
    name: "kaladont-start",
    title: "⭐ K A L A D O N T",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n✨ Igra je počela! Prva riječ:\n## ⭐  **BALKAN**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "Pokrenuo/la: {user}  •  Pritisni dugme za kraj",
    thumbnail: null,
    fields: [
      { name: "➜  Sljedeća počinje sa", value: "## **`AN`**",                                                 inline: true  },
      { name: "⭐  Težina",                   value: "⭐ Normalno · 2 slova",       inline: true  },
      { name: "⭐  Niz",                               value: "**#1**",                                                       inline: true  },
      {
        name: "⭐  Pravila igre",
        value:
          "⭐ Svaka riječ počinje traženim slovima\n🔒 Ista osoba **ne može** igrati iza sebe\n➜ Ponavljanje iste riječi nije dozvoljeno\n✨ **50/50 sudbina** — čak i ispravna može propasti!\n⭐ Pritisni **Pomoć** za primjer riječi\n⭐ Upiši **`KALADONT`** i osvoji **1500** 🪙!",
        inline: false,
      },
    ],
  },
  {
    name: "kaladont-active",
    title: "⭐ K A L A D O N T  —  aktivna igra",
    description: "━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "Pritisni dugme za kraj igre",
    thumbnail: null,
    fields: [
      { name: "✨  Zadnja riječ",        value: "**`ANKETA`**", inline: true  },
      { name: "⭐  Odigrao/la",               value: "Korisnik",     inline: true  },
      { name: "⭐  Niz",                           value: "**#5**",       inline: true  },
      { name: "➜  Sljedeća počinje sa", value: "## **`TA`**", inline: false },
    ],
  },
  {
    name: "kaladont-word",
    title: null,
    description: "## ✨  **TAČKA**\n*⭐ Korisnik*",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI Kaladont  •  #6",
    thumbnail: null,
    fields: [
      { name: "➜  Sljedeća počinje sa", value: "## **`KA`**", inline: true },
      { name: "⭐  Niz",                               value: "**#6**",      inline: true },
    ],
  },
  {
    name: "kaladont-win",
    title: "⭐ K A L A D O N T  —  P O B J E D A !",
    description: "🎉 {user} je izrekao/la magičnu riječ!",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • Kaladont pobjeda",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "⭐  Pobjednik/ca", value: "**{user}**",                                    inline: true },
      { name: "⭐  Riječi u nizu",  value: "**{count}**",                                   inline: true },
      { name: "🪙  Nagrada",         value: "**+1.500 🪙**", inline: true },
      { name: "✨  XP",          value: "**+200**",                                      inline: true },
    ],
  },
  {
    name: "bingo",
    title: "⭐ B  I  N  G  O",
    description:
      "⭐ **Klikni dugme ispod i unesi 5 brojeva (1–75)!**\n✨ Tiket košta samo **500 coina** 🪙\n\n🔒 Imaš **2 minute** za tiket!\n✨ Rezultati se objavljuju **javno** za sve",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI Bingo • Cijena tiketa: 500 coina",
    thumbnail: null,
    fields: [
      {
        name: "⭐  Nagradna lista",
        value:
          "⭐ `2 pogotka`  ──  **10.000** 🪙\n⭐ `3 pogotka`  ──  **30.000** 🪙\n⭐ `4 pogotka`  ──  **75.000** 🪙\n⭐ `5 pogodaka` ── **250.000** 🪙  **JACKPOT!**",
        inline: false,
      },
    ],
  },
  // Igre dopune
  {
    name: "vjasala",
    title: "⭐ V J E Š A L A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n⭐ Pogodi skrivenu riječ!\n\n```\n_ _ _ _ _ _\n```\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /vjasala",
    thumbnail: null,
    fields: [
      { name: "💕 Životi",         value: "`{zivoti}/6`",  inline: true },
      { name: "⭐ Pogođena slova", value: "`{pogodjena}`", inline: true },
      { name: "🔒 Promašaji",      value: "`{promasaji}`", inline: true },
    ],
  },
  {
    name: "vjasala-kraj",
    title: "⭐ Vješala — Pogodak!",
    description: "⭐ Čestitamo {user}! Pogodio/la si **{rijec}**! ✨\n🪙 **Nagrada:** `+{nagrada} 🪙`",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • /vjasala",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "toplo-hladno",
    title: "⭐ T O P L O  •  H L A D N O",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n⭐ Pogodi tajni broj (1–{max})!\n\n⭐ **Hladno** — daleko si\n⭐ **Toplo** — bliže si\n💕 **Vrelo** — skoro!\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /toplo-hladno",
    thumbnail: null,
    fields: [
      { name: "⭐ Maksimum",       value: "`{max}`",      inline: true },
      { name: "⭐ Pokušaji",  value: "`{pokusaji}`", inline: true },
      { name: "💕 Status",       value: "{status}",     inline: true },
    ],
  },
  {
    name: "kviz",
    title: "⭐ K V I Z  —  Balkan Pitanje",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n⭐ **{pitanje}**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /kviz • Oklada: {oklada} 🪙",
    thumbnail: null,
    fields: [
      { name: "⭐ A",  value: "{a}", inline: true },
      { name: "⭐ B",  value: "{b}", inline: true },
      { name: "⭐ C",       value: "{c}", inline: true },
      { name: "💕 D",     value: "{d}", inline: true },
    ],
  },
  {
    name: "geografija",
    title: "⭐ G E O G R A F I J A  —  Kviz",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n⭐ **{pitanje}**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /geografija • Oklada: {oklada} 🪙",
    thumbnail: null,
    fields: [
      { name: "⭐ A",  value: "{a}", inline: true },
      { name: "⭐ B",  value: "{b}", inline: true },
      { name: "⭐ C",       value: "{c}", inline: true },
      { name: "💕 D",     value: "{d}", inline: true },
    ],
  },
  {
    name: "mafia-lobby",
    title: "⭐ M A F I A  —  Lobby",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━\n✨ Mafia igra se priprema!\n**Pridruži se klikom na dugme.**\n━━━━━━━━━━━━━━━━━━━━━━━\n⭐ Min: **5** | Max: **12** igrača\n🔒 Igra kreće automatski za **60s** ili kad host klikne Start",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Mafia",
    thumbnail: null,
    fields: [
      { name: "🐾 Igrači ({count}/12)", value: "{igraci}", inline: false },
    ],
  },
  {
    name: "mafia-end",
    title: "⭐ M A F I A  —  Kraj Igre",
    description: "## {rezultat}\n\n{opis}",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • Mafia završena",
    thumbnail: null,
    fields: [
      { name: "🐾 Uloge",       value: "{uloge}",      inline: false },
      { name: "⭐ Pobjednici",  value: "{pobjednici}", inline: true  },
      { name: "🔒 Eliminirani",   value: "{eliminirani}", inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━ FUN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "hunt",
    title: "✨  Ulov!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "## {animal}\n" +
      "⭐ **{rarity}**  ·  💎 Snaga: `{power}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • {user} • /hunt",
    thumbnail: null,
    fields: [
      { name: "✨ Imaš ukupno", value: "`1× {animal}`", inline: true },
      { name: "🪙 Vrijednost",          value: "`{value}` 🪙",  inline: true },
    ],
  },
  {
    name: "zoo",
    title: "⭐  {user} — Moj Zoo",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **Legendary**\n⭐ **Zmaj** `×1`\n\n" +
      "✅ **Uncommon**\n✨ **Vuk** `×3` · **Lisica** `×2`\n\n" +
      "💜 **Common**\n🐾 **Riba** `×7` · **Zec** `×5`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • /hunt za loviti!",
    thumbnail: null,
    fields: [
      { name: "✨ Ukupno životinja", value: "`{total}`",   inline: true },
      { name: "💎 Ukupna snaga",           value: "`{power}`",   inline: true },
      { name: "🪙 Ukupna vrijednost",       value: "`{value}` 🪙", inline: true },
    ],
  },
  {
    name: "battle",
    title: "⚡  B I T K A!",
    description:
      "🐾 **{player1}** ⚔️ 💜 **{player2}**\n" +
      "`████████████░░░░░░░░`\n" +
      "💎 `{score1}` vs `{score2}` 💎",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Battle",
    thumbnail: "{winner.avatar}",
    fields: [
      { name: "⭐ Pobjednik/ca", value: "**{winner}**",  inline: true  },
      { name: "🔒 Poražen/a",      value: "{loser}",       inline: true  },
      { name: "🪙 Nagrada",          value: "`+{nagrada}` 🪙", inline: false },
    ],
  },
  {
    name: "pray",
    title: "✨  Molitva",
    description:
      "💕 **{user}** moli se za **{target}**!\n" +
      "✨ Nebo čuje — **+{bonus}** 🪙 palo s neba! 🎉",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Molitva",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vers",
    title: "✨  Vers — Drop the Mic",
    description:
      "> ✨\n" +
      "> *Ovo je primjer versa koji korisnik pošalje*\n" +
      "> *Svaki red je jedan stih*\n" +
      "> ✨",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • vers • drop the mic",
    thumbnail: null,
    fields: [
      { name: "✨ Izvođač",              value: "{user}",        inline: true },
      { name: "✨ Reakcije",  value: "`{reactions}`", inline: true },
    ],
  },
  {
    name: "kompli",
    title: "🌹  Kompliment",
    description:
      "💕 **{from}** kaže **{to}**:\n" +
      "*\u201eTi si razlog zašto dan počinje sa osmijehom.\u201c* ✨",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Kompliment",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "fora",
    title: "😏  Fora",
    description:
      "😸 **{from}** je pogledao/la **{to}** i shvatio/la:\n" +
      "*\u201eBrate/sestro, ti si dokaz da evolucija nije uvijek napredak.\u201c* 😏",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Sve u šali!",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "muv",
    title: "✨  Muvanje",
    description:
      "😸 **{from}** → **{to}**:\n" +
      "*\u201eJesi li ti WiFi? Jer osjećam konekciju između nas.\u201c* ✨",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Balkan Muvanje",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "crush",
    title: "💕  Tajni Crush",
    description:
      "✨ Po zvijezdama i kafanskim računima...\n" +
      "👑 Tvoj tajni crush je... **{crush}**! 😏",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Fun",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ LJUBAVNE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "zagrljaj",
    title: "✨  Zagrljaj",
    description:
      "🐾 **{from}** grli **{to}**!\n" +
      "✨ Aww, tako slatko! 💕",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poljubac",
    title: "✨  Poljubac",
    description:
      "💕 **{from}** šalje poljubac **{to}**!\n" +
      "✨ Aww! ✨",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "mazi",
    title: "✨  Mazanje",
    description:
      "💕 **{from}** mazi **{to}** nježno!\n" +
      "✨ Previše slatkoga! ✨",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "tapsi",
    title: "🐾  Tapšanje",
    description:
      "🐾 **{from}** tapše **{to}** prijateljski!\n" +
      "✨ Baš simpatično! ✨",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "high5",
    title: "✨  High Five!",
    description:
      "✨ **{from}** daje peticu **{to}**!\n" +
      "🐾 HIGH FIVE! ✨",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "cudan",
    title: "😏  Čudno Ponašanje",
    description:
      "😏 **{from}** se čudno ponaša prema **{to}**!\n" +
      "😸 Ajde brate/sestro, malo normalnije! 😏",
    color: "#e879f9",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "srce",
    title: "✨  Srce",
    description:
      "✨ **{from}** šalje srce **{to}**!\n" +
      "💕 Aww! ✨ ✨",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "brak",
    title: "✨  Prijedlog Braka!",
    description:
      "💎 **{from}** je zaprosio/la **{to}**!\n" +
      "💕 Hoćeš li? ✨ ✨",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ INFO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "spotify",
    title: "⭐  {trackTitle}",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **Izvođač:** {artist}\n" +
      "📝 **Album:** {album}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "`0:45` ▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱▱▱▱▱ `3:22`",
    color: "#14b8a6",
    category: "Info",
    footer: "Spotify • GIANNI (Custom)",
    thumbnail: "{albumArt}",
    fields: [
      { name: "⭐ Žanr",      value: "{genre}",    inline: true  },
      { name: "✨ Trajanje",         value: "{duration}", inline: true  },
      { name: "⭐ Link",            value: "[Otvori na Spotifyju]({url})", inline: false },
    ],
  },
  {
    name: "invite",
    title: "⭐  Statistika — {user}",
    description:
      "➜ Pregled statistike korisnika na serveru:",
    color: "#14b8a6",
    category: "Info",
    footer: "GIANNI (Custom) • {user} • ID: {userId}",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "⭐ Poruka poslato",    value: "`{poruke}`",               inline: true  },
      { name: "🐾 Doveo/la članova", value: "`{invites}`",              inline: true  },
      { name: "⭐ Pridružio/la se",        value: "{joinedAt}",               inline: true  },
      { name: "⭐ Invite link",            value: "`{inviteUses}` korišćenja", inline: false },
    ],
  },
  {
    name: "avatar",
    title: "⭐  Avatar — {user}",
    description:
      "➜ [PNG]({png}) **·** ⭐ [JPG]({jpg}) **·** ⭐ [WEBP]({webp})",
    color: "#14b8a6",
    category: "Info",
    footer: "GIANNI (Custom) • Avatar",
    thumbnail: null,
    fields: [
      { name: "🐾 Korisnik", value: "{user}",     inline: true },
      { name: "⭐ ID",    value: "`{userId}`", inline: true },
    ],
  },
  {
    name: "brojanje-info",
    title: "⭐  Brojanje — Stanje",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "➜ **Kanal:** {channel}\n" +
      "⭐ **Trenutno:** `{current}`\n" +
      "⭐ **Sljedeći broj:** `{next}`\n" +
      "🐾 **Zadnji brojao:** {lastUser}\n" +
      "⭐ **Rekord:** `{highScore}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#14b8a6",
    category: "Info",
    footer: "GIANNI (Custom) • Brojanje",
    thumbnail: null,
    fields: [
      { name: "⭐ Status",  value: "`{status}`",  inline: true },
      { name: "⭐ Rekord",          value: "`{record}`",  inline: true },
      { name: "🔒 Zadnji propust",    value: "{lastFail}",  inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ VATRICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "vatrice-pup",
    title: "🔥  Top Lista — Vatrice",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 **{top1}** — 🔥 `{top1count}`\n" +
      "⭐ **{top2}** — 🔥 `{top2count}`\n" +
      "✅ **{top3}** — 🔥 `{top3count}`\n" +
      "⭐ **{top4}** — 🔥 `{top4count}`\n" +
      "✨ **{top5}** — 🔥 `{top5count}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "⭐ Tvoje mjesto: **#{rank}** · Imaš: **{myCount}** vatrica",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vatrice-start",
    title: "🔥  Vatrica Sistem — Aktiviran!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✅ Vatrica sistem je uspješno aktiviran!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "⭐ Svako **{prag}** poruka = **1 vatrica**\n" +
      "⭐ Nick se automatski ažurira\n" +
      "✨ Objave idu u {kanal}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [
      { name: "🔥 Emoji",         value: "`{emoji}`",        inline: true },
      { name: "⭐ Kanal",         value: "{kanal}",           inline: true },
      { name: "💎 Prag",      value: "`{prag}` poruka",  inline: true },
    ],
  },
  {
    name: "vatrice-kanal",
    title: "⭐  Vatrica Kanal Postavljen",
    description:
      "✨ Objave vatrica idu od sada u {kanal}.\n" +
      "✅ Postavka uspješno sačuvana!",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vatrice-oblik",
    title: "🔥  Vatrica Emoji Promijenjen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ Emoji vatrice je uspješno promijenjen!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [
      { name: "🔒 Stari emoji",  value: "`{stari}`", inline: true },
      { name: "✅ Novi emoji", value: "`{novi}`",  inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ POO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "poo",
    title: "⭐  P O O  —  Stanje Kreature",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{emojiBar}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✅ **Zdravlje:** `{zdravlje}/100`\n" +
      "💕 **Raspoloženje:** `{raspolozenje}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "🐾 Ukupno čuvara: **{cuvari}**\n" +
      "⭐ Završenih zadataka: **{zadaci}/100**",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Sistem",
    thumbnail: null,
    fields: [
      { name: "✅ Zdravlje",    value: "`{zdravlje}/100`", inline: true },
      { name: "💕 Raspoloženje", value: "`{raspolozenje}`", inline: true },
      { name: "⭐ Zadaci",        value: "`{zadaci}/100`",   inline: true },
    ],
  },
  {
    name: "poo-zadaci",
    title: "⭐  P O O  —  Lista Zadataka",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "💜 Poo zadaci — stranica **{str}/{ukupnoStr}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{zadaci}",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Zadaci",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poo-top",
    title: "⭐  P O O  —  Top Čuvari",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 **{top1}** — `{top1pts}` pts\n" +
      "⭐ **{top2}** — `{top2pts}` pts\n" +
      "✅ **{top3}** — `{top3pts}` pts\n" +
      "💜 **{top4}** — `{top4pts}` pts\n" +
      "➜ **{top5}** — `{top5pts}` pts\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poo-hrani",
    title: "⭐  P O O  —  Hranjen!",
    description:
      "🐾 **{user}** je hranio/la Poo-a! 🎉\n" +
      "🪙 Potrošeno: **200 coina**\n\n" +
      "{emojiBar}\n" +
      "✅ **Zdravlje:** `{zdravlje}/100` **(+{bonus})**",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Sistem",
    thumbnail: null,
    fields: [
      { name: "✅ Novo zdravlje", value: "`{zdravlje}/100`", inline: true },
      { name: "🪙 Trošak",            value: "`200` 🪙",          inline: true },
    ],
  },
  {
    name: "poo-info",
    title: "⭐  P O O  —  Moj Doprinos",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "🐾 **{user}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{progres}",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "✅ Završenih zadataka", value: "`{zavrseni}`", inline: true },
      { name: "⭐ Bodova ukupno",       value: "`{bodovi}`",   inline: true },
      { name: "⭐ Rang",               value: "`#{rang}`",    inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ ADMIN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "backup",
    title: "⭐  B A C K U P  —  Snimljen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✅ Backup je uspješno snimljen!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI (Custom) • Backup Sistem",
    thumbnail: null,
    fields: [
      { name: "⭐ Datum",                          value: "{datum}",    inline: true },
      { name: "💎 Veličina",                   value: "{velicina}", inline: true },
      { name: "➜ Lokacija",       value: "Discord DM", inline: true },
    ],
  },
  {
    name: "backup-restore",
    title: "⭐  B A C K U P  —  Vraćen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✅ Backup je uspješno vraćen!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "➜ Svi podaci su prepisani backupom od **{datum}**.",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI (Custom) • Backup Vraćen",
    thumbnail: null,
    fields: [
      { name: "⭐ Backup datum",          value: "{datum}",    inline: true },
      { name: "🐾 Pokrenuo/la",     value: "{korisnik}", inline: true },
    ],
  },
  {
    name: "backup-status",
    title: "⭐  B A C K U P  —  Status",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "➜ Cloud backup istorija:\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{historija}",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI (Custom) • Backup Sistem",
    thumbnail: null,
    fields: [
      { name: "✅ Ukupno backupa",    value: "`{ukupno}`",  inline: true },
      { name: "⭐ Zadnji",                   value: "{zadnji}",    inline: true },
      { name: "💜 Veličina",      value: "{velicina}",  inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ MUZIKA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "music-play",
    title: "⭐  Sada Svira",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "➜ **[{title}]({url})**\n" +
      "💜 {author} · `{duration}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: "{thumbnail}",
    fields: [
      { name: "⭐ Dodao/la",      value: "{requester}",         inline: true },
      { name: "💎 Glasnoća",  value: "`{volume}%`",          inline: true },
      { name: "⭐ Red čekanja",   value: "`{queueSize}` pjesme", inline: true },
    ],
  },
  {
    name: "music-queue",
    title: "⭐  Red — Muzika",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "➜ **Sada svira:**\n" +
      "**[{currentTitle}]({currentUrl})** · `{currentDuration}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{queueList}",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika • Strana {page}/{totalPages}",
    thumbnail: null,
    fields: [
      { name: "💎 Ukupno u redu", value: "`{queueSize}` pjesme", inline: true },
      { name: "⭐ Ukupno trajanje",   value: "`{totalDuration}`",    inline: true },
    ],
  },
  {
    name: "music-skip",
    title: "⭐  Preskočeno",
    description:
      "✨ **{user}** je preskočio/la: **{title}**\n" +
      "📝 Sljedeće: **{next}**",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: null,
    fields: [],
  },
  {
    name: "music-pause",
    title: "⭐  Pauzirano",
    description:
      "💜 Muzika je pauzirana.\n" +
      "➜ Napiši `/resume` da nastaviš.",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: null,
    fields: [],
  },
  {
    name: "music-stop",
    title: "⭐  Muzika Zaustavljena",
    description:
      "💜 **{user}** je zaustavio/la muziku i obrisao/la red.\n" +
      "🐾 Vidimo se sljedeći put!",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: null,
    fields: [],
  },
  {
    name: "music-lyrics",
    title: "⭐  Tekst Pjesme — {title}",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{lyrics}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Lyrics • {author}",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━ VERIFIKACIJA ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "verify-panel",
    title: "⭐  V E R I F I K A C I J A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "➜ Klikni dugme ispod da potvrdiš da nisi bot!\n" +
      "⭐ Dobijate pristup svim kanalima nakon verifikacije.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **discord.gg/gian**",
    color: "#06b6d4",
    category: "Verifikacija",
    footer: "GIANNI (Custom) • Verifikacija",
    thumbnail: null,
    fields: [],
  },
  {
    name: "verify-success",
    title: "⭐  Verifikacija Uspješna!",
    description:
      "✨ **{user}** — Dobrodošao/la! 💕\n" +
      "⭐ Verifikacija je prošla. Uživaj na serveru!\n" +
      "➜ Dobio/la si ulogu: <@&{roleId}>",
    color: "#06b6d4",
    category: "Verifikacija",
    footer: "GIANNI (Custom) • Verifikacija",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "verify-fail",
    title: "⭐  Verifikacija Neuspješna",
    description:
      "⭐ Verifikacija nije prošla. Pokušaj ponovo!\n" +
      "➜ Ako imaš problema, kontaktiraj staff.",
    color: "#ef4444",
    category: "Verifikacija",
    footer: "GIANNI (Custom) • Verifikacija",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ ANKETE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "poll-create",
    title: "⭐  A N K E T A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{question}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "⭐ Glasaj koristeći reakcije ispod!",
    color: "#f43f5e",
    category: "Ankete",
    footer: "GIANNI (Custom) • Anketa • Završava za {duration}",
    thumbnail: null,
    fields: [
      { name: "1️⃣ Opcija A", value: "{optionA}", inline: true },
      { name: "2️⃣ Opcija B", value: "{optionB}", inline: true },
      { name: "3️⃣ Opcija C", value: "{optionC}", inline: true },
    ],
  },
  {
    name: "poll-results",
    title: "⭐  Anketa — Rezultati",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{question}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{resultsBar}",
    color: "#f43f5e",
    category: "Ankete",
    footer: "GIANNI (Custom) • Anketa završena • Glasova: {totalVotes}",
    thumbnail: null,
    fields: [
      { name: "⭐ Pobjednik",  value: "**{winner}** — `{winnerPercent}%`", inline: true },
      { name: "⭐ Ukupno glasova",   value: "`{totalVotes}`",                    inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━ REACTION ROLES ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "rr-panel",
    title: "💜  U L O G E  —  Odaberi Svoju",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "➜ Klikni na reakciju i dobij/skini ulogu!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{roleList}",
    color: "#d946ef",
    category: "Reaction Roles",
    footer: "GIANNI (Custom) • Reaction Roles",
    thumbnail: null,
    fields: [],
  },
  {
    name: "rr-add",
    title: "✅  Uloga Dodana",
    description:
      "✨ **{user}** — dobio/la si ulogu <@&{roleId}>!\n" +
      "💕 Uživaj u novoj ulozi!",
    color: "#d946ef",
    category: "Reaction Roles",
    footer: "GIANNI (Custom) • Reaction Roles",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "rr-remove",
    title: "⭐  Uloga Skinuta",
    description:
      "💜 **{user}** — uloga <@&{roleId}> je skinuta.\n" +
      "➜ Možeš je ponovo dodati kada želiš!",
    color: "#d946ef",
    category: "Reaction Roles",
    footer: "GIANNI (Custom) • Reaction Roles",
    thumbnail: "{user.avatar}",
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━ REPORT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "report-nova",
    title: "⭐  Nova Prijava — Report",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✨ **{reporter}** je prijavio/la **{target}**!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "🛡️ Razlog: **{reason}**",
    color: "#ef4444",
    category: "Admin",
    footer: "GIANNI (Custom) • Report Sistem",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "💜 Prijavio/la",    value: "{reporter}", inline: true },
      { name: "🛡️ Prijavljeni",    value: "{target}",   inline: true },
      { name: "⭐ Datum",                     value: "{date}",     inline: true },
    ],
  },
  {
    name: "report-closed",
    title: "⭐  Report Zatvoren",
    description:
      "✨ Report #**{id}** je zatvoren od strane **{mod}**.\n" +
      "✅ Akcija: **{action}**",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI (Custom) • Report Sistem",
    thumbnail: null,
    fields: [],
  },
];

async function loadEmbeds(): Promise<typeof DEFAULT_EMBEDS> {
  const conn = await getDb();
  if (!conn) return DEFAULT_EMBEDS;

  const { db, embedsTable } = conn;
  const rows = await db.select().from(embedsTable);
  const savedMap = new Map(rows.map((r) => [r.name, r.data as (typeof DEFAULT_EMBEDS)[number]]));

  // Seed any defaults not yet in DB
  const missing = DEFAULT_EMBEDS.filter((e) => !savedMap.has(e.name));
  if (missing.length > 0) {
    await db.insert(embedsTable)
      .values(missing.map((e) => ({ name: e.name, data: e })))
      .onConflictDoNothing();
    missing.forEach((e) => savedMap.set(e.name, e));
  }

  return DEFAULT_EMBEDS.map((def) => savedMap.get(def.name) ?? def);
}

router.get("/embeds", async (req, res) => {
  try {
    res.json(await loadEmbeds());
  } catch (err) {
    req.log.error(err, "Failed to load embeds");
    res.json(DEFAULT_EMBEDS);
  }
});

router.get("/embeds/:name", async (req, res) => {
  try {
    const conn = await getDb();
    if (conn) {
      const { db, embedsTable } = conn;
      const rows = await db.select().from(embedsTable).where(eq(embedsTable.name, req.params.name));
      if (rows.length > 0) return res.json(rows[0].data);
    }
    const def = DEFAULT_EMBEDS.find((e) => e.name === req.params.name);
    if (!def) return res.status(404).json({ error: "Embed not found" });
    return res.json(def);
  } catch (err) {
    req.log.error(err, "Failed to get embed");
    const def = DEFAULT_EMBEDS.find((e) => e.name === req.params.name);
    return def ? res.json(def) : res.status(404).json({ error: "Embed not found" });
  }
});

router.post("/embeds/reset-all", async (req, res) => {
  try {
    const conn = await getDb();
    if (!conn) return res.status(503).json({ error: "Database not available" });

    const { db, embedsTable } = conn;

    for (const embed of DEFAULT_EMBEDS) {
      await db.insert(embedsTable)
        .values({ name: embed.name, data: embed })
        .onConflictDoUpdate({
          target: embedsTable.name,
          set: { data: embed, updatedAt: new Date() },
        });
    }

    return res.json({ ok: true, updated: DEFAULT_EMBEDS.length });
  } catch (err) {
    req.log.error(err, "Failed to reset all embeds");
    return res.status(500).json({ error: "Database error" });
  }
});

router.put("/embeds/:name", async (req, res) => {
  try {
    const existing = DEFAULT_EMBEDS.find((e) => e.name === req.params.name);
    if (!existing) return res.status(404).json({ error: "Embed not found" });

    const conn = await getDb();
    if (!conn) {
      // No DB — return merged but warn it won't persist
      return res.json({ ...existing, ...req.body });
    }

    const { db, embedsTable } = conn;
    const rows = await db.select().from(embedsTable).where(eq(embedsTable.name, req.params.name));
    const current = rows.length > 0 ? (rows[0].data as (typeof DEFAULT_EMBEDS)[number]) : existing;
    const updated = { ...current, ...req.body };

    await db.insert(embedsTable)
      .values({ name: req.params.name, data: updated })
      .onConflictDoUpdate({ target: embedsTable.name, set: { data: updated, updatedAt: new Date() } });

    return res.json(updated);
  } catch (err) {
    req.log.error(err, "Failed to save embed");
    return res.status(500).json({ error: "Database error" });
  }
});

export default router;
