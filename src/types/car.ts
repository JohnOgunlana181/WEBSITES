export type CarCondition = 'Foreign Used' | 'Nigerian Used' | 'Brand New';
export type BodyType = 'SUV' | 'Sedan' | 'Coupe' | 'Pickup' | 'Hatchback' | 'Luxury';
export type FuelType = 'Petrol' | 'Hybrid' | 'Diesel' | 'Electric';
export type TransmissionType = 'Automatic' | 'Manual';
export type CarStatus = 'available' | 'sold';

export interface CarColor {
  name: string;
  hex: string;
  images: string[];
  modelOverrideHex?: string;
}

export interface CarDetailedSpecs {
  // Overview
  trim?: string;
  interiorColor?: string;
  ownersCount?: string;
  // Engine & Performance
  cylinders?: string;
  torque?: string;
  acceleration0To100?: string;
  topSpeed?: string;
  fuelEconomy?: string;
  // Transmission & Chassis
  gearboxSpeeds?: string;
  suspension?: string;
  brakes?: string;
  wheelTyreSize?: string;
  // Dimensions & Capacity
  length?: string;
  width?: string;
  height?: string;
  wheelbase?: string;
  groundClearance?: string;
  bootSpace?: string;
  doors?: string;
  fuelTank?: string;
  kerbWeight?: string;
  // Interior & Comfort
  upholstery?: string;
  acZones?: string;
  infotainmentScreen?: string;
  soundSystem?: string;
  ambientLighting?: string;
  seatFeatures?: string;
  sunroof?: string;
  // Safety & Driver Assistance
  airbags?: string;
  absEsp?: string;
  cameras?: string;
  parkingSensors?: string;
  cruiseControl?: string;
  laneAssist?: string;
  blindSpotMonitoring?: string;
  // Exterior
  headlights?: string;
  wheels?: string;
  roofRails?: string;
  towBar?: string;
  // Documents & Condition
  customsDutyStatus?: string;
  registrationStatus?: string;
  serviceHistory?: string;
  accidentHistory?: string;
  inspectionNotes?: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  negotiable: boolean;
  condition: CarCondition;
  bodyType: BodyType;
  fuel: FuelType;
  transmission: TransmissionType;
  engine: string;
  horsepower: string;
  drivetrain: string;
  mileage: number;
  seats: number;
  vin?: string;
  location: string;
  features: string[];
  colors: CarColor[];
  model3d: string;
  interior360: string;
  images: string[];
  videoUrl: string;
  description: string;
  status: CarStatus;
  isFeatured?: boolean;
  isLatest?: boolean;
  rentalDailyRate?: number;
  rentalWeeklyRate?: number;
  specs?: CarDetailedSpecs;
}

export interface BrandMeta {
  name: string;
  slug: string;
  origin: string;
}

export interface NigerianStateDelivery {
  state: string;
  zone: string;
  transitDays: string;
  estimatedFee: number;
}

export type SellRequestStatus = 'New' | 'Contacted' | 'Closed';

export interface SellRequestPhoto {
  id: string;
  angle: string;
  dataUrl: string;
}

export interface SellRequest {
  id: string;
  createdAt: string;
  status: SellRequestStatus;
  fullName: string;
  phone: string;
  email: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: 'Foreign Used' | 'Nigerian Used';
  transmission: TransmissionType;
  fuel: FuelType;
  colour: string;
  askingPrice: number;
  location: string;
  description: string;
  photos: SellRequestPhoto[];
}
