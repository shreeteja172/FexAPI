---
layout: home

hero:
  name: "FexAPI"
  text: "Peak Mock APIs, Fast"
  tagline: "Schema-first mock API CLI for frontend teams that move fast."
  actions:
    - theme: brand
      text: Start in 2 Minutes
      link: /getting-started/quick-start
    - theme: alt
      text: CLI Reference
      link: /cli/overview

features:
  - title: Schema-First by Default
    details: "Define routes in fexapi/schema.fexapi and generate one canonical API spec."
  - title: Dev Watch That Explains Itself
    details: "fexapi dev --watch auto-generates on schema edits, reloads server, and prints clear watch actions."
  - title: Minimal Output Surface
    details: "Only the essential generated file is produced: fexapi/generated.api.json."
  - title: Realistic Data Out of the Box
    details: "Built-in faker-backed field types for fast, believable frontend development."
  - title: Override-Friendly Runtime
    details: "fexapi.config.js can add route-level count and schema settings while schema routes stay authoritative."
  - title: Clean CLI UX
    details: "Consistent command output, summaries, and strict argument handling."
---

## Core Flow

```bash
fexapi init
# edit fexapi/schema.fexapi
fexapi generate
fexapi dev --watch --log
```

## What Init Creates

```txt
fexapi/schema.fexapi
fexapi.config.js
```

## What Generate Creates

```txt
fexapi/generated.api.json
```

## Jump In

- [Quick Start](./getting-started/quick-start.md)
- [Configuration](./getting-started/configuration.md)
- [fexapi dev](./cli/dev.md)
- [Troubleshooting](./advanced/troubleshooting.md)
