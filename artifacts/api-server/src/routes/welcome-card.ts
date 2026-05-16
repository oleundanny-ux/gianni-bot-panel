import { Router } from "express";
import { Resvg } from "@resvg/resvg-js";

const router = Router();

async function fetchAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const ct = res.headers.get("content-type") ?? "image/png";
    return `data:${ct};base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Deterministic pseudo-random star field
function starField(n: number, w: number, h: number): string {
  let s = 0xdeadbeef;
  const rng = () => { s = Math.imul(s ^ (s >>> 16), 0x45d9f3b); s ^= s >>> 16; return (s >>> 0) / 0xffffffff; };
  return Array.from({ length: n }, () => {
    const x = rng() * w, y = rng() * h;
    const r = rng() * 1.4 + 0.4;
    const o = (rng() * 0.5 + 0.3).toFixed(2);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="white" opacity="${o}"/>`;
  }).join("");
}

// 4-pointed sparkle star
function star4(x: number, y: number, sz: number, col = "#ec4899", op = "1"): string {
  const h = sz, q = sz * 0.28;
  return `<path d="M${x},${y - h} L${x + q},${y - q} L${x + h},${y} L${x + q},${y + q} L${x},${y + h} L${x - q},${y + q} L${x - h},${y} L${x - q},${y - q} Z" fill="${col}" opacity="${op}"/>`;
}

// Crescent moon via two-circle mask
function crescentMoon(cx: number, cy: number, r: number): string {
  const off = r * 0.35;
  return `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#c0507a" opacity="0.55"/>
  <circle cx="${cx - off}" cy="${cy - off * 0.5}" r="${r * 0.82}" fill="#0d0516" opacity="1"/>`;
}

// Planet with ring (right panel decoration)
function planet(cx: number, cy: number): string {
  return `
  <circle cx="${cx}" cy="${cy}" r="12" fill="#2d0a3e" stroke="#ec4899" stroke-width="1.2" opacity="0.7"/>
  <ellipse cx="${cx}" cy="${cy}" rx="20" ry="6" fill="none" stroke="#ec4899" stroke-width="1.2" opacity="0.6" transform="rotate(-25,${cx},${cy})"/>`;
}

// Rounded rectangle button
function btn(x: number, y: number, w: number, h: number, label: string, filled: boolean): string {
  const bg = filled
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="#ec4899"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="#2a0a2a" stroke="#ec4899" stroke-width="1.5" opacity="0.9"/>`;
  return `${bg}
  <text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="14" fill="white">${esc(label)}</text>`;
}

function statRow(x: number, y: number, label: string, value: string): string {
  return `
  <text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="11" fill="#a67cc0">${esc(label)}</text>
  <text x="${x + 95}" y="${y}" font-family="Arial,sans-serif" font-weight="bold" font-size="13" fill="white">${esc(value)}</text>`;
}

router.get("/api/welcome-card", async (req, res) => {
  const user        = ((req.query.user        as string) ?? "User").slice(0, 20);
  const avatarUrl   =  (req.query.avatarUrl   as string) ?? "";
  const memberCount =  (req.query.memberCount as string) ?? "?";
  const accountAge  =  (req.query.accountAge  as string) ?? "?";
  const joinedAt    =  (req.query.joinedAt    as string) ?? "?";
  const count       =  (req.query.count       as string) ?? "?";

  const avatarB64 = avatarUrl ? await fetchAsBase64(avatarUrl) : null;

  const W = 900, H = 500;
  const AX = 160, AY = 215, AR = 100; // avatar center + radius

  // Username font size — shrink for long names
  const uLen = user.length;
  const uSize = uLen > 16 ? 26 : uLen > 12 ? 31 : 36;

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
  <radialGradient id="bg" cx="40%" cy="40%" r="70%">
    <stop offset="0%"   stop-color="#200930"/>
    <stop offset="100%" stop-color="#0c0514"/>
  </radialGradient>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%"   stop-color="#ec4899" stop-opacity="0.45"/>
    <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
  </radialGradient>
  <clipPath id="av"><circle cx="${AX}" cy="${AY}" r="${AR}"/></clipPath>
  <filter id="glowF" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="5" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <linearGradient id="panelBg" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%"   stop-color="#1e0830"/>
    <stop offset="100%" stop-color="#160525"/>
  </linearGradient>
</defs>

<!-- Background -->
<rect width="${W}" height="${H}" fill="url(#bg)" rx="18"/>

<!-- Stars -->
${starField(70, W, H)}

<!-- Sparkles scattered -->
${star4(340, 78, 6)}
${star4(380, 58, 3.5, "white", "0.8")}
${star4(720, 38, 5)}
${star4(762, 68, 3, "white", "0.7")}
${star4(832, 44, 5.5)}
${star4(855, 175, 3.5, "white", "0.7")}
${star4(875, 350, 4.5, "white", "0.6")}
${star4(62, 82, 4, "white", "0.6")}
${star4(505, 28, 4.5, "white", "0.7")}
${star4(42, 300, 3.5, "white", "0.6")}
${star4(300, 460, 4, "white", "0.5")}

<!-- Moon bottom-left -->
${crescentMoon(55, 418, 88)}

<!-- Cloud hints -->
<ellipse cx="100" cy="488" rx="80" ry="22" fill="#2a0838" opacity="0.55"/>
<ellipse cx="48"  cy="478" rx="55" ry="16" fill="#2a0838" opacity="0.45"/>

<!-- Avatar glow halo -->
<circle cx="${AX}" cy="${AY}" r="${AR + 22}" fill="url(#glow)"/>

<!-- Avatar ring -->
<circle cx="${AX}" cy="${AY}" r="${AR + 12}" fill="none" stroke="#ec4899" stroke-width="2.5" opacity="0.9" filter="url(#glowF)"/>
<circle cx="${AX}" cy="${AY}" r="${AR + 8}"  fill="none" stroke="#ec4899" stroke-width="1"   opacity="0.4"/>

<!-- Avatar background -->
<circle cx="${AX}" cy="${AY}" r="${AR}" fill="#2d0a3e"/>

<!-- Avatar image -->
${avatarB64
  ? `<image href="${avatarB64}" x="${AX - AR}" y="${AY - AR}" width="${AR * 2}" height="${AR * 2}" clip-path="url(#av)"/>`
  : `<circle cx="${AX}" cy="${AY}" r="${AR}" fill="#3d0a50"/>
     <text x="${AX}" y="${AY + 18}" text-anchor="middle" font-family="Arial,sans-serif" font-size="64" fill="#ec4899" font-weight="bold">?</text>`
}

<!-- Online indicator -->
<circle cx="${AX + AR - 14}" cy="${AY + AR - 14}" r="11" fill="#0c0514"/>
<circle cx="${AX + AR - 14}" cy="${AY + AR - 14}" r="8"  fill="#3ba55c"/>

<!-- ─── MIDDLE CONTENT ─── -->

<!-- "hey!" -->
<text x="315" y="92" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="22" fill="#ec4899" opacity="0.95">hey!</text>
${star4(358, 84, 5)}
${star4(374, 72, 3, "white", "0.75")}

<!-- Title -->
<text x="315" y="143" font-family="Arial,sans-serif" font-weight="bold" font-size="34" fill="white">Dobrodosao/la,</text>
<text x="315" y="${143 + 46}" font-family="Arial,sans-serif" font-weight="bold" font-size="${uSize}" fill="#ec4899">@${esc(user)}  &#x2665;</text>

<!-- Decorative divider -->
<line x1="315" y1="208" x2="600" y2="208" stroke="#ec4899" stroke-width="0.8" opacity="0.35"/>
${star4(445, 208, 5)}
${star4(468, 208, 3.5, "white", "0.7")}
<text x="456" y="213" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#ec4899" opacity="0.85">&#x1F380;</text>

<!-- Description -->
<text x="315" y="243" font-family="Arial,sans-serif" font-size="14.5" fill="#dcc4d4">Drago nam je sto si stigao/la u nasu zajednicu! *</text>

<!-- List items -->
<rect x="315" y="260" width="3" height="14" rx="1" fill="#ec4899" opacity="0.7"/>
<text x="326" y="272" font-family="Arial,sans-serif" font-size="14" fill="#cdb0c4">Procitaj pravila</text>

<rect x="315" y="290" width="3" height="14" rx="1" fill="#ec4899" opacity="0.7"/>
<text x="326" y="302" font-family="Arial,sans-serif" font-size="14" fill="#cdb0c4">Odaberi role</text>

<rect x="315" y="320" width="3" height="14" rx="1" fill="#ec4899" opacity="0.7"/>
<text x="326" y="332" font-family="Arial,sans-serif" font-size="14" fill="#cdb0c4">Predstavi se zajednici</text>

<text x="315" y="372" font-family="Arial,sans-serif" font-size="14.5" fill="#dcc4d4">Uzivaj i zabavi se! &#x2665;</text>

<!-- ─── RIGHT PANEL ─── -->
<rect x="648" y="25" width="232" height="435" fill="url(#panelBg)" rx="13"/>
<rect x="648" y="25" width="232" height="435" fill="none" stroke="#ec4899" stroke-width="1" rx="13" opacity="0.3"/>

<!-- Planet decoration -->
${planet(845, 95)}

<!-- SERVER STATS header -->
${star4(663, 55, 5)}
<text x="762" y="59" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="11.5" fill="#ec4899" letter-spacing="1.5">SERVER STATS</text>
${star4(862, 55, 5)}

<!-- Stats rows -->
${statRow(663, 100, "Members", memberCount)}
${statRow(663, 132, "Online",  "24/7")}
${statRow(663, 164, "Secure",  "Always Protected")}
${statRow(663, 196, "Uptime",  "100%")}

<!-- Separator -->
<line x1="663" y1="215" x2="868" y2="215" stroke="#ec4899" stroke-width="0.8" opacity="0.3"/>

<!-- YOUR INFO header -->
${star4(663, 238, 5)}
<text x="762" y="242" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="11.5" fill="#ec4899" letter-spacing="1.5">YOUR INFO</text>
${star4(862, 238, 5)}

<!-- Info rows -->
${statRow(663, 276, "Account",   accountAge)}
${statRow(663, 308, "Joined",    joinedAt)}
${statRow(663, 340, "Member ID", "#" + count)}

<!-- ─── BUTTONS ─── -->
${btn(25,  415, 160, 44, "Pravila", true)}
${btn(196, 415, 130, 44, "Role",    false)}
${btn(337, 415, 150, 44, "Pozovi",  false)}
${btn(498, 415, 130, 44, "Chat",    false)}

<!-- ─── FOOTER ─── -->
${star4(318, 487, 4, "#9370a8", "0.8")}
<text x="450" y="491" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#8855a0" letter-spacing="1.2">GIANNI  *  WELCOME SYSTEM</text>
${star4(582, 487, 4, "#9370a8", "0.8")}
</svg>`;

  try {
    const resvg = new Resvg(svg, {
      fitTo: { mode: "original" },
      font: { loadSystemFonts: true },
    });
    const png = Buffer.from(resvg.render().asPng());
    res.set({ "Content-Type": "image/png", "Cache-Control": "no-cache" });
    res.send(png);
  } catch (err) {
    res.status(500).json({ error: "Render failed", detail: String(err) });
  }
});

export default router;
