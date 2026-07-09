import * as binding from "./binding.ts";

export type CupsConnectionData = unknown & { __brand: "CupsConnectionData" };
export type CupsPrinterData = unknown & { __brand: "CupsPrinterData" };
export type CupsPrinterInfoData = unknown & { __brand: "CupsPrinterInfoData" };

class ConcurrencySafeData<D> {
  private data: D;
  private mutex = new Int32Array(new SharedArrayBuffer(4));

  constructor(data: D) {
    this.data = data;
  }

  async get<R>(cs: (data: D) => Promise<R>): Promise<R> {
    // Avoids needing to copy all these lines for a single function call.
    try {
      const data = await this.lock();
      return await cs(data);
    } finally {
      this.unlock();
    }
  }

  private async lock(): Promise<D> {
    // Check if the mutex is not locked.
    while (Atomics.compareExchange(this.mutex, 0, 0, 1) !== 0) {
      // Wait until it becomes unlocked.
      const { value, async } = Atomics.waitAsync(this.mutex, 0, 1);

      if (async) {
        await value;
      }
    }

    return this.data;
  }

  private unlock() {
    // Unlock the mutex.
    Atomics.store(this.mutex, 0, 0);
    // Wake up one waiting thread.
    Atomics.notify(this.mutex, 0, 1);
  }
}

export class CupsConnection {
  private readonly url: URL;
  private data: ConcurrencySafeData<CupsConnectionData> | undefined = undefined;

  constructor(url: URL) {
    this.url = url;
  }

  // In the future this could also handle re-connections in case of failure.
  async connect<R>(cs: (data: CupsConnectionData) => Promise<R>): Promise<R> {
    if (!this.data) {
      const data = await binding.createConnection(this.url.href);
      this.data = new ConcurrencySafeData(data);
    }

    return this.data.get(cs);
  }

  async getPrinters(): Promise<CupsPrinter[]> {
    const printersData = await this.connect((c) => binding.getDests(c));
    return await Promise.all(printersData.map((pd) => CupsPrinter.create(this, pd.name, pd.data)));
  }
}

export class CupsPrinter {
  private readonly connection: CupsConnection;
  readonly name: string;
  private readonly data: CupsPrinterData;
  private readonly info: CupsPrinterInfoData;

  private constructor(connection: CupsConnection, name: string, data: CupsPrinterData, info: CupsPrinterInfoData) {
    this.connection = connection;
    this.name = name;
    this.data = data;
    this.info = info;
  }

  static async create(connection: CupsConnection, name: string, data: CupsPrinterData) {
    return await connection.connect(async (c) => {
      const info = await binding.destGetInfo(c, data);
      return new CupsPrinter(connection, name, data, info);
    });
  }

  async supportsMimeType(mimeType: string) {
    return this.connection.connect((c) =>
      Promise.resolve(binding.destSupportsMimeType(c, this.data, this.info, mimeType)),
    );
  }

  async getJobCreationAttributes() {
    return await this.connection.connect((c) =>
      Promise.resolve(binding.destGetJobCreationAttributes(c, this.data, this.info)),
    );
  }

  sendJob() {}
}
