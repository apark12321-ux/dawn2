import React, { useState, useEffect } from "react";
import {
  Menu,
  Bell,
  User,
  X,
  Play,
  Heart,
  MessageCircle,
  Share2,
  ChevronRight,
  Plus,
  Search,
  Check,
  Edit2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sliders,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  AlertCircle,
  LogOut,
  Settings,
  Phone,
  Bookmark,
  BellRing,
  Award,
  Zap,
  CheckCircle2,
  ListFilter
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

// ==========================================
// MOCK DATABASES & CONFIG TYPES
// ==========================================

interface Stock {
  name: string;
  code: string;
  price: number;
  market: "KOSPID" | "KOSDAQ";
  change: number;
  changeRate: number;
}

const STOCK_DATABASE: Stock[] = [
  { name: "화신정공", code: "126640", price: 2120, market: "KOSDAQ", change: 143, changeRate: 7.24 },
  { name: "에이팩트", code: "238490", price: 3410, market: "KOSDAQ", change: 355, changeRate: 11.62 },
  { name: "KB금융", code: "105560", price: 78500, market: "KOSPID", change: 1300, changeRate: 1.68 },
  { name: "TYM", code: "002900", price: 4105, market: "KOSPID", change: -85, changeRate: -2.03 },
  { name: "삼성전자", code: "005930", price: 73200, market: "KOSPID", change: 400, changeRate: 0.55 },
  { name: "SK하이닉스", code: "000660", price: 184500, market: "KOSPID", change: 4300, changeRate: 2.39 },
  { name: "알테오젠", code: "196170", price: 298500, market: "KOSDAQ", change: 7500, changeRate: 2.58 },
  { name: "현대차", code: "005380", price: 242500, market: "KOSPID", change: -2500, changeRate: -1.02 },
  { name: "LG에너지솔루션", code: "373220", price: 345000, market: "KOSPID", change: 2000, changeRate: 0.58 },
  { name: "에코프로비엠", code: "247540", price: 168000, market: "KOSDAQ", change: -4000, changeRate: -2.33 },
  { name: "카카오", code: "035720", price: 38200, market: "KOSPID", change: -800, changeRate: -2.05 }
];

interface AlgorithmItem {
  name: string;
  rate: number;
  desc: string;
  tag: string;
  details: string;
}

const ALGORITHMS: AlgorithmItem[] = [
  { name: "스토키", rate: 20.9, desc: "스토케스틱 슬로우 기반 단기 모멘텀 매매", tag: "수급포착", details: "과매수 및 과매도 지표의 수치 왜곡을 이중 누적 가중치로 해소한 단기 고주파 돌파 거래 시스템." },
  { name: "친절한미정씨", rate: 13.0, desc: "MACD 추세 추종 돌파 분석 알고리즘", tag: "골든크로스", details: "정적 채널에서 3일 이상 지지받으며 지수 이동평균선 격차를 확장시키는 최적 시점 포착 시스템." },
  { name: "수익타임", rate: 12.5, desc: "RSI 과매도 구간 분할 안정 수급 진입", tag: "낙폭과대", details: "단기 폭락 상황에서 기관 유입 흔적이 기록되는 대형 실적주 대상의 안심 기술 반등 타격 기법." },
  { name: "히트앤런", rate: 9.8, desc: "당일 급증 거래량 섹터 테마 추종", tag: "테마급등", details: "시초가 동시호가에 쏠리는 순수 세력 수급 비율을 실시간 거래소 데이터 프록시로부터 분석 점수화." },
  { name: "슈퍼스토스", rate: 7.5, desc: "외국인/기관 동시 연속 비중 확대주", tag: "주체수급", details: "연기금과 대표 글로벌 자산운용사의 공시 및 수급 마진 교집합 종목을 누적 연산하는 퀀트 전략." }
];

const ALGO_RETURNS_HISTORY = [
  { date: "6/11", 스토키: 10.2, 친절한미정씨: 8.5, 수익타임: 6.2 },
  { date: "6/12", 스토키: 12.5, 친절한미정씨: 9.1, 수익타임: 7.8 },
  { date: "6/13", 스토키: 15.4, 친절한미정씨: 11.2, 수익타임: 9.5 },
  { date: "6/14", 스토키: 18.2, 친절한미정씨: 12.0, 수익타임: 11.0 },
  { date: "6/15", 스토키: 20.9, 친절한미정씨: 13.0, 수익타임: 12.5 }
];

const CO_DOMINANCE = [
  { name: "트레이드지니", value: 54.4, profit: 242167, desc: "과매수/과매도 차트 분석 스토케스틱 슬로우 기반의 알고리즘", color: "#3182F6" },
  { name: "수익타임", value: 45.3, profit: 201667, desc: "RSI 낙폭과대 기준 수급 가중 알고리즘", color: "#FF5F75" },
  { name: "씀(SSOM)", value: 0.3, profit: 1382, desc: "초대량 프로그램 연속 매수 집중 테마 추적기", color: "#4CC9F0" }
];

const HEATMAP_STOCKS = [
  { name: "화신정공", size: 5, profit: 72.2, cap: 2.1, color: "#F04452" },
  { name: "에이팩트", size: 4, profit: 34.1, cap: 1.5, color: "#FF5F75" },
  { name: "KB금융", size: 8, profit: 11.6, cap: 31.2, color: "#3182F6" },
  { name: "TYM", size: 3, profit: -2.0, cap: 0.9, color: "#8E9BB0" },
  { name: "삼성전자", size: 10, profit: 0.55, cap: 437, color: "#E5E8EB" },
  { name: "SK하이닉스", size: 9, profit: 2.39, cap: 134, color: "#E5E8EB" },
  { name: "알테오젠", size: 6, profit: 25.8, cap: 15.8, color: "#F04452" },
  { name: "현대차", size: 7, profit: -1.02, cap: 51.2, color: "#8E9BB0" }
];

interface CustomNews {
  id: string;
  title: string;
  source: string;
  ago: string;
  tags: string[];
  summary: string;
  content: string;
}

const PREMIUM_NEWS: CustomNews[] = [
  {
    id: "news-1",
    title: "[유레카 테마100] HBM 공급망 수혜 긴급 관찰 리브리핑",
    source: "영웅 리포트 수급마그넷",
    ago: "10분 전",
    tags: ["수급", "반도체", "테마"],
    summary: "삼성전자의 5세대 HBM3E 납품 가능성 증가 기조 진전으로 장비소부장 섹터가 집중 강세를 띠고 있으며, 기관 누적 매수가 시초에 배정될 위험 구간과 지지구역의 정리를 보고합니다.",
    content: `[전술적 매니저 브리핑: 반도체 패러다임 시프트와 공급선 전면 재조정]

1. 최근 시장 최대 이슈: 엔비디아향 HBM3E 테스트 통과 및 대규모 양산 궤도 수렴 기조
글로벌 AI 반도체의 독점적 공급 주체인 엔비디아가 안정적인 부품 수급을 위해 삼성전자의 장비 공동 테스트 및 품질 검증 승인을 연내 속행하는 방향으로 가속화하고 있습니다. 이는 SK하이닉스 단독 체제에서 다자 경쟁 구도로 전환됨을 의미하며, 삼성전자 생태계 소부장(소재·부품·장비) 벤더들에게 전례 없는 퀀텀 점프급 낙수 효과를 불러올 가능성이 매우 높은 국면에 돌입했습니다.

2. 시초가 수급 흐름 및 갭상승 완충 전략
전일 미 증시에서 필라델피아 반도체 지수의 2.4% 반등과 야간 KOSPI200 주가 선물이 0.82% 이상 상향 출발을 점침에 따라, 오늘 시초 거래량은 반도체 대표 종목에 편중된 갭상승 출발을 유도할 것입니다. 그러나 주린이들이 가장 범하기 쉬운 누는 '장 개시 직후 9시 5분 추격 매수'입니다. 기관과 연기금은 시초 갭상승 후 개인 투심을 활용해 전일 저가 매집 물량을 일시적으로 차익 실현하는 경향이 농후합니다. 

3. 최적의 전술적 매입 타이밍 제안
가장 지혜로운 행동 양식은 점심 시간 대인 11:30 ~ 12:30 사이, 거래량이 일시적으로 소강 상태에 접어들며 거래소 평균 갭 보정 지지구역을 터치하는 순간입니다. 5일 이평선이 강력한 바닥 지지대로 확보되는지 분봉상 '3회 음봉 바닥 안착'을 직접 눈으로 확인한 뒤, 2회에 걸쳐 철저히 포지션을 쪼개서 분할 적립하는 전술적 평단 가치를 추구하는 것을 적극 권고합니다.

4. 밸류에이션 점검 및 면책 사항
삼성전자는 여전히 PBR 1.15배 부근의 역사적 저평가 축에 걸쳐 있으며, 향후 영업이익 가이던스 상향 반영 시 PER 역시 11배 수준으로 떨어집니다. 다만, 개별 소부장 종목의 변동성은 반도체 원자재 수출 규제 등 대외 거시적 팩터에 극도로 민감하므로, 개별 시나리오 이탈 시 즉시 분할 비중을 축소하는 엄격한 자산 관리가 필수적입니다.`
  },
  {
    id: "news-2",
    title: "[수급 타임] 화신정공 72.22% 극대화 차트 알고리즘 패턴 분석",
    source: "스토키 관찰엔진",
    ago: "1시간 전",
    tags: ["차트", "급등분석", "돌파"],
    summary: "스토케스틱 슬로우 하단 정밀 다중 바닥 지지선 형성에서부터 시작된 기관 투쟁적 거래대금 점유 기법의 모든 과정을 수치로 공개합니다.",
    content: `[수급 타임 스코프: 화신정공 가치 회복 파동 리서치 요점 보고]

1. 과매도 시그널 감지와 최초 돌파 징후
본 알고리즘 '트레이드지니'와 '수익타임'이 입체 스크리닝을 개시한 시점인 6월 둘째 주 초, 화신정공의 주가는 단기 매물의 가중과 거래량 미진으로 주당 1,980원이라는 극도의 수렴 지대까지 내몰려 있었습니다. 당시 보조 지표인 RSI(상대강도지수)는 역대 최하단 수준인 18p에 인접했으며, 스토케스틱 역시 과도한 심리 공포 영역을 가리키고 있었습니다. 펀더멘탈 면에서 친환경 경량화 변환 구조에 따른 고정 매출 기반이 견고함에도 불구하고 수급 흐름의 왜곡으로 빚어진 철저한 시장 소외 상태였습니다.

2. 세력 주도 가격 골든크로스 분석 (72.22%의 도출 경로)
이후 아침 30분 분봉 거래 회전축에서 미확인 역외 펀드 및 국내 중형 기관의 연속된 3회 누적 순매수 양봉 거래 대금이 순식간에 폭발했습니다. 이는 일반적인 개인의 매매 패턴이 아닌, 특정 주도 주체들의 계획된 매크로 안착 매수세임이 포착되었으며 단숨에 20일과 60일 이평선을 관통하는 대량 골든크로스가 발동되었습니다. 
해당 모멘텀 가치가 온전히 보정되며 마디가(2,100원, 2,300원)를 순차 돌파, 최고점 도달까지 총 누적 72.22%의 이론적 시세를 완성시켰습니다.

3. 실전 모방 가이드라인 및 추후 대응
화신정공의 금일 종가 관리 흐름은 20일 핵심 생명선을 축으로 변동성을 가다듬고 있습니다. 현 수준에서 신규 추격 매수로 무리하게 진착하기보다, 직전 일봉의 꼬리 하단부인 2,050원 부근에서 이격 조정이 발포될 때에 한해 분할 접근하는 전략이 유리합니다. 과매수 구역에 이미 진출해 있는 상태이므로, 당일의 전반 거래량이 직전 평균치의 1/3 하향으로 가라앉는 평화로운 보간 주사 지점에서만 평단을 영입하는 장치 중심의 태도가 상식을 이깁니다. 본 가이드는 단순 수학적 분석을 바탕으로 한 시제 리바운드 기록이므로 직접 자산 손익 한계를 사전 측정해 주십시오.`
  },
  {
    id: "news-3",
    title: "[AI 트렌드] 원/달러 환율 $ 1,340원대 안착과 이자율 파급 효과",
    source: "AI 매크로 가이드",
    ago: "3시간 전",
    tags: ["환율", "거시경제", "안정"],
    summary: "미 연준 추가 인하 신호로 신흥국 자금 유인이 커지며 코스피 수급 활주로가 열리고 있는 아침 분석 결과입니다.",
    content: `[거시 경제 긴급 스페셜 보고서: 외환 안정화 자금 유입 가시도]

1. 미 연방준비제도(Fed)의 통화 궤도 변화와 달러 인덱스 추세 하향
지난 FOMC 정례회의를 거치며 연준 위원들의 연쇄적 기준 금리 인하 지지 발언 및 인플레이션 고착 우려 탈피 증명으로 인해, 달러화의 일방적 독주 국면이 변동 세 축을 맞이했습니다. 원_달러 환율은 수개월 최고 수준인 1,390원대에서 점진 보정되어 1,340원대 지지선으로 안착 중입니다. 환율 하락은 외국인 투자가 그룹의 국내 자산 평가 가치 향상을 유도하기 때문에, 코스피 시장으로의 대규모 패시브 매칭 인덱스 자금 환입 흐름의 매끄러운 고속도로 역할을 수행하고 있습니다.

2. 금리 안정화 민감 대표 수용 업종 발굴
대표적인 고이자율 환경의 장기 피해 업종인 건설, 바이오, 그리고 자산가치 재평가 저PBR에 포진된 대형 지주사 및 금융 섹터(KB금융 등)가 첫 번째 선순위 수혜를 정밀 안착시키고 있습니다. 환율 보정 안정 기간에는 원화 가치 강세가 지속되므로 외국 자본 입장에서 주주 배당 의무가 투명하고 자사주 매입 파쇄가 예정된 주주환원 우수 종목들로 우선 배정하는 시뮬레이션 포트폴리오 전술이 극적 안정성을 가져다 줍니다.

3. 개인 투자 주체의 거시 관망 태도 조율
환율의 급격한 변동 주기에는 장중 지수 선물 흔들기가 배가됩니다. 코스닥 기계 신종 소부장들의 경우 장중 신용 반대매매 추이가 아침에 출현할 수 있으므로, 외환 추이 가속에 맞춰 전술적 현금 보전율을 항시 20% 이상으로 유지하는 균형 잡힌 자산 안착 전략이 초보 주린이가 긴 장세에서 무너지지 않는 필수적인 생존 수칙임을 전합니다.`
  }
];

interface VideoClip {
  id: string;
  title: string;
  duration: string;
  views: string;
  uploader: string;
  tag: string;
  likes: number;
}

const VIDEO_CLIPS: VideoClip[] = [
  { id: "v-1", title: "오늘 아침 5분 브리핑 - 미국 지수 왜 올랐고 한국 시장은 어떻게 반응할까?", duration: "03:42", views: "1.2만회", uploader: "여명에디터", tag: "장전시황", likes: 254 },
  { id: "v-2", title: "수입률 1등 알고리즘 스토키가 선택한 화신정공 핵심 관찰 요점만 콕!", duration: "05:15", views: "4.8천회", uploader: "스토키AI", tag: "종목과녁", likes: 189 },
  { id: "v-3", title: "초보 주린이용 탈출 가이드 - PER 3분만에 완벽 마스터하기", duration: "03:10", views: "8.5천회", uploader: "주린이구조봇", tag: "용어정리", likes: 412 }
];

export default function App() {
  // Splash and active route setup
  const [splashActive, setSplashActive] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Logged in as default, can trigger login view
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; tier: string }>({
    name: "골든크로스_66608",
    phone: "010-0000-0000",
    tier: "무상체험 프로"
  });

  // Current active navigation: "home" | "info" | "clip" | "my"
  const [activeTab, setActiveTab] = useState<"home" | "info" | "clip" | "my">("home");

  // Secondary sub-views (replaces separate routes smoothly)
  const [activeSubView, setActiveSubView] = useState<"none" | "profile" | "alarm-config" | "alarm-history">("none");

  // Navigation Drawer (Sidebar)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Alarms alert triggers
  const [alarmConfigs, setAlarmConfigs] = useState({
    marketing: true,
    signal: true,
    content: false,
    algorithm: true
  });

  // User Interest Stock state
  const [interestStocks, setInterestStocks] = useState<Stock[]>([
    { name: "화신정공", code: "126640", price: 2120, market: "KOSDAQ", change: 143, changeRate: 7.24 },
    { name: "KB금융", code: "105560", price: 78500, market: "KOSPID", change: 1300, changeRate: 1.68 }
  ]);

  // Modals Controller
  const [activeModal, setActiveModal] = useState<{
    type: "none" | "trial" | "login" | "add-stock" | "stock-detail" | "news-read";
    payload?: any;
  }>({ type: "none" });

  // search term inside modals
  const [stockSearch, setStockSearch] = useState<string>("");

  // AI Screener and live interactions
  const [aiTextResult, setAiTextResult] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiScreenerStocks, setAiScreenerStocks] = useState<any[] | null>(null);

  // Real-time time display KST clock
  const [liveKstTime, setLiveKstTime] = useState<string>("");

  // Billing filter
  const [billingFilter, setBillingFilter] = useState<"all" | "algo">("all");

  // Toast
  const [toastMessage, setToastMessage] = useState<string>("");

  useEffect(() => {
    // Timer to skip splash automatically after 3 seconds or on early tap
    const timer = setTimeout(() => {
      setSplashActive(false);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateKst = () => {
      const now = new Date();
      const kstTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 9 * 60 * 60 * 1000);
      const pad = (n: number) => n.toString().padStart(2, "0");
      setLiveKstTime(`${pad(kstTime.getHours())}:${pad(kstTime.getMinutes())}:${pad(kstTime.getSeconds())}`);
    };
    updateKst();
    const clockInterval = setInterval(updateKst, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  const handleSocialLogin = (platform: string) => {
    setIsLoggedIn(true);
    triggerToast(`${platform} 계정으로 안전하게 로그인 완료되었어요!`);
    setActiveModal({ type: "none" });
  };

  const handleAddStock = (st: Stock) => {
    if (interestStocks.some(item => item.code === st.code)) {
      triggerToast("이미 관심 목록에 등록된 종목이에요.");
      return;
    }
    setInterestStocks([...interestStocks, st]);
    triggerToast(`[${st.name}] 종목이 관심 등록되었어요.`);
    setActiveModal({ type: "none" });
  };

  const handleRemoveStock = (code: string) => {
    setInterestStocks(interestStocks.filter(st => st.code !== code));
    triggerToast("관심 종목을 목록에서 정리했습니다.");
  };

  // Run AI search using local API gateway which links to server-side Gemini
  const handleAiInquiry = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiTextResult("");
    setAiScreenerStocks(null);

    try {
      const response = await fetch("/api/ai/screener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: aiPrompt })
      });

      let parsed = null;
      if (response && response.ok) {
        parsed = await response.json();
      }

      if (parsed && parsed.success && parsed.data) {
        setAiScreenerStocks(parsed.data);
        // beautifully formatting results matching screenshots
        const stocksResultText = parsed.data.map((st: any) => (
          `📍 **${st.name}** (${st.code}) - ${st.sector}\n` +
          `• 현재가: ${st.price.toLocaleString()}원 | ROE: ${st.roe}% | 배당금: ${st.divYield}%\n` +
          `• **추천 분석 근거**: ${st.reason}\n`
        )).join("\n");
        setAiTextResult(`💡 **영웅스탁 AI가 엄선해 낸 조건 부합 관찰 종목 포착 결과입니다:**\n\n${stocksResultText}\n* 투자 면책 경고: 본 통계 분석은 참고 자료일 뿐 특정 주식의 1:1 리딩이나 매매 권유가 아니며, 최종 손실 판단은 직접 수행해야 함을 권고드립니다.`);
        triggerToast("AI 스크리너 분석 조사를 성공했습니다!");
        setAiLoading(false);
      } else {
        // elegant offline AI fallback
        const lowerPrompt = aiPrompt.toLowerCase();
        let fallbackStocks = STOCK_DATABASE.slice(0, 3);
        if (lowerPrompt.includes("반도체")) {
          fallbackStocks = STOCK_DATABASE.filter(st => st.name === "SK하이닉스" || st.name === "삼성전자" || st.name === "에이팩트");
        } else if (lowerPrompt.includes("금") || lowerPrompt.includes("금융") || lowerPrompt.includes("가치")) {
          fallbackStocks = STOCK_DATABASE.filter(st => st.name === "KB금융" || st.name === "화신정공");
        }

        setTimeout(() => {
          const results = fallbackStocks.map(st => (
            `📍 **${st.name}** (${st.code}) - ${st.market === "KOSPID" ? "KOSPI" : "KOSDAQ"}\n` +
            `• 현재가: ${st.price.toLocaleString()}원 | 상승률: ${st.changeRate}%\n` +
            `• **매수 관찰 사유**: 정성적 거시 지표 완화 흐름과 외국인 연속 패시브 순매도 강도 한계로 단기 차트 지지 흐름이 발동될 유력 구간 진입.`
          )).join("\n\n");
          setAiTextResult(`💡 **[로컬 백업 엔진 수급분정 수치 도출 결과]**\n\n${results}`);
          
          // Hydrate structured object for visual rendering
          const loadedStocks = fallbackStocks.map(st => {
            let cat = "최근 거시 지표의 점진적 완화와 수급 분산 수렴 지점에 도달한 핵심 종목입니다.";
            let tech = "상승 돌파 후 단기 매매 지지선 안착이 기록되고 있으며 보조 RSI 수치가 매력적인 안도 존에 진착했습니다.";
            let strat = "1차 분할 진입 후 최근 20일 이동평균 전조를 최종 대응선으로 조율하는 안전 분할 가이드가 유리합니다.";
            
            if (st.name === "삼성전자") {
              cat = "차세대 인공지능 엔비디아향 기보유 HBM3E 테스트 검증 기조 및 메모리 출하량 상승 복제 효과 지탱 중입니다.";
              tech = "메이저 외국인 장기 추종 연기 계좌의 11일 연속 순매수가 가중되며 장기 바닥 이평 축 안착 패턴입니다.";
              strat = "시초 갭상승 추격보다는 10시 외국인 방향에 대조하여 2~3회에 걸친 종가 매수 전술이 알맞습니다.";
            } else if (st.name === "SK하이닉스") {
              cat = "글로벌 독점 HBM3E 양산 안정성 1위 성과 지배 및 차세대 공급 단가 상승 시너지가 확보되었습니다.";
              tech = "상승 삼각 조정 파동의 마감 고점에서 매수 거래량 폭증이 기록되어 정배열 정수 골든크로스를 구사 중입니다.";
              strat = "일중 변동성이 비교적 있으므로 5일 지지선을 터치할 때마다 스마트 적립하는 스페이스 진입이 유익합니다.";
            } else if (st.name === "KB금융") {
              cat = "주주 극대 가치를 추앙하는 정부 기업 밸류업 정책의 대장주로서 연내 분기 연속적 세제 혜택 자사주 파기가 이뤄집니다.";
              tech = "저PBR(0.48) 최저 지대 확보와 차트상 매물 저항이 모두 정리된 상방 개척 고속도로 국면입니다.";
              strat = "배당 소득 확보 및 시장 헤지 안전판 편입 용어로 적당하며, 주봉 음봉 시 고루 포지션 구축을 유도하십시오.";
            } else if (st.name === "화신정공") {
              cat = "친환경 경량화 자동차 핵심 섀시 부품 공급업체로서 메이저 기업향 안정 매출이 입증된 알토란 우량 기틀입니다.";
              tech = "스토케스틱 슬로우 20 이하 하단 과매도 지점으로부터 대량 거래 동반 골든크로스가 발동되었습니다.";
              strat = "단기 시세 분출 변동을 활용하여 추세 유지 시 박스 상단 목표로 스윙 대응하는 전략에 적합합니다.";
            }

            const structReason = `📍 **[추천 포착 사유 & 성장 촉매]**\n${cat}\n\n📊 **[수급 트렌드 & 차트 기술 분석]**\n${tech}\n\n⚡ **[전술적 리스크 관리 & 실전 대응 가이드]**\n${strat}\n\n🛡️ *준수 경고: 본 통계 분석은 투자 보완 참고 자료이며 최종 거래 손실 성과는 투자가 직접 검증해야 함을 알립니다.*`;

            return {
              name: st.name,
              code: st.code,
              price: st.price,
              sector: st.name === "삼성전자" || st.name === "SK하이닉스" ? "반도체" :
                      st.name === "알테오젠" ? "바이오" :
                      st.name === "KB금융" ? "금융" : "기계/부품",
              pe: st.name === "삼성전자" ? 14.2 : st.name === "SK하이닉스" ? 18.5 : 8.5,
              pbr: st.name === "삼성전자" ? 1.15 : st.name === "SK하이닉스" ? 1.85 : 0.8,
              roe: st.name === "삼성전자" ? 8.5 : st.name === "SK하이닉스" ? 11.2 : 12.0,
              divYield: st.name === "삼성전자" ? 2.1 : st.name === "SK하이닉스" ? 0.8 : 4.5,
              reason: structReason
            };
          });
          setAiScreenerStocks(loadedStocks);
          setAiLoading(false);
          triggerToast("로컬 엔진으로부터 스마트 포착 조사를 대처 완료했습니다.");
        }, 1500);
      }
    } catch (e) {
      setAiTextResult("이용 상의 통신 신호 장애가 잠시 발생했습니다. 다시 클릭해주세요.");
      setAiLoading(false);
    }
  };

  return (
    <div id="hero-app-container" className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans antialiased selection:bg-[#3182F6]/20 relative">
      <AnimatePresence>
        {/* ==========================================
            SPLASH SCREEN / INTRO GREETING
            ========================================== */}
        {splashActive && (
          <motion.div
            id="splash-overlay"
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-[#0E0E0F] text-[#F4F4F5] z-[9999] flex flex-col items-center justify-between p-8"
            onClick={() => setSplashActive(false)}
          >
            <div className="flex flex-col items-center mt-32">
              <span className="text-[#8B95A1] text-xs font-semibold tracking-wider uppercase mb-2">
                주린이 최고의 친구 AI 분석 플랫폼
              </span>
              <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Zap className="text-[#3182F6] h-10 w-10 fill-[#3182F6] animate-pulse" />
                영웅스탁
              </h1>
              <div className="mt-3 flex items-center gap-1.5 text-[#3182F6] font-mono text-sm">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>HEROSTOCK PRE-MARKET AI</span>
              </div>
            </div>

            <div className="flex flex-col items-center w-full max-w-sm mb-16 gap-4">
              <p className="text-center text-sm text-[#8B95A1] font-medium leading-relaxed">
                "눈뜨면 5분, 오늘 시장이 끝나요." <br />
                인앱 시황 캘린더, 수급 도미넌스, 테마 히트맵을 1초에.
              </p>
              <div className="h-[2px] w-12 bg-zinc-800 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute h-full w-1/2 bg-[#3182F6]"
                />
              </div>
              <span className="text-xs text-[#5E5E64] mt-2 animate-bounce">
                터치하면 지금 둘러볼 수 있어요 →
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          SIDEBAR MENUBAR NAVIGATION DRAWER
          ========================================== */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[1000]"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-[290px] bg-white shadow-2xl z-[1001] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Zap className="text-[#3182F6] h-6 w-6 fill-[#3182F6]" />
                    <span className="font-extrabold text-lg text-[#191F28] tracking-tight">영웅스탁</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-between justify-content p-2">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{currentUser.name}님</div>
                    <div className="text-xs text-gray-400 mt-0.5">반갑습니다!</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setActiveTab("home");
                      setActiveSubView("none");
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
                      activeTab === "home" && activeSubView === "none"
                        ? "bg-[#F2F8FF] text-[#3182F6]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <TrendingUp className="h-5 w-5" />
                    AI 마켓
                  </button>
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setActiveTab("info");
                      setActiveSubView("none");
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
                      activeTab === "info" && activeSubView === "none"
                        ? "bg-[#F2F8FF] text-[#3182F6]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                    투자정보
                  </button>
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setActiveTab("clip");
                      setActiveSubView("none");
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
                      activeTab === "clip" && activeSubView === "none"
                        ? "bg-[#F2F8FF] text-[#3182F6]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Play className="h-5 w-5" />
                    클립 피드
                  </button>
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setActiveTab("my");
                      setActiveSubView("none");
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
                      activeTab === "my" && activeSubView === "none"
                        ? "bg-[#F2F8FF] text-[#3182F6]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    마이페이지 (MY)
                  </button>

                  <div className="h-[1px] bg-gray-100 my-4" />

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setActiveSubView("alarm-config");
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
                      activeSubView === "alarm-config" ? "bg-[#F2F8FF] text-[#3182F6]" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    알림 설정
                  </button>

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setActiveSubView("alarm-history");
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
                      activeSubView === "alarm-history" ? "bg-[#F2F8FF] text-[#3182F6]" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                    알림 내역
                  </button>

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setActiveSubView("profile");
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
                      activeSubView === "profile" ? "bg-[#F2F8FF] text-[#3182F6]" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    내 정보 관리
                  </button>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleSocialLogin("이메일")}
                  className="w-full flex items-center gap-2 justify-center py-3 bg-[#EEF0F3] hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  계정 교체 로그인
                </button>
                <div className="text-[10px] text-center text-gray-300 mt-4 leading-normal">
                  영웅스탁 v1.0.5 <br />
                  © 2026 HEROSTOCK corp.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==========================================
          TOP HEAD NAVIGATION BAR
          ========================================== */}
      <header className="sticky top-0 bg-white border-b border-[#E5E8EB] z-50 px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 px-2 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all mr-1"
            >
              <Menu className="h-6 w-6 text-gray-800" />
            </button>
            <span
              onClick={() => {
                setActiveTab("home");
                setActiveSubView("none");
              }}
              className="font-black text-2xl text-gray-900 tracking-tight flex items-center gap-1.5 cursor-pointer hover:opacity-90"
            >
              <Zap className="text-[#3182F6] h-6 w-6 fill-[#3182F6]" />
              영웅스탁
            </span>
          </div>

          {/* Core Navigation for desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => {
                setActiveTab("home");
                setActiveSubView("none");
              }}
              className={`font-extrabold text-sm ${
                activeTab === "home" && activeSubView === "none" ? "text-[#3182F6]" : "text-gray-500 hover:text-gray-950"
              }`}
            >
              AI 마켓
            </button>
            <button
              onClick={() => {
                setActiveTab("info");
                setActiveSubView("none");
              }}
              className={`font-extrabold text-sm ${
                activeTab === "info" && activeSubView === "none" ? "text-[#3182F6]" : "text-gray-500 hover:text-gray-950"
              }`}
            >
              투자정보
            </button>
            <button
              onClick={() => {
                setActiveTab("clip");
                setActiveSubView("none");
              }}
              className={`font-extrabold text-sm ${
                activeTab === "clip" && activeSubView === "none" ? "text-[#3182F6]" : "text-gray-500 hover:text-gray-950"
              }`}
            >
              클립 피드
            </button>
            <button
              onClick={() => {
                setActiveTab("my");
                setActiveSubView("none");
              }}
              className={`font-extrabold text-sm ${
                activeTab === "my" && activeSubView === "none" ? "text-[#3182F6]" : "text-gray-500 hover:text-gray-950"
              }`}
            >
              마이페이지 (MY)
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Live KST Clock Badges */}
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 text-[11px] font-bold text-gray-500">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
              KST {liveKstTime}
            </span>

            {/* Notification bell */}
            <button
              onClick={() => setActiveSubView("alarm-history")}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500"></span>
            </button>

            {/* Profile trigger */}
            <button
              onClick={() => setActiveSubView("profile")}
              className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#3182F6]/10 hover:text-[#3182F6] transition-all"
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          MAIN AREA GRID
          ========================================== */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Toast Toast alerts */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-24 left-4 right-4 md:left-auto md:right-12 z-[999] md:max-w-md bg-zinc-900 border border-zinc-800 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3"
            >
              <CheckCircle2 className="text-[#3182F6] h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-semibold">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==========================================
            SECONDARY OVERLAYS LAYERED (PROFILE, ALARMS)
            ========================================== */}
        {activeSubView !== "none" ? (
          <div>
            <div className="mb-6 flex items-center gap-2">
              <button
                onClick={() => setActiveSubView("none")}
                className="text-xs font-bold text-[#3182F6] bg-[#F2F8FF] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:brightness-95 transition-all"
              >
                ← 이전 화면으로 돌아가기
              </button>
            </div>

            {/* SUBVIEW 1: 내 정보 관리 */}
            {activeSubView === "profile" && (
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.015)] p-6">
                <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-1.5">
                  내 정보 관리
                </h2>

                <div className="flex flex-col items-center gap-2 mb-8 bg-[#F8F9FA] rounded-2xl p-5 border border-gray-50">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#191F28]">{currentUser.name}</span>
                    <button
                      onClick={() => {
                        const newName = prompt("변경할 이름을 입력하세요", currentUser.name);
                        if (newName) {
                          setCurrentUser({ ...currentUser, name: newName });
                          triggerToast("성공적으로 변경되었습니다!");
                        }
                      }}
                      className="p-1 hover:bg-gray-200 rounded text-gray-400"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-xs bg-[#E5F1FF] text-[#3182F6] font-bold px-2 py-0.5 rounded-full">
                    {currentUser.tier}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-sm font-bold text-gray-500">휴대폰 번호</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-800">{currentUser.phone}</span>
                      <button
                        onClick={() => {
                          const newPhone = prompt("휴대폰 번호를 입력하세요", currentUser.phone);
                          if (newPhone) {
                            setCurrentUser({ ...currentUser, phone: newPhone });
                            triggerToast("휴대폰 정보가 갱신되었습니다.");
                          }
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-3">
                    <span className="text-sm font-bold text-gray-500">서비스 해지</span>
                    <button
                      onClick={() => {
                        if (confirm("정말로 탈퇴하시겠습니까? 관련 데이터가 소실돼요.")) {
                          triggerToast("안전하게 해지 처리되었습니다.");
                          setIsLoggedIn(false);
                          setActiveSubView("none");
                        }
                      }}
                      className="text-xs font-bold text-gray-400 hover:text-rose-500 underline"
                    >
                      회원 탈퇴
                    </button>
                  </div>
                </div>

                {/* Billing histories as requested */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-sm text-gray-500 uppercase tracking-wider">
                      결제내역
                    </h3>
                    <div className="flex items-center bg-gray-100 p-0.5 rounded-lg">
                      <button
                        onClick={() => setBillingFilter("all")}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-md transition-all ${
                          billingFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                        }`}
                      >
                        전체
                      </button>
                      <button
                        onClick={() => setBillingFilter("algo")}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-md transition-all ${
                          billingFilter === "algo" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                        }`}
                      >
                        알고리즘
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-gray-50 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-gray-800">PRO 인공지능 추천 멤버십 정기 이용권</div>
                        <div className="text-xs text-gray-400 mt-1">2026.06.12 결제 완료</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#F04452]">-29,900원</div>
                        <div className="text-[10px] text-gray-400 font-semibold mt-0.5">매월 정기결제</div>
                      </div>
                    </div>

                    {billingFilter === "all" && (
                      <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-gray-50 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-gray-800">스타터 1개월 전면 무료 수급 이벤트 지원</div>
                          <div className="text-xs text-gray-400 mt-1">2026.06.01 참여 완료</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-500">0원 (지원)</div>
                          <div className="text-[10px] text-[#3182F6] font-extrabold mt-0.5">체험판 기교</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBVIEW 2: 알림 설정 */}
            {activeSubView === "alarm-config" && (
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.015)] p-6">
                <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-1.5">
                  알림 설정
                </h2>

                <div className="space-y-4 mb-16">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-5">
                    <div>
                      <div className="text-sm font-extrabold text-gray-800">마케팅, 이벤트 알림</div>
                      <div className="text-xs text-gray-400 mt-1">영웅스탁에서 제공하는 혜택 및 이벤트 알림을 받습니다.</div>
                    </div>
                    <button
                      onClick={() => setAlarmConfigs({ ...alarmConfigs, marketing: !alarmConfigs.marketing })}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                        alarmConfigs.marketing ? "bg-[#3182F6]" : "bg-gray-200"
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-full bg-white transition-transform ${alarmConfigs.marketing ? "translate-x-5" : ""}`} />
                    </button>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-5">
                    <div>
                      <div className="text-sm font-extrabold text-gray-800">[관심종목] 매매 신호 알림</div>
                      <div className="text-xs text-gray-400 mt-1">등록된 관심종목의 매매 신호 알림을 받습니다.</div>
                    </div>
                    <button
                      onClick={() => setAlarmConfigs({ ...alarmConfigs, signal: !alarmConfigs.signal })}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                        alarmConfigs.signal ? "bg-[#3182F6]" : "bg-gray-200"
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-full bg-white transition-transform ${alarmConfigs.signal ? "translate-x-5" : ""}`} />
                    </button>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-5">
                    <div>
                      <div className="text-sm font-extrabold text-gray-800">[관심종목] 콘텐츠 알림</div>
                      <div className="text-xs text-gray-400 mt-1">등록된 관심종목의 새로운 콘텐츠 알림을 받습니다.</div>
                    </div>
                    <button
                      onClick={() => setAlarmConfigs({ ...alarmConfigs, content: !alarmConfigs.content })}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                        alarmConfigs.content ? "bg-[#3182F6]" : "bg-gray-200"
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-full bg-white transition-transform ${alarmConfigs.content ? "translate-x-5" : ""}`} />
                    </button>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-5">
                    <div>
                      <div className="text-sm font-extrabold text-gray-800">[구독 알고리즘] 알림</div>
                      <div className="text-xs text-gray-400 mt-1">구독 알고리즘이 추천하는 종목 및 시황 알림을 받습니다.</div>
                    </div>
                    <button
                      onClick={() => setAlarmConfigs({ ...alarmConfigs, algorithm: !alarmConfigs.algorithm })}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                        alarmConfigs.algorithm ? "bg-[#3182F6]" : "bg-gray-200"
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-full bg-white transition-transform ${alarmConfigs.algorithm ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="text-center font-semibold text-xs text-gray-400">
                  앱버전: 1.0.5, Release 41
                </div>
              </div>
            )}

            {/* SUBVIEW 3: 알림 내역 */}
            {activeSubView === "alarm-history" && (
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.015)] p-6">
                <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-1.5">
                  알림 내역
                </h2>

                <div className="flex border-b border-gray-100 mb-6 gap-6">
                  {["전체", "종목", "시황", "이벤트"].map((tab, idx) => (
                    <button
                      key={tab}
                      className={`pb-3 text-sm font-extrabold border-b-[2px] transition-all ${
                        idx === 0 ? "border-[#3182F6] text-[#3182F6]" : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="py-12 flex flex-col items-center justify-center bg-[#F8F9FA] rounded-2xl border border-dashed border-gray-100">
                  <BellRing className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-sm font-bold text-gray-400">알림 내역이 없습니다.</p>
                  <p className="text-xs text-gray-400 mt-1">새로운 수급 포착과 매도 관찰 이벤트가 발생 시 신속히 알립니다.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* ==========================================
                ROUTED VIEWS BY TAB
                ========================================== */}

            {/* ROUTE 1: 홈 (AI 마켓) */}
            {activeTab === "home" && (
              <div className="space-y-6">
                {/* 1. Purple promotional free trial banner */}
                <div
                  onClick={() => setActiveModal({ type: "trial" })}
                  className="bg-gradient-to-r from-[#5E39FF] to-[#3182F6] hover:brightness-105 active:scale-[0.99] transition-all rounded-[24px] p-6 text-white cursor-pointer relative overflow-hidden shadow-lg flex items-center justify-between"
                >
                  <div className="z-10 relative">
                    <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-extrabold">
                      수익률, 만족도 1등
                    </span>
                    <h3 className="text-2xl font-black tracking-tight mt-2">
                      1개월 무료 체험 쿠폰 받기
                    </h3>
                    <p className="text-xs text-indigo-100 font-medium mt-1 leading-normal">
                      "수급몬스터" AI 알고리즘 전략 전면 실시간 대오픈
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center text-3xl font-extrabold z-10 select-none relative animate-bounce">
                    🐳
                  </div>
                  <div className="absolute top-[-30px] right-[-20px] h-32 w-32 bg-white/5 rounded-full filter blur-xl"></div>
                </div>

                {/* AI Screener Interactive Box */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs bg-[#F2F8FF] text-[#3182F6] font-bold px-2 py-0.5 rounded-full">
                      영웅스탁 독점 AI 스크리너
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                    내 관심 종목이나 조건 테마를 AI 알고리즘에게 물어보세요
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    예: ‘미국 금리인하 수혜 밸류업 금융주’, ‘화신정공 모멘텀 사유’, ‘반도체 수급 대장주’
                  </p>

                  <div className="mt-4 flex gap-2">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 flex-1 flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="이름이나 탐색 사유를 한국어로 물어보세요"
                        className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder-gray-300 py-3 text-gray-800"
                        onKeyDown={(e) => e.key === "Enter" && handleAiInquiry()}
                      />
                    </div>
                    <button
                      onClick={handleAiInquiry}
                      disabled={aiLoading}
                      className="bg-[#3182F6] hover:bg-[#1B64DA] text-white text-xs font-black rounded-xl px-4 py-3 transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {aiLoading ? "포착 중..." : "AI 스크리닝"}
                    </button>
                  </div>

                  {aiTextResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="mt-6 space-y-4"
                    >
                      {/* Dashboard Header */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#3182F6] animate-ping"></span>
                          <span className="text-xs font-black text-gray-800">
                            영웅스탁 AI 최첨단 스크리닝 계량 진화 보고서
                          </span>
                        </div>
                        <span className="text-xxs text-gray-400 font-mono tracking-wider">
                          REALTIME INFERENCE
                        </span>
                      </div>

                      {/* Render structured stock list if available */}
                      {aiScreenerStocks && aiScreenerStocks.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {aiScreenerStocks.map((st: any, idx: number) => {
                            const isFav = interestStocks.some(fav => fav.code === st.code);
                            const parsedLines = st.reason ? st.reason.split("\n").filter((l: string) => l.trim() !== "") : [];

                            return (
                              <div
                                key={idx}
                                className="bg-[#FAFBFD] border border-gray-100 hover:border-blue-100 rounded-[20px] p-5 transition-all shadow-xs relative overflow-hidden"
                              >
                                {/* Top Badges */}
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold bg-[#3182F6]/5 text-[#3182F6] px-2.5 py-0.5 rounded-full">
                                      {st.sector || "미분류 테마"}
                                    </span>
                                    <span className="text-xxs font-mono text-gray-400">
                                      #{st.code}
                                    </span>
                                  </div>
                                  
                                  {/* Quick interest adder */}
                                  <button
                                    onClick={() => {
                                      if (isFav) {
                                        handleRemoveStock(st.code);
                                      } else {
                                        handleAddStock({
                                          name: st.name,
                                          code: st.code,
                                          price: Number(st.price) || 50000,
                                          market: st.sector === "금융" || st.name === "삼성전자 animate" || st.name === "KB금융" || st.sector === "반도체" ? "KOSPID" : "KOSDAQ",
                                          change: Math.floor((Number(st.price) || 50000) * 0.012),
                                          changeRate: 1.2
                                        });
                                      }
                                    }}
                                    className={`text-xxs px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1 ${
                                      isFav
                                        ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        : "bg-[#3182F6]/10 text-[#3182F6] hover:bg-[#3182F6]/20"
                                    }`}
                                  >
                                    <span>{isFav ? "★ 등록해제" : "☆ 관심목록 추가"}</span>
                                  </button>
                                </div>

                                {/* Stock Title & Core Indicators */}
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-4">
                                  <div>
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight">
                                      {st.name}
                                    </h4>
                                    <p className="text-base font-black text-[#FF424F] mt-1">
                                      {Number(st.price).toLocaleString()}원
                                    </p>
                                  </div>

                                  {/* Statistics Pill Panel */}
                                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 text-xxs font-mono shrink-0">
                                    <div className="px-1 text-center border-r border-gray-100">
                                      <p className="text-gray-400 pb-0.5">PER</p>
                                      <p className="font-extrabold text-gray-700">{st.pe || "N/A"}</p>
                                    </div>
                                    <div className="px-1 text-center border-r border-gray-100">
                                      <p className="text-gray-400 pb-0.5">PBR</p>
                                      <p className="font-extrabold text-gray-700">{st.pbr || "N/A"}</p>
                                    </div>
                                    <div className="px-1 text-center border-r border-gray-100">
                                      <p className="text-gray-400 pb-0.5">ROE</p>
                                      <p className="font-extrabold text-blue-500">{st.roe || "N/A"}%</p>
                                    </div>
                                    <div className="px-1 text-center">
                                      <p className="text-gray-400 pb-0.5">배당금</p>
                                      <p className="font-extrabold text-emerald-500">{st.divYield || "0"}%</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Analytical Reason */}
                                <div className="bg-white rounded-2xl p-4 border border-gray-50 text-xs text-gray-600 space-y-3 shadow-2xs leading-relaxed">
                                  {parsedLines.map((line: string, lIdx: number) => {
                                    let isHeading = false;
                                    let headingText = line;
                                    let headingColor = "text-gray-800";
                                    let icon = "📍";

                                    // Check lines and structure
                                    if (line.includes("추천 포착 사유") || line.includes("성장 촉매")) {
                                      isHeading = true;
                                      headingColor = "text-[#3182F6]";
                                      icon = "📍";
                                      headingText = "추천 포착 사유 & 성장 촉매";
                                    } else if (line.includes("수급 트렌드") || line.includes("기술 분석") || line.includes("차트 수급")) {
                                      isHeading = true;
                                      headingColor = "text-[#24DBAF]";
                                      icon = "📊";
                                      headingText = "수급 트렌드 & 차트 분석";
                                    } else if (line.includes("리스크") || line.includes("대응 Guide") || line.includes("대응 가이드")) {
                                      isHeading = true;
                                      headingColor = "text-[#FF424F]";
                                      icon = "⚡";
                                      headingText = "위험 관리 & 대응 가이드";
                                    }

                                    const cleanLineContent = line
                                      .replace(/^\s*[📍📊⚡🛡️]\s*\**\[?/, "")
                                      .replace(/\]\**\s*/, "")
                                      .replace(/\*\*/g, "")
                                      .replace(/(추천 포착 사유 & 성장 촉매|수급 트렌드 & 차트 기술 분석|전술적 리스크 관리 & 실전 대응 가이드|추천 분석 근거|매매 포착 사유|매수 관찰 사유)/, "")
                                      .trim();

                                    if (isHeading) {
                                      return (
                                        <div key={lIdx} className="flex items-center gap-1 bg-[#FAFBFD] p-2 rounded-lg font-bold border border-gray-50 mt-2">
                                          <span>{icon}</span>
                                          <span className={`${headingColor} font-black text-xxs`}>[{headingText}]</span>
                                        </div>
                                      );
                                    } else if (line.startsWith("*") || line.startsWith("🛡️")) {
                                      return (
                                        <p key={lIdx} className="text-xxs text-gray-400 bg-gray-50 p-2 rounded-md leading-normal italic">
                                          {line}
                                        </p>
                                      );
                                    } else {
                                      return (
                                        <p key={lIdx} className="text-xs text-gray-700 font-medium pl-1 leading-relaxed">
                                          {line}
                                        </p>
                                      );
                                    }
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* Simple Text Render Backup */
                        <div className="p-4 bg-[#F2F8FF] border border-[#3182F6]/10 rounded-2xl">
                          <pre className="text-xs font-semibold whitespace-pre-wrap leading-relaxed text-[#3182F6] font-sans">
                            {aiTextResult}
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* 2. 알고리즘 수익률 랭킹 */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        알고리즘 수익률 랭킹
                      </h4>
                      <h3 className="text-lg font-extrabold text-gray-900 mt-0.5 leading-tight">
                        5일 간 알고리즘 수익률 랭킹
                      </h3>
                    </div>
                    <span className="text-xs font-extrabold text-[#3182F6] bg-[#3182F6]/10 rounded-full px-2.5 py-1">
                      실시간 동기화
                    </span>
                  </div>

                  {/* High quality recharts line chart for algorithms */}
                  <div className="h-[210px] w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ALGO_RETURNS_HISTORY}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                        <XAxis dataKey="date" stroke="#8B95A1" fontSize={11} tickLine={false} />
                        <YAxis stroke="#8B95A1" fontSize={11} tickFormatter={(val) => `${val}%`} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #EEF0F2", background: "white" }} />
                        <Line type="monotone" dataKey="스토키" stroke="#FF5F75" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="친절한미정씨" stroke="#4CC9F0" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="수익타임" stroke="#3182F6" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {ALGORITHMS.map((algo, idx) => (
                      <div
                        key={algo.name}
                        onClick={() => setActiveModal({ type: "stock-detail", payload: algo })}
                        className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-2xl border border-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-[#5E5E64] w-4 text-center">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                              {algo.name}
                              <span className="text-[10px] bg-gray-100 text-[#4E5968] font-bold px-1.5 py-0.5 rounded">
                                {algo.tag}
                              </span>
                            </span>
                            <span className="text-xs text-gray-450 font-medium block mt-0.5">
                              {algo.desc}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[12px] text-[#F04452] font-black bg-[#F04452]/10 px-2.5 py-1 rounded-full">
                            +{algo.rate}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. 추천종목 수익 히트맵 */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      수익 시가총액 비교
                    </h4>
                    <h3 className="text-lg font-extrabold text-gray-900 mt-0.5 leading-tight">
                      추천종목 수익 히트맵 분포 (조원 / %)
                    </h3>
                  </div>

                  <div className="h-[210px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <XAxis type="number" dataKey="cap" name="시가총액" unit="조" stroke="#8B95A1" fontSize={11} tickLine={false} />
                        <YAxis type="number" dataKey="profit" name="수익률" unit="%" stroke="#8B95A1" fontSize={11} tickLine={false} />
                        <ZAxis type="number" dataKey="size" range={[150, 600]} />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: "12px" }} />
                        <Scatter name="추천종목" data={HEATMAP_STOCKS}>
                          {HEATMAP_STOCKS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {HEATMAP_STOCKS.map((coin) => (
                      <span
                        key={coin.name}
                        className="text-xs bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-gray-600 font-bold flex items-center gap-1.5"
                      >
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: coin.color }} />
                        {coin.name} ({coin.profit > 0 ? "+" : ""}{coin.profit}%)
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. 매수 추천가 비교 */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        매수 추천가 비교
                      </h4>
                      <h3 className="text-lg font-extrabold text-gray-900 mt-0.5 leading-tight">
                        알고리즘 평균 매수가 분석
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        추천 매수 제한 기준선: 1,807원 ~ 4,105원
                      </p>
                    </div>
                  </div>

                  {/* Special 화신정공 focus card details */}
                  <div className="bg-[#FAF9FF] border border-indigo-50/70 rounded-2xl p-5 mb-4 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-[#3182F6] font-extrabold bg-[#3182F6]/10 px-2.5 py-0.5 rounded-full">
                          KOSDAQ 대표관찰주
                        </span>
                        <h4 className="text-lg font-extrabold text-gray-950 mt-1 flex items-center gap-1.5">
                          화신정공
                          <span className="text-xs font-mono text-gray-400">126640</span>
                        </h4>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-[#F04452]">2,120원</div>
                        <div className="text-xs text-[#F04452] font-extrabold mt-0.5">▲ 143 ( +7.24% )</div>
                      </div>
                    </div>

                    <div className="h-[140px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { date: "6/11", 현재가: 1980, 평균가: 2050, 최저치: 1800 },
                          { date: "6/12", 현재가: 2010, 평균가: 2050, 최저치: 1800 },
                          { date: "6/13", 현재가: 1990, 평균가: 2050, 최저치: 1800 },
                          { date: "6/14", 현재가: 2040, 평균가: 2050, 최저치: 1800 },
                          { date: "6/15", 현재가: 2120, 평균가: 2050, 최저치: 1800 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F2" vertical={false} />
                          <XAxis dataKey="date" stroke="#8B95A1" fontSize={10} tickLine={false} />
                          <YAxis stroke="#8B95A1" fontSize={10} tickLine={false} domain={[1600, 2300]} />
                          <Tooltip />
                          <Area type="monotone" dataKey="현재가" stroke="#F04452" fill="url(#colorUv)" strokeWidth={2} />
                          <Area type="monotone" dataKey="평균가" stroke="#3182F6" strokeDasharray="4 4" fill="none" />
                          <Area type="monotone" dataKey="최저치" stroke="#10B981" fill="none" strokeWidth={1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-between text-xs mt-3 border-t border-indigo-100/50 pt-2 text-[#4E5968] font-bold">
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#F04452]" />
                        현재가 (2,120원)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#3182F6]" />
                        평균 매수가 (2,050원)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                        최저매수가 (1,800원)
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. 알고리즘 순위 & 종목당 평균 수익률 */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    알고리즘 상세 순위 지표
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#FAF9FF] p-4 rounded-2xl border border-[#EEF3FF]">
                      <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5 mb-3">
                        <Award className="h-4 w-4 text-amber-500" />
                        종목당 평균 수익률 순위
                      </h4>
                      <div className="space-y-2 text-sm font-bold text-[#191F28]">
                        <div className="flex justify-between pb-1 border-b border-gray-100">
                          <span>1. 하이불스</span>
                          <span className="text-[#F04452]">+18.3%</span>
                        </div>
                        <div className="flex justify-between pb-1 border-b border-gray-100">
                          <span>2. 스토키</span>
                          <span className="text-[#F04452]">+10.2%</span>
                        </div>
                        <div className="flex justify-between pb-1 border-b border-gray-100">
                          <span>3. 수익타임</span>
                          <span className="text-[#F04452]">+8.4%</span>
                        </div>
                        <div className="flex justify-between pb-1 border-b border-gray-100">
                          <span>4. 친절한미정씨</span>
                          <span className="text-[#F04452]">+7.3%</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>5. 슈퍼스토스</span>
                          <span className="text-gray-400">+3.0%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FAF9FF] p-4 rounded-2xl border border-[#EEF3FF]">
                      <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5 mb-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        추천 종목 승률 순위
                      </h4>
                      <div className="space-y-2 text-sm font-bold text-[#191F28]">
                        <div className="flex justify-between pb-1 border-b border-gray-100">
                          <span>1. 하이불스</span>
                          <span className="text-emerald-600">94%</span>
                        </div>
                        <div className="flex justify-between pb-1 border-b border-gray-100">
                          <span>2. 스토키</span>
                          <span className="text-emerald-500">88%</span>
                        </div>
                        <div className="flex justify-between pb-1 border-b border-gray-100">
                          <span>3. 수익타임</span>
                          <span className="text-emerald-500">82%</span>
                        </div>
                        <div className="flex justify-between pb-1 border-b border-gray-100">
                          <span>4. 친절한미정씨</span>
                          <span className="text-emerald-500">80%</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>5. 슈퍼스토스</span>
                          <span className="text-gray-400">72%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. 수익 도미넌스 */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      수익 도미넌스 분배
                    </h4>
                    <h3 className="text-lg font-extrabold text-gray-900 mt-0.5 leading-tight">
                      전체 수익중 각 CP사가 차지하는 비율
                    </h3>
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
                    {/* Donut chart represent total profit */}
                    <div className="h-[180px] w-[180px] shrink-0 relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={CO_DOMINANCE}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {CO_DOMINANCE.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">총 수익금</span>
                        <span className="text-sm font-black text-emerald-500">+445,216</span>
                      </div>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                      {CO_DOMINANCE.map((item) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex items-center justify-between text-sm font-bold text-gray-800">
                            <span className="flex items-center gap-1.5">
                              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                              {item.name}
                            </span>
                            <span>{item.value}% (+{item.profit.toLocaleString()}원)</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7. 내 관심 종목을 AI 알고리즘 생각 */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    AI 알고리즘 분석 평가
                  </h4>

                  <div className="bg-[#FFF5F6] border border-rose-100 rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3 border-b border-rose-100/50 pb-2.5">
                      <span className="text-xs font-extrabold text-[#F04452]">수익률 72.22% 달성 분석주</span>
                      <span className="text-xs font-bold text-gray-400">추천일: 2026.06.05</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-extrabold text-gray-950">화신정공</h4>
                        <span className="text-xs font-medium text-gray-450 block mt-0.5">매수가: 1,980원 | 보유현황: 매도</span>
                      </div>
                      <span className="text-xs font-black bg-[#F04452] text-white px-3 py-1.5 rounded-xl">매도 완료</span>
                    </div>

                    <p className="text-xs text-gray-700 font-bold leading-relaxed mt-4 bg-white/70 p-3 rounded-xl border border-rose-50/50">
                      "뉴지랭크는 최근 화신정공의 주체 수급 기여도 및 기술적 모멘텀이 장기 상승 흐름으로 수렴하고 부합한다고 판단하여 해당 최적 지점에서 추천을 발동했습니다."
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-gray-400 font-bold">
                      <span>뉴지랭크: 계량적 정밀 퀀트 분석 엔진 제공사</span>
                      <span className="text-[#3182F6]">상세 분석글 보기 →</span>
                    </div>
                  </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="text-center text-[11px] text-gray-400 font-bold leading-normal pt-4 border-t border-gray-100">
                  영웅스탁 · 투자 참고용 정보 제공 목적입니다. <br />
                  특정 종목의 매수∙매도를 절대 권유하지 않으며, 최종 판단과 책임은 투자자 본인에게 있습니다.
                </div>
              </div>
            )}

            {/* ROUTE 2: 투자정보 (유레카 테마100 / 최신글) */}
            {activeTab === "info" && (
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    AI 리서치 센터
                  </h4>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-0.5 leading-tight mb-4">
                    유레카 테마100 & 최신 분석 보고서
                  </h3>
                </div>

                {/* Subcategories */}
                <div className="flex border-b border-gray-100 mb-6 gap-6 text-sm font-extrabold text-gray-400">
                  <button className="pb-3 border-b-[2px] border-[#3182F6] text-[#3182F6]">
                    종합 뉴스레터 ({PREMIUM_NEWS.length})
                  </button>
                  <button className="pb-3 border-b-[2px] border-transparent hover:text-gray-600">
                    실시간 테마100
                  </button>
                  <button className="pb-3 border-b-[2px] border-transparent hover:text-gray-600">
                    전망 요약
                  </button>
                </div>

                <div className="space-y-4">
                  {PREMIUM_NEWS.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => setActiveModal({ type: "news-read", payload: report })}
                      className="p-4 hover:bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer transition-all space-y-2.5"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {report.tags.map(tg => (
                          <span key={tg} className="text-[10px] bg-[#F2F8FF] text-[#3182F6] px-2 py-0.5 rounded font-black">
                            #{tg}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-base font-extrabold text-gray-950 hover:text-[#3182F6] transition-colors leading-tight">
                        {report.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">
                        {report.summary}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold border-t border-gray-50 pt-2">
                        <span>{report.source}</span>
                        <span>{report.ago}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE 3: 클립 피드 */}
            {activeTab === "clip" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    영웅스탁 비디오 클립
                  </h4>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-0.5 leading-tight mb-1">
                    5분 만에 끝내는 아침 시황 비디오 리캡
                  </h3>
                  <p className="text-xs text-gray-400">
                    최고의 퀀트 전문가 및 AI 뉴스봇들의 핵심 요약본을 시청해보세요.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {VIDEO_CLIPS.map((clip) => (
                    <div
                      key={clip.id}
                      className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden flex flex-col"
                    >
                      {/* Video Player Mockup inside a high contrast frame */}
                      <div className="bg-zinc-950 aspect-video relative flex items-center justify-center text-white p-4 overflow-hidden group">
                        {/* Beautiful dynamic visualizer background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-transparent to-rose-900/30"></div>
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <button
                            onClick={() => triggerToast(`[${clip.title}] 동영상을 실시간 스트리밍 시청합니다!`)}
                            className="h-14 w-14 rounded-full bg-[#3182F6] hover:bg-[#1B64DA] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                          >
                            <Play className="h-6 w-6 fill-white ml-1" />
                          </button>
                        </div>

                        {/* Badges on top */}
                        <div className="absolute top-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold z-10 text-[#3182F6]">
                          {clip.tag}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold z-10">
                          {clip.duration}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-extrabold text-gray-900 leading-snug">
                            {clip.title}
                          </h4>
                          <span className="text-[11px] text-gray-400 font-semibold block">
                            업로더: {clip.uploader} | 조회수 {clip.views}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-4">
                          <button
                            onClick={() => triggerToast("동영상 좋아요가 추가되었어요!")}
                            className="text-xs font-bold text-gray-400 hover:text-rose-500 flex items-center gap-1"
                          >
                            <Heart className="h-4 w-4" />
                            <span>{clip.likes}</span>
                          </button>
                          <button
                            onClick={() => triggerToast("댓글 목록을 열고 있습니다.")}
                            className="text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>댓글(8)</span>
                          </button>
                          <button
                            onClick={() => triggerToast("클립 링크 주소를 클립보드에 복사했습니다.")}
                            className="text-xs font-bold text-gray-400 hover:text-[#3182F6] flex items-center gap-1"
                          >
                            <Share2 className="h-4 w-4" />
                            <span>공유</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE 4: MY */}
            {activeTab === "my" && (
              <div className="space-y-6">
                {/* Profile card summary */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-950 leading-tight">
                        {currentUser.name}
                      </h3>
                      <button
                        onClick={() => setActiveSubView("profile")}
                        className="text-xs font-bold text-gray-400 hover:text-[#3182F6] flex items-center gap-0.5 mt-1"
                      >
                        내 정보 관리 <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t sm:border-y border-gray-50 pt-3 sm:pt-0">
                    <button
                      onClick={() => triggerToast("1:1 맞춤 고객 센터 문의가 열렸어요.")}
                      className="border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-extrabold text-gray-600 transition-colors"
                    >
                      문의하기
                    </button>
                    <button
                      onClick={() => handleSocialLogin("이메일")}
                      className="border border-transparent hover:bg-gray-50 px-3 py-1.5 rounded-xl text-xs font-extrabold text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>

                {/* Subscription promo banner */}
                <div
                  onClick={() => setActiveModal({ type: "trial" })}
                  className="bg-indigo-600 rounded-[24px] p-6 text-white cursor-pointer hover:brightness-105 active:scale-[0.99] transition-all relative overflow-hidden flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] bg-white/20 text-white font-extrabold px-2.5 py-0.5 rounded-full">
                      수익률, 만족도 1등
                    </span>
                    <h3 className="text-xl font-black mt-2 leading-tight">
                      1개월 무료 체험 혜택 안내
                    </h3>
                    <p className="text-xs text-indigo-100 font-medium mt-1">
                      구독 즉시 수급몬스터의 24시 분석 데이터 대오픈
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-white/15 rounded-full flex items-center justify-center text-xl select-none">
                    🎁
                  </div>
                </div>

                {/* 관심 종목 섹션 */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-base text-gray-950">
                      관심 종목
                    </h3>
                    <button
                      onClick={() => setActiveModal({ type: "add-stock" })}
                      className="text-xs font-black text-[#3182F6] bg-[#F2F8FF] px-3 py-1.5 rounded-xl flex items-center gap-1 hover:brightness-95 transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      종목 추가하기
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {interestStocks.length > 0 ? (
                      interestStocks.map((st) => (
                        <div
                          key={st.code}
                          className="bg-[#F8F9FA] hover:bg-gray-50 border border-gray-50 rounded-2xl p-4 flex items-center justify-between transition-colors"
                        >
                          <div>
                            <span className="text-[10px] text-gray-400 font-mono block">
                              {st.code} | {st.market}
                            </span>
                            <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">
                              {st.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-extrabold text-[#F04452]">
                                {st.price.toLocaleString()}원
                              </div>
                              <div className="text-xs text-[#F04452] font-semibold mt-0.5">
                                ▲ {st.changeRate}%
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveStock(st.code)}
                              className="p-1 text-gray-350 hover:text-rose-500 rounded hover:bg-gray-100 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-gray-400 font-bold border border-dashed border-gray-100 rounded-2xl">
                        관심 종목이 없습니다. 우측 추가하기 버튼으로 편리하게 채워보세요.
                      </div>
                    )}
                  </div>
                </div>

                {/* 당일추천종목 섹션 */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 text-center">
                  <h3 className="font-extrabold text-left text-base text-gray-950 mb-6">
                    당일 추천 종목 리포트
                  </h3>

                  <div className="py-8 flex flex-col items-center justify-center bg-[#F8F9FA] rounded-2xl border border-gray-50">
                    <Award className="h-10 w-10 text-[#3182F6] mb-3 fill-[#3182F6]/10" />
                    <p className="text-sm font-bold text-gray-400">구독 등록된 내역이 없습니다.</p>
                    <p className="text-xs text-gray-450 mt-1 max-w-xs leading-normal">
                      프리미엄 퀀트 인공지능 분석이 제공하는 수급 관찰 리포트를 받기 위해 알고리즘을 둘러보세요.
                    </p>
                    <button
                      onClick={() => setActiveTab("home")}
                      className="bg-[#3182F6] hover:bg-[#1B64DA] text-white text-xs font-black rounded-xl px-5 py-3.5 transition-all mt-4"
                    >
                      알고리즘 보러가기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==========================================
          BOTTOM FIXED NAVIGATION RAIL
          ========================================== */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E8EB] py-2 px-1 z-40 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around text-center">
          <button
            onClick={() => {
              setActiveTab("home");
              setActiveSubView("none");
            }}
            className={`flex flex-col items-center gap-1 p-1 ${
              activeTab === "home" && activeSubView === "none" ? "text-[#3182F6]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-[10px] font-black">홈 / AI 마켓</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("info");
              setActiveSubView("none");
            }}
            className={`flex flex-col items-center gap-1 p-1 ${
              activeTab === "info" && activeSubView === "none" ? "text-[#3182F6]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-[10px] font-black">투자정보</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("clip");
              setActiveSubView("none");
            }}
            className={`flex flex-col items-center gap-1 p-1 ${
              activeTab === "clip" && activeSubView === "none" ? "text-[#3182F6]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Play className="h-5 w-5" />
            <span className="text-[10px] font-black">클립</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("my");
              setActiveSubView("none");
            }}
            className={`flex flex-col items-center gap-1 p-1 ${
              activeTab === "my" && activeSubView === "none" ? "text-[#3182F6]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-black">MY</span>
          </button>
        </div>
      </footer>

      {/* ==========================================
          MODALS COMPONENT LAYER
          ========================================== */}
      <AnimatePresence>
        {activeModal.type !== "none" && (
          <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] max-w-sm w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveModal({ type: "none" })}
                className="absolute top-4 right-4 p-1.5 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>

              {/* MODAL 1: 1개월 무료 체험 */}
              {activeModal.type === "trial" && (
                <div className="space-y-4 pt-4 text-center">
                  <div className="h-16 w-16 bg-[#F2F8FF] rounded-full flex items-center justify-center mx-auto text-3xl">
                    🎁
                  </div>
                  <h3 className="text-lg font-black text-gray-950 leading-tight">
                    프로 멤버십 1개월 전임 체험 쿠폰
                  </h3>
                  <p className="text-xs text-gray-400 leading-normal">
                    본 무료 체험 신청 즉시 정기권이 등록되며 첫 한 달은 과금 비용이 전혀 청구되지 않습니다.
                  </p>
                  <button
                    onClick={() => {
                      triggerToast("무료 체험이 즉각 승인 등록되었습니다! 마음껏 만끽해 보세요.");
                      setCurrentUser({ ...currentUser, tier: "무상체험 프로 (체험 중)" });
                      setActiveModal({ type: "none" });
                    }}
                    className="w-full bg-[#3182F6] hover:bg-[#1B64DA] text-white py-3 font-extrabold rounded-2xl text-sm transition-all shadow-sm"
                  >
                    체험 쿠폰 받기
                  </button>
                </div>
              )}

              {/* MODAL 2: 관심 종목 추가 */}
              {activeModal.type === "add-stock" && (
                <div className="space-y-4">
                  <h3 className="text-base font-extrabold text-gray-950">
                    관심 종목을 추가해 보세요
                  </h3>

                  <div className="bg-gray-100 rounded-xl px-3 flex items-center gap-1.5">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="초성이나 한글 명칭 검색"
                      value={stockSearch}
                      onChange={(e) => setStockSearch(e.target.value)}
                      className="w-full bg-transparent text-xs py-3 font-semibold focus:outline-none placeholder-gray-300"
                    />
                  </div>

                  <div className="max-h-[180px] overflow-y-auto space-y-1">
                    {STOCK_DATABASE.filter(st =>
                      st.name.includes(stockSearch) || st.code.includes(stockSearch)
                    ).map(st => (
                      <div
                        key={st.code}
                        onClick={() => handleAddStock(st)}
                        className="p-3 hover:bg-[#F2F8FF] hover:text-[#3182F6] rounded-xl flex items-center justify-between text-xs font-bold cursor-pointer transition-colors"
                      >
                        <span>{st.name} ({st.code})</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODAL 3: 알고리즘 상세 정보 */}
              {activeModal.type === "stock-detail" && activeModal.payload && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#F04452]/10 text-[#F04452] font-black px-2 py-0.5 rounded">
                      수익률 +{activeModal.payload.rate}%
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-450 font-bold px-2 py-0.5 rounded">
                      {activeModal.payload.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-gray-950">
                    {activeModal.payload.name} 알고리즘 소개
                  </h3>
                  <p className="text-xs text-[#4E5968] font-semibold leading-relaxed bg-[#FAF9FF] p-3 rounded-xl border border-indigo-50/50">
                    {activeModal.payload.details}
                  </p>
                  <button
                    onClick={() => {
                      triggerToast("해당 알고리즘 알림을 활성화했어요.");
                      setActiveModal({ type: "none" });
                    }}
                    className="w-full bg-[#3182F6] hover:bg-[#1B64DA] text-white py-3 font-extrabold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <BellRing className="h-4 w-4" />
                    알고리즘 알림 구독하기
                  </button>
                </div>
              )}

              {/* MODAL 4: 프리미엄 리포트 전문 읽기 */}
              {activeModal.type === "news-read" && activeModal.payload && (
                <div className="space-y-4 pt-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#3182F6]/10 text-[#3182F6] font-bold px-2.5 py-1 rounded-full">
                      {activeModal.payload.source}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      {activeModal.payload.ago}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-gray-950 leading-snug">
                    {activeModal.payload.title}
                  </h3>

                  <div className="text-xs text-gray-700 font-medium leading-relaxed max-h-[480px] overflow-y-auto space-y-3 pr-2 border-t border-gray-100 pt-4 scrollbar-thin">
                    <p className="whitespace-pre-line text-sm text-gray-800 font-medium leading-relaxed">
                      {activeModal.payload.content}
                    </p>
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl block mt-6 space-y-2">
                      <p className="font-bold text-[#3182F6] text-xxs">
                        🛡️ 영웅스탁 공인 투자 리스크 공시
                      </p>
                      <p className="text-[10px] text-gray-400 leading-normal">
                        본 리서치 보고서에 인용된 통계 자료와 세부 투자 분석 추정치는 학술적 판단 및 기계 계량 분석을 근거로 도출한 것이며, 특정 주식의 1:1 투자 리딩이나 매수 권유를 상징하지 않습니다. 최종 투자로 인한 자산의 손실 책임은 전적으로 실행 주체 본인에게 법적으로 안착되므로, 모의 포트폴리오 차원에서의 전략적 보정 가치로 활용해 주십시오.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveModal({ type: "none" })}
                      className="w-full bg-[#191F28] hover:bg-black text-white py-3.5 font-black rounded-2xl text-xs transition-all tracking-wide"
                    >
                      보고서 읽기 마쳐서 닫기
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
