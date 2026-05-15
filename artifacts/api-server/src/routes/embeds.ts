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
    title: "<:864113ownerpinkcrownwithheart:1496899493130539008>  Dobrodošao/la, {user}!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:64382pinksparkles:1500259869259988033> Drago nam je što si ovdje! <a:3599pinkheart:1504504866700132534>\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> Pogledaj kanale i upoznaj zajednicu!\n" +
      "<a:571294pinkpaw:1500259928936284211> **discord.gg/gian**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Dobrodošao/la!",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:518169rolemodpurple:1496901673426096158> Član #{count}", value: "Hvala što si nam se pridružio/la!", inline: false },
      { name: "<:2084purplestar:1504504848375349388> Registracija",       value: "{accountAge}",                    inline: true  },
      { name: "<a:44503lockkey:1500444008760217641> Pridružio/la se",     value: "{joinedAt}",                      inline: true  },
    ],
  },
  {
    name: "leave",
    title: "<a:15072animatedarrowpink2:1496898801556914236>  {user} je napustio/la server",
    description:
      "<:518169rolemodpurple:1496901673426096158> Žao nam je što si otišao/la. <a:3599pinkheart:1504504866700132534>\n" +
      "<a:571294pinkpaw:1500259928936284211> Uvijek si dobrodošao/la nazad!",
    color: "#9B59B6",
    category: "Sistem",
    footer: "GIANNI (Custom) • Do viđenja!",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Proveo/la na serveru", value: "{timeOnServer}", inline: true },
      { name: "<:33927diamond:1496898969052381407> Preostalo članova",      value: "`{memberCount}`", inline: true },
    ],
  },
  {
    name: "dm-welcome",
    title: "<a:64382pinksparkles:1500259869259988033>  Dobrodošao/la na GIAN, {user}!",
    description:
      "<a:3599pinkheart:1504504866700132534> Hvala ti što si se pridružio/la!\n\n" +
      "<:864113ownerpinkcrownwithheart:1496899493130539008> **discord.gg/gian**\n\n" +
      "<a:571294pinkpaw:1500259928936284211> Pročitaj pravila u kanalu `#pravila` i uživaj!\n" +
      "<:518169rolemodpurple:1496901673426096158> Za pomoć, pišite u `#podrška`.",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI (Custom) • Dobrodošao/la!",
    thumbnail: null,
    fields: [],
  },
  {
    name: "boost",
    title: "<a:793429sparkles:1496899433634201611>  BOOST — Hvala ti, {user}!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:864113ownerpinkcrownwithheart:1496899493130539008> **{user}** je boostao/la server!\n" +
      "<a:64382pinksparkles:1500259869259988033> Zahvaljujući tebi server raste!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI (Custom) • Server Boost",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Ukupno boostova",  value: "`{boostCount}`",     inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Nivo servera",    value: "Nivo `{serverLevel}`", inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> Nagrada",          value: "<@&{rewardRole}>",   inline: false },
    ],
  },
  {
    name: "birthday",
    title: "<a:236855heartpop:1496899299487907870>  Sretan Rođendan, {user}!",
    description:
      "<a:64382pinksparkles:1500259869259988033> Danas je poseban dan — **{user}** slavi **{years}. rođendan!**\n" +
      "<a:3599pinkheart:1504504866700132534> Svi čestitajmo! <a:793429sparkles:1496899433634201611>\n" +
      "<:864113ownerpinkcrownwithheart:1496899493130539008> Uži i neka ti je sretan dan!",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI (Custom) • Rođendan",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:529977coin:1500444133389635704> Poklon od bota", value: "`+{poklon}` 🪙",  inline: true },
      { name: "<:2084purplestar:1504504848375349388> Uloga dana",   value: "<@&{bdayRole}>", inline: true },
    ],
  },
  {
    name: "starboard",
    title: "<:2084purplestar:1504504848375349388>  Starboard — {stars} zvjezdica",
    description:
      "<a:64382pinksparkles:1500259869259988033> Popularna poruka od **{author}** je istaknuta!\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> [{previewText}]({jumpUrl})",
    color: "#f59e0b",
    category: "Sistem",
    footer: "GIANNI (Custom) • Starboard • #{channel}",
    thumbnail: null,
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Zvjezdica",       value: "`{stars}`",       inline: true  },
      { name: "<:32467lovetalk:1504505532323594321> Kanal",            value: "<#{channelId}>",  inline: true  },
      { name: "<a:15072animatedarrowpink2:1496898801556914236> Skoči", value: "[Idi na poruku]({jumpUrl})", inline: false },
    ],
  },
  {
    name: "aotw",
    title: "<:864113ownerpinkcrownwithheart:1496899493130539008>  Član Sedmice!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:64382pinksparkles:1500259869259988033> **{user}** je odabran/a za člana sedmice!\n" +
      "<a:793429sparkles:1496899433634201611> Svako glasanje je važilo — hvala svima!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF85C8",
    category: "Sistem",
    footer: "GIANNI (Custom) • Član Sedmice",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Pobjednik/ca", value: "{user}",         inline: true },
      { name: "<:2084purplestar:1504504848375349388> Glasova",       value: "`{votes}`",      inline: true },
      { name: "<a:529977coin:1500444133389635704> Nagrada",          value: "`+{nagrada}` 🪙", inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ SISTEM PANELI ━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "ticket",
    title: "<a:44503lockkey:1500444008760217641>  Podrška — Otvori Ticket",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:518169rolemodpurple:1496901673426096158> Trebaš pomoć? Klikni dugme ispod!\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> Staff će ti odgovoriti što prije.\n" +
      "<a:571294pinkpaw:1500259928936284211> Svaki ticket je privatan i siguran.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI (Custom) • Ticket Sistem",
    thumbnail: null,
    fields: [
      { name: "<:2261bell:1504505860720820395> Dostupnost",        value: "Uvijek otvoreni",   inline: true },
      { name: "<:4558purplecheck:1504504889706020995> Odgovor",    value: "Što brže moguće",   inline: true },
      { name: "<:33927diamond:1496898969052381407> Privatnost",    value: "Samo ti i staff",   inline: true },
    ],
  },
  {
    name: "ticket-otvoren",
    title: "<a:44503lockkey:1500444008760217641>  Ticket #{id} — Otvoren",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> Tvoj ticket je kreiran, **{user}**!\n" +
      "<:518169rolemodpurple:1496901673426096158> Opiši problem u detalje i staff će se javiti.\n" +
      "<a:571294pinkpaw:1500259928936284211> Budi strpljiv/a!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI (Custom) • Ticket #{id}",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Otvorio/la", value: "{user}",     inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",             value: "{date}",     inline: true },
      { name: "<:33927diamond:1496898969052381407> Kategorija",    value: "{category}", inline: true },
    ],
  },
  {
    name: "staff-prijava",
    title: "<:864113ownerpinkcrownwithheart:1496899493130539008>  Staff Prijava",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:64382pinksparkles:1500259869259988033> Zanimaju te staff pozicije na GIAN serveru?\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> Popuni formu klikom na dugme ispod!\n" +
      "<:518169rolemodpurple:1496901673426096158> Tražimo posvećene i aktivne članove.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI (Custom) • Staff Prijava",
    thumbnail: null,
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Min. aktivnost", value: "30 dana na serveru",  inline: true },
      { name: "<:4558purplecheck:1504504889706020995> Potrebno",      value: "Dobre komunikacije",  inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> Benefiti",       value: "Ekskluzivne uloge",   inline: true },
    ],
  },
  {
    name: "private-vc",
    title: "<a:44503lockkey:1500444008760217641>  Privatni Voice Kanal",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:518169rolemodpurple:1496901673426096158> Upravljaj svojim privatnim kanalom!\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> Koristi dugmad ispod za postavke.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI (Custom) • Privatni VC",
    thumbnail: null,
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Vlasnik",  value: "{owner}",   inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Korisnici", value: "`{count}`", inline: true },
      { name: "<:33927diamond:1496898969052381407> Limit",       value: "`{limit}`", inline: true },
    ],
  },
  {
    name: "voice-pravila",
    title: "<:518169rolemodpurple:1496901673426096158>  Voice Kanali — Pravila",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> **Uvažavaj ostale korisnike**\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> **Ne ometaj razgovor namjerno**\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> **Zabranjen je eksplicitni sadržaj**\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> **Ne snimai bez pristanka**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:864113ownerpinkcrownwithheart:1496899493130539008> Kršenje = mute / kick",
    color: "#a78bfa",
    category: "Sistem paneli",
    footer: "GIANNI (Custom) • Voice Pravila",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━ LOG ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "log-join",
    title: "<a:68523animatedarrowgreen:1496899143338033173>  Novi Član",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{user}** se pridružio/la serveru!\n" +
      "<:2261bell:1504505860720820395> Datum kreiranja računa: `{accountAge}`",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI (Custom) • Log • Join",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> ID",           value: "`{userId}`",     inline: true },
      { name: "<:2261bell:1504505860720820395> Pridružio/la",        value: "{joinedAt}",     inline: true },
      { name: "<:33927diamond:1496898969052381407> Ukupno članova",  value: "`{memberCount}`", inline: true },
    ],
  },
  {
    name: "log-edit",
    title: "<:32467lovetalk:1504505532323594321>  Poruka Izmijenjena",
    description:
      "<:518169rolemodpurple:1496901673426096158> **{user}** je izmijenio/la poruku u <#{channel}>.",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI (Custom) • Log • Edit",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:73288animatedarrowred:1496899179560304783> Stara poruka",      value: "```{before}```", inline: false },
      { name: "<a:68523animatedarrowgreen:1496899143338033173> Nova poruka",     value: "```{after}```",  inline: false },
      { name: "<:2261bell:1504505860720820395> Datum",                           value: "{date}",         inline: true  },
    ],
  },
  {
    name: "log-delete",
    title: "<a:73288animatedarrowred:1496899179560304783>  Poruka Obrisana",
    description:
      "<:994180roleadminred1:1496902197605306461> **{user}** je obrisao/la poruku u <#{channel}>.",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI (Custom) • Log • Delete",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:32467lovetalk:1504505532323594321> Sadržaj", value: "```{content}```", inline: false },
      { name: "<:33927diamond:1496898969052381407> Kanal",    value: "<#{channel}>",    inline: true  },
      { name: "<:2261bell:1504505860720820395> Datum",        value: "{date}",          inline: true  },
    ],
  },
  {
    name: "report",
    title: "<:shieldalert:1504850577237086248>  Nova Prijava",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:994180roleadminred1:1496902197605306461> Korisnik je prijavljen stafu!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:518169rolemodpurple:1496901673426096158> Razlog: **{reason}**",
    color: "#f59e0b",
    category: "Log",
    footer: "GIANNI (Custom) • Report",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:994180roleadminred1:1496902197605306461> Prijavljeni", value: "{target}",   inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Prijavio/la",      value: "{reporter}", inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",                  value: "{date}",     inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ MODERACIJA ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "warn",
    title: "<:shieldalert:1504850577237086248>  Upozorenje!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:73288animatedarrowred:1496899179560304783> **{target}** je dobio/la upozorenje!\n" +
      "<:994180roleadminred1:1496902197605306461> Razlog: **{reason}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:518169rolemodpurple:1496901673426096158> Ponavljanje prekršaja = ban.",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:994180roleadminred1:1496902197605306461> Moderator", value: "{mod}",              inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",                value: "{date}",             inline: true },
      { name: "<:36802redarrow:1504505542025154621> Warn #{n}",       value: "od max `{max}`",     inline: true },
    ],
  },
  {
    name: "ban",
    title: "<:hammer:1504852258779697192>  Član Banovan",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:73288animatedarrowred:1496899179560304783> **{target}** je banovan/a sa servera.\n" +
      "<:994180roleadminred1:1496902197605306461> Razlog: **{reason}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:994180roleadminred1:1496902197605306461> Izvršio",  value: "{mod}",      inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",               value: "{date}",     inline: true },
      { name: "<a:8055redcheck:1504505449062465597> Trajanje",       value: "{duration}", inline: true },
    ],
  },
  {
    name: "mod-kick",
    title: "<:userx:1504852293319655604>  Član Kickovan",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:73288animatedarrowred:1496899179560304783> **{target}** je kickovan/a sa servera.\n" +
      "<:994180roleadminred1:1496902197605306461> Razlog: **{reason}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:994180roleadminred1:1496902197605306461> Izvršio", value: "{mod}",  inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",              value: "{date}", inline: true },
    ],
  },
  {
    name: "mod-mute",
    title: "<:volumex:1504852298072064120>  Član Mutovan",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:73288animatedarrowred:1496899179560304783> **{target}** ne može slati poruke **{duration}**.\n" +
      "<:994180roleadminred1:1496902197605306461> Razlog: **{reason}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:994180roleadminred1:1496902197605306461> Izvršio", value: "{mod}",      inline: true },
      { name: "<:2261bell:1504505860720820395> Trajanje",           value: "{duration}", inline: true },
      { name: "<a:8055redcheck:1504505449062465597> Ističe",        value: "{expires}",  inline: true },
    ],
  },
  {
    name: "mod-unmute",
    title: "<:volumeup:1504852295416807534>  Član Odmutovan",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{target}** može ponovo slati poruke!\n" +
      "<:4558purplecheck:1504504889706020995> Mute je uklonjen od strane moderatora.",
    color: "#22c55e",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:994180roleadminred1:1496902197605306461> Izvršio", value: "{mod}",  inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",              value: "{date}", inline: true },
    ],
  },
  {
    name: "mod-timeout",
    title: "<:clockx:1504852248683876433>  Timeout",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:73288animatedarrowred:1496899179560304783> **{target}** je u timeoutu na **{duration}**.\n" +
      "<:994180roleadminred1:1496902197605306461> Razlog: **{reason}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:994180roleadminred1:1496902197605306461> Izvršio", value: "{mod}",      inline: true },
      { name: "<:2261bell:1504505860720820395> Trajanje",           value: "{duration}", inline: true },
      { name: "<a:8055redcheck:1504505449062465597> Ističe",        value: "{expires}",  inline: true },
    ],
  },
  {
    name: "mod-purge",
    title: "<:trash2:1504852288567640146>  Poruke Obrisane",
    description:
      "<a:73288animatedarrowred:1496899179560304783> Obrisano **{count}** poruka u <#{channel}>.\n" +
      "<:994180roleadminred1:1496902197605306461> Izvršio: **{mod}**",
    color: "#ef4444",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Purge",
    thumbnail: null,
    fields: [
      { name: "<:33927diamond:1496898969052381407> Obrisano", value: "`{count}` poruka", inline: true },
      { name: "<:2261bell:1504505860720820395> Kanal",        value: "<#{channel}>",     inline: true },
    ],
  },
  {
    name: "mod-unban",
    title: "<:badgecheck:1504852240404320356>  Član Odbanovan",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{target}** je odbanovan/a sa servera.\n" +
      "<:4558purplecheck:1504504889706020995> Može se ponovo pridružiti serveru.",
    color: "#22c55e",
    category: "Moderacija",
    footer: "GIANNI (Custom) • Moderacija",
    thumbnail: null,
    fields: [
      { name: "<:994180roleadminred1:1496902197605306461> Izvršio", value: "{mod}",  inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",              value: "{date}", inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ XP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "levelup",
    title: "<a:793429sparkles:1496899433634201611>  Level Up!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:64382pinksparkles:1500259869259988033> **{user}** je dostigao/la nivo **{level}**!\n" +
      "<a:3599pinkheart:1504504866700132534> Nastavi biti aktivan/na!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • XP Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Novi nivo",      value: "`{level}`",      inline: true },
      { name: "<:367280roleadmingreen:1496898579720044706> Ukupno XP", value: "`{xp}`",        inline: true },
      { name: "<a:529977coin:1500444133389635704> Nagrada",           value: "`+{reward}` 🪙", inline: true },
    ],
  },
  {
    name: "vatrica-nova",
    title: "<a:VATRICE:1496898836155596962>  Nova Vatrica!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:64382pinksparkles:1500259869259988033> **{user}** je zaslužio/la novu vatricu!\n" +
      "<a:vatrice1:1500466044429664256><a:vatrice2:1500466048418185246><a:vatrice3:1500466039782113352> Ukupno vatrica: **{count}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • Vatrice",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:VATRICE:1496898836155596962> Vatrice",               value: "`{count}`",    inline: true },
      { name: "<:367280roleadmingreen:1496898579720044706> Poruka",    value: "`{messages}`", inline: true },
    ],
  },
  {
    name: "aktivnost",
    title: "<:barchart:1504852242233032865>  Aktivnost — Podsjetnik",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> **{user}**, nisi bio/la aktivan/na neko vrijeme!\n" +
      "<a:571294pinkpaw:1500259928936284211> Chati, igraj igre i prikupljaj XP!",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • XP Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:2261bell:1504505860720820395> Neaktivan/na", value: "{inactive}", inline: true },
      { name: "<:2084purplestar:1504504848375349388> XP",     value: "`{xp}`",    inline: true },
    ],
  },
  {
    name: "rank",
    title: "<:2084purplestar:1504504848375349388>  Rang — {user}",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> Tvoj trenutni rang i XP statistika:",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • XP Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Rang",           value: "`#{rank}`",         inline: true },
      { name: "<:2084purplestar:1504504848375349388> Nivo",            value: "`{level}`",         inline: true },
      { name: "<:367280roleadmingreen:1496898579720044706> XP",        value: "`{xp} / {nextXp}`", inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Progres",         value: "`{progressBar}`",   inline: false },
    ],
  },
  {
    name: "leaderboard-xp",
    title: "<:79529shinycrown:1496899185516216400>  Top Lista — XP",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:864113ownerpinkcrownwithheart:1496899493130539008> **{top1}** — Nivo `{top1lvl}` · `{top1xp}` XP\n" +
      "<:2084purplestar:1504504848375349388> **{top2}** — Nivo `{top2lvl}` · `{top2xp}` XP\n" +
      "<:4558purplecheck:1504504889706020995> **{top3}** — Nivo `{top3lvl}` · `{top3xp}` XP\n" +
      "<:984706roleadminorange1:1496898583239200819> **{top4}** — Nivo `{top4lvl}` · `{top4xp}` XP\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> **{top5}** — Nivo `{top5lvl}` · `{top5xp}` XP\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:367280roleadmingreen:1496898579720044706> Tvoje mjesto: **#{myRank}**",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • XP Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "leaderboard-novac",
    title: "<:79529shinycrown:1496899185516216400>  Top Lista — Novac",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:864113ownerpinkcrownwithheart:1496899493130539008> **{top1}** — `{top1coins}` <a:529977coin:1500444133389635704>\n" +
      "<:2084purplestar:1504504848375349388> **{top2}** — `{top2coins}` <a:529977coin:1500444133389635704>\n" +
      "<:4558purplecheck:1504504889706020995> **{top3}** — `{top3coins}` <a:529977coin:1500444133389635704>\n" +
      "<:984706roleadminorange1:1496898583239200819> **{top4}** — `{top4coins}` <a:529977coin:1500444133389635704>\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> **{top5}** — `{top5coins}` <a:529977coin:1500444133389635704>\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:529977coin:1500444133389635704> Tvoje mjesto: **#{myRank}** · `{myCoins}` 🪙",
    color: "#22c55e",
    category: "XP",
    footer: "GIANNI (Custom) • Novac Top Lista",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ EKONOMIJA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "heist",
    title: "<:briefcase:1504852244225462303>  RAZBOJ — U Pripremi!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:44503lockkey:1500444008760217641> **{user}** organizuje razboj!\n" +
      "<a:28079animatedarroworange:1496898931790057472> Klikni **Pridruži se** i osvoji nagradu!\n" +
      "<:984706roleadminorange1:1496898583239200819> Potrebno **3 ili više** učesnika.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:2261bell:1504505860720820395> Kreće za **30 sekundi!**",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Učesnici",  value: "`{count}/10`",             inline: true },
      { name: "<a:529977coin:1500444133389635704> Ciljna suma",  value: "`{target}` 🪙",            inline: true },
      { name: "<:36802redarrow:1504505542025154621> Rizik",      value: "`{risk}%` šansa propasti", inline: true },
    ],
  },
  {
    name: "lottery",
    title: "<a:giveaways:1500195717187244232>  Sedmična Loto",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:giveaways5:1500203902446997586> Kupi tiket i osvoji **JACKPOT!**\n" +
      "<a:529977coin:1500444133389635704> Svaki tiket košta **100 coina**.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • /lottery buy",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Jackpot",           value: "`{pot}` 🪙",        inline: true },
      { name: "<a:ticket:1500196243853541397> Moji tiketi",           value: "`{my}` / `{total}`", inline: true },
      { name: "<a:793429sparkles:1496899433634201611> Šansa pobjede", value: "`{chance}%`",        inline: true },
      { name: "<:2261bell:1504505860720820395> Sljedeći žrijeb",      value: "{nextDraw}",         inline: false },
    ],
  },
  {
    name: "quests",
    title: "<:checkcircle:1504852246809149450>  Dnevni Zadaci",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:28079animatedarroworange:1496898931790057472> Završi zadatke i osvoji nagrade!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:268961empty:1496899316596605142> **Pošalji 10 poruka**\n`░░░░░░░░░░` `0/10` · <a:529977coin:1500444133389635704> `+200`\n\n" +
      "<:4558purplecheck:1504504889706020995> **Odigraj 3 igre**\n`██████████` `3/3` · <a:529977coin:1500444133389635704> `+500` ✅\n\n" +
      "<:984706roleadminorange1:1496898583239200819> **Pošalji kompliment**\n`░░░░░░░░░░` `0/1` · <a:529977coin:1500444133389635704> `+300`",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Resetuju se u ponoć UTC",
    thumbnail: null,
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Završeno", value: "`{done}/3`",    inline: true },
      { name: "<a:529977coin:1500444133389635704> Zarađeno",     value: "`{ukupno}` 🪙", inline: true },
      { name: "<:2261bell:1504505860720820395> Reset",           value: "Sutra 00:00",   inline: true },
    ],
  },
  {
    name: "giveaway",
    title: "<a:giveaways:1500195717187244232>  NAGRADNA IGRA!",
    description:
      "## <:864113ownerpinkcrownwithheart:1496899493130539008>  {nagrada}\n\n" +
      "<a:64382pinksparkles:1500259869259988033> Klikni **Učestvuj** i osvoji nagradu!\n" +
      "<a:3599pinkheart:1504504866700132534> Sretno svima!",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Giveaway",
    thumbnail: null,
    fields: [
      { name: "<:2261bell:1504505860720820395> Završava",           value: "{kraj}",       inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Učesnici",     value: "`{ucesnici}`", inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Pobjednika",  value: "`{count}`",    inline: true },
      { name: "<a:ticket:1500196243853541397> Domaćin",             value: "{domaćin}",   inline: false },
    ],
  },
  {
    name: "giveaway-end",
    title: "<:award:1504852238688977176>  Nagradna Igra — ZAVRŠENA!",
    description:
      "## <a:3599pinkheart:1504504866700132534>  {nagrada}\n\n" +
      "<a:64382pinksparkles:1500259869259988033> Čestitamo pobjedniku! <a:793429sparkles:1496899433634201611>",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Giveaway završen",
    thumbnail: null,
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Pobjednik/ca", value: "{pobjednik}",  inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Učesnici",      value: "`{ucesnici}`", inline: true },
      { name: "<a:ticket:1500196243853541397> Domaćin",              value: "{domaćin}",   inline: true },
    ],
  },
  {
    name: "eco-balance",
    title: "<:wallet:1504852300030673027>  Novčanik — {user}",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:529977coin:1500444133389635704> Pregled tvog financijskog stanja:\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:529977coin:1500444133389635704> Gotovina",      value: "`{cash}` 🪙",  inline: true },
      { name: "<:33927diamond:1496898969052381407> Banka",        value: "`{bank}` 🪙",  inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Ukupno",    value: "`{total}` 🪙", inline: true },
    ],
  },
  {
    name: "eco-daily",
    title: "<:coins:1504852251053658227>  Dnevna Nagrada",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:64382pinksparkles:1500259869259988033> **{user}** je preuzeo/la dnevnu nagradu!\n" +
      "<a:3599pinkheart:1504504866700132534> Streak: **{streak} dana** zaredom!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Sutra možeš ponovo",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:529977coin:1500444133389635704> Nagrada",         value: "`+{amount}` 🪙",     inline: true },
      { name: "<:2084purplestar:1504504848375349388> Streak bonus", value: "`+{bonus}` 🪙",      inline: true },
      { name: "<:33927diamond:1496898969052381407> Novi balans",    value: "`{total}` 🪙",       inline: true },
    ],
  },
  {
    name: "eco-work",
    title: "<:briefcase:1504852244225462303>  Posao — {job}",
    description:
      "<a:28079animatedarroworange:1496898931790057472> **{user}** je radio/la kao **{job}**!\n" +
      "<a:529977coin:1500444133389635704> Zaradio/la: **{amount}** kovanica!",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Sljedeći posao za {cooldown}",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Zarada",  value: "`+{amount}` 🪙", inline: true },
      { name: "<:33927diamond:1496898969052381407> Balans", value: "`{total}` 🪙",   inline: true },
    ],
  },
  {
    name: "eco-shop",
    title: "<:shoppingcart:1504852275628081283>  S H O P — Prodavnica",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:28079animatedarroworange:1496898931790057472> Dobrodošao/la u GIAN prodavnicu!\n" +
      "<a:529977coin:1500444133389635704> Kupi role, iteme i privilegije.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Shop",
    thumbnail: null,
    fields: [
      { name: "<:984706roleadminorange1:1496898583239200819> VIP Role",              value: "`5.000` 🪙",  inline: true },
      { name: "<:864113ownerpinkcrownwithheart:1496899493130539008> Premium",        value: "`10.000` 🪙", inline: true },
      { name: "<:33927diamond:1496898969052381407> Dijamant",                        value: "`25.000` 🪙", inline: true },
    ],
  },
  {
    name: "eco-buy",
    title: "<:shoppingcart:1504852275628081283>  Kupovina Uspješna!",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{user}** je kupio/la **{item}**!\n" +
      "<a:3599pinkheart:1504504866700132534> Uživaj u kupovini!",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Shop",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<a:529977coin:1500444133389635704> Plaćeno",   value: "`-{price}` 🪙",   inline: true },
      { name: "<:33927diamond:1496898969052381407> Ostalo",   value: "`{balance}` 🪙",  inline: true },
    ],
  },
  {
    name: "eco-transfer",
    title: "<:moneybag:1504852270561362010>  Transfer Kovanica",
    description:
      "<a:529977coin:1500444133389635704> **{from}** je poslao/la **{amount}** 🪙 → **{to}**\n" +
      "<:4558purplecheck:1504504889706020995> Transfer uspješno izvršen!",
    color: "#f97316",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Iznos",                         value: "`{amount}` 🪙", inline: true },
      { name: "<:984706roleadminorange1:1496898583239200819> Pošiljalac",         value: "{from}",        inline: true },
      { name: "<a:15072animatedarrowpink2:1496898801556914236> Primalac",         value: "{to}",          inline: true },
    ],
  },
  {
    name: "eco-rob",
    title: "<:moneybag:1504852270561362010>  Pljačka!",
    description:
      "<a:28079animatedarroworange:1496898931790057472> **{user}** je pokušao/la opljačkati **{target}**!\n" +
      "{result}",
    color: "#ef4444",
    category: "Ekonomija",
    footer: "GIANNI (Custom) • Ekonomija",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Ukradeno", value: "`{stolen}` 🪙", inline: true },
      { name: "<:36802redarrow:1504505542025154621> Kazna",  value: "`{fine}` 🪙",   inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━ IGRE — NE DIRATI! ━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "slots",
    title: "<:gamepad:1504850554113884240> S L O T  M A Š I N A",
    description: "𓉘  <:58390neoncherry:1496902029363249212>  │  <:58390neoncherry:1496902029363249212>  │  <:58390neoncherry:1496902029363249212>  𓉝\n\n<a:giveaways5:1500203902446997586> Sva tri ista — **JACKPOT!**",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom)",
    thumbnail: null,
    fields: [
      { name: "<a:529977coin:1500444133389635704> Ulog",    value: "`{ulog} <a:529977coin:1500444133389635704>`",                                              inline: true },
      { name: "<:479765rolemodblue:1496901403669565580> Rezultat", value: "<a:giveaways5:1500203902446997586> **+{dobitak} <a:529977coin:1500444133389635704>** *(×3)*", inline: true },
      { name: "<a:44503lockkey:1500444008760217641> Balans", value: "`{balans} <a:529977coin:1500444133389635704>`",                                          inline: true },
    ],
  },
  {
    name: "blackjack",
    title: "<:gamepad:1504850554113884240> Blackjack",
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
    title: "<:gamepad:1504850554113884240> POKER — Texas Hold'em",
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
    title: "<:gamepad:1504850554113884240> Pre-Flop — Kartice podijeljene",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n<:8891bluestar:1504507192038916187> **Zajedničke kartice:**\n`?` `?` `?` `?` `?`\n<a:529977coin:1500444133389635704> **Pot:** `{pot} <a:529977coin:1500444133389635704>`\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:571294pinkpaw:1500259928936284211> **Aktivni:**\n<:428758neonverifiedcheck:1496898532559421571> **{player1}**\n<:428758neonverifiedcheck:1496898532559421571> **{player2}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:44503lockkey:1500444008760217641> **Čekamo potez:**\n<:479765rolemodblue:1496901403669565580> {player1}",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • Klikni 'Vidi kartice' za svoju ruku",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poker-showdown",
    title: "<:crown:1504850546849349803> SHOWDOWN — Poker",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n<:8891bluestar:1504507192038916187> **Zajedničke kartice:**\n🂡 🂺 🂳 🃈 🃑\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<:79529shinycrown:1496899185516216400> **{winner}**\n   Ruka: 🂡 🂮\n   → **Royal Flush**\n\n<:479765rolemodblue:1496901403669565580> **{loser}**\n   Ruka: 🃁 🃎\n   → **Dva Para**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n<a:529977coin:1500444133389635704> **Dobitak:** `{dobitak} <a:529977coin:1500444133389635704>` po pobjedniku",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Poker završen",
    thumbnail: null,
    fields: [],
  },
  {
    name: "among-us-lobby",
    title: "<:gamepad:1504850554113884240> Among Us — Lobby",
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
    title: "<:gamepad:1504850554113884240> Among Us — U Toku",
    description: null,
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Among Us",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Igrači",          value: "<:994180roleadminred1:1496902197605306461> Player1\n<:11309roleadminblue2:1496898576150954165> Player2\n<a:44503lockkey:1500444008760217641> ~~Player3~~", inline: false },
      { name: "<:428758neonverifiedcheck:1496898532559421571> Zadaci", value: "<:479765rolemodblue:1496901403669565580><:479765rolemodblue:1496901403669565580><:479765rolemodblue:1496901403669565580><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142><:268961empty:1496899316596605142> `3/10`", inline: true },
      { name: "<:479765rolemodblue:1496901403669565580> Živi",         value: "2 crew | 1 imp", inline: true },
    ],
  },
  {
    name: "among-us-end",
    title: "<:award:1504852238688977176> CREWMATI POBIJEDE!",
    description: "Svi impostori eliminirani! <:428758neonverifiedcheck:1496898532559421571>",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • Among Us",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Otkrivene uloge", value: "<:479765rolemodblue:1496901403669565580> **Player1** — CREWMATE\n<a:44503lockkey:1500444008760217641> **Player2** — IMPOSTOR", inline: false },
    ],
  },
  {
    name: "kaladont-start",
    title: "<:gamepad:1504850554113884240> K A L A D O N T",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<a:64382pinksparkles:1500259869259988033> Igra je počela! Prva riječ:\n## <:32467lovetalk:1504505532323594321>  **BALKAN**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "Pokrenuo/la: {user}  •  Pritisni dugme za kraj",
    thumbnail: null,
    fields: [
      { name: "<a:91490animatedarrowblue:1496899222023176233>  Sljedeća počinje sa", value: "## **`AN`**",                                                 inline: true  },
      { name: "<:479765rolemodblue:1496901403669565580>  Težina",                   value: "<:8891bluestar:1504507192038916187> Normalno · 2 slova",       inline: true  },
      { name: "<:8526link:1504505939917803620>  Niz",                               value: "**#1**",                                                       inline: true  },
      {
        name: "<:70920bluearrow:1504507388386869280>  Pravila igre",
        value:
          "<:428758neonverifiedcheck:1496898532559421571> Svaka riječ počinje traženim slovima\n<a:44503lockkey:1500444008760217641> Ista osoba **ne može** igrati iza sebe\n<a:91490animatedarrowblue:1496899222023176233> Ponavljanje iste riječi nije dozvoljeno\n<a:64382pinksparkles:1500259869259988033> **50/50 sudbina** — čak i ispravna može propasti!\n<:70920bluearrow:1504507388386869280> Pritisni **Pomoć** za primjer riječi\n<:79529shinycrown:1496899185516216400> Upiši **`KALADONT`** i osvoji **1500** <a:529977coin:1500444133389635704>!",
        inline: false,
      },
    ],
  },
  {
    name: "kaladont-active",
    title: "<:gamepad:1504850554113884240> K A L A D O N T  —  aktivna igra",
    description: "━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "Pritisni dugme za kraj igre",
    thumbnail: null,
    fields: [
      { name: "<a:64382pinksparkles:1500259869259988033>  Zadnja riječ",        value: "**`ANKETA`**", inline: true  },
      { name: "<:32467lovetalk:1504505532323594321>  Odigrao/la",               value: "Korisnik",     inline: true  },
      { name: "<:8526link:1504505939917803620>  Niz",                           value: "**#5**",       inline: true  },
      { name: "<a:91490animatedarrowblue:1496899222023176233>  Sljedeća počinje sa", value: "## **`TA`**", inline: false },
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
      { name: "<a:91490animatedarrowblue:1496899222023176233>  Sljedeća počinje sa", value: "## **`KA`**", inline: true },
      { name: "<:8526link:1504505939917803620>  Niz",                               value: "**#6**",      inline: true },
    ],
  },
  {
    name: "kaladont-win",
    title: "<:crown:1504850546849349803> K A L A D O N T  —  P O B J E D A !",
    description: "<a:giveaways5:1500203902446997586> {user} je izrekao/la magičnu riječ!",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • Kaladont pobjeda",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400>  Pobjednik/ca", value: "**{user}**",                                    inline: true },
      { name: "<:8891bluestar:1504507192038916187>  Riječi u nizu",  value: "**{count}**",                                   inline: true },
      { name: "<a:529977coin:1500444133389635704>  Nagrada",         value: "**+1.500 <a:529977coin:1500444133389635704>**", inline: true },
      { name: "<a:505993sparkle1:1496899369939636295>  XP",          value: "**+200**",                                      inline: true },
    ],
  },
  {
    name: "bingo",
    title: "<:gamepad:1504850554113884240> B  I  N  G  O",
    description:
      "<:70920bluearrow:1504507388386869280> **Klikni dugme ispod i unesi 5 brojeva (1–75)!**\n<a:ticket:1500196243853541397> Tiket košta samo **500 coina** <a:529977coin:1500444133389635704>\n\n<a:44503lockkey:1500444008760217641> Imaš **2 minute** za tiket!\n<a:64382pinksparkles:1500259869259988033> Rezultati se objavljuju **javno** za sve",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI Bingo • Cijena tiketa: 500 coina",
    thumbnail: null,
    fields: [
      {
        name: "<:79529shinycrown:1496899185516216400>  Nagradna lista",
        value:
          "<:428758neonverifiedcheck:1496898532559421571> `2 pogotka`  ──  **10.000** <a:529977coin:1500444133389635704>\n<:479765rolemodblue:1496901403669565580> `3 pogotka`  ──  **30.000** <a:529977coin:1500444133389635704>\n<:8891bluestar:1504507192038916187> `4 pogotka`  ──  **75.000** <a:529977coin:1500444133389635704>\n<:79529shinycrown:1496899185516216400> `5 pogodaka` ── **250.000** <a:529977coin:1500444133389635704>  **JACKPOT!**",
        inline: false,
      },
    ],
  },
  // Igre dopune
  {
    name: "vjasala",
    title: "<:gamepad:1504850554113884240> V J E Š A L A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:479765rolemodblue:1496901403669565580> Pogodi skrivenu riječ!\n\n```\n_ _ _ _ _ _\n```\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /vjasala",
    thumbnail: null,
    fields: [
      { name: "<a:3599pinkheart:1504504866700132534> Životi",         value: "`{zivoti}/6`",  inline: true },
      { name: "<:32467lovetalk:1504505532323594321> Pogođena slova", value: "`{pogodjena}`", inline: true },
      { name: "<a:44503lockkey:1500444008760217641> Promašaji",      value: "`{promasaji}`", inline: true },
    ],
  },
  {
    name: "vjasala-kraj",
    title: "<:crown:1504850546849349803> Vješala — Pogodak!",
    description: "<:428758neonverifiedcheck:1496898532559421571> Čestitamo {user}! Pogodio/la si **{rijec}**! <a:64382pinksparkles:1500259869259988033>\n<a:529977coin:1500444133389635704> **Nagrada:** `+{nagrada} <a:529977coin:1500444133389635704>`",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • /vjasala",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "toplo-hladno",
    title: "<:gamepad:1504850554113884240> T O P L O  •  H L A D N O",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:8891bluestar:1504507192038916187> Pogodi tajni broj (1–{max})!\n\n<:479765rolemodblue:1496901403669565580> **Hladno** — daleko si\n<:479765rolemodblue:1496901403669565580> **Toplo** — bliže si\n<a:3599pinkheart:1504504866700132534> **Vrelo** — skoro!\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /toplo-hladno",
    thumbnail: null,
    fields: [
      { name: "<:8891bluestar:1504507192038916187> Maksimum",       value: "`{max}`",      inline: true },
      { name: "<:479765rolemodblue:1496901403669565580> Pokušaji",  value: "`{pokusaji}`", inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> Status",       value: "{status}",     inline: true },
    ],
  },
  {
    name: "kviz",
    title: "<:gamepad:1504850554113884240> K V I Z  —  Balkan Pitanje",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:70920bluearrow:1504507388386869280> **{pitanje}**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /kviz • Oklada: {oklada} <a:529977coin:1500444133389635704>",
    thumbnail: null,
    fields: [
      { name: "<:479765rolemodblue:1496901403669565580> A",  value: "{a}", inline: true },
      { name: "<:479765rolemodblue:1496901403669565580> B",  value: "{b}", inline: true },
      { name: "<:8891bluestar:1504507192038916187> C",       value: "{c}", inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> D",     value: "{d}", inline: true },
    ],
  },
  {
    name: "geografija",
    title: "<:globe:1504850556311834825> G E O G R A F I J A  —  Kviz",
    description:
      "━━━━━━━━━━━━━━━━━━━━━\n<:479765rolemodblue:1496901403669565580> **{pitanje}**\n━━━━━━━━━━━━━━━━━━━━━",
    color: "#9B59B6",
    category: "Igre",
    footer: "GIANNI (Custom) • /geografija • Oklada: {oklada} <a:529977coin:1500444133389635704>",
    thumbnail: null,
    fields: [
      { name: "<:479765rolemodblue:1496901403669565580> A",  value: "{a}", inline: true },
      { name: "<:479765rolemodblue:1496901403669565580> B",  value: "{b}", inline: true },
      { name: "<:8891bluestar:1504507192038916187> C",       value: "{c}", inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> D",     value: "{d}", inline: true },
    ],
  },
  {
    name: "mafia-lobby",
    title: "<:gamepad:1504850554113884240> M A F I A  —  Lobby",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━\n<a:64382pinksparkles:1500259869259988033> Mafia igra se priprema!\n**Pridruži se klikom na dugme.**\n━━━━━━━━━━━━━━━━━━━━━━━\n<:479765rolemodblue:1496901403669565580> Min: **5** | Max: **12** igrača\n<a:44503lockkey:1500444008760217641> Igra kreće automatski za **60s** ili kad host klikne Start",
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
    title: "<:crown:1504850546849349803> M A F I A  —  Kraj Igre",
    description: "## {rezultat}\n\n{opis}",
    color: "#FF85C8",
    category: "Igre",
    footer: "GIANNI (Custom) • Mafia završena",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Uloge",       value: "{uloge}",      inline: false },
      { name: "<:79529shinycrown:1496899185516216400> Pobjednici",  value: "{pobjednici}", inline: true  },
      { name: "<a:44503lockkey:1500444008760217641> Eliminirani",   value: "{eliminirani}", inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━ FUN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "hunt",
    title: "<a:874347butterfly:1496899500160192562>  Ulov!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "## {animal}\n" +
      "<:2084purplestar:1504504848375349388> **{rarity}**  ·  <:33927diamond:1496898969052381407> Snaga: `{power}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • {user} • /hunt",
    thumbnail: null,
    fields: [
      { name: "<a:64382pinksparkles:1500259869259988033> Imaš ukupno", value: "`1× {animal}`", inline: true },
      { name: "<a:529977coin:1500444133389635704> Vrijednost",          value: "`{value}` 🪙",  inline: true },
    ],
  },
  {
    name: "zoo",
    title: "<:globe:1504850556311834825>  {user} — Moj Zoo",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:505993sparkle1:1496899369939636295> **Legendary**\n<:2084purplestar:1504504848375349388> **Zmaj** `×1`\n\n" +
      "<:4558purplecheck:1504504889706020995> **Uncommon**\n<a:874347butterfly:1496899500160192562> **Vuk** `×3` · **Lisica** `×2`\n\n" +
      "<:518169rolemodpurple:1496901673426096158> **Common**\n<a:571294pinkpaw:1500259928936284211> **Riba** `×7` · **Zec** `×5`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • /hunt za loviti!",
    thumbnail: null,
    fields: [
      { name: "<a:64382pinksparkles:1500259869259988033> Ukupno životinja", value: "`{total}`",   inline: true },
      { name: "<:33927diamond:1496898969052381407> Ukupna snaga",           value: "`{power}`",   inline: true },
      { name: "<a:529977coin:1500444133389635704> Ukupna vrijednost",       value: "`{value}` 🪙", inline: true },
    ],
  },
  {
    name: "battle",
    title: "<:zap:1504850589815930950>  B I T K A!",
    description:
      "<a:571294pinkpaw:1500259928936284211> **{player1}** ⚔️ <:518169rolemodpurple:1496901673426096158> **{player2}**\n" +
      "`████████████░░░░░░░░`\n" +
      "<:33927diamond:1496898969052381407> `{score1}` vs `{score2}` <:33927diamond:1496898969052381407>",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Battle",
    thumbnail: "{winner.avatar}",
    fields: [
      { name: "<:79529shinycrown:1496899185516216400> Pobjednik/ca", value: "**{winner}**",  inline: true  },
      { name: "<a:44503lockkey:1500444008760217641> Poražen/a",      value: "{loser}",       inline: true  },
      { name: "<a:529977coin:1500444133389635704> Nagrada",          value: "`+{nagrada}` 🪙", inline: false },
    ],
  },
  {
    name: "pray",
    title: "<a:64382pinksparkles:1500259869259988033>  Molitva",
    description:
      "<a:3599pinkheart:1504504866700132534> **{user}** moli se za **{target}**!\n" +
      "<a:793429sparkles:1496899433634201611> Nebo čuje — **+{bonus}** <a:529977coin:1500444133389635704> palo s neba! <a:giveaways5:1500203902446997586>",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Molitva",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vers",
    title: "<a:music2:1500459145382592602>  Vers — Drop the Mic",
    description:
      "> <a:music2:1500459145382592602>\n" +
      "> *Ovo je primjer versa koji korisnik pošalje*\n" +
      "> *Svaki red je jedan stih*\n" +
      "> <a:80401musicalhearts:1500444022622130196>",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • vers • drop the mic",
    thumbnail: null,
    fields: [
      { name: "<a:music2:1500459145382592602> Izvođač",              value: "{user}",        inline: true },
      { name: "<a:64382pinksparkles:1500259869259988033> Reakcije",  value: "`{reactions}`", inline: true },
    ],
  },
  {
    name: "kompli",
    title: "<a:124071redrose:1496899261651226766>  Kompliment",
    description:
      "<a:3599pinkheart:1504504866700132534> **{from}** kaže **{to}**:\n" +
      "*„Ti si razlog zašto dan počinje sa osmijehom."* <a:64382pinksparkles:1500259869259988033>",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Kompliment",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "fora",
    title: "<a:568481annoyedgojo:1496899399077330994>  Fora",
    description:
      "<a:24420sleepyhellokitty:1496898915176415413> **{from}** je pogledao/la **{to}** i shvatio/la:\n" +
      "*„Brate/sestro, ti si dokaz da evolucija nije uvijek napredak."* <a:568481annoyedgojo:1496899399077330994>",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Sve u šali!",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "muv",
    title: "<a:64382pinksparkles:1500259869259988033>  Muvanje",
    description:
      "<a:24420sleepyhellokitty:1496898915176415413> **{from}** → **{to}**:\n" +
      "*„Jesi li ti WiFi? Jer osjećam konekciju između nas."* <a:64382pinksparkles:1500259869259988033>",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Balkan Muvanje",
    thumbnail: "{to.avatar}",
    fields: [],
  },
  {
    name: "crush",
    title: "<a:3599pinkheart:1504504866700132534>  Tajni Crush",
    description:
      "<a:793429sparkles:1496899433634201611> Po zvijezdama i kafanskim računima...\n" +
      "<:864113ownerpinkcrownwithheart:1496899493130539008> Tvoj tajni crush je... **{crush}**! <a:568481annoyedgojo:1496899399077330994>",
    color: "#ec4899",
    category: "Fun",
    footer: "GIANNI (Custom) • Fun",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ LJUBAVNE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "zagrljaj",
    title: "<a:zagrljaj:1500203677917511741>  Zagrljaj",
    description:
      "<a:571294pinkpaw:1500259928936284211> **{from}** grli **{to}**!\n" +
      "<a:64382pinksparkles:1500259869259988033> Aww, tako slatko! <a:3599pinkheart:1504504866700132534>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poljubac",
    title: "<a:poljubac:1500203685450617032>  Poljubac",
    description:
      "<a:3599pinkheart:1504504866700132534> **{from}** šalje poljubac **{to}**!\n" +
      "<a:924343love:1500058006308519936> Aww! <a:64382pinksparkles:1500259869259988033>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "mazi",
    title: "<a:mazi:1500203682199896245>  Mazanje",
    description:
      "<a:3599pinkheart:1504504866700132534> **{from}** mazi **{to}** nježno!\n" +
      "<a:64382pinksparkles:1500259869259988033> Previše slatkoga! <a:924343love:1500058006308519936>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "tapsi",
    title: "<a:571294pinkpaw:1500259928936284211>  Tapšanje",
    description:
      "<a:571294pinkpaw:1500259928936284211> **{from}** tapše **{to}** prijateljski!\n" +
      "<a:924343love:1500058006308519936> Baš simpatično! <a:64382pinksparkles:1500259869259988033>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "high5",
    title: "<a:236855heartpop:1496899299487907870>  High Five!",
    description:
      "<a:236855heartpop:1496899299487907870> **{from}** daje peticu **{to}**!\n" +
      "<a:571294pinkpaw:1500259928936284211> HIGH FIVE! <a:64382pinksparkles:1500259869259988033>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "cudan",
    title: "<a:568481annoyedgojo:1496899399077330994>  Čudno Ponašanje",
    description:
      "<a:568481annoyedgojo:1496899399077330994> **{from}** se čudno ponaša prema **{to}**!\n" +
      "<a:24420sleepyhellokitty:1496898915176415413> Ajde brate/sestro, malo normalnije! <a:568481annoyedgojo:1496899399077330994>",
    color: "#e879f9",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "srce",
    title: "<a:srce:1500197728267927734>  Srce",
    description:
      "<a:srce:1500197728267927734> **{from}** šalje srce **{to}**!\n" +
      "<a:3599pinkheart:1504504866700132534> Aww! <a:924343love:1500058006308519936> <a:64382pinksparkles:1500259869259988033>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },
  {
    name: "brak",
    title: "<a:924343love:1500058006308519936>  Prijedlog Braka!",
    description:
      "<:33927diamond:1496898969052381407> **{from}** je zaprosio/la **{to}**!\n" +
      "<a:3599pinkheart:1504504866700132534> Hoćeš li? <a:64382pinksparkles:1500259869259988033> <a:924343love:1500058006308519936>",
    color: "#FF85C8",
    category: "Ljubavne",
    footer: "GIANNI (Custom) • Ljubavne",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ INFO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "spotify",
    title: "<:music:1504850566415782098>  {trackTitle}",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:music2:1500459145382592602> **Izvođač:** {artist}\n" +
      "<a:85034pinknotes:1500444022622130196> **Album:** {album}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "`0:45` ▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱▱▱▱▱ `3:22`",
    color: "#14b8a6",
    category: "Info",
    footer: "Spotify • GIANNI (Custom)",
    thumbnail: "{albumArt}",
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Žanr",      value: "{genre}",    inline: true  },
      { name: "<a:music2:1500459145382592602> Trajanje",         value: "{duration}", inline: true  },
      { name: "<:8526link:1504505939917803620> Link",            value: "[Otvori na Spotifyju]({url})", inline: false },
    ],
  },
  {
    name: "invite",
    title: "<:globe:1504850556311834825>  Statistika — {user}",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> Pregled statistike korisnika na serveru:",
    color: "#14b8a6",
    category: "Info",
    footer: "GIANNI (Custom) • {user} • ID: {userId}",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:32467lovetalk:1504505532323594321> Poruka poslato",    value: "`{poruke}`",               inline: true  },
      { name: "<a:571294pinkpaw:1500259928936284211> Doveo/la članova", value: "`{invites}`",              inline: true  },
      { name: "<:2261bell:1504505860720820395> Pridružio/la se",        value: "{joinedAt}",               inline: true  },
      { name: "<:8526link:1504505939917803620> Invite link",            value: "`{inviteUses}` korišćenja", inline: false },
    ],
  },
  {
    name: "avatar",
    title: "<:globe:1504850556311834825>  Avatar — {user}",
    description:
      "<a:15072animatedarrowpink2:1496898801556914236> [PNG]({png}) **·** <:2084purplestar:1504504848375349388> [JPG]({jpg}) **·** <:479765rolemodblue:1496901403669565580> [WEBP]({webp})",
    color: "#14b8a6",
    category: "Info",
    footer: "GIANNI (Custom) • Avatar",
    thumbnail: null,
    fields: [
      { name: "<a:571294pinkpaw:1500259928936284211> Korisnik", value: "{user}",     inline: true },
      { name: "<:479765rolemodblue:1496901403669565580> ID",    value: "`{userId}`", inline: true },
    ],
  },
  {
    name: "brojanje-info",
    title: "<:barchart:1504852242233032865>  Brojanje — Stanje",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:91490animatedarrowblue:1496899222023176233> **Kanal:** {channel}\n" +
      "<:32467lovetalk:1504505532323594321> **Trenutno:** `{current}`\n" +
      "<:479765rolemodblue:1496901403669565580> **Sljedeći broj:** `{next}`\n" +
      "<a:571294pinkpaw:1500259928936284211> **Zadnji brojao:** {lastUser}\n" +
      "<:79529shinycrown:1496899185516216400> **Rekord:** `{highScore}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#14b8a6",
    category: "Info",
    footer: "GIANNI (Custom) • Brojanje",
    thumbnail: null,
    fields: [
      { name: "<:428758neonverifiedcheck:1496898532559421571> Status",  value: "`{status}`",  inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Rekord",          value: "`{record}`",  inline: true },
      { name: "<a:44503lockkey:1500444008760217641> Zadnji propust",    value: "{lastFail}",  inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ VATRICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "vatrice-pup",
    title: "<a:VATRICE:1496898836155596962>  Top Lista — Vatrice",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:864113ownerpinkcrownwithheart:1496899493130539008> **{top1}** — <a:vatrice1:1500466044429664256> `{top1count}`\n" +
      "<:2084purplestar:1504504848375349388> **{top2}** — <a:vatrice2:1500466048418185246> `{top2count}`\n" +
      "<:4558purplecheck:1504504889706020995> **{top3}** — <a:vatrice3:1500466039782113352> `{top3count}`\n" +
      "<:984706roleadminorange1:1496898583239200819> **{top4}** — <a:VATRICE:1496898836155596962> `{top4count}`\n" +
      "<a:28079animatedarroworange:1496898931790057472> **{top5}** — <a:VATRICE:1496898836155596962> `{top5count}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:32467lovetalk:1504505532323594321> Tvoje mjesto: **#{rank}** · Imaš: **{myCount}** vatrica",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vatrice-start",
    title: "<a:VATRICE:1496898836155596962>  Vatrica Sistem — Aktiviran!",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:4558purplecheck:1504504889706020995> Vatrica sistem je uspješno aktiviran!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:2084purplestar:1504504848375349388> Svako **{prag}** poruka = **1 vatrica**\n" +
      "<:984706roleadminorange1:1496898583239200819> Nick se automatski ažurira\n" +
      "<a:28079animatedarroworange:1496898931790057472> Objave idu u {kanal}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [
      { name: "<a:VATRICE:1496898836155596962> Emoji",         value: "`{emoji}`",        inline: true },
      { name: "<:2261bell:1504505860720820395> Kanal",         value: "{kanal}",           inline: true },
      { name: "<:33927diamond:1496898969052381407> Prag",      value: "`{prag}` poruka",  inline: true },
    ],
  },
  {
    name: "vatrice-kanal",
    title: "<:checkcircle:1504852246809149450>  Vatrica Kanal Postavljen",
    description:
      "<a:28079animatedarroworange:1496898931790057472> Objave vatrica idu od sada u {kanal}.\n" +
      "<:4558purplecheck:1504504889706020995> Postavka uspješno sačuvana!",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [],
  },
  {
    name: "vatrice-oblik",
    title: "<a:VATRICE:1496898836155596962>  Vatrica Emoji Promijenjen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:64382pinksparkles:1500259869259988033> Emoji vatrice je uspješno promijenjen!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#FF6A00",
    category: "Vatrice",
    footer: "GIANNI (Custom) • Vatrice Sistem",
    thumbnail: null,
    fields: [
      { name: "<a:44503lockkey:1500444008760217641> Stari emoji",  value: "`{stari}`", inline: true },
      { name: "<:4558purplecheck:1504504889706020995> Novi emoji", value: "`{novi}`",  inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━ POO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "poo",
    title: "<:heart:1504850560007012383>  P O O  —  Stanje Kreature",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{emojiBar}\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:4558purplecheck:1504504889706020995> **Zdravlje:** `{zdravlje}/100`\n" +
      "<a:3599pinkheart:1504504866700132534> **Raspoloženje:** `{raspolozenje}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:571294pinkpaw:1500259928936284211> Ukupno čuvara: **{cuvari}**\n" +
      "<:32467lovetalk:1504505532323594321> Završenih zadataka: **{zadaci}/100**",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Sistem",
    thumbnail: null,
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Zdravlje",    value: "`{zdravlje}/100`", inline: true },
      { name: "<a:3599pinkheart:1504504866700132534> Raspoloženje", value: "`{raspolozenje}`", inline: true },
      { name: "<:32467lovetalk:1504505532323594321> Zadaci",        value: "`{zadaci}/100`",   inline: true },
    ],
  },
  {
    name: "poo-zadaci",
    title: "<:checkcircle:1504852246809149450>  P O O  —  Lista Zadataka",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:518169rolemodpurple:1496901673426096158> Poo zadaci — stranica **{str}/{ukupnoStr}**\n" +
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
    title: "<:79529shinycrown:1496899185516216400>  P O O  —  Top Čuvari",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:864113ownerpinkcrownwithheart:1496899493130539008> **{top1}** — `{top1pts}` pts\n" +
      "<:2084purplestar:1504504848375349388> **{top2}** — `{top2pts}` pts\n" +
      "<:4558purplecheck:1504504889706020995> **{top3}** — `{top3pts}` pts\n" +
      "<:518169rolemodpurple:1496901673426096158> **{top4}** — `{top4pts}` pts\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> **{top5}** — `{top5pts}` pts\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Top Lista",
    thumbnail: null,
    fields: [],
  },
  {
    name: "poo-hrani",
    title: "<:heart:1504850560007012383>  P O O  —  Hranjen!",
    description:
      "<a:571294pinkpaw:1500259928936284211> **{user}** je hranio/la Poo-a! <a:giveaways5:1500203902446997586>\n" +
      "<a:529977coin:1500444133389635704> Potrošeno: **200 coina**\n\n" +
      "{emojiBar}\n" +
      "<:4558purplecheck:1504504889706020995> **Zdravlje:** `{zdravlje}/100` **(+{bonus})**",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Sistem",
    thumbnail: null,
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Novo zdravlje", value: "`{zdravlje}/100`", inline: true },
      { name: "<a:529977coin:1500444133389635704> Trošak",            value: "`200` 🪙",          inline: true },
    ],
  },
  {
    name: "poo-info",
    title: "<:barchart:1504852242233032865>  P O O  —  Moj Doprinos",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:571294pinkpaw:1500259928936284211> **{user}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{progres}",
    color: "#92400e",
    category: "Poo",
    footer: "GIANNI (Custom) • Poo Sistem",
    thumbnail: "{user.avatar}",
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Završenih zadataka", value: "`{zavrseni}`", inline: true },
      { name: "<:2084purplestar:1504504848375349388> Bodova ukupno",       value: "`{bodovi}`",   inline: true },
      { name: "<:79529shinycrown:1496899185516216400> Rang",               value: "`#{rang}`",    inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ ADMIN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "backup",
    title: "<:terminal:1504850585248071890>  B A C K U P  —  Snimljen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:4558purplecheck:1504504889706020995> Backup je uspješno snimljen!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI (Custom) • Backup Sistem",
    thumbnail: null,
    fields: [
      { name: "<:2261bell:1504505860720820395> Datum",                          value: "{datum}",    inline: true },
      { name: "<:33927diamond:1496898969052381407> Veličina",                   value: "{velicina}", inline: true },
      { name: "<a:15072animatedarrowpink2:1496898801556914236> Lokacija",       value: "Discord DM", inline: true },
    ],
  },
  {
    name: "backup-restore",
    title: "<:terminal:1504850585248071890>  B A C K U P  —  Vraćen",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:4558purplecheck:1504504889706020995> Backup je uspješno vraćen!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> Svi podaci su prepisani backupom od **{datum}**.",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI (Custom) • Backup Vraćen",
    thumbnail: null,
    fields: [
      { name: "<:2261bell:1504505860720820395> Backup datum",          value: "{datum}",    inline: true },
      { name: "<a:571294pinkpaw:1500259928936284211> Pokrenuo/la",     value: "{korisnik}", inline: true },
    ],
  },
  {
    name: "backup-status",
    title: "<:terminal:1504850585248071890>  B A C K U P  —  Status",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> Cloud backup istorija:\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{historija}",
    color: "#64748b",
    category: "Admin",
    footer: "GIANNI (Custom) • Backup Sistem",
    thumbnail: null,
    fields: [
      { name: "<:4558purplecheck:1504504889706020995> Ukupno backupa",    value: "`{ukupno}`",  inline: true },
      { name: "<:2261bell:1504505860720820395> Zadnji",                   value: "{zadnji}",    inline: true },
      { name: "<:518169rolemodpurple:1496901673426096158> Veličina",      value: "{velicina}",  inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ MUZIKA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "music-play",
    title: "<:music:1504850566415782098>  Sada Svira",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> **[{title}]({url})**\n" +
      "<:518169rolemodpurple:1496901673426096158> {author} · `{duration}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: "{thumbnail}",
    fields: [
      { name: "<:2261bell:1504505860720820395> Dodao/la",      value: "{requester}",         inline: true },
      { name: "<:33927diamond:1496898969052381407> Glasnoća",  value: "`{volume}%`",          inline: true },
      { name: "<:8526link:1504505939917803620> Red čekanja",   value: "`{queueSize}` pjesme", inline: true },
    ],
  },
  {
    name: "music-queue",
    title: "<:listmusic:1504852263556878417>  Red — Muzika",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> **Sada svira:**\n" +
      "**[{currentTitle}]({currentUrl})** · `{currentDuration}`\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{queueList}",
    color: "#8b5cf6",
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
    title: "<:skipforward:1504852277570048211>  Preskočeno",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{user}** je preskočio/la: **{title}**\n" +
      "<a:85034pinknotes:1500444022622130196> Sljedeće: **{next}**",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: null,
    fields: [],
  },
  {
    name: "music-pause",
    title: "<:pausecircle:1504852273627529266>  Pauzirano",
    description:
      "<:518169rolemodpurple:1496901673426096158> Muzika je pauzirana.\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> Napiši `/resume` da nastaviš.",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: null,
    fields: [],
  },
  {
    name: "music-stop",
    title: "<:volumex:1504852298072064120>  Muzika Zaustavljena",
    description:
      "<:518169rolemodpurple:1496901673426096158> **{user}** je zaustavio/la muziku i obrisao/la red.\n" +
      "<a:571294pinkpaw:1500259928936284211> Vidimo se sljedeći put!",
    color: "#8b5cf6",
    category: "Muzika",
    footer: "GIANNI (Custom) • Muzika",
    thumbnail: null,
    fields: [],
  },
  {
    name: "music-lyrics",
    title: "<:headphones:1504852261241884692>  Tekst Pjesme — {title}",
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
    title: "<:shieldcheck:1504850579556532314>  V E R I F I K A C I J A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:91490animatedarrowblue:1496899222023176233> Klikni dugme ispod da potvrdiš da nisi bot!\n" +
      "<:479765rolemodblue:1496901403669565580> Dobijate pristup svim kanalima nakon verifikacije.\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:64382pinksparkles:1500259869259988033> **discord.gg/gian**",
    color: "#06b6d4",
    category: "Verifikacija",
    footer: "GIANNI (Custom) • Verifikacija",
    thumbnail: null,
    fields: [],
  },
  {
    name: "verify-success",
    title: "<:badgecheck:1504852240404320356>  Verifikacija Uspješna!",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{user}** — Dobrodošao/la! <a:3599pinkheart:1504504866700132534>\n" +
      "<:479765rolemodblue:1496901403669565580> Verifikacija je prošla. Uživaj na serveru!\n" +
      "<a:91490animatedarrowblue:1496899222023176233> Dobio/la si ulogu: <@&{roleId}>",
    color: "#06b6d4",
    category: "Verifikacija",
    footer: "GIANNI (Custom) • Verifikacija",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "verify-fail",
    title: "<:shieldalert:1504850577237086248>  Verifikacija Neuspješna",
    description:
      "<:479765rolemodblue:1496901403669565580> Verifikacija nije prošla. Pokušaj ponovo!\n" +
      "<a:91490animatedarrowblue:1496899222023176233> Ako imaš problema, kontaktiraj staff.",
    color: "#ef4444",
    category: "Verifikacija",
    footer: "GIANNI (Custom) • Verifikacija",
    thumbnail: null,
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━ ANKETE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "poll-create",
    title: "<:barchart:1504852242233032865>  A N K E T A",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:64382pinksparkles:1500259869259988033> **{question}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:1111pinkarrow:1496903118108229733> Glasaj koristeći reakcije ispod!",
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
    title: "<:barchart:1504852242233032865>  Anketa — Rezultati",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:64382pinksparkles:1500259869259988033> **{question}**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "{resultsBar}",
    color: "#f43f5e",
    category: "Ankete",
    footer: "GIANNI (Custom) • Anketa završena • Glasova: {totalVotes}",
    thumbnail: null,
    fields: [
      { name: "<:2084purplestar:1504504848375349388> Pobjednik",  value: "**{winner}** — `{winnerPercent}%`", inline: true },
      { name: "<:2261bell:1504505860720820395> Ukupno glasova",   value: "`{totalVotes}`",                    inline: true },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━ REACTION ROLES ━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "rr-panel",
    title: "<:518169rolemodpurple:1496901673426096158>  U L O G E  —  Odaberi Svoju",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> Klikni na reakciju i dobij/skini ulogu!\n" +
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
    title: "<:4558purplecheck:1504504889706020995>  Uloga Dodana",
    description:
      "<a:64382pinksparkles:1500259869259988033> **{user}** — dobio/la si ulogu <@&{roleId}>!\n" +
      "<a:3599pinkheart:1504504866700132534> Uživaj u novoj ulozi!",
    color: "#d946ef",
    category: "Reaction Roles",
    footer: "GIANNI (Custom) • Reaction Roles",
    thumbnail: "{user.avatar}",
    fields: [],
  },
  {
    name: "rr-remove",
    title: "<:userx:1504852293319655604>  Uloga Skinuta",
    description:
      "<:518169rolemodpurple:1496901673426096158> **{user}** — uloga <@&{roleId}> je skinuta.\n" +
      "<a:15072animatedarrowpink2:1496898801556914236> Možeš je ponovo dodati kada želiš!",
    color: "#d946ef",
    category: "Reaction Roles",
    footer: "GIANNI (Custom) • Reaction Roles",
    thumbnail: "{user.avatar}",
    fields: [],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━ REPORT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    name: "report-nova",
    title: "<:shieldalert:1504850577237086248>  Nova Prijava — Report",
    description:
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<a:73288animatedarrowred:1496899179560304783> **{reporter}** je prijavio/la **{target}**!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "<:994180roleadminred1:1496902197605306461> Razlog: **{reason}**",
    color: "#ef4444",
    category: "Admin",
    footer: "GIANNI (Custom) • Report Sistem",
    thumbnail: "{target.avatar}",
    fields: [
      { name: "<:518169rolemodpurple:1496901673426096158> Prijavio/la",    value: "{reporter}", inline: true },
      { name: "<:994180roleadminred1:1496902197605306461> Prijavljeni",    value: "{target}",   inline: true },
      { name: "<:2261bell:1504505860720820395> Datum",                     value: "{date}",     inline: true },
    ],
  },
  {
    name: "report-closed",
    title: "<:checkcircle:1504852246809149450>  Report Zatvoren",
    description:
      "<a:64382pinksparkles:1500259869259988033> Report #**{id}** je zatvoren od strane **{mod}**.\n" +
      "<:4558purplecheck:1504504889706020995> Akcija: **{action}**",
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
