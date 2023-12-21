import matchExtension from './match-extension'

/**
 * Group file locations based on the first group of regular expressions.
 * @param {string[]} files - An array of file paths or file addresses, such as ['packages/foo/bar.js', 'README.md']
 * @param {string[]} ignore - An array of file extensions that should be ignored, such as ['.md', 'LICENSE']
 * @param {RegExp} group_regex - A regular expression pattern that matches and groups package names. For example, the pattern /^packages/([^/]+)/(.+)$/ matches file paths with a structure like 'packages/[key]/[values].'
 * @returns {Object<string, string[]>}
 */
const groupPackagesChanged = (
  files: string[],
  ignore: string[] = [],
  group_regex = /^packages\/([^/]+)\/(.+)$/,
) => {
  return files
    .filter(
      (filename) => !matchExtension(ignore, filename) && filename.match(group_regex) !== null,
    )
    .map((filename) => {
      const [_, package_name, file] = filename.match(group_regex)!

      return {
        package_name,
        file,
      }
    })
    .reduce((prev, curr) => ({
      ...prev,
      [curr.package_name]: [
        ...(prev[curr.package_name] ?? []),
        curr.file,
      ],
    }), {})
}

export default groupPackagesChanged
