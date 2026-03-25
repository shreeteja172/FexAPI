# Custom Port

Configure which port the mock server listens on.

## Default Port

FexAPI defaults to port `4000`.

## Setting the Port

There are three ways to configure the port, listed by priority:

### 1. CLI Flag (highest priority)

```bash
fexapi serve --port 5000
```

### 2. Schema File

```txt
port: 4100
```

### 3. Config File (lowest priority)

```js
module.exports = {
  port: 3000,
}
```

## Priority Order

```
--port flag → schema.fexapi port → config file port → 4000
```

## Custom Host

You can also bind to a specific host:

```bash
fexapi serve --host 0.0.0.0 --port 4000
```

The default host is `127.0.0.1` (localhost only). Use `0.0.0.0` to accept connections from other devices on your network.
