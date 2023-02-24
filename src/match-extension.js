/**
 * Check if the file extension matches the filename.
 * @param {string[]} extensions - Array of extensions ex: ['.md', 'LICENSE']
 * @param {string} filename - Location of file
 */
const matchExtension = (extensions, filename) => {
  return extensions.some((ext) => filename.endsWith(ext))
}

module.exports = matchExtension
