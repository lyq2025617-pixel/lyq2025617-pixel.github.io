// Cloudflare Workers CORS 代理
// 部署到 Cloudflare Workers 后，使用方式：
// POST https://your-worker-name.your-username.workers.dev/v1/chat/completions

export default {
  async fetch(request, env) {
    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // 获取请求路径和方法
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 构建目标 URL
    const targetUrl = `https://dashscope.aliyuncs.com/compatible-mode${path}`;
    
    // 转发请求到目标服务器
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow',
    });

    // 发送请求
    const response = await fetch(modifiedRequest);
    
    // 添加 CORS 头
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new Response(response.body, {
      status: response.status,
      headers: headers,
    });
  },
};
