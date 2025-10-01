import { defineNuxtModule, addImportsDir } from "@nuxt/kit";
import { resolve } from "path";

export default defineNuxtModule({
    meta: { name: "starling" },
    setup(_, nuxt): void {
        // Auto-import all composables in submodules
        addImportsDir(resolve(__dirname, "./modules"));
        nuxt.hook("ready", (): void => {
            console.log("[starling] Nuxt is ready!");
        });
    }
});
