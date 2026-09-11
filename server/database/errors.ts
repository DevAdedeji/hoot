export function databaseErrorCode(error: unknown): string | undefined {
  const seen = new Set<unknown>()
  let current = error

  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current)
    const value = current as { cause?: unknown; code?: unknown }
    if (typeof value.code === 'string') return value.code
    current = value.cause
  }

  return undefined
}
