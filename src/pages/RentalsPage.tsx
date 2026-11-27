import React, { useState } from 'react';
import { Calendar, CheckCircle2, Shield, UserCheck } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { buildWhatsAppUrl, formatNaira } from '../data/constants';
import { SafeImage } from '../components/BrandMark';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const RentalsPage: React.FC = () => {
  const { cars } = useInventory();
  const rentalFleet = cars.filter((c) => c.status === 'available' && c.rentalDailyRate);

  const [withDriver, setWithDriver] = useState(true);
  const [selectedCarId, setSelectedCarId] = useState(rentalFleet[0]?.id || '');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [durationDays, setDurationDays] = useState('3');
  const [submitted, setSubmitted] = useState(false);

  useDocumentMeta({
    title: 'Executive Car Rentals in Lagos – AUTOSAT LIMITED',
    description:
      'Rent luxury SUVs and executive sedans in Ikeja, Lagos and Abuja with or without a uniformed chauffeur. Daily and weekly Naira rates.',
  });

  const driverSurcharge = withDriver ? 25000 : 0;
  const selectedCar = rentalFleet.find((c) => c.id === selectedCarId) || rentalFleet[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
            CHAUFFEUR &amp; SELF-DRIVE FLEET
          </p>
          <h1 className="mt-2 font-editorial text-4xl font-bold text-[#111214] sm:text-5xl">
            Executive Car Rentals
          </h1>
          <p className="mt-3 text-sm text-[#525459] leading-relaxed">
            Whether for VIP airport pickups at Murtala Muhammed International, corporate summits in Victoria Island, or weekend ceremonies, every AUTOSAT rental unit is maintained to showroom standards.
          </p>
        </div>

        {/* Driver Mode Segmented Toggle */}
        <div className="inline-flex self-start rounded-full border border-black/10 bg-white p-1">
          <button
            type="button"
            onClick={() => setWithDriver(true)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              withDriver ? 'bg-[#111214] text-white' : 'text-[#525459] hover:text-[#111214]'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
            With Driver
          </button>
          <button
            type="button"
            onClick={() => setWithDriver(false)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              !withDriver ? 'bg-[#111214] text-white' : 'text-[#525459] hover:text-[#111214]'
            }`}
          >
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            Without Driver
          </button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Fleet Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {rentalFleet.map((car) => {
            const daily = (car.rentalDailyRate || 150000) + driverSurcharge;
            const weekly = (car.rentalWeeklyRate || daily * 6) + driverSurcharge * 6;
            const isSelected = selectedCar?.id === car.id;

            return (
              <div
                key={car.id}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition-all ${
                  isSelected
                    ? 'border-[#111214] shadow-[0_10px_24px_rgba(17,18,20,0.08)]'
                    : 'border-black/8'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#E9E7E0]">
                  <SafeImage
                    src={car.colors[0]?.images[0] || car.images[0] || ''}
                    alt={`${car.year} ${car.brand} ${car.model}`}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B6D72]">
                      {car.brand}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-[#111214]">
                      {car.year} {car.model}
                    </h2>
                    <p className="mt-1 text-xs text-[#6B6D72]">
                      {withDriver ? 'Chauffeur-driven (12 hrs/day)' : 'Self-drive (Verified ID & deposit)'}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-black/8 pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B6D72]">Daily Rate</span>
                      <span className="font-mono font-bold tabular-nums text-[#111214]">
                        {formatNaira(daily)} / day
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B6D72]">Weekly Rate</span>
                      <span className="font-mono font-semibold tabular-nums text-[#525459]">
                        {formatNaira(weekly)} / week
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCarId(car.id);
                      setSubmitted(false);
                    }}
                    className={`mt-4 w-full rounded-full py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#111214] text-white'
                        : 'border border-black/15 bg-[#F9F8F6] text-[#111214] hover:border-[#111214]'
                    }`}
                  >
                    {isSelected ? 'Selected for Booking' : 'Select This Vehicle'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rental Enquiry Form */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 rounded-2xl border border-black/8 bg-white p-6">
            <h2 className="font-editorial text-2xl font-bold text-[#111214]">
              Rental Enquiry Form
            </h2>
            <p className="mt-1 text-xs text-[#6B6D72]">
              Instant confirmation from our Ikeja dispatch desk.
            </p>

            {submitted && selectedCar ? (
              <div className="mt-5 space-y-4 rounded-xl border border-black/8 bg-[#F9F8F6] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Request Prepared
                </div>
                <p className="text-xs text-[#525459] leading-relaxed">
                  {clientName}, your enquiry for the {selectedCar.year} {selectedCar.brand}{' '}
                  {selectedCar.model} ({withDriver ? 'With Driver' : 'Without Driver'}) for{' '}
                  {durationDays} days starting {pickupDate} is ready.
                </p>
                <a
                  href={buildWhatsAppUrl(
                    `Hello AUTOSAT Rentals, I want to book the ${selectedCar.year} ${selectedCar.brand} ${selectedCar.model} (${withDriver ? 'With Driver' : 'Without Driver'}) for ${durationDays} day(s) starting ${pickupDate}. Name: ${clientName}, Phone: ${clientPhone}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#1F7A4D] py-3 text-xs font-semibold text-white hover:bg-[#258E5A]"
                >
                  Send Booking via WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Selected Vehicle</label>
                  <select
                    value={selectedCar?.id || ''}
                    onChange={(e) => setSelectedCarId(e.target.value)}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-xs text-[#111214]"
                  >
                    {rentalFleet.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.year} {c.brand} {c.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Service Option</label>
                  <div className="rounded-lg border border-black/10 bg-[#F9F8F6] px-3 py-2 text-xs font-semibold text-[#9B7D48]">
                    {withDriver ? 'With Professional Driver (+₦25,000/day)' : 'Without Driver (Self-Drive)'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Pickup Date</label>
                    <input
                      required
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-xs text-[#111214]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1">Days</label>
                    <input
                      required
                      type="number"
                      min="1"
                      max="90"
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2 text-xs font-mono text-[#111214]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Your Full Name</label>
                  <input
                    required
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Folake Adebayo"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Phone / WhatsApp</label>
                  <input
                    required
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+234 80..."
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111214] py-3 text-xs font-semibold text-white hover:bg-[#2A2C30] cursor-pointer"
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Request Rental Quote
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
