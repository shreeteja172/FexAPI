# Testing with FexAPI

Use FexAPI to provide consistent mock data for your test suite.

## Setup

Add FexAPI as a dev dependency:

```bash
npm install -D fexapi
```

Add a test script that starts FexAPI before running tests:

```json
{
  "scripts": {
    "test:mock": "fexapi serve &",
    "test": "npm run test:mock && vitest"
  }
}
```

## Integration Tests

```js
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

const API_URL = 'http://localhost:4000'

describe('User API', () => {
  it('should return users', async () => {
    const res = await fetch(`${API_URL}/users?count=5`)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.users).toHaveLength(5)
    expect(data.users[0]).toHaveProperty('id')
    expect(data.users[0]).toHaveProperty('name')
    expect(data.users[0]).toHaveProperty('email')
  })

  it('should return 404 for unknown routes', async () => {
    const res = await fetch(`${API_URL}/unknown`)
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.message).toBe('Route not found')
    expect(data.availableRoutes).toBeDefined()
  })
})
```

## Component Tests

Use FexAPI to provide data for component-level tests:

```jsx
import { render, screen, waitFor } from '@testing-library/react'
import UserList from './UserList'

test('renders user list', async () => {
  render(<UserList />)

  await waitFor(() => {
    expect(screen.getByRole('list')).toBeInTheDocument()
  })
})
```

## Tips

- Use a dedicated port for tests to avoid conflicts with dev
- Add `delay: 0` to your test config for faster tests
- FexAPI generates random data — test for structure, not specific values
