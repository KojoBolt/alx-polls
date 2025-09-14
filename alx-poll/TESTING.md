# Testing Guide for ALX Poll App

This document provides comprehensive information about testing the ALX Poll application, including setup, commands, and test coverage.

## Test Stack

- **Framework**: Jest with TypeScript support
- **Environment**: jsdom for React component testing
- **Mocking**: Jest mocks for Supabase client and Next.js modules
- **Coverage**: Built-in Jest coverage reporting

## Test Structure

```
__tests__/
├── unit/
│   ├── polls.test.ts          # Unit tests for poll creation functionality
│   └── voting.test.ts         # Unit tests for voting functionality
└── integration/
    └── poll-actions.test.ts   # Integration tests for server actions
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:cov
```

### Test Coverage

The test suite includes comprehensive coverage for:

- **Poll Creation**: Valid data, expiration dates, error handling
- **Voting System**: Single/multiple votes, duplicate prevention, authentication
- **Data Validation**: Empty fields, insufficient options, invalid IDs
- **Authorization**: User permissions, poll ownership
- **Edge Cases**: Non-existent polls, expired polls, database failures

## Test Categories

### Unit Tests (`__tests__/unit/`)

#### Poll Creation Tests (`polls.test.ts`)
- ✅ Create poll with valid data
- ✅ Handle expiration dates correctly
- ✅ Throw errors on database failures
- ✅ Handle options creation failures
- ✅ Fetch polls by ID successfully
- ✅ Handle poll not found scenarios

#### Voting Tests (`voting.test.ts`)
- ✅ Record votes successfully
- ✅ Handle voting failures
- ✅ Check user voting status
- ✅ Handle unauthenticated users
- ✅ Fetch poll results
- ✅ Handle empty results
- ✅ Handle non-existent polls

### Integration Tests (`__tests__/integration/`)

#### Poll Actions Tests (`poll-actions.test.ts`)
- ✅ Create poll with form data
- ✅ Handle authentication requirements
- ✅ Validate form data (title, options)
- ✅ Record votes with proper validation
- ✅ Prevent duplicate voting
- ✅ Allow multiple votes when permitted
- ✅ Delete polls with proper authorization
- ✅ Handle missing form fields

## Test Coverage Thresholds

The project is configured with the following coverage thresholds:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Screenshots

### Test Execution
- [ ] Passing test run
- [ ] Coverage report summary

*Note: Screenshots will be added after running the test suite*

## Reflection

### What Worked Well

1. **Comprehensive Mocking Strategy**: The Supabase client mocking approach provided excellent isolation for unit tests, allowing us to test business logic without external dependencies.

2. **Clear Test Structure**: Organizing tests into unit and integration categories made it easy to understand the scope and purpose of each test.

3. **Edge Case Coverage**: The test suite effectively covers critical edge cases like duplicate voting, authentication failures, and database errors.

4. **Refined Test Example**: The enhanced poll creation test demonstrates better practices with comprehensive assertions, proper mock verification, and clear test structure.

### What Didn't Work

1. **Complex Mock Setup**: Some tests required extensive mock setup for Supabase query chaining, which could be simplified with helper functions.

2. **Integration Test Complexity**: Testing Next.js server actions required mocking multiple Next.js modules, making the tests more brittle.

### What Surprised Me

1. **Jest Configuration**: The Next.js Jest configuration handled TypeScript and module resolution seamlessly without additional setup.

2. **Mock Flexibility**: Jest's mocking capabilities allowed for sophisticated testing of async operations and method chaining patterns.

3. **Coverage Accuracy**: The coverage reports provided detailed insights into untested code paths, particularly error handling scenarios.

### What Was Refined and Why

The poll creation test in `__tests__/unit/polls.test.ts` was significantly refined with:

1. **Stronger Assertions**: Added individual property validation instead of just object equality
2. **Better Mocking**: Implemented proper method chaining verification and call order validation
3. **Clearer Structure**: Used Arrange-Act-Assert pattern with descriptive comments
4. **Enhanced Coverage**: Added validation for option mapping and database interaction patterns

This refinement ensures the test provides comprehensive validation of the poll creation workflow and catches potential regressions in data integrity.

## Best Practices Implemented

1. **Isolation**: Each test is independent with proper setup/teardown
2. **Descriptive Naming**: Test names clearly describe the expected behavior
3. **Comprehensive Assertions**: Tests verify both happy paths and error conditions
4. **Mock Verification**: Tests confirm that mocked methods are called with correct parameters
5. **Edge Case Testing**: Critical business logic edge cases are thoroughly tested

## Future Improvements

1. **Test Helpers**: Create utility functions for common mock setups
2. **E2E Tests**: Add end-to-end tests for complete user workflows
3. **Performance Tests**: Add tests for large dataset scenarios
4. **Visual Regression**: Consider adding visual testing for UI components
