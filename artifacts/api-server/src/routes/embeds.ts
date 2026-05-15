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
      "**wlcm {user}!**\n\n<a:vatrice1:1500466044429664256> #chat **·** <a:vatrice2:1500466048418185246> #info **·** <a:vatrice3:1500466039782113352> #news **·** <a:vatrice4:1500466061970247741> #gws\n🪶 **{memberCount} member · discord.gg/gian**",
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
      "**bye {user}** 👋\n\n<a:vatrice1:1500466044429664256> {user} **je napustio/la server**\n🪶 **{memberCount} member · discord.gg/gian**",
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
      "**wlcm {user}!**\n\n<a:vatrice1:1500466044429664256> <#1496860023706488884> **·** <a:vatrice2:1500466048418185246> <#1496860023093989475> **·** <a:vatrice3:1500466039782113352> <#1501973333195882696> **·** <a:vatrice4:1500466061970247741> <#1496860023480127505>\n🪶 **{memberCount} member · discord.gg/gian**",
    color: "#2B2D3A",
    category: "Sistem",
    footer: "GIANNI (Custom) • Dobrodošlica DM",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "boost",
    title: "💜 Novi Boost!",
    description:
      "{user} je upravo **boostovao server**! 🚀\nHvala ti na podršci — server je sad još jači! 💪",
    color: "#F47FFF",
    category: "Sistem",
    footer: "GIANNI (Custom) • Hvala na podršci 💜",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "🚀 Boostova", value: "`{boostCount}`", inline: true },
      { name: "🏅 Tier", value: "`Lvl {tier}`", inline: true },
      { name: "🎁 Nagrada", value: "`+2.500 💶`", inline: true },
    ],
  },
  {
    name: "birthday",
    title: "🎂 Sretan Rođendan!",
    description: "Danas je rođendan od {user}! 🎉\nSvi mu/joj čestitajte! 🥳",
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
    footer: "⭐ {count} | #{channel}",
    thumbnail: null,
    fields: [
      { name: "📍 Original", value: "[Idi na poruku]({jumpUrl})", inline: false },
    ],
  },
  {
    name: "aotw",
    title: "👑 Aktivni Član Sedmice",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n👑 Najaktivniji član ove sedmice je:\n\n## {user}\n\n💬 Napisao/la **{count}** poruka u zadnjih 7 dana!\n━━━━━━━━━━━━━━━━━━━━━━\n🎁 **Nagrada:** `+500 coina` 💰 + `+100 XP` ⚡\n💜 Hvala što si dio × GIANNI porodice!",
    color: "#FFD700",
    category: "Sistem",
    footer: "GIANNI (Custom) • Sljedeći AOTW za 7 dana 📅",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "📊 Top 3 sedmice", value: "🥇 **{top1}** — `{top1count}` poruka\n🥈 **{top2}** — `{top2count}` poruka\n🥉 **{top3}** — `{top3count}` poruka", inline: false },
    ],
  },
  // ─── LOG ─────────────────────────────────────────────────────────────────
  {
    name: "log-join",
    title: "📥 Novi Član",
    description: null,
    color: "#43B581",
    category: "Log",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "ID", value: "`{userId}`", inline: true },
      { name: "Nalog kreiran", value: "{createdAt}", inline: true },
      { name: "Ukupno članova", value: "`{memberCount}`", inline: true },
    ],
  },
  {
    name: "log-edit",
    title: "✏️ Poruka Editovana",
    description: null,
    color: "#F39C12",
    category: "Log",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "Kanal", value: "{channel}", inline: true },
      { name: "📍 Link", value: "[Idi na poruku]({jumpUrl})", inline: true },
      { name: "Prije", value: "{before}", inline: false },
      { name: "Poslije", value: "{after}", inline: false },
    ],
  },
  {
    name: "log-delete",
    title: "🗑️ Poruka Obrisana",
    description: null,
    color: "#E74C3C",
    category: "Log",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "Kanal", value: "{channel}", inline: true },
      { name: "Sadržaj", value: "{content}", inline: false },
    ],
  },
  {
    name: "report",
    title: "🚨 NOVA PRIJAVA",
    description: null,
    color: "#E74C3C",
    category: "Log",
    footer: "Server: {guildName}",
    thumbnail: "{reported.avatar}",
    fields: [
      { name: "👤 Prijavio",   value: "{reporter}\nID: `{reporterId}`",  inline: true },
      { name: "🎯 Prijavljen", value: "{reported}\nID: `{reportedId}`",  inline: true },
      { name: "📍 Kanal",      value: "{channel}",                        inline: true },
      { name: "📝 Razlog",     value: "{razlog}",                         inline: false },
    ],
  },
  // ─── MODERACIJA ───────────────────────────────────────────────────────────
  {
    name: "warn",
    title: "⚠️ Upozorenje",
    description: "{user} je upozoren/a od strane moderatora.",
    color: "#F39C12",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: null,
    fields: [
      { name: "👤 Korisnik", value: "{user}", inline: true },
      { name: "🛡️ Moderator", value: "{mod}", inline: true },
      { name: "📝 Razlog", value: "{razlog}", inline: false },
    ],
  },
  {
    name: "ban",
    title: "🔨 Član Banovan",
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
    title: "🌟 ʟᴇᴠᴇʟ ᴜᴘ! 🌟",
    description:
      "━━━━━━━━━━━━━━━━━━━━\n🎉 Čestitamo {user}!\nDostigao/la si **`★ LEVEL {level} ★`**\n━━━━━━━━━━━━━━━━━━━━\n💬 **+100 XP** • <a:vatrice1:1500466044429664256> **+1 vatrica**\n📨 Sljedeći level: još `100` poruka!\n\n📊 Provjeri statistiku sa `/aktivnost` ili `/rank`",
    color: "#FFD700",
    category: "XP",
    footer: "⚡ GIANNI (Custom) • XP Sistem (svakih 100 poruka)",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "vatrica-nova",
    title: "🔥 ɴᴏᴠᴀ ᴠᴀᴛʀɪᴄᴀ! 🔥",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n🎉 Čestitamo {user}!\nImaš sada **`{vatriceCount}`** 🔥\n━━━━━━━━━━━━━━━━━━━━━━\n💬 Zarađeno aktivnošću u chatu (svakih 150 poruka)\n📊 Tvoje mjesto: **#{rank}** od **{total}**\n\n**Do sljedeće vatrice:** `░░░░░░░░░░`  `{progress}/150`\n\n**🏆 Trenutni podij:**\n🥇 **{top1}** — 🔥 {top1count}\n🥈 **{top2}** — 🔥 {top2count}\n🥉 **{top3}** — 🔥 {top3count}\n━━━━━━━━━━━━━━━━━━━━━━\n_Pogledaj kompletnu top listu sa_ `/vatrice pup`",
    color: "#FF6A00",
    category: "XP",
    footer: "🔥 GIANNI (Custom) • Vatrice sistem",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "aktivnost",
    title: "📊 ᴀᴋᴛɪᴠɴᴏsᴛ",
    description:
      "━━━━━━━━━━━━━━━━━━━━\n👤 **{user}**\n━━━━━━━━━━━━━━━━━━━━\n🟧🟧🟧⬛⬛⬛⬛⬛⬛⬛  `{progress}/100`\n⏳ Još **`{doSljedeceg}`** poruka do sljedećeg levela!",
    color: "#FFA500",
    category: "XP",
    footer: "⚡ GIANNI (Custom) • Aktivnost • Svakih 100 poruka novi level!",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "🏆 Level",   value: "```fix\n★ {level} ★\n```", inline: true },
      { name: "⭐ XP",      value: "```py\n{xp}\n```",          inline: true },
      { name: "💬 Poruke",  value: "```css\n{poruke}\n```",     inline: true },
      { name: "🔥 Vatrice", value: "```yaml\n{vatrice}\n```",   inline: true },
      { name: "📈 Sistem",  value: "```ini\n[100 poruka = 1 LVL + 1 vatrica + 100 XP]\n```", inline: false },
    ],
  },
  {
    name: "rank",
    title: "📈 Rank Profil",
    description:
      "🟪🟪🟪🟪⬛⬛⬛⬛⬛⬛\n`▰▰▰▰▱▱▱▱▱▱` **40%**",
    color: "#9B59B6",
    category: "XP",
    footer: null,
    thumbnail: "{user.avatar}",
    fields: [
      { name: "🏆 Level",    value: "```fix\n{level}\n```",      inline: true },
      { name: "⭐ XP",       value: "```py\n{xp}/{needed}\n```", inline: true },
      { name: "📊 Progres",  value: "```css\n[{pct}%]\n```",     inline: true },
    ],
  },
  {
    name: "leaderboard-xp",
    title: "🏅 Top Lista — XP",
    description:
      "🥇 **ImeKorisnika** — Level `10` • `980 XP`\n🥈 **ImeKorisnika2** — Level `8` • `650 XP`\n🥉 **ImeKorisnika3** — Level `7` • `420 XP`\n`4.` **ImeKorisnika4** — Level `6` • `310 XP`",
    color: "#9B59B6",
    category: "XP",
    footer: null,
    thumbnail: null,
    fields: [],
  },
  {
    name: "leaderboard-novac",
    title: "🏅 Top Lista — Bogatstvo",
    description:
      "🥇 **ImeKorisnika** — `25.000 💶`\n🥈 **ImeKorisnika2** — `18.500 💶`\n🥉 **ImeKorisnika3** — `12.000 💶`\n`4.` **ImeKorisnika4** — `8.750 💶`",
    color: "#F1C40F",
    category: "XP",
    footer: null,
    thumbnail: null,
    fields: [],
  },
  // ─── EKONOMIJA ────────────────────────────────────────────────────────────
  {
    name: "heist",
    title: "💰 RAZBOJ U PRIPREMI",
    description: "{user} organizuje razboj!\n**Klikni dugme da se pridružiš** (treba 3+ ljudi za uspjeh)\n⏰ 30 sekundi do akcije!",
    color: "#F39C12",
    category: "Ekonomija",
    footer: null,
    thumbnail: null,
    fields: [],
  },
  {
    name: "lottery",
    title: "🎰 Sedmična Loto",
    description: null,
    color: "#2B2D42",
    category: "Ekonomija",
    footer: "/lottery buy — kupi tiket za 100 coina",
    thumbnail: null,
    fields: [
      { name: "💰 Pot", value: "`{pot}` coina", inline: true },
      { name: "🎫 Tvoji tiketi", value: "`{my}` / `{total}`", inline: true },
      { name: "🎯 Šansa", value: "`{chance}%`", inline: true },
      { name: "⏰ Sljedeći žrijeb", value: "{nextDraw}", inline: false },
    ],
  },
  {
    name: "quests",
    title: "📋 Dnevni Zadaci",
    description:
      "⬜ **Pošalji 10 poruka** — Budi aktivan u chatu\n`░░░░░░░░░░` `0/10` • 💶 `+200`\n\n✅ **Odigraj slots** — Probaj sreću na slot mašini\n`██████████` `1/1` • 💶 `+150`\n\n⬜ **Uhvati 5 životinja** — Idi u /hunt\n`███░░░░░░░` `3/5` • 💶 `+300`",
    color: "#2B2D42",
    category: "Ekonomija",
    footer: "Resetuju se u ponoć UTC • GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "✅ Završeno", value: "`1/3`", inline: true },
    ],
  },
  {
    name: "giveaway",
    title: "🎉 NAGRADNA IGRA!",
    description: "## 🏆  {nagrada}\n\nKlikni dugme **🎉 Učestvuj** da se prijaviš!",
    color: "#F1C40F",
    category: "Ekonomija",
    footer: "Završava se automatski • GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "🕒 Trajanje",  value: "`{trajanje}`",              inline: true },
      { name: "👥 Učesnici",  value: "`{ucesnici}`",              inline: true },
      { name: "🎟️ Domaćin",   value: "{domaćin}",                 inline: true },
      { name: "📅 Završava",  value: "{kraj}",                    inline: false },
    ],
  },
  // ─── IGRE ────────────────────────────────────────────────────────────────
  {
    name: "slots",
    title: "🎰  S L O T  M A Š I N A",
    description: "𓉘  🍒  │  🍒  │  🍒  𓉝\n\n🎰 Sva tri ista — **JACKPOT!**",
    color: "#F1C40F",
    category: "Igre",
    footer: "GIANNI (Custom) • 🍒×3 🍋×3.5 🍊×4 🍇×5 🔔×6 ⭐×8 💎×15 7️⃣×50",
    thumbnail: null,
    fields: [
      { name: "💰 Ulog", value: "`{ulog} 💶`", inline: true },
      { name: "🎯 Rezultat", value: "🎊 **+{dobitak} 💶** *(×3)*", inline: true },
      { name: "🏦 Balans", value: "`{balans} 💶`", inline: true },
    ],
  },
  {
    name: "blackjack",
    title: "🃏 Blackjack",
    description: null,
    color: "#2B2D42",
    category: "Igre",
    footer: "Oklada: {oklada} 💶 • GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "Tvoje karte  (17)", value: "🂡 🂮", inline: false },
      { name: "Dealer  (?)", value: "🂫 🎴", inline: false },
      { name: "Rezultat", value: "🎉 **BLACKJACK!** `+{dobitak} 💶`!", inline: false },
    ],
  },
  {
    name: "poker-lobby",
    title: "🃏 POKER — Texas Hold'em",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n💰 **Ulog po igraču:** `{ulog} 💶`\n🏆 **Trenutni pot:** `{pot} 💶`\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n👥 **Igrači ({count}/9):**\n▸ **{player1}**\n▸ **{player2}**\n\n▸ Klikni **Ulazi u igru** da se pridružiš\n▸ Domaćin klika **Počni igru** kad je spreman\n▸ Igra automatski kreće za **60 sekundi**",
    color: "#2ECC71",
    category: "Igre",
    footer: "🃏 GIANNI (Custom) • Poker • Min 2, Max 9 igrača",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poker-game",
    title: "🃏 Pre-Flop — Kartice podijeljene",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n🃏 **Zajedničke kartice:**\n`?` `?` `?` `?` `?`\n💰 **Pot:** `{pot} 💶`\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n👥 **Aktivni:**\n✅ **{player1}**\n✅ **{player2}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n⏳ **Čekamo potez:**\n⏳ {player1}",
    color: "#F39C12",
    category: "Igre",
    footer: "🃏 GIANNI (Custom) • Klikni 'Vidi kartice' za svoju ruku • Pot: {pot} 💶",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poker-showdown",
    title: "🏆 SHOWDOWN — Poker",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n🃏 **Zajedničke kartice:**\n🂡 🂺 🂳 🃈 🃑\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🏆 **{winner}**\n   Ruka: 🂡 🂮\n   → **Royal Flush** | 🂡 🂺 🂳 🃈 🃑\n\n  **{loser}**\n   Ruka: 🃁 🃎\n   → **Dva Para** | 🂡 🂺 🃁 🃎 🂳\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🏆 **Pobjednik:** {winner}\n💰 **Dobitak:** `{dobitak} 💶` po pobjedniku",
    color: "#F1C40F",
    category: "Igre",
    footer: "🃏 GIANNI (Custom) • Poker završen • Ukupni pot: {pot} 💶",
    thumbnail: null,
    fields: [],
  },
  {
    name: "among-us-lobby",
    title: "🚀 Among Us — Lobby",
    description: "Pridruži se i čekaj da host pokrene igru!\n**Min 4 • Max 10 igrača**",
    color: "#1B1B2F",
    category: "Igre",
    footer: "Host: klikni ▶️ Pokreni igru kad ste svi tu!",
    thumbnail: null,
    fields: [
      { name: "👥 Igrači (2/10)", value: "🟥 Player1\n🔵 Player2", inline: false },
    ],
  },
  {
    name: "among-us-game",
    title: "🚀 Among Us — U Toku",
    description: null,
    color: "#1B1B2F",
    category: "Igre",
    footer: "📋 Zadatak • 🚨 Alarm • 🔪 Akcija • 🛑 Sabotiraj • 🎭 Lažni alarm • 🔫 Šerif • 👻 Ghost",
    thumbnail: null,
    fields: [
      { name: "👥 Igrači", value: "🟥 Player1\n🔵 Player2\n💀 ~~Player3~~", inline: false },
      { name: "📋 Zadaci", value: "🟩🟩🟩⬜⬜⬜⬜⬜⬜⬜ `3/10`", inline: true },
      { name: "🎭 Živi", value: "🔵 2 crew | 🔴 1 imp", inline: true },
    ],
  },
  {
    name: "among-us-end",
    title: "🏁 🔵 CREWMATI POBIJEDE!",
    description: "Svi impostori eliminirani! ✅",
    color: "#43B581",
    category: "Igre",
    footer: "GIANNI (Custom) • Among Us",
    thumbnail: null,
    fields: [
      { name: "🎭 Otkrivene uloge", value: "🔵 🟥 **Player1** — CREWMATE\n🔴 🔵 **Player2** — IMPOSTOR", inline: false },
    ],
  },
  {
    name: "kaladont-start",
    title: "🔤  K A L A D O N T",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n✨ Igra je počela! Prva riječ:\n## 💬  **BALKAN**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#00BCD4",
    category: "Igre",
    footer: "🔤 Pokrenuo/la: {user}  •  🏁 Pritisni dugme za kraj",
    thumbnail: null,
    fields: [
      { name: "➡️  Sljedeća počinje sa", value: "## **`AN`**",             inline: true },
      { name: "⚙️  Težina",              value: "🟡 Normalno · 2 slova",   inline: true },
      { name: "🔗  Niz",                 value: "**#1**",                  inline: true },
      {
        name: "📖  Pravila igre",
        value:
          "✅  Svaka riječ počinje traženim slovima\n🚫  Ista osoba **ne može** igrati iza sebe\n🔁  Ponavljanje iste riječi nije dozvoljeno\n🎲  **50/50 sudbina** — čak i ispravna riječ može propasti!\n🆘  Pritisni **Pomoć** za primjer riječi\n🏆  Upiši **`KALADONT`** i osvoji **1500** 🪙 + **200** ✨ XP!",
        inline: false,
      },
    ],
  },
  {
    name: "kaladont-active",
    title: "🔤  K A L A D O N T  —  aktivna igra",
    description: "━━━━━━━━━━━━━━━━━━━━━",
    color: "#00BCD4",
    category: "Igre",
    footer: "🏁 Pritisni dugme za kraj igre",
    thumbnail: null,
    fields: [
      { name: "✨  Zadnja riječ",          value: "**`ANKETA`**",    inline: true },
      { name: "🗣️  Odigrao/la",            value: "Korisnik",        inline: true },
      { name: "🔗  Niz",                   value: "**#5**",          inline: true },
      { name: "➡️  Sljedeća počinje sa",   value: "## **`TA`**",     inline: false },
    ],
  },
  {
    name: "kaladont-word",
    title: null,
    description: "## ✨  **TAČKA**\n*🗣️ Korisnik*",
    color: "#00BCD4",
    category: "Igre",
    footer: "🔤 GIANNI Kaladont  •  #6",
    thumbnail: null,
    fields: [
      { name: "➡️  Sljedeća počinje sa", value: "## **`KA`**", inline: true },
      { name: "🔗  Niz",                 value: "**#6**",       inline: true },
    ],
  },
  {
    name: "kaladont-win",
    title: "👑  K A L A D O N T  —  P O B J E D A !",
    description: "🎉 {user} je izrekao/la magičnu riječ!",
    color: "#FFD700",
    category: "Igre",
    footer: "GIANNI (Custom) • Kaladont pobjeda",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "🏆  Pobjednik/ca",  value: "**{user}**", inline: true },
      { name: "📊  Riječi u nizu", value: "**{count}**", inline: true },
      { name: "💰  Nagrada",       value: "**+1.500 💶**", inline: true },
      { name: "⭐  XP",            value: "**+200**", inline: true },
    ],
  },
  {
    name: "bingo",
    title: "🎱  ✦  B  I  N  G  O  ✦  🎱",
    description:
      "🎯 **Klikni dugme ispod i unesi 5 brojeva (1–75)!**\n🎫 Tiket košta samo **500 coina** 🪙\n\n⏱️ Imaš **2 minute** za tiket — brzo! 🔥\n📢 Rezultati se objavljuju **javno** za sve 🌍",
    color: "#00BCD4",
    category: "Igre",
    footer: "🎱 × GIANNI Bingo • Cijena tiketa: 500 coina 🪙",
    thumbnail: null,
    fields: [
      {
        name: "🏆  Nagradna lista",
        value:
          "🥉 `2 pogotka`  ──  **10.000** coina\n🥈 `3 pogotka`  ──  **30.000** coina\n🥇 `4 pogotka`  ──  **75.000** coina\n👑 `5 pogodaka` ── **250.000** coina  🏆 **JACKPOT!**",
        inline: false,
      },
    ],
  },
  // ─── FUN / ŽIVOTINJE ──────────────────────────────────────────────────────
  {
    name: "hunt",
    title: "🏹  Uhvatio si životinje!",
    description: "## 🐺  Vuk\n⭐ **Uncommon**  ·  ⚔️ Snaga `15`",
    color: "#9B59B6",
    category: "Fun",
    footer: "{user} • GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [
      { name: "🔢 Imaš ukupno", value: "`1x 🐺 Vuk`", inline: true },
      { name: "💶 Vrijednost",   value: "`80 💶`",       inline: true },
    ],
  },
  {
    name: "zoo",
    title: "🦁 {user} — Zoo",
    description:
      "🌟 **Legendary**\n🐉 **Zmaj** `×1`\n\n⭐ **Uncommon**\n🐺 **Vuk** `×3`  🦊 **Lisica** `×2`\n\n🟢 **Common**\n🐟 **Riba** `×7`  🐇 **Zec** `×5`",
    color: "#9B59B6",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0 • /hunt za loviti!",
    thumbnail: null,
    fields: [
      { name: "🔢 Ukupno", value: "`18` životinja", inline: true },
      { name: "⚔️ Snaga",  value: "`145`",           inline: true },
    ],
  },
  {
    name: "battle",
    title: "⚔️  BITKA!",
    description:
      "**{player1}** vs **{player2}**\n`████████████░░░░░░░░`\n⚔️ `{score1}` vs `{score2}` ⚔️",
    color: "#F1C40F",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: "{winner.avatar}",
    fields: [
      { name: "🏆 Pobjednik", value: "**{winner}**",     inline: true },
      { name: "💀 Poražen",   value: "{loser}",           inline: true },
      { name: "💶 Nagrada",   value: "`+{nagrada} 💶`",  inline: false },
    ],
  },
  {
    name: "pray",
    title: null,
    description: "🙏 {user} moli se za {target}! Nebo čuje — `+{bonus} 💶` palo s neba!",
    color: "#FFD700",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vers",
    title: null,
    description: "> 🎙️\n> *Ovo je primjer versa koji korisnik pošalje*\n> *Svaki red je jedan stih*\n> 🎤",
    color: "#9B30FF",
    category: "Fun",
    footer: "🎧 vers • drop the mic",
    thumbnail: null,
    fields: [],
  },
  // ─── LJUBAVNE ─────────────────────────────────────────────────────────────
  {
    name: "zagrljaj",
    title: null,
    description: "🤗 {from} grli {to}! Aww, tako slatko! 💕",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poljubac",
    title: null,
    description: "💋 {from} šalje poljubac {to}! 😘",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "mazi",
    title: null,
    description: "🥰 {from} mazi {to} nježno! Aww! 💕",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "tapsi",
    title: null,
    description: "👋 {from} tapše {to} prijateljski! 🤝",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "high5",
    title: null,
    description: "🙌 {from} daje peticu {to}! HIGH FIVE! ✋",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "cudan",
    title: null,
    description: "😠 {from} je ćudan prema {to}! Ajde, brate... 😤",
    color: "#F39C12",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "srce",
    title: null,
    description: "❤️ {from} šalje srce {to}! Aww! 🥺",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "brak",
    title: null,
    description: "💍 {from} zaprosio {to}! 😍 Hoćeš li? 🥂",
    color: "#FF4D6D",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "kompli",
    title: null,
    description: "🌹 {from} kaže {to}: 'Ti si razlog zašto dan počinje sa osmijehom. 😍'",
    color: "#FF85C8",
    category: "Fun",
    footer: "GIANNI (Custom) • Muvanje 101 💕",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "fora",
    title: null,
    description: "😂 {from} je pogledao/la {to} i shvatio/la: 'Brate/sestro, ti si dokaz da evolucija nije uvijek napredak.' 🐒",
    color: "#2B2D42",
    category: "Fun",
    footer: "GIANNI (Custom) • Sve u šali! 😂",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "muv",
    title: null,
    description: "😏 {from} {to}: 'Jesi li ti WiFi? Jer osjećam konekciju između nas.' 📶💕",
    color: "#FF4D6D",
    category: "Fun",
    footer: "GIANNI (Custom) • Balkan Muvanje™ 😏",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "crush",
    title: null,
    description: "💘 Po zvijezdama i kafanskim računima, tvoj tajni crush je... **{crush}**! 😳",
    color: "#FF4D6D",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  // ─── INFO ─────────────────────────────────────────────────────────────────
  {
    name: "spotify",
    title: "🎵 {trackTitle}",
    description:
      "**Izvođač:** {artist}\n**Album:** {album}\n\n`0:45` ▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱▱▱▱▱ `3:22`",
    color: "#1DB954",
    category: "Info",
    footer: "Spotify • GIANNI (Custom)",
    thumbnail: "{albumArt}",
    fields: [],
  },
  {
    name: "invite",
    title: "📊 Statistika — {user}",
    description: null,
    color: "#2B2D42",
    category: "Info",
    footer: "Korisnik: {user} • ID: {userId}",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "✍️ Poruke poslato", value: "`{poruke}`",      inline: true },
      { name: "👥 Doveo članova",   value: "`{invites}`",     inline: true },
      { name: "📅 Pridružio",       value: "{joinedAt}",      inline: true },
      { name: "🔗 Tvoj invite",     value: "`{inviteUses}` korišćenja", inline: false },
    ],
  },
  {
    name: "avatar",
    title: "🖼️ {user}",
    description: "[PNG]({png}) • [JPG]({jpg}) • [WEBP]({webp})",
    color: "#2B2D42",
    category: "Info",
    footer: null,
    thumbnail: null,
    fields: [],
  },
  {
    name: "brojanje-info",
    title: "🔢 Brojanje — stanje",
    description:
      "📍 **Kanal:** {channel}\n🔢 **Trenutno:** `{current}`\n➡️ **Sljedeći broj:** `{next}`\n👤 **Zadnji brojao:** {lastUser}\n🏆 **Rekord:** `{highScore}`",
    color: "#2B2D42",
    category: "Info",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  // ─── SISTEM PANELI ────────────────────────────────────────────────────────
  {
    name: "ticket",
    title: "🎫  Otvori Tiket",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n🎫 Trebaš pomoć? **Otvori tiket**!\n\n📝 Popuni formu i naš staff će ti odgovoriti što prije.\n⏳ Prosječno vrijeme odgovora: **< 30 minuta**\n━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#00BCD4",
    category: "Sistem",
    footer: "🎫 GIANNI Ticket Sistem",
    thumbnail: null,
    fields: [
      {
        name: "📋 Šta ćeš dobiti",
        value: "🔒 Privatni kanal samo za tebe i staff\n✅ Pomoć od iskusnog tima\n📎 Možeš priložiti slike/screenshote",
        inline: false,
      },
    ],
  },
  {
    name: "ticket-otvoren",
    title: "✅  Tiket otvoren!",
    description:
      "## 🎉 Tvoj tiket je kreiran!\nPrivatni kanal: {channel}\n\n⏳ Staff će ti odgovoriti uskoro. Budemo te obavijestili! 📩",
    color: "#00BCD4",
    category: "Sistem",
    footer: "🎫 GIANNI  •  Hvala na strpljenju! 🙏",
    thumbnail: null,
    fields: [
      {
        name: "📋  Šta dalje?",
        value:
          "💬 Idi u kanal i čekaj odgovor staffa\n📎 Možeš priložiti slike/screenshote\n🔒 Kanal je **privatan** — samo ti i staff\n✅ Ticket se zatvara kad je problem riješen",
        inline: false,
      },
    ],
  },
  {
    name: "staff-prijava",
    title: "📋  STAFF PRIJAVA",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nOtvorene su prijave za **Staff tim** servera!\n\n📝 **Kako se prijaviti:**\n1️⃣  Klikni redom na **5 dugmadi** ispod i upiši svoje podatke\n2️⃣  Kad popuniš **sva polja**, klikni **📤 Pošalji prijavu**\n3️⃣  Bot će ti otvoriti **privatni kanal** sa staff timom\n\n🔒 Tvoji odgovori se vide samo tebi dok ne pošalješ prijavu.\n🚫 **Discord invite linkovi nisu dozvoljeni** u poljima!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#00BCD4",
    category: "Sistem",
    footer: "📋 GIANNI (Custom) • Staff Prijava",
    thumbnail: null,
    fields: [
      {
        name: "📌 Rubrike",
        value:
          "🔢 **Godine** — koliko imaš godina\n🛡️ **Iskustvo** — prethodno iskustvo\n💭 **Motivacija** — zašto želiš staff\n👥 **Igrači** — koliko ljudi možeš dovesti\n⏰ **Aktivnost** — sati dnevno + timezone",
        inline: false,
      },
    ],
  },
  {
    name: "private-vc",
    title: "🔊 Dobrodošao u svoj kanal, {user}!",
    description:
      "**Ti si vlasnik!** 👑 Koristi dugmad ispod:\n\n🔒 **Lock** — niko ne može ući\n🔓 **Unlock** — svi mogu ući\n👁️ **Hide / Show** — sakrij/pokaži kanal\n✏️ **Rename** — promijeni ime\n👥 **Limit** — postavi max članova\n🚫 **Kick** — izbaci nekog iz kanala\n👑 **Owner** — prebaci vlasništvo\n❌ **Delete** — obriši kanal\n\n*Kanal se automatski briše kad ostane prazan.*",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Privatni Voice Sistem",
    thumbnail: null,
    fields: [],
  },
  // ─── VATRICE ──────────────────────────────────────────────────────────────
  {
    name: "vatrice-pup",
    title: "🔥 Top Lista — Vatrice",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n🔥 Najpopularniji članovi po vatricama:\n━━━━━━━━━━━━━━━━━━━━━━\n🥇 **{top1}** — 🔥 `{top1count}`\n🥈 **{top2}** — 🔥 `{top2count}`\n🥉 **{top3}** — 🔥 `{top3count}`\n`4.` **{top4}** — 🔥 `{top4count}`\n`5.` **{top5}** — 🔥 `{top5count}`\n━━━━━━━━━━━━━━━━━━━━━━\n📊 Tvoje mjesto: **#{rank}** | Imaš: **{myCount}** 🔥",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "🔥 GIANNI (Custom) • Vatrice Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vatrice-start",
    title: "🔥 Vatrica Sistem — Aktiviran!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n✅ Vatrica sistem je uspješno aktiviran na ovom serveru!\n━━━━━━━━━━━━━━━━━━━━━━\n🔥 Svako **{prag}** poruka, član dobija **1 vatricu**\n📛 Nick se automatski ažurira: `🔥×{count} ImeKorisnika`\n📢 Objave se šalju u {kanal}\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "🔥 GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [
      { name: "🔥 Emoji", value: "`{emoji}`", inline: true },
      { name: "📢 Kanal", value: "{kanal}", inline: true },
      { name: "📊 Prag",  value: "`{prag}` poruka", inline: true },
    ],
  },
  {
    name: "vatrice-kanal",
    title: "✅ Vatrica Kanal Postavljen",
    description: "Objave vatrica će se od sada slati u {kanal}.",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "🔥 GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vatrice-oblik",
    title: "🔥 Vatrica Emoji Promijenjen",
    description: "━━━━━━━━━━━━━━━━━━━━━━\nEmoji vatrice je promijenjen!\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "🔥 GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [
      { name: "Stari emoji",  value: "`{stari}`",  inline: true },
      { name: "Novi emoji",   value: "`{novi}`",   inline: true },
    ],
  },
  // ─── EKONOMIJA (dopune) ───────────────────────────────────────────────────
  {
    name: "giveaway-end",
    title: "🏆 Nagradna Igra — ZAVRŠENA!",
    description: "## 🎁  {nagrada}\n\nČestitamo pobjedniku — pratite objavu!",
    color: "#2ECC71",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Giveaway završen",
    thumbnail: null,
    fields: [
      { name: "🏆 Pobjednik",  value: "{pobjednik}",  inline: true },
      { name: "👥 Učesnici",   value: "`{ucesnici}`", inline: true },
      { name: "🎟️ Domaćin",    value: "{domaćin}",    inline: true },
    ],
  },
  // ─── IGRE (dopune) ────────────────────────────────────────────────────────
  {
    name: "vjasala",
    title: "📝  V J E Š A L A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n🔡 Pogodi skrivenu riječ!\n\n```\n_ _ _ _ _ _\n```\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /vjasala",
    thumbnail: null,
    fields: [
      { name: "❤️ Životi",       value: "`{zivoti}/6`",            inline: true },
      { name: "🔤 Pogođena slova", value: "`{pogodjena}`",          inline: true },
      { name: "❌ Promašaji",     value: "`{promasaji}`",           inline: true },
    ],
  },
  {
    name: "vjasala-kraj",
    title: "🎉 Vješala — Pogodak!",
    description: "Čestitamo {user}! Pogodio/la si **{rijec}**! 🥳\n💶 **Nagrada:** `+{nagrada} coina`",
    color: "#2ECC71",
    category: "Igre",
    footer: "GIANNI (Custom) • /vjasala",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "toplo-hladno",
    title: "🌡️  T O P L O  •  H L A D N O",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n🎯 Pogodi tajni broj (1–{max})!\n\n🔵 **Hladno** — daleko si\n🟡 **Toplo** — bliže si\n🔴 **Vrelo** — skoro!\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#3498DB",
    category: "Igre",
    footer: "GIANNI (Custom) • /toplo-hladno",
    thumbnail: null,
    fields: [
      { name: "🎲 Maksimum",   value: "`{max}`",       inline: true },
      { name: "🔢 Pokušaji",   value: "`{pokusaji}`",  inline: true },
      { name: "🌡️ Status",     value: "{status}",      inline: true },
    ],
  },
  {
    name: "kviz",
    title: "🧠  K V I Z  —  Balkan Pitanje",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n❓ **{pitanje}**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#E74C3C",
    category: "Igre",
    footer: "GIANNI (Custom) • /kviz • Oklada: {oklada} 💶",
    thumbnail: null,
    fields: [
      { name: "🅰️ A",  value: "{a}", inline: true },
      { name: "🅱️ B",  value: "{b}", inline: true },
      { name: "🅲 C",  value: "{c}", inline: true },
      { name: "🅳 D",  value: "{d}", inline: true },
    ],
  },
  {
    name: "geografija",
    title: "🌍  G E O G R A F I J A  —  Kviz",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n🌍 **{pitanje}**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#27AE60",
    category: "Igre",
    footer: "GIANNI (Custom) • /geografija • Oklada: {oklada} 💶",
    thumbnail: null,
    fields: [
      { name: "🅰️ A",  value: "{a}", inline: true },
      { name: "🅱️ B",  value: "{b}", inline: true },
      { name: "🅲 C",  value: "{c}", inline: true },
      { name: "🅳 D",  value: "{d}", inline: true },
    ],
  },
  {
    name: "mafia-lobby",
    title: "🕵️  M A F I A  —  Lobby",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━\n🎭 Mafia igra se priprema!\n**Pridruži se klikom na dugme.**\n━━━━━━━━━━━━━━━━━━━━━━━\n⚙️ Min: **5** | Max: **12** igrača\n⏱️ Igra kreće automatski za **60s** ili kad host klikne Start",
    color: "#2C3E50",
    category: "Igre",
    footer: "🕵️ GIANNI (Custom) • Mafia",
    thumbnail: null,
    fields: [
      { name: "👥 Igrači ({count}/12)", value: "{igraci}", inline: false },
    ],
  },
  {
    name: "mafia-end",
    title: "🏆  M A F I A  —  Kraj Igre",
    description: "## {rezultat}\n\n{opis}",
    color: "#F1C40F",
    category: "Igre",
    footer: "🕵️ GIANNI (Custom) • Mafia završena",
    thumbnail: null,
    fields: [
      { name: "🎭 Uloge",    value: "{uloge}",   inline: false },
      { name: "🏆 Pobjednici", value: "{pobjednici}", inline: true },
      { name: "💀 Eliminirani", value: "{eliminirani}", inline: true },
    ],
  },
  // ─── POO ──────────────────────────────────────────────────────────────────
  {
    name: "poo",
    title: "💩  P O O  —  Stanje Kreature",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n{emojiBar}\n**Zdravlje:** `{zdravlje}/100`\n**Raspoloženje:** `{raspolozenje}`\n━━━━━━━━━━━━━━━━━━━━━━\n👥 Ukupno čuvara: **{cuvari}**\n📋 Završenih zadataka: **{zadaci}/100**",
    color: "#8B4513",
    category: "Poo",
    footer: "💩 GIANNI (Custom) • Poo Sistem",
    thumbnail: null,
    fields: [
      { name: "❤️ Zdravlje",      value: "`{zdravlje}/100`",  inline: true },
      { name: "😊 Raspoloženje",  value: "`{raspolozenje}`",  inline: true },
      { name: "📋 Zadaci",         value: "`{zadaci}/100`",    inline: true },
    ],
  },
  {
    name: "poo-zadaci",
    title: "📋  P O O  —  Zadaci",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n📋 Lista Poo zadataka — stranica **{str}/{ukupnoStr}**\n━━━━━━━━━━━━━━━━━━━━━━\n{zadaci}",
    color: "#8B4513",
    category: "Poo",
    footer: "💩 GIANNI (Custom) • Poo Zadaci • /poo-zadaci [stranica]",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poo-top",
    title: "🏆  P O O  —  Top Čuvari",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n🥇 **{top1}** — `{top1pts}` pts\n🥈 **{top2}** — `{top2pts}` pts\n🥉 **{top3}** — `{top3pts}` pts\n`4.` **{top4}** — `{top4pts}` pts\n`5.` **{top5}** — `{top5pts}` pts\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#8B4513",
    category: "Poo",
    footer: "💩 GIANNI (Custom) • Poo Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poo-hrani",
    title: "🍖  P O O  —  Hranjen!",
    description:
      "{user} je hranio/la Poo-a! 🎉\nPotrošeno: **200 coina**\n\n{emojiBar}\n**Zdravlje:** `{zdravlje}/100` **(+{bonus})**",
    color: "#8B4513",
    category: "Poo",
    footer: "💩 GIANNI (Custom) • Poo Sistem",
    thumbnail: null,
    fields: [
      { name: "❤️ Novo zdravlje",  value: "`{zdravlje}/100`", inline: true },
      { name: "💶 Trošak",          value: "`200 coina`",       inline: true },
    ],
  },
  {
    name: "poo-info",
    title: "📊  P O O  —  Moj Doprinos",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n👤 **{user}**\n━━━━━━━━━━━━━━━━━━━━━━\n{progres}",
    color: "#8B4513",
    category: "Poo",
    footer: "💩 GIANNI (Custom) • Poo Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "✅ Završenih zadataka", value: "`{zavrseni}`",  inline: true },
      { name: "⭐ Bodova ukupno",      value: "`{bodovi}`",    inline: true },
      { name: "🏅 Rang",               value: "`#{rang}`",     inline: true },
    ],
  },
  // ─── ADMIN / BACKUP ───────────────────────────────────────────────────────
  {
    name: "backup",
    title: "💾  B A C K U P  —  Snimljen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n✅ Backup je uspješno snimljen!\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#2ECC71",
    category: "Admin",
    footer: "💾 GIANNI (Custom) • Backup Sistem",
    thumbnail: null,
    fields: [
      { name: "📅 Datum",       value: "{datum}",    inline: true },
      { name: "📦 Veličina",    value: "{velicina}", inline: true },
      { name: "☁️ Cloud",       value: "Discord DM", inline: true },
    ],
  },
  {
    name: "backup-restore",
    title: "♻️  B A C K U P  —  Vraćen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n✅ Backup je uspješno vraćen!\n━━━━━━━━━━━━━━━━━━━━━━\n⚠️ Svi podaci su prepisani backupom od **{datum}**.",
    color: "#E67E22",
    category: "Admin",
    footer: "💾 GIANNI (Custom) • Backup Vraćen",
    thumbnail: null,
    fields: [
      { name: "📅 Backup datum", value: "{datum}",   inline: true },
      { name: "👤 Pokrenuo",     value: "{korisnik}", inline: true },
    ],
  },
  {
    name: "backup-status",
    title: "📊  B A C K U P  —  Status",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n☁️ Cloud backup istorija:\n━━━━━━━━━━━━━━━━━━━━━━\n{historija}",
    color: "#3498DB",
    category: "Admin",
    footer: "💾 GIANNI (Custom) • Backup Sistem",
    thumbnail: null,
    fields: [
      { name: "📦 Ukupno backupa", value: "`{ukupno}`",   inline: true },
      { name: "🕒 Zadnji",          value: "{zadnji}",     inline: true },
      { name: "💾 Veličina",        value: "{velicina}",   inline: true },
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
