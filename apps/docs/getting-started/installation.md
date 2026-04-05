# Installation

## Requirements

- Node.js 18 or later
- npm, pnpm, bun, or yarn

## Install Globally

::: code-group

```bash [npm]
npm install -g fexapi
```

```bash [pnpm]
pnpm add -g fexapi
```

```bash [bun]
bun add --global fexapi
```

```bash [yarn]
yarn global add fexapi
```

:::

After installing, verify it works:

```bash
fexapi --help
```

## Use Without Installing

You can run FexAPI directly with your package manager:

Legend: npx = npm, pnpm dlx = pnpm, bunx = bun, yarn dlx = yarn.

::: code-group

```bash [npx]
npx fexapi@latest init
```

```bash [pnpm]
pnpm dlx fexapi@latest init
```

```bash [bun]
bunx fexapi@latest init
```

```bash [yarn]
yarn dlx fexapi@latest init
```

:::

## Add to a Project

Install as a dev dependency in an existing project:

::: code-group

```bash [npm]
npm install -D fexapi
```

```bash [pnpm]
pnpm add -D fexapi
```

```bash [bun]
bun add -d fexapi
```

```bash [yarn]
yarn add -D fexapi
```

:::

Then add scripts to your `package.json`:

```json
{
  "scripts": {
    "mock:init": "fexapi init",
    "mock:generate": "fexapi generate",
    "mock:dev": "fexapi dev --watch",
    "mock:serve": "fexapi serve"
  }
}
```

## Next Steps

Once installed, head to the [Quick Start](/getting-started/quick-start) guide.
