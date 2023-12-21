import matchExtension from './match-extension'

describe('Match extension', () => {
  const cases = [
    [['.md'], 'packages/foo/README.md', true],
    [['LICENSE'], 'LICENSE', true],
    [['.md'], 'packages/foo/bar.js', false],
  ]

  test.each(cases)(
    'given %p and %p as arguments, returns %p',
    (firstArg, secondArg, expectedResult) => {
      const result = matchExtension(firstArg as string[], secondArg as string)
      expect(result).toEqual(expectedResult)
    },
  )
})
