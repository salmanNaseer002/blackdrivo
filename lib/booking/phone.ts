const RULES: Record<string, { length: number; format?: (d: string) => string }> = {
  US: { length: 10, format: usFormat },
  CA: { length: 10, format: usFormat },
  GB: { length: 10 },
  AU: { length: 9 },
  PK: { length: 10 },
  AE: { length: 9 },
};

function usFormat(d: string) {
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

export function formatPhone(value: string, countryCode: string): string {
  const digits = value.replace(/\D/g, "");
  const rule = RULES[countryCode];
  return rule?.format ? rule.format(digits) : digits;
}

export function isValidPhone(value: string, countryCode: string): boolean {
  const digits = value.replace(/\D/g, "");
  const rule = RULES[countryCode];
  if (rule) return digits.length === rule.length;
  return digits.length >= 7 && digits.length <= 15;
}
