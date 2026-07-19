import handlebars, { type TemplateDelegate } from "handlebars";
import type * as v from "valibot";
import type { ProductOptionsBlockData, ProductsBlockData, RootBlockData, rootBlockSchema } from "./schema.ts";

export interface TemplateData {
  date: string;
  time: string;
  order: {
    totalPrice: string;
    discountPrice: string;
    modifiedPrice: string;
    counter: string;
  };
  products: {
    name: string;
    quantity: string;
    price: string;
    options: {
      name: string;
      value: string;
      price: string;
    }[];
  }[];
}

function parseProductOptionTemplateBlock(block: ProductOptionsBlockData) {
  let template = "";

  for (const l of block.blocks) {
    template += "<p>\n";

    for (const b of l.blocks) {
      switch (b.type) {
        case "text": {
          template += `<span>${b.text}</span>\n`;
          break;
        }
        case "placeholder": {
          switch (b.placeholder) {
            case "value":
              template += "<span>{{ this.value }}</span>\n";
              break;
            case "name":
              template += "<span>{{ this.name }}</span>\n";
              break;
            case "price":
              template += "<span>{{ this.price }} €</span>\n";
              break;
          }

          break;
        }
      }
    }

    template += "</p>\n";
    break;
  }

  return template;
}

function parseProductTemplateBlock(block: ProductsBlockData) {
  let template = "";

  for (const b of block.blocks) {
    switch (b.type) {
      case "line": {
        template += "<p>\n";

        for (const l of b.blocks) {
          switch (l.type) {
            case "text": {
              template += `<span>${l.text}</span>\n`;
              break;
            }
            case "placeholder": {
              switch (l.placeholder) {
                case "quantity":
                  template += "<span>{{ this.quantity }}</span>\n";
                  break;
                case "name":
                  template += "<span>{{ this.name }}</span>\n";
                  break;
                case "price":
                  template += "<span>{{ this.price }} €</span>\n";
                  break;
              }

              break;
            }
          }
        }

        template += "</p>\n";
        break;
      }
      case "productOptions": {
        template += `<ul>\n{{#each this.options}}\n<li>\n${parseProductOptionTemplateBlock(b)}</li>\n{{/each}}\n</ul>\n`;
        break;
      }
    }
  }

  return template;
}

function parseRootTemplateBlock(block: RootBlockData) {
  let template = "";

  for (const b of block.blocks) {
    switch (b.type) {
      case "line":
        template += `<p>\n`;

        for (const l of b.blocks) {
          switch (l.type) {
            case "text": {
              template += `<span>${l.text}</span>\n`;
              break;
            }
            case "placeholder": {
              switch (l.placeholder) {
                case "date":
                  template += `<span>{{ date }}</span>\n`;
                  break;
                case "time":
                  template += `<span>{{ time }}</span>\n`;
                  break;
                case "orderTotalPrice":
                  template += `<span>{{ order.totalPrice }}</span>\n`;
                  break;
                case "orderDiscountPrice":
                  template += `<span>{{ order.discountPrice }}</span>\n`;
                  break;
                case "orderModifiedPrice":
                  template += `<span>{{ order.modifiedPrice }}</span>\n`;
                  break;
                case "orderCounter":
                  template += `<span>{{ order.counter }}</span>\n`;
                  break;
              }

              break;
            }
          }
        }

        template += "</p>\n";
        break;
      case "products":
        template += `<ul>\n{{#each products}}\n<li>\n${parseProductTemplateBlock(b)}</li>\n{{/each}}\n</ul>\n`;
        break;
    }
  }

  return template;
}

export function renderReceiptTemplate(rootBlock: v.InferOutput<typeof rootBlockSchema>): TemplateDelegate {
  return handlebars.compile(parseRootTemplateBlock(rootBlock));
}

export function renderReceiptHtml(template: TemplateDelegate, data: TemplateData): string {
  return template(data);
}
