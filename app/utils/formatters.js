export function errorParser(data) {
  return (
    data?.request?.responseText
      ?.replaceAll("{", "")
      ?.replaceAll("}", "")
      ?.replaceAll("[", "")
      ?.replaceAll("]", "")
      ?.replaceAll("\\", "")
      ?.replaceAll(":", " ")
      ?.replaceAll('"', "") || data
  );
}

export function formatPrice(
  price,
  { currency = "Ugx", absolute = true, defaultValue = 0 } = {}
) {
  if (price == 0 || null === price) {
    return defaultValue;
  } else if (price == "") {
    return "";
  }
  return absolute == true
    ? `${Math.abs(price)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${currency}`
    : `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${currency}`;
}
