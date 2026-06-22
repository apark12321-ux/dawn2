import type { VercelRequest, VercelResponse } from "@vercel/node";
import { themeOf } from "./picks";

/**
 * 닮은꼴 종목 분석기.
 *  GET /api/similar?code=XXXXXX  (또는 ?name=종목명)
 *  기준 종목과 업종·재무 프로필이 닮은 종목을 거래대금 상위 풀에서 찾아 점수순 반환.
 *  → "사라"가 아니라 "닮은 종목 + 각자 분석 점수". 판단은 사용자.
 */
export const config = { maxDuration: 15 };

function turnoverEok(s: string): number {
  if (!s) return 0;
  if (s.includes("조")) return parseFloat(s) * 10000;
  if (s.includes("억")) return parseFloat(s.replace(/,/g, ""));
  return 0;
}
function mcapJo(s: string): number { return s && s.includes("조") ? parseFloat(s) : 0; }

async function fundamentals(code: string): Promise<{ per: number | null; pbr: number | null; eps: number | null }> {
  const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 5000);
  try {
    const r = await fetch(`https://m.stock.naver.com/api/stock/${code}/integration`, {
      headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://m.stock.naver.com/" }, signal: ac.signal,
    });
    if (!r.ok) return { per: null, pbr: null, eps: null };
    const j: any = await r.json();
    const infos: any[] = j?.totalInfos || [];
    const num = (k: RegExp) => {
      const it = infos.find((x: any) => k.test(x?.code || "") || k.test(x?.key || ""));
      if (!it) return null;
      const v = parseFloat(String(it.value).replace(/,/g, ""));
      return isFinite(v) ? v : null;
    };
    return { per: num(/^per$/i), pbr: num(/^pbr$/i), eps: num(/^eps$/i) };
  } catch { return { per: null, pbr: null, eps: null }; } finally { clearTimeout(t); }
}

function tierProximity(a: number, b: number): number {
  if (!a || !b) return 12;
  const ratio = a > b ? a / b : b / a;
  return Math.max(0, Math.round(25 * (1 - Math.min(1, Math.log10(ratio)))));
}
function valProximity(a: number | null, b: number | null): number {
  if (a == null || b == null || a <= 0 || b <= 0) return 8;
  const ratio = a > b ? a / b : b / a;
  return Math.max(0, Math.round(20 * (1 - Math.min(1, (ratio - 1) / 2))));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = (req.query.code as string) || "";
  const name = (req.query.name as string) || "";
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const base = `${proto}://${req.headers.host}`;

  let stocks: any[] = [];
  try { const j: any = await (await fetch(`${base}/api/naver-stocks?limit=50`)).json(); stocks = j?.stocks || []; } catch { stocks = []; }

  const baseStock = stocks.find((s: any) => (code && s.code === code) || (name && s.name === name));
  if (!baseStock) return res.status(200).json({ ok: false, error: "기준 종목을 거래대금 상위에서 찾지 못했어요", picks: [] });

  const baseTheme = themeOf(baseStock.name);
  const baseMcap = mcapJo(baseStock.marketcap);
  const baseFund = await fundamentals(baseStock.code);

  // 같은 테마 후보 (자기 자신 제외)
  const cands = stocks.filter((s: any) => s.code !== baseStock.code && themeOf(s.name) === baseTheme).slice(0, 14);
  const scored = await Promise.all(cands.map(async (s: any) => {
    const f = await fundamentals(s.code);
    const profitMatch = ((baseFund.per ?? 0) > 0) === ((f.per ?? 0) > 0) ? 15 : 4;
    const sim = 40 + tierProximity(baseMcap, mcapJo(s.marketcap)) + profitMatch + valProximity(baseFund.per, f.per);
    const bits = [`같은 ${baseTheme}`];
    if (tierProximity(baseMcap, mcapJo(s.marketcap)) >= 18) bits.push("시총대 비슷");
    if (profitMatch >= 15) bits.push((f.per ?? 0) > 0 ? "둘 다 흑자" : "둘 다 적자");
    if (valProximity(baseFund.per, f.per) >= 14) bits.push("밸류 비슷");
    return { name: s.name, code: s.code, market: s.market, price: s.price, chg: s.chg, turnover: s.turnover, marketcap: s.marketcap, up: s.up, per: f.per, pbr: f.pbr, theme: baseTheme, sim: Math.min(100, Math.round(sim)), reason: bits.join(" · ") };
  }));
  scored.sort((a, b) => b.sim - a.sim);

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  res.status(200).json({
    ok: scored.length > 0,
    base: { name: baseStock.name, code: baseStock.code, theme: baseTheme, marketcap: baseStock.marketcap, per: baseFund.per, pbr: baseFund.pbr },
    picks: scored.slice(0, 8),
    disclaimer: "업종·재무가 닮은 종목을 보여주는 정보 도구입니다. 매수 권유가 아니며, 판단과 책임은 본인에게 있습니다.",
  });
}
