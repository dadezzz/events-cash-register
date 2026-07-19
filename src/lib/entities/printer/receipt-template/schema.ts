import * as v from "valibot";

export const textBlockSchema = v.object({
  type: v.literal("text"),
  text: v.pipe(
    v.string(),
    v.nonEmpty(),
    // Don't allow users to insert arbitrary blocks.
    v.transform((i) => i.replaceAll("{{", "\\{{")),
  ),
});

export type TextBlockData = v.InferOutput<typeof textBlockSchema>;

export function placeholderBlockSchema(entries: string[]) {
  return v.object({
    type: v.literal("placeholder"),
    placeholder: v.picklist(entries),
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
    type: v.literal("line"),
    blocks: v.pipe(v.optional(v.array(v.variant("type", blocks)), []), v.minLength(1, "Inserire almeno un elemento")),
  });
}

export type LineBlockData = v.InferOutput<ReturnType<typeof lineBlockSchema>>;

export const productOptionsBlockSchema = v.object({
  type: v.literal("productOptions"),
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
});

export type ProductOptionsBlockData = v.InferOutput<typeof productOptionsBlockSchema>;

export const productsBlockSchema = v.object({
  type: v.literal("products"),
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
});

export type ProductsBlockData = v.InferOutput<typeof productsBlockSchema>;

export const rootBlockSchema = v.object({
  type: v.literal("root"),
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
});

export type RootBlockData = v.InferOutput<typeof rootBlockSchema>;
export type BlockData = { type: string };
