# CI/CD Integration

Run FexAPI in CI pipelines to provide mock data for automated tests.

## Recommended Pipeline Order

1. Install dependencies
2. Generate API artifacts (`fexapi generate`)
3. Start mock server on a fixed port
4. Wait for readiness (health probe)
5. Run test suite

## GitHub Actions

```yaml
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

```bash
npm install -D start-server-and-test
```

```json
{
  "scripts": {
    "ci:mock:test": "start-server-and-test \"fexapi serve --port 4000\" http://localhost:4000/unknown \"npm test\""
  }
}
```

## Tips

- Always run `fexapi generate` before starting the server in CI
- Use `&` to start the server in the background
- Prefer a health check loop over fixed `sleep`
- Use a fixed port to avoid conflicts
- Commit your `schema.fexapi` file to version control
- Don't commit `fexapi/.cache/generated.api.json` — generate it in CI
