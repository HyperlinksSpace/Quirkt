/** UI copy — EN / RU / 中文 (simple language for all ages). */

export const LANGS = ["en", "ru", "zh"];

export const STRINGS = {
  en: {
    pageTitle: "Quirkt — Quantum Playground",
    heroTitle: "Quirkt Quantum Playground",
    heroLead:
      "Three tiny quantum toys you can run in your browser. A computer in the cloud does the real quantum math; you see colorful results here. Pick a game on the left!",
    badgeLive: "Live quantum computer",
    badgeReady: "Ready to play",
    badgeConnecting: "Connecting…",
    badgeConnected: "Connected!",
    badgeOffline: "Cloud asleep — try again soon",
    sidebarDemos: "Pick a game",
    shotsLabel: "How many tries?",
    runAgain: "Run again",
    running: "Running…",
    runOk: "Done!",
    runFail: "Could not run — try again",
    histTitle: "Results chart",
    histHint: "Taller bars = that answer showed up more often.",
    blochTitle: "Tiny quantum arrow",
    blochHint: "Shows where one quantum bit is pointing — like a compass for magic coins.",
    portfolioTitle: "How to split your coins",
    portfolioHint: "Each bar is one type of coin. Higher bar = the computer suggests keeping more there.",
    integrationTitle: "Where this helps in real apps",
    roadmapTitle: "What comes next",
    metricTopBits: "Luckiest code today",
    metricRoute: "Best path found",
    metricSuccess: "Found it this often",
    metricSplit: "Suggested split",
    demos: {
      oracle: {
        title: "Magic random numbers",
        desc: "Quantum bits can be like coins spinning in the air — not heads or tails yet. When we look, we get 0s and 1s. It is very fair randomness, good for secret codes and games where nobody should cheat.",
        integration:
          "Later this can pick secret numbers for safe trades and deals in Hyperlinks Space Program — like drawing a random card nobody could guess ahead of time.",
      },
      portfolio: {
        title: "Split your treasure",
        desc: "You have four kinds of coins (TON, USDT, BTC, ETH). The quantum computer tries many mixes and shows which split appeared most. It is a hint, not a command — like a friend suggesting how to share snacks fairly.",
        integration:
          "This can help the app suggest how much to keep in each coin so one basket is not too heavy.",
      },
      grover: {
        title: "Find the best path",
        desc: "Imagine eight doors and only one hides the best swap route. A normal search checks doors one by one. Grover’s trick checks them in a clever quantum way and finds the winner faster — like a treasure map that glows on the right door.",
        integration:
          "In the trading app this could quickly pick the best way to swap coins before asking the blockchain.",
      },
    },
    roadmap: [
      "Show this page inside the Telegram mini app.",
      "Run quantum jobs on Railway (already working!).",
      "Save random results on TON so everyone can check they were fair.",
      "Let the AI helper explain results in plain words.",
    ],
  },
  ru: {
    pageTitle: "Quirkt — Квантовая площадка",
    heroTitle: "Quirkt — квантовая площадка",
    heroLead:
      "Три маленьких квантовых игрушки прямо в браузере. Настоящие расчёты делает компьютер в облаке, а ты видишь картинки и графики здесь. Выбери игру слева!",
    badgeLive: "Живой квантовый компьютер",
    badgeReady: "Можно играть",
    badgeConnecting: "Подключаемся…",
    badgeConnected: "Готово!",
    badgeOffline: "Облако спит — попробуй позже",
    sidebarDemos: "Выбери игру",
    shotsLabel: "Сколько попыток?",
    runAgain: "Ещё раз",
    running: "Считаем…",
    runOk: "Готово!",
    runFail: "Не получилось — попробуй снова",
    histTitle: "График результатов",
    histHint: "Чем выше столбик — тем чаще выпал этот ответ.",
    blochTitle: "Маленькая квантовая стрелка",
    blochHint: "Показывает, куда «смотрит» один кубит — как компас для волшебной монетки.",
    portfolioTitle: "Как поделить монеты",
    portfolioHint: "Каждый столбик — один вид монет. Выше столбик — компьютер чаще советовал такую долю.",
    integrationTitle: "Где это пригодится в приложении",
    roadmapTitle: "Что будет дальше",
    metricTopBits: "Самый частый код",
    metricRoute: "Лучший путь",
    metricSuccess: "Нашли столько раз",
    metricSplit: "Такой расклад",
    demos: {
      oracle: {
        title: "Волшебные случайные числа",
        desc: "Кубиты — как монетки в воздухе: ещё не орёл и не решка. Когда мы «смотрим», получаем нули и единицы. Это очень честная случайность — для секретных кодов и игр, где нельзя жульничать.",
        integration:
          "Потом это сможет выбирать секретные числа для безопасных сделок в Hyperlinks Space Program — как вытянуть карту, которую никто не угадает заранее.",
      },
      portfolio: {
        title: "Подели сокровище",
        desc: "Есть четыре вида монет (TON, USDT, BTC, ETH). Квантовый компьютер пробует разные смеси и показывает, какая чаще выпадала. Это подсказка, не приказ — как друг советует, как честно разделить конфеты.",
        integration:
          "Так приложение сможет подсказывать, сколько держать в каждой монете, чтобы всё не было в одной куче.",
      },
      grover: {
        title: "Найди лучший путь",
        desc: "Представь восемь дверей, и только за одной — лучший обмен. Обычный поиск открывает по очереди. Трюк Гровера в квантовом мире находит победителя быстрее — как карта сокровищ, где правильная дверь светится.",
        integration:
          "В приложении для обмена монет это поможет быстро выбрать лучший маршрут.",
      },
    },
    roadmap: [
      "Встроить эту страницу в мини-приложение Telegram.",
      "Считать квантовые задачи на Railway (уже работает!).",
      "Сохранять случайные результаты в TON, чтобы все видели, что было честно.",
      "Пусть AI-помощник объясняет результат простыми словами.",
    ],
  },
  zh: {
    pageTitle: "Quirkt — 量子游乐场",
    heroTitle: "Quirkt 量子游乐场",
    heroLead:
      "三个可以在浏览器里玩的小量子游戏。真正的量子计算在云端完成，你会在这里看到彩色的结果。从左边选一个游戏吧！",
    badgeLive: "真实的量子计算机",
    badgeReady: "可以开始玩",
    badgeConnecting: "正在连接…",
    badgeConnected: "已连接！",
    badgeOffline: "云端打盹了 — 稍后再试",
    sidebarDemos: "选一个游戏",
    shotsLabel: "试多少次？",
    runAgain: "再跑一次",
    running: "正在计算…",
    runOk: "完成！",
    runFail: "没跑成 — 再试一次",
    histTitle: "结果图表",
    histHint: "柱子越高 = 这个答案出现得越多。",
    blochTitle: "小小量子箭头",
    blochHint: "显示一个量子位指向哪里 — 像魔法硬币的指南针。",
    portfolioTitle: "怎么分硬币",
    portfolioHint: "每根柱子是一种硬币。越高 = 电脑越建议多放一点在那里。",
    integrationTitle: "以后在应用里有什么用",
    roadmapTitle: "接下来会做什么",
    metricTopBits: "今天最常见的代码",
    metricRoute: "找到的最佳路线",
    metricSuccess: "找到的次数比例",
    metricSplit: "建议的比例",
    demos: {
      oracle: {
        title: "魔法随机数",
        desc: "量子位像在空中旋转的硬币 — 还不是正面或反面。当我们“看”一下，就得到 0 和 1。这是非常公平的随机，适合秘密代码和不能作弊的游戏。",
        integration:
          "以后它可以为 Hyperlinks Space Program 里的安全交易挑选秘密数字 — 像抽一张事先没人能猜到的牌。",
      },
      portfolio: {
        title: "分宝藏",
        desc: "你有四种硬币（TON、USDT、BTC、ETH）。量子计算机会试很多组合，显示哪种最常出现。这是建议，不是命令 — 像朋友教你怎么公平分零食。",
        integration:
          "这样应用可以建议每种硬币放多少，不会全部堆在一个篮子里。",
      },
      grover: {
        title: "找最好的路",
        desc: "想象有八扇门，只有一扇后面是最好的兑换路线。普通方法一扇一扇找。Grover 的量子办法更聪明、更快 — 像藏宝图上正确的那扇门会发光。",
        integration:
          "在交易应用里，这可以很快选出最好的换币路线。",
      },
    },
    roadmap: [
      "把这个页面放进 Telegram 小程序。",
      "在 Railway 上跑量子任务（已经在用了！）。",
      "把随机结果存到 TON 上，让大家都能检查是否公平。",
      "让 AI 助手用简单的话解释结果。",
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
