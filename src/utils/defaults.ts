export function withDefaultOnError<A, B>(cb: () => A, defaultValue: B): A | B {
  try {
    return cb();
  }
  catch {
    return defaultValue;
  }
}

export async function withDefaultOnErrorAsync<A, B>(cb: () => A, defaultValue: B): Promise<Awaited<A> | B> {
  try {
    return await cb();
  }
  catch {
    return defaultValue;
  }
}
