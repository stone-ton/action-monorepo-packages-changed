const groupPackagesChanged = require('./group-package-changed')

describe('Group package changed', () => {
  it('should group packages name', () => {
    // Arrange
    const files = [
      {
        filename: 'packages/package-1/src/index.js',
      },
      {
        filename: 'packages/package-1/src/foo.js',
      },
      {
        filename: 'packages/package-2/src/bar.js',
      },
      {
        filename: 'packages/package-3/src/README.md',
      },
      {
        filename: 'jest.config.js',
      },
    ]
    const ignore = ['.md']

    // Act
    const result = groupPackagesChanged(files, ignore)

    // Assert
    expect(result).toEqual({
      'package-1': ['src/index.js', 'src/foo.js'],
      'package-2': ['src/bar.js'],
    })
  })

  it('should return empty object when files is not an array', () => {
    // Arrange
    const files = undefined
    const ignore = ['.md']

    // Act
    const result = groupPackagesChanged(files, ignore)

    // Assert
    expect(result).toEqual({})
  })
})
