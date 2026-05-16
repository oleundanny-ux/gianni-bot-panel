import { Router } from "express";
import { icons } from "lucide";
import { Resvg } from "@resvg/resvg-js";

const router = Router();

type IconNodes = [string, Record<string, string>][];

function buildSvg(iconName: string, bg: string, color: string): string | null {
  const iconNodes = (icons as Record<string, IconNodes>)[iconName];
  if (!iconNodes) return null;

  const paths = iconNodes
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${attrStr}/>`;
    })
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
  <rect width="128" height="128" rx="28" fill="#${bg}"/>
  <svg x="24" y="24" width="80" height="80" viewBox="0 0 24 24"
       fill="none" stroke="#${color}" stroke-width="1.8"
       stroke-linecap="round" stroke-linejoin="round">
    ${paths}
  </svg>
</svg>`;
}

const cache = new Map<string, Buffer>();

router.get("/api/icons/:name", (req, res) => {
  const { name } = req.params;
  const bg = ((req.query.bg as string) ?? "18103a").replace(/^#/, "");
  const color = ((req.query.color as string) ?? "ffffff").replace(/^#/, "");

  const cacheKey = `${name}:${bg}:${color}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    res.set({ "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" });
    res.send(cached);
    return;
  }

  const svg = buildSvg(name, bg, color);
  if (!svg) {
    res.status(404).json({ error: `Icon '${name}' not found` });
    return;
  }

  try {
    const resvg = new Resvg(svg, { fitTo: { mode: "original" } });
    const png = Buffer.from(resvg.render().asPng());
    cache.set(cacheKey, png);

    res.set({ "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" });
    res.send(png);
  } catch {
    res.status(500).json({ error: "Render failed" });
  }
});

export default router;
