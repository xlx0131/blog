export const mockCategories = [
  { type_id: 1, type_name: '电影' },
  { type_id: 2, type_name: '电视剧' },
  { type_id: 3, type_name: '动漫' },
  { type_id: 4, type_name: '综艺' },
  { type_id: 5, type_name: '动作片' },
  { type_id: 6, type_name: '喜剧片' },
  { type_id: 7, type_name: '爱情片' },
  { type_id: 8, type_name: '科幻片' },
  { type_id: 9, type_name: '恐怖片' },
  { type_id: 10, type_name: '国产剧' },
  { type_id: 11, type_name: '日韩剧' },
  { type_id: 12, type_name: '欧美剧' },
]

const posters = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20movie%20poster%20cyberpunk%20city%20neon%20night&image_size=portrait_4_3',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20movie%20poster%20fantasy%20castle%20dragon&image_size=portrait_4_3',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20movie%20poster%20space%20astronaut%20galaxy&image_size=portrait_4_3',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20movie%20poster%20retro%2080s%20synthwave&image_size=portrait_4_3',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20movie%20poster%20samurai%20japan%20sunset&image_size=portrait_4_3',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20movie%20poster%20pirate%20ship%20ocean&image_size=portrait_4_3',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20movie%20poster%20zombie%20horror%20dark&image_size=portrait_4_3',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20movie%20poster%20robot%20mecha%20battle&image_size=portrait_4_3',
]

function genMockList(count = 20, typeId = 1, typeName = '电影') {
  const names = [
    '星际远征', '像素勇士', '末日之城', '时光旅人', '迷雾森林',
    '暗夜追击', '彩虹桥', '海洋之心', '龙骑士传说', '黑客纪元',
    '梦回唐朝', '南极之恋', '极速狂飙', '魔法学院', '幽灵船',
    '沙漠风暴', '天使之翼', '恶魔城', '月光宝盒', '星球大战',
  ]
  return Array.from({ length: count }, (_, i) => ({
    vod_id: typeId * 100 + i,
    vod_name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
    type_id: typeId,
    type_name: typeName,
    vod_en: '',
    vod_time: '2024-01-01 00:00:00',
    vod_remarks: i % 3 === 0 ? '全40集' : i % 3 === 1 ? 'HD高清' : '更新至第12集',
    vod_pic: posters[i % posters.length],
    vod_area: i % 2 === 0 ? '大陆' : '美国',
    vod_lang: '国语',
    vod_year: 2023 + (i % 3),
    vod_serial: '',
    vod_actor: '演员A,演员B,演员C',
    vod_director: '导演X',
    vod_content: `这是《${names[i % names.length]}》的简介。一部精彩的${typeName}，讲述了一个动人的故事，画面精美，情节跌宕起伏，不容错过。`,
    vod_play_from: 'ikun$$$heimuer$$$ffzy',
    vod_play_url: generatePlayUrls(i),
  }))
}

function generatePlayUrls(index) {
  const episodeCount = 12 + (index % 20)
  let ikun = ''
  let heimuer = ''
  let ffzy = ''
  for (let i = 1; i <= episodeCount; i++) {
    const url = `https://example.com/video/${index}-${i}.mp4`
    ikun += `第${i}集$${url}#`
    heimuer += `第${i}集$${url}#`
    ffzy += `第${i}集$${url}#`
  }
  return ikun.slice(0, -1) + '$$$' + heimuer.slice(0, -1) + '$$$' + ffzy.slice(0, -1)
}

export const mockVideoList = {
  1: genMockList(20, 1, '电影'),
  2: genMockList(20, 2, '电视剧'),
  3: genMockList(20, 3, '动漫'),
  4: genMockList(20, 4, '综艺'),
}

export const mockBanners = [
  {
    id: 1,
    title: '星际远征',
    subtitle: '2024年度科幻巨制',
    pic: posters[0],
    vod_id: 101,
  },
  {
    id: 2,
    title: '像素勇士',
    subtitle: '热血冒险即刻启程',
    pic: posters[1],
    vod_id: 102,
  },
  {
    id: 3,
    title: '黑客纪元',
    subtitle: '虚拟与现实的边界',
    pic: posters[3],
    vod_id: 110,
  },
]

export function parsePlayUrl(vod_play_from, vod_play_url) {
  if (!vod_play_from || !vod_play_url) return []
  
  // Support both $$$ and comma as separator
  let fromList
  if (vod_play_from.includes('$$$')) {
    fromList = vod_play_from.split('$$$')
  } else {
    fromList = vod_play_from.split(',')
  }
  
  const hasSeparator = vod_play_url.includes('$$$')
  const urlList = hasSeparator ? vod_play_url.split('$$$') : []
  const result = []
  for (let i = 0; i < fromList.length; i++) {
    const source = fromList[i].trim()
    if (!source) continue
    // If no $$$ in vod_play_url, all sources share the same URL list
    const urlStr = hasSeparator ? (urlList[i] || '') : vod_play_url
    const episodes = urlStr.split('#').filter(e => e.includes('$')).map(e => {
      const [name, url] = e.split('$')
      return { name, url }
    })
    if (episodes.length > 0) {
      result.push({ source, episodes })
    }
  }
  
  return result
}
