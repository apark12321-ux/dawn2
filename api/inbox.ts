import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * 폰 메시지 수신함.
 *  POST /api/inbox  { text, from?, secret }  → Gemini로 주린이용 한 줄 요약 후 Upstash에 저장
 *  GET  /api/inbox                           → 최근 항목 반환 { items:[{summary, from, at}] }
 *
 * 환경변수(Vercel):
 *  UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN  (Upstash 연결 시 자동 주입)
 *  GEMINI_API_KEY                                    (요약용, 없으면 원문 앞부분 사용)
 *  INBOX_SECRET                                       (아무 문자열 — 폰과 서버가 공유하는 비밀번호)
 */

const U = process.env.UPSTASH_REDIS_REST_URL;
const T = process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "inbox";
const MAX = 30;

async function redis(cmd: any[]): Promise<any> {
  if (!U || !T) return null;
  const r = await fetch(U, { method: "POST", headers: { Authorization: `Bearer ${T}`, "Content-Type": "application/json" }, body: JSON.stringify(cmd) });
  if (!r.ok) return null;
  const j: any = await r.json();
  return j?.result ?? null;
}

async function summarize(text: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!key) return clean.slice(0, 60);
  try {
    const prompt = `다음은 증권사·리서치에서 온 메시지야. 주식 초보(주린이)가 이해할 수 있게 핵심만 한 문장(40자 내외)으로 요약해줘. 규칙: 사실만 전달하고 '사라/팔라' 같은 매수·매도 권유 표현은 절대 넣지 마. 종목 추천이 들어있으면 그 부분은 빼고 시장·이슈 사실만 요약해. 요약문만 출력해.\n\n메시지: ${clean}`;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 80, temperature: 0.3 } }),
    });
    const j: any = await r.json();
    const out = j?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return out ? out.replace(/^["'\s]+|["'\s]+$/g, "") : clean.slice(0, 60);
  } catch { return clean.slice(0, 60); }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? safeParse(req.body) : (req.body || {});
    const secret = body.secret || req.query.secret;
    if (process.env.INBOX_SECRET && secret !== process.env.INBOX_SECRET) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }
    const text = (body.text || "").toString();
    if (!text.trim()) return res.status(400).json({ ok: false, error: "no text" });
    const summary = await summarize(text);
    const item = { summary, from: (body.from || "메시지").toString().slice(0, 20), at: new Date().toISOString() };
    await redis(["LPUSH", KEY, JSON.stringify(item)]);
    await redis(["LTRIM", KEY, "0", String(MAX - 1)]);
    return res.status(200).json({ ok: true, summary });
  }

  const raw = (await redis(["LRANGE", KEY, "0", String(MAX - 1)])) as string[] | null;
  let items: any[] = [];
  if (raw && Array.isArray(raw)) items = raw.map(safeParse).filter(Boolean);
  if (!items.length) {
    items = [
      { summary: "아직 받은 메시지가 없어요. 폰 자동화를 연결하면 여기에 쌓여요.", from: "안내", at: new Date().toISOString() },
    ];
  }
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
  return res.status(200).json({ ok: true, items });
}

function safeParse(s: any) { try { return JSON.parse(s); } catch { return null; } }
