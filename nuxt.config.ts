// Starling as a Nuxt Layer
// This exposes a proper Nuxt layer config so that consumers can `extends: ['@yellowcable/starling']`
// and we register our module internally.

import { defineNuxtConfig } from "nuxt/config";
import { resolve } from "node:path";


// noinspection JSUnusedGlobalSymbols
export default defineNuxtConfig({
    compatibilityDate: "2025-09-29",
    modules: [resolve("./module")]
});
