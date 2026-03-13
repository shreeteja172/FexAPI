export type FieldType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'date'
  | 'uuid'
  | 'email'
  | 'url'
  | 'name'
  | 'phone'

export interface SchemaField {
  name: string
  type: FieldType
}

export interface ParsedSchema {
  endpoint: string
  fields:   SchemaField[]
}
export function parseSchema(endpoint: string, raw: string): ParsedSchema {
  const fields = raw
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)
    .map(part => {
      const [name, type = 'string'] = part.split(':')
      return {
        name: name.trim(),
        type: type.trim().toLowerCase() as FieldType
      }
    })

  return { endpoint: endpoint.toLowerCase().trim(), fields }
}

const VALID: FieldType[] = [
  'number','string','boolean','date','uuid','email','url','name','phone'
]

export function validateSchema(schema: ParsedSchema): string[] {
  return schema.fields
    .filter(f => !VALID.includes(f.type))
    .map(f => `"${f.name}" has unknown type "${f.type}". Valid: ${VALID.join(', ')}`)
}