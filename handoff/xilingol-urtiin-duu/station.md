# 小黄马 · Little Yellow Horse

## 地区与站点

- 北方 · 华北 · 内蒙古自治区锡林郭勒盟
- 地区值 `north`，站点 ID `xilingol-urtiin-duu`，认领人 A（`zyc`）。

## 曲目与课程

- 地图可用 Xiao Huangma、蒙古族长调、长调或 Urtiin Duu 检索本站。

- 蒙古族长调民歌《小黄马》 · Little Yellow Horse, a Mongolian long song.
- 课外选曲。UCUG 2500《Chinese Folk Song》第 18 页提出从旋律、节奏和语言分析民歌。这里可以听一个音节怎样承载多个音高。
- 此曲在锡林郭勒草原流传。蒙古族长调与牧民放牧、节庆和宴会有关，内蒙古申报的长调民歌于 2006 年列入首批国家级非遗名录，编号Ⅱ-3。[中国非物质文化遗产网项目档案](https://www.ihchina.cn/project_details/12410.html) · [韩晓晨，《文艺报》2021 年 11 月 12 日第 3 版](https://wyb.chinawriter.com.cn/attachment/202111/12/dcddbb7c-e150-4f55-8d1a-68b26f79e12f.pdf)

## 地点与年代

- 地图以锡林浩特代表锡林郭勒草原的流传区域。城市坐标为东经 116.07°、北纬 43.93°，来源为中国地名研究所。[联合国地名专家组城市记录](https://ungegn.un.org/dashboard/cities/details?id=2454)
- 时间轴标在 2019 年（现代，`prc`），对应央视网于 3 月 29 日公开这段表演。传统曲调形成年代、本场录制日期与录制地点待核。[央视片段原页](https://tv.cctv.com/2019/03/29/VIDEoiB8iIVnNxKobV0uHXxt190329.shtml)

## 实际播放版本

- 央视综艺频道《回声嘹亮》。王宏伟演唱，蒙根演奏马头琴。原片约 00:16 的口播介绍琴手，约 00:29 的片头字幕列出两人及分工。[试听原页](https://tv.cctv.com/2019/03/29/VIDEoiB8iIVnNxKobV0uHXxt190329.shtml)
- 央视片段全长 02:42。站内选播原片 00:28–02:42，从访谈后的马头琴引子开始。
- PID 为 `2c5bab71641c42e8b204ea5fca73aa5a`。核对原页内的 `guid` 后请求央视接口，返回同名节目、`video.totalLength = 162.00` 及 HTTPS `hls_url`。[央视视频接口](https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=2c5bab71641c42e8b204ea5fca73aa5a)

## 使用与署名

- 站内播放器调用央视公开节目流，并提供央视原页入口。引用署名为「央视《回声嘹亮》· 王宏伟演唱、蒙根演奏马头琴」。
- 英文署名为 “CCTV · Wang Hongwei (voice), Menggen (morin khuur)”。节目版权归原权利人，仓库仅保存播放标识和来源。

## 中英卡片与核验

- 中文卡片 · 王宏伟在 2013 年的访谈中提到，他曾反复向蒙古族歌手请教，才慢慢学会长音里细小的颤动。听这版《小黄马》时，可以先跟着歌声哼一遍，再把注意力转到两句之间的琴声。[中国之声《中国大舞台》访谈实录](https://www.cnr.cn/zgzb/zgdwt64/wzsl/)
- English card · Wang Hongwei recalled learning from Mongolian singers how to shape the small turns in a held note. Listen once for the voice, then follow Menggen’s fiddle in the spaces between the phrases.
- 听前问题 · 选一个被拉长的音节。歌手还在唱同一个字时，你能听见旋律转了几次弯？
- Listening question · Pick a sustained syllable. How many turns in the melody can you hear before the singer moves on to the next syllable?
- 2026 年 11 月 26 日核验。HLS 主清单和子清单均返回 `#EXTM3U`，首个 TS 分片可读取。FFmpeg 完整解码出 48 kHz 双声道 AAC 音轨，峰值 −4.9 dB。
- 桌面复测 · 在本地地图选“北方”，从曲目列表打开此卡。Chrome 158 从指定的第 28 秒起播，进度走到 31.74 秒，Web Audio 抽样检出非静音信号。手机端实际出声待核。
- 第 2A 批发布目录复测 · 从地图北方列表起播，原片 28.35–30.33 秒检出非静音信号，片尾可定位并继续播放。[逐站实测表](../north-2a-verification.md)
