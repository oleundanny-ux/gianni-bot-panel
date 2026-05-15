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
  // ─── SISTEM ───────────────────────────────────────────────────────────────
  {
    name: "welcome",
    title: null,
    description:
      "## <:864113ownerpinkcrownwithheart:1496899493130539008> **Dobrodošao/la, {user}!**\n<:518169rolemodpurple:1496901673426096158> Ti si **{memberCount}**. član!\n\n<a:33214animatedarrowpink:1496898966090944542> <:7289announcement:1504505912939909141> #chat **·** <a:3599pinkheart:1504504866700132534> #info **·** <a:music2:1500459145382592602> #news **·** <a:giveaways5:1500203902446997586> #gws\n<:7188members:1504505910314405888> **{memberCount} member · discord.gg/gian**",
    color: "#2B2D3A",
    category: "Sistem",
    footer: "GIANNI (Custom) • Welcome",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "leave",
    title: null,
    description:
      "**bye {user}** <a:571294pinkpaw:1500259928936284211>\n\n<a:vatrice1:1500466044429664256> {user} **je napustio/la server**\n<:7188members:1504505910314405888> **{memberCount} member · discord.gg/gian**",
    color: "#2B2D3A",
    category: "Sistem",
    footer: "GIANNI (Custom) • Leave",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "dm-welcome",
    title: null,
    description:
      "**wlcm {user}!**\n\n<a:vatrice1:1500466044429664256> <#1496860023706488884> **·** <a:vatrice2:1500466048418185246> <#1496860023093989475> **·** <a:vatrice3:1500466039782113352> <#1501973333195882696> **·** <a:vatrice4:1500466061970247741> <#1496860023480127505>\n<:7188members:1504505910314405888> **{memberCount} member · discord.gg/gian**",
    color: "#2B2D3A",
    category: "Sistem",
    footer: "GIANNI (Custom) • Dobrodošlica DM",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "boost",
    title: "<:518169rolemodpurple:1496901673426096158> Novi Boost!",
    description:
      "{user} je upravo **boostovao server**! <a:32877animatedarrowbluelite:1496898954783096933>\nHvala ti na podršci — server je sad još jači! <a:387466flamingfiresword:1500462011648049192>",
    color: "#F47FFF",
    category: "Sistem",
    footer: "GIANNI (Custom) • Hvala na podršci <:518169rolemodpurple:1496901673426096158>",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:32877animatedarrowbluelite:1496898954783096933> Boostova", value: "`{boostCount}`", inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Tier", value: "`Lvl {tier}`", inline: true },
      { name: "<a:302883greenpresent:1500461838108721182> Nagrada", value: "`+2.500 <a:529977coin:1500444133389635704>`", inline: true },
    ],
  },
  {
    name: "birthday",
    title: "<a:302883greenpresent:1500461838108721182> Sretan Rođendan!",
    description: "Danas je rođendan od {user}! <a:giveaways5:1500203902446997586>\nSvi mu/joj čestitajte! <a:giveaways5:1500203902446997586>",
    color: "#2B2D42",
    category: "Sistem",
    footer: "GIANNI (Custom) • Rođendani",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "starboard",
    title: null,
    description: "{content}",
    color: "#F1C40F",
    category: "Sistem",
    footer: "<:40197blueneonstar:1496898993395859457> {count} | #{channel}",
    thumbnail: null,
    fields: [
      { name: "<:1111pinkarrow:1496903118108229733> Original", value: "[Idi na poruku]({jumpUrl})", inline: false },
    ],
  },
  {
    name: "aotw",
    title: "<:864113ownerpinkcrownwithheart:1496899493130539008> Aktivni Član Sedmice",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:864113ownerpinkcrownwithheart:1496899493130539008> Najaktivniji član ove sedmice je:\n\n## {user}\n\n<:32467lovetalk:1504505532323594321> Napisao/la **{count}** poruka u zadnjih 7 dana!\n━━━━━━━━━━━━━━━━━━━━━━\n<a:302883greenpresent:1500461838108721182> **Nagrada:** `+500 coina` <a:529977coin:1500444133389635704> + `+100 XP` <a:68523animatedarrowgreen:1496899143338033173>\n<:518169rolemodpurple:1496901673426096158> Hvala što si dio × GIANNI porodice!",
    color: "#FFD700",
    category: "Sistem",
    footer: "GIANNI (Custom) • Sljedeći AOTW za 7 dana <:2261bell:1504505860720820395>",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:aktivnost:1500203557134270534> Top 3 sedmice", value: "<:79529shinycrown:1496899185516216400> **{top1}** — `{top1count}` poruka\n<:40197blueneonstar:1496898993395859457> **{top2}** — `{top2count}` poruka\n<:428758neonverifiedcheck:1496898532559421571> **{top3}** — `{top3count}` poruka", inline: false },
    ],
  },
  // ─── LOG ─────────────────────────────────────────────────────────────────
  {
    name: "log-join",
    title: "<:11309roleadminblue2:1496898576150954165> Novi Član",
    description: null,
    color: "#43B581",
    category: "Log",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "<:11309roleadminblue2:1496898576150954165> ID", value: "`{userId}`", inline: true },
      { name: "<a:32877animatedarrowbluelite:1496898954783096933> Nalog kreiran", value: "{createdAt}", inline: true },
      { name: "<:7188members:1504505910314405888> Ukupno članova", value: "`{memberCount}`", inline: true },
    ],
  },
  {
    name: "log-edit",
    title: "<:89292document:1504506160399650907> Poruka Editovana",
    description: null,
    color: "#F39C12",
    category: "Log",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "Kanal", value: "{channel}", inline: true },
      { name: "<:1111pinkarrow:1496903118108229733> Link", value: "[Idi na poruku]({jumpUrl})", inline: true },
      { name: "Prije", value: "{before}", inline: false },
      { name: "Poslije", value: "{after}", inline: false },
    ],
  },
  {
    name: "log-delete",
    title: "<a:760912ban:1500446026715103253> Poruka Obrisana",
    description: null,
    color: "#E74C3C",
    category: "Log",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "<:7289announcement:1504505912939909141> Kanal", value: "{channel}", inline: true },
      { name: "<:7188members:1504505910314405888> Autor", value: "{user}", inline: true },
      { name: "<:89292document:1504506160399650907> Sadržaj", value: "{content}", inline: false },
    ],
  },
  {
    name: "report",
    title: "<:73535warningids:1496899181674238053> NOVA PRIJAVA",
    description: null,
    color: "#E74C3C",
    category: "Log",
    footer: "Server: {guildName}",
    thumbnail: "{reported.avatar}",
    fields: [
      { name: "<:7188members:1504505910314405888> Prijavio",   value: "{reporter}\nID: `{reporterId}`",  inline: true },
      { name: "<:73535warningids:1496899181674238053> Prijavljen", value: "{reported}\nID: `{reportedId}`",  inline: true },
      { name: "<:1111pinkarrow:1496903118108229733> Kanal",      value: "{channel}",                        inline: true },
      { name: "<:89292document:1504506160399650907> Razlog",     value: "{razlog}",                         inline: false },
    ],
  },
  // ─── MODERACIJA ───────────────────────────────────────────────────────────
  {
    name: "warn",
    title: "<:73535warningids:1496899181674238053> Upozorenje",
    description: "{user} je upozoren/a od strane moderatora.",
    color: "#F39C12",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: null,
    fields: [
      { name: "<:7188members:1504505910314405888> Korisnik", value: "{user}", inline: true },
      { name: "<:1998twopartshieldids:1496898603246161970> Moderator", value: "{mod}", inline: true },
      { name: "<:89292document:1504506160399650907> Razlog", value: "{razlog}", inline: false },
    ],
  },
  {
    name: "ban",
    title: "<a:760912ban:1500446026715103253> Član Banovan",
    description: null,
    color: "#E74C3C",
    category: "Moderacija",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "ID", value: "`{userId}`", inline: true },
    ],
  },
  // ─── XP / AKTIVNOST ───────────────────────────────────────────────────────
  {
    name: "levelup",
    title: "<a:793429sparkles:1496899433634201611> ʟᴇᴠᴇʟ ᴜᴘ! <a:793429sparkles:1496899433634201611>",
    description:
      "━━━━━━━━━━━━━━━━━━━━\n<a:giveaways5:1500203902446997586> Čestitamo {user}!\nDostigao/la si **`★ LEVEL {level} ★`**\n━━━━━━━━━━━━━━━━━━━━\n<:32467lovetalk:1504505532323594321> **+100 XP** • <a:vatrice1:1500466044429664256> **+1 vatrica**\n📨 Sljedeći level: još `100` poruka!\n\n<a:aktivnost:1500203557134270534> Provjeri statistiku sa `/aktivnost` ili `/rank`",
    color: "#FFD700",
    category: "XP",
    footer: "<a:68523animatedarrowgreen:1496899143338033173> GIANNI (Custom) • XP Sistem (svakih 100 poruka)",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "vatrica-nova",
    title: "<a:VATRICE:1496898836155596962> ɴᴏᴠᴀ ᴠᴀᴛʀɪᴄᴀ! <a:VATRICE:1496898836155596962>",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:giveaways5:1500203902446997586> Čestitamo {user}!\nImaš sada **`{vatriceCount}`** <a:VATRICE:1496898836155596962>\n━━━━━━━━━━━━━━━━━━━━━━\n<:32467lovetalk:1504505532323594321> Zarađeno aktivnošću u chatu (svakih 150 poruka)\n<a:aktivnost:1500203557134270534> Tvoje mjesto: **#{rank}** od **{total}**\n\n**Do sljedeće vatrice:** `░░░░░░░░░░`  `{progress}/150`\n\n**<:79529shinycrown:1496899185516216400> Trenutni podij:**\n<:79529shinycrown:1496899185516216400> **{top1}** — <a:VATRICE:1496898836155596962> {top1count}\n<:40197blueneonstar:1496898993395859457> **{top2}** — <a:VATRICE:1496898836155596962> {top2count}\n<:428758neonverifiedcheck:1496898532559421571> **{top3}** — <a:VATRICE:1496898836155596962> {top3count}\n━━━━━━━━━━━━━━━━━━━━━━\n_Pogledaj kompletnu top listu sa_ `/vatrice pup`",
    color: "#FF6A00",
    category: "XP",
    footer: "<a:VATRICE:1496898836155596962> GIANNI (Custom) • Vatrice sistem",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "aktivnost",
    title: "<a:aktivnost:1500203557134270534> ᴀᴋᴛɪᴠɴᴏsᴛ",
    description:
      "━━━━━━━━━━━━━━━━━━━━\n<:7188members:1504505910314405888> **{user}**\n━━━━━━━━━━━━━━━━━━━━\n<:984706roleadminorange1:1496898583239200819><:984706roleadminorange1:1496898583239200819><:984706roleadminorange1:1496898583239200819><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142>  `{progress}/100`\n<a:44503lockkey:1500444008760217641> Još **`{doSljedeceg}`** poruka do sljedećeg levela!",
    color: "#FFA500",
    category: "XP",
    footer: "<a:68523animatedarrowgreen:1496899143338033173> GIANNI (Custom) • Aktivnost • Svakih 100 poruka novi level!",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Level",   value: "```fix\n★ {level} ★\n```", inline: true },
      { name: "<:40197blueneonstar:1496898993395859457> XP",      value: "```py\n{xp}\n```",          inline: true },
      { name: "<:32467lovetalk:1504505532323594321> Poruke",  value: "```css\n{poruke}\n```",     inline: true },
      { name: "<a:VATRICE:1496898836155596962> Vatrice", value: "```yaml\n{vatrice}\n```",   inline: true },
      { name: "<a:aktivnost1:1500203403362435234> Sistem",  value: "```ini\n[100 poruka = 1 LVL + 1 vatrica + 100 XP]\n```", inline: false },
    ],
  },
  {
    name: "rank",
    title: "<a:aktivnost1:1500203403362435234> Rank Profil",
    description:
      "<:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142>\n`▰▰▰▰▱▱▱▱▱▱` **40%**",
    color: "#9B59B6",
    category: "XP",
    footer: null,
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Level",    value: "```fix\n{level}\n```",      inline: true },
      { name: "<:40197blueneonstar:1496898993395859457> XP",       value: "```py\n{xp}/{needed}\n```", inline: true },
      { name: "<a:aktivnost:1500203557134270534> Progres",  value: "```css\n[{pct}%]\n```",     inline: true },
    ],
  },
  {
    name: "leaderboard-xp",
    title: "<:79529shinycrown:1496899185516216400> Top Lista — XP",
    description:
      "<:79529shinycrown:1496899185516216400> **ImeKorisnika** — Level `10` • `980 XP`\n<:40197blueneonstar:1496898993395859457> **ImeKorisnika2** — Level `8` • `650 XP`\n<:428758neonverifiedcheck:1496898532559421571> **ImeKorisnika3** — Level `7` • `420 XP`\n`4.` **ImeKorisnika4** — Level `6` • `310 XP`",
    color: "#9B59B6",
    category: "XP",
    footer: null,
    thumbnail: null,
    fields: [],
  },
  {
    name: "leaderboard-novac",
    title: "<:79529shinycrown:1496899185516216400> Top Lista — Bogatstvo",
    description:
      "<:79529shinycrown:1496899185516216400> **ImeKorisnika** — `25.000 <a:529977coin:1500444133389635704>`\n<:40197blueneonstar:1496898993395859457> **ImeKorisnika2** — `18.500 <a:529977coin:1500444133389635704>`\n<:428758neonverifiedcheck:1496898532559421571> **ImeKorisnika3** — `12.000 <a:529977coin:1500444133389635704>`\n`4.` **ImeKorisnika4** — `8.750 <a:529977coin:1500444133389635704>`",
    color: "#F1C40F",
    category: "XP",
    footer: null,
    thumbnail: null,
    fields: [],
  },
  // ─── EKONOMIJA ────────────────────────────────────────────────────────────
  {
    name: "heist",
    title: "<a:529977coin:1500444133389635704> RAZBOJ U PRIPREMI",
    description: "{user} organizuje razboj!\n**Klikni dugme da se pridružiš** (treba 3+ ljudi za uspjeh)\n<:2261bell:1504505860720820395> 30 sekundi do akcije!",
    color: "#F39C12",
    category: "Ekonomija",
    footer: null,
    thumbnail: null,
    fields: [],
  },
  {
    name: "lottery",
    title: "<a:43091slots:1500443990129115196> Sedmična Loto",
    description: null,
    color: "#2B2D42",
    category: "Ekonomija",
    footer: "/lottery buy — kupi tiket za 100 coina",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Pot", value: "`{pot}` coina", inline: true },
      { name: "<a:ticket:1500196243853541397> Tvoji tiketi", value: "`{my}` / `{total}`", inline: true },
      { name: "<:73535warningids:1496899181674238053> Šansa", value: "`{chance}%`", inline: true },
      { name: "<:2261bell:1504505860720820395> Sljedeći žrijeb", value: "{nextDraw}", inline: false },
    ],
  },
  {
    name: "quests",
    title: "<:89292document:1504506160399650907> Dnevni Zadaci",
    description:
      "<:268961empty:1496899316596605142> **Pošalji 10 poruka** — Budi aktivan u chatu\n`░░░░░░░░░░` `0/10` • <a:529977coin:1500444133389635704> `+200`\n\n<:428758neonverifiedcheck:1496898532559421571> **Odigraj slots** — Probaj sreću na slot mašini\n`██████████` `1/1` • <a:529977coin:1500444133389635704> `+150`\n\n<:268961empty:1496899316596605142> **Uhvati 5 životinja** — Idi u /hunt\n`███░░░░░░░` `3/5` • <a:529977coin:1500444133389635704> `+300`",
    color: "#2B2D42",
    category: "Ekonomija",
    footer: "Resetuju se u ponoć UTC • GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "<:428758neonverifiedcheck:1496898532559421571> Završeno", value: "`1/3`", inline: true },
    ],
  },
  {
    name: "giveaway",
    title: "<a:giveaways5:1500203902446997586> NAGRADNA IGRA!",
    description: "## <:79529shinycrown:1496899185516216400>  {nagrada}\n\nKlikni dugme **<a:giveaways5:1500203902446997586> Učestvuj** da se prijaviš!",
    color: "#F1C40F",
    category: "Ekonomija",
    footer: "Završava se automatski • GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "🕒 Trajanje",  value: "`{trajanje}`",              inline: true },
      { name: "<:7188members:1504505910314405888> Učesnici",  value: "`{ucesnici}`",              inline: true },
      { name: "<a:ticket:1500196243853541397> Domaćin",   value: "{domaćin}",                 inline: true },
      { name: "<:2261bell:1504505860720820395> Završava",  value: "{kraj}",                    inline: false },
    ],
  },
  // ─── IGRE ────────────────────────────────────────────────────────────────
  {
    name: "slots",
    title: "<a:43091slots:1500443990129115196>  S L O T  M A Š I N A",
    description: "𓉘  🍒  │  🍒  │  🍒  𓉝\n\n<a:43091slots:1500443990129115196> Sva tri ista — **JACKPOT!**",
    color: "#F1C40F",
    category: "Igre",
    footer: "GIANNI (Custom) • 🍒×3 🍋×3.5 🍊×4 🍇×5 <:2261bell:1504505860720820395>×6 <:40197blueneonstar:1496898993395859457>×8 💎×15 7️⃣×50",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Ulog", value: "`{ulog} <a:529977coin:1500444133389635704>`", inline: true },
      { name: "<:73535warningids:1496899181674238053> Rezultat", value: "<a:giveaways5:1500203902446997586> **+{dobitak} <a:529977coin:1500444133389635704>** *(×3)*", inline: true },
      { name: "🏦 Balans", value: "`{balans} <a:529977coin:1500444133389635704>`", inline: true },
    ],
  },
  {
    name: "blackjack",
    title: "<a:39865dice1:1500443897489526965> Blackjack",
    description: null,
    color: "#2B2D42",
    category: "Igre",
    footer: "Oklada: {oklada} <a:529977coin:1500444133389635704> • GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "Tvoje karte  (17)", value: "🂡 🂮", inline: false },
      { name: "Dealer  (?)", value: "🂫 🎴", inline: false },
      { name: "Rezultat", value: "<a:giveaways5:1500203902446997586> **BLACKJACK!** `+{dobitak} <a:529977coin:1500444133389635704>`!", inline: false },
    ],
  },
  {
    name: "poker-lobby",
    title: "<a:39865dice1:1500443897489526965> POKER — Texas Hold'em",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:529977coin:1500444133389635704> **Ulog po igraču:** `{ulog} <a:529977coin:1500444133389635704>`\n<:79529shinycrown:1496899185516216400> **Trenutni pot:** `{pot} <a:529977coin:1500444133389635704>`\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<:7188members:1504505910314405888> **Igrači ({count}/9):**\n▸ **{player1}**\n▸ **{player2}**\n\n▸ Klikni **Ulazi u igru** da se pridružiš\n▸ Domaćin klika **Počni igru** kad je spreman\n▸ Igra automatski kreće za **60 sekundi**",
    color: "#2ECC71",
    category: "Igre",
    footer: "<a:39865dice1:1500443897489526965> GIANNI (Custom) • Poker • Min 2, Max 9 igrača",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poker-game",
    title: "<a:39865dice1:1500443897489526965> Pre-Flop — Kartice podijeljene",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:39865dice1:1500443897489526965> **Zajedničke kartice:**\n`?` `?` `?` `?` `?`\n<a:529977coin:1500444133389635704> **Pot:** `{pot} <a:529977coin:1500444133389635704>`\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<:7188members:1504505910314405888> **Aktivni:**\n<:428758neonverifiedcheck:1496898532559421571> **{player1}**\n<:428758neonverifiedcheck:1496898532559421571> **{player2}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:44503lockkey:1500444008760217641> **Čekamo potez:**\n<a:44503lockkey:1500444008760217641> {player1}",
    color: "#F39C12",
    category: "Igre",
    footer: "<a:39865dice1:1500443897489526965> GIANNI (Custom) • Klikni 'Vidi kartice' za svoju ruku • Pot: {pot} <a:529977coin:1500444133389635704>",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poker-showdown",
    title: "<:79529shinycrown:1496899185516216400> SHOWDOWN — Poker",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:39865dice1:1500443897489526965> **Zajedničke kartice:**\n🂡 🂺 🂳 🃈 🃑\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<:79529shinycrown:1496899185516216400> **{winner}**\n   Ruka: 🂡 🂮\n   → **Royal Flush** | 🂡 🂺 🂳 🃈 🃑\n\n  **{loser}**\n   Ruka: 🃁 🃎\n   → **Dva Para** | 🂡 🂺 🃁 🃎 🂳\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<:79529shinycrown:1496899185516216400> **Pobjednik:** {winner}\n<a:529977coin:1500444133389635704> **Dobitak:** `{dobitak} <a:529977coin:1500444133389635704>` po pobjedniku",
    color: "#F1C40F",
    category: "Igre",
    footer: "<a:39865dice1:1500443897489526965> GIANNI (Custom) • Poker završen • Ukupni pot: {pot} <a:529977coin:1500444133389635704>",
    thumbnail: null,
    fields: [],
  },
  {
    name: "among-us-lobby",
    title: "<a:32877animatedarrowbluelite:1496898954783096933> Among Us — Lobby",
    description: "Pridruži se i čekaj da host pokrene igru!\n**Min 4 • Max 10 igrača**",
    color: "#1B1B2F",
    category: "Igre",
    footer: "Host: klikni ▶️ Pokreni igru kad ste svi tu!",
    thumbnail: null,
    fields: [
      { name: "<:7188members:1504505910314405888> Igrači (2/10)", value: "<:994180roleadminred1:1496902197605306461> Player1\n<:11309roleadminblue2:1496898576150954165> Player2", inline: false },
    ],
  },
  {
    name: "among-us-game",
    title: "<a:32877animatedarrowbluelite:1496898954783096933> Among Us — U Toku",
    description: null,
    color: "#1B1B2F",
    category: "Igre",
    footer: "<:89292document:1504506160399650907> Zadatak • <:73535warningids:1496899181674238053> Alarm • 🔪 Akcija • 🛑 Sabotiraj • <:7188members:1504505910314405888> Lažni alarm • 🔫 Šerif • 👻 Ghost",
    thumbnail: null,
    fields: [
      { name: "<:7188members:1504505910314405888> Igrači", value: "<:994180roleadminred1:1496902197605306461> Player1\n<:11309roleadminblue2:1496898576150954165> Player2\n<:32673memberred:1504505534273949848> ~~Player3~~", inline: false },
      { name: "<:89292document:1504506160399650907> Zadaci", value: "<:367280roleadmingreen:1496898579720044706><:367280roleadmingreen:1496898579720044706><:367280roleadmingreen:1496898579720044706><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142> `3/10`", inline: true },
      { name: "<:7188members:1504505910314405888> Živi", value: "<:11309roleadminblue2:1496898576150954165> 2 crew | <:994180roleadminred1:1496902197605306461> 1 imp", inline: true },
    ],
  },
  {
    name: "among-us-end",
    title: "<:428758neonverifiedcheck:1496898532559421571> <:11309roleadminblue2:1496898576150954165> CREWMATI POBIJEDE!",
    description: "Svi impostori eliminirani! <:428758neonverifiedcheck:1496898532559421571>",
    color: "#43B581",
    category: "Igre",
    footer: "GIANNI (Custom) • Among Us",
    thumbnail: null,
    fields: [
      { name: "<:7188members:1504505910314405888> Otkrivene uloge", value: "<:11309roleadminblue2:1496898576150954165> <:994180roleadminred1:1496902197605306461> **Player1** — CREWMATE\n<:994180roleadminred1:1496902197605306461> <:11309roleadminblue2:1496898576150954165> **Player2** — IMPOSTOR", inline: false },
    ],
  },
  {
    name: "kaladont-start",
    title: "<a:42985spellbook:1504506083094565125>  K A L A D O N T",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<a:64382pinksparkles:1500259869259989033> Igra je počela! Prva riječ:\n## <:32467lovetalk:1504505532323594321>  **BALKAN**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#00BCD4",
    category: "Igre",
    footer: "<a:42985spellbook:1504506083094565125> Pokrenuo/la: {user}  •  <:428758neonverifiedcheck:1496898532559421571> Pritisni dugme za kraj",
    thumbnail: null,
    fields: [
      { name: "<a:32877animatedarrowbluelite:1496898954783096933>  Sljedeća počinje sa", value: "## **`AN`**",             inline: true },
      { name: "<:2711settings:1504505863032012832>  Težina",              value: "<:4082signalbaryellow:1500260022846881862> Normalno · 2 slova",   inline: true },
      { name: "<:8526link:1504505939917803620>  Niz",                 value: "**#1**",                  inline: true },
      {
        name: "📖  Pravila igre",
        value:
          "<:428758neonverifiedcheck:1496898532559421571>  Svaka riječ počinje traženim slovima\n<a:760912ban:1500446026715103253>  Ista osoba **ne može** igrati iza sebe\n🔁  Ponavljanje iste riječi nije dozvoljeno\n<a:39865dice:1500260185510248448>  **50/50 sudbina** — čak i ispravna riječ može propasti!\n🆘  Pritisni **Pomoć** za primjer riječi\n<:79529shinycrown:1496899185516216400>  Upiši **`KALADONT`** i osvoji **1500** <a:529977coin:1500444133389635704> + **200** <a:64382pinksparkles:1500259869259989033> XP!",
        inline: false,
      },
    ],
  },
  {
    name: "kaladont-active",
    title: "<a:42985spellbook:1504506083094565125>  K A L A D O N T  —  aktivna igra",
    description: "━━━━━━━━━━━━━━━━━━━━━",
    color: "#00BCD4",
    category: "Igre",
    footer: "<:428758neonverifiedcheck:1496898532559421571> Pritisni dugme za kraj igre",
    thumbnail: null,
    fields: [
      { name: "<a:64382pinksparkles:1500259869259989033>  Zadnja riječ",          value: "**`ANKETA`**",    inline: true },
      { name: "<:32467lovetalk:1504505532323594321>  Odigrao/la",            value: "Korisnik",        inline: true },
      { name: "<:8526link:1504505939917803620>  Niz",                   value: "**#5**",          inline: true },
      { name: "<a:32877animatedarrowbluelite:1496898954783096933>  Sljedeća počinje sa",   value: "## **`TA`**",     inline: false },
    ],
  },
  {
    name: "kaladont-word",
    title: null,
    description: "## <a:64382pinksparkles:1500259869259989033>  **TAČKA**\n*<:32467lovetalk:1504505532323594321> Korisnik*",
    color: "#00BCD4",
    category: "Igre",
    footer: "<a:42985spellbook:1504506083094565125> GIANNI Kaladont  •  #6",
    thumbnail: null,
    fields: [
      { name: "<a:32877animatedarrowbluelite:1496898954783096933>  Sljedeća počinje sa", value: "## **`KA`**", inline: true },
      { name: "<:8526link:1504505939917803620>  Niz",                 value: "**#6**",       inline: true },
    ],
  },
  {
    name: "kaladont-win",
    title: "<:864113ownerpinkcrownwithheart:1496899493130539008>  K A L A D O N T  —  P O B J E D A !",
    description: "<a:giveaways5:1500203902446997586> {user} je izrekao/la magičnu riječ!",
    color: "#FFD700",
    category: "Igre",
    footer: "GIANNI (Custom) • Kaladont pobjeda",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400>  Pobjednik/ca",  value: "**{user}**", inline: true },
      { name: "<a:aktivnost:1500203557134270534>  Riječi u nizu", value: "**{count}**", inline: true },
      { name: "<a:529977coin:1500444133389635704>  Nagrada",       value: "**+1.500 <a:529977coin:1500444133389635704>**", inline: true },
      { name: "<:40197blueneonstar:1496898993395859457>  XP",            value: "**+200**", inline: true },
    ],
  },
  {
    name: "bingo",
    title: "<a:39865dice:1500260185510248448>  ✦  B  I  N  G  O  ✦  <a:39865dice:1500260185510248448>",
    description:
      "<:73535warningids:1496899181674238053> **Klikni dugme ispod i unesi 5 brojeva (1–75)!**\n<a:ticket:1500196243853541397> Tiket košta samo **500 coina** <a:529977coin:1500444133389635704>\n\n<:2261bell:1504505860720820395> Imaš **2 minute** za tiket — brzo! <a:VATRICE:1496898836155596962>\n<:7289announcement:1504505912939909141> Rezultati se objavljuju **javno** za sve <:7289announcement:1504505912939909141>",
    color: "#00BCD4",
    category: "Igre",
    footer: "<a:39865dice:1500260185510248448> × GIANNI Bingo • Cijena tiketa: 500 coina <a:529977coin:1500444133389635704>",
    thumbnail: null,
    fields: [
      {
        name: "<:79529shinycrown:1496899185516216400>  Nagradna lista",
        value:
          "<:428758neonverifiedcheck:1496898532559421571> `2 pogotka`  ──  **10.000** coina\n<:40197blueneonstar:1496898993395859457> `3 pogotka`  ──  **30.000** coina\n<:79529shinycrown:1496899185516216400> `4 pogotka`  ──  **75.000** coina\n<:864113ownerpinkcrownwithheart:1496899493130539008> `5 pogodaka` ── **250.000** coina  <:79529shinycrown:1496899185516216400> **JACKPOT!**",
        inline: false,
      },
    ],
  },
  // ─── FUN / ŽIVOTINJE ──────────────────────────────────────────────────────
  {
    name: "hunt",
    title: "<a:79705bow:1500262801862824047>  Uhvatio si životinje!",
    description: "## <a:874347butterfly:1496899500160192562>  Vuk\n<:40197blueneonstar:1496898993395859457> **Uncommon**  ·  <a:387466flamingfiresword:1500462011648049192> Snaga `15`",
    color: "#9B59B6",
    category: "Fun",
    footer: "{user} • GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [
      { name: "<a:brojanje:1500059790376697988> Imaš ukupno", value: "`1x <a:874347butterfly:1496899500160192562> Vuk`", inline: true },
      { name: "<a:529977coin:1500444133389635704> Vrijednost",   value: "`80 <a:529977coin:1500444133389635704>`",       inline: true },
    ],
  },
  {
    name: "zoo",
    title: "<a:874347butterfly:1496899500160192562> {user} — Zoo",
    description:
      "<a:793429sparkles:1496899433634201611> **Legendary**\n<a:VATRICE:1496898836155596962> **Zmaj** `×1`\n\n<:40197blueneonstar:1496898993395859457> **Uncommon**\n<a:874347butterfly:1496899500160192562> **Vuk** `×3`  🦊 **Lisica** `×2`\n\n<:367280roleadmingreen:1496898579720044706> **Common**\n🐟 **Riba** `×7`  🐇 **Zec** `×5`",
    color: "#9B59B6",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0 • /hunt za loviti!",
    thumbnail: null,
    fields: [
      { name: "<a:brojanje:1500059790376697988> Ukupno", value: "`18` životinja", inline: true },
      { name: "<a:387466flamingfiresword:1500462011648049192> Snaga",  value: "`145`",           inline: true },
    ],
  },
  {
    name: "battle",
    title: "<a:387466flamingfiresword:1500462011648049192>  BITKA!",
    description:
      "**{player1}** vs **{player2}**\n`████████████░░░░░░░░`\n<a:387466flamingfiresword:1500462011648049192> `{score1}` vs `{score2}` <a:387466flamingfiresword:1500462011648049192>",
    color: "#F1C40F",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: "{winner.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Pobjednik", value: "**{winner}**",     inline: true },
      { name: "<:32673memberred:1504505534273949848> Poražen",   value: "{loser}",           inline: true },
      { name: "<a:529977coin:1500444133389635704> Nagrada",   value: "`+{nagrada} <a:529977coin:1500444133389635704>`",  inline: false },
    ],
  },
  {
    name: "pray",
    title: null,
    description: "<a:64382pinksparkles:1500259869259989033> {user} moli se za {target}! Nebo čuje — `+{bonus} <a:529977coin:1500444133389635704>` palo s neba!",
    color: "#FFD700",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vers",
    title: null,
    description: "> <a:music2:1500459145382592602>\n> *Ovo je primjer versa koji korisnik pošalje*\n> *Svaki red je jedan stih*\n> <a:music2:1500459145382592602>",
    color: "#9B30FF",
    category: "Fun",
    footer: "<a:music2:1500459145382592602> vers • drop the mic",
    thumbnail: null,
    fields: [],
  },
  // ─── LJUBAVNE ─────────────────────────────────────────────────────────────
  {
    name: "zagrljaj",
    title: null,
    description: "<a:64382pinksparkles:1500259869259989033> {from} grli {to}! Aww, tako slatko! <a:3599pinkheart:1504504866700132534>",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poljubac",
    title: null,
    description: "<a:3599pinkheart:1504504866700132534> {from} šalje poljubac {to}! <a:3599pinkheart:1504504866700132534>",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "mazi",
    title: null,
    description: "<a:3599pinkheart:1504504866700132534> {from} mazi {to} nježno! Aww! <a:3599pinkheart:1504504866700132534>",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "tapsi",
    title: null,
    description: "<a:571294pinkpaw:1500259928936284211> {from} tapše {to} prijateljski! <:428758neonverifiedcheck:1496898532559421571>",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "high5",
    title: null,
    description: "<a:236855heartpop:1496899299487907870> {from} daje peticu {to}! HIGH FIVE! ✋",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "cudan",
    title: null,
    description: "<a:568481annoyedgojo:1496899399077330994> {from} je ćudan prema {to}! Ajde, brate... <a:568481annoyedgojo:1496899399077330994>",
    color: "#F39C12",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "srce",
    title: null,
    description: "<a:3599pinkheart:1504504866700132534> {from} šalje srce {to}! Aww! <a:3599pinkheart:1504504866700132534>",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "brak",
    title: null,
    description: "<:33927diamond:1496898969052381407> {from} zaprosio {to}! <a:3599pinkheart:1504504866700132534> Hoćeš li? 🥂",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "kompli",
    title: null,
    description: "<a:124071redrose:1496899261651226766> {from} kaže {to}: 'Ti si razlog zašto dan počinje sa osmijehom. <a:3599pinkheart:1504504866700132534>'",
    color: "#FF85C8",
    category: "Fun",
    footer: "GIANNI (Custom) • Muvanje 101 <a:3599pinkheart:1504504866700132534>",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "fora",
    title: null,
    description: "<a:6796oof:1496898747018379305> {from} je pogledao/la {to} i shvatio/la: 'Brate/sestro, ti si dokaz da evolucija nije uvijek napredak.' 🐒",
    color: "#2B2D42",
    category: "Fun",
    footer: "GIANNI (Custom) • Sve u šali! <a:6796oof:1496898747018379305>",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "muv",
    title: null,
    description: "<a:24420sleepyhellokitty:1496898915176415413> {from} {to}: 'Jesi li ti WiFi? Jer osjećam konekciju između nas.' <a:64382pinksparkles:1500259869259989033><a:3599pinkheart:1504504866700132534>",
    color: "#FF4D6D",
    category: "Fun",
    footer: "GIANNI (Custom) • Balkan Muvanje™ <a:24420sleepyhellokitty:1496898915176415413>",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "crush",
    title: null,
    description: "<a:3599pinkheart:1504504866700132534> Po zvijezdama i kafanskim računima, tvoj tajni crush je... **{crush}**! 😳",
    color: "#FF4D6D",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  // ─── INFO ─────────────────────────────────────────────────────────────────
  {
    name: "spotify",
    title: "<:40197blueneonstar:1496898993395859457> {trackTitle}",
    description:
      "<a:music2:1500459145382592602> **Izvođač:** {artist}\n<a:85034pinknotes:1500444022622130196> **Album:** {album}\n\n`0:45` ▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱▱▱▱▱ `3:22`",
    color: "#1DB954",
    category: "Info",
    footer: "Spotify • GIANNI (Custom)",
    thumbnail: "{albumArt}",
    fields: [],
  },
  {
    name: "invite",
    title: "<a:aktivnost:1500203557134270534> Statistika — {user}",
    description: null,
    color: "#2B2D42",
    category: "Info",
    footer: "Korisnik: {user} • ID: {userId}",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:7289announcement:1504505912939909141> Poruke poslato", value: "`{poruke}`", inline: true },
      { name: "<:7188members:1504505910314405888> Doveo članova",   value: "`{invites}`",     inline: true },
      { name: "<:2261bell:1504505860720820395> Pridružio",       value: "{joinedAt}",      inline: true },
      { name: "<:8526link:1504505939917803620> Tvoj invite",     value: "`{inviteUses}` korišćenja", inline: false },
    ],
  },
  {
    name: "avatar",
    title: "<:40197blueneonstar:1496898993395859457> {user}",
    description: "<a:32877animatedarrowbluelite:1496898954783096933> [PNG]({png}) **·** <:40197blueneonstar:1496898993395859457> [JPG]({jpg}) **·** <:40197blueneonstar:1496898993395859457> [WEBP]({webp})",
    color: "#2B2D42",
    category: "Info",
    footer: null,
    thumbnail: null,
    fields: [],
  },
  {
    name: "brojanje-info",
    title: "<a:brojanje:1500059790376697988> Brojanje — stanje",
    description:
      "<:7289announcement:1504505912939909141> **Kanal:** {channel}\n<a:brojanje:1500059790376697988> **Trenutno:** `{current}`\n<a:32877animatedarrowbluelite:1496898954783096933> **Sljedeći broj:** `{next}`\n<:7188members:1504505910314405888> **Zadnji brojao:** {lastUser}\n<:79529shinycrown:1496899185516216400> **Rekord:** `{highScore}`",
    color: "#2B2D42",
    category: "Info",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  // ─── SISTEM PANELI ────────────────────────────────────────────────────────
  {
    name: "ticket",
    title: "<a:ticket:1500196243853541397>  Otvori Tiket",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:ticket:1500196243853541397> Trebaš pomoć? **Otvori tiket**!\n\n<:89292document:1504506160399650907> Popuni formu i naš staff će ti odgovoriti što prije.\n<a:44503lockkey:1500444008760217641> Prosječno vrijeme odgovora: **< 30 minuta**\n━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#00BCD4",
    category: "Sistem",
    footer: "<a:ticket:1500196243853541397> GIANNI Ticket Sistem",
    thumbnail: null,
    fields: [
      {
        name: "<:89292document:1504506160399650907> Šta ćeš dobiti",
        value: "<a:44503lockkey:1500444008760217641> Privatni kanal samo za tebe i staff\n<:428758neonverifiedcheck:1496898532559421571> Pomoć od iskusnog tima\n<:8526link:1504505939917803620> Možeš priložiti slike/screenshote",
        inline: false,
      },
    ],
  },
  {
    name: "ticket-otvoren",
    title: "<:428758neonverifiedcheck:1496898532559421571>  Tiket otvoren!",
    description:
      "## <a:giveaways5:1500203902446997586> Tvoj tiket je kreiran!\nPrivatni kanal: {channel}\n\n<a:44503lockkey:1500444008760217641> Staff će ti odgovoriti uskoro. Budemo te obavijestili! 📩",
    color: "#00BCD4",
    category: "Sistem",
    footer: "<a:ticket:1500196243853541397> GIANNI  •  Hvala na strpljenju! <a:64382pinksparkles:1500259869259989033>",
    thumbnail: null,
    fields: [
      {
        name: "<:89292document:1504506160399650907>  Šta dalje?",
        value:
          "<:32467lovetalk:1504505532323594321> Idi u kanal i čekaj odgovor staffa\n<:8526link:1504505939917803620> Možeš priložiti slike/screenshote\n<a:44503lockkey:1500444008760217641> Kanal je **privatan** — samo ti i staff\n<:428758neonverifiedcheck:1496898532559421571> Ticket se zatvara kad je problem riješen",
        inline: false,
      },
    ],
  },
  {
    name: "staff-prijava",
    title: "<:89292document:1504506160399650907>  STAFF PRIJAVA",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nOtvorene su prijave za **Staff tim** servera!\n\n<:89292document:1504506160399650907> **Kako se prijaviti:**\n<:114060numberone1pink:1500460043575885915>  Klikni redom na **5 dugmadi** ispod i upiši svoje podatke\n<:2262numbertwo2pink:1500460047424548875>  Kad popuniš **sva polja**, klikni **<:7289announcement:1504505912939909141> Pošalji prijavu**\n<:113numberthree3pink:1500460051209195571>  Bot će ti otvoriti **privatni kanal** sa staff timom\n\n<a:44503lockkey:1500444008760217641> Tvoji odgovori se vide samo tebi dok ne pošalješ prijavu.\n<a:760912ban:1500446026715103253> **Discord invite linkovi nisu dozvoljeni** u poljima!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#00BCD4",
    category: "Sistem",
    footer: "<:89292document:1504506160399650907> GIANNI (Custom) • Staff Prijava",
    thumbnail: null,
    fields: [
      {
        name: "<:1111pinkarrow:1496903118108229733> Rubrike",
        value:
          "<a:brojanje:1500059790376697988> **Godine** — koliko imaš godina\n<:1998twopartshieldids:1496898603246161970> **Iskustvo** — prethodno iskustvo\n<:32467lovetalk:1504505532323594321> **Motivacija** — zašto želiš staff\n<:7188members:1504505910314405888> **Igrači** — koliko ljudi možeš dovesti\n<:2261bell:1504505860720820395> **Aktivnost** — sati dnevno + timezone",
        inline: false,
      },
    ],
  },
  {
    name: "private-vc",
    title: "🔊 Dobrodošao u svoj kanal, {user}!",
    description:
      "**Ti si vlasnik!** <:864113ownerpinkcrownwithheart:1496899493130539008> Koristi dugmad ispod:\n\n<a:44503lockkey:1500444008760217641> **Lock** — niko ne može ući\n<:28110unlock1:1504509370065752166> **Unlock** — svi mogu ući\n<a:44503lockkey:1500444008760217641> **Hide / Show** — sakrij/pokaži kanal\n<:89292document:1504506160399650907> **Rename** — promijeni ime\n<:7188members:1504505910314405888> **Limit** — postavi max članova\n<a:760912ban:1500446026715103253> **Kick** — izbaci nekog iz kanala\n<:864113ownerpinkcrownwithheart:1496899493130539008> **Owner** — prebaci vlasništvo\n<a:3485cancel:1500443837452255302> **Delete** — obriši kanal\n\n*Kanal se automatski briše kad ostane prazan.*",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Privatni Voice Sistem",
    thumbnail: null,
    fields: [],
    buttons: [],
  },
  {
    name: "voice-pravila",
    title: "🔊  P R I V A T N I  V O I C E  K A N A L I",
    description:
      "Uđi u <#1494043959213953114> i bot ti **automatski** kreira vlastiti voice kanal.\nPostaješ **vlasnik** <:864113ownerpinkcrownwithheart:1496899493130539008> i dobijaš puni kontrolni panel.",
    color: "#2B2D3A",
    category: "Sistem paneli",
    footer: "🔊 GIANNI • Voice Pravila",
    thumbnail: null,
    fields: [
      { name: "<:428758neonverifiedcheck:1496898532559421571>  Ponašanje", value: "<a:760912ban:1500446026715103253> Bez vrijeđanja, maltretiranja i rasizma\n<a:music2:1500459145382592602> Ne prekidaj druge dok pričaju\n<a:760912ban:1500446026715103253> Ne lupaj mikrofonom bez razloga", inline: true },
      { name: "<:864113ownerpinkcrownwithheart:1496899493130539008>  Vlasništvo", value: "🎛️ Samo vlasnik koristi Lock / Hide / Kick panel\n🔁 Prebaci vlasništvo prije izlaska\n⚖️ Ne koristi panel za maltretiranje", inline: true },
      { name: "🔞  Sadržaj & Imena", value: "<a:760912ban:1500446026715103253> Bez NSFW sadržaja i streaminga\n<:89292document:1504506160399650907> Ime kanala mora biti pristojno\n<:89292document:1504506160399650907> Vrijede sva opšta pravila servera", inline: true },
      { name: "<a:760912ban:1500446026715103253>  Automatsko brisanje", value: "Kad svi izađu, bot **automatski briše** kanal.\n<:1998twopartshieldids:1496898603246161970> Staff ima pristup svim kanalima zbog moderacije.", inline: false },
      { name: "<:73535warningids:1496899181674238053>  Kazne", value: "`1.` <:73535warningids:1496899181674238053> Upozorenje  `2.` <a:760912ban:1500446026715103253> Voice mute  `3.` <a:760912ban:1500446026715103253> Zabrana voice-a  `4.` <a:760912ban:1500446026715103253> Kick / <a:760912ban:1500446026715103253> Ban", inline: false },
    ],
    buttons: [
      { label: "🔊 Kreiraj svoj voice", style: "success", customId: "vc_create_btn" },
    ],
  },
  // ─── VATRICE ──────────────────────────────────────────────────────────────
  {
    name: "vatrice-pup",
    title: "<a:VATRICE:1496898836155596962> Top Lista — Vatrice",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:VATRICE:1496898836155596962> Najpopularniji članovi po vatricama:\n━━━━━━━━━━━━━━━━━━━━━━\n<:79529shinycrown:1496899185516216400> **{top1}** — <a:VATRICE:1496898836155596962> `{top1count}`\n<:40197blueneonstar:1496898993395859457> **{top2}** — <a:VATRICE:1496898836155596962> `{top2count}`\n<:428758neonverifiedcheck:1496898532559421571> **{top3}** — <a:VATRICE:1496898836155596962> `{top3count}`\n`4.` **{top4}** — <a:VATRICE:1496898836155596962> `{top4count}`\n`5.` **{top5}** — <a:VATRICE:1496898836155596962> `{top5count}`\n━━━━━━━━━━━━━━━━━━━━━━\n<a:aktivnost:1500203557134270534> Tvoje mjesto: **#{rank}** | Imaš: **{myCount}** <a:VATRICE:1496898836155596962>",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "<a:VATRICE:1496898836155596962> GIANNI (Custom) • Vatrice Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vatrice-start",
    title: "<:428758neonverifiedcheck:1496898532559421571> Vatrica Sistem — Aktiviran!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:428758neonverifiedcheck:1496898532559421571> Vatrica sistem je uspješno aktiviran na ovom serveru!\n━━━━━━━━━━━━━━━━━━━━━━\n<a:VATRICE:1496898836155596962> Svako **{prag}** poruka, član dobija **1 vatricu**\n📛 Nick se automatski ažurira: `<a:VATRICE:1496898836155596962>×{count} ImeKorisnika`\n<:7289announcement:1504505912939909141> Objave se šalju u {kanal}\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "<a:VATRICE:1496898836155596962> GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [
      { name: "<a:VATRICE:1496898836155596962> Emoji", value: "`{emoji}`", inline: true },
      { name: "<:7289announcement:1504505912939909141> Kanal", value: "{kanal}", inline: true },
      { name: "<a:aktivnost:1500203557134270534> Prag",  value: "`{prag}` poruka", inline: true },
    ],
  },
  {
    name: "vatrice-kanal",
    title: "<:428758neonverifiedcheck:1496898532559421571> Vatrica Kanal Postavljen",
    description: "Objave vatrica će se od sada slati u {kanal}.",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "<a:VATRICE:1496898836155596962> GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vatrice-oblik",
    title: "<a:VATRICE:1496898836155596962> Vatrica Emoji Promijenjen",
    description: "━━━━━━━━━━━━━━━━━━━━━━\nEmoji vatrice je promijenjen!\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "<a:VATRICE:1496898836155596962> GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [
      { name: "<a:760912ban:1500446026715103253> Stari emoji", value: "`{stari}`", inline: true },
      { name: "<:428758neonverifiedcheck:1496898532559421571> Novi emoji", value: "`{novi}`", inline: true },
    ],
  },
  // ─── EKONOMIJA (dopune) ───────────────────────────────────────────────────
  {
    name: "giveaway-end",
    title: "<:79529shinycrown:1496899185516216400> Nagradna Igra — ZAVRŠENA!",
    description: "## <a:302883greenpresent:1500461838108721182>  {nagrada}\n\nČestitamo pobjedniku — pratite objavu!",
    color: "#2ECC71",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Giveaway završen",
    thumbnail: null,
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Pobjednik",  value: "{pobjednik}",  inline: true },
      { name: "<:7188members:1504505910314405888> Učesnici",   value: "`{ucesnici}`", inline: true },
      { name: "<a:ticket:1500196243853541397> Domaćin",    value: "{domaćin}",    inline: true },
    ],
  },
  // ─── IGRE (dopune) ────────────────────────────────────────────────────────
  {
    name: "vjasala",
    title: "<:89292document:1504506160399650907>  V J E Š A L A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:89292document:1504506160399650907> Pogodi skrivenu riječ!\n\n```\n_ _ _ _ _ _\n```\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /vjasala",
    thumbnail: null,
    fields: [
      { name: "<a:3599pinkheart:1504504866700132534> Životi",       value: "`{zivoti}/6`",            inline: true },
      { name: "<a:42985spellbook:1504506083094565125> Pogođena slova", value: "`{pogodjena}`",          inline: true },
      { name: "<a:3485cancel:1500443837452255302> Promašaji",     value: "`{promasaji}`",           inline: true },
    ],
  },
  {
    name: "vjasala-kraj",
    title: "<a:giveaways5:1500203902446997586> Vješala — Pogodak!",
    description: "Čestitamo {user}! Pogodio/la si **{rijec}**! <a:giveaways5:1500203902446997586>\n<a:529977coin:1500444133389635704> **Nagrada:** `+{nagrada} coina`",
    color: "#2ECC71",
    category: "Igre",
    footer: "GIANNI (Custom) • /vjasala",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "toplo-hladno",
    title: "<a:aktivnost:1500203557134270534>  T O P L O  •  H L A D N O",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:73535warningids:1496899181674238053> Pogodi tajni broj (1–{max})!\n\n<:11309roleadminblue2:1496898576150954165> **Hladno** — daleko si\n<:4082signalbaryellow:1500260022846881862> **Toplo** — bliže si\n<:994180roleadminred1:1496902197605306461> **Vrelo** — skoro!\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#3498DB",
    category: "Igre",
    footer: "GIANNI (Custom) • /toplo-hladno",
    thumbnail: null,
    fields: [
      { name: "<a:39865dice:1500260185510248448> Maksimum",   value: "`{max}`",       inline: true },
      { name: "<a:brojanje:1500059790376697988> Pokušaji",   value: "`{pokusaji}`",  inline: true },
      { name: "<a:aktivnost:1500203557134270534> Status",     value: "{status}",      inline: true },
    ],
  },
  {
    name: "kviz",
    title: "<a:42985spellbook:1504506083094565125>  K V I Z  —  Balkan Pitanje",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:73535warningids:1496899181674238053> **{pitanje}**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#E74C3C",
    category: "Igre",
    footer: "GIANNI (Custom) • /kviz • Oklada: {oklada} <a:529977coin:1500444133389635704>",
    thumbnail: null,
    fields: [
      { name: "<:11309roleadminblue2:1496898576150954165> A",  value: "{a}", inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> B",  value: "{b}", inline: true },
      { name: "<:367280roleadmingreen:1496898579720044706> C",  value: "{c}", inline: true },
      { name: "<:984706roleadminorange1:1496898583239200819> D",  value: "{d}", inline: true },
    ],
  },
  {
    name: "geografija",
    title: "<:7289announcement:1504505912939909141>  G E O G R A F I J A  —  Kviz",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:7289announcement:1504505912939909141> **{pitanje}**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#27AE60",
    category: "Igre",
    footer: "GIANNI (Custom) • /geografija • Oklada: {oklada} <a:529977coin:1500444133389635704>",
    thumbnail: null,
    fields: [
      { name: "<:11309roleadminblue2:1496898576150954165> A",  value: "{a}", inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> B",  value: "{b}", inline: true },
      { name: "<:367280roleadmingreen:1496898579720044706> C",  value: "{c}", inline: true },
      { name: "<:984706roleadminorange1:1496898583239200819> D",  value: "{d}", inline: true },
    ],
  },
  {
    name: "mafia-lobby",
    title: "<:7188members:1504505910314405888>  M A F I A  —  Lobby",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━\n<:7188members:1504505910314405888> Mafia igra se priprema!\n**Pridruži se klikom na dugme.**\n━━━━━━━━━━━━━━━━━━━━━━━\n<:2711settings:1504505863032012832> Min: **5** | Max: **12** igrača\n<:2261bell:1504505860720820395> Igra kreće automatski za **60s** ili kad host klikne Start",
    color: "#2C3E50",
    category: "Igre",
    footer: "<:7188members:1504505910314405888> GIANNI (Custom) • Mafia",
    thumbnail: null,
    fields: [
      { name: "<:7188members:1504505910314405888> Igrači ({count}/12)", value: "{igraci}", inline: false },
    ],
  },
  {
    name: "mafia-end",
    title: "<:79529shinycrown:1496899185516216400>  M A F I A  —  Kraj Igre",
    description: "## {rezultat}\n\n{opis}",
    color: "#F1C40F",
    category: "Igre",
    footer: "<:7188members:1504505910314405888> GIANNI (Custom) • Mafia završena",
    thumbnail: null,
    fields: [
      { name: "<:7188members:1504505910314405888> Uloge",    value: "{uloge}",   inline: false },
      { name: "<:79529shinycrown:1496899185516216400> Pobjednici", value: "{pobjednici}", inline: true },
      { name: "<:32673memberred:1504505534273949848> Eliminirani", value: "{eliminirani}", inline: true },
    ],
  },
  // ─── POO ──────────────────────────────────────────────────────────────────
  {
    name: "poo",
    title: "<a:VATRICE:1496898836155596962>  P O O  —  Stanje Kreature",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n{emojiBar}\n**Zdravlje:** `{zdravlje}/100`\n**Raspoloženje:** `{raspolozenje}`\n━━━━━━━━━━━━━━━━━━━━━━\n<:7188members:1504505910314405888> Ukupno čuvara: **{cuvari}**\n<:89292document:1504506160399650907> Završenih zadataka: **{zadaci}/100**",
    color: "#8B4513",
    category: "Poo",
    footer: "<a:VATRICE:1496898836155596962> GIANNI (Custom) • Poo Sistem",
    thumbnail: null,
    fields: [
      { name: "<a:3599pinkheart:1504504866700132534> Zdravlje",      value: "`{zdravlje}/100`",  inline: true },
      { name: "😊 Raspoloženje",  value: "`{raspolozenje}`",  inline: true },
      { name: "<:89292document:1504506160399650907> Zadaci",         value: "`{zadaci}/100`",    inline: true },
    ],
  },
  {
    name: "poo-zadaci",
    title: "<:89292document:1504506160399650907>  P O O  —  Zadaci",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:89292document:1504506160399650907> Lista Poo zadataka — stranica **{str}/{ukupnoStr}**\n━━━━━━━━━━━━━━━━━━━━━━\n{zadaci}",
    color: "#8B4513",
    category: "Poo",
    footer: "<a:VATRICE:1496898836155596962> GIANNI (Custom) • Poo Zadaci • /poo-zadaci [stranica]",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poo-top",
    title: "<:79529shinycrown:1496899185516216400>  P O O  —  Top Čuvari",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:79529shinycrown:1496899185516216400> **{top1}** — `{top1pts}` pts\n<:40197blueneonstar:1496898993395859457> **{top2}** — `{top2pts}` pts\n<:428758neonverifiedcheck:1496898532559421571> **{top3}** — `{top3pts}` pts\n`4.` **{top4}** — `{top4pts}` pts\n`5.` **{top5}** — `{top5pts}` pts\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#8B4513",
    category: "Poo",
    footer: "<a:VATRICE:1496898836155596962> GIANNI (Custom) • Poo Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poo-hrani",
    title: "<:984706roleadminorange1:1496898583239200819>  P O O  —  Hranjen!",
    description:
      "{user} je hranio/la Poo-a! <a:giveaways5:1500203902446997586>\nPotrošeno: **200 coina**\n\n{emojiBar}\n**Zdravlje:** `{zdravlje}/100` **(+{bonus})**",
    color: "#8B4513",
    category: "Poo",
    footer: "<a:VATRICE:1496898836155596962> GIANNI (Custom) • Poo Sistem",
    thumbnail: null,
    fields: [
      { name: "<a:3599pinkheart:1504504866700132534> Novo zdravlje",  value: "`{zdravlje}/100`", inline: true },
      { name: "<a:529977coin:1500444133389635704> Trošak",          value: "`200 coina`",       inline: true },
    ],
  },
  {
    name: "poo-info",
    title: "<a:aktivnost:1500203557134270534>  P O O  —  Moj Doprinos",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:7188members:1504505910314405888> **{user}**\n━━━━━━━━━━━━━━━━━━━━━━\n{progres}",
    color: "#8B4513",
    category: "Poo",
    footer: "<a:VATRICE:1496898836155596962> GIANNI (Custom) • Poo Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:428758neonverifiedcheck:1496898532559421571> Završenih zadataka", value: "`{zavrseni}`",  inline: true },
      { name: "<:40197blueneonstar:1496898993395859457> Bodova ukupno",      value: "`{bodovi}`",    inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Rang",               value: "`#{rang}`",     inline: true },
    ],
  },
  // ─── ADMIN / BACKUP ───────────────────────────────────────────────────────
  {
    name: "backup",
    title: "<:428758neonverifiedcheck:1496898532559421571>  B A C K U P  —  Snimljen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:428758neonverifiedcheck:1496898532559421571> Backup je uspješno snimljen!\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#2ECC71",
    category: "Admin",
    footer: "<:428758neonverifiedcheck:1496898532559421571> GIANNI (Custom) • Backup Sistem",
    thumbnail: null,
    fields: [
      { name: "<:2261bell:1504505860720820395> Datum",       value: "{datum}",    inline: true },
      { name: "<:89292document:1504506160399650907> Veličina",    value: "{velicina}", inline: true },
      { name: "<a:32877animatedarrowbluelite:1496898954783096933> Cloud",       value: "Discord DM", inline: true },
    ],
  },
  {
    name: "backup-restore",
    title: "<a:68523animatedarrowgreen:1496899143338033173>  B A C K U P  —  Vraćen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:428758neonverifiedcheck:1496898532559421571> Backup je uspješno vraćen!\n━━━━━━━━━━━━━━━━━━━━━━\n<:73535warningids:1496899181674238053> Svi podaci su prepisani backupom od **{datum}**.",
    color: "#E67E22",
    category: "Admin",
    footer: "<:428758neonverifiedcheck:1496898532559421571> GIANNI (Custom) • Backup Vraćen",
    thumbnail: null,
    fields: [
      { name: "<:2261bell:1504505860720820395> Backup datum", value: "{datum}",   inline: true },
      { name: "<:7188members:1504505910314405888> Pokrenuo",     value: "{korisnik}", inline: true },
    ],
  },
  {
    name: "backup-status",
    title: "<a:aktivnost:1500203557134270534>  B A C K U P  —  Status",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:32877animatedarrowbluelite:1496898954783096933> Cloud backup istorija:\n━━━━━━━━━━━━━━━━━━━━━━\n{historija}",
    color: "#3498DB",
    category: "Admin",
    footer: "<:428758neonverifiedcheck:1496898532559421571> GIANNI (Custom) • Backup Sistem",
    thumbnail: null,
    fields: [
      { name: "<:89292document:1504506160399650907> Ukupno backupa", value: "`{ukupno}`",   inline: true },
      { name: "🕒 Zadnji",          value: "{zadnji}",     inline: true },
      { name: "<:428758neonverifiedcheck:1496898532559421571> Veličina",        value: "{velicina}",   inline: true },
    ],
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
