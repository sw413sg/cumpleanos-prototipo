/* Unforgettables — prototipo clickeable (vanilla JS, sin build).
   Estructura pensada para pasar 1:1 a SwiftUI:
   - Cada función screenX() = una View. stack por pestaña = NavigationStack. overlays = .sheet / .fullScreenCover.
   - Datos de ejemplo relativos a hoy, igual que DemoData.swift. */
(() => {
'use strict';

/* ---------------- Fechas (= BirthdayKit) ---------------- */
const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const TODAY = startOfDay(new Date());
const THIS_YEAR = TODAY.getFullYear();
const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const observed = (m, d, y) => (m === 2 && d === 29 && !isLeap(y)) ? [2, 28] : [m, d];
function nextDate(m, d) {
  let y = THIS_YEAR, [om, od] = observed(m, d, y), dt = new Date(y, om - 1, od);
  if (dt < TODAY) { y++; [om, od] = observed(m, d, y); dt = new Date(y, om - 1, od); }
  return dt;
}
const daysLeft = (m, d) => Math.round((nextDate(m, d) - TODAY) / 864e5);
const turningAge = p => p.y ? nextDate(p.m, p.d).getFullYear() - p.y : null;
const monthDay = (m, d) => `${d} de ${MONTHS[m - 1]}`;
const isRound = age => age != null && age > 0 && (age % 10 === 0 || age === 18);
function subtitle(p) {
  const parts = [monthDay(p.m, p.d)];
  const nd = nextDate(p.m, p.d);
  const [om, od] = observed(p.m, p.d, nd.getFullYear());
  if (om !== p.m || od !== p.d) parts.push(`se festeja el ${od}`);
  const a = turningAge(p);
  if (a && a > 0) parts.push(a === 1 ? 'cumple 1 año' : `cumple ${a} años`);
  return parts.join(' · ');
}
function rel(n) { const d = new Date(TODAY); d.setDate(d.getDate() + n); return [d.getMonth() + 1, d.getDate()]; }
// Día de la Madre en Argentina: tercer domingo de octubre
function diaDeLaMadre() {
  let y = THIS_YEAR;
  const calc = yy => { const d = new Date(yy, 9, 1); const first = (7 - d.getDay()) % 7 + 1; return new Date(yy, 9, first + 14); };
  let dt = calc(y); if (dt < TODAY) dt = calc(y + 1);
  return [dt.getMonth() + 1, dt.getDate()];
}

/* ---------------- Íconos (≈ SF Symbols) ---------------- */
const P = {
  chev: '<path d="M9 5l7 7-7 7"/>',
  back: '<path d="M15 3.5L6.5 12 15 20.5"/>',
  plus: '<path d="M12 4.5v15M4.5 12h15"/>',
  gift: '<rect x="3.5" y="8" width="17" height="4.5" rx="1"/><path d="M5 12.5v7.5h14v-7.5M12 8v12M12 8S10.5 3.5 8 4.2C6 4.8 7 8 12 8zm0 0s1.5-4.5 4-3.8C18 4.8 17 8 12 8z"/>',
  cake: '<path d="M4 20.5h16M5 20.5V13a2 2 0 012-2h10a2 2 0 012 2v7.5M5 15.5c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 5 0M12 11V7.5M12 5.5c-.9-.8-.9-1.9 0-3 .9 1.1.9 2.2 0 3z"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 2h-15zM10 20.5a2 2 0 004 0"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7.5a4 4 0 018 0V11"/>',
  widgets: '<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="2"/><rect x="3.5" y="13" width="17" height="7.5" rx="2"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>',
  check: '<path d="M4.5 12.5l5 5 10-11"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
  checkCircle: '<circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff"/>',
  minusCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.3 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z"/>',
  briefcase: '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V5.5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 5.5v2M3.5 13h17"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.7 5.5 3.7 9s-1.2 6.5-3.7 9c-2.5-2.5-3.7-5.5-3.7-9S9.5 5.5 12 3z"/>',
  people: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.6c2.4.2 4 1.7 4.5 4.4"/>',
  sparkles: '<path d="M10 3.5l1.6 4.6 4.6 1.6-4.6 1.6L10 16l-1.6-4.7-4.6-1.6 4.6-1.6zM17.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  message: '<path d="M12 4C7 4 3.5 7.2 3.5 11c0 2 1 3.8 2.6 5.1L5.5 20l4-1.9c.8.2 1.6.3 2.5.3 5 0 8.5-3.2 8.5-7.2S17 4 12 4z"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 014.5 5.5a2 2 0 012-2z"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0012 3z"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  photo: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-8.5 8"/>',
  trash: '<path d="M4.5 6.5h15M9.5 6.5V4.5h5v2M6.5 6.5l1 13.5h9l1-13.5"/>',
  moon: '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',
  download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M4.5 19.5h15"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>',
  share: '<path d="M12 3.5v11M8 7.5l4-4 4 4M7 10.5H5.5v10h13v-10H17"/>',
  restore: '<path d="M4 12a8 8 0 102.3-5.6M4 4v4h4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/>',
  warn: '<path d="M12 4l9 15.5H3zM12 10v4.5M12 17v.1"/>',
  paint: '<path d="M12 3.5a8.5 8.5 0 100 17c1.2 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.2-2.2H17a3.5 3.5 0 003.5-3.5c0-5.2-3.8-9.5-8.5-9.5z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7.3" r="1.2"/><circle cx="14.5" cy="7.3" r="1.2"/>',
  lockscreen: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 7h4"/><rect x="9" y="11" width="6" height="5" rx="1"/>',
  hourglass: '<path d="M6.5 3.5h11M6.5 20.5h11M7.5 3.5c0 5 4.5 5.5 4.5 8.5s-4.5 3.5-4.5 8.5M16.5 3.5c0 5-4.5 5.5-4.5 8.5s4.5 3.5 4.5 8.5"/>',
  listBullet: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.5" cy="6.5" r=".6"/><circle cx="4.5" cy="12" r=".6"/><circle cx="4.5" cy="17.5" r=".6"/>',
  noAds: '<path d="M4 10v4h3l7 4V6l-7 4z"/><path d="M17.5 9.5a3.5 3.5 0 010 5"/><path d="M3.5 3.5l17 17"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
};
const ic = (n, cls = '', sw = 1.8) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
const chev = () => `<svg class="chev" viewBox="0 0 8 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5L6.5 7l-5 5.5"/></svg>`;
const backChev = () => `<svg viewBox="0 0 13 21" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2L2.5 10.5 11 19"/></svg>`;
const NO_ADS = { t: 'Sin publicidad', s: 'Hacemos un esfuerzo extra en mantener la app libre de ads' };
const lockBadge = (txt = 'Unlock') => `<span class="lock-badge">${ic('lock', '', 2.4)}${txt}</span>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------------- Datos de ejemplo ---------------- */
const GRADS = [['#ff9a8b', '#ff6a88'], ['#5ee7df', '#3b8edb'], ['#f6d365', '#fda085'], ['#a18cd1', '#7b5fd6'], ['#84fab0', '#2fb380'], ['#fbc2eb', '#c56cd6'], ['#ffb199', '#ff0844'], ['#89f7fe', '#66a6ff'], ['#c3cfe2', '#8a96ad'], ['#fddb92', '#e0a43a']];
function demoPeople() {
  const P2 = (o) => Object.assign({ gustos: [], gifts: [], ideas: [], notes: '', work: false, tz: null, remind: null, photo: false }, o);
  const r = rel;
  return [
    P2({ id: 'mora', name: 'Mora Díaz', m: r(0)[0], d: r(0)[1], y: 1994, photo: true, gustos: ['Café de especialidad', 'Plantas', 'Taylor Swift', 'Cerámica'],
      gifts: [{ year: THIS_YEAR - 1, what: 'Taza de cerámica artesanal' }, { year: THIS_YEAR - 2, what: 'Entradas para el teatro' }],
      ideas: [{ what: 'Vinilo de Taylor Swift', src: 'Guardada desde Mercado Libre' }] }),
    P2({ id: 'teo', name: 'Teo Ruiz', m: r(1)[0], d: r(1)[1], y: 2015, gustos: ['Lego', 'River', 'Dinosaurios'], gifts: [{ year: THIS_YEAR - 1, what: 'Lego Technic' }], notes: 'Sobrino. Talle 12.' }),
    P2({ id: 'nelly', name: 'Abuela Nelly', m: r(9)[0], d: r(9)[1], y: THIS_YEAR - 80 + (nextDate(r(9)[0], r(9)[1]).getFullYear() - THIS_YEAR), gustos: ['Tejer', 'Isabel Allende', 'Alfajores Havanna'],
      gifts: [{ year: THIS_YEAR - 1, what: 'Ovillos de lana merino' }, { year: THIS_YEAR - 2, what: 'Libro "Violeta"' }] }),
    P2({ id: 'fede', name: 'Fede Martínez', m: r(23)[0], d: r(23)[1], y: 1996, work: true, gustos: ['Running', 'Asado', 'Vino malbec'], notes: 'Compañero de equipo. Le gusta el fernet.' }),
    P2({ id: 'nina', name: 'Nina Costa', m: r(40)[0], d: r(40)[1], tz: 'Madrid', gustos: ['Viajes', 'Fotografía'] }),
    P2({ id: 'caro', name: 'Caro Gómez', m: r(65)[0], d: r(65)[1], y: 1993, gustos: ['Series coreanas', 'Yoga', 'Sushi', 'Chocolate amargo'],
      gifts: [{ year: THIS_YEAR - 1, what: 'Clase de cerámica para dos' }, { year: THIS_YEAR - 2, what: 'Mat de yoga' }] }),
    P2({ id: 'ana', name: 'Ana García', m: r(120)[0], d: r(120)[1], y: 1990 }),
    P2({ id: 'martin', name: 'Martín Sosa', m: r(150)[0], d: r(150)[1], y: 1981, work: true, notes: 'Jefe. Fan de Boca, no regalar nada de River.' }),
    P2({ id: 'luis', name: 'Luis Pérez', m: 2, d: 29, y: 2000, gustos: ['Fútbol 5', 'PlayStation'] }),
    P2({ id: 'juli', name: 'Juli Fernández', m: r(200)[0], d: r(200)[1], y: 1999 }),
  ];
}
function demoSpecials() {
  const dm = diaDeLaMadre();
  return [
    { id: 'madre', name: 'Día de la Madre', m: dm[0], d: dm[1], kind: 'Fecha del año', emoji: '💐' },
    { id: 'aniv', name: 'Aniversario con Caro', m: rel(52)[0], d: rel(52)[1], y: THIS_YEAR - 4, kind: 'Aniversario', emoji: '💞' },
    { id: 'casa', name: 'Casamiento de Sofi y Nico', m: rel(30)[0], d: rel(30)[1], kind: 'Casamiento', emoji: '💍' },
    { id: 'amigo', name: 'Día del Amigo', m: 7, d: 20, kind: 'Fecha del año', emoji: '🤝' },
  ];
}
const CONTACTS = [
  { id: 'c1', name: 'Mora Díaz', dup: true }, { id: 'c2', name: 'Pato Benítez', n: 12, y: 1988, photo: true }, { id: 'c3', name: 'Sofi Romero', n: 33 },
  { id: 'c4', name: 'Tío Carlos', n: 58, y: 1966 }, { id: 'c5', name: 'Lucía Herrera', n: 96, y: 2001, photo: true }, { id: 'c6', name: 'Teo Ruiz', dup: true },
  { id: 'c7', name: 'Gonza Acosta', n: 171, y: 1992 }, { id: 'c8', name: 'Vicky Molina', n: 244, y: 1997 }, { id: 'c9', name: 'Ramiro Paz', n: 301 },
].map(c => { if (c.dup) { const pp = demoPeople().find(p => p.name === c.name); return { ...c, m: pp.m, d: pp.d, y: pp.y }; } const [m, d] = rel(c.n); return { ...c, m, d }; });
// La agenda completa: muchos contactos no tienen cumpleaños cargado y se lo asignás al agregarlos
const AGENDA = [...CONTACTS, { id: 'n1', name: 'Agus Ferreyra', photo: true }, { id: 'n2', name: 'Caro Méndez' }, { id: 'n3', name: 'Juli Sosa' }, { id: 'n4', name: 'Mati Quiroga', photo: true }, { id: 'n5', name: 'Pili Ortega' }]
  .sort((a, b) => a.name.localeCompare(b.name, 'es'));

const SUGGESTIONS = {
  _default: ['Gift card de una librería', 'Experiencia: clase de cocina', 'Una planta linda con maceta', 'Vino con nota escrita a mano'],
  mora: [['Kit de café: prensa francesa + 250 g de especialidad', 'Café de especialidad', 'ARS 38.000'], ['Monstera chica con maceta de cerámica', 'Plantas', 'ARS 25.000'], ['Entradas para el teatro', 'Experiencias', 'ARS 30.000'], ['Taller de torno de cerámica', 'Cerámica', 'ARS 45.000']],
  teo: [['Lego Jurassic World', 'Lego · Dinosaurios', 'ARS 60.000'], ['Camiseta de River 2026', 'River', 'ARS 75.000'], ['Libro de dinosaurios con realidad aumentada', 'Dinosaurios', 'ARS 22.000']],
  nelly: [['Caja de alfajores Havanna x12', 'Alfajores Havanna', 'ARS 28.000'], ['"El viento conoce mi nombre", de Isabel Allende', 'Isabel Allende', 'ARS 24.000'], ['Kit de agujas de bambú', 'Tejer', 'ARS 15.000']],
  caro: [['Box de sushi para dos', 'Sushi', 'ARS 40.000'], ['Clase de yoga al aire libre', 'Yoga', 'ARS 20.000'], ['Chocolates amargos Rapanui', 'Chocolate amargo', 'ARS 18.000']],
  fede: [['Malbec de Valle de Uco', 'Vino malbec', 'ARS 30.000'], ['Riñonera para correr', 'Running', 'ARS 19.000']],
};

/* ---------------- Estado ---------------- */
const LS = 'ub-proto-v1';
const saved = (() => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } })();
const S = {
  unlocked: !!saved.unlocked,
  theme: saved.theme || 'system',
  people: saved.people || demoPeople(),
  specials: saved.specials || demoSpecials(),
  rem: saved.rem || { on: true, time: '09:00', before: 3, sameDay: true, round: true, roundBefore: 30, localTz: false },
  work: saved.work || { on: true, section: true },
  widgetTheme: saved.widgetTheme || 'classic',
  tab: 'list',
  stacks: { list: [{ s: 'list' }], gifts: [{ s: 'gifts' }], widgets: [{ s: 'widgets' }], settings: [{ s: 'settings' }] },
  overlays: [], dialog: null, toast: null,
  search: '', listMode: 'all', giftsMode: 'history',
  listView: saved.listView || 'list', calY: TODAY.getFullYear(), calM: TODAY.getMonth() + 1, calD: null,
  pushed: false,
};
function persist() {
  localStorage.setItem(LS, JSON.stringify({ unlocked: S.unlocked, theme: S.theme, people: S.people, specials: S.specials, rem: S.rem, work: S.work, widgetTheme: S.widgetTheme, listView: S.listView }));
}
const person = id => S.people.find(p => p.id === id);
const gradFor = id => GRADS[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % GRADS.length];
const initials = n => n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
function avatar(p, cls = '') {
  if (p.photo) return `<div class="avatar photo ${cls}" style="background-image:${photoBg(p)}">${cls.includes('lg') ? '' : ''}</div>`;
  const [a, b] = gradFor(p.id);
  return `<div class="avatar ${cls}" style="background:linear-gradient(160deg,${a},${b})">${esc(initials(p.name))}</div>`;
}
// "Foto" de ejemplo generada con CSS (sin imágenes externas)
const photoBg = p => `radial-gradient(circle at 50% 38%, #ffe0c2 0 18%, transparent 19%), radial-gradient(ellipse at 50% 100%, #e7697a 0 42%, transparent 43%), radial-gradient(circle at 50% 30%, #5a3825 0 27%, transparent 28%), linear-gradient(160deg, #ffd6a5, #ffadad 60%, #bdb2ff)`;

/* ---------------- Navegación ---------------- */
const stack = () => S.stacks[S.tab];
function push(scr) { stack().push(scr); S.pushed = true; render(); }
function pop() { if (stack().length > 1) stack().pop(); render(); }
function present(o) { o.fresh = true; S.overlays.push(o); render(); }
function dismiss() { S.overlays.pop(); render(); }
function toast(msg, emoji = '✅') { S.toast = { msg, emoji, fresh: true }; render(); clearTimeout(toast.t); toast.t = setTimeout(() => { S.toast = null; render(); }, 2200); }
function needUnlock(feature) { if (S.unlocked) return false; present({ s: 'paywall', feature }); return true; }

/* ---------------- Componentes ---------------- */
function navbar({ left = '', right = '', title = '', large = '', blur = false }) {
  return `<div class="navbar ${blur ? 'blur' : ''}"><div class="navrow"><div>${left}</div>${title ? `<div class="title-inline">${esc(title)}</div>` : ''}<div class="nav-right">${right}</div></div>${large ? `<div class="large-title">${esc(large)}</div>` : ''}</div>`;
}
const backBtn = (label) => `<button class="navbtn back" data-a="pop">${backChev()}${esc(label)}</button>`;
const section = (body, { header = '', footer = '', big = false, cls = '' } = {}) =>
  `<div class="section ${cls}">${header ? `<div class="section-header ${big ? 'big' : ''}">${header}</div>` : ''}<div class="group">${body}</div>${footer ? `<div class="section-footer">${footer}</div>` : ''}</div>`;
const toggle = (on, a, extra = '') => `<button class="toggle ${on ? 'on' : ''}" data-a="${a}" ${extra} role="switch" aria-checked="${on}"></button>`;
function navRow({ icon, color, title, value = '', a, extra = '', badge = '', sub = '' }) {
  return `<button class="row ${icon ? 'has-icon' : ''}" data-a="${a}" ${extra}>${icon ? `<span class="icon-sq" style="background:${color}">${ic(icon, '', 2)}</span>` : ''}<span class="grow">${title}${sub ? `<div class="sub">${sub}</div>` : ''}</span>${badge}${value ? `<span class="value">${value}</span>` : ''}${chev()}</button>`;
}
function countdown(n) {
  if (n === 0) return `<div class="countdown today">Hoy</div>`;
  // Desde 2 meses completos, se muestra en meses: "+2 meses", "+3 meses"…
  const t = new Date(TODAY); t.setDate(t.getDate() + n);
  const months = (t.getFullYear() - TODAY.getFullYear()) * 12 + t.getMonth() - TODAY.getMonth() - (t.getDate() < TODAY.getDate() ? 1 : 0);
  if (months >= 2) return `<div class="countdown"><div class="n">+${months}</div><div class="u">meses</div></div>`;
  return `<div class="countdown"><div class="n">${n}</div><div class="u">${n === 1 ? 'día' : 'días'}</div></div>`;
}
// Ícono de la fila en la lista: círculo con torta (cumpleaños) o corazón (fecha especial)
const HEART_GLYPH = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20.5s-7.8-4.7-7.8-10.6A4.4 4.4 0 0112 7.2a4.4 4.4 0 017.8 2.7c0 5.9-7.8 10.6-7.8 10.6z"/></svg>';
function cakeIcon(p) {
  const [a, b] = gradFor(p.id);
  return `<div class="avatar glyph" style="background:linear-gradient(160deg,${a},${b})">${ic('cake', '', 2)}</div>`;
}
const heartIcon = () => `<div class="avatar glyph" style="background:linear-gradient(160deg,#d6a4ff,#9b51e0)">${HEART_GLYPH}</div>`;
function personRow(p) {
  const n = daysLeft(p.m, p.d), age = turningAge(p);
  const badges = (isRound(age) && S.rem.round ? `<span class="badge round">🎉 ${age}</span> ` : '') + (p.work && S.unlocked ? `<span class="badge work">Trabajo</span>` : '');
  return `<button class="row person" data-a="open" data-id="${p.id}">${cakeIcon(p)}<span class="grow"><div class="title-semibold">${esc(p.name)} ${badges}</div><div class="sub">${esc(subtitle(p))}</div></span>${countdown(n)}</button>`;
}
function specialRow(sp) {
  const n = daysLeft(sp.m, sp.d);
  const yrs = sp.y ? nextDate(sp.m, sp.d).getFullYear() - sp.y : null;
  return `<button class="row person" data-a="openSpecial" data-id="${sp.id}">${heartIcon()}<span class="grow"><div class="title-semibold">${esc(sp.name)} <span class="badge special">${esc(sp.kind)}</span></div><div class="sub">${monthDay(sp.m, sp.d)}${yrs ? ` · ${yrs} años` : ''}</div></span>${countdown(n)}</button>`;
}

/* ---------------- Pantallas: Cumpleaños ---------------- */
function screenList() {
  const q = S.search.trim().toLowerCase();
  let people = [...S.people].sort((a, b) => daysLeft(a.m, a.d) - daysLeft(b.m, b.d) || a.name.localeCompare(b.name, 'es'));
  if (q) people = people.filter(p => p.name.toLowerCase().includes(q));
  const showWorkSeparate = S.unlocked && S.work.on && S.work.section && S.listMode === 'all';
  const workPeople = showWorkSeparate ? people.filter(p => p.work) : [];
  let main = showWorkSeparate ? people.filter(p => !p.work) : people;
  if (S.unlocked && !S.work.on) main = main.filter(p => !p.work);
  const specials = (S.unlocked && S.listMode !== 'birthdays') ? [...S.specials].filter(s => !q || s.name.toLowerCase().includes(q)) : [];
  const items = S.listMode === 'specials' ? [] : main.map(p => ({ p, n: daysLeft(p.m, p.d) }));
  const all = [...items, ...specials.map(sp => ({ sp, n: daysLeft(sp.m, sp.d) }))].sort((a, b) => a.n - b.n);
  const today = S.people.filter(p => daysLeft(p.m, p.d) === 0);
  const rowOf = it => it.p ? personRow(it.p) : specialRow(it.sp);
  const soon = all.filter(i => i.n <= 30), later = all.filter(i => i.n > 30);

  let body = '';
  if (!S.people.length) {
    body = `<div class="empty">${ic('gift')}<h3>Sin cumpleaños</h3><p>Agregá una persona o importá los cumpleaños que ya están en Contactos.</p><button class="btn-link" data-a="add">Agregar persona</button><button class="btn-link" data-a="import">Importar contactos</button></div>`;
  } else {
    if (S.listView === 'list') body += `<label class="search">${ic('search', '', 2.2)}<input id="search" type="search" placeholder="Buscar" value="${esc(S.search)}" autocomplete="off"></label>`;
    body += `<div class="segmented">
      <button class="${S.listMode === 'all' ? 'sel' : ''}" data-a="listMode" data-v="all">Todos</button>
      <button class="${S.listMode === 'birthdays' ? 'sel' : ''}" data-a="listMode" data-v="birthdays">Cumpleaños</button>
      <button class="${S.listMode === 'specials' ? 'sel' : ''}" data-a="listMode" data-v="specials">Fechas${S.unlocked ? '' : ic('lock', '', 2.6)}</button></div>`;
    if (S.listView === 'calendar') body += calendarBody();
    else {
      if (today.length && !q && S.listMode !== 'specials') {
        const t = today[0], age = turningAge(t);
        body += `<button class="hero" data-a="open" data-id="${t.id}"><div class="confetti"></div>${avatar(t)}<div><div class="t1">🎂 Hoy es el cumple de</div><div class="t2">${esc(t.name)}</div><div class="t3">${age ? `Cumple ${age} años · ` : ''}Mandale un mensaje</div></div></button>`;
      }
      const spToday = S.listMode === 'birthdays' || q ? [] : specials.filter(sp => daysLeft(sp.m, sp.d) === 0);
      if (spToday.length) {
        const sp = spToday[0], yrs = sp.y ? TODAY.getFullYear() - sp.y : null;
        body += `<button class="hero special" data-a="openSpecial" data-id="${sp.id}"><div class="hearts"></div><div class="avatar">${sp.emoji || '💜'}</div><div><div class="t1">Hoy es</div><div class="t2">${esc(sp.name)}</div><div class="t3">${esc(sp.kind)}${yrs ? ` · ${yrs} ${yrs === 1 ? 'año' : 'años'}` : ''}</div></div></button>`;
      }
      if (soon.length) body += section(soon.map(rowOf).join(''), { header: 'Próximos 30 días' });
      if (later.length) body += section(later.map(rowOf).join(''), { header: 'Más adelante' });
      if (workPeople.length) body += section(workPeople.map(personRow).join(''), { header: 'Trabajo', footer: 'Modo trabajo: tus contactos laborales separados, con notas. Lo cambiás en Ajustes.' });
      if (!all.length && !workPeople.length) body += `<div class="empty">${ic('search')}<h3>Sin resultados</h3><p>No hay nadie que se llame “${esc(S.search)}”.</p></div>`;
      if (!S.unlocked && S.listMode === 'all' && !q) {
        body += section(`<button class="row has-icon" data-a="paywall" data-f="specials"><span class="icon-sq" style="background:#af52de">${ic('heart', '', 2)}</span><span class="grow">Fechas especiales<div class="sub">Casamientos, aniversarios, Día de la Madre y más</div></span>${lockBadge()}</button>`);
      }
    }
  }
  return `<div class="screen" data-key="list">${navbar({ left: `<button class="navbtn" data-a="import">Importar</button>`, right: `<button class="navbtn" data-a="listView" aria-label="${S.listView === 'calendar' ? 'Ver como lista' : 'Ver como calendario'}">${ic(S.listView === 'calendar' ? 'listBullet' : 'calendar', '', 2)}</button><button class="navbtn" data-a="add" aria-label="Agregar persona">${ic('plus', '', 2.2)}</button>` })}<div class="scroll" data-key="list-scroll"><div class="large-title">Unforgettables</div>${body}</div></div>`;
}

// Vista calendario de la lista (SwiftUI: LazyVGrid de 7 columnas + List del día elegido)
const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
// Forma detrás del número: torta = cumpleaños, corazón = fecha especial (SwiftUI: Shape propia)
const CAL_CAKE = '<svg class="shape" viewBox="0 0 40 40" aria-hidden="true"><path class="flame" d="M20 1.5c1.6 1.7 1.6 3.3 0 4.5-1.6-1.2-1.6-2.8 0-4.5z"/><path d="M20 6.5v3.5"/><path d="M8 10h24a3.5 3.5 0 013.5 3.5V31H4.5V13.5A3.5 3.5 0 018 10z"/><path d="M4.5 13.5q2.6 3 5.2 0t5.2 0 5.2 0 5.2 0 5.2 0 5.2 0"/><path d="M2.5 31h35"/></svg>';
const CAL_HEART = '<svg class="shape" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 35C9 28 3 22 3 14.5 3 9.8 6.6 6.5 11 6.5c3.8 0 6.6 2.3 9 5.5 2.4-3.2 5.2-5.5 9-5.5 4.4 0 8 3.3 8 8 0 7.5-6 13.5-17 20.5z"/></svg>';
const DAYNAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function calendarItems(y, m) {
  // Qué se festeja cada día de ese mes (el 29/2 cae el 28 en años no bisiestos)
  const byDay = {};
  const add = (d, it) => (byDay[d] = byDay[d] || []).push(it);
  let people = S.listMode === 'specials' ? [] : S.people;
  if (S.unlocked && !S.work.on) people = people.filter(p => !p.work);
  for (const p of people) { const [om, od] = observed(p.m, p.d, y); if (om === m) add(od, { p }); }
  if (S.unlocked && S.listMode !== 'birthdays') for (const sp of S.specials) if (sp.m === m) add(sp.d, { sp });
  for (const d in byDay) byDay[d].sort((a, b) => (a.p ? a.p.name : a.sp.name).localeCompare(b.p ? b.p.name : b.sp.name, 'es'));
  return byDay;
}
function calendarBody() {
  const y = S.calY, m = S.calM, byDay = calendarItems(y, m);
  const days = new Date(y, m, 0).getDate(), lead = (new Date(y, m - 1, 1).getDay() + 6) % 7;
  const isThisMonth = y === TODAY.getFullYear() && m === TODAY.getMonth() + 1;
  let cells = '<span></span>'.repeat(lead);
  for (let d = 1; d <= days; d++) {
    const items = byDay[d] || [], wknd = (lead + d - 1) % 7 >= 5;
    const cls = ['cal-day', wknd ? 'wknd' : '', isThisMonth && d === TODAY.getDate() ? 'today' : '', d === S.calD ? 'sel' : '', items.some(it => it.p) ? 'has' : items.length ? 'has-sp' : ''].join(' ');
    const shape = items.some(it => it.p) ? CAL_CAKE : items.length ? CAL_HEART : '';
    cells += `<button class="${cls}" data-a="calDay" data-d="${d}" aria-label="${d} de ${MONTHS[m - 1]}${items.length ? `, ${items.length} ${items.length === 1 ? 'fecha' : 'fechas'}` : ''}">${shape}<span class="n">${d}</span>${isThisMonth && d === TODAY.getDate() ? '<span class="hoy">Hoy</span>' : ''}</button>`;
  }
  const total = Object.values(byDay).flat().filter(it => it.p).length;
  let h = `<div class="cal"><div class="cal-head"><button class="cal-arrow" data-a="calMove" data-v="-1" aria-label="Mes anterior">${ic('back', '', 2.4)}</button><div class="cal-title"><div class="m">${cap(MONTHS[m - 1])}</div><div class="y">${y}</div></div><button class="cal-arrow" data-a="calMove" data-v="1" aria-label="Mes siguiente">${ic('back', 'flip', 2.4)}</button></div>`;
  h += `<div class="cal-grid">${WEEKDAYS.map((w, i) => `<span class="cal-wd ${i >= 5 ? 'wknd' : ''}">${w}</span>`).join('')}${cells}</div>`;
  h += `<div class="cal-foot">${total ? `${total} ${total === 1 ? 'cumpleaños' : 'cumpleaños'} en ${MONTHS[m - 1]}` : `Nadie cumple en ${MONTHS[m - 1]}`}${isThisMonth ? '' : ` · <button data-a="calToday">Ir a hoy</button>`}</div></div>`;
  const sel = S.calD && S.calD <= days ? S.calD : null;
  if (sel) {
    const items = byDay[sel] || [], dt = new Date(y, m - 1, sel);
    const header = `${DAYNAMES[dt.getDay()]} ${sel} de ${MONTHS[m - 1]}`;
    h += items.length ? section(items.map(it => it.p ? personRow(it.p) : specialRow(it.sp)).join(''), { header })
      : section(`<button class="row accent" data-a="addOnDay">${ic('plus', 'check', 2.2)}Agregar un cumple este día</button>`, { header, footer: 'Nadie cumple este día.' });
    h += `<div style="text-align:center;margin:-14px 0 24px"><button class="navbtn" data-a="calDay" data-d="${sel}">Ver todo ${MONTHS[m - 1]}</button></div>`;
  } else {
    const all = Object.keys(byDay).map(Number).sort((a, b) => a - b).flatMap(d => byDay[d]);
    if (all.length) h += section(all.map(it => it.p ? personRow(it.p) : specialRow(it.sp)).join(''), { header: `Todo ${MONTHS[m - 1]}`, footer: 'Tocá un día para ver solo ese.' });
  }
  return h;
}

function screenDetail(id) {
  const p = person(id); if (!p) return screenList();
  const n = daysLeft(p.m, p.d), age = turningAge(p);
  const giftCount = p.gifts.length;
  let h = `<div class="detail-head">${avatar(p, 'lg')}<h2>${esc(p.name)}</h2><div class="sub">${esc(subtitle(p))}</div></div>`;
  h += `<div class="stats"><div class="stat"><div class="n ${n === 0 ? 'accent' : ''}">${n === 0 ? 'Hoy' : n}</div><div class="l">${n === 0 ? '¡es su cumple!' : n === 1 ? 'día' : 'días'}</div></div><div class="stat"><div class="n">${age ?? '–'}</div><div class="l">${age ? 'años cumple' : 'sin año'}</div></div><div class="stat"><div class="n">${giftCount}</div><div class="l">${giftCount === 1 ? 'regalo' : 'regalos'}</div></div></div>`;
  h += `<div class="quick"><button data-a="fake" data-msg="Abriría WhatsApp con un saludo armado">${ic('message')}Saludar</button><button data-a="fake" data-msg="Abriría el teléfono para llamar">${ic('phone')}Llamar</button><button data-a="addGift" data-id="${p.id}">${ic('gift')}Regalo</button><button data-a="addIdea" data-id="${p.id}">${ic('bulb')}Idea</button></div>`;
  if (isRound(age) && S.rem.round) {
    const roundTxt = S.rem.roundBefore === 30 ? '1 mes' : S.rem.roundBefore === 60 ? '2 meses' : '2 semanas';
    h += `<div class="banner"><div class="emoji">🎉</div><div><div class="t">¡Cumple ${age}! Es un cumple redondo</div><div class="s">Te avisamos ${roundTxt} antes para que organices algo grande.</div></div></div>`;
  }
  // Recordatorio
  const remTxt = p.remind == null ? `${beforeLabel(S.rem.before)} (general)` : beforeLabel(p.remind);
  let rem = navRow({ icon: 'bell', color: '#ff3b30', title: 'Aviso', value: esc(remTxt), a: 'remindPerson', extra: `data-id="${p.id}"` });
  rem += `<button class="row has-icon" data-a="tzPerson" data-id="${p.id}"><span class="icon-sq" style="background:#007aff">${ic('globe', '', 2)}</span><span class="grow">A la hora de su país</span>${S.unlocked ? `<span class="value">${p.tz ? esc(p.tz) : 'Igual que vos'}</span>${chev()}` : lockBadge()}</button>`;
  h += section(rem, { header: 'Recordatorio', footer: p.tz && S.unlocked ? `${esc(p.name.split(' ')[0])} vive en ${esc(p.tz)}: el aviso del día te llega cuando allá ya es su cumple.` : '' });
  // Gustos
  h += section(`<div class="chips">${p.gustos.map((g, i) => `<span class="chip">${esc(g)}</span>`).join('')}<button class="chip add" data-a="addGusto" data-id="${p.id}">＋ Agregar</button></div>`, { header: 'Gustos', footer: p.gustos.length ? '' : 'Anotá qué le gusta: te sirve para elegir regalos.' });
  // Historial
  const gifts = [...p.gifts].sort((a, b) => b.year - a.year);
  h += section(gifts.map(g => `<div class="row"><span class="grow">${esc(g.what)}</span><span class="value">${g.year}</span></div>`).join('') +
    `<button class="row accent" data-a="addGift" data-id="${p.id}">${ic('plus', 'check', 2.2)}Agregar regalo</button>`, { header: 'Historial de regalos', footer: 'Si le querés regalar algo repetido, te avisamos.' });
  // Ideas + sugerencias (pago)
  if (S.unlocked) {
    const ideas = p.ideas.map(i => `<div class="row"><span class="grow">${esc(i.what)}<div class="sub">${esc(i.src || 'Idea guardada')}</div></span></div>`).join('');
    h += section(ideas + navRow({ icon: 'sparkles', color: '#ff9500', title: `Sugerencias para ${esc(p.name.split(' ')[0])}`, a: 'suggest', extra: `data-id="${p.id}"` }) +
      `<button class="row accent" data-a="addIdea" data-id="${p.id}">${ic('plus', 'check', 2.2)}Agregar idea</button>`, { header: 'Ideas de regalo', footer: 'También podés guardar ideas desde Safari o Mercado Libre con el botón Compartir.' });
  } else {
    h += section(`<button class="row has-icon" data-a="paywall" data-f="ideas"><span class="icon-sq" style="background:#ff9500">${ic('sparkles', '', 2)}</span><span class="grow">Sugerencias e ideas de regalo<div class="sub">Según sus gustos, y guardadas desde Compartir</div></span>${lockBadge()}</button>`, { header: 'Ideas de regalo' });
  }
  if (p.notes && (!p.work || S.unlocked)) h += section(`<div class="row"><span class="grow">${esc(p.notes)}</span></div>`, { header: p.work ? 'Notas · Trabajo' : 'Notas' });
  return `<div class="screen ${S.pushed ? 'push-in' : ''}" data-key="detail">${navbar({ left: backBtn('Unforgettables'), right: `<button class="navbtn" data-a="edit" data-id="${p.id}">Editar</button>`, blur: true })}<div class="scroll" data-key="detail-${p.id}">${h}</div></div>`;
}
const beforeLabel = n => n === 0 ? 'Solo el mismo día' : n === 1 ? '1 día antes' : n === 7 ? '1 semana antes' : n === 14 ? '2 semanas antes' : `${n} días antes`;

function screenSpecial(id) {
  const sp = S.specials.find(s => s.id === id);
  const n = daysLeft(sp.m, sp.d);
  let h = `<div class="detail-head"><div class="avatar lg" style="background:linear-gradient(160deg,#d6a4ff,#9b51e0);font-size:44px">${sp.emoji}</div><h2>${esc(sp.name)}</h2><div class="sub">${monthDay(sp.m, sp.d)} · ${esc(sp.kind)}</div></div>`;
  h += `<div class="stats"><div class="stat"><div class="n">${n === 0 ? 'Hoy' : n}</div><div class="l">${n === 1 ? 'día' : 'días'}</div></div>${sp.y ? `<div class="stat"><div class="n">${nextDate(sp.m, sp.d).getFullYear() - sp.y}</div><div class="l">años</div></div>` : ''}</div>`;
  h += section(navRow({ icon: 'bell', color: '#ff3b30', title: 'Aviso', value: `${beforeLabel(S.rem.before)} (general)`, a: 'fake', extra: 'data-msg="Mismo selector que en cada persona"' }), { header: 'Recordatorio' });
  h += section(`<button class="row destructive" data-a="fake" data-msg="Se eliminaría la fecha">Eliminar fecha</button>`);
  return `<div class="screen ${S.pushed ? 'push-in' : ''}">${navbar({ left: backBtn('Unforgettables'), blur: true })}<div class="scroll">${h}</div></div>`;
}

function screenSuggest(id) {
  const p = person(id);
  const list = SUGGESTIONS[id] || SUGGESTIONS._default.map(t => [t, 'General', '']);
  const given = p.gifts.map(g => g.what.toLowerCase());
  const rows = list.map(([what, why, price], i) => {
    const prev = p.gifts.find(g => similar(g.what, what));
    const savedIdea = p.ideas.some(x => x.what === what);
    return `<div class="row" style="align-items:flex-start"><span class="icon-sq" style="background:#ff9500;margin-top:2px">${ic('sparkles', '', 2)}</span><span class="grow"><div style="font-weight:500">${esc(what)}</div><div class="sub">Porque le gusta: ${esc(why)}${price ? ` · ${price}` : ''}</div>${prev ? `<div class="sub" style="color:var(--orange);font-weight:500">⚠︎ Ya se lo regalaste en ${prev.year}</div>` : ''}</span><button class="navbtn" style="min-height:30px;font-size:15px" data-a="saveSuggestion" data-id="${id}" data-i="${i}" ${savedIdea ? 'disabled' : ''}>${savedIdea ? 'Guardada' : 'Guardar'}</button></div>`;
  }).join('');
  const h = `<div class="large-title" style="font-size:28px;line-height:34px">Sugerencias</div><div class="section-footer" style="padding:0 16px 16px;margin-top:-4px">Para ${esc(p.name)}, armadas con sus gustos y lo que ya le regalaste.</div>` + section(rows, { cls: '', footer: 'Las sugerencias se generan en el teléfono a partir de los gustos que anotaste. (En el prototipo son fijas.)' });
  return `<div class="screen ${S.pushed ? 'push-in' : ''}">${navbar({ left: backBtn(p.name.split(' ')[0]), blur: true })}<div class="scroll">${h}</div></div>`;
}
function similar(a, b) {
  const words = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9ñ]+/).filter(w => w.length >= 4 && !['para', 'con', 'desde', 'clase'].includes(w));
  const wa = words(a), wb = words(b); const shared = wb.filter(w => wa.includes(w)).length;
  return shared > 0 && shared >= Math.min(2, wa.length, wb.length);
}

/* ---------------- Pantallas: Regalos ---------------- */
function screenGifts() {
  let body = `<div class="segmented"><button class="${S.giftsMode === 'history' ? 'sel' : ''}" data-a="giftsMode" data-v="history">Historial</button><button class="${S.giftsMode === 'ideas' ? 'sel' : ''}" data-a="giftsMode" data-v="ideas">Ideas${S.unlocked ? '' : ic('lock', '', 2.6)}</button></div>`;
  if (S.giftsMode === 'history') {
    const all = S.people.flatMap(p => p.gifts.map(g => ({ ...g, p })));
    const years = [...new Set(all.map(g => g.year))].sort((a, b) => b - a);
    if (!all.length) body += `<div class="empty">${ic('gift')}<h3>Sin regalos todavía</h3><p>Cuando anotes un regalo en la ficha de alguien, aparece acá.</p></div>`;
    for (const y of years) body += section(all.filter(g => g.year === y).map(g => `<button class="row person" data-a="openFromGifts" data-id="${g.p.id}">${avatar(g.p)}<span class="grow"><div>${esc(g.what)}</div><div class="sub">${esc(g.p.name)}</div></span>${chev()}</button>`).join(''), { header: String(y) });
    body += `<div class="section-footer" style="padding:0 32px 20px">El historial es gratis. Si vas a repetir un regalo, la app te avisa: “ya se lo regalaste”.</div>`;
  } else if (!S.unlocked) {
    body += `<div class="empty" style="padding-top:30px">${ic('bulb')}<h3>Ideas de regalo</h3><p>Guardá ideas desde Safari, Mercado Libre o cualquier app con el botón <b>Compartir</b>, y recibí sugerencias según los gustos de cada uno.</p></div>
      <div style="padding:0 16px 24px"><button class="btn-primary" data-a="paywall" data-f="ideas">${ic('lock', '', 2.2)}Unlock</button><div class="section-footer" style="text-align:center;padding:8px 0 0">Pago único y sin publicidad, nunca.</div></div>`;
  } else {
    const withIdeas = S.people.filter(p => p.ideas.length);
    for (const p of withIdeas) body += section(p.ideas.map(i => `<button class="row" data-a="openFromGifts" data-id="${p.id}"><span class="grow">${esc(i.what)}<div class="sub">${esc(i.src || 'Idea guardada')}</div></span>${chev()}</button>`).join(''), { header: esc(p.name) });
    if (!withIdeas.length) body += `<div class="empty" style="padding-top:30px">${ic('bulb')}<h3>Sin ideas guardadas</h3><p>Probá guardando una desde el menú Compartir.</p></div>`;
    body += section(`<button class="row accent center" data-a="shareDemo">${ic('share', 'check', 2)}Probar: guardar desde Compartir</button>`, { footer: 'Simula lo que pasa cuando estás mirando un producto en Safari o Mercado Libre y tocás Compartir → Unforgettables.' });
  }
  return `<div class="screen" data-key="gifts">${navbar({})}<div class="scroll" data-key="gifts-scroll"><div class="large-title">Regalos</div>${body}</div></div>`;
}

/* ---------------- Pantallas: Widgets ---------------- */
const THEMES = [['classic', 'Clásico', 'var(--cell)'], ['sunset', 'Atardecer', 'linear-gradient(160deg,#ff9a8b,#ff6a88)'], ['mint', 'Menta', 'linear-gradient(160deg,#43e97b,#38f9d7)'], ['night', 'Noche', 'linear-gradient(160deg,#141e30,#243b55)']];
function nextPeople(k = 3) { return [...S.people].sort((a, b) => daysLeft(a.m, a.d) - daysLeft(b.m, b.d)).slice(0, k); }
function widgetSmall(theme = '') {
  const p = nextPeople(1)[0]; if (!p) return '';
  const n = daysLeft(p.m, p.d), age = turningAge(p);
  return `<div class="widget ${theme}"><div class="w-top">${ic('gift', '', 2.2).replace('<svg', '<svg style="width:13px;height:13px"')}Próximo</div><div><div class="w-big">${n === 0 ? 'Hoy' : n}</div><div class="w-sub">${n === 0 ? '' : n === 1 ? 'día · ' : 'días · '}${age ? `cumple ${age}` : ''}</div></div><div class="w-name">${esc(p.name)}</div></div>`;
}
function widgetMedium(theme = '') {
  const ps = nextPeople(3);
  return `<div class="widget wide ${theme}"><div class="w-top">${ic('cake', '', 2.2).replace('<svg', '<svg style="width:13px;height:13px"')}Próximos cumpleaños</div>${ps.map(p => { const n = daysLeft(p.m, p.d); return `<div style="display:flex;justify-content:space-between;align-items:center;font-size:15px;font-weight:600"><span>${esc(p.name)}</span><span class="w-sub" style="font-size:14px;font-weight:600">${n === 0 ? 'Hoy 🎂' : n === 1 ? 'Mañana' : `${n} días`}</span></div>`; }).join('')}</div>`;
}
function screenWidgets() {
  const lockedCap = (t) => `<div class="cap"><span>${t}</span>${S.unlocked ? '' : lockBadge()}</div>`;
  const tap = (f) => S.unlocked ? `data-a="fake" data-msg="En el iPhone: mantené apretada la pantalla de inicio → ＋"` : `data-a="paywall" data-f="${f}"`;
  const p = nextPeople(1)[0];
  const photoP = S.people.find(x => x.photo) || p;
  let h = '';
  h += `<div class="section"><div class="section-header big">Gratis</div><div class="wall"><div class="wgrid" style="padding:0">${`<div class="wcard">${widgetSmall()}</div>`}<div class="wcard" style="display:flex;align-items:center;color:#fff;font-size:14px;font-weight:600;line-height:1.35;padding:6px">El próximo cumple, siempre a la vista.</div></div></div><div class="section-footer">Widget chico básico. Para agregarlo: mantené apretada la pantalla de inicio → ＋ → Unforgettables.</div></div>`;
  h += `<div class="section"><div class="section-header big" style="display:flex;justify-content:space-between;align-items:center">Con el desbloqueo ${S.unlocked ? '<span class="unlocked-pill small">✓ Desbloqueado</span>' : lockBadge()}</div></div>`;
  // Temas
  const th = S.widgetTheme === 'classic' ? '' : 'theme-' + S.widgetTheme;
  h += `<div class="section"><div class="section-header">Temas y tamaños</div><div class="group"><div class="theme-dots">${THEMES.map(([k, name, bg]) => `<button class="theme-dot ${S.widgetTheme === k ? 'sel' : ''}" style="background:${bg};${k === 'classic' ? 'box-shadow:inset 0 0 0 1px var(--sep)' : ''}" data-a="widgetTheme" data-v="${k}" aria-label="${name}"></button>`).join('')}</div><div style="padding:0 16px 16px">${widgetMedium(th)}</div></div><div class="section-footer">Mediano y grande, con temas de color. ${S.unlocked ? '' : 'Tocá un color para ver el desbloqueo.'}</div></div>`;
  // Foto
  h += `<div class="wgrid" style="margin-bottom:35px">
    <button class="wcard" ${tap('photo')}><div class="widget photo" style="background-image:${photoBg(photoP)}"><div class="w-top">${ic('hourglass', '', 2.2).replace('<svg', '<svg style="width:13px;height:13px"')}Faltan</div><div><div class="w-big">${daysLeft(photoP.m, photoP.d) || 'Hoy'}</div><div class="w-name">${esc(photoP.name.split(' ')[0])}</div></div></div>${lockedCap('Cuenta regresiva con foto')}</button></div>`;
  // Lock screen
  const ps = nextPeople(2);
  h += `<div class="section"><div class="section-header">Pantalla de bloqueo</div><button class="lock-wall" style="width:100%;display:block" ${tap('lock')}><div class="date">${cap(TODAY.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }))}</div><div class="time">9:41</div><div class="lw-row">${ps.map(p => { const n = daysLeft(p.m, p.d); return `<div class="lw"><div class="ring">${n === 0 ? '🎂' : n}</div><div>${esc(p.name.split(' ')[0])}<div style="font-weight:400;opacity:.85;font-size:12px">${n === 0 ? 'hoy' : n === 1 ? 'mañana' : 'días'}</div></div></div>`; }).join('')}</div></button>${lockedCap('Widget de pantalla de bloqueo con el próximo cumple')}</div>`;
  return `<div class="screen" data-key="widgets">${navbar({})}<div class="scroll" data-key="widgets-scroll"><div class="large-title">Widgets</div>${h}</div></div>`;
}

/* ---------------- Pantallas: Ajustes ---------------- */
function screenSettings() {
  let h = '';
  if (S.unlocked) h += section(`<div class="row has-icon"><span class="icon-sq" style="background:linear-gradient(135deg,#ff7a85,#e23d4a)">${ic('star', '', 2)}</span><span class="grow"><div class="title-semibold">Todo desbloqueado</div><div class="sub">Gracias por apoyar la app 💛</div></span><span class="unlocked-pill">✓</span></div>`);
  else h += section(`<button class="row has-icon" data-a="paywall" data-f="settings" style="padding-top:14px;padding-bottom:14px"><span class="icon-sq" style="background:linear-gradient(135deg,#ff7a85,#e23d4a);width:40px;height:40px;border-radius:10px;font-size:22px">🎁</span><span class="grow"><div class="title-semibold">Desbloquear todo</div><div class="sub">Pago único, sin suscripción</div></span>${chev()}</button>`);
  h += section(navRow({ icon: 'bell', color: '#ff3b30', title: 'Recordatorios', value: S.rem.on ? `${S.rem.time} · ${S.rem.before ? S.rem.before + 'd antes' : 'mismo día'}` : 'Apagados', a: 'go', extra: 'data-s="reminders"' }) +
    navRow({ icon: 'download', color: '#34c759', title: 'Importar desde Contactos', a: 'import' }), { header: 'Avisos y datos' });
  const ex = (icon, color, title, s) => S.unlocked ? navRow({ icon, color, title, a: 'go', extra: `data-s="${s}"` }) : `<button class="row has-icon" data-a="paywall" data-f="${s}"><span class="icon-sq" style="background:${color}">${ic(icon, '', 2)}</span><span class="grow">${title}</span>${lockBadge()}</button>`;
  h += section(ex('heart', '#af52de', 'Fechas especiales', 'specials') + ex('people', '#007aff', 'Compartir lista con pareja o familia', 'share') + ex('briefcase', '#5856d6', 'Modo trabajo', 'work') + ex('widgets', '#ff9500', 'Personalizar widgets', 'widgetsTab'), { header: 'Extras' });
  h += section(navRow({ icon: 'moon', color: '#1c1c1e', title: 'Apariencia', value: { system: 'Sistema', light: 'Claro', dark: 'Oscuro' }[S.theme], a: 'go', extra: 'data-s="appearance"' }) +
    navRow({ icon: 'info', color: '#8e8e93', title: 'Ver bienvenida otra vez', a: 'onboarding' }), { header: 'General' });
  h += section(`<button class="row accent" data-a="restore">Restaurar compra</button>`, { footer: 'Si ya pagaste en otro iPhone con el mismo Apple ID, tocá Restaurar.' });
  h += section(`<button class="row accent" data-a="refresh">Actualizar prototipo</button><button class="row accent" data-a="${S.unlocked ? 'relock' : 'unlockNow'}">${S.unlocked ? 'Volver a bloquear (solo prototipo)' : 'Desbloquear sin pagar (solo prototipo)'}</button><button class="row destructive" data-a="resetDemo">Restablecer datos de ejemplo</button>`, { header: 'Prototipo', footer: 'Estas opciones existen solo en el prototipo para revisar el diseño.' });
  h += `<div class="section-footer" style="text-align:center;padding-bottom:30px">Unforgettables · prototipo de diseño</div>`;
  return `<div class="screen" data-key="settings">${navbar({})}<div class="scroll" data-key="settings-scroll"><div class="large-title">Ajustes</div>${h}</div></div>`;
}
function checkList(opts, cur, a) {
  return opts.map(([v, label]) => `<button class="row ${String(cur) === String(v) ? 'checked' : ''}" data-a="${a}" data-v="${v}"><span class="grow">${label}</span>${String(cur) === String(v) ? ic('check', 'check', 2.6) : ''}</button>`).join('');
}
function screenReminders() {
  const r = S.rem; const first = nextPeople(1)[0];
  let h = `<div class="section"><div class="section-header">Así te llega</div><div style="display:flex;justify-content:center;padding:6px 0 4px"><div class="notif-mock"><div class="app-ic">🎂</div><div style="flex:1"><div class="h">Unforgettables<span>${r.time}</span></div><div>${r.before ? `En ${r.before} ${r.before === 1 ? 'día' : 'días'} cumple ${esc(first?.name || 'Mora')} 🎈` : `Hoy cumple ${esc(first?.name || 'Mora')} 🎂`}</div><div class="muted small">Tocá para ver ideas de regalo</div></div></div></div></div>`;
  h += section(`<div class="row"><span class="grow">Recordatorios</span>${toggle(r.on, 'remToggle', 'data-k="on"')}</div><label class="row"><span class="grow">Hora del aviso</span><input type="time" id="remTime" value="${r.time}" style="border:0;background:var(--fill);border-radius:8px;padding:6px 10px;font-size:17px"></label>`, { footer: 'Usa la hora de tu iPhone.' });
  if (r.on) {
    h += section(checkList([[0, 'No, solo el mismo día'], [1, '1 día antes'], [3, '3 días antes'], [7, '1 semana antes'], [14, '2 semanas antes']], r.before, 'remBefore') +
      (r.before ? `<div class="row"><span class="grow">Avisar también el mismo día</span>${toggle(r.sameDay, 'remToggle', 'data-k="sameDay"')}</div>` : ''), { header: 'Aviso anticipado', footer: 'Podés cambiarlo para una persona en particular desde su ficha.' });
    h += section(`<div class="row"><span class="grow">Avisar cumples redondos</span>${toggle(r.round, 'remToggle', 'data-k="round"')}</div>` + (r.round ? checkList([[14, '2 semanas antes'], [30, '1 mes antes'], [60, '2 meses antes']], r.roundBefore, 'remRound') : ''), { header: 'Cumpleaños redondos', footer: '18, 30, 40, 50… Te avisamos con más tiempo para que organices algo grande.' });
    h += section(`<div class="row"><span class="grow">Avisar a la hora del país de cada persona</span>${S.unlocked ? toggle(r.localTz, 'remToggle', 'data-k="localTz"') : `<button data-a="paywall" data-f="tz">${lockBadge()}</button>`}</div>`, { header: 'Personas en otro país', footer: 'Si alguien vive en otro huso horario, el aviso del día te llega cuando allá ya es su cumple.' });
  }
  return `<div class="screen ${S.pushed ? 'push-in' : ''}">${navbar({ left: backBtn('Ajustes'), title: 'Recordatorios', blur: true })}<div class="scroll" data-key="rem-scroll">${h}</div></div>`;
}
function screenAppearance() {
  return `<div class="screen ${S.pushed ? 'push-in' : ''}">${navbar({ left: backBtn('Ajustes'), title: 'Apariencia', blur: true })}<div class="scroll" style="padding-top:20px">${section(checkList([['system', 'Igual que el sistema'], ['light', 'Claro'], ['dark', 'Oscuro']], S.theme, 'theme'))}</div></div>`;
}
function screenSpecials() {
  const rows = [...S.specials].sort((a, b) => daysLeft(a.m, a.d) - daysLeft(b.m, b.d)).map(specialRow).join('');
  const sugg = [['💍', 'Casamiento'], ['💞', 'Aniversario'], ['💐', 'Día de la Madre'], ['👔', 'Día del Padre'], ['🧸', 'Día de las Infancias'], ['🎓', 'Graduación']];
  return `<div class="screen ${S.pushed ? 'push-in' : ''}">${navbar({ left: backBtn('Ajustes'), title: 'Fechas especiales', right: `<button class="navbtn" data-a="addSpecial">${ic('plus', '', 2.2)}</button>`, blur: true })}<div class="scroll" style="padding-top:20px">${section(rows, { footer: 'Aparecen en la lista junto a los cumpleaños, con su propio aviso.' })}${section(`<div class="chips">${sugg.map(([e, n]) => `<button class="chip" data-a="addSpecialQuick" data-e="${e}" data-n="${n}">${e} ${n}</button>`).join('')}</div>`, { header: 'Sumar rápido' })}</div></div>`;
}
function screenShare() {
  const h = `<div class="empty" style="padding:20px 32px 24px">${ic('people')}<h3>Compartir la lista</h3><p>Tu pareja o familia ven los mismos cumpleaños, gustos y regalos. Así nadie regala lo mismo dos veces.</p></div>` +
    section(`<div class="row person"><div class="avatar" style="background:linear-gradient(160deg,#ff9a8b,#ff6a88)">S</div><span class="grow">Vos<div class="sub">Dueño de la lista</div></span></div><div class="row person"><div class="avatar" style="background:linear-gradient(160deg,#fbc2eb,#c56cd6)">CG</div><span class="grow">Caro Gómez<div class="sub">Puede editar</div></span><span class="value small">Unida</span></div>`, { header: 'Personas' }) +
    `<div style="padding:0 16px 20px"><button class="btn-primary" data-a="fake" data-msg="Se abriría Compartir con el link de invitación (iCloud)">${ic('share', '', 2.2)}Invitar a alguien</button></div>` +
    section(`<div class="row"><span class="grow">Compartir regalos e ideas</span>${toggle(true, 'fake', 'data-msg="Opción de ejemplo"')}</div><div class="row"><span class="grow">Compartir notas de trabajo</span>${toggle(false, 'fake', 'data-msg="Opción de ejemplo"')}</div>`, { footer: 'Se sincroniza con iCloud. Los recordatorios siguen siendo de cada uno.' });
  return `<div class="screen ${S.pushed ? 'push-in' : ''}">${navbar({ left: backBtn('Ajustes'), title: 'Compartir lista', blur: true })}<div class="scroll">${h}</div></div>`;
}
function screenWork() {
  const wp = S.people.filter(p => p.work);
  const h = section(`<div class="row"><span class="grow">Mostrar contactos de trabajo</span>${toggle(S.work.on, 'workToggle', 'data-k="on"')}</div><div class="row"><span class="grow">Separarlos en su propia sección</span>${toggle(S.work.section, 'workToggle', 'data-k="section"')}</div>`, { footer: 'Marcá a alguien como “Trabajo” desde Editar. Podés sumarle notas (cargo, qué le gusta, qué evitar).', cls: '' }) +
    section(wp.map(personRow).join('') || '<div class="row muted">Nadie marcado como trabajo</div>', { header: 'Contactos de trabajo' });
  return `<div class="screen ${S.pushed ? 'push-in' : ''}">${navbar({ left: backBtn('Ajustes'), title: 'Modo trabajo', blur: true })}<div class="scroll" style="padding-top:20px">${h}</div></div>`;
}

/* ---------------- Sheets (overlays) ---------------- */
const daysIn = (m, y) => [31, (y && !isLeap(y)) ? 28 : 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
// Edad que tiene hoy alguien nacido el d/m de ese año (negativa si todavía no nació)
const ageOn = (dr, y) => THIS_YEAR - y - (dr.m > TODAY.getMonth() + 1 || (dr.m === TODAY.getMonth() + 1 && dr.d > TODAY.getDate()) ? 1 : 0);
function wheels(dr, withYear) {
  const maxD = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][dr.m - 1];
  const days = Array.from({ length: maxD }, (_, i) => i + 1);
  const years = []; for (let y = THIS_YEAR; y >= 1900; y--) years.push(y);
  const col = (k, vals, cur, fmt = v => v, cls = '') => `<div class="wheel ${cls}" data-wheel="${k}" data-index="${Math.max(0, vals.indexOf(cur))}" data-vals="${vals.join(',')}">${vals.map(v => `<div>${fmt(v)}</div>`).join('')}</div>`;
  return `<div class="wheels">${col('d', days, dr.d)}${col('m', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], dr.m, v => cap(MONTHS[v - 1]), 'month')}${withYear ? col('y', years, dr.y, y => { const age = ageOn(dr, y); return `${y}<span class="w-age">${age < 0 ? '' : age === 1 ? '1 año' : `${age} años`}</span>`; }, 'year') : ''}</div>`;
}
function sheetWrap(o, inner, { medium = false, cellBg = false, short = false } = {}) {
  return `<div class="dim ${o.fresh ? 'anim' : ''}" data-a="dimTap"></div><div class="sheet ${o.fresh ? 'anim' : ''} ${medium ? 'medium' : ''} ${short ? 'short' : ''} ${cellBg ? 'cell-bg' : ''}">${medium ? '<div class="grabber"></div>' : ''}${inner}</div>`;
}
const leapErr = dr => dr.includeYear && dr.m === 2 && dr.d === 29 && !isLeap(dr.y);
const canSave = dr => dr.name.trim() && !leapErr(dr);

function sheetEditor(o) {
  const dr = o.draft, editing = !!o.id;
  let h = editing ? '' : addKindSwitch('cumple') + section(`<button class="row has-icon" data-a="bulkAdd"><span class="icon-sq" style="background:#34c759">${ic('people', '', 2)}</span><span class="grow" style="color:var(--accent);font-weight:600">Agregar masivamente contactos<div class="sub" style="font-weight:400">Elegí varios de tu agenda de una vez</div></span>${chev()}</button>`);
  h += section(`<div class="row" style="justify-content:center;flex-direction:column;padding:16px">${dr.photo ? `<div class="avatar lg photo" style="background-image:${photoBg(dr)}"></div>` : `<div class="avatar lg" style="background:linear-gradient(160deg,#c7cbd4,#9aa0ab)">${dr.name.trim() ? esc(initials(dr.name)) : ic('person', '', 1.6).replace('<svg', '<svg style="width:52px;height:52px"')}</div>`}<button class="navbtn" style="min-height:34px;font-size:15px" data-a="edPhoto">${dr.photo ? 'Cambiar foto' : 'Agregar foto'}</button></div>`);
  h += section(`<div class="row"><input class="field" id="edName" placeholder="Nombre" value="${esc(dr.name)}" autocomplete="off" autocapitalize="words"></div>`, { header: 'Nombre' });
  h += section(`<div class="row"><span class="grow">Incluir año de nacimiento</span>${toggle(dr.includeYear, 'edYear')}</div>${wheels(dr, dr.includeYear)}${leapErr(dr) ? `<div class="row" style="color:#ff3b30;font-size:13px">El 29 de febrero solo existe en años bisiestos.</div>` : ''}`,
    { header: 'Fecha', footer: dr.includeYear ? '' : 'Sin año no mostramos la edad, solo el día y el mes.' });
  h += section(`<div class="row has-icon"><span class="icon-sq" style="background:#5856d6">${ic('briefcase', '', 2)}</span><span class="grow">Es de trabajo</span>${S.unlocked ? toggle(dr.work, 'edWork') : `<button data-a="paywall" data-f="work">${lockBadge()}</button>`}</div>` +
    `<div class="row has-icon"><span class="icon-sq" style="background:#007aff">${ic('globe', '', 2)}</span><span class="grow">Vive en otro país</span>${S.unlocked ? `<span class="value">${dr.tz || 'No'}</span>` : `<button data-a="paywall" data-f="tz">${lockBadge()}</button>`}</div>` +
    `<div class="row"><textarea class="field" id="edNotes" placeholder="Notas (talle, alergias, qué evitar…)">${esc(dr.notes || '')}</textarea></div>`, { header: 'Más' });
  if (editing) h += section(`<button class="row destructive" data-a="askDelete">Eliminar persona</button>`);
  return sheetWrap(o, navbar({ left: `<button class="navbtn" data-a="dismiss">Cancelar</button>`, title: editing ? 'Editar' : 'Nueva persona', right: `<button class="navbtn bold" id="saveBtn" data-a="edSave" ${canSave(dr) ? '' : 'disabled'}>Guardar</button>` }) + `<div class="scroll" data-key="editor">${h}</div>`);
}

function sheetImport(o) {
  if (o.rows) return sheetBulkReview(o);
  const dupe = c => S.people.some(p => p.name === c.name);
  const sel = o.sel; const selectable = AGENDA.filter(c => !dupe(c));
  const all = selectable.length && selectable.every(c => sel.has(c.id));
  const rows = AGENDA.map(c => {
    const d = dupe(c), on = sel.has(c.id);
    return `<button class="row" data-a="impToggle" data-id="${c.id}" ${d ? 'disabled style="opacity:.55"' : ''}><span style="color:${on && !d ? 'var(--accent)' : 'var(--label3)'}">${ic(d ? 'minusCircle' : on ? 'checkCircle' : 'circle', 'check', 1.6).replace('class="check"', 'class="check" style="width:24px;height:24px"')}</span><span class="grow"><div>${esc(c.name)}</div><div class="sub">${c.m ? esc(subtitle(c)) : 'Sin cumpleaños: lo elegís en el paso siguiente'}</div></span>${d ? '<span class="small muted">Ya está</span>' : ''}</button>`;
  }).join('');
  const n = sel.size;
  return sheetWrap(o, navbar({ left: `<button class="navbtn" data-a="dismiss">Cancelar</button>`, title: 'Importar', right: `<button class="navbtn bold" data-a="impNext" ${n ? '' : 'disabled'}>${n ? `Siguiente (${n})` : 'Siguiente'}</button>` }) +
    `<div class="scroll">${section(rows, { header: `${AGENDA.length} contactos`, footer: 'Los que ya están en la app quedan deshabilitados.' })}</div><div style="padding:10px 16px calc(var(--safe-bottom) + 8px);border-top:.5px solid var(--sep);background:var(--bar);text-align:center"><button class="navbtn" data-a="impAll">${all ? 'Quitar selección' : 'Seleccionar todos'}</button></div>`);
}

const rowOk = r => r.name.trim() && r.m && r.d;
function sheetBulkReview(o) {
  const yrs = []; for (let y = THIS_YEAR; y >= 1900; y--) yrs.push(y);
  const ph = (t, cur) => cur ? '' : `<option value="" selected disabled>${t}</option>`;
  const opts = (vals, cur, fmt = v => v) => vals.map(v => `<option value="${v}" ${v === cur ? 'selected' : ''}>${fmt(v)}</option>`).join('');
  const rows = o.rows.map(r => `<div class="row bulk-row">${avatar(r)}<div class="grow"><input class="field bulk-name" data-id="${r.id}" value="${esc(r.name)}" placeholder="Nombre" autocomplete="off" autocapitalize="words"><div class="bulk-date">
    <select data-bulk="d" data-id="${r.id}" class="${r.d ? '' : 'empty'}">${ph('Día', r.d)}${opts(Array.from({ length: r.m ? daysIn(r.m, r.y) : 31 }, (_, i) => i + 1), r.d)}</select>
    <select data-bulk="m" data-id="${r.id}" class="${r.m ? '' : 'empty'}">${ph('Mes', r.m)}${opts([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], r.m, v => cap(MONTHS[v - 1]))}</select>
    <select data-bulk="y" data-id="${r.id}"><option value="" ${r.y ? '' : 'selected'}>Sin año</option>${opts(yrs, r.y)}</select></div></div></div>`).join('');
  const ok = o.rows.every(rowOk), falta = o.rows.filter(r => !r.m || !r.d).length;
  return sheetWrap(o, navbar({ left: `<button class="navbtn" data-a="impBack">Atrás</button>`, title: 'Revisar', right: `<button class="navbtn bold" id="saveBtn" data-a="impAdd" ${ok ? '' : 'disabled'}>Agregar (${o.rows.length})</button>` }) +
    `<div class="scroll">${section(rows, { header: 'Nombre y fecha', footer: (falta ? `Falta elegir el cumple de ${falta} ${falta === 1 ? 'contacto' : 'contactos'}. ` : '') + 'Dejá el nombre del contacto o cambialo por cómo le decís vos. El año es opcional: sin año no mostramos la edad.' })}</div>`);
}

function giftWarning(p, text) {
  if (!text.trim()) return '';
  const prev = p.gifts.find(g => similar(g.what, text));
  return prev ? `<div class="warn">${ic('warn', '', 2)}<div><b>Ya se lo regalaste</b> en ${prev.year}: “${esc(prev.what)}”.</div></div>` : '';
}
function sheetGift(o) {
  const p = person(o.id), dr = o.draft, isIdea = o.s === 'idea';
  const years = []; for (let y = THIS_YEAR; y >= THIS_YEAR - 8; y--) years.push(y);
  let h = section(`<div class="row"><input class="field" id="giftWhat" placeholder="${isIdea ? 'Ej: Vinilo de Taylor Swift' : 'Ej: Taza de cerámica'}" value="${esc(dr.what)}" autocomplete="off"></div><div id="giftWarn">${giftWarning(p, dr.what)}</div>`, { header: isIdea ? 'Idea' : 'Qué le regalaste' });
  if (!isIdea) h += section(`<label class="row"><span class="grow">Año</span><select id="giftYear" style="border:0;background:transparent;color:var(--label2);font-size:17px;text-align:right">${years.map(y => `<option ${y === dr.year ? 'selected' : ''}>${y}</option>`).join('')}</select>${chev()}</label>`);
  else h += section(`<div class="row"><input class="field" placeholder="Link (opcional)" autocomplete="off"></div>`, { footer: 'Tip: desde Safari o Mercado Libre tocá Compartir → Unforgettables y se guarda solo.' });
  if (p.gifts.length) h += section(p.gifts.map(g => `<div class="row"><span class="grow">${esc(g.what)}</span><span class="value">${g.year}</span></div>`).join(''), { header: `Ya le regalaste a ${esc(p.name.split(' ')[0])}` });
  return sheetWrap(o, navbar({ left: `<button class="navbtn" data-a="dismiss">Cancelar</button>`, title: isIdea ? 'Nueva idea' : 'Nuevo regalo', right: `<button class="navbtn bold" id="saveBtn" data-a="giftSave" ${dr.what.trim() ? '' : 'disabled'}>Guardar</button>` }) + `<div class="scroll">${h}</div>`);
}
function sheetGusto(o) {
  const p = person(o.id);
  const sugg = ['Café', 'Libros', 'Fútbol', 'Vino', 'Plantas', 'Música', 'Series', 'Cocina', 'Viajes', 'Chocolate', 'Mate', 'Videojuegos'].filter(s => !p.gustos.includes(s));
  return sheetWrap(o, navbar({ left: `<button class="navbtn" data-a="dismiss">Cancelar</button>`, title: 'Agregar gusto', right: `<button class="navbtn bold" id="saveBtn" data-a="gustoSave" ${o.text.trim() ? '' : 'disabled'}>Agregar</button>` }) +
    `<div class="scroll">${section(`<div class="row"><input class="field" id="gustoText" placeholder="Ej: Café de especialidad" value="${esc(o.text)}" autocomplete="off"></div>`)}${section(`<div class="chips">${sugg.map(s => `<button class="chip" data-a="gustoQuick" data-v="${s}">${s}</button>`).join('')}</div>`, { header: 'Ideas rápidas' })}</div>`, { medium: true });
}
function sheetRemindPerson(o) {
  const p = person(o.id);
  const opts = [['null', `Usar el general (${beforeLabel(S.rem.before).toLowerCase()})`], [0, 'Solo el mismo día'], [1, '1 día antes'], [3, '3 días antes'], [7, '1 semana antes'], [14, '2 semanas antes']];
  return sheetWrap(o, navbar({ title: `Aviso para ${p.name.split(' ')[0]}`, right: `<button class="navbtn bold" data-a="dismiss">OK</button>` }) + `<div class="scroll">${section(checkList(opts, p.remind == null ? 'null' : p.remind, 'remPersonSet'))}</div>`, { medium: true });
}
function sheetTz(o) {
  const p = person(o.id);
  const opts = [['null', 'Igual que vos (Buenos Aires)'], ['Madrid', 'Madrid (+5 h)'], ['Miami', 'Miami (−1 h)'], ['Ciudad de México', 'Ciudad de México (−3 h)'], ['Sídney', 'Sídney (+14 h)']];
  return sheetWrap(o, navbar({ title: 'Dónde vive', right: `<button class="navbtn bold" data-a="dismiss">OK</button>` }) + `<div class="scroll">${section(checkList(opts, p.tz ?? 'null', 'tzSet'), { footer: 'El aviso del día te llega cuando allá ya es su cumple.' })}</div>`, { medium: true });
}
// Selector de arriba al tocar +: qué querés agregar
const addKindSwitch = cur => `<div class="segmented"><button class="${cur === 'cumple' ? 'sel' : ''}" data-a="addKind" data-v="cumple">Cumpleaños</button><button class="${cur === 'fecha' ? 'sel' : ''}" data-a="addKind" data-v="fecha">Fecha${S.unlocked ? '' : ic('lock', '', 2.6)}</button></div>`;
function sheetAddSpecial(o) {
  const dr = o.draft;
  const kinds = [['Aniversario', '💞'], ['Casamiento', '💍'], ['Fecha del año', '📅'], ['Otra', '⭐️']];
  return sheetWrap(o, navbar({ left: `<button class="navbtn" data-a="dismiss">Cancelar</button>`, title: 'Nueva fecha', right: `<button class="navbtn bold" id="saveBtn" data-a="specSave" ${dr.name.trim() ? '' : 'disabled'}>Guardar</button>` }) +
    `<div class="scroll">${o.fromPlus ? addKindSwitch('fecha') : ''}${section(`<div class="row"><input class="field" id="specName" placeholder="Ej: Aniversario con Caro" value="${esc(dr.name)}" autocomplete="off"></div>`, { header: 'Nombre' })}<div class="segmented">${kinds.map(([k]) => `<button class="${dr.kind === k ? 'sel' : ''}" data-a="specKind" data-v="${k}">${k}</button>`).join('')}</div>${section(wheels(dr, false), { header: 'Fecha' })}</div>`);
}

const FEATURES = {
  widgets: [['paint', '#ff9500', 'Widgets a tu gusto', 'Temas de color y tamaños mediano y grande', ['widgetsTab', 'theme']], ['hourglass', '#ff2d55', 'Cuenta regresiva con foto', 'La cara de quien cumple, en tu inicio', ['photo']], ['lockscreen', '#5856d6', 'Pantalla de bloqueo', 'El próximo cumple sin desbloquear', ['lock']]],
  extras: [['heart', '#af52de', 'Fechas especiales', 'Aniversarios, Día de la Madre y más', ['specials']], ['noAds', '#34c759', NO_ADS.t, NO_ADS.s, []], ['bulb', '#ff9500', 'Sugerencias de regalo', 'Según los gustos de cada uno', ['ideas']], ['share', '#34c759', 'Guardar ideas desde Compartir', 'Desde Safari, Mercado Libre o cualquier app', ['ideas']], ['globe', '#007aff', 'Aviso a la hora de su país', 'Para los que viven lejos', ['tz']], ['people', '#30b0c7', 'Compartir con pareja o familia', 'Una lista para todos', ['share']], ['briefcase', '#8e8e93', 'Modo trabajo', 'Contactos laborales con notas', ['work']]],
};
const FEATURE_NAMES = { specials: 'Fechas especiales', ideas: 'Ideas de regalo', tz: 'El aviso por país', share: 'Compartir la lista', work: 'El modo trabajo', widgetsTab: 'Personalizar widgets', theme: 'Los temas de widget', photo: 'La cuenta regresiva con foto', lock: 'El widget de bloqueo' };
function sheetPaywall(o) {
  const f = (arr) => arr.map(([icon, color, t, s, keys]) => `<div class="feat" ${keys.includes(o.feature) ? 'style="background:var(--accent-soft);margin:0 -10px;padding:9px 10px;border-radius:12px"' : ''}><span class="icon-sq" style="background:${color}">${ic(icon, '', 2)}</span><div><div class="t">${t}</div><div class="s">${s}</div></div></div>`).join('');
  const h = `<div class="paywall"><div class="hero-icon">🎁</div><h1>Desbloqueá todo</h1>${FEATURE_NAMES[o.feature] ? `<div style="text-align:center;margin-top:10px"><span class="lock-badge" style="font-size:13px;padding:5px 11px">${ic('lock', '', 2.4)}${FEATURE_NAMES[o.feature]} es parte del desbloqueo</span></div>` : ''}<p class="lead">${o.soft ? 'Tu app ya está lista y es gratis. Si querés más, ' : ''}${o.soft ? 'un' : 'Un'} solo pago de <b>USD 4,99</b>, para siempre. Sin suscripción.</p>
    <div class="pw-group-title">Extras</div>${f(FEATURES.extras)}<div class="pw-group-title">Widgets</div>${f(FEATURES.widgets)}
    <div class="pw-group-title">Siempre gratis</div><div class="s muted small" style="line-height:1.45;padding-bottom:10px">Cumpleaños y edades, importar desde Contactos, recordatorios con aviso anticipado, cumples redondos, historial de regalos, gustos y el widget básico.</div></div>`;
  return sheetWrap(o, navbar({ left: `<button class="navbtn" data-a="dismiss" aria-label="Cerrar" style="color:var(--label2)"><svg viewBox="0 0 24 24" style="width:30px;height:30px"><circle cx="12" cy="12" r="11" fill="var(--fill)"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>` }) +
    `<div class="scroll" style="padding-bottom:0">${h}<div class="pw-footer"><button class="btn-primary" data-a="buy">Desbloquear por USD 4,99</button><div class="fine">Pago único · Sin publicidad · Se cobra a tu Apple ID · Vale en todos tus dispositivos</div>${o.soft ? '<button class="btn-plain" data-a="dismiss">Ahora no</button>' : ''}<div class="links"><button data-a="restore">Restaurar compra</button><button data-a="fake" data-msg="Abriría los Términos">Términos</button><button data-a="fake" data-msg="Abriría la Privacidad">Privacidad</button></div></div></div>`);
}
function sheetStore(o) {
  return sheetWrap(o, `<div class="store"><div class="head"><div class="appic">🎂</div><div style="flex:1"><div style="font-weight:600">Desbloquear todo</div><div class="muted small">Unforgettables · Compra dentro de la app</div></div></div><div class="kv"><span>Precio</span><span>USD 4,99 · pago único</span></div><div class="kv"><span>Cuenta</span><span>tu Apple ID</span></div><div style="padding:18px 0 8px"><button class="btn-primary" data-a="confirmBuy" style="background:var(--blue)">${o.busy ? '<span class="spinner"></span>' : 'Comprar'}</button><button class="btn-plain" data-a="dismiss">Cancelar</button></div><div class="small muted" style="text-align:center;padding-bottom:calc(var(--safe-bottom) + 16px)">(Simulación de App Store — no se cobra nada)</div></div>`, { medium: true, short: true, cellBg: true });
}
function sheetShare(o) {
  const apps = [['💬', 'Mensajes', '#34c759'], ['🟢', 'WhatsApp', '#25d366'], ['✉️', 'Mail', '#1e90ff'], ['🎂', 'Unforgettables', 'linear-gradient(135deg,#ff7a85,#e23d4a)'], ['📝', 'Notas', '#ffcc00']];
  return sheetWrap(o, `<div style="padding:12px 16px 0"><div class="share-mock" style="margin:0;display:flex;gap:12px;align-items:center"><div style="width:56px;height:56px;border-radius:10px;background:linear-gradient(135deg,#ffe600,#ffcd00);display:grid;place-items:center;font-size:28px">🎧</div><div style="flex:1;min-width:0"><div style="font-weight:600;font-size:15px">Auriculares JBL Tune 520BT</div><div class="muted small">articulo.mercadolibre.com.ar</div></div></div>
    <div class="share-apps">${apps.map(([e, n, bg]) => `<button class="share-app" data-a="${n === 'Unforgettables' ? 'shareToApp' : 'fake'}" data-msg="Solo de ejemplo"><div class="ic" style="background:${bg}">${e}</div>${n}</button>`).join('')}</div>
    <div class="small muted" style="text-align:center;padding:8px 0 calc(var(--safe-bottom) + 16px)">Este es el menú Compartir de iOS. Tocá <b>Unforgettables</b>.</div></div>`, { medium: true, short: true });
}
function sheetPick(o) {
  const rows = [...S.people].sort((a, b) => daysLeft(a.m, a.d) - daysLeft(b.m, b.d)).map(p => `<button class="row person" data-a="pickPerson" data-id="${p.id}">${avatar(p)}<span class="grow"><div>${esc(p.name)}</div><div class="sub">${esc(subtitle(p))}</div></span></button>`).join('');
  return sheetWrap(o, navbar({ left: `<button class="navbtn" data-a="dismiss">Cancelar</button>`, title: 'Guardar idea para…' }) + `<div class="scroll">${section(`<div class="row"><span class="grow"><b>Auriculares JBL Tune 520BT</b><div class="sub">Mercado Libre · ARS 69.999</div></span></div>`, { header: 'Idea' })}${section(rows, { header: '¿Para quién?' })}</div>`);
}

function coverOnboarding(o) {
  const st = o.step;
  const dots = `<div class="dots">${[0, 1, 2, 3].map(i => `<span class="${i === st ? 'sel' : ''}"></span>`).join('')}</div>`;
  let art = '', title = '', text = '', btns = '';
  if (st === 0) { art = '🎂'; title = 'Nunca más te olvidás de un cumple'; text = 'Cuántos años cumple, cuánto falta y qué le regalaste la última vez. Todo en tu iPhone.'; btns = `<button class="btn-primary" data-a="obNext">Empezar</button>`; }
  if (st === 1) {
    const cands = CONTACTS.filter(c => !S.people.some(p => p.name === c.name));
    art = `<div style="width:100%;font-size:17px">${section(cands.slice(0, 5).map(c => `<div class="row"><span style="color:var(--accent)">${ic('checkCircle', 'check', 1.6).replace('class="check"', 'class="check" style="width:22px;height:22px"')}</span><span class="grow">${esc(c.name)}<div class="sub">${esc(subtitle(c))}</div></span></div>`).join('') + (cands.length > 5 ? `<div class="row muted small">y ${cands.length - 5} más…</div>` : ''), { cls: 'mt0' }).replace('class="section ', 'style="margin:0" class="section ')}</div>`;
    title = 'Traé los cumples de Contactos'; text = cands.length ? `Encontramos ${cands.length} contactos con cumpleaños.` : 'Ya importaste todos tus contactos con cumpleaños.';
    btns = `<button class="btn-primary" data-a="obImport">${cands.length ? `Importar ${cands.length}` : 'Seguir'}</button><button class="btn-plain" data-a="obNext">Ahora no, los cargo a mano</button>`;
  }
  if (st === 2) { const p = nextPeople(1)[0]; art = `<div class="notif-mock"><div class="app-ic">🎂</div><div style="flex:1"><div class="h">Unforgettables<span>09:00</span></div><div>En 3 días cumple ${esc(p ? p.name : 'Mora')} 🎈</div><div class="muted small">Tocá para ver ideas de regalo</div></div></div>`; title = 'Te avisamos con tiempo'; text = 'Un aviso 3 días antes y otro el mismo día. Lo cambiás cuando quieras.'; btns = `<button class="btn-primary" data-a="obNotif">Activar avisos</button><button class="btn-plain" data-a="obNext">Ahora no</button>`; }
  if (st === 3) { art = `<div style="width:100%">${section(nextPeople(3).map(p => `<div class="row person">${avatar(p)}<span class="grow"><div class="title-semibold">${esc(p.name)}</div><div class="sub">${esc(subtitle(p))}</div></span>${countdown(daysLeft(p.m, p.d))}</div>`).join(''), {}).replace('class="section ', 'style="margin:0" class="section ')}</div>`; title = '¡Listo, tu app ya está armada!'; text = `Tenés ${S.people.length} cumpleaños cargados y los avisos listos.`; btns = `<button class="btn-primary" data-a="obDone">Ver mis cumpleaños</button>`; }
  return `<div class="full-cover ${o.fresh ? 'anim' : ''}"><div class="ob"><div class="art">${art}</div><h1>${title}</h1><p>${text}</p>${dots}<div class="stack">${btns}</div></div></div>`;
}

const OVERLAYS = { editor: sheetEditor, import: sheetImport, gift: sheetGift, idea: sheetGift, gusto: sheetGusto, remindPerson: sheetRemindPerson, tz: sheetTz, addSpecial: sheetAddSpecial, paywall: sheetPaywall, store: sheetStore, share: sheetShare, pick: sheetPick, onboarding: coverOnboarding };

function dialogHtml(d) {
  if (d.type === 'alert') return `<div class="alert-wrap"><div class="alert ${d.fresh ? 'anim' : ''}"><div class="body"><div class="t">${d.title}</div><div class="m">${d.msg}</div></div><div class="btns">${d.buttons.map(b => `<button data-a="${b.a}">${b.label}</button>`).join('')}</div></div></div>`;
  return `<div class="dim" data-a="dialogCancel" style="z-index:79"></div><div class="action-sheet ${d.fresh ? 'anim' : ''}"><div class="group"><div class="msg">${d.title}</div>${d.actions.map(x => `<button class="${x.destructive ? 'destructive' : ''}" data-a="${x.a}">${x.label}</button>`).join('')}</div><button class="cancel" data-a="dialogCancel">Cancelar</button></div>`;
}

/* ---------------- Render ---------------- */
const phone = document.getElementById('phone');
const SCREENS = { list: screenList, detail: s => screenDetail(s.id), special: s => screenSpecial(s.id), suggest: s => screenSuggest(s.id), gifts: screenGifts, widgets: screenWidgets, settings: screenSettings, reminders: screenReminders, appearance: screenAppearance, specials: screenSpecials, share: screenShare, work: screenWork };
const TABS = [['list', 'Unforgettables', 'heart'], ['gifts', 'Regalos', 'gift'], ['widgets', 'Widgets', 'widgets'], ['settings', 'Ajustes', 'gear']];
const statusbar = `<div class="statusbar"><span>9:41</span><span class="icons"><svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.5c2.3 0 4.4.9 6 2.4l1.1-1.2A10 10 0 008 .8 10 10 0 00.9 3.7L2 4.9a8.4 8.4 0 016-2.4zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.1-1.2A7 7 0 008 4.2a7 7 0 00-4.7 1.9l1.1 1.2c1-.9 2.2-1.4 3.6-1.4zm0 3.3c.6 0 1.1.2 1.5.6L8 11.4 6.5 9.8c.4-.4.9-.6 1.5-.6z"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/></svg></span></div>`;

function applyTheme() { if (S.theme === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = S.theme; }
function commitWheels() {
  const o = S.overlays[S.overlays.length - 1]; if (!o || !o.draft) return;
  phone.querySelectorAll('.wheel').forEach(w => { const vals = w.dataset.vals.split(',').map(Number); o.draft[w.dataset.wheel] = vals[Math.max(0, Math.min(vals.length - 1, Math.round(w.scrollTop / 36)))]; });
  const maxD = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][o.draft.m - 1]; if (o.draft.d > maxD) o.draft.d = maxD;
}
function render() {
  commitWheels();
  const scrolls = {}; phone.querySelectorAll('.scroll[data-key]').forEach(el => scrolls[el.dataset.key] = el.scrollTop);
  const act = document.activeElement; const focusId = act && act.id && phone.contains(act) ? act.id : null; const selStart = focusId && act.selectionStart != null ? act.selectionStart : null;
  const top = stack()[stack().length - 1];
  let html = statusbar + '<div class="island"></div>' + SCREENS[top.s](top);
  html += `<nav class="tabbar">${TABS.map(([k, label, icon]) => `<button class="tab ${S.tab === k ? 'sel' : ''}" data-a="tab" data-v="${k}">${ic(icon, '', S.tab === k ? 2.1 : 1.7)}${label}</button>`).join('')}</nav>`;
  for (const o of S.overlays) html += OVERLAYS[o.s](o);
  if (S.dialog) html += dialogHtml(S.dialog);
  if (S.toast) html += `<div class="toast ${S.toast.fresh ? 'anim' : ''}"><span>${S.toast.emoji}</span>${esc(S.toast.msg)}</div>`;
  html += '<div class="home-ind"></div>';
  phone.innerHTML = html;
  phone.querySelectorAll('.scroll[data-key]').forEach(el => { if (scrolls[el.dataset.key] != null) el.scrollTop = scrolls[el.dataset.key]; });
  phone.querySelectorAll('.wheel').forEach(w => { w.scrollTop = (+w.dataset.index) * 36; });
  if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus({ preventScroll: true }); if (selStart != null && el.setSelectionRange) try { el.setSelectionRange(selStart, selStart); } catch { } } }
  S.pushed = false; S.overlays.forEach(o => o.fresh = false); if (S.dialog) S.dialog.fresh = false; if (S.toast) S.toast.fresh = false;
}

/* ---------------- Acciones ---------------- */
const topOverlay = () => S.overlays[S.overlays.length - 1];
function openEditor(id) {
  const p = id ? person(id) : null;
  const draft = p ? { id: p.id, name: p.name, m: p.m, d: p.d, y: p.y || THIS_YEAR - 30, includeYear: !!p.y, work: p.work, tz: p.tz, notes: p.notes, photo: p.photo } :
    { id: 'new', name: '', m: TODAY.getMonth() + 1, d: TODAY.getDate(), y: THIS_YEAR - 30, includeYear: true, work: false, tz: null, notes: '', photo: false };
  present({ s: 'editor', id, draft });
}
const A = {
  tab(d) { if (S.tab === d.v) S.stacks[S.tab].length = 1; S.tab = d.v; render(); },
  pop, dismiss,
  dimTap() { const o = topOverlay(); if (o && o.s !== 'store') dismiss(); },
  go(d) { if (d.s === 'widgetsTab') { S.tab = 'widgets'; render(); return; } push({ s: d.s }); },
  open(d) { push({ s: 'detail', id: d.id }); },
  openFromGifts(d) { S.tab = 'list'; S.stacks.list = [{ s: 'list' }, { s: 'detail', id: d.id }]; S.pushed = true; render(); },
  openSpecial(d) { push({ s: 'special', id: d.id }); },
  suggest(d) { push({ s: 'suggest', id: d.id }); },
  listMode(d) { if (d.v === 'specials' && needUnlock('specials')) return; S.listMode = d.v; render(); },
  listView() { S.listView = S.listView === 'list' ? 'calendar' : 'list'; persist(); render(); },
  calDay(d) { S.calD = S.calD === +d.d ? null : +d.d; render(); },
  calMove(d) { const t = new Date(S.calY, S.calM - 1 + +d.v, 1); S.calY = t.getFullYear(); S.calM = t.getMonth() + 1; S.calD = null; render(); },
  calToday() { S.calY = TODAY.getFullYear(); S.calM = TODAY.getMonth() + 1; S.calD = null; render(); },
  addOnDay() { openEditor(null); const dr = topOverlay().draft; dr.m = S.calM; dr.d = S.calD; render(); },
  giftsMode(d) { S.giftsMode = d.v; render(); },
  paywall(d) { present({ s: 'paywall', feature: d.f }); },
  fake(d) { toast(d.msg || 'Solo de ejemplo', 'ℹ️'); },
  add() { openEditor(null); },
  edit(d) { openEditor(d.id); },
  import() { present({ s: 'import', sel: new Set() }); },
  impToggle(d) { const o = topOverlay(); o.sel.has(d.id) ? o.sel.delete(d.id) : o.sel.add(d.id); render(); },
  impAll() { const o = topOverlay(); const selectable = AGENDA.filter(c => !S.people.some(p => p.name === c.name)); const all = selectable.every(c => o.sel.has(c.id)); o.sel = all ? new Set() : new Set(selectable.map(c => c.id)); render(); },
  addKind(d) {
    const cur = topOverlay().s === 'editor' ? 'cumple' : 'fecha'; if (d.v === cur) return;
    if (d.v === 'fecha') { if (needUnlock('specials')) return; S.overlays.pop(); present({ s: 'addSpecial', fromPlus: true, draft: { name: '', kind: 'Aniversario', m: TODAY.getMonth() + 1, d: TODAY.getDate() } }); }
    else { S.overlays.pop(); openEditor(null); }
    topOverlay().fresh = false; render();
  },
  bulkAdd() { S.overlays.pop(); present({ s: 'import', sel: new Set() }); },
  impNext() { const o = topOverlay(); o.rows = AGENDA.filter(c => o.sel.has(c.id)).map(c => ({ id: c.id, name: c.name, m: c.m || null, d: c.d || null, y: c.y || null, photo: !!c.photo })); render(); },
  impBack() { delete topOverlay().rows; render(); },
  impAdd() { const o = topOverlay(); let n = 0; for (const r of o.rows) { if (S.people.some(p => p.name === r.name.trim())) continue; S.people.push({ id: 'imp-' + r.id, name: r.name.trim(), m: r.m, d: r.d, y: r.y, gustos: [], gifts: [], ideas: [], notes: '', work: false, tz: null, remind: null, photo: r.photo }); n++; } S.overlays.pop(); persist(); toast(`Agregaste ${n} cumpleaños`, '🎉'); },
  edYear() { const dr = topOverlay().draft; dr.includeYear = !dr.includeYear; render(); },
  edWork() { const dr = topOverlay().draft; dr.work = !dr.work; render(); },
  edPhoto() { const dr = topOverlay().draft; dr.photo = !dr.photo; render(); },
  edSave() {
    const o = topOverlay(), dr = o.draft; if (!canSave(dr)) return;
    const data = { name: dr.name.trim(), m: dr.m, d: Math.min(dr.d, daysIn(dr.m)), y: dr.includeYear ? dr.y : null, work: dr.work, notes: dr.notes, photo: dr.photo };
    if (o.id) Object.assign(person(o.id), data);
    else S.people.push(Object.assign({ id: 'p' + Date.now(), gustos: [], gifts: [], ideas: [], tz: null, remind: null }, data));
    S.overlays.pop(); persist(); toast(o.id ? 'Cambios guardados' : `${data.name} agregado`, '✅');
  },
  askDelete() { const o = topOverlay(); S.dialog = { type: 'confirm', title: `¿Eliminar a ${esc(o.draft.name || 'esta persona')}?`, actions: [{ label: 'Eliminar', a: 'doDelete', destructive: true }], fresh: true }; render(); },
  doDelete() { const o = topOverlay(); S.people = S.people.filter(p => p.id !== o.id); S.dialog = null; S.overlays.pop(); S.stacks.list = [{ s: 'list' }]; persist(); toast('Persona eliminada', '🗑️'); },
  dialogCancel() { S.dialog = null; render(); },
  addGift(d) { present({ s: 'gift', id: d.id, draft: { what: '', year: THIS_YEAR } }); },
  addIdea(d) { if (needUnlock('ideas')) return; present({ s: 'idea', id: d.id, draft: { what: '' } }); },
  giftSave() {
    const o = topOverlay(), p = person(o.id), what = o.draft.what.trim(); if (!what) return;
    if (o.s === 'gift') p.gifts.push({ year: +o.draft.year, what }); else p.ideas.push({ what, src: 'Idea guardada' });
    S.overlays.pop(); persist(); toast(o.s === 'gift' ? 'Regalo anotado' : 'Idea guardada', '🎁');
  },
  addGusto(d) { present({ s: 'gusto', id: d.id, text: '' }); },
  gustoQuick(d) { const o = topOverlay(); person(o.id).gustos.push(d.v); S.overlays.pop(); persist(); render(); },
  gustoSave() { const o = topOverlay(); if (!o.text.trim()) return; person(o.id).gustos.push(o.text.trim()); S.overlays.pop(); persist(); render(); },
  remindPerson(d) { present({ s: 'remindPerson', id: d.id }); },
  remPersonSet(d) { const o = topOverlay(); person(o.id).remind = d.v === 'null' ? null : +d.v; persist(); render(); },
  tzPerson(d) { if (needUnlock('tz')) return; present({ s: 'tz', id: d.id }); },
  tzSet(d) { const o = topOverlay(); person(o.id).tz = d.v === 'null' ? null : d.v; persist(); render(); },
  saveSuggestion(d) { const p = person(d.id); const sug = (SUGGESTIONS[d.id] || SUGGESTIONS._default.map(t => [t]))[+d.i]; p.ideas.push({ what: sug[0], src: 'Desde sugerencias' }); persist(); toast('Idea guardada', '💡'); },
  remToggle(d) { S.rem[d.k] = !S.rem[d.k]; persist(); render(); },
  remBefore(d) { S.rem.before = +d.v; persist(); render(); },
  remRound(d) { S.rem.roundBefore = +d.v; persist(); render(); },
  theme(d) { S.theme = d.v; applyTheme(); persist(); render(); },
  workToggle(d) { S.work[d.k] = !S.work[d.k]; persist(); render(); },
  widgetTheme(d) { if (needUnlock('theme')) return; S.widgetTheme = d.v; persist(); render(); },
  addSpecial() { present({ s: 'addSpecial', draft: { name: '', kind: 'Aniversario', m: TODAY.getMonth() + 1, d: TODAY.getDate() } }); },
  addSpecialQuick(d) { present({ s: 'addSpecial', draft: { name: d.n, kind: d.n === 'Casamiento' ? 'Casamiento' : d.n === 'Aniversario' || d.n === 'Graduación' ? 'Aniversario' : 'Fecha del año', m: TODAY.getMonth() + 1, d: TODAY.getDate(), emoji: d.e } }); },
  specKind(d) { topOverlay().draft.kind = d.v; render(); },
  specSave() { const dr = topOverlay().draft; if (!dr.name.trim()) return; S.specials.push({ id: 's' + Date.now(), name: dr.name.trim(), m: dr.m, d: Math.min(dr.d, daysIn(dr.m)), kind: dr.kind, emoji: dr.emoji || (dr.kind === 'Aniversario' ? '💞' : dr.kind === 'Otra' ? '⭐️' : '📅') }); S.overlays.pop(); persist(); toast('Fecha agregada', '💜'); },
  buy() { present({ s: 'store' }); },
  confirmBuy() { const o = topOverlay(); if (o.busy) return; o.busy = true; render(); setTimeout(() => { S.unlocked = true; S.overlays = S.overlays.filter(x => x.s !== 'store' && x.s !== 'paywall'); persist(); toast('¡Listo! Todo desbloqueado', '🎉'); }, 900); },
  restore() { if (S.unlocked) { toast('Ya está todo desbloqueado', '✅'); return; } toast('No encontramos compras con este Apple ID', 'ℹ️'); },
  unlockNow() { S.unlocked = true; persist(); toast('Desbloqueado (prototipo)', '🔓'); },
  relock() { S.unlocked = false; S.widgetTheme = 'classic'; persist(); toast('Bloqueado otra vez', '🔒'); },
  refresh() { location.replace(location.pathname + '?r=' + Date.now()); },
  resetDemo() { S.people = demoPeople(); S.specials = demoSpecials(); S.stacks.list = [{ s: 'list' }]; persist(); toast('Datos de ejemplo restablecidos', '↺'); },
  onboarding() { present({ s: 'onboarding', step: 0 }); },
  obNext() { topOverlay().step++; render(); },
  obImport() { importContacts(CONTACTS.filter(c => !S.people.some(p => p.name === c.name)).map(c => c.id)); persist(); topOverlay().step++; render(); },
  obNotif() { S.dialog = { type: 'alert', title: '“Unforgettables” quiere enviarte notificaciones', msg: 'Pueden incluir alertas, sonidos e insignias en los íconos.', buttons: [{ label: 'No permitir', a: 'obNotifNo' }, { label: 'Permitir', a: 'obNotifYes' }], fresh: true }; render(); },
  obNotifYes() { S.dialog = null; S.rem.on = true; topOverlay().step++; render(); },
  obNotifNo() { S.dialog = null; S.rem.on = false; topOverlay().step++; render(); },
  obDone() { S.overlays.pop(); S.tab = 'list'; S.stacks.list = [{ s: 'list' }]; localStorage.setItem(LS + '-ob', '1'); persist(); if (!S.unlocked) present({ s: 'paywall', soft: true }); else render(); },
  shareDemo() { present({ s: 'share' }); },
  shareToApp() { S.overlays.pop(); present({ s: 'pick' }); },
  pickPerson(d) { const p = person(d.id); p.ideas.push({ what: 'Auriculares JBL Tune 520BT', src: 'Guardada desde Mercado Libre' }); S.overlays.pop(); persist(); toast(`Idea guardada para ${p.name.split(' ')[0]}`, '💡'); },
};
function importContacts(ids) {
  let n = 0;
  for (const id of ids) { const c = CONTACTS.find(x => x.id === id); if (!c || S.people.some(p => p.name === c.name)) continue; S.people.push({ id: 'imp-' + c.id, name: c.name, m: c.m, d: c.d, y: c.y || null, gustos: [], gifts: [], ideas: [], notes: '', work: false, tz: null, remind: null, photo: false }); n++; }
  return n;
}

phone.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el || el.disabled || !phone.contains(el)) return;
  e.preventDefault(); const fn = A[el.dataset.a]; if (fn) fn(el.dataset, el);
});
phone.addEventListener('input', e => {
  const t = e.target, o = topOverlay();
  if (t.id === 'search') { S.search = t.value; render(); return; }
  if (t.id === 'edName') { o.draft.name = t.value; document.getElementById('saveBtn').disabled = !canSave(o.draft); return; }
  if (t.id === 'edNotes') { o.draft.notes = t.value; return; }
  if (t.id === 'giftWhat') { o.draft.what = t.value; document.getElementById('saveBtn').disabled = !t.value.trim(); document.getElementById('giftWarn').innerHTML = giftWarning(person(o.id), t.value); return; }
  if (t.id === 'gustoText') { o.text = t.value; document.getElementById('saveBtn').disabled = !t.value.trim(); return; }
  if (t.classList.contains('bulk-name')) { o.rows.find(r => r.id === t.dataset.id).name = t.value; document.getElementById('saveBtn').disabled = !o.rows.every(rowOk); return; }
  if (t.id === 'specName') { o.draft.name = t.value; document.getElementById('saveBtn').disabled = !t.value.trim(); return; }
});
phone.addEventListener('change', e => {
  const t = e.target, o = topOverlay();
  if (t.id === 'giftYear') o.draft.year = +t.value;
  if (t.dataset.bulk) { const r = o.rows.find(x => x.id === t.dataset.id); r[t.dataset.bulk] = t.value ? +t.value : null; if (r.d && r.m) r.d = Math.min(r.d, daysIn(r.m, r.y)); render(); }
  if (t.id === 'remTime') { S.rem.time = t.value || '09:00'; persist(); render(); }
});
let wheelT;
phone.addEventListener('scroll', e => {
  const w = e.target; if (!w.classList || !w.classList.contains('wheel')) return;
  clearTimeout(wheelT);
  wheelT = setTimeout(() => {
    const o = topOverlay(); if (!o || !o.draft) return;
    const vals = w.dataset.vals.split(',').map(Number); const i = Math.max(0, Math.min(vals.length - 1, Math.round(w.scrollTop / 36)));
    const k = w.dataset.wheel, before = JSON.stringify(o.draft);
    o.draft[k] = vals[i];
    const maxD = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][o.draft.m - 1]; if (o.draft.d > maxD) o.draft.d = maxD;
    if (JSON.stringify(o.draft) !== before) render();
  }, 160);
}, true);

applyTheme();
// Abrir directo una pantalla: ?pantalla=onboarding | paywall
const q = new URLSearchParams(location.search).get('pantalla');
render();
if (q === 'onboarding') A.onboarding(); else if (q === 'paywall') A.paywall({});
window.__UB = { S, A, render };
})();
