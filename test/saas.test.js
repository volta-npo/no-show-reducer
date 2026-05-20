import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.js';
import { domain } from '../src/domain.js';
import { createSaasState, validateSaasState, calculateSaasMetrics, generateSaasArtifacts, buildSaasMarkdown, buildSaasCsv, buildSaasOperationsCsv, applySaasSample } from '../src/saas-core.js';
test('saas state covers accounts, playbooks, and automations', () => {
    const state = createSaasState(config, domain, '2026-01-01T00:00:00.000Z');
    assert.equal(validateSaasState(config, domain, state), true);
    assert.ok(state.accounts.length >= 4);
    assert.equal(state.playbooks.length, domain.rows.length);
    assert.equal(state.automations.length, state.blueprint.guards.length);
});
test('saas sample reaches launch readiness with domain artifacts', () => {
    const state = applySaasSample(config, domain);
    const metrics = calculateSaasMetrics(config, domain, state);
    const artifacts = generateSaasArtifacts(config, domain, state);
    assert.equal(validateSaasState(config, domain, state), true);
    assert.equal(metrics.launchReady, true);
    assert.ok(metrics.totalMrr > 0);
    assert.equal(artifacts.length >= 8, true);
});
test('saas exports are product-specific and account-complete', () => {
    const state = applySaasSample(config, domain);
    const markdown = buildSaasMarkdown(config, domain, state);
    const csv = buildSaasCsv(state);
    const opsCsv = buildSaasOperationsCsv(state);
    assert.match(markdown, new RegExp(config.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(markdown, /SaaS Operating Console/);
    assert.match(markdown, /Tenant Operating System/);
    assert.match(markdown, /Onboarding Command Center/);
    assert.equal(csv.split('\n').length, state.accounts.length + 1);
    assert.match(csv, /tier,stage,health,adoption,expansionFit/);
    assert.match(opsCsv, /onboarding/);
    assert.match(opsCsv, /integration/);
    assert.match(opsCsv, /support/);
    assert.match(opsCsv, /expansion/);
});
test('saas blueprint includes product-specific workflows and guards', () => {
    const state = createSaasState(config, domain, '2026-01-01T00:00:00.000Z');
    assert.equal(state.blueprint.product, config.title);
    assert.ok(state.blueprint.workflows.length >= 4);
    assert.ok(state.blueprint.guards.length >= 3);
    assert.ok(state.blueprint.personas.length >= 6);
    assert.ok(state.blueprint.kpis.length >= 6);
    assert.ok(state.blueprint.expansion.length >= 4);
    assert.match(buildSaasMarkdown(config, domain, state), /Product Blueprint/);
});
test('saas operating system tracks governance, roles, integrations, and success plans', () => {
    const state = applySaasSample(config, domain);
    const metrics = calculateSaasMetrics(config, domain, state);
    assert.ok(state.tenancy.tenantFields.length >= 6);
    assert.ok(state.onboarding.every((item) => item.status === 'done'));
    assert.ok(state.roleMatrix.length >= state.blueprint.roles.length);
    assert.ok(state.integrationHealth.every((item) => item.status === 'verified'));
    assert.ok(state.successPlans.every((plan) => plan.target >= 80));
    assert.ok(state.auditLog.every((event) => event.status === 'reviewed'));
    assert.ok(metrics.governanceScore >= 85);
    assert.ok(metrics.retentionScore >= 85);
    assert.ok(metrics.integrationReadiness >= 85);
});
//# sourceMappingURL=saas.test.js.map