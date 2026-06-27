export class Batch<Id extends string> {
  ids: Id[];

  constructor(ids: Id[]) {
    this.ids = ids;
  }
}

export class BatchRows<Id extends string, Data> {
  protected storage: Map<Id, Data>;

  constructor(storage: Map<Id, Data> | [Id, Data][] | Record<Id, Data>) {
    if (storage instanceof Map) {
      this.storage = storage;
    } else if (Array.isArray(storage)) {
      this.storage = new Map(storage);
    } else {
      this.storage = new Map(Object.entries(storage) as [Id, Data][]);
    }
  }

  get(id: Id): Data | null {
    return this.storage.get(id) ?? null;
  }

  entries(): MapIterator<[Id, Data]> {
    return this.storage.entries();
  }

  values(): MapIterator<Data> {
    return this.storage.values();
  }
}
