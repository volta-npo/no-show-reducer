import { createProductSaasBlueprint } from './saas-blueprint.js';

export const SAAS_STAGES = ['discover', 'onboard', 'configure', 'validate', 'launch', 'expand'];
export const SAAS_STAGE_WEIGHTS = Object.freeze({ discover: 0.18, onboard: 0.38, configure: 0.58, validate: 0.78, launch: 0.92, expand: 1 });
export const SAAS_TIERS = Object.freeze({ starter: 1200, growth: 3200, scale: 6400 });

const pct = (value, total) => Math.round((value / Math.max(1, total)) * 100);
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
const stageIndex = (stage) => Math.max(0, SAAS_STAGES.indexOf(stage));
const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export function createSaasState(config, domain, now = new Date().toISOString()) {
  const modules = config.modules || [];
  const rows = domain.rows || [];
  const blueprint = createProductSaasBlueprint(config, domain);
  return {
    version: 'saas-1.0',
    createdAt: now,
    updatedAt: now,
    northStar: config.metric,
    accounts: [
      {
        id: 'acct-1',
        name: domain.sampleClient || config.sample?.clientName || 'Pilot customer',
        segment: 'Launch partner',
        tier: 'growth',
        stage: 'configure',
        health: 72,
        seats: 4,
        owner: blueprint.roles[0] || 'Customer success lead',
        renewalDate: '2026-06-30',
        risk: 'medium',
        notes: `Primary pilot for ${config.title}.`
      },
      {
        id: 'acct-2',
        name: `${config.title} Community Cohort`,
        segment: 'Nonprofit cohort',
        tier: 'starter',
        stage: 'onboard',
        health: 58,
        seats: 12,
        owner: blueprint.roles[1] || 'Implementation pod',
        renewalDate: '2026-07-15',
        risk: 'medium',
        notes: 'Grouped onboarding with templated owner handoff.'
      },
      {
        id: 'acct-3',
        name: `${config.title} Scale Partner`,
        segment: 'Multi-site operator',
        tier: 'scale',
        stage: 'validate',
        health: 84,
        seats: 8,
        owner: blueprint.roles[2] || 'Mentor reviewer',
        renewalDate: '2026-08-01',
        risk: 'low',
        notes: 'Advanced use case for repeatable delivery and certification.'
      }
    ],
    playbooks: rows.map((row, index) => ({
      id: `playbook-${index + 1}`,
      name: row,
      module: modules[index % Math.max(1, modules.length)] || domain.title,
      status: index < 2 ? 'live' : index < 5 ? 'ready' : 'draft',
      automation: blueprint.workflows[index % Math.max(1, blueprint.workflows.length)] || domain.checks[index % Math.max(1, domain.checks.length)] || 'Owner review required',
      evidence: index < 4 ? `${row} has pilot evidence` : '',
      owner: index % 2 === 0 ? 'Ops lead' : 'Mentor reviewer',
      impact: 70 + (index % 4) * 7,
      effort: 2 + (index % 3)
    })),
    automations: blueprint.guards.map((check, index) => ({
      id: `automation-${index + 1}`,
      trigger: `${check} trigger`,
      action: `${blueprint.integrations[index % Math.max(1, blueprint.integrations.length)]}: ${check.toLowerCase()}`,
      metric: blueprint.analytics[index % Math.max(1, blueprint.analytics.length)],
      enabled: index < 2,
      humanReview: true,
      risk: index === 0 ? 'high' : 'medium',
      lastRun: index < 2 ? '2026-03-01' : ''
    })),
    plans: (domain.artifacts || []).map((artifact, index) => ({
      id: `plan-${index + 1}`,
      name: `${artifact} workspace`,
      tier: index === 0 ? 'starter' : index === 1 ? 'growth' : 'scale',
      value: Object.values(SAAS_TIERS)[index] || 2400,
      included: rows.slice(0, Math.min(rows.length, 4 + index * 2))
    })),
    blueprint,
    experiments: [
      { id: 'exp-1', name: blueprint.workflows[0] || 'Owner activation checklist', hypothesis: `If owners complete ${modules[0] || 'the first module'}, activation improves.`, status: 'running', target: 80 },
      { id: 'exp-2', name: blueprint.analytics[0] || 'Evidence-first onboarding', hypothesis: 'Earlier evidence capture improves certification quality.', status: 'queued', target: 90 }
    ]
  };
}

export function calculateSaasMetrics(config, domain, state) {
  const accounts = state.accounts || [];
  const playbooks = state.playbooks || [];
  const automations = state.automations || [];
  const totalMrr = accounts.reduce((sum, account) => sum + (SAAS_TIERS[account.tier] || 0), 0);
  const avgHealth = clamp(accounts.reduce((sum, account) => sum + Number(account.health || 0), 0) / Math.max(1, accounts.length));
  const activated = accounts.filter((account) => stageIndex(account.stage) >= stageIndex('validate')).length;
  const automationCoverage = pct(automations.filter((automation) => automation.enabled && automation.humanReview).length, Math.max(1, domain.checks?.length || automations.length));
  const playbookReadiness = pct(playbooks.filter((playbook) => ['ready', 'live'].includes(playbook.status) && String(playbook.evidence || '').trim()).length, playbooks.length);
  const riskPenalty = accounts.filter((account) => account.risk === 'high').length * 14 + automations.filter((automation) => automation.risk === 'high' && !automation.humanReview).length * 20;
  const launchScore = clamp(avgHealth * 0.25 + pct(activated, accounts.length) * 0.25 + automationCoverage * 0.25 + playbookReadiness * 0.25 - riskPenalty);
  const stageSummary = SAAS_STAGES.map((stage) => ({ stage, count: accounts.filter((account) => account.stage === stage).length }));
  const nextBestActions = [];
  if (playbookReadiness < 90) nextBestActions.push('Attach evidence to every ready/live playbook before scaling.');
  if (automationCoverage < 80) nextBestActions.push('Enable human-reviewed automations for each domain safety check.');
  if (avgHealth < 75) nextBestActions.push('Prioritize customer success outreach for medium/high-risk accounts.');
  if (!nextBestActions.length) nextBestActions.push('Package this workspace as a repeatable SaaS onboarding motion.');
  return { totalMrr, avgHealth, activationRate: pct(activated, accounts.length), automationCoverage, playbookReadiness, launchScore, stageSummary, nextBestActions, launchReady: launchScore >= 85 };
}

export function validateSaasState(config, domain, state) {
  if (!state || typeof state !== 'object') throw new Error('saas state must be an object');
  if (!Array.isArray(state.accounts) || state.accounts.length < 3) throw new Error('saas state needs at least three accounts');
  if (!Array.isArray(state.playbooks) || state.playbooks.length < (domain.rows || []).length) throw new Error('saas playbooks must cover every domain row');
  if (!Array.isArray(state.automations) || state.automations.length < (state.blueprint?.guards || domain.checks || []).length) throw new Error('saas automations must cover every product guard');
  calculateSaasMetrics(config, domain, state);
  return true;
}

export function generateSaasArtifacts(config, domain, state) {
  const metrics = calculateSaasMetrics(config, domain, state);
  return [
    {
      title: 'SaaS operating model',
      body: `${config.title} runs as a local-first SaaS workbench with ${state.accounts.length} customer accounts, ${state.playbooks.length} playbooks, and ${state.automations.length} human-reviewed automations.`
    },
    {
      title: 'Customer success brief',
      body: `Average health is ${metrics.avgHealth}/100 with ${metrics.activationRate}% of accounts at validation or later. Next action: ${metrics.nextBestActions[0]}`
    },
    {
      title: 'Revenue and impact model',
      body: `Modeled MRR is $${metrics.totalMrr.toLocaleString()} while the product tracks ${config.metric}. Plans map to ${domain.artifacts.join(', ')}.`
    },
    {
      title: 'Automation governance packet',
      body: `${metrics.automationCoverage}% automation coverage. Every automation keeps a human-review gate and maps to product guards: ${(state.blueprint?.guards || domain.checks).join('; ')}.`
    }
  ];
}

export function buildSaasMarkdown(config, domain, state) {
  validateSaasState(config, domain, state);
  const metrics = calculateSaasMetrics(config, domain, state);
  const lines = [`# ${config.title} SaaS Operating Console`, '', `**North-star metric:** ${config.metric}`, `**Launch score:** ${metrics.launchScore}/100`, `**Modeled MRR:** $${metrics.totalMrr.toLocaleString()}`, `**Launch ready:** ${metrics.launchReady ? 'Yes' : 'No'}`, '', '## SaaS Metrics'];
  lines.push(`- Account health: ${metrics.avgHealth}/100`);
  lines.push(`- Activation rate: ${metrics.activationRate}%`);
  lines.push(`- Playbook readiness: ${metrics.playbookReadiness}%`);
  lines.push(`- Automation coverage: ${metrics.automationCoverage}%`);
  lines.push('', '## Accounts');
  (state.accounts || []).forEach((account) => lines.push(`- **${account.name}** — ${titleCase(account.stage)}, ${account.tier}, health ${account.health}/100, owner ${account.owner}`));
  lines.push('', '## Playbooks');
  (state.playbooks || []).forEach((playbook) => lines.push(`- **${playbook.name}** — ${playbook.status}, module ${playbook.module}, automation: ${playbook.automation}`));
  lines.push('', '## Product Blueprint');
  (state.blueprint?.workflows || []).forEach((workflow) => lines.push(`- Workflow: ${workflow}`));
  (state.blueprint?.analytics || []).forEach((metric) => lines.push(`- Metric: ${metric}`));
  lines.push('', '## Automations');
  (state.automations || []).forEach((automation) => lines.push(`- **${automation.trigger}** → ${automation.action} (${automation.enabled ? 'enabled' : 'draft'}, ${automation.risk} risk, human review ${automation.humanReview ? 'on' : 'off'})`));
  lines.push('', '## Generated SaaS Artifacts');
  generateSaasArtifacts(config, domain, state).forEach((artifact) => lines.push(`- **${artifact.title}:** ${artifact.body}`));
  lines.push('', '## Next Best Actions');
  metrics.nextBestActions.forEach((action) => lines.push(`- ${action}`));
  return lines.join('\n');
}

export function buildSaasCsv(state) {
  const header = ['id', 'name', 'segment', 'tier', 'stage', 'health', 'seats', 'owner', 'renewalDate', 'risk', 'notes'];
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [header.join(','), ...(state.accounts || []).map((account) => header.map((key) => escape(account[key])).join(','))].join('\n');
}

export function applySaasSample(config, domain) {
  const state = createSaasState(config, domain, '2026-01-01T00:00:00.000Z');
  state.accounts = state.accounts.map((account, index) => ({
    ...account,
    stage: index === 0 ? 'launch' : index === 1 ? 'validate' : 'expand',
    health: 88 + index * 3,
    risk: index === 0 ? 'medium' : 'low',
    notes: `${account.name} has completed SaaS onboarding, evidence review, and owner handoff.`
  }));
  state.playbooks = state.playbooks.map((playbook, index) => ({
    ...playbook,
    status: index < 6 ? 'live' : 'ready',
    evidence: `Verified SaaS evidence for ${playbook.name}`,
    impact: 85 + (index % 3) * 5
  }));
  state.automations = state.automations.map((automation) => ({ ...automation, enabled: true, humanReview: true, lastRun: '2026-03-15' }));
  state.experiments = state.experiments.map((experiment) => ({ ...experiment, status: 'validated' }));
  return state;
}
