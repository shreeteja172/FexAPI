export type LandingStat = {
  label: string;
  value: string;
};

export type LandingFeature = {
  title: string;
  body: string;
};

export type LandingProcessStep = {
  title: string;
  text: string;
};

export const landingMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export const landingStats: LandingStat[] = [
  { label: "Startup", value: "<1s" },
  { label: "Supported Methods", value: "GET POST PUT PATCH DELETE" },
  { label: "Record Count Clamp", value: "1-50" },
];

export const landingFeatures: LandingFeature[] = [
  {
    title: "Schema to API",
    body: "Define endpoints in schema.fexapi and ship a deterministic generated.api.json every cycle.",
  },
  {
    title: "Live Watch Reload",
    body: "Use fexapi dev --watch and changes flow through generation then into the running mock server.",
  },
  {
    title: "Config That Stays Simple",
    body: "Tune host, port, CORS, and logging from fexapi.config.js without framework lock-in.",
  },
  {
    title: "Frontend Team Velocity",
    body: "Unblock screens, loading states, and edge-case flows before backend delivery is complete.",
  },
];

export const landingProcessSteps: LandingProcessStep[] = [
  {
    title: "Init",
    text: "Scaffold clean config and schema defaults with fexapi init.",
  },
  {
    title: "Generate",
    text: "Compile schema into fexapi/generated.api.json.",
  },
  {
    title: "Serve or Watch",
    text: "Run fexapi serve or fexapi dev --watch for fast iteration.",
  },
];
