import { useState, useRef } from "react";

export type StoryCard = { tag: string; k: string; h: string; big: string; bc: string; sub: string; bg: string; end?: boolean };

export default function Story({ cards, onScroll, onPro }: { cards: StoryCard[]; onScroll: () => void; onPro: () => void }) {
  const [cur, setCur] = useState(0);
  const N = cards.length;
  const startX = useRef<number | null>(null);
  const go = (n: number) => setCur(Math.max(0, Math.min(N - 1, n)));

  const tap = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (e.clientX - r.left < r.width * 0.4) go(cur - 1); else go(cur + 1);
  };
  const ts = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const te = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx < -40) go(cur + 1); else if (dx > 40) go(cur - 1);
    startX.current = null;
  };

  const c = cards[cur];
  return (
    <div className="st-wrap">
      <div className="st-bars">{cards.map((_, i) => <span key={i} className={i <= cur ? "on" : ""} />)}</div>
      <button className="st-list" onClick={onScroll}>목록 ☰</button>
      <div className="st-stage" onClick={tap} onTouchStart={ts} onTouchEnd={te}>
        <div className="st-card" style={{ background: c.bg }} key={cur}>
          <div className="st-tag">{c.end ? c.tag : `${cur + 1} / ${N - 1} · ${c.tag}`}</div>
          <div className="st-k">{c.k}</div>
          <div className="st-h">{c.h}</div>
          <div className="st-big" style={{ color: c.bc }}>{c.big}</div>
          <div className="st-sub">{c.sub}</div>
          {c.end && <button className="st-cta" onClick={(e) => { e.stopPropagation(); onPro(); }}>PRO 보러가기</button>}
        </div>
        <div className="st-hint">{cur < N - 1 ? "탭하면 다음 →" : "다 봤어요 · 목록에서 다시 보기"}</div>
      </div>
    </div>
  );
}
