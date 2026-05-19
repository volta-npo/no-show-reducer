export const PRODUCT_ROLES = [
  'Front desk coordinator',
  'Service provider',
  'Reminder reviewer',
  'Owner operator',
];

export const PRODUCT_INTEGRATIONS = [
  'Calendar CSV import',
  'SMS copy export',
  'Email reminder sequence',
  'Booking policy snippet',
];

export const PRODUCT_ANALYTICS = [
  'Protected appointment count',
  'Quiet-hour violations',
  'Cancellation window coverage',
  'Estimated recovered revenue',
];

export const PRODUCT_WORKFLOWS = [
  'Appointment-type templates',
  'Quiet-hour enforcement',
  'Consent/channel matrix',
  'No-show savings estimator',
];

export const PRODUCT_GUARDS = [
  'Block reminders outside quiet hours',
  'Require opt-in before SMS',
  'Escalate repeated no-show segments',
];

export function createProductSaasBlueprint(config, domain) {
  return {
    product: config.title,
    northStar: config.metric,
    roles: PRODUCT_ROLES,
    integrations: PRODUCT_INTEGRATIONS,
    analytics: PRODUCT_ANALYTICS,
    workflows: PRODUCT_WORKFLOWS,
    guards: PRODUCT_GUARDS,
    modules: config.modules,
    artifacts: domain.artifacts
  };
}
