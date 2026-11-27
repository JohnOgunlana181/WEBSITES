import { BrandMeta, NigerianStateDelivery } from '../types/car';

export const BUSINESS_INFO = {
  name: 'AUTOSAT LIMITED',
  shortName: 'AUTOSAT',
  rcNumber: 'RC 1643628',
  tagline: 'Premium cars. Delivered across Nigeria.',
  addressPrimary: '24 Unity Road, Ikeja, Lagos',
  addressLandmark: 'Near Lateef Jakande Road, Agidingbi, Ikeja, Lagos',
  hours: [
    { days: 'Monday – Friday', time: '8:00 AM – 8:00 PM' },
    { days: 'Saturday', time: '10:00 AM – 8:00 PM' },
    { days: 'Sunday', time: '12:00 PM – 6:00 PM' },
  ],
  phonePrimary: '+234 913 867 8236',
  phonePrimaryRaw: '2349138678236',
  phoneSecondary: '+234 818 353 3837',
  phoneSecondaryRaw: '2348183533837',
  email: 'sales@autosatlimited.com.ng',
  instagram: '@autosat_ng',
  instagramUrl: 'https://instagram.com/autosat_ng',
  facebook: 'AutosatLimited',
  facebookUrl: 'https://facebook.com/AutosatLimited',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=24+Unity+Road+Ikeja+Lagos+Nigeria',
};

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
}

export function buildWhatsAppUrl(message: string, phone: string = BUSINESS_INFO.phonePrimaryRaw): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const AUTOSAT_ASSETS = {
  logo: '/assets/aistudio/AUTOSAT_LOGO_6e9fc57f.jpg',
  heroVideo: '/assets/aistudio/c7271571f7e11e7510235d9293dc0e8c_540w_b59b7261.mp4',
  heroPoster: '/hero-video-poster.jpg',
};

export function brandToSlug(brand: string): string {
  return brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function brandLogoPath(brand: string): string {
  return `/logos/${brandToSlug(brand)}.png`;
}

export function specValue(value?: string | number | null): string {
  if (value === undefined || value === null) return 'Not specified';
  const str = String(value).trim();
  return str.length > 0 ? str : 'Not specified';
}

export const SHOWROOM_BRANDS: BrandMeta[] = [
  { name: 'Mercedes-Benz', slug: 'mercedes-benz', origin: 'Germany' },
  { name: 'BMW', slug: 'bmw', origin: 'Germany' },
  { name: 'Toyota', slug: 'toyota', origin: 'Japan' },
  { name: 'Lexus', slug: 'lexus', origin: 'Japan' },
  { name: 'Range Rover', slug: 'range-rover', origin: 'United Kingdom' },
  { name: 'Land Rover', slug: 'land-rover', origin: 'United Kingdom' },
  { name: 'Porsche', slug: 'porsche', origin: 'Germany' },
  { name: 'Audi', slug: 'audi', origin: 'Germany' },
  { name: 'Aston Martin', slug: 'aston-martin', origin: 'United Kingdom' },
  { name: 'Rolls-Royce', slug: 'rolls-royce', origin: 'United Kingdom' },
  { name: 'Bentley', slug: 'bentley', origin: 'United Kingdom' },
  { name: 'Honda', slug: 'honda', origin: 'Japan' },
  { name: 'Hyundai', slug: 'hyundai', origin: 'South Korea' },
  { name: 'Kia', slug: 'kia', origin: 'South Korea' },
  { name: 'Ford', slug: 'ford', origin: 'United States' },
  { name: 'Chevrolet', slug: 'chevrolet', origin: 'United States' },
  { name: 'Nissan', slug: 'nissan', origin: 'Japan' },
  { name: 'Volkswagen', slug: 'volkswagen', origin: 'Germany' },
  { name: 'Infiniti', slug: 'infiniti', origin: 'Japan' },
  { name: 'Peugeot', slug: 'peugeot', origin: 'France' },
  { name: 'Mitsubishi', slug: 'mitsubishi', origin: 'Japan' },
];

export const NIGERIAN_STATES: NigerianStateDelivery[] = [
  { state: 'Lagos', zone: 'South West', transitDays: 'Same Day (3–6 hrs)', estimatedFee: 50000 },
  { state: 'FCT Abuja', zone: 'North Central', transitDays: '1–2 Days', estimatedFee: 320000 },
  { state: 'Ogun', zone: 'South West', transitDays: 'Same Day (4–8 hrs)', estimatedFee: 95000 },
  { state: 'Oyo', zone: 'South West', transitDays: '1 Day', estimatedFee: 140000 },
  { state: 'Ondo', zone: 'South West', transitDays: '1 Day', estimatedFee: 190000 },
  { state: 'Osun', zone: 'South West', transitDays: '1 Day', estimatedFee: 175000 },
  { state: 'Ekiti', zone: 'South West', transitDays: '1 Day', estimatedFee: 210000 },
  { state: 'Edo', zone: 'South South', transitDays: '1–2 Days', estimatedFee: 220000 },
  { state: 'Delta', zone: 'South South', transitDays: '1–2 Days', estimatedFee: 245000 },
  { state: 'Rivers (Port Harcourt)', zone: 'South South', transitDays: '2 Days', estimatedFee: 295000 },
  { state: 'Bayelsa', zone: 'South South', transitDays: '2 Days', estimatedFee: 310000 },
  { state: 'Akwa Ibom', zone: 'South South', transitDays: '2 Days', estimatedFee: 325000 },
  { state: 'Cross River', zone: 'South South', transitDays: '2–3 Days', estimatedFee: 340000 },
  { state: 'Anambra', zone: 'South East', transitDays: '1–2 Days', estimatedFee: 265000 },
  { state: 'Enugu', zone: 'South East', transitDays: '1–2 Days', estimatedFee: 275000 },
  { state: 'Imo', zone: 'South East', transitDays: '2 Days', estimatedFee: 280000 },
  { state: 'Abia', zone: 'South East', transitDays: '2 Days', estimatedFee: 285000 },
  { state: 'Ebonyi', zone: 'South East', transitDays: '2 Days', estimatedFee: 295000 },
  { state: 'Kwara', zone: 'North Central', transitDays: '1 Day', estimatedFee: 215000 },
  { state: 'Kogi', zone: 'North Central', transitDays: '1–2 Days', estimatedFee: 260000 },
  { state: 'Niger', zone: 'North Central', transitDays: '2 Days', estimatedFee: 330000 },
  { state: 'Nasarawa', zone: 'North Central', transitDays: '2 Days', estimatedFee: 340000 },
  { state: 'Benue', zone: 'North Central', transitDays: '2 Days', estimatedFee: 335000 },
  { state: 'Plateau (Jos)', zone: 'North Central', transitDays: '2–3 Days', estimatedFee: 380000 },
  { state: 'Kaduna', zone: 'North West', transitDays: '2–3 Days', estimatedFee: 385000 },
  { state: 'Kano', zone: 'North West', transitDays: '2–3 Days', estimatedFee: 420000 },
  { state: 'Katsina', zone: 'North West', transitDays: '3 Days', estimatedFee: 450000 },
  { state: 'Jigawa', zone: 'North West', transitDays: '3 Days', estimatedFee: 460000 },
  { state: 'Sokoto', zone: 'North West', transitDays: '3–4 Days', estimatedFee: 495000 },
  { state: 'Kebbi', zone: 'North West', transitDays: '3–4 Days', estimatedFee: 485000 },
  { state: 'Zamfara', zone: 'North West', transitDays: '3–4 Days', estimatedFee: 470000 },
  { state: 'Bauchi', zone: 'North East', transitDays: '3 Days', estimatedFee: 440000 },
  { state: 'Gombe', zone: 'North East', transitDays: '3–4 Days', estimatedFee: 465000 },
  { state: 'Adamawa', zone: 'North East', transitDays: '3–4 Days', estimatedFee: 490000 },
  { state: 'Taraba', zone: 'North East', transitDays: '3–4 Days', estimatedFee: 480000 },
  { state: 'Borno', zone: 'North East', transitDays: '4 Days', estimatedFee: 540000 },
  { state: 'Yobe', zone: 'North East', transitDays: '4 Days', estimatedFee: 520000 },
];
