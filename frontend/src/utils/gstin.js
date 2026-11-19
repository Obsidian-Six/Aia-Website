
const GSTIN_REGEX =
  /^(0[1-9]|[1-2][0-9]|3[0-8]|97|99)[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const GSTIN_CHAR_VALUES = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const normalizeGSTIN = (value = "") => {
  return String(value)
    .toUpperCase()
    .replace(/\s/g, "")
    .trim();
};

export const isValidGSTIN = (value = "") => {
  const gstin = normalizeGSTIN(value);

  // GSTIN is optional.
  if (!gstin) return true;

  if (!GSTIN_REGEX.test(gstin)) {
    return false;
  }

  const chars = gstin.slice(0, 14).split("").reverse();

  let factor = 2;
  let sum = 0;

  for (const char of chars) {
    const product =
      GSTIN_CHAR_VALUES.indexOf(char) * factor;

    sum +=
      Math.floor(product / 36) +
      (product % 36);

    factor = factor === 2 ? 1 : 2;
  }

  const checkDigit = (36 - (sum % 36)) % 36;

  return (
    GSTIN_CHAR_VALUES[checkDigit] === gstin[14]
  );
};
