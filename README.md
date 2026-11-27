# 华夏乐踪：中国音乐时空图谱

**Echoes Across China: An Interactive Atlas of Chinese Music Through Time and Space**

UCUG 2500 · Music of China

以地图和时间轴聆听民歌、器乐独奏与合奏、说唱音乐和戏曲。简体中文和英文共用同一套地图、时间状态、筛选和课程数据。地图改编自 [江山时序 Jiangshan Atlas](https://github.com/DeanChensj/jiangshan-map)。

Explore folk song, solo and ensemble music, narrative singing and Chinese opera through maps, listening notes and documentary milestones. Simplified Chinese and English share the same map, timeline, filters and content. The map is adapted from [Jiangshan Atlas](https://github.com/DeanChensj/jiangshan-map).

## 本地运行 · Run locally

需要 Node.js 22 或更新版本和 Python 3。静态站点无第三方安装依赖。请在仓库根目录运行以下命令。

Requires Node.js 22 or later and Python 3. The static site has no third-party install dependencies. Run these commands from the repository root.

```sh
node scripts/check_music_atlas.cjs
node scripts/stage_music_atlas.cjs
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

- [北方 · 22 首地区试听](http://127.0.0.1:8765/?lang=zh&region=north) · [Northern China](http://127.0.0.1:8765/?lang=en&region=north)
- [华东与华中 · 24 首地区试听](http://127.0.0.1:8765/?lang=zh&region=east-central) · [East and Central China](http://127.0.0.1:8765/?lang=en&region=east-central)
- [华南与西南 · 37 首地区试听](http://127.0.0.1:8765/?lang=zh&region=south) · [South and Southwest China](http://127.0.0.1:8765/?lang=en&region=south)
- [简体中文首页](http://127.0.0.1:8765/?lang=zh) · [English home](http://127.0.0.1:8765/?lang=en)
- [唐代概览 · Tang overview](http://127.0.0.1:8765/?lang=en&era=tang)
- [1598 年《牡丹亭》 · The Peony Pavilion](http://127.0.0.1:8765/?lang=en&year=1598&music=kunqu)
- [无锡采录资料及张沛坚演奏选段 · Wuxi recording history and Zhang Peijian’s excerpt](http://127.0.0.1:8765/?lang=zh&year=1950&music=erquan-yingyue)
- [古琴录音 · Guqin recording](http://127.0.0.1:8765/?lang=en&music=guqin)

点击时期色带或在侧栏选择时期，可查看概览。拖动时间轴下沿或滑块可切换具体年份，也可以直接输入年份。负数表示公元前。左右按钮逐个跳转音乐史节点，播放按钮按年份依次播放节点。地图上可用鼠标或触屏拖动，也可用滚轮、双指或缩放按钮改变视野。点击标记或搜索结果可阅读分析和来源。

Select a period in the timeline bands or sidebar for an overview. Drag the lower part of the timeline or the playhead to select a year, or enter it directly. Negative numbers indicate BCE. The step buttons and autoplay move through dated musical milestones. Drag to pan, and scroll, pinch or use the buttons to zoom. Select a marker or search result to read the analysis and sources.

## 非遗目录的时间 · Dating the heritage register

目录收录 920 条名录记录，涉及 659 个项目编号。第一批经核对的年代见 `data/music/origins.json`，分别标明大致形成、早期发展或已有记载。地图上的课程条目、目录项目和历史节点从相应起始年显示到所属时期结束。跨期年代资料按条目标注的参考时期落点，卡片保留原有年代区间。未完成断代的项目可从目录检索。入选年份与申报地保存在卡片的名录资料中。课程时间轴保留创作、出版、演出、采录和传播等节点。

The register contains 920 records covering 659 project codes. Sourced dates in `data/music/origins.json` distinguish approximate formation, early development and early documentation. Course records, registry projects and milestones appear from their first mapped year through the end of the assigned period. A date range spanning multiple periods uses its assigned reference period for placement. Cards retain the original date range. Undated projects remain searchable in the directory. Inscription dates and applicants appear in the register citation. The main timeline keeps composition, publication, performance, recording and circulation milestones.

## 课程材料与证据 · Course materials and evidence

全图有 96 条中英曲目与乐种记录，其中北方 22 条、华东与华中 34 条、华南与西南 40 条。另有 66 条历史证据、8 条带年份的事件记录和 5 组地区对照。8 条事件中，5 条用于时间轴步进与播放，3 条记录非遗入选。课堂导览另有 5 站。课程框架和指定案例取自方博的六套 UCUG 2500 讲义，条目列出关联页码。昆曲与京剧以导论第 8、17 页定位课程范围，分析和年代另引联合国教科文组织、国会图书馆、印第安纳大学出版社与北京市政府资料。课件仅作引用，站点发布包不含讲义原件。

The atlas contains 96 bilingual work and genre entries across three regions (22 northern, 34 eastern and central, and 40 southern and southwestern), plus 66 historical records, eight dated events and five regional comparisons. Five of the eight events drive timeline navigation and autoplay. Three record heritage inscriptions. The classroom guide has five stops. Its structure and assigned examples follow six UCUG 2500 lectures by Noah B. Fang. Entries cite the relevant slides. The introduction identifies the opera topics on slides 8 and 17, with UNESCO, the Library of Congress, Indiana University Press and the Beijing Municipal Government providing additional documentation. The teaching decks are cited and excluded from the site package.

北方地图覆盖东北、华北、西北 13 个省级地区，22 站均可试听。北方另有 27 条历史证据，含敦煌佛爷庙湾 M37 西晋墓画像。各站的地点、年代依据和实际播放版本见[北方交接清单](handoff/north-changes.md)。

The northern map covers 13 provincial-level regions across the Northeast, North China and the Northwest. All 22 stations have listening media. The 27 northern historical records include a Western Jin tomb painting from Dunhuang.

## 地图与代码 · Map and code

上游基线为 `f628e2d573b83c7f312faae6fa075b649893d9d7`，本地 `main` 为上游对照，音乐版在 `feat/music-atlas`。原版在 1366 像素和 587 像素宽视口中运行，验证了 741 年唐代和 1598 年明代的边界、语言切换、缩放、拖动和时间轴跳转。音乐版使用原控制器的地图模式，保留墨色与羊皮纸风格、墨卡托投影、地形瓦片、政权渲染、视野变换与时间轴组件。音乐控制器接管数据、搜索、标记、侧栏和播放逻辑。历史搜索、人物、旧址沿革、战役、皇帝纪年和测验模块从音乐版入口停用。

The upstream baseline is `f628e2d573b83c7f312faae6fa075b649893d9d7` on local `main`, with the music edition on `feat/music-atlas`. The original ran at widths of 1366 and 587 pixels. The baseline audit exercised Tang and Ming borders at 741 and 1598, language switching, zoom, pan and timeline navigation. The music edition uses the original controller in map mode and retains its Mercator projection, terrain tiles, polity renderer, camera and timeline controls. The music controller handles records, search, markers, cards and playback. The legacy historical search, biography, genealogy, warfare, regnal-year and quiz modules are inactive in this entry point.

| 路径 / Path | 内容 / Contents |
|---|---|
| `index.html`, `css/music-atlas.css` | 双语界面和响应式布局 / Bilingual interface and responsive layout |
| `js/app.js`, `js/music-atlas.js`, `js/music-i18n.js` | 地图内核、音乐交互和界面字典 / Map core, music interactions and UI strings |
| `data/era-map-config.json`, `js/music-era-data.js` | 时期概览、快照区间与上游阶段分配 / Era overviews, snapshot ranges and upstream phase thresholds |
| `data/music/` | 作品和传统、年份节点、双语参考资料 / Works and traditions, dated events and bilingual references |
| `data/atlas/`, `js/atlas_snapshots.js` | 政权轮廓的编辑源和浏览器数据包 / Editable polity outlines and browser bundle |
| `scripts/check_music_atlas.cjs`, `scripts/stage_music_atlas.cjs` | 数据完整性检查和静态发布文件 / Data checks and static deployment staging |

### 年代和地图限制 · Dating and map coverage

时期设定保存了原地图的时间轴分配，并另列常见历史起讫年。选择代表快照只会改变地图底图，音乐卡片使用自身的年代证据。指定年份按照上游分期映射到快照。例如，1598 年显示 1513–1615 年分期。公元前 403 年以前以地形定位考古地点。1949 年起，上游现代入口依赖 DataV 省界。音乐版采用地形与河流参照。各曲卡列明表演者、版本和出处。试听在卡片内播放，使用本地授权录音、央视或光明网原版节目流，或发布平台提供的嵌入播放器。

The era configuration preserves upstream year assignments and separately lists familiar historical date ranges. A representative snapshot sets the base map, and music cards carry their own dating evidence. Selected years use upstream snapshot intervals. For example, 1598 uses the 1513–1615 phase. Before 403 BCE, terrain provides context for archaeological finds. From 1949 onward, the upstream map relies on DataV provincial outlines, so the music edition uses terrain and rivers as its reference. Cards identify each performer and version. Cards play recordings in place using licensed local files, streams from CCTV or Guangming Net, and embedded players from source platforms.

## 校验与打包 · Validate and stage

```sh
node scripts/build_atlas.js --check
node scripts/check_music_atlas.cjs
node scripts/stage_music_atlas.cjs
```

第一项检查 GeoJSON 与编码包是否同步。第二项检查双语字段、引用、时间精度、政权名称译文、快照与受限图层。第三项生成独立的 `dist/` 目录。分发网站时使用 `dist/`，避免将上游 Git 历史或它曾经包含的数据打包到站点。见 [来源与许可](CREDITS.md)。

The first check validates the GeoJSON and encoded bundles. The second checks bilingual fields, citations, time precision, polity translations, snapshot keys and excluded layers. The last command stages a standalone `dist/` directory. Distribute the site from `dist/` to keep upstream Git history and earlier data out of the website. See [sources and licences](CREDITS.md).

### 浏览器验收 · Browser checks

在本地静态发布目录完成了双语深链接、1598 年明代快照、738–754 年唐代概览、1950 年采录节点、信天游年代不确定性、双语与年份搜索、地图缩放及拖动、时间轴拖动和节点自动播放。切换语言后，地图视野、年份、卡片、筛选和导览步骤均保留。古琴录音验证了用户主动播放、进度和暂停。检查了 1366、390 和 320 像素宽的布局。移动尺寸检查在桌面浏览器的模拟视口中完成。

The staged site was exercised with bilingual deep links, the 1598 Ming snapshot, the 738–754 Tang overview, the 1950 recording milestone, uncertainty for Xintianyou, bilingual and year search, map zoom and pan, timeline dragging and milestone autoplay. Changing the language preserved the camera, year, card, filters and guide step. The recording was tested for user-initiated playback, progress and pause. Layout checks covered widths of 1366, 390 and 320 pixels in a desktop browser with viewport emulation.

## GitHub Pages

有发布授权时，先运行 `node scripts/stage_music_atlas.cjs --source`。将 `source-release/` 的内容作为新提交历史放入自己的公开仓库。这个目录包含音乐版及其对应源代码，原版 Git 历史留在本地对照仓库。打开 **Settings → Pages**，将来源设为 **GitHub Actions**。在 **Actions** 里手动运行 **Deploy Music Atlas to GitHub Pages**，选择音乐版所在分支。工作流只上传 `dist/`，站点使用相对路径，支持项目子目录。

When authorized to publish, run `node scripts/stage_music_atlas.cjs --source` and start a fresh public repository with the contents of `source-release/`. This supplies the music edition and its corresponding source and leaves the upstream Git history in the local baseline repository. Set **Settings → Pages → Source** to **GitHub Actions** in your own GitHub repository. Run **Deploy Music Atlas to GitHub Pages** manually and choose the music branch. The workflow uploads only `dist/`. Relative asset paths support project subdirectories.

[GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
