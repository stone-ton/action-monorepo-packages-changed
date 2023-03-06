import groupPackagesChanged from './group-package-changed'

describe('Group package changed', () => {
  it('should group packages name', () => {
    // Arrange
    const files = [
      'packages/package-1/src/index.js',
      'packages/package-1/src/foo.js',
      'packages/package-2/src/bar.js',
      'packages/package-3/src/README.md',
      'jest.config.js',
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

  it('should group packages name without ignore files', () => {
    // Arrange
    const files = [
      'packages/package-1/src/index.js',
      'packages/package-1/src/foo.js',
      'packages/package-2/src/bar.js',
      'packages/package-3/src/README.md',
      'jest.config.js',
    ]

    // Act
    const result = groupPackagesChanged(files)

    // Assert
    expect(result).toEqual({
      'package-1': ['src/index.js', 'src/foo.js'],
      'package-2': ['src/bar.js'],
      'package-3': ['src/README.md'],
    })
  })
})
