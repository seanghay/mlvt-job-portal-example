// Lab 3: build this with tests first.
//
// Spec: is this a valid Cambodian mobile number?
// - Accept local numbers that start with 0: "012 345 678", "012345678", "096 123 4567"
// - Accept international numbers: "+855 12 345 678", "85512345678"
// - Spaces and dashes are allowed between digits
// - After the leading 0, there are 8 or 9 more digits
// - Reject anything else: "123", "012 345", "abc", "", "+66 81 234 5678"
//
// Steps:
// 1. Ask Claude to write tests for this spec in phone.test.ts. Do not implement yet.
// 2. Run `npm test` and see them fail.
// 3. Commit the tests.
// 4. Ask Claude to implement until the tests pass, without changing the tests.

export function isValidCambodianPhone(_input: string): boolean {
  throw new Error('Not implemented yet')
}
