# API Test Suite

This directory contains comprehensive tests for the Blog/CMS API built with bun-sqlite-orm.

## Test Structure

```
tests/
├── api/
│   ├── simple-validation.test.ts  # Parameter validation tests ✅
│   ├── authentication.test.ts     # Auth middleware tests (WIP)
│   ├── users.test.ts              # User CRUD tests (WIP)
│   ├── parameter-validation.test.ts # Full API validation tests (WIP)
│   └── relationships.test.ts      # Relationship validation tests (WIP)
├── utils/
│   └── test-setup.ts              # Test utilities and factories (WIP)
└── README.md                      # This file
```

## Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/api/simple-validation.test.ts

# Run tests in watch mode
bun test:watch
```

## Test Coverage

### ✅ Parameter Validation (simple-validation.test.ts)
- **Purpose**: Validates the fix for CodeRabbit's parseInt issue
- **Coverage**: Tests all invalid ID formats that should be rejected
- **Key Tests**:
  - Rejects `"12abc"` (the original problem case)
  - Rejects floating point numbers like `"12.5"`
  - Rejects negative numbers and zero
  - Accepts valid positive integers
  - Demonstrates the difference between `parseInt()` and our `Number()` + validation approach

### 🚧 Authentication Tests (authentication.test.ts)
- **Purpose**: Ensures API key authentication works correctly
- **Status**: Created but needs database setup fixes

### 🚧 CRUD Operation Tests (users.test.ts)
- **Purpose**: Tests full CRUD operations for all entities
- **Status**: Created but needs database setup fixes

### 🚧 Relationship Validation Tests (relationships.test.ts)
- **Purpose**: Tests foreign key validation (author exists, post exists, etc.)
- **Status**: Created but needs database setup fixes

## Key Validation Logic

Our API now uses this validation pattern instead of the problematic `parseInt()`:

```typescript
validator('param', (value, c) => {
    const id = Number(value.id);
    if (!Number.isInteger(id) || id <= 0) {
        throw new HTTPException(400, {
            message: 'Invalid ID',
        });
    }
    return { id };
})
```

### Why This Is Better Than parseInt()

| Input | `parseInt()` | `Number()` + validation | Result |
|-------|-------------|-------------------------|---------|
| `"12abc"` | `12` ❌ | `NaN` → rejected ✅ | Fixed the bug |
| `"12.5"` | `12` ❌ | `12.5` → rejected ✅ | More strict |
| `"0"` | `0` ❌ | `0` → rejected ✅ | IDs must be positive |
| `"-5"` | `-5` ❌ | `-5` → rejected ✅ | IDs must be positive |
| `"123"` | `123` ✅ | `123` → accepted ✅ | Valid case works |

## Future Test Improvements

1. **Fix database setup** for integration tests
2. **Add performance tests** for large datasets
3. **Add edge case tests** for concurrent operations
4. **Add validation tests** for all entity fields
5. **Add test coverage reporting**

## Test Philosophy

- **Fast**: Simple validation tests run without database
- **Isolated**: Each test is independent
- **Comprehensive**: Cover edge cases and error conditions
- **Realistic**: Test actual API behavior, not just units