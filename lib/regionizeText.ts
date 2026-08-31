// Shared US→Pakistan text substitution, usable from both Server Components
// (metadata/JSON-LD, via the x-region header) and Client Components (via
// usePathname). Longest/most-specific patterns first so they win over the
// generic word-level swaps below them.
const REPLACEMENTS: [RegExp, string][] = [
  // Multi-city / multi-airport lists — most specific first
  [/JFK–Manhattan, EWR–Manhattan, LAX–Beverly Hills, O'Hare–Downtown Chicago, and MIA–Miami Beach/g,
    "Lahore–Islamabad, Karachi–Hyderabad, and Islamabad–Rawalpindi"],
  [/30\+ major US airports including JFK, LaGuardia, Newark, LAX, O'Hare, Miami International, Dallas\/Fort Worth, Las Vegas Harry Reid, Boston Logan, and many more/g,
    "major airports in Lahore, Karachi, and Islamabad"],
  [/40\+ US cities including New York, New Jersey, Los Angeles, Chicago, Miami, Dallas, Las Vegas, Boston, Washington DC, and more/g,
    "Lahore, Karachi, and Islamabad, with more cities coming soon"],
  [/New York, New Jersey, Los Angeles, Chicago, Miami, Dallas, Las Vegas, Boston, Washington DC/g,
    "Lahore, Karachi, and Islamabad"],
  [/ Stretch limousines start from \$150\/hour, with airport transfers from \$250\./g, ""],
  [/40\+ US cities and international destinations worldwide/g, "Lahore, Karachi, and Islamabad, with more cities coming soon"],
  [/40\+ US cities/g, "Lahore, Karachi, and Islamabad"],
  [/every major US airport/g, "every major Pakistani airport"],
  [/fully licensed, insured, and compliant in every state/g, "fully licensed and insured"],
  [/across the United States and beyond/g, "across Pakistan and beyond"],
  [/serve 30\+ major US airports/g, "serve major airports across Pakistan"],
  [/BlackDrivo's luxury limousine service is available across the United States, with operations in all major metropolitan areas\. From New York City and New Jersey to Los Angeles, Chicago, Miami, Dallas, Las Vegas, Phoenix, Seattle, Denver, and Boston — our network of professional chauffeurs and premium vehicles is ready to serve you wherever your travels take you\./g,
    "BlackDrivo's luxury limousine service is available across Pakistan, with operations in Lahore, Karachi, and Islamabad — our network of professional drivers and premium vehicles is ready to serve you wherever your travels take you."],
  [/Luxury Limousine Service Nationwide — Available in 40\+ Cities/g, "Luxury Limousine Service Across Pakistan"],
  [/all major US cities/g, "Lahore, Karachi, and Islamabad"],
  [/across the United States\./g, "across Pakistan."],
  [/America's premier luxury limousine service/g, "Pakistan's premier luxury limousine service"],

  // Testimonial location/role flavor text
  [/Manhattan Wedding/g, "Lahore Wedding"],
  [/VP · Goldman Sachs/g, "VP · Multinational Corporation"],
  [/Prom Night · NJ/g, "Prom Night · Islamabad"],
  [/Entertainment Executive · LA/g, "Business Executive · Karachi"],
  [/Anniversary Celebration · NYC/g, "Anniversary Celebration · Lahore"],
  [/the route through Manhattan/g, "the route through Lahore"],

  // Generic chauffeur/driver word swap — must come after the phrase-level
  // rules above so it doesn't partially match inside them first.
  [/chauffeured/g, "driver-driven"],
  [/Chauffeurs/g, "Drivers"],
  [/chauffeurs/g, "drivers"],
  [/Chauffeur/g, "Driver"],
  [/chauffeur/g, "driver"],
];

export function regionizeForPk(text: string, isPk: boolean): string {
  if (!isPk) return text;
  return REPLACEMENTS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
}
