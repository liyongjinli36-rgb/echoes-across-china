'use strict';

// Read-only. --online also reads provider catalogues. --json includes both locales per item.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const load = name => JSON.parse(fs.readFileSync(path.join(root, 'data/music', name + '.json'), 'utf8'));
const course = load('records');
const history = load('historical-records');
const sources = load('sources');
const events = load('events');
const origins = load('origins');
const registry = load('registry');
const comparisons = load('regional-comparisons');
const references = new Map(Object.keys(sources).map(id => [id, []]));
const issues = [];
const rows = [];
const noMedia = [];
const ids = new Set();
const regions = new Map();
const online = process.argv.includes('--online');
const jsonOutput = process.argv.includes('--json');

function issue(id, message) {
  issues.push({id, message});
}

function bilingual(id, key, value) {
  for (const lang of ['zh', 'en']) {
    if (typeof value?.[lang] !== 'string' || !value[lang].trim()) issue(id, key + '.' + lang);
    else if (lang === 'en' && !/[a-z]/i.test(value.en)) issue(id, key + '.en 缺英文');
    else if (lang === 'zh' && !/\p{Script=Han}/u.test(value.zh)
      && !['people', 'media.performer'].includes(key)) issue(id, key + '.zh 缺中文');
  }
}

function urlOf(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

// Compare recording identifiers, retaining distinct tracks even when their album or uploader is shared.
function recordingKey(value) {
  const url = urlOf(value);
  if (!url) return null;
  if (['music.apple.com', 'embed.music.apple.com'].includes(url.hostname)) {
    const song = url.searchParams.get('i') || url.pathname.match(/\/song\/(?:[^/]+\/)?(\d+)\/?$/)?.[1];
    if (song) return 'apple:' + song;
  }
  if (['www.youtube.com', 'www.youtube-nocookie.com', 'youtu.be'].includes(url.hostname)) {
    const video = url.searchParams.get('v') || url.pathname.match(/(?:\/embed)?\/([\w-]{11})\/?$/)?.[1];
    if (video) return 'youtube:' + video;
  }
  return null;
}

function citations(owner, refs) {
  if (!Array.isArray(refs) || !refs.length) {
    issue(owner, '缺少来源');
    return;
  }
  for (const ref of refs) {
    if (!references.has(ref.id)) issue(owner, '来源库缺少 ' + ref.id);
    else references.get(ref.id).push(owner);
    if (/^course\d+$/.test(ref.id) && !ref.pages) issue(owner, ref.id + ' 缺页码');
  }
}

function inspectMedia(r) {
  const m = r.media;
  for (const field of ['title', 'performer', 'credit', 'prompt']) bilingual(r.id, 'media.' + field, m[field]);
  if (m.excerpt) bilingual(r.id, 'media.excerpt', m.excerpt);
  const targets = {cctv: 'cctv', embed: 'embed', file: 'local', video: 'video', watch: 'external'};
  const keys = Object.keys(targets).filter(key => m[key]);
  const kind = targets[keys[0]];
  if (keys.length !== 1 || (m.type && m.type !== kind)) issue(r.id, '播放方式与目标不符');
  if (urlOf(m.source)?.protocol !== 'https:') issue(r.id, '原页不是 HTTPS');
  if (kind === 'local' && (!m.licenseLabel || !urlOf(m.license) || !fs.existsSync(path.join(root, m.file)))) {
    issue(r.id, '缺少本地文件或授权信息');
  }
  if (kind === 'cctv' && (!/^[\da-f]{32}$/i.test(m.cctv) || urlOf(m.source)?.hostname !== 'tv.cctv.com')) {
    issue(r.id, '央视 PID 或原页地址不符');
  }
  const key = recordingKey(m.source);
  if (kind === 'embed' && (!key || key !== recordingKey(m.embed))) issue(r.id, '原页与嵌入的曲目 ID 不同');
  const range = m.originalRangeSeconds;
  if (range && (!Array.isArray(range) || range.length !== 2 || !range.every(Number.isFinite) || range[0] < 0 || range[1] <= range[0])) {
    issue(r.id, '片段范围无效');
  }
  const refs = (r.sources || []).filter(ref => sources[ref.id]?.url);
  const exact = refs.find(ref => sources[ref.id].url === m.source);
  const aligned = key && refs.find(ref => recordingKey(sources[ref.id].url) === key);
  // A publisher may document the correct video by embedding it on a different URL.
  // Leave these candidates for inspection; --online follows the cited pages to check the ID.
  const citation = exact ? '原页' : aligned ? '同一曲目ID' : '核查发布页';
  return {
    id: r.id, region: r.region, title: r.title, mediaTitle: m.title, performer: m.performer, credit: m.credit,
    excerpt: m.excerpt || null, range: range || null, source: m.source, target: m[keys[0]], kind,
    citation, cited: exact?.id || aligned?.id || null, candidates: !exact && !aligned ? refs.map(r => r.id) : [],
  };
}

for (const [code, source] of Object.entries(sources)) {
  bilingual(code, 'title', source.title);
  if (source.url && urlOf(source.url)?.protocol !== 'https:') issue(code, '来源地址无效');
}
for (const [group, records] of [['曲目', course], ['历史', history]]) {
  for (const r of records) {
    if (ids.has(r.id)) issue(r.id, '重复 ID');
    ids.add(r.id);
    if (!regions.has(r.region)) regions.set(r.region, {course: 0, media: 0, history: 0});
    const reg = regions.get(r.region);
    for (const field of ['title', 'period', 'description', 'uncertainty']) bilingual(r.id, field, r[field]);
    for (const field of ['name', 'role']) bilingual(r.id, 'location.' + field, r.location?.[field]);
    if (r.people) bilingual(r.id, 'people', r.people);
    citations(r.id, r.sources);
    if (group === '历史') reg.history++;
    else {
      reg.course++;
      for (const field of ['analysis', 'instruments']) bilingual(r.id, field, r[field]);
      if (!r.media) noMedia.push({id: r.id, region: r.region, title: r.title, watch: r.watch, listen: r.listen});
    }
    if (!r.media) continue;
    for (const field of ['province', 'genre', 'course']) bilingual(r.id, field, r[field]);
    rows.push(inspectMedia(r));
    reg.media++;
  }
}
for (const e of events) {
  citations(e.id, e.sources);
  if (!ids.has(e.work)) issue(e.id, '时间线曲目不存在');
}
for (const [code, o] of Object.entries(origins)) {
  if (o.sources) citations(code, o.sources);
  if (urlOf(o.url)?.protocol !== 'https:') issue(code, '历史起源网址无效');
}
for (const c of comparisons) for (const id of c.records) if (!ids.has(id)) issue(id, '对听对象不存在');

async function readWeb(url, asJSON = false) {
  const response = await fetch(url, {signal: AbortSignal.timeout(14000), headers: {'User-Agent': 'Mozilla/5.0'}});
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return asJSON ? response.json() : response.text();
}

function htmlTitle(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title?.replace(/\s+/g, ' ').replace(/&amp;/g, '&').trim() || '';
}

async function official(row) {
  const key = recordingKey(row.source);
  if (row.citation === '核查发布页') {
    for (const id of row.candidates) {
      try {
        const body = await readWeb(sources[id].url);
        if (key?.startsWith('youtube:') && body.includes('/embed/' + key.slice(8))) {
          row.citation = '发布页嵌入同一ID';
          row.cited = id;
          break;
        }
      } catch {
        // A separate citation can still provide the publisher's embed.
      }
    }
  }
  if (row.kind === 'cctv') {
    const [html, info] = await Promise.all([readWeb(row.source),
      readWeb('https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=' + row.target, true)]);
    const pid = html.match(/\b(?:var\s+)?guid\s*=\s*["']([a-f\d]{32})["']/i)?.[1];
    if (!pid) throw new Error('原页未找到 GUID');
    if (pid.toLowerCase() !== row.target.toLowerCase()) issue(row.id, '已解析的原页 GUID 与记录不符');
    if (!info.title || !Number(info.video?.totalLength) || !info.hls_url) throw new Error('央视接口缺少节目、片长或 HLS');
    const duration = Number(info.video.totalLength);
    if (row.range && row.range[1] > duration + 0.5) issue(row.id, '选段超过节目时长');
    const description = html.match(/<meta\b[^>]*name=["']?description["']?[^>]*content=["']([^"']*)/i)?.[1] || '';
    return {programme: info.title, description, duration, wholeEpisodeFromZero: row.range?.[0] === 0 && row.range[1] < duration - 1};
  }
  if (key?.startsWith('youtube:')) {
    const data = await readWeb('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(row.source), true);
    if (!data.title || !data.author_name) throw new Error('缺少视频元数据');
    return {programme: data.title, publisher: data.author_name};
  }
  if (key?.startsWith('apple:')) {
    const storefront = new URL(row.source).pathname.split('/')[1];
    const data = await readWeb('https://itunes.apple.com/lookup?country=' + storefront + '&id=' + key.slice(6), true);
    const track = data.results?.find(item => String(item.trackId) === key.slice(6));
    if (!track) throw new Error('Apple 未返回所选单曲');
    return {programme: track.trackName, performer: track.artistName};
  }
  const html = await readWeb(row.source);
  const programme = htmlTitle(html);
  if (!programme) throw new Error('原页未返回标题');
  return {programme};
}

function matchedText(row) {
  // A total programme title may omit a movement or its performers. A literal match
  // is a search aid; the reviewer checks aliases, translated titles and programme credits.
  const compact = text => (text || '').normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]/gu, '');
  const text = compact([row.official.programme, row.official.description, row.official.performer].join(' '));
  const contains = value => !!value && text.includes(compact(value));
  return {stationZh: contains(row.title.zh), mediaZh: contains(row.mediaTitle.zh), performerZh: contains(row.performer.zh)};
}

async function audit() {
  if (online) {
    let index = 0;
    async function worker() {
      while (index < rows.length) {
        const row = rows[index++];
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            row.official = await official(row);
            row.literal = matchedText(row);
            break;
          } catch (e) {
            if (attempt === 1) row.onlinePending = e.cause?.code || e.message;
          }
        }
      }
    }
    await Promise.all(Array.from({length: 5}, worker));
  }
  const sourceURLs = new Map();
  for (const [id, source] of Object.entries(sources)) {
    if (!source.url) continue;
    if (!sourceURLs.has(source.url)) sourceURLs.set(source.url, []);
    sourceURLs.get(source.url).push(id);
  }
  const duplicateURLs = [...sourceURLs].filter(([, ids]) => ids.length > 1).map(([url, ids]) => ({url, ids}));
  const unreferenced = [...references].filter(([, owners]) => !owners.length).map(([id]) => id);
  const key = 'heritage2006';
  const url = sources[key]?.url;
  const registryScript = fs.readFileSync(path.join(root, 'js/music-registry.js'), 'utf8');
  const registryUrl = registryScript.match(/\b2006\s*:\s*['"]([^'"]+)['"]/)?.[1];
  const heritage = {
    id: key, direct: references.get(key) || [], originsWithSameURL: Object.keys(origins).filter(code => origins[code].url === url),
    registryUrl, sameURL: !!url && registryUrl === url, firstBatchRows: registry.registrations.filter(r => r.year === 2006).length,
  };
  const result = {counts: {course: course.length, history: history.length, media: rows.length, sources: references.size,
    events: events.length, origins: Object.keys(origins).length, comparisons: comparisons.length}, regions: Object.fromEntries(regions),
    noMedia, unreferenced, duplicateURLs, heritage, issues, rows};
  if (jsonOutput) console.log(JSON.stringify(result, null, 2));
  else {
    console.log('全库', result.counts);
    console.table(result.regions);
    console.log('未配置媒体', noMedia.map(r => r.id).join(', '));
    console.log('无直接引用', unreferenced.join(', '));
    console.log('同址多键', duplicateURLs.map(x => x.ids.join(' / ')).join('，'));
    console.log('heritage2006', heritage);
    console.log('媒体来源对应', Object.fromEntries([...new Set(rows.map(r => r.citation))].map(s => [s, rows.filter(r => r.citation === s).length])));
    for (const row of rows.filter(r => !r.cited || r.onlinePending || r.official?.wholeEpisodeFromZero)) {
      console.log(row.id, row.citation, row.onlinePending || '', row.official?.wholeEpisodeFromZero ? '零起点短选段，核对是否自动截停' : '');
    }
    if (online) console.log('网络元数据', rows.filter(r => r.official).length, '/', rows.length);
    console.log('逐站双语、来源键、线上节目与原片范围可用 --online --json 查看。');
    console.log('结构问题', issues.length);
    for (const it of issues) console.log(it.id, it.message);
  }
  if (issues.length) process.exitCode = 1;
}
audit().catch(error => { console.error(error); process.exitCode = 1; });
