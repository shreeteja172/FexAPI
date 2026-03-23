export type FexapiRouteConfig = {
  count: number;
  schema: string;
};

export type FexapiRuntimeConfig = {
  port?: number;
  routes?: Record<string, FexapiRouteConfig>;
  cors?: boolean;
  delay?: number;
};
