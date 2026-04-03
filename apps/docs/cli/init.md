# fexapi init

Runs setup and scaffolds FexAPI files in your project.

## Usage

```bash
fexapi init [--force]
```

## Flags

| Flag      | Description                                    |
| --------- | ---------------------------------------------- |
| `--force` | Overwrite existing files if they already exist |

## Interactive Wizard

The command runs a 2-step interactive wizard (TTY only):

| Prompt       | Default | Description                           |
| ------------ | ------- | ------------------------------------- |
| Port number  | `4000`  | The port your mock server will run on |
| Enable CORS? | `Yes`   | Adds CORS headers to all responses    |

If no TTY is available, defaults are used automatically (`port: 4000`, `cors: true`).

## Generated Files

```
fexapi/schema.fexapi       # endpoint definitions
fexapi.config.js           # JavaScript configuration
```

`fexapi.config.js` is generated with these defaults from the wizard answers:

- `port: <wizard value>`
- `cors: <wizard value>`
- `delay: 0`

Also updates `.gitignore` to include `fexapi/.cache` when needed.

`init` also detects your project stack from the nearest `package.json` and chooses an initial schema template accordingly.

## Example

```bash
npx fexapi@latest init
```

```
What port? (default: 4000) 4000
? Enable CORS? Yes

Created fexapi/schema.fexapi
Created fexapi.config.js
```

To overwrite existing files:

```bash
npx fexapi@latest init --force
```

Without `--force`, existing `fexapi/schema.fexapi` and `fexapi.config.js` are kept.
