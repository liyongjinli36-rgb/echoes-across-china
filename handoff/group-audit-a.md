# 全组曲目、历史证据与试听来源审计

2026 年 11 月 26 日，以 `zyc` 工作区的正式数据为准。96 条曲目中 83 条配置了站内试听。逐条比对中英曲名、所选节目的标题、表演者、署名、节目原页及播放范围，发现东中部和南部有错名与选段定位问题，见下表。66 条历史证据按其自身的时间、地点与出处审阅。

| 地区 | 曲目 | 有站内媒体 | 尚无站内媒体 | 历史证据 |
| --- | ---: | ---: | ---: | ---: |
| 北方 A | 22 | 22 | 0 | 27 |
| 华东与华中 B | 34 | 24 | 10 | 18 |
| 华南与西南 C | 40 | 37 | 3 | 21 |
| 合计 | 96 | 83 | 13 | 66 |

### 需要组员处理的版本差异

| 站点 | 证据和表现 | 交接 |
| --- | --- | --- |
| B · 南音《梅花操》 | 台大演讲网原说明列「魏美慧」「賴虹綾」，当前中文为「魏美惠」「赖红绫」，英文拼音遮住了这两处同音误字。原片的四曲中《梅花操》排第四。站内起点 21:31 后的投影仍显示《冬天寒》唱词。 | 45:35 与 46:20 的投影均为第四曲第二章〈临风妍笑〉，可用 2735–2780 秒作曲内窗，再据此改听前问题及两位乐手姓名。 [台大演讲网](https://speech.ntu.edu.tw/ntuspeech/Video/id-1675) · [录像与现起点](https://www.youtube.com/watch?v=B7rDQZMqOoM&t=1291s) |
| B · 江南丝竹《中花六板》 | 发布者的视频标题为《中花六板》，说明列《浔阳夜月》《中花六板》《行街》三曲，整片 10:15。卡片称“单曲版本”，播放器从头放，可能听到前一曲。说明列七位乐手，并注明 2025 年 10 月 20 日在中央音乐学院歌剧音乐厅演出。 | B 核定第二曲的起止点。可据发布说明补演出名单与演出日期，保留录像精确日期待核。 [发布者录像](https://www.youtube.com/watch?v=J2WkQyzwSv4) |
| C · 《雨打芭蕉》 | 央视的第 1 项与四位演奏家均相符，视频接口给出整期 1,755 秒，节目单至少还有六曲。卡片写听首曲至结束，未配原片范围。直接在站内播放器移至第 10:00，进度走到 10:02.96，画面已是第 3 曲《平湖秋月》，音频仍在解码。 | 原片 00:40 仍是片头，01:10 仍有介绍。02:05–04:40 多次核看为屏显《雨打芭蕉》的四位乐手，可用 125–280 秒并复测自动截停。 [央视整期节目单](https://tv.cctv.com/2011/07/11/VIDEI19UdQjhO3vOKJLJ2uPf110711.shtml) |

### 11 月 27 日共用前端复测

黄训国《打支山歌过横排》的央视原片长 129.72 秒，卡片取 0–30 秒。初验时视频从 26.00 秒播到 34.06 秒仍在继续。主控修复后，从约 26 秒自然播放，1366、390、320 像素宽度下分别在 30.160、30.173、30.183 秒自动暂停。1.4 秒后时钟均停在原处。再次点原生播放键，三次重播均从 0.000 秒开始，随后音轨继续解码。这一项已结案。上表三首曲目的边界与人名仍由 B、C 组员确认。[央视原片](https://tv.cctv.com/2024/11/08/VIDE2xBr1Lv9VYRTcyCCVBwb241108.shtml) · [区间播放代码](../js/music-atlas.js#L826)

另两项修复也已通过。320 × 568 英文展开侧栏时，地图缩放、复位、秦朝图例及可见的课堂试听、名录、区域比较入口均能命中并触发，390 × 844 与 1366 × 768 复核通过。三个视口聚焦《小黄马》视频后，空格只控制视频播放与暂停，时间轴始终未启动。窄屏英文工具栏末端的裁切量与各项实测数据见[第三轮验收记录](north-3-acceptance.md)。

### 其他署名与版本说明

**署名待核。** 拉萨藏戏的申报片由 UNESCO 频道发布，片段中的表演者未逐一列名。弥勒《阿细跳月》是新闻现场的集体表演，未查到个人或具名团体名单。两条均保留现有集体说明及待核状态。黎平县侗族大歌艺术团、香港中文大学馆藏的杜焕与何臣、黔西南州戏剧曲艺家协会等照原页的演出或馆藏分工记录。节目所列的学校、团体、个人加“等”各有证据，不能补成完整人员名单。[藏戏申报片](https://www.youtube.com/watch?v=zSJ_HFap6TM) · [兴义展演](https://www.ihchina.cn/video_detail/21717.html) · [香港馆藏录音](https://www.youtube.com/watch?v=bVtd6yfEVlQ)

**可以说明的差异。** 北方京韵大鼓使用骆玉笙唱与配像的《丑末寅初》。古琴《流水》的站点年份来自 1425 年琴谱，播放 2006 年 Charlie Huang 的录音。锦州东北大鼓有同城史料与单独的西城派节目入口，站内听冷依阳的复州《咏二十四节气》。莎车 2023 年村中演奏序曲的记录与 2016 年天山雪莲木卡姆乐团的电视选段已分别署名。扬州词调一站的曲文作者为姜夔，1974 年吟诵者为何叔惠。该视频的频道名为 yueculture，发布页为 yCantonese，其页面嵌入了同一视频。曲文作者、歌者、上传者和收藏单位可分开检索。[《流水》录音](https://commons.wikimedia.org/wiki/File:Liu_Shui.ogg) · [锦州站证据](jinzhou-dongbei-dagu/station.md) · [莎车站证据](shache-muqam/station.md) · [何叔惠吟诵发布页](https://ycantonese.org/%E5%A7%9C%E5%A4%94-%E6%8F%9A%E5%B7%9E%E6%85%A2-%E4%BD%95%E5%8F%94%E6%83%A0%E8%80%81%E5%B8%AB%E5%90%9F%E8%AA%A6/)

**根目录署名。** 继承的 `CREDITS.md` 将《鹧鸪飞》和《龙腾虎跃》并列为 Apple 试听。陆春龄版《鹧鸪飞》及其 Apple 曲目 ID 仍与当前数据相符。《龙腾虎跃》的陈佐辉 Apple 录音属于此前版本，当前入口改为央视《CCTV音乐厅》2023 年 5 月 2 日节目，王佳男、陈思翰、宋恩等演奏，金刚指挥。建议主控与 B、C 将现行署名与旧资料分别注明。[根目录署名](../CREDITS.md) · [陆春龄的现行 Apple 曲目](https://music.apple.com/cn/album/1888450245?i=1888450256) · [《龙腾虎跃》现行央视节目](https://tv.cctv.com/2023/05/02/VIDEeVSCzWUGzGKX2KvJ18o2230502.shtml)

### 来源库与 2006 年名录

358 个来源键均有中英标题。其中 352 个有 HTTPS 地址，另外 6 个是按课件名及页码引用的本地资料。83 个媒体入口中，79 个原页 URL 直接列在本曲的来源中。3 个 Apple Music 入口分别是《柳梦梅拾画》《三五七》《四段锦》，来源库采用单曲页、播放器采用专辑内曲目页，两端的歌曲 ID 分别同为 `1592269696`、`1632209634`、`1423190647`。何叔惠《扬州慢》余下的 1 个入口通过发布页内嵌的视频 ID `Uqowu1bjY6I` 对应。六首 Apple 以实际单曲 ID 查询不同商店的目录，五个 YouTube 视频按各自 ID 核对发布频道；节目原标题与媒体对象均可在脚本 JSON 输出中逐条复查。

三个原样相同的网址各占两个来源键，分别是 `shuoshu / timeline-shaanbei-shuoshu`、`shenqi / hist-ming-qin-score`、`zeng / hist-zhou-pitch`。每对给不同的曲目、谱本或历史证据提供出处。合并来源键会影响现有引用，本次保留原键。

`heritage2006` 是现行曲目、历史证据与 8 个事件中唯一直接引用数为零的来源键。21 个 `origins` 项保存各自的历史来源 URL，均未使用这项通知。5 组地区比较按曲目 ID 关联。920 条非遗登记按登记批次取官方来源，首批 255 条通过 `registerSources[2006]` 指向同一份国发〔2006〕18号文件。全量官方通知载有 518 项，地图的 255 条是该库收录的首批登记数据。源键随 `d97faff` 入库，北方升级前的京韵大鼓使用过这个键，B 区上传包的旧记录亦保留该引用。本轮保留此键作为首批名录出处。[国务院通知](https://www.ihchina.cn/zhengce_details/11546) · [批次与网址映射](../js/music-registry.js#L2) · [登记卡使用位置](../js/music-atlas.js#L732)

### 尚无站内媒体的 13 条课程记录

| 地区 | 课程站 | 现有入口 | 补录前需要确认 |
| --- | --- | --- | --- |
| B | `wuge` 吴歌 | 非遗网外链 | 当地具体歌目、演唱者和版本 |
| B | `hubei-hunan` 鄂湘民歌 | 无 | 对应湖北或湖南的具体地方版本 |
| B | `shandong-guchui` 山东鼓吹 | 无 | 同一地方乐队、曲名和音源 |
| B | `shifan-luogu` 楚州十番锣鼓 | 无 | 楚州版本及合奏乐段 |
| B | `jiangnan-sizhu` 江南丝竹 | 中国艺术研究院馆藏外链 | 获准的站内入口和该条所听曲目 |
| B | `orchestra` 现代民族管弦乐 | 无 | 课堂关联曲目、演出团及编配 |
| B | `nanyin` 泉州南音 | UNESCO 项目外链 | 对应曲目及演出人员 |
| B | `suzhou-pingtan` 苏州评弹 | 无 | 明确到书目、唱段和演员 |
| B | `kunqu` 昆曲 | UNESCO 项目外链 | 确认剧目、折子及出演者 |
| B | `zeng-bells` 曾侯乙编钟 | 史密森学会资料外链 | 区分文物实测声、复制品演奏或现代编配 |
| C | `cantonese-tunes` 粤语小调 | 无 | 确定地方曲调与领唱者 |
| C | `guzheng` 古筝 | 无 | 确定琴曲和具体演奏版本 |
| C | `guangdong-music` 广东音乐 | 无 | 选定明确的乐队及曲目 |

其中 5 站已有外部资料入口，另外 8 站无独立试听或观看链接。有可听实例的同区曲目保留独立 ID，不能直接当成这些课程总类各自的版本。66 条历史证据使用文物、图像或文献的实际断代与地点，不计入这 13 条。

### 复跑与阅读逐条记录

在仓库根目录运行下列命令。默认模式读取本地数据；网络模式另外请求央视原页及视频接口、Apple 单曲目录、YouTube oEmbed、Commons 和非遗原页。它核对元数据和来源 ID。媒体分片、移动设备出声与平台预览是否受地区限制属于另外的播放测试。[审计脚本](../scripts/audit_group_music.cjs) · [北方 2B 播放实测](north-2b-verification.md)

```sh
node scripts/audit_group_music.cjs
node scripts/audit_group_music.cjs --online --json
```

11 月 26 日的联网审计返回 0 个结构问题，83/83 取得平台元数据。69 个央视标识与各自节目原页一致，6 个 Apple 曲目及 5 个 YouTube 视频有平台目录记录，2 个本地文件有 Commons 来源与许可，1 个在线视频有非遗网原页。节目边界和同音误署另见上方差异表。在线结果记录原始片名和目录署名，中英对照与误署结论据原页、字幕、节目单和馆藏说明人工判读；自动字串命中仅供检索。

### 北方 22 站逐条对照

| 站点 ID 与原页 | 试听标题（中 / 英） | 所选版本当前署名（中 / 英） | 原片范围或复核事项 |
| --- | --- | --- | --- |
| [xintianyou](https://tv.cctv.com/2021/04/12/VIDEYNX1lC9urqQHClWURxus210412.shtml) | 周彬唱信天游《赶牲灵》 / Gan Shengling, a xintianyou sung by Zhou Bin | 周彬（演唱） / Zhou Bin (voice) | 8–42 秒；课程体裁，实播《赶牲灵》 |
| [hebei-flower](https://tv.cctv.com/2024/05/18/VIDEZGAgGS7G7pZcwxdmUd5y240518.shtml) | 河北民歌《对花》 / Dui Hua (A Dialogue on Flowers), a Hebei folk song | 王雯、吴治鹏（演唱） / Wang Wen and Wu Zhipeng (voices) | 8–59 秒；课程用区域名称，实播河北《对花》 |
| [guqin](https://commons.wikimedia.org/wiki/File:Liu_Shui.ogg) | 《流水》· 2006年录音 / Flowing Water · 2006 recording | Charlie Huang / Charlie Huang | 本地整段 8:13.11，1425 年琴谱与 2006 年录音分开 |
| [pipa](https://tv.cctv.com/2018/07/18/VIDEbFsrKlDmWX9gjhfyr2G4180718.shtml) | 《郁轮袍》选段 / Yulunpao (excerpt) | 任畅（琵琶）、徐浪潮（打击乐） / Ren Chang (pipa) and Xu Langchao (percussion) | 3090–3230 秒；整期第 13 项，任畅、徐浪潮现场 |
| [kuaiban](https://tv.cctv.com/2018/08/24/VIDE2AfHelihkzMMlZe7r9VZ180824.shtml) | 李少杰说快板书《看病》 / Seeing the Doctor · Li-school clapper storytelling | 李少杰 / Li Shaojie | 0–183 秒 |
| [jingyun-dagu](https://tv.cctv.com/2017/03/25/VIDEpD4DaEI14FKEuui1zYbL170325.shtml) | 骆玉笙唱《丑末寅初》 / Chou Mo Yin Chu, sung by Luo Yusheng | 骆玉笙（演唱、配像） / Luo Yusheng (voice and on-screen performance) | 0–537 秒；骆玉笙 1988 年录音，由本人配像 |
| [shaanbei-shuoshu](https://tv.cctv.com/2024/12/25/VIDEsEbeoFLFgdzNuqbKT4zw241225.shtml) | 熊竹英陕北说书《大闹天宫》 / Havoc in Heaven, performed by Xiong Zhuying | 熊竹英（说唱、三弦） / Xiong Zhuying (story-singing and sanxian) | 9–47 秒 |
| [peking-opera](https://tv.cctv.com/2024/10/13/VIDEfvo0NmNIuVb8bWQL3Bg5241013.shtml) | 《空城计》选段 · 我本是卧龙岗散淡的人 / The Empty City Stratagem · I Was a Recluse at Wolong Ridge | 谭孝曾（演唱）、赵旭（京胡）、刘洋（司鼓） / Tan Xiaozeng (voice), Zhao Xu (jinghu) and Liu Yang (drum) | 0–360.44 秒 |
| [xilingol-urtiin-duu](https://tv.cctv.com/2019/03/29/VIDEoiB8iIVnNxKobV0uHXxt190329.shtml) | 《小黄马》· 人声与马头琴 / Little Yellow Horse · voice and morin khuur | 王宏伟（演唱）、蒙根（马头琴） / Wang Hongwei (voice) and Menggen (morin khuur) | 28–162 秒 |
| [raohe-deng-age](https://tv.cctv.com/2026/01/30/VIDEr86akkg2dxM9bWfGmmrT260130.shtml) | 狩猎的哥哥回来了 / The Hunter Has Returned | 李萃琳 / Li Cuilin | 0–170.84 秒 |
| [lishu-errenzhuan](https://tv.cctv.com/2024/11/12/VIDEwzToLSx3QymPOU30aGvU241112.shtml) | 杨八姐游春 / Eighth Sister Yang’s Spring Outing | 董孝芳、郑淑云 / Dong Xiaofang and Zheng Shuyun | 95–250 秒 |
| [jinzhou-dongbei-dagu](https://tv.cctv.com/2018/09/01/VIDE10wJJBDLwlHFDKOwZI3Q180901.shtml) | 复州东北大鼓《咏二十四节气》 / A Song of the Twenty-Four Solar Terms (Fuzhou drum storytelling) | 冷依阳 / Leng Yiyang | 0–223 秒；地图标锦州，播放器为复州版，有同城对照入口 |
| [tianjin-shidiao](https://tv.cctv.com/2021/03/27/VIDEFPyqvnGa46Ujrv9v4F8R210327.shtml) | 《放风筝》· 王毓宝演唱 / Flying a Kite · Wang Yubao | 王毓宝（演唱），韩利祥、张玉恒、王桂玲、于宝树、刘小凯（伴奏） / Wang Yubao (voice), with Han Lixiang, Zhang Yuheng, Wang Guiling, Yu Baoshu and Liu Xiaokai (accompaniment) | 30–65 秒 |
| [laoting-dagu](https://tv.cctv.com/2025/02/12/VIDEDlZynq8NFcLJslDM1KQb250212.shtml) | 乐亭大鼓《双锁山》选段 · 何建春、赵予淇等 / Double Lock Mountain · He Jianchun, Zhao Yuqi and fellow performers | 何建春、赵予淇等（表演） / He Jianchun, Zhao Yuqi and fellow performers | 7–55 秒 |
| [zuoquan-kaihua-diao](https://tv.cctv.com/2025/01/13/VIDEsTEzkUDrtWNqPQwzOt1I250113.shtml) | 《桃花红杏花白》· 刘改鱼演唱 / Red Peach Blossoms, White Apricot Blossoms · Liu Gaiyu | 刘改鱼（演唱） / Liu Gaiyu (voice) | 4–50 秒 |
| [xinjiang-jiangzhou-guyue](https://tv.cctv.com/2025/04/22/VIDEUxRh1BHec36LQyNurISe250422.shtml) | 绛州鼓乐《秦王点兵》 / Jiangzhou drums · The Prince of Qin Musters His Troops | 山西绛州鼓乐艺术团 / Shanxi Jiangzhou Drum Ensemble | 26–72 秒 |
| [xian-qinqiang](https://tv.cctv.com/2013/10/30/VIDE1383101660206710.shtml) | 《结盟》· 祖籍陕西韩城县 / The Pact · My Family Comes from Hancheng in Shaanxi | 西安易俗社 · 陈超武饰李遇春，李东峰饰周天佑 / Xi’an Yisushe · Chen Chaowu as Li Yuchun and Li Dongfeng as Zhou Tianyou | 128–202 秒 |
| [kangle-lianhuashan-huaer](https://tv.cctv.com/2020/05/10/VIDEN0w8aSd7QRYG7wU9Mg7v200510.shtml) | 一年一趟莲花山 / Once a Year to Lianhua Mountain | 文香莲 / Wen Xianglian | 181–198 秒；纪录片中的示范及解说，具体曲令待核 |
| [datong-laoyeshan-huaer](https://tv.cctv.com/2016/10/02/VIDEfKOjMBfofPQANNONlmm6161002.shtml) | 雪白的鸽子 / Snow-White Doves | 吴玉兰、索南孙斌 / Wu Yulan and Suonan Sunbin | 0–107 秒 |
| [guyuan-shan-huaer](https://tv.cctv.com/2025/06/28/VIDE1L2nXfGfD3D4osKoITpt250628.shtml) | 眼泪花儿把心淹了 / Tears Flood My Heart | 马慧茹 / Ma Huiru | 0–183.16 秒 |
| [shache-muqam](https://tv.cctv.com/2016/12/02/VIDEOLpuCdBhIY8Zj7cFaefk161202.shtml) | 《纳瓦木卡姆选段》· 天山雪莲木卡姆乐团 / Nawa Muqam excerpt · Tianshan Snow Lotus Muqam Ensemble | 天山雪莲木卡姆乐团 / Tianshan Snow Lotus Muqam Ensemble | 3681–3850 秒；央视第 15 项。与村中演奏序曲分开 |
| [ili-dombra](https://tv.cctv.com/2011/03/29/VIDEJoOuBP6eUbaSUtXvnxkF110329.shtml) | 《哈拉角勒哈》· 哈萨克族民间舞曲器乐合奏 / Kara Jorga · Kazakh dance tune in an instrumental arrangement | 吐尔逊江、顾新生、库尔曼江、阿娜尔等 / Tuerxunjiang, Gu Xinsheng, Kuermanjiang, Anaer and others | 983–1060 秒；央视第 6 项；片名异译、多人合奏 |

### 华东与华中 24 站逐条对照

| 站点 ID 与原页 | 试听标题（中 / 英） | 所选版本当前署名（中 / 英） | 原片范围或复核事项 |
| --- | --- | --- | --- |
| [dizi](https://music.apple.com/cn/album/1888450245?i=1888450256) | 鹧鸪飞 / Flying Partridges | 陆春龄 / Lu Chunling | 平台固定预览 |
| [erquan-yingyue](https://commons.wikimedia.org/wiki/File:二泉映月.ogg) | 二泉映月 / Moon Reflected on Second Spring | 张沛坚 / Zhang Peijian | 12–39.9 秒；本地截段，张沛坚演奏。阿炳是历史人物 |
| [liuhe-molihua](https://tv.cctv.com/2022/10/05/VIDE08mNHiZq41Qjev7M6TA7221005.shtml) | 茉莉花（江苏民歌） / Jasmine Flower (Jiangsu version) | 李娜 / Li Na | 0–197.48 秒 |
| [jiangnan-zhonghua-liuban](https://www.youtube.com/watch?v=J2WkQyzwSv4) | 中花六板 / Zhonghua Liuban | 日内瓦高等音乐学院相关项目的丝竹合奏团 / Silk and Bamboo Ensemble, HEM Geneva project | 10:15，发布说明列三曲，视频从头播放，目标曲的起止待核 |
| [mudanting-youyuan](https://tv.cctv.com/2019/11/14/VIDEIj5avldRfzedfSczu4ym191114.shtml) | 牡丹亭·游园 / The Peony Pavilion: A Stroll in the Garden | 赵秀君（杜丽娘）、王竹馨（春香） / Zhao Xiujun as Du Liniang and Wang Zhuxin as Chunxiang | 994–1022 秒 |
| [liumengmei-shihua](https://music.apple.com/cn/album/1592269694?i=1592269696) | 柳梦梅拾画（弹词开篇） / Liu Mengmei Finds the Portrait (tanci opening ballad) | 高博文 / Gao Bowen | 平台固定预览 |
| [yangzhou-jiang-kui-yangzhou-man](https://www.youtube.com/watch?v=Uqowu1bjY6I&t=80s) | 姜夔《扬州慢》（何叔惠吟诵） / Yangzhou Man (Slow Tune of Yangzhou), chanted by Ho Shuk-wai | 何叔惠 / Ho Shuk-wai | 80–110 秒；yCantonese 发布页嵌入同一个视频；yueculture 是频道名 |
| [yueju-shiba-xiangsong](https://tv.cctv.com/2018/08/16/VIDESYlOVxiuqMHUhambOcuV180816.shtml) | 《梁山伯与祝英台》选段《十八相送》 / The Butterfly Lovers: The Eighteen Li Farewell | 陶慧敏、白雪 / Tao Huimin and Bai Xue | 0–100 秒 |
| [dongyang-san-wu-qi](https://music.apple.com/cn/album/1632209632?i=1632209634) | 《三五七》 / Three, Five, Seven (San Wu Qi) | 蒋国基 / Jiang Guoji | 平台固定预览 |
| [huangmei-tianxianpei](https://tv.cctv.com/2019/06/30/VIDERUZVI8osmJr6YUVUniQV190630.shtml) | 《天仙配》选段《夫妻双双把家还》 / The Heavenly Match: Husband and Wife Return Home | 张春丰、王超 / Zhang Chunfeng and Wang Chao | 0–109 秒 |
| [fengyang-huagu](https://tv.cctv.com/2024/03/19/VIDE8koGeRgnorDN0zOPAlNP240319.shtml) | 《凤阳花鼓》 / Fengyang Flower Drum | 王雯 / Wang Wen | 0–70.12 秒 |
| [bainiao-guichao](https://tv.cctv.com/2025/04/05/VIDEfKvpgEhkmfi2rWp2xbtc250405.shtml) | 百鸟归巢 / A Hundred Birds Return to the Nest | 泉州南音乐团 / Quanzhou Nanyin Ensemble | 35–60 秒 |
| [nanyin-meihuacao](https://www.youtube.com/watch?v=B7rDQZMqOoM&t=1291s) | 梅花操 / Plum Blossom Melody | 叶圭安、魏美惠、赖红绫、陈家琦、卢盈妤 / Ye Gui’an, Wei Meihui, Lai Hongling, Chen Jiaqi and Lu Yingyu | 设起点 21:31，实际为《冬天寒》。两人姓名应为魏美慧、赖虹绫 |
| [xingguo-da-zhi-shange](https://tv.cctv.com/2024/11/08/VIDE2xBr1Lv9VYRTcyCCVBwb241108.shtml) | 《打支山歌过横排》 / A Mountain Song Across the Ridge | 黄训国 / Huang Xunguo | 0–30 秒选段。11 月 27 日在三个视口实测自动截停，再点播放从 0 秒重播 |
| [shicheng-dao-caicha](https://music.apple.com/us/album/1608560212?i=1608562479) | 《倒采茶》 / Tea Picking in Reverse Order | 黄玉英、熊家源 / Huang Yuying and Xiong Jiayuan | 平台固定预览 |
| [bainiao-chaofeng](https://tv.cctv.com/2022/07/04/VIDEiFwvqZTD0FimFqkpYmIy220704.shtml) | 百鸟朝凤 / A Hundred Birds Paying Homage to the Phoenix | 刘西站（唢呐），于帆指挥中国歌剧舞剧院民族乐团 / Liu Xizhan, suona, with the China National Opera and Dance Drama Theater Chinese Orchestra, conducted by Yu Fan | 193–220 秒 |
| [yuncheng-siduanjin](https://music.apple.com/cn/album/1423189840?i=1423190647) | 四段锦 / Four Sections of Brocade | 赵玉斋（古筝） / Zhao Yuzhai, guzheng | 平台固定预览 |
| [gongyi-yuju-hua-mulan](https://tv.cctv.com/2024/04/14/VIDEOmM2kb65Bbyy25YAdicN240414.shtml) | 《花木兰》选段《谁说女子不如男》 / Who Says Women Are Inferior to Men? (from Hua Mulan) | 常香玉（饰花木兰） / Chang Xiangyu as Hua Mulan | 440–470 秒 |
| [dengzhou-naoyuanxiao](https://music.apple.com/cn/album/1648399997?i=1648400362) | 闹元宵 / Lantern Festival Revelry | 周望（古筝） / Zhou Wang, guzheng | 平台固定预览 |
| [lichuan-longchuan-diao](https://tv.cctv.com/2024/04/15/VIDEMYiJoukkhTv5r8Yj2EOe240415.shtml) | 龙船调 / Dragon Boat Tune | 王陈娜、叶思言 / Wang Chenna and Ye Siyan | 0–215.16 秒 |
| [suizhou-chu-shang](https://tv.cctv.com/2024/10/01/VIDEKhgBcZtmKb2PxX4IQNsX241001.shtml) | 编钟《楚商》 / Chu Shang for Chime Bells | 武汉音乐学院青年编钟乐团 / Youth Chime Bell Ensemble, Wuhan Conservatory of Music | 80–110 秒 |
| [honghu-waves](https://tv.cctv.com/2024/01/11/VIDEl5ErHxZzi9wmfvVEnsZk240111.shtml) | 洪湖水·浪打浪 / Waves on Honghu Lake | 陈涓、特伦 / Chen Juan and Telun | 0–166.44 秒 |
| [changde-liuhai-kanqiao](https://tv.cctv.com/2009/11/11/VIDE1355602683051278.shtml) | 花鼓戏《刘海砍樵》 / Liu Hai Cuts Firewood | 李谷一、姜昆 / Li Guyi and Jiang Kun | 0–166 秒 |
| [sangzhi-masang-dengtai](https://tv.cctv.com/2021/07/07/VIDEL41qYYctNDxseHR7R0DD210707.shtml) | 马桑树儿搭灯台 / A Lantern Stand on the Masang Tree | 刘一祯 / Liu Yizhen | 0–171.56 秒 |

### 华南与西南 37 站逐条对照

| 站点 ID 与原页 | 试听标题（中 / 英） | 所选版本当前署名（中 / 英） | 原片范围或复核事项 |
| --- | --- | --- | --- |
| [dragon-drum](https://tv.cctv.com/2023/05/02/VIDEeVSCzWUGzGKX2KvJ18o2230502.shtml) | 《龙腾虎跃》鼓乐合奏试听 / Dragon Soaring, Tiger Leaping · drum ensemble preview | 王佳男、陈思翰、宋恩、奚国影、冯璐等 / Wang Jianan, Chen Sihan, Song En, Xi Guoying, Feng Lu and ensemble | 0–471.16 秒；央视排鼓与大鼓等合奏，根目录旧 Apple 署名待区分 |
| [panyu-yu-da-bajiao](https://tv.cctv.com/2011/07/11/VIDEI19UdQjhO3vOKJLJ2uPf110711.shtml) | 雨打芭蕉 / Rain on the Plantain Leaves | 姜克美、李玲玲、吴玉霞、陈莎莎 / Jiang Kemei, Li Lingling, Wu Yuxia and Chen Shasha | 当前播放全期 29:15，四人只属首曲 |
| [chaozhou-hanya-xishui](https://tv.cctv.com/2026/06/04/VIDEvt90iuFir6C63hNUJNOP260604.shtml) | 寒鸦戏水 / Jackdaws Playing in the Water | 王宁 / Wang Ning | 0–222.84 秒 |
| [zhongshan-luo-yu-da](https://tv.cctv.com/2016/10/08/VIDEIAHJkL53H88OL62U6Vtt161008.shtml) | 落雨大 / Heavy Rain | 中山市东升镇胜龙小学、北京市回龙观小学 / Shenglong Primary School, Zhongshan, and Huilongguan Primary School, Beijing | 0–135 秒 |
| [zhongshan-song-lang](https://tv.cctv.com/2016/10/08/VIDE1Sa0EIHD4nxxO13XCFMW161008.shtml) | 送郎一条花手巾 / A Flowered Handkerchief for My Love | 周炎敏 / Zhou Yanmin | 0–48 秒 |
| [liuzhou-shange-chunjiang](https://tv.cctv.com/2016/10/04/VIDETZ05wHXUOvGJHAU76Pzk161004.shtml) | 山歌好比春江水 / Mountain Songs Flow Like a Spring River | 黄春燕、韦心妍 / Huang Chunyan and Wei Xinyan | 0–115 秒 |
| [danzhou-bayue-shiwu](https://tv.cctv.com/2016/10/08/VIDE3tOSmbyQxFR4YmY3zKDs161008.shtml) | 八月十五月光影 / Moonlight on the Fifteenth of the Eighth Month | 儋州市星星歌友会、儋州市原生态调声队 / Danzhou Xingxing Song Club and Danzhou Traditional Diaosheng Team | 0–54 秒 |
| [qiongzhong-wuzhishan-ge](https://tv.cctv.com/2016/10/08/VIDEyndJYj2Jnc0TMV5pmc1x161008.shtml) | 五指山歌 / Song of Wuzhi Mountain | 黄宝培、董建忠 / Huang Baopei and Dong Jianzhong | 0–140 秒 |
| [liping-shieryue-laodong](https://tv.cctv.com/2016/10/07/VIDEA4H1uKrVpKMmjYRuaqdg161007.shtml) | 十二月劳动歌 / Work Song of the Twelve Months | 贵州省黎平县侗族大歌艺术团 / Liping Dong Grand Song Art Troupe, Guizhou | 0–152 秒 |
| [midu-xiaohe](https://tv.cctv.com/2024/01/06/VIDE03h0ldQhzLX5Ree5NQXG240106.shtml) | 小河淌水 / A Little River Flows | 吕薇、张英席、杨一方、应忆俊 / Lü Wei, Zhang Yingxi, Yang Yifang and Ying Yijun | 0–104.12 秒 |
| [shiping-haicaiqiang](https://tv.cctv.com/2016/10/04/VIDEJoU1Ja3nLRAIFTLOKX4C161004.shtml) | 打歌与海菜腔 / Dage and Haicaiqiang | 高洪章等 / Gao Hongzhang and other performers | 0–233 秒 |
| [ruili-fengweizhu](https://tv.cctv.com/2022/10/04/VIDEC2GRwhxryvwVv1Gef4K0221004.shtml) | 月光下的凤尾竹 / Phoenix-Tail Bamboo in the Moonlight | 谢军，黄屹指挥，昆明聂耳交响乐团 / Xie Jun with the Kunming Nie Er Symphony Orchestra, conducted by Huang Yi | 0–226.2 秒 |
| [kangding-qingge](https://tv.cctv.com/2016/10/03/VIDE41HpxDQCOrT6j5XTZEGP161003.shtml) | 康定情歌 / Kangding Love Song | 云朵、雨禾 / Yun Duo and Yu He | 0–110 秒 |
| [chengdu-chuanju-qiujiang](https://tv.cctv.com/2011/11/07/VIDERHn5TCHSbtPlFeZGlvxE111107.shtml) | 川剧《秋江》选段 / Autumn River · Sichuan opera excerpt | 刘萍 / Liu Ping | 0–107 秒 |
| [chongqing-qifu-rao](https://tv.cctv.com/2025/02/01/VIDEN6HVSpBdp4KStbYm4Mx2250201.shtml) | 川江号子《起伏桡》选段 / Qifu Rao · Chuanjiang boatmen’s chant | 曹光裕 / Cao Guangyu | 0–26.92 秒 |
| [dongxing-zai-shui-yifang](https://tv.cctv.com/2020/10/01/VIDEoc2cuo7hO55syhYK1BGn201001.shtml) | 在水一方·独弦琴 / On the Far Side of the Water · Monochord | 雷滢演奏、郭明黎朗诵 / Lei Ying, monochord, and Guo Mingli, recitation | 0–177.64 秒 |
| [hong-kong-dinu-hua](https://tv.cctv.com/2022/08/05/VIDEtrUDf0ADJ353y0DOJ7Ym220805.shtml) | 粤剧《帝女花》片段 / Princess Changping · Cantonese opera excerpt | 曾小敏、刘建科 / Zeng Xiaomin and Liu Jianke | 0–323.2 秒 |
| [macau-guia-lighthouse](https://tv.cctv.com/2020/02/06/VIDEpFoPecIcegVuB6m6ZASn200206.shtml) | 东望洋灯塔的守望 / The Vigil of Guia Lighthouse | 巫少雄、缪晓铮、陈焕明、邓伟标 / Wu Shaoxiong, Miao Xiaozheng, Chen Huanming and Deng Weibiao | 0–218 秒 |
| [lhasa-tibetan-opera](https://www.youtube.com/watch?v=zSJ_HFap6TM) | 藏戏表演选段 / Tibetan Opera · Performance excerpts | 申报片中的藏戏表演者，原页未逐一署名 / Tibetan opera performers in the nomination film, individually uncredited | UNESCO 申报片，逐段演员待核 |
| [chengdu-xiao-fangfengzheng](https://tv.cctv.com/2024/08/11/VIDEKldwh2vDs3nfc0mNxMie240811.shtml) | 小放风筝 / Flying a Kite | 梁家碧 / Liang Jiabi | 0–225.4 秒 |
| [shawan-sailong-duojin](https://tv.cctv.com/2020/01/21/VIDEfN6dAPEVLHKWbZjszbAv200121.shtml) | 赛龙夺锦 / Dragon Boat Race | 李复斌指挥、珠海民族管弦乐团 / Zhuhai Chinese Orchestra, conducted by Li Fubin | 0–419 秒 |
| [zhuhai-hantianlei](https://tv.cctv.com/2020/01/21/VIDEihvFKOVhQDyuNUrjqYJF200121.shtml) | 旱天雷 / Thunder in the Dry Season | 李复斌指挥、珠海民族管弦乐团 / Zhuhai Chinese Orchestra, conducted by Li Fubin | 0–176 秒 |
| [zhongshan-pinghu-qiuyue](https://tv.cctv.com/2021/06/25/VIDEW1jS95shESlMzjDQKssY210625.shtml) | 平湖秋月 / Autumn Moon over a Calm Lake | 于川、高冠琳、孙莹、尚靖雅 / Yu Chuan, Gao Guanlin, Sun Ying and Shang Jingya | 0–268.36 秒 |
| [qionghai-wanquanhe](https://tv.cctv.com/2016/10/08/VIDEeMDPUPfDlGeeAVHL0eLA161008.shtml) | 万泉河水清又清 / Clear Waters of the Wanquan River | 黄宝培、董建忠 / Huang Baopei and Dong Jianzhong | 0–108 秒 |
| [xingyi-junmin-tong-angyang](https://www.ihchina.cn/video_detail/21717.html) | 军民同昂央 / Junmin Tong Angyang | 黔西南州戏剧曲艺家协会 / Qianxinan Theatre and Quyi Artists Association | 中国非遗网明列演出单位，光明网 MP4 |
| [dali-pangxie-diao](https://tv.cctv.com/2026/01/12/VIDE5LdW6HVPvSwHM1R1F3oA260112.shtml) | 螃蟹调 / Crab Tune | 杨承晨、王京等 / Yang Chengchen, Wang Jing and fellow performers | 0–106.68 秒 |
| [nanning-xin-liusanjie](https://tv.cctv.com/2021/01/01/VIDE1sS39EQEy7S4tsKAK9jT210101.shtml) | 彩调剧《新刘三姐》选段 / New Liu Sanjie · Caidiao opera excerpt | 黄婉秋、陈慧、王朔 / Huang Wanqiu, Chen Hui and Wang Shuo | 0–228.12 秒 |
| [shizhu-taiyang-chulai](https://tv.cctv.com/2026/07/03/VIDEjQmMeUJJSM5xOmy0frtc260703.shtml) | 太阳出来喜洋洋 / The Sun Comes Out and We Rejoice | 唐翰章、谭翼林 / Tang Hanzhang and Tan Yilin | 0–153.8 秒 |
| [fuchuan-yaozu-hudiege](https://tv.cctv.com/2021/06/14/VIDEbwYiyVdxEMA4rWaG2Vdg210614.shtml) | 瑶族蝴蝶歌 / Yao Butterfly Song | 富川瑶族自治县文化馆瑶族蝴蝶歌歌队 / Yao Butterfly Song Ensemble of Fuchuan Cultural Centre | 0–71.92 秒 |
| [hong-kong-ketu-qiuhen](https://www.youtube.com/watch?v=bVtd6yfEVlQ) | 客途秋恨 / Autumn Regrets on a Journey | 杜焕演唱、何臣拍和 / Dou Wun, vocals, accompanied by Ho San | 原片全段，听辨建议见卡 |
| [qiandongnan-miaoling-zaocheng](https://tv.cctv.com/2022/10/01/VIDEEHLa6fe5ONBSa0k9Hl61221001.shtml) | 苗岭的早晨 / Morning in the Miao Mountains | 唐俊乔、余隆指挥的中国爱乐乐团 / Tang Junqiao with the China Philharmonic Orchestra, conducted by Long Yu | 0–207.64 秒 |
| [lazi-duixie-qingzang-gaoyuan](https://tv.cctv.com/2026/02/20/VIDEhSm8PPlIi6lcPzeveq5L260220.shtml) | 《青藏高原》中的拉孜堆谐 / Lhatse Duixie in Qinghai–Tibet Plateau | 丁青县艺术团、拉孜县艺术团等 / Dengqen and Lhatse county arts troupes and other performers | 0–248.28 秒 |
| [dali-hudie-quanbian](https://tv.cctv.com/2016/10/06/VIDEWnGzDugF9e0B2SwYVZmT161006.shtml) | 蝴蝶泉边 / By the Butterfly Spring | 李兆元等 / Li Zhaoyuan and fellow performers | 0–92 秒 |
| [mile-axi-tiaoyue](https://tv.cctv.com/2015/08/10/VIDE1439164914752389.shtml) | 阿细跳月 / Axi Moon Dance | 弥勒集体表演者 / Local group performers in Mile | 0–72 秒；新闻现场，个体或具名团体待核 |
| [chengdu-chuanju-bianlian](https://tv.cctv.com/2021/01/31/VIDEBt9C5aI2QmnuGRRWmOb7210131.shtml) | 川剧变脸 / Sichuan Opera Face Changing | 刘书源、邵兰舒 / Liu Shuyuan and Shao Lanshu | 0–183.2 秒 |
| [guangzhou-niao-tou-lin](https://tv.cctv.com/2022/06/05/VIDEura2lChHAo5INhAHmSRb220605.shtml) | 鸟投林 / Birds Returning to the Grove | 余乐夫，吴迪、李志成、郎平、童绍民伴奏 / Yu Lefu with Wu Di, Li Zhicheng, Lang Ping and Tong Shaomin | 0–245.84 秒 |
| [fuchuan-liushui-huange](https://tv.cctv.com/2026/01/25/VIDEUDQX4YozTUySf68mf5Gi260125.shtml) | 流水欢歌迎客来 / Water and Song Welcome the Guests | 梢丽组合 / Shaoli Group | 0–144.52 秒 |
