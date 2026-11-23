"""Generate the course's registry index from downloaded State Council HTML tables.

Usage: python3 scripts/import_music_register.py /directory/with/atlas-ich-YEAR.html
Inputs: the four atlas-ich-YEAR.html notices and atlas-ich-gazette.pdf.
Build dependencies: Beautiful Soup, PyMuPDF and macOS Swift for romanization.
The website runs entirely from the checked-in index.
"""
import collections
import json
import pathlib
import re
import subprocess
import sys
import unicodedata
from bs4 import BeautifulSoup

YEARS = (2006, 2008, 2011, 2014, 2021)
REGIONS = [
    ('北京','Beijing',116.40,39.90),('天津','Tianjin',117.20,39.13),
    ('河北','Hebei',115.48,38.87),('山西','Shanxi',112.55,37.87),
    ('内蒙古','Inner Mongolia',111.75,40.84),('辽宁','Liaoning',123.43,41.80),
    ('吉林','Jilin',125.32,43.90),('黑龙江','Heilongjiang',126.65,45.75),
    ('上海','Shanghai',121.47,31.23),('江苏','Jiangsu',118.79,32.06),
    ('浙江','Zhejiang',120.15,30.27),('安徽','Anhui',117.23,31.82),
    ('福建','Fujian',119.30,26.08),('江西','Jiangxi',115.86,28.68),
    ('山东','Shandong',117.00,36.66),('河南','Henan',113.63,34.75),
    ('湖北','Hubei',114.30,30.59),('湖南','Hunan',112.93,28.23),
    ('广东','Guangdong',113.26,23.13),('广西','Guangxi',108.32,22.82),
    ('海南','Hainan',110.32,20.04),('重庆','Chongqing',106.55,29.56),
    ('四川','Sichuan',104.07,30.67),('贵州','Guizhou',106.63,26.65),
    ('云南','Yunnan',102.71,25.04),('西藏','Tibet',91.13,29.66),
    ('陕西','Shaanxi',108.94,34.34),('甘肃','Gansu',103.82,36.06),
    ('青海','Qinghai',101.78,36.62),('宁夏','Ningxia',106.23,38.49),
    ('新疆','Xinjiang',87.62,43.83),('香港','Hong Kong',114.17,22.32),
    ('澳门','Macao',113.55,22.20),
]
PROVINCE = re.compile(r'(?<![\u4e00-\u9fff])(' + '|'.join(r[0] for r in REGIONS) + r')')
CODE = re.compile(r'(I|II|III|IV|V|VIII)\s*[-—－–]\s*(\d+)')
EPICS = re.compile(r'苗族古歌|玛纳斯|江格尔|格萨.?斯.?尔|撒叶儿嗬|盘王大歌|哭嫁歌|古歌|史诗')
INSTRUMENT_CRAFT = re.compile(r'乐器制作|古琴斫|古琴制|制琴|二胡制作|笛箫制作|鼓制作|锣制作|铜锣制作|古筝制作|唢呐制作')
KNOWN = {
    '昆曲':'Kunqu Opera','京剧':'Peking Opera','越剧':'Yue Opera','豫剧':'Henan Opera',
    '粤剧':'Cantonese Opera','黄梅戏':'Huangmei Opera','川剧':'Sichuan Opera',
    '秦腔':'Qinqiang Opera','评剧':'Pingju Opera','木偶戏':'Puppetry','皮影戏':'Shadow Theatre',
    '江南丝竹':'Jiangnan Sizhu','广东音乐':'Guangdong Music','南音':'Nanyin',
    '侗族大歌':'Grand Song of the Dong','古琴艺术':'Guqin Music','唢呐艺术':'Suona Music',
    '古筝艺术':'Guzheng Music','琵琶艺术':'Pipa Music','花儿':'Hua’er Folk Songs',
    '蒙古族长调民歌':'Mongolian Long Song','蒙古族呼麦':'Mongolian Khoomei',
    '京韵大鼓':'Jingyun Dagu','苏州评弹':'Suzhou Pingtan','陕北说书':'Shaanbei Storytelling',
    '信天游':'Xintianyou','陕北民歌':'Northern Shaanxi Folk Songs',
    '西安鼓乐':'Xi’an Wind and Percussion Ensemble','朝鲜族农乐舞':'Korean Farmers’ Dance',
    '高邮民歌':'Gaoyou Folk Songs','苗族古歌':'Miao Ancient Songs','秧歌':'Yangge Dance',
}

def clean(s):
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC',s)).strip()

def gazette_rows(path):
    import fitz

    with fitz.open(path) as gazette:
        code = None
        for page in list(gazette)[23:42]:
            for table in page.find_tables().tables:
                for row in table.extract()[1:]:
                    if len(row) != 4:
                        continue
                    number, project, title, applicant = [
                        ''.join(line for line in (cell or '').splitlines()
                                if line.strip() not in {'国','务','院','公','报'})
                        for cell in row
                    ]
                    if project:
                        code = project
                    if code and title and applicant:
                        yield [number, code, title, applicant]


def category(series, title):
    fixed = {'III':'dance','IV':'opera','V':'narrative','I':'oral','VIII':'craft'}
    if series in fixed:
        return fixed[series]
    if re.search(r'民歌|山歌|号子|渔歌|长调|花儿|畲歌|侗族大歌|信天游|灯歌|歌谣|吴歌|酒歌|情歌',title):
        return 'folk'
    if re.search(r'合奏|丝竹|锣鼓|吹打|鼓吹|鼓乐|八音|十番|打击乐|笙管乐',title):
        return 'ensemble'
    return 'traditional'

def romanize_file(values):
    import tempfile
    with tempfile.TemporaryDirectory() as work:
        folder = pathlib.Path(work)
        (folder/'input.txt').write_text('\n'.join(values),encoding='utf8')
        (folder/'roman.swift').write_text('''
import Foundation
let data = try String(contentsOfFile: CommandLine.arguments[1], encoding: .utf8)
for line in data.components(separatedBy: "\\n") {
    print(line.applyingTransform(.mandarinToLatin, reverse: false) ?? line)
}
''')
        result = subprocess.check_output([
            'swift','-module-cache-path','/tmp/atlas-swift-music',
            str(folder/'roman.swift'),str(folder/'input.txt'),
        ],text=True)
        lines = result.splitlines()
        if len(values) != len(lines):
            raise ValueError("Romanization output length differs from input")
        return dict(zip(values,lines))

directory = pathlib.Path(sys.argv[1])
registrations = []
previous = set()
for year in YEARS:
    if year == 2021:
        rows = gazette_rows(directory/'atlas-ich-gazette.pdf')
    else:
        webpage = (directory / f'atlas-ich-{year}.html').read_bytes()
        document = BeautifulSoup(webpage,'html.parser')
        rows = ([cell.get_text(strip=True) for cell in row.find_all(['td','th'],recursive=False)]
                for row in document.select('tr'))
    for row in rows:
        values = [clean(cell) for cell in row]
        for i,cell in enumerate(values[:-2]):
            match = CODE.fullmatch(cell)
            if not match:
                continue
            series, index = match.groups()
            title, applicant = values[i+1:i+3]
            if series == 'I' and not EPICS.search(title) or series == 'VIII' and not INSTRUMENT_CRAFT.search(title):
                break
            if not title or not applicant:
                raise ValueError((year,values))
            code = f'{series}-{index}'
            regions = list(dict.fromkeys(PROVINCE.findall(applicant)))
            if '新疆生产建设兵团' in applicant and '新疆' not in regions:
                regions.append('新疆')
            registrations.append(dict(code=code,year=year,zh=title,applicant=applicant,regions=regions,
                                      category=category(series,title),extension=code in previous))
            break
    previous.update(r['code'] for r in registrations)

strings = list(dict.fromkeys(s for row in registrations for s in (row['zh'],row['applicant'])))
latin = romanize_file(strings)
ids = collections.Counter()
for row in registrations:
    base = f"ich-{row['year']}-{row['code'].lower()}"
    ids[base] += 1
    row['id'] = base if ids[base] == 1 else f'{base}-{ids[base]}'
    title = row.pop('zh')
    row['title'] = {'zh':title,'en':KNOWN.get(title,latin[title].capitalize())}
    row['applicant'] = {'zh':row['applicant'],'en':latin[row['applicant']]}
    row['pinyin'] = latin[title]
data = {'regions':{zh:{'name':{'zh':zh,'en':en},'coordinates':[lng,lat]} for zh,en,lng,lat in REGIONS},
        'registrations':registrations}
output = pathlib.Path(__file__).resolve().parents[1]/'data/music/registry.json'
output.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf8')
print(collections.Counter(r['year'] for r in registrations))
print(collections.Counter(r['category'] for r in registrations))
print(f"{len(registrations)} listings, {len(previous)} distinct project codes.")
