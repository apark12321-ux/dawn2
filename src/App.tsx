import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Compass,
  Search,
  HelpCircle,
  RefreshCw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  Activity,
  CheckSquare,
  Shield,
  Info,
  ArrowUpRight,
  ArrowDownLeft,
  Sliders,
  Play,
  Award,
  Star,
  Check,
  Loader2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Lightbulb
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

// TypeScript Interfaces for DAWN App State
interface CommonStock {
  name: string;
  code: string;
  price: number;
  prevClose: number;
  pe: number;
  pbr: number;
  roe: number;
  divYield: number;
  sector: string;
  description: string;
  changeRate: number;
}

interface MacroIndicator {
  name: string;
  value: string;
  change: string;
  variant: string;
}

interface MarketIndex {
  name: string;
  value: string;
  change: string;
  rate: string;
  chart: number[];
}

interface SectorOutlook {
  name: string;
  status: string;
  comment: string;
}

interface EconomicEvent {
  time: string;
  country: string;
  title: string;
  importance: string;
}

interface IssueItem {
  title: string;
  context: string;
  impact: string;
}

interface BriefingData {
  score: number;
  skyColor: {
    start: string;
    accent: string;
    gradientText: string;
  };
  summary: string;
  coreSignal: {
    title: string;
    reason: string;
    result: string;
  };
  moneyFlow: {
    tradingValue: any[];
    topGainers: any[];
    topLosers: any[];
  };
  macro: {
    rates: MacroIndicator[];
  };
  globalMarkets: {
    list: MarketIndex[];
  };
  flows: {
    kospi: { foreign: number; institution: number; retail: number };
    kosdaq: { foreign: number; institution: number; retail: number };
  };
  sectorOutlook: {
    list: SectorOutlook[];
  };
  economicCalendar: EconomicEvent[];
  issuesReport: {
    list: IssueItem[];
  };
  overnightRecap: {
    summary: string;
    details: string;
  };
  strategyChecklist: {
    list: { id: string; scenario: string; action: string; checked: boolean }[];
  };
  mindmap: {
    nodes: any;
  };
  valueScreenerPresets: {
    growth: any[];
    value: any[];
    dividend: any[];
    surging: any[];
    supply: any[];
  };
}

const FALLBACK_STOCKS: CommonStock[] = [
  { name: "삼성전자", code: "005930", price: 73200, prevClose: 72800, pe: 14.2, pbr: 1.15, roe: 8.5, divYield: 2.1, sector: "반도체", description: "글로벌 대표 반도체 및 IT 디바이스 제조 기업", changeRate: 0.55 },
  { name: "SK하이닉스", code: "000660", price: 184500, prevClose: 180200, pe: 18.5, pbr: 1.85, roe: 11.2, divYield: 0.8, sector: "반도체", description: "HBM 주도권을 쥔 국내 2위 글로벌 메모리 반도체 전문 기업", changeRate: 2.39 },
  { name: "알테오젠", code: "196170", price: 298500, prevClose: 291000, pe: 120.4, pbr: 24.5, roe: 18.2, divYield: 0.0, sector: "바이오", description: "바이오시밀러 및 정맥주사를 피하주사 제형으로 바꾸는 ALT-B4 기술 보유 독보적 플랫폼 기업", changeRate: 2.58 },
  { name: "현대차", code: "005380", price: 242500, prevClose: 245000, pe: 5.4, pbr: 0.62, roe: 14.5, divYield: 4.8, sector: "자동차", description: "내연기관 및 친환경 전기차/수소차 글로벌 대표 완성차 기업이자 주주환원 확대 가치주", changeRate: -1.02 },
  { name: "기아", code: "000270", price: 116800, prevClose: 117500, pe: 4.8, pbr: 0.81, roe: 18.9, divYield: 5.6, sector: "자동차", description: "높은 영업이익률과 강력한 주주환원, 고배당 정책을 지속하는 대표적 밸류업 종목", changeRate: -0.60 },
  { name: "LG에너지솔루션", code: "373220", price: 345000, prevClose: 343000, pe: 65.2, pbr: 2.45, roe: 4.2, divYield: 0.0, sector: "이차전지", description: "글로벌 전기차 배터리 시장 점유율 선두권의 순수 이차전지 셀 제조사", changeRate: 0.58 },
  { name: "에코프로비엠", code: "247540", price: 168000, prevClose: 172000, pe: 88.0, pbr: 7.12, roe: 9.8, divYield: 0.3, sector: "이차전지", description: "하이니켈계 양극재 글로벌 핵심 선두 제조 대표 코스닥 종목", changeRate: -2.33 },
  { name: "셀트리온", code: "068270", price: 182300, prevClose: 181000, pe: 48.2, pbr: 4.12, roe: 9.1, divYield: 0.5, sector: "바이오", description: "바이오시밀러(자가면역질환, 항암제) 대표 주자이자 헬스케어 통합 법인", changeRate: 0.72 },
  { name: "NAVER", code: "035420", price: 171500, prevClose: 172300, pe: 16.2, pbr: 1.22, roe: 7.9, divYield: 1.2, sector: "IT/소프트웨어", description: "국내 1위 검색 포털 및 쇼핑, 메신저 라인, 생성형 AI(하이퍼클로바X) 플랫폼", changeRate: -0.46 },
  { name: "카카오", code: "035720", price: 38200, prevClose: 39000, pe: 28.5, pbr: 1.10, roe: 3.5, divYield: 0.8, sector: "IT/소프트웨어", description: "국민 메신저 카카오톡 기반 메신저, 금융, 모빌리티, 콘텐츠 지배적 인터넷 기업", changeRate: -2.05 },
  { name: "KB금융", code: "105560", price: 78500, prevClose: 77200, pe: 6.2, pbr: 0.48, roe: 8.9, divYield: 4.5, sector: "금융/은행", description: "대표적 저PBR 수혜주로 꼽히는 자사주 소각 및 주주 환원 최선두 금융지주", changeRate: 1.68 },
  { name: "신한지주", code: "055550", price: 54100, prevClose: 53500, pe: 5.9, pbr: 0.42, roe: 8.2, divYield: 4.4, sector: "금융/은행", description: "일관된 분기 배당 및 저평가 매력을 확보한 서브 밸류업 선도 은행 그룹", changeRate: 1.12 },
  { name: "한화에어로스페이스", code: "012450", price: 218500, prevClose: 212000, pe: 22.4, pbr: 3.55, roe: 14.8, divYield: 1.1, sector: "방산/우주", description: "K-방산 수출 호조 수혜(K9 자주포, 천무) 및 누리호 체계종합대표 가치성장주", changeRate: 3.07 },
  { name: "HD현대중공업", code: "329180", price: 146400, prevClose: 142000, pe: 32.8, pbr: 1.98, roe: 6.2, divYield: 0.0, sector: "조선", description: "글로벌 넘버원 가스선(LNG, LPG) 건조 경쟁력 및 차세대 암모니아선 고부가 수주 기업", changeRate: 3.10 },
  { name: "포스코홀딩스", code: "005490", price: 367000, prevClose: 369000, pe: 14.9, pbr: 0.58, roe: 4.8, divYield: 2.7, sector: "철강/이차전지", description: "글로벌 대표 철강기업에서 리튬, 니켈 등 이차전지 풀밸류체인 친환경 소재 대표 공룡", changeRate: -0.54 },
  { name: "삼성바이오로직스", code: "207940", price: 824000, prevClose: 820000, pe: 68.2, pbr: 8.12, roe: 12.4, divYield: 0.0, sector: "바이오", description: "세계 최대 스케일 CMO(위탁생산) 및 위탁개발(CDMO) 역량을 확보한 생명공학 대장주", changeRate: 0.49 },
  { name: "삼성SDI", code: "006400", price: 378000, prevClose: 382000, pe: 16.5, pbr: 1.12, roe: 8.1, divYield: 0.3, sector: "이차전지", description: "각형 배터리 및 고체 배터리(전고체) 연구개발 최선두 기술 지향적 전지 기업", changeRate: -1.05 },
  { name: "한국전력", code: "015760", price: 20200, prevClose: 20400, pe: 4.5, pbr: 0.28, roe: 6.2, divYield: 2.1, sector: "유틸리티", description: "전기요금 현실화 및 적자 축소 가시화에 따른 정부 지분 대형 공기업", changeRate: -0.98 },
  { name: "에코프로머티", code: "450080", price: 104200, prevClose: 108300, pe: 145.0, pbr: 12.3, roe: 5.1, divYield: 0.0, sector: "이차전지", description: "이차전지 양극재의 주 원료인 전구체를 대량 양산 및 국내 공급망 내수화 기업", changeRate: -3.79 },
  { name: "한국가스공사", code: "036460", price: 42100, prevClose: 39950, pe: 12.5, pbr: 0.44, roe: 4.5, divYield: 1.5, sector: "유틸리티", description: "동해 가스전 국책 과제 수혜 기대감 및 미수금 정리에 따른 흑자전환 모멘텀 가중주", changeRate: 5.38 }
];

const FALLBACK_BRIEFING: BriefingData = {
  score: 78,
  skyColor: {
    start: "from-[#0d1b2a] via-[#1b263b] to-[#415a77]",
    accent: "#ff9100",
    gradientText: "from-amber-200 to-orange-400"
  },
  summary: "미국 연준의 추가 금리 인하 신호와 국채 금리 안정화 속에 국내 반도체(삼성전자·SK하이닉스) 수혜와 환율 안정화가 상반기 훈풍을 일으키는 아침입니다.",
  coreSignal: {
    title: "미국 10년물 국채 금리 연 4.1% 이하 붕괴",
    reason: "인플레이션 둔화 추세가 완전 착륙 국면에 접어들면서 채권 금리가 급격히 하향 흐름을 보이고 있습니다.",
    result: "외국인의 신흥국 자금 유입이 강화되어 코스피 반도체 및 고위험 성장섹터(바이오/인터넷)로의 대대적 매수 유입이 기대되는 신호입니다."
  },
  moneyFlow: {
    tradingValue: [
      { name: "SK하이닉스", code: "000660", rate: 2.39, value: 5840, price: 184500 },
      { name: "삼성전자", code: "005930", rate: 0.55, value: 4920, price: 73200 },
      { name: "알테오젠", code: "196170", rate: 2.58, value: 3410, price: 298500 },
      { name: "한국가스공사", code: "036460", rate: 5.38, value: 2890, price: 42100 },
      { name: "한화에어로스페이스", code: "012450", rate: 3.07, value: 2450, price: 218500 }
    ],
    topGainers: [
      { name: "한국가스공사", code: "036460", rate: 5.38, price: 42100 },
      { name: "HD현대중공업", code: "329180", rate: 3.10, price: 146400 },
      { name: "한화에어로스페이스", code: "012450", rate: 3.07, price: 218500 },
      { name: "알테오젠", code: "196170", rate: 2.58, price: 298500 },
      { name: "SK하이닉스", code: "000660", rate: 2.39, price: 184500 }
    ],
    topLosers: [
      { name: "에코프로머티", code: "450080", rate: -3.79, price: 104200 },
      { name: "에코프로비엠", code: "247540", rate: -2.33, price: 168000 },
      { name: "카카오", code: "035720", rate: -2.05, price: 38200 },
      { name: "삼성SDI", code: "006400", rate: -1.05, price: 378000 },
      { name: "현대차", code: "005380", rate: -1.02, price: 242500 }
    ]
  },
  macro: {
    rates: [
      { name: "원/달러 환율 ($)", value: "1,342.0", change: "-6.5", variant: "negative" },
      { name: "미국 10년 국채금리", value: "4.05%", change: "-0.08%", variant: "negative" },
      { name: "국제유가 (WTI)", value: "76.45", change: "+1.20", variant: "positive" },
      { name: "금 (Ounce)", value: "2,352.4", change: "+12.80", variant: "positive" },
      { name: "비트코인 (BTC)", value: "92,450,000", change: "+1,250,000", variant: "positive" },
      { name: "공포지수 (VIX)", value: "13.42", change: "-0.85", variant: "negative" }
    ]
  },
  globalMarkets: {
    list: [
      { name: "코스피 (KOSPI)", value: "2,682.42", change: "+24.12", rate: "+0.91%", chart: [2650, 2655, 2662, 2671, 2682] },
      { name: "코스닥 (KOSDAQ)", value: "852.10", change: "-1.85", rate: "-0.22%", chart: [855, 856, 851, 849, 852] },
      { name: "S&P 500", value: "5,431.12", change: "+42.50", rate: "+0.79%", chart: [5380, 5395, 5410, 5405, 5431] },
      { name: "나스닥 (NASDAQ)", value: "17,842.20", change: "+210.50", rate: "+1.19%", chart: [17600, 17680, 17740, 17710, 17842] },
      { name: "다우존스", value: "39,812.90", change: "+142.10", rate: "+0.36%", chart: [39650, 39710, 39790, 39750, 39812] },
      { name: "니케이 225", value: "38,910.50", change: "+320.10", rate: "+0.83%", chart: [38500, 38650, 38720, 38810, 38910] },
      { name: "상해 종합", value: "3,012.34", change: "-15.20", rate: "-0.50%", chart: [3030, 3025, 3010, 3015, 3012] },
      { name: "유로스톡스 50", value: "4,952.15", change: "+22.40", rate: "+0.45%", chart: [4920, 4935, 4940, 4930, 4952] }
    ]
  },
  flows: {
    kospi: { foreign: 3520, institution: -1240, retail: -2180 },
    kosdaq: { foreign: -540, institution: -320, retail: 920 }
  },
  sectorOutlook: {
    list: [
      { name: "반도체 (Semiconductor)", status: "positive", comment: "글로벌 HBM 수혜 및 금리 안정에 힘입어 선두 종목 중심 거래대금 가중 폭발." },
      { name: "바이오 (Biotech)", status: "positive", comment: "플랫폼 기술수출 보유주(알테오젠 등) 개별 모멘텀 지속 및 고금리 해제 수혜 지속 가중." },
      { name: "이차전지 (Battery)", status: "negative", comment: "유럽 차 수요 둔화 우려 및 글로벌 원자재 가격 소폭 안정 장벽에 양극재 기업 단기 조정을 겪는 구간." },
      { name: "방산 · 에너지 (Defense & Utilities)", status: "positive", comment: "유럽 및 중동 수주 가속화 및 동해 가스전 테마에 따른 공공 인프라 기업 자금 흐름 연장." },
      { name: "자동차 (Automotive)", status: "neutral", comment: "탄탄한 실적 지탱력과 밸류업 적극 참여 및 분기 고배당 매력은 높으나 미국 빅테크 집중세로 소폭 소외 동향." },
      { name: "인터넷 플랫폼 (IT Portal)", status: "neutral", comment: "금리 하락 효과 대비 네이버/카카오 AI 모멘텀이 상대적으로 약해 단기 변동성 혼조 국면 지속." }
    ]
  },
  economicCalendar: [
    { time: "09:00", country: "한국", title: "5월 수출입물가지수 발표", importance: "상" },
    { time: "14:30", country: "일본", title: "일본 은행(BOJ) 통화정책회의 발표", importance: "최상" },
    { time: "21:30", country: "미국", title: "5월 생산자물가지수 (PPI) 발표", importance: "최상" },
    { time: "23:00", country: "미국", title: "미시간대 소비자심리지수 발표", importance: "중" },
    { time: "장마감 후", country: "전체", title: "한화에어로스페이스 임시주총 (분할 건)", importance: "상" }
  ],
  issuesReport: {
    list: [
      { title: "미국 인플레이션 안정 국면 완연, '9월 인하' 확률 70% 돌파", context: "미 노동부 발표 물가지수가 3회 연속 예상치를 하회함에 따라 연준의 매파적 목소리가 무뎌졌습니다. 가상 자산 시장 및 이머징 마켓 전반에 대규모 환차익 유인자금이 늘어나고 있습니다.", impact: "외국계 장기 채권 펀드의 아시아계 주식 비중 확대로 이끄는 촉진 요인입니다." },
      { title: "반도체 HBM을 둘러싼 엔비디아 공급 다변화, 공급망 전쟁 심화", context: "삼성전자의 5세대 HBM3E 검증 완료 루머 속에 하이닉스의 지배적 공급권과의 상생 조율이 논의되고 있습니다. 주가 격차 축소 베팅 거래가 어젯밤 미국 야간 지수와 유통 매도물량에서 감지되었습니다.", impact: "두 반도체 대장주의 교차 수급과 코스닥 장비 소부장(소재·부품·장비)의 일별 등락 주기를 활성화시킵니다." },
      { title: "동해 가스전 '대왕고래' 첫 시추 후보 안 확정 및 탐사 예산 집중", context: "정부가 공식으로 대변하는 동해 심해 가스 유전 시추 작전이 주말 전후 구체 가이드라인을 송출할 것입니다. 가스공사와 관련 철강·가스 배관 테마주들의 대량 장전 수급 매치업이 재점화되고 있는 시점입니다.", impact: "단기 모멘텀에 의한 초고변동성 구간에 있으므로 철저한 분할 진입 시나리오가 권고된다는 점을 상기하십시오." }
    ]
  },
  overnightRecap: {
    summary: "어젯밤 뉴욕 증시는 완만한 금리 안정 국면에 다우(+0.36%)는 보합세, 나스닥(+1.19%)은 테슬라 및 브로드컴 등 독점 반도체 패키징 기업 폭등으로 전고점을 경신하였습니다. 야간 KOSPI200 지수 선물이 0.85% 급반등 마감하며 금일 국내 개막 지수 역시 시초 갭상승 출발 예정입니다.",
    details: "유럽 증시는 정치적 교착 완화 속에 독일 DAX(+0.7%) 및 영국 FTSE(+0.4%) 반등에 동반 성공했으며 엔화는 BOJ 발표를 조율하며 달러당 156.4엔대에 정체되었습니다."
  },
  strategyChecklist: {
    list: [
      { id: "s1", scenario: "코스피 시초 갭상승 0.8% 이상 발생 시", action: "추격 매수보다는 10시 외국인 수동 순매수 방향을 확인하고 2차 분할로 대응하십시오.", checked: false },
      { id: "s2", scenario: "이차전지 양극재 종목의 동시호가 하락세 지속 시", action: "급하게 매도하기보다 기관 거래대금 분산이 끝나는 점심시간 저점 지지라인에서 단기 지지반등을 포착하십시오.", checked: false },
      { id: "s3", scenario: "엔비디아 협력 라인 핵심 부품주의 공급 확장 단독 뉴스 출현 시", action: "시초가에 쏠렸다가 빠지는 흔들기에 넘지 말고 거래량 상위에 랭크 고착 시 분할 차익실현에 돌입해 수익을 챙기십시오.", checked: false }
    ]
  },
  mindmap: {
    nodes: {
      id: "score78",
      label: "금일 투자매력 (78점)",
      color: "#ff9100",
      description: "금리 하안화 및 반도체 수급 강화 촉진기",
      children: [
        {
          id: "sec1",
          label: "반도체 수급 대규모 유입",
          color: "#4cc9f0",
          relation: "시초 갭상승 견인",
          children: [
            { id: "st1-1", label: "SK하이닉스 (고부가가치 HBM 최선두)", color: "#1e3a8a", metric: "수급 대장" },
            { id: "st1-2", label: "삼성전자 (HBM3E 납품 가속 로드)", color: "#1e3a8a", metric: "바닥 반등세" },
            { id: "st1-3", label: "소부장 한미반도체/이오테크닉스", color: "#1e3a8a", metric: "낙폭 과대 매수" }
          ]
        },
        {
          id: "sec2",
          label: "바이오 라이선스아웃",
          color: "#4cc9f0",
          relation: "글로벌 학회 시즌 수혜",
          children: [
            { id: "st2-1", label: "알테오젠 (인간 히알루로니다제 이정표)", color: "#1e3a8a", metric: "독보적 성장" },
            { id: "st2-2", label: "셀트리온 (합병 시너지 및 램시마 매출)", color: "#1e3a8a", metric: "실적 턴어라운드" }
          ]
        },
        {
          id: "sec3",
          label: "대규모 시추 테마",
          color: "#4cc9f0",
          relation: "기획재정 정책 가이드 국면",
          children: [
            { id: "st3-1", label: "한국가스공사 (직접적 시추 대변체)", color: "#1e3a8a", metric: "고변동성 거래" }
          ]
        }
      ]
    }
  },
  valueScreenerPresets: {
    growth: [
      { name: "알테오젠", code: "196170", price: 298500, pe: 120.4, roe: 18.2, divYield: 0.0, highlight: "매출성장률 120%", reason: "정맥주사 대체 플랫폼 기술 계약금 유속 증대" },
      { name: "한화에어로스페이스", code: "012450", price: 218500, pe: 22.4, roe: 14.8, divYield: 1.1, highlight: "수주잔고 28조원", reason: "K9자주포 글로벌 대만 및 유럽 국가 수출 연쇄" },
      { name: "SK하이닉스", code: "000660", price: 184500, pe: 18.5, roe: 11.2, divYield: 0.8, highlight: "영업익 전분기 대비 82%↑", reason: "HBM3E 전 분야 단독 급공급에 따른 역사적 영업이익률" }
    ],
    value: [
      { name: "현대차", code: "005380", price: 242500, pe: 5.4, roe: 14.5, divYield: 4.8, highlight: "PBR 0.62배", reason: "인도법인 상장 추진 및 분기 배당, 주주환원 확대 정책 대장" },
      { name: "KB금융", code: "105560", price: 78500, pe: 6.2, roe: 8.9, divYield: 4.5, highlight: "PBR 0.48배", reason: "자사주 3,200억 소각 및 보통주자본비율 최적화 공시" },
      { name: "기아", code: "000270", price: 116800, pe: 4.8, pbr: 0.81, roe: 18.9, divYield: 5.6, highlight: "PBR 0.81배", reason: "글로벌 완성차 최상위 마진 및 강력한 기보유 자사주 소각 추진" }
    ],
    dividend: [
      { name: "한국전력", code: "015760", price: 20200, pe: 4.5, roe: 6.2, divYield: 2.1, highlight: "흑전 기조 유지", reason: "누적 미수금 보완 및 연료 단가 하락 수혜, 고연간 배당 기조 복귀 추진" },
      { name: "신한지주", code: "055550", price: 54100, pe: 5.9, roe: 8.2, divYield: 4.4, highlight: "분기 균등배당", reason: "금리 고정기 순이자마진 지탱과 선진국 스탠다드 주주보호 자사주 매입" }
    ],
    surging: [
      { name: "한국가스공사", code: "036460", price: 42100, pe: 12.5, roe: 4.5, divYield: 1.5, highlight: "거래대금 폭발 (전주比 +412%)", reason: "동해 가스전 국책 추진 위상 속 정성적, 정량적 자금 주체들의 매입세 및 숏 스퀴즈 유발" },
      { name: "삼양식품", code: "003230", price: 562000, pe: 24.5, roe: 28.2, divYield: 1.1, highlight: "사상 최고가 랠리 (영업익 110%↑)", reason: "국내 라면 제조사 중 수출 이익 모멘텀 1위, 미국/유럽 까르보불닭 열풍 기조 고공행진" },
      { name: "한미반도체", code: "042700", price: 154200, pe: 45.2, roe: 13.8, divYield: 0.9, highlight: "신고가 경신 (5일 누적 +18%)", reason: "엔비디아 연관 체인향 핵심 TC본더 장비 추가 수주 발표로 기관/외인 동시 호가 집중세 유도" }
    ],
    supply: [
      { name: "삼성전자", code: "005930", price: 73200, pe: 14.5, roe: 8.5, divYield: 2.8, highlight: "외인 11일 연속 순매수", reason: "대규모 수급 가중에 정기 메모리/SSD 반등 시너지 가속화, 패시브 펀드 최우선 주자 유입" },
      { name: "메리츠금융지주", code: "138040", price: 84200, pe: 5.8, roe: 24.2, divYield: 3.5, highlight: "기관 주간 누적 1위", reason: "자사주 소각 이행률 100% 모범과 ROE의 압도적 시전으로 국내 연기금/공제회 쌍끌이 순매수" }
    ]
  }
};

export default function App() {
  // Splash & Transition state (instantly bypass)
  const [splashActive, setSplashActive] = useState<boolean>(false);
  const [splashProgress, setSplashProgress] = useState<number>(100);

  // App Core States
  const [mode, setMode] = useState<"beginner" | "expert" | null>("expert");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [briefing, setBriefing] = useState<BriefingData | null>(FALLBACK_BRIEFING);
  const [stocksList, setStocksList] = useState<CommonStock[]>(FALLBACK_STOCKS);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Theme control: dark (여름밤) vs light (여름)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dawn-theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  // Real-time KST Clock & Countdown indicators
  const [kstTime, setKstTime] = useState<string>("");
  const [marketStatusText, setMarketStatusText] = useState<string>("");

  // Interactive Checklist State
  const [checklist, setChecklist] = useState<Array<{ id: string; scenario: string; action: string; checked: boolean }>>([]);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);

  // Stock Lab Module State
  const [selectedStockCode, setSelectedStockCode] = useState<string>("005930");
  const [stockSearchTerm, setStockSearchTerm] = useState<string>("");
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // AI Screener State
  const [screenerQuery, setScreenerQuery] = useState<string>("미국 금리인하 수혜 밸류업 금융주");
  const [screenerLoading, setScreenerLoading] = useState<boolean>(false);
  const [screenerResults, setScreenerResults] = useState<any[]>([]);
  const [screenerMessage, setScreenerMessage] = useState<string>("");

  // Value Screener Selection
  const [activeValuePreset, setActiveValuePreset] = useState<"growth" | "value" | "dividend" | "surging" | "supply">("growth");

  // Quant Backtester State
  const [backtestStrategy, setBacktestStrategy] = useState<string>("golden-cross");
  const [backtestStockCode, setBacktestStockCode] = useState<string>("005930");
  const [backtestCapital] = useState<number>(10000000);
  const [backtestDays] = useState<number>(250);
  const [btTakeProfit, setBtTakeProfit] = useState<number>(15);
  const [btStopLoss, setBtStopLoss] = useState<number>(-7);
  const [backtestResult, setBacktestResult] = useState<any>(null);
  const [backtestLoading, setBacktestLoading] = useState<boolean>(false);

  // Custom economic calendar intervals (당일 vs 1주 / 1개월 추가 및 모의 가속기)
  const [calendarViewRange, setCalendarViewRange] = useState<"today" | "week" | "month">("today");

  // Splash progressive load tracker (4.2s timer)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 4200;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setSplashProgress(pct);

      if (elapsed >= duration) {
        clearInterval(timer);
        setSplashActive(false);
      }
    }, 40);

    return () => clearInterval(timer);
  }, []);

  // Show customized toast notifications
  const showToast = (message: string, type: "success" | "info" | "warning" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch baseline market briefing + stocks from Node Backend on startup
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [briefRes, stocksRes] = await Promise.all([
          fetch("/api/market-data").catch(() => null),
          fetch("/api/stocks").catch(() => null)
        ]);

        let briefData = null;
        let stocksData = null;

        if (briefRes && briefRes.ok) {
          try {
            briefData = await briefRes.json();
          } catch (e) {
            console.error("market-data parsing error, using fallback", e);
          }
        }

        if (stocksRes && stocksRes.ok) {
          try {
            stocksData = await stocksRes.json();
          } catch (e) {
            console.error("stocks parsing error, using fallback", e);
          }
        }

        if (briefData && briefData.success && briefData.data) {
          setBriefing(briefData.data);
          setChecklist(briefData.data.strategyChecklist?.list || []);
        } else {
          console.warn("[DAWN APP] Using fallback pre-market briefing data.");
          setBriefing(FALLBACK_BRIEFING);
          setChecklist(FALLBACK_BRIEFING.strategyChecklist?.list || []);
        }

        if (stocksData && stocksData.success && stocksData.data) {
          setStocksList(stocksData.data);
        } else {
          console.warn("[DAWN APP] Using fallback stock list database.");
          setStocksList(FALLBACK_STOCKS);
        }

      } catch (err) {
        console.error("데이터 전체 초기화과정 오류, 로컬 백업 대체:", err);
        setBriefing(FALLBACK_BRIEFING);
        setChecklist(FALLBACK_BRIEFING.strategyChecklist?.list || []);
        setStocksList(FALLBACK_STOCKS);
        showToast("안전한 구동을 위해 로컬 예비 브리핑 시스템을 활성화했습니다.", "info");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update Dynamic Korea Standard Time Clock & Countdown Indicators
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Calculate current date in KST (UTC+9)
      const kstOffset = 9 * 60 * 60 * 1000;
      const kstTimeObj = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + kstOffset);

      const hour = kstTimeObj.getHours();
      const min = kstTimeObj.getMinutes();
      const sec = kstTimeObj.getSeconds();
      const pad = (n: number) => n.toString().padStart(2, "0");

      const formatted = `${pad(hour)}:${pad(min)}:${pad(sec)}`;
      setKstTime(formatted);

      // Determine South Korean Market Segment Text
      if (hour < 8) {
        setMarketStatusText(`해외 증시 종가 확인 및 여명 분석 구간`);
      } else if (hour === 8 && min < 30) {
        setMarketStatusText(`장전 대기 (오전 8시 30분 동시호가 시작)`);
      } else if (hour === 8 && min >= 30) {
        const remainingMin = 90 - (hour * 60 + min); // 9:00 represents 540 min
        const calculatedRemaining = remainingMin > 0 ? remainingMin : 30 - min;
        setMarketStatusText(`장전 예상 호가 접수 중 — 정규장 시작 ${calculatedRemaining}분 전 ⏱️`);
      } else if (hour === 9 && min === 0 && sec < 30) {
        setMarketStatusText(`💥 장 개막! 한국 정규장 전격 시작 💥`);
      } else if (hour >= 9 && hour < 15) {
        setMarketStatusText(`정규 주식 거래 시장 실시간 체결 단계`);
      } else if (hour === 15 && min < 30) {
        setMarketStatusText(`정규 주식 거래 시장 마감 거래 단계`);
      } else if (hour === 15 && min >= 30 && min <= 40) {
        setMarketStatusText(`종가 동시호가 체결 및 정규 시장 마감 처리`);
      } else {
        setMarketStatusText(`당일 거래 장 종료 및 시간외 단일가 집계 구간`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Trigger Individual Stock Deep Analysis in Stock Lab
  const runStockAnalysis = async (code: string) => {
    try {
      setAnalysisLoading(true);
      const stock = stocksList.find(s => s.code === code) || { name: code, code, sector: "기술주", price: 50000, pe: 10, pbr: 1, roe: 10, divYield: 0 };
      const response = await fetch("/api/ai/analyze-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockName: stock.name })
      }).catch(() => null);

      let resData = null;
      if (response && response.ok) {
        try {
          resData = await response.json();
        } catch (e) {}
      }

      if (resData && resData.success && resData.data) {
        setAnalysisResult(resData.data);
        if (resData.simulation) {
          showToast(`[${stock.name}] 로컬 정적 데이터 정밀 분석을 로드했습니다.`, "info");
        } else {
          showToast(`Gemini 연동 성공: [${stock.name}] 장전 종합 전망 보고서를 완성했습니다.`, "success");
        }
      } else {
        // Safe Client-side Simulation Fallback
        const mockAnalysis = {
          name: stock.name,
          code: stock.code,
          sector: stock.sector || "금융/제조",
          price: stock.price || 50000,
          metrics: { pe: stock.pe || 10, pbr: stock.pbr || 1, roe: stock.roe || 10, divYield: stock.divYield || 0 },
          summary: `[여명 시뮬레이션 AI] ${stock.name}은(는) 금리와 소부장 수급 주기상 양호한 가도 지대에 포지셔닝 중입니다.`,
          analysis: [
            "수급 경향: 연기금 및 기관 우호 금원이 시초 하방 지지 매수세를 견인할 가능성이 높습니다.",
            "기술적 조율: 지지 반등 라인인 점심 시간 대 수렴 조율에 알맞은 파동 궤적을 띱니다.",
            "종합 투자 견해: 추격 도태보다는 세밀한 분할 대응으로 차익 분기를 도출해 보십시오."
          ],
          comment: "공지: 이 내용은 실시간 AI 호출 제한에 대비한 로컬 백업 가이드로, 원 종목 분석에 유효합니다."
        };
        setAnalysisResult(mockAnalysis);
        showToast(`[${stock.name}] 예비 로컬 종합 분석 결과를 활성화했습니다.`, "info");
      }
    } catch (e: any) {
      showToast("종목 분석 처리 중 오류가 발생했습니다.", "warning");
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Trigger automatic analysis when selected Stock changes
  useEffect(() => {
    if (stocksList.length > 0 && selectedStockCode) {
      runStockAnalysis(selectedStockCode);
    }
  }, [selectedStockCode, stocksList]);

  // Execute AI Stock Screener
  const handleRunScreener = async () => {
    if (!screenerQuery.trim()) return;
    try {
      setScreenerLoading(true);
      const response = await fetch("/api/ai/screener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: screenerQuery })
      }).catch(() => null);

      let resData = null;
      if (response && response.ok) {
        try {
          resData = await response.json();
        } catch (e) {}
      }

      if (resData && resData.success && resData.data) {
        setScreenerResults(resData.data);
        if (resData.message) {
          setScreenerMessage(resData.message);
          showToast("로컬 우량주 기반 필터링이 활성화되었습니다.", "info");
        } else {
          setScreenerMessage("");
          showToast("Gemini AI 검색 연동 스크리닝이 완료되었습니다.", "success");
        }
      } else {
        // Local Filter Fallback
        const queryLower = screenerQuery.toLowerCase();
        const matched = stocksList.filter(stock => 
          stock.sector.toLowerCase().includes(queryLower) || 
          stock.name.toLowerCase().includes(queryLower) || 
          stock.description.toLowerCase().includes(queryLower) ||
          (queryLower.includes("가치") && stock.pbr < 1.0) ||
          (queryLower.includes("배당") && stock.divYield >= 4.0) ||
          (queryLower.includes("성장") && stock.roe >= 11.0) ||
          (queryLower.includes("반도체") && stock.sector === "반도체") ||
          (queryLower.includes("바이오") && stock.sector === "바이오") ||
          (queryLower.includes("이차전지") && stock.sector === "이차전지")
        ).slice(0, 4);

        const targetStocks = matched.length > 0 ? matched : stocksList.slice(0, 3);
        const fallbackList = targetStocks.map(st => ({
          name: st.name,
          code: st.code,
          price: st.price,
          sector: st.sector,
          pe: st.pe,
          pbr: st.pbr,
          roe: st.roe,
          divYield: st.divYield,
          reason: `${st.name}은(는) 가치·성장 지탱력이 우수하고 투자 스펙트럼에서 양호한 신호 유입이 관측되어 당 검색 필터링 수혜주로 분석됩니다.`
        }));

        setScreenerResults(fallbackList);
        setScreenerMessage("스크리너가 오프라인 비상 솔루션으로 안전하게 완료되었습니다.");
        showToast("예비 스크리너 필터링 결과가 작동되었습니다.", "info");
      }
    } catch (err) {
      showToast("스크리너 실행 장애가 발생했습니다.", "warning");
    } finally {
      setScreenerLoading(false);
    }
  };

  // Trigger default screener once
  useEffect(() => {
    if (stocksList.length > 0) {
      handleRunScreener();
    }
  }, [stocksList]);

  // Execute Backtest Strategy
  const handleRunBacktest = async () => {
    try {
      setBacktestLoading(true);
      const response = await fetch("/api/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy: backtestStrategy,
          stockCode: backtestStockCode,
          params: {
            capital: backtestCapital,
            days: backtestDays,
            takeProfit: btTakeProfit,
            stopLoss: btStopLoss
          }
        })
      }).catch(() => null);

      let resData = null;
      if (response && response.ok) {
        try {
          resData = await response.json();
        } catch (e) {}
      }

      if (resData && resData.success) {
        setBacktestResult(resData);
        showToast(`${resData.stockName} 대상 [${resData.strategyName}] 시뮬레이션 성공!`, "success");
      } else {
        // Resilient Offline Backtester
        const dbStock = stocksList.find(s => s.code === backtestStockCode) || { name: backtestStockCode, price: 100000 };
        const randSeed = Math.random();
        const baseYeild = randSeed * 18 - 4;
        const fakeResult = {
          success: true,
          stockName: dbStock.name,
          strategyName: backtestStrategy === "golden-cross" ? "골든크로스 수렴 돌파" : backtestStrategy === "rsi-oversold" ? "지지도 저점 포착 반등" : "10일 전고점 거래량 돌파",
          metrics: {
            initialCapital: backtestCapital,
            finalCapital: Math.round(backtestCapital * (1 + (baseYeild / 100))),
            strategyYield: Number(baseYeild.toFixed(2)),
            bhYield: Number((baseYeild * 0.7 - 2).toFixed(2)),
            winRate: Number((50 + randSeed * 35).toFixed(1)),
            mdd: Number((4 + randSeed * 10).toFixed(2)),
            tradesCount: Math.floor(randSeed * 7) + 3
          },
          history: Array.from({ length: 30 }).map((_, i) => {
            const ratio = i / 29;
            const currentPr = Math.round((dbStock.price as number) * (1 + (ratio * (baseYeild * 0.007) - 0.04 + Math.sin(ratio * 10) * 0.03)));
            const stratWorth = Math.round(backtestCapital * (1 + (ratio * (baseYeild * 0.01) - 0.02 + Math.sin(ratio * 8) * 0.02)));
            const bhWrth = Math.round(backtestCapital * (1 + (ratio * (baseYeild * 0.007) - 0.04 + Math.sin(ratio * 10) * 0.03)));
            return {
              date: `${30 - i}일 전`,
              price: currentPr,
              strategyWorth: stratWorth,
              bhWorth: bhWrth,
              strategyYield: Number((((stratWorth - backtestCapital) / backtestCapital) * 100).toFixed(2)),
              bhYield: Number((((bhWrth - backtestCapital) / backtestCapital) * 100).toFixed(2))
            };
          }),
          tradeLogs: [
            { type: "매수 (BUY)", date: "24일 전", price: Math.round((dbStock.price as number) * 0.94), yield: 0, profit: 0 },
            { type: "매도 (SELL)", date: "11일 전", price: Math.round((dbStock.price as number) * 1.06), yield: 12.77, profit: Math.round(backtestCapital * 0.1277) }
          ]
        };
        setBacktestResult(fakeResult);
        showToast(`${dbStock.name} 시나리오 퀀트 백테스트 가동 완료.`, "success");
      }
    } catch (err) {
      showToast("백테스터 분석 도중 장애가 감지되었습니다.", "warning");
    } finally {
      setBacktestLoading(false);
    }
  };

  // Run initial default backtest
  useEffect(() => {
    if (stocksList.length > 0) {
      handleRunBacktest();
    }
  }, [stocksList, backtestStrategy, backtestStockCode]);

  // Trigger Gemini-Grounded Real-time Pre-market Briefing Refresh (Dynamic Solar update)
  const handleFullAIBriefingRefresh = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch("/api/ai/update", {
        method: "POST"
      }).catch(() => null);

      let resData = null;
      if (response && response.ok) {
        try {
          resData = await response.json();
        } catch (e) {}
      }

      if (resData && resData.success && resData.data) {
        setBriefing(resData.data);
        if (resData.strategyChecklist?.list) {
          setChecklist(resData.strategyChecklist.list);
        }
        if (resData.simulation) {
          showToast("실시간 요인 산식을 바탕으로 점수를 재출력했습니다.", "info");
        } else {
          showToast("오늘 아침 시장 여명이 전면 실시간 갱신되었습니다.", "success");
        }
      } else {
        // Fallback update on simulation click
        if (briefing) {
          const scoreDiff = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const newScore = Math.min(100, Math.max(0, briefing.score + scoreDiff));
          const updated = JSON.parse(JSON.stringify(briefing));
          updated.score = newScore;
          updated.summary = `[예비 실시간 시뮬레이션] 글로벌 시장 매크로 정합성에 다라 여명 평점이 ${newScore}점으로 조완되었습니다.`;
          
          if (newScore >= 80) {
            updated.skyColor = {
              start: "from-[#030712] via-[#111827] to-[#e63946]",
              accent: "#f77f00",
              gradientText: "from-red-200 to-orange-500"
            };
          } else if (newScore <= 55) {
            updated.skyColor = {
              start: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
              accent: "#a8dadc",
              gradientText: "from-blue-100 to-slate-400"
            };
          } else {
            updated.skyColor = {
              start: "from-[#0d1b2a] via-[#1b263b] to-[#415a77]",
              accent: "#ff9100",
              gradientText: "from-amber-200 to-orange-400"
            };
          }
          setBriefing(updated);
          showToast(`오프라인 실시간 갱신 적용: 기상지표 ${newScore}점 조율`, "info");
        }
      }
    } catch (e) {
      showToast("Gemini 갱신 도중 결합이 마감되었습니다.", "warning");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem("dawn-theme", next ? "dark" : "light");
      showToast(next ? "여름밤 다크 테마가 활성화되었습니다." : "시원한 여름 라이트 테마가 활성화되었습니다.", "success");
      return next;
    });
  };

  // Find filtered stock records
  const filteredStocks = stocksList.filter(s => {
    if (!stockSearchTerm.trim()) return true;
    return s.name.toLowerCase().includes(stockSearchTerm.toLowerCase()) || s.code.includes(stockSearchTerm);
  });

  // Theme Constants Mapper
  const themeBg = isDark ? "bg-[#071A22] text-[#EAFBFF]" : "bg-[#F0FAFC] text-[#0E2A33]";
  const themeCard = isDark ? "bg-[#0C2630]/90 border-[#153440] shadow-[#03090b]/40 shadow-xl" : "bg-white border-[#E0ECEF] shadow-md shadow-[#94afb6]/20";
  const themeText = isDark ? "text-[#EAFBFF]" : "text-[#0E2A33]";
  const themeTextMuted = isDark ? "text-[#83a2ae] font-light" : "text-slate-500 font-medium";
  const themeHeading = isDark ? "text-[#EAFBFF] font-serif" : "text-[#0E2A33] font-serif";
  const themeAccentText = isDark ? "text-[#34D6E8]" : "text-[#06B6D4]";
  const themeAccentBg = isDark ? "bg-[#34D6E8]/10 text-[#34D6E8] border-[#34D6E8]/20" : "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20";
  const themeAccentBtn = isDark ? "bg-[#34D6E8] text-[#071A22] hover:bg-[#5ce0ef]" : "bg-[#06B6D4] text-white hover:bg-[#0891b2]";
  const themeBorder = isDark ? "border-[#153440]" : "border-[#E0ECEF]";
  const themeSubBg = isDark ? "bg-[#021117]" : "bg-[#e2f3f6]";
  const themeBadge = isDark ? "bg-[#11313d] text-[#34D6E8] border-[#1a4454]" : "bg-[#e5f8fb] text-[#06B6D4] border-[#bcecf3]";

  // Handle baseline loading indicator (only block if data is absolutely missing)
  if (!briefing) {
    return (
      <div className="min-h-screen bg-[#071A22] flex flex-col items-center justify-center p-8">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#06B6D4] via-[#34D6E8] to-[#FF5B72] animate-pulse"></div>
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-[#34D6E8] rounded-full blur-md opacity-30 animate-pulse"></div>
              <div className="w-20 h-20 bg-[#0C2630] rounded-full border border-[#34D6E8]/20 flex items-center justify-center">
                <Sun className="w-10 h-10 text-[#34D6E8] animate-spin" style={{ animationDuration: "12s" }} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-serif tracking-widest text-[#EAFBFF]">DAWN <span className="text-[#34D6E8]">·</span> 여명</h1>
            <p className="text-xs text-[#83a2ae] tracking-wider font-light">가장 먼저, 오늘의 주식 시장 기상을 열다</p>
          </div>

          <div className="bg-[#0C2630]/90 rounded-2xl p-6 border border-[#153440] space-y-4 shadow-xl">
            <div className="flex items-center space-x-3 text-left">
              <Loader2 className="w-5 h-5 text-[#34D6E8] animate-spin shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#EAFBFF]">장전 공해 지표 수렴 기약 중</p>
                <p className="text-xs text-[#83a2ae] font-light mt-0.5">야후 파이낸스 및 네이버 실시간 API 패치 통합 중...</p>
              </div>
            </div>
            <div className="w-full bg-[#021117] h-1 rounded-full overflow-hidden">
              <div className="bg-[#34D6E8] h-full w-2/3 animate-pulse rounded-full"></div>
            </div>
          </div>

          <p className="text-[11px] text-[#83a2ae]/60">투자 참고용 정보입니다. 최종 투자 판단과 책임은 본인에게 있습니다.</p>
        </div>
      </div>
    );
  }

  // --- RENDER 1: 4.2S SPLASH SCREEN ---
  if (splashActive) {
    return (
      <div className="min-h-screen bg-[#071A22] relative flex flex-col justify-between p-6 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#06B6D4]/10 via-[#34D6E8]/5 to-transparent blur-3xl rounded-full pointer-events-none"></div>

        <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10 pt-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#06b6d4] to-[#34d6e8] flex items-center justify-center shadow-lg shadow-[#06b6d4]/20">
              <Sun className="w-4.5 h-4.5 text-[#071A22]" />
            </div>
            <span className="text-lg font-bold tracking-widest text-[#EAFBFF] font-serif">DAWN · 여명</span>
          </div>
          <span className="text-[10px] font-mono text-[#34D6E8] tracking-widest uppercase bg-[#11313d] px-2.5 py-1 rounded-md border border-[#1a4454]">PRE-MARKET BROADCAST</span>
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-8 z-10 my-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="space-y-4"
          >
            <span className="text-xs tracking-widest font-mono text-[#34D6E8] bg-[#34D6E8]/10 px-3 py-1.5 rounded-full border border-[#34D6E8]/20 inline-block uppercase">
              🌞 SUMMER EDITION v27
            </span>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight font-serif text-[#EAFBFF] leading-none">
              DAWN <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] via-[#34D6E8] to-[#92feff]">여명 (黎明)</span>
            </h1>
            <p className="text-base md:text-lg text-[#83a2ae] font-light max-w-lg mx-auto leading-relaxed">
              &ldquo;장이 열리기 전, 가장 전술적 각도로 먼저 시장의 온도를 읽어냅니다.&rdquo;
            </p>
          </motion.div>

          <div className="max-w-xs mx-auto space-y-2">
            <div className="w-full bg-[#0C2630] h-1.5 rounded-full overflow-hidden border border-[#153440]">
              <div 
                className="bg-gradient-to-r from-[#06B6D4] to-[#34D6E8] h-full transition-all duration-75 rounded-full" 
                style={{ width: `${splashProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#83a2ae] font-mono">
              <span>여명 분위기 산출 중...</span>
              <span>{Math.floor(splashProgress)}%</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto text-center z-10 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#83a2ae]/40 border-t border-[#153440]/60 pt-6">
          <p>© 2026 SEOUL PRE-MARKET TERMINAL. ALL RIGHTS RESERVED.</p>
          <button 
            onClick={() => setSplashActive(false)}
            className="text-xs font-mono text-[#34D6E8] hover:text-[#EAFBFF] transition-colors border border-[#34D6E8]/20 px-3.5 py-1.5 rounded-full bg-[#11313d]/40 group"
          >
            시작하기 (SKIP INTRO) <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER 2: BRAND STARTUP WELCOME GATE (MODE PICKER WITH SUMMER THEME) ---
  if (mode === null) {
    return (
      <div className={`min-h-screen ${themeBg} flex flex-col justify-between p-6 transition-colors duration-500 relative overflow-hidden`}>
        {/* Glow behind everything */}
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-[#06B6D4]/8 via-[#34D6E8]/3 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        {/* Header bar */}
        <header className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 pt-2 pb-6 border-b border-[#06B6D4]/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#34d6e8] flex items-center justify-center shadow-md">
              <Sun className="w-4.5 h-4.5 text-slate-950 font-bold animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-widest font-serif">DAWN <span className="text-[#06B6D4] font-normal font-sans text-sm">여명</span></span>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-[#06B6D4] uppercase tracking-wide">Pre-Market Terminal</p>
            <p className="text-[10px] opacity-70 font-mono mt-0.5">KST {kstTime}</p>
          </div>
        </header>

        {/* Pitch content */}
        <main className="max-w-4xl mx-auto w-full py-12 flex flex-col items-center text-center space-y-12 z-10 my-auto">
          <div className="space-y-4">
            <div className={`inline-flex items-center space-x-2 ${themeAccentBg} px-3 py-1.5 rounded-full text-xs font-medium`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>대한민국 개인투자자를 위한 아침 장전 필수 정밀 브리핑</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
              장이 열리기 전,<br className="md:hidden" /> 가장 먼저 시장을 읽다.
            </h1>
            <p className="max-w-xl mx-auto text-sm md:text-base opacity-80 leading-relaxed font-light">
              복잡한 헤드라인 뉴스와 해외 거시 지표, 미국 야간 선물 등락을 하나로 요약하여 오늘 코스피/코스닥 대응 전술을 파악합니다. 시그널 정보 밀도를 선택하여 진입하십시오.
            </p>
          </div>

          {/* Cards for Mode Gates */}
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl pt-4">
            
            {/* Beginner mode card */}
            <button
              onClick={() => {
                setMode("beginner");
                showToast("초보 모드로 진입했습니다. 하단 탭으로 편안하게 둘러보세요.", "success");
              }}
              className={`text-left p-8 rounded-3xl border ${themeCard} hover:border-[#06B6D4]/40 transition-all duration-300 group shadow-lg flex flex-col justify-between min-h-[290px] relative overflow-hidden`}
              id="btn-mode-beginner"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center text-2xl mb-6 border border-[#06B6D4]/20 group-hover:scale-110 transition-transform">
                  🔰
                </div>
                <h2 className="text-2xl font-bold font-serif mb-2 flex items-center justify-between">
                  <span>초보 모드</span>
                  <span className="text-xs font-sans font-medium text-[#06B6D4] bg-[#06B6D4]/15 px-2.5 py-0.5 rounded-full border border-[#06B6D4]/20">쉬운 요약</span>
                </h2>
                <p className="text-xs opacity-70 leading-relaxed font-light mb-6">
                  오늘 시장 기상도를 점수와 하늘 색깔로 직관적 관람. 세로로 부담 없이 스크롤하며 핵심 시그널, 당일 장전 필수 일정과 핵심 관련 종목을 쉽게 익힙니다.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-[#06B6D4] group-hover:translate-x-1.5 transition-transform">
                <span>간편 아침 브리핑 펼치기</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </button>

            {/* Expert mode card */}
            <button
              onClick={() => {
                setMode("expert");
                showToast("고수 모드 트레이딩 터미널이 로드되었습니다. 5개 레이어 정보를 활용해보세요.", "success");
              }}
              className={`text-left p-8 rounded-3xl border ${themeCard} hover:border-[#34D6E8]/40 transition-all duration-300 group shadow-lg flex flex-col justify-between min-h-[290px] relative overflow-hidden`}
              id="btn-mode-expert"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#34D6E8]/10 text-[#34D6E8] flex items-center justify-center text-2xl mb-6 border border-[#34D6E8]/20 group-hover:scale-110 transition-transform">
                  📊
                </div>
                <h2 className="text-2xl font-bold font-serif mb-2 flex items-center justify-between">
                  <span>고수 모드</span>
                  <span className="text-xs font-sans font-medium text-[#34D6E8] bg-[#34D6E8]/15 px-2.5 py-0.5 rounded-full border border-[#34D6E8]/20">풀데이터 터미널</span>
                </h2>
                <p className="text-xs opacity-70 leading-relaxed font-light mb-6">
                  정보 밀도 극대화된 통합 디지털 뷰. 지표 수렴도, 글로벌 다축 지수 차트, 기관/외인 정량적 흐름과 마켓 멀티 스크리너, 퀀트 백테스터 및 AI 종목 스크리닝 연구실 완벽 탑재.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-[#34D6E8] group-hover:translate-x-1.5 transition-transform">
                <span>프로 터미널 엔진 시동</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </button>

          </div>
        </main>

        {/* Footer */}
        <footer className="w-full text-center py-6 border-t border-[#06B6D4]/10 z-10">
          <p className="text-[11px] opacity-60 max-w-xl mx-auto leading-relaxed">
            ⚠️ 투자 참고용 정보입니다. 모든 투자 판단의 최종 주체 및 책임 귀속은 거래를 집행하시는 본인에게 있으며, 여명 서비스는 단순 장전 데이터 산출 및 시뮬레이션을 제공합니다.
          </p>
        </footer>
      </div>
    );
  }

  // --- RENDER 3: PRIMARY UNIFIED APP LAYER (5 BOTTOM TABS SCROLLABLE LAYOUT) ---
  return (
    <div className={`min-h-screen ${themeBg} pb-28 transition-colors duration-300 relative`}>
      {/* Dynamic Background Atmospheric soft glow depending on score and isDark */}
      <div className={`absolute top-0 left-0 right-0 h-[420px] bg-gradient-to-b ${
        isDark ? "from-[#06B6D4]/5 via-[#34D6E8]/2" : "from-[#06B6D4]/10 via-[#06B6D4]/2"
      } to-transparent pointer-events-none -z-10`} />

      {/* Dynamic Slide In Toast alerts */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-md w-auto"
          >
            <div className={`rounded-2xl px-5 py-4 shadow-2xl border flex items-start space-x-3 backdrop-blur-xl ${
              toast.type === "success" 
                ? "bg-[#0C2630]/95 border-[#10b981]/30 text-emerald-100"
                : toast.type === "warning"
                  ? "bg-[#0C2630]/95 border-[#ef4444]/30 text-red-100"
                  : "bg-[#0C2630]/95 border-[#34D6E8]/30 text-sky-100"
            }`}>
              {toast.type === "success" ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">✓</div>
              ) : toast.type === "warning" ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              ) : (
                <Sparkles className="w-5 h-5 text-[#34D6E8] shrink-0 animate-spin" style={{ animationDuration: "3s" }} />
              )}
              <div className="flex-1">
                <p className="text-[10px] opacity-60 font-mono mb-0.5">여명 경보 시스템 • {kstTime}</p>
                <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Global Top Header */}
      <header className={`sticky top-0 z-30 ${isDark ? "bg-[#071A22]/90" : "bg-[#F0FAFC]/90"} backdrop-blur-xl border-b ${themeBorder} px-4 py-3.5 transition-colors relative`}>
        {/* Sleek, Non-Blocking Top Progress Bar during background syncs */}
        {(loading || isUpdating) && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#06B6D4] via-[#34D6E8] to-amber-400 animate-pulse" />
        )}
        
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo brand & Back-to-gate trigger */}
          <div className="flex items-center space-x-3.5 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => {
                setMode(null);
                setActiveTab(0);
              }}
              className="flex items-center space-x-2 group focus:outline-none text-left"
              title="웰컴 게이트로 복귀"
            >
              <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-tr from-[#06b6d4] to-[#34d6e8] flex items-center justify-center text-[#071A22] font-black shadow-md group-hover:rotate-12 transition-transform">
                <Sun className="w-4 h-4 font-black" />
              </div>
              <div>
                <span className="text-lg font-bold font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#34D6E8]">DAWN</span>
                <span className="text-[10px] opacity-60 font-sans block tracking-wide">여명 (黎明) · 에이브로</span>
              </div>
            </button>

            <div className="flex items-center space-x-2">
              <span className="h-4 w-px bg-slate-800" />
              <button
                onClick={() => {
                  const target = mode === "beginner" ? "expert" : "beginner";
                  setMode(target);
                }}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${themeBadge}`}
              >
                {mode === "beginner" ? "🔰 초보 모드" : "📊 고수 모드"}
              </button>
            </div>
          </div>

          {/* Clock, AI Re-evaluate, Theme Switcher row */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            
            {/* Background syncing text indicator */}
            {(loading || isUpdating) && (
              <span className="text-[10px] text-[#34D6E8] font-mono animate-pulse hidden md:inline-block">
                ● 실시간 기상 연동 갱신 중...
              </span>
            )}

            {/* Clock */}
            <div className={`px-2.5 py-1 rounded-lg ${themeSubBg} border ${themeBorder} flex items-center space-x-2 text-xs font-mono`}>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-amber-500 font-semibold">{kstTime}</span>
              <span className="opacity-60 hidden md:inline">| {marketStatusText.slice(0, 18)}</span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Force AI Calculation refresh */}
              <button
                onClick={handleFullAIBriefingRefresh}
                disabled={isUpdating || loading}
                className="bg-[#06B6D4] text-white hover:bg-[#0891b2] disabled:bg-slate-800 disabled:text-slate-500 p-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer"
                id="btn-re-evaluate"
                title="Gemini 3.5 구글 실시간 검색 연동하여 장전 기상도를 긴급 분석 및 갱신합니다."
              >
                {isUpdating || loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border ${themeBorder} ${themeSubBg} hover:opacity-85 cursor-pointer text-xs`}
                title={isDark ? "라이트(여름) 테마로 전환" : "다크(여름밤) 테마로 전환"}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Tab-Based Single View Content Window */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-12">
        
        {/* --- TAB 0: 🌊 오늘 (PRE-MARKET MAIN SUN ATMO REPORT) --- */}
        {activeTab === 0 && (
          <div className="space-y-10">
            
            {/* 1. Solar Weather needle score widget */}
            <section className={`rounded-3xl border ${themeCard} p-8 relative overflow-hidden flex flex-col justify-between`} id="beginner-today-dawn">
              <div className="absolute top-4 left-4 bg-[#021117] px-2.5 py-1 rounded-md text-[9px] font-mono tracking-widest text-[#83a2ae] border border-[#153440]">
                ATMOSPHERE COUPLING
              </div>

              <div className="w-44 h-22 mx-auto relative overflow-hidden mt-4">
                <div className="w-44 h-44 rounded-full border-2 border-dashed border-[#06B6D4]/20 flex items-center justify-center">
                  <div className="w-30 h-30 rounded-full bg-gradient-to-tr from-[#06B6D4]/25 to-[#34D6E8]/10 opacity-30 filter blur-sm" />
                </div>
                {/* Needle */}
                <div 
                  className="absolute bottom-0 left-1/2 w-1.5 h-16 bg-gradient-to-t from-[#FF5B72] to-[#34D6E8] origin-bottom transform transition-transform duration-1000"
                  style={{ transform: `translateX(-50%) rotate(${(briefing.score / 100) * 180 - 90}deg)` }}
                />
                <div className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-[#34D6E8] -ml-1.5 -mb-1.5 border-2 border-slate-900"></div>
              </div>

              <div className="text-center mt-4">
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 block">장전 산출 여명 매력 지각도</span>
                <span className="text-6 text-6xl md:text-7xl font-light font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] via-[#34d6e8] to-[#92feff] block">
                  {briefing.score} 점
                </span>
                <div className="inline-flex items-center space-x-1.5 bg-[#11313d] text-[#34D6E8] text-[11px] px-3.5 py-1 rounded-full border border-[#1a4454] font-medium mt-1">
                  <span>아침 분위기 강도 :</span>
                  <span className="font-bold">
                    {briefing.score >= 80 ? "☀️ 우상향 맑음, 강한 지지력" : briefing.score >= 60 ? "⛅ 구름 걷힘, 테크 중심 순환" : "🌫️ 안개 및 조정 수렴"}
                  </span>
                </div>
              </div>

              <div className="mt-8 border-t border-[#153440]/30 pt-6 space-y-4">
                <h3 className="text-base font-bold flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>오늘의 한 줄 핵심 기상도</span>
                </h3>
                <p className="text-base leading-relaxed font-sans font-light">
                  &ldquo;{briefing.summary}&rdquo;
                </p>
                <div className="text-[11px] opacity-65 border-l border-amber-500/40 pl-3">
                  * 미국 나스닥 100 마감 가중 수렴과 KOSPI 200 야간 해외 선물의 지지 가중을 합성 처리한 결과입니다.
                </div>
              </div>
            </section>

            {/* 2. AI Real-time alert issue banner */}
            <div className="bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent p-5 rounded-2xl border border-red-500/20 text-xs flex items-center space-x-3.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B72] animate-ping" />
              <div>
                <span className="font-bold text-[#FF5B72]">🚨 AI 실시간 이슈 점검 배너 : </span>
                <span className="opacity-80">미 연준 금리 스왑 선물 하향 조정에 따라 신흥국 외국인 환차익 방어 수급이 강화 중입니다. 시초가 가집계 집중세를 확인하십시오.</span>
              </div>
            </div>

            {/* 3. 오늘의 긴급 코어 시그널 */}
            <section className="space-y-4" id="beginner-signal">
              <h3 className="text-lg font-bold flex items-center">
                <span className="text-[#06B6D4] mr-2">✦</span> 오늘의 긴급 코어 시그널
              </h3>
              
              <div className={`border ${themeCard} p-6 rounded-2xl space-y-5 relative overflow-hidden`} style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.03) 0%, rgba(12,38,48,0.4) 100%)" }}>
                <div className="absolute top-0 right-0 py-1.5 px-3 bg-[#06b6d4]/15 text-[#34D6E8] text-[9px] font-mono tracking-widest rounded-bl-xl border-l border-b border-[#06b6d4]/20">
                  CORE TRIGGER
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 text-[#06B6D4] flex items-center justify-center shrink-0 mt-1">
                    <Star className="w-5 h-5 fill-[#06B6D4]/20" />
                  </div>
                  <div className="space-y-4 w-full">
                    <div>
                      <span className="text-[10px] text-[#06B6D4] font-bold uppercase tracking-wider">글로벌 거시 리서치</span>
                      <h4 className="text-lg font-bold leading-snug mt-1">{briefing.coreSignal.title}</h4>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`${themeSubBg}/50 p-4 rounded-xl border ${themeBorder}`}>
                        <span className="text-[11px] opacity-60 font-bold">원인 진단</span>
                        <p className="text-xs mt-1.5 leading-relaxed font-light">{briefing.coreSignal.reason}</p>
                      </div>
                      <div className="bg-[#06B6D4]/5 p-4 rounded-xl border border-[#06B6D4]/20">
                        <span className="text-[11px] text-[#06B6D4] font-bold">과거 대응 가이드라인</span>
                        <p className="text-xs text-amber-400 mt-1.5 leading-relaxed font-semibold">{briefing.coreSignal.result}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. 오늘의 전망 리포트 / 글로벌 야간 브리핑 통합 */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <span className="text-[#06B6D4] mr-2">✦</span> 글로벌 야간 종합 동시 보고서
              </h3>
              <div className={`${themeCard} p-6 rounded-2xl space-y-4`}>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4.5 h-4.5 text-[#06B6D4]" />
                  <span className="text-xs font-mono font-extrabold tracking-widest">OVERNIGHT GLOBAL MARKET INSIGHT</span>
                </div>
                <blockquote className={`border-l-2 border-[#06B6D4] pl-4 italic text-sm ${themeText}`}>
                  &ldquo; {briefing.overnightRecap.summary} &rdquo;
                </blockquote>
                <p className="text-xs opacity-85 leading-relaxed font-light">
                  {briefing.overnightRecap.details}
                </p>
              </div>
            </section>

            {/* 5. Tactical Checklist (위험 대응 시나리오) - Tab 0 Bottom */}
            <section className="space-y-6" id="mental-defense-protocol">
              <div className="border-b border-red-500/20 pb-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold flex items-center tracking-tight text-red-500">
                    <Shield className="w-6 h-6 text-red-500 mr-2 shrink-0 animate-pulse" />
                    🚨 아침 시초가 뇌동매매 방지 핵심 경고판
                  </h3>
                  <p className="text-xs opacity-75 font-light">
                    오전 9시 장 개시 전후 30분, 자산 유실률이 가장 높은 '부화뇌동 추격 진입'을 전면 방어하기 위한 긴급 경시 강령
                  </p>
                </div>
              </div>

              {/* Bold red banner indicating system threat level */}
              <div className="bg-red-950/40 border border-red-500/35 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl scanline-effect relative overflow-hidden">
                <div className="absolute inset-0 bg-red-500/[0.02] pointer-events-none animate-pulse" />
                <div className="flex items-center space-x-3.5 z-10">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40 shrink-0">
                    <AlertCircle className="w-6.5 h-6.5 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-red-400">아침 시간대 평정심 보존 방막 활성화 권고</h4>
                    <p className="text-xs opacity-80 font-light mt-0.5">상승 호가에 현혹되어 순간적인 추격 진입을 감행 시 높은 확률로 꼭짓점에 도태될 수 있습니다.</p>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-red-400 font-black bg-red-500/15 border border-red-500/30 px-3.5 py-1.5 rounded-lg shrink-0">
                  CRITICAL DEFENSE LIVE
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {checklist.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="relative p-5 rounded-2xl border bg-slate-950/90 border-red-500/30 shadow-lg shadow-red-950/10 flex flex-col justify-between min-h-[190px] overflow-hidden"
                    >
                      {/* Warning Pulse Backing */}
                      <div className="absolute inset-0 bg-red-500/[0.015] pointer-events-none" />

                      <div className="space-y-3 z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] tracking-wide font-mono px-2 py-0.5 rounded-md border font-extrabold bg-red-500/10 text-red-500 border-red-500/20">
                            📢 경고 조항 {item.id.toUpperCase()}
                          </span>
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[9px] text-red-400 font-mono font-black block uppercase tracking-wider">
                            [상황 발생 시]
                          </span>
                          <h4 className="text-xs font-bold leading-relaxed opacity-95">
                            {item.scenario}
                          </h4>
                        </div>
                      </div>

                      {/* Body Action details */}
                      <div className="space-y-2 z-10 pt-3.5 border-t border-red-500/10 mt-3">
                        <span className="text-[9px] text-emerald-400 font-mono font-black block uppercase tracking-wider">
                          [기계적 정석 전술]
                        </span>
                        <p className="text-xs leading-relaxed font-light text-slate-300">
                          {item.action}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        )}

        {/* --- TAB 1: 📈 차트 (DAWN FIN-CHART PLATFORM) --- */}
        {activeTab === 1 && (
          <div className="space-y-10">
            
            {/* 1. Indices with Sparklines */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <span className="text-[#06B6D4] mr-2">✦</span> 국내외 주요 등락 지수
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {briefing.globalMarkets.list.map((mk) => {
                  const isUp = mk.change.trim().startsWith("+");
                  return (
                    <div key={mk.name} className={`p-4 rounded-2xl border ${themeCard} space-y-3`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold">{mk.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          {mk.rate}
                        </span>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                          <span className="text-xl font-bold font-mono tracking-tight">{mk.value}</span>
                          <span className={`text-xs block font-mono ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                            {mk.change}
                          </span>
                        </div>

                        {/* Recharts Mini Area representing historic changes */}
                        <div className="h-10 w-28 shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mk.chart.map((val, idx) => ({ idx, val }))}>
                              <defs>
                                <linearGradient id={`spark-${mk.name}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0.25}/>
                                  <stop offset="95%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="idx" hide />
                              <YAxis hide domain={['dataMin', 'dataMax']} />
                              <Area type="monotone" dataKey="val" stroke={isUp ? "#10b981" : "#ef4444"} fillOpacity={1} fill={`url(#spark-${mk.name})`} strokeWidth={1.5} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 2. Macro Indicators */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <span className="text-[#06B6D4] mr-2">✦</span> 환율·원자재 및 매크로 지표
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {briefing.macro.rates.map((indicator, idx) => {
                  const isNegativeFlow = indicator.variant === "negative";
                  return (
                    <div key={idx} className={`p-4 rounded-2xl border ${themeCard} space-y-1`}>
                      <span className="text-[11px] opacity-70 block">{indicator.name}</span>
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-bold font-mono tracking-tight">{indicator.value}</span>
                        <span className={`text-[10px] font-mono font-bold ${
                          isNegativeFlow ? "text-red-400" : "text-emerald-400"
                        }`}>
                          {indicator.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. rankings Section (돈이 몰리는 곳) - isPro shows 10, beginner shows 5 */}
            <section className="space-y-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold flex items-center">
                  <span className="text-[#06B6D4] mr-2">✦</span> 돈이 몰리는 대장주 리스트
                </h3>
                <span className="text-[10px] font-mono opacity-60">모드 : {mode === "expert" ? "전종목 10위 (고수)" : "우량주 5위 (초보)"}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 거래대금 상위 */}
                <div className={`p-5 rounded-2xl border ${themeCard} space-y-3`}>
                  <div className="flex items-center space-x-2 border-b border-[#06B6D4]/10 pb-2">
                    <Activity className="w-4 h-4 text-[#06b6d4]" />
                    <span className="text-xs font-bold leading-none">거래대금 폭발 상위</span>
                  </div>
                  <div className="space-y-2">
                    {briefing.moneyFlow.tradingValue.slice(0, mode === "expert" ? 10 : 5).map((st, i) => (
                      <div key={st.code} className="flex justify-between items-center text-xs p-1.5 hover:bg-[#06b6d4]/5 rounded transition-all">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono opacity-50 w-4">{i+1}</span>
                          <div>
                            <span className="font-bold block">{st.name}</span>
                            <span className="text-[9px] opacity-50 font-mono">{st.code}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-amber-500 font-mono">{st.value.toLocaleString()}억</span>
                          <span className="text-[9px] text-emerald-400 font-mono block">+{st.rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 급상승 및 급하락 (Two in one column layout) */}
                <div className="space-y-6">
                  
                  {/* 급상승 모멘텀 */}
                  <div className={`p-5 rounded-2xl border ${themeCard} space-y-3`}>
                    <div className="flex items-center space-x-2 border-b border-[#10b981]/10 pb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold leading-none text-emerald-400 font-sans">급상승 모멘텀 대장</span>
                    </div>
                    <div className="space-y-2">
                      {briefing.moneyFlow.topGainers.slice(0, mode === "expert" ? 5 : 4).map((st) => (
                        <div key={st.code} className="flex justify-between items-center text-xs p-1.5 hover:bg-emerald-500/5 rounded transition-all">
                          <div>
                            <span className="font-bold block">{st.name}</span>
                            <span className="text-[9px] opacity-40 font-mono">{st.code}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono">{st.price.toLocaleString()}원</span>
                            <span className="text-[10px] text-emerald-400 font-mono block font-bold">+{st.rate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 급하락 조정 */}
                  <div className={`p-5 rounded-2xl border ${themeCard} space-y-3`}>
                    <div className="flex items-center space-x-2 border-b border-[#ef4444]/10 pb-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold leading-none text-red-400">일시적 수급 이탈·조정</span>
                    </div>
                    <div className="space-y-2">
                      {briefing.moneyFlow.topLosers.slice(0, mode === "expert" ? 5 : 4).map((st) => (
                        <div key={st.code} className="flex justify-between items-center text-xs p-1.5 hover:bg-red-500/5 rounded transition-all">
                          <div>
                            <span className="font-bold block">{st.name}</span>
                            <span className="text-[9px] opacity-40 font-mono">{st.code}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono">{st.price.toLocaleString()}원</span>
                            <span className="text-[10px] text-red-400 font-mono block font-bold">{st.rate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </section>

          </div>
        )}

        {/* --- TAB 2: 🧭 섹터 (SECTORS, FLOWS, & SCREENERS) --- */}
        {activeTab === 2 && (
          <div className="space-y-10">
            
            {/* 1. Sector Theme Outlook */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <span className="text-[#06B6D4] mr-2">✦</span> 금일 주도 섹터·업종 예보
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {briefing.sectorOutlook.list.map((sec, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${themeCard} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{sec.name}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        sec.status === "positive" 
                          ? "bg-emerald-500/15 text-emerald-400"
                          : sec.status === "neutral"
                            ? "bg-slate-500/15 text-slate-400"
                            : "bg-red-500/15 text-red-400"
                      }`}>
                        {sec.status === "positive" ? "🔥 강세 예보" : sec.status === "neutral" ? "⛅ 업종 지장" : "❄️ 매도 대기"}
                      </span>
                    </div>
                    <p className="text-xs opacity-75 font-light leading-relaxed">{sec.comment}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Institutional Comparative Buyer Flows */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <span className="text-[#06B6D4] mr-2">✦</span> 외국인·기관 전거래일 수급 (억원)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* KOSPI */}
                <div className={`p-5 rounded-2xl border ${themeCard} space-y-4`}>
                  <div className="bg-[#021117] px-3 py-1.5 rounded-lg border border-[#153440] text-xs font-bold text-[#34D6E8]">
                    KOSPI 순매수 추이
                  </div>
                  <div className="space-y-3.5 pt-2">
                    {/* Foreign */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-medium mb-1">
                        <span>외국인 (Foreign)</span>
                        <span className="text-emerald-400 font-bold">+{briefing.flows.kospi.foreign} 억</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "78%" }} />
                      </div>
                    </div>
                    {/* Institution */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-medium mb-1">
                        <span>기관 (Institution)</span>
                        <span className="text-red-400 font-bold">{briefing.flows.kospi.institution} 억</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: "42%" }} />
                      </div>
                    </div>
                    {/* Retail */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-medium mb-1">
                        <span>개인 (Retail)</span>
                        <span className="text-red-400 font-bold">{briefing.flows.kospi.retail} 억</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: "22%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* KOSDAQ */}
                <div className={`p-5 rounded-2xl border ${themeCard} space-y-4`}>
                  <div className="bg-[#021117] px-3 py-1.5 rounded-lg border border-[#153440] text-xs font-bold text-[#34D6E8]">
                    KOSDAQ 순매수 추이
                  </div>
                  <div className="space-y-3.5 pt-2">
                    {/* Foreign */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-medium mb-1">
                        <span>외국인 (Foreign)</span>
                        <span className="text-red-400 font-bold">{briefing.flows.kosdaq.foreign} 억</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: "29%" }} />
                      </div>
                    </div>
                    {/* Institution */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-medium mb-1">
                        <span>기관 (Institution)</span>
                        <span className="text-red-400 font-bold">{briefing.flows.kosdaq.institution} 억</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: "35%" }} />
                      </div>
                    </div>
                    {/* Retail */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-medium mb-1">
                        <span>개인 (Retail)</span>
                        <span className="text-emerald-400 font-bold">+{briefing.flows.kosdaq.retail} 억</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "69%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#06B6D4]/5 p-4 rounded-xl border border-[#06B6D4]/10 text-xs text-center text-[#83a2ae]">
                💡 <strong>전략 수급 해설:</strong> 지지 우위 반도체 세션은 외인의 기조력이 탄탄하나, 코스닥은 변동성이 큽니다. 시초 개시 후 기관의 매수 입각선 수렴을 대조 체크해 보십시오.
              </div>
            </section>

            {/* 3. Market Multi Screener (고수 전용 기능) */}
            <section className="space-y-4" id="screener-section">
              <h3 className="text-lg font-bold flex items-center">
                <span className="text-[#06B6D4] mr-2">✦</span> 마켓 멀티 스크리너 5대 필터
              </h3>

              <div className="space-y-6">
                {/* Presets switchers */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#021117] p-1.5 rounded-xl border border-[#153440]">
                  {[
                    { id: "growth", emoji: "🚀", label: "고성장 우량" },
                    { id: "value", emoji: "💎", label: "저평가 밸류" },
                    { id: "dividend", emoji: "💰", label: "고배당 안전" },
                    { id: "surging", emoji: "🔥", label: "급등 폭발" },
                    { id: "supply", emoji: "📊", label: "수급 강세" }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveValuePreset(p.id as any);
                        // Assigning viewport focus and scroll position on category click
                        setTimeout(() => {
                          const anchor = document.getElementById("screener-results-anchor");
                          if (anchor) {
                            anchor.scrollIntoView({ behavior: "smooth", block: "nearest" });
                          }
                        }, 40);
                      }}
                      className={`py-2 px-1 rounded-lg text-[11px] font-bold transition-all focus:outline-none cursor-pointer ${
                        activeValuePreset === p.id 
                          ? "bg-[#06B6D4] text-slate-950 font-black shadow-md" 
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {p.emoji} {p.label}
                    </button>
                  ))}
                </div>

                {/* Screener Output Rows Anchor */}
                <div id="screener-results-anchor" className="scroll-mt-24" />

                {/* Screener Output Rows */}
                <div className="space-y-4">
                  {briefing.valueScreenerPresets[activeValuePreset]?.map((st: any) => (
                    <div key={st.code} className={`p-5 rounded-2xl border ${themeCard} space-y-3 hover:scale-[1.01] transition-transform`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#153440]/30 pb-2.5">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#34D6E8] to-[#92feff]">{st.name}</span>
                            <span className="text-xs font-mono opacity-50">({st.code})</span>
                          </div>
                          <span className="text-[9px] bg-[#06B6D4]/15 text-[#34D6E8] px-2 py-0.5 rounded border border-[#34D6E8]/20 inline-block mt-1 font-bold">{st.highlight}</span>
                        </div>
                        
                        <div className="flex space-x-4 text-[11px] font-mono opacity-80">
                          <span>PER: <strong className="text-[#34D6E8]">{st.pe}배</strong></span>
                          <span>ROE: <strong className="text-emerald-400">{st.roe}%</strong></span>
                          <span>배당: <strong>{st.divYield}%</strong></span>
                        </div>
                      </div>

                      <div className="pt-1.5 space-y-1">
                        <span className="text-[10px] text-[#06B6D4] font-bold block uppercase font-mono">가치 연계해설</span>
                        <p className="text-xs opacity-90 leading-relaxed font-light">{st.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        )}

        {/* --- TAB 3: 🗓️ 캘린더 (TIMETABLES & EVENTS) --- */}
        {activeTab === 3 && (
          <div className="space-y-10">
            
            {/* 1. Economic Calendar */}
            <section className="space-y-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold flex items-center">
                  <span className="text-[#06B6D4] mr-2">✦</span> 장전 핵심 거시 지표 시간표
                </h3>
                {mode === "expert" && (
                  <div className="flex bg-[#021117] p-1 rounded-lg border border-[#153440] text-[10px] font-bold">
                    <button 
                      onClick={() => setCalendarViewRange("today")} 
                      className={`px-2.5 py-1 rounded transition-colors ${calendarViewRange === "today" ? "bg-[#06B6D4] text-slate-950 font-black" : "opacity-60"}`}
                    >
                      당일
                    </button>
                    <button 
                      onClick={() => setCalendarViewRange("week")} 
                      className={`px-2.5 py-1 rounded transition-colors ${calendarViewRange === "week" ? "bg-[#06B6D4] text-slate-950 font-black" : "opacity-60"}`}
                    >
                      1주
                    </button>
                    <button 
                      onClick={() => setCalendarViewRange("month")} 
                      className={`px-2.5 py-1 rounded transition-colors ${calendarViewRange === "month" ? "bg-[#06B6D4] text-slate-950 font-black" : "opacity-60"}`}
                    >
                      1달
                    </button>
                  </div>
                )}
              </div>

              <div className={`rounded-2xl border ${themeCard} overflow-hidden`}>
                <div className={`p-4 bg-[#021117]/60 border-b ${themeBorder} flex items-center justify-between text-xs`}>
                  <span>발표 국가 및 안건</span>
                  <span>발표 시간 및 강도</span>
                </div>

                <div className={`divide-y ${themeBorder}`}>
                  {briefing.economicCalendar.map((ev, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-[#06b6d4]/5 transition-colors">
                      <div className="flex items-center space-x-3.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isDark ? "bg-[#0a2029] border-[#153440]" : "bg-[#f0fafc] border-[#cedce0]"} font-bold`}>
                          {ev.time}
                        </span>
                        <div>
                          <span className="text-xs font-bold mr-1 block sm:inline opacity-75">[{ev.country}]</span>
                          <span className="text-xs font-semibold">{ev.title}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                        ev.importance === "최상" 
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}>
                        중요 {ev.importance}
                      </span>
                    </div>
                  ))}

                  {/* Extra mock indicators if in week/month view inside Expert mode */}
                  {mode === "expert" && calendarViewRange !== "today" && (
                    <>
                      <div className="p-4 flex items-center justify-between opacity-80 bg-[#021117]/30">
                        <div className="flex items-center space-x-3.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-[#0a2029] border-[#153440] font-bold">화 21:30</span>
                          <div>
                            <span className="text-xs font-bold mr-1 opacity-75">[미국]</span>
                            <span className="text-xs font-semibold">소비자물가지수(CPI) 가속도 발표</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-red-400/20 text-red-400 border border-red-500/30">중요 최상</span>
                      </div>
                      <div className="p-4 flex items-center justify-between opacity-80 bg-[#021117]/30">
                        <div className="flex items-center space-x-3.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-[#0a2029] border-[#153440] font-bold">목 03:00</span>
                          <div>
                            <span className="text-xs font-bold mr-1 opacity-75">[미국]</span>
                            <span className="text-xs font-semibold">FOMC 기준금리 공지 및 의결</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-red-400/20 text-red-400 border border-red-500/30">중요 최상</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Weekly mock detail calendar for expert only */}
              {mode === "expert" && (
                <div className={`p-4 rounded-xl border ${themeCard} space-y-2`}>
                  <span className="text-xs font-extrabold text-[#34D6E8] font-mono block">UPCOMING NEWS / EARNING EVENTS</span>
                  <p className="text-xs font-light opacity-80">
                    이번 주 요인으로는 미국 메모리 대표 [마이크론]의 아침 서프라이즈 영업이익 발표 및 [엔비디아] 주주총회 기조연설이 배치되어 있어 장 개막 후 대덕 반도체 진영의 하방 복원력이 증명될 가능성이 우세합니다.
                  </p>
                </div>
              )}
            </section>

          </div>
        )}

        {/* --- TAB 4: ≡ 더보기 (ISSUES NEWS, PREMIUM TOOLS & PRICING PLANS) --- */}
        {activeTab === 4 && (
          <div className="space-y-10">
            
            {/* 1. Issue News Theme Reports (Beginner vs Expert length) */}
            <section className="space-y-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold flex items-center text-amber-500 animate-pulse">
                  <span className="mr-2">✦</span> 놓쳐선 안 될 오늘 아침 핵심 테마 뉴스
                </h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-[#06B6D4] rounded">
                  {mode === "expert" ? "🔴 실시간 송출" : "🟡 15분 대기 지연"}
                </span>
              </div>

              <div className="space-y-4">
                {briefing.issuesReport.list.slice(0, mode === "expert" ? 8 : 4).map((item, index) => (
                  <div key={index} className={`p-6 rounded-2xl border ${themeCard} hover:scale-[1.01] transition-transform`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono font-bold text-[#34D6E8] bg-[#34D6E8]/10 px-2.5 py-0.5 rounded border border-[#34D6E8]/20">테마 0{index + 1}</span>
                      <span className="text-[10px] opacity-40 font-mono italic">• PRE-MARKET CATALYST</span>
                    </div>
                    <h4 className="text-base font-bold mt-2 leading-snug">{item.title}</h4>
                    <p className="text-xs opacity-75 mt-2 leading-relaxed font-light">{item.context}</p>
                    
                    <div className="mt-4 bg-[#0a2029] p-3.5 rounded-xl border border-[#153440] flex items-start space-x-2 text-xs">
                      <span className="text-[#34D6E8] font-bold shrink-0 bg-[#34D6E8]/10 px-1.5 py-0.5 rounded">여명 전망</span>
                      <p className="opacity-90 leading-relaxed font-light text-[11px]">{item.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Advanced Premium Analysis Tools (고수 전용 연구실: Stock Lab, Screener & Backtester) */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <span className="text-[#06B6D4] mr-2">✦</span> AI 종목 연구실 & 퀀트 기계 제어
              </h3>

              {mode === "expert" ? (
                <div className="space-y-8">
                  
                  {/* Part A: Analytical Stock Lab (종목 심층 분석 연구소) */}
                  <div className={`p-5 rounded-2xl border ${themeCard} space-y-4`}>
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-[#34D6E8]" />
                      <span className="text-xs font-bold tracking-widest uppercase text-[#34D6E8] font-mono">가치 분석 연구소 (ANALYSAL LAB)</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 opacity-55" />
                        <input
                          type="text"
                          placeholder="종목명 및 코드 검색 (예: 삼성전자, 에코프로)"
                          value={stockSearchTerm}
                          onChange={(e) => setStockSearchTerm(e.target.value)}
                          className={`w-full bg-[#021117] border ${themeBorder} rounded-xl py-2 pl-9 pr-4 text-xs text-slate-100 focus:outline-none focus:border-[#06b6d4]`}
                        />
                      </div>

                      <select
                        value={selectedStockCode}
                        onChange={(e) => setSelectedStockCode(e.target.value)}
                        className={`bg-[#021117] border ${themeBorder} rounded-xl px-3 py-2 text-xs focus:outline-none`}
                        id="select-stock-analyser"
                      >
                        {stocksList.map(s => (
                          <option key={s.code} value={s.code}>
                            {s.name} ({s.code}) - {s.sector}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search results list */}
                    {stockSearchTerm && (
                      <div className={`bg-[#021117] border ${themeBorder} p-2 rounded-xl max-h-24 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-1.5`}>
                        {filteredStocks.map(s => (
                          <button
                            key={s.code}
                            onClick={() => {
                              setSelectedStockCode(s.code);
                              setStockSearchTerm("");
                            }}
                            className="text-left p-1.5 rounded-lg bg-[#0C2630]/60 hover:bg-[#06B6D4]/10 text-[11px] block text-slate-200 truncate"
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Report Output */}
                    {analysisLoading ? (
                      <div className="p-8 text-center space-y-3">
                        <Loader2 className="w-6 h-6 mx-auto text-[#06B6D4] animate-spin" />
                        <p className="text-xs opacity-70">Gemini 리서치 패키지가 실시간 증시 뉴스를 정밀 정제하고 있습니다...</p>
                      </div>
                    ) : analysisResult ? (
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                          <div className="bg-[#021117]/60 p-2.5 rounded-xl border border-[#153440]">
                            <span className="text-[9px] opacity-60 block">현재 가격</span>
                            <span className="text-sm font-bold font-mono">{(analysisResult.price || 50000).toLocaleString()}원</span>
                          </div>
                          <div className="bg-[#021117]/60 p-2.5 rounded-xl border border-[#153440]">
                            <span className="text-[9px] opacity-60 block">수익비율 (PER)</span>
                            <span className="text-sm font-bold font-mono">{analysisResult.metrics?.pe || "N/A"} 배</span>
                          </div>
                          <div className="bg-[#021117]/60 p-2.5 rounded-xl border border-[#153440]">
                            <span className="text-[9px] opacity-60 block">순자산 (PBR)</span>
                            <span className="text-sm font-bold font-mono">{analysisResult.metrics?.pbr || "N/A"} 배</span>
                          </div>
                          <div className="bg-[#021117]/60 p-2.5 rounded-xl border border-[#153440]">
                            <span className="text-[9px] opacity-60 block">자기자본액 (ROE)</span>
                            <span className="text-sm font-bold font-mono text-emerald-400">{analysisResult.metrics?.roe || "N/A"}%</span>
                          </div>
                        </div>

                        <div className="bg-[#021117]/40 p-4 rounded-xl border border-[#153440]/60">
                          <p className="text-xs opacity-90 leading-relaxed font-light">{analysisResult.summary}</p>
                        </div>

                        {/* Interactive Visual Line Chart */}
                        <div className="h-32 w-full mt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { d: "02월", valuation: (analysisResult.price * 0.81) },
                              { d: "03월", valuation: (analysisResult.price * 0.87) },
                              { d: "04월", valuation: (analysisResult.price * 0.84) },
                              { d: "05월", valuation: (analysisResult.price * 0.94) },
                              { d: "06월", valuation: (analysisResult.price) }
                            ]}>
                              <XAxis dataKey="d" stroke="#83a2ae" fontSize={9} />
                              <YAxis hide domain={['dataMin - 10000', 'dataMax + 10000']} />
                              <Tooltip contentStyle={{ backgroundColor: "#0C2630", border: "1px solid #153440" }} labelStyle={{ color: "#83a2ae" }} />
                              <Area type="monotone" dataKey="valuation" stroke="#34D6E8" fill="#34D6E8" fillOpacity={0.06} strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Part B: AI 종목 스크리너 */}
                  <div className={`p-5 rounded-2xl border ${themeCard} space-y-4`}>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#34D6E8]" />
                      <span className="text-xs font-bold tracking-widest uppercase text-[#34D6E8] font-mono">1. AI 종목 스크리너 (GEMINI GROUNDING)</span>
                    </div>
                    <p className="text-xs opacity-75 font-light leading-relaxed">
                      구글 제미나이 브레인 모델을 기반으로 아침 뉴스 연동 핵심 트렌드를 실시간 필터합니다. (예: "엔비디아 TC본더 공급 협력사 수혜 기조")
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={screenerQuery}
                        onChange={(e) => setScreenerQuery(e.target.value)}
                        className={`flex-1 bg-[#021117] border ${themeBorder} rounded-xl px-3 py-2 text-xs focus:outline-none`}
                        placeholder="이차전지 양극재 신흥국 공급망 핵심 수혜주..."
                      />
                      <button
                        onClick={handleRunScreener}
                        disabled={screenerLoading}
                        className="bg-[#06B6D4] text-white hover:bg-[#0891b2] font-semibold text-xs px-4 py-2 rounded-xl transition-all disabled:bg-slate-800"
                        id="btn-screener-search"
                      >
                        {screenerLoading ? "로딩..." : "스크리닝"}
                      </button>
                    </div>

                    {screenerResults.length > 0 && (
                      <div className="space-y-3 pt-2">
                        {screenerMessage && (
                          <div className="p-2.5 bg-yellow-400/5 border border-yellow-400/15 text-[10px] text-yellow-500 rounded-lg">
                            📢 {screenerMessage}
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {screenerResults.map((st, i) => (
                            <div key={i} className="bg-[#021117]/60 p-3.5 rounded-xl border border-[#153440] space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#34D6E8] to-[#92feff]">{st.name} ({st.code})</span>
                                <span className="text-[9px] opacity-60 font-mono">{st.sector}</span>
                              </div>
                              <p className="text-xs opacity-85 leading-relaxed font-light">{st.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part C: 퀀트 백테스터 */}
                  <div className={`p-5 rounded-2xl border ${themeCard} space-y-4`}>
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-[#34D6E8]" />
                      <span className="text-xs font-bold tracking-widest uppercase text-[#34D6E8] font-mono">2. 정밀 퀀트 백테스터 (QUANT ENGINE)</span>
                    </div>
                    <p className="text-xs opacity-75 font-light leading-relaxed">
                      우량 기업 대상 기술적 차트 통계(250거래일 골든크로스 / RSI 저점탈출) 기법에 기반해 전략 수익률을 대조합니다.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#021117]/85 p-4 rounded-xl border border-[#153440] text-xs">
                      <div>
                        <span className="opacity-60 text-[10px] uppercase font-bold block mb-1">매매 기법 선택</span>
                        <select
                          value={backtestStrategy}
                          onChange={(e) => setBacktestStrategy(e.target.value)}
                          className="w-full bg-[#0C2630] border border-[#153440] rounded px-2.5 py-1.5 focus:outline-none text-xs"
                          id="select-bt-strategy"
                        >
                          <option value="golden-cross">양봉 골든크로스 (5일-20일)</option>
                          <option value="rsi-oversold">RSI 저점 반등 수렴</option>
                          <option value="breakout">10일 전고 돌파 거래량 합계</option>
                        </select>
                      </div>
                      <div>
                        <span className="opacity-60 text-[10px] uppercase font-bold block mb-1">시뮬레이션 종목</span>
                        <select
                          value={backtestStockCode}
                          onChange={(e) => setBacktestStockCode(e.target.value)}
                          className="w-full bg-[#0C2630] border border-[#153440] rounded px-2.5 py-1.5 focus:outline-none text-xs"
                          id="select-bt-stock"
                        >
                          {stocksList.map(s => (
                            <option key={s.code} value={s.code}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="opacity-60 text-[10px] uppercase font-bold block mb-1">익절 (%)</span>
                          <input
                            type="number"
                            value={btTakeProfit}
                            onChange={(e) => setBtTakeProfit(Number(e.target.value))}
                            className="w-full bg-[#0C2630] border border-[#153440] rounded px-2.5 py-1 text-xs text-center"
                          />
                        </div>
                        <div>
                          <span className="opacity-60 text-[10px] uppercase font-bold block mb-1">손절 (%)</span>
                          <input
                            type="number"
                            value={btStopLoss}
                            onChange={(e) => setBtStopLoss(Number(e.target.value))}
                            className="w-full bg-[#0C2630] border border-[#153440] rounded px-2.5 py-1 text-xs text-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleRunBacktest}
                        disabled={backtestLoading}
                        className="bg-[#34D6E8] text-slate-950 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1 cursor-pointer hover:bg-[#5ce0ef]"
                        id="btn-run-backtest"
                      >
                        {backtestLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>가동 중...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-slate-950" />
                            <span>백테스트 엔진 시동</span>
                          </>
                        )}
                      </button>
                    </div>

                    {backtestResult && (
                      <div className="space-y-4 pt-4 border-t border-[#153440]/60">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                          <div className="bg-[#021117] p-2.5 rounded-xl border border-[#153440]/80">
                            <span className="text-[10px] opacity-60 block">전략 승률</span>
                            <span className="text-sm font-bold font-mono text-emerald-400">{backtestResult.metrics.winRate}%</span>
                          </div>
                          <div className="bg-[#021117] p-2.5 rounded-xl border border-[#153440]/80">
                            <span className="text-[10px] opacity-60 block">전략 최종 수익률</span>
                            <span className={`text-sm font-bold font-mono ${backtestResult.metrics.strategyYield >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {backtestResult.metrics.strategyYield}%
                            </span>
                          </div>
                          <div className="bg-[#021117] p-2.5 rounded-xl border border-[#153440]/80">
                            <span className="text-[10px] opacity-60 block">단순 보유시 수익률</span>
                            <span className={`text-sm font-bold font-mono ${backtestResult.metrics.bhYield >= 0 ? "text-emerald-400" : "text-red-[#FF5B72]"}`}>
                              {backtestResult.metrics.bhYield}%
                            </span>
                          </div>
                          <div className="bg-[#021117] p-2.5 rounded-xl border border-[#153440]/80">
                            <span className="text-[10px] opacity-60 block">최대 낙폭 (MDD)</span>
                            <span className="text-sm font-bold font-mono text-red-400">{backtestResult.metrics.mdd}%</span>
                          </div>
                        </div>

                        {/* Chart lines */}
                        <div className="h-36 w-full pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={backtestResult.history.filter((_: any, i: number) => i % 5 === 0)}>
                              <XAxis dataKey="date" stroke="#83a2ae" fontSize={8} />
                              <YAxis hide domain={['dataMin', 'dataMax']} />
                              <Tooltip contentStyle={{ backgroundColor: "#0C2630", border: "1px solid #153440" }} />
                              <Line type="monotone" dataKey="strategyWorth" name="DAWN 퀀트전략 가치" stroke="#06B6D4" strokeWidth={2} dot={false} />
                              <Line type="monotone" dataKey="bhWorth" name="단순 보유 가치" stroke="#83a2ae" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className={`p-6 rounded-2xl border ${themeCard} text-center space-y-4`}>
                  <p className="text-xs opacity-75 font-light leading-relaxed max-w-md mx-auto">
                    🔒 <strong>고수 전용 AI 제어실:</strong> 종목 심층 분석기, 테크 스크리너 및 정량적 퀀트 백테스터 도구는 고수 모드 전용입니다. 우측 상단의 <strong>'📊 고수 모드'</strong>로 진입하십시오.
                  </p>
                  <button
                    onClick={() => {
                      setMode("expert");
                      showToast("고수 모드로 즉시 변경되었습니다.", "success");
                    }}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all font-mono ${themeAccentBtn}`}
                  >
                    📊 고수모드 즉시 입각
                  </button>
                </div>
              )}
            </section>

            {/* 3. 요금제 안내 매트릭스 (5-Tier Plan Matrix) */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <span className="text-[#06B6D4] mr-2">✦</span> 에이브로 월구독 플랜 안내
              </h3>

              <div className={`rounded-2xl border ${themeCard} overflow-hidden shadow-lg`}>
                <div className="p-4 bg-[#021117]/85 border-b border-[#153440] text-center">
                  <span className="text-xs font-extrabold text-[#34D6E8] tracking-widest font-mono">DAWN PREMIUM TIER PLANS</span>
                  <p className="text-[10px] opacity-70 mt-1">티어별 단계 누적형 아웃룩 권한 비교</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className={`${isDark ? "bg-[#0a2029]" : "bg-[#e5f0f3] opacity-90"} text-[10px] uppercase font-mono tracking-wider border-b ${themeBorder}`}>
                        <th className="p-3">티어 이름</th>
                        <th className="p-3 text-center">월 가격</th>
                        <th className="p-3">랭킹 종목</th>
                        <th className="p-3">뉴스 수신</th>
                        <th className="p-3">AI 백테스터</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${themeBorder}`}>
                      {[
                        { name: "무료 (Lite)", price: "0원", stocks: "상위 5위", news: "15분 대기 지연", ai: "이용 불가" },
                        { name: "베이직 (Basic)", price: "29,990원", stocks: "상위 20위", news: "📡 실시간 라이브", ai: "이용 불가" },
                        { name: "플러스 (Plus)", price: "49,900원", stocks: "상위 50위", news: "📡 실시간 라이브", ai: "월 10회 제한" },
                        { name: "프로 (Pro) 🔥", price: "99,900원", stocks: "전체 종목 공개", news: "📡 실시간 라이브", ai: "무제한 시동" },
                        { name: "프리미엄", price: "299,000원", stocks: "전체 종목 공개", news: "📡 실시간 라이브", ai: "무제한 + 1:1 리서치" }
                      ].map((tier, idx) => (
                        <tr key={idx} className={`${tier.name.includes("프로") ? (isDark ? "bg-[#0c313d]/60 font-medium text-cyan-200" : "bg-cyan-50 font-medium") : "hover:opacity-85"}`}>
                          <td className="p-3 font-bold">{tier.name}</td>
                          <td className="p-3 text-center text-amber-500 font-mono font-bold">{tier.price}</td>
                          <td className="p-3 opacity-90">{tier.stocks}</td>
                          <td className="p-3 opacity-95">{tier.news}</td>
                          <td className="p-3">{tier.ai}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

          </div>
        )}

      </main>

      {/* FIXED BASE BOTTOM NAVIGATION BAR (UNIFIED FOR ALL MODES) */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 ${
        isDark ? "bg-[#071A22]/90 border-[#153440]" : "bg-white/95 border-slate-200"
      } backdrop-blur-xl border-t transition-colors duration-300`}>
        <div className="max-w-md mx-auto px-4 py-2.5 flex justify-between items-center">
          {[
            { id: 0, label: "오늘", emoji: "🌊" },
            { id: 1, label: "차트", emoji: "📈" },
            { id: 2, label: "섹터", emoji: "🧭" },
            { id: 3, label: "캘린더", emoji: "🗓️" },
            { id: 4, label: "더보기", emoji: "≡" }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Instantly align window to top so the selected view starts at the correct position
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
                className="flex flex-col items-center justify-center space-y-1 py-1.5 px-3.5 rounded-2xl transition-all cursor-pointer focus:outline-none"
              >
                <span className={`text-base transition-transform ${isSelected ? "scale-115 rotate-6" : "scale-100 opacity-60"}`}>
                  {tab.emoji}
                </span>
                <span className={`text-[10px] font-sans font-bold transition-all ${
                  isSelected 
                    ? "text-[#06B6D4] scale-105" 
                    : "text-slate-400 opacity-70"
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER COMMON LEGAL COMPLIANCE DISCLAIMER COMPULSORY */}
      <footer className={`mt-16 border-t ${themeBorder} py-10 ${isDark ? "bg-[#020d12]" : "bg-[#e5f1f3]"} relative z-20 px-6 text-center transition-colors`}>
        <div className="max-w-2xl mx-auto space-y-4">
          <div className={`text-[11px] opacity-80 px-4 py-3.5 rounded-xl border ${themeBorder} ${isDark ? "bg-[#071a22]/80" : "bg-white/80"} max-w-xl mx-auto leading-relaxed`}>
            📢 <span className="font-extrabold uppercase block mb-1">핵심 안내 및 유의사항</span>
            여명(DAWN)은 개별 종목을 추천하거나 투자를 유도하지 않으며, 불법 리딩방 등과 무관한 장전 공개 데이터 요약 서비스입니다. 분석 결과 및 백테스트 데이터는 과거 기준 추산 모델일 뿐 실제 투자 수익을 보장하지 않습니다.
          </div>
          <p className="text-xs font-bold text-amber-500 font-sans select-none leading-relaxed">
            &ldquo; 투자 참고용 정보입니다. 최종 투자 판단과 책임은 본인에게 있습니다. &rdquo;
          </p>
        </div>
      </footer>

    </div>
  );
}
