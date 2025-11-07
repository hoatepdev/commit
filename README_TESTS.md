# Testing Documentation

## Overview

Commit.vn uses **Vitest** for unit and integration testing, with **React Testing Library** for component testing.

## Test Structure

Tests are organized in `__tests__` directories alongside the code they test:

```
src/
├── components/
│   ├── __tests__/
│   │   ├── navbar.test.tsx
│   │   └── proof-list.test.tsx
│   └── ui/
│       └── __tests__/
│           ├── button.test.tsx
│           └── card.test.tsx
├── hooks/
│   └── __tests__/
│       └── use-toast.test.ts
└── lib/
    └── __tests__/
        ├── utils.test.ts
        ├── cloudflare-r2.test.ts
        └── email.test.ts
```

## Running Tests

### Run all tests

```bash
npm test
# or
npm run test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with UI

```bash
npm run test:ui
```

### Run tests with coverage

```bash
npm run test:coverage
```

## Test Coverage

Current test files cover:

### ✅ Utils (`src/lib/__tests__/utils.test.ts`)

- `cn()` - Class name merging
- `formatCurrency()` - VND formatting
- `formatDate()` - Date formatting
- `getDaysRemaining()` - Date calculations

### ✅ Components

**Navbar** (`src/components/__tests__/navbar.test.tsx`)

- Renders logo and brand
- Shows auth buttons when logged out
- Shows user menu when logged in
- Hides on auth pages

**ProofList** (`src/components/__tests__/proof-list.test.tsx`)

- Empty state display
- Proof item rendering
- Media type icons
- Challenge button visibility
- Status badges

**Button** (`src/components/ui/__tests__/button.test.tsx`)

- All variants (default, secondary, outline, destructive, ghost)
- All sizes (sm, default, lg, icon)
- Disabled state
- Click handlers
- Custom className
- asChild prop

**Card** (`src/components/ui/__tests__/card.test.tsx`)

- Card component
- CardHeader, CardTitle, CardDescription
- CardContent, CardFooter
- Complete card composition

### ✅ Hooks (`src/hooks/__tests__/use-toast.test.ts`)

- Toast creation
- Toast dismissal
- Toast limits
- Standalone function
- Variants and actions

### ✅ Libraries

**Cloudflare R2** (`src/lib/__tests__/cloudflare-r2.test.ts`)

- File upload
- Signed upload URLs
- Signed download URLs

**Email** (`src/lib/__tests__/email.test.ts`)

- Squad invitation emails
- Proof notification emails
- Challenge completion emails
- Success/failure variants

## Writing Tests

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Utility Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../utils';

describe('myFunction', () => {
  it('returns expected value', () => {
    expect(myFunction('input')).toBe('output');
  });
});
```

### Mocking Example

```typescript
import { vi } from 'vitest';

// Mock module
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

// Mock function
const mockFn = vi.fn();

// Assertions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
```

## Test Patterns

### Testing Async Components

```typescript
it('loads data correctly', async () => {
  render(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { fireEvent } from '@testing-library/react';

it('handles click events', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);

  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Testing Forms

```typescript
it('submits form data', async () => {
  const handleSubmit = vi.fn();
  render(<Form onSubmit={handleSubmit} />);

  const input = screen.getByLabelText('Email');
  fireEvent.change(input, { target: { value: 'test@example.com' } });

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});
```

## Mocking Strategies

### Next.js Navigation

```typescript
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}));
```

### Supabase Client

```typescript
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => ({ data: mockData, error: null })),
      })),
    })),
  })),
  auth: {
    getUser: vi.fn(() => ({ data: { user: mockUser } })),
  },
};

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));
```

### External Services

```typescript
// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: { send: vi.fn() },
  })),
}));

// Mock AWS S3
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(),
  PutObjectCommand: vi.fn(),
}));
```

## Coverage Goals

Target coverage:

- **Utilities**: 100%
- **UI Components**: 90%+
- **Business Logic**: 85%+
- **Integration**: 70%+

## CI/CD Integration

Add to GitHub Actions:

```yaml
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state

2. **Use Descriptive Test Names**

   ```typescript
   // Good
   it('shows error message when email is invalid');

   // Bad
   it('test1');
   ```

3. **Arrange-Act-Assert Pattern**

   ```typescript
   it('updates count on click', () => {
     // Arrange
     render(<Counter />);

     // Act
     fireEvent.click(screen.getByText('Increment'));

     // Assert
     expect(screen.getByText('Count: 1')).toBeInTheDocument();
   });
   ```

4. **Clean Up After Tests**

   ```typescript
   afterEach(() => {
     vi.clearAllMocks();
   });
   ```

5. **Test Edge Cases**
   - Empty states
   - Loading states
   - Error states
   - Boundary values

## Debugging Tests

### View DOM in test

```typescript
import { screen } from '@testing-library/react';

screen.debug(); // Prints entire DOM
screen.debug(element); // Prints specific element
```

### Run single test

```bash
npm test -- button.test
```

### Run tests matching pattern

```bash
npm test -- --grep="Button"
```

## Future Testing TODO

- [ ] Add E2E tests with Playwright
- [ ] Add visual regression tests
- [ ] Add API route tests
- [ ] Add database integration tests
- [ ] Increase coverage to 80%+
- [ ] Add performance tests
- [ ] Add accessibility tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

Last updated: 2025-11-07
