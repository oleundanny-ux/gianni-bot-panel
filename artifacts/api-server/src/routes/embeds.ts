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

  // ━━━━━━━━━━━━━━━━━━━━ SISTEM ━━━━━━━━━━━━━━━━━━━━
  {
    name: "welcome",
    title: "Dobrodosao/la, {user}!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Drago nam je sto si ovdje!\n" +
      "Upoznaj zajednicu i istrazи kanale!\n" +
      "discord.gg/gian\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI • Dobrodosao/la!",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Clan #{count}",   value: "Hvala sto si nam se pridruzio/la!", inline: false },
      { name: "Registracija",   value: "{accountAge}",                       inline: true  },
      { name: "Pridruzio/la se", value: "{joinedAt}",                        inline: true  },
    ],
  },
  {
    name: "leave",
    title: "{user} je napustio/la server",
    description:
      "Zao nam je sto si otisao/la.\n" +
      "Uvijek si dobrodosao/la nazad!",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI • Do vidjenja!",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Proveo/la na serveru", value: "{timeOnServer}",  inline: true },
      { name: "Preostalo clanova",    value: "`{memberCount}`", inline: true },
    ],
  },
  {
    name: "dm-welcome",
    title: "Dobrodosao/la na GIAN, {user}!",
    description:
      "Hvala ti sto si se pridruzio/la!\n\n" +
      "discord.gg/gian\n\n" +
      "Procitaj pravila u kanalu #pravila i uzivaj!\n" +
      "Za pomoc, pisi u #podrska.",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI • Dobrodosao/la!",
    thumbnail: "https://gian.today/api/icons/Mail?bg=7c3aed",
    fields: [],
  },
  {
    name: "boost",
    title: "BOOST — Hvala ti, {user}!",
    description:
      "**{user}** je upravo **boostovao server**!\n" +
      "Hvala ti na podrsci — server je sad jos jaci!",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI • Hvala na podrsci",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Ukupno boostova", value: "`{boostCount}`", inline: true },
      { name: "Server Tier",     value: "`Lvl {tier}`",   inline: true },
      { name: "Nagrada",         value: "`+2.500`",        inline: true },
    ],
  },
  {
    name: "birthday",
    title: "Sretan Rodjendan, {user}!",
    description:
      "Danas je poseban dan za **{user}**!\n\n" +
      "Svi mu/joj cestitajte!\n" +
      "Neka ti je srecan i blagoslovljen dan!",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI • Sretan Rodjendan!",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Godine", value: "`{age}` godina", inline: true },
      { name: "Poklon", value: "`+5.000`",        inline: true },
    ],
  },
  {
    name: "starboard",
    title: "Zvjezdana poruka!",
    description:
      "Ova poruka je dobila **{stars}** zvjezdica!\n" +
      "Kanal: {channel}\n" +
      "Autor: {author}",
    color: "#F1C40F",
    category: "Sistem",
    footer: "GIANNI • Starboard",
    thumbnail: "https://gian.today/api/icons/Star?bg=b45309",
    fields: [],
  },
  {
    name: "aotw",
    title: "Aktivni Clan Sedmice",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Cestitamo **{user}** na tituli!\n" +
      "Ova sedmica pripada tebi!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#F1C40F",
    category: "Sistem",
    footer: "GIANNI • Aktivni Clan Sedmice",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Poruka",  value: "`{messageCount}`", inline: true },
      { name: "Nagrada", value: "`+10.000`",         inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━ LOG ━━━━━━━━━━━━━━━━━━━━
  {
    name: "log-join",
    title: "Novi Clan",
    description:
      "**{user}** se pridruzio serveru.\n" +
      "Registracija: {accountAge}",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI • Log",
    thumbnail: "https://gian.today/api/icons/UserPlus?bg=92400e",
    fields: [
      { name: "ID",     value: "`{userId}`",      inline: true },
      { name: "Ukupno", value: "`{memberCount}`", inline: true },
    ],
  },
  {
    name: "log-edit",
    title: "Poruka Editovana",
    description:
      "**{user}** je izmjenio/la poruku u {channel}.\n\n" +
      "**Stara poruka:**\n`{oldContent}`\n\n" +
      "**Nova poruka:**\n`{newContent}`",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI • Log Editovanje",
    thumbnail: "https://gian.today/api/icons/PencilLine?bg=92400e",
    fields: [],
  },
  {
    name: "log-delete",
    title: "Poruka Obrisana",
    description:
      "**{user}** je obrisao/la poruku u {channel}.\n\n" +
      "**Sadrzaj:**\n`{content}`",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI • Log Brisanje",
    thumbnail: "https://gian.today/api/icons/Trash2?bg=92400e",
    fields: [],
  },
  {
    name: "report",
    title: "Prijava clana",
    description:
      "**{reporter}** je prijavio/la **{reported}**.\n\n" +
      "**Razlog:** {reason}",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI • Prijava",
    thumbnail: "{reported.avatar}",
    fields: [
      { name: "ID prijavljenog", value: "`{reportedId}`", inline: true },
      { name: "Datum",           value: "{date}",          inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━ MODERACIJA ━━━━━━━━━━━━━━━━━━━━
  {
    name: "warn",
    title: "Upozorenje",
    description:
      "**{user}** je dobio/la upozorenje.\n\n" +
      "**Razlog:** {reason}",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI • Moderacija",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Moderator", value: "{mod}",         inline: true },
      { name: "Warn #",    value: "`{warnCount}`", inline: true },
    ],
  },
  {
    name: "ban",
    title: "Clan Banovan",
    description:
      "**{user}** je banovan sa servera.\n\n" +
      "**Razlog:** {reason}",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI • Ban",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Moderator", value: "{mod}",      inline: true },
      { name: "Trajanje",  value: "{duration}", inline: true },
    ],
  },
  {
    name: "mod-kick",
    title: "Clan Kickovan",
    description:
      "**{user}** je izbacen sa servera.\n\n" +
      "**Razlog:** {reason}",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI • Kick",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Moderator", value: "{mod}", inline: true },
    ],
  },
  {
    name: "mod-mute",
    title: "Clan Mutovan",
    description:
      "**{user}** je mutovan.\n\n" +
      "**Razlog:** {reason}",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI • Mute",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Moderator", value: "{mod}",      inline: true },
      { name: "Trajanje",  value: "{duration}", inline: true },
    ],
  },
  {
    name: "mod-unmute",
    title: "Clan Odmutovan",
    description: "**{user}** je odmutovan — moze opet pisati.",
    color: "#22c55e",
    category: "Moderacija",
    footer: "GIANNI • Unmute",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Moderator", value: "{mod}", inline: true },
    ],
  },
  {
    name: "mod-timeout",
    title: "Timeout",
    description:
      "**{user}** je stavljen u timeout.\n\n" +
      "**Razlog:** {reason}",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI • Timeout",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Moderator", value: "{mod}",      inline: true },
      { name: "Trajanje",  value: "{duration}", inline: true },
    ],
  },
  {
    name: "mod-purge",
    title: "Poruke Obrisane",
    description: "**{mod}** je obrisao/la **{count}** poruka u {channel}.",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI • Purge",
    thumbnail: "https://gian.today/api/icons/Trash2?bg=7f1d1d",
    fields: [],
  },
  {
    name: "mod-unban",
    title: "Clan Odbanovan",
    description:
      "**{user}** je odbanovan sa servera.\n" +
      "Dobrodosao/la nazad!",
    color: "#22c55e",
    category: "Moderacija",
    footer: "GIANNI • Unban",
    thumbnail: "https://gian.today/api/icons/Unlock?bg=14532d",
    fields: [
      { name: "Moderator", value: "{mod}", inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━ XP ━━━━━━━━━━━━━━━━━━━━
  {
    name: "levelup",
    title: "Level Up, {user}!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Dostigao/la si novi nivo!\n" +
      "Nastavi tako — odlicno!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI • Level Up",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Novi nivo", value: "`Level {level}`", inline: true },
      { name: "Nagrada",   value: "`+{reward}`",     inline: true },
    ],
  },
  {
    name: "vatrica-nova",
    title: "Nova Vatrica, {user}!",
    description:
      "**{user}** je zaradio/la novu vatricu!\n" +
      "Ukupno vatrica: **{count}**",
    color: "#FF6A00",
    category: "XP",
    footer: "GIANNI • Vatrica",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "aktivnost",
    title: "Aktivnost",
    description: "Pregled aktivnosti za **{user}**:",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI • Aktivnost",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Poruke",   value: "`{messages}`", inline: true },
      { name: "Glasovni", value: "`{voice}`",    inline: true },
      { name: "XP",       value: "`{xp}`",       inline: true },
    ],
  },
  {
    name: "rank",
    title: "Rank — {user}",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Tvoj trenutni rank profil:",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI • Rank",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "XP",      value: "`{xp}`",      inline: true },
      { name: "Level",   value: "`{level}`",   inline: true },
      { name: "Rank",    value: "`#{rank}`",   inline: true },
      { name: "Vatrice", value: "`{vatrice}`", inline: true },
      { name: "Novac",   value: "`{balance}`", inline: true },
    ],
  },
  {
    name: "leaderboard-xp",
    title: "Top Lista — XP",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Najaktivniji clanovi servera:\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{leaderboard}",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI • XP Leaderboard",
    thumbnail: "https://gian.today/api/icons/Trophy?bg=14532d",
    fields: [],
  },
  {
    name: "leaderboard-novac",
    title: "Top Lista — Novac",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Najbogatiji clanovi servera:\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{leaderboard}",
    color: "#f97316",
    category: "XP",
    footer: "GIANNI • Novac Leaderboard",
    thumbnail: "https://gian.today/api/icons/Crown?bg=7c2d12",
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━ EKONOMIJA ━━━━━━━━━━━━━━━━━━━━
  {
    name: "heist",
    title: "Razboj u pripremi!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{user}** planira pljacku banke!\n" +
      "Pridruzи se ekipi — klikni dugme!\n" +
      "Pocinje za: **{countdown}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI • Heist",
    thumbnail: "https://gian.today/api/icons/Swords?bg=7c2d12",
    fields: [
      { name: "Ucesnici",     value: "`{count}`", inline: true },
      { name: "Nagradni fond", value: "`{pot}`",  inline: true },
    ],
  },
  {
    name: "lottery",
    title: "Sedmicna Loto!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Kupi tiket i osvoji jackpot!\n" +
      "Zrijeb: **{drawTime}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI • Loto",
    thumbnail: "https://gian.today/api/icons/Dices?bg=7c2d12",
    fields: [
      { name: "Jackpot", value: "`{pot}`",     inline: true },
      { name: "Tiketa",  value: "`{tickets}`", inline: true },
      { name: "Cijena",  value: "`{price}`",   inline: true },
    ],
  },
  {
    name: "quests",
    title: "Dnevni Zadaci",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Ispuni zadatke i osvoji nagrade!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{quests}",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI • Dnevni Zadaci",
    thumbnail: "https://gian.today/api/icons/ClipboardList?bg=7c2d12",
    fields: [],
  },
  {
    name: "giveaway",
    title: "Nagradna Igra!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{host}** pokrce nagradnu igru!\n" +
      "Zavrsava: **{endTime}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI • Giveaway",
    thumbnail: "https://gian.today/api/icons/Gift?bg=7c2d12",
    fields: [
      { name: "Nagrada",    value: "{prize}",     inline: true },
      { name: "Pobjednika", value: "`{winners}`", inline: true },
    ],
  },
  {
    name: "giveaway-end",
    title: "Nagradna Igra Zavrsena!",
    description:
      "Nagradna igra je gotova!\n\n" +
      "**Pobjednici:**\n{winners}",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI • Giveaway Kraj",
    thumbnail: "https://gian.today/api/icons/Trophy?bg=7c2d12",
    fields: [],
  },
  {
    name: "eco-balance",
    title: "Balans — {user}",
    description: "Pregled tvog racuna:",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI • Balans",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Novcanik", value: "`{wallet}`", inline: true },
      { name: "Banka",    value: "`{bank}`",   inline: true },
      { name: "Ukupno",   value: "`{total}`",  inline: true },
    ],
  },
  {
    name: "eco-daily",
    title: "Dnevna Nagrada!",
    description:
      "**{user}** je preuzeo/la dnevnu nagradu!\n" +
      "Sljedeca nagrada za: **24h**",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI • Daily",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Nagrada", value: "`+{amount}`",    inline: true },
      { name: "Streak",  value: "`{streak} dana`", inline: true },
    ],
  },
  {
    name: "eco-work",
    title: "Posao",
    description: "**{user}** je radio/la kao **{job}** i zaradio/la!",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI • Posao",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Zarada",   value: "`+{amount}`",  inline: true },
      { name: "Sljedeci", value: "`{cooldown}`", inline: true },
    ],
  },
  {
    name: "eco-shop",
    title: "Shop",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Dostupni predmeti:\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{items}",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI • Shop",
    thumbnail: "https://gian.today/api/icons/ShoppingCart?bg=7c2d12",
    fields: [],
  },
  {
    name: "eco-buy",
    title: "Kupovina Uspjesna!",
    description:
      "**{user}** je kupio/la **{item}}**!\n" +
      "Potroseno: `{price}`",
    color: "#22c55e",
    category: "Ekonomija",
    footer: "GIANNI • Kupovina",
    thumbnail: "https://gian.today/api/icons/ShoppingBag?bg=14532d",
    fields: [],
  },
  {
    name: "eco-transfer",
    title: "Transfer Kovanica",
    description: "**{from}** je poslao/la **{amount}** korisniku **{to}**!",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI • Transfer",
    thumbnail: "https://gian.today/api/icons/ArrowLeftRight?bg=7c2d12",
    fields: [],
  },
  {
    name: "eco-rob",
    title: "Pljacka!",
    description:
      "**{robber}** je pokusao/la opljackati **{victim}**!\n\n" +
      "{result}",
    color: "#ef4444",
    category: "Ekonomija",
    footer: "GIANNI • Pljacka",
    thumbnail: "https://gian.today/api/icons/Swords?bg=7f1d1d",
    fields: [
      { name: "Iznos",    value: "`{amount}`", inline: true },
      { name: "Rezultat", value: "{status}",   inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━ IGRE ━━━━━━━━━━━━━━━━━━━━
  {
    name: "slots",
    title: "Slot Masina",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{user}** vrti slotove!\n\n" +
      "[ {r1} | {r2} | {r3} ]\n\n" +
      "{result}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Slots",
    thumbnail: "https://gian.today/api/icons/Dices?bg=1e3a5f",
    fields: [
      { name: "Ulog",    value: "`{bet}`",      inline: true },
      { name: "Dobitak", value: "`{winnings}`", inline: true },
    ],
  },
  {
    name: "blackjack",
    title: "Blackjack",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{user}** igra blackjack!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Blackjack",
    thumbnail: "https://gian.today/api/icons/Layers?bg=1e3a5f",
    fields: [
      { name: "Tvoje karte",  value: "{playerHand} (`{playerScore}`)", inline: true },
      { name: "Dealer karte", value: "{dealerHand} (`{dealerScore}`)", inline: true },
      { name: "Ulog",         value: "`{bet}`",                        inline: false },
    ],
  },
  {
    name: "poker-lobby",
    title: "Poker — Lobby",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{host}** otvara poker stol!\n" +
      "Cekamo igrace... ({count}/{max})\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Poker",
    thumbnail: "https://gian.today/api/icons/Trophy?bg=1e3a5f",
    fields: [
      { name: "Buy-in", value: "`{buyin}`",  inline: true },
      { name: "Igraci", value: "`{players}`", inline: true },
    ],
  },
  {
    name: "poker-game",
    title: "Poker — U Toku",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Runda **{round}** — {phase}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Stol: {communityCards}",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Poker",
    thumbnail: "https://gian.today/api/icons/Gamepad2?bg=1e3a5f",
    fields: [
      { name: "Pot",     value: "`{pot}`",   inline: true },
      { name: "Na redu", value: "{current}", inline: true },
    ],
  },
  {
    name: "poker-showdown",
    title: "Poker — Showdown!",
    description:
      "**{winner}** pobijedio/la!\n\n" +
      "Pobjednicka kombinacija: **{hand}**",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Poker Showdown",
    thumbnail: "https://gian.today/api/icons/Crown?bg=1e3a5f",
    fields: [
      { name: "Dobitak", value: "`{pot}`", inline: true },
    ],
  },
  {
    name: "among-us-lobby",
    title: "Among Us — Lobby",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{host}** otvara igru!\n" +
      "Igraci: {count}/{max}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Among Us",
    thumbnail: "https://gian.today/api/icons/Rocket?bg=1e3a5f",
    fields: [],
  },
  {
    name: "among-us-game",
    title: "Among Us — U Toku",
    description:
      "Imposter je medu nama...\n\n" +
      "Preostalo igraca: **{alive}**\n" +
      "Eliminirani: **{dead}**",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Among Us",
    thumbnail: "https://gian.today/api/icons/Target?bg=1e3a5f",
    fields: [],
  },
  {
    name: "among-us-end",
    title: "Among Us — Kraj",
    description:
      "Igra je zavrsena!\n\n" +
      "**Pobjednici:** {winners}\n" +
      "**Imposter:** {imposter}",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Among Us",
    thumbnail: "https://gian.today/api/icons/Trophy?bg=1e3a5f",
    fields: [],
  },
  {
    name: "kaladont-start",
    title: "Kaladont — Start!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Igra pocinje! Prva rijec:\n" +
      "**{word}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Kaladont",
    thumbnail: "https://gian.today/api/icons/BookOpen?bg=1e3a5f",
    fields: [],
  },
  {
    name: "kaladont-active",
    title: "Kaladont — Na redu: {user}",
    description:
      "**{user}**, tvoj red!\n\n" +
      "Zadnje slovo: **{letter}**\n" +
      "Imas **{seconds}** sekundi!",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Kaladont",
    thumbnail: "https://gian.today/api/icons/MessageCircle?bg=1e3a5f",
    fields: [],
  },
  {
    name: "kaladont-word",
    title: "Kaladont — Prihvaceno!",
    description:
      "**{user}** je rekao/la: **{word}**\n" +
      "Sljedece slovo: **{nextLetter}**",
    color: "#22c55e",
    category: "Igre",
    footer: "GIANNI • Kaladont",
    thumbnail: "https://gian.today/api/icons/CheckCircle?bg=14532d",
    fields: [],
  },
  {
    name: "kaladont-win",
    title: "Kaladont — Pobjeda!",
    description:
      "**{winner}** pobijedio/la!\n" +
      "Nagrada: `+{reward}`",
    color: "#22c55e",
    category: "Igre",
    footer: "GIANNI • Kaladont",
    thumbnail: "https://gian.today/api/icons/Trophy?bg=14532d",
    fields: [],
  },
  {
    name: "bingo",
    title: "Bingo!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Izvuceni brojevi:\n" +
      "{numbers}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Bingo",
    thumbnail: "https://gian.today/api/icons/Grid3x3?bg=1e3a5f",
    fields: [],
  },
  {
    name: "vjasala",
    title: "Vjasala",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "```{drawing}```\n" +
      "Rijec: **{display}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Vjasala",
    thumbnail: "https://gian.today/api/icons/FileText?bg=1e3a5f",
    fields: [
      { name: "Greske",    value: "`{wrong}/{max}`", inline: true },
      { name: "Pogodjeno", value: "`{guessed}`",     inline: true },
    ],
  },
  {
    name: "vjasala-kraj",
    title: "Vjasala — Pogodak!",
    description:
      "**{user}** je pogodio/la: **{word}**!\n" +
      "Nagrada: `+{reward}`",
    color: "#22c55e",
    category: "Igre",
    footer: "GIANNI • Vjasala",
    thumbnail: "https://gian.today/api/icons/CheckCircle?bg=14532d",
    fields: [],
  },
  {
    name: "toplo-hladno",
    title: "Toplo ili Hladno?",
    description:
      "**{user}** pokusava pogoditi broj!\n\n" +
      "Pogodak: **{guess}**\n" +
      "**{feedback}**",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Toplo-Hladno",
    thumbnail: "https://gian.today/api/icons/Flame?bg=1e3a5f",
    fields: [
      { name: "Pokusaji", value: "`{attempts}`", inline: true },
    ],
  },
  {
    name: "kviz",
    title: "Kviz — Balkan Pitanje",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{question}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{options}",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Kviz",
    thumbnail: "https://gian.today/api/icons/HelpCircle?bg=1e3a5f",
    fields: [
      { name: "Vrijeme", value: "`{time}s`",  inline: true },
      { name: "Nagrada", value: "`{reward}`", inline: true },
    ],
  },
  {
    name: "geografija",
    title: "Geografija Kviz",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{question}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{options}",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Geografija",
    thumbnail: "https://gian.today/api/icons/Globe?bg=1e3a5f",
    fields: [
      { name: "Vrijeme", value: "`{time}s`",  inline: true },
      { name: "Nagrada", value: "`{reward}`", inline: true },
    ],
  },
  {
    name: "mafia-lobby",
    title: "Mafia — Lobby",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{host}** pokrenuo/la Mafia igru!\n" +
      "Igraci: {count}/{max}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Mafia",
    thumbnail: "https://gian.today/api/icons/Eye?bg=1e3a5f",
    fields: [],
  },
  {
    name: "mafia-end",
    title: "Mafia — Kraj Igre!",
    description:
      "**{winners}** pobijedio/la!\n\n" +
      "Mafia: {mafia}\n" +
      "Grad: {town}",
    color: "#3b82f6",
    category: "Igre",
    footer: "GIANNI • Mafia",
    thumbnail: "https://gian.today/api/icons/Crown?bg=1e3a5f",
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━ FUN ━━━━━━━━━━━━━━━━━━━━
  {
    name: "hunt",
    title: "Lov — Ulovio/la zivotinju!",
    description:
      "**{user}** je ulovio/la: **{animal}**!\n" +
      "Zarada: `+{amount}`",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI • Lov",
    thumbnail: "https://gian.today/api/icons/Target?bg=831843",
    fields: [],
  },
  {
    name: "zoo",
    title: "Zoo — Tvoja Zbirka",
    description: "**{user}** ima sljedece zivotinje:",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI • Zoo",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "battle",
    title: "Bitka!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{challenger}** vs **{opponent}**!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{result}",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI • Bitka",
    thumbnail: "https://gian.today/api/icons/Swords?bg=831843",
    fields: [],
  },
  {
    name: "pray",
    title: "Molitva",
    description:
      "**{user}** se molio/la i...\n\n" +
      "{result}",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI • Molitva",
    thumbnail: "https://gian.today/api/icons/Sparkles?bg=831843",
    fields: [],
  },
  {
    name: "vers",
    title: "Vers — Hip Hop",
    description:
      "**{user}** baca verse:\n\n" +
      "```{verse}```",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI • Vers",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "kompli",
    title: "Kompliment",
    description:
      "**{from}** kaze **{to}**:\n\n" +
      "*{compliment}*",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI • Kompliment",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "fora",
    title: "Fora",
    description:
      "**{from}** je pogledao/la **{to}** i shvatio/la:\n\n" +
      "*{joke}*",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI • Fora",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "muv",
    title: "Muvanje",
    description:
      "**{from}** → **{to}**:\n\n" +
      "*{pickup}*",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI • Balkan Muvanje",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "crush",
    title: "Crush",
    description:
      "**{user}** ima crush na nekoga!\n" +
      "Saznaj koga — svi glasajte!",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI • Crush",
    thumbnail: "{user.avatar}",
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━ LJUBAVNE ━━━━━━━━━━━━━━━━━━━━
  {
    name: "zagrljaj",
    title: "Zagrljaj",
    description: "**{from}** grli **{to}**! Budi slobodan/na primiti ovaj zagrljaj!",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI • Zagrljaj",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "poljubac",
    title: "Poljubac",
    description: "**{from}** salje poljubac **{to}**!",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI • Poljubac",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "mazi",
    title: "Mazi",
    description: "**{from}** mazi **{to}**!",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI • Mazi",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "tapsi",
    title: "Tapsi",
    description: "**{from}** tapsi **{to}** po glavi!",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI • Tapsi",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "high5",
    title: "High Five!",
    description: "**{from}** daje high five **{to}**!",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI • High Five",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "cudan",
    title: "Cudan",
    description: "**{from}** gleda cudno u **{to}**... Niko ne zna zasto!",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI • Cudan",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "srce",
    title: "Srce",
    description: "**{from}** salje srce **{to}**!",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI • Srce",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "brak",
    title: "Prosidba!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{from}** prosi **{to}**!\n" +
      "Hoces li prihvatiti?\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI • Prosidba",
    thumbnail: "{to.avatar}",
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━ INFO ━━━━━━━━━━━━━━━━━━━━
  {
    name: "spotify",
    title: "Spotify",
    description: "**{user}** slusa muziku:",
    color: "#1DB954",
    category: "Info",
    footer: "GIANNI • Spotify",
    thumbnail: "{albumArt}",
    fields: [
      { name: "Pjesma",   value: "**{song}**", inline: true },
      { name: "Izvodjac", value: "{artist}",   inline: true },
      { name: "Album",    value: "{album}",    inline: true },
    ],
  },
  {
    name: "invite",
    title: "Statistika Pozivnica",
    description: "Pregled pozivnica za **{user}**:",
    color: "#14b8a6",
    category: "Info",
    footer: "GIANNI • Pozivnice",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Pozvano", value: "`{invites}`", inline: true },
      { name: "Otislo",  value: "`{left}`",    inline: true },
      { name: "Laznih",  value: "`{fake}`",    inline: true },
    ],
  },
  {
    name: "avatar",
    title: "Avatar — {user}",
    description: "Avatar od **{user}**:",
    color: "#14b8a6",
    category: "Info",
    footer: "GIANNI • Avatar",
    thumbnail: "https://gian.today/api/icons/User?bg=134e4a",
    fields: [],
  },
  {
    name: "brojanje-info",
    title: "Brojanje — Stanje",
    description: "Trenutno stanje brojanja na serveru:",
    color: "#14b8a6",
    category: "Info",
    footer: "GIANNI • Brojanje",
    thumbnail: "https://gian.today/api/icons/Hash?bg=134e4a",
    fields: [
      { name: "Broj",   value: "`{count}`",   inline: true },
      { name: "Zadnji", value: "{lastUser}",  inline: true },
      { name: "Rekord", value: "`{record}`",  inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━ SISTEM PANELI ━━━━━━━━━━━━━━━━━━━━
  {
    name: "ticket",
    title: "Podrska — Otvori Tiket",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Trebas pomoc? Klikni dugme ispod!\n" +
      "Staff ce ti odgovoriti sto prije.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI • Support",
    thumbnail: "https://gian.today/api/icons/Ticket?bg=7c3aed",
    fields: [],
  },
  {
    name: "ticket-otvoren",
    title: "Tiket Otvoren",
    description:
      "**{user}**, tiket je otvoren!\n\n" +
      "Opisi problem i staff ce ti pomoci.\n" +
      "Odgovor stize sto prije!",
    color: "#22c55e",
    category: "Sistem paneli",
    footer: "GIANNI • Tiket",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Tiket ID", value: "`#{ticketId}`", inline: true },
      { name: "Otvoren",  value: "{date}",         inline: true },
    ],
  },
  {
    name: "staff-prijava",
    title: "Staff Prijava",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Zeli postati staff?\n" +
      "Ispuni prijavu klikom na dugme!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI • Staff Prijava",
    thumbnail: "https://gian.today/api/icons/Star?bg=7c3aed",
    fields: [],
  },
  {
    name: "private-vc",
    title: "Privatni Voice Kanal",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Upravljaj privatnim voice kanalom!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI • Privatni VC",
    thumbnail: "https://gian.today/api/icons/Mic?bg=7c3aed",
    fields: [],
  },
  {
    name: "voice-pravila",
    title: "Voice Pravila",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**Pravila za Voice kanale:**\n\n" +
      "Ne uznemiravaj ostale\n" +
      "Muzika samo uz pristanak\n" +
      "Nema neprimjerenog sadrzaja\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI • Voice Pravila",
    thumbnail: "https://gian.today/api/icons/Volume2?bg=7c3aed",
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━ VATRICE ━━━━━━━━━━━━━━━━━━━━
  {
    name: "vatrice-pup",
    title: "Top Lista Vatrica",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Najtopliji clanovi servera:\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{leaderboard}",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI • Vatrice Top",
    thumbnail: "https://gian.today/api/icons/Flame?bg=7c2200",
    fields: [],
  },
  {
    name: "vatrice-start",
    title: "Vatrica Sistem — Pokrenut!",
    description:
      "Vatrica sistem je aktivan!\n" +
      "Prikupljaj vatrice aktivnoscu!",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI • Vatrice",
    thumbnail: "https://gian.today/api/icons/Zap?bg=7c2200",
    fields: [],
  },
  {
    name: "vatrice-kanal",
    title: "Vatrica Kanal Postavljen",
    description:
      "Kanal za vatrice: {channel}\n" +
      "Sve vatrice idu u ovaj kanal!",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI • Vatrice",
    thumbnail: "https://gian.today/api/icons/Hash?bg=7c2200",
    fields: [],
  },
  {
    name: "vatrice-oblik",
    title: "Vatrica Emoji Promijenjen",
    description:
      "Emoji za vatrice promijenjen!\n" +
      "Novi emoji: {emoji}",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI • Vatrice",
    thumbnail: "https://gian.today/api/icons/Tag?bg=7c2200",
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━ POO ━━━━━━━━━━━━━━━━━━━━
  {
    name: "poo",
    title: "Poo — Stanje Kreature",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Tvoja Poo kreatura!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI • Poo",
    thumbnail: "https://gian.today/api/icons/Activity?bg=3b1a08",
    fields: [
      { name: "Zdravlje", value: "`{health}/100`",    inline: true },
      { name: "Sreca",    value: "`{happiness}/100`", inline: true },
      { name: "Sitost",   value: "`{hunger}/100`",    inline: true },
    ],
  },
  {
    name: "poo-zadaci",
    title: "Poo — Zadaci",
    description:
      "Ispuni zadatke da hranis svoju Poo!\n\n" +
      "{tasks}",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI • Poo Zadaci",
    thumbnail: "https://gian.today/api/icons/ClipboardList?bg=3b1a08",
    fields: [],
  },
  {
    name: "poo-top",
    title: "Poo — Top Cuvari",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Najbolji cuvari Poo kreatura:\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{leaderboard}",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI • Poo Top",
    thumbnail: "https://gian.today/api/icons/Trophy?bg=3b1a08",
    fields: [],
  },
  {
    name: "poo-hrani",
    title: "Poo — Hranjena!",
    description:
      "**{user}** je hranio/la svoju Poo!\n" +
      "Sreca: +{happiness} | Sitost: +{hunger}",
    color: "#22c55e",
    category: "Poo",
    footer: "GIANNI • Poo Hrani",
    thumbnail: "https://gian.today/api/icons/CheckCircle?bg=14532d",
    fields: [],
  },
  {
    name: "poo-info",
    title: "Poo — Moj Doprinos",
    description: "**{user}** briga o Poo kreaturama:",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI • Poo Info",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "Hranjenja", value: "`{feedings}`", inline: true },
      { name: "Doprinos",  value: "`{score}`",    inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━ ADMIN ━━━━━━━━━━━━━━━━━━━━
  {
    name: "backup",
    title: "Backup — Snimljen",
    description:
      "Server backup uspjesno snimljen!\n" +
      "Datum: **{datum}**",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI • Backup",
    thumbnail: "https://gian.today/api/icons/Archive?bg=1e293b",
    fields: [
      { name: "Velicina", value: "`{size}`", inline: true },
      { name: "Sljedeci", value: "{next}",   inline: true },
    ],
  },
  {
    name: "backup-restore",
    title: "Backup — Vracen",
    description:
      "Server backup vracen!\n" +
      "Svi podaci prepisani backupom od **{datum}**.",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI • Backup Restore",
    thumbnail: "https://gian.today/api/icons/RefreshCw?bg=1e293b",
    fields: [],
  },
  {
    name: "backup-status",
    title: "Backup — Status",
    description: "Pregled backup stanja:",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI • Backup Status",
    thumbnail: "https://gian.today/api/icons/Database?bg=1e293b",
    fields: [
      { name: "Zadnji backup", value: "{lastBackup}", inline: true },
      { name: "Ukupno",        value: "`{count}`",    inline: true },
    ],
  },
  {
    name: "report-closed",
    title: "Report Zatvoren",
    description:
      "Prijava je zatvoren od strane **{mod}**.\n\n" +
      "**Ishod:** {outcome}",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI • Report Zatvoren",
    thumbnail: "https://gian.today/api/icons/CheckCircle?bg=1e293b",
    fields: [],
  },
  {
    name: "report-nova",
    title: "Nova Prijava",
    description:
      "**{reporter}** prijavio/la **{reported}**!\n\n" +
      "**Razlog:** {reason}",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI • Nova Prijava",
    thumbnail: "https://gian.today/api/icons/AlertTriangle?bg=1e293b",
    fields: [
      { name: "ID",    value: "`{reportId}`", inline: true },
      { name: "Datum", value: "{date}",       inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━ MUZIKA ━━━━━━━━━━━━━━━━━━━━
  {
    name: "music-play",
    title: "Now Playing",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{title}**\n" +
      "Izvodjac: **{artist}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI • Muzika",
    thumbnail: "{thumbnail}",
    fields: [
      { name: "Trajanje",  value: "`{duration}`", inline: true },
      { name: "Glasnoca",  value: "`{volume}%`",  inline: true },
      { name: "Trazio/la", value: "{requester}",  inline: true },
    ],
  },
  {
    name: "music-queue",
    title: "Red Cekanja",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**Trenutno:** {current}\n\n" +
      "**Sljedece:**\n{queue}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI • Queue",
    thumbnail: "https://gian.today/api/icons/List?bg=2e1065",
    fields: [
      { name: "Pjesama u redu", value: "`{count}`", inline: true },
    ],
  },
  {
    name: "music-skip",
    title: "Preskoceno",
    description:
      "**{user}** je preskocio/la: **{title}**\n" +
      "Sljedece: **{next}**",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI • Skip",
    thumbnail: "https://gian.today/api/icons/ArrowRight?bg=2e1065",
    fields: [],
  },
  {
    name: "music-pause",
    title: "Pauzirano",
    description:
      "Muzika pauzirana od **{user}**.\n" +
      "Nastavi sa `/resume`.",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI • Pauza",
    thumbnail: "https://gian.today/api/icons/Pause?bg=2e1065",
    fields: [],
  },
  {
    name: "music-stop",
    title: "Zaustavljeno",
    description:
      "**{user}** je zaustavio/la muziku.\n" +
      "Red cekanja obrisan.",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI • Stop",
    thumbnail: "https://gian.today/api/icons/Square?bg=2e1065",
    fields: [],
  },
  {
    name: "music-lyrics",
    title: "Tekst Pjesme",
    description:
      "**{title}** — {artist}\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{lyrics}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI • Lyrics",
    thumbnail: "https://gian.today/api/icons/ScrollText?bg=2e1065",
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━ VERIFIKACIJA ━━━━━━━━━━━━━━━━━━━━
  {
    name: "verify-panel",
    title: "Verifikacija",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Verificiraj se da pristupis serveru!\n" +
      "Klikni dugme ispod.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#06b6d4",
    category: "Verifikacija",
    footer: "GIANNI • Verifikacija",
    thumbnail: "https://gian.today/api/icons/Shield?bg=0c4a6e",
    fields: [],
  },
  {
    name: "verify-success",
    title: "Verifikacija Uspjesna!",
    description:
      "**{user}**, uspjesno si verificiran/a!\n" +
      "Dobrodosao/la na server!",
    color: "#22c55e",
    category: "Verifikacija",
    footer: "GIANNI • Verifikacija",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "verify-fail",
    title: "Verifikacija Neuspjesna",
    description:
      "**{user}**, verifikacija nije uspjela.\n" +
      "Pokusaj ponovo.",
    color: "#ef4444",
    category: "Verifikacija",
    footer: "GIANNI • Verifikacija",
    thumbnail: "https://gian.today/api/icons/ShieldX?bg=7f1d1d",
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━ ANKETE ━━━━━━━━━━━━━━━━━━━━
  {
    name: "poll-create",
    title: "Nova Anketa",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{question}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{options}",
    color: "#f43f5e",
    category: "Ankete",
    footer: "GIANNI • Anketa",
    thumbnail: "https://gian.today/api/icons/BarChart2?bg=4c0519",
    fields: [
      { name: "Zavrsava", value: "{endTime}", inline: true },
    ],
  },
  {
    name: "poll-results",
    title: "Rezultati Ankete",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "**{question}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{results}",
    color: "#f43f5e",
    category: "Ankete",
    footer: "GIANNI • Anketa Rezultati",
    thumbnail: "https://gian.today/api/icons/BarChart?bg=4c0519",
    fields: [
      { name: "Ukupno glasova", value: "`{total}`", inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━ REACTION ROLES ━━━━━━━━━━━━━━━━━━━━
  {
    name: "rr-panel",
    title: "Reaction Roles",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Odaberi svoju ulogu klikom na dugme!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#d946ef",
    category: "Reaction Roles",
    footer: "GIANNI • Reaction Roles",
    thumbnail: "https://gian.today/api/icons/Tag?bg=4a044e",
    fields: [],
  },
  {
    name: "rr-add",
    title: "Uloga Dodana",
    description: "**{user}** dobio/la ulogu **{role}**!",
    color: "#22c55e",
    category: "Reaction Roles",
    footer: "GIANNI • Reaction Roles",
    thumbnail: "https://gian.today/api/icons/CheckCircle?bg=14532d",
    fields: [],
  },
  {
    name: "rr-remove",
    title: "Uloga Skinuta",
    description: "**{user}** izgubio/la ulogu **{role}**.",
    color: "#d946ef",
    category: "Reaction Roles",
    footer: "GIANNI • Reaction Roles",
    thumbnail: "https://gian.today/api/icons/X?bg=4a044e",
    fields: [],
  },
]



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
