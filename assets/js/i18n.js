/** UI copy — EN / RU / 中文 (clear, non-technical-friendly). */

export const LANGS = ["en", "ru", "zh"];

export const STRINGS = {
  en: {
    pageTitle: "Quirkt — Quantum Playground",
    heroTitle: "Quirkt Quantum Playground",
    heroLead:
      "Three Qiskit demos run on a live backend (Railway). Choose a circuit on the left, then run it to see measurement histograms and allocation hints for Hyperlinks Space Program.",
    badgeLive: "Live Qiskit (Railway)",
    badgeReady: "Ready",
    badgeConnecting: "Connecting…",
    badgeConnected: "Connected",
    badgeOffline: "API unavailable — try again shortly",
    sidebarDemos: "Circuits",
    shotsLabel: "Shots",
    runAgain: "Run again",
    running: "Running…",
    runOk: "Complete",
    runFail: "Run failed — try again",
    histTitle: "Measurement histogram",
    histHint: "Each bar is an outcome; height shows how often it was measured.",
    blochTitle: "Bloch sphere (qubit 0)",
    blochHint: "Approximate state of the first qubit after the circuit (visual aid only).",
    portfolioTitle: "Portfolio weights",
    portfolioHint: "Share of shots mapped to each asset label (TON, USDT, BTC, ETH).",
    integrationTitle: "Hyperlinks Space Program integration",
    roadmapTitle: "Roadmap",
    metricTopBits: "Most frequent bitstring",
    metricRoute: "Marked route",
    metricSuccess: "Success rate",
    metricSplit: "Weight distribution",
    demos: {
      oracle: {
        title: "Quantum random oracle",
        desc: "Applies Hadamard gates and measures several qubits. Outcomes are near-uniform 0/1 strings — suitable as entropy for deal nonces, commit salts, and provably fair randomness.",
        integration:
          "Plugs into blockchain commit-reveal flows and wallet nonce generation in Hyperlinks Space Program.",
      },
      portfolio: {
        title: "Portfolio QAOA sampler",
        desc: "A small QAOA-style circuit encodes a risk penalty and samples 2-bit outcomes. Results map to four assets (TON, USDT, BTC, ETH) as allocation weights — a hint for diversification, not financial advice.",
        integration:
          "Can feed weight vectors into the AI recommendation layer and Swap.Coffee rebalance hints.",
      },
      grover: {
        title: "Swap route Grover search",
        desc: "Grover search over eight candidate swap routes with one marked winner. Demonstrates quadratic speedup for picking a route before heavier on-chain or API quote calls.",
        integration:
          "Prototype for pre-filtering liquidity pools in the trading stack before TON settlement.",
      },
    },
    roadmap: [
      "Embed this playground in the Telegram Mini App (WebView).",
      "Serve live shots from Railway (operational).",
      "Publish oracle transcripts on TON for auditability.",
      "Surface AI explanations of circuit results in the app chat.",
    ],
  },
  ru: {
    pageTitle: "Quirkt — Квантовая площадка",
    heroTitle: "Quirkt — квантовая площадка",
    heroLead:
      "Три демо на Qiskit с живым бэкендом (Railway). Выберите схему слева и запустите её — вы увидите гистограммы измерений и подсказки по распределению активов для Hyperlinks Space Program.",
    badgeLive: "Qiskit на Railway",
    badgeReady: "Готово",
    badgeConnecting: "Подключение…",
    badgeConnected: "Подключено",
    badgeOffline: "API недоступен — повторите позже",
    sidebarDemos: "Схемы",
    shotsLabel: "Измерений",
    runAgain: "Запустить снова",
    running: "Выполняется…",
    runOk: "Готово",
    runFail: "Ошибка запуска — повторите",
    histTitle: "Гистограмма измерений",
    histHint: "Каждый столбец — исход измерения; высота показывает, как часто он встретился.",
    blochTitle: "Сфера Bloch (кубит 0)",
    blochHint: "Приблизительное состояние первого кубита после схемы (только визуализация).",
    portfolioTitle: "Веса портфеля",
    portfolioHint: "Доля измерений, сопоставленная с каждым активом (TON, USDT, BTC, ETH).",
    integrationTitle: "Интеграция с Hyperlinks Space Program",
    roadmapTitle: "Дорожная карта",
    metricTopBits: "Самая частая битовая строка",
    metricRoute: "Отмеченный маршрут",
    metricSuccess: "Доля успеха",
    metricSplit: "Распределение весов",
    demos: {
      oracle: {
        title: "Квантовый случайный оракул",
        desc: "Схема с воротами Адамара и измерением нескольких кубитов. Результаты — почти равномерные строки из 0 и 1; подходят как энтропия для nonce сделок, commit-salt и провably fair случайности.",
        integration:
          "Подключается к commit-reveal на блокчейне и генерации nonce кошелька в Hyperlinks Space Program.",
      },
      portfolio: {
        title: "QAOA-сampler портфеля",
        desc: "Небольшая QAOA-подобная схема с штрафом за риск и 2-битными исходами. Результаты отображаются как веса четырёх активов (TON, USDT, BTC, ETH) — подсказка по диверсификации, не инвестиционный совет.",
        integration:
          "Может передавать векторы весов в AI-рекомендации и подсказки ребаланса Swap.Coffee.",
      },
      grover: {
        title: "Поиск маршрута обмена (Grover)",
        desc: "Поиск Grover среди восьми кандидатов на обмен с одним отмеченным победителем. Показывает квадратичное ускорение выбора маршрута до тяжёлых on-chain или API-запросов котировок.",
        integration:
          "Прототип предварительного отбора пулов ликвидности в торговом контуре перед расчётом на TON.",
      },
    },
    roadmap: [
      "Встроить площадку в Telegram Mini App (WebView).",
      "Отдавать живые прогоны с Railway (уже работает).",
      "Публиковать транскрипты оракула в TON для проверки.",
      "Показывать объяснения результатов схем в чате приложения через AI.",
    ],
  },
  zh: {
    pageTitle: "Quirkt — 量子演示平台",
    heroTitle: "Quirkt 量子演示平台",
    heroLead:
      "三个基于 Qiskit 的实时演示（Railway 后端）。在左侧选择线路并运行，查看测量直方图及面向 Hyperlinks Space Program 的配置提示。",
    badgeLive: "实时 Qiskit（Railway）",
    badgeReady: "就绪",
    badgeConnecting: "连接中…",
    badgeConnected: "已连接",
    badgeOffline: "API 不可用 — 请稍后重试",
    sidebarDemos: "线路",
    shotsLabel: "采样次数",
    runAgain: "再次运行",
    running: "运行中…",
    runOk: "完成",
    runFail: "运行失败 — 请重试",
    histTitle: "测量直方图",
    histHint: "每个柱形代表一种测量结果；高度表示出现频率。",
    blochTitle: "Bloch 球（量子位 0）",
    blochHint: "线路运行后第一个量子位的近似状态（仅作可视化参考）。",
    portfolioTitle: "投资组合权重",
    portfolioHint: "映射到各资产标签（TON、USDT、BTC、ETH）的测量占比。",
    integrationTitle: "Hyperlinks Space Program 集成",
    roadmapTitle: "路线图",
    metricTopBits: "最常见比特串",
    metricRoute: "标记路线",
    metricSuccess: "成功率",
    metricSplit: "权重分布",
    demos: {
      oracle: {
        title: "量子随机预言机",
        desc: "对多个量子位施加 Hadamard 门并测量，输出接近均匀的 0/1 字符串，可用于交易 nonce、commit 盐值和可验证公平随机数。",
        integration:
          "接入 Hyperlinks Space Program 的区块链 commit-reveal 流程与钱包 nonce 生成。",
      },
      portfolio: {
        title: "投资组合 QAOA 采样",
        desc: "小型 QAOA 风格线路编码风险惩罚并采样 2 比特结果，映射为四种资产（TON、USDT、BTC、ETH）的权重 — 分散配置提示，非投资建议。",
        integration:
          "可将权重向量输入 AI 推荐层及 Swap.Coffee 再平衡提示。",
      },
      grover: {
        title: "交换路线 Grover 搜索",
        desc: "在八个候选交换路线中 Grover 搜索一个标记目标，展示在链上或 API 报价前选取路线的二次加速原型。",
        integration:
          "用于 TON 结算前在交易栈中预筛选流动性池的原型。",
      },
    },
    roadmap: [
      "在 Telegram 小程序中嵌入本演示（WebView）。",
      "由 Railway 提供实时采样（已上线）。",
      "在 TON 上发布预言机记录以供审计。",
      "在应用聊天中通过 AI 解释线路结果。",
    ],
  },
};

export function t(lang, key) {
  const parts = key.split(".");
  let node = STRINGS[lang] || STRINGS.en;
  for (const p of parts) {
    node = node?.[p];
  }
  return node ?? STRINGS.en[key] ?? key;
}
