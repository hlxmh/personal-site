const path = require('path')

const markdownExtension = '.md'
const safePostIdPattern = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

function getPostId(fileName) {
  const id = path.basename(fileName, markdownExtension)
  if (!safePostIdPattern.test(id)) {
    throw new Error(
      `Invalid post filename "${fileName}": use only letters, numbers, hyphens, and underscores.`,
    )
  }
  return id
}

function isSafePostId(id) {
  return safePostIdPattern.test(id)
}

function validatePostMetadata(fileName, data) {
  if (typeof data.title !== 'string' || data.title.trim().length === 0) {
    throw new Error(
      `Invalid post front matter in "${fileName}": "title" must be a non-empty string.`,
    )
  }
  if (typeof data.date !== 'string' || data.date.trim().length === 0) {
    throw new Error(
      `Invalid post front matter in "${fileName}": "date" must be a non-empty string.`,
    )
  }

  const date = data.date.trim()
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) {
    throw new Error(
      `Invalid post front matter in "${fileName}": "date" must be a valid calendar date in YYYY-MM-DD format.`,
    )
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const parsedDate = new Date(0)
  parsedDate.setUTCHours(0, 0, 0, 0)
  parsedDate.setUTCFullYear(year, month - 1, day)

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    throw new Error(
      `Invalid post front matter in "${fileName}": "date" must be a valid calendar date in YYYY-MM-DD format.`,
    )
  }

  return { title: data.title.trim(), date }
}

module.exports = { getPostId, isSafePostId, validatePostMetadata }
