# Request Logging

Log all incoming requests and responses for debugging.

## Enable Logging

Add the `--log` flag to any server command:

```bash
fexapi serve --log
fexapi dev --watch --log
```

## Log Format

Each request is logged when the response finishes:

```
[GET] /users → 200 (12ms)
[POST] /posts → 201 (8ms)
[GET] /unknown → 404 (2ms)
[OPTIONS] /users → 204 (1ms)
```

Format: `[METHOD] /path → statusCode (duration)`

## When to Use

Request logging is useful for:

- Verifying your frontend is hitting the right endpoints
- Debugging unexpected 404 responses
- Checking response times with the `delay` option
- Confirming CORS preflight requests are handled
