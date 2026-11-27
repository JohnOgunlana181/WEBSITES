import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitCompareArrows, Heart } from 'lucide-react';
import { Car } from '../types/car';
import { formatNaira } from '../data/constants';
import { SafeImage } from './BrandMark';
import { useGarage } from '../context/GarageContext';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { isSaved, toggleSaved, isInCompare, toggleCompare } = useGarage();
  const saved = isSaved(car.id);
  const compared = isInCompare(car.id);
  const primaryImage = car.colors[0]?.images[0] || car.images[0] || '';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-black/8 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(17,18,20,0.08)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E9E7E0]">
        <Link to={`/cars/${car.id}`} className="block h-full w-full">
          <SafeImage
            src={primaryImage}
            alt={`${car.year} ${car.brand} ${car.model}`}
            fallbackTitle={`${car.brand} ${car.model}`}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        {/* Condition / Sold badge */}
        <div
          className={`pointer-events-none absolute top-3 left-3 rounded px-2.5 py-1 text-[11px] font-semibold ${
            car.status === 'sold'
              ? 'bg-[#111214] text-[#E5C98E]'
              : car.condition === 'Brand New'
              ? 'bg-[#B5945B] text-white'
              : 'bg-[#111214]/85 text-white'
          }`}
        >
          {car.status === 'sold' ? 'Sold' : car.condition}
        </div>

        {/* Save & Compare quick actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => toggleCompare(car.id)}
            aria-label={compared ? `Remove ${car.model} from compare` : `Compare ${car.model}`}
            title={compared ? 'In comparison' : 'Compare vehicle (up to 3)'}
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors cursor-pointer ${
              compared
                ? 'bg-[#111214] text-[#E5C98E]'
                : 'bg-white/95 text-[#111214] hover:bg-white'
            }`}
          >
            <GitCompareArrows className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => toggleSaved(car.id)}
            aria-label={saved ? `Remove ${car.model} from saved` : `Save ${car.model}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#111214] shadow-sm transition-colors hover:bg-white cursor-pointer"
          >
            <Heart
              className={`h-4 w-4 ${saved ? 'fill-[#B5945B] text-[#B5945B]' : 'text-[#111214]'}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <Link to={`/cars/${car.id}`} className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B6D72]">
            {car.brand}
          </p>
          <h3 className="mt-1 text-base font-bold text-[#111214] group-hover:text-[#9B7D48] transition-colors line-clamp-1">
            {car.model}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs text-[#6B6D72]">
            <span>{car.year}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{car.mileage.toLocaleString()} km</span>
            <span aria-hidden="true">·</span>
            <span>{car.transmission}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-black/8 pt-3.5">
          <span className="font-mono text-base font-bold tabular-nums text-[#111214]">
            {formatNaira(car.price)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#111214] group-hover:text-[#9B7D48] transition-colors whitespace-nowrap">
            View
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </div>
  );
};
