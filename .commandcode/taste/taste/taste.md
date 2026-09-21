# Taste
- Prefers NestJS as the backend framework, with PostgreSQL as the database and Prisma as the ORM. Confidence: 0.7
- Prefers real auth using JWT access tokens plus rotating refresh tokens with role-based guards/RBAC, rather than a single simple token. Confidence: 0.55
- Prefers the backend as a standalone project in its own folder/repo (sibling to the frontend) instead of embedding it inside the frontend codebase. Confidence: 0.55
- Wants API errors to carry machine-readable reason codes that the client localizes, rather than surfacing the API's raw English messages in a Bangla-first storefront. Confidence: 0.55
- Prefers wiring a frontend to a new API through a thin data layer (typed client + fetch hooks + mappers) that preserves the existing component props and snake_case types, instead of rewriting components. Confidence: 0.5
- Prefers pre-existing broken links/routes found during related work to be fixed as part of that work rather than left as-is. Confidence: 0.45
- Gives brief, high-level directives and expects the agent to make the architectural calls; works well when offered a few concrete options with a recommended default. Confidence: 0.5
- Prefers the agent to proactively audit the work and find/fix real defects rather than stop and ask for permission or wait for a specific bug report. Confidence: 0.5
