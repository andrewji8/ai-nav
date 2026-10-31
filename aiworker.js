// ============================================================
// AI Nav — 基于 Cloudflare Workers 的 AI 工具导航站（多语言版）
// ============================================================
const CATEGORIES = [
  { id: "chat",    name: "聊天对话", name_en: "Chat", icon: "🤖" },
  { id: "image",   name: "图像生成", name_en: "Image Gen", icon: "🎨" },
  { id: "video",   name: "视频创作", name_en: "Video Gen", icon: "🎬" },
  { id: "code",    name: "编程开发", name_en: "Coding", icon: "💻" },
  { id: "audio",   name: "音频音乐", name_en: "Audio", icon: "🎵" },
  { id: "writing", name: "写作办公", name_en: "Writing", icon: "✍️" },
  { id: "open",    name: "开源社区", name_en: "Open Source", icon: "🔧" },
  { id: "news",    name: "国外新闻", name_en: "Foreign News", icon: "📰" },
];
const TOOLS = [
  { name: "ChatGPT", name_en: "ChatGPT", url: "https://chatgpt.com", cat: "chat", desc: "OpenAI 旗舰对话 AI，支持多模态理解与生成", desc_en: "OpenAI's flagship multimodal conversational AI.", tags: ["GPT", "OpenAI"], tags_en: ["GPT", "OpenAI"] },
  { name: "Claude", name_en: "Claude", url: "https://claude.ai", cat: "chat", desc: "Anthropic 大模型，长文本、推理与编码俱佳", desc_en: "Anthropic's large model, great for long text and coding.", tags: ["Anthropic", "长文本"], tags_en: ["Anthropic", "Long Context"] },
  { name: "Gemini", name_en: "Gemini", url: "https://gemini.google.com", cat: "chat", desc: "Google 多模态 AI 助手，深度整合谷歌生态", desc_en: "Google's multimodal AI integrated with its ecosystem.", tags: ["Google", "多模态"], tags_en: ["Google", "Multimodal"] },
  { name: "DeepSeek", name_en: "DeepSeek", url: "https://chat.deepseek.com", cat: "chat", desc: "深度求索大模型，推理能力强，免费开放", desc_en: "Strong reasoning open-source large model.", tags: ["开源", "推理"], tags_en: ["Open Source", "Reasoning"] },
  { name: "Kimi", name_en: "Kimi", url: "https://kimi.moonshot.cn", cat: "chat", desc: "月之暗面助手，擅长超长上下文与文档解析", desc_en: "Moonshot's assistant for ultra-long context parsing.", tags: ["长文本", "文档"], tags_en: ["Long Context", "Docs"] },
  { name: "豆包", name_en: "Doubao", url: "https://www.doubao.com", cat: "chat", desc: "字节跳动智能助手，聊天写作绘图一站集成", desc_en: "ByteDance's all-in-one smart assistant.", tags: ["字节跳动"], tags_en: ["ByteDance"] },
  { name: "通义", name_en: "Tongyi", url: "https://tongyi.aliyun.com", cat: "chat", desc: "阿里通义千问大模型，支持多格式文档理解", desc_en: "Alibaba's Qwen model for document understanding.", tags: ["阿里", "千问"], tags_en: ["Alibaba", "Qwen"] },
  { name: "文心一言", name_en: "ERNIE Bot", url: "https://yiyan.baidu.com", cat: "chat", desc: "百度基于文心大模型的生成式 AI 助手", desc_en: "Baidu's ERNIE-based generative AI.", tags: ["百度", "文心"], tags_en: ["Baidu", "ERNIE"] },
  { name: "智谱清言", name_en: "ChatGLM", url: "https://chatglm.cn", cat: "chat", desc: "智谱 AI GLM 大模型，智能对话与创作", desc_en: "Zhipu AI's GLM for smart dialogue.", tags: ["智谱", "GLM"], tags_en: ["Zhipu", "GLM"] },
  { name: "Midjourney", name_en: "Midjourney", url: "https://www.midjourney.com", cat: "image", desc: "顶尖 AI 绘画工具，出图效果惊艳", desc_en: "Top-tier AI painting with stunning visuals.", tags: ["绘画", "设计"], tags_en: ["Art", "Design"] },
  { name: "Elser AI", name_en: "Elser AI", url: "https://www.elser.ai/zh", cat: "image", desc: "专注二次元与动漫风格的 AI 图像生成平台", desc_en: "AI image generation focused on anime styles.", tags: ["动漫", "二次元"], tags_en: ["Anime", "2D"] },
  { name: "Stable Diffusion", name_en: "Stable Diffusion", url: "https://stability.ai", cat: "image", desc: "开源图像生成模型生态，社区资源丰富", desc_en: "Open-source image generation ecosystem.", tags: ["开源", "SD"], tags_en: ["Open Source", "SD"] },
  { name: "Leonardo.ai", name_en: "Leonardo.ai", url: "https://leonardo.ai", cat: "image", desc: "AI 创意素材生成平台，适合游戏与设计", desc_en: "AI creative assets for gaming and design.", tags: ["设计", "素材"], tags_en: ["Design", "Assets"] },
  { name: "即梦 AI", name_en: "Jimeng AI", url: "https://jimeng.jianying.com", cat: "image", desc: "字节跳动 AI 绘画，中文理解能力强", desc_en: "ByteDance's AI painting with strong Chinese skills.", tags: ["字节跳动", "绘画"], tags_en: ["ByteDance", "Art"] },
  { name: "Ideogram", name_en: "Ideogram", url: "https://ideogram.ai", cat: "image", desc: "文字渲染能力出色的 AI 绘图工具", desc_en: "AI drawing with outstanding text rendering.", tags: ["海报", "文字渲染"], tags_en: ["Poster", "Text"] },
  { name: "FLUX", name_en: "FLUX", url: "https://blackforestlabs.ai", cat: "image", desc: "黑森林实验室开源高质量生图模型", desc_en: "Black Forest Labs' high-quality open-source model.", tags: ["开源"], tags_en: ["Open Source"] },
  { name: "Sora", name_en: "Sora", url: "https://sora.com", cat: "video", desc: "OpenAI 视频生成模型，一句话生成大片", desc_en: "OpenAI's text-to-video blockbuster generator.", tags: ["OpenAI", "文生视频"], tags_en: ["OpenAI", "Text-to-Video"] },
  { name: "Runway", name_en: "Runway", url: "https://runwayml.com", cat: "video", desc: "AI 视频创作与编辑套件，影视团队常用", desc_en: "AI video creation suite for film teams.", tags: ["剪辑", "Gen-3"], tags_en: ["Editing", "Gen-3"] },
  { name: "Pika", name_en: "Pika", url: "https://pika.art", cat: "video", desc: "AI 短视频生成，特效模板丰富好玩", desc_en: "AI short video generation with fun effects.", tags: ["短视频", "特效"], tags_en: ["Shorts", "VFX"] },
  { name: "可灵 AI", name_en: "Kling AI", url: "https://klingai.com", cat: "video", desc: "快手可灵视频大模型，运动质量出色", desc_en: "Kuaishou's video model with excellent motion.", tags: ["快手", "文生视频"], tags_en: ["Kuaishou", "Text-to-Video"] },
  { name: "Vidu", name_en: "Vidu", url: "https://www.vidu.cn", cat: "video", desc: "生数科技视频生成大模型，支持多主体参考", desc_en: "Shengshu's video model with multi-subject ref.", tags: ["生数科技"], tags_en: ["Shengshu"] },
  { name: "GitHub Copilot", name_en: "GitHub Copilot", url: "https://github.com/features/copilot", cat: "code", desc: "GitHub 官方 AI 编程助手，实时代码补全", desc_en: "GitHub's official AI coding assistant.", tags: ["GitHub", "补全"], tags_en: ["GitHub", "Completion"] },
  { name: "Cursor", name_en: "Cursor", url: "https://www.cursor.com", cat: "code", desc: "AI 原生代码编辑器，最懂你的编程搭档", desc_en: "AI-native code editor.", tags: ["编辑器", "IDE"], tags_en: ["Editor", "IDE"] },
  { name: "agent-qa", name_en: "agent-qa", url: "https://vostride.com", cat: "code", desc: "自然语言网页与移动端测试，结合 memidex 持久记忆与经验证的自我改进。", desc_en: "Natural-language web and mobile testing with memidex persistent memory and validated self-improvement.", tags: ["应用测试", "MCP", "持久记忆"], tags_en: ["App Testing", "MCP", "Persistent Memory"] },
  { name: "Codeium", name_en: "Codeium", url: "https://codeium.com", cat: "code", desc: "免费的 AI 代码补全与对话，支持多种 IDE", desc_en: "Free AI code completion for IDEs.", tags: ["免费", "插件"], tags_en: ["Free", "Plugin"] },
  { name: "v0", name_en: "v0", url: "https://v0.dev", cat: "code", desc: "Vercel 的 AI 前端生成器，用嘴写组件", desc_en: "Vercel's AI frontend component generator.", tags: ["Vercel", "前端"], tags_en: ["Vercel", "Frontend"] },
  { name: "Replit", name_en: "Replit", url: "https://replit.com", cat: "code", desc: "在线 AI 编程平台，快速构建全栈应用", desc_en: "Online AI platform for full-stack apps.", tags: ["云 IDE", "Agent"], tags_en: ["Cloud IDE", "Agent"] },
  { name: "Suno", name_en: "Suno", url: "https://suno.com", cat: "audio", desc: "AI 音乐创作，一句话生成完整歌曲", desc_en: "Generate full songs with AI.", tags: ["歌曲", "音乐"], tags_en: ["Song", "Music"] },
  { name: "ElevenLabs", name_en: "ElevenLabs", url: "https://elevenlabs.io", cat: "audio", desc: "超逼真的 AI 语音合成与声音克隆", desc_en: "Ultra-realistic AI voice synthesis.", tags: ["配音", "语音"], tags_en: ["Voice", "TTS"] },
  { name: "Udio", name_en: "Udio", url: "https://www.udio.com", cat: "audio", desc: "高质量 AI 音乐生成，支持多种风格", desc_en: "High-quality AI music generation.", tags: ["音乐生成"], tags_en: ["Music Gen"] },
  { name: "Notion AI", name_en: "Notion AI", url: "https://www.notion.so", cat: "writing", desc: "AI 增强的笔记与知识库，写作整理一站式", desc_en: "AI-enhanced notes and knowledge base.", tags: ["笔记", "知识库"], tags_en: ["Notes", "Wiki"] },
  { name: "Gamma", name_en: "Gamma", url: "https://gamma.app", cat: "writing", desc: "AI 生成精美演示文稿，告别繁琐排版", desc_en: "AI-generated beautiful presentations.", tags: ["PPT", "演示"], tags_en: ["PPT", "Slides"] },
  { name: "沉浸式翻译", name_en: "Immersive Translate", url: "https://immersivetranslate.com", cat: "writing", desc: "广受欢迎的 AI 双语对照翻译插件", desc_en: "Popular AI bilingual translation extension.", tags: ["翻译", "插件"], tags_en: ["Translate", "Extension"] },
  { name: "Jasper", name_en: "Jasper", url: "https://www.jasper.ai", cat: "writing", desc: "AI 营销文案助手，提升团队内容产能", desc_en: "AI marketing copywriting assistant.", tags: ["文案", "营销"], tags_en: ["Copy", "Marketing"] },
  { name: "Hugging Face", name_en: "Hugging Face", url: "https://huggingface.co", cat: "open", desc: "全球最大的 AI 模型与数据集社区", desc_en: "World's largest AI model community.", tags: ["模型", "数据集"], tags_en: ["Models", "Datasets"] },
  { name: "Ollama", name_en: "Ollama", url: "https://ollama.com", cat: "open", desc: "一条命令在本地运行开源大模型", desc_en: "Run open-source LLMs locally.", tags: ["本地部署", "开源"], tags_en: ["Local", "Open Source"] },
  { name: "LangChain", name_en: "LangChain", url: "https://www.langchain.com", cat: "open", desc: "LLM 应用开发框架，快速构建 AI Agent", desc_en: "Framework for building AI Agents.", tags: ["框架", "Agent"], tags_en: ["Framework", "Agent"] },
  // ---------- 新增国外新闻工具 ----------
  { name: "美国之音", name_en: "VOA", url: "https://www.voachinese.com", cat: "news", desc: "美国之音中文网，提供实时新闻、分析与评论", desc_en: "VOA Chinese service with real-time news and analysis.", tags: ["美国之音", "新闻"], tags_en: ["VOA", "News"] },
  { name: "德国之音", name_en: "Deutsche Welle", url: "https://www.dw.com/zh", cat: "news", desc: "德国之音中文网，客观报道国际时事与深度分析", desc_en: "DW Chinese website with objective international news.", tags: ["德国之音", "新闻"], tags_en: ["DW", "News"] },
  { name: "BBC中文网", name_en: "BBC Chinese", url: "https://www.bbc.com/zhongwen", cat: "news", desc: "BBC 中文网，全球新闻权威来源，报道国际热点", desc_en: "BBC Chinese service delivering global news authority.", tags: ["BBC", "新闻"], tags_en: ["BBC", "News"] },
  { name: "纽约时报", name_en: "NY Times", url: "https://www.nytimes.com", cat: "news", desc: "纽约时报中文网，提供深度报道、国际新闻与评论", desc_en: "NY Times Chinese site with in-depth reports.", tags: ["纽约时报", "新闻"], tags_en: ["NYTimes", "News"] },
  { name: "华尔街日报", name_en: "Wall Street Journal", url: "https://www.wsj.com", cat: "news", desc: "华尔街日报中文网，专注经济、金融与商业新闻", desc_en: "WSJ Chinese edition focused on business and finance.", tags: ["华尔街日报", "新闻"], tags_en: ["WSJ", "News"] },
  { name: "路透社中文网", name_en: "Reuters Chinese", url: "https://www.reuters.com/china", cat: "news", desc: "路透社中文网，提供全球财经与政治新闻报道", desc_en: "Reuters Chinese website covering global finance & politics.", tags: ["路透社", "新闻"], tags_en: ["Reuters", "News"] },
];
const I18N = {
  zh: {
    title: "AI Nav · AI 工具导航",
    heroTitle1: "发现最好用的", heroTitle2: "AI 工具",
    searchPlaceholder: "搜索工具名称、功能、标签…",
    all: "全部",
    statsToday: "今日访问", statsTotal: "累计访问", statsClicks: "工具点击",
    totalCount: "共收录 {total} 个 AI 工具", filteredCount: "，当前显示 {count} 个",
    empty: "😶 没有找到相关工具，换个关键词试试",
    error: "⚠️ 页面脚本出错：",
    footer: "Powered by ⚡ Cloudflare Workers"
  },
  en: {
    title: "AI Nav · AI Tools Directory",
    heroTitle1: "Discover the best", heroTitle2: "AI Tools",
    searchPlaceholder: "Search name, function, tags...",
    all: "All",
    statsToday: "Today", statsTotal: "Total Views", statsClicks: "Clicks",
    totalCount: "{total} AI tools collected", filteredCount: ", showing {count}",
    empty: "😶 No tools found. Try different keywords.",
    error: "⚠️ Script error: ",
    footer: "Powered by ⚡ Cloudflare Workers"
  }
};
// ---------- Worker 入口 ----------
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/track" && request.method === "POST") {
      let name = "";
      try { name = String(((await request.json()) || {}).name || "").slice(0, 50); } catch (e) {}
      if (env.DB) ctx.waitUntil(insertEvent(env, request, "click", name));
      return new Response(null, { status: 204 });
    }
    if (url.pathname === "/stats") {
      if (env.STATS_TOKEN && url.searchParams.get("token") !== env.STATS_TOKEN) return new Response("Not Found", { status: 404 });
      if (env.DB) return handleStats(env);
      return new Response("D1 DB not configured", { status: 500 });
    }
    if (url.pathname === "/api/tools") {
      return Response.json({ categories: CATEGORIES, tools: TOOLS }, { headers: { "Cache-Control": "public, max-age=300" } });
    }
    if (env.DB) ctx.waitUntil(insertEvent(env, request, "view", ""));
    const stats = env.DB ? await getStats(env) : null;
    return new Response(renderHTML(stats), {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=600" },
    });
  },
};
// ---------- 统计核心逻辑 ----------
function dayStr(ts) { return new Date(ts).toISOString().slice(0, 10); }
function hashIP(ip, day) {
  const s = (ip || "unknown") + ":" + day + ":" + "ai-nav-salt";
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
}
function insertEvent(env, request, type, name) {
  const now = Date.now();
  const day = dayStr(now);
  return env.DB.prepare("INSERT INTO events (type, name, day, ts, ref, country, iphash) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)")
    .bind(type, name, day, now, (request.headers.get("referer") || "").slice(0, 200), (request.cf && request.cf.country) || "", hashIP(request.headers.get("cf-connecting-ip"), day)).run();
}
let statsCache = { ts: 0, value: null };
async function getStats(env) {
  const now = Date.now();
  if (statsCache.value && now - statsCache.ts < 60000) return statsCache.value;
  try {
    const [today, total, clicksAll, totalClicks] = await Promise.all([
      env.DB.prepare("SELECT COUNT(*) c FROM events WHERE type='view' AND ts >= ?1").bind(now - 86400000).all(),
      env.DB.prepare("SELECT COUNT(*) c FROM events WHERE type='view'").all(),
      env.DB.prepare("SELECT name, COUNT(*) c FROM events WHERE type='click' AND name != '' GROUP BY name").all(),
      env.DB.prepare("SELECT COUNT(*) c FROM events WHERE type='click'").all(),
    ]);
    const clicks = {};
    clicksAll.rows.forEach((r) => { clicks[r.name] = r.c; });
    statsCache = { ts: now, value: { todayPV: today.rows[0].c, totalPV: total.rows[0].c, totalClicks: totalClicks.rows[0].c, clicks } };
  } catch (e) { return statsCache.value; }
  return statsCache.value;
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
async function handleStats(env) {
  const now = Date.now();
  const [daily, top, today] = await Promise.all([
    env.DB.prepare("SELECT day, COUNT(*) pv, COUNT(DISTINCT iphash) uv FROM events WHERE type='view' AND ts >= ?1 GROUP BY day ORDER BY day DESC LIMIT 7").bind(now - 7 * 86400000).all(),
    env.DB.prepare("SELECT name, COUNT(*) c FROM events WHERE type='click' AND name != '' GROUP BY name ORDER BY c DESC LIMIT 10").all(),
    env.DB.prepare("SELECT COUNT(*) c FROM events WHERE type='view' AND ts >= ?1").bind(now - 86400000).all(),
  ]);
  return new Response(renderStatsPage(daily.rows, top.rows, today.rows[0].c), { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
function renderStatsPage(dailyRows, topRows, todayPV) {
  const maxPV = Math.max(1, ...dailyRows.map((r) => r.pv));
  const maxC = Math.max(1, ...topRows.map((r) => r.c));
  const dailyHTML = dailyRows.length ? dailyRows.map(r => `<div class="row"><span class="label">${esc(r.day)}</span><div class="bar"><i style="width:${Math.round((r.pv/maxPV)*100)}%"></i></div><span class="num">${r.pv} PV / ${r.uv} UV</span></div>`).join("") : '<div class="muted">暂无</div>';
  const topHTML = topRows.length ? topRows.map(r => `<div class="row"><span class="label">${esc(r.name)}</span><div class="bar"><i style="width:${Math.round((r.c/maxC)*100)}%"></i></div><span class="num">${r.c} 次</span></div>`).join("") : '<div class="muted">暂无</div>';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>统计</title><style>body{margin:0;font-family:system-ui;color:#eef0f8;background:linear-gradient(160deg,#0b1020,#170f2e 50%,#06202a);min-height:100vh}.wrap{max-width:760px;margin:0 auto;padding:40px 20px}.card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:18px;backdrop-filter:blur(18px);padding:20px;margin-top:20px}.big{font-size:32px;font-weight:800;background:linear-gradient(90deg,#6366f1,#a855f7);-webkit-background-clip:text;color:transparent}.row{display:flex;align-items:center;gap:10px;margin:8px 0;font-size:13px}.label{width:90px;overflow:hidden;text-overflow:ellipsis}.bar{flex:1;height:8px;border-radius:999px;background:rgba(255,255,255,.08)}.bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#6366f1,#a855f7)}.num{width:110px;text-align:right;color:#9aa1b5}</style></head><body><div class="wrap"><h1>📊 访问统计</h1><div class="card"><h2>最近 24 小时</h2><div class="big">${todayPV}</div></div><div class="card"><h2>最近 7 天</h2>${dailyHTML}</div><div class="card"><h2>点击榜 Top 10</h2>${topHTML}</div></div></body></html>`;
}
// ---------- 页面渲染 ----------
function renderHTML(stats) {
  const data = JSON.stringify({ categories: CATEGORIES, tools: TOOLS, stats: stats || null }).replace(/</g, "\\u003c");
  const i18nData = JSON.stringify(I18N).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Nav · AI 工具导航</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧭</text></svg>">
<style>
  :root {
    --text: #1c2030; --muted: #5d6474; --glass: rgba(255, 255, 255, .5);
    --glass-strong: rgba(255, 255, 255, .72); --border: rgba(255, 255, 255, .65);
    --shine: inset 0 1px 0 rgba(255, 255, 255, .6); --shadow: 0 8px 32px rgba(31, 38, 135, .10);
    --blur: blur(18px) saturate(160%); --accent1: #6366f1; --accent2: #a855f7;
    --page-bg: linear-gradient(160deg, #eef2ff 0%, #fdf2f8 50%, #ecfeff 100%);
  }
  [data-theme="dark"] {
    --text: #eef0f8; --muted: #9aa1b5; --glass: rgba(255, 255, 255, .06);
    --glass-strong: rgba(255, 255, 255, .12); --border: rgba(255, 255, 255, .14);
    --shine: inset 0 1px 0 rgba(255, 255, 255, .08); --shadow: 0 8px 32px rgba(0, 0, 0, .35);
    --page-bg: linear-gradient(160deg, #0b1020 0%, #170f2e 50%, #06202a 100%);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, "PingFang SC", sans-serif; color: var(--text); background: var(--page-bg); background-attachment: fixed; min-height: 100vh; }
  body::before, body::after { content: ""; position: fixed; z-index: -1; border-radius: 50%; filter: blur(90px); opacity: .5; pointer-events: none; }
  body::before { width: 480px; height: 480px; top: -120px; left: -100px; background: radial-gradient(circle at 30% 30%, #818cf8, #ec4899 75%); animation: drift1 16s ease-in-out infinite alternate; }
  body::after { width: 540px; height: 540px; bottom: -180px; right: -140px; background: radial-gradient(circle at 60% 60%, #22d3ee, #a855f7 75%); animation: drift2 20s ease-in-out infinite alternate; }
  [data-theme="dark"] body::before, [data-theme="dark"] body::after { opacity: .3; }
  @keyframes drift1 { to { transform: translate(70px, 50px) scale(1.08); } }
  @keyframes drift2 { to { transform: translate(-60px, -40px) scale(1.05); } }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
  header { position: sticky; top: 0; z-index: 20; background: var(--glass); backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur); border-bottom: 1px solid var(--border); box-shadow: var(--shine); }
  .header-inner { display: flex; align-items: center; justify-content: space-between; height: 56px; }
  .logo { font-weight: 800; font-size: 18px; }
  .header-actions { display: flex; align-items: center; gap: 8px; }
  .lang-btn, .theme-btn { border: 1px solid var(--border); background: var(--glass); color: var(--text); backdrop-filter: var(--blur); border-radius: 12px; padding: 6px 12px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; }
  .lang-btn:hover, .theme-btn:hover { border-color: color-mix(in srgb, var(--accent1) 55%, transparent); }
  .theme-btn { font-size: 16px; padding: 6px 10px; font-weight: normal; }
  .hero { text-align: center; padding: 48px 20px 8px; }
  .hero h1 { font-size: clamp(26px, 5vw, 40px); margin-bottom: 10px; }
  .grad { background: linear-gradient(90deg, var(--accent1), var(--accent2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .sub { color: var(--muted); margin-bottom: 24px; font-size: 14px; min-height: 20px; }
  .search-box { max-width: 560px; margin: 0 auto; display: flex; align-items: center; gap: 10px; background: var(--glass); border: 1px solid var(--border); border-radius: 16px; padding: 0 16px; box-shadow: var(--shadow), var(--shine); backdrop-filter: var(--blur); }
  .search-box:focus-within { border-color: color-mix(in srgb, var(--accent1) 55%, transparent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent1) 22%, transparent), var(--shine); }
  .search-box input { flex: 1; border: 0; outline: 0; background: transparent; color: var(--text); font-size: 15px; padding: 14px 0; }
  .stats { display: flex; justify-content: center; gap: 16px; margin-top: 28px; flex-wrap: wrap; }
  .stat { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 14px 28px; min-width: 130px; border-radius: 20px; background: var(--glass); border: 1px solid var(--border); backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur); box-shadow: var(--shadow), var(--shine); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
  .stat::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 50%; background: linear-gradient(180deg, rgba(255,255,255,0.15), transparent); pointer-events: none; }
  .stat:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 28px rgba(99, 102, 241, 0.15), var(--shine); }
  .stat-icon { font-size: 18px; margin-bottom: 2px; }
  .stat b { font-size: 26px; color: var(--text); font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1.1; background: linear-gradient(135deg, var(--accent1), var(--accent2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .stat span { font-size: 12px; color: var(--muted); font-weight: 500; letter-spacing: 0.5px; }
  .cats { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 28px 0 20px; }
  .pill { border: 1px solid var(--border); background: var(--glass); color: var(--text); backdrop-filter: var(--blur); padding: 8px 14px; border-radius: 999px; cursor: pointer; font-size: 14px; transition: all .15s; box-shadow: var(--shine); }
  .pill:hover { border-color: color-mix(in srgb, var(--accent1) 55%, transparent); }
  .pill.active { background: linear-gradient(90deg, var(--accent1), var(--accent2)); color: #fff; border-color: transparent; box-shadow: 0 4px 18px color-mix(in srgb, var(--accent1) 45%, transparent); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; padding-bottom: 40px; }
  .card { position: relative; display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--glass); border: 1px solid var(--border); border-radius: 18px; backdrop-filter: var(--blur); text-decoration: none; color: inherit; box-shadow: var(--shadow), var(--shine); transition: transform .15s ease, background .15s ease; }
  .card:hover { transform: translateY(-4px); background: var(--glass-strong); border-color: color-mix(in srgb, var(--accent1) 45%, transparent); }
  .card:hover .arrow { opacity: 1; }
  .icon-box { position: relative; width: 40px; height: 40px; flex-shrink: 0; }
  .letter { position: absolute; inset: 0; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--accent1), var(--accent2)); color: #fff; font-weight: 700; }
  .icon { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 10px; background: #fff; padding: 6px; object-fit: contain; }
  .info { min-width: 0; flex: 1; }
  .name { font-weight: 600; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .desc { color: var(--muted); font-size: 13px; margin-top: 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .clicks { position: absolute; right: 10px; bottom: 10px; font-size: 11px; color: #fff; font-weight: 600; background: linear-gradient(135deg, #f97316, #ef4444); padding: 2px 8px; border-radius: 999px; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3); display: flex; align-items: center; gap: 3px; }
  .arrow { position: absolute; right: 14px; top: 12px; opacity: 0; color: var(--accent1); font-size: 14px; transition: opacity .15s; }
  .empty { grid-column: 1 / -1; text-align: center; color: var(--muted); padding: 60px 0; }
  footer { text-align: center; color: var(--muted); font-size: 13px; padding: 24px 0 32px; border-top: 1px solid var(--border); }
</style>
<script>
  document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light");
</script>
</head>
<body>
<header>
  <div class="wrap header-inner">
    <div class="logo">🧭 AI Nav</div>
    <div class="header-actions">
      <button id="lang-btn" class="lang-btn">En</button>
      <button id="theme" class="theme-btn" aria-label="切换主题">🌙</button>
    </div>
  </div>
</header>
<section class="hero">
  <h1><span id="hero1"></span> <span class="grad" id="hero2"></span></h1>
  <p id="count" class="sub"></p>
  <div class="search-box">
    <span>🔍</span>
    <input id="search" type="search" autocomplete="off">
  </div>
  <div class="stats" id="stats"></div>
</section>
<main class="wrap">
  <nav id="cats" class="cats"></nav>
  <div id="grid" class="grid"></div>
</main>
<footer id="footer-text"></footer>
<script>
var DATA = ${data};
var I18N = ${i18nData};
(function () {
  function main() {
    var lang = localStorage.getItem("lang") || "zh";
    var state = { cat: "all", q: "" };
    var grid = document.getElementById("grid");
    var catsEl = document.getElementById("cats");
    var searchEl = document.getElementById("search");
    var themeBtn = document.getElementById("theme");
    var langBtn = document.getElementById("lang-btn");
    var countEl = document.getElementById("count");
    var hero1 = document.getElementById("hero1");
    var hero2 = document.getElementById("hero2");
    var footerText = document.getElementById("footer-text");
    function t(key) { return I18N[lang][key] || I18N.zh[key] || key; }
    function getText(obj, field) {
      if (lang === "en" && obj[field + "_en"]) return obj[field + "_en"];
      return obj[field];
    }
    function applyTexts() {
      hero1.textContent = t("heroTitle1");
      hero2.textContent = t("heroTitle2");
      searchEl.placeholder = t("searchPlaceholder");
      footerText.textContent = t("footer");
      langBtn.textContent = lang === "zh" ? "En" : "中";
      document.title = t("title");
    }
    function renderStats() {
      var el = document.getElementById("stats");
      var s = DATA.stats;
      if (!el) return;
      if (!s) { el.style.display = "none"; return; }
      el.innerHTML =
        '<div class="stat"><span class="stat-icon">👁️</span><b>' + s.todayPV + "</b><span>" + t("statsToday") + "</span></div>" +
        '<div class="stat"><span class="stat-icon">📈</span><b>' + s.totalPV + "</b><span>" + t("statsTotal") + "</span></div>" +
        '<div class="stat"><span class="stat-icon">🔥</span><b>' + s.totalClicks + "</b><span>" + t("statsClicks") + "</span></div>";
    }
    function renderCats() {
      var items = [{ id: "all", name: t("all"), name_en: t("all"), icon: "✨" }].concat(DATA.categories);
      var html = "";
      for (var i = 0; i < items.length; i++) {
        var c = items[i];
        html += '<button class="pill' + (state.cat === c.id ? " active" : "") + '" data-id="' + c.id + '">' + c.icon + " " + getText(c, "name") + "</button>";
      }
      catsEl.innerHTML = html;
    }
    function renderGrid() {
      var q = state.q.trim().toLowerCase();
      var list = DATA.tools.filter(function (tool) {
        var okCat = state.cat === "all" || tool.cat === state.cat;
        var hay = (getText(tool, "name") + " " + tool.name + " " + getText(tool, "desc") + " " + tool.desc + " " + (tool.tags||[]).join(" ") + " " + (tool.tags_en||[]).join(" ")).toLowerCase();
        return okCat && (!q || hay.indexOf(q) > -1);
      });
      var totalStr = t("totalCount").replace("{total}", DATA.tools.length);
      var filteredStr = list.length !== DATA.tools.length ? t("filteredCount").replace("{count}", list.length) : "";
      countEl.textContent = totalStr + filteredStr;
      if (!list.length) {
        grid.innerHTML = '<div class="empty">' + t("empty") + '</div>';
        return;
      }
      var html = "";
      for (var i = 0; i < list.length; i++) {
        var tool = list[i];
        var cc = (DATA.stats && DATA.stats.clicks && DATA.stats.clicks[tool.name]) || 0;
        html += '<a class="card" data-name="' + tool.name + '" href="' + tool.url + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="icon-box"><span class="letter">' + getText(tool, "name").charAt(0) + "</span>" +
          '<img class="icon" src="https://www.google.com/s2/favicons?domain=' + new URL(tool.url).hostname + '&sz=64" alt="" loading="lazy" onerror="this.remove()"></span>' +
          '<div class="info"><div class="name">' + getText(tool, "name") + "</div>" +
          '<div class="desc">' + getText(tool, "desc") + "</div></div>" +
          (cc ? '<span class="clicks">🔥 ' + cc + "</span>" : "") +
          '<span class="arrow">↗</span></a>';
      }
      grid.innerHTML = html;
    }
    catsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      state.cat = btn.getAttribute("data-id");
      renderCats();
      renderGrid();
    });
    searchEl.addEventListener("input", function () {
      state.q = searchEl.value;
      renderGrid();
    });
    grid.addEventListener("click", function (e) {
      var a = e.target.closest("a.card");
      if (!a) return;
      try {
        navigator.sendBeacon("/api/track", new Blob(
          [JSON.stringify({ name: a.getAttribute("data-name") })],
          { type: "application/json" }
        ));
      } catch (err) {}
    });
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    function applyTheme() {
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
      themeBtn.textContent = dark ? "☀️" : "🌙";
    }
    themeBtn.addEventListener("click", function () {
      dark = !dark;
      localStorage.setItem("theme", dark ? "dark" : "light");
      applyTheme();
    });
    langBtn.addEventListener("click", function () {
      lang = lang === "zh" ? "en" : "zh";
      localStorage.setItem("lang", lang);
      applyTexts();
      renderCats();
      renderGrid();
      renderStats();
    });
    applyTheme();
    applyTexts();
    renderStats();
    renderCats();
    renderGrid();
  }
  try { main(); } catch (err) {
    document.getElementById("grid").innerHTML = '<div class="empty">⚠️ Error: ' + (err && err.message ? err.message : err) + "</div>";
  }
})();
</script>
</body>
</html>`;
} 
