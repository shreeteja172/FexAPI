# CI/CD Integration

Run FexAPI in CI pipelines to provide mock data for automated tests.

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

      - name: Wait for server
        run: sleep 2

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
    - sleep 2
    - npm test
```

## Tips

- Always run `fexapi generate` before starting the server in CI
- Use `&` to start the server in the background
- Add a `sleep` or health check before running tests
- Use a fixed port to avoid conflicts
- Commit your `schema.fexapi` file to version control
- Don't commit `fexapi/generated.api.json` — generate it in CI
