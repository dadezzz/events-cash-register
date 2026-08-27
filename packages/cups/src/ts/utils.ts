import * as v from "valibot";

export type JobCreationAttributesAvailable = (
  | { name: string; type: "number"; constraints: { min: number; max: number }; default: number }
  | { name: string; type: "string"; constraints: { entries: string[] }; default: string }
)[];

export type JobCreationAttributesSelected = {
  name: string;
  value: JobCreationAttributesAvailable[number]["default"];
}[];

export type JobId = number & { __brand: "JobId" };

export function jobCreationAttributeSchema(attribute: JobCreationAttributesAvailable[number]) {
  switch (attribute.type) {
    case "number":
      return v.pipe(
        v.number(),
        v.integer(),
        v.check((i) => i >= attribute.constraints.min && i <= attribute.constraints.max),
      );
    case "string":
      return v.pipe(v.string(), v.picklist(attribute.constraints.entries));
  }
}
