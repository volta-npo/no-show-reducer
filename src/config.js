export const config = {
    "number": 34,
    "slug": "no-show-reducer",
    "title": "No-Show Reducer",
    "category": "AI & Automation",
    "tagline": "Reminder and follow-up playbooks for appointment-based local businesses.",
    "persona": "Student teams optimizing booking operations.",
    "gap": "No-shows hurt small service businesses, but many do not need complex software to reduce them.",
    "niche": "Salons, tutors, clinics, repair shops, and local services.",
    "metric": "appointments protected by reminder workflows",
    "modules": [
        "Reminder cadence planner",
        "SMS/email templates",
        "Cancellation policy copy",
        "No-show tracker"
    ],
    "theme": {
        "accent": "#7c3aed",
        "accent2": "#c4b5fd",
        "emoji": "\u26a1",
        "metricLabel": "Automation safety",
        "workflow": [
            "Define workflow boundary",
            "Identify data and failure risks",
            "Require human review",
            "Export safe implementation plan"
        ],
        "privacy": "No external AI calls are made. Treat customer data, credentials, payments, and public posting as high risk."
    },
    "statuses": [
        "not-started",
        "blocked",
        "in-progress",
        "ready",
        "approved"
    ],
    "criteria": [
        {
            "id": "reminder-cadence-planner",
            "label": "Reminder cadence planner",
            "weight": 15,
            "defaultStatus": "not-started",
            "prompt": "Implement and verify reminder cadence planner with evidence that a Volta student pod, mentor, and owner can understand."
        },
        {
            "id": "sms-email-templates",
            "label": "SMS/email templates",
            "weight": 15,
            "defaultStatus": "not-started",
            "prompt": "Implement and verify sms/email templates with evidence that a Volta student pod, mentor, and owner can understand."
        },
        {
            "id": "cancellation-policy-copy",
            "label": "Cancellation policy copy",
            "weight": 15,
            "defaultStatus": "not-started",
            "prompt": "Implement and verify cancellation policy copy with evidence that a Volta student pod, mentor, and owner can understand."
        },
        {
            "id": "no-show-tracker",
            "label": "No-show tracker",
            "weight": 15,
            "defaultStatus": "not-started",
            "prompt": "Implement and verify no-show tracker with evidence that a Volta student pod, mentor, and owner can understand."
        },
        {
            "id": "evidence-quality",
            "label": "Evidence quality",
            "weight": 10,
            "defaultStatus": "not-started",
            "prompt": "Attach proof, source notes, screenshots, owner confirmation, or reviewer rationale."
        },
        {
            "id": "owner-handoff",
            "label": "Owner handoff",
            "weight": 10,
            "defaultStatus": "not-started",
            "prompt": "Make the output understandable and maintainable by a nontechnical owner."
        },
        {
            "id": "mission-alignment",
            "label": "Mission alignment",
            "weight": 10,
            "defaultStatus": "not-started",
            "prompt": "Show how this advances digital equity, student growth, or pro bono delivery."
        },
        {
            "id": "qa-safety",
            "label": "QA and safety",
            "weight": 10,
            "defaultStatus": "not-started",
            "prompt": "Resolve privacy, accessibility, accuracy, and operational risks before handoff."
        }
    ],
    "templates": {
        "actions": [
            "Run a real Volta scenario for No-Show Reducer and capture baseline evidence.",
            "Complete the reminder cadence planner workflow with owner-safe notes.",
            "Resolve all blocked rubric items and add evidence for every ready item.",
            "Export the handoff packet and review it with a mentor before client use."
        ]
    },
    "sample": {
        "clientName": "BrightPath Tutoring Studio",
        "chapter": "El Paso",
        "studentLead": "Volta Student Lead",
        "notes": "Responsible automation project to reduce admin time without exposing student data. No-Show Reducer sample.",
        "evidencePrefix": "No-Show Reducer",
        "evidence": [
            "Discovery call notes captured with owner confirmation.",
            "Public digital footprint reviewed and summarized.",
            "Mentor QA comments attached before handoff."
        ]
    }
};
//# sourceMappingURL=config.js.map