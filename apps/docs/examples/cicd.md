# CI/CD Integration

Run FexAPI in CI pipelines to provide mock data for automated tests.

## Recommended Pipeline Order

1. Install dependencies
2. Generate API artifacts (`fexapi generate`)
3. Start mock server on a fixed port
4. Wait for readiness (health probe)
5. Run test suite

## Package Manager Command Variants

::: code-group

```bash [npm]
npm install
npx fexapi generate
npx fexapi serve --port 4000 &
npm test
```

```bash [pnpm]
pnpm install
pnpm dlx fexapi generate
pnpm dlx fexapi serve --port 4000 &
pnpm test
```

```bash [bun]
bun install
bunx fexapi generate
bunx fexapi serve --port 4000 &
bun test
```

```bash [yarn]
yarn install
yarn dlx fexapi generate
yarn dlx fexapi serve --port 4000 &
yarn test
```

:::

## GitHub Actions

::: code-group

```yaml [npm]
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - run: npm install
      - run: npx fexapi generate

      - name: Start mock server
        run: npx fexapi serve --port 4000 &

      - name: Wait for server readiness
        run: |
          for i in {1..30}; do
            curl -s http://localhost:4000/unknown > /dev/null && break
            sleep 1
          done

      - name: Run tests
        run: npm test
```

```yaml [pnpm]
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: pnpm

      - run: corepack enable
      - run: pnpm install
      - run: pnpm dlx fexapi generate

      - name: Start mock server
        run: pnpm dlx fexapi serve --port 4000 &

      - name: Wait for server readiness
        run: |
          for i in {1..30}; do
            curl -s http://localhost:4000/unknown > /dev/null && break
            sleep 1
          done

      - name: Run tests
        run: pnpm test
```

```yaml [bun]
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - run: bun install
      - run: bunx fexapi generate

      - name: Start mock server
        run: bunx fexapi serve --port 4000 &

      - name: Wait for server readiness
        run: |
          for i in {1..30}; do
            curl -s http://localhost:4000/unknown > /dev/null && break
            sleep 1
          done

      - name: Run tests
        run: bun test
```

```yaml [yarn]
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: yarn

      - run: corepack enable
      - run: yarn install --frozen-lockfile
      - run: yarn dlx fexapi generate

      - name: Start mock server
        run: yarn dlx fexapi serve --port 4000 &

      - name: Wait for server readiness
        run: |
          for i in {1..30}; do
            curl -s http://localhost:4000/unknown > /dev/null && break
            sleep 1
          done

      - name: Run tests
        run: yarn test
```

:::

## GitLab CI

```yaml
test:
  image: node:18
  script:
    - npm install
    - npx fexapi generate
    - npx fexapi serve --port 4000 &
    - |
      for i in $(seq 1 30); do
        curl -s http://localhost:4000/unknown > /dev/null && break
        sleep 1
      done
    - npm test
```

## Optional: Use start-server-and-test

If your project already uses npm scripts:

::: code-group

```bash [npm]
npm install -D start-server-and-test
```

```bash [pnpm]
pnpm add -D start-server-and-test
```

```bash [bun]
bun add -d start-server-and-test
```

```bash [yarn]
yarn add -D start-server-and-test
```

:::

Run the test script with your package manager:

::: code-group

```bash [npm]
npm test
```

```bash [pnpm]
pnpm test
```

```bash [bun]
bun test
```

```bash [yarn]
yarn test
```

:::

```json
{
  "scripts": {
    "ci:mock:test": "start-server-and-test \"fexapi serve --port 4000\" http://localhost:4000/unknown \"npm test\""
  }
}
```

See the [Installation guide](../getting-started/installation.md) for the package-manager legend.

## Tips

- Always run `fexapi generate` before starting the server in CI
- Use `&` to start the server in the background
- Prefer a health check loop over fixed `sleep`
- Use a fixed port to avoid conflicts
- Commit your `schema.fexapi` file to version control
- Don't commit `fexapi/.cache/generated.api.json` — generate it in CI
