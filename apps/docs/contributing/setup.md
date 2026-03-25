# Development Setup

Set up FexAPI for local development.

## Prerequisites

- Node.js 18+
- pnpm 10+

## Clone and Install

```bash
git clone https://github.com/shreeteja172/fexapi.git
cd fexapi
pnpm install
```

## Project Structure

```
fexapi/
├── apps/
│   ├── cli/          # the FexAPI CLI package
│   ├── docs/         # documentation site (VitePress)
│   └── web/          # landing page
├── packages/         # shared packages
├── turbo.json        # Turborepo config
└── pnpm-workspace.yaml
```

## Development

Build all packages:

```bash
pnpm build
```

Watch the CLI for changes:

```bash
cd apps/cli
pnpm dev
```

Run the docs site locally:

```bash
cd apps/docs
pnpm dev
```

## Testing Changes

After making changes to the CLI:

```bash
cd apps/cli
pnpm build
node dist/index.js --help
```

## Linking Locally

To test the CLI as a global command:

```bash
cd apps/cli
pnpm link --global
fexapi --help
```
