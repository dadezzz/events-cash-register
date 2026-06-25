import { getRequestEvent } from "$app/server";

/**
 * Stores an item in AsyncLocalStorage for the whole duration of the request.
 */
export class LocalsCache<T> {
  private readonly key = Symbol();
  private readonly getCallback: () => Promise<T> | T;

  constructor(getCallback: () => Promise<T> | T) {
    this.getCallback = getCallback;
  }

  /**
   * Tries to get a value from the cache and if it't missing lazyly computes it
   * from getCallback.
   *
   * @returns The found or inserted value.
   */
  async get(): Promise<T> {
    const locals = getRequestEvent().locals;

    if (!Object.hasOwn(locals, this.key)) {
      // @ts-expect-error Symbol works here.
      locals[this.key] = await this.getCallback();
    }

    // @ts-expect-error Symbol works here.
    return locals[this.key] as T;
  }
}
