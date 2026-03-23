export type SupportedFramework =
  | "nextjs"
  | "reactjs"
  | "vue"
  | "nuxt"
  | "svelte"
  | "sveltekit"
  | "angular"
  | "solid"
  | "remix"
  | "astro"
  | "unknown";

export type DetectedProject = {
  primaryFramework: SupportedFramework;
  frameworks: SupportedFramework[];
  tooling: string[];
};
