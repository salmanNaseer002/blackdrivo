// lib/data/vehicles.ts

export interface VehicleModel {
  name: string
  variants?: string[]
}

export interface VehicleMake {
  name: string
  models: VehicleModel[]
}

export const VEHICLE_MAKES: VehicleMake[] = [
  {
    name: "Mercedes-Benz",
    models: [
      { name: "E-Class",  variants: ["E 300", "E 350", "E 450", "AMG E 53"] },
      { name: "S-Class",  variants: ["S 500", "S 580", "S 680", "AMG S 63"] },
      { name: "GLE",      variants: ["GLE 350", "GLE 450", "AMG GLE 53"] },
      { name: "GLS",      variants: ["GLS 450", "GLS 580", "AMG GLS 63"] },
      { name: "V-Class",  variants: ["V 220d", "V 250d", "V 300d"] },
      { name: "Sprinter", variants: ["2500", "3500"] },
      { name: "EQS",      variants: ["EQS 450+", "EQS 580 4MATIC"] },
    ],
  },
  {
    name: "BMW",
    models: [
      { name: "5 Series", variants: ["530i", "540i", "M550i"] },
      { name: "7 Series", variants: ["740i", "750i", "M760e", "Alpina B7"] },
      { name: "X5",       variants: ["xDrive40i", "xDrive50e", "M50i"] },
      { name: "X7",       variants: ["xDrive40i", "xDrive50i", "M60i"] },
    ],
  },
  {
    name: "Cadillac",
    models: [
      { name: "Escalade",    variants: ["Base", "Luxury", "Premium Luxury", "Platinum"] },
      { name: "Escalade ESV",variants: ["Base", "Luxury", "Premium Luxury", "Platinum"] },
      { name: "CT6",         variants: ["Luxury", "Premium Luxury", "Platinum"] },
    ],
  },
  {
    name: "Lincoln",
    models: [
      { name: "Navigator",         variants: ["Base", "Reserve", "Black Label"] },
      { name: "Navigator L",       variants: ["Base", "Reserve", "Black Label"] },
      { name: "Continental",       variants: ["Reserve", "Black Label"] },
      { name: "Town Car",          variants: ["Executive", "Signature", "Signature L"] },
    ],
  },
  {
    name: "Audi",
    models: [
      { name: "A6",  variants: ["40 TFSI", "45 TFSI", "55 TFSI"] },
      { name: "A8",  variants: ["55 TFSI", "60 TFSI e", "L 60 TFSI e"] },
      { name: "Q7",  variants: ["45 TFSI", "55 TFSI"] },
      { name: "Q8",  variants: ["55 TFSI", "RS Q8"] },
      { name: "e-tron GT", variants: ["e-tron GT", "RS e-tron GT"] },
    ],
  },
  {
    name: "Rolls-Royce",
    models: [
      { name: "Ghost",       variants: ["Base", "Extended", "Series II"] },
      { name: "Phantom",     variants: ["Base", "Extended"] },
      { name: "Cullinan",    variants: ["Base", "Black Badge"] },
      { name: "Spectre",     variants: ["Base"] },
    ],
  },
  {
    name: "Bentley",
    models: [
      { name: "Flying Spur",  variants: ["V8", "W12", "Hybrid"] },
      { name: "Mulsanne",     variants: ["Base", "Speed", "Extended"] },
      { name: "Bentayga",     variants: ["V8", "EWB", "Speed"] },
    ],
  },
  {
    name: "Genesis",
    models: [
      { name: "G80",  variants: ["2.5T", "3.5T", "Electrified G80"] },
      { name: "G90",  variants: ["3.5T", "5.0"] },
      { name: "GV80", variants: ["2.5T", "3.5T"] },
    ],
  },
  {
    name: "Lexus",
    models: [
      { name: "ES",  variants: ["ES 250", "ES 300h", "ES 350"] },
      { name: "LS",  variants: ["LS 500", "LS 500h"] },
      { name: "LX",  variants: ["LX 600"] },
      { name: "GX",  variants: ["GX 460", "GX 550"] },
    ],
  },
  {
    name: "Tesla",
    models: [
      { name: "Model S",  variants: ["Long Range", "Plaid"] },
      { name: "Model X",  variants: ["Long Range", "Plaid"] },
      { name: "Model 3",  variants: ["Standard Range", "Long Range", "Performance"] },
    ],
  },
  {
    name: "Toyota",
    models: [
      { name: "Camry",    variants: ["LE", "SE", "XSE", "XLE"] },
      { name: "Avalon",   variants: ["XLE", "Touring", "Limited"] },
      { name: "Sienna",   variants: ["LE", "XLE", "Limited", "Platinum"] },
      { name: "Land Cruiser", variants: ["Base", "Heritage"] },
    ],
  },
  {
    name: "Chevrolet",
    models: [
      { name: "Suburban",  variants: ["LS", "LT", "Z71", "LTZ", "Premier", "High Country"] },
      { name: "Tahoe",     variants: ["LS", "LT", "Z71", "LTZ", "Premier", "High Country"] },
      { name: "Express",   variants: ["Passenger 2500", "Passenger 3500"] },
    ],
  },
  {
    name: "Ford",
    models: [
      { name: "Expedition",      variants: ["XL", "XLT", "Limited", "Platinum", "King Ranch"] },
      { name: "Expedition Max",  variants: ["XL", "XLT", "Limited", "Platinum"] },
      { name: "Explorer",        variants: ["Base", "XLT", "Limited", "Platinum"] },
    ],
  },
  {
    name: "Chrysler",
    models: [
      { name: "300",        variants: ["Touring", "300S", "300C"] },
      { name: "Pacifica",   variants: ["Touring", "Touring L", "Limited", "Pinnacle"] },
    ],
  },
]

export const VEHICLE_COLORS = [
  "Black", "White", "Silver", "Gray", "Midnight Blue", "Navy Blue",
  "Champagne", "Ivory", "Burgundy", "Dark Green", "Bronze", "Graphite",
  "Obsidian Black", "Arctic White", "Platinum Silver",
]

export const getModelsForMake = (makeName: string): VehicleModel[] => {
  const make = VEHICLE_MAKES.find(m => m.name === makeName)
  return make?.models ?? []
}

export const getVariantsForModel = (makeName: string, modelName: string): string[] => {
  const make = VEHICLE_MAKES.find(m => m.name === makeName)
  const model = make?.models.find(m => m.name === modelName)
  return model?.variants ?? []
}

export const getYearOptions = (): number[] => {
  const current = new Date().getFullYear()
  const years: number[] = []
  for (let y = current + 1; y >= 2015; y--) years.push(y)
  return years
}
