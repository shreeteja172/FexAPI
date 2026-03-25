# fexapi init

Scaffolds the FexAPI project files in your current directory.

## Usage

```bash
fexapi init [--force]
```

## Flags

| Flag | Description |
|------|-------------|
| `--force` | Overwrite existing files if they already exist |

## Interactive Wizard

The init command runs an interactive wizard that asks:

| Prompt | Default | Description |
|--------|---------|-------------|
| Port number | `3000` | The port your mock server will run on |
| Enable CORS? | `Yes` | Adds CORS headers to all responses |
| Generate sample schemas? | `Yes` | Creates example YAML schema files |

## Generated Files

```
fexapi/
└── schema.fexapi          # endpoint definitions

schemas/
├── user.yaml              # sample user schema (if selected)
└── post.yaml              # sample post schema (if selected)

fexapi.config.json         # JSON configuration
fexapi.config.js           # JavaScript configuration
```

## Example

```bash
npx fexapi init
```

```
? What port should the server run on? 4000
? Enable CORS? Yes
? Generate sample schemas? Yes

✓ Created fexapi/schema.fexapi
✓ Created fexapi.config.json
✓ Created fexapi.config.js
✓ Created schemas/user.yaml
✓ Created schemas/post.yaml
```

To overwrite existing files:

```bash
npx fexapi init --force
```
