# Testing with FexAPI

Use FexAPI to provide consistent mock data for your test suite.

## Setup

Install FexAPI and a test server orchestrator:

```bash
npm install -D fexapi start-server-and-test
```

Add scripts that generate artifacts, start the server, wait for readiness, and run tests:

```json
{
  "scripts": {
    "mock:generate": "fexapi generate",
    "mock:start": "fexapi serve --port 4100",
    "test:integration": "start-server-and-test \"npm run mock:start\" http://localhost:4100/unknown \"vitest run\"",
    "test": "npm run mock:generate && npm run test:integration"
  }
}
```

Why this is better than `fexapi serve &`:

- waits until the server is reachable
- avoids flaky race conditions
- cleans up the server process automatically

## Integration Tests

```js
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const API_URL = "http://localhost:4100";

describe("User API", () => {
  it("should return users", async () => {
    const res = await fetch(`${API_URL}/users?count=5`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.users).toHaveLength(5);
    expect(data.users[0]).toHaveProperty("id");
    expect(data.users[0]).toHaveProperty("email");
  });

  it("should return 404 for unknown routes", async () => {
    const res = await fetch(`${API_URL}/unknown`);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe("Route not found");
    expect(data.availableRoutes).toBeDefined();
  });
});
```

## Component Tests

Use FexAPI to provide data for component-level tests:

```jsx
import { render, screen, waitFor } from "@testing-library/react";
import UserList from "./UserList";

test("renders user list", async () => {
  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
```

## Contract-Style Checks

When data is randomized, assert shape and constraints instead of exact values:

```js
expect(Array.isArray(data.users)).toBe(true);
expect(data.users.length).toBeGreaterThan(0);
expect(typeof data.users[0].id).toBe("string");
```

## Tips

- Use a dedicated port for tests to avoid conflicts with dev
- Add `delay: 0` to your test config for faster tests
- FexAPI generates random data — test for structure, not specific values
- Keep one stable schema fixture for integration tests to reduce noise
