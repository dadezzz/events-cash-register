/**
 * A simple collection of unique string IDs, used to represent a batch of items.
 *
 * @typeParam Id - The type of the IDs; must extend `string`.
 */
export class Batch<Id extends string> {
  /** The list of IDs in this batch. */
  ids: Id[];

  /**
   * Creates a new Batch with the given IDs.
   *
   * @param ids - The IDs to include in the batch.
   */
  constructor(ids: Id[]) {
    this.ids = ids;
  }
}

/**
 * A key-value store for batched items, mapping IDs to associated data.
 *
 * Accepts initial data as a `Map`, an array of `[Id, Data]` tuples, or a
 * plain object/record keyed by IDs.
 *
 * @typeParam Id - The type of the keys; must extend `string`.
 * @typeParam Data - The type of the values stored for each key.
 */
export class BatchRows<Id extends string, Data> {
  /** Internal storage backed by a `Map` of ID to data. */
  protected storage: Map<Id, Data>;

  /**
   * Creates a new BatchRows instance.
   *
   * @param storage - Initial data as a `Map`, an array of `[Id, Data]` tuples,
   *   or a plain object/record keyed by IDs.
   */
  constructor(storage: Map<Id, Data> | [Id, Data][] | Record<Id, Data>) {
    if (storage instanceof Map) {
      this.storage = storage;
    } else if (Array.isArray(storage)) {
      this.storage = new Map(storage);
    } else {
      this.storage = new Map(Object.entries(storage) as [Id, Data][]);
    }
  }

  /**
   * Retrieves the data associated with the given ID.
   *
   * @param id - The ID to look up.
   * @returns The associated data, or `null` if not found.
   */
  get(id: Id): Data | null {
    return this.storage.get(id) ?? null;
  }

  /**
   * Returns an iterator over all `[id, data]` pairs in the batch.
   */
  entries(): MapIterator<[Id, Data]> {
    return this.storage.entries();
  }

  /**
   * Returns an iterator over all data values in the batch.
   */
  values(): MapIterator<Data> {
    return this.storage.values();
  }
}
