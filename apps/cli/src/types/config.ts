export type FexapiRouteConfig = {
  count: number;
  schema: string;
};

export type FexapiFieldValueType =
  | "number"
  | "string"
  | "boolean"
  | "date"
  | "uuid"
  | "email"
  | "url"
  | "name"
  | "phone";

export type FexapiSchemaFieldDefinition = {
  type: FexapiFieldValueType;
  faker?: string;
  min?: number;
  max?: number;
};

export type FexapiSchemaDefinition = Record<
  string,
  FexapiSchemaFieldDefinition
>;
export type FexapiSchemaDefinitions = Record<string, FexapiSchemaDefinition>;

export type FexapiRuntimeConfig = {
  port?: number;
  routes?: Record<string, FexapiRouteConfig>;
  cors?: boolean;
  delay?: number;
};
