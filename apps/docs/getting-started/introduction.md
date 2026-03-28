# Introduction

FexAPI is a CLI tool that generates mock API endpoints for frontend development. Define your data shape in a schema file, run one command, and get a local server with realistic fake data.

## Why FexAPI?

When building frontends, you need API data before the backend is ready. FexAPI solves this by letting you:

- **Define endpoints declaratively** using a simple schema format
- **Generate realistic data** powered by Faker.js
- **Run a local server** with zero configuration
- **Watch for changes** and auto-reload during development

## How It Works

```
1. fexapi init          → scaffolds config + schema files
2. edit schema.fexapi   → define your endpoints and fields
3. fexapi generate      → generates the API spec from your schema
4. fexapi dev --watch   → starts the server with hot reload
```

Your frontend can now fetch from `http://localhost:4000/users` and get back structured, realistic mock data.

## What Gets Generated

FexAPI reads your `schema.fexapi` file and produces:

| File                            | Purpose                                  |
| ------------------------------- | ---------------------------------------- |
| `fexapi/generated.api.json`     | The compiled API spec used by the server |
| `fexapi/migrations/schema.json` | Migration snapshot of your schema        |

The server uses these files to respond to HTTP requests with dynamically generated fake data.

## Project Structure

After running `fexapi init`, your project will contain:

```
your-project/
├── fexapi/
│   └── schema.fexapi         # your endpoint definitions
│   └── schemas/
│       ├── user.yaml          # custom schema (optional)
│       └── post.yaml          # custom schema (optional)
├── fexapi.config.json         # JSON config
└── fexapi.config.js           # JS config (route mappings, CORS, delay)
```

## Next Steps

- [Install FexAPI](./installation.md) to get started
- [Quick Start](./quick-start.md) for a 2-minute walkthrough
- [Schema Guide](../schema/basics.md) to learn the schema format
