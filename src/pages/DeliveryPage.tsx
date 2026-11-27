import React, { useState } from 'react';
import { CheckCircle2, FileCheck2, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { NIGERIAN_STATES, buildWhatsAppUrl, formatNaira } from '../data/constants';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const DELIVERY_STEPS = [
  {
    step: '01. Live Inspection & Paper Verification',
    detail:
      'Walk through the vehicle via HD WhatsApp video call from our 24 Unity Road bay or send an independent Lagos mechanic to inspect on your behalf.',
    icon: ShieldCheck,
  },
  {
    step: '02. Customs & Title Documentation',
    detail:
      'Receive scanned Nigerian Customs papers, VIN report, and official AUTOSAT LIMITED (RC 1643628) invoice before dispatch.',
    icon: FileCheck2,
  },
  {
    step: '03. Insured Carrier Dispatch',
    detail:
      'Choose enclosed flatbed haulage or vetted executive convoy transfer with real-time GPS tracking from Lagos.',
    icon: Truck,
  },
  {
    step: '04. Doorstep Handover',
    detail:
      'Inspect the car upon arrival in your state capital or residence across all 36 states and the FCT before signing final handover.',
    icon: MapPin,
  },
];

export const DeliveryPage: React.FC = () => {
  const { cars } = useInventory();
  const availableCars = cars.filter((c) => c.status === 'available');

  const [selectedCarId, setSelectedCarId] = useState(availableCars[0]?.id || '');
  const [selectedState, setSelectedState] = useState(NIGERIAN_STATES[1].state);
  const [transportType, setTransportType] = useState<'enclosed' | 'convoy'>('enclosed');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useDocumentMeta({
    title: 'Nationwide 36-State Vehicle Delivery – AUTOSAT LIMITED',
    description:
      'Insured car delivery from Ikeja, Lagos to Abuja, Port Harcourt, Kano, Enugu, Ibadan, and all 36 Nigerian states.',
  });

  const stateInfo =
    NIGERIAN_STATES.find((s) => s.state === selectedState) || NIGERIAN_STATES[0];
  const selectedCar = availableCars.find((c) => c.id === selectedCarId) || availableCars[0];
  const carrierFee =
    transportType === 'enclosed' ? stateInfo.estimatedFee : Math.round(stateInfo.estimatedFee * 0.65);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl border-b border-black/10 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
          LAGOS TO ALL 36 STATES &amp; FCT
        </p>
        <h1 className="mt-2 font-editorial text-4xl font-bold text-[#111214] sm:text-5xl">
          Nationwide Insured Vehicle Delivery
        </h1>
        <p className="mt-3 text-sm text-[#525459] leading-relaxed sm:text-base">
          More than half of our clients purchase from outside Lagos. Our logistics team handles customs verification, comprehensive transit insurance, and door-to-door delivery nationwide.
        </p>
      </div>

      {/* 4-Step Timeline */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {DELIVERY_STEPS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="rounded-2xl border border-black/8 bg-white p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F4F0] text-[#9B7D48]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-sans text-sm font-bold text-[#111214]">
                {item.step}
              </h2>
              <p className="mt-2 text-xs text-[#6B6D72] leading-relaxed">{item.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Quote Calculator & Request Form */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
          <h2 className="font-editorial text-2xl font-bold text-[#111214] sm:text-3xl">
            Request Delivery Quote
          </h2>
          <p className="mt-1 text-xs text-[#6B6D72]">
            Pick any vehicle from our showroom and choose your Nigerian destination state.
          </p>

          {submitted && selectedCar ? (
            <div className="mt-6 space-y-4 rounded-xl border border-black/8 bg-[#F9F8F6] p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Delivery Estimate Prepared for {selectedState}
              </div>
              <p className="text-xs text-[#525459] leading-relaxed">
                Vehicle: <strong>{selectedCar.year} {selectedCar.brand} {selectedCar.model}</strong><br />
                Destination: <strong>{selectedState}</strong> ({stateInfo.transitDays})<br />
                Estimated Logistics Fee: <strong className="font-mono text-[#111214]">{formatNaira(carrierFee)}</strong>
              </p>
              <a
                href={buildWhatsAppUrl(
                  `Hello AUTOSAT Logistics, I want to arrange ${transportType === 'enclosed' ? 'Enclosed Carrier' : 'Executive Driver'} delivery for the ${selectedCar.year} ${selectedCar.brand} ${selectedCar.model} to ${selectedState}. Name: ${name}, Phone: ${phone}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#1F7A4D] py-3 text-xs font-semibold text-white hover:bg-[#258E5A]"
              >
                Confirm Dispatch on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#525459] mb-1">Select Vehicle</label>
                <select
                  value={selectedCar?.id || ''}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                >
                  {availableCars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.year} {c.brand} {c.model} — {formatNaira(c.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Destination State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st.state} value={st.state}>
                        {st.state} ({st.zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Delivery Method</label>
                  <select
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value as 'enclosed' | 'convoy')}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  >
                    <option value="enclosed">Insured Flatbed Carrier (0 km added)</option>
                    <option value="convoy">Vetted Executive Driver Transfer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Phone / WhatsApp</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 80..."
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#111214] py-3 text-xs font-semibold text-white hover:bg-[#2A2C30] cursor-pointer"
              >
                Calculate &amp; Request Dispatch Quote
              </button>
            </form>
          )}
        </div>

        {/* Live Estimate Summary Card */}
        <div className="lg:col-span-5 rounded-2xl border border-black/8 bg-white p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9B7D48]">
              LIVE ESTIMATE BREAKDOWN
            </p>
            <h3 className="mt-2 font-editorial text-2xl font-bold text-[#111214]">
              Ikeja, Lagos → {selectedState}
            </h3>

            <dl className="mt-6 space-y-4 border-t border-black/8 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#6B6D72]">Geopolitical Zone</dt>
                <dd className="font-medium text-[#111214]">{stateInfo.zone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6B6D72]">Estimated Transit Window</dt>
                <dd className="font-mono font-medium text-[#111214]">{stateInfo.transitDays}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6B6D72]">Carrier Insurance</dt>
                <dd className="font-medium text-[#111214]">Included (Comprehensive)</dd>
              </div>
              <div className="flex justify-between border-t border-black/8 pt-4">
                <dt className="font-bold text-[#111214]">Estimated Delivery Fee</dt>
                <dd className="font-mono text-lg font-bold tabular-nums text-[#9B7D48]">
                  {formatNaira(carrierFee)}
                </dd>
              </div>
            </dl>
          </div>
          <p className="mt-6 text-xs text-[#6B6D72] leading-relaxed">
            Final dispatch pricing depends on exact LGA address and vehicle kerb weight. Zero hidden terminal fees.
          </p>
        </div>
      </div>
    </div>
  );
};
