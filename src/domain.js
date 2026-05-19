export const domain = {
  "kind": "reminder-planner",
  "title": "No-Show Reducer Reminder Planner",
  "purpose": "A purpose-built reminder planner interface for reminder and follow-up playbooks for appointment-based local businesses.",
  "inputTitle": "Product-specific inputs",
  "previewTitle": "Generated working outputs",
  "tableTitle": "Reminder cadence",
  "metricLabels": [
    "No-show Rate",
    "Revenue Protected",
    "Consent Safety"
  ],
  "fields": [
    {
      "id": "organization-client",
      "label": "Organization / client",
      "type": "text",
      "sample": "BrightPath Tutoring Studio",
      "placeholder": "Enter organization / client"
    },
    {
      "id": "primary-goal",
      "label": "Primary goal",
      "type": "text",
      "sample": "appointments protected by reminder workflows",
      "placeholder": "Enter primary goal"
    },
    {
      "id": "owner-reviewer",
      "label": "Owner / reviewer",
      "type": "text",
      "sample": "Volta project lead",
      "placeholder": "Enter owner / reviewer"
    },
    {
      "id": "evidence-source",
      "label": "Evidence source",
      "type": "text",
      "sample": "Owner interview + public audit",
      "placeholder": "Enter evidence source"
    },
    {
      "id": "start-date",
      "label": "Start date",
      "type": "date",
      "sample": "2026-03-10",
      "placeholder": "Enter start date"
    },
    {
      "id": "deadline-date",
      "label": "Deadline date",
      "type": "date",
      "sample": "2026-04-15",
      "placeholder": "Enter deadline date"
    },
    {
      "id": "cadence-days",
      "label": "Cadence days",
      "type": "number",
      "sample": 7,
      "placeholder": "Enter cadence days"
    },
    {
      "id": "review-buffer-days",
      "label": "Review buffer days",
      "type": "number",
      "sample": 3,
      "placeholder": "Enter review buffer days"
    }
  ],
  "rows": [
    "Appointment types entered",
    "Baseline no-show rate entered",
    "Reminder cadence planned",
    "SMS/email templates generated",
    "Quiet hours checked",
    "Cancellation policy written",
    "Tracking log started",
    "Owner SOP exported"
  ],
  "artifacts": [
    "Cadence calendar",
    "Reminder templates",
    "No-show tracker CSV"
  ],
  "checks": [
    "SMS needs consent",
    "Quiet hours enforced",
    "Sensitive appointment details flagged"
  ],
  "sampleClient": "BrightPath Tutoring Studio"
};
