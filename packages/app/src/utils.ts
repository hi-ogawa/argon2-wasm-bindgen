export async function measureAsync(f: () => Promise<void>): Promise<number> {
  const t0 = performance.now();
  await f();
  const t1 = performance.now();
  return t1 - t0;
}
