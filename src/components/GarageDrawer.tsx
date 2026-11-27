import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trash2, X } from 'lucide-react';
import { useGarage } from '../context/GarageContext';
import { useInventory } from '../context/InventoryContext';
import { formatNaira } from '../data/constants';
import { SafeImage } from './BrandMark';

const DEPOSIT_AMOUNT = 1000000;

export const GarageDrawer: React.FC = () => {
  const { drawerOpen, setDrawerOpen, getGarageCars, removeFromGarage } = useGarage();
  const { cars } = useInventory();

  if (!drawerOpen) return null;

  const garageCars = getGarageCars(cars);
  const totalCarsPrice = garageCars.reduce((acc, c) => acc + c.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" role="dialog" aria-modal="true" aria-label="Your garage">
      <div className="flex h-full w-full max-w-md flex-col bg-[#F5F4F0] text-[#111214] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-5">
          <div className="flex items-baseline gap-2.5">
            <h2 className="font-editorial text-xl font-bold text-[#111214]">Your garage</h2>
            <span className="text-xs text-[#6B6D72]">
              {garageCars.length} {garageCars.length === 1 ? 'car' : 'cars'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close garage drawer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[#111214] hover:bg-[#F5F4F0] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {garageCars.length === 0 ? (
            <div className="rounded-xl border border-black/8 bg-white p-8 text-center">
              <p className="text-sm font-semibold text-[#111214]">Your garage is empty</p>
              <p className="mt-1.5 text-xs text-[#6B6D72]">
                Tap “Reserve this car” on any vehicle in our Ikeja showroom to hold it for 72 hours.
              </p>
              <Link
                to="/inventory"
                onClick={() => setDrawerOpen(false)}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#111214] px-5 py-2.5 text-xs font-semibold text-white"
              >
                Browse Showroom
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              {garageCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center gap-3.5 rounded-xl border border-black/8 bg-white p-3.5"
                >
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#E9E7E0]">
                    <SafeImage
                      src={car.colors[0]?.images[0] || car.images[0] || ''}
                      alt={`${car.brand} ${car.model}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6D72]">
                      {car.brand}
                    </p>
                    <p className="truncate text-sm font-bold text-[#111214]">{car.model}</p>
                    <p className="text-[11px] text-[#6B6D72]">
                      {car.year} · {car.mileage.toLocaleString()} km · {car.condition}
                    </p>
                    <p className="mt-1 font-mono text-xs font-bold tabular-nums text-[#111214]">
                      {formatNaira(car.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromGarage(car.id)}
                    aria-label={`Remove ${car.model}`}
                    className="p-1.5 text-[#6B6D72] hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="rounded-xl border border-dashed border-black/15 bg-white/70 p-4 text-xs text-[#525459] leading-relaxed">
                Reserve a car with a refundable deposit of {formatNaira(DEPOSIT_AMOUNT)}. It holds the vehicle exclusively for 72 hours and comes off your final price.
              </div>
            </>
          )}
        </div>

        {/* Footer Totals */}
        {garageCars.length > 0 && (
          <div className="border-t border-black/10 bg-white p-6 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#525459]">
                <span>Cars total</span>
                <span className="font-mono font-semibold tabular-nums text-[#111214]">
                  {formatNaira(totalCarsPrice)}
                </span>
              </div>
              <div className="flex justify-between text-[#525459]">
                <span>Reservation deposit</span>
                <span className="font-mono font-semibold tabular-nums text-[#111214]">
                  {formatNaira(DEPOSIT_AMOUNT)}
                </span>
              </div>
              <div className="flex justify-between border-t border-black/10 pt-2.5 text-sm font-bold text-[#111214]">
                <span>Pay today</span>
                <span className="font-mono tabular-nums">{formatNaira(DEPOSIT_AMOUNT)}</span>
              </div>
            </div>

            <Link
              to="/reserve"
              onClick={() => setDrawerOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111214] py-3 text-xs font-semibold text-white hover:bg-[#2A2C30] transition-colors"
            >
              Continue to checkout
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
