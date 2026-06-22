import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * 종목 종합 점수 엔진.
 *  GET /api/picks  → 거래대금 상위 종목을 종합 점수화해서 순위 반환
 *
 * 점수 = 모멘텀(등락) + 자금쏠림(거래대금 순위) + 변동성 안정 + 시총 신뢰 가중 (종합형)
 *
 * 합법 스위치 — 환경변수 ADVISORY_LICENSED:
 *   "false"(기본/신고 전) → mode:"observe"  · 라벨 "관찰 종목 · 정보 제공"
 *   "true" (유사투자자문업 신고 완료 후) → mode:"advise" · 라벨 "주목 종목 · 분석"
 *   ADVISORY_REG_NO 환경변수에 등록번호 넣으면 응답에 같이 실려 고지에 사용.
 *
 * 코드는 하나. 신고 여부(환경변수)로 표현만 전환된다.
 */
export const config = { maxDuration: 15 };

type Row = { rank: number; name: string; code: string; market: string; price: number; chg: number; turnover: string; marketcap: string; up: boolean };

function turnoverEok(s: string): number {
  if (!s) return 0;
  if (s.includes("조")) return parseFloat(s) * 10000;
  if (s.includes("억")) return parseFloat(s.replace(/,/g, ""));
  return 0;
}
function mcapJo(s: string): number { return s && s.includes("조") ? parseFloat(s) : 0; }

// 종목 통합 API에서 PER·PBR·EPS 가져오기 (네이버, 키 불필요)
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

// 기업 분석 점수 0~100 (객관적 재무 — 모든 종목 동일 기준)
function fundScore(f: { per: number | null; pbr: number | null; eps: number | null }): { score: number; bits: string[] } {
  const bits: string[] = [];
  let profit = 20, val = 25, book = 15; // 데이터 없을 때 중립값
  const profitable = (f.eps != null && f.eps > 0) || (f.per != null && f.per > 0);
  if (f.eps != null || f.per != null) {
    if (profitable) { profit = 40; bits.push("흑자 기업"); }
    else { profit = 5; bits.push("적자 — 주의"); }
  }
  if (f.per != null && f.per > 0) {
    if (f.per <= 10) { val = 35; bits.push("PER 낮음(저평가 가능)"); }
    else if (f.per <= 20) val = 26;
    else if (f.per <= 35) val = 15;
    else { val = 6; bits.push("PER 높음(고평가 주의)"); }
  } else if (f.per != null && f.per <= 0) { val = 6; }
  if (f.pbr != null && f.pbr > 0) {
    if (f.pbr <= 1) { book = 25; bits.push("PBR 1배 미만"); }
    else if (f.pbr <= 2) book = 18;
    else if (f.pbr <= 4) book = 10;
    else book = 4;
  }
  return { score: Math.max(1, Math.min(100, Math.round(profit + val + book))), bits };
}

function scoreOf(r: Row, maxTurn: number, mktChg: number): { score: number; parts: Record<string, number> } {
  const momentum = Math.max(0, Math.min(30, (r.chg + 5) * 3));         // 등락(모멘텀) 0~30
  const flow = maxTurn ? (turnoverEok(r.turnover) / maxTurn) * 30 : 0; // 자금쏠림(유동성) 0~30
  const rs = Math.max(0, Math.min(20, (r.chg - mktChg + 3) * 2.5));    // 상대강도: 시장 대비 0~20
  const trust = Math.min(12, mcapJo(r.marketcap) >= 1 ? 7 + Math.min(5, mcapJo(r.marketcap) / 5) : 2); // 시총 신뢰 0~12
  const stable = r.chg > 29 ? 1 : r.chg > 20 ? 4 : 8;                  // 과열 페널티 0~8
  const score = Math.round(momentum + flow + rs + trust + stable);
  return { score: Math.max(1, Math.min(100, score)), parts: { momentum: Math.round(momentum), flow: Math.round(flow), rs: Math.round(rs), trust: Math.round(trust), stable } };
}

function reason(r: Row, p: Record<string, number>): string {
  const bits: string[] = [];
  if (p.flow >= 18) bits.push("거래대금 상위로 돈이 몰려요");
  else if (p.flow >= 9) bits.push("거래대금이 늘고 있어요");
  if (p.rs >= 14) bits.push("시장보다 강한 흐름(상대강도↑)");
  if (r.chg >= 5) bits.push(`오늘 ${r.chg.toFixed(1)}% 강세`);
  else if (r.chg <= -3) bits.push(`오늘 ${Math.abs(r.chg).toFixed(1)}% 약세`);
  if (p.trust >= 10) bits.push("시총이 큰 편");
  if (r.chg > 20) bits.push("단기 급등 — 과열 주의");
  return bits.join(" · ") || "거래대금 상위 종목이에요";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const licensed = process.env.ADVISORY_LICENSED === "true";
  const regNo = process.env.ADVISORY_REG_NO || "";
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host;
  const base = `${proto}://${host}`;

  let stocks: Row[] = [];
  let mktChg = 0;
  try {
    const [sr, mr] = await Promise.all([
      fetch(`${base}/api/naver-stocks?limit=30`).then(r => r.json()).catch(() => null),
      fetch(`${base}/api/markets`).then(r => r.json()).catch(() => null),
    ]);
    stocks = sr?.stocks || [];
    const kospi = (mr?.data || []).find((m: any) => m.name === "코스피");
    mktChg = typeof kospi?.chg === "number" ? kospi.chg : 0;
  } catch { stocks = []; }

  const maxTurn = Math.max(1, ...stocks.map(s => turnoverEok(s.turnover)));
  // 1차: 기술(시세) 점수로 상위 후보 추리기
  const tech = stocks.map(r => {
    const { score, parts } = scoreOf(r, maxTurn, mktChg);
    return { r, tech: score, parts };
  }).sort((a, b) => b.tech - a.tech).slice(0, 18);

  // 2차: 후보들 기업 재무 가져와 분석 점수 블렌딩
  const withFund = await Promise.all(tech.map(async (x) => {
    const f = await fundamentals(x.r.code);
    const fs = fundScore(f);
    const score = Math.round(x.tech * 0.55 + fs.score * 0.45); // 시세 55% + 기업분석 45%
    return { x, f, fs, score };
  }));

  const ranked = withFund.map(({ x, f, fs, score }) => {
    const r = x.r;
    const techBits = reason(r, x.parts);
    const allBits = [techBits, ...fs.bits].filter(Boolean).join(" · ");
    return {
      name: r.name, code: r.code, market: r.market, price: r.price, chg: r.chg,
      turnover: r.turnover, marketcap: r.marketcap, up: r.up,
      score, tech: x.tech, fund: fs.score,
      per: f.per, pbr: f.pbr,
      grade: score >= 75 ? "A" : score >= 60 ? "B" : score >= 45 ? "C" : "D",
      reason: allBits,
    };
  }).sort((a, b) => b.score - a.score).slice(0, 10);

  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
  res.status(200).json({
    ok: ranked.length > 0,
    mode: licensed ? "advise" : "observe",
    label: licensed ? "오늘의 주목 종목" : "오늘의 관찰 종목",
    sublabel: licensed ? "AI 종합 분석 순위" : "정보 제공 · 매수 권유 아님",
    regNo,
    disclaimer: licensed
      ? `투자자문업 등록 ${regNo || "(번호 미입력)"} · 본 정보는 투자 참고용이며 손익 책임은 투자자 본인에게 있습니다.`
      : "투자 참고용 정보입니다. 특정 종목 매수·매도 권유가 아니며, 최종 판단과 책임은 본인에게 있습니다.",
    picks: ranked,
    asof: new Date().toISOString(),
  });
}
