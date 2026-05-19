import { config } from './config.js';
import { domain } from './domain.js';
import { createSaasState, applySaasSample, calculateSaasMetrics, generateSaasArtifacts, buildSaasMarkdown, buildSaasCsv, SAAS_STAGES } from './saas-core.js';

const key = `volta-oss:${config.slug}:saas`;
let state = load();
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return [...document.querySelectorAll(selector)]; }
function esc(value = '') { return String(value).replace(/[&<>"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[char])); }
function load() { try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch {} return createSaasState(config, domain); }
function save() { state.updatedAt = new Date().toISOString(); localStorage.setItem(key, JSON.stringify(state)); }
function download(name, content, type = 'text/plain') { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); }

function installSaas() {
  document.querySelector('.toolbar').insertAdjacentHTML('afterend', `
    <section class="saas-console panel" aria-label="SaaS operating console">
      <div class="saas-head">
        <div><p class="eyebrow">Standalone SaaS layer</p><h2>${esc(config.title)} Operating Console</h2><p class="muted">Customer pipeline, subscription tiers, implementation playbooks, human-reviewed automations, experiments, and executive artifacts.</p></div>
        <div class="button-row no-print"><button id="saas-sample" class="secondary">Load SaaS Sample</button><button id="saas-md">Export SaaS Brief</button><button id="saas-csv" class="secondary">Export Accounts CSV</button></div>
      </div>
      <div id="saas-metrics" class="saas-metrics"></div>
      <div class="saas-grid">
        <section><h3>Customer accounts</h3><div class="table-wrap"><table class="saas-table"><thead><tr><th>Account</th><th>Stage</th><th>Tier</th><th>Health</th><th>Risk</th><th>Owner</th></tr></thead><tbody id="saas-accounts"></tbody></table></div></section>
        <section><h3>Executive artifacts</h3><div id="saas-artifacts" class="artifact-list"></div><h3>Next best actions</h3><ul id="saas-actions" class="warning-list"></ul></section>
      </div>
      <div class="saas-grid">
        <section><h3>Product-specific SaaS blueprint</h3><div id="saas-blueprint" class="saas-cards"></div></section>
        <section><h3>Implementation playbooks</h3><div id="saas-playbooks" class="saas-cards"></div></section>
      </div>
      <div class="saas-grid">
        <section><h3>Human-reviewed automations</h3><div id="saas-automations" class="saas-cards"></div></section>
      </div>
    </section>`);
  $('#saas-sample').addEventListener('click', () => { if (!confirm('Load SaaS sample data? This overwrites the SaaS console workspace.')) return; state = applySaasSample(config, domain); save(); renderSaas(); });
  $('#saas-md').addEventListener('click', () => download(`${config.slug}-saas-brief.md`, buildSaasMarkdown(config, domain, state), 'text/markdown'));
  $('#saas-csv').addEventListener('click', () => download(`${config.slug}-accounts.csv`, buildSaasCsv(state), 'text/csv'));
  renderSaas();
}

function renderSaas() {
  const metrics = calculateSaasMetrics(config, domain, state);
  $('#saas-metrics').innerHTML = [
    ['Launch Score', `${metrics.launchScore}/100`, metrics.launchReady ? 'Ready to package as SaaS' : 'Needs operational evidence'],
    ['Modeled MRR', `$${metrics.totalMrr.toLocaleString()}`, 'Scenario planning, not billing data'],
    ['Activation', `${metrics.activationRate}%`, 'Accounts at validation or later'],
    ['Automation Coverage', `${metrics.automationCoverage}%`, 'Human-reviewed safety checks']
  ].map(([label, value, detail]) => `<article><strong>${esc(value)}</strong><span>${esc(label)}</span><p>${esc(detail)}</p></article>`).join('');
  $('#saas-accounts').innerHTML = (state.accounts || []).map((account) => accountRow(account)).join('');
  $('#saas-artifacts').innerHTML = generateSaasArtifacts(config, domain, state).map((artifact) => `<article class="artifact"><strong>${esc(artifact.title)}</strong><p>${esc(artifact.body)}</p></article>`).join('');
  $('#saas-actions').innerHTML = metrics.nextBestActions.map((action) => `<li>${esc(action)}</li>`).join('');
  $('#saas-blueprint').innerHTML = [...(state.blueprint?.workflows || []).map((item) => ['Workflow', item]), ...(state.blueprint?.analytics || []).map((item) => ['Metric', item]), ...(state.blueprint?.guards || []).map((item) => ['Guard', item])].map(([label, item]) => `<article><strong>${esc(label)}</strong><p>${esc(item)}</p></article>`).join('');
  $('#saas-playbooks').innerHTML = (state.playbooks || []).map((playbook) => `<article><strong>${esc(playbook.name)}</strong><span>${esc(playbook.status)} · ${esc(playbook.module)}</span><p>${esc(playbook.automation)}</p><label>Status<select data-saas-playbook="${esc(playbook.id)}">${['draft','ready','live'].map((status) => `<option value="${status}" ${playbook.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></label></article>`).join('');
  $('#saas-automations').innerHTML = (state.automations || []).map((automation) => `<article><strong>${esc(automation.trigger)}</strong><span>${automation.enabled ? 'Enabled' : 'Draft'} · ${esc(automation.risk)} risk</span><p>${esc(automation.action)}</p><label><input data-saas-automation="${esc(automation.id)}" type="checkbox" ${automation.enabled ? 'checked' : ''} /> Enable with human review</label></article>`).join('');
  bindSaasRows();
}

function accountRow(account) {
  return `<tr><td><strong>${esc(account.name)}</strong><br><span class="muted">${esc(account.segment)}</span></td><td><select data-saas-account="stage" data-id="${esc(account.id)}">${SAAS_STAGES.map((stage) => `<option value="${stage}" ${account.stage === stage ? 'selected' : ''}>${stage}</option>`).join('')}</select></td><td><select data-saas-account="tier" data-id="${esc(account.id)}">${['starter','growth','scale'].map((tier) => `<option value="${tier}" ${account.tier === tier ? 'selected' : ''}>${tier}</option>`).join('')}</select></td><td><input data-saas-account="health" data-id="${esc(account.id)}" type="number" min="0" max="100" value="${esc(account.health)}" /></td><td><select data-saas-account="risk" data-id="${esc(account.id)}">${['low','medium','high'].map((risk) => `<option value="${risk}" ${account.risk === risk ? 'selected' : ''}>${risk}</option>`).join('')}</select></td><td><input data-saas-account="owner" data-id="${esc(account.id)}" value="${esc(account.owner)}" /></td></tr>`;
}

function bindSaasRows() {
  $$('[data-saas-account]').forEach((input) => input.addEventListener('input', (event) => { const account = state.accounts.find((item) => item.id === event.target.dataset.id); if (!account) return; const field = event.target.dataset.saasAccount; account[field] = field === 'health' ? Number(event.target.value) : event.target.value; save(); renderSaas(); }));
  $$('[data-saas-playbook]').forEach((input) => input.addEventListener('change', (event) => { const playbook = state.playbooks.find((item) => item.id === event.target.dataset.saasPlaybook); if (!playbook) return; playbook.status = event.target.value; save(); renderSaas(); }));
  $$('[data-saas-automation]').forEach((input) => input.addEventListener('change', (event) => { const automation = state.automations.find((item) => item.id === event.target.dataset.saasAutomation); if (!automation) return; automation.enabled = event.target.checked; automation.humanReview = true; save(); renderSaas(); }));
}

installSaas();
