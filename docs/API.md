# API Reference: No-Show Reducer

## Static app contract

The browser app is local-first. Data is stored in the user's browser unless explicitly exported.

| Capability | File | Contract |
|---|---|---|
| Product config | `src/config.ts` | Mission, rubric, sample scenario, privacy rules. |
| Domain engine | `src/domain-core.ts` | Domain-specific calculations and generated artifacts. |
| v3 certification | `src/v3-core.ts` | Release gates, export/import, deterministic hashes. |

No server API is required for this product today. The production API is the local-first TypeScript module contract above.

## OpenAPI

See `openapi.yaml` for backend-enabled products.
