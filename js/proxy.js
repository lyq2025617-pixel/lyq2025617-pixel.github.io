// LLM CORS 代理 —— Node.js 原生，无需安装任何依赖
// 启动：node proxy.js
// 监听 http://localhost:3030/v1/...  → 转发到 dashscope
const http  = require('http');
const https = require('https');

const TARGET_HOST = 'dashscope.aliyuncs.com';
const PORT = 3030;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

const server = http.createServer((req, res) => {
  // 预检请求直接放行
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // 转发路径：/compatible-mode/v1/chat/completions
  const targetPath = '/compatible-mode' + req.url;

  const options = {
    hostname: TARGET_HOST,
    port:     443,
    path:     targetPath,
    method:   req.method,
    headers:  Object.assign({}, req.headers, { host: TARGET_HOST }),
  };

  const proxyReq = https.request(options, (proxyRes) => {
    const outHeaders = Object.assign({}, CORS_HEADERS, proxyRes.headers);
    // 删除可能冲突的 transfer-encoding
    delete outHeaders['transfer-encoding'];
    res.writeHead(proxyRes.statusCode, outHeaders);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('代理转发错误:', err.message);
    res.writeHead(502, CORS_HEADERS);
    res.end(JSON.stringify({ error: err.message }));
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`✅ LLM 代理已启动：http://localhost:${PORT}`);
  console.log(`   请求示例：POST http://localhost:${PORT}/v1/chat/completions`);
  console.log(`   转发目标：https://${TARGET_HOST}/compatible-mode/v1/chat/completions`);
});
