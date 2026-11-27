import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ShieldCheck,
  Trash2,
  Upload,
  Wallet,
  ClipboardCheck,
} from 'lucide-react';
import { useSellRequests } from '../context/SellRequestsContext';
import {
  BUSINESS_INFO,
  NIGERIAN_STATES,
  SHOWROOM_BRANDS,
  buildWhatsAppUrl,
  formatNaira,
} from '../data/constants';
import { FuelType, SellRequest, SellRequestPhoto, TransmissionType } from '../types/car';
import { compressImageFile } from '../utils/imageCompression';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const PHOTO_ANGLES = [
  'Front',
  'Back',
  'Left Side',
  'Right Side',
  'Interior',
  'Dashboard',
  'Engine Bay',
];

const FAQS = [
  {
    q: 'How fast can I get paid after inspection?',
    a: 'Once our diagnostic team inspects the car and verifies customs and ownership documents at 24 Unity Road, Ikeja (or via our mobile inspector in Lagos), we transfer full payment immediately via bank transfer before handover.',
  },
  {
    q: 'What documents do I need to sell my car to AUTOSAT?',
    a: 'You will need the original vehicle license/allocation proof, Nigerian Customs duty papers (for imported foreign-used vehicles), proof of ownership, and a valid government-issued ID.',
  },
  {
    q: 'Do you buy cars from outside Lagos?',
    a: 'Yes. We evaluate vehicles across all 36 states and the FCT Abuja. If we agree on a provisional valuation, we arrange inspection with our regional partners or carrier collection from your state.',
  },
  {
    q: 'Why do I need to upload at least 4 clear photos?',
    a: 'Showing the exterior angles, cabin interior, dashboard mileage, and engine bay lets our valuation team give you a realistic, firm offer range within hours rather than guessing.',
  },
];

export const SellYourCarPage: React.FC = () => {
  const { addSellRequest } = useSellRequests();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [brand, setBrand] = useState(SHOWROOM_BRANDS[0].name);
  const [customBrand, setCustomBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2021);
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState<'Foreign Used' | 'Nigerian Used'>('Nigerian Used');
  const [transmission, setTransmission] = useState<TransmissionType>('Automatic');
  const [fuel, setFuel] = useState<FuelType>('Petrol');
  const [colour, setColour] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [location, setLocation] = useState(NIGERIAN_STATES[0].state);
  const [description, setDescription] = useState('');
  const [selectedAngle, setSelectedAngle] = useState('Front');
  const [photos, setPhotos] = useState<SellRequestPhoto[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<SellRequest | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useDocumentMeta({
    title: 'Sell Your Car to AUTOSAT LIMITED – Fast Valuation & Offer in Nigeria',
    description:
      'Sell your car to Autosat quickly and get a fair offer. Upload photos, get inspected in Ikeja or nationwide, and receive instant bank payment.',
  });

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>, forcedAngle?: string) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setPhotoError('');
    try {
      const added: SellRequestPhoto[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file.type.startsWith('image/')) continue;
        const dataUrl = await compressImageFile(file, 960, 0.75);
        const angleLabel = forcedAngle || PHOTO_ANGLES[(photos.length + i) % PHOTO_ANGLES.length] || selectedAngle;
        added.push({
          id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          angle: angleLabel,
          dataUrl,
        });
      }
      setPhotos((prev) => [...prev, ...added]);
    } catch {
      setPhotoError('One or more photos could not be processed. Please try standard JPEG or PNG files.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length < 4) {
      setPhotoError(
        `Please upload at least 4 real photos of your vehicle (${photos.length}/4 uploaded so far).`
      );
      return;
    }

    const resolvedBrand = brand === 'Other' ? customBrand.trim() || 'Other' : brand;
    const saved = addSellRequest({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      brand: resolvedBrand,
      model: model.trim(),
      year: Number(year),
      mileage: Number(mileage) || 0,
      condition,
      transmission,
      fuel,
      colour: colour.trim(),
      askingPrice: Number(askingPrice) || 0,
      location,
      description: description.trim(),
      photos,
    });
    setSubmittedRequest(saved);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSubmittedRequest(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setModel('');
    setMileage('');
    setColour('');
    setAskingPrice('');
    setDescription('');
    setPhotos([]);
    setPhotoError('');
  };

  const whatsappSummaryUrl = submittedRequest
    ? buildWhatsAppUrl(
        `Hello AUTOSAT LIMITED, I just submitted a Sell Your Car request (${submittedRequest.id}).\nVehicle: ${submittedRequest.year} ${submittedRequest.brand} ${submittedRequest.model}\nCondition: ${submittedRequest.condition}\nTransmission / Fuel: ${submittedRequest.transmission}, ${submittedRequest.fuel}\nColour: ${submittedRequest.colour}\nMileage: ${submittedRequest.mileage.toLocaleString()} km\nAsking Price: ${formatNaira(submittedRequest.askingPrice)}\nLocation: ${submittedRequest.location}\nSeller: ${submittedRequest.fullName} (${submittedRequest.phone})\nPhotos uploaded: ${submittedRequest.photos.length}`
      )
    : buildWhatsAppUrl('Hello AUTOSAT LIMITED, I would like to sell my car.');

  return (
    <div className="bg-[#F5F4F0] pb-20">
      {/* Hero */}
      <section className="border-b border-black/10 bg-[#111214] py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B5945B]">
              SELL OR TRADE IN WITH AUTOSAT · {BUSINESS_INFO.rcNumber}
            </p>
            <h1 className="mt-3 font-editorial text-4xl font-bold leading-[1.06] text-white sm:text-5xl">
              Sell your car to Autosat quickly and get a fair offer.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#D1D5DB] sm:text-base">
              Skip unreliable tyre-kickers and endless meetups. Share your vehicle details and real photos below — our valuation desk responds promptly with an inspection slot and instant bank payout on agreement.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {submittedRequest ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-black/8 bg-white p-8 sm:p-10 text-center space-y-5 shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
              Sell Request Submitted · {submittedRequest.id}
            </p>
            <h2 className="font-editorial text-3xl font-bold text-[#111214]">
              We&apos;ve received your {submittedRequest.year} {submittedRequest.brand}{' '}
              {submittedRequest.model}
            </h2>
            <p className="text-sm text-[#525459] leading-relaxed">
              Thank you, <strong>{submittedRequest.fullName}</strong>. Your vehicle summary ({submittedRequest.photos.length} photos attached, asking{' '}
              <strong className="font-mono text-[#111214]">
                {formatNaira(submittedRequest.askingPrice)}
              </strong>
              ) has been logged with our buying desk. Continue on WhatsApp now to fast-track your inspection.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href={whatsappSummaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#1F7A4D] px-6 py-3 text-xs font-semibold text-white hover:bg-[#258E5A]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Continue on WhatsApp
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-black/15 px-6 py-3 text-xs font-semibold text-[#111214] hover:bg-[#F5F4F0] cursor-pointer"
              >
                Submit Another Vehicle
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-8 rounded-2xl border border-black/8 bg-white p-6 sm:p-8 space-y-8"
            >
              <div>
                <h2 className="font-editorial text-2xl font-bold text-[#111214]">
                  Vehicle &amp; Seller Details
                </h2>
                <p className="mt-1 text-xs text-[#6B6D72]">
                  All valuations are reviewed by our Ikeja inspection team. Zero listing fees.
                </p>
              </div>

              {/* Contact info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9B7D48]">
                  1. Your Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Chinedu Eze"
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214] focus:border-[#111214] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214] focus:border-[#111214] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214] focus:border-[#111214] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Specs */}
              <div className="space-y-4 border-t border-black/8 pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9B7D48]">
                  2. Vehicle Specifications
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Car Brand *</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                    >
                      {SHOWROOM_BRANDS.map((b) => (
                        <option key={b.slug} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                      <option value="Other">Other Brand</option>
                    </select>
                  </div>

                  {brand === 'Other' && (
                    <div>
                      <label className="block text-xs font-medium text-[#525459] mb-1">Specify Brand *</label>
                      <input
                        required
                        type="text"
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        placeholder="e.g. Volvo"
                        className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Model *</label>
                    <input
                      required
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. C 300 4MATIC"
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Year *</label>
                    <input
                      required
                      type="number"
                      min={1995}
                      max={new Date().getFullYear() + 1}
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm font-mono text-[#111214]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Mileage (km) *</label>
                    <input
                      required
                      type="number"
                      min={0}
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="e.g. 64000"
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm font-mono text-[#111214]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Condition *</label>
                    <select
                      value={condition}
                      onChange={(e) =>
                        setCondition(e.target.value as 'Foreign Used' | 'Nigerian Used')
                      }
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                    >
                      <option value="Foreign Used">Foreign Used</option>
                      <option value="Nigerian Used">Nigerian Used</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Transmission *</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Fuel Type *</label>
                    <select
                      value={fuel}
                      onChange={(e) => setFuel(e.target.value as FuelType)}
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Exterior Colour *</label>
                    <input
                      required
                      type="text"
                      value={colour}
                      onChange={(e) => setColour(e.target.value)}
                      placeholder="e.g. Obsidian Black"
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Asking Price (₦) *</label>
                    <input
                      required
                      type="number"
                      min={100000}
                      step={50000}
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(e.target.value)}
                      placeholder="e.g. 28500000"
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm font-mono text-[#111214]"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-medium text-[#525459] mb-1">
                      Vehicle Location (State in Nigeria) *
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                    >
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st.state} value={st.state}>
                          {st.state} ({st.zone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-medium text-[#525459] mb-1">
                      Vehicle Description &amp; History *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mention engine/gearbox condition, AC cooling, original paint status, customs papers, and any faults to note..."
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                    />
                  </div>
                </div>
              </div>

              {/* Multi-Photo Upload */}
              <div className="space-y-4 border-t border-black/8 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9B7D48]">
                      3. Real Vehicle Photos (Minimum 4 required)
                    </h3>
                    <p className="mt-1 text-xs text-[#6B6D72]">
                      Upload clear real photos covering front, back, sides, interior, dashboard, and engine bay.
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold ${
                      photos.length >= 4
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#F5F4F0] text-[#525459]'
                    }`}
                  >
                    {photos.length} / 4+ uploaded
                  </span>
                </div>

                {/* Quick angle pills + Multi-upload drop area */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-medium text-[#6B6D72]">Tag next upload as:</span>
                  {PHOTO_ANGLES.map((angle) => (
                    <button
                      key={angle}
                      type="button"
                      onClick={() => setSelectedAngle(angle)}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                        selectedAngle === angle
                          ? 'bg-[#111214] text-white'
                          : 'border border-black/12 bg-[#F9F8F6] text-[#525459] hover:border-[#111214]'
                      }`}
                    >
                      {angle}
                    </button>
                  ))}
                </div>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-black/15 bg-[#F9F8F6] p-6 text-center transition-colors hover:border-[#9B7D48]">
                  <Upload className="h-6 w-6 text-[#9B7D48]" aria-hidden="true" />
                  <p className="mt-2 text-xs font-semibold text-[#111214]">
                    {uploading ? 'Processing photos...' : 'Tap or click to select multiple real photos'}
                  </p>
                  <p className="mt-1 text-[11px] text-[#6B6D72]">
                    JPG, PNG or WEBP · Front, back, sides, interior, dashboard, engine bay
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFilesSelected(e)}
                    className="sr-only"
                  />
                </label>

                {photoError && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                    {photoError}
                  </p>
                )}

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative overflow-hidden rounded-xl border border-black/10 bg-[#E9E7E0]"
                      >
                        <img
                          src={photo.dataUrl}
                          alt={`${photo.angle} view`}
                          className="aspect-[4/3] w-full object-cover"
                        />
                        <div className="flex items-center justify-between bg-white px-2.5 py-1.5">
                          <span className="text-[11px] font-semibold text-[#111214] truncate">
                            {photo.angle}
                          </span>
                          <button
                            type="button"
                            onClick={() => removePhoto(photo.id)}
                            aria-label={`Remove ${photo.angle} photo`}
                            className="text-[#6B6D72] hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-full bg-[#111214] py-3.5 text-xs font-semibold text-white hover:bg-[#2A2C30] transition-colors cursor-pointer disabled:opacity-50"
              >
                Submit Vehicle for Offer
              </button>
            </form>

            {/* Right Column: How it works + FAQ */}
            <aside className="lg:col-span-4 space-y-6">
              {/* How it works */}
              <div className="rounded-2xl border border-black/8 bg-white p-6 space-y-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9B7D48]">
                  HOW IT WORKS
                </p>
                <h2 className="font-editorial text-2xl font-bold text-[#111214]">
                  3 Simple Steps to Sell
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      icon: Camera,
                      step: '1. Submit details',
                      desc: 'Enter your vehicle specs, asking price, state location, and upload at least 4 real photos.',
                    },
                    {
                      icon: ClipboardCheck,
                      step: '2. We inspect & make an offer',
                      desc: 'Our Ikeja diagnostic & paperwork specialists inspect the car and present a transparent Naira offer.',
                    },
                    {
                      icon: Wallet,
                      step: '3. Get paid',
                      desc: 'Once agreed, receive instant bank transfer directly to your Nigerian bank account on handover.',
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F4F0] text-[#9B7D48]">
                          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111214]">{item.step}</p>
                          <p className="mt-0.5 text-xs text-[#6B6D72] leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-black/8 pt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#111214]">
                    <ShieldCheck className="h-4 w-4 text-[#9B7D48]" aria-hidden="true" />
                    Registered Dealer · {BUSINESS_INFO.rcNumber}
                  </div>
                  <p className="mt-1 text-[11px] text-[#6B6D72]">
                    Showroom: {BUSINESS_INFO.addressPrimary}
                  </p>
                </div>
              </div>

              {/* FAQ */}
              <div className="rounded-2xl border border-black/8 bg-white p-6 space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9B7D48]">
                  FREQUENTLY ASKED QUESTIONS
                </p>
                <div className="divide-y divide-black/8">
                  {FAQS.map((item, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={item.q} className="py-3 first:pt-0 last:pb-0">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-2 text-left text-xs font-bold text-[#111214] cursor-pointer"
                        >
                          <span>{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 shrink-0 text-[#6B6D72]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 shrink-0 text-[#6B6D72]" />
                          )}
                        </button>
                        {isOpen && (
                          <p className="mt-2 text-xs text-[#525459] leading-relaxed">{item.a}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
