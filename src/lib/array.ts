export function getFirstOptional<T>(t: T[]): T | null {
  return t.at(0) ?? null;
}

export function getFirstOrThrow<T>(t: T[]): T {
  const t0 = t.at(0);
  if (!t0) throw new Error("first array element is not defined");
  return t0;
}

export function* iteratorToNumber(start: number, end: number) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}
