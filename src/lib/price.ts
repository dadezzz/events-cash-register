/**
 * Converts the price amount to a euros string where cents are always 2 digits.
 *
 * We don't need to handle other currencies since we won't be selling outside of
 * the EU.
 *
 * @param price Decimal number representing the price in euros.
 * @returns The price converted to a string.
 */
export function priceToString(price: number): string {
  const priceParts = price.toString().split(".");

  // Euros are always defined, (at least 0).
  const euros = priceParts[0];
  // The part after the . can be undefined if the price is an integer. In that
  // case we set them to 00.
  const cents = priceParts.at(1)?.slice(0, 2).padEnd(2, "0") ?? "00";

  return `${euros}.${cents}`;
}
