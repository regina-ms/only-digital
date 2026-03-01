export function getYearRange(content: { year: number; text: string }[]) {
  const years = content?.map((event) => event.year)
  return {
    from: Math.min(...years),
    to: Math.max(...years),
  }
}
