/**
 * Used by all the 'client' classes that need to pass through the transport hook.
 * This gives a consistent and type-safe interface that doesn't need to be
 * reimplemented each time.
 *
 * D can contain only simple types, POJOs or other instances of Serializable.
 */
export class Serializable<D> {
  readonly data: Readonly<D>;

  constructor(data: D) {
    this.data = Object.freeze(data);
  }

  static deserialize<T extends typeof Serializable<D>, D>(this: T, data: D): InstanceType<T> {
    // biome-ignore lint/complexity/noThisInStatic: Needed to return an instance of extending class.
    // biome-ignore lint/suspicious/noExplicitAny: Unfortunately we have to do type shenanigans.
    return new (this as any)(data);
  }

  serialize(): D {
    return this.data;
  }
}
