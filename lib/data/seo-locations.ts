export interface SeoCity {
  name:    string;
  slug:    string;
  state:   string;
  country: string;
  airport: string;
  pop:     string;
}

export interface SeoAirport {
  name:    string;
  slug:    string;
  code:    string;
  city:    string;
  state:   string;
  country: string;
}

export const cities: SeoCity[] = [
  { name: "New York",        slug: "new-york",        state: "NY", country: "USA", airport: "JFK / LGA / EWR", pop: "8.3M"  },
  { name: "New Jersey",      slug: "new-jersey",      state: "NJ", country: "USA", airport: "EWR",             pop: "9.3M"  },
  { name: "Los Angeles",     slug: "los-angeles",     state: "CA", country: "USA", airport: "LAX",             pop: "3.9M"  },
  { name: "Chicago",         slug: "chicago",         state: "IL", country: "USA", airport: "ORD / MDW",       pop: "2.7M"  },
  { name: "Houston",         slug: "houston",         state: "TX", country: "USA", airport: "IAH / HOU",       pop: "2.3M"  },
  { name: "Miami",           slug: "miami",           state: "FL", country: "USA", airport: "MIA / FLL",       pop: "450K"  },
  { name: "Washington DC",   slug: "washington-dc",   state: "DC", country: "USA", airport: "DCA / IAD / BWI", pop: "700K"  },
  { name: "Boston",          slug: "boston",          state: "MA", country: "USA", airport: "BOS",             pop: "685K"  },
  { name: "San Francisco",   slug: "san-francisco",   state: "CA", country: "USA", airport: "SFO",             pop: "873K"  },
  { name: "Seattle",         slug: "seattle",         state: "WA", country: "USA", airport: "SEA",             pop: "737K"  },
  { name: "Las Vegas",       slug: "las-vegas",       state: "NV", country: "USA", airport: "LAS",             pop: "650K"  },
  { name: "Atlanta",         slug: "atlanta",         state: "GA", country: "USA", airport: "ATL",             pop: "500K"  },
  { name: "Dallas",          slug: "dallas",          state: "TX", country: "USA", airport: "DFW / DAL",       pop: "1.3M"  },
  { name: "Philadelphia",    slug: "philadelphia",    state: "PA", country: "USA", airport: "PHL",             pop: "1.6M"  },
  { name: "Denver",          slug: "denver",          state: "CO", country: "USA", airport: "DEN",             pop: "715K"  },
  { name: "Phoenix",         slug: "phoenix",         state: "AZ", country: "USA", airport: "PHX",             pop: "1.6M"  },
  { name: "San Diego",       slug: "san-diego",       state: "CA", country: "USA", airport: "SAN",             pop: "1.4M"  },
  { name: "Minneapolis",     slug: "minneapolis",     state: "MN", country: "USA", airport: "MSP",             pop: "430K"  },
  { name: "Detroit",         slug: "detroit",         state: "MI", country: "USA", airport: "DTW",             pop: "640K"  },
  { name: "Baltimore",       slug: "baltimore",       state: "MD", country: "USA", airport: "BWI",             pop: "585K"  },
  { name: "Charlotte",       slug: "charlotte",       state: "NC", country: "USA", airport: "CLT",             pop: "880K"  },
  { name: "Nashville",       slug: "nashville",       state: "TN", country: "USA", airport: "BNA",             pop: "680K"  },
  { name: "Austin",          slug: "austin",          state: "TX", country: "USA", airport: "AUS",             pop: "960K"  },
  { name: "Portland",        slug: "portland",        state: "OR", country: "USA", airport: "PDX",             pop: "650K"  },
  { name: "Tampa",           slug: "tampa",           state: "FL", country: "USA", airport: "TPA",             pop: "380K"  },
  { name: "Orlando",         slug: "orlando",         state: "FL", country: "USA", airport: "MCO",             pop: "310K"  },
  { name: "Raleigh",         slug: "raleigh",         state: "NC", country: "USA", airport: "RDU",             pop: "470K"  },
  { name: "Indianapolis",    slug: "indianapolis",    state: "IN", country: "USA", airport: "IND",             pop: "880K"  },
  { name: "Pittsburgh",      slug: "pittsburgh",      state: "PA", country: "USA", airport: "PIT",             pop: "303K"  },
  { name: "Cincinnati",      slug: "cincinnati",      state: "OH", country: "USA", airport: "CVG",             pop: "310K"  },
  { name: "Kansas City",     slug: "kansas-city",     state: "MO", country: "USA", airport: "MCI",             pop: "500K"  },
  { name: "Cleveland",       slug: "cleveland",       state: "OH", country: "USA", airport: "CLE",             pop: "380K"  },
  { name: "Salt Lake City",  slug: "salt-lake-city",  state: "UT", country: "USA", airport: "SLC",             pop: "200K"  },
  { name: "Hartford",        slug: "hartford",        state: "CT", country: "USA", airport: "BDL",             pop: "120K"  },
  { name: "Long Island",     slug: "long-island",     state: "NY", country: "USA", airport: "ISP / JFK",       pop: "7.6M"  },
  { name: "Connecticut",     slug: "connecticut",     state: "CT", country: "USA", airport: "BDL / HVN",       pop: "3.6M"  },
  { name: "Stamford",        slug: "stamford",        state: "CT", country: "USA", airport: "HVN / LGA",       pop: "135K"  },
  { name: "White Plains",    slug: "white-plains",    state: "NY", country: "USA", airport: "HPN",             pop: "57K"   },
  { name: "Princeton",       slug: "princeton",       state: "NJ", country: "USA", airport: "EWR / PHL",       pop: "32K"   },
  { name: "Newark",          slug: "newark",          state: "NJ", country: "USA", airport: "EWR",             pop: "280K"  },
];

export const airports: SeoAirport[] = [
  { name: "John F. Kennedy International",         slug: "jfk",      code: "JFK", city: "New York",        state: "NY", country: "USA" },
  { name: "LaGuardia",                             slug: "lga",      code: "LGA", city: "New York",        state: "NY", country: "USA" },
  { name: "Newark Liberty International",          slug: "ewr",      code: "EWR", city: "Newark",          state: "NJ", country: "USA" },
  { name: "Los Angeles International",             slug: "lax",      code: "LAX", city: "Los Angeles",     state: "CA", country: "USA" },
  { name: "O'Hare International",                  slug: "ord",      code: "ORD", city: "Chicago",         state: "IL", country: "USA" },
  { name: "Midway International",                  slug: "mdw",      code: "MDW", city: "Chicago",         state: "IL", country: "USA" },
  { name: "Miami International",                   slug: "mia",      code: "MIA", city: "Miami",           state: "FL", country: "USA" },
  { name: "Fort Lauderdale-Hollywood",             slug: "fll",      code: "FLL", city: "Fort Lauderdale", state: "FL", country: "USA" },
  { name: "Ronald Reagan Washington National",     slug: "dca",      code: "DCA", city: "Washington",      state: "DC", country: "USA" },
  { name: "Washington Dulles International",       slug: "iad",      code: "IAD", city: "Dulles",          state: "VA", country: "USA" },
  { name: "Baltimore Washington International",    slug: "bwi",      code: "BWI", city: "Baltimore",       state: "MD", country: "USA" },
  { name: "Boston Logan International",            slug: "bos",      code: "BOS", city: "Boston",          state: "MA", country: "USA" },
  { name: "San Francisco International",           slug: "sfo",      code: "SFO", city: "San Francisco",   state: "CA", country: "USA" },
  { name: "Seattle-Tacoma International",          slug: "sea",      code: "SEA", city: "Seattle",         state: "WA", country: "USA" },
  { name: "Dallas/Fort Worth International",       slug: "dfw",      code: "DFW", city: "Dallas",          state: "TX", country: "USA" },
  { name: "Atlanta Hartsfield-Jackson",            slug: "atl",      code: "ATL", city: "Atlanta",         state: "GA", country: "USA" },
  { name: "Philadelphia International",            slug: "phl",      code: "PHL", city: "Philadelphia",    state: "PA", country: "USA" },
  { name: "Denver International",                  slug: "den",      code: "DEN", city: "Denver",          state: "CO", country: "USA" },
  { name: "Phoenix Sky Harbor International",      slug: "phx",      code: "PHX", city: "Phoenix",         state: "AZ", country: "USA" },
  { name: "Las Vegas Harry Reid International",    slug: "las",      code: "LAS", city: "Las Vegas",       state: "NV", country: "USA" },
  { name: "Houston George Bush Intercontinental",  slug: "iah",      code: "IAH", city: "Houston",         state: "TX", country: "USA" },
  { name: "Minneapolis Saint Paul International",  slug: "msp",      code: "MSP", city: "Minneapolis",     state: "MN", country: "USA" },
  { name: "Detroit Metropolitan Wayne County",     slug: "dtw",      code: "DTW", city: "Detroit",         state: "MI", country: "USA" },
  { name: "Charlotte Douglas International",       slug: "clt",      code: "CLT", city: "Charlotte",       state: "NC", country: "USA" },
  { name: "Nashville International",               slug: "bna",      code: "BNA", city: "Nashville",       state: "TN", country: "USA" },
  { name: "Austin-Bergstrom International",        slug: "aus",      code: "AUS", city: "Austin",          state: "TX", country: "USA" },
  { name: "Portland International",                slug: "pdx",      code: "PDX", city: "Portland",        state: "OR", country: "USA" },
  { name: "Tampa International",                   slug: "tpa",      code: "TPA", city: "Tampa",           state: "FL", country: "USA" },
  { name: "Orlando International",                 slug: "mco",      code: "MCO", city: "Orlando",         state: "FL", country: "USA" },
  { name: "Westchester County",                    slug: "hpn",      code: "HPN", city: "White Plains",    state: "NY", country: "USA" },
  { name: "Long Island MacArthur",                 slug: "isp",      code: "ISP", city: "Islip",           state: "NY", country: "USA" },
  { name: "Bradley International",                 slug: "bdl",      code: "BDL", city: "Hartford",        state: "CT", country: "USA" },
];
