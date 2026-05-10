// ===== LLM 配置 =====
const LLM_CONFIG = {
  baseUrl: 'https://corsproxy.io/?https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey:  'sk-a2461647f4b241afb9f7015407ad9f3b',
  model:   'qwen-turbo',
};

// ===== Prompt 构造 =====
function buildPrompt(inputs) {
  const { theme, type, people, duration, styles, venue, date } = inputs;
  const stylesStr  = (styles && styles.length) ? styles.join('、') : '活泼';
  const venueStr   = venue  ? `场地：${venue}，` : '';
  const dateStr    = date   ? `日期：${date}，` : '';
  const durationLabel = { '60':'1小时','120':'2小时','180':'3小时','240':'半天' };
  const durationText  = durationLabel[String(duration)] || `${duration}分钟`;
  const toneMap = { '活泼':'语气轻松热情，有感染力，像朋友在聊天', '搞笑':'幽默风趣，适当用网络梗，让现场笑起来', '正式':'措辞专业庄重，有仪式感', '专业':'措辞专业庄重，有仪式感', '温馨':'语气温柔亲切，充满情感', '燃':'激情澎湃，节奏感强，点燃全场' };
  const primaryStyle = (styles || []).find(s => toneMap[s]);
  const scriptTone   = primaryStyle ? toneMap[primaryStyle] : `符合「${stylesStr}」风格`;

  return `你是一个专业的校园活动策划师。请根据以下信息，为一场校园活动生成完整策划方案，并以 JSON 格式返回。

活动信息：
- 主题：${theme}
- 类型：${type}
- 人数：${people}人
- 时长：${durationText}
- 风格：${stylesStr}
- ${venueStr}${dateStr}

请严格按照以下 JSON 结构返回（不要输出任何 JSON 以外的内容，不要使用 markdown 代码块）：
{
  "process": [
    { "time": "开始时间-结束时间（如 18:30-18:40）", "title": "环节名称", "desc": "环节详细说明，80字以内" }
  ],
  "playlist": [
    {
      "section": "歌单分区名（如 开场预热）",
      "songs": [
        { "title": "歌曲名", "artist": "歌手/乐队", "duration": "时长（如 3:42）", "cover": "🎵", "mood_tags": ["情绪标签1","情绪标签2"] }
      ]
    }
  ],
  "script": [
    { "time": "时间段（如 18:30-18:40 开场）", "content": "串词正文，120字以内" }
  ],
  "tasks": [
    { "title": "任务名称", "desc": "说明，30字以内", "done": false }
  ]
}

要求（字数严格控制，加快响应速度）：
1. process：5-6个环节，时间从18:30开始，总时长严格等于${durationText}
2. playlist：2-3个分区，每分区2-3首歌，歌曲真实存在，符合风格「${stylesStr}」
3. script：每个环节一条串词，字段名为 content，语气：${scriptTone}，120字以内
4. tasks：6-8条筹备任务
5. 所有内容围绕「${theme}」主题，体现「${stylesStr}」风格
6. 严格输出纯 JSON，禁止输出任何解释文字`;
}

// ===== 调用 LLM API（带 45s 超时）=====
async function callLLM(prompt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000); // 45s 超时

  try {
    const resp = await fetch(`${LLM_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${LLM_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model:       LLM_CONFIG.model,
        messages:    [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens:  2000,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`LLM API 错误 ${resp.status}: ${errText}`);
    }

    const data = await resp.json();
    return data.choices[0].message.content;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('请求超时（>45s），请检查网络或稍后重试');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ===== 解析 LLM 返回的 JSON =====
function parseLLMResponse(text) {
  // 去除可能的 markdown 代码块包裹
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

  const parsed = JSON.parse(cleaned);

  // 容错：确保必要字段存在
  if (!Array.isArray(parsed.process)  || parsed.process.length  === 0) throw new Error('process 字段缺失');
  if (!Array.isArray(parsed.playlist) || parsed.playlist.length === 0) throw new Error('playlist 字段缺失');
  if (!Array.isArray(parsed.script)   || parsed.script.length   === 0) throw new Error('script 字段缺失');
  if (!Array.isArray(parsed.tasks)    || parsed.tasks.length    === 0) throw new Error('tasks 字段缺失');

  // 统一 script 格式：content 字段兼容旧版 formal 字段
  parsed.script = parsed.script.map(function(s) {
    return { time: s.time || '', content: s.content || s.formal || s.lively || s.funny || '' };
  });

  return parsed;
}

// ===== 主入口：用 LLM 生成数据，失败则降级到 mock =====
async function generateWithLLM(inputs) {
  const prompt = buildPrompt(inputs);
  const rawText = await callLLM(prompt);
  return parseLLMResponse(rawText);
}

// ===== 流式调用 LLM (SSE) =====
async function* callLLMStream(prompt) {
  const resp = await fetch(LLM_CONFIG.baseUrl + '/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + LLM_CONFIG.apiKey },
    body: JSON.stringify({ model: LLM_CONFIG.model, messages: [{ role: 'user', content: prompt }], temperature: 0.9, max_tokens: 512, stream: true }),
  });
  if (!resp.ok) { const t = await resp.text(); throw new Error('LLM ' + resp.status + ': ' + t); }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buf = '';
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    buf += decoder.decode(chunk.value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      const tr = line.trim();
      if (!tr || tr === 'data: [DONE]' || !tr.startsWith('data: ')) continue;
      try { const j = JSON.parse(tr.slice(6)); const d = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content; if (d) yield d; } catch(e) {}
    }
  }
}

// ===== 串词风格实时重写（流式 + 打字机效果）=====
async function rewriteScriptStyle(scriptItem, targetStyle, theme, targetEl, onDone) {
  var styleMap = { formal: '正式专业，措辞庄重得体，有仪式感', lively: '活泼热情，语气轻松有活力，让全场嗨起来', funny: '幽默搞笑，有网络梗或谐音梗，让全场笑场' };
  var styleDesc = styleMap[targetStyle] || '活泼热情';
  var baseText = scriptItem.formal || scriptItem.lively || scriptItem.funny || '';
  var prompt = '你是一名晚会主持人，请将以下串词改写为' + styleDesc + '风格，只输出串词正文，200字以内，活动主题是' + theme + '\n\n原串词（' + scriptItem.time + '）：\n' + baseText + '\n\n请直接输出：';
  var full = '';
  targetEl.innerHTML = '<span style="display:inline-block;animation:blink 1s step-end infinite;color:#1DB954;font-weight:bold">|</span>';
  try {
    for await (const tk of callLLMStream(prompt)) {
      full += tk;
      targetEl.innerHTML = full.replace(/\n/g, '<br>') + '<span style="display:inline-block;animation:blink 1s step-end infinite;color:#1DB954;font-weight:bold">|</span>';
    }
    targetEl.innerHTML = full.replace(/\n/g, '<br>');
    if (onDone) onDone(full);
  } catch (err) {
    targetEl.innerHTML = '<span style="color:#ef4444;font-size:13px">生成失败，请重试</span>';
    console.error('串词重写失败:', err);
  }
}

// ===== 预告片文案流式生成（三版同时） =====
// onChunk(style, token)  — 每来一个 token 回调
// onDone(style, fullText) — 每版完成回调
async function generateTrailerCopies(inputs, onChunk, onDone) {
  const theme    = inputs.theme    || '精彩活动';
  const type     = inputs.type     || '晚会';
  const date     = inputs.date     ? `，时间 ${inputs.date}` : '';
  const people   = inputs.people   ? `，约 ${inputs.people} 人参加` : '';
  const stylesStr = (inputs.styles && inputs.styles.length) ? inputs.styles.join('、') : '活泼';

  const prompt = `你是一个活动运营文案专家。请为以下活动生成三版预告宣传文案。

活动信息：
- 主题：${theme}
- 类型：${type}${date}${people}
- 风格：${stylesStr}

请严格按如下 JSON 格式输出，不要输出任何 JSON 以外的内容：
{
  "正式": "正式庄重风格的预告文案，40字以内，适合正式场合宣传",
  "活泼": "轻松活泼风格的预告文案，40字以内，有感染力，让人想来",
  "搞笑": "幽默搞笑风格的预告文案，40字以内，有网络梗或夸张表达，让人忍不住转发"
}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);

  try {
    const resp = await fetch(LLM_CONFIG.baseUrl + '/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + LLM_CONFIG.apiKey },
      body: JSON.stringify({ model: LLM_CONFIG.model, messages: [{ role: 'user', content: prompt }], temperature: 0.9, max_tokens: 300, stream: true }),
    });
    if (!resp.ok) { const t = await resp.text(); throw new Error('LLM ' + resp.status + ': ' + t); }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buf = '', full = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        const tr = line.trim();
        if (!tr || tr === 'data: [DONE]' || !tr.startsWith('data: ')) continue;
        try {
          const j = JSON.parse(tr.slice(6));
          const d = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
          if (d) { full += d; if (onChunk) onChunk(d); }
        } catch (_) {}
      }
    }

    // 解析三版文案（容错：JSON 解析失败则把全文当作"活泼"兜底）
    try {
      let cleaned = full.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      // 提取第一个合法 JSON 对象（防止 LLM 在 JSON 前后加了说明文字）
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('no json');
      const parsed = JSON.parse(jsonMatch[0]);
      ['正式', '活泼', '搞笑'].forEach(style => {
        if (parsed[style] && onDone) onDone(style, parsed[style]);
      });
      // 如果一个都没解析到，用全文兜底
      if (!parsed['正式'] && !parsed['活泼'] && !parsed['搞笑']) {
        if (onDone) onDone('活泼', full.trim());
      }
    } catch (_) {
      // JSON 解析彻底失败 → 把流式文字直接当文案，不报错
      const fallback = full.trim() || '精彩活动预告，期待你的到来！';
      if (onDone) onDone('活泼', fallback);
      if (onDone) onDone('正式', fallback);
      if (onDone) onDone('搞笑', fallback);
    }
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('生成超时，请重试');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
