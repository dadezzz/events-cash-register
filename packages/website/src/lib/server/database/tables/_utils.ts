import { customType } from "drizzle-orm/sqlite-core";

export const timestamp = customType<{ data: Date }>({
  dataType: () => "text",
  fromDriver: (t) => new Date(t as string),
  toDriver: (d) => d.toISOString(),
});

export const boolean = customType<{ data: boolean }>({
  dataType: () => "int",
  fromDriver: (t) => t === 1,
  toDriver: (b) => (b ? 1 : 0),
});

export const json = customType<{ data: unknown }>({
  dataType: () => "text",
  fromDriver: (t) => JSON.parse(t as string),
  toDriver: (d) => JSON.stringify(d),
});
