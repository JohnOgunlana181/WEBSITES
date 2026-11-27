import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Edit3,
  ImagePlus,
  Lock,
  MessageCircle,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useSellRequests } from '../context/SellRequestsContext';
import { SHOWROOM_BRANDS, buildWhatsAppUrl, formatNaira } from '../data/constants';
import {
  BodyType,
  Car,
  CarColor,
  CarCondition,
  CarDetailedSpecs,
  FuelType,
  SellRequestStatus,
  TransmissionType,
} from '../types/car';
import { compressImageFile } from '../utils/imageCompression';
import { AutosatLogo } from '../components/AutosatLogo';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const STAFF_PASSCODE = 'AUTOSAT2026';

interface AdminFormState {
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
  vin: string;
  location: string;
  featuresText: string;
  model3d: string;
  interior360: string;
  videoUrl: string;
  description: string;
  colors: CarColor[];
  specs: CarDetailedSpecs;
}

const createEmptyForm = (): AdminFormState => ({
  brand: 'Mercedes-Benz',
  model: '',
  year: 2023,
  price: 75000000,
  negotiable: true,
  condition: 'Foreign Used',
  bodyType: 'SUV',
  fuel: 'Petrol',
  transmission: 'Automatic',
  engine: '',
  horsepower: '',
  drivetrain: '',
  mileage: 0,
  seats: 5,
  vin: '',
  location: '24 Unity Road, Ikeja, Lagos',
  featuresText: '',
  model3d: '',
  interior360: '',
  videoUrl: '',
  description: '',
  colors: [
    {
      name: 'Obsidian Black',
      hex: '#141619',
      images: [],
      modelOverrideHex: '#141619',
    },
  ],
  specs: {},
});

const SPEC_FIELD_GROUPS: {
  title: string;
  fields: { key: keyof CarDetailedSpecs; label: string; placeholder?: string }[];
}[] = [
  {
    title: 'Overview Extras',
    fields: [
      { key: 'trim', label: 'Trim', placeholder: 'e.g. AMG Line / Autobiography' },
      { key: 'interiorColor', label: 'Interior Colour', placeholder: 'e.g. Saddle Brown' },
      { key: 'ownersCount', label: 'Number of Owners', placeholder: 'e.g. 1 Previous Owner' },
    ],
  },
  {
    title: 'Engine & Performance',
    fields: [
      { key: 'cylinders', label: 'Cylinders', placeholder: 'e.g. V6 / Inline-6' },
      { key: 'torque', label: 'Torque', placeholder: 'e.g. 500 Nm' },
      { key: 'acceleration0To100', label: '0–100 km/h', placeholder: 'e.g. 5.7 s' },
      { key: 'topSpeed', label: 'Top Speed', placeholder: 'e.g. 250 km/h' },
      { key: 'fuelEconomy', label: 'Fuel Economy', placeholder: 'e.g. 10.2 L/100km' },
    ],
  },
  {
    title: 'Transmission & Chassis',
    fields: [
      { key: 'gearboxSpeeds', label: 'Gearbox Speeds', placeholder: 'e.g. 9-Speed 9G-TRONIC' },
      { key: 'suspension', label: 'Suspension', placeholder: 'e.g. Adaptive Air Suspension' },
      { key: 'brakes', label: 'Brakes', placeholder: 'e.g. Ventilated Discs ABS' },
      { key: 'wheelTyreSize', label: 'Wheel & Tyre Size', placeholder: 'e.g. 275/50 R20' },
    ],
  },
  {
    title: 'Dimensions & Capacity',
    fields: [
      { key: 'length', label: 'Length', placeholder: 'e.g. 4,924 mm' },
      { key: 'width', label: 'Width', placeholder: 'e.g. 1,947 mm' },
      { key: 'height', label: 'Height', placeholder: 'e.g. 1,772 mm' },
      { key: 'wheelbase', label: 'Wheelbase', placeholder: 'e.g. 2,995 mm' },
      { key: 'groundClearance', label: 'Ground Clearance', placeholder: 'e.g. 210 mm' },
      { key: 'bootSpace', label: 'Boot Space', placeholder: 'e.g. 630 L' },
      { key: 'doors', label: 'Doors', placeholder: 'e.g. 5 Doors' },
      { key: 'fuelTank', label: 'Fuel Tank Size', placeholder: 'e.g. 85 L' },
      { key: 'kerbWeight', label: 'Kerb Weight', placeholder: 'e.g. 2,220 kg' },
    ],
  },
  {
    title: 'Interior & Comfort',
    fields: [
      { key: 'upholstery', label: 'Upholstery', placeholder: 'e.g. Perforated Nappa Leather' },
      { key: 'acZones', label: 'AC Zones', placeholder: 'e.g. 4-Zone Climate Control' },
      { key: 'infotainmentScreen', label: 'Infotainment Screen', placeholder: 'e.g. 12.3-inch Dual Touch' },
      { key: 'soundSystem', label: 'Sound System', placeholder: 'e.g. Burmester / Meridian' },
      { key: 'ambientLighting', label: 'Ambient Lighting', placeholder: 'e.g. 64-Colour LED' },
      { key: 'seatFeatures', label: 'Seat Features', placeholder: 'e.g. Heated, Ventilated, Memory' },
      { key: 'sunroof', label: 'Sunroof / Roof', placeholder: 'e.g. Panoramic Glass Roof' },
    ],
  },
  {
    title: 'Safety & Driver Assistance',
    fields: [
      { key: 'airbags', label: 'Airbags', placeholder: 'e.g. 9 Airbags' },
      { key: 'absEsp', label: 'ABS / ESP', placeholder: 'e.g. ABS, EBD, Stability Control' },
      { key: 'cameras', label: 'Cameras', placeholder: 'e.g. 360° Surround View' },
      { key: 'parkingSensors', label: 'Parking Sensors', placeholder: 'e.g. Front & Rear Active' },
      { key: 'cruiseControl', label: 'Cruise Control', placeholder: 'e.g. Adaptive Cruise Control' },
      { key: 'laneAssist', label: 'Lane Assist', placeholder: 'e.g. Active Lane Keeping Assist' },
      { key: 'blindSpotMonitoring', label: 'Blind-Spot Monitoring', placeholder: 'e.g. Active Blind Spot' },
    ],
  },
  {
    title: 'Exterior',
    fields: [
      { key: 'headlights', label: 'Headlights', placeholder: 'e.g. Multibeam LED' },
      { key: 'wheels', label: 'Wheels', placeholder: 'e.g. 21-inch AMG Alloy' },
      { key: 'roofRails', label: 'Roof Rails', placeholder: 'e.g. Brushed Aluminium' },
      { key: 'towBar', label: 'Tow Bar', placeholder: 'e.g. Factory Prep' },
    ],
  },
  {
    title: 'Documents & Condition',
    fields: [
      { key: 'customsDutyStatus', label: 'Customs Duty Status', placeholder: 'e.g. Nigerian Customs Duty Paid' },
      { key: 'registrationStatus', label: 'Registration Status', placeholder: 'e.g. Unregistered Foreign Used' },
      { key: 'serviceHistory', label: 'Service History', placeholder: 'e.g. Full Dealership Service' },
      { key: 'accidentHistory', label: 'Accident History', placeholder: 'e.g. Clean / Accident-Free' },
      { key: 'inspectionNotes', label: 'Inspection Notes', placeholder: 'Showroom bay notes...' },
    ],
  },
];

export const AdminPage: React.FC = () => {
  const { cars, addCar, updateCar, deleteCar, toggleSoldStatus, resetToSeed, exportJson } =
    useInventory();
  const { sellRequests, updateSellRequestStatus, deleteSellRequest } = useSellRequests();

  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('autosat_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeSection, setActiveSection] = useState<'inventory' | 'sellRequests'>('inventory');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminFormState>(createEmptyForm);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#141619');
  const [photoPathDrafts, setPhotoPathDrafts] = useState<Record<number, string>>({});

  useDocumentMeta({
    title: 'Staff Inventory Manager – AUTOSAT LIMITED',
    description: 'Internal showroom stock & sell requests management portal for AUTOSAT LIMITED.',
  });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === STAFF_PASSCODE) {
      setUnlocked(true);
      setAuthError('');
      try {
        sessionStorage.setItem('autosat_admin_unlocked', 'true');
      } catch {
        // Ignore
      }
    } else {
      setAuthError('Incorrect staff passcode. Check README.md for default access.');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setPhotoPathDrafts({});
    setModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingId(car.id);
    setForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      negotiable: car.negotiable,
      condition: car.condition,
      bodyType: car.bodyType,
      fuel: car.fuel,
      transmission: car.transmission,
      engine: car.engine,
      horsepower: car.horsepower,
      drivetrain: car.drivetrain,
      mileage: car.mileage,
      seats: car.seats,
      vin: car.vin || '',
      location: car.location,
      featuresText: car.features.join(', '),
      model3d: car.model3d || '',
      interior360: car.interior360 || '',
      videoUrl: car.videoUrl || '',
      description: car.description,
      colors:
        car.colors.length > 0
          ? car.colors.map((c) => ({ ...c, images: [...(c.images || [])] }))
          : [{ name: 'Factory Finish', hex: '#141619', images: [...car.images], modelOverrideHex: '#141619' }],
      specs: { ...(car.specs || {}) },
    });
    setPhotoPathDrafts({});
    setModalOpen(true);
  };

  const handleAddColorRow = () => {
    const trimmed = newColorName.trim();
    if (!trimmed) return;
    setForm((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          name: trimmed,
          hex: newColorHex,
          images: [],
          modelOverrideHex: newColorHex,
        },
      ],
    }));
    setNewColorName('');
  };

  const handleRemoveColorRow = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));
  };

  const handleUploadColorPhotos = async (
    colorIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith('image/')) continue;
      try {
        const dataUrl = await compressImageFile(files[i], 960, 0.78);
        uploadedUrls.push(dataUrl);
      } catch {
        // Skip corrupt file
      }
    }
    if (uploadedUrls.length > 0) {
      setForm((prev) => ({
        ...prev,
        colors: prev.colors.map((c, idx) =>
          idx === colorIdx ? { ...c, images: [...c.images, ...uploadedUrls] } : c
        ),
      }));
    }
    e.target.value = '';
  };

  const handleAddColorPhotoPath = (colorIdx: number) => {
    const path = (photoPathDrafts[colorIdx] || '').trim();
    if (!path) return;
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, idx) =>
        idx === colorIdx ? { ...c, images: [...c.images, path] } : c
      ),
    }));
    setPhotoPathDrafts((prev) => ({ ...prev, [colorIdx]: '' }));
  };

  const handleRemoveColorPhoto = (colorIdx: number, imgIdx: number) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, idx) =>
        idx === colorIdx ? { ...c, images: c.images.filter((_, i) => i !== imgIdx) } : c
      ),
    }));
  };

  const updateSpecField = (key: keyof CarDetailedSpecs, val: string) => {
    setForm((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [key]: val,
      },
    }));
  };

  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    const features = form.featuresText
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const existing = editingId ? cars.find((c) => c.id === editingId) : undefined;
    const slugId =
      editingId ||
      `${form.brand}-${form.model}-${form.year}-${Date.now().toString().slice(-4)}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');

    const cleanedSpecs: CarDetailedSpecs = {};
    (Object.keys(form.specs) as (keyof CarDetailedSpecs)[]).forEach((k) => {
      const v = form.specs[k];
      if (v && v.trim()) cleanedSpecs[k] = v.trim();
    });

    const firstColorWithPhotos = form.colors.find((c) => c.images.length > 0) || form.colors[0];
    const primaryImages = firstColorWithPhotos?.images || [];

    const payload: Car = {
      id: slugId,
      brand: form.brand,
      model: form.model.trim(),
      year: Number(form.year),
      price: Number(form.price),
      negotiable: form.negotiable,
      condition: form.condition,
      bodyType: form.bodyType,
      fuel: form.fuel,
      transmission: form.transmission,
      engine: form.engine.trim() || 'Not specified',
      horsepower: form.horsepower.trim() || 'Not specified',
      drivetrain: form.drivetrain.trim() || 'Not specified',
      mileage: Number(form.mileage),
      seats: Number(form.seats),
      vin: form.vin.trim() || undefined,
      location: form.location.trim(),
      features,
      colors: form.colors.map((c) => ({
        name: c.name,
        hex: c.hex,
        images: c.images,
        modelOverrideHex: c.hex,
      })),
      model3d: form.model3d.trim(),
      interior360: form.interior360.trim() || existing?.interior360 || '',
      images: primaryImages,
      videoUrl: form.videoUrl.trim(),
      description: form.description.trim(),
      status: existing?.status || 'available',
      isFeatured: existing?.isFeatured ?? true,
      isLatest: existing?.isLatest ?? true,
      rentalDailyRate: existing?.rentalDailyRate,
      rentalWeeklyRate: existing?.rentalWeeklyRate,
      specs: cleanedSpecs,
    };

    if (editingId) {
      updateCar(payload);
    } else {
      addCar(payload);
    }
    setModalOpen(false);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cars.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const newSellCount = sellRequests.filter((r) => r.status === 'New').length;

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-16">
        <form
          onSubmit={handleUnlock}
          className="w-full rounded-2xl border border-black/8 bg-white p-7 space-y-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <AutosatLogo variant="onLight" size="sm" />
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111214] text-[#B5945B]">
              <Lock className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
          </div>

          <div>
            <h1 className="font-editorial text-2xl font-bold text-[#111214]">
              Staff Showroom Portal
            </h1>
            <p className="text-xs text-[#6B6D72]">
              Enter showroom passcode to manage inventory &amp; sell requests
            </p>
          </div>

          <div>
            <label htmlFor="staff-passcode" className="block text-xs font-medium text-[#525459] mb-1.5">
              Staff Passcode
            </label>
            <input
              id="staff-passcode"
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214] focus:border-[#111214] focus:bg-white focus:outline-none"
            />
            {authError && <p className="mt-2 text-xs text-red-600">{authError}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#111214] py-3 text-xs font-semibold text-white hover:bg-[#2A2C30] cursor-pointer"
          >
            Unlock Staff Portal
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header with Uploaded AUTOSAT Logo */}
      <div className="flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <AutosatLogo variant="onLight" size="md" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
              LOCALSTORAGE CMS · LIVE SYNC
            </p>
            <h1 className="mt-0.5 font-editorial text-2xl font-bold text-[#111214] sm:text-3xl">
              Showroom Admin Portal
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#111214] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2A2C30] cursor-pointer"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Vehicle
          </button>
          <button
            type="button"
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-[#111214] hover:border-[#111214] cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export cars.json
          </button>
          <button
            type="button"
            onClick={resetToSeed}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium text-[#6B6D72] hover:text-[#111214] cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset Seed
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSection('inventory')}
          className={`rounded-full px-5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
            activeSection === 'inventory'
              ? 'bg-[#111214] text-white'
              : 'border border-black/12 bg-white text-[#525459] hover:text-[#111214]'
          }`}
        >
          Showroom Inventory ({cars.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('sellRequests')}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
            activeSection === 'sellRequests'
              ? 'bg-[#111214] text-white'
              : 'border border-black/12 bg-white text-[#525459] hover:text-[#111214]'
          }`}
        >
          Sell Requests ({sellRequests.length})
          {newSellCount > 0 && (
            <span className="rounded-full bg-[#B5945B] px-2 py-0.5 text-[10px] font-bold text-[#111214]">
              {newSellCount} New
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: INVENTORY TABLE */}
      {activeSection === 'inventory' ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-black/8 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/8 bg-[#F9F8F6] text-[#6B6D72]">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Vehicle</th>
                <th className="px-4 py-3.5 font-semibold">Condition</th>
                <th className="px-4 py-3.5 font-semibold">Colours</th>
                <th className="px-4 py-3.5 font-semibold">Price (₦)</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8">
              {cars.map((car) => {
                const photographedColors = car.colors.filter((c) => c.images.length > 0).length;
                return (
                  <tr key={car.id} className="hover:bg-[#F9F8F6]/70">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-[#111214]">
                        {car.year} {car.brand} {car.model}
                      </p>
                      <p className="text-[11px] text-[#6B6D72] font-mono">
                        {car.bodyType} · {car.mileage.toLocaleString()} km
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-[#525459]">{car.condition}</td>
                    <td className="px-4 py-3.5 text-[11px] text-[#525459]">
                      {photographedColors}/{car.colors.length} with photos
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold tabular-nums text-[#111214]">
                      {formatNaira(car.price)}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => toggleSoldStatus(car.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
                          car.status === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        {car.status === 'available' ? 'Available' : 'Sold'}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(car)}
                          className="rounded-lg border border-black/15 p-1.5 text-[#525459] hover:border-[#111214] hover:text-[#111214] cursor-pointer"
                          aria-label={`Edit ${car.model}`}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCar(car.id)}
                          className="rounded-lg border border-black/15 p-1.5 text-[#6B6D72] hover:border-red-500 hover:text-red-600 cursor-pointer"
                          aria-label={`Delete ${car.model}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* TAB 2: SELL REQUESTS */
        <div className="mt-6 space-y-4">
          {sellRequests.length === 0 ? (
            <div className="rounded-2xl border border-black/8 bg-white p-12 text-center">
              <p className="font-editorial text-xl font-bold text-[#111214]">
                No Sell Requests Yet
              </p>
              <p className="mt-1.5 text-xs text-[#6B6D72]">
                Customer submissions from /sell-your-car will appear here automatically.
              </p>
            </div>
          ) : (
            sellRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-black/8 bg-white p-6 space-y-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#9B7D48]">{req.id}</span>
                      <span className="text-xs text-[#6B6D72]">
                        · {new Date(req.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h2 className="mt-1 font-editorial text-xl font-bold text-[#111214]">
                      {req.year} {req.brand} {req.model} —{' '}
                      <span className="font-mono">{formatNaira(req.askingPrice)}</span>
                    </h2>
                    <p className="mt-1 text-xs text-[#525459]">
                      {req.condition} · {req.transmission} · {req.fuel} · {req.colour} ·{' '}
                      {req.mileage.toLocaleString()} km · {req.location}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label={`Status for ${req.id}`}
                      value={req.status}
                      onChange={(e) =>
                        updateSellRequestStatus(req.id, e.target.value as SellRequestStatus)
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                        req.status === 'New'
                          ? 'border-amber-300 bg-amber-50 text-amber-800'
                          : req.status === 'Contacted'
                          ? 'border-sky-300 bg-sky-50 text-sky-800'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      <option value="New">Status: New</option>
                      <option value="Contacted">Status: Contacted</option>
                      <option value="Closed">Status: Closed</option>
                    </select>

                    <a
                      href={buildWhatsAppUrl(
                        `Hello ${req.fullName}, this is AUTOSAT LIMITED following up on your ${req.year} ${req.brand} ${req.model} sell request (${req.id}).`,
                        req.phone.replace(/\D/g, '') || undefined
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#1F7A4D] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#258E5A]"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      WhatsApp Seller
                    </a>

                    <button
                      type="button"
                      onClick={() => deleteSellRequest(req.id)}
                      aria-label={`Delete sell request ${req.id}`}
                      className="rounded-lg border border-black/15 p-1.5 text-[#6B6D72] hover:border-red-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 rounded-xl bg-[#F9F8F6] p-4 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-[#6B6D72]">Seller: </span>
                    <strong className="text-[#111214]">{req.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B6D72]">Phone: </span>
                    <strong className="font-mono text-[#111214]">{req.phone}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B6D72]">Email: </span>
                    <strong className="text-[#111214]">{req.email}</strong>
                  </div>
                </div>

                {req.description && (
                  <p className="text-xs text-[#525459] leading-relaxed">{req.description}</p>
                )}

                {req.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
                    {req.photos.map((p) => (
                      <div
                        key={p.id}
                        className="overflow-hidden rounded-lg border border-black/10 bg-[#E9E7E0]"
                      >
                        <img
                          src={p.dataUrl}
                          alt={p.angle}
                          className="aspect-[4/3] w-full object-cover"
                        />
                        <p className="bg-white px-2 py-1 text-[10px] font-semibold text-[#111214] truncate">
                          {p.angle}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ADD / EDIT VEHICLE MODAL WITH PER-COLOUR PHOTO UPLOADER + ALL SPECS */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="my-6 w-full max-w-4xl rounded-2xl border border-black/10 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-black/8 pb-4">
              <h2 className="font-editorial text-2xl font-bold text-[#111214]">
                {editingId ? 'Edit Vehicle & Detailed Specs' : 'Add New Vehicle'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-[#6B6D72] hover:bg-[#F5F4F0] hover:text-[#111214] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCar} className="mt-5 space-y-6">
              {/* Core Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Brand *</label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                  >
                    {SHOWROOM_BRANDS.map((b) => (
                      <option key={b.slug} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Model *</label>
                  <input
                    required
                    type="text"
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    placeholder="e.g. GLE 53 AMG Coupe"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Year *</label>
                  <input
                    required
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm font-mono text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Price (₦) *</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm font-mono text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Condition *</label>
                  <select
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value as CarCondition })}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                  >
                    <option value="Foreign Used">Foreign Used</option>
                    <option value="Nigerian Used">Nigerian Used</option>
                    <option value="Brand New">Brand New</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Body Type *</label>
                  <select
                    value={form.bodyType}
                    onChange={(e) => setForm({ ...form, bodyType: e.target.value as BodyType })}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Fuel Type</label>
                  <select
                    value={form.fuel}
                    onChange={(e) => setForm({ ...form, fuel: e.target.value as FuelType })}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Transmission</label>
                  <select
                    value={form.transmission}
                    onChange={(e) =>
                      setForm({ ...form, transmission: e.target.value as TransmissionType })
                    }
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Mileage (km)</label>
                  <input
                    type="number"
                    value={form.mileage}
                    onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm font-mono text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Engine Type &amp; Size</label>
                  <input
                    type="text"
                    value={form.engine}
                    onChange={(e) => setForm({ ...form, engine: e.target.value })}
                    placeholder="e.g. 3.0L Inline-6 Turbo"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Horsepower</label>
                  <input
                    type="text"
                    value={form.horsepower}
                    onChange={(e) => setForm({ ...form, horsepower: e.target.value })}
                    placeholder="e.g. 362 hp"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Drivetrain</label>
                  <input
                    type="text"
                    value={form.drivetrain}
                    onChange={(e) => setForm({ ...form, drivetrain: e.target.value })}
                    placeholder="FWD / RWD / AWD / 4x4"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Seats</label>
                  <input
                    type="number"
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm font-mono text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">VIN / Chassis</label>
                  <input
                    type="text"
                    value={form.vin}
                    onChange={(e) => setForm({ ...form, vin: e.target.value })}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-xs font-mono text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                  />
                </div>
              </div>

              {/* Per-Colour Real Photo Manager */}
              <div className="rounded-xl border border-black/10 bg-[#F9F8F6] p-4 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111214]">
                    Colours &amp; Real Photos Per Colour
                  </h3>
                  <p className="text-[11px] text-[#6B6D72]">
                    Add factory colours and upload real photographs for each specific finish. Colours without photos display “Photos coming soon”.
                  </p>
                </div>

                {/* Add new color */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="New colour name (e.g. Hyacinth Red)"
                    className="flex-1 min-w-[200px] rounded-lg border border-black/15 bg-white px-3 py-2 text-xs text-[#111214]"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    aria-label="New colour swatch hex"
                    className="h-9 w-11 rounded border border-black/15 bg-white cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleAddColorRow}
                    className="inline-flex items-center gap-1 rounded-full bg-[#111214] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Colour
                  </button>
                </div>

                {/* Color Cards */}
                <div className="space-y-3">
                  {form.colors.map((color, colorIdx) => (
                    <div
                      key={`${color.name}-${colorIdx}`}
                      className="rounded-xl border border-black/10 bg-white p-3.5 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="h-5 w-5 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs font-bold text-[#111214]">{color.name}</span>
                          <span className="font-mono text-[11px] text-[#6B6D72]">
                            ({color.images.length} photos)
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-[#F9F8F6] px-3 py-1.5 text-[11px] font-semibold text-[#111214] hover:border-[#111214] cursor-pointer">
                            <ImagePlus className="h-3.5 w-3.5 text-[#9B7D48]" />
                            Upload Photos
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleUploadColorPhotos(colorIdx, e)}
                              className="sr-only"
                            />
                          </label>
                          {form.colors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveColorRow(colorIdx)}
                              className="rounded-full p-1.5 text-[#6B6D72] hover:text-red-600 cursor-pointer"
                              aria-label={`Remove ${color.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Manual Path Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={photoPathDrafts[colorIdx] || ''}
                          onChange={(e) =>
                            setPhotoPathDrafts((prev) => ({ ...prev, [colorIdx]: e.target.value }))
                          }
                          placeholder="/images/cars/model-color-ext-1.jpg"
                          className="flex-1 rounded-lg border border-black/12 bg-[#F9F8F6] px-3 py-1.5 text-[11px] font-mono text-[#111214]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddColorPhotoPath(colorIdx)}
                          className="rounded-lg border border-black/15 px-3 py-1.5 text-[11px] font-semibold text-[#111214] hover:bg-[#F5F4F0] cursor-pointer"
                        >
                          Add Path
                        </button>
                      </div>

                      {/* Thumbnails for this color */}
                      {color.images.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {color.images.map((imgUrl, imgIdx) => (
                            <div
                              key={`${imgUrl.slice(0, 30)}-${imgIdx}`}
                              className="group relative h-14 w-20 overflow-hidden rounded-lg border border-black/10 bg-[#E9E7E0]"
                            >
                              <img
                                src={imgUrl}
                                alt={`${color.name} ${imgIdx + 1}`}
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveColorPhoto(colorIdx, imgIdx)}
                                aria-label="Remove photo"
                                className="absolute top-1 right-1 rounded-full bg-black/75 p-0.5 text-white hover:bg-red-600 cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Specifications Sections */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111214]">
                    Detailed Specifications (Leave blank if unknown → shows “Not specified”)
                  </h3>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {SPEC_FIELD_GROUPS.map((grp) => (
                    <div key={grp.title} className="rounded-xl border border-black/10 p-4 space-y-3">
                      <p className="text-xs font-bold text-[#9B7D48]">{grp.title}</p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {grp.fields.map((f) => (
                          <div key={f.key}>
                            <label className="block text-[11px] font-medium text-[#525459] mb-1">
                              {f.label}
                            </label>
                            <input
                              type="text"
                              value={form.specs[f.key] || ''}
                              onChange={(e) => updateSpecField(f.key, e.target.value)}
                              placeholder={f.placeholder}
                              className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-2.5 py-1.5 text-xs text-[#111214]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media paths, Features & Description */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">
                    Interior Panorama Photo Path
                  </label>
                  <input
                    type="text"
                    value={form.interior360}
                    onChange={(e) => setForm({ ...form, interior360: e.target.value })}
                    placeholder="/images/cars/...-int.jpg"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-xs font-mono text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">
                    Walkaround Video Path (.mp4 optional)
                  </label>
                  <input
                    type="text"
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    placeholder="Leave blank until uploaded"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-xs font-mono text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">
                    3D Model Path (.glb optional)
                  </label>
                  <input
                    type="text"
                    value={form.model3d}
                    onChange={(e) => setForm({ ...form, model3d: e.target.value })}
                    placeholder="/models/car.glb"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-xs font-mono text-[#111214]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#525459] mb-1">
                  Features Checklist (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  placeholder="Panoramic Sunroof, Leather Seats, 360° Camera, Apple CarPlay"
                  className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#525459] mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Condition, customs status, and showroom notes..."
                  className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-sm text-[#111214]"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-black/8 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-black/15 px-5 py-2 text-xs font-semibold text-[#525459] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#111214] px-6 py-2 text-xs font-semibold text-white hover:bg-[#2A2C30] cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
