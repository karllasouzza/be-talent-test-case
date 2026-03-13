import fc from 'fast-check'
import { test } from '@japa/runner'
import { Left, Right, left, right } from '../../../src/core/either/either.ts'
import type { Either } from '../../../src/core/either/either.ts'

function divide(a: number, b: number): Either<string, number> {
  if (b === 0) return left('division by zero')
  return right(a / b)
}

test.group('Either', () => {
  // Right
  test('IsRigth returns true and IsLeft returns false', ({ assert }) => {
    const r = right<string, number>(42)
    assert.equal(r.isRight(), true)
    assert.equal(r.isLeft(), false)
  })

  test('Value contains the wrapped right value', ({ assert }) => {
    const r = right<string, number>(99)
    assert.equal(r.value, 99)
  })

  test('new Right() constructs correctly', ({ assert }) => {
    const r = new Right<string, number>(7)
    assert.equal(r.isRight(), true)
    assert.equal(r.value, 7)
  })

  // Left
  test('isLeft() returns true and isRight() returns false', ({ assert }) => {
    const l = left<string, number>('error')
    assert.equal(l.isLeft(), true)
    assert.equal(l.isRight(), false)
  })

  test('value contains the wrapped left value', ({ assert }) => {
    const l = left<string, number>('something went wrong')
    assert.equal(l.value, 'something went wrong')
  })

  test('new Left() constructs correctly', ({ assert }) => {
    const l = new Left<string, number>('direct')
    assert.equal(l.isLeft(), true)
    assert.equal(l.value, 'direct')
  })

  // Helper functions
  test('left() produces a Left instance', ({ assert }) => {
    const l = left<string, number>('h')
    assert.instanceOf(l, Left)
  })

  test('right() produces a Right instance', ({ assert }) => {
    const r = right<string, number>(7)
    assert.instanceOf(r, Right)
  })

  // Divide example use-case
  test('returns Right for valid division', ({ assert }) => {
    const result = divide(10, 2)
    assert.equal(result.isRight(), true)
    assert.equal(result.value, 5)
  })

  test("returns Left('division by zero') when denominator is zero", ({ assert }) => {
    const result = divide(10, 0)
    assert.equal(result.isLeft(), true)
    assert.equal(result.value, 'division by zero')
  })

  // Property-based tests
  test('Right always yields isRight=true and isLeft=false for any value', ({ assert }) => {
    fc.assert(
      fc.property(fc.anything(), (val) => {
        const r = new Right(val)
        assert.equal(r.isRight(), true)
        assert.equal(r.isLeft(), false)
        assert.equal(r.value, val)
      }),
      { numRuns: 200 }
    )
  })

  test('Left always yields isLeft=true and isRight=false for any value', ({ assert }) => {
    fc.assert(
      fc.property(fc.anything(), (val) => {
        const l = new Left(val)
        assert.equal(l.isLeft(), true)
        assert.equal(l.isRight(), false)
        assert.equal(l.value, val)
      }),
      { numRuns: 200 }
    )
  })

  test('a Right is never a Left', ({ assert }) => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        const r = right<string, number>(n)
        assert.equal(r.isRight() && !r.isLeft(), true)
      }),
      { numRuns: 100 }
    )
  })
})
