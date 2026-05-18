import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, NavLink } from 'react-router-dom';
import './index.css';

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
let CUR = { role: 'ceo', name: '', avatar: '' };
let selRole = 'ceo';
let viewLead = null;
let fuState = { leadId: null, idx: 0 };
let leadsState = {
  construction: { q: '', s: '', by: 'd-desc' },
  amc: { q: '', s: '', by: 'd-desc' }
};

const LEADS = [
  { id: 'L001', name: 'Arjun Mehta', phone: '+91 98765 43210', loc: 'Banjara Hills, HYD', req: '40×20ft infinity pool, mosaic tiles, LED lighting, waterfall feature', src: 'Meta Ad', date: '2025-04-24 09:15', status: 'new', budget: '₹20L–₹50L', pri: 'High', notes: 'Wants site visit next week', leadType: 'construction' },
  { id: 'L002', name: 'Priya Reddy', phone: '+91 87654 32109', loc: 'Jubilee Hills, HYD', req: '25×12ft rectangular, plaster finish, heating system, blue tiles', src: 'Cold Call', date: '2025-04-23 14:30', status: 'design', budget: '₹10L–₹20L', pri: 'Normal', notes: 'Prefers blue tiles', leadType: 'construction' },
  { id: 'L003', name: 'Suresh Kapoor', phone: '+91 76543 21098', loc: 'Gachibowli, HYD', req: '30×15ft L-shaped, pebble finish, auto-filter, deck area', src: 'Meta Ad', date: '2025-04-22 11:00', status: 'quoted', budget: '₹10L–₹20L', pri: 'Normal', notes: 'Has existing garden space', leadType: 'construction' },
  { id: 'L004', name: 'Ananya Singh', phone: '+91 65432 10987', loc: 'Madhapur, HYD', req: '20×10ft plunge pool, glass tiles, custom lighting', src: 'Referral', date: '2025-04-21 16:45', status: 'followup', budget: '₹5L–₹10L', pri: 'Urgent', notes: 'Wants completion in 2 months', leadType: 'amc' },
  { id: 'L005', name: 'Vikram Nair', phone: '+91 54321 09876', loc: 'Kondapur, HYD', req: '35×18ft freeform, natural stone, waterfall feature, deck', src: 'Meta Ad', date: '2025-04-20 10:20', status: 'new', budget: '₹50L+', pri: 'High', notes: 'Has large backyard', leadType: 'construction' },
  { id: 'L006', name: 'Deepika Rao', phone: '+91 43210 98765', loc: 'Hitech City, HYD', req: '22×11ft kidney-shaped, luxury finish, smart controls', src: 'Website', date: '2025-04-19 13:00', status: 'design', budget: '₹20L–₹50L', pri: 'Normal', notes: '', leadType: 'amc' },
  { id: 'L007', name: 'Rahul Verma', phone: '+91 32109 87654', loc: 'Kompally, HYD', req: '28×14ft rectangular, tiled, standard filtration, steps', src: 'Cold Call', date: '2025-04-18 09:30', status: 'quoted', budget: '₹5L–₹10L', pri: 'Normal', notes: 'Budget conscious', leadType: 'amc' },
  { id: 'L008', name: 'Kavitha Pillai', phone: '+91 21098 76543', loc: 'Shamshabad, HYD', req: '45×22ft resort-style, infinity edge, multiple jets, lighting', src: 'Meta Ad', date: '2025-04-17 15:10', status: 'followup', budget: '₹50L+', pri: 'Urgent', notes: 'Commercial project', leadType: 'construction' },
];

const QUOTES = [
  { id: 'Q001', leadId: 'L003', client: 'Suresh Kapoor', size: '30×15 ft', amount: '₹14,85,000', date: '2025-04-23', status: 'sent' },
  { id: 'Q002', leadId: 'L004', client: 'Ananya Singh', size: '20×10 ft', amount: '₹7,20,000', date: '2025-04-22', status: 'pending' },
  { id: 'Q003', leadId: 'L007', client: 'Rahul Verma', size: '28×14 ft', amount: '₹9,40,000', date: '2025-04-21', status: 'pending' },
];

const DESIGNS = [
  { leadId: 'L002', client: 'Priya Reddy', req: '25×12ft rectangular', designer: 'Rajesh Kumar', style: 'Rectangular', status: 'progress' },
  { leadId: 'L006', client: 'Deepika Rao', req: '22×11ft kidney', designer: 'Priya Sharma', style: 'Kidney', status: 'progress' },
  { leadId: 'L003', client: 'Suresh Kapoor', req: '30×15ft L-shaped', designer: 'Mohammed Ali', style: 'L-Shaped', status: 'done' },
  { leadId: 'L004', client: 'Ananya Singh', req: '20×10ft plunge', designer: 'Rajesh Kumar', style: 'Plunge Pool', status: 'done' },
];

const FOLLOWUPS = [
  { leadId: 'L004', name: 'Ananya Singh', phone: '+91 65432 10987', calls: [{ done: true, date: 'Apr 20', out: 'Interested' }, { done: true, date: 'Apr 22', out: 'Follow up again' }, { done: false }, { done: false }, { done: false }], rating: 4 },
  { leadId: 'L008', name: 'Kavitha Pillai', phone: '+91 21098 76543', calls: [{ done: true, date: 'Apr 18', out: 'Callback requested' }, { done: true, date: 'Apr 20', out: 'Needs time' }, { done: true, date: 'Apr 22', out: 'Very interested' }, { done: false }, { done: false }], rating: 5 },
  { leadId: 'L007', name: 'Rahul Verma', phone: '+91 32109 87654', calls: [{ done: true, date: 'Apr 19', out: 'Quote discussed' }, { done: false }, { done: false }, { done: false }, { done: false }], rating: 3 },
];

const AGENTS = [
  { id: 'ravi', name: 'Ravi Teja', calls: 12, target: 20 },
  { id: 'sush', name: 'Sushma G.', calls: 17, target: 20 },
  { id: 'kiru', name: 'Kiran M.', calls: 8, target: 20 },
];

const CALLLOG = [
  { time: '09:15', agent: 'Ravi Teja', client: 'Ananya Singh', cn: '3rd', dur: '3–5 min', out: 'Interested' },
  { time: '10:02', agent: 'Sushma G.', client: 'Kavitha Pillai', cn: '4th', dur: '5–10 min', out: 'Very Interested' },
  { time: '10:45', agent: 'Kiran M.', client: 'Rahul Verma', cn: '2nd', dur: '1–3 min', out: 'Needs Time' },
  { time: '11:30', agent: 'Sushma G.', client: 'Arjun Mehta', cn: '1st', dur: '3–5 min', out: 'Callback Requested' },
  { time: '13:00', agent: 'Ravi Teja', client: 'Vikram Nair', cn: '1st', dur: '>10 min', out: 'Converted!' },
];

const USERS = [
  { name: 'Venkat Reddy', email: 'venkat@elitepool.in', role: 'ceo', status: 'Active', last: 'Today 09:00' },
  { name: 'Rajesh Kumar', email: 'rajesh@elitepool.in', role: 'admin', status: 'Active', last: 'Today 08:45' },
  { name: 'Ravi Teja', email: 'ravi@elitepool.in', role: 'support', status: 'Active', last: 'Today 10:30' },
  { name: 'Sushma G.', email: 'sushma@elitepool.in', role: 'support', status: 'Active', last: 'Today 11:00' },
  { name: 'Kiran M.', email: 'kiran@elitepool.in', role: 'support', status: 'Active', last: 'Today 09:15' },
];

const EMPLOYEES = USERS.map(u => ({ id: u.email.split('@')[0], name: u.name, role: u.role, dept: u.role === 'support' ? 'Customer Support' : u.role === 'admin' ? 'Operations' : 'Management' }));

let ATTENDANCE_RECORDS = [];
// Pre-populate with some sample records for today and yesterday
const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
EMPLOYEES.forEach(emp => {
  ATTENDANCE_RECORDS.push({ id: `ATT-${Date.now()}-${emp.id}-0`, empId: emp.id, empName: emp.name, date: today, checkIn: '09:00', checkOut: emp.role === 'support' ? '18:00' : null, status: 'present', notes: '' });
  ATTENDANCE_RECORDS.push({ id: `ATT-${Date.now()}-${emp.id}-1`, empId: emp.id, empName: emp.name, date: yesterday, checkIn: '09:15', checkOut: '18:30', status: 'present', notes: '' });
});

const CONSTRUCTION_SITES = [
  { id: 'CS001', client: 'Arjun Mehta', location: 'Banjara Hills, HYD', leadId: 'L001', startDate: '2025-04-10', status: 'active', plans: [], logs: [] },
  { id: 'CS002', client: 'Priya Reddy', location: 'Jubilee Hills, HYD', leadId: 'L002', startDate: '2025-04-15', status: 'active', plans: [], logs: [] },
  { id: 'CS003', client: 'Suresh Kapoor', location: 'Gachibowli, HYD', leadId: 'L003', startDate: '2025-04-01', status: 'completed', plans: [], logs: [] },
];

const AMC_SITES = [
  { id: 'AMC001', client: 'Ananya Singh', location: 'Madhapur, HYD', leadId: 'L004', startDate: '2025-03-01', status: 'active', entries: [] },
  { id: 'AMC002', client: 'Vikram Nair', location: 'Kondapur, HYD', leadId: 'L005', startDate: '2025-02-15', status: 'active', entries: [] },
];

const PROCUREMENTS = [];
// Each procurement entry shape:
// {
//   id: string,
//   siteId: string,
//   siteName: string,
//   client: string,
//   siteType: 'construction' | 'amc',
//   requirements: string,
//   date: string,       // YYYY-MM-DD
//   time: string,       // HH:MM
//   logDate: string,    // date from the log
//   status: 'pending' | 'done'
// }

// ── ACCOUNTS ─────────────────────────────────
const SITE_ACCOUNTS = [
  {
    id: 'SA001', siteName: 'Arjun Mehta Site', location: 'Banjara Hills, HYD', linkedSiteId: 'CS001', lastUpdated: '2025-04-24',
    m2a: { payments: [{ amount: 1500000, date: '2025-04-20' }], expenditures: [] },
    elitePool: {
      construction: { payments: [{ amount: 500000, date: '2025-04-15' }], expenditures: [] },
      amc: { payments: [], expenditures: [] }
    }
  },
  {
    id: 'SA002', siteName: 'Priya Reddy Site', location: 'Jubilee Hills, HYD', linkedSiteId: 'CS002', lastUpdated: '2025-04-22',
    m2a: { payments: [{ amount: 1200000, date: '2025-04-18' }], expenditures: [] },
    elitePool: {
      construction: { payments: [{ amount: 300000, date: '2025-04-12' }], expenditures: [] },
      amc: { payments: [], expenditures: [] }
    }
  },
  {
    id: 'SA003', siteName: 'Ananya Singh AMC', location: 'Madhapur, HYD', linkedSiteId: 'AMC001', lastUpdated: '2025-04-20',
    m2a: { payments: [], expenditures: [] },
    elitePool: {
      construction: { payments: [], expenditures: [] },
      amc: { payments: [{ amount: 80000, date: '2025-04-10' }], expenditures: [] }
    }
  },
];

const OFFICE_EXPENSES = {
  salaries: [],
  rent: [],
  petty: []
};

// RBAC permissions
const PERMS = {
  ceo: ['dashboard', 'leads', 'pipeline', 'addlead', 'design', 'quotation', 'send', 'followup', 'calltracker', 'feedback', 'users', 'construction', 'amc', 'attendance', 'm2aaccounts', 'elitepoolaccounts', 'officeexpenses', 'procurements'],
  admin: ['dashboard', 'leads', 'pipeline', 'addlead', 'design', 'quotation', 'send', 'calltracker', 'feedback', 'users', 'construction', 'amc', 'attendance', 'm2aaccounts', 'elitepoolaccounts', 'officeexpenses', 'procurements'],
  support: ['dashboard', 'leads', 'followup', 'calltracker', 'feedback'],
};

// ═══════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════
function selectRole(r) {
  selRole = r;
  const pills = document.querySelectorAll('.role-pill');
  if (pills) pills.forEach(p => p.classList.remove('active', 'active-gold', 'active-green'));
  const map = { ceo: 'active-gold', admin: 'active', support: 'active-green' };
  const el = document.getElementById('rp_' + r);
  if (el) el.classList.add(map[r]);
}
// Default role is set inside useEffect

function doLogin() {
  const u = document.getElementById('li_user').value.trim();
  const p = document.getElementById('li_pass').value.trim();
  if (!u) { toast('Please enter a username', 'error'); return; }
  if (p !== 'admin123') { toast('Invalid password. Use: admin123', 'error'); return; }

  CUR.role = selRole;
  CUR.name = u;
  CUR.avatar = u.charAt(0).toUpperCase();

  toast(`✅ Signed in as ${u}`, 'success');

  window.dispatchEvent(new CustomEvent('login-success'));
}

function doLogout() {
  window.location.href = '/';
}

// ═══════════════════════════════════════════
// RBAC
// ═══════════════════════════════════════════
function applyRBAC() {
  const allowed = PERMS[CUR.role] || [];
  const navMap = {
    leads: 'nb_leads',
    leads_con: 'nb_leads_con',
    leads_amc: 'nb_leads_amc',
    pipeline: 'nb_pipeline',
    addlead: 'nb_addlead',
    design: 'nb_design',
    quotation: 'nb_quotation',
    send: 'nb_send',
    followup: 'nb_followup',
    calltracker: 'nb_calltracker',
    feedback: 'nb_feedback',
    users: 'nb_users',
    construction: 'nb_construction',
    amc: 'nb_amc',
    attendance: 'nb_attendance',
    m2a_accounts: 'nb_m2a',
    elitepool_accounts: 'nb_elitepool',
    officeexpenses: 'nb_officeexpenses'
  };
  Object.entries(navMap).forEach(([pg, id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    let permKey = pg;
    if (pg === 'leads_con' || pg === 'leads_amc') permKey = 'leads';
    if (allowed.includes(permKey)) {
      el.classList.remove('locked');
    } else {
      el.classList.add('locked');
    }
  });
}

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════
// go function is now replaced by react-router-dom Link and useNavigate

// ═══════════════════════════════════════════
// RENDER ALL
// ═══════════════════════════════════════════
function renderAll() {
  // Clear followup/feedback containers to prevent content bleeding across pages
  const fuEl = document.getElementById('fu_grid');
  const fbEl = document.getElementById('fb_grid');
  if (fuEl) fuEl.innerHTML = '';
  if (fbEl) fbEl.innerHTML = '';

  renderDash();
  renderLeads();
  renderPipeline();
  renderDesign();
  renderQuotes();
  renderCallTracker();
  renderCallLog();
  renderUsers();
  renderConstruction();
  renderAMC();
  populateSendSelect();
  renderAttendance(new Date().toISOString().slice(0, 10));
  renderFUTable('', '');

  // dashboard stats
  const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setT('d_total', LEADS.length);
  setT('d_quotes', QUOTES.filter(q => q.status === 'sent').length);
  setT('d_fu', FOLLOWUPS.reduce((a, f) => a + f.calls.filter(c => c.done).length, 0));
  setT('d_pd', DESIGNS.filter(d => d.status === 'progress').length);
  setT('nb_leads_cnt', LEADS.length);
  setT('nb_leads_con_cnt', LEADS.filter(l => l.leadType === 'construction' || !l.leadType).length);
  setT('nb_leads_amc_cnt', LEADS.filter(l => l.leadType === 'amc').length);
  setT('nb_fu_cnt', FOLLOWUPS.reduce((a, f) => a + f.calls.filter(c => !c.done).length, 0));

  const tot = AGENTS.reduce((a, x) => a + x.calls, 0);
  setT('ct_total', tot);
  const rate = Math.round((AGENTS.reduce((a, x) => a + x.calls / x.target, 0) / AGENTS.length) * 100);
  setT('ct_rate', rate + '%');

  const d = new Date();
  setT('ct_date', `Follow-up calls — ${d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);

  renderSiteAccounts('m2a');
  renderSiteAccounts('elitePool');
  renderAccountsSummary();
  renderOfficeExpenses();
  renderProcurements();
}

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
function renderDash() {
  const tb = document.getElementById('d_leads_tb');
  if (tb) tb.innerHTML = LEADS.slice(0, 5).map(l => `
    <tr>
      <td style="font-weight:700;color:var(--text)">${l.name}</td>
      <td class="mono" style="font-size:12px">${l.phone}</td>
      <td>${l.loc}</td>
      <td style="font-size:11px;color:var(--text3)">${l.date}</td>
      <td>
        <span class="s s-${l.status}">${l.status}</span>
        <span style="font-size:10px;margin-left:4px;padding:2px 6px;border-radius:10px;font-weight:600;background:${l.leadType === 'amc' ? 'var(--gold-bg, #fff8e1)' : 'var(--sky-bg, #e3f2fd)'};color:${l.leadType === 'amc' ? 'var(--gold, #f59e0b)' : 'var(--sky, #0ea5e9)'}">${l.leadType === 'amc' ? 'AMC' : 'Construction'}</span>
      </td>
      <td><button class="btn btn-ghost btn-xs" onclick="openLead('${l.id}')">👁 View</button></td>
    </tr>
  `).join('');

  const ag = document.getElementById('d_agents');
  if (ag) ag.innerHTML = AGENTS.map(a => `
    <div class="acard">
      <div class="acard-name">${a.name}</div>
      <div class="acard-num">${a.calls}</div>
      <div class="acard-label">calls today</div>
    </div>
  `).join('');

  renderDashReviews();
}

function renderDashReviews() {
  const el = document.getElementById('d_reviews');
  if (!el) return;
  el.innerHTML = FOLLOWUPS.map(f => {
    const done = f.calls.filter(c => c.done).length;
    return `
    <div class="fcard">
      <div class="fcard-top">
        <div>
          <div class="fcard-name">${f.name}</div>
          <div class="fcard-phone" style="margin-top:4px">${f.calls.filter(c => c.done).map(c => c.out).join(' → ')}</div>
        </div>
        <span class="s s-followup">${done}/5</span>
      </div>
      <div class="stars" style="margin-bottom:12px">
        ${[1, 2, 3, 4, 5].map(n => `<span class="star ${n <= f.rating ? 'lit' : ''}">${n <= f.rating ? '★' : '☆'}</span>`).join('')}
      </div>
      <textarea class="ft" style="min-height:60px;font-size:12px" placeholder="Client feedback notes…">${done >= 3 ? 'Client shows interest, following up post-quotation.' : ''}</textarea>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════
// LEADS
// ═══════════════════════════════════════════
function renderLeads(type) {
  const allowed = PERMS[CUR.role] || [];

  const rowHTML = (l) => `
    <tr>
      <td class="mono" style="font-size:11px;color:var(--text3)">${l.id}</td>
      <td style="font-weight:700;color:var(--text)">${l.name}</td>
      <td class="mono" style="font-size:12px">${l.phone}</td>
      <td>${l.loc}</td>
      <td style="font-size:11px;max-width:160px;overflow:hidden;text-overflow:ellipsis">${l.req}</td>
      <td><span class="pill ${l.src === 'Meta Ad' ? 'pill-sky' : ''}">${l.src}</span></td>
      <td style="font-size:11px;color:var(--text3)">${l.date}</td>
      <td><span class="s s-${l.status}">${l.status}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-xs" onclick="openLead('${l.id}')">👁</button>
          <button class="btn btn-sky btn-xs" onclick="openEditLead('${l.id}')">✏️ Edit</button>
          ${allowed.includes('design') ? `<button class="btn btn-red btn-xs" onclick="delLead('${l.id}')">🗑</button>` : ''}
        </div>
      </td>
    </tr>`;

  const renderTable = (t, elId) => {
    const el = document.getElementById(elId);
    if (!el) return;
    const st = leadsState[t];
    let d = LEADS.filter(l => t === 'construction' ? (l.leadType === 'construction' || !l.leadType) : (l.leadType === 'amc'));

    if (st.q) {
      const q = st.q.toLowerCase();
      d = d.filter(l => l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.loc.toLowerCase().includes(q.toLowerCase()));
    }
    if (st.s) d = d.filter(l => l.status === st.s);

    if (st.by === 'd-asc') d.sort((a, b) => a.date.localeCompare(b.date));
    else if (st.by === 'd-desc') d.sort((a, b) => b.date.localeCompare(a.date));
    else d.sort((a, b) => a.name.localeCompare(b.name));

    el.innerHTML = d.map(rowHTML).join('') ||
      `<tr><td colspan="9" style="text-align:center;color:var(--text3);padding:16px">No ${t === 'construction' ? 'Pool Construction' : 'AMC / Repair / Renovation'} leads</td></tr>`;
  };

  if (!type || type === 'construction') renderTable('construction', 'leads_tb_construction');
  if (!type || type === 'amc') renderTable('amc', 'leads_tb_amc');
}

window.downloadLeadsExcel = function(type) {
  const st = leadsState[type];
  let data = LEADS.filter(l => type === 'construction' ? (l.leadType === 'construction' || !l.leadType) : (l.leadType === 'amc'));

  if (st.q) {
    const q = st.q.toLowerCase();
    data = data.filter(l => l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.loc.toLowerCase().includes(q.toLowerCase()));
  }
  if (st.s) data = data.filter(l => l.status === st.s);

  if (st.by === 'd-asc') data.sort((a, b) => a.date.localeCompare(b.date));
  else if (st.by === 'd-desc') data.sort((a, b) => b.date.localeCompare(a.date));
  else data.sort((a, b) => a.name.localeCompare(b.name));

  const headers = ["ID", "Name", "Phone", "Location", "Requirements", "Source", "Date", "Status"];
  const rows = data.map(l => [
    l.id,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    l.phone,
    `"${(l.loc || '').replace(/"/g, '""')}"`,
    `"${(l.req || '').replace(/"/g, '""')}"`,
    l.src,
    l.date,
    l.status
  ]);

  const csvContent = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Leads_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.srchLeads = function (type, q) { leadsState[type].q = q; renderLeads(type); }
window.filtLeads = function (type, s) { leadsState[type].s = s; renderLeads(type); }
window.sortLeads = function (type, by) { leadsState[type].by = by; renderLeads(type); }

window.delLead = function (id) {
  const i = LEADS.findIndex(l => l.id === id);
  if (i > -1) { const n = LEADS[i].name; LEADS.splice(i, 1); renderAll(); toast(`🗑 "${n}" removed`, 'warn'); }
}

window.openLead = function (id) {
  const l = LEADS.find(x => x.id === id);
  if (!l) return;
  viewLead = l;
  document.getElementById('ml_dtitle').textContent = `📋 ${l.name} — ${l.id}`;
  const allowed = PERMS[CUR.role] || [];
  document.getElementById('ml_dbody').innerHTML = `
    <div class="dg">
      <div class="dg-item"><div class="dg-label">Lead ID</div><div class="dg-val mono" style="color:var(--sky)">${l.id}</div></div>
      <div class="dg-item"><div class="dg-label">Status</div><span class="s s-${l.status}">${l.status}</span></div>
      <div class="dg-item"><div class="dg-label">Client Name</div><div class="dg-val" style="font-weight:700">${l.name}</div></div>
      <div class="dg-item"><div class="dg-label">Phone</div><div class="dg-val mono">${l.phone}</div></div>
      <div class="dg-item"><div class="dg-label">Location</div><div class="dg-val">${l.loc}</div></div>
      <div class="dg-item"><div class="dg-label">Source</div><span class="pill pill-sky">${l.src}</span></div>
      <div class="dg-item"><div class="dg-label">Priority</div><div class="dg-val" style="color:${l.pri === 'Urgent' ? 'var(--red)' : l.pri === 'High' ? 'var(--gold)' : 'var(--text2)'}">${l.pri}</div></div>
    </div>
    <div style="margin-bottom:14px"><div class="dg-label" style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:8px">Pool Requirements</div>
      <div class="qbox">${l.req}</div>
    </div>
    ${l.notes ? `<div class="dg-label" style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);">Notes</div><div style="font-size:13px;color:var(--text2);margin-top:6px">${l.notes}</div>` : ''}
    ${allowed.includes('design') ? `
    <div class="divider"></div>
    <div class="dg-label" style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:8px">Change Status</div>
    <div class="status-btns">
      ${['new', 'design', 'quoted', 'followup', 'closed'].map(s => `<button class="sbtn${l.status === s ? ' cur' : ''}" onclick="chStatus('${l.id}','${s}',this)">${s}</button>`).join('')}
    </div>`: ''}
  `;
  openM('m_leaddetail');
}

window.openEditLead = function (id) {
  const l = LEADS.find(x => x.id === id);
  if (!l) return;
  document.getElementById('mel_id').value = l.id;
  document.getElementById('mel_name').value = l.name;
  document.getElementById('mel_phone').value = l.phone;
  document.getElementById('mel_loc').value = l.loc;
  document.getElementById('mel_req').value = l.req;
  document.getElementById('mel_src').value = l.src;
  document.getElementById('mel_pri').value = l.pri;
  document.getElementById('mel_notes').value = l.notes || '';
  document.getElementById('mel_lt').value = l.leadType || 'construction';
  document.getElementById('mel_modal_title').textContent = `✏️ Edit Lead — ${l.name}`;
  openM('m_editlead');
};

window.saveEditLead = function () {
  const id = document.getElementById('mel_id').value;
  const l = LEADS.find(x => x.id === id);
  if (!l) return;
  const n = document.getElementById('mel_name').value.trim();
  const p = document.getElementById('mel_phone').value.trim();
  if (!n || !p) { toast('❌ Name and phone are required', 'error'); return; }
  l.name = n;
  l.phone = p;
  l.loc = document.getElementById('mel_loc').value.trim() || 'N/A';
  l.req = document.getElementById('mel_req').value.trim() || 'TBD';
  l.src = document.getElementById('mel_src').value;
  l.pri = document.getElementById('mel_pri').value;
  l.notes = document.getElementById('mel_notes').value.trim();
  l.leadType = document.getElementById('mel_lt').value;
  renderAll();
  closeM('m_editlead');
  toast(`✅ Lead "${n}" updated!`, 'success');
};

window.chStatus = function (id, st, btn) {
  const l = LEADS.find(x => x.id === id);
  if (l) {
    l.status = st; renderAll(); toast(`🔄 Status → "${st}"`, 'success');
    document.querySelectorAll('.sbtn').forEach(b => b.classList.remove('cur'));
    btn.classList.add('cur');
  }
}

window.fwdDesign = function () {
  if (!viewLead) return;
  const l = viewLead;
  l.status = 'design';
  if (!DESIGNS.find(d => d.leadId === l.id)) {
    DESIGNS.unshift({ leadId: l.id, client: l.name, req: l.req, designer: 'Rajesh Kumar', style: 'Rectangular', status: 'progress' });
  }
  renderAll();
  closeM('m_leaddetail');
  toast(`📐 ${l.name} forwarded to Design!`, 'success');
  setTimeout(() => go('design', document.getElementById('nb_design')), 400);
}

// ═══════════════════════════════════════════
// PIPELINE
// ═══════════════════════════════════════════
const PCOLS = [
  { k: 'new', label: 'New Leads', color: 'var(--sky)' },
  { k: 'design', label: 'In Design', color: 'var(--pink)' },
  { k: 'quoted', label: 'Quoted', color: 'var(--gold)' },
  { k: 'followup', label: 'Follow-up', color: 'var(--green)' },
  { k: 'closed', label: 'Closed', color: 'var(--red)' },
];

function renderPipeline() {
  const el = document.getElementById('pipeline_board');
  if (el) el.innerHTML = PCOLS.map(c => {
    const cl = LEADS.filter(l => l.status === c.k);
    return `
    <div class="pcol">
      <div class="pcol-head">
        <span class="pcol-title" style="color:${c.color}">${c.label}</span>
        <span class="pcol-cnt">${cl.length}</span>
      </div>
      <div class="pcards">
        ${cl.length ? cl.map(l => `
          <div class="pcard" onclick="openLead('${l.id}')">
            <div class="pcard-name">${l.name}</div>
            <div class="pcard-info">${l.loc}</div>
            <div class="pcard-info" style="font-family:var(--mono)">${l.phone}</div>
            <div class="pcard-tags" style="margin-top:8px">
              <span class="ptag">${l.src}</span>
              <span class="ptag" style="${l.pri === 'Urgent' ? 'color:var(--red)' : l.pri === 'High' ? 'color:var(--gold)' : ''}">${l.pri}</span>
            </div>
          </div>
        `).join('') : '<div class="empty" style="padding:16px;font-size:11px">No leads</div>'}
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════
// ADD LEAD FORM (page)
// ═══════════════════════════════════════════
function saveLead() {
  const n = document.getElementById('al_name').value.trim();
  const p = document.getElementById('al_phone').value.trim();
  if (!n || !p) { toast('Name and phone are required', 'error'); return; }
  const nl = {
    id: 'L' + String(LEADS.length + 1).padStart(3, '0'),
    name: n, phone: p, loc: document.getElementById('al_loc').value || 'N/A',
    req: document.getElementById('al_req').value || 'TBD',
    src: document.getElementById('al_src').value,
    budget: Array.from(document.querySelectorAll('input[name="al_budget"]:checked')).map(cb => cb.value).join(', ') || 'N/A',
    pri: document.getElementById('al_pri').value,
    notes: document.getElementById('al_notes').value,
    leadType: document.getElementById('al_lt').value || 'construction',
    date: new Date().toISOString().slice(0, 16).replace('T', ' '), status: 'new',
  };
  LEADS.unshift(nl); renderAll(); clearAL();
  toast(`✅ Lead "${n}" added!`, 'success');
  setTimeout(() => go('leads', document.getElementById('nb_leads')), 500);
}
function clearAL() {
  ['al_name', 'al_phone', 'al_loc', 'al_req', 'al_notes'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.querySelectorAll('input[name="al_budget"]').forEach(cb => cb.checked = false);
}

// ═══════════════════════════════════════════
// ADD LEAD MODAL
// ═══════════════════════════════════════════
function saveLeadModal() {
  const n = document.getElementById('ml_name').value.trim();
  const p = document.getElementById('ml_phone').value.trim();
  if (!n || !p) { toast('Name and phone are required', 'error'); return; }
  const nl = {
    id: 'L' + String(LEADS.length + 1).padStart(3, '0'),
    name: n, phone: p, loc: document.getElementById('ml_loc').value || 'N/A',
    req: document.getElementById('ml_req').value || 'TBD',
    src: document.getElementById('ml_src').value,
    pri: document.getElementById('ml_pri').value,
    notes: '', date: new Date().toISOString().slice(0, 16).replace('T', ' '), status: 'new',
  };
  LEADS.unshift(nl); renderAll(); closeM('m_addlead');
  toast(`✅ Lead "${n}" added!`, 'success');
}

// ═══════════════════════════════════════════
// DESIGN
// ═══════════════════════════════════════════
function renderDesign() {
  const allowed = PERMS[CUR.role] || [];
  const el = document.getElementById('design_tb');
  if (el) el.innerHTML = DESIGNS.map(d => `
    <tr>
      <td class="mono" style="font-size:11px;color:var(--text3)">${d.leadId}</td>
      <td style="font-weight:700;color:var(--text)">${d.client}</td>
      <td style="font-size:11px;max-width:180px;overflow:hidden;text-overflow:ellipsis">${d.req}</td>
      <td>${d.designer}</td>
      <td><span class="pill">${d.style}</span></td>
      <td><span class="s s-${d.status === 'done' ? 'done' : 'progress'}">${d.status === 'done' ? 'Completed' : 'In Progress'}</span></td>
      <td>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-xs" onclick="openDesignDetail('${d.leadId}')">📄 View</button>
          <button class="btn btn-sky btn-xs" onclick="openDesignRevision('${d.leadId}')">🔄 Revision</button>
          ${d.status !== 'done' && allowed.includes('design') ? `<button class="btn btn-green btn-xs" onclick="confirmDesignDone('${d.leadId}')">✅ Done</button>` : ''}
          <button class="btn btn-red btn-xs" onclick="confirmDeleteDesign('${d.leadId}')">🗑 Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.markDesignDone = function (id) {
  const d = DESIGNS.find(x => x.leadId === id);
  if (d) { d.status = 'done'; renderDesign(); renderDash(); toast('✅ Design marked complete!', 'success'); }
}

window.confirmDesignDone = function (id) {
  const d = DESIGNS.find(x => x.leadId === id);
  if (!d) return;
  document.getElementById('mcd_title').textContent = '✅ Mark Design Complete';
  document.getElementById('mcd_body').textContent = `Are you sure you want to mark the design plan for "${d.client}" as completed?`;
  document.getElementById('mcd_confirm').onclick = () => {
    markDesignDone(id);
    closeM('m_confirm_design');
  };
  openM('m_confirm_design');
};

window.confirmDeleteDesign = function (id) {
  const d = DESIGNS.find(x => x.leadId === id);
  if (!d) return;
  document.getElementById('mcd_title').textContent = '🗑 Delete Design Plan';
  document.getElementById('mcd_body').textContent = `Are you sure you want to delete the design plan for "${d.client}"? This cannot be undone.`;
  document.getElementById('mcd_confirm').onclick = () => {
    const i = DESIGNS.findIndex(x => x.leadId === id);
    if (i > -1) { DESIGNS.splice(i, 1); renderDesign(); renderDash(); toast(`🗑 Design plan for "${d.client}" deleted.`, 'warn'); }
    closeM('m_confirm_design');
  };
  openM('m_confirm_design');
};

window.selectDesignLead = function (id, name) {
  document.getElementById('md_lead').value = id;
  document.getElementById('md_lead_search').value = name + ' (' + id + ')';
  document.getElementById('md_lead_selected').textContent = '✅ Selected: ' + name;
  const dd = document.getElementById('md_lead_dd');
  if (dd) dd.style.display = 'none';
};

window.openDesignDetail = function (leadId) {
  const d = DESIGNS.find(x => x.leadId === leadId);
  if (!d) return;
  document.getElementById('mdv_title').textContent = '📐 ' + d.client + ' — Design Plan';
  document.getElementById('mdv_body').innerHTML = `
    <div class="dg">
      <div class="dg-item"><div class="dg-label">LEAD ID</div><div class="dg-val mono" style="color:var(--sky)">${d.leadId}</div></div>
      <div class="dg-item"><div class="dg-label">CLIENT</div><div class="dg-val" style="font-weight:700">${d.client}</div></div>
      <div class="dg-item"><div class="dg-label">DESIGNER</div><div class="dg-val">${d.designer}</div></div>
      <div class="dg-item"><div class="dg-label">STYLE</div><span class="pill">${d.style}</span></div>
      <div class="dg-item"><div class="dg-label">STATUS</div><span class="s s-${d.status === 'done' ? 'done' : 'progress'}">${d.status === 'done' ? 'Completed' : 'In Progress'}</span></div>
    </div>
    <div style="margin-top:16px;padding:12px;background:var(--bg2);border-radius:8px;border:1px dashed var(--border);text-align:center;color:var(--text3);font-size:13px">
      ${d.uploadedFile
      ? `📎 Uploaded file: <span style="color:var(--green);font-weight:600">${d.uploadedFile}</span>`
      : '📎 No design file uploaded yet. Use "Add Plan" to upload PDF/DWG.'}
    </div>
  `;
  openM('m_designdetail');
};

function openM_design() {
  document.getElementById('md_lead').value = '';
  document.getElementById('md_lead_search').value = '';
  document.getElementById('md_lead_selected').textContent = '';
  const desSel = document.getElementById('md_designer');
  const designers = USERS.filter(u => ['ceo', 'admin', 'designer'].includes(u.role));
  desSel.innerHTML = designers.map(u => `<option value="${u.name}">${u.name} (${u.role})</option>`).join('');
  openM('m_design');
}

function saveDesign() {
  const id = document.getElementById('md_lead').value;
  if (!id) { toast('Select a lead', 'error'); return; }
  const l = LEADS.find(x => x.id === id);
  if (!l) return;
  if (!DESIGNS.find(d => d.leadId === id)) {
    const uploadedFile = document.getElementById('md_file_name') ? document.getElementById('md_file_name').textContent.trim() : null;
    DESIGNS.unshift({ leadId: id, client: l.name, req: l.req, designer: document.getElementById('md_designer').value, style: document.getElementById('md_style').value, status: 'progress', uploadedFile: uploadedFile || null });
    l.status = 'design'; renderAll();
  }
  closeM('m_design'); toast('📐 Design plan created!', 'success');
}

window.openDesignRevision = function (leadId) {
  const d = DESIGNS.find(x => x.leadId === leadId);
  if (!d) return;
  // Store which leadId we are revising
  document.getElementById('mdr_lead_id').value = leadId;
  document.getElementById('mdr_client_label').textContent = d.client + ' (' + leadId + ')';
  // Pre-fill fields with current design values
  document.getElementById('mdr_style').value = d.style || 'Rectangular';
  const desSel = document.getElementById('mdr_designer');
  const designers = USERS.filter(u => ['ceo', 'admin', 'designer'].includes(u.role));
  desSel.innerHTML = designers.map(u => `<option value="${u.name}">${u.name} (${u.role})</option>`).join('');
  desSel.value = d.designer;
  document.getElementById('mdr_notes').value = d.revisionNotes || '';
  // Clear file upload state
  document.getElementById('mdr_file_name').textContent = '';
  document.getElementById('mdr_file_row').style.display = 'none';
  document.getElementById('mdr_file_input').value = '';
  openM('m_designrevision');
};

window.saveDesignRevision = function () {
  const leadId = document.getElementById('mdr_lead_id').value;
  const d = DESIGNS.find(x => x.leadId === leadId);
  if (!d) return;
  d.style = document.getElementById('mdr_style').value;
  d.designer = document.getElementById('mdr_designer').value;
  d.revisionNotes = document.getElementById('mdr_notes').value.trim();
  const uploadedFile = document.getElementById('mdr_file_name').textContent.trim();
  if (uploadedFile) d.uploadedFile = uploadedFile;
  d.status = 'progress'; // Re-open as in-progress since a revision is requested
  d.revisionCount = (d.revisionCount || 0) + 1;
  renderDesign();
  closeM('m_designrevision');
  toast(`🔄 Revision #${d.revisionCount} submitted for ${d.client}!`, 'success');
};

// ═══════════════════════════════════════════
// QUOTATIONS
// ═══════════════════════════════════════════
function renderQuotes() {
  const el = document.getElementById('quotes_tb');
  if (el) el.innerHTML = QUOTES.map(q => `
    <tr>
      <td class="mono" style="color:var(--sky);font-weight:700">${q.id}</td>
      <td style="font-weight:700;color:var(--text)">${q.client}</td>
      <td>${q.size}</td>
      <td style="font-size:11px;color:var(--text3)">${q.date}</td>
      <td><span class="s s-${q.status}">${q.status}</span></td>
      <td>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
          <button class="btn btn-ghost btn-xs" onclick="openQuoteDetail('${q.id}')">👁 View</button>
          <button class="btn btn-sky btn-xs" onclick="openQuoteRevision('${q.id}')">🔄 Revision</button>
          <button class="btn btn-red btn-xs" onclick="confirmDeleteQuote('${q.id}')">🗑 Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.selectQuoteClient = function (id, name) {
  document.getElementById('mq_client').value = id;
  document.getElementById('mq_client_search').value = name + ' (' + id + ')';
  document.getElementById('mq_client_selected').textContent = '✅ Selected: ' + name;
  const dd = document.getElementById('mq_client_dd');
  if (dd) dd.style.display = 'none';
};

function openQuoteModal() {
  document.getElementById('mq_client').value = '';
  document.getElementById('mq_client_search').value = '';
  document.getElementById('mq_client_selected').textContent = '';
  document.getElementById('mq_file_name').textContent = '';
  document.getElementById('mq_file_row').style.display = 'none';
  openM('m_quote');
}

function saveQuote() {
  const cid = document.getElementById('mq_client').value;
  const l = LEADS.find(x => x.id === cid);
  if (!l) { toast('Select a client', 'error'); return; }
  const ln = parseFloat(document.getElementById('mq_l').value) || 0;
  const w = parseFloat(document.getElementById('mq_w').value) || 0;
  const d2 = 5; // Default depth since field is removed
  const fin = 0; // Default finish cost since field is removed
  const ld = document.getElementById('qa_l')?.checked ? 25000 : 0;
  const ht = document.getElementById('qa_h')?.checked ? 60000 : 0;
  const inf2 = document.getElementById('qa_i')?.checked ? 150000 : 0;
  const flt = document.getElementById('qa_f')?.checked ? 35000 : 0;
  const total = Math.round(ln * w * d2 * 850) + fin + ld + ht + inf2 + flt;
  const qFile = document.getElementById('mq_file_name') ? document.getElementById('mq_file_name').textContent.trim() : null;
  QUOTES.unshift({ id: 'Q' + String(QUOTES.length + 1).padStart(3, '0'), leadId: l.id, client: l.name, size: `${ln}×${w} ft`, amount: '₹' + total.toLocaleString('en-IN'), date: new Date().toISOString().slice(0, 10), status: 'pending', uploadedFile: qFile || null });
  l.status = 'quoted'; renderAll(); closeM('m_quote');
  toast(`💰 Quotation saved for ${l.name}!`, 'success');
}

window.openQuoteRevision = function (quoteId) {
  const q = QUOTES.find(x => x.id === quoteId);
  if (!q) return;
  document.getElementById('mqr_quote_id').value = quoteId;
  document.getElementById('mqr_client_label').textContent = q.client + ' — ' + q.id;
  // Pre-fill with current quote values
  const sizeMatch = q.size ? q.size.match(/([\d.]+)×([\d.]+)/) : null;
  document.getElementById('mqr_l').value = sizeMatch ? sizeMatch[1] : '30';
  document.getElementById('mqr_w').value = sizeMatch ? sizeMatch[2].replace(' ft', '').trim() : '15';
  document.getElementById('mqr_notes').value = q.revisionNotes || '';
  // Clear file upload state
  document.getElementById('mqr_file_name').textContent = '';
  document.getElementById('mqr_file_row').style.display = 'none';
  document.getElementById('mqr_file_input').value = '';
  openM('m_quoterevision');
};

window.saveQuoteRevision = function () {
  const quoteId = document.getElementById('mqr_quote_id').value;
  const q = QUOTES.find(x => x.id === quoteId);
  if (!q) return;
  const ln = parseFloat(document.getElementById('mqr_l').value) || 0;
  const w = parseFloat(document.getElementById('mqr_w').value) || 0;
  if (!ln || !w) { toast('❌ Please enter pool dimensions.', 'error'); return; }
  const total = Math.round(ln * w * 5 * 850);
  q.size = `${ln}×${w} ft`;
  q.amount = '₹' + total.toLocaleString('en-IN');
  q.revisionNotes = document.getElementById('mqr_notes').value.trim();
  const uploadedFile = document.getElementById('mqr_file_name').textContent.trim();
  if (uploadedFile) q.uploadedFile = uploadedFile;
  q.status = 'pending'; // Reset to pending since it is revised
  q.revisionCount = (q.revisionCount || 0) + 1;
  renderQuotes();
  closeM('m_quoterevision');
  toast(`🔄 Quote Revision #${q.revisionCount} saved for ${q.client}!`, 'success');
};

window.sendQ = function (id, via) {
  const q = QUOTES.find(x => x.id === id);
  if (q) { q.status = 'sent'; renderQuotes(); toast(via === 'wa' ? `📱 Sent via WhatsApp!` : `📧 Sent via Email!`, 'success'); }
}

window.confirmDeleteQuote = function (id) {
  const q = QUOTES.find(x => x.id === id);
  if (!q) return;
  document.getElementById('mcq_body').textContent = `Are you sure you want to delete Quote ${q.id} for "${q.client}"? This cannot be undone.`;
  document.getElementById('mcq_confirm').onclick = () => {
    const i = QUOTES.findIndex(x => x.id === id);
    if (i > -1) { QUOTES.splice(i, 1); renderQuotes(); toast(`🗑 Quote ${q.id} deleted.`, 'warn'); }
    closeM('m_confirm_quote');
  };
  openM('m_confirm_quote');
};

window.openQuoteDetail = function (id) {
  const q = QUOTES.find(x => x.id === id);
  if (!q) return;
  document.getElementById('mqv_title').textContent = '💰 Quote ' + q.id + ' — ' + q.client;
  document.getElementById('mqv_body').innerHTML = `
    <div class="dg">
      <div class="dg-item"><div class="dg-label">QUOTE #</div><div class="dg-val mono" style="color:var(--sky);font-weight:700">${q.id}</div></div>
      <div class="dg-item"><div class="dg-label">CLIENT</div><div class="dg-val" style="font-weight:700">${q.client}</div></div>
      <div class="dg-item"><div class="dg-label">POOL SIZE</div><div class="dg-val">${q.size}</div></div>
      <div class="dg-item"><div class="dg-label">DATE</div><div class="dg-val">${q.date}</div></div>
      <div class="dg-item"><div class="dg-label">STATUS</div><span class="s s-${q.status}">${q.status}</span></div>
    </div>
    <div style="margin-top:16px;padding:12px;background:var(--bg2);border-radius:8px;border:1px dashed var(--border);text-align:center;color:var(--text3);font-size:13px">
      ${q.uploadedFile
      ? `📎 Uploaded file: <span style="color:var(--green);font-weight:600">${q.uploadedFile}</span>`
      : '📎 No quotation file uploaded yet. Use "Generate Quote" to upload PDF.'}
    </div>
    ${q.status !== 'sent' ? `
    <div style="margin-top:16px;display:flex;gap:10px">
      <button class="btn btn-sky" onclick="sendQ('${q.id}','email');closeM('m_quotedetail')">📧 Send via Email</button>
    </div>` : '<div style="margin-top:12px;color:var(--green);font-size:13px;font-weight:600">✅ This quotation has already been sent.</div>'}
  `;
  openM('m_quotedetail');
};

// ═══════════════════════════════════════════
// SEND TO CLIENT
// ═══════════════════════════════════════════
function populateSendSelect() {
  const sel = document.getElementById('snd_client');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Select a Lead —</option>' + LEADS.map(l => `<option value="${l.id}">${l.name} (${l.id})</option>`).join('');
}

function updateSendPreview(id) {
  const l = LEADS.find(x => x.id === id);
  const pr = document.getElementById('snd_preview');
  if (!l) { pr.style.display = 'none'; return; }
  const q = QUOTES.find(x => x.leadId === id);
  const des = DESIGNS.find(d => d.leadId === id);
  pr.style.display = 'block';
  document.getElementById('snd_box').innerHTML = `
    <div class="qrow"><span>Client</span><span>${l.name}</span></div>
    <div class="qrow"><span>Phone</span><span>${l.phone}</span></div>
    <div class="qrow"><span>Location</span><span>${l.loc}</span></div>
    <div class="qrow"><span>Requirements</span><span style="max-width:200px;text-align:right;white-space:normal;font-size:11px">${l.req}</span></div>
    <div class="qrow"><span>Quotation</span><span>${q ? q.id + ' — ' + q.amount : '⚠ Not generated'}</span></div>
    <div class="qrow"><span>Design Plan</span><span>${des ? '✅ Ready' : '⏳ Pending'}</span></div>
  `;
}

function sendWA() {
  const id = document.getElementById('snd_client').value;
  const l = LEADS.find(x => x.id === id);
  if (!l) { toast('Select a client first', 'error'); return; }
  _sendAction(l, '📱 Sent via WhatsApp!');
}

function sendEmail() {
  const id = document.getElementById('snd_client').value;
  const l = LEADS.find(x => x.id === id);
  if (!l) { toast('Select a client first', 'error'); return; }
  _sendAction(l, '📧 Sent via Email!');
}

function _sendAction(l, msg) {
  const q = QUOTES.find(x => x.leadId === l.id);
  if (q) q.status = 'sent';
  l.status = 'followup';
  if (!FOLLOWUPS.find(f => f.leadId === l.id)) {
    FOLLOWUPS.push({ leadId: l.id, name: l.name, phone: l.phone, calls: [{ done: false }, { done: false }, { done: false }, { done: false }, { done: false }], rating: 0 });
  }
  renderAll(); toast(msg, 'success');
}

// ═══════════════════════════════════════════
// FOLLOW-UP
// ═══════════════════════════════════════════
function renderFUTable(flt, search) {
  const tb = document.getElementById('fu_table_tb');
  if (!tb) return;

  let data = [...FOLLOWUPS];
  if (flt === 'pending') data = data.filter(f => f.calls.some(c => !c.done));
  if (flt === 'done') data = data.filter(f => f.calls.every(c => c.done));
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(f => f.name.toLowerCase().includes(q) || f.phone.includes(q));
  }

  // Update stat counters
  const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setT('fu_stat_total', FOLLOWUPS.length);
  setT('fu_stat_pending', FOLLOWUPS.filter(f => f.calls.some(c => !c.done)).length);
  const todayDone = FOLLOWUPS.reduce((acc, f) => acc + f.calls.filter(c => c.done && c.date === 'Today').length, 0);
  setT('fu_stat_done', todayDone);
  const urgent = LEADS.filter(l => l.status === 'followup' && l.pri === 'Urgent').length;
  setT('fu_stat_urgent', urgent);

  if (!data.length) {
    tb.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text3);padding:28px">No follow-ups found</td></tr>`;
    return;
  }

  tb.innerHTML = data.map((f, i) => {
    const done = f.calls.filter(c => c.done).length;
    const pct = Math.round((done / 5) * 100);
    const allDone = done === 5;
    const lastDone = [...f.calls].reverse().find(c => c.done);
    const lastOut = lastDone ? lastDone.out : '—';
    const lastDate = lastDone ? lastDone.date : '—';
    const stars = [1, 2, 3, 4, 5].map(n => `<span style="color:${n <= f.rating ? 'var(--gold)' : 'var(--border)'}">★</span>`).join('');

    return `
    <tr style="cursor:pointer" onclick="openFUModal('${f.leadId}')">
      <td class="mono" style="font-size:11px;color:var(--text3)">${i + 1}</td>
      <td style="font-weight:700;color:var(--text)">${f.name}</td>
      <td class="mono" style="font-size:12px;color:var(--text2)">${f.phone}</td>
      <td style="min-width:150px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:6px;background:var(--bg3);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${allDone ? 'var(--green)' : 'var(--sky)'};border-radius:3px;transition:width 0.3s"></div>
          </div>
          <span style="font-size:11px;color:var(--text3);white-space:nowrap">${done}/5</span>
        </div>
      </td>
      <td style="font-size:11px;color:var(--text3)">${lastDate}</td>
      <td style="font-size:12px;color:var(--text2);max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${lastOut}">${lastOut}</td>
      <td style="font-size:13px">${stars}</td>
      <td>
        <span class="s ${allDone ? 's-done' : done > 0 ? 's-followup' : 's-new'}">
          ${allDone ? '✅ Done' : done > 0 ? '● ' + done + ' done' : '○ Not started'}
        </span>
      </td>
      <td onclick="event.stopPropagation()">
        <div style="display:flex;gap:6px">
          ${!allDone
        ? `<button class="btn btn-green btn-xs" onclick="openFU('${f.leadId}',${done})">📞 Call ${done + 1}</button>`
        : `<span style="font-size:11px;color:var(--green)">✅ All done</span>`}
          <button class="btn btn-ghost btn-xs" onclick="openSchedule('${f.leadId}')">📅</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

window.openFUModal = function (leadId) {
  const f = FOLLOWUPS.find(x => x.leadId === leadId);
  if (!f) return;
  const done = f.calls.filter(c => c.done).length;
  const pct = (done / 5) * 100;

  document.getElementById('mfu_detail_title').textContent = '📋 ' + f.name + ' — Follow-up Details';
  document.getElementById('mfu_detail_body').innerHTML = `
    <div style="margin-bottom:16px">
      <div style="font-weight:700;font-size:16px;color:var(--text);margin-bottom:4px">${f.name}</div>
      <div style="font-size:13px;color:var(--text2);font-family:var(--mono)">${f.phone}</div>
    </div>

    <div class="dots" style="margin-bottom:10px">
      ${f.calls.map((c, i) => `
        <div class="dot ${c.done ? 'done' : i === done ? 'cur' : ''}"
          title="${c.done ? 'Call ' + (i + 1) + ': ' + c.out : 'Pending'}"
          onclick="closeM('m_fu_detail');openFU('${f.leadId}',${i})">
          ${c.done ? '✓' : i + 1}
        </div>`).join('')}
    </div>
    <div class="pbar" style="margin-bottom:16px">
      <div class="pbar-fill" style="width:${pct}%"></div>
    </div>

    ${done > 0 ? `
    <div style="margin-bottom:16px">
      <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:8px">Call History</div>
      ${f.calls.map((c, i) => c.done ? `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:var(--bg2);border-radius:6px;margin-bottom:6px;border:1px solid var(--border)">
          <span style="font-size:12px;font-weight:600;color:var(--sky)">Call ${i + 1}</span>
          <span style="font-size:12px;color:var(--text2)">${c.out}</span>
          <span style="font-size:11px;color:var(--text3)">${c.date}</span>
        </div>` : '').join('')}
    </div>` : ''}

    <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
      ${done < 5
      ? `<button class="btn btn-green btn-sm" onclick="openFU('${f.leadId}',${done});closeM('m_fu_detail')">📞 Log Call ${done + 1}</button>`
      : `<span style="color:var(--green);font-size:13px;font-weight:600">✅ All 5 calls completed</span>`}
      <button class="btn btn-ghost btn-sm" onclick="openSchedule('${f.leadId}');closeM('m_fu_detail')" style="margin-left:auto">📅 Schedule</button>
    </div>
  `;
  openM('m_fu_detail');
};

function renderFU(flt) {
  // fu_grid is hidden — cards render only inside the detail modal via openFUModal()
  return;
  const el = document.getElementById('fu_grid');
  if (!el) return;
  let data = FOLLOWUPS;
  if (flt === 'pending') data = FOLLOWUPS.filter(f => f.calls.some(c => !c.done));
  if (flt === 'done') data = FOLLOWUPS.filter(f => f.calls.every(c => c.done));
  el.innerHTML = data.length ? data.map(f => {
    const done = f.calls.filter(c => c.done).length;
    const pct = (done / 5) * 100;
    return `
    <div class="fcard">
      <div class="fcard-top">
        <div>
          <div class="fcard-name">${f.name}</div>
          <div class="fcard-phone">${f.phone}</div>
        </div>
        <span class="s s-followup">${done}/5 Calls</span>
      </div>
      <div class="dots">
        ${f.calls.map((c, i) => `
          <div class="dot ${c.done ? 'done' : i === done ? 'cur' : ''}" title="${c.done ? 'Call ' + (i + 1) + ': ' + c.out : 'Pending'}" onclick="openFU('${f.leadId}',${i})">
            ${c.done ? '✓' : i + 1}
          </div>
        `).join('')}
      </div>
      <div class="pbar"><div class="pbar-fill" style="width:${pct}%"></div></div>
      <div style="display:flex;gap:8px;align-items:center">
        ${done < 5 ? `<button class="btn btn-green btn-sm" onclick="openFU('${f.leadId}',${done})">📞 Log Call ${done + 1}</button>` : `<span style="color:var(--green);font-size:12px">✅ All 5 done</span>`}
        <button class="btn btn-ghost btn-sm" onclick="openSchedule('${f.leadId}')" style="margin-left:auto">📅 Schedule</button>
      </div>
    </div>`;
  }).join('') : '<div class="empty"><div class="empty-icon">📭</div><div>No follow-ups found</div></div>';
}

window.filtFU = function (v) { renderFU(v); }

window.openFU = function (leadId, idx) {
  closeAllModals();
  const f = FOLLOWUPS.find(x => x.leadId === leadId);
  if (!f) return;
  fuState = { leadId, idx };
  document.getElementById('mfu_title').textContent = `📞 Log Follow-up Call ${idx + 1} — ${f.name}`;
  openM('m_fu');
}

window.logFU = function () {
  const f = FOLLOWUPS.find(x => x.leadId === fuState.leadId);
  if (!f) return;
  const out = document.getElementById('mfu_out').value;
  const dur = document.getElementById('mfu_dur').value;
  f.calls[fuState.idx] = { done: true, date: 'Today', out };
  CALLLOG.unshift({ time: new Date().toTimeString().slice(0, 5), agent: CUR.name, client: f.name, cn: (fuState.idx + 1) + 'th', dur, out });
  const a = AGENTS.find(x => x.name === CUR.name) || AGENTS[0];
  a.calls++;
  renderFU();
  renderFUTable('', '');
  closeM('m_fu');
  toast(`📞 Call ${fuState.idx + 1} logged for ${f.name}!`, 'success');
}

window.openSchedule = function (leadId) {
  closeAllModals();
  const f = FOLLOWUPS.find(x => x.leadId === leadId);
  if (!f) return;
  document.getElementById('msched_title').textContent = '📅 Schedule Call — ' + f.name;
  document.getElementById('msched_lead_id').value = leadId;
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('msched_dt').value = now.toISOString().slice(0, 16);
  document.getElementById('msched_note').value = '';
  openM('m_schedule');
};

window.saveSchedule = function () {
  const leadId = document.getElementById('msched_lead_id').value;
  const dt = document.getElementById('msched_dt').value;
  const note = document.getElementById('msched_note').value.trim();
  const f = FOLLOWUPS.find(x => x.leadId === leadId);
  if (!dt) { toast('❌ Please select a date and time.', 'error'); return; }
  const formatted = new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  toast(`📅 Call scheduled for ${f ? f.name : ''} on ${formatted}${note ? ' — ' + note : ''}`, 'success');
  closeM('m_schedule');
};

// ═══════════════════════════════════════════
// CALL TRACKER
// ═══════════════════════════════════════════
function renderCallTracker() {
  const el = document.getElementById('ct_agents');
  if (el) el.innerHTML = AGENTS.map(a => {
    const pct = Math.min(100, (a.calls / a.target) * 100);
    return `
    <div class="acard">
      <div class="acard-name">${a.name}</div>
      <div class="acard-num" style="color:${pct >= 80 ? 'var(--green)' : 'var(--sky)'}">${a.calls}</div>
      <div class="acard-label">calls today / target ${a.target}</div>
      <div class="pbar" style="margin:10px 0 6px">
        <div class="pbar-fill" style="width:${pct}%;background:${pct >= 80 ? 'linear-gradient(90deg,var(--green),#00ff90)' : 'linear-gradient(90deg,var(--sky),var(--sky2))'}"></div>
      </div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:10px">${Math.round(pct)}% of target</div>
      <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
        <button class="btn btn-ghost btn-sm" onclick="addCall('${a.id}')">+ Log Call</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--red);border-color:var(--red)" onclick="removeCall('${a.id}')">↩ Undo</button>
      </div>
    </div>`;
  }).join('');


}

window.addCall = function (id) {
  const a = AGENTS.find(x => x.id === id);
  if (a && a.calls < 99) { a.calls++; renderCallTracker(); renderDash(); renderAll(); toast(`📞 Call logged for ${a.name}`, 'success'); }
}

window.removeCall = function (id) {
  const a = AGENTS.find(x => x.id === id);
  if (!a) return;
  if (a.calls <= 0) { toast('⚠️ No calls to remove.', 'warn'); return; }
  a.calls--;
  renderCallTracker();
  renderDash();
  renderAll();
  toast(`↩️ Call removed for ${a.name}`, 'warn');
};

function renderCallLog() {
  const el = document.getElementById('ct_log');
  if (el) el.innerHTML = CALLLOG.map(c => `
    <tr>
      <td class="mono" style="font-size:11px;color:var(--text3)">${c.time}</td>
      <td style="font-weight:600">${c.agent}</td>
      <td>${c.client}</td>
      <td><span class="pill pill-sky">${c.cn}</span></td>
      <td style="color:var(--text3)">${c.dur}</td>
      <td><span class="s ${c.out.includes('Converted') ? 's-done' : c.out.includes('Interested') || c.out.includes('Very') ? 's-followup' : 's-pending'}">${c.out}</span></td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════════════
// FEEDBACK
// ═══════════════════════════════════════════
function renderFeedback() {
  const el = document.getElementById('fb_grid');
  if (!el) return;
  el.innerHTML = FOLLOWUPS.map(f => {
    const done = f.calls.filter(c => c.done).length;
    return `
    <div class="fcard">
      <div class="fcard-top">
        <div>
          <div class="fcard-name">${f.name}</div>
          <div class="fcard-phone" style="margin-top:4px">${f.calls.filter(c => c.done).map(c => c.out).join(' → ')}</div>
        </div>
        <span class="s s-followup">${done}/5</span>
      </div>
      <div class="stars" style="margin-bottom:12px">
        ${[1, 2, 3, 4, 5].map(n => `<span class="star ${n <= f.rating ? 'lit' : ''}" onclick="setRating('${f.leadId}',${n})">${n <= f.rating ? '★' : '☆'}</span>`).join('')}
      </div>
      <textarea class="ft" style="min-height:60px;font-size:12px" placeholder="Client feedback notes…">${done >= 3 ? 'Client shows interest, following up post-quotation.' : ''}</textarea>
      <div style="margin-top:10px">
        <button class="btn btn-green btn-sm" onclick="toast('⭐ Feedback saved!','success')">💾 Save Feedback</button>
      </div>
    </div>`;
  }).join('');
}

function setRating(id, r) {
  const f = FOLLOWUPS.find(x => x.leadId === id);
  if (f) { f.rating = r; renderFeedback(); }
}

// ═══════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════
function renderUsers() {
  const rc = { ceo: 'rbadge-ceo', admin: 'rbadge-admin', support: 'rbadge-support', designer: 'rbadge-admin' };
  const rl = { ceo: 'CEO', admin: 'Admin', support: 'Support', designer: 'Designer' };
  const el = document.getElementById('users_tb');
  if (el) el.innerHTML = USERS.map(u => `
    <tr>
      <td style="font-weight:700;color:var(--text)">${u.name}</td>
      <td class="mono" style="font-size:12px">${u.email}</td>
      <td><span class="tb-rbadge ${rc[u.role] || 'rbadge-admin'}">${rl[u.role] || u.role}</span></td>
      <td><span class="s s-active">${u.status}</span></td>
      <td style="font-size:11px;color:var(--text3)">${u.last}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-xs" onclick="openEditUser('${u.email}')">✏️ Edit</button>
          <button class="btn btn-red btn-xs" onclick="deactivateUser('${u.email}')">🔒</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function saveUser() {
  const n = document.getElementById('mu_name').value.trim();
  const e = document.getElementById('mu_email').value.trim();
  if (!n || !e) { toast('Name and email required', 'error'); return; }
  USERS.push({ name: n, email: e, role: document.getElementById('mu_role').value, status: 'Active', last: 'Never' });
  renderUsers(); closeM('m_adduser'); toast(`👤 "${n}" added!`, 'success');
}

window.openEditUser = function (email) {
  const u = USERS.find(x => x.email === email);
  if (!u) return;
  document.getElementById('meu_name').value = u.name;
  document.getElementById('meu_email').value = u.email;
  document.getElementById('meu_role').value = u.role;
  document.getElementById('meu_orig_email').value = u.email;
  openM('m_edituser');
};

window.deactivateUser = function (email) {
  const u = USERS.find(x => x.email === email);
  if (!u) return;
  u.status = u.status === 'Active' ? 'Inactive' : 'Active';
  renderUsers();
  toast(u.status === 'Active' ? `✅ ${u.name} reactivated` : `🔒 ${u.name} deactivated`, 'warn');
};

window.saveEditUser = function () {
  const orig = document.getElementById('meu_orig_email').value;
  const u = USERS.find(x => x.email === orig);
  if (!u) return;
  u.name = document.getElementById('meu_name').value.trim() || u.name;
  u.role = document.getElementById('meu_role').value;
  renderUsers();
  closeM('m_edituser');
  toast(`✅ ${u.name} updated!`, 'success');
};

function renderConstruction() {
  const el = document.getElementById('construction_tb');
  if (!el) return;
  el.innerHTML = CONSTRUCTION_SITES.map(s => `
    <tr>
      <td><span style="font-size:12px;color:var(--sky);font-weight:600">${s.id}</span></td>
      <td><strong>${s.client}</strong></td>
      <td>${s.location}</td>
      <td>${s.startDate}</td>
      <td><span class="s ${s.status === 'active' ? 's-followup' : 's-done'}">${s.status === 'active' ? '● Active' : '● Completed'}</span></td>
      <td style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="openConstructionPlans('${s.id}')">📂 Plans</button>
        <button class="btn btn-sky btn-sm" onclick="openAddPlan('${s.id}')">➕ Add Plan</button>
        <button class="btn btn-green btn-sm" onclick="openConstructionLog('${s.id}')">📋 Add Log</button>
        <button class="btn btn-ghost btn-sm" onclick="openViewConstructionLog('${s.id}')">📅 View Log</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:20px">No construction sites yet</td></tr>';
}

function renderAMC() {
  const el = document.getElementById('amc_tb');
  if (!el) return;
  el.innerHTML = AMC_SITES.map(s => `
    <tr>
      <td><span style="font-size:12px;color:var(--sky);font-weight:600">${s.id}</span></td>
      <td><strong>${s.client}</strong></td>
      <td>${s.location}</td>
      <td>${s.startDate}</td>
      <td><span class="s ${s.status === 'active' ? 's-followup' : 's-done'}">${s.status === 'active' ? '● Active' : '● Completed'}</span></td>
      <td style="display:flex;gap:6px">
        <button class="btn btn-sky btn-sm" onclick="openAMCLog('${s.id}')">📋 Add Log</button>
        <button class="btn btn-ghost btn-sm" onclick="openViewAMCLog('${s.id}')">📅 View Log</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:20px">No AMC sites yet</td></tr>';
}

function renderProcurements(searchQ, filterVal, sortVal) {
  const el = document.getElementById('pro_tb');
  if (!el) return;

  let data = [...PROCUREMENTS];

  if (searchQ) {
    const q = searchQ.toLowerCase();
    data = data.filter(p =>
      p.client.toLowerCase().includes(q) ||
      p.siteName.toLowerCase().includes(q) ||
      p.requirements.toLowerCase().includes(q)
    );
  }

  if (filterVal === 'construction') data = data.filter(p => p.siteType === 'construction');
  if (filterVal === 'amc') data = data.filter(p => p.siteType === 'amc');
  if (filterVal === 'pending') data = data.filter(p => p.status === 'pending');
  if (filterVal === 'done') data = data.filter(p => p.status === 'done');

  if (sortVal === 'oldest') data.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
  else data.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

  el.innerHTML = data.length ? data.map(p => `
    <tr style="cursor:pointer" onclick="openProcurementDetail('${p.id}')">
      <td style="font-size:11px;color:var(--sky);font-weight:600">${p.id}</td>
      <td style="font-weight:700">${p.client}</td>
      <td style="font-size:12px;color:var(--text3)">${p.siteName}</td>
      <td><span class="pill ${p.siteType === 'construction' ? 'pill-sky' : ''}">${p.siteType === 'construction' ? '🏗️ Construction' : '🔧 AMC'}</span></td>
      <td style="font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.requirements}</td>
      <td style="font-size:11px;color:var(--text3)">${p.date} ${p.time}</td>
      <td><span class="s ${p.status === 'done' ? 's-done' : 's-pending'}">${p.status === 'done' ? '● Done' : '● Pending'}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();openProcurementDetail('${p.id}')">👁 View</button>
          ${p.status === 'pending'
            ? `<button class="btn btn-green btn-xs" onclick="event.stopPropagation();markProcurementDone('${p.id}')">✅ Done</button>`
            : `<span style="font-size:11px;color:var(--green)">✓ Done</span>`}
        </div>
      </td>
    </tr>
  `).join('') :
    '<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px;font-size:13px">📭 No procurement requirements yet. They will appear automatically when logs are saved.</td></tr>';
}

window.openProcurementDetail = function(id) {
  const p = PROCUREMENTS.find(x => x.id === id);
  if (!p) return;
  document.getElementById('mpro_id').textContent = p.id;
  document.getElementById('mpro_client').textContent = p.client;
  document.getElementById('mpro_site').textContent = p.siteName;
  document.getElementById('mpro_type').textContent = p.siteType === 'construction' ? '🏗️ Pool Construction' : '🔧 Pool AMC';
  document.getElementById('mpro_date').textContent = p.date + ' at ' + p.time;
  document.getElementById('mpro_logdate').textContent = p.logDate;
  document.getElementById('mpro_requirements').textContent = p.requirements;
  document.getElementById('mpro_status').textContent = p.status === 'done' ? '✅ Done' : '⏳ Pending';
  document.getElementById('mpro_status').style.color = p.status === 'done' ? 'var(--green)' : 'var(--gold)';
  const doneBtn = document.getElementById('mpro_done_btn');
  if (doneBtn) {
    doneBtn.style.display = p.status === 'pending' ? 'inline-flex' : 'none';
    doneBtn.onclick = () => { markProcurementDone(id); closeM('m_procurement_detail'); };
  }
  openM('m_procurement_detail');
};

window.markProcurementDone = function(id) {
  const p = PROCUREMENTS.find(x => x.id === id);
  if (!p) return;
  p.status = 'done';
  renderProcurements();
  toast('✅ Procurement marked as done!', 'success');
};

function renderSiteAccounts(company, searchQ, filterVal, sortVal) {
  const elId = company === 'm2a' ? 'sa_m2a_tb' : 'sa_ep_tb';
  const el = document.getElementById(elId);
  if (!el) return;
  let data = [...SITE_ACCOUNTS];
  if (searchQ) data = data.filter(s =>
    s.siteName.toLowerCase().includes(searchQ.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQ.toLowerCase())
  );
  if (filterVal === 'construction') data = data.filter(s => s.linkedSiteId.startsWith('CS'));
  if (filterVal === 'amc') data = data.filter(s => s.linkedSiteId.startsWith('AMC'));
  if (sortVal === 'name') data.sort((a, b) => a.siteName.localeCompare(b.siteName));
  else data.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

  el.innerHTML = data.length ? data.map(s => {
    let totalIn = 0, totalOut = 0;
    if (company === 'm2a') {
      totalIn = (s.m2a.payments || []).reduce((sum, p) => sum + p.amount, 0);
      totalOut = s.m2a.expenditures.reduce((sum, e) => sum + e.amount, 0);
    } else {
      totalIn = ((s.elitePool.construction.payments || []).reduce((sum, p) => sum + p.amount, 0))
        + ((s.elitePool.amc.payments || []).reduce((sum, p) => sum + p.amount, 0));
      totalOut = (s.elitePool.construction.expenditures || []).reduce((sum, e) => sum + e.amount, 0)
        + (s.elitePool.amc.expenditures || []).reduce((sum, e) => sum + e.amount, 0);
    }
    const balance = totalIn - totalOut;
    return `
      <tr style="cursor:pointer" onclick="openSiteAccount('${s.id}','${company}')">
        <td style="font-weight:700;color:var(--text)">${s.siteName}</td>
        <td style="font-size:12px;color:var(--text3)">${s.location}</td>
        <td><span class="pill pill-sky">${s.linkedSiteId.startsWith('CS') ? 'Construction' : 'AMC'}</span></td>
        <td style="color:var(--green);font-weight:600">₹${totalIn.toLocaleString('en-IN')}</td>
        <td style="color:var(--red);font-weight:600">₹${totalOut.toLocaleString('en-IN')}</td>
        <td style="color:${balance >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:700">₹${balance.toLocaleString('en-IN')}</td>
        <td style="font-size:11px;color:var(--text3)">${s.lastUpdated}</td>
        <td>
          <button class="btn btn-sky btn-xs" onclick="event.stopPropagation();openSiteAccount('${s.id}','${company}')">📂 Open</button>
        </td>
      </tr>`;
  }).join('') :
    '<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:20px">No site accounts found</td></tr>';
}

window.openSiteAccount = function (siteId, company) {
  const site = SITE_ACCOUNTS.find(s => s.id === siteId);
  if (!site) return;
  document.getElementById('msa_site_id').value = siteId;
  document.getElementById('msa_company_type').value = company;
  document.getElementById('msa_title').textContent = '📂 ' + site.siteName;
  document.getElementById('msa_location').textContent = site.location;

  if (company === 'm2a') {
    // M2A: no sub-tabs, just show m2a data directly
    document.getElementById('msa_tabs_row').style.display = 'none';
    document.getElementById('msa_cur_company').value = 'm2a';
    document.getElementById('msa_company_label').textContent = 'M2A Account';
    renderSiteAccountDetail(siteId, 'm2a');
  } else {
    // Elite Pool: show Construction | AMC tabs
    document.getElementById('msa_tabs_row').style.display = 'flex';
    document.getElementById('msa_cur_company').value = 'elitePool_construction';
    document.getElementById('msa_tab_con').classList.add('active');
    document.getElementById('msa_tab_amc').classList.remove('active');
    document.getElementById('msa_company_label').textContent = 'Elite Pool — Construction Account';
    renderSiteAccountDetail(siteId, 'elitePool_construction');
  }
  openM('m_siteaccount');
};

window.renderSiteAccountDetail = function (siteId, companyKey) {
  const site = SITE_ACCOUNTS.find(s => s.id === siteId);
  if (!site) return;

  let data;
  if (companyKey === 'm2a') {
    data = site.m2a;
  } else if (companyKey === 'elitePool_construction') {
    data = site.elitePool.construction;
  } else if (companyKey === 'elitePool_amc') {
    data = site.elitePool.amc;
  }
  if (!data) return;

  const totalReceived = (data.payments || []).reduce((sum, p) => sum + p.amount, 0);
  const totalSpent = (data.expenditures || []).reduce((sum, e) => sum + e.amount, 0);
  const balance = totalReceived - totalSpent;

  document.getElementById('msa_received').textContent = '₹' + totalReceived.toLocaleString('en-IN');
  document.getElementById('msa_spent').textContent = '₹' + totalSpent.toLocaleString('en-IN');
  document.getElementById('msa_balance').textContent = '₹' + balance.toLocaleString('en-IN');
  document.getElementById('msa_balance').style.color = balance >= 0 ? 'var(--green)' : 'var(--red)';
  document.getElementById('msa_cur_company').value = companyKey;

  // Payments History
  const pbody = document.getElementById('msa_pay_tb');
  if (pbody) {
    pbody.innerHTML = (data.payments || []).length ?
      [...data.payments].reverse().map((p, i) => `
        <tr>
          <td style="font-size:11px;color:var(--text3)">${p.date}</td>
          <td style="color:var(--green);font-weight:600">₹${p.amount.toLocaleString('en-IN')}</td>
          <td><button class="btn btn-red btn-xs" onclick="deletePayment('${siteId}','${companyKey}',${data.payments.length - 1 - i})">🗑</button></td>
        </tr>`
      ).join('') :
      '<tr><td colspan="3" style="text-align:center;color:var(--text3);padding:10px;font-size:12px">No payments recorded</td></tr>';
  }

  // Expenditures
  const tbody = document.getElementById('msa_exp_tb');
  if (tbody) {
    tbody.innerHTML = (data.expenditures || []).length ?
      [...data.expenditures].reverse().map((e, i) => `
        <tr>
          <td style="font-size:11px;color:var(--text3)">${e.date}</td>
          <td style="font-weight:600">${e.description}</td>
          <td><span class="pill">${e.category}</span></td>
          <td style="color:var(--red);font-weight:600">₹${e.amount.toLocaleString('en-IN')}</td>
          <td style="font-size:11px;color:var(--text3)">${e.note || '—'}</td>
          <td><button class="btn btn-red btn-xs" onclick="deleteExpenditure('${siteId}','${companyKey}',${data.expenditures.length - 1 - i})">🗑</button></td>
        </tr>`
      ).join('') :
      '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:16px;font-size:13px">No expenditures recorded yet</td></tr>';
  }
};

window.deleteExpenditure = function (siteId, companyKey, idx) {
  const site = SITE_ACCOUNTS.find(s => s.id === siteId);
  if (!site) return;
  let data;
  if (companyKey === 'm2a') data = site.m2a;
  else if (companyKey === 'elitePool_construction') data = site.elitePool.construction;
  else if (companyKey === 'elitePool_amc') data = site.elitePool.amc;
  if (!data) return;
  data.expenditures.splice(idx, 1);
  site.lastUpdated = new Date().toISOString().slice(0, 10);
  renderSiteAccountDetail(siteId, companyKey);
  renderSiteAccounts('m2a');
  renderSiteAccounts('elitePool');
  renderAccountsSummary();
  toast('🗑 Expenditure removed', 'warn');
};

window.saveExpenditure = function () {
  const siteId = document.getElementById('msa_site_id').value;
  const companyKey = document.getElementById('msa_cur_company').value;
  const desc = document.getElementById('mae_desc').value.trim();
  const amount = parseFloat(document.getElementById('mae_amount').value);
  const category = document.getElementById('mae_category').value;
  const note = document.getElementById('mae_note').value.trim();
  const date = document.getElementById('mae_date').value || new Date().toISOString().slice(0, 10);
  if (!desc) { toast('❌ Description is required', 'error'); return; }
  if (!amount || amount <= 0) { toast('❌ Enter a valid amount', 'error'); return; }
  const site = SITE_ACCOUNTS.find(s => s.id === siteId);
  if (!site) return;
  let data;
  if (companyKey === 'm2a') data = site.m2a;
  else if (companyKey === 'elitePool_construction') data = site.elitePool.construction;
  else if (companyKey === 'elitePool_amc') data = site.elitePool.amc;
  if (!data) return;
  if (!data.expenditures) data.expenditures = [];
  data.expenditures.push({ date, description: desc, category, amount, note });
  site.lastUpdated = new Date().toISOString().slice(0, 10);
  closeM('m_addexpenditure');
  renderSiteAccountDetail(siteId, companyKey);
  renderSiteAccounts('m2a');
  renderSiteAccounts('elitePool');
  renderAccountsSummary();
  toast('✅ Expenditure added!', 'success');
};

window.openAddExpenditure = function () {
  document.getElementById('mae_desc').value = '';
  document.getElementById('mae_amount').value = '';
  document.getElementById('mae_note').value = '';
  document.getElementById('mae_date').value = new Date().toISOString().slice(0, 10);
  openM('m_addexpenditure');
};

window.savePayment = function () {
  const siteId = document.getElementById('msa_site_id').value;
  const companyKey = document.getElementById('msa_cur_company').value;
  const amount = parseFloat(document.getElementById('msa_pay_amount').value);
  const date = document.getElementById('msa_pay_date').value || new Date().toISOString().slice(0, 10);
  if (!amount || amount <= 0) { toast('❌ Enter a valid amount', 'error'); return; }
  const site = SITE_ACCOUNTS.find(s => s.id === siteId);
  if (!site) return;
  let data;
  if (companyKey === 'm2a') data = site.m2a;
  else if (companyKey === 'elitePool_construction') data = site.elitePool.construction;
  else if (companyKey === 'elitePool_amc') data = site.elitePool.amc;
  if (!data) return;
  if (!data.payments) data.payments = [];
  data.payments.push({ amount, date });
  site.lastUpdated = new Date().toISOString().slice(0, 10);
  closeM('m_addpayment');
  renderSiteAccountDetail(siteId, companyKey);
  renderSiteAccounts('m2a');
  renderSiteAccounts('elitePool');
  renderAccountsSummary();
  toast('✅ Payment added!', 'success');
};

window.deletePayment = function (siteId, companyKey, idx) {
  const site = SITE_ACCOUNTS.find(s => s.id === siteId);
  if (!site) return;
  let data;
  if (companyKey === 'm2a') data = site.m2a;
  else if (companyKey === 'elitePool_construction') data = site.elitePool.construction;
  else if (companyKey === 'elitePool_amc') data = site.elitePool.amc;
  if (!data) return;
  data.payments.splice(idx, 1);
  site.lastUpdated = new Date().toISOString().slice(0, 10);
  renderSiteAccountDetail(siteId, companyKey);
  renderSiteAccounts('m2a');
  renderSiteAccounts('elitePool');
  renderAccountsSummary();
  toast('🗑 Payment removed', 'warn');
};

window.openAddPayment = function () {
  document.getElementById('msa_pay_amount').value = '';
  document.getElementById('msa_pay_date').value = new Date().toISOString().slice(0, 10);
  openM('m_addpayment');
};

function renderAccountsSummary() {
  // M2A Summary
  const m2aEl = document.getElementById('sum_m2a_tb');
  if (m2aEl) {
    let totalIn = 0, totalOut = 0;
    const rows = SITE_ACCOUNTS.map(s => {
      const received = (s.m2a.payments || []).reduce((sum, p) => sum + p.amount, 0);
      const spent = s.m2a.expenditures.reduce((sum, e) => sum + e.amount, 0);
      totalIn += received;
      totalOut += spent;
      return `<tr>
        <td style="font-weight:600">${s.siteName}</td>
        <td style="color:var(--green)">₹${received.toLocaleString('en-IN')}</td>
        <td style="color:var(--red)">₹${spent.toLocaleString('en-IN')}</td>
        <td style="color:${received - spent >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:700">
          ₹${(received - spent).toLocaleString('en-IN')}
        </td>
      </tr>`;
    }).join('');
    m2aEl.innerHTML = rows + `
      <tr style="border-top:2px solid var(--border);background:var(--bg2)">
        <td style="font-weight:700">TOTAL</td>
        <td style="color:var(--green);font-weight:700">₹${totalIn.toLocaleString('en-IN')}</td>
        <td style="color:var(--red);font-weight:700">₹${totalOut.toLocaleString('en-IN')}</td>
        <td style="color:${totalIn - totalOut >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:700">₹${(totalIn - totalOut).toLocaleString('en-IN')}</td>
      </tr>`;
  }

  // Elite Pool Summary
  const epEl = document.getElementById('sum_ep_tb');
  if (epEl) {
    let totalIn = 0, totalOut = 0;
    const rows = SITE_ACCOUNTS.map(s => {
      const conIn = (s.elitePool.construction.payments || []).reduce((sum, p) => sum + p.amount, 0);
      const amcIn = (s.elitePool.amc.payments || []).reduce((sum, p) => sum + p.amount, 0);
      const conOut = (s.elitePool.construction.expenditures || []).reduce((sum, e) => sum + e.amount, 0);
      const amcOut = (s.elitePool.amc.expenditures || []).reduce((sum, e) => sum + e.amount, 0);
      const siteIn = conIn + amcIn;
      const siteOut = conOut + amcOut;
      totalIn += siteIn; totalOut += siteOut;
      return `<tr>
        <td style="font-weight:600">${s.siteName}</td>
        <td style="color:var(--green)">₹${siteIn.toLocaleString('en-IN')}</td>
        <td style="color:var(--red)">₹${siteOut.toLocaleString('en-IN')}</td>
        <td style="color:${siteIn - siteOut >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:700">
          ₹${(siteIn - siteOut).toLocaleString('en-IN')}
        </td>
      </tr>`;
    }).join('');
    epEl.innerHTML = rows + `
      <tr style="border-top:2px solid var(--border);background:var(--bg2)">
        <td style="font-weight:700">TOTAL</td>
        <td style="color:var(--green);font-weight:700">₹${totalIn.toLocaleString('en-IN')}</td>
        <td style="color:var(--red);font-weight:700">₹${totalOut.toLocaleString('en-IN')}</td>
        <td style="color:${totalIn - totalOut >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:700">₹${(totalIn - totalOut).toLocaleString('en-IN')}</td>
      </tr>`;
  }
}

function renderOfficeExpenses(filterType) {
  const renderSection = (data, elId) => {
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = data.length ?
      [...data].reverse().map((e, i) => `
        <tr>
          <td style="font-size:11px;color:var(--text3)">${e.date}</td>
          <td style="font-weight:600">${e.description}</td>
          <td style="color:var(--red);font-weight:600">₹${e.amount.toLocaleString('en-IN')}</td>
          <td style="font-size:11px;color:var(--text3)">${e.note || '—'}</td>
          <td><button class="btn btn-red btn-xs" onclick="deleteOfficeExpense('${elId}',${data.length - 1 - i})">🗑</button></td>
        </tr>`).join('') :
      `<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:12px;font-size:13px">No records yet</td></tr>`;
  };
  renderSection(OFFICE_EXPENSES.salaries, 'oe_salary_tb');
  renderSection(OFFICE_EXPENSES.rent, 'oe_rent_tb');
  renderSection(OFFICE_EXPENSES.petty, 'oe_petty_tb');

  const totalSalary = OFFICE_EXPENSES.salaries.reduce((s, e) => s + e.amount, 0);
  const totalRent = OFFICE_EXPENSES.rent.reduce((s, e) => s + e.amount, 0);
  const totalPetty = OFFICE_EXPENSES.petty.reduce((s, e) => s + e.amount, 0);
  const el1 = document.getElementById('oe_stat_salary');
  const el2 = document.getElementById('oe_stat_rent');
  const el3 = document.getElementById('oe_stat_petty');
  const el4 = document.getElementById('oe_stat_total');
  if (el1) el1.textContent = '₹' + totalSalary.toLocaleString('en-IN');
  if (el2) el2.textContent = '₹' + totalRent.toLocaleString('en-IN');
  if (el3) el3.textContent = '₹' + totalPetty.toLocaleString('en-IN');
  if (el4) el4.textContent = '₹' + (totalSalary + totalRent + totalPetty).toLocaleString('en-IN');
}

window.deleteOfficeExpense = function (type, idx) {
  const map = { oe_salary_tb: 'salaries', oe_rent_tb: 'rent', oe_petty_tb: 'petty' };
  const key = map[type];
  if (!key) return;
  OFFICE_EXPENSES[key].splice(idx, 1);
  renderOfficeExpenses();
  toast('🗑 Expense removed', 'warn');
};

window.saveOfficeExpense = function () {
  const type = document.getElementById('moe_type').value;
  const desc = document.getElementById('moe_desc').value.trim();
  const amount = parseFloat(document.getElementById('moe_amount').value);
  const note = document.getElementById('moe_note').value.trim();
  const date = document.getElementById('moe_date').value || new Date().toISOString().slice(0, 10);
  if (!desc) { toast('❌ Description is required', 'error'); return; }
  if (!amount || amount <= 0) { toast('❌ Enter a valid amount', 'error'); return; }
  OFFICE_EXPENSES[type].push({ date, description: desc, amount, note });
  closeM('m_addofficeexpense');
  renderOfficeExpenses();
  toast('✅ Office expense recorded!', 'success');
};

window.openConstructionPlans = function (siteId) {
  const site = CONSTRUCTION_SITES.find(s => s.id === siteId);
  if (!site) return;
  const plans = site.plans.length
    ? site.plans.map(p => `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:13px">📄 ${p.type} — <span style="color:var(--green)">${p.fileName}</span></div>`).join('')
    : '<div style="color:var(--text3);font-size:13px;padding:8px 0">No plans uploaded yet.</div>';
  document.getElementById('m_plans_title').textContent = site.client + ' — Construction Plans';
  document.getElementById('m_plans_body').innerHTML = plans;
  openM('m_plans');
};

window.openAddPlan = function (siteId) {
  document.getElementById('mp_site_id').value = siteId;
  const site = CONSTRUCTION_SITES.find(s => s.id === siteId);
  document.getElementById('mp_site_label').textContent = site ? site.client + ' (' + siteId + ')' : siteId;
  document.getElementById('mp_file_row').style.display = 'none';
  document.getElementById('mp_file_name').textContent = '';
  document.getElementById('mp_file_input').value = '';
  openM('m_addplan');
};

window.savePlan = function () {
  const siteId = document.getElementById('mp_site_id').value;
  const type = document.getElementById('mp_type').value;
  const fileName = document.getElementById('mp_file_name').textContent;
  if (!fileName) { toast('❌ Please upload a file first.', 'error'); return; }
  const site = CONSTRUCTION_SITES.find(s => s.id === siteId);
  if (site) {
    site.plans.push({ type, fileName, uploadedAt: new Date().toLocaleDateString() });
    toast('✅ ' + type + ' uploaded for ' + site.client, 'success');
    closeM('m_addplan');
    renderConstruction();
  }
};

window.showConstructionImages = false;
window.pendingLogPhotos = [];
window.pendingAMCPhotos = [];

window.renderPendingLogPhotos = function () {
  const row = document.getElementById('mcl_photo_row');
  if (window.pendingLogPhotos.length === 0) {
    row.style.display = 'none';
    row.innerHTML = '';
    return;
  }
  row.style.display = 'flex';
  row.style.flexDirection = 'column';
  row.innerHTML = window.pendingLogPhotos.map((p, i) => `
    <div style="display:flex;align-items:center;width:100%;gap:8px;padding:4px 0;border-bottom:${i === window.pendingLogPhotos.length - 1 ? 'none' : '1px solid var(--border)'}">
      <span style="font-size:13px;color:var(--green);flex:1;word-break:break-all">${p.name}</span>
      <button class="btn btn-ghost btn-sm" style="color:var(--red);font-size:11px;padding:2px 8px" onclick="window.pendingLogPhotos.splice(${i}, 1); window.renderPendingLogPhotos();">✕ Remove</button>
    </div>
  `).join('');
};

window.renderPendingAMCPhotos = function () {
  const row = document.getElementById('ma_photo_row');
  if (!row) return;
  if (window.pendingAMCPhotos.length === 0) {
    row.style.display = 'none';
    row.innerHTML = '';
    return;
  }
  row.style.display = 'flex';
  row.style.flexDirection = 'column';
  row.innerHTML = window.pendingAMCPhotos.map((p, i) => `
    <div style="display:flex;align-items:center;width:100%;gap:8px;padding:4px 0;border-bottom:${i === window.pendingAMCPhotos.length - 1 ? 'none' : '1px solid var(--border)'}">
      <span style="font-size:13px">📄</span>
      <span style="font-size:12px;color:var(--sky);font-weight:600;flex:1;word-break:break-all">${p.name}</span>
      <button class="btn btn-ghost btn-sm" style="color:var(--red);font-size:11px;padding:2px 8px" onclick="window.pendingAMCPhotos.splice(${i}, 1); window.renderPendingAMCPhotos();">✕ Remove</button>
    </div>
  `).join('');
};

window.openConstructionLog = function (siteId) {
  const site = CONSTRUCTION_SITES.find(s => s.id === siteId);
  if (!site) return;
  document.getElementById('mcl_site_id').value = siteId;
  document.getElementById('mcl_site_label').textContent = site.client + ' (' + siteId + ')';
  document.getElementById('mcl_date').value = new Date().toISOString().slice(0, 10);
  window.pendingLogPhotos = [];
  window.renderPendingLogPhotos();
  document.getElementById('mcl_photo_input').value = '';
  document.getElementById('mcl_report').value = '';
  document.getElementById('mcl_labor').value = '';
  document.getElementById('mcl_materials').value = '';
  document.getElementById('mcl_requirements').value = '';
  openM('m_constructionlog');
};

window.saveConstructionLog = function () {
  const siteId = document.getElementById('mcl_site_id').value;
  const site = CONSTRUCTION_SITES.find(s => s.id === siteId);
  if (!site) return;
  const report = document.getElementById('mcl_report').value.trim();
  const labor = document.getElementById('mcl_labor').value.trim();
  const materials = document.getElementById('mcl_materials').value.trim();
  const requirements = document.getElementById('mcl_requirements').value.trim();
  const logDate = document.getElementById('mcl_date').value || new Date().toISOString().slice(0, 10);
  if (!site.logs) site.logs = [];
  site.logs.push({ date: logDate, photos: [...window.pendingLogPhotos], report, labor, materials, requirements });
  if (requirements && requirements.trim()) {
    const now = new Date();
    PROCUREMENTS.push({
      id: 'PRO' + String(PROCUREMENTS.length + 1).padStart(3, '0'),
      siteId: siteId,
      siteName: site.client + ' Site',
      client: site.client,
      siteType: 'construction',
      requirements: requirements.trim(),
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      logDate: logDate,
      status: 'pending'
    });
    renderProcurements();
  }
  toast('✅ Construction log saved for ' + site.client, 'success');
  closeM('m_constructionlog');
  renderConstruction();
};

window.openViewConstructionLog = function (siteId) {
  const site = CONSTRUCTION_SITES.find(s => s.id === siteId);
  if (!site) return;
  document.getElementById('mvcl_title').textContent = '📅 ' + site.client + ' — Construction Log';
  document.getElementById('mvcl_filter').value = 'all';
  document.getElementById('mvcl_cal').style.display = 'none';
  document.getElementById('mvcl_cal').value = new Date().toISOString().slice(0, 10);
  document.getElementById('mvcl_site_id').value = siteId;
  window.showConstructionImages = false;
  const toggleBtn = document.getElementById('mvcl_toggle_images');
  if (toggleBtn) toggleBtn.textContent = 'Show Images';
  renderConstructionLogs(siteId);
  openM('m_viewconstructionlog');
};

window.renderConstructionLogs = function (siteId) {
  const site = CONSTRUCTION_SITES.find(s => s.id === siteId);
  const body = document.getElementById('mvcl_body');
  const summary = document.getElementById('mvcl_summary');
  if (!site || !body || !summary) return;

  const filter = document.getElementById('mvcl_filter').value;
  const customDate = document.getElementById('mvcl_cal').value;

  let logs = [...(site.logs || [])];
  logs.sort((a, b) => new Date(b.date) - new Date(a.date));

  const today = new Date();

  // Filter
  if (filter === 'weekly') {
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    logs = logs.filter(l => new Date(l.date) >= weekAgo);
  } else if (filter === 'monthly') {
    const monthAgo = new Date();
    monthAgo.setDate(today.getDate() - 30);
    logs = logs.filter(l => new Date(l.date) >= monthAgo);
  } else if (filter === 'custom' && customDate) {
    logs = logs.filter(l => l.date === customDate);
  }

  // Summary
  const totalLogs = site.logs?.length || 0;
  const lastUpdate = logs.length > 0 ? logs[0].date : 'No logs shown';

  summary.innerHTML = `
    <div style="flex:1"><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Total Logs</div><div style="font-size:18px;font-weight:700;color:var(--sky)">${totalLogs}</div></div>
    <div style="flex:1"><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Shown Logs</div><div style="font-size:18px;font-weight:700;color:var(--text)">${logs.length}</div></div>
    <div style="flex:2"><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Last Update</div><div style="font-size:14px;font-weight:600;color:var(--text);margin-top:2px">${lastUpdate}</div></div>
  `;

  if (!logs.length) {
    body.innerHTML = `<div style="text-align:center;color:var(--text3);padding:24px;font-size:13px">No logs found for the selected filter</div>`;
    return;
  }

  // Group by date
  const grouped = {};
  logs.forEach(l => {
    if (!grouped[l.date]) grouped[l.date] = [];
    grouped[l.date].push(l);
  });

  let html = '';
  for (const [date, dateLogs] of Object.entries(grouped)) {
    html += `
      <div style="margin-bottom:20px;border-left:2px solid var(--border);padding-left:16px;position:relative">
        <div style="position:absolute;left:-6px;top:0;width:10px;height:10px;border-radius:50%;background:var(--sky)"></div>
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px;margin-top:-2px">${date}</div>
    `;

    html += dateLogs.map((l, i) => `
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:12px">
        <div style="margin-bottom:12px;border:1px solid var(--border);border-radius:6px;overflow:hidden">
          <div style="background:var(--bg3);padding:6px 10px;font-size:11px;font-weight:600;color:var(--text2);border-bottom:1px solid var(--border)">
            📎 Attachments
          </div>
          <div style="padding:10px;background:var(--bg2);display:flex;flex-direction:column;gap:8px">
            ${(() => {
        const allPhotos = l.photos ? [...l.photos] : [];
        if (l.photo && !l.photos) allPhotos.push({ name: l.photo, data: l.photoData });

        if (allPhotos.length === 0) {
          return `<div style="font-size:12px;color:var(--text3);font-style:italic">No photos uploaded</div>`;
        }

        return allPhotos.map(p => {
          if (window.showConstructionImages) {
            if (p.data) {
              return `
                      <div style="display:flex;align-items:center;gap:12px">
                        <img src="${p.data}" alt="Uploaded photo" style="width:80px;height:60px;object-fit:cover;border-radius:4px;cursor:pointer;border:1px solid var(--border)" onclick="openLightbox('${p.data}', '${p.name}')" />
                        <div style="font-size:12px;color:var(--sky);font-weight:600;word-break:break-all">${p.name}</div>
                      </div>
                    `;
            } else {
              return `
                      <div style="display:flex;align-items:center;gap:12px">
                        <div style="width:80px;height:60px;background:var(--bg);border-radius:4px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:24px;border:1px solid var(--border)">🖼️</div>
                        <div style="font-size:12px;color:var(--sky);font-weight:600;word-break:break-all">${p.name}</div>
                      </div>
                    `;
            }
          } else {
            return `
                    <div style="display:flex;align-items:center;gap:8px">
                      <span style="font-size:14px">📄</span>
                      <div style="font-size:12px;color:var(--sky);font-weight:600;word-break:break-all">${p.name}</div>
                    </div>
                  `;
          }
        }).join('');
      })()}
          </div>
        </div>
        ${l.report ? `<div style="margin-bottom:8px"><span style="font-size:12px;font-weight:600;color:var(--text2)">📝 Work Report:</span><div style="font-size:12px;color:var(--text);margin-top:4px;line-height:1.5">${l.report}</div></div>` : ''}
        ${l.labor ? `<div style="margin-bottom:8px"><span style="font-size:12px;font-weight:600;color:var(--text2)">👷 Labour:</span> <span style="font-size:12px;color:var(--text)">${l.labor}</span></div>` : ''}
        ${l.materials ? `<div style="margin-bottom:8px"><span style="font-size:12px;font-weight:600;color:var(--text2)">🧱 Materials:</span> <span style="font-size:12px;color:var(--text)">${l.materials}</span></div>` : ''}
        ${l.requirements ? `<div><span style="font-size:12px;font-weight:600;color:var(--gold)">📋 Pending:</span> <span style="font-size:12px;color:var(--text)">${l.requirements}</span></div>` : ''}
      </div>
    `).join('');

    html += `</div>`;
  }

  body.innerHTML = html;
};

window.openLightbox = function (src, title) {
  document.getElementById('mlb_img').src = src;
  document.getElementById('mlb_title').textContent = title || 'Photo Preview';
  openM('m_lightbox');
};

window.openAMCLog = function (siteId) {
  document.getElementById('ma_site_id').value = siteId;
  const site = AMC_SITES.find(s => s.id === siteId);
  document.getElementById('ma_site_label').textContent = site ? site.client + ' (' + siteId + ')' : siteId;
  window.pendingAMCPhotos = [];
  window.renderPendingAMCPhotos();
  document.getElementById('ma_photo_input').value = '';
  document.getElementById('ma_date') && (document.getElementById('ma_date').value = new Date().toISOString().slice(0, 10));
  document.getElementById('ma_report').value = '';
  window._selPh = null; window._selCl = null; window._selBr = null; window._savedPhCl = null;
  const phSum = document.getElementById('ma_ph_summary');
  if (phSum) { phSum.style.display = 'none'; phSum.textContent = ''; }
  document.querySelectorAll('[id^=ph_row_],[id^=cl_row_]').forEach(el => el.style.outline = 'none');
  document.getElementById('ma_materials').value = '';
  document.getElementById('ma_requirements').value = '';
  openM('m_amclog');
};

window.saveAMCLog = function () {
  const siteId = document.getElementById('ma_site_id').value;
  const report = document.getElementById('ma_report').value.trim();
  const phLevel = window._savedPhCl ? `pH: ${window._savedPhCl.ph} | Cl: ${window._savedPhCl.cl} ppm` : '';
  const materials = document.getElementById('ma_materials').value.trim();
  const requirements = document.getElementById('ma_requirements').value.trim();
  const logDate = document.getElementById('ma_date') ? document.getElementById('ma_date').value : new Date().toISOString().slice(0, 10);
  const site = AMC_SITES.find(s => s.id === siteId);
  if (site) {
    if (!site.entries) site.entries = [];
    site.entries.push({
      date: logDate || new Date().toISOString().slice(0, 10),
      photos: [...window.pendingAMCPhotos],
      report, phLevel, materials, requirements
    });
    if (requirements && requirements.trim()) {
      const now = new Date();
      PROCUREMENTS.push({
        id: 'PRO' + String(PROCUREMENTS.length + 1).padStart(3, '0'),
        siteId: siteId,
        siteName: site.client + ' (AMC)',
        client: site.client,
        siteType: 'amc',
        requirements: requirements.trim(),
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
        logDate: logDate || now.toISOString().slice(0, 10),
        status: 'pending'
      });
      renderProcurements();
    }
    toast('✅ AMC log saved for ' + site.client, 'success');
    closeM('m_amclog');
    renderAMC();
  }
};

window.openViewAMCLog = function (siteId) {
  const site = AMC_SITES.find(s => s.id === siteId);
  if (!site) return;
  document.getElementById('mval_title').textContent = '📅 ' + site.client + ' — AMC Log';
  document.getElementById('mval_site_id').value = siteId;
  document.getElementById('mval_filter').value = 'all';
  document.getElementById('mval_cal').style.display = 'none';
  document.getElementById('mval_cal').value = new Date().toISOString().slice(0, 10);
  window.showAMCImages = false;
  const toggleBtn = document.getElementById('mval_toggle_images');
  if (toggleBtn) toggleBtn.textContent = 'Show Images';
  renderAMCLogs(siteId);
  openM('m_viewamclog');
};

window.renderAMCLogs = function (siteId) {
  const site = AMC_SITES.find(s => s.id === siteId);
  const body = document.getElementById('mval_body');
  const summary = document.getElementById('mval_summary');
  if (!site || !body) return;

  const filter = document.getElementById('mval_filter') ? document.getElementById('mval_filter').value : 'all';
  const customDate = document.getElementById('mval_cal') ? document.getElementById('mval_cal').value : '';

  let logs = [...(site.entries || [])];
  logs.sort((a, b) => new Date(b.date) - new Date(a.date));

  const today = new Date();
  if (filter === 'weekly') {
    const weekAgo = new Date(); weekAgo.setDate(today.getDate() - 7);
    logs = logs.filter(l => new Date(l.date) >= weekAgo);
  } else if (filter === 'monthly') {
    const monthAgo = new Date(); monthAgo.setDate(today.getDate() - 30);
    logs = logs.filter(l => new Date(l.date) >= monthAgo);
  } else if (filter === 'custom' && customDate) {
    logs = logs.filter(l => l.date === customDate);
  }

  const totalLogs = site.entries?.length || 0;
  const lastUpdate = logs.length > 0 ? logs[0].date : 'No logs yet';

  if (summary) {
    summary.innerHTML = `
      <div style="flex:1"><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Total Logs</div><div style="font-size:18px;font-weight:700;color:var(--sky)">${totalLogs}</div></div>
      <div style="flex:1"><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Shown Logs</div><div style="font-size:18px;font-weight:700;color:var(--text)">${logs.length}</div></div>
      <div style="flex:2"><div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Last Update</div><div style="font-size:14px;font-weight:600;color:var(--text);margin-top:2px">${lastUpdate}</div></div>
    `;
  }

  if (!logs.length) {
    body.innerHTML = `<div style="text-align:center;color:var(--text3);padding:24px;font-size:13px">No logs found for the selected filter</div>`;
    return;
  }

  const grouped = {};
  logs.forEach(l => {
    if (!grouped[l.date]) grouped[l.date] = [];
    grouped[l.date].push(l);
  });

  let html = '';
  for (const [date, dateLogs] of Object.entries(grouped)) {
    html += `
      <div style="margin-bottom:20px;border-left:2px solid var(--border);padding-left:16px;position:relative">
        <div style="position:absolute;left:-6px;top:0;width:10px;height:10px;border-radius:50%;background:var(--sky)"></div>
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px;margin-top:-2px">${date}</div>
    `;
    html += dateLogs.map((l, i) => `
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:12px">
        <div style="margin-bottom:12px;border:1px solid var(--border);border-radius:6px;overflow:hidden">
          <div style="background:var(--bg3);padding:6px 10px;font-size:11px;font-weight:600;color:var(--text2);border-bottom:1px solid var(--border)">📎 Attachments</div>
          <div style="padding:10px;background:var(--bg2);display:flex;flex-direction:column;gap:8px">
            ${(() => {
        const allPhotos = l.photos ? [...l.photos] : (l.photo ? [{ name: l.photo, data: l.photoData }] : []);
        if (allPhotos.length === 0) return '<div style="font-size:12px;color:var(--text3);font-style:italic">No photos uploaded</div>';
        return allPhotos.map(p => {
          if (window.showAMCImages) {
            if (p.data) {
              return `<div style="display:flex;align-items:center;gap:12px">
                      <img src="${p.data}" alt="Photo" style="width:80px;height:60px;object-fit:cover;border-radius:4px;cursor:pointer;border:1px solid var(--border)" onclick="openLightbox('${p.data}', '${p.name}')" />
                      <div style="font-size:12px;color:var(--sky);font-weight:600;word-break:break-all">${p.name}</div>
                    </div>`;
            } else {
              return `<div style="display:flex;align-items:center;gap:12px">
                      <div style="width:80px;height:60px;background:var(--bg);border-radius:4px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:24px;border:1px solid var(--border)">🖼️</div>
                      <div style="font-size:12px;color:var(--sky);font-weight:600;word-break:break-all">${p.name}</div>
                    </div>`;
            }
          } else {
            return `<div style="display:flex;align-items:center;gap:8px">
                    <span style="font-size:14px">📄</span>
                    <div style="font-size:12px;color:var(--sky);font-weight:600;word-break:break-all">${p.name}</div>
                  </div>`;
          }
        }).join('');
      })()}
          </div>
        </div>
        ${l.report ? `<div style="margin-bottom:8px"><span style="font-size:12px;font-weight:600;color:var(--text2)">📝 Work Report:</span><div style="font-size:12px;color:var(--text);margin-top:4px;line-height:1.5">${l.report}</div></div>` : ''}
        ${l.phLevel ? `<div style="margin-bottom:8px"><span style="font-size:12px;font-weight:600;color:var(--text2)">🧪 pH & Chlorine:</span> <span style="font-size:12px;color:var(--text)">${l.phLevel}</span></div>` : ''}
        ${l.materials ? `<div style="margin-bottom:8px"><span style="font-size:12px;font-weight:600;color:var(--text2)">🧱 Materials:</span> <span style="font-size:12px;color:var(--text)">${l.materials}</span></div>` : ''}
        ${l.requirements ? `<div><span style="font-size:12px;font-weight:600;color:var(--gold)">📋 Pending:</span> <span style="font-size:12px;color:var(--text)">${l.requirements}</span></div>` : ''}
      </div>
    `).join('');
    html += `</div>`;
  }
  body.innerHTML = html;
};

window.saveConstructionSite = function () {
  const name = document.getElementById('ms_name').value.trim();
  const loc = document.getElementById('ms_loc').value.trim();
  const date = document.getElementById('ms_date').value;
  if (!name || !loc) { toast('❌ Client name and location are required.', 'error'); return; }
  const newId = 'CS' + String(CONSTRUCTION_SITES.length + 1).padStart(3, '0');
  CONSTRUCTION_SITES.push({ id: newId, client: name, location: loc, leadId: '', startDate: date || new Date().toISOString().slice(0, 10), status: 'active', plans: [], logs: [] });
  renderConstruction();
  toast('✅ Construction site added!', 'success');
  closeM('m_addsite');
};

// ═══════════════════════════════════════════
// MODAL HELPERS
// ═══════════════════════════════════════════
function openM(id) { document.getElementById(id).classList.add('open'); }

function closeAllModals() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('open'));
}
function closeM(id) {
  document.getElementById(id).classList.remove('open');
  if (id === 'm_quote') {
    const el1 = document.getElementById('mq_file_name');
    if (el1) el1.textContent = '';
    const el2 = document.getElementById('mq_file_row');
    if (el2) el2.style.display = 'none';
    const mqi = document.getElementById('mq_file_input');
    if (mqi) mqi.value = '';
  }
  if (id === 'm_design') {
    const el1 = document.getElementById('md_file_name');
    if (el1) el1.textContent = '';
    const el2 = document.getElementById('md_file_row');
    if (el2) el2.style.display = 'none';
    const mdi = document.getElementById('md_file_input');
    if (mdi) mdi.value = '';
  }
}

// Event listeners are set inside useEffect

// ═══════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════
function toast(msg, type = 'info') {
  const container = document.getElementById('toasts');
  if (!container) return;
  const existing = Array.from(container.children);
  if (existing.some(el => el.innerHTML === msg)) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = msg;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(16px)'; el.style.transition = 'all .3s'; setTimeout(() => el.remove(), 300); }, 3000);
}

// ═══════════════════════════════════════════
// DESIGN MODAL BUTTON FIX
// ═══════════════════════════════════════════
// Fix the design button in page - handled in useEffect

function renderAttendance(filterDate, filterEmp) {
  const el = document.getElementById('att_tb');
  if (!el) return;
  let data = [...ATTENDANCE_RECORDS];
  if (filterDate) data = data.filter(r => r.date === filterDate);
  if (filterEmp) data = data.filter(r => r.empId === filterEmp || r.empName.toLowerCase().includes(filterEmp.toLowerCase()));
  data.sort((a, b) => b.date.localeCompare(a.date) || a.empName.localeCompare(b.empName));
  el.innerHTML = data.length ? data.map(r => `
    <tr>
      <td class="mono" style="font-size:11px;color:var(--text3)">${r.date}</td>
      <td style="font-weight:700;color:var(--text)">${r.empName}</td>
      <td style="font-size:11px;color:var(--text3);text-transform:capitalize">${EMPLOYEES.find(e => e.id === r.empId)?.dept || '—'}</td>
      <td class="mono" style="color:var(--green)">${r.checkIn || '—'}</td>
      <td class="mono" style="color:${r.checkOut ? 'var(--sky)' : 'var(--text3)'}">${r.checkOut || 'Not checked out'}</td>
      <td><span class="s ${r.status === 'present' ? 's-followup' : r.status === 'absent' ? 's-closed' : 's-design'}">${r.status}</span></td>
      <td style="font-size:11px;color:var(--text2);max-width:140px;overflow:hidden;text-overflow:ellipsis">${r.notes || '—'}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-xs" onclick="openEditAtt('${r.id}')">✏️ Edit</button>
          <button class="btn btn-red btn-xs" onclick="deleteAtt('${r.id}')">🗑</button>
        </div>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:20px">No attendance records found</td></tr>';

  // Update summary stats
  const todayRecs = ATTENDANCE_RECORDS.filter(r => r.date === new Date().toISOString().slice(0, 10));
  const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setT('att_stat_present', todayRecs.filter(r => r.status === 'present').length);
  setT('att_stat_absent', todayRecs.filter(r => r.status === 'absent').length);
  setT('att_stat_late', todayRecs.filter(r => r.status === 'late').length);
  setT('att_stat_total', EMPLOYEES.length);
}

window.openEditAtt = function (id) {
  const rec = ATTENDANCE_RECORDS.find(r => r.id === id);
  if (!rec) return;
  document.getElementById('eat_id').value = rec.id;
  document.getElementById('eat_emp').value = rec.empName;
  document.getElementById('eat_date').value = rec.date;
  document.getElementById('eat_in').value = rec.checkIn || '';
  document.getElementById('eat_out').value = rec.checkOut || '';
  document.getElementById('eat_status').value = rec.status;
  document.getElementById('eat_notes').value = rec.notes || '';
  openM('m_editatt');
};

window.deleteAtt = function (id) {
  const i = ATTENDANCE_RECORDS.findIndex(r => r.id === id);
  if (i > -1) { ATTENDANCE_RECORDS.splice(i, 1); renderAttendance(); toast('🗑 Record deleted', 'warn'); }
};

function saveNewAttendance() {
  const empId = document.getElementById('nat_emp').value;
  const emp = EMPLOYEES.find(e => e.id === empId);
  if (!emp) { toast('❌ Please select an employee', 'error'); return; }
  const date = document.getElementById('nat_date').value;
  if (!date) { toast('❌ Please select a date', 'error'); return; }
  const checkIn = document.getElementById('nat_in').value;
  if (!checkIn) { toast('❌ Check-in time is required', 'error'); return; }
  const rec = {
    id: `ATT-${Date.now()}-${empId}`,
    empId,
    empName: emp.name,
    date,
    checkIn,
    checkOut: document.getElementById('nat_out').value || null,
    status: document.getElementById('nat_status').value,
    notes: document.getElementById('nat_notes').value.trim(),
  };
  ATTENDANCE_RECORDS.push(rec);
  renderAttendance();
  closeM('m_newatt');
  toast('✅ Attendance recorded for ' + emp.name, 'success');
}

function saveEditAttendance() {
  const id = document.getElementById('eat_id').value;
  const rec = ATTENDANCE_RECORDS.find(r => r.id === id);
  if (!rec) return;
  rec.checkIn = document.getElementById('eat_in').value;
  rec.checkOut = document.getElementById('eat_out').value || null;
  rec.status = document.getElementById('eat_status').value;
  rec.notes = document.getElementById('eat_notes').value.trim();
  renderAttendance();
  closeM('m_editatt');
  toast('✅ Attendance updated', 'success');
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [importType, setImportType] = useState(''); // 'construction' or 'amc'
  const [importFile, setImportFile] = useState(null);

  const handleImportLeads = () => {
    if (!importType || !importFile) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const rows = text.trim().split('\n').slice(1);
        const newLeads = rows.map((row, i) => {
          const cols = row.split(',');
          return {
            id: 'L' + (LEADS.length + i + 1).toString().padStart(3, '0'),
            name: (cols[0] || '').trim(), phone: (cols[1] || '').trim(),
            loc: (cols[2] || '').trim(), req: (cols[3] || '').trim(),
            src: (cols[4] || 'Import').trim(), status: 'new',
            leadType: importType,
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            notes: '', calls: []
          };
        }).filter(l => l.name);
        newLeads.forEach(l => LEADS.unshift(l));
        renderAll();
        closeM('m_import_type');
        toast(`✅ ${newLeads.length} ${importType === 'amc' ? 'AMC' : 'Construction'} leads imported!`, 'success');
        setImportType(''); setImportFile(null);
      } catch (err) {
        toast('❌ Failed to parse file. Use CSV format.', 'error');
      }
    };
    reader.readAsText(importFile);
  };

  useEffect(() => {
    // Initialization logic
    selectRole('ceo');
    renderAll();

    const handleLogin = () => {
      setIsLoggedIn(true);

      // Update topbar once logged in
      setTimeout(() => {
        const rl = { ceo: 'CEO', admin: 'Admin / Designer', support: 'Customer Support' };
        const rc = { ceo: 'rbadge-ceo', admin: 'rbadge-admin', support: 'rbadge-support' };
        const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setT('tb_name', CUR.name);
        setT('tb_role', rl[CUR.role]);
        setT('tb_av', CUR.avatar);
        setT('tb_badge', rl[CUR.role]);
        const b = document.getElementById('tb_badge');
        if (b) b.className = 'tb-rbadge ' + rc[CUR.role];
        renderAll();
        if (location.pathname === '/followup') renderFUTable('', '');
        if (location.pathname === '/feedback') renderFeedback();
      }, 0);

      navigate('/dashboard');
    };

    window.addEventListener('login-success', handleLogin);

    // Close on overlay click
    document.querySelectorAll('.overlay').forEach(o => {
      o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
    });

    // Run renderAll when route changes to ensure data is updated
    renderAll();
    if (location.pathname === '/followup') renderFUTable('', '');
    if (location.pathname === '/feedback') renderFeedback();
    if (location.pathname === '/send') populateSendSelect();

    return () => window.removeEventListener('login-success', handleLogin);
  }, [location.pathname, navigate]);

  const checkAccess = (pg) => {
    const allowed = PERMS[CUR.role] || [];
    if (pg === 'dashboard') return true;
    return allowed.includes(pg);
  };

  return (
    <>
      {/*  ══════════════════════════════════════
           LOGIN SCREEN
      ══════════════════════════════════════  */}
      {!isLoggedIn && (
        <div id="loginScreen" className="screen visible">
          <div className="login-wrap">
            <div className="login-logo-area">
              <div className="login-icon">
                <img src="/company-logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ color: '#0047AB', fontWeight: '800', fontSize: '24px', letterSpacing: '1px', marginBottom: '4px' }}>Elite Pool Builders</div>
              <div style={{ color: '#0047AB', fontWeight: '600', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8 }}>CRM and Operation Platform</div>
            </div>

            <div className="login-card">
              <div className="field">
                <i>👤</i>
                <input id="li_user" type="text" placeholder="USERNAME" defaultValue="admin" />
              </div>
              <div className="field">
                <i>🔒</i>
                <input id="li_pass" type="password" placeholder="PASSWORD" defaultValue="admin123" />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: '11px', color: '#0047AB', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px', textAlign: 'center', opacity: 0.8 }}>SELECT ROLE</div>
                <div className="role-pills" style={{ justifyContent: 'center' }}>
                  <div className="role-pill active-gold" id="rp_ceo" onClick={() => selectRole('ceo')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#0047AB', minWidth: '80px' }}>
                    CEO
                  </div>
                  <div className="role-pill" id="rp_admin" onClick={() => selectRole('admin')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#0047AB', minWidth: '80px' }}>
                    ADMIN
                  </div>
                  <div className="role-pill" id="rp_support" onClick={() => selectRole('support')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#0047AB', minWidth: '80px' }}>
                    SUPPORT
                  </div>
                </div>
              </div>

              <button className="btn-login" onClick={() => doLogin()}>LOGIN</button>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <a href="#" style={{ color: '#0047AB', fontSize: '13px', fontWeight: '600', opacity: 0.8 }} onClick={(e) => { e.preventDefault(); toast('Forgot password feature coming soon!', 'info'); }}>Forgot password?</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  ══════════════════════════════════════
           APP SCREEN
      ══════════════════════════════════════  */}
      {isLoggedIn && (
        <div id="appScreen" className="screen visible" style={{ flexDirection: "column" }}>

          {/*  TOPBAR  */}
          <header className="topbar">
            <div className="tb-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/company-logo.png" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '4px' }} />
              <span>Elite Pool Builders</span>
            </div>
            <div className="tb-spacer"></div>
            <button className="tb-notif" onClick={() => toast('📬 3 new leads from Meta Ads!', 'info')}>
              🔔<span className="badge">3</span>
            </button>
            <div className="tb-user">
              <div>
                <div className="tb-name" id="tb_name">—</div>
                <div className="tb-role" id="tb_role">—</div>
              </div>
              <div className="tb-avatar" id="tb_av">?</div>
              <span className="tb-rbadge" id="tb_badge"></span>
              <button className="btn-logout" onClick={() => doLogout()}>↩ Logout</button>
            </div>
          </header>

          <div className="app-inner">
            {/*  SIDEBAR  */}
            <nav className="sidebar" id="sidebar">
              <div className="sb-section">Overview</div>
              <NavLink to="/dashboard" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_dashboard">
                <span className="ni">📊</span> Dashboard
              </NavLink>

              <div className="sb-section">Lead Management</div>
              <div className="nav-btn" style={{ cursor: 'default', background: 'none', border: 'none', paddingBottom: '4px' }} id="nb_leads">
                <span className="ni">🎯</span> All Leads
                <span className="nb" id="nb_leads_cnt" style={{ opacity: 0.7 }}>0</span>
              </div>
              <NavLink to="/leads-construction" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_leads_con" style={{ paddingLeft: '32px', fontSize: '12px', marginBottom: '2px' }}>
                <span className="ni">🏗️</span> Construction
                <span className="nb" id="nb_leads_con_cnt" style={{ fontSize: '9px' }}>0</span>
              </NavLink>
              <NavLink to="/leads-amc" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_leads_amc" style={{ paddingLeft: '32px', fontSize: '12px', marginBottom: '2px' }}>
                <span className="ni">🔧</span> AMC / Repair
                <span className="nb" id="nb_leads_amc_cnt" style={{ fontSize: '9px' }}>0</span>
              </NavLink>
              <NavLink to="/pipeline" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_pipeline">
                <span className="ni">⚡</span> Pipeline
              </NavLink>
              <NavLink to="/addlead" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_addlead">
                <span className="ni">➕</span> Add Lead
              </NavLink>

              <div className="sb-section">Operations</div>
              <NavLink to="/design" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_design">
                <span className="ni">📐</span> Pool Design
              </NavLink>
              <NavLink to="/quotation" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_quotation">
                <span className="ni">💰</span> Quotations
                <span className="nb warn">3</span>
              </NavLink>
              <NavLink to="/send" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_send">
                <span className="ni">📤</span> Send to Client
              </NavLink>

              <div className="sb-section">Customer Support</div>
              <NavLink to="/followup" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_followup">
                <span className="ni">📞</span> Follow-up Calls
                <span className="nb danger" id="nb_fu_cnt">5</span>
              </NavLink>
              <NavLink to="/calltracker" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_calltracker">
                <span className="ni">📈</span> Call Tracker
              </NavLink>
              <NavLink to="/feedback" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_feedback">
                <span className="ni">⭐</span> Reviews
              </NavLink>

              <div className="sb-section">Technical</div>
              <NavLink to="/construction" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_construction">
                <span className="ni">🏗️</span> Pool Construction
              </NavLink>
              <NavLink to="/amc" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_amc">
                <span className="ni">🔧</span> Pool AMC
              </NavLink>
              <NavLink to="/procurements" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_procurements">
                <span className="ni">📦</span> Procurements
              </NavLink>

              <div className="sb-section">Accounts</div>
              <NavLink to="/accounts/m2a" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_m2a">
                <span className="ni">🏗️</span> M2A Accounts
              </NavLink>
              <NavLink to="/accounts/elitepool" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_elitepool">
                <span className="ni">🏊</span> Elite Pool Accounts
              </NavLink>
              <NavLink to="/officeexpenses" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_officeexpenses">
                <span className="ni">🧾</span> Office Expenses
              </NavLink>

              <div className="sb-section">Admin</div>
              <NavLink to="/users" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_users">
                <span className="ni">👥</span> Users
              </NavLink>
              <NavLink to="/attendance" className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")} id="nb_attendance">
                <span className="ni">🕐</span> Attendance
              </NavLink>
            </nav>

            {/*  MAIN CONTENT  */}
            <main className="main-content">
              <Routes>
                <Route path="/dashboard" element={
                  <div className="page active" id="page_dashboard" key="dashboard">
                    <div className="ph">
                      <div className="ph-left">
                        <div className="ph-title">DASHBOARD</div>
                        <div className="ph-sub" id="dash_greet">Welcome back</div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn btn-sky btn-sm" onClick={() => toast('📥 Report exported!', 'success')}>📥 Export</button>
                        <button className="btn btn-sky btn-sm" onClick={() => navigate('/addlead')}>+ New Lead</button>
                      </div>
                    </div>

                    <div className="stats">
                      <div className="stat s-sky"><div className="stat-label">Total Leads</div><div className="stat-val" id="d_total">0</div><div className="stat-delta">↑ 8 this week</div></div>
                      <div className="stat s-gold"><div className="stat-label">Quotations Sent</div><div className="stat-val" id="d_quotes">0</div><div className="stat-delta">↑ 3 today</div></div>
                      <div className="stat s-green"><div className="stat-label">Follow-ups Done</div><div className="stat-val" id="d_fu">0</div><div className="stat-delta">↑ 12 today</div></div>
                      <div className="stat s-red"><div className="stat-label">Pending Designs</div><div className="stat-val" id="d_pd">0</div><div className="stat-delta warn">⚠ Needs action</div></div>
                    </div>

                    <div className="card">
                      <div className="card-head">
                        <span className="card-title">🎯 Recent Leads</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/leads')}>View All →</button>
                      </div>
                      <div className="tw"><table><thead><tr><th>Client</th><th>Phone</th><th>Location</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody id="d_leads_tb"></tbody></table></div>
                    </div>

                    <div className="card">
                      <div className="card-head"><span className="card-title">📞 Today's Call Stats</span></div>
                      <div className="agrid" style={{ padding: "16px" }} id="d_agents"></div>
                    </div>

                    <div className="card">
                      <div className="card-head">
                        <span className="card-title">⭐ Recent Reviews</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/feedback')}>View All →</button>
                      </div>
                      <div className="fgrid" id="d_reviews" style={{ padding: "16px" }}></div>
                    </div>
                  </div>
                } />

                <Route path="/leads-construction" element={
                  checkAccess('leads') ? (
                    <div className="page active" id="page_leads_con" key="leads_con">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">CONSTRUCTION LEADS</div>
                          <div className="ph-sub">Manage and track pool construction inquiries</div>
                        </div>
                        <button className="btn btn-sky btn-sm" onClick={() => navigate('/addlead')}>+ New Lead</button>
                      </div>

                      <div className="card">
                        <div className="card-head">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '8px' }}>
                            <span className="card-title">🏗️ Pool Construction Leads</span>
                            <div className="toolbar">
                              <input className="si" type="text" placeholder="🔍 Search construction…" onInput={(e) => srchLeads('construction', e.target.value)} />
                              <select className="sel" onChange={(e) => filtLeads('construction', e.target.value)}>
                                <option value="">All Status</option><option>new</option><option>design</option><option>quoted</option><option>followup</option><option>closed</option>
                              </select>
                              <select className="sel" onChange={(e) => sortLeads('construction', e.target.value)}>
                                <option value="d-desc">Newest First</option><option value="d-asc">Oldest First</option><option value="name">Name A–Z</option>
                              </select>
                              <button className="btn btn-ghost btn-sm" onClick={() => downloadLeadsExcel('construction')}>📊 Download Excel</button>
                            </div>
                          </div>
                        </div>
                        <div className="tw"><table>
                          <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Location</th><th>Requirements</th><th>Source</th><th>Date &amp; Time</th><th>Status</th><th>Actions</th></tr></thead>
                          <tbody id="leads_tb_construction"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/leads-amc" element={
                  checkAccess('leads') ? (
                    <div className="page active" id="page_leads_amc" key="leads_amc">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">AMC / REPAIR LEADS</div>
                          <div className="ph-sub">Manage and track AMC, repair, and renovation inquiries</div>
                        </div>
                        <button className="btn btn-sky btn-sm" onClick={() => navigate('/addlead')}>+ New Lead</button>
                      </div>

                      <div className="card">
                        <div className="card-head">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '8px' }}>
                            <span className="card-title">🔧 Pool AMC / Repair / Renovation Leads</span>
                            <div className="toolbar">
                              <input className="si" type="text" placeholder="🔍 Search AMC…" onInput={(e) => srchLeads('amc', e.target.value)} />
                              <select className="sel" onChange={(e) => filtLeads('amc', e.target.value)}>
                                <option value="">All Status</option><option>new</option><option>design</option><option>quoted</option><option>followup</option><option>closed</option>
                              </select>
                              <select className="sel" onChange={(e) => sortLeads('amc', e.target.value)}>
                                <option value="d-desc">Newest First</option><option value="d-asc">Oldest First</option><option value="name">Name A–Z</option>
                              </select>
                              <button className="btn btn-ghost btn-sm" onClick={() => downloadLeadsExcel('amc')}>📊 Download Excel</button>
                            </div>
                          </div>
                        </div>
                        <div className="tw"><table>
                          <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Location</th><th>Requirements</th><th>Source</th><th>Date &amp; Time</th><th>Status</th><th>Actions</th></tr></thead>
                          <tbody id="leads_tb_amc"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/pipeline" element={
                  checkAccess('pipeline') ? (
                    <div className="page active" id="page_pipeline" key="pipeline">
                      <div className="ph"><div className="ph-left"><div className="ph-title">PIPELINE VIEW</div><div className="ph-sub">Visual sales pipeline by stage</div></div></div>
                      <div className="pipeline" id="pipeline_board"></div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/addlead" element={
                  checkAccess('addlead') ? (
                    <div className="page active" id="page_addlead" key="addlead">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">ADD NEW LEAD</div>
                          <div className="ph-sub">Manually enter lead from cold call or walk-in</div>
                        </div>
                        <button className="btn btn-sky" onClick={() => openM('m_import_type')}>
                          📥 Import Leads Excel
                        </button>
                      </div>
                      <div className="card" style={{ maxWidth: "620px" }}>
                        <div className="card-head"><span className="card-title">Lead Details</span></div>
                        <div className="card-body">
                          <div className="fr">
                            <div className="fg"><label className="fl">Client Name *</label><input className="fi" id="al_name" placeholder="Full name" /></div>
                            <div className="fg"><label className="fl">Phone Number *</label><input className="fi" id="al_phone" placeholder="+91 XXXXX XXXXX" /></div>
                          </div>
                          <div className="fr">
                            <div className="fg"><label className="fl">Location / City</label><input className="fi" id="al_loc" placeholder="City, State" /></div>
                            <div className="fg"><label className="fl">Lead Source</label>
                              <select className="fs" id="al_src"><option>Meta Ad</option><option>Cold Call</option><option>Walk-in</option><option>Referral</option><option>Website</option></select>
                            </div>
                          </div>
                          <div className="fg">
                            <label className="fl">Lead Type *</label>
                            <select className="fs" id="al_lt">
                              <option value="construction">Pool Construction</option>
                              <option value="amc">Pool AMC / Repair / Renovation</option>
                            </select>
                          </div>
                          <div className="fg"><label className="fl">Pool Requirements / Measurements</label>
                            <textarea className="ft" id="al_req" placeholder="e.g. 30ft × 15ft, infinity edge, deep end 7ft, LED lighting…"></textarea>
                          </div>
                          <div className="fr">
                            <div className="fg">
                              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                                {['End-to-End', 'MAP', 'With Kids Pool'].map(b => (
                                  <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', cursor: 'pointer', color: 'var(--text2)' }}>
                                    <input type="checkbox" name="al_budget" value={b} /> {b}
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="fg"><label className="fl">Priority</label>
                              <select className="fs" id="al_pri"><option>Normal</option><option>High</option><option>Urgent</option></select>
                            </div>
                          </div>
                          <div className="fg"><label className="fl">Notes</label><textarea className="ft" id="al_notes" placeholder="Additional notes…" style={{ minHeight: "60px" }}></textarea></div>
                          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                            <button className="btn btn-sky" onClick={() => saveLead()}>✅ Save Lead</button>
                            <button className="btn btn-ghost" onClick={() => clearAL()}>🗑 Clear</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/design" element={
                  checkAccess('design') ? (
                    <div className="page active" id="page_design" key="design">
                      <div className="ph">
                        <div className="ph-left"><div className="ph-title">POOL DESIGN</div><div className="ph-sub">Design plans assigned by Admin/CEO</div></div>
                        <button className="btn btn-sky" onClick={() => openM_design()}>📐 New Design Plan</button>
                      </div>


                      <div className="card">
                        <div className="card-head"><span className="card-title">Design Queue</span></div>
                        <div className="tw"><table>
                          <thead><tr><th>Lead ID</th><th>Client</th><th>Requirements</th><th>Designer</th><th>Style</th><th>Status</th><th>Actions</th></tr></thead>
                          <tbody id="design_tb"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/quotation" element={
                  checkAccess('quotation') ? (
                    <div className="page active" id="page_quotation" key="quotation">
                      <div className="ph">
                        <div className="ph-left"><div className="ph-title">QUOTATIONS</div><div className="ph-sub">Generate &amp; manage client quotations</div></div>
                        <button className="btn btn-gold" onClick={() => openQuoteModal()}>💰 Generate Quote</button>
                      </div>


                      <div className="card">
                        <div className="card-head"><span className="card-title">All Quotations</span></div>
                        <div className="tw"><table>
                          <thead><tr><th>Quote #</th><th>Client</th><th>Pool Size</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                          <tbody id="quotes_tb"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/send" element={
                  checkAccess('send') ? (
                    <div className="page active" id="page_send" key="send">
                      <div className="ph"><div className="ph-left"><div className="ph-title">SEND TO CLIENT</div><div className="ph-sub">Share quotation &amp; design via WhatsApp or Email</div></div></div>
                      <div className="card" style={{ maxWidth: "620px" }}>
                        <div className="card-head"><span className="card-title">Send Package</span></div>
                        <div className="card-body">
                          <div className="fg"><label className="fl">Select Client</label>
                            <select className="fs" id="snd_client" onChange={(e) => updateSendPreview(e.target.value)}>
                              <option value="">— Select a Lead —</option>
                            </select>
                          </div>
                          <div id="snd_preview" style={{ display: "none" }}>
                            <div className="qbox" id="snd_box"></div>
                            <div className="divider"></div>
                            <div className="fg"><label className="fl">Message</label>
                              <textarea className="ft" id="snd_msg" style={{ minHeight: "110px" }} defaultValue={`Dear Client,\n\nThank you for choosing Elite Pool Builders! Please find your personalised pool design plan and quotation attached. We look forward to building your dream pool.\n\nBest regards,\nElite Pool Builders Team  📞 +91 98765 43210`}></textarea>
                            </div>
                            <div className="fg">
                              <label className="fl">Attach</label>
                              <div style={{ display: "flex", gap: "16px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text2)", cursor: "pointer" }}><input type="checkbox" defaultChecked style={{ accentColor: "var(--sky)" }} /> Quotation PDF</label>
                                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text2)", cursor: "pointer" }}><input type="checkbox" defaultChecked style={{ accentColor: "var(--sky)" }} /> Design Plan</label>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                              <button className="btn btn-wa" onClick={() => sendWA()}>📱 Send via WhatsApp</button>
                              <button className="btn btn-sky" onClick={() => sendEmail()}>📧 Send via Email</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/followup" element={
                  checkAccess('followup') ? (
                    <div className="page active" id="page_followup" key="followup">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">FOLLOW-UP CALLS</div>
                          <div className="ph-sub">Click a client row to log calls &amp; manage follow-ups</div>
                        </div>
                        <select className="sel" id="fu_flt_sel" onChange={(e) => renderFUTable(e.target.value, document.getElementById('fu_search')?.value || '')}>
                          <option value="">All Clients</option>
                          <option value="pending">Pending Calls</option>
                          <option value="done">All Done</option>
                        </select>
                      </div>

                      {/* 4 Stat Cards */}
                      <div className="stats" style={{ marginBottom: '20px' }}>
                        <div className="stat s-sky">
                          <div className="stat-label">Total Clients</div>
                          <div className="stat-val" id="fu_stat_total">0</div>
                        </div>
                        <div className="stat s-gold">
                          <div className="stat-label">Pending Calls</div>
                          <div className="stat-val" id="fu_stat_pending">0</div>
                        </div>
                        <div className="stat s-green">
                          <div className="stat-label">Completed Today</div>
                          <div className="stat-val" id="fu_stat_done">0</div>
                        </div>
                        <div className="stat s-red">
                          <div className="stat-label">Overdue / Urgent</div>
                          <div className="stat-val" id="fu_stat_urgent">0</div>
                        </div>
                      </div>

                      {/* Data Table */}
                      <div className="card">
                        <div className="card-head">
                          <div className="toolbar">
                            <input
                              className="si"
                              type="text"
                              id="fu_search"
                              placeholder="🔍 Search by name or phone…"
                              onInput={(e) => renderFUTable(document.getElementById('fu_flt_sel')?.value || '', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="tw">
                          <table>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Client</th>
                                <th>Phone</th>
                                <th>Progress</th>
                                <th>Last Call</th>
                                <th>Last Outcome</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody id="fu_table_tb"></tbody>
                          </table>
                        </div>
                      </div>

                      {/* Hidden — keeps fu_grid in DOM so no null-ref errors anywhere */}
                      <div id="fu_grid" style={{ display: 'none' }}></div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/calltracker" element={
                  checkAccess('calltracker') ? (
                    <div className="page active" id="page_calltracker" key="calltracker">
                      <div className="ph">
                        <div className="ph-left"><div className="ph-title">CALL TRACKER</div><div className="ph-sub" id="ct_date">Today's follow-up calls by agent</div></div>
                      </div>


                      <div className="stats" style={{ marginBottom: "20px" }}>
                        <div className="stat s-green"><div className="stat-label">Total Calls Today</div><div className="stat-val" id="ct_total">0</div><div className="stat-delta">All agents combined</div></div>
                        <div className="stat s-sky"><div className="stat-label">Daily Target / Agent</div><div className="stat-val">20</div><div className="stat-delta">Calls per day</div></div>
                        <div className="stat s-gold"><div className="stat-label">Completion Rate</div><div className="stat-val" id="ct_rate">0%</div><div className="stat-delta">Avg across team</div></div>
                      </div>
                      <div className="card">
                        <div className="card-head"><span className="card-title">Agent Performance</span></div>
                        <div className="agrid" style={{ padding: "16px" }} id="ct_agents"></div>
                      </div>
                      <div className="card">
                        <div className="card-head">
                          <span className="card-title">📋 Call Log — Today</span>
                          <button className="btn btn-ghost btn-sm" onClick={() => toast('📥 Log exported!', 'success')}>Export CSV</button>
                        </div>
                        <div className="tw"><table>
                          <thead><tr><th>Time</th><th>Agent</th><th>Client</th><th>Call #</th><th>Duration</th><th>Outcome</th></tr></thead>
                          <tbody id="ct_log"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/feedback" element={
                  checkAccess('feedback') ? (
                    <div className="page active" id="page_feedback" key="feedback">
                      <div className="ph"><div className="ph-left"><div className="ph-title">REVIEWS &amp; FEEDBACK</div><div className="ph-sub">Client ratings after follow-up calls</div></div></div>
                      <div className="fgrid" id="fb_grid"></div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/users" element={
                  checkAccess('users') ? (
                    <div className="page active" id="page_users" key="users">
                      <div className="ph">
                        <div className="ph-left"><div className="ph-title">USER MANAGEMENT</div><div className="ph-sub">Manage team roles &amp; access</div></div>
                        <button className="btn btn-sky" onClick={() => openM('m_adduser')}>➕ Add User</button>
                      </div>
                      <div className="card">
                        <div className="card-head"><span className="card-title">Team Members</span></div>
                        <div className="tw"><table>
                          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
                          <tbody id="users_tb"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/construction" element={
                  checkAccess('construction') ? (
                    <div className="page active" id="page_construction" key="construction">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">POOL CONSTRUCTION</div>
                          <div className="ph-sub">Manage construction sites &amp; plan uploads</div>
                        </div>
                        <button className="btn btn-sky" onClick={() => openM('m_addsite')}>🏗️ Add Site</button>
                      </div>
                      <div className="card">
                        <div className="card-head"><span className="card-title">Construction Sites</span></div>
                        <div className="tw"><table>
                          <thead><tr>
                            <th>Site ID</th><th>Client</th><th>Location</th>
                            <th>Start Date</th><th>Status</th><th>Actions</th>
                          </tr></thead>
                          <tbody id="construction_tb"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/amc" element={
                  checkAccess('amc') ? (
                    <div className="page active" id="page_amc" key="amc">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">POOL AMC</div>
                          <div className="ph-sub">Annual Maintenance Contract sites &amp; daily logs</div>
                        </div>
                        <button className="btn btn-sky" onClick={() => openM('m_addamc')}>🔧 Add AMC Site</button>
                      </div>
                      <div className="card">
                        <div className="card-head"><span className="card-title">AMC Sites</span></div>
                        <div className="tw"><table>
                          <thead><tr>
                            <th>AMC ID</th><th>Client</th><th>Location</th>
                            <th>Start Date</th><th>Status</th><th>Actions</th>
                          </tr></thead>
                          <tbody id="amc_tb"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/attendance" element={
                  checkAccess('attendance') ? (
                    <div className="page active" id="page_attendance" key="attendance">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">ATTENDANCE</div>
                          <div className="ph-sub">Track employee check-in / check-out</div>
                        </div>
                        <button className="btn btn-sky" onClick={() => {
                          document.getElementById('nat_emp').value = '';
                          document.getElementById('nat_date').value = new Date().toISOString().slice(0, 10);
                          document.getElementById('nat_in').value = '';
                          document.getElementById('nat_out').value = '';
                          document.getElementById('nat_status').value = 'present';
                          document.getElementById('nat_notes').value = '';
                          openM('m_newatt');
                        }}>➕ Mark Attendance</button>
                      </div>

                      {/* Summary Stats */}
                      <div className="stats">
                        <div className="stat s-green"><div className="stat-label">Present Today</div><div className="stat-val" id="att_stat_present">0</div></div>
                        <div className="stat s-red"><div className="stat-label">Absent Today</div><div className="stat-val" id="att_stat_absent">0</div></div>
                        <div className="stat s-gold"><div className="stat-label">Late Today</div><div className="stat-val" id="att_stat_late">0</div></div>
                        <div className="stat s-sky"><div className="stat-label">Total Employees</div><div className="stat-val" id="att_stat_total">0</div></div>
                      </div>

                      {/* Filters */}
                      <div className="card">
                        <div className="card-head">
                          <div className="toolbar">
                            <input
                              className="si"
                              type="date"
                              id="att_filter_date"
                              defaultValue={new Date().toISOString().slice(0, 10)}
                              onChange={(e) => renderAttendance(e.target.value, document.getElementById('att_filter_emp').value)}
                            />
                            <input
                              className="si"
                              type="text"
                              id="att_filter_emp"
                              placeholder="🔍 Search employee…"
                              onInput={(e) => renderAttendance(document.getElementById('att_filter_date').value, e.target.value)}
                            />
                            <button className="btn btn-ghost btn-sm" onClick={() => {
                              document.getElementById('att_filter_date').value = '';
                              document.getElementById('att_filter_emp').value = '';
                              renderAttendance();
                            }}>Clear Filters</button>
                          </div>
                        </div>
                        <div className="tw">
                          <table>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Check-In</th>
                                <th>Check-Out</th>
                                <th>Status</th>
                                <th>Notes</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody id="att_tb"></tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/accounts/m2a" element={
                  checkAccess('m2aaccounts') ? (
                    <div className="page active" id="page_m2a_accounts" key="m2a_accounts">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">M2A ACCOUNTS</div>
                          <div className="ph-sub">Track income & expenditure per site — M2A Company</div>
                        </div>
                      </div>
                      <div className="card" style={{ marginBottom: '16px' }}>
                        <div className="card-head">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '8px' }}>
                            <span className="card-title">🏗️ M2A Site Accounts</span>
                            <div className="toolbar">
                              <input className="si" placeholder="🔍 Search site…" onInput={(e) => renderSiteAccounts('m2a', e.target.value, document.getElementById('sa_m2a_filter').value, document.getElementById('sa_m2a_sort').value)} />
                              <select className="sel" id="sa_m2a_filter" onChange={(e) => renderSiteAccounts('m2a', '', e.target.value, document.getElementById('sa_m2a_sort').value)}>
                                <option value="">All Types</option>
                                <option value="construction">Construction</option>
                                <option value="amc">AMC</option>
                              </select>
                              <select className="sel" id="sa_m2a_sort" onChange={(e) => renderSiteAccounts('m2a', '', document.getElementById('sa_m2a_filter').value, e.target.value)}>
                                <option value="date">Recent First</option>
                                <option value="name">Name A–Z</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="tw"><table>
                          <thead><tr><th>Site Name</th><th>Location</th><th>Type</th><th>Inflow</th><th>Spent</th><th>Balance</th><th>Last Updated</th><th>Actions</th></tr></thead>
                          <tbody id="sa_m2a_tb"></tbody>
                        </table></div>
                      </div>
                      <div className="card">
                        <div className="card-head"><span className="card-title">📊 M2A Summary (All Sites)</span></div>
                        <div className="tw"><table>
                          <thead><tr><th>Site</th><th>Inflow</th><th>Outflow</th><th>Balance</th></tr></thead>
                          <tbody id="sum_m2a_tb"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/accounts/elitepool" element={
                  checkAccess('elitepoolaccounts') ? (
                    <div className="page active" id="page_ep_accounts" key="ep_accounts">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">ELITE POOL ACCOUNTS</div>
                          <div className="ph-sub">Track income & expenditure — Construction & AMC</div>
                        </div>
                      </div>
                      <div className="card" style={{ marginBottom: '16px' }}>
                        <div className="card-head">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '8px' }}>
                            <span className="card-title">🏊 Elite Pool Site Accounts</span>
                            <div className="toolbar">
                              <input className="si" placeholder="🔍 Search site…" onInput={(e) => renderSiteAccounts('elitePool', e.target.value, document.getElementById('sa_ep_filter').value, document.getElementById('sa_ep_sort').value)} />
                              <select className="sel" id="sa_ep_filter" onChange={(e) => renderSiteAccounts('elitePool', '', e.target.value, document.getElementById('sa_ep_sort').value)}>
                                <option value="">All Types</option>
                                <option value="construction">Construction</option>
                                <option value="amc">AMC</option>
                              </select>
                              <select className="sel" id="sa_ep_sort" onChange={(e) => renderSiteAccounts('elitePool', '', document.getElementById('sa_ep_filter').value, e.target.value)}>
                                <option value="date">Recent First</option>
                                <option value="name">Name A–Z</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="tw"><table>
                          <thead><tr><th>Site Name</th><th>Location</th><th>Type</th><th>Inflow</th><th>Spent</th><th>Balance</th><th>Last Updated</th><th>Actions</th></tr></thead>
                          <tbody id="sa_ep_tb"></tbody>
                        </table></div>
                      </div>
                      <div className="card">
                        <div className="card-head"><span className="card-title">📊 Elite Pool Summary (All Sites)</span></div>
                        <div className="tw"><table>
                          <thead><tr><th>Site</th><th>Inflow</th><th>Outflow</th><th>Balance</th></tr></thead>
                          <tbody id="sum_ep_tb"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/officeexpenses" element={
                  checkAccess('officeexpenses') ? (
                    <div className="page active" id="page_officeexpenses" key="officeexpenses">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">OFFICE EXPENSES</div>
                          <div className="ph-sub">Salaries, rent & petty expenses</div>
                        </div>
                        <button className="btn btn-sky" onClick={() => {
                          document.getElementById('moe_desc').value = '';
                          document.getElementById('moe_amount').value = '';
                          document.getElementById('moe_note').value = '';
                          document.getElementById('moe_date').value = new Date().toISOString().slice(0, 10);
                          openM('m_addofficeexpense');
                        }}>➕ Add Expense</button>
                      </div>

                      <div className="stats" style={{ marginBottom: '16px' }}>
                        <div className="stat s-sky"><div className="stat-label">Total Salaries</div><div className="stat-val" id="oe_stat_salary">₹0</div></div>
                        <div className="stat s-gold"><div className="stat-label">Total Rent</div><div className="stat-val" id="oe_stat_rent">₹0</div></div>
                        <div className="stat s-green"><div className="stat-label">Petty Expenses</div><div className="stat-val" id="oe_stat_petty">₹0</div></div>
                        <div className="stat s-red"><div className="stat-label">Total Office Expenses</div><div className="stat-val" id="oe_stat_total">₹0</div></div>
                      </div>

                      <div className="card" style={{ marginBottom: '16px' }}>
                        <div className="card-head"><span className="card-title">👤 Employee Salaries</span></div>
                        <div className="tw"><table>
                          <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Note</th><th>Actions</th></tr></thead>
                          <tbody id="oe_salary_tb"></tbody>
                        </table></div>
                      </div>

                      <div className="card" style={{ marginBottom: '16px' }}>
                        <div className="card-head"><span className="card-title">🏠 Rent</span></div>
                        <div className="tw"><table>
                          <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Note</th><th>Actions</th></tr></thead>
                          <tbody id="oe_rent_tb"></tbody>
                        </table></div>
                      </div>

                      <div className="card">
                        <div className="card-head"><span className="card-title">🪙 Petty Office Expenses</span></div>
                        <div className="tw"><table>
                          <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Note</th><th>Actions</th></tr></thead>
                          <tbody id="oe_petty_tb"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/procurements" element={
                  checkAccess('procurements') ? (
                    <div className="page active" id="page_procurements" key="procurements">
                      <div className="ph">
                        <div className="ph-left">
                          <div className="ph-title">PROCUREMENTS</div>
                          <div className="ph-sub">Requirements & pending items from Construction and AMC logs</div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-head">
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',flexWrap:'wrap',gap:'8px'}}>
                            <span className="card-title">📦 Procurement Requirements</span>
                            <div className="toolbar">
                              <input className="si" id="pro_search" placeholder="🔍 Search site…"
                                onInput={(e) => renderProcurements(e.target.value, document.getElementById('pro_filter').value, document.getElementById('pro_sort').value)}
                              />
                              <select className="sel" id="pro_filter"
                                onChange={(e) => renderProcurements(document.getElementById('pro_search').value, e.target.value, document.getElementById('pro_sort').value)}>
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="done">Done</option>
                                <option value="construction">Construction Only</option>
                                <option value="amc">AMC Only</option>
                              </select>
                              <select className="sel" id="pro_sort"
                                onChange={(e) => renderProcurements(document.getElementById('pro_search').value, document.getElementById('pro_filter').value, e.target.value)}>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="tw"><table>
                          <thead><tr>
                            <th>#</th>
                            <th>Client</th>
                            <th>Site</th>
                            <th>Type</th>
                            <th>Requirements</th>
                            <th>Logged At</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr></thead>
                          <tbody id="pro_tb"></tbody>
                        </table></div>
                      </div>
                    </div>
                  ) : <Navigate to="/dashboard" />
                } />

                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </div>
        </div>
      )}

      {/*  ══════════════════════════════════════
     MODALS
══════════════════════════════════════  */}

      {/*  Add Lead Modal  */}
      <div className="overlay" id="m_addlead">
        <div className="modal">
          <div className="mh"><span className="mh-title">➕ Add New Lead</span><button className="mclose" onClick={() => closeM('m_addlead')}>✕</button></div>
          <div className="mb">
            <div className="fr">
              <div className="fg"><label className="fl">Client Name *</label><input className="fi" id="ml_name" placeholder="Full name" /></div>
              <div className="fg"><label className="fl">Phone *</label><input className="fi" id="ml_phone" placeholder="+91 XXXXX XXXXX" /></div>
            </div>
            <div className="fr">
              <div className="fg"><label className="fl">Location</label><input className="fi" id="ml_loc" placeholder="City, State" /></div>
              <div className="fg"><label className="fl">Source</label>
                <select className="fs" id="ml_src"><option>Meta Ad</option><option>Cold Call</option><option>Walk-in</option><option>Referral</option></select>
              </div>
            </div>
            <div className="fg"><label className="fl">Pool Requirements</label><textarea className="ft" id="ml_req" placeholder="Pool dimensions, type, features…"></textarea></div>
            <div className="fr">
              <div className="fg"><label className="fl">Priority</label>
                <select className="fs" id="ml_pri"><option>Normal</option><option>High</option><option>Urgent</option></select>
              </div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_addlead')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveLeadModal()}>✅ Save Lead</button>
          </div>
        </div>
      </div>

      {/* Edit Lead Modal */}
      <div className="overlay" id="m_editlead">
        <div className="modal wide">
          <div className="mh">
            <span className="mh-title" id="mel_modal_title">✏️ Edit Lead</span>
            <button className="mclose" onClick={() => closeM('m_editlead')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="mel_id" />
            <div className="fr">
              <div className="fg"><label className="fl">Client Name *</label><input className="fi" id="mel_name" placeholder="Full name" /></div>
              <div className="fg"><label className="fl">Phone *</label><input className="fi" id="mel_phone" placeholder="+91 XXXXX XXXXX" /></div>
            </div>
            <div className="fr">
              <div className="fg"><label className="fl">Location</label><input className="fi" id="mel_loc" placeholder="City, State" /></div>
              <div className="fg"><label className="fl">Lead Source</label>
                <select className="fs" id="mel_src">
                  <option>Meta Ad</option><option>Cold Call</option><option>Walk-in</option><option>Referral</option><option>Website</option>
                </select>
              </div>
            </div>
            <div className="fg"><label className="fl">Pool Requirements</label><textarea className="ft" id="mel_req" placeholder="Pool dimensions, type, features…"></textarea></div>
            <div className="fr">
              <div className="fg"><label className="fl">Priority</label>
                <select className="fs" id="mel_pri">
                  <option>Normal</option><option>High</option><option>Urgent</option>
                </select>
              </div>
            </div>
            <div className="fr">
              <div className="fg"><label className="fl">Lead Type</label>
                <select className="fs" id="mel_lt">
                  <option value="construction">Pool Construction</option>
                  <option value="amc">AMC / Repair / Renovation</option>
                </select>
              </div>
            </div>
            <div className="fg"><label className="fl">Notes</label><textarea className="ft" id="mel_notes" placeholder="Additional notes…" style={{ minHeight: '60px' }}></textarea></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_editlead')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveEditLead()}>💾 Save Changes</button>
          </div>
        </div>
      </div>

      {/*  Lead Detail Modal  */}
      <div className="overlay" id="m_leaddetail">
        <div className="modal wide">
          <div className="mh"><span className="mh-title" id="ml_dtitle">Lead Details</span><button className="mclose" onClick={() => closeM('m_leaddetail')}>✕</button></div>
          <div className="mb" id="ml_dbody"></div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_leaddetail')}>Close</button>
          </div>
        </div>
      </div>

      {/* Design Revision Modal */}
      <div className="overlay" id="m_designrevision">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">🔄 Design Revision</span>
            <button className="mclose" onClick={() => closeM('m_designrevision')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="mdr_lead_id" />
            {/* Client label — read-only */}
            <div className="fg">
              <label className="fl">Client / Lead</label>
              <div style={{ fontSize: '13px', color: 'var(--sky)', fontWeight: '600', padding: '8px 0' }} id="mdr_client_label"></div>
            </div>
            <div className="fr">
              <div className="fg">
                <label className="fl">Pool Style</label>
                <select className="fs" id="mdr_style">
                  <option>Rectangular</option>
                  <option>L-Shaped</option>
                  <option>Kidney</option>
                  <option>Freeform</option>
                  <option>Plunge Pool</option>
                  <option>Infinity</option>
                  <option>Olympic</option>
                </select>
              </div>
              <div className="fg">
                <label className="fl">Assigned Designer</label>
                <select className="fs" id="mdr_designer"></select>
              </div>
            </div>
            <div className="fg">
              <label className="fl">Design Notes</label>
              <textarea className="ft" id="mdr_notes" placeholder="Describe revision requirements, changes requested by client, alternate options to explore…" style={{ minHeight: '80px' }}></textarea>
            </div>
            <div className="fg" style={{ marginTop: '10px' }}>
              <label className="fl">Upload Design File (PDF / DWG) — Optional</label>
              <div
                id="mdr_dropzone"
                onDragOver={(e) => { e.preventDefault(); document.getElementById('mdr_dropzone').style.borderColor = 'var(--sky)'; }}
                onDragLeave={() => { document.getElementById('mdr_dropzone').style.borderColor = 'var(--border)'; }}
                onDrop={(e) => {
                  e.preventDefault();
                  document.getElementById('mdr_dropzone').style.borderColor = 'var(--border)';
                  const file = e.dataTransfer.files[0];
                  if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.dwg'))) {
                    document.getElementById('mdr_file_name').textContent = file.name;
                    document.getElementById('mdr_file_row').style.display = 'flex';
                  } else { toast('❌ Only PDF or DWG files are accepted.', 'error'); }
                }}
                style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '20px 16px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg2)', transition: 'border-color 0.2s' }}
              >
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <input
                    type="file"
                    accept=".pdf,.dwg"
                    id="mdr_file_input"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        document.getElementById('mdr_file_name').textContent = file.name;
                        document.getElementById('mdr_file_row').style.display = 'flex';
                      }
                    }}
                  />
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>📂</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Drag & drop PDF or DWG here, or <span style={{ color: 'var(--sky)' }}>click to browse</span></div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>Accepted: .pdf, .dwg</div>
                </label>
              </div>
              <div id="mdr_file_row" style={{ display: 'none', alignItems: 'center', gap: '8px', marginTop: '8px', padding: '8px 12px', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--green)', flex: 1 }} id="mdr_file_name"></span>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', fontSize: '11px', padding: '2px 8px' }}
                  onClick={() => {
                    document.getElementById('mdr_file_name').textContent = '';
                    document.getElementById('mdr_file_row').style.display = 'none';
                    document.getElementById('mdr_file_input').value = '';
                  }}>✕ Remove</button>
              </div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_designrevision')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveDesignRevision()}>🔄 Submit Revision</button>
          </div>
        </div>
      </div>

      {/*  Design Plan Modal  */}
      <div className="overlay" id="m_design">
        <div className="modal">
          <div className="mh"><span className="mh-title">📐 Create Design Plan</span><button className="mclose" onClick={() => closeM('m_design')}>✕</button></div>
          <div className="mb">
            <div className="fg" style={{ position: 'relative' }}><label className="fl">Select Lead</label>
              <input className="fi" id="md_lead_search" placeholder="🔍 Type to search lead…"
                onInput={(e) => {
                  const q = e.target.value.toLowerCase();
                  const filtered = LEADS.filter(l => l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q));
                  const dd = document.getElementById('md_lead_dd');
                  dd.innerHTML = filtered.map(l => `<div class="search-dd-item" style="padding:8px 12px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border)" onmousedown="selectDesignLead('${l.id}','${l.name}')">${l.name} <span style='color:var(--text3);font-size:11px'>(${l.id})</span></div>`).join('');
                  dd.style.display = filtered.length ? 'block' : 'none';
                }}
                onBlur={() => setTimeout(() => { const dd = document.getElementById('md_lead_dd'); if (dd) dd.style.display = 'none'; }, 200)}
              />
              <input type="hidden" id="md_lead" />
              <div id="md_lead_dd" style={{ position: 'absolute', zIndex: 999, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', maxHeight: '180px', overflowY: 'auto', display: 'none', width: '100%' }}></div>
              <div id="md_lead_selected" style={{ fontSize: '12px', color: 'var(--sky)', marginTop: '4px' }}></div>
            </div>
            <div className="fr">
              <div className="fg"><label className="fl">Pool Style</label>
                <select className="fs" id="md_style"><option>Rectangular</option><option>L-Shaped</option><option>Kidney</option><option>Freeform</option><option>Infinity Edge</option><option>Plunge Pool</option><option>Beach Style</option><option>Pipeless</option></select>
              </div>
              <div className="fg"><label className="fl">Assigned Designer</label>
                <select className="fs" id="md_designer"></select>
              </div>
            </div>
            <div className="fg"><label className="fl">Design Notes</label><textarea className="ft" id="md_notes" placeholder="Materials, layout, special features…"></textarea></div>
            <div className="fg" style={{ marginTop: '12px' }}>
              <label className="fl">Upload Design File (PDF / DWG) — Optional</label>
              <div
                id="md_dropzone"
                onDragOver={(e) => { e.preventDefault(); document.getElementById('md_dropzone').style.borderColor = 'var(--sky)'; }}
                onDragLeave={() => { document.getElementById('md_dropzone').style.borderColor = 'var(--border)'; }}
                onDrop={(e) => {
                  e.preventDefault();
                  document.getElementById('md_dropzone').style.borderColor = 'var(--border)';
                  const file = e.dataTransfer.files[0];
                  if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.dwg'))) {
                    document.getElementById('md_file_name').textContent = file.name;
                    document.getElementById('md_file_row').style.display = 'flex';
                  } else {
                    toast('❌ Only PDF and DWG files are accepted.', 'error');
                  }
                }}
                style={{
                  border: '2px dashed var(--border)', borderRadius: '8px',
                  padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
                  background: 'var(--bg2)', transition: 'border-color 0.2s'
                }}
              >
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <input
                    type="file"
                    accept=".pdf,.dwg"
                    id="md_file_input"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        document.getElementById('md_file_name').textContent = file.name;
                        document.getElementById('md_file_row').style.display = 'flex';
                      }
                    }}
                  />
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>📂</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                    Drag & drop PDF or DWG here, or <span style={{ color: 'var(--sky)' }}>click to browse</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
                    Accepted: .pdf, .dwg
                  </div>
                </label>
              </div>
              <div
                id="md_file_row"
                style={{
                  display: 'none', alignItems: 'center', gap: '8px',
                  marginTop: '8px', padding: '8px 12px',
                  background: 'var(--bg2)', borderRadius: '6px',
                  border: '1px solid var(--border)'
                }}
              >
                <span style={{ fontSize: '13px', color: 'var(--green)', flex: 1 }} id="md_file_name"></span>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--red)', fontSize: '11px', padding: '2px 8px' }}
                  onClick={() => {
                    document.getElementById('md_file_name').textContent = '';
                    document.getElementById('md_file_row').style.display = 'none';
                    document.getElementById('md_file_input').value = '';
                  }}
                >✕ Remove</button>
              </div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_design')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveDesign()}>📐 Save Plan</button>
          </div>
        </div>
      </div>

      {/* Quote Revision Modal */}
      <div className="overlay" id="m_quoterevision">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">🔄 Quotation Revision</span>
            <button className="mclose" onClick={() => closeM('m_quoterevision')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="mqr_quote_id" />
            {/* Client label — read-only */}
            <div className="fg">
              <label className="fl">Client / Quote</label>
              <div style={{ fontSize: '13px', color: 'var(--sky)', fontWeight: '600', padding: '8px 0' }} id="mqr_client_label"></div>
            </div>
            <div className="fr">
              <div className="fg">
                <label className="fl">Pool Length (ft)</label>
                <input className="fi" id="mqr_l" type="number" defaultValue="30" />
              </div>
              <div className="fg">
                <label className="fl">Pool Width (ft)</label>
                <input className="fi" id="mqr_w" type="number" defaultValue="15" />
              </div>
            </div>
            <div className="fg">
              <label className="fl">Revision Notes</label>
              <textarea className="ft" id="mqr_notes" placeholder="Describe what changed — alternate size, different finish, updated requirements from client…" style={{ minHeight: '80px' }}></textarea>
            </div>
            <div className="fg" style={{ marginTop: '10px' }}>
              <label className="fl">Upload Revised Quotation PDF — Optional</label>
              <div
                id="mqr_dropzone"
                onDragOver={(e) => { e.preventDefault(); document.getElementById('mqr_dropzone').style.borderColor = 'var(--gold)'; }}
                onDragLeave={() => { document.getElementById('mqr_dropzone').style.borderColor = 'var(--border)'; }}
                onDrop={(e) => {
                  e.preventDefault();
                  document.getElementById('mqr_dropzone').style.borderColor = 'var(--border)';
                  const file = e.dataTransfer.files[0];
                  if (file && file.name.endsWith('.pdf')) {
                    document.getElementById('mqr_file_name').textContent = file.name;
                    document.getElementById('mqr_file_row').style.display = 'flex';
                  } else { toast('❌ Only PDF files are accepted.', 'error'); }
                }}
                style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '20px 16px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg2)', transition: 'border-color 0.2s' }}
              >
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <input
                    type="file"
                    accept=".pdf"
                    id="mqr_file_input"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        document.getElementById('mqr_file_name').textContent = file.name;
                        document.getElementById('mqr_file_row').style.display = 'flex';
                      }
                    }}
                  />
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>📄</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Drag & drop PDF here, or <span style={{ color: 'var(--gold)' }}>click to browse</span></div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>Accepted: .pdf only</div>
                </label>
              </div>
              <div id="mqr_file_row" style={{ display: 'none', alignItems: 'center', gap: '8px', marginTop: '8px', padding: '8px 12px', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--green)', flex: 1 }} id="mqr_file_name"></span>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', fontSize: '11px', padding: '2px 8px' }}
                  onClick={() => {
                    document.getElementById('mqr_file_name').textContent = '';
                    document.getElementById('mqr_file_row').style.display = 'none';
                    document.getElementById('mqr_file_input').value = '';
                  }}>✕ Remove</button>
              </div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_quoterevision')}>Cancel</button>
            <button className="btn btn-gold" onClick={() => saveQuoteRevision()}>🔄 Submit Revision</button>
          </div>
        </div>
      </div>

      {/*  Quote Modal  */}
      <div className="overlay" id="m_quote">
        <div className="modal wide">
          <div className="mh"><span className="mh-title">💰 Generate Quotation</span><button className="mclose" onClick={() => closeM('m_quote')}>✕</button></div>
          <div className="mb">
            <div className="fg" style={{ position: 'relative' }}>
              <label className="fl">Select Client</label>
              <input className="fi" id="mq_client_search" placeholder="🔍 Type to search client…"
                onInput={(e) => {
                  const q = e.target.value.toLowerCase();
                  const filtered = LEADS.filter(l => l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q));
                  const dd = document.getElementById('mq_client_dd');
                  dd.innerHTML = filtered.map(l => `<div class="search-dd-item" style="padding:8px 12px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border)" onmousedown="selectQuoteClient('${l.id}','${l.name}')">${l.name} <span style='color:var(--text3);font-size:11px'>(${l.id})</span></div>`).join('');
                  dd.style.display = filtered.length ? 'block' : 'none';
                }}
                onBlur={() => setTimeout(() => { const dd = document.getElementById('mq_client_dd'); if (dd) dd.style.display = 'none'; }, 200)}
              />
              <input type="hidden" id="mq_client" />
              <div id="mq_client_dd" style={{ position: 'absolute', zIndex: 999, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', maxHeight: '180px', overflowY: 'auto', display: 'none', width: '100%' }}></div>
              <div id="mq_client_selected" style={{ fontSize: '12px', color: 'var(--sky)', marginTop: '4px' }}></div>
            </div>
            <div className="fr">
              <div className="fg"><label className="fl">Pool Length (ft)</label><input className="fi" id="mq_l" type="number" defaultValue="30" /></div>
              <div className="fg"><label className="fl">Pool Width (ft)</label><input className="fi" id="mq_w" type="number" defaultValue="15" /></div>
            </div>
            <div className="fg" style={{ marginTop: '12px' }}>
              <label className="fl">Upload Quotation PDF — Optional</label>
              <div
                id="mq_dropzone"
                onDragOver={(e) => { e.preventDefault(); document.getElementById('mq_dropzone').style.borderColor = 'var(--gold)'; }}
                onDragLeave={() => { document.getElementById('mq_dropzone').style.borderColor = 'var(--border)'; }}
                onDrop={(e) => {
                  e.preventDefault();
                  document.getElementById('mq_dropzone').style.borderColor = 'var(--border)';
                  const file = e.dataTransfer.files[0];
                  if (file && file.name.endsWith('.pdf')) {
                    document.getElementById('mq_file_name').textContent = file.name;
                    document.getElementById('mq_file_row').style.display = 'flex';
                  } else { toast('❌ Only PDF files are accepted.', 'error'); }
                }}
                style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '20px 16px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg2)', transition: 'border-color 0.2s' }}
              >
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <input type="file" accept=".pdf" id="mq_file_input" style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) { document.getElementById('mq_file_name').textContent = file.name; document.getElementById('mq_file_row').style.display = 'flex'; }
                    }}
                  />
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>📄</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Drag & drop PDF here, or <span style={{ color: 'var(--gold)' }}>click to browse</span></div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>Accepted: .pdf only</div>
                </label>
              </div>
              <div id="mq_file_row" style={{ display: 'none', alignItems: 'center', gap: '8px', marginTop: '8px', padding: '8px 12px', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--green)', flex: 1 }} id="mq_file_name"></span>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', fontSize: '11px', padding: '2px 8px' }}
                  onClick={() => {
                    document.getElementById('mq_file_name').textContent = '';
                    document.getElementById('mq_file_row').style.display = 'none';
                    document.getElementById('mq_file_input').value = '';
                  }}>✕ Remove</button>
              </div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_quote')}>Cancel</button>
            <button className="btn btn-gold" onClick={() => saveQuote()}>💾 Save Quotation</button>
          </div>
        </div>
      </div>

      {/*  Followup Log Modal  */}
      <div className="overlay" id="m_fu">
        <div className="modal">
          <div className="mh"><span className="mh-title" id="mfu_title">Log Follow-up Call</span><button className="mclose" onClick={() => closeM('m_fu')}>✕</button></div>
          <div className="mb">
            <div className="fg"><label className="fl">Call Outcome</label>
              <select className="fs" id="mfu_out">
                <option>Interested – Will visit</option><option>Needs more time</option>
                <option>Requested callback</option><option>Not interested</option><option>Converted to client</option>
              </select>
            </div>
            <div className="fg"><label className="fl">Duration</label>
              <select className="fs" id="mfu_dur">
                <option>Less than 1 min</option><option>1–3 minutes</option><option>3–5 minutes</option><option>5–10 minutes</option><option>More than 10 min</option>
              </select>
            </div>
            <div className="fg"><label className="fl">Notes</label><textarea className="ft" id="mfu_notes" placeholder="Summary of the call…"></textarea></div>
            <div className="fg"><label className="fl">Schedule Next Call</label><input className="fi" type="datetime-local" id="mfu_next" /></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_fu')}>Cancel</button>
            <button className="btn btn-green" onClick={() => logFU()}>✅ Log Call</button>
          </div>
        </div>
      </div>

      {/*  Add User Modal  */}
      <div className="overlay" id="m_adduser">
        <div className="modal">
          <div className="mh"><span className="mh-title">👤 Add Team Member</span><button className="mclose" onClick={() => closeM('m_adduser')}>✕</button></div>
          <div className="mb">
            <div className="fr">
              <div className="fg"><label className="fl">Full Name</label><input className="fi" id="mu_name" placeholder="Full name" /></div>
              <div className="fg"><label className="fl">Email</label><input className="fi" id="mu_email" type="email" placeholder="name@elitepool.in" /></div>
            </div>
            <div className="fr">
              <div className="fg"><label className="fl">Role</label>
                <select className="fs" id="mu_role"><option value="admin">Admin</option><option value="support">Customer Support</option><option value="designer">Pool Designer</option></select>
              </div>
              <div className="fg"><label className="fl">Password</label><input className="fi" id="mu_pass" type="password" placeholder="Temporary password" /></div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_adduser')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveUser()}>✅ Create User</button>
          </div>
        </div>
      </div>

      {/* View Construction Plans Modal */}
      <div className="overlay" id="m_plans">
        <div className="modal">
          <div className="mh">
            <span className="mh-title" id="m_plans_title">Construction Plans</span>
            <button className="mclose" onClick={() => closeM('m_plans')}>✕</button>
          </div>
          <div className="mb" id="m_plans_body"></div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_plans')}>Close</button>
          </div>
        </div>
      </div>

      {/* Add Construction Plan Modal */}
      <div className="overlay" id="m_addplan">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">📂 Add Construction Plan</span>
            <button className="mclose" onClick={() => closeM('m_addplan')}>✕</button>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Site</label>
              <input type="hidden" id="mp_site_id" />
              <div style={{ fontSize: '13px', color: 'var(--sky)', fontWeight: '600', padding: '6px 0' }} id="mp_site_label"></div>
            </div>
            <div className="fg">
              <label className="fl">Plan Type</label>
              <select className="fs" id="mp_type">
                <option>Schematic Plan</option>
                <option>Plumbing Plan</option>
                <option>Electrical Plan</option>
                <option>Sectional Plan</option>
                <option>Pump Room / Plant Room Plan</option>
                <option>CAD Master Plan</option>
              </select>
            </div>
            <div className="fg" style={{ marginTop: '10px' }}>
              <label className="fl">Upload File (PDF for plans, DWG for CAD Master Plan)</label>
              <div
                id="mp_dropzone"
                onDragOver={(e) => { e.preventDefault(); document.getElementById('mp_dropzone').style.borderColor = 'var(--sky)'; }}
                onDragLeave={() => { document.getElementById('mp_dropzone').style.borderColor = 'var(--border)'; }}
                onDrop={(e) => {
                  e.preventDefault();
                  document.getElementById('mp_dropzone').style.borderColor = 'var(--border)';
                  const file = e.dataTransfer.files[0];
                  const type = document.getElementById('mp_type').value;
                  const isDWG = type === 'CAD Master Plan';
                  const valid = isDWG ? file.name.endsWith('.dwg') : file.name.endsWith('.pdf');
                  if (valid) {
                    document.getElementById('mp_file_name').textContent = file.name;
                    document.getElementById('mp_file_row').style.display = 'flex';
                  } else {
                    toast('❌ ' + (isDWG ? 'CAD Master Plan requires .dwg' : 'This plan requires .pdf'), 'error');
                  }
                }}
                style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '20px 16px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg2)', transition: 'border-color 0.2s' }}
              >
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <input
                    type="file"
                    accept=".pdf,.dwg"
                    id="mp_file_input"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        document.getElementById('mp_file_name').textContent = file.name;
                        document.getElementById('mp_file_row').style.display = 'flex';
                      }
                    }}
                  />
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>📂</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Drag & drop here, or <span style={{ color: 'var(--sky)' }}>click to browse</span></div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>PDF for all plans · DWG for CAD Master Plan</div>
                </label>
              </div>
              <div id="mp_file_row" style={{ display: 'none', alignItems: 'center', gap: '8px', marginTop: '8px', padding: '8px 12px', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--green)', flex: 1 }} id="mp_file_name"></span>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', fontSize: '11px', padding: '2px 8px' }}
                  onClick={() => {
                    document.getElementById('mp_file_name').textContent = '';
                    document.getElementById('mp_file_row').style.display = 'none';
                    document.getElementById('mp_file_input').value = '';
                  }}>✕ Remove</button>
              </div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_addplan')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => savePlan()}>💾 Save Plan</button>
          </div>
        </div>
      </div>

      {/* Add Construction Log Modal */}
      <div className="overlay" id="m_constructionlog">
        <div className="modal wide">
          <div className="mh">
            <span className="mh-title">📋 Add Construction Log</span>
            <button className="mclose" onClick={() => closeM('m_constructionlog')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="mcl_site_id" />
            <div style={{ fontSize: '13px', color: 'var(--sky)', fontWeight: '600', marginBottom: '12px' }} id="mcl_site_label"></div>
            <div className="fg">
              <label className="fl">📅 Log Date</label>
              <input className="fi" id="mcl_date" type="date" />
            </div>
            <div className="fg">
              <label className="fl">📸 Today's Progress (Photos)</label>
              <div
                id="mcl_photo_dropzone"
                onDragOver={(e) => { e.preventDefault(); document.getElementById('mcl_photo_dropzone').style.borderColor = 'var(--sky)'; }}
                onDragLeave={() => { document.getElementById('mcl_photo_dropzone').style.borderColor = 'var(--border)'; }}
                onDrop={(e) => {
                  e.preventDefault();
                  document.getElementById('mcl_photo_dropzone').style.borderColor = 'var(--border)';
                  const files = e.dataTransfer.files;
                  Array.from(files).forEach(file => {
                    if (file && file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        window.pendingLogPhotos.push({ name: file.name, data: ev.target.result });
                        window.renderPendingLogPhotos();
                      };
                      reader.readAsDataURL(file);
                    } else { toast('❌ Ignored non-image file: ' + file.name, 'error'); }
                  });
                }}
                style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg2)', transition: 'border-color 0.2s' }}
              >
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <input type="file" multiple accept="image/*,.heic" id="mcl_photo_input" style={{ display: 'none' }}
                    onChange={(e) => {
                      const files = e.target.files;
                      Array.from(files).forEach(file => {
                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            window.pendingLogPhotos.push({ name: file.name, data: ev.target.result });
                            window.renderPendingLogPhotos();
                          };
                          reader.readAsDataURL(file);
                        }
                      });
                      e.target.value = '';
                    }}
                  />
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>📷</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Drag & drop photos or <span style={{ color: 'var(--sky)' }}>click to browse</span></div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>Upload multiple JPG, PNG, HEIC</div>
                </label>
              </div>
              <div id="mcl_photo_row" style={{ display: 'none', gap: '4px', marginTop: '8px', padding: '8px 12px', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              </div>
            </div>
            <div className="fg" style={{ marginTop: '10px' }}>
              <label className="fl">📝 Work Process / Report</label>
              <textarea className="ft" id="mcl_report" placeholder="Describe today's work process and progress..." style={{ minHeight: '70px' }}></textarea>
            </div>
            <div className="fr">
              <div className="fg">
                <label className="fl">👷 Labour</label>
                <textarea className="ft" id="mcl_labor" placeholder="e.g. 2 masons, 1 plumber, 3 helpers..." style={{ minHeight: '60px' }}></textarea>
              </div>
              <div className="fg">
                <label className="fl">🧱 Materials Used</label>
                <textarea className="ft" id="mcl_materials" placeholder="e.g. 50 bags cement, 200 bricks..." style={{ minHeight: '60px' }}></textarea>
              </div>
            </div>
            <div className="fg" style={{ marginTop: '6px' }}>
              <label className="fl">📋 Requirements / Pending Items</label>
              <textarea className="ft" id="mcl_requirements" placeholder="e.g. Need 20 more steel rods, pump delivery pending..." style={{ minHeight: '60px' }}></textarea>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_constructionlog')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveConstructionLog()}>💾 Save Log</button>
          </div>
        </div>
      </div>

      {/* View Construction Log Modal (Timeline View) */}
      <div className="overlay" id="m_viewconstructionlog">
        <div className="modal wide">
          <div className="mh">
            <span className="mh-title" id="mvcl_title">Construction Log</span>
            <button className="mclose" onClick={() => closeM('m_viewconstructionlog')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="mvcl_site_id" />
            <div id="mvcl_summary" style={{ marginBottom: '16px', display: 'flex', gap: '12px', background: 'var(--bg2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}></div>
            <div className="fr" style={{ marginBottom: '16px', alignItems: 'flex-end' }}>
              <div className="fg" style={{ flex: 1 }}>
                <label className="fl">Filter Logs</label>
                <select className="fs" id="mvcl_filter" onChange={(e) => {
                  const val = e.target.value;
                  const cal = document.getElementById('mvcl_cal');
                  cal.style.display = val === 'custom' ? 'block' : 'none';
                  renderConstructionLogs(document.getElementById('mvcl_site_id').value);
                }}>
                  <option value="all">All Logs</option>
                  <option value="weekly">Last 7 Days</option>
                  <option value="monthly">Last 30 Days</option>
                  <option value="custom">Specific Date</option>
                </select>
              </div>
              <div className="fg" style={{ flex: 1 }}>
                <input className="fi" id="mvcl_cal" type="date" style={{ display: 'none' }}
                  onChange={() => renderConstructionLogs(document.getElementById('mvcl_site_id').value)}
                />
              </div>
              <div className="fg" style={{ flex: '0 0 auto' }}>
                <button className="btn btn-ghost" id="mvcl_toggle_images" onClick={() => {
                  window.showConstructionImages = !window.showConstructionImages;
                  document.getElementById('mvcl_toggle_images').textContent = window.showConstructionImages ? 'Hide Images' : 'Show Images';
                  renderConstructionLogs(document.getElementById('mvcl_site_id').value);
                }}>Show Images</button>
              </div>
            </div>
            <div id="mvcl_body" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_viewconstructionlog')}>Close</button>
          </div>
        </div>
      </div>

      {/* Add AMC Site Modal */}
      <div className="overlay" id="m_addamc">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">🔧 Add AMC Site</span>
            <button className="mclose" onClick={() => closeM('m_addamc')}>✕</button>
          </div>
          <div className="mb">
            <div className="fg"><label className="fl">Client Name</label><input className="fi" id="mamc_name" placeholder="Full name" /></div>
            <div className="fg"><label className="fl">Location / City</label><input className="fi" id="mamc_loc" placeholder="City, Area" /></div>
            <div className="fg"><label className="fl">Start Date</label><input className="fi" id="mamc_date" type="date" /></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_addamc')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => {
              const name = document.getElementById('mamc_name').value.trim();
              const loc = document.getElementById('mamc_loc').value.trim();
              const date = document.getElementById('mamc_date').value;
              if (!name || !loc) { toast('❌ Client name and location are required.', 'error'); return; }
              const newId = 'AMC' + String(AMC_SITES.length + 1).padStart(3, '0');
              AMC_SITES.push({ id: newId, client: name, location: loc, startDate: date || new Date().toISOString().slice(0, 10), status: 'active', entries: [] });
              renderAMC();
              toast('✅ AMC site added!', 'success');
              closeM('m_addamc');
            }}>✅ Save Site</button>
          </div>
        </div>
      </div>

      {/* Add AMC Log Modal */}
      <div className="overlay" id="m_amclog">
        <div className="modal wide">
          <div className="mh">
            <span className="mh-title">📋 Add AMC Log</span>
            <button className="mclose" onClick={() => closeM('m_amclog')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="ma_site_id" />
            <div style={{ fontSize: '13px', color: 'var(--sky)', fontWeight: '600', marginBottom: '12px' }} id="ma_site_label"></div>
            <div className="fg">
              <label className="fl">📅 Log Date</label>
              <input className="fi" id="ma_date" type="date" />
            </div>
            <div className="fg">
              <label className="fl">📸 Today's Progress (Photos)</label>
              <div
                id="ma_photo_dropzone"
                onDragOver={(e) => { e.preventDefault(); document.getElementById('ma_photo_dropzone').style.borderColor = 'var(--sky)'; }}
                onDragLeave={() => { document.getElementById('ma_photo_dropzone').style.borderColor = 'var(--border)'; }}
                onDrop={(e) => {
                  e.preventDefault();
                  document.getElementById('ma_photo_dropzone').style.borderColor = 'var(--border)';
                  const files = e.dataTransfer.files;
                  Array.from(files).forEach(file => {
                    if (file && file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        window.pendingAMCPhotos.push({ name: file.name, data: ev.target.result });
                        window.renderPendingAMCPhotos();
                      };
                      reader.readAsDataURL(file);
                    } else { toast('❌ Ignored non-image file: ' + file.name, 'error'); }
                  });
                }}
                style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg2)', transition: 'border-color 0.2s' }}
              >
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <input type="file" multiple accept="image/*,.heic" id="ma_photo_input" style={{ display: 'none' }}
                    onChange={(e) => {
                      const files = e.target.files;
                      Array.from(files).forEach(file => {
                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            window.pendingAMCPhotos.push({ name: file.name, data: ev.target.result });
                            window.renderPendingAMCPhotos();
                          };
                          reader.readAsDataURL(file);
                        }
                      });
                      e.target.value = '';
                    }}
                  />
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>📷</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)' }}>Drag & drop photos or <span style={{ color: 'var(--sky)' }}>click to browse</span></div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>Upload multiple JPG, PNG, HEIC</div>
                </label>
              </div>
              <div id="ma_photo_row" style={{ display: 'none', gap: '4px', marginTop: '8px', padding: '8px 12px', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)' }}></div>
            </div>
            <div className="fg" style={{ marginTop: '10px' }}>
              <label className="fl">📝 Work Process / Report</label>
              <textarea className="ft" id="ma_report" placeholder="Describe today's work process and progress..." style={{ minHeight: '70px' }}></textarea>
            </div>
            <div className="fr">
              <div className="fg">
                <label className="fl">🧪 pH & Chlorine Levels</label>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                  onClick={() => openM('m_ph_chlorine')}>
                  📊 Upload pH & Chlorine Level
                </button>
                <div id="ma_ph_summary" style={{ display: 'none', marginTop: '8px', padding: '8px 12px', background: 'var(--bg2)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text2)' }}></div>
              </div>
              <div className="fg">
                <label className="fl">🧱 Materials Used</label>
                <textarea className="ft" id="ma_materials" placeholder="e.g. 50 bags cement, 200 bricks..." style={{ minHeight: '60px' }}></textarea>
              </div>
            </div>
            <div className="fg" style={{ marginTop: '6px' }}>
              <label className="fl">📋 Requirements / Pending Items</label>
              <textarea className="ft" id="ma_requirements" placeholder="e.g. Need 20 more steel rods, pump delivery pending..." style={{ minHeight: '60px' }}></textarea>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_amclog')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveAMCLog()}>💾 Save Log</button>
          </div>
        </div>
      </div>

      {/* pH & Chlorine Level Picker Modal */}
      <div className="overlay" id="m_ph_chlorine">
        <div className="modal" style={{ maxWidth: '400px', width: '90%', margin: 'auto' }}>
          <div className="mh">
            <span className="mh-title">🧪 Set pH & Chlorine Level</span>
            <button className="mclose" onClick={() => closeM('m_ph_chlorine')}>✕</button>
          </div>
          <div className="mb">
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'flex-start', padding: '0 16px' }}>

              {/* Chlorine Column */}
              <div style={{ flex: 1 }}>
                <div style={{ textAlign: 'center', fontWeight: '700', fontSize: '13px', color: 'var(--text2)', marginBottom: '10px', letterSpacing: '1px' }}>Cl</div>
                {[
                  { cl: '5', label: 'MAX', labelColor: 'var(--red)' },
                  { cl: '3', label: 'IDEAL', labelColor: 'var(--green)' },
                  { cl: '2', label: 'IDEAL', labelColor: 'var(--green)' },
                  { cl: '1', label: 'IDEAL', labelColor: 'var(--green)' },
                  { cl: '0.5', label: 'MIN', labelColor: 'var(--sky)' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', gap: '6px' }}>
                    <div
                      id={`cl_row_${i}`}
                      onClick={() => {
                        document.querySelectorAll('[id^=cl_row_]').forEach(el => el.style.outline = 'none');
                        document.getElementById(`cl_row_${i}`).style.outline = '3px solid var(--sky)';
                        window._selCl = row.cl;
                      }}
                      style={{
                        flex: 1,
                        background: i === 0 ? '#f5c400' : i === 1 ? '#f0c000' : i === 2 ? '#e8b800' : i === 3 ? '#f0d060' : '#f5e080',
                        borderRadius: '8px', padding: '12px 8px', textAlign: 'center',
                        fontWeight: '800', fontSize: '18px', cursor: 'pointer',
                        color: '#1a1a1a', transition: 'outline 0.15s'
                      }}>
                      {row.cl}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: row.labelColor, width: '32px', textAlign: 'left', letterSpacing: '0.5px' }}>{row.label}</span>
                  </div>
                ))}
              </div>

              {/* pH Column */}
              <div style={{ flex: 1 }}>
                <div style={{ textAlign: 'center', fontWeight: '700', fontSize: '13px', color: 'var(--text2)', marginBottom: '10px', letterSpacing: '1px' }}>pH</div>
                {[
                  { ph: '8.2', bg: '#c0186a', label: 'MAX', labelColor: 'var(--red)' },
                  { ph: '7.8', bg: '#d44090', label: 'IDEAL', labelColor: 'var(--green)' },
                  { ph: '7.5', bg: '#e06080', label: 'IDEAL', labelColor: 'var(--green)' },
                  { ph: '7.2', bg: '#e08040', label: 'IDEAL', labelColor: 'var(--green)' },
                  { ph: '6.8', bg: '#e8a030', label: 'MIN', labelColor: 'var(--sky)' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', gap: '6px' }}>
                    <div
                      id={`ph_row_${i}`}
                      onClick={() => {
                        document.querySelectorAll('[id^=ph_row_]').forEach(el => el.style.outline = 'none');
                        document.getElementById(`ph_row_${i}`).style.outline = '3px solid var(--sky)';
                        window._selPh = row.ph;
                      }}
                      style={{
                        flex: 1,
                        background: row.bg, borderRadius: '8px', padding: '12px 8px',
                        textAlign: 'center', fontWeight: '800', fontSize: '18px',
                        cursor: 'pointer', color: '#fff', transition: 'outline 0.15s'
                      }}>
                      {row.ph}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: row.labelColor, width: '32px', textAlign: 'left', letterSpacing: '0.5px' }}>{row.label}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_ph_chlorine')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => {
              const ph = window._selPh, cl = window._selCl;
              if (!ph || !cl) { toast('❌ Please select both pH and Chlorine levels', 'error'); return; }
              window._savedPhCl = { ph, cl };
              const summary = document.getElementById('ma_ph_summary');
              if (summary) { summary.style.display = 'block'; summary.textContent = `✅ pH: ${ph} | Chlorine: ${cl} ppm`; }
              -+              closeM('m_ph_chlorine');
              toast(`✅ pH ${ph} & Chlorine ${cl} ppm saved`, 'success');
            }}>✅ Confirm</button>
          </div>
        </div>
      </div>

      {/* View AMC Log Modal (Timeline View) */}
      <div className="overlay" id="m_viewamclog">
        <div className="modal wide">
          <div className="mh">
            <span className="mh-title" id="mval_title">AMC Log</span>
            <button className="mclose" onClick={() => closeM('m_viewamclog')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="mval_site_id" />
            <div id="mval_summary" style={{ marginBottom: '16px', display: 'flex', gap: '12px', background: 'var(--bg2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}></div>
            <div className="fr" style={{ marginBottom: '16px', alignItems: 'flex-end' }}>
              <div className="fg" style={{ flex: 1 }}>
                <label className="fl">Filter Logs</label>
                <select className="fs" id="mval_filter" onChange={(e) => {
                  const val = e.target.value;
                  const cal = document.getElementById('mval_cal');
                  cal.style.display = val === 'custom' ? 'block' : 'none';
                  renderAMCLogs(document.getElementById('mval_site_id').value);
                }}>
                  <option value="all">All Logs</option>
                  <option value="weekly">Last 7 Days</option>
                  <option value="monthly">Last 30 Days</option>
                  <option value="custom">Specific Date</option>
                </select>
              </div>
              <div className="fg" style={{ flex: 1 }}>
                <input className="fi" id="mval_cal" type="date" style={{ display: 'none' }}
                  onChange={() => renderAMCLogs(document.getElementById('mval_site_id').value)}
                />
              </div>
              <div className="fg" style={{ flex: '0 0 auto' }}>
                <button className="btn btn-ghost" id="mval_toggle_images" onClick={() => {
                  window.showAMCImages = !window.showAMCImages;
                  document.getElementById('mval_toggle_images').textContent = window.showAMCImages ? 'Hide Images' : 'Show Images';
                  renderAMCLogs(document.getElementById('mval_site_id').value);
                }}>Show Images</button>
              </div>
            </div>
            <div id="mval_body" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_viewamclog')}>Close</button>
          </div>
        </div>
      </div>

      {/* Add Construction Site Modal */}
      <div className="overlay" id="m_addsite">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">🏗️ Add Construction Site</span>
            <button className="mclose" onClick={() => closeM('m_addsite')}>✕</button>
          </div>
          <div className="mb">
            <div className="fg"><label className="fl">Client Name</label><input className="fi" id="ms_name" placeholder="Full name" /></div>
            <div className="fg"><label className="fl">Location / City</label><input className="fi" id="ms_loc" placeholder="City, Area" /></div>
            <div className="fg"><label className="fl">Start Date</label><input className="fi" id="ms_date" type="date" /></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_addsite')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => window.saveConstructionSite()}>✅ Save Site</button>
          </div>
        </div>
      </div>

      {/* Mark New Attendance Modal */}
      <div className="overlay" id="m_newatt">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">🕐 Mark Attendance</span>
            <button className="mclose" onClick={() => closeM('m_newatt')}>✕</button>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Employee *</label>
              <select className="fs" id="nat_emp">
                <option value="">— Select Employee —</option>
                {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} ({e.dept})</option>)}
              </select>
            </div>
            <div className="fr">
              <div className="fg"><label className="fl">Date *</label><input className="fi" id="nat_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></div>
              <div className="fg">
                <label className="fl">Status *</label>
                <select className="fs" id="nat_status">
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                  <option value="leave">On Leave</option>
                </select>
              </div>
            </div>
            <div className="fr">
              <div className="fg"><label className="fl">Check-In Time *</label><input className="fi" id="nat_in" type="time" /></div>
              <div className="fg"><label className="fl">Check-Out Time</label><input className="fi" id="nat_out" type="time" /></div>
            </div>
            <div className="fg"><label className="fl">Notes</label><textarea className="ft" id="nat_notes" placeholder="Any remarks…" style={{ minHeight: '60px' }}></textarea></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_newatt')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveNewAttendance()}>✅ Save</button>
          </div>
        </div>
      </div>

      {/* Edit Attendance Modal */}
      <div className="overlay" id="m_editatt">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">✏️ Edit Attendance</span>
            <button className="mclose" onClick={() => closeM('m_editatt')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="eat_id" />
            <div className="fr">
              <div className="fg"><label className="fl">Employee</label><input className="fi" id="eat_emp" readOnly style={{ opacity: 0.6 }} /></div>
              <div className="fg"><label className="fl">Date</label><input className="fi" id="eat_date" type="date" readOnly style={{ opacity: 0.6 }} /></div>
            </div>
            <div className="fr">
              <div className="fg"><label className="fl">Status</label>
                <select className="fs" id="eat_status">
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                  <option value="leave">On Leave</option>
                </select>
              </div>
            </div>
            <div className="fr">
              <div className="fg"><label className="fl">Check-In Time</label><input className="fi" id="eat_in" type="time" /></div>
              <div className="fg"><label className="fl">Check-Out Time</label><input className="fi" id="eat_out" type="time" /></div>
            </div>
            <div className="fg"><label className="fl">Notes</label><textarea className="ft" id="eat_notes" style={{ minHeight: '60px' }}></textarea></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_editatt')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveEditAttendance()}>💾 Save Changes</button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <div className="overlay" id="m_edituser">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">✏️ Edit User</span>
            <button className="mclose" onClick={() => closeM('m_edituser')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="meu_orig_email" />
            <div className="fg"><label className="fl">Full Name</label><input className="fi" id="meu_name" placeholder="Full name" /></div>
            <div className="fg"><label className="fl">Email</label><input className="fi" id="meu_email" placeholder="Email" disabled style={{ opacity: 0.6 }} /></div>
            <div className="fg"><label className="fl">Role</label>
              <select className="fs" id="meu_role">
                <option value="ceo">CEO</option>
                <option value="admin">Admin</option>
                <option value="support">Support</option>
              </select>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_edituser')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => window.saveEditUser()}>💾 Save Changes</button>
          </div>
        </div>
      </div>

      {/* Design Detail Modal */}
      <div className="overlay" id="m_designdetail">
        <div className="modal wide">
          <div className="mh">
            <span className="mh-title" id="mdv_title">Design Plan</span>
            <button className="mclose" onClick={() => closeM('m_designdetail')}>✕</button>
          </div>
          <div className="mb" id="mdv_body"></div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_designdetail')}>Close</button>
          </div>
        </div>
      </div>

      {/* Quote Detail Modal */}
      <div className="overlay" id="m_quotedetail">
        <div className="modal">
          <div className="mh">
            <span className="mh-title" id="mqv_title">Quotation Details</span>
            <button className="mclose" onClick={() => closeM('m_quotedetail')}>✕</button>
          </div>
          <div className="mb" id="mqv_body"></div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_quotedetail')}>Close</button>
          </div>
        </div>
      </div>

      {/* Schedule Call Modal */}
      <div className="overlay" id="m_schedule">
        <div className="modal">
          <div className="mh">
            <span className="mh-title" id="msched_title">📅 Schedule Call</span>
            <button className="mclose" onClick={() => closeM('m_schedule')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="msched_lead_id" />
            <div className="fg">
              <label className="fl">Date &amp; Time</label>
              <input className="fi" type="datetime-local" id="msched_dt" />
            </div>
            <div className="fg">
              <label className="fl">Note (Optional)</label>
              <input className="fi" id="msched_note" placeholder="e.g. Call after 5pm, client prefers evening..." />
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_schedule')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => window.saveSchedule()}>📅 Confirm Schedule</button>
          </div>
        </div>
      </div>

      {/* Import Lead Type Chooser Modal */}
      <div className="overlay" id="m_import_type">
        <div className="modal" style={{ maxWidth: '450px' }}>
          <div className="mh">
            <span className="mh-title">📥 Import Leads Excel</span>
            <button className="mclose" onClick={() => { closeM('m_import_type'); setImportType(''); setImportFile(null); }}>✕</button>
          </div>
          <div className="mb">
            <div className="fg">
              <label className="fl">Step 1: Choose Lead Type</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className={`btn ${importType === 'construction' ? 'btn-sky' : 'btn-ghost'}`}
                  onClick={() => setImportType('construction')}
                  style={{ flex: 1, padding: '12px', height: 'auto', flexDirection: 'column', gap: '4px' }}
                >
                  <span style={{ fontSize: '24px' }}>🏗️</span>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>Construction</span>
                </button>
                <button
                  className={`btn ${importType === 'amc' ? 'btn-gold' : 'btn-ghost'}`}
                  onClick={() => setImportType('amc')}
                  style={{ flex: 1, padding: '12px', height: 'auto', flexDirection: 'column', gap: '4px' }}
                >
                  <span style={{ fontSize: '24px' }}>🔧</span>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>AMC / Repair</span>
                </button>
              </div>
            </div>

            {importType && (
              <div className="fg" style={{ marginTop: '20px' }}>
                <label className="fl">Step 2: Upload CSV File</label>
                <div
                  style={{ border: '2px dashed var(--border)', borderRadius: '10px', padding: '30px', textAlign: 'center', background: 'var(--bg2)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => document.getElementById('import_file_input').click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--sky)'; e.currentTarget.style.background = 'var(--sky-bg)'; }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)'; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--bg2)';
                    const file = e.dataTransfer.files[0];
                    if (file) setImportFile(file);
                  }}
                >
                  {importFile ? (
                    <div>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                      <div style={{ color: 'var(--green)', fontWeight: '700', fontSize: '14px' }}>{importFile.name}</div>
                      <div style={{ color: 'var(--text3)', fontSize: '11px', marginTop: '4px' }}>Ready to import</div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text3)' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Drag & drop CSV file here</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>or <span style={{ color: 'var(--sky)', fontWeight: '600' }}>click to browse</span></div>
                    </div>
                  )}
                  <input type="file" id="import_file_input" accept=".csv" style={{ display: 'none' }} onChange={(e) => setImportFile(e.target.files[0])} />
                </div>
              </div>
            )}
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => { closeM('m_import_type'); setImportType(''); setImportFile(null); }}>Cancel</button>
            <button className="btn btn-sky" disabled={!importType || !importFile} onClick={() => handleImportLeads()}>🚀 Start Import</button>
          </div>
        </div>
      </div>

      {/* Follow-up Client Detail Modal */}
      <div className="overlay" id="m_fu_detail">
        <div className="modal wide">
          <div className="mh">
            <span className="mh-title" id="mfu_detail_title">Follow-up Details</span>
            <button className="mclose" onClick={() => closeM('m_fu_detail')}>✕</button>
          </div>
          <div className="mb" id="mfu_detail_body"></div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_fu_detail')}>Close</button>
          </div>
        </div>
      </div>

      {/* Design Confirm Action Modal */}
      <div className="overlay" id="m_confirm_design">
        <div className="modal">
          <div className="mh">
            <span className="mh-title" id="mcd_title">Confirm</span>
            <button className="mclose" onClick={() => closeM('m_confirm_design')}>✕</button>
          </div>
          <div className="mb">
            <p id="mcd_body" style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.6' }}></p>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_confirm_design')}>✕ Cancel</button>
            <button className="btn btn-sky" id="mcd_confirm">✅ Confirm</button>
          </div>
        </div>
      </div>

      {/* Quote Confirm Delete Modal */}
      <div className="overlay" id="m_confirm_quote">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">🗑 Delete Quotation</span>
            <button className="mclose" onClick={() => closeM('m_confirm_quote')}>✕</button>
          </div>
          <div className="mb">
            <p id="mcq_body" style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.6' }}></p>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_confirm_quote')}>✕ Cancel</button>
            <button className="btn btn-red" id="mcq_confirm">🗑 Delete</button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <div className="overlay" id="m_lightbox" style={{ zIndex: 9999, background: 'rgba(0,0,0,0.85)' }}>
        <div style={{ position: 'relative', width: '90%', maxWidth: '800px', margin: '40px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
            <span id="mlb_title" style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>Photo Preview</span>
            <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }} onClick={() => closeM('m_lightbox')}>✕</button>
          </div>
          <img id="mlb_img" src="" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} />
        </div>
      </div>

      {/* Site Account Detail Modal */}
      <div className="overlay" id="m_siteaccount">
        <div className="modal wide">
          <div className="mh">
            <span className="mh-title" id="msa_title">Site Account</span>
            <button className="mclose" onClick={() => closeM('m_siteaccount')}>✕</button>
          </div>
          <div className="mb">
            <input type="hidden" id="msa_site_id" />
            <input type="hidden" id="msa_cur_company" />
            <input type="hidden" id="msa_company_type" />
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '12px' }} id="msa_location"></div>

            {/* Elite Pool tabs — hidden for M2A */}
            <div id="msa_tabs_row" style={{ display: 'none', gap: '8px', marginBottom: '16px' }}>
              <button className="btn btn-sky" id="msa_tab_con" onClick={() => {
                const siteId = document.getElementById('msa_site_id').value;
                document.getElementById('msa_cur_company').value = 'elitePool_construction';
                document.getElementById('msa_company_label').textContent = 'Elite Pool — Construction Account';
                document.getElementById('msa_tab_con').classList.add('active');
                document.getElementById('msa_tab_amc').classList.remove('active');
                renderSiteAccountDetail(siteId, 'elitePool_construction');
              }}>🏗️ Construction</button>
              <button className="btn btn-ghost" id="msa_tab_amc" onClick={() => {
                const siteId = document.getElementById('msa_site_id').value;
                document.getElementById('msa_cur_company').value = 'elitePool_amc';
                document.getElementById('msa_company_label').textContent = 'Elite Pool — AMC Account';
                document.getElementById('msa_tab_amc').classList.add('active');
                document.getElementById('msa_tab_con').classList.remove('active');
                renderSiteAccountDetail(siteId, 'elitePool_amc');
              }}>🔧 AMC</button>
            </div>

            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--sky)', marginBottom: '12px' }} id="msa_company_label"></div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', background: 'var(--bg2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Received from Client</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--green)' }} id="msa_received">₹0</div>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: '6px', fontSize: '11px' }} onClick={() => openAddPayment()}>➕ Add Amount</button>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Total Spent</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--red)' }} id="msa_spent">₹0</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Remaining Balance</div>
                <div style={{ fontSize: '18px', fontWeight: '700' }} id="msa_balance">₹0</div>
              </div>
            </div>

            {/* Payments History */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px' }}>📋 Payment History</div>
              <div className="tw" style={{ maxHeight: '120px', overflowY: 'auto', background: 'var(--bg2)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                <table style={{ fontSize: '12px' }}>
                  <thead><tr><th>Date</th><th>Amount</th><th style={{ width: '40px' }}></th></tr></thead>
                  <tbody id="msa_pay_tb"></tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)' }}>📋 Expenditures</span>
              <button className="btn btn-sky btn-sm" onClick={() => openAddExpenditure()}>➕ Add Expenditure</button>
            </div>
            <div className="tw" style={{ maxHeight: '220px', overflowY: 'auto' }}><table>
              <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Note</th><th></th></tr></thead>
              <tbody id="msa_exp_tb"></tbody>
            </table></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_siteaccount')}>Close</button>
          </div>
        </div>
      </div>

      {/* Add Expenditure Modal */}
      <div className="overlay" id="m_addexpenditure">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">➕ Add Expenditure</span>
            <button className="mclose" onClick={() => closeM('m_addexpenditure')}>✕</button>
          </div>
          <div className="mb">
            <div className="fg"><label className="fl">Date</label><input className="fi" id="mae_date" type="date" /></div>
            <div className="fg"><label className="fl">Description *</label><input className="fi" id="mae_desc" placeholder="e.g. Labour payment, Material purchase…" /></div>
            <div className="fg"><label className="fl">Category</label>
              <select className="fs" id="mae_category">
                <option>Labour</option>
                <option>Materials</option>
                <option>Equipment</option>
                <option>Transport</option>
                <option>Subcontractor</option>
                <option>Miscellaneous</option>
              </select>
            </div>
            <div className="fg"><label className="fl">Amount (₹) *</label><input className="fi" id="mae_amount" type="number" placeholder="0" /></div>
            <div className="fg"><label className="fl">Note (Optional)</label><input className="fi" id="mae_note" placeholder="Additional details…" /></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_addexpenditure')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveExpenditure()}>💾 Save</button>
          </div>
        </div>
      </div>

      {/* Edit Received Amount Modal */}
      <div className="overlay" id="m_addpayment">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">💰 Add Payment Entry</span>
            <button className="mclose" onClick={() => closeM('m_addpayment')}>✕</button>
          </div>
          <div className="mb">
            <div className="fg"><label className="fl">Payment Date</label><input className="fi" id="msa_pay_date" type="date" /></div>
            <div className="fg"><label className="fl">Amount Received (₹) *</label><input className="fi" id="msa_pay_amount" type="number" placeholder="0" /></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_addpayment')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => savePayment()}>✅ Add Payment</button>
          </div>
        </div>
      </div>

      {/* Add Office Expense Modal */}
      <div className="overlay" id="m_addofficeexpense">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">🧾 Add Office Expense</span>
            <button className="mclose" onClick={() => closeM('m_addofficeexpense')}>✕</button>
          </div>
          <div className="mb">
            <div className="fg"><label className="fl">Expense Type *</label>
              <select className="fs" id="moe_type">
                <option value="salaries">👤 Employee Salary</option>
                <option value="rent">🏠 Rent</option>
                <option value="petty">🪙 Petty Expense</option>
              </select>
            </div>
            <div className="fg"><label className="fl">Date</label><input className="fi" id="moe_date" type="date" /></div>
            <div className="fg"><label className="fl">Description *</label><input className="fi" id="moe_desc" placeholder="e.g. Ravi Teja salary April, Office rent…" /></div>
            <div className="fg"><label className="fl">Amount (₹) *</label><input className="fi" id="moe_amount" type="number" placeholder="0" /></div>
            <div className="fg"><label className="fl">Note (Optional)</label><input className="fi" id="moe_note" placeholder="Additional details…" /></div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_addofficeexpense')}>Cancel</button>
            <button className="btn btn-sky" onClick={() => saveOfficeExpense()}>💾 Save</button>
          </div>
        </div>
      </div>

      {/*  TOAST  */}
      {/* Procurement Detail Modal */}
      <div className="overlay" id="m_procurement_detail">
        <div className="modal">
          <div className="mh">
            <span className="mh-title">📦 Procurement Detail</span>
            <button className="mclose" onClick={() => closeM('m_procurement_detail')}>✕</button>
          </div>
          <div className="mb">
            <div className="dg">
              <div className="dg-item">
                <div className="dg-label">ID</div>
                <div className="dg-val mono" style={{color:'var(--sky)',fontWeight:'700'}} id="mpro_id"></div>
              </div>
              <div className="dg-item">
                <div className="dg-label">Client</div>
                <div className="dg-val" style={{fontWeight:'700'}} id="mpro_client"></div>
              </div>
              <div className="dg-item">
                <div className="dg-label">Site</div>
                <div className="dg-val" id="mpro_site"></div>
              </div>
              <div className="dg-item">
                <div className="dg-label">Type</div>
                <div className="dg-val" id="mpro_type"></div>
              </div>
              <div className="dg-item">
                <div className="dg-label">Logged At</div>
                <div className="dg-val" id="mpro_date"></div>
              </div>
              <div className="dg-item">
                <div className="dg-label">Log Date</div>
                <div className="dg-val" id="mpro_logdate"></div>
              </div>
              <div className="dg-item">
                <div className="dg-label">Status</div>
                <div className="dg-val" style={{fontWeight:'700'}} id="mpro_status"></div>
              </div>
            </div>
            <div style={{marginTop:'16px',padding:'12px',background:'var(--bg2)',borderRadius:'8px',border:'1px solid var(--border)'}}>
              <div style={{fontSize:'11px',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>📋 Requirements / Pending Items</div>
              <div style={{fontSize:'13px',color:'var(--text)',lineHeight:'1.6',whiteSpace:'pre-wrap'}} id="mpro_requirements"></div>
            </div>
          </div>
          <div className="mf">
            <button className="btn btn-ghost" onClick={() => closeM('m_procurement_detail')}>Close</button>
            <button className="btn btn-green" id="mpro_done_btn" style={{display:'none'}}>✅ Mark as Done</button>
          </div>
        </div>
      </div>

      <div id="toasts"></div>
    </>
  );
}
