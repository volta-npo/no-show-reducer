import { config } from './config.js';
import { domain } from './domain.js';
import { createSaasState, applySaasSample, calculateSaasMetrics, generateSaasArtifacts, buildSaasMarkdown, buildSaasCsv, buildSaasOperationsCsv, SAAS_STAGES } from './saas-core.js';

const key = `volta-oss:${config.slug}:saas`;
let state = load();
function $(selector) { return document.querySelector(selector); }
function esc(value = '') { return String(value).replace(/[&<>"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[char])); }
function load() { try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch {} return createSaasState(config, domain); }
function save() { state.updatedAt = new Date().toISOString(); localStorage.setItem(key, JSON.stringify(state)); }
function download(name, content, type = 'text/plain') { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); }
function card(label, value, detail) { return `<article><strong>${esc(value)}</strong><span>${esc(label)}</span><p>${esc(detail)}</p></article>`; }
function miniCard(label, item) { return `<article><strong>${esc(label)}</strong><p>${esc(item)}</p></article>`; }

function installSaas() {
  document.querySelector('.toolbar').insertAdjacentHTML('afterend', `
    <section class="saas-console panel" aria-label="SaaS operating console">
      <div class="saas-head">
        <div><p class="eyebrow">Standalone SaaS layer</p><h2>${esc(config.title)} Operating Console</h2><p class="muted">Customer pipeline, subscription tiers, onboarding command center, role permissions, integration health, success plans, support queue, governance log, experiments, and executive artifacts.</p></div>
        <div class="button-row no-print"><button id="saas-sample" class="secondary">Load SaaS Sample</button><button id="saas-md">Export SaaS Brief</button><button id="saas-csv" class="secondary">Export Accounts CSV</button><button id="saas-ops-csv" class="secondary">Export Ops CSV</button></div>
      </div>
      <div id="saas-metrics" class="saas-metrics"></div>
      <div class="saas-grid">
        <section><h3>Customer accounts</h3><div class="table-wrap"><table class="saas-table"><thead><tr><th>Account</th><th>Stage</th><th>Tier</th><th>Health</th><th>Adoption</th><th>Risk</th><th>Owner</th></tr></thead><tbody id="saas-accounts"></tbody></table></div></section>
        <section><h3>Executive artifacts</h3><div id="saas-artifacts" class="artifact-list"></div><h3>Next best actions</h3><ul id="saas-actions" class="warning-list"></ul></section>
      </div>
      <div class="saas-grid">
        <section><h3>Onboarding command center</h3><div id="saas-onboarding" class="saas-cards"></div></section>
        <section><h3>Role and permission matrix</h3><div id="saas-roles" class="saas-cards"></div></section>
      </div>
      <div class="saas-grid">
        <section><h3>Integration health</h3><div id="saas-integrations" class="saas-cards"></div></section>
        <section><h3>Success plans and KPIs</h3><div id="saas-success" class="saas-cards"></div></section>
      </div>
      <div class="saas-grid">
        <section><h3>Product-specific SaaS blueprint</h3><div id="saas-blueprint" class="saas-cards"></div></section>
        <section><h3>Implementation playbooks</h3><div id="saas-playbooks" class="saas-cards"></div></section>
      </div>
      <div class="saas-grid">
        <section><h3>Human-reviewed automations</h3><div id="saas-automations" class="saas-cards"></div></section>
        <section><h3>Support queue, audit log, and expansion motions</h3><div id="saas-governance" class="saas-cards"></div></section>
      </div>
    </section>`);
  $('#saas-sample').addEventListener('click', () => { if (!confirm('Load SaaS sample data? This overwrites the SaaS console workspace.')) return; state = applySaasSample(config, domain); save(); renderSaas(); });
  $('#saas-md').addEventListener('click', () => download(`${config.slug}-saas-brief.md`, buildSaasMarkdown(config, domain, state), 'text/markdown'));
  $('#saas-csv').addEventListener('click', () => download(`${config.slug}-accounts.csv`, buildSaasCsv(state), 'text/csv'));
  $('#saas-ops-csv').addEventListener('click', () => download(`${config.slug}-ops.csv`, buildSaasOperationsCsv(state), 'text/csv'));
  renderSaas();
}

function renderSaas() {
  const metrics = calculateSaasMetrics(config, domain, state);
  $('#saas-metrics').innerHTML = [
    ['Launch Score', `${metrics.launchScore}/100`, metrics.launchReady ? 'Ready to package as SaaS' : 'Needs operational evidence'],
    ['Modeled MRR', `$${metrics.totalMrr.toLocaleString()}`, 'Scenario planning, not billing data'],
    ['Activation', `${metrics.activationRate}%`, 'Accounts at validation or later'],
    ['Automation', `${metrics.automationCoverage}%`, 'Human-reviewed safety checks'],
    ['Onboarding', `${metrics.onboardingCompletion}%`, 'Completed launch milestones'],
    ['Governance', `${metrics.governanceScore}%`, 'Reviewed audit and rollback evidence'],
    ['Retention', `${metrics.retentionScore}/100`, 'Health, onboarding, and success-plan blend'],
    ['Expansion', `${metrics.expansionPotential}/100`, 'Packaged growth motion readiness']
  ].map(([label, value, detail]) => card(label, value, detail)).join('');
  $('#saas-accounts').innerHTML = (state.accounts || []).map((account) => accountRow(account)).join('');
  $('#saas-artifacts').innerHTML = generateSaasArtifacts(config, domain, state).map((artifact) => `<article class="artifact"><strong>${esc(artifact.title)}</strong><p>${esc(artifact.body)}</p></article>`).join('');
  $('#saas-actions').innerHTML = metrics.nextBestActions.map((action) => `<li>${esc(action)}</li>`).join('');
  $('#saas-onboarding').innerHTML = (state.onboarding || []).map((item) => miniCard(`${item.status}: ${item.name}`, `${item.stage} • ${item.owner}${item.blocker ? ` • Blocker: ${item.blocker}` : ''}`)).join('');
  $('#saas-roles').innerHTML = (state.roleMatrix || []).map((role) => miniCard(role.role, `${role.responsibility}. Permissions: ${(role.permissions || []).join('; ')}`)).join('');
  $('#saas-integrations').innerHTML = (state.integrationHealth || []).map((item) => miniCard(`${item.status}: ${item.name}`, `${item.owner} • ${item.dataModel} • ${item.risk} risk`)).join('');
  $('#saas-success').innerHTML = [...(state.successPlans || []).map((plan) => miniCard(plan.signal, `${plan.kpi}: ${plan.baseline} → ${plan.target} (${plan.cadence})`)), ...(state.kpiBoard || []).map((kpi) => miniCard(`KPI: ${kpi.name}`, `Current ${kpi.current}, target ${kpi.target}, trend ${kpi.trend}`))].join('');
  $('#saas-blueprint').innerHTML = [...(state.blueprint?.workflows || []).map((item) => ['Workflow', item]), ...(state.blueprint?.kpis || state.blueprint?.analytics || []).map((item) => ['KPI', item]), ...(state.blueprint?.guards || []).map((item) => ['Guard', item]), ...(state.blueprint?.expansion || []).map((item) => ['Expansion', item])].map(([label, item]) => miniCard(label, item)).join('');
  $('#saas-playbooks').innerHTML = (state.playbooks || []).map((playbook) => miniCard(playbook.name, `${playbook.status} • ${playbook.module} • ${playbook.automation} • gate: ${playbook.launchGate}`)).join('');
  $('#saas-automations').innerHTML = (state.automations || []).map((automation) => miniCard(automation.trigger, `${automation.enabled ? 'Enabled' : 'Draft'} • ${automation.action} • rollback: ${automation.rollback}`)).join('');
  $('#saas-governance').innerHTML = [...(state.supportQueue || []).map((ticket) => miniCard(`Support: ${ticket.title}`, `${ticket.status} • ${ticket.severity} • ${ticket.owner}`)), ...(state.auditLog || []).map((event) => miniCard(`Audit: ${event.event}`, `${event.status} • ${event.reviewer} • ${event.evidence || 'pending'}`)), ...(state.expansionMotions || []).map((motion) => miniCard(`Expansion: ${motion.name}`, `${motion.package} • ${motion.readiness}/100 • trigger ${motion.trigger}`))].join('');
}

function accountRow(account) {
  const options = SAAS_STAGES.map((stage) => `<option value="${stage}" ${account.stage === stage ? 'selected' : ''}>${stage}</option>`).join('');
  return `<tr data-id="${esc(account.id)}"><td><strong>${esc(account.name)}</strong><br><small>${esc(account.segment)}</small></td><td><select data-field="stage">${options}</select></td><td>${esc(account.tier)}</td><td><input data-field="health" type="number" min="0" max="100" value="${esc(account.health)}"></td><td><input data-field="adoption" type="number" min="0" max="100" value="${esc(account.adoption || 0)}"></td><td>${esc(account.risk)}</td><td>${esc(account.owner)}</td></tr>`;
}

function bindSaasRows() {
  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    const row = target.closest('tr[data-id]');
    if (!(row instanceof HTMLTableRowElement) || !target.dataset.field) return;
    const account = (state.accounts || []).find((item) => item.id === row.dataset.id);
    if (!account) return;
    account[target.dataset.field] = target.type === 'number' ? Number(target.value) : target.value;
    save();
    renderSaas();
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { installSaas(); bindSaasRows(); }); else { installSaas(); bindSaasRows(); }
