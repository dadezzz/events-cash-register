import { logger } from "#lib/server/logger/request.ts";
import { getRequestEvent } from "$app/server";

/**
 * Request-scoped cache that stores a value in `event.locals` for the
 * duration of a single request. Values are computed lazily on first access
 * and reused on subsequent calls within the same request.
 *
 * This is useful for avoiding redundant database queries or expensive
 * computations across multiple components/hooks in the same request.
 *
 * @typeParam T - The type of the cached value.
 */
export class LocalsCache<T> {
  private readonly key = Symbol();
  private readonly name: string;
  private readonly getCallback: () => Promise<T> | T;

  /**
   * Creates a new `LocalsCache`.
   *
   * @param name - Used to identify the cache in logs.
   * @param getCallback - A function that produces the value to cache. This
   *   function is only called on the first access; subsequent calls to
   *   {@link get} return the cached value.
   */
  constructor(name: string, getCallback: () => Promise<T> | T) {
    this.name = name;
    this.getCallback = getCallback;
  }

  /**
   * Retrieves the cached value, computing it lazily on first access
   * via `getCallback` if not yet present.
   *
   * @returns The cached (or newly computed) value.
   */
  async get(): Promise<T> {
    const locals = getRequestEvent().locals;

    if (!Object.hasOwn(locals, this.key)) {
      // @ts-expect-error Symbol works here.
      locals[this.key] = await this.getCallback();
    } else {
      logger.debug({ message: "locals cache hit", cacheName: this.name });
    }

    // @ts-expect-error Symbol works here.
    return locals[this.key] as T;
  }
}
