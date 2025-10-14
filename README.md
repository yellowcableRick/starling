# Starling

Starling is a framework-agnostic TypeScript library of small, focused utilities and composables. It contains no Nuxt (or framework) runtime code and can be consumed from any TypeScript/JavaScript project.

Highlights:
- Pure TypeScript modules only (no framework dependencies)
- Tree-shakeable subpath imports
- Tested utilities (see test directory)

Usage:
Import specific utilities from subpaths, for example:

import { toRoman, fromRoman } from '@yellowcable/starling/modules/converters/composables/useRomanNumerals'

Development:
- Build: npm run build
- Watch: npm run dev

Publishing:
This package exposes only module subpaths via package.json exports. If you need a Nuxt layer, use the separate package: @yellowcable/myna.