import { createProductSaasBlueprint } from './saas-blueprint.js';
export const SAAS_STAGES = ['discover', 'onboard', 'configure', 'validate', 'launch', 'expand'];
export const SAAS_STAGE_WEIGHTS = Object.freeze({ discover: 0.18, onboard: 0.38, configure: 0.58, validate: 0.78, launch: 0.92, expand: 1 });
export const SAAS_TIERS = Object.freeze({ starter: 1200, growth: 3200, scale: 6400, enterprise: 9800 });
export const SAAS_PLAN_LIMITS = Object.freeze({ starter: 3, growth: 8, scale: 20, enterprise: 50 });
const pct = (value, total) => Math.round((value / Math.max(1, total)) * 100);
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
const stageIndex = (stage) => Math.max(0, SAAS_STAGES.indexOf(stage));
const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
const list = (items, fallback) => Array.isArray(items) && items.length ? items : fallback;
const cycle = (items, index, fallback = 'Owner review required') => list(items, [fallback])[index % Math.max(1, list(items, [fallback]).length)];
function createAccountBlueprint(config, domain, blueprint) {
    const personas = list(blueprint.personas, blueprint.roles || ['Customer success lead']);
    return [
        {
            id: 'acct-1',
            name: domain.sampleClient || config.sample?.clientName || 'Pilot customer',
            segment: 'Launch partner',
            tier: 'growth',
            stage: 'configure',
            health: 72,
            seats: 4,
            owner: personas[0],
            renewalDate: '2026-06-30',
            risk: 'medium',
            adoption: 68,
            expansionFit: 76,
            lastTouch: '2026-03-01',
            goals: [blueprint.successSignals?.[0] || config.metric, blueprint.kpis?.[0] || config.metric],
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
            owner: personas[1] || personas[0],
            renewalDate: '2026-07-15',
            risk: 'medium',
            adoption: 52,
            expansionFit: 61,
            lastTouch: '2026-02-20',
            goals: [blueprint.onboarding?.[0] || 'Complete onboarding', blueprint.successSignals?.[1] || 'Owner approval'],
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
            owner: personas[2] || personas[0],
            renewalDate: '2026-08-01',
            risk: 'low',
            adoption: 81,
            expansionFit: 88,
            lastTouch: '2026-03-03',
            goals: [blueprint.expansion?.[0] || 'Scale repeatable delivery', blueprint.successSignals?.[2] || 'Evidence complete'],
            notes: 'Advanced use case for repeatable delivery and certification.'
        },
        {
            id: 'acct-4',
            name: `${config.sample?.chapter || 'Volta'} Training Tenant`,
            segment: 'Training workspace',
            tier: 'enterprise',
            stage: 'discover',
            health: 46,
            seats: 20,
            owner: personas[3] || personas[0],
            renewalDate: '2026-09-01',
            risk: 'high',
            adoption: 34,
            expansionFit: 70,
            lastTouch: '2026-02-10',
            goals: [blueprint.onboarding?.[1] || 'Prepare training workflow', blueprint.guards?.[0] || 'Resolve safety guard'],
            notes: 'Internal enablement tenant for onboarding playbook hardening.'
        }
    ];
}
function createOnboarding(blueprint) {
    return list(blueprint.onboarding, blueprint.workflows || []).map((name, index) => ({
        id: `onboarding-${index + 1}`,
        name,
        stage: SAAS_STAGES[Math.min(index, SAAS_STAGES.length - 1)],
        owner: cycle(blueprint.roles, index, 'Implementation lead'),
        status: index < 2 ? 'done' : index < 4 ? 'active' : 'blocked',
        evidence: index < 3 ? `${name} evidence captured` : '',
        blocker: index >= 4 ? cycle(blueprint.guards, index, 'Owner review required') : '',
        dueInDays: 3 + index * 2
    }));
}
function createRoleMatrix(blueprint) {
    const roles = list(blueprint.personas, blueprint.roles || []);
    return roles.map((role, index) => ({
        role,
        permissions: [cycle(blueprint.workflows, index), cycle(blueprint.artifacts, index, 'Export artifact')],
        responsibility: cycle(blueprint.successSignals, index, 'Approve release evidence'),
        approvalRequired: index < 4
    }));
}
function createIntegrationHealth(blueprint) {
    return list(blueprint.integrations, ['CSV export']).map((name, index) => ({
        id: `integration-${index + 1}`,
        name,
        status: index < 2 ? 'verified' : index < 4 ? 'configured' : 'planned',
        owner: cycle(blueprint.roles, index, 'Ops lead'),
        dataModel: cycle(blueprint.dataModel, index, 'Workspace record'),
        lastVerified: index < 2 ? '2026-03-10' : '',
        risk: index === 0 ? 'low' : 'medium'
    }));
}
function createSuccessPlans(blueprint) {
    return list(blueprint.successSignals, blueprint.kpis || []).map((signal, index) => ({
        id: `success-${index + 1}`,
        signal,
        kpi: cycle(blueprint.kpis, index),
        baseline: 45 + index * 4,
        target: 80 + (index % 3) * 5,
        cadence: index % 2 === 0 ? 'weekly' : 'monthly',
        owner: cycle(blueprint.roles, index, 'Customer success lead')
    }));
}
function createSupportQueue(blueprint) {
    return list(blueprint.guards, ['Owner review required']).map((guard, index) => ({
        id: `support-${index + 1}`,
        title: guard,
        severity: index === 0 ? 'high' : 'medium',
        status: index === 0 ? 'open' : index === 1 ? 'triaged' : 'watching',
        playbook: cycle(blueprint.workflows, index),
        owner: cycle(blueprint.roles, index, 'Support lead'),
        slaHours: 24 + index * 12
    }));
}
function createAuditLog(blueprint) {
    return list(blueprint.guards, ['Human review']).map((guard, index) => ({
        id: `audit-${index + 1}`,
        event: guard,
        reviewer: cycle(blueprint.roles, index + 1, 'Mentor reviewer'),
        status: index < 2 ? 'reviewed' : 'pending',
        evidence: index < 2 ? `${guard} review note` : '',
        date: `2026-03-${String(index + 1).padStart(2, '0')}`
    }));
}
function createExpansionMotions(blueprint) {
    return list(blueprint.expansion, ['Annual renewal review']).map((motion, index) => ({
        id: `motion-${index + 1}`,
        name: motion,
        trigger: cycle(blueprint.kpis, index, 'Customer health'),
        package: index === 0 ? 'growth' : index === 1 ? 'scale' : 'enterprise',
        readiness: 62 + index * 8,
        owner: cycle(blueprint.roles, index, 'Growth lead')
    }));
}
function createKpiBoard(config, blueprint) {
    return list(blueprint.kpis, [config.metric]).map((name, index) => ({
        id: `kpi-${index + 1}`,
        name,
        current: 52 + index * 6,
        target: 85,
        trend: index % 2 === 0 ? 'up' : 'steady',
        source: cycle(blueprint.integrations, index, 'Manual evidence')
    }));
}
export function createSaasState(config, domain, now = new Date().toISOString()) {
    const modules = config.modules || [];
    const rows = domain.rows || [];
    const blueprint = createProductSaasBlueprint(config, domain);
    return {
        version: 'saas-2.0',
        createdAt: now,
        updatedAt: now,
        northStar: config.metric,
        tenancy: {
            mode: 'local-first multi-tenant simulation',
            dataResidency: 'browser localStorage until explicit export',
            tenantFields: list(blueprint.dataModel, domain.rows || []).slice(0, 8),
            planLimits: SAAS_PLAN_LIMITS,
            privacyBoundary: config.theme?.privacy || 'No hosted persistence is required.'
        },
        accounts: createAccountBlueprint(config, domain, blueprint),
        onboarding: createOnboarding(blueprint),
        roleMatrix: createRoleMatrix(blueprint),
        integrationHealth: createIntegrationHealth(blueprint),
        successPlans: createSuccessPlans(blueprint),
        supportQueue: createSupportQueue(blueprint),
        auditLog: createAuditLog(blueprint),
        expansionMotions: createExpansionMotions(blueprint),
        kpiBoard: createKpiBoard(config, blueprint),
        playbooks: rows.map((row, index) => ({
            id: `playbook-${index + 1}`,
            name: row,
            module: modules[index % Math.max(1, modules.length)] || domain.title,
            status: index < 2 ? 'live' : index < 5 ? 'ready' : 'draft',
            automation: cycle(blueprint.workflows, index),
            evidence: index < 4 ? `${row} has pilot evidence` : '',
            owner: cycle(blueprint.roles, index, 'Mentor reviewer'),
            impact: 70 + (index % 4) * 7,
            effort: 2 + (index % 3),
            tier: index < 2 ? 'starter' : index < 5 ? 'growth' : 'scale',
            customerTouchpoint: cycle(blueprint.personas, index, 'Customer owner'),
            launchGate: cycle(blueprint.guards, index, 'Owner approval')
        })),
        automations: list(blueprint.guards, domain.checks || []).map((check, index) => ({
            id: `automation-${index + 1}`,
            trigger: `${check} trigger`,
            action: `${cycle(blueprint.integrations, index)}: ${check.toLowerCase()}`,
            metric: cycle(blueprint.kpis || blueprint.analytics, index, config.metric),
            enabled: index < 2,
            humanReview: true,
            risk: index === 0 ? 'high' : 'medium',
            lastRun: index < 2 ? '2026-03-01' : '',
            auditEvent: cycle(blueprint.guards, index),
            rollback: `${cycle(blueprint.roles, index, 'Owner')} reviews and pauses workflow`
        })),
        plans: (domain.artifacts || []).map((artifact, index) => ({
            id: `plan-${index + 1}`,
            name: `${artifact} workspace`,
            tier: index === 0 ? 'starter' : index === 1 ? 'growth' : 'scale',
            value: Object.values(SAAS_TIERS)[index] || 2400,
            included: rows.slice(0, Math.min(rows.length, 4 + index * 2)),
            entitlements: list(blueprint.workflows, rows).slice(0, 3 + index),
            upgradeTrigger: cycle(blueprint.expansion, index, 'Need more seats or exports')
        })),
        blueprint,
        experiments: [
            { id: 'exp-1', name: cycle(blueprint.workflows, 0, 'Owner activation checklist'), hypothesis: `If owners complete ${modules[0] || 'the first module'}, activation improves.`, status: 'running', target: 80, result: 'pending' },
            { id: 'exp-2', name: cycle(blueprint.kpis, 0, 'Evidence-first onboarding'), hypothesis: 'Earlier evidence capture improves certification quality.', status: 'queued', target: 90, result: 'pending' },
            { id: 'exp-3', name: cycle(blueprint.expansion, 0, 'Expansion readiness'), hypothesis: 'A packaged success plan increases renewal and expansion readiness.', status: 'draft', target: 75, result: 'pending' }
        ]
    };
}
export function calculateSaasMetrics(config, domain, state) {
    const accounts = state.accounts || [];
    const playbooks = state.playbooks || [];
    const automations = state.automations || [];
    const onboarding = state.onboarding || [];
    const integrations = state.integrationHealth || [];
    const successPlans = state.successPlans || [];
    const supportQueue = state.supportQueue || [];
    const auditLog = state.auditLog || [];
    const totalMrr = accounts.reduce((sum, account) => sum + (SAAS_TIERS[account.tier] || 0), 0);
    const avgHealth = clamp(accounts.reduce((sum, account) => sum + Number(account.health || 0), 0) / Math.max(1, accounts.length));
    const activated = accounts.filter((account) => stageIndex(account.stage) >= stageIndex('validate')).length;
    const automationCoverage = pct(automations.filter((automation) => automation.enabled && automation.humanReview).length, Math.max(1, domain.checks?.length || automations.length));
    const playbookReadiness = pct(playbooks.filter((playbook) => ['ready', 'live'].includes(playbook.status) && String(playbook.evidence || '').trim()).length, playbooks.length);
    const onboardingCompletion = pct(onboarding.filter((item) => item.status === 'done').length, onboarding.length);
    const integrationReadiness = pct(integrations.filter((item) => ['verified', 'configured'].includes(item.status)).length, integrations.length);
    const successPlanCoverage = pct(successPlans.filter((plan) => plan.target >= 80 && plan.owner).length, successPlans.length);
    const governanceScore = pct(auditLog.filter((event) => event.status === 'reviewed' && event.evidence).length + automations.filter((automation) => automation.humanReview && automation.rollback).length, auditLog.length + automations.length);
    const retentionScore = clamp(avgHealth * 0.35 + onboardingCompletion * 0.2 + playbookReadiness * 0.2 + integrationReadiness * 0.15 + successPlanCoverage * 0.1 - supportQueue.filter((ticket) => ticket.severity === 'high' && ticket.status === 'open').length * 6);
    const expansionPotential = clamp(accounts.reduce((sum, account) => sum + Number(account.expansionFit || 0), 0) / Math.max(1, accounts.length));
    const riskPenalty = accounts.filter((account) => account.risk === 'high').length * 10 + supportQueue.filter((ticket) => ticket.severity === 'high' && ticket.status === 'open').length * 8 + automations.filter((automation) => automation.risk === 'high' && !automation.humanReview).length * 20;
    const launchScore = clamp(avgHealth * 0.15 + pct(activated, accounts.length) * 0.15 + automationCoverage * 0.15 + playbookReadiness * 0.15 + onboardingCompletion * 0.14 + integrationReadiness * 0.12 + governanceScore * 0.14 - riskPenalty);
    const stageSummary = SAAS_STAGES.map((stage) => ({ stage, count: accounts.filter((account) => account.stage === stage).length }));
    const nextBestActions = [];
    if (playbookReadiness < 90)
        nextBestActions.push('Attach evidence to every ready/live playbook before scaling.');
    if (automationCoverage < 80)
        nextBestActions.push('Enable human-reviewed automations for each domain safety check.');
    if (onboardingCompletion < 75)
        nextBestActions.push('Finish onboarding milestones and clear blocked launch gates.');
    if (integrationReadiness < 80)
        nextBestActions.push('Verify every planned integration before promoting the workspace.');
    if (governanceScore < 85)
        nextBestActions.push('Review audit-log evidence and rollback owners for governance readiness.');
    if (retentionScore < 80)
        nextBestActions.push('Prioritize customer success outreach for medium/high-risk accounts.');
    if (!nextBestActions.length)
        nextBestActions.push('Package this workspace as a repeatable SaaS onboarding and expansion motion.');
    return { totalMrr, avgHealth, activationRate: pct(activated, accounts.length), automationCoverage, playbookReadiness, onboardingCompletion, integrationReadiness, successPlanCoverage, governanceScore, retentionScore, expansionPotential, launchScore, stageSummary, nextBestActions, launchReady: launchScore >= 85 && governanceScore >= 85 };
}
export function validateSaasState(config, domain, state) {
    if (!state || typeof state !== 'object')
        throw new Error('saas state must be an object');
    if (!Array.isArray(state.accounts) || state.accounts.length < 4)
        throw new Error('saas state needs at least four accounts');
    if (!Array.isArray(state.playbooks) || state.playbooks.length < (domain.rows || []).length)
        throw new Error('saas playbooks must cover every domain row');
    if (!Array.isArray(state.automations) || state.automations.length < (state.blueprint?.guards || domain.checks || []).length)
        throw new Error('saas automations must cover every product guard');
    if (!Array.isArray(state.onboarding) || state.onboarding.length < 5)
        throw new Error('saas onboarding must cover the customer launch path');
    if (!Array.isArray(state.roleMatrix) || state.roleMatrix.length < 4)
        throw new Error('saas role matrix must cover operating personas');
    if (!Array.isArray(state.integrationHealth) || state.integrationHealth.length < 4)
        throw new Error('saas integrations must be tracked');
    if (!Array.isArray(state.successPlans) || state.successPlans.length < 4)
        throw new Error('saas success plans must be tracked');
    if (!Array.isArray(state.auditLog) || state.auditLog.length < 3)
        throw new Error('saas audit log must track governance events');
    calculateSaasMetrics(config, domain, state);
    return true;
}
export function generateSaasArtifacts(config, domain, state) {
    const metrics = calculateSaasMetrics(config, domain, state);
    return [
        { title: 'SaaS operating model', body: `${config.title} runs as a local-first SaaS workbench with ${state.accounts.length} customer accounts, ${state.playbooks.length} playbooks, ${state.onboarding.length} onboarding milestones, and ${state.automations.length} human-reviewed automations.` },
        { title: 'Customer success brief', body: `Average health is ${metrics.avgHealth}/100 with ${metrics.activationRate}% of accounts at validation or later. Retention score is ${metrics.retentionScore}/100.` },
        { title: 'Revenue and impact model', body: `Modeled MRR is $${metrics.totalMrr.toLocaleString()} while the product tracks ${config.metric}. Plans map to ${domain.artifacts.join(', ')}.` },
        { title: 'Automation governance packet', body: `${metrics.automationCoverage}% automation coverage and ${metrics.governanceScore}% governance readiness. Every automation keeps a rollback owner and human-review gate.` },
        { title: 'Tenant data model', body: `Tenant fields include ${state.tenancy.tenantFields.join(', ')} with a ${state.tenancy.mode} boundary.` },
        { title: 'Onboarding command center', body: `${metrics.onboardingCompletion}% onboarding completion across ${state.onboarding.length} milestones and ${state.supportQueue.length} support/escalation items.` },
        { title: 'Integration readiness pack', body: `${metrics.integrationReadiness}% of integrations are verified or configured: ${state.integrationHealth.map((item) => item.name).join(', ')}.` },
        { title: 'Expansion motion brief', body: `${metrics.expansionPotential}/100 expansion potential across ${state.expansionMotions.length} packaged motions.` }
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
    lines.push(`- Onboarding completion: ${metrics.onboardingCompletion}%`);
    lines.push(`- Integration readiness: ${metrics.integrationReadiness}%`);
    lines.push(`- Success-plan coverage: ${metrics.successPlanCoverage}%`);
    lines.push(`- Governance score: ${metrics.governanceScore}%`);
    lines.push(`- Retention score: ${metrics.retentionScore}/100`);
    lines.push(`- Expansion potential: ${metrics.expansionPotential}/100`);
    lines.push('', '## Tenant Operating System');
    lines.push(`- Mode: ${state.tenancy.mode}`);
    lines.push(`- Data residency: ${state.tenancy.dataResidency}`);
    lines.push(`- Tenant fields: ${state.tenancy.tenantFields.join(', ')}`);
    lines.push('', '## Accounts');
    (state.accounts || []).forEach((account) => lines.push(`- **${account.name}** — ${titleCase(account.stage)}, ${account.tier}, health ${account.health}/100, adoption ${account.adoption}/100, expansion ${account.expansionFit}/100, owner ${account.owner}`));
    lines.push('', '## Onboarding Command Center');
    (state.onboarding || []).forEach((item) => lines.push(`- **${item.name}** — ${item.status}, ${item.stage}, owner ${item.owner}${item.blocker ? `, blocker: ${item.blocker}` : ''}`));
    lines.push('', '## Role Matrix');
    (state.roleMatrix || []).forEach((role) => lines.push(`- **${role.role}** — ${role.responsibility}; permissions: ${role.permissions.join('; ')}`));
    lines.push('', '## Integration Health');
    (state.integrationHealth || []).forEach((integration) => lines.push(`- **${integration.name}** — ${integration.status}, owner ${integration.owner}, data model ${integration.dataModel}`));
    lines.push('', '## Success Plans');
    (state.successPlans || []).forEach((plan) => lines.push(`- **${plan.signal}** — KPI ${plan.kpi}, baseline ${plan.baseline}, target ${plan.target}, cadence ${plan.cadence}`));
    lines.push('', '## Support Queue');
    (state.supportQueue || []).forEach((ticket) => lines.push(`- **${ticket.title}** — ${ticket.severity}/${ticket.status}, SLA ${ticket.slaHours}h, playbook ${ticket.playbook}`));
    lines.push('', '## Playbooks');
    (state.playbooks || []).forEach((playbook) => lines.push(`- **${playbook.name}** — ${playbook.status}, module ${playbook.module}, automation: ${playbook.automation}, launch gate: ${playbook.launchGate}`));
    lines.push('', '## Product Blueprint');
    (state.blueprint?.workflows || []).forEach((workflow) => lines.push(`- Workflow: ${workflow}`));
    (state.blueprint?.kpis || state.blueprint?.analytics || []).forEach((metric) => lines.push(`- KPI: ${metric}`));
    (state.blueprint?.guards || []).forEach((guard) => lines.push(`- Guard: ${guard}`));
    lines.push('', '## Automations');
    (state.automations || []).forEach((automation) => lines.push(`- **${automation.trigger}** → ${automation.action} (${automation.enabled ? 'enabled' : 'draft'}, ${automation.risk} risk, rollback: ${automation.rollback})`));
    lines.push('', '## Audit Log');
    (state.auditLog || []).forEach((event) => lines.push(`- **${event.event}** — ${event.status}, reviewer ${event.reviewer}, evidence ${event.evidence || 'pending'}`));
    lines.push('', '## Expansion Motions');
    (state.expansionMotions || []).forEach((motion) => lines.push(`- **${motion.name}** — ${motion.package}, readiness ${motion.readiness}/100, trigger ${motion.trigger}`));
    lines.push('', '## KPI Board');
    (state.kpiBoard || []).forEach((kpi) => lines.push(`- **${kpi.name}** — current ${kpi.current}, target ${kpi.target}, trend ${kpi.trend}, source ${kpi.source}`));
    lines.push('', '## Generated SaaS Artifacts');
    generateSaasArtifacts(config, domain, state).forEach((artifact) => lines.push(`- **${artifact.title}:** ${artifact.body}`));
    lines.push('', '## Next Best Actions');
    metrics.nextBestActions.forEach((action) => lines.push(`- ${action}`));
    return lines.join('\n');
}
export function buildSaasCsv(state) {
    const header = ['id', 'name', 'segment', 'tier', 'stage', 'health', 'adoption', 'expansionFit', 'seats', 'owner', 'renewalDate', 'risk', 'lastTouch', 'notes'];
    const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    return [header.join(','), ...(state.accounts || []).map((account) => header.map((key) => escape(account[key])).join(','))].join('\n');
}
export function buildSaasOperationsCsv(state) {
    const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const rows = [];
    (state.onboarding || []).forEach((item) => rows.push(['onboarding', item.id, item.name, item.status, item.owner, item.stage, item.blocker || item.evidence]));
    (state.integrationHealth || []).forEach((item) => rows.push(['integration', item.id, item.name, item.status, item.owner, item.dataModel, item.lastVerified]));
    (state.supportQueue || []).forEach((item) => rows.push(['support', item.id, item.title, item.status, item.owner, item.severity, item.playbook]));
    (state.expansionMotions || []).forEach((item) => rows.push(['expansion', item.id, item.name, item.package, item.owner, item.trigger, item.readiness]));
    return [['type', 'id', 'name', 'status', 'owner', 'detail', 'evidence'].join(','), ...rows.map((row) => row.map(escape).join(','))].join('\n');
}
export function applySaasSample(config, domain) {
    const state = createSaasState(config, domain, '2026-01-01T00:00:00.000Z');
    state.accounts = state.accounts.map((account, index) => ({
        ...account,
        stage: index === 0 ? 'launch' : index === 1 ? 'validate' : index === 2 ? 'expand' : 'launch',
        health: 88 + index * 2,
        adoption: 84 + index * 3,
        expansionFit: 82 + index * 4,
        risk: index === 0 ? 'medium' : 'low',
        notes: `${account.name} has completed SaaS onboarding, evidence review, and owner handoff.`
    }));
    state.onboarding = state.onboarding.map((item) => ({ ...item, status: 'done', evidence: `Verified onboarding evidence for ${item.name}`, blocker: '' }));
    state.integrationHealth = state.integrationHealth.map((item) => ({ ...item, status: 'verified', lastVerified: '2026-03-15', risk: 'low' }));
    state.successPlans = state.successPlans.map((plan) => ({ ...plan, baseline: 72, target: 90 }));
    state.supportQueue = state.supportQueue.map((ticket) => ({ ...ticket, status: 'resolved', severity: ticket.severity === 'high' ? 'medium' : ticket.severity }));
    state.auditLog = state.auditLog.map((event) => ({ ...event, status: 'reviewed', evidence: `Verified audit evidence for ${event.event}` }));
    state.expansionMotions = state.expansionMotions.map((motion, index) => ({ ...motion, readiness: 86 + index * 3 }));
    state.kpiBoard = state.kpiBoard.map((kpi, index) => ({ ...kpi, current: 82 + index * 2, target: 90, trend: 'up' }));
    state.playbooks = state.playbooks.map((playbook, index) => ({
        ...playbook,
        status: index < 6 ? 'live' : 'ready',
        evidence: `Verified SaaS evidence for ${playbook.name}`,
        impact: 85 + (index % 3) * 5
    }));
    state.automations = state.automations.map((automation) => ({ ...automation, enabled: true, humanReview: true, lastRun: '2026-03-15' }));
    state.experiments = state.experiments.map((experiment) => ({ ...experiment, status: 'validated', result: 'adoption improved in sample workspace' }));
    return state;
}
//# sourceMappingURL=saas-core.js.map