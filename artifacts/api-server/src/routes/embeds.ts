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
  // ─── SISTEM (Purple) ──────────────────────────────────────────
  {
    name: "welcome",
    title: null,
    description:
      "## <:864113ownerpinkcrownwithheart:1496899493130539008> **Dobrodošao/la, {user}!**\n<:518169rolemodpurple:1496901673426096158> Ti si **{memberCount}**. član servera!\n\n<a:64382pinksparkles:1500259869259988033> <a:15072animatedarrowpink2:1496898801556914236> #chat **·** <a:3599pinkheart:1504504866700132534> #info **·** <a:85034pinknotes:1500444022622130196> #news **·** <a:giveaways5:1500203902446997586> #gws\n<a:571294pinkpaw:1500259928936284211> **{memberCount} member · discord.gg/gian**",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Welcome",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "leave",
    title: null,
    description:
      "<:518169rolemodpurple:1496901673426096158> **{user}** je napustio/la server <a:571294pinkpaw:1500259928936284211>\n\n<a:15072animatedarrowpink2:1496898801556914236> Ostalo članova: **`{memberCount}`**\n<:4558purplecheck:1504504889706020995> discord.gg/gian",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Leave",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "dm-welcome",
    title: null,
    description:
      "## <:864113ownerpinkcrownwithheart:1496899493130539008> **Dobrodošao/la, {user}!**\n\n<:518169rolemodpurple:1496901673426096158> Ušao/la si na **GIANNI** server!\n\n<a:15072animatedarrowpink2:1496898801556914236> <a:vatrice1:1500466044429664256> <#1496860023706488884> **·** <a:vatrice2:1500466048418185246> <#1496860023093989475> **·** <a:vatrice3:1500466039782113352> <#1501973333195882696>\n\n<:4558purplecheck:1504504889706020995> Pročitaj pravila i uživaj! **discord.gg/gian**",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Dobrodošlica DM",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "boost",
    title: "<:518169rolemodpurple:1496901673426096158> Novi Boost!",
    description:
      "<a:3747purplesparkles:1504504869724098620> **{user}** je upravo **boostovao server**! <a:505993sparkle1:1496899369939636295>\n<:518169rolemodpurple:1496901673426096158> Hvala ti na podršci — server je sad još jači! <:864113ownerpinkcrownwithheart:1496899493130539008>",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Hvala na podršci",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:793429sparkles:1496899433634201611> Boostova",  value: "`{boostCount}`",       inline: true },
      { name: "<:864113ownerpinkcrownwithheart:1496899493130539008> Tier",        value: "`Lvl {tier}`",         inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> Nagrada",   value: "`+2.500 <a:529977coin:1500444133389635704>`",        inline: true },
    ],
  },
  {
    name: "birthday",
    title: "<:864113ownerpinkcrownwithheart:1496899493130539008> Sretan Rođendan!",
    description:
      "<a:64382pinksparkles:1500259869259988033> Danas je rođendan od **{user}**! <a:giveaways5:1500203902446997586>\n\n<a:3599pinkheart:1504504866700132534> Svi mu/joj čestitajte! <a:3747purplesparkles:1504504869724098620>\n<:518169rolemodpurple:1496901673426096158> Neka ti je srećan i blagoslovljen dan! <:864113ownerpinkcrownwithheart:1496899493130539008>",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI (Custom) • Rođendani",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:3599pinkheart:1504504866700132534> Nagrada", value: "`+5.000 <a:529977coin:1500444133389635704>` za slavljenika! <a:3747purplesparkles:1504504869724098620>", inline: false },
    ],
  },
  {
    name: "starboard",
    title: null,
    description: "{content}",
    color: "#9B59B6",
    category: "Sistem",
    footer: "<a:505993sparkle1:1496899369939636295> {count} | #{channel}",
    thumbnail: null,
    fields: [
      { name: "<:1111pinkarrow:1496903118108229733> Autor",   value: "{author}",                  inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> Kanal",   value: "{channel}",                  inline: true },
      { name: "<:8526link:1504505939917803620> Original", value: "[Idi na poruku]({jumpUrl})", inline: false },
    ],
  },
  {
    name: "aotw",
    title: "<:864113ownerpinkcrownwithheart:1496899493130539008> Aktivni Član Sedmice",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:864113ownerpinkcrownwithheart:1496899493130539008> Najaktivniji član ove sedmice je:\n\n## {user}\n\n<:32467lovetalk:1504505532323594321> Napisao/la **{count}** poruka u zadnjih 7 dana!\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Sljedeći AOTW za 7 dana",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:793429sparkles:1496899433634201611> Top 3 sedmice", value: "<:864113ownerpinkcrownwithheart:1496899493130539008> **{top1}** — `{top1count}` poruka\n<:2084purplestar:1504504848375349388> **{top2}** — `{top2count}` poruka\n<:4558purplecheck:1504504889706020995> **{top3}** — `{top3count}` poruka", inline: false },
      { name: "<a:3599pinkheart:1504504866700132534> Nagrada",       value: "`+1.000 <a:529977coin:1500444133389635704>` <a:64382pinksparkles:1500259869259988033>", inline: true },
    ],
  },
  {
    name: "ticket",
    title: "<:518169rolemodpurple:1496901673426096158>  Otvori Tiket",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:ticket:1500196243853541397> Trebaš pomoć? **Otvori tiket**!\n\n<a:15072animatedarrowpink2:1496898801556914236> Popuni formu i naš staff će ti odgovoriti što prije.\n<a:44503lockkey:1500444008760217641> Svaki tiket je privatan — samo ti i staff vidite.\n━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI Ticket Sistem",
    thumbnail: null,
    fields: [
      {
        name: "<:4558purplecheck:1504504889706020995> Šta ćeš dobiti",
        value: "<a:44503lockkey:1500444008760217641> Privatni kanal samo za tebe i staff\n<:4558purplecheck:1504504889706020995> Brz odgovor od tima\n<:518169rolemodpurple:1496901673426096158> Rješavanje u roku 24h",
        inline: false,
      },
    ],
  },
  {
    name: "ticket-otvoren",
    title: "<:4558purplecheck:1504504889706020995>  Tiket otvoren!",
    description:
      "## <a:giveaways5:1500203902446997586> Tvoj tiket je kreiran!\n<a:15072animatedarrowpink2:1496898801556914236> Privatni kanal: {channel}\n\n<a:44503lockkey:1500444008760217641> Staff će ti odgovoriti uskoro! <:518169rolemodpurple:1496901673426096158>",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI  •  Hvala na strpljenju!",
    thumbnail: null,
    fields: [
      {
        name: "<a:15072animatedarrowpink2:1496898801556914236>  Šta dalje?",
        value: "<:32467lovetalk:1504505532323594321> Idi u kanal i čekaj odgovor staffa\n<:8526link:1504505939917803620> Dodaj screenshot ili opis problema\n<:4558purplecheck:1504504889706020995> Ticket se zatvara kad je problem riješen",
        inline: false,
      },
    ],
  },
  {
    name: "staff-prijava",
    title: "<:1111pinkarrow:1496903118108229733>  STAFF PRIJAVA",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nOtvorene su prijave za **Staff tim** servera!\n\n<:4558purplecheck:1504504889706020995> **Kako se prijaviti:**\n<a:15072animatedarrowpink2:1496898801556914236> Klikni redom na **5 dugmadi** ispod i upiši svoje podatke\n<:518169rolemodpurple:1496901673426096158> Kad popuniš **sva polja**, klikni **Pošalji prijavu**\n<:864113ownerpinkcrownwithheart:1496899493130539008> Bot će ti otvoriti **privatni kanal** sa staff timom\n\n<a:44503lockkey:1500444008760217641> Tvoji odgovori su privatni dok ne pošalješ prijavu.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Staff Prijava",
    thumbnail: null,
    fields: [
      {
        name: "<:1111pinkarrow:1496903118108229733> Rubrike",
        value: "<:518169rolemodpurple:1496901673426096158> **Godine** — koliko imaš godina\n<:4558purplecheck:1504504889706020995> **Iskustvo** — prethodno iskustvo\n<a:3599pinkheart:1504504866700132534> **Motivacija** — zašto želiš staff\n<a:571294pinkpaw:1500259928936284211> **Igrači** — koliko ljudi možeš dovesti\n<:2261bell:1504505860720820395> **Aktivnost** — sati dnevno + timezone",
        inline: false,
      },
    ],
  },
  {
    name: "private-vc",
    title: "<:2084purplestar:1504504848375349388> Dobrodošao u svoj kanal, {user}!",
    description:
      "**Ti si vlasnik!** <:864113ownerpinkcrownwithheart:1496899493130539008> Koristi dugmad ispod:\n\n<a:44503lockkey:1500444008760217641> **Lock** — niko ne može ući\n<:4558purplecheck:1504504889706020995> **Unlock** — svi mogu ući\n<:518169rolemodpurple:1496901673426096158> **Hide / Show** — sakrij/pokaži kanal\n<:1111pinkarrow:1496903118108229733> **Rename** — promijeni ime\n<a:571294pinkpaw:1500259928936284211> **Limit** — postavi max članova\n<a:15072animatedarrowpink2:1496898801556914236> **Kick** — izbaci nekog iz kanala\n<:864113ownerpinkcrownwithheart:1496899493130539008> **Owner** — prebaci vlasništvo\n<a:3599pinkheart:1504504866700132534> **Delete** — obriši kanal\n\n*Kanal se automatski briše kad ostane prazan.*",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Privatni Voice Sistem",
    thumbnail: null,
    fields: [],
    buttons: [],
  },
  {
    name: "voice-pravila",
    title: "<:518169rolemodpurple:1496901673426096158>  P R I V A T N I  V O I C E  K A N A L I",
    description:
      "Uđi u <#1494043959213953114> i bot ti **automatski** kreira vlastiti voice kanal.\nPostaješ **vlasnik** <:864113ownerpinkcrownwithheart:1496899493130539008> i dobijaš puni kontrolni panel.",
    color: "#9B59B6",
    category: "Sistem paneli",
    footer: "GIANNI • Voice Pravila",
    thumbnail: null,
    fields: [
      { name: "<a:3599pinkheart:1504504866700132534>  Ponašanje",     value: "<a:15072animatedarrowpink2:1496898801556914236> Bez vrijeđanja, maltretiranja i rasizma\n<:518169rolemodpurple:1496901673426096158> Ne prekidaj druge dok pričaju\n<:4558purplecheck:1504504889706020995> Ne lupaj mikrofonom bez razloga", inline: true },
      { name: "<:864113ownerpinkcrownwithheart:1496899493130539008>  Vlasništvo",      value: "<a:44503lockkey:1500444008760217641> Samo vlasnik koristi Lock / Hide / Kick panel\n<a:15072animatedarrowpink2:1496898801556914236> Prebaci vlasništvo prije izlaska\n<:4558purplecheck:1504504889706020995> Ne koristi panel za maltretiranje", inline: true },
      { name: "<:2084purplestar:1504504848375349388>  Sadržaj",       value: "<:518169rolemodpurple:1496901673426096158> Bez NSFW sadržaja i streaminga\n<:1111pinkarrow:1496903118108229733> Ime kanala mora biti pristojno\n<:4558purplecheck:1504504889706020995> Vrijede sva opšta pravila servera", inline: true },
      { name: "<a:15072animatedarrowpink2:1496898801556914236>  Brisanje",      value: "Kad svi izađu, bot **automatski briše** kanal.\n<:864113ownerpinkcrownwithheart:1496899493130539008> Staff ima pristup svim kanalima.", inline: false },
      { name: "<a:3599pinkheart:1504504866700132534>  Kazne",         value: "`1.` <a:15072animatedarrowpink2:1496898801556914236> Upozorenje  `2.` <a:44503lockkey:1500444008760217641> Voice mute  `3.` <:518169rolemodpurple:1496901673426096158> Zabrana voice-a  `4.` <a:64382pinksparkles:1500259869259988033> Kick/Ban", inline: false },
    ],
    buttons: [
      { label: "Kreiraj svoj voice", style: "success", customId: "vc_create_btn" },
    ],
  },
  // ─── LOG (Pink) ────────────────────────────────────────────────
  {
    name: "log-join",
    title: "<:617219rolemodpink:1496898535897956373> Novi Član",
    description:
      "<a:3599pinkheart:1504504866700132534> Novi član se pridružio serveru! <a:15072animatedarrowpink2:1496898801556914236>",
    color: "#FF85C8",
    category: "Log",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "<:617219rolemodpink:1496898535897956373> Korisnik",         value: "{user}",         inline: true },
      { name: "<:2084purplestar:1504504848375349388> ID",             value: "`{userId}`",     inline: true },
      { name: "<a:15072animatedarrowpink2:1496898801556914236> Nalog kreiran",  value: "{createdAt}",   inline: false },
      { name: "<a:571294pinkpaw:1500259928936284211> Ukupno članova",  value: "`{memberCount}`",inline: true },
    ],
  },
  {
    name: "log-edit",
    title: "<:617219rolemodpink:1496898535897956373> Poruka Editovana",
    description: null,
    color: "#FF85C8",
    category: "Log",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "<:518169rolemodpurple:1496901673426096158> Kanal",   value: "{channel}",                inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Autor",  value: "{user}",                   inline: true },
      { name: "<:8526link:1504505939917803620> Link",  value: "[Idi na poruku]({jumpUrl})",inline: false },
      { name: "<a:64382pinksparkles:1500259869259988033> Prije", value: "{before}",                 inline: false },
      { name: "<:4558purplecheck:1504504889706020995> Poslije",value: "{after}",                 inline: false },
    ],
  },
  {
    name: "log-delete",
    title: "<:617219rolemodpink:1496898535897956373> Poruka Obrisana",
    description: null,
    color: "#FF85C8",
    category: "Log",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "<:518169rolemodpurple:1496901673426096158> Kanal",    value: "{channel}", inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Autor",   value: "{user}",    inline: true },
      { name: "<a:15072animatedarrowpink2:1496898801556914236> Sadržaj",value: "{content}", inline: false },
    ],
  },
  {
    name: "report",
    title: "<:1111pinkarrow:1496903118108229733> NOVA PRIJAVA",
    description: null,
    color: "#9B59B6",
    category: "Log",
    footer: "Server: {guildName}",
    thumbnail: "{reported.avatar}",
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Prijavio",  value: "{reporter}\nID: `{reporterId}`",  inline: true },
      { name: "<:617219rolemodpink:1496898535897956373> Prijavljen", value: "{reported}\nID: `{reportedId}`", inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> Kanal",      value: "{channel}",                          inline: true },
      { name: "<:1111pinkarrow:1496903118108229733> Razlog",    value: "{razlog}",                           inline: false },
      { name: "<:8526link:1504505939917803620> Poruka",   value: "[Idi na poruku]({jumpUrl})",        inline: false },
    ],
  },
  // ─── MODERACIJA (Purple) ───────────────────────────────────────
  {
    name: "warn",
    title: "<:518169rolemodpurple:1496901673426096158> Upozorenje",
    description:
      "<:1111pinkarrow:1496903118108229733> **{user}** je upozoren/a od strane moderatora. <a:64382pinksparkles:1500259869259988033>",
    color: "#9B59B6",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Korisnik",  value: "{user}",    inline: true },
      { name: "<:864113ownerpinkcrownwithheart:1496899493130539008> Moderator",  value: "{mod}",     inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> Upozorenja", value: "`{warnCount}/3`", inline: true },
      { name: "<:1111pinkarrow:1496903118108229733> Razlog",    value: "{razlog}",  inline: false },
    ],
  },
  {
    name: "ban",
    title: "<:518169rolemodpurple:1496901673426096158> Član Banovan",
    description:
      "<a:44503lockkey:1500444008760217641> **{user}** je zauvijek banovan/a sa servera. <:1111pinkarrow:1496903118108229733>",
    color: "#9B59B6",
    category: "Moderacija",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Korisnik",  value: "{user}",    inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> ID",         value: "`{userId}`",inline: true },
      { name: "<:864113ownerpinkcrownwithheart:1496899493130539008> Moderator",  value: "{mod}",     inline: true },
      { name: "<:1111pinkarrow:1496903118108229733> Razlog",    value: "{razlog}",  inline: false },
    ],
  },
  // ─── XP (Pink) ────────────────────────────────────────────────
  {
    name: "levelup",
    title: "<:2084purplestar:1504504848375349388> ʟᴇᴠᴇʟ ᴜᴘ! <a:505993sparkle1:1496899369939636295>",
    description:
      "━━━━━━━━━━━━━━━━━━━━\n<a:giveaways5:1500203902446997586> Čestitamo {user}!\nDostigao/la si **`<:2084purplestar:1504504848375349388> LEVEL {level} <:2084purplestar:1504504848375349388>`**\n━━━━━━━━━━━━━━━━━━━━",
    color: "#FF85C8",
    category: "XP",
    footer: "GIANNI (Custom) • XP Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Level",    value: "```fix\n<:2084purplestar:1504504848375349388> {level} <:2084purplestar:1504504848375349388>\n```", inline: true },
      { name: "<:2084purplestar:1504504848375349388> XP",        value: "```py\n{xp}\n```",                  inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> Nagrada",   value: "`+500 <a:529977coin:1500444133389635704>` <a:64382pinksparkles:1500259869259988033>",                 inline: true },
    ],
  },
  {
    name: "vatrica-nova",
    title: "<:2084purplestar:1504504848375349388> ɴᴏᴠᴀ ᴠᴀᴛʀɪᴄᴀ! <a:793429sparkles:1496899433634201611>",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:giveaways5:1500203902446997586> Čestitamo {user}!\nImaš sada **`{vatriceCount}`** <:2084purplestar:1504504848375349388>\n━━━━━━━━━━━━━━━━━━━━━━\n<:32467lovetalk:1504505532323594321> Zadrži aktivnost i skupljaj vatrice! <:518169rolemodpurple:1496901673426096158>",
    color: "#FF85C8",
    category: "XP",
    footer: "GIANNI (Custom) • Vatrice sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Vatrice", value: "`{vatriceCount}`", inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> Level",     value: "`{level}`",         inline: true },
      { name: "<:4558purplecheck:1504504889706020995> Status",  value: "`Aktivan <a:3599pinkheart:1504504866700132534>`",    inline: true },
    ],
  },
  {
    name: "aktivnost",
    title: "<:518169rolemodpurple:1496901673426096158> ᴀᴋᴛɪᴠɴᴏsᴛ",
    description:
      "━━━━━━━━━━━━━━━━━━━━\n<a:571294pinkpaw:1500259928936284211> **{user}**\n━━━━━━━━━━━━━━━━━━━━\n<:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142>  `{progress}/100`\n<a:44503lockkey:1500444008760217641> Još **`{doSljedeceg}`** poruka do sljedećeg levela",
    color: "#9B59B6",
    category: "XP",
    footer: "GIANNI (Custom) • Aktivnost • Svakih 100 poruka novi level!",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Level",   value: "```fix\n<:2084purplestar:1504504848375349388> {level} <:2084purplestar:1504504848375349388>\n```",                         inline: true },
      { name: "<:2084purplestar:1504504848375349388> XP",       value: "```py\n{xp}\n```",                                             inline: true },
      { name: "<:32467lovetalk:1504505532323594321> Poruke",   value: "```css\n{poruke}\n```",                                        inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> Vatrice",  value: "```yaml\n{vatrice}\n```",                                      inline: true },
      { name: "<a:793429sparkles:1496899433634201611> Sistem",   value: "```ini\n[100 poruka = 1 LVL + 1 vatrica + 100 XP]\n```",       inline: false },
    ],
  },
  {
    name: "rank",
    title: "<:518169rolemodpurple:1496901673426096158> Rank Profil",
    description:
      "<:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142>\n`▰▰▰▰▱▱▱▱▱▱` **{pct}%**",
    color: "#9B59B6",
    category: "XP",
    footer: null,
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Level",  value: "```fix\n{level}\n```",   inline: true },
      { name: "<:2084purplestar:1504504848375349388> XP",      value: "```py\n{xp}/{needed}\n```",inline: true },
      { name: "<a:793429sparkles:1496899433634201611> Progres", value: "```css\n[{pct}%]\n```",  inline: true },
      { name: "<:32467lovetalk:1504505532323594321> Poruke",  value: "```ini\n[{poruke}]\n```",inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> Rank",      value: "```fix\n#{rank}\n```",   inline: true },
    ],
  },
  {
    name: "leaderboard-xp",
    title: "<:79529shinycrown:1496899185516216400> Top Lista — XP",
    description:
      "<:79529shinycrown:1496899185516216400> **{top1}** — Level `{lvl1}` • `{xp1} XP`\n<:2084purplestar:1504504848375349388> **{top2}** — Level `{lvl2}` • `{xp2} XP`\n<:4558purplecheck:1504504889706020995> **{top3}** — Level `{lvl3}` • `{xp3} XP`\n<:518169rolemodpurple:1496901673426096158> **{top4}** — Level `{lvl4}` • `{xp4} XP`\n<a:15072animatedarrowpink2:1496898801556914236> **{top5}** — Level `{lvl5}` • `{xp5} XP`",
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
      "<:79529shinycrown:1496899185516216400> **{top1}** — `{coins1} <a:529977coin:1500444133389635704>`\n<:2084purplestar:1504504848375349388> **{top2}** — `{coins2} <a:529977coin:1500444133389635704>`\n<:4558purplecheck:1504504889706020995> **{top3}** — `{coins3} <a:529977coin:1500444133389635704>`\n<:518169rolemodpurple:1496901673426096158> **{top4}** — `{coins4} <a:529977coin:1500444133389635704>`\n<a:15072animatedarrowpink2:1496898801556914236> **{top5}** — `{coins5} <a:529977coin:1500444133389635704>`",
    color: "#FF85C8",
    category: "XP",
    footer: null,
    thumbnail: null,
    fields: [],
  },
  // ─── EKONOMIJA (Purple) ───────────────────────────────────────
  {
    name: "heist",
    title: "<:518169rolemodpurple:1496901673426096158> RAZBOJ U PRIPREMI",
    description:
      "<a:44503lockkey:1500444008760217641> **{user}** organizuje razboj! <a:15072animatedarrowpink2:1496898801556914236>\n<:518169rolemodpurple:1496901673426096158> **Klikni dugme da se pridružiš** (treba 3+ ljudi)\n<a:64382pinksparkles:1500259869259988033> 30 sekundi do akcije!",
    color: "#9B59B6",
    category: "Ekonomija",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Učesnici",  value: "`{count}/10`",         inline: true },
      { name: "<a:529977coin:1500444133389635704> Cilj",     value: "`{target} <a:529977coin:1500444133389635704>`",    inline: true },
      { name: "<:1111pinkarrow:1496903118108229733> Rizik",     value: "`{risk}% šansa propasti`",inline: true },
    ],
  },
  {
    name: "lottery",
    title: "<:518169rolemodpurple:1496901673426096158> Sedmična Loto",
    description:
      "<a:giveaways5:1500203902446997586> Kupi tiket i osvoji jackpot! <a:64382pinksparkles:1500259869259988033>",
    color: "#9B59B6",
    category: "Ekonomija",
    footer: "/lottery buy — kupi tiket za 100 coina",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Pot",           value: "`{pot}` <a:529977coin:1500444133389635704>",  inline: true },
      { name: "<a:ticket:1500196243853541397> Tvoji tiketi",  value: "`{my}` / `{total}`",inline: true },
      { name: "<a:793429sparkles:1496899433634201611> Šansa",         value: "`{chance}%`",      inline: true },
      { name: "<a:44503lockkey:1500444008760217641> Sljedeći žrijeb",value: "{nextDraw}",      inline: false },
    ],
  },
  {
    name: "quests",
    title: "<:518169rolemodpurple:1496901673426096158> Dnevni Zadaci",
    description:
      "<:268961empty:1496899316596605142> **Pošalji 10 poruka** — Budi aktivan u chatu\n`░░░░░░░░░░` `0/10` • <a:529977coin:1500444133389635704> `+200`\n\n<:4558purplecheck:1504504889706020995> **Odigraj 3 igre** — Posjeti #igre kanal\n`<:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:268961empty:1496899316596605142><:268961empty:1496899316596605142>` `3/5` • <a:529977coin:1500444133389635704> `+500`\n\n<:617219rolemodpink:1496898535897956373> **Pošalji kompliment** — Koristi /kompli\n`<:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158>` `5/5` • <a:529977coin:1500444133389635704> `+300`",
    color: "#9B59B6",
    category: "Ekonomija",
    footer: "Resetuju se u ponoć UTC • GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Završeno", value: "`{done}/3`",              inline: true },
      { name: "<a:529977coin:1500444133389635704> Ukupno",   value: "`{ukupno} <a:529977coin:1500444133389635704>`",       inline: true },
      { name: "<:2261bell:1504505860720820395> Reset",    value: "Sutra u 00:00",             inline: true },
    ],
  },
  {
    name: "giveaway",
    title: "<:79529shinycrown:1496899185516216400> NAGRADNA IGRA!",
    description:
      "## <:79529shinycrown:1496899185516216400>  {nagrada}\n\n<:518169rolemodpurple:1496901673426096158> Klikni dugme **<a:giveaways5:1500203902446997586> Učestvuj** da se prijaviš!",
    color: "#9B59B6",
    category: "Ekonomija",
    footer: "Završava se automatski • GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "<a:44503lockkey:1500444008760217641> Trajanje",    value: "`{trajanje}`",  inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Učesnici",     value: "`{ucesnici}`",  inline: true },
      { name: "<a:ticket:1500196243853541397> Domaćin",     value: "{domaćin}",    inline: false },
      { name: "<:2261bell:1504505860720820395> Završava",    value: "{kraj}",        inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Pobjednici", value: "`{count}`",     inline: true },
    ],
  },
  // ─── IGRE ─────────────────────────────────────────────────────
  {
    name: "slots",
    title: "<:518169rolemodpurple:1496901673426096158>  S L O T  M A Š I N A",
    description: "𓉘  <:58390neoncherry:1496902029363249212>  │  <:58390neoncherry:1496902029363249212>  │  <:58390neoncherry:1496902029363249212>  𓉝\n\n<a:giveaways5:1500203902446997586> Sva tri ista — **JACKPOT!**",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Ulog",     value: "`{ulog} <a:529977coin:1500444133389635704>`",          inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> Rezultat",  value: "<a:giveaways5:1500203902446997586> **+{dobitak} <a:529977coin:1500444133389635704>** *(×3)*", inline: true },
      { name: "<a:44503lockkey:1500444008760217641> Balans",   value: "`{balans} <a:529977coin:1500444133389635704>`",         inline: true },
    ],
  },
  {
    name: "blackjack",
    title: "<:2084purplestar:1504504848375349388> Blackjack",
    description: null,
    color: "#9B59B6",
    category: "Igre",
    footer: "Oklada: {oklada} <a:529977coin:1500444133389635704> • GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "Tvoje karte  (17)", value: "🂡 🂮", inline: false },
      { name: "Dealer  (?)",       value: "🂫 🎴", inline: false },
      { name: "Rezultat",          value: "<a:giveaways5:1500203902446997586> **BLACKJACK!** `+{dobitak} <a:529977coin:1500444133389635704>`!", inline: false },
    ],
  },
  {
    name: "poker-lobby",
    title: "<:2084purplestar:1504504848375349388> POKER — Texas Hold'em",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:529977coin:1500444133389635704> **Ulog po igraču:** `{ulog} <a:529977coin:1500444133389635704>`\n<:79529shinycrown:1496899185516216400> **Trenutni pot:** `{pot} <a:529977coin:1500444133389635704>`\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:571294pinkpaw:1500259928936284211> **Igrači ({count}/9):**\n▸ **{player1}**\n▸ **{player2}**\n\n▸ Klikni **Ulazi u igru** da se pridružiš\n▸ Domaćin klika **Počni igru** kad je spreman\n▸ Igra automatski kreće za **60 sekundi**",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Poker • Min 2, Max 9 igrača",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poker-game",
    title: "<:2084purplestar:1504504848375349388> Pre-Flop — Kartice podijeljene",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n<:2084purplestar:1504504848375349388> **Zajedničke kartice:**\n`?` `?` `?` `?` `?`\n<a:529977coin:1500444133389635704> **Pot:** `{pot} <a:529977coin:1500444133389635704>`\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:571294pinkpaw:1500259928936284211> **Aktivni:**\n<:4558purplecheck:1504504889706020995> **{player1}**\n<:4558purplecheck:1504504889706020995> **{player2}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:44503lockkey:1500444008760217641> **Čekamo potez:**\n<:518169rolemodpurple:1496901673426096158> {player1}",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • Klikni 'Vidi kartice' za svoju ruku",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poker-showdown",
    title: "<:79529shinycrown:1496899185516216400> SHOWDOWN — Poker",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n<:2084purplestar:1504504848375349388> **Zajedničke kartice:**\n🂡 🂺 🂳 🃈 🃑\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<:79529shinycrown:1496899185516216400> **{winner}**\n   Ruka: 🂡 🂮\n   → **Royal Flush**\n\n<:518169rolemodpurple:1496901673426096158> **{loser}**\n   Ruka: 🃁 🃎\n   → **Dva Para**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:529977coin:1500444133389635704> **Dobitak:** `{dobitak} <a:529977coin:1500444133389635704>` po pobjedniku",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Poker završen",
    thumbnail: null,
    fields: [],
  },
  {
    name: "among-us-lobby",
    title: "<:518169rolemodpurple:1496901673426096158> Among Us — Lobby",
    description: "Pridruži se i čekaj da host pokrene igru!\n**Min 4 • Max 10 igrača**",
    color: "#9B59B6",
    category: "Igre",
    footer: "Host: klikni Pokreni igru kad ste svi tu!",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Igrači (2/10)", value: "<:994180roleadminred1:1496902197605306461> Player1\n<:11309roleadminblue2:1496898576150954165> Player2", inline: false },
    ],
  },
  {
    name: "among-us-game",
    title: "<:518169rolemodpurple:1496901673426096158> Among Us — U Toku",
    description: null,
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Among Us",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Igrači",  value: "<:994180roleadminred1:1496902197605306461> Player1\n<:11309roleadminblue2:1496898576150954165> Player2\n<a:44503lockkey:1500444008760217641> ~~Player3~~", inline: false },
      { name: "<:4558purplecheck:1504504889706020995> Zadaci", value: "<:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:518169rolemodpurple:1496901673426096158><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142> `3/10`", inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> Živi",     value: "2 crew | 1 imp", inline: true },
    ],
  },
  {
    name: "among-us-end",
    title: "<:4558purplecheck:1504504889706020995> CREWMATI POBIJEDE!",
    description: "Svi impostori eliminirani! <:4558purplecheck:1504504889706020995>",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Among Us",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Otkrivene uloge", value: "<:518169rolemodpurple:1496901673426096158> **Player1** — CREWMATE\n<a:44503lockkey:1500444008760217641> **Player2** — IMPOSTOR", inline: false },
    ],
  },
  {
    name: "kaladont-start",
    title: "<:2084purplestar:1504504848375349388>  K A L A D O N T",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<a:64382pinksparkles:1500259869259988033> Igra je počela! Prva riječ:\n## <:32467lovetalk:1504505532323594321>  **BALKAN**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "Pokrenuo/la: {user}  •  Pritisni dugme za kraj",
    thumbnail: null,
    fields: [
      { name: "<a:15072animatedarrowpink2:1496898801556914236>  Sljedeća počinje sa", value: "## **`AN`**",                  inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158>  Težina",                value: "<:2084purplestar:1504504848375349388> Normalno · 2 slova",    inline: true },
      { name: "<:8526link:1504505939917803620>  Niz",                 value: "**#1**",                        inline: true },
      {
        name: "<:1111pinkarrow:1496903118108229733>  Pravila igre",
        value:
          "<:4558purplecheck:1504504889706020995> Svaka riječ počinje traženim slovima\n<a:44503lockkey:1500444008760217641> Ista osoba **ne može** igrati iza sebe\n<a:15072animatedarrowpink2:1496898801556914236> Ponavljanje iste riječi nije dozvoljeno\n<a:64382pinksparkles:1500259869259988033> **50/50 sudbina** — čak i ispravna može propasti!\n<:1111pinkarrow:1496903118108229733> Pritisni **Pomoć** za primjer riječi\n<:79529shinycrown:1496899185516216400> Upiši **`KALADONT`** i osvoji **1500** <a:529977coin:1500444133389635704>!",
        inline: false,
      },
    ],
  },
  {
    name: "kaladont-active",
    title: "<:2084purplestar:1504504848375349388>  K A L A D O N T  —  aktivna igra",
    description: "━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "Pritisni dugme za kraj igre",
    thumbnail: null,
    fields: [
      { name: "<a:64382pinksparkles:1500259869259988033>  Zadnja riječ",         value: "**`ANKETA`**",  inline: true },
      { name: "<:32467lovetalk:1504505532323594321>  Odigrao/la",           value: "Korisnik",      inline: true },
      { name: "<:8526link:1504505939917803620>  Niz",                  value: "**#5**",        inline: true },
      { name: "<a:15072animatedarrowpink2:1496898801556914236>  Sljedeća počinje sa",  value: "## **`TA`**",   inline: false },
    ],
  },
  {
    name: "kaladont-word",
    title: null,
    description: "## <a:64382pinksparkles:1500259869259988033>  **TAČKA**\n*<:32467lovetalk:1504505532323594321> Korisnik*",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI Kaladont  •  #6",
    thumbnail: null,
    fields: [
      { name: "<a:15072animatedarrowpink2:1496898801556914236>  Sljedeća počinje sa", value: "## **`KA`**", inline: true },
      { name: "<:8526link:1504505939917803620>  Niz",                 value: "**#6**",       inline: true },
    ],
  },
  {
    name: "kaladont-win",
    title: "<:79529shinycrown:1496899185516216400>  K A L A D O N T  —  P O B J E D A !",
    description: "<a:giveaways5:1500203902446997586> {user} je izrekao/la magičnu riječ!",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • Kaladont pobjeda",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400>  Pobjednik/ca",  value: "**{user}**",     inline: true },
      { name: "<:2084purplestar:1504504848375349388>  Riječi u nizu",  value: "**{count}**",    inline: true },
      { name: "<a:529977coin:1500444133389635704>  Nagrada",        value: "**+1.500 <a:529977coin:1500444133389635704>**",inline: true },
      { name: "<a:505993sparkle1:1496899369939636295>  XP",             value: "**+200**",          inline: true },
    ],
  },
  {
    name: "bingo",
    title: "<:2084purplestar:1504504848375349388>  B  I  N  G  O",
    description:
      "<:1111pinkarrow:1496903118108229733> **Klikni dugme ispod i unesi 5 brojeva (1–75)!**\n<a:ticket:1500196243853541397> Tiket košta samo **500 coina** <a:529977coin:1500444133389635704>\n\n<a:44503lockkey:1500444008760217641> Imaš **2 minute** za tiket!\n<a:64382pinksparkles:1500259869259988033> Rezultati se objavljuju **javno** za sve",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI Bingo • Cijena tiketa: 500 coina",
    thumbnail: null,
    fields: [
      {
        name: "<:79529shinycrown:1496899185516216400>  Nagradna lista",
        value:
          "<:4558purplecheck:1504504889706020995> `2 pogotka`  ──  **10.000** <a:529977coin:1500444133389635704>\n<:518169rolemodpurple:1496901673426096158> `3 pogotka`  ──  **30.000** <a:529977coin:1500444133389635704>\n<:2084purplestar:1504504848375349388> `4 pogotka`  ──  **75.000** <a:529977coin:1500444133389635704>\n<:79529shinycrown:1496899185516216400> `5 pogodaka` ── **250.000** <a:529977coin:1500444133389635704>  **JACKPOT!**",
        inline: false,
      },
    ],
  },
  // ─── FUN (Pink) ───────────────────────────────────────────────
  {
    name: "hunt",
    title: "<a:874347butterfly:1496899500160192562>  Uhvatio si životinju!",
    description: "## <a:874347butterfly:1496899500160192562>  {animal}\n<:2084purplestar:1504504848375349388> **{rarity}**  ·  <:33927diamond:1496898969052381407> Snaga `{power}`",
    color: "#FF85C8",
    category: "Fun",
    footer: "{user} • GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [
      { name: "<a:64382pinksparkles:1500259869259988033> Imaš ukupno", value: "`1x <a:874347butterfly:1496899500160192562> {animal}`",  inline: true },
      { name: "<a:529977coin:1500444133389635704> Vrijednost",  value: "`{value} <a:529977coin:1500444133389635704>`",     inline: true },
    ],
  },
  {
    name: "zoo",
    title: "<a:874347butterfly:1496899500160192562> {user} — Zoo",
    description:
      "<a:505993sparkle1:1496899369939636295> **Legendary**\n<:2084purplestar:1504504848375349388> **Zmaj** `×1`\n\n<:4558purplecheck:1504504889706020995> **Uncommon**\n<a:874347butterfly:1496899500160192562> **Vuk** `×3`  <a:874347butterfly:1496899500160192562> **Lisica** `×2`\n\n<:518169rolemodpurple:1496901673426096158> **Common**\n<a:571294pinkpaw:1500259928936284211> **Riba** `×7`  <a:571294pinkpaw:1500259928936284211> **Zec** `×5`",
    color: "#FF85C8",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0 • /hunt za loviti!",
    thumbnail: null,
    fields: [
      { name: "<a:64382pinksparkles:1500259869259988033> Ukupno",   value: "`{total}` životinja", inline: true },
      { name: "<:33927diamond:1496898969052381407> Snaga",    value: "`{power}`",           inline: true },
      { name: "<a:529977coin:1500444133389635704> Vrijednost","value": "`{value} <a:529977coin:1500444133389635704>`",  inline: true },
    ],
  },
  {
    name: "battle",
    title: "<:33927diamond:1496898969052381407>  BITKA!",
    description:
      "<a:571294pinkpaw:1500259928936284211> **{player1}** vs <:518169rolemodpurple:1496901673426096158> **{player2}**\n`████████████░░░░░░░░`\n<:33927diamond:1496898969052381407> `{score1}` vs `{score2}` <:33927diamond:1496898969052381407>",
    color: "#9B59B6",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: "{winner.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Pobjednik", value: "**{winner}**",         inline: true },
      { name: "<a:44503lockkey:1500444008760217641> Poražen",    value: "{loser}",              inline: true },
      { name: "<a:529977coin:1500444133389635704> Nagrada",    value: "`+{nagrada} <a:529977coin:1500444133389635704>`",  inline: false },
    ],
  },
  {
    name: "pray",
    title: null,
    description: "<a:64382pinksparkles:1500259869259988033> {user} moli se za {target}! Nebo čuje — `+{bonus} <a:529977coin:1500444133389635704>` palo s neba! <a:giveaways5:1500203902446997586>",
    color: "#FF85C8",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vers",
    title: null,
    description: "> <a:music2:1500459145382592602>\n> *Ovo je primjer versa koji korisnik pošalje*\n> *Svaki red je jedan stih*\n> <a:80401musicalhearts:1500444017203089478>",
    color: "#9B59B6",
    category: "Fun",
    footer: "vers • drop the mic",
    thumbnail: null,
    fields: [
      { name: "<a:music2:1500459145382592602> Izvođač",  value: "{user}",       inline: true },
      { name: "<a:505993sparkle1:1496899369939636295> Reakcije", value: "`{reactions}`",  inline: true },
    ],
  },
  {
    name: "kompli",
    title: null,
    description: "<a:124071redrose:1496899261651226766> {from} kaže {to}:\n*'Ti si razlog zašto dan počinje sa osmijehom.'* <a:3599pinkheart:1504504866700132534>",
    color: "#FF85C8",
    category: "Fun",
    footer: "GIANNI (Custom) • Muvanje 101",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "fora",
    title: null,
    description: "<a:24420sleepyhellokitty:1496898915176415413> {from} je pogledao/la {to} i shvatio/la:\n*'Brate/sestro, ti si dokaz da evolucija nije uvijek napredak.'* <a:568481annoyedgojo:1496899399077330994>",
    color: "#9B59B6",
    category: "Fun",
    footer: "GIANNI (Custom) • Sve u šali!",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "muv",
    title: null,
    description: "<a:24420sleepyhellokitty:1496898915176415413> {from} → {to}:\n*'Jesi li ti WiFi? Jer osjećam konekciju između nas.'* <a:64382pinksparkles:1500259869259988033>",
    color: "#FF85C8",
    category: "Fun",
    footer: "GIANNI (Custom) • Balkan Muvanje",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "crush",
    title: null,
    description: "<a:3599pinkheart:1504504866700132534> Po zvijezdama i kafanskim računima, tvoj tajni crush je... **{crush}**! <a:568481annoyedgojo:1496899399077330994>",
    color: "#FF85C8",
    category: "Fun",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  // ─── LJUBAVNE (Pink) ──────────────────────────────────────────
  {
    name: "zagrljaj",
    title: null,
    description: "<a:zagrljaj:1500203677917511741> {from} grli {to}! Aww, tako slatko! <a:64382pinksparkles:1500259869259988033>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poljubac",
    title: null,
    description: "<a:poljubac:1500203685450617032> {from} šalje poljubac {to}! <a:3599pinkheart:1504504866700132534> Aww! <a:924343love:1500058006308519936>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "mazi",
    title: null,
    description: "<a:mazi:1500203682199896245> {from} mazi {to} nježno! Aww! <a:64382pinksparkles:1500259869259988033>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "tapsi",
    title: null,
    description: "<a:571294pinkpaw:1500259928936284211> {from} tapše {to} prijateljski! <a:924343love:1500058006308519936>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "high5",
    title: null,
    description: "<a:236855heartpop:1496899299487907870> {from} daje peticu {to}! HIGH FIVE! <a:571294pinkpaw:1500259928936284211>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "cudan",
    title: null,
    description: "<a:568481annoyedgojo:1496899399077330994> {from} je ćudan prema {to}! Ajde, brate... <a:568481annoyedgojo:1496899399077330994>",
    color: "#9B59B6",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "srce",
    title: null,
    description: "<a:srce:1500197728267927734> {from} šalje srce {to}! Aww! <a:3599pinkheart:1504504866700132534> <a:924343love:1500058006308519936>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  {
    name: "brak",
    title: null,
    description: "<:33927diamond:1496898969052381407> {from} zaprosio {to}! <a:924343love:1500058006308519936> Hoćeš li? <a:64382pinksparkles:1500259869259988033>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [],
  },
  // ─── INFO (Purple) ────────────────────────────────────────────
  {
    name: "spotify",
    title: "<:2084purplestar:1504504848375349388> {trackTitle}",
    description:
      "<a:music2:1500459145382592602> **Izvođač:** {artist}\n<a:85034pinknotes:1500444022622130196> **Album:** {album}\n\n`0:45` ▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱▱▱▱▱ `3:22`",
    color: "#9B59B6",
    category: "Info",
    footer: "Spotify • GIANNI (Custom)",
    thumbnail: "{albumArt}",
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Žanr",       value: "{genre}",    inline: true },
      { name: "<a:music2:1500459145382592602> Trajanje",  value: "{duration}", inline: true },
      { name: "<:8526link:1504505939917803620> Link",       value: "[Otvori na Spotifyju]({url})", inline: false },
    ],
  },
  {
    name: "invite",
    title: "<:518169rolemodpurple:1496901673426096158> Statistika — {user}",
    description: null,
    color: "#9B59B6",
    category: "Info",
    footer: "Korisnik: {user} • ID: {userId}",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:32467lovetalk:1504505532323594321> Poruke poslato", value: "`{poruke}`",          inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Doveo članova",   value: "`{invites}`",         inline: true },
      { name: "<:2261bell:1504505860720820395> Pridružio",      value: "{joinedAt}",          inline: true },
      { name: "<:8526link:1504505939917803620> Tvoj invite",    value: "`{inviteUses}` korišćenja", inline: false },
    ],
  },
  {
    name: "avatar",
    title: "<:2084purplestar:1504504848375349388> {user}",
    description: "<a:15072animatedarrowpink2:1496898801556914236> [PNG]({png}) **·** <:2084purplestar:1504504848375349388> [JPG]({jpg}) **·** <:518169rolemodpurple:1496901673426096158> [WEBP]({webp})",
    color: "#9B59B6",
    category: "Info",
    footer: null,
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Korisnik", value: "{user}",     inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> ID",        value: "`{userId}`", inline: true },
    ],
  },
  {
    name: "brojanje-info",
    title: "<:2084purplestar:1504504848375349388> Brojanje — stanje",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> **Kanal:** {channel}\n<:32467lovetalk:1504505532323594321> **Trenutno:** `{current}`\n<:518169rolemodpurple:1496901673426096158> **Sljedeći broj:** `{next}`\n<a:571294pinkpaw:1500259928936284211> **Zadnji brojao:** {lastUser}\n<:79529shinycrown:1496899185516216400> **Rekord:** `{highScore}`",
    color: "#9B59B6",
    category: "Info",
    footer: "GIANNI (Custom) v2.0",
    thumbnail: null,
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Status",         value: "`{status}`",  inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Rekord",        value: "`{record}`",  inline: true },
      { name: "<a:44503lockkey:1500444008760217641> Zadnji propust", value: "{lastFail}",  inline: true },
    ],
  },
  // ─── VATRICE ─────────────────────────────────────────────────
  {
    name: "vatrice-pup",
    title: "<:2084purplestar:1504504848375349388> Top Lista — Vatrice",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:64382pinksparkles:1500259869259988033> Najpopularniji članovi po vatricama:\n━━━━━━━━━━━━━━━━━━━━━━\n<:79529shinycrown:1496899185516216400> **{top1}** — <:2084purplestar:1504504848375349388> `{top1count}`\n<:2084purplestar:1504504848375349388> **{top2}** — <:518169rolemodpurple:1496901673426096158> `{top2count}`\n<:4558purplecheck:1504504889706020995> **{top3}** — <a:3599pinkheart:1504504866700132534> `{top3count}`\n<:518169rolemodpurple:1496901673426096158> **{top4}** — <a:15072animatedarrowpink2:1496898801556914236> `{top4count}`\n<a:15072animatedarrowpink2:1496898801556914236> **{top5}** — <a:571294pinkpaw:1500259928936284211> `{top5count}`\n━━━━━━━━━━━━━━━━━━━━━━\n<:32467lovetalk:1504505532323594321> Tvoje mjesto: **#{rank}** | Imaš: **{myCount}** <:2084purplestar:1504504848375349388>",
    color: "#9B59B6",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vatrice-start",
    title: "<:2084purplestar:1504504848375349388> Vatrica Sistem — Aktiviran!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:4558purplecheck:1504504889706020995> Vatrica sistem je uspješno aktiviran!\n━━━━━━━━━━━━━━━━━━━━━━\n<:2084purplestar:1504504848375349388> Svako **{prag}** poruka, član dobija **1 vatricu**\n<:518169rolemodpurple:1496901673426096158> Nick se automatski ažurira\n<a:15072animatedarrowpink2:1496898801556914236> Objave se šalju u {kanal}\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Emoji", value: "`{emoji}`",    inline: true },
      { name: "<a:15072animatedarrowpink2:1496898801556914236> Kanal", value: "{kanal}",      inline: true },
      { name: "<a:793429sparkles:1496899433634201611> Prag",  value: "`{prag}` poruka", inline: true },
    ],
  },
  {
    name: "vatrice-kanal",
    title: "<:4558purplecheck:1504504889706020995> Vatrica Kanal Postavljen",
    description: "<a:15072animatedarrowpink2:1496898801556914236> Objave vatrica će se od sada slati u {kanal}.",
    color: "#9B59B6",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vatrice-oblik",
    title: "<:2084purplestar:1504504848375349388> Vatrica Emoji Promijenjen",
    description: "━━━━━━━━━━━━━━━━━━━━━━\n<a:64382pinksparkles:1500259869259988033> Emoji vatrice je promijenjen!\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [
      { name: "<a:44503lockkey:1500444008760217641> Stari emoji", value: "`{stari}`", inline: true },
      { name: "<:4558purplecheck:1504504889706020995> Novi emoji",  value: "`{novi}`",  inline: true },
    ],
  },
  // ─── EKONOMIJA dopune ─────────────────────────────────────────
  {
    name: "giveaway-end",
    title: "<:79529shinycrown:1496899185516216400> Nagradna Igra — ZAVRŠENA!",
    description: "## <a:3599pinkheart:1504504866700132534>  {nagrada}\n\nČestitamo pobjedniku — pratite objavu! <a:64382pinksparkles:1500259869259988033>",
    color: "#9B59B6",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Giveaway završen",
    thumbnail: null,
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Pobjednik", value: "{pobjednik}",  inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Učesnici",    value: "`{ucesnici}`", inline: true },
      { name: "<a:ticket:1500196243853541397> Domaćin",    value: "{domaćin}",    inline: true },
    ],
  },
  // ─── IGRE dopune ─────────────────────────────────────────────
  {
    name: "vjasala",
    title: "<:2084purplestar:1504504848375349388>  V J E Š A L A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:518169rolemodpurple:1496901673426096158> Pogodi skrivenu riječ!\n\n```\n_ _ _ _ _ _\n```\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /vjasala",
    thumbnail: null,
    fields: [
      { name: "<a:3599pinkheart:1504504866700132534> Životi",        value: "`{zivoti}/6`",  inline: true },
      { name: "<:32467lovetalk:1504505532323594321> Pogođena slova",value: "`{pogodjena}`", inline: true },
      { name: "<a:44503lockkey:1500444008760217641> Promašaji",     value: "`{promasaji}`", inline: true },
    ],
  },
  {
    name: "vjasala-kraj",
    title: "<a:giveaways5:1500203902446997586> Vješala — Pogodak!",
    description: "<:4558purplecheck:1504504889706020995> Čestitamo {user}! Pogodio/la si **{rijec}**! <a:64382pinksparkles:1500259869259988033>\n<a:529977coin:1500444133389635704> **Nagrada:** `+{nagrada} <a:529977coin:1500444133389635704>`",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • /vjasala",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "toplo-hladno",
    title: "<:518169rolemodpurple:1496901673426096158>  T O P L O  •  H L A D N O",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:2084purplestar:1504504848375349388> Pogodi tajni broj (1–{max})!\n\n<:518169rolemodpurple:1496901673426096158> **Hladno** — daleko si\n<:617219rolemodpink:1496898535897956373> **Toplo** — bliže si\n<a:3599pinkheart:1504504866700132534> **Vrelo** — skoro!\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /toplo-hladno",
    thumbnail: null,
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Maksimum", value: "`{max}`",      inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> Pokušaji",   value: "`{pokusaji}`", inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> Status",   value: "{status}",      inline: true },
    ],
  },
  {
    name: "kviz",
    title: "<:2084purplestar:1504504848375349388>  K V I Z  —  Balkan Pitanje",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:1111pinkarrow:1496903118108229733> **{pitanje}**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /kviz • Oklada: {oklada} <a:529977coin:1500444133389635704>",
    thumbnail: null,
    fields: [
      { name: "<:518169rolemodpurple:1496901673426096158> A",   value: "{a}", inline: true },
      { name: "<:617219rolemodpink:1496898535897956373> B",   value: "{b}", inline: true },
      { name: "<:2084purplestar:1504504848375349388> C", value: "{c}", inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> D", value: "{d}", inline: true },
    ],
  },
  {
    name: "geografija",
    title: "<:2084purplestar:1504504848375349388>  G E O G R A F I J A  —  Kviz",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:518169rolemodpurple:1496901673426096158> **{pitanje}**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /geografija • Oklada: {oklada} <a:529977coin:1500444133389635704>",
    thumbnail: null,
    fields: [
      { name: "<:518169rolemodpurple:1496901673426096158> A",   value: "{a}", inline: true },
      { name: "<:617219rolemodpink:1496898535897956373> B",   value: "{b}", inline: true },
      { name: "<:2084purplestar:1504504848375349388> C", value: "{c}", inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> D", value: "{d}", inline: true },
    ],
  },
  {
    name: "mafia-lobby",
    title: "<:2084purplestar:1504504848375349388>  M A F I A  —  Lobby",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━\n<a:64382pinksparkles:1500259869259988033> Mafia igra se priprema!\n**Pridruži se klikom na dugme.**\n━━━━━━━━━━━━━━━━━━━━━━━\n<:518169rolemodpurple:1496901673426096158> Min: **5** | Max: **12** igrača\n<a:44503lockkey:1500444008760217641> Igra kreće automatski za **60s** ili kad host klikne Start",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Mafia",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Igrači ({count}/12)", value: "{igraci}", inline: false },
    ],
  },
  {
    name: "mafia-end",
    title: "<:79529shinycrown:1496899185516216400>  M A F I A  —  Kraj Igre",
    description: "## {rezultat}\n\n{opis}",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • Mafia završena",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Uloge",      value: "{uloge}",      inline: false },
      { name: "<:79529shinycrown:1496899185516216400> Pobjednici",value: "{pobjednici}", inline: true },
      { name: "<a:44503lockkey:1500444008760217641> Eliminirani",value: "{eliminirani}",inline: true },
    ],
  },
  // ─── POO ────────────────────────────────────────────────────
  {
    name: "poo",
    title: "<a:793429sparkles:1496899433634201611>  P O O  —  Stanje Kreature",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n{emojiBar}\n<:4558purplecheck:1504504889706020995> **Zdravlje:** `{zdravlje}/100`\n<a:3599pinkheart:1504504866700132534> **Raspoloženje:** `{raspolozenje}`\n━━━━━━━━━━━━━━━━━━━━━━\n<a:571294pinkpaw:1500259928936284211> Ukupno čuvara: **{cuvari}**\n<:32467lovetalk:1504505532323594321> Završenih zadataka: **{zadaci}/100**",
    color: "#9B59B6",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Sistem",
    thumbnail: null,
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Zdravlje",    value: "`{zdravlje}/100`",   inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> Raspoloženje",value: "`{raspolozenje}`",   inline: true },
      { name: "<:32467lovetalk:1504505532323594321> Zadaci",      value: "`{zadaci}/100`",     inline: true },
    ],
  },
  {
    name: "poo-zadaci",
    title: "<:2084purplestar:1504504848375349388>  P O O  —  Zadaci",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:518169rolemodpurple:1496901673426096158> Lista Poo zadataka — stranica **{str}/{ukupnoStr}**\n━━━━━━━━━━━━━━━━━━━━━━\n{zadaci}",
    color: "#9B59B6",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Zadaci",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poo-top",
    title: "<:79529shinycrown:1496899185516216400>  P O O  —  Top Čuvari",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:79529shinycrown:1496899185516216400> **{top1}** — `{top1pts}` pts\n<:2084purplestar:1504504848375349388> **{top2}** — `{top2pts}` pts\n<:4558purplecheck:1504504889706020995> **{top3}** — `{top3pts}` pts\n<:518169rolemodpurple:1496901673426096158> **{top4}** — `{top4pts}` pts\n<a:15072animatedarrowpink2:1496898801556914236> **{top5}** — `{top5pts}` pts\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poo-hrani",
    title: "<a:3599pinkheart:1504504866700132534>  P O O  —  Hranjen!",
    description:
      "<a:571294pinkpaw:1500259928936284211> {user} je hranio/la Poo-a! <a:giveaways5:1500203902446997586>\nPotrošeno: **200 coina**\n\n{emojiBar}\n<:4558purplecheck:1504504889706020995> **Zdravlje:** `{zdravlje}/100` **(+{bonus})**",
    color: "#FF85C8",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Sistem",
    thumbnail: null,
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Novo zdravlje", value: "`{zdravlje}/100`", inline: true },
      { name: "<a:529977coin:1500444133389635704> Trošak",        value: "`200 coina`",         inline: true },
    ],
  },
  {
    name: "poo-info",
    title: "<a:793429sparkles:1496899433634201611>  P O O  —  Moj Doprinos",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:571294pinkpaw:1500259928936284211> **{user}**\n━━━━━━━━━━━━━━━━━━━━━━\n{progres}",
    color: "#9B59B6",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Završenih zadataka", value: "`{zavrseni}`", inline: true },
      { name: "<:2084purplestar:1504504848375349388> Bodova ukupno",      value: "`{bodovi}`",   inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Rang",              value: "`#{rang}`",    inline: true },
    ],
  },
  // ─── ADMIN ──────────────────────────────────────────────────
  {
    name: "backup",
    title: "<:4558purplecheck:1504504889706020995>  B A C K U P  —  Snimljen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:4558purplecheck:1504504889706020995> Backup je uspješno snimljen!\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Admin",
    footer: "GIANNI (Custom) • Backup Sistem",
    thumbnail: null,
    fields: [
      { name: "<:2261bell:1504505860720820395> Datum",   value: "{datum}",    inline: true },
      { name: "<:32467lovetalk:1504505532323594321> Veličina",value: "{velicina}", inline: true },
      { name: "<a:15072animatedarrowpink2:1496898801556914236> Cloud",   value: "Discord DM",   inline: true },
    ],
  },
  {
    name: "backup-restore",
    title: "<a:64382pinksparkles:1500259869259988033>  B A C K U P  —  Vraćen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<:4558purplecheck:1504504889706020995> Backup je uspješno vraćen!\n━━━━━━━━━━━━━━━━━━━━━━\n<:1111pinkarrow:1496903118108229733> Svi podaci su prepisani backupom od **{datum}**.",
    color: "#FF85C8",
    category: "Admin",
    footer: "GIANNI (Custom) • Backup Vraćen",
    thumbnail: null,
    fields: [
      { name: "<:2261bell:1504505860720820395> Backup datum", value: "{datum}",    inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Pokrenuo",      value: "{korisnik}", inline: true },
    ],
  },
  {
    name: "backup-status",
    title: "<a:793429sparkles:1496899433634201611>  B A C K U P  —  Status",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:15072animatedarrowpink2:1496898801556914236> Cloud backup istorija:\n━━━━━━━━━━━━━━━━━━━━━━\n{historija}",
    color: "#9B59B6",
    category: "Admin",
    footer: "GIANNI (Custom) • Backup Sistem",
    thumbnail: null,
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Ukupno backupa", value: "`{ukupno}`",  inline: true },
      { name: "<:2261bell:1504505860720820395> Zadnji",         value: "{zadnji}",    inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> Veličina",         value: "{velicina}",  inline: true },
    ],
  },

  // ─── MODERACIJA (kompletno) ────────────────────────────────────
  {
    name: "mod-kick",
    title: "<:994180roleadminred1:1496902197605306461> Član Kickovan",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> **{target}** je kickovan sa servera.\n<:518169rolemodpurple:1496901673426096158> Razlog: **{reason}**",
    color: "#dc2626",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:617219rolemodpink:1496898535897956373> Izvršio",  value: "{mod}",    inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",            value: "{date}",   inline: true },
      { name: "<:268961empty:1496899316596605142>",               value: "",         inline: true },
    ],
  },
  {
    name: "mod-mute",
    title: "<:518169rolemodpurple:1496901673426096158> Član Mutovan",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> **{target}** je mutovan na **{duration}**.\n<:518169rolemodpurple:1496901673426096158> Razlog: **{reason}**",
    color: "#9B59B6",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:617219rolemodpink:1496898535897956373> Izvršio",   value: "{mod}",      inline: true },
      { name: "<:2261bell:1504505860720820395> Trajanje",           value: "{duration}", inline: true },
      { name: "<:4558purplecheck:1504504889706020995> Ističe",      value: "{expires}",  inline: true },
    ],
  },
  {
    name: "mod-unmute",
    title: "<:4558purplecheck:1504504889706020995> Član Odmutovan",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{target}** je odmutovan.\n<:518169rolemodpurple:1496901673426096158> Može ponovo pisati na serveru.",
    color: "#059669",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:617219rolemodpink:1496898535897956373> Izvršio", value: "{mod}",  inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",            value: "{date}", inline: true },
    ],
  },
  {
    name: "mod-timeout",
    title: "<:518169rolemodpurple:1496901673426096158> Timeout",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> **{target}** je stavljen u timeout na **{duration}**.\n<:518169rolemodpurple:1496901673426096158> Razlog: **{reason}**",
    color: "#d97706",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:617219rolemodpink:1496898535897956373> Izvršio",  value: "{mod}",      inline: true },
      { name: "<:2261bell:1504505860720820395> Trajanje",          value: "{duration}", inline: true },
      { name: "<:4558purplecheck:1504504889706020995> Ističe",     value: "{expires}",  inline: true },
    ],
  },
  {
    name: "mod-purge",
    title: "<:617219rolemodpink:1496898535897956373> Poruke Obrisane",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> Obrisano **{count}** poruka u <#{channel}>.\n<:518169rolemodpurple:1496901673426096158> Izvršio: **{mod}**",
    color: "#9B59B6",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Purge",
    thumbnail: null,
    fields: [],
  },
  {
    name: "mod-unban",
    title: "<:4558purplecheck:1504504889706020995> Član Odbanovan",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{target}** je odbanovan sa servera.\n<:518169rolemodpurple:1496901673426096158> Izvršio: **{mod}**",
    color: "#059669",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: null,
    fields: [
      { name: "<:2261bell:1504505860720820395> Datum", value: "{date}", inline: true },
    ],
  },

  // ─── EKONOMIJA (kompletno) ────────────────────────────────────
  {
    name: "eco-balance",
    title: "<:2084purplestar:1504504848375349388> Balans — {user}",
    description:
      "<a:529977coin:1500444133389635704> Pregled tvog novčanika na serveru:",
    color: "#9B59B6",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:529977coin:1500444133389635704> Gotovina",  value: "`{cash}` 🪙",    inline: true },
      { name: "<:33927diamond:1496898969052381407> Banka",    value: "`{bank}` 🪙",    inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Ukupno", value: "`{total}` 🪙",  inline: true },
    ],
  },
  {
    name: "eco-daily",
    title: "<a:529977coin:1500444133389635704> Dnevna Nagrada",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{user}** je uzeo/la dnevnu nagradu!\n<:518169rolemodpurple:1496901673426096158> Streak: **{streak} dana** zaredom <a:3599pinkheart:1504504866700132534>",
    color: "#FF85C8",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija • Sutra možeš ponovo",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:529977coin:1500444133389635704> Nagrada",   value: "`+{amount}` 🪙",       inline: true },
      { name: "<:2084purplestar:1504504848375349388> Streak bonus", value: "`+{bonus}` 🪙",  inline: true },
      { name: "<:33927diamond:1496898969052381407> Ukupno",   value: "`{total}` 🪙",         inline: true },
    ],
  },
  {
    name: "eco-work",
    title: "<:518169rolemodpurple:1496901673426096158> Posao — {job}",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> **{user}** je radio/la kao **{job}** i zaradio/la:\n<a:529977coin:1500444133389635704> **{amount}** kovanica!",
    color: "#9B59B6",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija • Sljedeći posao za {cooldown}",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Zarada",   value: "`+{amount}` 🪙", inline: true },
      { name: "<:33927diamond:1496898969052381407> Balans",  value: "`{total}` 🪙",   inline: true },
    ],
  },
  {
    name: "eco-shop",
    title: "<:2084purplestar:1504504848375349388>  S H O P",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:15072animatedarrowpink2:1496898801556914236> Dobrodošao/la u shop! Kupi role, iteme i više.\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Shop",
    thumbnail: null,
    fields: [
      { name: "<:617219rolemodpink:1496898535897956373> VIP Role",      value: "`5.000` 🪙",  inline: true },
      { name: "<:864113ownerpinkcrownwithheart:1496899493130539008> Premium", value: "`10.000` 🪙", inline: true },
      { name: "<:33927diamond:1496898969052381407> Dijamant",            value: "`25.000` 🪙", inline: true },
    ],
  },
  {
    name: "eco-buy",
    title: "<:4558purplecheck:1504504889706020995> Kupovina Uspješna",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{user}** je kupio/la **{item}**!\n<:518169rolemodpurple:1496901673426096158> Cijena: **{price}** 🪙",
    color: "#FF85C8",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Shop",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:529977coin:1500444133389635704> Plaćeno",   value: "`-{price}` 🪙",  inline: true },
      { name: "<:33927diamond:1496898969052381407> Ostalo",   value: "`{balance}` 🪙", inline: true },
    ],
  },
  {
    name: "eco-transfer",
    title: "<:8526link:1504505939917803620> Transfer Kovanica",
    description:
      "<a:529977coin:1500444133389635704> **{from}** je poslao/la **{amount}** 🪙 → **{to}**\n<:4558purplecheck:1504504889706020995> Transfer uspješan!",
    color: "#9B59B6",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Iznos",  value: "`{amount}` 🪙",    inline: true },
      { name: "<:617219rolemodpink:1496898535897956373> Od", value: "{from}",          inline: true },
      { name: "<:2084purplestar:1504504848375349388> Za",   value: "{to}",             inline: true },
    ],
  },
  {
    name: "eco-rob",
    title: "<:994180roleadminred1:1496902197605306461> Pljačka!",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> **{user}** je pokušao/la opljačkati **{target}**!\n{result}",
    color: "#dc2626",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Ukradeno", value: "`{stolen}` 🪙",  inline: true },
      { name: "<:33927diamond:1496898969052381407> Kazna",   value: "`{fine}` 🪙",    inline: true },
    ],
  },

  // ─── MUZIKA ──────────────────────────────────────────────────
  {
    name: "music-play",
    title: "<a:85034pinknotes:1500444022622130196> Reprodukcija",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> Sada svira: **[{title}]({url})**\n<:518169rolemodpurple:1496901673426096158> Autor: **{author}** · Trajanje: `{duration}`",
    color: "#9B59B6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: "{thumbnail}",
    fields: [
      { name: "<:2261bell:1504505860720820395> Dodao/la",    value: "{requester}",  inline: true },
      { name: "<:33927diamond:1496898969052381407> Glasnoća", value: "`{volume}%`", inline: true },
      { name: "<:8526link:1504505939917803620> U redu",      value: "`{queueSize}` pjesme", inline: true },
    ],
  },
  {
    name: "music-queue",
    title: "<a:85034pinknotes:1500444022622130196>  R E D  —  Muzika",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:15072animatedarrowpink2:1496898801556914236> **Trenutno svira:**\n**[{currentTitle}]({currentUrl})** · `{currentDuration}`\n━━━━━━━━━━━━━━━━━━━━━━\n{queueList}",
    color: "#9B59B6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika • Strana {page}/{totalPages}",
    thumbnail: null,
    fields: [
      { name: "<:33927diamond:1496898969052381407> Ukupno u redu", value: "`{queueSize}` pjesme", inline: true },
      { name: "<:2261bell:1504505860720820395> Ukupno trajanje",   value: "`{totalDuration}`",    inline: true },
    ],
  },
  {
    name: "music-skip",
    title: "<:1111pinkarrow:1496903118108229733> Preskočeno",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{user}** je preskočio/la: **{title}**\n<a:85034pinknotes:1500444022622130196> Sljedeće: **{next}**",
    color: "#FF85C8",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: null,
    fields: [],
  },
  {
    name: "music-pause",
    title: "<a:85034pinknotes:1500444022622130196> Pauzirano",
    description:
      "<:518169rolemodpurple:1496901673426096158> Muzika je pauzirana.\n<a:15072animatedarrowpink2:1496898801556914236> Napiši `/resume` da nastaviš.",
    color: "#9B59B6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: null,
    fields: [],
  },
  {
    name: "music-stop",
    title: "<:2261bell:1504505860720820395> Muzika Zaustavljena",
    description:
      "<:518169rolemodpurple:1496901673426096158> **{user}** je zaustavio/la muziku i obrisao/la red.\n<a:571294pinkpaw:1500259928936284211> Vidimo se sljedeći put!",
    color: "#9B59B6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: null,
    fields: [],
  },
  {
    name: "music-lyrics",
    title: "<a:85034pinknotes:1500444022622130196> Tekst Pjesme — {title}",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n{lyrics}\n━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Lyrics • {author}",
    thumbnail: null,
    fields: [],
  },

  // ─── VERIFIKACIJA ────────────────────────────────────────────
  {
    name: "verify-panel",
    title: "<:4558purplecheck:1504504889706020995>  V E R I F I K A C I J A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:15072animatedarrowpink2:1496898801556914236> Klikni dugme ispod da potvrdiš da nisi bot!\n<:518169rolemodpurple:1496901673426096158> Nakon verifikacije dobijate pristup svim kanalima.\n━━━━━━━━━━━━━━━━━━━━━━\n<a:64382pinksparkles:1500259869259988033> **discord.gg/gian**",
    color: "#9B59B6",
    category: "Verifikacija",
    footer: "GIANNI (Custom) • Verifikacija",
    thumbnail: null,
    fields: [],
  },
  {
    name: "verify-success",
    title: "<:4558purplecheck:1504504889706020995> Verifikacija Uspješna!",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{user}** — Dobrodošao/la! <a:3599pinkheart:1504504866700132534>\n<:518169rolemodpurple:1496901673426096158> Verifikacija je prošla. Uživaj na serveru!\n<a:15072animatedarrowpink2:1496898801556914236> Dobio/la si ulogu: <@&{roleId}>",
    color: "#FF85C8",
    category: "Verifikacija",
    footer: "GIANNI (Custom) • Verifikacija",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "verify-fail",
    title: "<:994180roleadminred1:1496902197605306461> Verifikacija Neuspješna",
    description:
      "<:518169rolemodpurple:1496901673426096158> Verifikacija nije prošla. Pokušaj ponovo!\n<a:15072animatedarrowpink2:1496898801556914236> Ako imaš problema, kontaktiraj staff.",
    color: "#dc2626",
    category: "Verifikacija",
    footer: "GIANNI (Custom) • Verifikacija",
    thumbnail: null,
    fields: [],
  },

  // ─── ANKETE ──────────────────────────────────────────────────
  {
    name: "poll-create",
    title: "<:2084purplestar:1504504848375349388>  A N K E T A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:15072animatedarrowpink2:1496898801556914236> **{question}**\n━━━━━━━━━━━━━━━━━━━━━━\n<:1111pinkarrow:1496903118108229733> Glasaj koristeći reakcije ispod!",
    color: "#9B59B6",
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
    title: "<:79529shinycrown:1496899185516216400> Anketa — Rezultati",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:64382pinksparkles:1500259869259988033> **{question}**\n━━━━━━━━━━━━━━━━━━━━━━\n{resultsBar}",
    color: "#FF85C8",
    category: "Ankete",
    footer: "GIANNI (Custom) • Anketa završena • Ukupno glasova: {totalVotes}",
    thumbnail: null,
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Pobjednik",  value: "**{winner}** — `{winnerPercent}%`", inline: true },
      { name: "<:2261bell:1504505860720820395> Glasova",          value: "`{totalVotes}`",                   inline: true },
    ],
  },

  // ─── REACTION ROLES ──────────────────────────────────────────
  {
    name: "rr-panel",
    title: "<:2084purplestar:1504504848375349388>  U L O G E  —  Odaberi",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:15072animatedarrowpink2:1496898801556914236> Klikni na reakciju da dobiješ/skineš ulogu!\n━━━━━━━━━━━━━━━━━━━━━━\n{roleList}",
    color: "#9B59B6",
    category: "Reaction Roles",
    footer: "GIANNI (Custom) • Reaction Roles",
    thumbnail: null,
    fields: [],
  },
  {
    name: "rr-add",
    title: "<:4558purplecheck:1504504889706020995> Uloga Dodana",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{user}** — dobio/la si ulogu <@&{roleId}>! <a:3599pinkheart:1504504866700132534>",
    color: "#FF85C8",
    category: "Reaction Roles",
    footer: "GIANNI (Custom) • Reaction Roles",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "rr-remove",
    title: "<:617219rolemodpink:1496898535897956373> Uloga Skinuta",
    description:
      "<:518169rolemodpurple:1496901673426096158> **{user}** — uloga <@&{roleId}> je skinuta.",
    color: "#9B59B6",
    category: "Reaction Roles",
    footer: "GIANNI (Custom) • Reaction Roles",
    thumbnail: "{user.avatar}",
    fields: [],
  },

  // ─── REPORT ──────────────────────────────────────────────────
  {
    name: "report",
    title: "<:994180roleadminred1:1496902197605306461> Nova Prijava — Report",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━\n<a:15072animatedarrowpink2:1496898801556914236> **{reporter}** je prijavio/la **{target}**\n━━━━━━━━━━━━━━━━━━━━━━\n<:518169rolemodpurple:1496901673426096158> Razlog: **{reason}**",
    color: "#dc2626",
    category: "Admin",
    footer: "GIANNI (Custom) • Report Sistem",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:617219rolemodpink:1496898535897956373> Prijavio",  value: "{reporter}", inline: true },
      { name: "<:994180roleadminred1:1496902197605306461> Prijavljeni", value: "{target}", inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",              value: "{date}",     inline: true },
    ],
  },
  {
    name: "report-closed",
    title: "<:4558purplecheck:1504504889706020995> Report Zatvoren",
    description:
      "<a:64382pinksparkles:1500259869259988033> Report #**{id}** je zatvoren od strane **{mod}**.\n<:518169rolemodpurple:1496901673426096158> Akcija: **{action}**",
    color: "#9B59B6",
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
