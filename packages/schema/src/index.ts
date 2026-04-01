export type FieldPrimitiveType =
  | "number"
  | "string"
  | "boolean"
  | "date"
  | "uuid"
  | "email"
  | "url"
  | "name"
  | "phone";

export type FieldType = FieldPrimitiveType | `${FieldPrimitiveType}[]`;

export interface SchemaField {
  name: string;
  type: FieldType;
}

export interface ParsedSchema {
  endpoint: string;
  fields: SchemaField[];
}
export function parseSchema(endpoint: string, raw: string): ParsedSchema {
  const fields = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((part) => {
      const [name, type = "string"] = part.split(":");
      return {
        name: name.trim(),
        type: type.trim().toLowerCase() as FieldType,
      };
    });

  return { endpoint: endpoint.toLowerCase().trim(), fields };
}

const PRIMITIVE_TYPES: FieldPrimitiveType[] = [
  "number",
  "string",
  "boolean",
  "date",
  "uuid",
  "email",
  "url",
  "name",
  "phone",
];

const VALID: FieldType[] = [
  ...PRIMITIVE_TYPES,
  ...(PRIMITIVE_TYPES.map((t) => `${t}[]`) as FieldType[]),
];

export function validateSchema(schema: ParsedSchema): string[] {
  return schema.fields
    .filter((f) => !VALID.includes(f.type))
    .map(
      (f) =>
        `"${f.name}" has unknown type "${f.type}". Valid: ${VALID.join(", ")}`,
    );
}
