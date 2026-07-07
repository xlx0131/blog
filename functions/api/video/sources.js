const SOURCES = {
  heimuer: {
    name: '黑木耳',
    baseUrl: 'https://www.heimuer.tv/api.php/provide/vod',
    enabled: true,
    description: '高清影视资源站，更新速度快',
  },
  ffzy: {
    name: '非凡资源',
    baseUrl: 'https://api.ffzyapi.com/api.php/provide/vod',
    enabled: true,
    description: '海量影视资源，种类齐全',
  },
  subo: {
    name: '速播资源',
    baseUrl: 'https://www.suboziyuan.net/api.php/provide/vod',
    enabled: true,
    description: '快速稳定的影视资源站',
  },
  kuaikan: {
    name: '快看资源',
    baseUrl: 'https://www.kuaikanzy.net/api.php/provide/vod',
    enabled: true,
    description: '热门剧集每日更新',
  },
  okzyw: {
    name: 'OK资源网',
    baseUrl: 'https://okzyw.vip/api.php/provide/vod',
    enabled: true,
    description: '优质高清影视资源',
  },
  ikun: {
    name: 'ikun播',
    baseUrl: 'https://ikunbo.com/api.php/provide/vod',
    enabled: true,
    description: '高清流畅影视资源',
  },
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS,
  })
}

export async function onRequest(context) {
  const { request } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  if (request.method !== 'GET') {
    return json({ success: false, error: '不支持的请求方法' }, 405)
  }

  try {
    const sources = Object.entries(SOURCES)
      .filter(([, config]) => config.enabled)
      .map(([key, config]) => ({
        key,
        name: config.name,
        description: config.description,
      }))

    return json({ success: true, data: sources })
  } catch (e) {
    return json({ success: false, error: e.message || '服务器错误' }, 500)
  }
}
