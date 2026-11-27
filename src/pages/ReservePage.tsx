import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, ShieldCheck, Trash2 } from 'lucide-react';
import { useGarage } from '../context/GarageContext';
import { useInventory } from '../context/InventoryContext';
import { BUSINESS_INFO, NIGERIAN_STATES, buildWhatsAppUrl, formatNaira } from '../data/constants';
import { SafeImage } from '../components/BrandMark';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const DEPOSIT_AMOUNT = 1000000;

export const ReservePage: React.FC = () => {
  const { getGarageCars, removeFromGarage, clearGarage } = useGarage();
  const { cars } = useInventory();
  const garageCars = getGarageCars(cars);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [handoverMode, setHandoverMode] = useState<'deliver' | 'collect'>('deliver');
  const [cityState, setCityState] = useState(NIGERIAN_STATES[0].state);
  const [address, setAddress] = useState('');
  const [reservedRef, setReservedRef] = useState<string | null>(null);

  useDocumentMeta({
    title: 'Reserve Your Car – AUTOSAT LIMITED Ikeja, Lagos',
    description:
      'Hold your selected vehicle for 72 hours with AUTOSAT LIMITED. Choose insured delivery across Nigeria or showroom collection at 24 Unity Road, Ikeja.',
  });

  const totalCarsPrice = garageCars.reduce((sum, c) => sum + c.price, 0);
  const stateInfo = NIGERIAN_STATES.find((s) => s.state === cityState) || NIGERIAN_STATES[0];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `AS-${Date.now().toString().slice(-6)}`;
    setReservedRef(ref);
  };

  if (reservedRef) {
    const carListText = garageCars.map((c) => `${c.year} ${c.brand} ${c.model}`).join(', ');
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-black/8 bg-white p-8 sm:p-10 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
            Reservation Reference · {reservedRef}
          </p>
          <h1 className="font-editorial text-3xl font-bold text-[#111214]">
            Your 72-hour vehicle hold is logged
          </h1>
          <p className="text-sm text-[#525459] leading-relaxed">
            Thank you, <strong>{firstName} {lastName}</strong>. Our Ikeja showroom concierge has received your reservation for{' '}
            <strong>{carListText || 'your selected vehicle'}</strong> ({handoverMode === 'deliver' ? `Delivery to ${cityState}` : `Pickup at ${BUSINESS_INFO.addressPrimary}`}).
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href={buildWhatsAppUrl(
                `Hello AUTOSAT LIMITED, my reservation reference is ${reservedRef}. Name: ${firstName} ${lastName}, Phone: ${phone}. Vehicle(s): ${carListText}. Handover: ${handoverMode === 'deliver' ? `Deliver to ${address}, ${cityState}` : 'Showroom pickup at 24 Unity Road, Ikeja'}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1F7A4D] px-6 py-3 text-xs font-semibold text-white hover:bg-[#258E5A]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Complete Deposit on WhatsApp
            </a>
            <Link
              to="/inventory"
              onClick={clearGarage}
              className="inline-flex items-center rounded-full border border-black/15 px-6 py-3 text-xs font-semibold text-[#111214] hover:bg-[#F5F4F0]"
            >
              Back to Showroom
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-4 text-xs text-[#6B6D72]" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#111214]">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/inventory" className="hover:text-[#111214]">Showroom</Link>
        <span className="mx-2">/</span>
        <span className="text-[#111214] font-medium">Checkout</span>
      </nav>

      <h1 className="font-editorial text-4xl font-bold text-[#111214]">Reserve your car</h1>

      {garageCars.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-black/8 bg-white p-12 text-center">
          <p className="text-base font-semibold text-[#111214]">No vehicles in your garage yet.</p>
          <p className="mt-2 text-sm text-[#6B6D72]">
            Select any vehicle from our showroom and tap “Reserve this car” to begin checkout.
          </p>
          <Link
            to="/inventory"
            className="mt-6 inline-flex rounded-full bg-[#111214] px-6 py-3 text-xs font-semibold text-white"
          >
            Browse Showroom
          </Link>
        </div>
      ) : (
        <form onSubmit={handleConfirm} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Details */}
            <div className="rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111214] text-xs font-bold text-white">
                  1
                </span>
                <h2 className="text-base font-bold text-[#111214]">Your details</h2>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1.5">First name</label>
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Amara"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214] focus:border-[#111214] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1.5">Last name</label>
                  <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Okafor"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214] focus:border-[#111214] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1.5">Phone / WhatsApp</label>
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
                  <label className="block text-xs font-medium text-[#525459] mb-1.5">Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amara@email.com"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214] focus:border-[#111214] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Handover */}
            <div className="rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111214] text-xs font-bold text-white">
                  2
                </span>
                <h2 className="text-base font-bold text-[#111214]">Handover</h2>
              </div>

              <div className="mt-5 space-y-3">
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                    handoverMode === 'deliver' ? 'border-[#111214] bg-[#F9F8F6]' : 'border-black/10'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111214]">Deliver to my city</p>
                    <p className="text-xs text-[#6B6D72]">
                      Insured delivery across all 36 states &amp; FCT, {stateInfo.transitDays}
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="handover"
                    checked={handoverMode === 'deliver'}
                    onChange={() => setHandoverMode('deliver')}
                    className="h-4 w-4 accent-[#111214]"
                  />
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                    handoverMode === 'collect' ? 'border-[#111214] bg-[#F9F8F6]' : 'border-black/10'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111214]">Collect from the showroom</p>
                    <p className="text-xs text-[#6B6D72]">
                      Free · handover with full inspection at 24 Unity Road, Ikeja
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="handover"
                    checked={handoverMode === 'collect'}
                    onChange={() => setHandoverMode('collect')}
                    className="h-4 w-4 accent-[#111214]"
                  />
                </label>
              </div>

              {handoverMode === 'deliver' && (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1.5">State / City</label>
                    <select
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                    >
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st.state} value={st.state}>
                          {st.state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#525459] mb-1.5">Delivery address</label>
                    <input
                      required={handoverMode === 'deliver'}
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="12 Admiralty Way, Lekki"
                      className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3.5 py-2.5 text-sm text-[#111214]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Garage Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-black/8 bg-white p-6 space-y-5">
              <h2 className="text-base font-bold text-[#111214]">Your garage</h2>

              <div className="space-y-3">
                {garageCars.map((car) => (
                  <div
                    key={car.id}
                    className="flex items-center gap-3 rounded-xl border border-black/8 p-3"
                  >
                    <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#E9E7E0]">
                      <SafeImage src={car.colors[0]?.images[0] || car.images[0] || ''} alt={car.model} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6D72]">
                        {car.brand}
                      </p>
                      <p className="truncate text-sm font-bold text-[#111214]">{car.model}</p>
                      <p className="text-[11px] text-[#6B6D72]">
                        {car.year} · {car.condition}
                      </p>
                      <p className="font-mono text-xs font-bold tabular-nums text-[#111214]">
                        {formatNaira(car.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromGarage(car.id)}
                      className="p-1 text-[#6B6D72] hover:text-red-600 cursor-pointer"
                      aria-label={`Remove ${car.model}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-black/8 pt-4 text-xs">
                <div className="flex justify-between text-[#525459]">
                  <span>Cars price</span>
                  <span className="font-mono font-semibold tabular-nums text-[#111214]">
                    {formatNaira(totalCarsPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-[#525459]">
                  <span>Delivery</span>
                  <span className="text-[#111214]">
                    {handoverMode === 'collect' ? 'Free (Ikeja Pickup)' : formatNaira(stateInfo.estimatedFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[#525459]">
                  <span>Reservation deposit</span>
                  <span className="font-mono font-semibold tabular-nums text-[#111214]">
                    {formatNaira(DEPOSIT_AMOUNT)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-black/8 pt-3 text-sm font-bold text-[#111214]">
                  <span>Pay today</span>
                  <span className="font-mono tabular-nums">{formatNaira(DEPOSIT_AMOUNT)}</span>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-black/15 bg-[#F9F8F6] p-3.5 text-[11px] text-[#525459] leading-relaxed">
                <ShieldCheck className="inline h-3.5 w-3.5 mr-1 text-[#9B7D48]" aria-hidden="true" />
                The deposit holds the car exclusively for 72 hours and comes off the final price.
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#111214] py-3.5 text-xs font-semibold text-white hover:bg-[#2A2C30] transition-colors cursor-pointer"
              >
                Confirm Reservation ({formatNaira(DEPOSIT_AMOUNT)})
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
