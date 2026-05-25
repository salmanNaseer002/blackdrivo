// lib/data/locations.ts
// Default countries & cities — can be overridden by DB data

export interface City {
  name: string
  code: string
}

export interface Country {
  name: string
  code: string       // ISO 2-letter
  flag: string
  phoneCode: string  // e.g. +1
  phoneFormat: string // e.g. (###) ###-####
  phonePlaceholder: string
  currency: string
  cities: City[]
}

export const DEFAULT_COUNTRIES: Country[] = [
  {
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    phoneCode: "+1",
    phoneFormat: "(###) ###-####",
    phonePlaceholder: "(555) 000-0000",
    currency: "USD",
    cities: [
      { name: "New York",     code: "NYC" },
      { name: "Atlanta",      code: "ATL" },
      { name: "Los Angeles",  code: "LAX" },
      { name: "Chicago",      code: "CHI" },
      { name: "Miami",        code: "MIA" },
      { name: "Houston",      code: "HOU" },
      { name: "Washington DC",code: "DCA" },
      { name: "San Francisco",code: "SFO" },
    ],
  },
  {
    name: "Pakistan",
    code: "PK",
    flag: "🇵🇰",
    phoneCode: "+92",
    phoneFormat: "### #######",
    phonePlaceholder: "300 0000000",
    currency: "PKR",
    cities: [
      { name: "Lahore",     code: "LHE" },
      { name: "Karachi",    code: "KHI" },
      { name: "Islamabad",  code: "ISB" },
      { name: "Rawalpindi", code: "RWP" },
      { name: "Faisalabad", code: "FSD" },
      { name: "Multan",     code: "MUX" },
      { name: "Peshawar",   code: "PEW" },
      { name: "Quetta",     code: "UET" },
    ],
  },
  {
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    phoneCode: "+44",
    phoneFormat: "#### ######",
    phonePlaceholder: "7911 123456",
    currency: "GBP",
    cities: [
      { name: "London",     code: "LON" },
      { name: "Manchester", code: "MAN" },
      { name: "Birmingham", code: "BHX" },
      { name: "Edinburgh",  code: "EDI" },
    ],
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    phoneCode: "+971",
    phoneFormat: "## ### ####",
    phonePlaceholder: "50 123 4567",
    currency: "AED",
    cities: [
      { name: "Dubai",       code: "DXB" },
      { name: "Abu Dhabi",   code: "AUH" },
      { name: "Sharjah",     code: "SHJ" },
    ],
  },
]
