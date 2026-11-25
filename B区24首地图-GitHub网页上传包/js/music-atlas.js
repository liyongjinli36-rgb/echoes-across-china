import { strings, guide, cities } from './music-i18n.js';
import { buildRegistry, registerCategories, registerSources } from './music-registry.js';

const el = id => document.getElementById(id);
const categories = [...new Set(['folk','solo','ensemble','narrative','opera',...registerCategories,'historicalEvidence','events'])];
const regionLabels = new Map([['all','areaAll'],['north','areaNorth'],['east-central','areaEast'],['south','areaSouth']]);
// These two recordings predate the region field in the source data.
const legacyListeningRegions = new Map([['guqin','north'],['dragon-drum','south']]);
const registryPageSize = 18;
const speeds = [0.5, 1, 2, 4];
const initialParams = new URLSearchParams(location.search);
const localePreference = params => params.get('lang') === 'en' ? 'en' : 'zh';
const text = (key, locale) => strings[key][locale === 'en' ? 1 : 0];

function node(tag, value, className) {
  const element = document.createElement(tag);
  if (value) element.textContent = value;
  if (className) element.className = className;
  return element;
}

function button(label, action, className) {
  const element = node('button', label, className);
  element.type = 'button';
  element.addEventListener('click', action);
  return element;
}

function external(label, url) {
  const link = node('a', label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function normalized(value) {
  return String(value).normalize('NFD').replace(/\p{Mark}/gu, '').toLowerCase()
    .replace(/[\s\p{Punctuation}\p{Symbol}]+/gu, '');
}

class MusicAtlas extends window.HistoricalAtlasController {
  constructor(eras, records, events, sources, registry, comparisons, historical, origins) {
    super({ mapOnly: true });
    this.eras = eras;
    this.eraById = new Map(eras.map(era => [era.id, era]));
    this.records = [...records,...historical];
    this.events = events.filter(event => event.type !== 'heritage');
    this.sources = sources;
    this.registry = buildRegistry(registry,origins);
    this.comparisons = comparisons;
    this.registryPage = 0;
    this.registryRegion = '';
    this.registryCategory = '';
    this.recordsById = new Map([...this.records,...this.registry.entries].map(record => [record.id, record]));
    this.eventsById = new Map(events.map(event => [event.id, event]));
    this.filters = new Set(categories);
    this.guideIndex = -1;
    this.playSpeed = 1;
    this.audioState = 'idle';
    this.dynasties = [
      {key:'early', title:'先秦', badge:'先秦', tint:'#786658', fromYear:eras[0].start, toYear:eras[0].end, focusYear:eras[0].representativeYear},
      ...this.dynasties,
    ];
    this.dynasties.forEach(dynasty => {
      const era = this.eraById.get(dynasty.key);
      dynasty.fromYear = era.start;
      dynasty.toYear = era.end;
      dynasty.focusYear = era.representativeYear;
      dynasty.milestones = this.events.filter(event => this.eraAt(event.year).id === dynasty.key);
    });
    this.minYear = eras[0].start;
    this.maxYear = eras.at(-1).end;
    this._initTimelineBands();
    this.boot(initialParams);
  }

  t(key) { return text(key, this.locale); }
  l(value) { return value[this.locale]; }
  eraAt(year) { return this.eras.findLast(era => year >= era.start) || this.eras[0]; }
  yearLabel(year) {
    return this.locale === 'en' ? `${Math.abs(year)} ${year < 0 ? 'BCE' : 'CE'}`
      : `${year < 0 ? '公元前' : ''}${Math.abs(year)}年`;
  }
  spanLabel(from, to) {
    if (from === to) return this.yearLabel(from);
    if (this.locale === 'zh') return `${from < 0 ? '前' : ''}${Math.abs(from)}—${to < 0 ? '前' : ''}${Math.abs(to)}年`;
    if (from < 0 && to > 0) return `${this.yearLabel(from)}–${this.yearLabel(to)}`;
    return `${Math.abs(from)}–${this.yearLabel(to)}`;
  }

  eraSpan(era) {
    if (era.id === 'prc') return this.locale === 'en' ? '1949–present' : '1949年至今';
    return this.spanLabel(...(era.historicalRange || [era.start,era.end]));
  }

  boot(params) {
    this.locale = localePreference(params);
    this.setStateFromUrl(params);
    const image = el('terrain-relief-img');
    image.setAttribute('href', image.getAttribute(this._isMobileViewport() ? 'data-href-mobile' : 'data-href'));
    this.camera = this.regionCamera();
    this._applyCamera(true);
    this._buildScrubberBands({ skipRefreshLabels: true });
    this._bindScrubberDrag(el('scrubber-track'));
    this._bindScrubberNavigator();
    for (const [index, band] of [...el('dynasty-bands').children].entries()) {
      const id = this.dynasties[index].key;
      band.addEventListener('pointerdown', event => event.stopPropagation());
      band.addEventListener('click', () => this.selectEra(id));
      band.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.selectEra(id);
      }, true);
    }
    this.bindControls();
    this.setLocale(this.locale);
    el('music-loading').hidden = true;
    if (this.selection) this.revealCard();
  }

  setStateFromUrl(params) {
    this.region = regionLabels.has(params.get('region')) ? params.get('region') : 'all';
    const rawYear = Number(params.get('year'));
    const item = this.recordsById.get(params.get('music')) || null;
    let event = this.eventsById.get(params.get('event')) || null;
    if (!event && item && rawYear) event = this.events.find(e => e.work === item.id && e.year === rawYear) || null;
    const formerListingLink = (item?.registered && rawYear === item.year) || event?.type === 'heritage';
    const legacyWork = event?.type === 'heritage' ? this.recordsById.get(event.work) : null;
    if (legacyWork) event = null;
    const candidate = event?.year ?? (formerListingLink ? null : rawYear);
    this.selection = event || item || legacyWork;
    if (this.selection && !this.inRegion(this.selection)) this.selection = null;
    if (Number.isInteger(candidate) && candidate >= this.minYear && candidate <= this.maxYear && candidate !== 0) {
      this.state = { mode:'year', eraId:this.eraAt(candidate).id, year:candidate };
    } else if (!this.eraById.has(params.get('era')) && (!this.selection || this.selection.media || this.selection.region)) {
      this.state = {mode:'all',eraId:'prc',year:null};
    } else {
      const era = this.eraById.get(params.get('era')) || this.eraById.get(this.selection?.time?.era) || this.eraById.get('ming');
      this.state = {mode:'overview', eraId:era.id, year:null};
    }
    if (this.selection && this._isMobileViewport()) this.setPanel(true);
  }

  syncUrl() {
    const url = new URL(location.href);
    url.searchParams.set('lang', this.locale);
    for (const entry of ['region','era','year','music','event']) url.searchParams.delete(entry);
    if (this.region !== 'all') url.searchParams.set('region',this.region);
    if (this.state.mode === 'year') url.searchParams.set('year',this.state.year);
    if (this.state.mode === 'overview') url.searchParams.set('era',this.state.eraId);
    if (this.selection) url.searchParams.set('music', this.selection.work || this.selection.id);
    if (this.selection?.work) url.searchParams.set('event', this.selection.id);
    if (url.href !== location.href) history.replaceState(history.state, '', url);
    el('act-home').href = `?lang=${this.locale}`;
  }

  setLocale(locale) {
    if (locale !== 'zh' && locale !== 'en') return;
    this.locale = locale;
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
    document.title = this.t('title');
    el('txt-seal').textContent = this.t('brand');
    el('site-heading').setAttribute('aria-label',this.t('title'));
    for (const element of document.querySelectorAll('[data-text]')) element.textContent = this.t(element.dataset.text);
    for (const element of document.querySelectorAll('[data-label]')) element.setAttribute('aria-label', this.t(element.dataset.label));
    for (const element of document.querySelectorAll('[data-placeholder]')) element.placeholder = this.t(element.dataset.placeholder);
    el('locale-zh').setAttribute('aria-pressed', String(locale === 'zh'));
    el('locale-en').setAttribute('aria-pressed', String(locale === 'en'));
    this.svg.setAttribute('aria-label', this.t('map'));
    el('scrubber-dock').setAttribute('aria-label', this.t('timeline'));
    for (const [id,key] of [['scrubber-track','slider'],['inp-year','yearInput'],['act-step-prev','previous'],['act-step-next','next'],['timeline-start','timelineStart'],['timeline-end','timelineEnd']]) {
      el(id).setAttribute('aria-label', this.t(key));
      el(id).title = this.t(key);
    }
    el('txt-year-suffix').textContent = this.t('yearSuffix');
    this.renderFilters();
    this.renderEraOptions();
    this.renderRegistryOptions();
    this.renderComparisons();
    this._refreshBandLabels();
    this.renderPlayback();
    this.render();
  }

  inRegion(item) {
    const record = item.work ? this.recordsById.get(item.work) : item;
    return this.region === 'all' || (record?.region || legacyListeningRegions.get(record?.id)) === this.region;
  }

  visibleRecords() {
    const pool = this.region === 'all' && this.state.mode !== 'all'
      ? [...this.records,...this.registry.datedProjects] : this.records;
    return pool.filter(record => this.inRegion(record) && this.filters.has(record.category) && this.hasRecord(record));
  }

  regionCamera() {
    const home = this._getDefaultCamera();
    let coordinates;
    if (this.region === 'all') {
      if (this.state.mode !== 'all') return home;
      coordinates = [[73,53],[135,18]];
    } else {
      coordinates = this.records.filter(r => this.inRegion(r)).map(r => r.location.coordinates);
    }
    if (!coordinates.length) return home;
    const points = coordinates.map(point => this.projector.toScreen(...point));
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    const left = Math.min(...xs), top = Math.min(...ys);
    const width = Math.max(...xs) - left, height = Math.max(...ys) - top;
    const rect = this.svg.getBoundingClientRect();
    const aspect = rect.width && rect.height ? rect.height / rect.width : home.h / home.w;
    const padTop = Math.min(.32,105 / (rect.height || 500));
    const padBottom = .13;
    const w = Math.max(170,width * 1.35,height / (aspect * (1 - padTop - padBottom)) * 1.12);
    const h = w * aspect;
    return {x:left + width/2 - w/2,y:top + height/2 - h * (1+padTop-padBottom)/2,w,h,zoom:1000/w};
  }

  selectRegion(region) {
    if (!regionLabels.has(region)) return;
    this.stopAutoplay();
    this.region = region;
    this.selection = null;
    this.guideIndex = -1;
    this.searchActive = false;
    el('music-search').value = '';
    for (const section of ['registry','regions']) this.toggleBrowse(section,false);
    this.state = {mode:'all',eraId:'prc',year:null};
    this.setPanel(region !== 'all');
    this.render();
    el('chronicle-pane').scrollTop = 0;
    this._animateCameraTo(this.regionCamera());
  }

  selectEra(id) {
    if (id !== 'all' && !this.eraById.has(id)) return;
    this.stopAutoplay();
    this.state = id === 'all' ? {mode:'all',eraId:'prc',year:null} : {mode:'overview',eraId:id,year:null};
    this.selection = null;
    this.render();
  }

  jumpToYear(value) {
    if (!Number.isFinite(value)) return;
    let year = Math.max(this.minYear, Math.min(this.maxYear, Math.round(value)));
    if (!year) year = this.year < 0 ? 1 : -1;
    this.state = {mode:'year',eraId:this.eraAt(year).id,year};
    this.selection = this.events.find(event => event.year === year && this.inRegion(event)) || null;
    this.render();
  }

  selectItem(item, { focus = false } = {}) {
    const record = item.work ? this.recordsById.get(item.work) : item;
    if (!this.inRegion(item)) this.selectRegion('all');
    this.selection = item;
    if (item.work) {
      this.state = {mode:'year',eraId:this.eraAt(item.year).id,year:item.year};
    } else if (record.time?.era && !this.hasRecord(record)) {
      const {era,start,end} = record.time;
      this.state = start === end
        ? {mode:'year',eraId:this.eraAt(start).id,year:start}
        : {mode:'overview',eraId:era,year:null};
    }
    const coordinates = (item.location || record.location)?.coordinates;
    if (focus && coordinates) this._ensureCoordInView(coordinates);
    this.setPanel(true);
    this.render();
    this.revealCard();
  }

  revealCard() {
    const container = el('chronicle-pane');
    const card = el('music-card');
    const heading = container.querySelector('.dynasty-banner');
    const offset = card.getBoundingClientRect().top - container.getBoundingClientRect().top - heading.offsetHeight;
    container.scrollTop += offset - 16;
  }

  setPanel(open) {
    el('workspace-body').classList.toggle('music-panel-open', open);
    el('music-panel-toggle').setAttribute('aria-expanded', String(open));
    el('music-panel-toggle').textContent = this.t(open ? 'panelHide' : 'panelShow');
  }

  hasRecord(record) {
    if (this.state.mode === 'all') return Boolean(record.region || record.media || record === this.selection);
    return this.hasReached(record.time?.era,record.time?.start);
  }

  hasReached(eraId, year) {
    return year != null && eraId === this.state.eraId
      && (this.state.mode === 'overview' || this.state.year >= year);
  }

  render() {
    const era = this.eraById.get(this.state.eraId);
    this.year = this.state.year ?? era.representativeYear;
    this.dynastyIdx = this._findDynastyIndex(this.year);
    const dynasty = this.dynasties[this.dynastyIdx];
    const key = this.state.mode !== 'year' ? era.snapshot : era.snapshot && this._resolveSnapKey(dynasty, this.year);
    const snapshot = this.snapshots[key] || {polities:[]};
    this.phasePeriod = this.snapshotPeriod(era, dynasty, key);
    const allPeriods = this.state.mode === 'all';
    const regional = this.region !== 'all';
    this.setPanel(el('workspace-body').classList.contains('music-panel-open'));
    for (const control of el('region-nav').querySelectorAll('button')) {
      control.setAttribute('aria-pressed',String(control.dataset.region === this.region));
    }
    for (const id of ['registry-open','regions-open']) el(id).hidden = regional;
    el('era-select').value = allPeriods ? 'all' : era.id;
    el('dynasty-title').textContent = allPeriods || regional ? this.t(regionLabels.get(this.region)) : this.l(era.title);
    el('dynasty-span').textContent = allPeriods ? this.t('allPeriods')
      : this.state.year === null ? `${this.l(era.title)} · ${this.eraSpan(era)}` : this.yearLabel(this.year);
    el('dynasty-summary').textContent = allPeriods ? this.t('allPeriodHelp') : `${this.l(era.note)} ${this.l(era.uncertainty)}`;
    const mapSignature = `${key}:${this.locale}:${this._hydroMask(this.year)}`;
    if (this.mapSignature !== mapSignature) {
      this.mapSignature = mapSignature;
      this._runWithDeferredTypography(() => {
        this._buildTerrainRivers();
        this._renderPolitiesAndPrefectures(dynasty, snapshot);
        this.renderCities();
      });
    } else {
      this._renderLegendBox(snapshot);
    }
    this.svg.dataset.snapshot = key || 'terrain';
    document.documentElement.style.setProperty('--dynasty-accent',dynasty.tint);
    this._revealScrubberYear();
    this._syncScrubberUi();
    this.renderLists();
    this.renderRegistry();
    this.renderMarkers();
    this.renderCard();
    this.renderSearch();
    this.renderGuide();
    this.syncUrl();
  }

  snapshotPeriod(era, dynasty, key) {
    if (this.state.mode === 'all' || !key || key === 's_prc') return null;
    if (this.state.mode === 'overview') return era.period;
    const selected = this._resolvePhase(dynasty, this.year);
    const index = dynasty.phases?.indexOf(selected) ?? -1;
    if (index < 0) return [era.start, era.end];
    return [
      index === 0 ? era.start : dynasty.phases[index - 1].until,
      index + 1 === dynasty.phases.length ? era.end : Math.min(selected.until - 1,era.end),
    ];
  }

  _renderLegendBox(snapshot) {
    const legendOpen = el('map-key').querySelector('details')?.open;
    const title = this.phasePeriod ? `${this.t('phase')} · ${this.spanLabel(...this.phasePeriod)}` : this.t('context');
    const mapKey = el('map-key');
    mapKey.replaceChildren(node('div', title, 'music-map-caption'));
    if (!el('borders-toggle').checked) {
      mapKey.append(node('small', this.t('hiddenBorders')));
      return;
    }
    const realms = snapshot.polities.filter(polity => polity.role !== 'neighbor');
    if (!realms.length) return;
    const details = node('details', '', 'music-legend');
    details.open = Boolean(legendOpen);
    details.append(node('summary', this.t('territories')));
    const list = node('ul');
    for (const realm of realms) {
      const row = node('li');
      const swatch = node('span');
      swatch.style.backgroundColor = realm.tint;
      row.append(swatch, document.createTextNode(this.trTerm(realm.title)));
      list.append(row);
    }
    details.append(list);
    mapKey.append(details);
  }

  renderCities() {
    this.grpSettlements.replaceChildren();
    const regionalCities = cities.map(city => [...city]);
    if (['tang','sui','xihan'].includes(this.state.eraId)) {
      regionalCities[0].splice(0,2,'长安','Chang’an');
    }
    for (const [zh,en,lng,lat] of regionalCities) {
      const [x,y] = this.projector.toScreen(lng,lat);
      const group = this._svgNode('g', {transform:`translate(${x},${y})`}, this.grpSettlements);
      const content = this._svgNode('g',{class:'music-city'},group);
      this._svgNode('circle',{r:2.2},content);
      this._svgNode('text',{x:5,y:3},content).textContent = this.locale === 'en' ? en : zh;
    }
    this.resizeMapSymbols();
  }

  renderEraOptions() {
    const select = el('era-select');
    select.replaceChildren(new Option(this.t('allPeriods'),'all'),...this.eras.map(era => {
      const option = node('option', `${this.l(era.title)} · ${this.eraSpan(era)}`);
      option.value = era.id;
      return option;
    }));
  }

  renderFilters() {
    el('category-filters').replaceChildren(...categories.map(category => {
      const label = node('label', '', 'layer-chip');
      const input = node('input');
      input.type = 'checkbox';
      input.checked = this.filters.has(category);
      input.value = category;
      input.addEventListener('change', () => {
        if (input.checked) this.filters.add(category);
        else this.filters.delete(category);
        const selected = this.selection;
        if (selected && !this.filters.has(selected.work ? 'events' : selected.category)) this.selection = null;
        this.registryPage = 0;
        this.render();
      });
      label.append(input,node('span', this.t(category)));
      return label;
    }));
  }

  renderLists() {
    const list = el('tradition-list');
    list.replaceChildren();
    const visible = this.visibleRecords();
    const featured = this.state.mode === 'all' || this.region !== 'all';
    el('tradition-heading').textContent = featured
      ? `${this.t(this.region === 'all' ? 'featuredWorks' : 'areaWorks')} · ${visible.length}` : this.t('traditions');
    const listening = el('listening-select');
    const heading = new Option(this.t('classListening'),'');
    heading.disabled = true;
    const playable = this.region === 'all' ? this.records.filter(r => r.media) : visible.filter(r => r.media);
    listening.replaceChildren(heading,...playable.map(r => new Option(`${this.l(r.location.name)} · ${this.l(r.title)}`,r.id)));
    listening.value = '';
    for (const record of visible) {
      const item = node('li');
      const control = button(this.l(record.title), () => this.selectItem(record, { focus:true }), 'music-row');
      control.dataset.music = record.id;
      if (this.selection === record) control.setAttribute('aria-current','true');
      const meta = featured && record.media
        ? [this.l(record.location.name), record.genre ? this.l(record.genre) : this.t(record.category), this.l(record.media.performer)]
        : [this.t(record.category), this.l(record.location.name), record.origin ? this.l(record.origin.label) : this.l(record.period)];
      control.append(node('small',meta.join(' · ')));
      item.append(control);
      list.append(item);
    }
    if (!visible.length) {
      const empty = node('li',this.t(featured ? 'noAreaWorks' : 'emptyEra'),'music-empty');
      if (this.state.mode !== 'all') {
        const reset = button(this.t('returnAllPeriods'),() => this.selectEra('all'),'music-inline');
        reset.id = 'region-reset-period';
        empty.append(reset);
      }
      list.append(empty);
    }
    const events = el('music-events');
    events.replaceChildren();
    events.parentElement.hidden = this.region !== 'all';
    if (this.region !== 'all') return;
    if (!this.filters.has('events')) {
      events.append(node('li',this.t('emptyEvents'),'music-empty'));
      return;
    }
    for (const event of this.events) {
      const item = node('li');
      const control = button(this.l(event.title), () => this.selectItem(event), 'music-row');
      control.dataset.event = event.id;
      if (this.selection === event) control.setAttribute('aria-current','true');
      control.prepend(node('small', `${this.yearLabel(event.year)} · ${this.t(event.type === 'recording' ? 'recordingEvent' : event.type)}`));
      item.append(control);
      events.append(item);
    }
  }

  renderRegistryOptions() {
    const make = (select, options, value) => {
      select.replaceChildren(...options.map(([key,label]) => {
        const option = node('option',label);
        option.value = key;
        return option;
      }));
      select.value = value;
    };
    const regions = Object.entries(this.registry.regions).map(([key,region]) => [key,this.l(region.name)]);
    regions.sort((a,b) => a[1].localeCompare(b[1],this.locale));
    make(el('registry-region'),[['',this.t('allRegions')],...regions],this.registryRegion);
    make(el('registry-category'),[['',this.t('allCategories')],...registerCategories.map(key=>[key,this.t(key)])],this.registryCategory);
    el('registry-open').textContent = this.t('registryButton').replace('{count}',this.registry.entries.length);
  }

  renderRegistry() {
    if (el('music-registry').hidden) return;
    const query = normalized(el('registry-query').value);
    const matches = this.registry.entries.filter(item => this.filters.has(item.category)
      && (!this.registryCategory || this.registryCategory === item.category)
      && (!this.registryRegion || item.regions.includes(this.registryRegion))
      && (!query || this.matchesQuery(item,query)))
      .sort((a,b) => Number(Boolean(b.origin)) - Number(Boolean(a.origin)));
    const pages = Math.max(1, Math.ceil(matches.length / registryPageSize));
    this.registryPage = Math.min(this.registryPage,pages-1);
    const offset = this.registryPage * registryPageSize;
    el('registry-results').replaceChildren(...matches.slice(offset,offset+registryPageSize).map(item => {
      const row = node('li');
      const open = button(this.l(item.title),()=>this.selectItem(item,{focus:true}),'music-row');
      open.dataset.music = item.id;
      open.append(node('small',`${this.t(item.category)} · ${item.code} · ${this.registryDate(item)}`));
      row.append(open);
      return row;
    }));
    el('registry-count').textContent = this.t('registryCount').replace('{count}',matches.length)
      .replace('{page}',this.registryPage+1).replace('{pages}',pages);
    el('registry-prev').disabled = this.registryPage === 0;
    el('registry-next').disabled = this.registryPage + 1 >= pages;
  }

  toggleBrowse(section, open) {
    const other = section === 'registry' ? 'regions' : 'registry';
    el(`music-${other}`).hidden = true;
    el(`${other}-open`).setAttribute('aria-expanded','false');
    const panel = el(`music-${section}`);
    panel.hidden = !open;
    el(`${section}-open`).setAttribute('aria-expanded',String(open));
    if (!open) return;
    this.setPanel(true);
    if (section === 'registry') this.renderRegistry();
    panel.scrollIntoView({block:'nearest'});
  }

  renderComparisons() {
    el('regional-comparisons').replaceChildren(...this.comparisons.map(comparison => {
      const section = node('section','','music-comparison');
      section.append(node('h4',this.l(comparison.title)),node('p',this.l(comparison.text)));
      const examples = node('div','','comparison-items');
      for (const id of comparison.records) {
        const record = this.recordsById.get(id);
        const open = button(`${this.l(record.location.name)} · ${this.l(record.title)}`,
          () => this.selectItem(record,{focus:true}),'music-row');
        examples.append(open);
      }
      section.append(examples);
      return section;
    }));
  }

  renderMarkers() {
    const container = el('music-markers');
    container.replaceChildren();
    const visible = this.visibleRecords();
    const eraEvents = this.region === 'all' && this.state.mode !== 'all' && this.filters.has('events')
      ? this.events.filter(event => this.hasReached(this.eraAt(event.year).id,event.year)) : [];
    const query = this.searchActive ? normalized(el('music-search').value) : '';
    if (this.selection?.registered && this.filters.has(this.selection.category) && this.hasRecord(this.selection)) {
      const index = visible.findIndex(record => record.code === this.selection.code);
      if (index >= 0) visible[index] = this.selection;
    }
    const all = [...eraEvents,...visible];
    if (this.selection && all.includes(this.selection)) {
      all.splice(all.indexOf(this.selection),1);
      all.unshift(this.selection);
    }
    for (const item of all) {
      const record = item.work ? this.recordsById.get(item.work) : item;
      const point = item.location || record.location;
      const [x,y] = this.projector.toScreen(...point.coordinates);
      const group = this._svgNode('g',{transform:`translate(${x},${y})`,'data-x':x,'data-y':y},container);
      const pin = this._svgNode('g',{
        role:'button', tabindex:'0', class:`music-pin music-pin-${item.work ? 'events' : record.category}`,
        'data-search-match':String(!query || this.matchesQuery(item,query)),
        'data-music':item.id, 'aria-label':`${this.l(item.title)} · ${this.l(point.name)}`,
        'aria-pressed':String(this.selection === item),
      },group);
      const activate = () => this.selectItem(item);
      pin.addEventListener('pointerdown', event => event.stopPropagation());
      pin.addEventListener('click', activate);
      pin.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.stopPropagation();
          activate();
        }
      });
      this._svgNode('title',{},pin).textContent = this.l(item.title);
      this._svgNode('circle',{r:this.selection === item ? 8 : 6},pin);
      this._svgNode('circle',{r:2.2,class:'music-pin-centre'},pin);
      const label = this._svgNode('text',{x:10,y:4},pin);
      label.textContent = this.l(item.title);
    }
    this.resizeMapSymbols();
  }

  resizeMapSymbols() {
    const box = this.svg.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const unit = Math.max(this.camera.w / box.width, this.camera.h / box.height);
    this.svg.style.setProperty('--music-unit', unit.toFixed(4));
    const placed = [];
    for (const group of el('music-markers').children) {
      let x = 0;
      let y = 0;
      const baseX = Number(group.dataset.x) / unit;
      const baseY = Number(group.dataset.y) / unit;
      for (let k = 1; placed.some(([px,py]) => Math.hypot(px - baseX - x, py - baseY - y) < 15); k++) {
        const angle = k * 2.39996;
        const radius = 13 * Math.sqrt(k);
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
      }
      placed.push([baseX + x,baseY + y]);
      group.firstElementChild.setAttribute('transform',`translate(${x * unit},${y * unit}) scale(${unit})`);
    }
  }

  _applyCamera(force) {
    super._applyCamera(force);
    this.resizeMapSymbols();
  }

  _recordGestureMove() {}
  _recordGestureClick() {}
  _clearQuickSearchInput() {}
  _syncAutoMilestoneBalloon() {}
  formatEraLabel() { return this.l(this.eraById.get(this.state.eraId).title); }
  dynastyName(dynasty) { return this.l(this.eraById.get(dynasty.key).title); }
  dynastyBadge(dynasty) {
    return dynasty.key === 'early' ? (this.locale === 'en' ? 'Early' : '先秦') : super.dynastyBadge(dynasty);
  }

  _syncScrubberUi() {
    super._syncScrubberUi();
    const era = this.eraById.get(this.state.eraId);
    const caption = this.state.mode === 'all' ? this.t('allPeriods') : this.state.mode === 'overview'
      ? `${this.l(era.title)} · ${this.t('overview')}`
      : `${this.yearLabel(this.year)} · ${this.l(era.title)}`;
    el('bubble-text').textContent = caption;
    el('scrubber-Bubble').title = caption;
    el('scrubber-track').setAttribute('aria-valuetext',caption);
    if (this.state.mode !== 'year') el('inp-year').value = '';
  }

  renderCard() {
    const item = this.selection;
    const card = el('music-card');
    card.hidden = !item;
    const record = item?.work ? this.recordsById.get(item.work) : item;
    const panelVisible = getComputedStyle(el('music-panel-body')).display !== 'none';
    this.renderAudio(panelVisible ? record?.media : null);
    if (!item) {
      el('music-card-title').textContent = '';
      el('music-card-text').replaceChildren();
      return;
    }
    if (item.registered) {
      this.renderRegistryCard(item);
      return;
    }
    const location = item.location || record.location;
    el('music-kicker').textContent = `${this.t(record.category)} · ${item.work ? this.yearLabel(item.year) : this.l(record.period)}`;
    el('music-card-title').textContent = this.l(item.title);
    const body = el('music-card-text');
    const existing = body.dataset.item === item.id
      ? new Map([...body.querySelectorAll('details')].map(section => [section.dataset.section, section.open])) : new Map();
    body.dataset.item = item.id;
    body.replaceChildren(node('p',this.l(item.description)));
    if (item !== record) body.append(node('p',this.l(record.description)));
    const place = node('p', `${this.l(location.name)} · ${this.l(location.role)}`, 'music-card-place');
    place.append(button(this.t('focus'), () => this._panToward(...location.coordinates), 'music-inline'));
    body.append(place);
    const siblings = this.visibleRecords().filter(r => r !== record && r.media && r.location.coordinates.join() === location.coordinates.join());
    if (record.media && siblings.length) {
      const related = node('div','','same-place-works');
      related.append(node('strong',this.t('samePlace')));
      for (const r of siblings) related.append(button(this.l(r.title),() => this.selectItem(r),'music-inline'));
      body.append(related);
    }
    for (const [key,value] of [
      ['instruments',record.instruments],['analysis',record.analysis],['people',record.people],['uncertainty',record.uncertainty],['courseLink',record.course],
    ]) {
      if (!value) continue;
      const section = node('details', '', 'music-card-section');
      section.dataset.section = key;
      section.open = existing.get(key) ?? key === 'analysis';
      section.append(node('summary',this.t(key)),node('p',this.l(value)));
      body.append(section);
    }
    if (record.watch && record.watch !== record.media?.source) body.append(external(this.t('historicalMedia'),record.watch));
    if (record.listen) body.append(external(this.t('externalAudio'),record.listen));
    const refs = node('details', '', 'music-card-section');
    refs.dataset.section = 'references';
    refs.open = existing.get('references') ?? Boolean(record.isEvidence);
    refs.append(node('summary',this.t('references')));
    const list = node('ul');
    const allSources = [...item.sources, ...(item === record ? [] : record.sources)];
    const seen = new Set();
    for (const { id, pages } of allSources) {
      const display = this.sources[id];
      if (seen.has(id)) continue;
      seen.add(id);
      const label = this.l(display.title) + (pages ? ' · ' + this.t('page').replace('{pages}',pages) : '');
      const li = node('li');
      li.append(display.url ? external(label,display.url) : document.createTextNode(label));
      list.append(li);
    }
    refs.append(list);
    body.append(refs);
  }

  registryDate(item) {
    return item.origin ? `${this.t(item.origin.kind)} · ${this.l(item.origin.label)}` : this.t('originUnknown');
  }

  renderRegistryCard(item) {
    const type = this.t(item.extension ? 'registryExtension' : 'registryAward');
    el('music-kicker').textContent = `${this.t(item.category)} · ${this.registryDate(item)}`;
    el('music-card-title').textContent = this.l(item.title);
    const body = el('music-card-text');
    body.dataset.item = item.id;
    body.replaceChildren();
    if (item.origin) {
      body.append(node('p',this.l(item.origin.description)));
      body.append(button(`${this.l(item.location.name)} · ${this.t('originPlace')}`,
        () => this._panToward(...item.location.coordinates),'music-inline'));
      body.append(external(this.t('originSource'),item.origin.url));
    } else {
      body.append(node('p',this.t('originUnknownNote')));
    }
    const details = node('details','','music-card-section');
    details.append(
      node('summary',this.t('registryMetadata')),
      node('p',`${type} · ${this.yearLabel(item.year)} · ${item.code}`),
      node('h4',this.t('registryApplicants')),
      node('p',this.l(item.applicant)),
    );
    if (this.locale === 'en') details.append(node('p',item.applicant.zh,'catalog-note'));
    details.append(external(this.t('source'),registerSources[item.year]));
    body.append(details);
  }

  renderAudio(media) {
    const audio = el('audio-player');
    const embed = el('audio-embed');
    el('music-audio').hidden = !media;
    if (audio.hasAttribute('src') && audio.getAttribute('src') !== media?.file) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
    if (embed.firstChild && embed.firstChild.getAttribute('src') !== media?.embed) {
      embed.replaceChildren();
    }
    if (!media) return;

    el('audio-local-controls').hidden = !media.file;
    el('audio-status').hidden = !media.file;
    const license = el('audio-license');
    license.hidden = !media.license;
    if (media.file) {
      if (!audio.hasAttribute('src')) {
        this.audioState = 'idle';
        audio.src = media.file;
      }
      audio.setAttribute('aria-label', this.l(media.title));
      license.href = media.license;
      license.textContent = media.licenseLabel || this.t('license');
      this.renderAudioStatus();
      this.renderAudioProgress();
    } else if (media.embed) {
      if (!embed.firstChild) {
        const frame = node('iframe');
        frame.allow = 'autoplay; encrypted-media';
        frame.src = media.embed;
        embed.append(frame);
      }
      embed.firstChild.title = this.l(media.title);
    }
    el('audio-title').textContent = `${this.l(media.title)} · ${this.l(media.performer)}`;
    el('audio-prompt').hidden = !media.prompt;
    el('audio-prompt').textContent = media.prompt ? this.l(media.prompt) : '';
    el('audio-excerpt').hidden = !media.excerpt;
    el('audio-excerpt').textContent = media.excerpt ? this.l(media.excerpt) : '';
    el('audio-note').textContent = this.l(media.credit);
    el('audio-source').href = media.source;
    el('audio-source').textContent = this.t(media.embed ? 'providerListen' : media.file ? 'source' : 'openPerformance');
  }

  renderAudioProgress() {
    const audio = el('audio-player');
    const progress = el('audio-progress');
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const clock = time => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2,'0')}`;
    progress.disabled = !duration;
    progress.max = duration;
    progress.value = audio.currentTime;
    progress.setAttribute('aria-valuetext', clock(audio.currentTime));
    el('audio-clock').textContent = `${clock(audio.currentTime)} / ${clock(duration)}`;
  }

  renderAudioStatus() {
    const audio = el('audio-player');
    const label = this.t(audio.paused ? 'audioPlay' : 'audioPause');
    el('audio-toggle').textContent = label;
    el('audio-status').textContent = this.audioState === 'error' ? this.t('audioError')
      : this.audioState === 'loading' ? this.t('audioLoading') : '';
  }

  matchesQuery(item, query) {
    const match = value => normalized(value).includes(query);
    if (Object.values(item.title).some(match)) return true;
    if (item.work) {
      if (/^\d+$/.test(query)) return String(item.year) === query;
      return this.matchesQuery(this.recordsById.get(item.work),query);
    }
    const terms = [...item.aliases,...Object.values(item.location?.name || {}),...Object.values(item.people || {}),
      ...Object.values(item.province || {}),...Object.values(item.genre || {}),...Object.values(item.media?.performer || {})];
    return terms.some(match);
  }

  renderSearch() {
    const input = el('music-search');
    const list = el('music-results');
    const query = normalized(input.value);
    list.replaceChildren();
    const open = Boolean(query) && this.searchActive;
    list.hidden = !open;
    input.setAttribute('aria-expanded',String(open));
    if (!open) return;
    const eventMatches = this.region === 'all' && this.filters.has('events') ? this.events.filter(event => this.matchesQuery(event,query)) : [];
    const searchable = this.region === 'all' ? this.records : this.visibleRecords();
    const recordMatchesList = searchable.filter(record => this.filters.has(record.category) && this.matchesQuery(record,query));
    const registryMatches = this.region === 'all' ? this.registry.entries.filter(record=>this.filters.has(record.category) && this.matchesQuery(record,query)) : [];
    for (const item of [...recordMatchesList,...eventMatches,...registryMatches].slice(0,16)) {
      const li = node('li');
      const details = item.registered ? `${this.t(item.category)} · ${this.registryDate(item)}`
        : item.work ? this.yearLabel(item.year) : `${this.t(item.category)} · ${this.l(item.period)}`;
      const label = [this.l(item.title),details];
      const row = button(label[0], () => {
        this.searchActive = false;
        this.selectItem(item,{focus:true});
      }, 'music-row');
      row.append(node('small',label[1]));
      li.append(row);
      list.append(li);
    }
    if (!list.children.length) list.append(node('li',this.t('noResults'),'music-empty'));
  }

  renderGuide() {
    const view = el('music-guide');
    const active = this.guideIndex >= 0;
    el('guide-toggle').setAttribute('aria-pressed',String(active));
    view.hidden = !active;
    if (!active) return;
    const [id,message] = guide[this.guideIndex];
    const entry = this.eventsById.get(id) || this.recordsById.get(id);
    const heading = node('h3',`${this.l(entry.title)} · ${this.guideIndex + 1}/${guide.length}`);
    const controls = node('div', '', 'music-guide-controls');
    const prev = button(this.t('prevGuide'),()=>this.selectGuide(this.guideIndex-1),'action-btn subtle');
    prev.disabled = this.guideIndex === 0;
    const next = this.guideIndex + 1 === guide.length
      ? button(this.t('endGuide'),()=>this.selectGuide(-1),'action-btn subtle')
      : button(this.t('nextGuide'),()=>this.selectGuide(this.guideIndex+1),'action-btn subtle');
    controls.append(prev,next);
    view.replaceChildren(heading,node('p',this.l(message)),controls);
  }

  selectGuide(index) {
    if (index >= 0 && this.region !== 'all') this.selectRegion('all');
    this.guideIndex = index;
    if (index < 0) {
      this.renderGuide();
      return;
    }
    this.stopAutoplay();
    const [id] = guide[index];
    this.selectItem(this.eventsById.get(id) || this.recordsById.get(id),{focus:true});
  }

  step(direction) {
    const cutoff = this.state.year ?? this.year;
    const available = this.filters.has('events') ? this.events.filter(e => this.inRegion(e)) : [];
    const event = direction > 0 ? available.find(event => event.year > cutoff)
      : available.findLast(event => event.year < cutoff);
    if (event) this.selectItem(event);
    return Boolean(event);
  }

  renderPlayback() {
    const play = el('act-autoplay');
    play.setAttribute('aria-pressed',String(this.playing));
    play.setAttribute('aria-label',this.t(this.playing ? 'pause' : 'play'));
    play.title = play.getAttribute('aria-label');
    el('scrubber-dock').classList.toggle('is-autoplaying',this.playing);
    play.textContent = this.playing ? 'Ⅱ' : '▶';
    el('lbl-play-speed').textContent = `${this.playSpeed}×`;
    el('act-play-speed').title = `${this.t('speed')} ${this.playSpeed}×`;
    el('act-play-speed').setAttribute('aria-label',el('act-play-speed').title);
  }

  stopAutoplay() {
    clearTimeout(this.playInterval);
    this.playing = false;
    this.renderPlayback();
  }

  queueNext() {
    clearTimeout(this.playInterval);
    this.playInterval = setTimeout(() => {
      if (!this.step(1)) this.stopAutoplay();
      else this.queueNext();
    },3000 / this.playSpeed);
  }

  toggleAutoplay() {
    if (this.playing) return this.stopAutoplay();
    const first = this.events.find(e => this.inRegion(e));
    if (!this.filters.has('events') || !first) return;
    this.playing = true;
    if (!this.step(1)) this.selectItem(first);
    this.renderPlayback();
    this.queueNext();
  }

  bindControls() {
    for (const control of el('region-nav').querySelectorAll('button')) {
      control.onclick = () => this.selectRegion(control.dataset.region);
    }
    el('locale-zh').onclick = () => this.setLocale('zh');
    el('locale-en').onclick = () => this.setLocale('en');
    el('era-select').onchange = event => this.selectEra(event.target.value);
    el('listening-select').onchange = event => {
      const record = this.recordsById.get(event.target.value);
      event.target.value = '';
      this.stopAutoplay();
      this.selectGuide(-1);
      if (!this.filters.has(record.category)) {
        this.filters.add(record.category);
        this.renderFilters();
      }
      this.selectItem(record, {focus:true});
    };
    el('act-step-prev').onclick = () => { this.stopAutoplay(); this.step(-1); };
    el('act-step-next').onclick = () => { this.stopAutoplay(); this.step(1); };
    el('act-autoplay').onclick = () => this.toggleAutoplay();
    el('act-play-speed').onclick = () => {
      this.playSpeed = speeds[(speeds.indexOf(this.playSpeed) + 1) % speeds.length];
      this.renderPlayback();
      if (this.playing) this.queueNext();
    };
    const yearInput = el('inp-year');
    yearInput.min = this.minYear;
    yearInput.max = this.maxYear;
    const commitYear = () => {
      if (yearInput.value === '') return;
      this.stopAutoplay();
      this.jumpToYear(yearInput.valueAsNumber);
    };
    yearInput.addEventListener('change',commitYear);
    yearInput.addEventListener('keydown',event => { if (event.key === 'Enter') commitYear(); });
    el('scrubber-track').setAttribute('aria-valuemin',this.minYear);
    el('scrubber-track').setAttribute('aria-valuemax',this.maxYear);
    el('scrubber-track').addEventListener('keydown',event => {
      if (event.target !== event.currentTarget || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      this.stopAutoplay();
      const values = {ArrowLeft:this.year-1,ArrowRight:this.year+1,Home:this.minYear,End:this.maxYear};
      this.jumpToYear(values[event.key] || (event.key === 'ArrowLeft' ? -1 : 1));
    });
    el('music-panel-toggle').onclick = () => {
      this.setPanel(el('music-panel-toggle').getAttribute('aria-expanded') !== 'true');
      this.renderCard();
    };
    window.matchMedia('(max-width: 900px)').addEventListener('change', () => this.renderCard());
    el('music-close').onclick = () => { this.selection = null; this.render(); };
    el('guide-toggle').onclick = () => this.selectGuide(this.guideIndex < 0 ? 0 : -1);
    el('registry-open').onclick = () => this.toggleBrowse('registry',el('music-registry').hidden);
    el('regions-open').onclick = () => this.toggleBrowse('regions',el('music-regions').hidden);
    const filterRegistry = () => {
      this.registryRegion = el('registry-region').value;
      this.registryCategory = el('registry-category').value;
      this.registryPage = 0;
      this.renderRegistry();
    };
    el('registry-query').addEventListener('input',filterRegistry);
    el('registry-region').addEventListener('change',filterRegistry);
    el('registry-category').addEventListener('change',filterRegistry);
    for (const [id,step] of [['registry-prev',-1],['registry-next',1]]) {
      el(id).onclick = () => {
        this.registryPage += step;
        this.renderRegistry();
        el('registry-count').scrollIntoView({block:'nearest'});
      };
    }
    const layers = el('layers-popover');
    const layersToggle = el('layers-toggle');
    const setLayers = open => {
      layers.hidden = !open;
      layersToggle.setAttribute('aria-expanded',String(open));
    };
    layersToggle.onclick = () => setLayers(layers.hidden);
    el('terrain-toggle').onchange = event => this.toggleTerrainMode(event.target.checked);
    el('borders-toggle').onchange = event => {
      for (const group of [this.grpPolities,this.grpPolityLabels]) group.classList.toggle('is-hidden',!event.target.checked);
      if (this.lastRenderedSnap) this._renderLegendBox(this.lastRenderedSnap);
    };
    el('cities-toggle').onchange = event => this.grpSettlements.classList.toggle('is-hidden',!event.target.checked);
    const input = el('music-search');
    const activateSearch = () => {
      this.searchActive = true;
      this.renderSearch();
      this.renderMarkers();
    };
    input.addEventListener('input',activateSearch);
    input.addEventListener('focus',activateSearch);
    input.addEventListener('keydown',event => {
      if (event.key === 'ArrowDown' && !el('music-results').hidden) {
        event.preventDefault();
        el('music-results').querySelector('button')?.focus();
      }
      if (event.key === 'Enter') el('music-results').querySelector('button')?.click();
    });
    el('music-results').addEventListener('keydown',event => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      const rows = [...el('music-results').querySelectorAll('button')];
      const index = rows.indexOf(document.activeElement) + (event.key === 'ArrowDown' ? 1 : -1);
      (rows[index] || input).focus();
    });
    document.addEventListener('pointerdown',event => {
      if (this.searchActive && !event.target.closest('#map-search-box,.music-lang,.music-pin')) {
        this.searchActive = false;
        this.renderSearch();
        this.renderMarkers();
      }
      if (!event.target.closest('#layers-popover,#layers-toggle')) setLayers(false);
    });
    window.addEventListener('keydown',event => {
      if (event.key === 'Escape') {
        this.searchActive = false;
        this.renderSearch();
        this.renderMarkers();
        setLayers(false);
      }
      if (event.target.closest?.('input,select,button,a,textarea,summary,[role=button]') || event.altKey || event.metaKey || event.ctrlKey) return;
      if (event.key === ' ') {
        event.preventDefault();
        this.toggleAutoplay();
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        this.stopAutoplay();
        this.step(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    const audio = el('audio-player');
    el('audio-toggle').onclick = async () => {
      if (!audio.paused) {
        audio.pause();
        return;
      }
      try {
        await audio.play();
      } catch (error) {
        if (error.name === 'AbortError') return;
        this.audioState = 'error';
        this.renderAudioStatus();
      }
    };
    el('audio-progress').oninput = event => {audio.currentTime = event.target.valueAsNumber;};
    for (const name of ['durationchange','timeupdate','loadedmetadata','emptied']) {
      audio.addEventListener(name,() => this.renderAudioProgress());
    }
    for (const [name,status] of [['play','loading'],['waiting','loading'],['playing','idle'],['canplay','idle'],['pause','idle'],['ended','idle'],['error','error']]) {
      audio.addEventListener(name,() => {this.audioState = status; this.renderAudioStatus();});
    }
    window.addEventListener('popstate',() => {
      const params = new URLSearchParams(location.search);
      this.setStateFromUrl(params);
      this.setLocale(localePreference(params));
      this._animateCameraTo(this.regionCamera());
    });
    this.bindMapControls();
  }

  bindMapControls() {
    el('zoom-in').onclick = () => this.zoomBy(1.28);
    el('zoom-out').onclick = () => this.zoomBy(1 / 1.28);
    el('act-reset-camera').onclick = () => this._animateCameraTo(this.regionCamera());
    this.svg.addEventListener('wheel',event => {
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? 240 : 1);
      const amount = event.ctrlKey ? delta : Math.max(-220,Math.min(220,delta));
      this.zoomBy(Math.exp(-amount * (event.ctrlKey ? 0.01 : 0.002)),event.clientX,event.clientY,false);
    },{passive:false});
    const pointers = new Map();
    const point = event => [event.clientX,event.clientY];
    const metrics = () => {
      const [a,b] = pointers.values();
      if (!b) return {centre:a,distance:0};
      return {centre:[(a[0]+b[0])/2,(a[1]+b[1])/2],distance:Math.max(10,Math.hypot(a[0]-b[0],a[1]-b[1]))};
    };
    this.svg.addEventListener('pointerdown',event => {
      if (event.button !== 0 || pointers.size >= 2) return;
      this._cancelCameraAnimation();
      pointers.set(event.pointerId,point(event));
      this.svg.setPointerCapture(event.pointerId);
    });
    this.svg.addEventListener('pointermove',event => {
      if (!pointers.has(event.pointerId)) return;
      const before = metrics();
      const anchor = this._clientToSvgPoint(...before.centre);
      pointers.set(event.pointerId,point(event));
      const after = metrics();
      if (after.distance) this.zoomBy(after.distance / before.distance,...before.centre,false);
      const target = this._clientToSvgPoint(...after.centre);
      this.camera = {...this.camera,x:this.camera.x+anchor[0]-target[0],y:this.camera.y+anchor[1]-target[1]};
      this._scheduleCameraUpdate();
    });
    for (const type of ['pointerup','pointercancel','lostpointercapture']) {
      this.svg.addEventListener(type,event => {pointers.delete(event.pointerId);});
    }
    new ResizeObserver(() => this._applyCamera(true)).observe(this.svg);
  }
}

const loading = el('music-loading');
const locale = localePreference(initialParams);
document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
document.title = text('title',locale);
loading.textContent = text('loading',locale);

Promise.all(['data/era-map-config.json','data/music/records.json','data/music/events.json','data/music/sources.json','data/music/registry.json','data/music/regional-comparisons.json','data/music/historical-records.json','data/music/origins.json'].map(async url => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  return response.json();
})).then(args => {
  window.musicAtlas = new MusicAtlas(...args);
}).catch(error => {
  loading.textContent = text('loadError',locale);
  console.error(error);
});
