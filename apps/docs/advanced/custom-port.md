# Custom Port

Configure which port the mock server listens on.

## Default Port

FexAPI defaults to port `4000`.

## Setting the Port

There are three effective sources for port selection, listed by priority:

### 1. CLI Flag (highest priority)

```bash
fexapi serve --port 5000
```

### 2. Config File

```js
module.exports = {
  port: 3000,
};
```

### 3. Generated Schema

```txt
fexapi/.cache/generated.api.json -> "port": 4100
```

## Priority Order

```
--port flag → fexapi.config.js port → generated schema port → 4000
```

## Custom Host

You can also bind to a specific host:

```bash
fexapi serve --host 0.0.0.0 --port 4000
```

The default host is `localhost`. Use `0.0.0.0` to accept connections from other devices on your network.
