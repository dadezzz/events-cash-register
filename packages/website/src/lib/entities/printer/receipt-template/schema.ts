import * as v from "valibot";

export const textBlockSchema = v.object({
  text: v.pipe(
    v.string(),
    v.nonEmpty(),
    // Don't allow users to insert arbitrary blocks.
    v.transform((i) => i.replaceAll("{{", "\\{{")),
  ),
  type: v.literal("text"),
});

export type TextBlockData = v.InferOutput<typeof textBlockSchema>;

export function placeholderBlockSchema(entries: string[]) {
  return v.object({
    placeholder: v.picklist(entries),
    type: v.literal("placeholder"),
  });
}

export type PlaceholderBlockData = v.InferOutput<ReturnType<typeof placeholderBlockSchema>>;

export const productOptionsPlaceholderBlockEntries = ["name", "price", "value"];
export const productPlaceholderBlockEntries = ["name", "price", "quantity"];
export const rootPlaceholderBlockEntries = [
  "date",
  "time",
  "orderTotalPrice",
  "orderDiscountPrice",
  "orderModifiedPrice",
  "orderCounter",
];

// Allows disposing more items on the same line.
export function lineBlockSchema(blocks: (typeof textBlockSchema | ReturnType<typeof placeholderBlockSchema>)[]) {
  return v.object({
    blocks: v.pipe(v.optional(v.array(v.variant("type", blocks)), []), v.minLength(1, "Inserire almeno un elemento")),
    type: v.literal("line"),
  });
}

export type LineBlockData = v.InferOutput<ReturnType<typeof lineBlockSchema>>;

export const productOptionsBlockSchema = v.object({
  blocks: v.pipe(
    v.optional(
      v.array(
        v.variant("type", [
          lineBlockSchema([textBlockSchema, placeholderBlockSchema(productOptionsPlaceholderBlockEntries)]),
        ]),
      ),
      [],
    ),
    v.minLength(1, "Inserire almeno un elemento"),
  ),
  type: v.literal("productOptions"),
});

export type ProductOptionsBlockData = v.InferOutput<typeof productOptionsBlockSchema>;

export const productsBlockSchema = v.object({
  blocks: v.pipe(
    v.optional(
      v.array(
        v.variant("type", [
          lineBlockSchema([textBlockSchema, placeholderBlockSchema(productPlaceholderBlockEntries)]),
          productOptionsBlockSchema,
        ]),
      ),
      [],
    ),
    v.minLength(1, "Inserire almeno un elemento"),
  ),
  type: v.literal("products"),
});

export type ProductsBlockData = v.InferOutput<typeof productsBlockSchema>;

export const rootBlockSchema = v.object({
  blocks: v.pipe(
    v.optional(
      v.array(
        v.variant("type", [
          lineBlockSchema([textBlockSchema, placeholderBlockSchema(rootPlaceholderBlockEntries)]),
          productsBlockSchema,
        ]),
      ),
      [],
    ),
    v.minLength(1, "Inserire almeno un elemento"),
  ),
  type: v.literal("root"),
});

export type RootBlockData = v.InferOutput<typeof rootBlockSchema>;
export type BlockData = { type: string };
