import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.js';
import { domain } from '../src/domain.js';
import { createSaasState, validateSaasState, calculateSaasMetrics, generateSaasArtifacts, buildSaasMarkdown, buildSaasCsv, applySaasSample } from '../src/saas-core.js';

test('saas state covers accounts, playbooks, and automations', () => {
  const state = createSaasState(config, domain, '2026-01-01T00:00:00.000Z');
  assert.equal(validateSaasState(config, domain, state), true);
  assert.ok(state.accounts.length >= 3);
  assert.equal(state.playbooks.length, domain.rows.length);
  assert.equal(state.automations.length, domain.checks.length);
});

test('saas sample reaches launch readiness with domain artifacts', () => {
  const state = applySaasSample(config, domain);
  const metrics = calculateSaasMetrics(config, domain, state);
  const artifacts = generateSaasArtifacts(config, domain, state);
  assert.equal(validateSaasState(config, domain, state), true);
  assert.equal(metrics.launchReady, true);
  assert.ok(metrics.totalMrr > 0);
  assert.equal(artifacts.length >= 4, true);
});

test('saas exports are product-specific and account-complete', () => {
  const state = applySaasSample(config, domain);
  const markdown = buildSaasMarkdown(config, domain, state);
  const csv = buildSaasCsv(state);
  assert.match(markdown, new RegExp(config.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(markdown, /SaaS Operating Console/);
  assert.equal(csv.split('\n').length, state.accounts.length + 1);
  assert.match(csv, /tier,stage,health/);
});


test('saas blueprint includes product-specific workflows and guards', () => {
  const state = createSaasState(config, domain, '2026-01-01T00:00:00.000Z');
  assert.equal(state.blueprint.product, config.title);
  assert.ok(state.blueprint.workflows.length >= 4);
  assert.ok(state.blueprint.guards.length >= 3);
  assert.match(buildSaasMarkdown(config, domain, state), /Product Blueprint/);
});
