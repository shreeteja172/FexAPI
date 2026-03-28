# fexapi init

Scaffolds the FexAPI project files in your current directory.

## Usage

```bash
fexapi init [--force]
```

## Flags

| Flag      | Description                                    |
| --------- | ---------------------------------------------- |
| `--force` | Overwrite existing files if they already exist |

## Interactive Wizard

The init command runs an interactive wizard that asks:

| Prompt       | Default | Description                           |
| ------------ | ------- | ------------------------------------- |
| Port number  | `4000`  | The port your mock server will run on |
| Enable CORS? | `Yes`   | Adds CORS headers to all responses    |

## Generated Files

```
fexapi/schema.fexapi       # endpoint definitions
fexapi.config.js           # JavaScript configuration
```

## Example

```bash
npx fexapi init
```

```
What port? (default: 4000) 4000
? Enable CORS? Yes

Created fexapi/schema.fexapi
Created fexapi.config.js
```

To overwrite existing files:

```bash
npx fexapi init --force
```
