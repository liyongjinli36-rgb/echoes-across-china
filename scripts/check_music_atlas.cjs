'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const json = file => JSON.parse(read(file));
const exists = file => fs.existsSync(path.join(root,file));
const bundle = {window:{}};

for (const file of ['js/atlas_snapshots.js','js/china_geo_data.js','js/music-era-data.js','js/i18n_dict.js']) {
  vm.runInNewContext(read(file),bundle,{filename:file});
}
const { ATLAS_SNAPSHOTS: snapshots, DYNASTY_DATA: dynasties, EN_LOCALE: english } = bundle.window;
const eras = json('data/era-map-config.json');
const sources = json('data/music/sources.json');
const core = json('data/music/records.json');
const historical = json('data/music/historical-records.json');
const records = [...core,...historical];
const registry = json('data/music/registry.json');
const origins = json('data/music/origins.json');
const comparisons = json('data/music/regional-comparisons.json');
const events = json('data/music/events.json');
const keys = new Set();
const categories = new Set(['folk','solo','ensemble','narrative','opera','historicalEvidence']);

function localized(value, context) {
  for (const locale of ['zh','en']) {
    assert.ok(typeof value?.[locale] === 'string' && value[locale].trim(), `${context} missing ${locale}`);
  }
  assert.match(value.zh, /\p{Script=Han}/u, `${context} needs Chinese text`);
  assert.match(value.en, /[A-Za-z]/, `${context} needs English text`);
}

function validLocation(location, id) {
  localized(location.name, `${id} location name`);
  localized(location.role, `${id} location role`);
  const [longitude,latitude] = location.coordinates;
  assert.ok(Number.isFinite(longitude) && longitude >= 66 && longitude <= 142, `${id} longitude`);
  assert.ok(Number.isFinite(latitude) && latitude >= 14 && latitude <= 55, `${id} latitude`);
}

function citations(entry) {
  assert.ok(entry.sources.length, `${entry.id} needs a citation`);
  for (const {id,pages} of entry.sources) {
    assert.ok(sources[id], `${entry.id} cites missing source ${id}`);
    if (id.startsWith('course')) assert.ok(pages, `${entry.id} needs a slide reference`);
  }
}

function resolveSnapshot(dynasty,year) {
  return (dynasty.phases?.find(phase=>year < phase.until) || dynasty.phases?.at(-1))?.snap
    || 's_' + dynasty.key;
}

for (const [id,source] of Object.entries(sources)) {
  localized(source.title,id);
  if (source.url) assert.equal(new URL(source.url).protocol,'https:');
}
for (const era of eras) {
  for (const field of ['title','note','uncertainty']) localized(era[field],`${era.id} ${field}`);
  if (!era.snapshot) continue;
  const dynasty = dynasties.find(item=>item.key === era.id);
  assert.ok(dynasty,era.id);
  assert.equal(era.snapshot,resolveSnapshot(dynasty,era.representativeYear),era.id);
  assert.ok(snapshots[era.snapshot],era.snapshot);
  assert.ok(era.period[0] <= era.representativeYear && era.period[1] >= era.representativeYear,era.id);
  for (const phase of dynasty.phases || []) assert.ok(snapshots[phase.snap],phase.snap);
}
for (const record of records) {
  const {id,time,media} = record;
  assert.ok(!keys.has(id), id);
  keys.add(id);
  const fields = ['title','period','description','uncertainty'];
  if (!record.isEvidence) fields.push('analysis','instruments');
  for (const field of fields) localized(record[field],`${id} ${field}`);
  assert.ok(categories.has(record.category),id);
  assert.ok(time.precision === 'undated' ? time.era === null : eras.some(era=>era.id === time.era),id);
  assert.ok(['undated','approximate','interval'].includes(time.precision),id);
  assert.equal(time.precision === 'undated',time.start === null,id);
  if (time.start !== null) assert.ok(Number.isInteger(time.end) && time.start <= time.end,id);
  validLocation(record.location,id);
  citations(record);
  if (record.people) localized(record.people,`${id} people`);
  if (record.region) {
    assert.ok(['north','east-central','south'].includes(record.region), `${id} region`);
    if (record.province) localized(record.province, `${id} province`);
  }
  if (media) {
    localized(media.title,`${id} audio title`);
    localized(media.credit,`${id} audio credit`);
    localized(media.prompt,`${id} listening prompt`);
    assert.ok(media.performer.zh && media.performer.en,id);
    assert.equal(new URL(media.source).protocol,'https:',id);
    assert.equal([media.file,media.embed,media.watch].filter(Boolean).length,1,`${id} playback target`);
    if (media.type) {
      const target = {local:'file',embed:'embed',external:'watch'}[media.type];
      assert.ok(target && media[target], `${id} playback type`);
    }
    if (media.excerpt) localized(media.excerpt, `${id} excerpt`);
    if (media.file) {
      assert.match(media.file,/^assets\/audio\/[\w.-]+$/,id);
      assert.ok(exists(media.file) && media.licenseLabel,id);
      assert.equal(new URL(media.license).protocol,'https:',id);
    } else if (media.embed) {
      const player = new URL(media.embed);
      assert.equal(player.origin,'https://embed.music.apple.com',id);
      assert.ok(player.searchParams.get('i'),id);
    } else {
      assert.equal(new URL(media.watch).protocol,'https:',id);
    }
  }
}
for (const [index,event] of events.entries()) {
  assert.ok(!keys.has(event.id),event.id);
  assert.ok(records.some(record=>record.id === event.work),event.id);
  keys.add(event.id);
  assert.ok(Number.isInteger(event.year) && event.year !== 0,event.id);
  if (index) assert.ok(event.year > events[index - 1].year,event.id);
  localized(event.title,event.id);
  localized(event.description,event.id);
  if (event.location) validLocation(event.location,event.id);
  citations(event);
}
for (const era of eras) assert.ok(records.some(record=>record.time.era === era.id),`${era.id}: no course record or historical evidence`);
for (const comparison of comparisons) {
  localized(comparison.title,'comparison title');
  localized(comparison.text,'comparison text');
  assert.ok(comparison.records.length >= 2);
  for (const id of comparison.records) assert.ok(keys.has(id),id);
}

const registerCategories = new Set(['folk','traditional','ensemble','opera','narrative','dance','oral','craft']);
const batches = new Set([2006,2008,2011,2014,2021]);
const projects = new Set();
for (const [name,region] of Object.entries(registry.regions)) {
  validLocation({...region,role:{zh:'省级',en:'Province'}},name);
}
for (const entry of registry.registrations) {
  assert.ok(!keys.has(entry.id),entry.id);
  keys.add(entry.id);
  assert.ok(batches.has(entry.year),entry.id);
  assert.ok(registerCategories.has(entry.category),entry.id);
  assert.match(entry.code,/^(?:I|II|III|IV|V|VIII)-[1-9][0-9]*$/);
  localized(entry.title,entry.id);
  localized(entry.applicant,`${entry.id} applicant`);
  for (const region of entry.regions) assert.ok(registry.regions[region],region);
  projects.add(entry.code);
}
for (const [code,origin] of Object.entries(origins)) {
  assert.ok(projects.has(code),code);
  localized(origin.label,code);
  localized(origin.description,code);
  validLocation({...origin.location,role:{zh:'历史地点',en:'Historical location'}},code);
  assert.ok(['originFormation','originAttestation','originDevelopment'].includes(origin.kind),code);
  const {era,start,end} = origin.time;
  const anchor = eras.find(item=>item.id === era);
  assert.ok(anchor && start <= end && start <= anchor.end && end >= anchor.start,code);
  assert.equal(new URL(origin.url).protocol,'https:',code);
  assert.ok(registry.registrations.filter(entry=>entry.code === code).every(entry=>entry.year > end),code);
}
console.log(`${Object.keys(origins).length} sourced historical dates or periods for registry projects checked.`);
assert.ok(registry.registrations.length >= 900);
for (const [series, expected] of [['II',[19,8]],['III',[13,9]],['IV',[9,14]],['V',[18,2]]]) {
  for (const extension of [false,true]) {
    const projects2021 = new Set(registry.registrations.filter(entry=>entry.year === 2021 && entry.extension === extension
      && entry.code.startsWith(series + '-')).map(entry=>entry.code));
    assert.equal(projects2021.size,expected[Number(extension)],`2021 ${series} extension=${extension}`);
  }
}
assert.equal(eras.find(era=>era.id === 'tang').snapshot,'s_tang_a5');
assert.equal(resolveSnapshot(dynasties.find(dynasty=>dynasty.key === 'ming'),1598),'s_ming_b');
assert.equal(resolveSnapshot(dynasties.find(dynasty=>dynasty.key === 'prc'),1950),'s_prc');
assert.equal(eras.find(era=>era.id === 'early').snapshot,null);
assert.ok(records.find(record=>record.id === 'xintianyou').time.start === null);
assert.equal(bundle.window.PROVINCE_OUTLINES,undefined);

const forbidden = ['prefectures','regions','prefRef','regionRef'];
for (const [id,snapshot] of Object.entries(snapshots)) {
  for (const key of forbidden) assert.ok(!(key in snapshot),`${id} has ${key}`);
  for (const polity of Array.isArray(snapshot) ? snapshot : snapshot.polities) {
    if (/\p{Script=Han}/u.test(polity.title)) assert.ok(english.dict[polity.title],polity.title);
  }
}
const { loadSources } = require('./build_atlas.js');
const { doc,index } = loadSources();
for (const [id,snapshot] of Object.entries(doc.snapshots)) {
  for (const key of forbidden) assert.ok(!(key in snapshot),`${id} source has ${key}`);
}
assert.equal(Object.keys(snapshots).length,index.order.length);
console.log(`${core.length} course records, ${historical.length} historical records, ${events.filter(event=>event.type !== 'heritage').length} timeline milestones and ${comparisons.length} regional comparisons.`);
console.log(`${registry.registrations.length} registry entries, ${projects.size} project codes and ${eras.length} represented periods checked.`);
console.log('Snapshot IDs, translations, media references and geographic layer exclusions verified.');
