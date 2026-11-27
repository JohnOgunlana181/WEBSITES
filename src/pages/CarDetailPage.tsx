import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Calendar,
  Car as CarIcon,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  Fuel,
  Gauge,
  GitCompareArrows,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Phone,
  RotateCw,
  Settings,
  ShieldCheck,
  Truck,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useGarage } from '../context/GarageContext';
import {
  BUSINESS_INFO,
  NIGERIAN_STATES,
  brandToSlug,
  buildWhatsAppUrl,
  formatNaira,
  specValue,
} from '../data/constants';
import { CarMediaGallery } from '../components/CarMediaGallery';
import { CarCard } from '../components/CarCard';
import { AutosatLoadingScreen } from '../components/AutosatLogo';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const CarViewer3D = lazy(() =>
  import('../components/CarViewer3D').then((m) => ({ default: m.CarViewer3D }))
);

type MediaTab = 'photos' | '3d' | 'video' | 'spin360' | 'interior';

export const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cars, getCarById } = useInventory();
  const { addToGarage, isInGarage, setDrawerOpen, isInCompare, toggleCompare } = useGarage();
  const car = id ? getCarById(id) : undefined;

  const [activeTab, setActiveTab] = useState<MediaTab>('photos');
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(() => {
    if (!id) return 0;
    try {
      const saved = sessionStorage.getItem(`autosat_color_${id}`);
      return saved ? Math.max(0, Number(saved)) : 0;
    } catch {
      return 0;
    }
  });
  const [hoveredColorName, setHoveredColorName] = useState<string | null>(null);
  const [unavailableColorNotice, setUnavailableColorNotice] = useState<string | null>(null);

  // Expanded collapsible spec sections (all open or first 2 open by default)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    overview: true,
    engine: true,
    transmission: false,
    dimensions: false,
    interior: false,
    safety: false,
    exterior: false,
    documents: true,
  });

  // Inspection Modal state
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [inspName, setInspName] = useState('');
  const [inspPhone, setInspPhone] = useState('');
  const [inspDate, setInspDate] = useState('');
  const [inspSubmitted, setInspSubmitted] = useState(false);

  // Delivery Quote Drawer state
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [destState, setDestState] = useState(NIGERIAN_STATES[1].state);
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteSent, setQuoteSent] = useState(false);

  useEffect(() => {
    setUnavailableColorNotice(null);
    setHoveredColorName(null);
    if (id) {
      try {
        const saved = sessionStorage.getItem(`autosat_color_${id}`);
        const idx = saved ? Number(saved) : 0;
        const firstValid = car?.colors.findIndex((c) => c.images && c.images.length > 0) ?? 0;
        if (car && car.colors[idx]?.images?.length > 0) {
          setSelectedColorIdx(idx);
        } else {
          setSelectedColorIdx(firstValid >= 0 ? firstValid : 0);
        }
      } catch {
        setSelectedColorIdx(0);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, car]);

  const handleSelectColor = (idx: number) => {
    if (!car) return;
    const target = car.colors[idx];
    if (!target) return;

    if (!target.images || target.images.length === 0) {
      setUnavailableColorNotice(
        `Photos coming soon for ${target.name} — real photos for this colour have not been uploaded yet.`
      );
      return;
    }

    setUnavailableColorNotice(null);
    setSelectedColorIdx(idx);
    try {
      sessionStorage.setItem(`autosat_color_${car.id}`, String(idx));
    } catch {
      // Ignore
    }
  };

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const vehicleJsonLd = useMemo(() => {
    if (!car) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Vehicle',
      name: `${car.year} ${car.brand} ${car.model}`,
      brand: { '@type': 'Brand', name: car.brand },
      model: car.model,
      vehicleModelDate: String(car.year),
      mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: car.mileage,
        unitCode: 'KMT',
      },
      vehicleTransmission: car.transmission,
      fuelType: car.fuel,
      bodyType: car.bodyType,
      vehicleEngine: {
        '@type': 'EngineSpecification',
        name: car.engine,
      },
      offers: {
        '@type': 'Offer',
        price: car.price,
        priceCurrency: 'NGN',
        availability:
          car.status === 'available'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/SoldOut',
        seller: {
          '@type': 'AutoDealer',
          name: BUSINESS_INFO.name,
        },
      },
    };
  }, [car]);

  useDocumentMeta({
    title: car
      ? `${car.year} ${car.brand} ${car.model} (${formatNaira(car.price)}) – AUTOSAT LIMITED`
      : 'Vehicle Not Found – AUTOSAT LIMITED',
    description: car
      ? `${car.year} ${car.brand} ${car.model} (${car.condition}) available at AUTOSAT LIMITED, 24 Unity Road, Ikeja, Lagos. Inspect in 3D or book delivery nationwide.`
      : 'Vehicle details at AUTOSAT LIMITED.',
    jsonLd: vehicleJsonLd,
  });

  if (!car) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="font-editorial text-4xl font-bold text-[#111214]">Vehicle Not Found</h1>
        <p className="mt-3 text-sm text-[#6B6D72]">
          This listing may have been sold or removed from our Ikeja showroom stock.
        </p>
        <Link
          to="/inventory"
          className="mt-6 inline-flex rounded-full bg-[#111214] px-6 py-3 text-xs font-semibold text-white"
        >
          Browse Available Cars
        </Link>
      </div>
    );
  }

  const activeColor = car.colors[selectedColorIdx] ||
    car.colors[0] || {
      name: 'Not specified',
      hex: '#16181D',
      images: car.images,
      modelOverrideHex: '#16181D',
    };

  // Strictly use ONLY the selected color's own photos (no faking or mixing other colors)
  const activeGalleryImages = activeColor.images || [];

  const paintHex = activeColor.modelOverrideHex || activeColor.hex;
  const selectedStateInfo =
    NIGERIAN_STATES.find((s) => s.state === destState) || NIGERIAN_STATES[0];

  const similarCars = cars
    .filter((c) => c.id !== car.id && (c.brand === car.brand || c.bodyType === car.bodyType))
    .slice(0, 3);

  const carFullTitle = `${car.year} ${car.brand} ${car.model}`;
  const whatsappUrl = buildWhatsAppUrl(
    `Hello AUTOSAT LIMITED, I would like to enquire about the ${carFullTitle} (${activeColor.name}) listed at ${formatNaira(car.price)}.`
  );
  const inGarage = isInGarage(car.id);
  const compared = isInCompare(car.id);

  const specSections: {
    key: string;
    title: string;
    rows: [string, string][];
  }[] = [
    {
      key: 'overview',
      title: 'Overview',
      rows: [
        ['Brand', specValue(car.brand)],
        ['Model', specValue(car.model)],
        ['Trim', specValue(car.specs?.trim)],
        ['Year of Manufacture', specValue(car.year)],
        ['Body Type', specValue(car.bodyType)],
        ['Condition', specValue(car.condition)],
        ['Mileage', `${car.mileage.toLocaleString()} km`],
        ['Exterior Colour', specValue(activeColor.name)],
        ['Interior Colour', specValue(car.specs?.interiorColor)],
        ['Number of Owners', specValue(car.specs?.ownersCount)],
        ['Location', specValue(car.location)],
        ['Status', car.status === 'available' ? 'Available' : 'Sold'],
      ],
    },
    {
      key: 'engine',
      title: 'Engine & Performance',
      rows: [
        ['Engine Type & Size', specValue(car.engine)],
        ['Cylinders', specValue(car.specs?.cylinders)],
        ['Horsepower', specValue(car.horsepower)],
        ['Torque', specValue(car.specs?.torque)],
        ['0–100 km/h', specValue(car.specs?.acceleration0To100)],
        ['Top Speed', specValue(car.specs?.topSpeed)],
        ['Drivetrain', specValue(car.drivetrain)],
        ['Fuel Type', specValue(car.fuel)],
        ['Fuel Economy', specValue(car.specs?.fuelEconomy)],
      ],
    },
    {
      key: 'transmission',
      title: 'Transmission & Chassis',
      rows: [
        ['Gearbox Type', specValue(car.transmission)],
        ['Speeds', specValue(car.specs?.gearboxSpeeds)],
        ['Suspension', specValue(car.specs?.suspension)],
        ['Brakes', specValue(car.specs?.brakes)],
        ['Wheel & Tyre Size', specValue(car.specs?.wheelTyreSize)],
      ],
    },
    {
      key: 'dimensions',
      title: 'Dimensions & Capacity',
      rows: [
        ['Length', specValue(car.specs?.length)],
        ['Width', specValue(car.specs?.width)],
        ['Height', specValue(car.specs?.height)],
        ['Wheelbase', specValue(car.specs?.wheelbase)],
        ['Ground Clearance', specValue(car.specs?.groundClearance)],
        ['Boot Space', specValue(car.specs?.bootSpace)],
        ['Seats', `${car.seats} Seats`],
        ['Doors', specValue(car.specs?.doors)],
        ['Fuel Tank Size', specValue(car.specs?.fuelTank)],
        ['Kerb Weight', specValue(car.specs?.kerbWeight)],
      ],
    },
    {
      key: 'interior',
      title: 'Interior & Comfort',
      rows: [
        ['Upholstery', specValue(car.specs?.upholstery)],
        ['Air Conditioning Zones', specValue(car.specs?.acZones)],
        ['Infotainment Screen Size', specValue(car.specs?.infotainmentScreen)],
        ['Sound System', specValue(car.specs?.soundSystem)],
        ['Ambient Lighting', specValue(car.specs?.ambientLighting)],
        ['Seat Features', specValue(car.specs?.seatFeatures)],
        ['Sunroof / Panoramic Roof', specValue(car.specs?.sunroof)],
      ],
    },
    {
      key: 'safety',
      title: 'Safety & Driver Assistance',
      rows: [
        ['Airbags', specValue(car.specs?.airbags)],
        ['ABS / ESP', specValue(car.specs?.absEsp)],
        ['Cameras', specValue(car.specs?.cameras)],
        ['Parking Sensors', specValue(car.specs?.parkingSensors)],
        ['Cruise Control', specValue(car.specs?.cruiseControl)],
        ['Lane Assist', specValue(car.specs?.laneAssist)],
        ['Blind-Spot Monitoring', specValue(car.specs?.blindSpotMonitoring)],
      ],
    },
    {
      key: 'exterior',
      title: 'Exterior',
      rows: [
        ['Headlights', specValue(car.specs?.headlights)],
        ['Wheels', specValue(car.specs?.wheels)],
        ['Roof Rails', specValue(car.specs?.roofRails)],
        ['Tow Bar', specValue(car.specs?.towBar)],
      ],
    },
    {
      key: 'documents',
      title: 'Documents & Condition',
      rows: [
        ['VIN / Chassis', specValue(car.vin)],
        ['Customs Duty Status', specValue(car.specs?.customsDutyStatus)],
        ['Registration', specValue(car.specs?.registrationStatus)],
        ['Service History', specValue(car.specs?.serviceHistory)],
        ['Accident History', specValue(car.specs?.accidentHistory)],
        ['Inspection Notes', specValue(car.specs?.inspectionNotes)],
      ],
    },
  ];

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInspSubmitted(true);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSent(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#6B6D72]" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#111214]">Home</Link>
        <span>/</span>
        <Link to="/inventory" className="hover:text-[#111214]">Showroom</Link>
        <span>/</span>
        <Link to={`/brands/${brandToSlug(car.brand)}`} className="hover:text-[#111214]">
          {car.brand}
        </Link>
        <span>/</span>
        <span className="text-[#111214] font-medium">{car.model}</span>
      </nav>

      {/* Top Highlights Strip (6 Key Specs with Icons) */}
      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { icon: Calendar, label: 'Year', val: String(car.year) },
          { icon: Gauge, label: 'Mileage', val: `${car.mileage.toLocaleString()} km` },
          { icon: Settings, label: 'Transmission', val: car.transmission },
          { icon: Fuel, label: 'Fuel', val: car.fuel },
          { icon: Compass, label: 'Drivetrain', val: car.drivetrain },
          { icon: Zap, label: 'Power', val: car.horsepower || car.engine },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-black/8 bg-white px-3.5 py-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F4F0] text-[#9B7D48]">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6D72]">
                  {item.label}
                </p>
                <p className="truncate font-mono text-xs font-bold text-[#111214]">{item.val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Split: Left Gallery & Specs Accordions | Right Sticky Purchase Card */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Media Mode Tabs */}
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-black/8 bg-white p-1.5">
            {[
              { id: 'photos', label: 'Photos', icon: ImageIcon },
              { id: '3d', label: '3D Viewer', icon: Box },
              { id: 'video', label: 'Video', icon: Video },
              { id: 'spin360', label: '360° Spin', icon: RotateCw },
              { id: 'interior', label: 'Interior', icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as MediaTab)}
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#111214] text-white'
                      : 'text-[#525459] hover:bg-[#F5F4F0] hover:text-[#111214]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Viewport */}
          {activeTab === '3d' ? (
            <Suspense fallback={<AutosatLoadingScreen label="Loading 3D Showroom..." />}>
              <CarViewer3D
                bodyType={car.bodyType}
                paintHex={paintHex}
                model3d={car.model3d}
                fallbackImage={activeGalleryImages[0] || car.interior360 || ''}
                carName={carFullTitle}
              />
            </Suspense>
          ) : (
            <CarMediaGallery
              carName={carFullTitle}
              colorName={activeColor.name}
              images={activeGalleryImages}
              interiorImage={car.interior360}
              videoUrl={car.videoUrl}
              activeTab={activeTab}
            />
          )}

          {/* Colour Switcher (All OEM Factory Finishes, Real Photos Per Colour Only) */}
          <div className="rounded-2xl border border-black/8 bg-white p-5 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6D72]">
                  Available Factory Colours
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#111214]">
                  {hoveredColorName || activeColor.name}
                  {hoveredColorName &&
                    car.colors.find((c) => c.name === hoveredColorName)?.images.length === 0 && (
                      <span className="ml-2 text-xs font-medium text-[#9B7D48]">
                        (Photos coming soon)
                      </span>
                    )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {car.colors.map((color, idx) => {
                  const hasPhotos = color.images && color.images.length > 0;
                  const isSelected = idx === selectedColorIdx;
                  return (
                    <div key={color.name} className="group relative flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => handleSelectColor(idx)}
                        onMouseEnter={() => setHoveredColorName(color.name)}
                        onMouseLeave={() => setHoveredColorName(null)}
                        aria-disabled={!hasPhotos}
                        aria-label={
                          hasPhotos
                            ? `Select colour ${color.name}`
                            : `${color.name} — Photos coming soon`
                        }
                        title={hasPhotos ? color.name : `${color.name} (Photos coming soon)`}
                        className={`relative h-9 w-9 rounded-full border-2 transition-transform ${
                          isSelected
                            ? 'scale-110 border-[#111214] ring-2 ring-[#B5945B] cursor-pointer'
                            : hasPhotos
                            ? 'border-black/25 hover:scale-105 cursor-pointer'
                            : 'border-dashed border-black/30 opacity-50 cursor-not-allowed'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <Check className="mx-auto h-4 w-4 text-white drop-shadow" aria-hidden="true" />
                        )}
                        {!hasPhotos && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <span className="h-[1.5px] w-7 -rotate-45 bg-white/80 shadow" />
                          </span>
                        )}
                      </button>

                      {/* Tooltip on hover */}
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#111214] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 z-20">
                        {color.name}
                        {!hasPhotos ? ' · Photos coming soon' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {unavailableColorNotice && (
              <div className="rounded-xl border border-dashed border-[#B5945B]/60 bg-[#F9F8F6] px-3.5 py-2.5 text-xs text-[#525459]">
                <strong className="text-[#111214]">Photos coming soon:</strong>{' '}
                {unavailableColorNotice}
              </div>
            )}

            <p className="text-[11px] text-[#6B6D72]">
              Swatches with real photography switch the gallery, thumbnails, lightbox, and 360° view cleanly. Unphotographed factory shades are marked “Photos coming soon”.
            </p>
          </div>

          {/* Overview Paragraph & Features Checklist with Tick Icons */}
          <div className="rounded-2xl border border-black/8 bg-white p-6 space-y-5">
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#111214]">
                Showroom Summary
              </h2>
              <p className="mt-2 text-sm text-[#525459] leading-relaxed">{car.description}</p>
            </div>

            <div className="border-t border-black/8 pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6D72]">
                Features Checklist
              </h3>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {car.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-xs font-medium text-[#111214]">
                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 8 Grouped, Collapsible Detailed Specifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-2xl font-bold text-[#111214]">
                Full Technical Specifications
              </h2>
              <button
                type="button"
                onClick={() => {
                  const allOpen = Object.values(openGroups).every(Boolean);
                  const nextState: Record<string, boolean> = {};
                  specSections.forEach((s) => {
                    nextState[s.key] = !allOpen;
                  });
                  setOpenGroups(nextState);
                }}
                className="text-xs font-semibold text-[#9B7D48] hover:text-[#111214] cursor-pointer"
              >
                {Object.values(openGroups).every(Boolean) ? 'Collapse all' : 'Expand all'}
              </button>
            </div>

            {specSections.map((sec) => {
              const isOpen = Boolean(openGroups[sec.key]);
              return (
                <div
                  key={sec.key}
                  className="overflow-hidden rounded-2xl border border-black/8 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => toggleGroup(sec.key)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#F9F8F6] transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-[#111214]">{sec.title}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#6B6D72]" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#6B6D72]" aria-hidden="true" />
                    )}
                  </button>
                  {isOpen && (
                    <dl className="grid grid-cols-1 divide-y divide-black/6 border-t border-black/8 sm:grid-cols-2 sm:divide-x">
                      {sec.rows.map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-4 px-5 py-3 text-xs">
                          <dt className="text-[#6B6D72]">{label}</dt>
                          <dd
                            className={`text-right font-mono ${
                              value === 'Not specified'
                                ? 'text-[#9CA3AF]'
                                : 'font-semibold text-[#111214]'
                            }`}
                          >
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sticky Purchase Module & Quick Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9B7D48]">
                {car.brand}
              </p>
              <h1 className="mt-1 font-editorial text-3xl font-bold text-[#111214] sm:text-4xl">
                {car.model}
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-2 text-xs text-[#525459]">
                <span className="font-semibold text-emerald-700">
                  {car.status === 'available' ? 'In stock' : 'Sold'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{car.condition}</span>
                <span aria-hidden="true">·</span>
                <span>{car.year}</span>
                <span aria-hidden="true">·</span>
                <span>{activeColor.name}</span>
              </div>

              <div className="mt-4 flex flex-wrap items-baseline gap-2.5">
                <span className="font-mono text-3xl font-bold tabular-nums text-[#111214]">
                  {formatNaira(car.price)}
                </span>
                <span className="text-xs text-[#6B6D72]">
                  {car.negotiable ? 'Negotiable · duty cleared' : 'Duty cleared'}
                </span>
              </div>
            </div>

            {/* Clean 2-Column Summary Specs Card */}
            <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
              <div className="grid grid-cols-2 divide-x divide-y divide-black/8">
                {[
                  ['MILEAGE', `${car.mileage.toLocaleString()} km`],
                  ['TRANSMISSION', car.transmission],
                  ['ENGINE', car.engine],
                  ['FUEL', car.fuel],
                  ['BODY', car.bodyType],
                  ['COLOUR', activeColor.name],
                  ['HORSEPOWER', car.horsepower],
                  ['DRIVETRAIN', car.drivetrain],
                  ['SEATS', `${car.seats} Seats`],
                  ['VIN / CHASSIS', specValue(car.vin)],
                ].map(([label, value]) => (
                  <div key={label} className="p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B6D72]">
                      {label}
                    </p>
                    <p className="mt-1 font-mono text-xs font-semibold text-[#111214] truncate">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reservation, Viewing & Compare Actions */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => (inGarage ? setDrawerOpen(true) : addToGarage(car.id))}
                className="inline-flex items-center justify-center rounded-full bg-[#111214] px-5 py-3 text-xs font-semibold text-white hover:bg-[#2A2C30] transition-colors cursor-pointer"
              >
                {inGarage ? 'View in garage' : 'Reserve this car'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspSubmitted(false);
                  setInspectionOpen(true);
                }}
                className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-xs font-semibold text-[#111214] hover:border-[#111214] transition-colors cursor-pointer"
              >
                Book a viewing
              </button>
            </div>

            <button
              type="button"
              onClick={() => toggleCompare(car.id)}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                compared
                  ? 'border-[#111214] bg-[#111214] text-[#E5C98E]'
                  : 'border-black/15 bg-white text-[#111214] hover:border-[#111214]'
              }`}
            >
              <GitCompareArrows className="h-3.5 w-3.5" aria-hidden="true" />
              {compared ? 'Added to Compare (View tray below)' : 'Compare this car (up to 3)'}
            </button>

            {/* WhatsApp Concierge + Call + Delivery Quote Card */}
            <div className="rounded-2xl border border-black/8 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111214] text-xs font-bold text-[#E5C98E]">
                    <CarIcon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111214]">Talk to a sales advisor</p>
                    <p className="text-[11px] text-[#6B6D72]">Replies on WhatsApp within minutes</p>
                  </div>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1F7A4D] px-3.5 py-2 text-[11px] font-semibold text-white hover:bg-[#258E5A]"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-black/8 pt-3">
                <a
                  href={`tel:${BUSINESS_INFO.phonePrimaryRaw}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/10 bg-[#F9F8F6] py-2 text-xs font-semibold text-[#111214] hover:border-[#111214]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#9B7D48]" aria-hidden="true" />
                  Call Now
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setQuoteSent(false);
                    setQuoteOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/10 bg-[#F9F8F6] py-2 text-xs font-semibold text-[#111214] hover:border-[#111214] cursor-pointer"
                >
                  <Truck className="h-3.5 w-3.5 text-[#9B7D48]" aria-hidden="true" />
                  Delivery Quote
                </button>
              </div>

              <p className="flex items-center gap-1.5 text-[11px] text-[#6B6D72]">
                <MapPin className="h-3.5 w-3.5 text-[#9B7D48] shrink-0" aria-hidden="true" />
                {car.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Cars */}
      {similarCars.length > 0 && (
        <section className="mt-16 border-t border-black/10 pt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl font-bold text-[#111214] sm:text-3xl">
              Similar Vehicles in Showroom
            </h2>
            <Link to="/inventory" className="text-xs font-semibold text-[#111214] underline underline-offset-4">
              View All
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {similarCars.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </section>
      )}

      {/* Book Inspection Modal */}
      {inspectionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Book showroom inspection"
        >
          <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-2xl font-bold text-[#111214]">
                Book Walk-In Inspection
              </h3>
              <button
                type="button"
                onClick={() => setInspectionOpen(false)}
                className="rounded-full p-1 text-[#6B6D72] hover:bg-[#F5F4F0] hover:text-[#111214] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-[#6B6D72]">
              {carFullTitle} · {BUSINESS_INFO.addressPrimary}
            </p>

            {inspSubmitted ? (
              <div className="mt-5 space-y-4 rounded-xl border border-black/8 bg-[#F9F8F6] p-4">
                <p className="text-sm font-bold text-[#111214]">Inspection Slot Reserved</p>
                <p className="text-xs text-[#525459] leading-relaxed">
                  Thank you, {inspName}. Our Ikeja bay manager will confirm your {inspDate} viewing on {inspPhone}. Send directly to WhatsApp for instant confirmation.
                </p>
                <a
                  href={buildWhatsAppUrl(
                    `Hello AUTOSAT LIMITED, I booked a physical inspection for the ${carFullTitle}. Name: ${inspName}, Phone: ${inspPhone}, Preferred Date: ${inspDate}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F7A4D] py-3 text-xs font-semibold text-white"
                >
                  Confirm on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleInspectionSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={inspName}
                    onChange={(e) => setInspName(e.target.value)}
                    placeholder="e.g. Tunde Bakare"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214] focus:border-[#111214] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Phone / WhatsApp Number</label>
                  <input
                    required
                    type="tel"
                    value={inspPhone}
                    onChange={(e) => setInspPhone(e.target.value)}
                    placeholder="+234 80..."
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214] focus:border-[#111214] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Preferred Inspection Date</label>
                  <input
                    required
                    type="date"
                    value={inspDate}
                    onChange={(e) => setInspDate(e.target.value)}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214] focus:border-[#111214] focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#111214] py-3 text-xs font-semibold text-white hover:bg-[#2A2C30] cursor-pointer"
                >
                  Reserve Inspection Time
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delivery Quote Modal */}
      {quoteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Request delivery quote"
        >
          <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-2xl font-bold text-[#111214]">
                Nationwide Delivery Quote
              </h3>
              <button
                type="button"
                onClick={() => setQuoteOpen(false)}
                className="rounded-full p-1 text-[#6B6D72] hover:bg-[#F5F4F0] hover:text-[#111214] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-[#6B6D72]">
              Insured dispatch from Ikeja, Lagos for {carFullTitle}
            </p>

            {quoteSent ? (
              <div className="mt-5 space-y-4 rounded-xl border border-black/8 bg-[#F9F8F6] p-4">
                <p className="text-sm font-bold text-[#111214]">Quote Logged for {destState}</p>
                <p className="text-xs text-[#525459]">
                  Estimated Transit: <strong>{selectedStateInfo.transitDays}</strong> · Carrier Estimate:{' '}
                  <strong className="font-mono text-[#111214]">{formatNaira(selectedStateInfo.estimatedFee)}</strong>
                </p>
                <a
                  href={buildWhatsAppUrl(
                    `Hello AUTOSAT LIMITED, please send a formal delivery invoice for ${carFullTitle} to ${destState}. Name: ${quoteName}, Phone: ${quotePhone}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F7A4D] py-3 text-xs font-semibold text-white"
                >
                  Finalize on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Destination State (Nigeria)</label>
                  <select
                    value={destState}
                    onChange={(e) => setDestState(e.target.value)}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st.state} value={st.state}>
                        {st.state} — {st.transitDays} ({formatNaira(st.estimatedFee)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Your Name</label>
                  <input
                    required
                    type="text"
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Phone / WhatsApp</label>
                  <input
                    required
                    type="tel"
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#111214] py-3 text-xs font-semibold text-white hover:bg-[#2A2C30] cursor-pointer"
                >
                  Get Delivery Invoice
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
