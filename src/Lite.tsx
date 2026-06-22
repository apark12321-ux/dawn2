import { useEffect, useState, ReactNode } from "react";
import { Briefing, Stock, NewsItem } from "./lib/types";
import { Live } from "./hooks/useLive";
import Story, { StoryCard } from "./Story";

type MItem = { name: string; group: string; unit: string; level: number; chg: number; spark?: number[] };
type NStock = { rank: number; name: string; code: string; market: string; price: number; chg: number; volume: string; turnover: string; marketcap: string; up: boolean; spark?: number[] };

const cc = (n: number) => (n >= 0 ? "u" : "d");
const sgn = (n: number) => (n >= 0 ? "+" : "−") + Math.abs(n).toFixed(2) + "%";
const comma = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
const wd = ["일", "월", "화", "수", "목", "금", "토"];
const LOGO_C = ["#6C5CE7", "#4B6BFB", "#12B886", "#E8590C", "#E64980", "#0CA678"];
const logoColor = (s: string) => LOGO_C[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % LOGO_C.length];
const mkSpark = (up: boolean) => { let v = 50; return Array.from({ length: 12 }, () => { v += (Math.random() - (up ? 0.42 : 0.58)) * 9; return Math.max(10, Math.min(90, v)); }); };

const WORLD = [
  { n: "나스닥", v: 25888.84, c: 0.30, why: "AI·반도체 강세" },
  { n: "S&P 500", v: 7394.30, c: 1.75, why: "지정학 긴장 완화" },
  { n: "다우", v: 50848.75, c: 1.86, why: "경기 우려 진정" },
];
const ISSUES = [
  { tt: "외국인이 24일 만에 다시 샀어요", ez: "외국인이 우리 주식을 다시 사기 시작했어요. 보통 큰 자금이 들어오면 시장이 오르는 신호로 봐요.", tag: "수급" },
  { tt: "미국 물가가 잡히는 분위기예요", ez: "물가가 안정되면 금리를 내릴 수 있어요. 금리가 내리면 주식엔 보통 좋은 소식이에요.", tag: "금리" },
  { tt: "호르무즈 긴장이 다시 불거졌어요", ez: "중동 긴장은 유가를 자극해요. 에너지·방산주는 오르고, 항공주는 부담받을 수 있어요.", tag: "이슈" },
];
const SAMPLE_CHART: NStock[] = [
  { rank: 1, name: "SK하이닉스", code: "000660", market: "코스피", price: 318000, chg: 2.9, volume: "420만", turnover: "8,420억", marketcap: "231조", up: true },
  { rank: 2, name: "삼성전자", code: "005930", market: "코스피", price: 94300, chg: 8.5, volume: "1,290만", turnover: "1.07조", marketcap: "562조", up: true },
  { rank: 3, name: "한미반도체", code: "042700", market: "코스피", price: 168500, chg: 4.8, volume: "610만", turnover: "6,980억", marketcap: "16조", up: true },
  { rank: 4, name: "알테오젠", code: "196170", market: "코스닥", price: 384000, chg: 2.7, volume: "140만", turnover: "4,180억", marketcap: "20조", up: true },
  { rank: 5, name: "에코프로비엠", code: "247540", market: "코스닥", price: 184000, chg: -3.7, volume: "210만", turnover: "2,870억", marketcap: "18조", up: false },
  { rank: 6, name: "현대차", code: "005380", market: "코스피", price: 246500, chg: 1.2, volume: "160만", turnover: "3,610억", marketcap: "51조", up: true },
];
const FLOW_TABS = [["turnover", "거래대금"], ["up", "급상승"], ["down", "급하락"]];
const SUPPLY = [["외국인", "+3,260억", true], ["기관", "−2,390억", false], ["개인", "−870억", false]] as [string, string, boolean][];
const WATCH = [
  { name: "반도체", why: "외국인 매수 집중 + 미국 SOX 강세", chg: 5.8 },
  { name: "방산", why: "중동 긴장에 수혜 기대", chg: 3.1 },
  { name: "바이오", why: "환율 안정 + 기술수출 기대", chg: 4.2 },
];
const CAL = [
  { d: "오늘", t: "09:00", ev: "코스피·코스닥 개장", tag: "장" },
  { d: "오늘 밤", t: "21:30", ev: "미국 5월 소매판매 발표", tag: "지표" },
  { d: "17일", t: "21:00", ev: "카맥스 실적 발표", tag: "실적" },
];
const TERMS = [
  { w: "수급", m: "주식을 사고파는 돈의 흐름. '외국인 수급이 좋다'=외국인이 많이 산다는 뜻." },
  { w: "거래대금", m: "그날 그 종목이 사고팔린 금액의 합. 클수록 사람들 관심이 많다는 신호." },
  { w: "VIX", m: "시장의 '공포 지수'. 낮으면 안정, 높으면 불안." },
];
const RULES = [
  { ic: "💵", t: "현금으로만, 빚투 금지", m: "미수·신용·담보로 굴리지 않기. 레버리지는 한 번의 실수를 돌이킬 수 없게 만들어요." },
  { ic: "🪙", t: "소액으로 시작", m: "크게 벌려고 비중을 키우면 판단이 흔들려요. 잃어도 괜찮은 금액에서 습관부터 쌓기." },
  { ic: "🛑", t: "오늘 최고 수익의 절반을 반납하면 그날 끝", m: "예: 최고 +10만 원이었다가 +5만 원으로 줄면 그날은 멈추기. 다 토해내는 날을 막는 게 핵심." },
  { ic: "🌙", t: "다음날로 넘기지 않기", m: "당일 산 건 당일 정리. '내일 오르겠지'는 손실을 키우는 가장 흔한 함정이에요." },
  { ic: "📓", t: "매매일지 쓰기", m: "잘한 매매와 잘못한 매매를 나눠 적기. 어떤 습관이 돈을 잃게 하는지 보여요." },
  { ic: "🏦", t: "벌어도·잃어도 출금하는 습관", m: "계좌에 돈이 쌓일수록 비중이 커지고 무리하게 돼요. 일정 부분은 빼두기." },
];
const CHECK = ["오늘 잃어도 괜찮은 돈만 넣었나요?", "빚(신용·미수)으로 사고 있진 않나요?", "본전 생각에 무리하게 따라가고 있진 않나요?", "오늘 멈출 기준을 정해뒀나요?"];
const TIERS = [
  { p: "무료", n: "라이트", d: "오늘 브리핑·지수·뉴스 기본" },
  { p: "29,990", n: "베이직", d: "+ 관심종목 알림·수급 요약" },
  { p: "49,900", n: "플러스", d: "+ 관찰 알고리즘·종목 심층" },
  { p: "99,900", n: "프로", d: "+ 실시간 시세·공시·재무 풀" },
  { p: "299,000", n: "프리미엄", d: "+ 알림봇·1:1 데이터 요청" },
];
const NAV = [["today", "오늘", "🌅"], ["stock", "종목", "🔍"], ["prem", "프리미엄", "💎"], ["more", "더보기", "≡"]];

function Spark({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data), max = Math.max(...data), r = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 62},${28 - ((v - min) / r) * 24 - 2}`).join(" ");
  return <svg className="dl-spark" viewBox="0 0 62 30" preserveAspectRatio="none"><polyline fill="none" stroke={up ? "var(--up)" : "var(--down)"} strokeWidth="1.8" points={pts} /></svg>;
}

export default function Lite({ b, live, onPro, pro = false, openStock, openNews }: {
  b: Briefing; live: Live; onPro: () => void; pro?: boolean;
  openStock: (s: Stock) => void; openNews: (n: NewsItem) => void;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [markets, setMarkets] = useState<MItem[]>([]);
  const [nstocks, setNstocks] = useState<NStock[]>([]);
  const [inbox, setInbox] = useState<{ summary: string; from: string; at: string }[]>([]);
  const [picks, setPicks] = useState<any>({ picks: [], label: "오늘의 관찰 종목", sublabel: "정보 제공 · 매수 권유 아님", mode: "observe", disclaimer: "" });
  const [tab, setTab] = useState("today");
  const [flow, setFlow] = useState("turnover");
  const [screen, setScreen] = useState<"" | "my" | "alarm" | "login">("");
  const [term, setTerm] = useState(0);
  const [view, setView] = useState<"story" | "scroll">("story");

  useEffect(() => {
    fetch("/api/markets").then(r => r.json()).then(d => setMarkets(d.data || [])).catch(() => {});
    fetch("/api/naver-stocks?limit=12").then(r => r.json()).then(d => setNstocks(d.stocks || [])).catch(() => {});
    fetch("/api/inbox").then(r => r.json()).then(d => setInbox(d.items || [])).catch(() => {});
    fetch("/api/picks").then(r => r.json()).then(d => { if (d.picks) setPicks(d); }).catch(() => {});
  }, []);

  const grp = (g: string) => markets.filter(m => m.group === g);
  const us = grp("미국"), kr = grp("국내"), ind = grp("지표");
  const WHY: Record<string, string> = { "나스닥": "AI·반도체 흐름", "S&P 500": "전반적 투자심리", "다우": "경기 대형주", "필라델피아반도체": "반도체 업황" };
  const world = (us.length ? us : WORLD.map(w => ({ name: w.n, level: w.v, chg: w.c }))).slice(0, 3).map((m: any) => ({ n: m.name, v: m.level, c: m.chg, why: WHY[m.name] || "" }));
  const avg = (a: MItem[]) => a.length ? a.reduce((x, m) => x + m.chg, 0) / a.length : 0;
  const vix = ind.find(x => x.name.includes("VIX"))?.level ?? 17.68;
  const score = Math.max(3, Math.min(99, Math.round(50 + (us.length ? avg(us) : 2.0) * 3.2 + (kr.length ? avg(kr) : 3.9) * 2.2 + (18 - vix) + (live.btcChg ?? 0) * 0.3)));
  const mood = score >= 72 ? "활짝 갭니다 ☀️" : score >= 58 ? "맑게 갭니다 🌤️" : score >= 45 ? "구름 조금 ⛅" : score >= 32 ? "흐립니다 ☁️" : "비 소식 🌧️";
  const moodLine = score >= 58 ? "밤사이 미국이 올라서 오늘 출발은 우호적이에요." : score >= 45 ? "방향이 뚜렷하지 않아요. 서두르지 않아도 돼요." : "조심스러운 날이에요. 무리한 추격은 피하는 게 좋아요.";

  const NS = (nstocks.length ? nstocks : SAMPLE_CHART).map(s => ({ ...s, spark: s.spark || mkSpark(s.up) }));
  const flows = [...NS].sort((a, b) => flow === "up" ? b.chg - a.chg : flow === "down" ? a.chg - b.chg : 0).slice(0, 6);
  const news = (b.news && b.news.length) ? b.news : ([
    { id: "n1", title: "외국인 24거래일 만에 순매수 전환… 반도체로 자금 집중", source: "네이버뉴스", ago: "32분 전", tag: "nu", tagText: "", tickers: [], summary: "", url: "#" },
    { id: "n2", title: "미국 물가 둔화 전망에 금리 인하 기대 커져", source: "네이버뉴스", ago: "1시간 전", tag: "nu", tagText: "", tickers: [], summary: "", url: "#" },
  ] as NewsItem[]);
  const idxBar = [{ n: "코스피", l: comma(kr[0]?.level || 8123.62), c: kr[0]?.chg ?? 4.63 }, { n: "나스닥", l: comma(us.find(x => x.name.includes("나스닥"))?.level || 25888), c: us.find(x => x.name.includes("나스닥"))?.chg ?? 0.3 }, { n: "VIX", l: String(vix), c: -9.0 }];
  const now = new Date();
  const openNS = (s: NStock) => openStock({ rank: s.rank, name: s.name, market: s.market, code: s.code, price: s.price, chg: s.chg, turnover: s.turnover, volume: s.volume, pos52: "", note: "", reason: `거래대금 ${s.turnover} · 시총 ${s.marketcap}`, spark: [], pro: false, profile: [], forecast: { trend: "", up: "", down: "" } } as Stock);

  const Step = ({ no, t, sub, children }: { no: number; t: string; sub?: string; children: ReactNode }) => (
    <section className="dl-sec"><div className="dl-step"><span className="dl-stepno">{no}</span><div className="dl-stept">{t}{sub && <em>{sub}</em>}</div></div>{children}</section>
  );
  const Sec = ({ t, sub, children }: { t: string; sub?: string; children: ReactNode }) => (
    <section className="dl-sec"><div className="dl-st">{t}{sub && <span>{sub}</span>}</div>{children}</section>
  );

  const storyCards: StoryCard[] = [
    { bg: "#142A63", tag: "밤사이 세계", k: "미국이 어땠는지부터", h: world[0].c >= 0 ? "밤사이, 미국이 올랐어요" : "밤사이, 미국이 내렸어요", big: `${world[0].n} ${sgn(world[0].c)}`, bc: world[0].c >= 0 ? "#FF7B86" : "#7FB0FF", sub: world[0].c >= 0 ? "미국이 오르면 우리 시장도 분위기를 이어받는 경우가 많아요." : "미국이 내리면 우리 시장도 조심스럽게 출발할 수 있어요." },
    { bg: "#122456", tag: "오늘 시장 점수", k: "그래서 오늘은?", h: `오늘 시장은 ${mood}`, big: `${score}점`, bc: "#FFC24D", sub: moodLine },
    { bg: "#18316E", tag: "무슨 일이", k: "오늘을 움직인 한 가지", h: inbox.length ? inbox[0].summary : ISSUES[0].tt, big: inbox.length ? inbox[0].from : "+3,260억", bc: "#FF7B86", sub: inbox.length ? "방금 도착한 소식이에요." : ISSUES[0].ez },
    { bg: "#142A63", tag: "돈의 흐름", k: "큰손이 사는 곳", h: "돈이 어디로 몰리나", big: `${flows[0]?.name ?? "삼성전자"} ${sgn(flows[0]?.chg ?? 8.5)}`, bc: "#FF7B86", sub: "오늘 거래대금 상위. 사람들의 관심이 가장 많이 쏠린 곳이에요." },
    { bg: "#122456", tag: "내 관심종목", k: "여기서부터 내 얘기", h: "내 종목을 담아두면요", big: "내 소식만 쏙", bc: "#7FB0FF", sub: "매일 아침, 내가 담은 종목 소식만 모아서 보여드려요." },
    { bg: "#18316E", tag: "오늘 일정", k: "놓치면 손해예요", h: "오늘 챙길 일정", big: CAL[1].t, bc: "#FFC24D", sub: `${CAL[1].ev} — 소비가 둔화됐는지가 오늘 밤 변수예요.` },
    { bg: "#142A63", tag: "주목 테마", k: "'사라' 아니라 '봐둬'", h: "오늘 주목할 테마예요", big: `${WATCH[0].name} ${sgn(WATCH[0].chg)}`, bc: "#FF7B86", sub: `${WATCH[0].why}. 관찰 포인트예요 (매수 권유 아님).` },
    { bg: "#122456", tag: "용어 한 입", k: "주린이 탈출", h: "오늘의 용어", big: TERMS[0].w, bc: "#7FB0FF", sub: TERMS[0].m },
    { bg: "#0F5C4A", tag: "끝", k: "수고했어요", h: "오늘 브리핑, 여기까지!", big: "5분이면 충분 ☕", bc: "#7FE3C4", sub: "내 종목 알림·실시간 시세는 PRO에서 이어볼 수 있어요.", end: true },
  ];

  return (
    <div className="dl" data-theme={theme}>
      <header className="dl-top">
        <div className="dl-wm">영웅스탁{pro && <i className="dl-pill">PRO</i>}</div>
        <div className="dl-idx">{idxBar.map(x => <span key={x.n}>{x.n} <b>{x.l}</b> <em className={cc(x.c)}>{sgn(x.c)}</em></span>)}</div>
        <button className="dl-theme" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>{theme === "dark" ? "☀️" : "🌙"}</button>
        <button className="dl-ico" onClick={() => setScreen("alarm")}>🔔</button>
        <button className="dl-ico" onClick={() => setScreen("my")}>👤</button>
      </header>

      <main className="dl-main">
        {tab === "today" && (view === "story"
          ? <Story cards={storyCards} onScroll={() => setView("scroll")} onPro={() => { setView("scroll"); setTab("prem"); }} />
          : <>
          <div className="dl-viewtoggle"><button onClick={() => setView("story")}><span className="ic">▶</span> 스토리로 보기</button></div>
          <div className="dl-hello">
            <div className="dl-greet">{now.getMonth() + 1}월 {now.getDate()}일 {wd[now.getDay()]} · 좋은 아침이에요 · v47</div>
            <h1 className="dl-htitle">오늘 아침,<br />시장을 5분이면 끝내요</h1>
          </div>

          <Step no={1} t="밤사이 세계" sub="미국이 어땠는지부터">
            <div className="dl-card2">{world.map(w => <div className="dl-irow" key={w.n}><span className="dl-in">{w.n}<em>{w.why}</em></span><span className="dl-iv">{comma(w.v)}</span><span className={"dl-badge " + cc(w.c)}>{sgn(w.c)}</span></div>)}</div>
            <p className="dl-note">💡 우리는 왜 미국부터 볼까요? 미국 증시가 먼저 끝나서, 우리 시장이 그 분위기를 이어받는 경우가 많거든요.</p>
          </Step>

          <Step no={2} t="그래서 오늘 우리 시장은?">
            <div className="dl-scorecard">
              <div className="dl-scrow"><div className="dl-scnum">{score}</div><div className="dl-scmood">{mood}</div></div>
              <div className="dl-scbar"><i style={{ width: score + "%" }} /></div>
              <p className="dl-scline">{moodLine}</p>
            </div>
          </Step>

          <Step no={3} t="무슨 일이 있었나" sub="오늘 시장을 움직인 3가지">
            <div className="dl-card2">{(inbox.length ? inbox.map((m, i) => ({ tag: m.from, tt: m.summary, ez: new Date(m.at).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) })) : ISSUES).map((s, i) => <div className="dl-issue" key={i}><div className="dl-issuet"><span className="dl-itag">{s.tag}</span>{s.tt}</div><div className="dl-issueez">{s.ez}</div></div>)}</div>
          </Step>

          <Step no={4} t="돈은 어디로 몰리나" sub="큰손이 사는 곳">
            <div className="dl-tabs">{FLOW_TABS.map(([k, l]) => <button key={k} className={flow === k ? "on" : ""} onClick={() => setFlow(k)}>{l}</button>)}</div>
            <div className="dl-rank">{flows.map(s => (
              <div className="dl-row" key={s.code} onClick={() => openNS(s)}>
                <span className="dl-logo" style={{ background: logoColor(s.name) }}>{s.name[0]}</span>
                <div className="dl-rb"><div className="dl-rn">{s.name}</div><div className="dl-rs">거래대금 {s.turnover}</div></div>
                <Spark data={s.spark!} up={s.chg >= 0} />
                <div className="dl-rp"><b>{comma(s.price)}</b><span className={"dl-badge " + cc(s.chg)}>{sgn(s.chg)}</span></div>
              </div>))}</div>
            <div className="dl-card2" style={{ marginTop: 12 }}>{SUPPLY.map(([n, v, up]) => <div className="dl-irow" key={n}><span className="dl-in">{n}</span><span className={"dl-iv " + (up ? "u" : "d")}>{v}</span></div>)}</div>
          </Step>

          <Step no={5} t="내 관심종목" sub="내가 담은 종목">
            <div className="dl-watchempty">아직 관심종목이 없어요<button className="dl-addbtn" onClick={() => setScreen("my")}>＋ 관심종목 추가하기</button><span>담아두면 매일 아침 내 종목 소식만 모아드려요</span></div>
          </Step>

          <Step no={6} t="오늘 챙길 일정" sub="놓치면 손해예요">
            <div className="dl-card2">{CAL.map((c, i) => <div className="dl-cev" key={i}><div className="dl-cwhen"><b>{c.d}</b><span>{c.t}</span></div><div className="dl-cb">{c.ev}</div><span className="dl-ctag">{c.tag}</span></div>)}</div>
          </Step>

          <Step no={7} t="주목할 종목·테마" sub="'사라'가 아니라 '봐둬'">
            <div className="dl-card2">{WATCH.map(w => <div className="dl-issue" key={w.name}><div className="dl-issuet"><span className={"dl-badge " + cc(w.chg)} style={{ marginRight: 8 }}>{sgn(w.chg)}</span>{w.name}</div><div className="dl-issueez">{w.why}</div></div>)}</div>
            <p className="dl-note">⚠️ 매수·매도 추천이 아니에요. 오늘 흐름에서 '관찰할 포인트'를 알려드리는 거예요.</p>
          </Step>

          <Step no={8} t="용어 한 입" sub="주린이 탈출">
            <div className="dl-termcard"><div className="dl-termw">{TERMS[term].w}</div><div className="dl-termm">{TERMS[term].m}</div><button className="dl-termnext" onClick={() => setTerm((term + 1) % TERMS.length)}>다른 용어 보기 ↻</button></div>
          </Step>

          <div className="dl-prolink" onClick={() => setTab("prem")}>
            <div><b>더 깊은 정보가 필요하면</b><span>내 종목 알림 · 수급 분석 · 실시간 시세는 PRO에서</span></div>
            <span className="dl-arw">›</span>
          </div>
        </>)}

        {tab === "stock" && <>
          <Step no={1} t="실시간 차트" sub="지금 시장에서 핫한 종목">
            <div className="dl-tabs">{FLOW_TABS.map(([k, l]) => <button key={k} className={flow === k ? "on" : ""} onClick={() => setFlow(k)}>{l}</button>)}</div>
            <div className="dl-rank">{flows.map(s => (
              <div className="dl-row" key={s.code} onClick={() => openNS(s)}>
                <span className="dl-logo" style={{ background: logoColor(s.name) }}>{s.name[0]}</span>
                <div className="dl-rb"><div className="dl-rn">{s.name}</div><div className="dl-rs">거래대금 {s.turnover} · 시총 {s.marketcap}</div></div>
                <Spark data={s.spark!} up={s.chg >= 0} />
                <div className="dl-rp"><b>{comma(s.price)}</b><span className={"dl-badge " + cc(s.chg)}>{sgn(s.chg)}</span></div>
              </div>))}</div>
          </Step>
          <Step no={2} t={picks.label} sub={picks.sublabel}>
            <div className="dl-rank">{(picks.picks || []).slice(0, 8).map((p: any) => (
              <div className="dl-row" key={p.code} onClick={() => openNS({ ...p, volume: "", spark: undefined } as NStock)}>
                <span className="dl-pickscore">{p.score}</span>
                <span className="dl-logo" style={{ background: logoColor(p.name) }}>{p.name[0]}</span>
                <div className="dl-rb"><div className="dl-rn">{p.name}</div><div className="dl-rs">{p.reason}</div></div>
                <div className="dl-rp"><b>{comma(p.price)}</b><span className={"dl-badge " + cc(p.chg)}>{sgn(p.chg)}</span></div>
              </div>))}</div>
            <p className="dl-fine">{picks.disclaimer}</p>
          </Step>
          <Step no={3} t="섹터 흐름" sub="어디가 강한가">
            <div className="dl-card2">{WATCH.map(w => <div className="dl-issue" key={w.name}><div className="dl-issuet"><span className={"dl-badge " + cc(w.chg)} style={{ marginRight: 8 }}>{sgn(w.chg)}</span>{w.name}</div><div className="dl-issueez">{w.why}</div></div>)}</div>
          </Step>
          <Step no={4} t="내 관심종목">
            <div className="dl-watchempty">아직 관심종목이 없어요<button className="dl-addbtn" onClick={() => setScreen("my")}>＋ 관심종목 추가하기</button></div>
          </Step>
        </>}

        {tab === "prem" && <>
          <div className="dl-hello"><h1 className="dl-htitle">PRO 안내</h1><p className="dl-hsub">오늘 시장 파악(밤사이 세계·점수·이슈·거래대금·일정·뉴스)은 <b>전부 무료</b>예요. PRO는 '내가 가진 종목'에 맞춘 정보를 더해줘요.</p></div>

          <Sec t="무료 vs PRO" sub="뭐가 다른지">
            <div className="dl-card2">
              <div className="dl-cmp"><span className="dl-cmpl">오늘의 시장 브리핑</span><span className="dl-free">무료</span></div>
              <div className="dl-cmp"><span className="dl-cmpl">지수·거래대금·뉴스·일정</span><span className="dl-free">무료</span></div>
              <div className="dl-cmp"><span className="dl-cmpl">내 관심종목 변화·공시 알림</span><span className="dl-prox">PRO</span></div>
              <div className="dl-cmp"><span className="dl-cmpl">수급 분석 · 관찰 종목</span><span className="dl-prox">PRO</span></div>
              <div className="dl-cmp"><span className="dl-cmpl">실시간 시세 · 재무 · 차트</span><span className="dl-prox">PRO</span></div>
            </div>
          </Sec>

          <Sec t="PRO가 더해주는 것" sub="결제하면 이게 열려요">
            <div className="dl-card2">
              <div className="dl-feat2"><b>1. 내 관심종목 심화</b>내가 담은 종목만 콕 집어, 밤사이 변화·수급·공시를 아침에 모아드려요.</div>
              <div className="dl-feat2"><b>2. 관찰 알고리즘</b>외국인·기관 수급이 쏠리는 종목을 매일 관찰해 보여드려요. (매수 권유 아님)</div>
              <div className="dl-feat2"><b>3. 실시간 시세 · 종목 심층</b>20분 지연을 풀고 재무·차트·공시까지 한 종목을 깊게 봐요.</div>
            </div>
          </Sec>

          <Sec t="요금제" sub="필요한 만큼만">
            <div className="dl-card2">{TIERS.map(t => <div className="dl-tier" key={t.p}><div className="dl-tierl"><b>{t.n}</b><em>{t.d}</em></div><div className="dl-tierp">{t.p === "무료" ? "무료" : t.p + "원"}</div></div>)}</div>
            <button className="dl-pro" onClick={onPro}>{pro ? "초보 모드로 돌아가기" : "고수 모드 — 전부 자세히 보기"}</button>
            <p className="dl-fine">영웅스탁 · 투자 참고용 정보입니다. 특정 종목 매수·매도 권유가 아니며, 최종 판단과 책임은 본인에게 있어요. 수치는 데모 예시입니다.</p>
          </Sec>
        </>}

        {tab === "more" && <>
          <Step no={1} t="나를 지키는 투자 원칙" sub="잃지 않는 게 먼저예요">
            <div className="dl-card2">{RULES.map((r, i) => <div className="dl-rule" key={i}><span className="dl-ruleic">{r.ic}</span><div className="dl-ruleb"><div className="dl-rulet">{r.t}</div><div className="dl-rulem">{r.m}</div></div></div>)}</div>
            <p className="dl-note">⚠️ 매매 신호나 종목 추천이 아니에요. 초보 투자자가 큰 손실을 피하도록 돕는 '습관 가이드'예요.</p>
          </Step>
          <Step no={2} t="매매 전 셀프 체크" sub="사기 전에 4가지만">
            <div className="dl-card2">{CHECK.map((c, i) => <div className="dl-check" key={i}><span className="dl-checkbox">✓</span>{c}</div>)}</div>
          </Step>
          <Step no={3} t="용어 사전" sub="주린이 필수">
            <div className="dl-card2">{TERMS.map(t => <div className="dl-issue" key={t.w}><div className="dl-issuet">{t.w}</div><div className="dl-issueez">{t.m}</div></div>)}</div>
          </Step>
          <Step no={4} t="증시 캘린더">
            <div className="dl-card2">{CAL.map((c, i) => <div className="dl-cev" key={i}><div className="dl-cwhen"><b>{c.d}</b><span>{c.t}</span></div><div className="dl-cb">{c.ev}</div><span className="dl-ctag">{c.tag}</span></div>)}</div>
          </Step>
          <Step no={5} t="지금 이슈">
            <div className="dl-card2">{news.slice(0, pro ? 8 : 4).map(n => <div className="dl-nrow" key={n.id} onClick={() => openNews(n)}><div className="dl-ntt">{n.title}</div><div className="dl-nmt">{n.source} · {n.ago}</div></div>)}</div>
          </Step>
          <Step no={6} t="설정">
            <div className="dl-card2">
              <button className="dl-mrow" onClick={() => setScreen("alarm")}>🔔 알림 설정</button>
              <button className="dl-mrow" onClick={() => setScreen("my")}>👤 내 정보</button>
              <button className="dl-mrow" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>{theme === "dark" ? "☀️ 라이트 테마" : "🌙 다크 테마"}</button>
            </div>
          </Step>
        </>}
      </main>

      <nav className="dl-nav">{NAV.map(([k, label, ic]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}><span className="ic">{ic}</span>{label}</button>)}</nav>

      {screen && <div className="dl-ovl">
        <header className="dl-ovltop"><button onClick={() => setScreen("")}>‹</button><b>{screen === "my" ? "MY" : screen === "alarm" ? "알림 설정" : "로그인"}</b><span /></header>
        <div className="dl-ovlbody">
          {screen === "my" && <>
            <div className="dl-myhead"><div className="dl-myav">영</div><div className="dl-myname">영웅_{Math.floor(10000 + score * 137)}<em>내 정보 관리 ›</em></div><button className="dl-myq" onClick={() => setScreen("login")}>로그인</button></div>
            <div className="dl-mybanner"><div><b>영웅스탁 프리미엄</b><span>1개월 무료 체험</span></div><div className="dl-mybot">🦸</div></div>
            <div className="dl-st" style={{ padding: "0 4px" }}>관심 종목</div>
            <div className="dl-card2"><button className="dl-mrow" style={{ textAlign: "center", color: "var(--accent)" }}>＋ 관심 종목 추가하기</button></div>
            <div className="dl-st" style={{ padding: "0 4px", marginTop: 18 }}>구독 내역</div>
            <div className="dl-empty">구독 내역이 없어요<button className="dl-pro" onClick={() => { setScreen(""); setTab("prem"); }}>프리미엄 보러가기</button></div>
          </>}
          {screen === "alarm" && <>
            <div className="dl-atabs">{["전체", "종목", "시황", "이벤트"].map((t, i) => <span key={t} className={i === 0 ? "on" : ""}>{t}</span>)}</div>
            {[["마케팅·이벤트 알림", "영웅스탁의 혜택·이벤트 알림을 받아요"], ["[관심종목] 변동 알림", "관심종목의 가격 변동 알림을 받아요"], ["[관심종목] 콘텐츠 알림", "관심종목의 새 소식 알림을 받아요"], ["[관찰 알고리즘] 알림", "수급이 쏠리는 종목·시황 알림을 받아요"]].map(([t, d], i) => (
              <div className="dl-acard" key={i}><div className="dl-ab"><div className="dl-at">{t}</div><div className="dl-ad">{d}</div></div><div className="dl-toggle on"><i /></div></div>
            ))}
            <p className="dl-fine">앱 버전 : 1.0.5 · 영웅스탁</p>
          </>}
          {screen === "login" && <div className="dl-login">
            <div className="dl-loginlogo">영웅스탁<span>HEROSTOCK</span></div>
            <div className="dl-loginsub">계정을 선택해 주세요</div>
            {[["카카오로 로그인", "#FEE500", "#1A1A1A", "💬"], ["네이버로 로그인", "#03C75A", "#fff", "N"], ["애플로 로그인", "#1A1A1A", "#fff", ""], ["구글로 로그인", "#fff", "#1A1A1A", "G"], ["이메일로 로그인", "#F0F1F9", "#1B2027", "✉️"]].map(([t, bg, fg, ic]) => (
              <button className="dl-loginbtn" key={t} style={{ background: bg, color: fg }} onClick={() => setScreen("")}><span>{ic}</span>{t}</button>
            ))}
            <div className="dl-loginfaq">＿ 회원 FAQ</div>
          </div>}
        </div>
      </div>}
    </div>
  );
}
