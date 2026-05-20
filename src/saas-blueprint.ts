export const PRODUCT_ROLES = ['Owner operator', 'Front desk coordinator', 'Service provider', 'Reminder reviewer'];

export const PRODUCT_PERSONAS = ['Owner operator', 'Front desk coordinator', 'Service provider', 'Reminder reviewer', 'Patient/client advocate', 'Implementation pod lead'];

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

export const PRODUCT_KPIS = ['Appointments protected', 'No-show rate reduction', 'Reminder opt-in coverage', 'Quiet-hour compliance', 'Cancellation recovery rate', 'Template approval speed'];

export const PRODUCT_WORKFLOWS = [
  'Appointment-type templates',
  'Quiet-hour enforcement',
  'Consent/channel matrix',
  'No-show savings estimator',
];

export const PRODUCT_ONBOARDING = ['Import appointment types', 'Define reminder cadence by channel', 'Map consent and quiet hours', 'Approve SMS/email templates', 'Simulate cancellation and reschedule paths', 'Train front desk escalation workflow'];

export const PRODUCT_GUARDS = [
  'Block reminders outside quiet hours',
  'Require opt-in before SMS',
  'Escalate repeated no-show segments',
];

export const PRODUCT_EXPANSION = ['Seasonal reminder optimization', 'Provider-level no-show dashboards', 'Two-way confirmation playbooks', 'Multi-site scheduling governance'];

export const PRODUCT_DATA_MODEL = ['Appointment type', 'Reminder cadence', 'Consent channel', 'Quiet-hour window', 'Cancellation policy', 'Recovery estimate'];

export const PRODUCT_SUCCESS_SIGNALS = ['Every template has owner approval', 'Quiet hours are enforced before launch', 'Consent/channel matrix is complete', 'No-show savings estimate is traceable'];

export function createProductSaasBlueprint(config, domain) {
  return {
    product: config.title,
    northStar: config.metric,
    roles: PRODUCT_ROLES,
    personas: PRODUCT_PERSONAS,
    integrations: PRODUCT_INTEGRATIONS,
    analytics: PRODUCT_ANALYTICS,
    kpis: PRODUCT_KPIS,
    workflows: PRODUCT_WORKFLOWS,
    onboarding: PRODUCT_ONBOARDING,
    guards: PRODUCT_GUARDS,
    expansion: PRODUCT_EXPANSION,
    dataModel: PRODUCT_DATA_MODEL,
    successSignals: PRODUCT_SUCCESS_SIGNALS,
    modules: config.modules,
    artifacts: domain.artifacts
  };
}
