import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompareArrows, MessageCircle, Plus, X } from 'lucide-react';
import { useGarage } from '../context/GarageContext';
import { useInventory } from '../context/InventoryContext';
import { buildWhatsAppUrl, formatNaira, specValue } from '../data/constants';
import { Car } from '../types/car';
import { SafeImage } from '../components/BrandMark';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const COMPARISON_GROUPS: {
  title: string;
  rows: { label: string; getValue: (car: Car) => string }[];
}[] = [
  {
    title: 'Overview',
    rows: [
      { label: 'Brand', getValue: (c) => specValue(c.brand) },
      { label: 'Model', getValue: (c) => specValue(c.model) },
      { label: 'Trim', getValue: (c) => specValue(c.specs?.trim) },
      { label: 'Year of Manufacture', getValue: (c) => specValue(c.year) },
      { label: 'Body Type', getValue: (c) => specValue(c.bodyType) },
      { label: 'Condition', getValue: (c) => specValue(c.condition) },
      { label: 'Mileage', getValue: (c) => `${c.mileage.toLocaleString()} km` },
      { label: 'Exterior Colours', getValue: (c) => c.colors.map((x) => x.name).join(', ') || 'Not specified' },
      { label: 'Interior Colour', getValue: (c) => specValue(c.specs?.interiorColor) },
      { label: 'Number of Owners', getValue: (c) => specValue(c.specs?.ownersCount) },
      { label: 'Location', getValue: (c) => specValue(c.location) },
      { label: 'Status', getValue: (c) => (c.status === 'available' ? 'Available' : 'Sold') },
    ],
  },
  {
    title: 'Engine & Performance',
    rows: [
      { label: 'Engine Type & Size', getValue: (c) => specValue(c.engine) },
      { label: 'Cylinders', getValue: (c) => specValue(c.specs?.cylinders) },
      { label: 'Horsepower', getValue: (c) => specValue(c.horsepower) },
      { label: 'Torque', getValue: (c) => specValue(c.specs?.torque) },
      { label: '0–100 km/h', getValue: (c) => specValue(c.specs?.acceleration0To100) },
      { label: 'Top Speed', getValue: (c) => specValue(c.specs?.topSpeed) },
      { label: 'Drivetrain', getValue: (c) => specValue(c.drivetrain) },
      { label: 'Fuel Type', getValue: (c) => specValue(c.fuel) },
      { label: 'Fuel Economy', getValue: (c) => specValue(c.specs?.fuelEconomy) },
    ],
  },
  {
    title: 'Transmission & Chassis',
    rows: [
      { label: 'Gearbox', getValue: (c) => specValue(c.transmission) },
      { label: 'Speeds', getValue: (c) => specValue(c.specs?.gearboxSpeeds) },
      { label: 'Suspension', getValue: (c) => specValue(c.specs?.suspension) },
      { label: 'Brakes', getValue: (c) => specValue(c.specs?.brakes) },
      { label: 'Wheel & Tyre Size', getValue: (c) => specValue(c.specs?.wheelTyreSize) },
    ],
  },
  {
    title: 'Dimensions & Capacity',
    rows: [
      { label: 'Length', getValue: (c) => specValue(c.specs?.length) },
      { label: 'Width', getValue: (c) => specValue(c.specs?.width) },
      { label: 'Height', getValue: (c) => specValue(c.specs?.height) },
      { label: 'Wheelbase', getValue: (c) => specValue(c.specs?.wheelbase) },
      { label: 'Ground Clearance', getValue: (c) => specValue(c.specs?.groundClearance) },
      { label: 'Boot Space', getValue: (c) => specValue(c.specs?.bootSpace) },
      { label: 'Seats', getValue: (c) => `${c.seats} Seats` },
      { label: 'Doors', getValue: (c) => specValue(c.specs?.doors) },
      { label: 'Fuel Tank Size', getValue: (c) => specValue(c.specs?.fuelTank) },
      { label: 'Kerb Weight', getValue: (c) => specValue(c.specs?.kerbWeight) },
    ],
  },
  {
    title: 'Interior & Comfort',
    rows: [
      { label: 'Upholstery', getValue: (c) => specValue(c.specs?.upholstery) },
      { label: 'Air Conditioning Zones', getValue: (c) => specValue(c.specs?.acZones) },
      { label: 'Infotainment Screen', getValue: (c) => specValue(c.specs?.infotainmentScreen) },
      { label: 'Sound System', getValue: (c) => specValue(c.specs?.soundSystem) },
      { label: 'Ambient Lighting', getValue: (c) => specValue(c.specs?.ambientLighting) },
      { label: 'Seat Features', getValue: (c) => specValue(c.specs?.seatFeatures) },
      { label: 'Sunroof / Panoramic Roof', getValue: (c) => specValue(c.specs?.sunroof) },
    ],
  },
  {
    title: 'Safety & Driver Assistance',
    rows: [
      { label: 'Airbags', getValue: (c) => specValue(c.specs?.airbags) },
      { label: 'ABS / ESP', getValue: (c) => specValue(c.specs?.absEsp) },
      { label: 'Cameras', getValue: (c) => specValue(c.specs?.cameras) },
      { label: 'Parking Sensors', getValue: (c) => specValue(c.specs?.parkingSensors) },
      { label: 'Cruise Control', getValue: (c) => specValue(c.specs?.cruiseControl) },
      { label: 'Lane Assist', getValue: (c) => specValue(c.specs?.laneAssist) },
      { label: 'Blind-Spot Monitoring', getValue: (c) => specValue(c.specs?.blindSpotMonitoring) },
    ],
  },
  {
    title: 'Exterior',
    rows: [
      { label: 'Headlights', getValue: (c) => specValue(c.specs?.headlights) },
      { label: 'Wheels', getValue: (c) => specValue(c.specs?.wheels) },
      { label: 'Roof Rails', getValue: (c) => specValue(c.specs?.roofRails) },
      { label: 'Tow Bar', getValue: (c) => specValue(c.specs?.towBar) },
    ],
  },
  {
    title: 'Documents & Condition',
    rows: [
      { label: 'Customs Duty Status', getValue: (c) => specValue(c.specs?.customsDutyStatus) },
      { label: 'Registration', getValue: (c) => specValue(c.specs?.registrationStatus) },
      { label: 'Service History', getValue: (c) => specValue(c.specs?.serviceHistory) },
      { label: 'Accident History', getValue: (c) => specValue(c.specs?.accidentHistory) },
      { label: 'Inspection Notes', getValue: (c) => specValue(c.specs?.inspectionNotes) },
    ],
  },
];

export const ComparePage: React.FC = () => {
  const { getCompareCars, toggleCompare, removeFromCompare, clearCompare } = useGarage();
  const { cars } = useInventory();
  const compareCars = getCompareCars(cars);

  useDocumentMeta({
    title: 'Compare Vehicles Side by Side – AUTOSAT LIMITED',
    description:
      'Compare up to 3 luxury, foreign-used, and Nigerian-used vehicles side by side on full performance, dimensions, interior, safety, and document specs.',
  });

  const addableCars = cars.filter(
    (c) => c.status === 'available' && !compareCars.some((sel) => sel.id === c.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
            SIDE-BY-SIDE SPECIFICATION COMPARISON
          </p>
          <h1 className="mt-2 font-editorial text-3xl font-bold text-[#111214] sm:text-4xl">
            Compare Vehicles ({compareCars.length}/3)
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {compareCars.length > 0 && (
            <>
              <button
                type="button"
                onClick={clearCompare}
                className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-[#525459] hover:text-[#111214] cursor-pointer"
              >
                Clear All
              </button>
              <a
                href={buildWhatsAppUrl(
                  `Hello AUTOSAT LIMITED, please help me compare these vehicles: ${compareCars
                    .map((c) => `${c.year} ${c.brand} ${c.model} (${formatNaira(c.price)})`)
                    .join(' vs ')}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1F7A4D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#258E5A]"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Ask Advisor to Compare
              </a>
            </>
          )}
          <Link
            to="/inventory"
            className="rounded-full bg-[#111214] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2A2C30]"
          >
            Browse Showroom
          </Link>
        </div>
      </div>

      {compareCars.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-black/8 bg-white p-12 text-center space-y-4">
          <GitCompareArrows className="mx-auto h-10 w-10 text-[#9B7D48]" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-bold text-[#111214]">
            No vehicles selected to compare
          </h2>
          <p className="mx-auto max-w-md text-sm text-[#6B6D72]">
            Tap the compare icon on any vehicle card or car page (up to 3 cars) — or pick your first vehicle below.
          </p>
          {addableCars.length > 0 && (
            <div className="mx-auto max-w-xs pt-2">
              <select
                aria-label="Add a car to compare"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) toggleCompare(e.target.value);
                }}
                className="w-full rounded-xl border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-xs font-medium text-[#111214]"
              >
                <option value="" disabled>
                  + Choose a car to compare...
                </option>
                {addableCars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.year} {c.brand} {c.model} ({formatNaira(c.price)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-black/8 bg-white">
          <table className="w-full min-w-[680px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 bg-[#F9F8F6]">
                <th className="w-52 p-4 align-top font-semibold text-[#6B6D72]">
                  Vehicle Comparison
                  {compareCars.length < 3 && addableCars.length > 0 && (
                    <div className="mt-3">
                      <label className="sr-only" htmlFor="add-compare-select">
                        Add another car
                      </label>
                      <select
                        id="add-compare-select"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) toggleCompare(e.target.value);
                        }}
                        className="w-full rounded-lg border border-black/15 bg-white px-2.5 py-2 text-[11px] font-medium text-[#111214]"
                      >
                        <option value="" disabled>
                          + Add car ({compareCars.length}/3)
                        </option>
                        {addableCars.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.year} {c.brand} {c.model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </th>

                {compareCars.map((car) => (
                  <th key={car.id} className="w-64 p-4 align-top border-l border-black/8">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#E9E7E0]">
                      <SafeImage
                        src={car.colors[0]?.images[0] || car.images[0] || ''}
                        alt={`${car.year} ${car.brand} ${car.model}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFromCompare(car.id)}
                        aria-label={`Remove ${car.model}`}
                        className="absolute top-2 right-2 rounded-full bg-white/95 p-1 text-[#111214] shadow-xs hover:text-red-600 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-[#9B7D48]">
                      {car.brand}
                    </p>
                    <Link
                      to={`/cars/${car.id}`}
                      className="mt-0.5 block text-sm font-bold text-[#111214] hover:underline"
                    >
                      {car.year} {car.model}
                    </Link>
                    <p className="mt-1 font-mono text-sm font-bold tabular-nums text-[#111214]">
                      {formatNaira(car.price)}
                    </p>
                  </th>
                ))}

                {compareCars.length < 3 && (
                  <th className="w-52 p-4 align-middle border-l border-black/8 text-center">
                    <Link
                      to="/inventory"
                      className="inline-flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 p-6 text-xs font-medium text-[#6B6D72] hover:border-[#111214] hover:text-[#111214]"
                    >
                      <Plus className="h-5 w-5" />
                      Add Vehicle from Showroom
                    </Link>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-black/8">
              {COMPARISON_GROUPS.map((group) => (
                <React.Fragment key={group.title}>
                  <tr className="bg-[#F5F4F0]/80">
                    <td
                      colSpan={compareCars.length + (compareCars.length < 3 ? 2 : 1)}
                      className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#111214]"
                    >
                      {group.title}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={`${group.title}-${row.label}`} className="hover:bg-[#F9F8F6]/60">
                      <td className="px-4 py-2.5 font-medium text-[#6B6D72]">{row.label}</td>
                      {compareCars.map((car) => {
                        const val = row.getValue(car);
                        return (
                          <td
                            key={`${car.id}-${row.label}`}
                            className={`border-l border-black/8 px-4 py-2.5 font-mono text-xs ${
                              val === 'Not specified' ? 'text-[#9CA3AF]' : 'text-[#111214] font-medium'
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}
                      {compareCars.length < 3 && (
                        <td className="border-l border-black/8 px-4 py-2.5 text-[#9CA3AF]">—</td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
