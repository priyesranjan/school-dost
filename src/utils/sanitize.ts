/**
 * Input sanitization utilities to prevent XSS.
 * Strips HTML tags and dangerous patterns from user input.
 */

/**
 * Remove HTML tags and encode special characters
 */
export function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Strip all HTML tags (for when you need plain text, not encoded HTML)
 */
export function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

/**
 * Sanitize all string fields of an object (shallow)
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj }
  for (const key in result) {
    if (typeof result[key] === 'string') {
      (result as Record<string, unknown>)[key] = stripTags(result[key] as string).trim()
    }
  }
  return result
}
