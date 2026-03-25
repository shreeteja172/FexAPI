# Installation

## Requirements

- Node.js 18 or later
- npm, pnpm, or yarn

## Install Globally

::: code-group

```bash [npm]
npm install -g fexapi
```

```bash [pnpm]
pnpm add -g fexapi
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

::: code-group

```bash [npx]
npx fexapi init
```

```bash [pnpm dlx]
pnpm dlx fexapi init
```

```bash [yarn dlx]
yarn dlx fexapi init
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
