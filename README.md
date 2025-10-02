

# Starling (Nuxt layer + package)

Purpose: Provide reusable Nuxt components, composables, and styles used by Owl (and potentially other birds). Keep Owl thin by moving shared UI logic here.

Scope:
- Nuxt layer with base layout, typography, and color tokens.
- Package with composables:
  - useCanaryApi() – typed client for Canary endpoints
  - useBirds() – state management for birds list
  - useBuildLogs() – SSE/polling to stream build logs
  - SemVer helpers for UI validation
- Shared UI components: BirdCard, BiasSlider, VersionPicker, LogsViewer.

Versioning:
- Node and package constraints are defined in package.json. This repository follows SemVer. Publish internally as needed.

Checklist:
- [ ] Create Nuxt layer scaffold
- [ ] Implement API composables (no hardcoded URLs; base URL is configurable)
- [ ] Build shared UI components
- [ ] Provide example usage in Owl
- [ ] Write brief usage docs