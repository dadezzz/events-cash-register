export function errorStackForLog(stack?: string): string[] {
  return stack?.split(/\n\s*at /).splice(1) ?? [];
}
