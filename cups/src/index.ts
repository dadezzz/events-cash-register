import * as binding from "./binding.ts";

export type CupsConnectionData = unknown & { __brand: "CupsConnectionData" };
export type CupsPrinterData = unknown & { __brand: "CupsPrinterData" };
export type CupsPrinterInfoData = unknown & { __brand: "CupsPrinterInfoData" };

export class CupsConnection {
  readonly data: CupsConnectionData;

  constructor(data: CupsConnectionData) {
    this.data = data;
  }

  static async create(url: URL): Promise<CupsConnection> {
    const data = await binding.httpConnectUri(url.href);
    return new CupsConnection(data);
  }

  async getPrinters(): Promise<CupsPrinter[]> {
    const printersData = await binding.cupsGetDests(this.data);
    return printersData.map((p) => new CupsPrinter(this, p.name, p.default, p.data));
  }
}

export class CupsPrinter {
  readonly connection: CupsConnection;
  readonly name: string;
  readonly isDefault: boolean;
  readonly data: CupsPrinterData;

  constructor(connection: CupsConnection, name: string, isDefault: boolean, data: CupsPrinterData) {
    this.connection = connection;
    this.name = name;
    this.isDefault = isDefault;
    this.data = data;
  }

  getInfo() {}

  sendJob() {}
}
