# FexAPI

Mock APIs for frontend developers.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/shreeteja172/fexapi/ci.yml?branch=main)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat)
![Node Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

Define endpoints in a schema file. Run one command. Get a local server with realistic, deterministic mock data powered by [Faker.js](https://fakerjs.dev).

[Documentation](https://fex-api-docs.vercel.app) · [GitHub](https://github.com/shreeteja172/fexapi) · [NPM](https://www.npmjs.com/package/fexapi)

---

## The Problem

Frontend teams waste cycles waiting for backend APIs. Design teams need stable, realistic data for reviews. QA needs consistent responses for test reliability. Current solutions are either too rigid or don't scale.

## The Solution

FexAPI is a zero-config mock server. You describe your API shape once. The CLI generates a running server with seeded data that stays consistent across runs. No database setup. No API mocking library overhead. Just `npx fexapi init` and start building.

---

## Features

- **Schema-first design** — Define endpoints once, generate stable payloads across all environments
- **Deterministic output** — Seeded data ensures consistent responses for design reviews, snapshots, and test stability
- **Runtime controls** — Tune latency, response size, and route behavior without rebuilding your tooling
- **Production parity** — Headers, status codes, pagination, and error branches mirror real APIs
- **Zero config** — Smart defaults adapt to your project structure; override with one config file if needed
- **Watch mode** — Edit your schema and see changes live; development doesn't require restart cycles

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
npm install -D fexapi
npx fexapi init
```

The `init` command scaffolds three files in your project:

```
fexapi/
  ├── schema.fexapi       # Your API blueprint
  ├── fexapi.config.js    # Runtime configuration
  └── schemas/
      └── user.yaml       # Custom schema definitions
```

### Define Your Schema

Edit `fexapi/schema.fexapi`:

```
route GET /users count=10
route GET /users/{id}
route POST /users
route DELETE /users/{id}

route GET /posts @user
```

### Generate and Run

```bash
# Compile schema into an API spec
npx fexapi generate

# Start the mock server
npx fexapi serve

# Or run with auto-reload during development
npx fexapi dev --watch --log
```

Your API is live at `http://localhost:4000`.

```bash
curl http://localhost:4000/users
```

Response:

```json
{
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Emma Johnson",
      "email": "emma.johnson@example.com",
      "createdAt": "2024-01-15T08:23:14.000Z"
    },
    ...
  ]
}
```

---

## Configuration

Create `fexapi.config.js` to override defaults:

```javascript
import { defineConfig } from "fexapi";

export default defineConfig({
  port: 4100,
  host: "0.0.0.0",
  latency: 50,
  cors: true,
  routes: {
    "GET /projects": {
      schema: "project",
      count: 12,
      status: 200,
    },
    "POST /projects": {
      status: 201,
      latency: 100,
    },
  },
});
```

See the [configuration guide](https://fexapi.dev/docs/getting-started/configuration) for all options.

---

## Usage Examples

### React

```jsx
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/users?count=5")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Testing with Vitest

```javascript
import { describe, it, expect, beforeAll } from "vitest";

const API_URL = "http://localhost:4000";

describe("User API", () => {
  it("returns users", async () => {
    const res = await fetch(`${API_URL}/users?count=5`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.users).toHaveLength(5);
    expect(data.users[0]).toHaveProperty("email");
  });
});
```

See [examples](https://fexapi.dev/docs/examples) for Next.js, Vue, Express, and CI/CD setups.

---

## Tech Stack

**Core**

- [Node.js](https://nodejs.org) — Runtime
- [TypeScript](https://www.typescriptlang.org) — Language
- [Faker.js](https://fakerjs.dev) — Data generation

**Tooling**

- [Turborepo](https://turborepo.dev) — Monorepo management
- [VitePress](https://vitepress.dev) — Documentation site
- [ESLint](https://eslint.org) — Code linting
- [Vitest](https://vitest.dev) — Testing framework

---

## Architecture

```
┌──────────────────────────────────────┐
│  fexapi.config.js / schema.fexapi   │  Input
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Schema Compiler                     │  Parse & compile
│  - Route extraction                  │
│  - Type resolution                   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  generated.api.json                │  Output artifact
│  - Routes & validators              │
│  - Seed configurations              │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  HTTP Server                         │  Runtime
│  - Request routing                   │
│  - Data generation (seeded)          │
│  - Response formatting               │
└──────────────────────────────────────┘
```

When you run `fexapi serve`, the server reads `generated.api.json` and uses your seed configuration to generate identical responses on every call. Change a seed, get different data. Restart, get the same data again.

---

## Commands

| Command                  | Purpose                                |
| ------------------------ | -------------------------------------- |
| `npx fexapi init`        | Scaffold config and schema files       |
| `npx fexapi generate`    | Compile schema into API spec           |
| `npx fexapi serve`       | Start the mock server                  |
| `npx fexapi dev --watch` | Start with auto-reload on file changes |
| `npx fexapi format`      | Auto-format your schema file           |

---

## Roadmap

- [x] Base schema compiler and HTTP server
- [x] Watch mode for development
- [x] Configuration file support
- [x] Custom schema definitions
- [ ] Database seeding output
- [ ] GraphQL schema support
- [ ] OpenAPI export
- [ ] Request recording and playback
- [ ] Multi-environment profiles

---

## Contributing

We welcome contributions. Please read our [code of conduct](./apps/docs/contributing/code-of-conduct.md) and [contribution guide](./apps/docs/contributing/guide.md).

### Development Setup

```bash
git clone https://github.com/shreeteja172/fexapi.git
cd fexapi

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

See [development setup](./apps/docs/contributing/setup.md) for detailed instructions.

---

## License

MIT — See [LICENSE](./LICENSE) for details.

---

## Author

Built and maintained by [shreeteja172](https://github.com/shreeteja172).
