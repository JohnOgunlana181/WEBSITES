import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompareArrows, X } from 'lucide-react';
import { useGarage } from '../context/GarageContext';
import { useInventory } from '../context/InventoryContext';

export const CompareTray: React.FC = () => {
  const { compareIds, removeFromCompare, clearCompare, getCompareCars } = useGarage();
  const { cars } = useInventory();

  if (compareIds.length === 0) return null;

  const compareCars = getCompareCars(cars);
  if (compareCars.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 left-5 z-30 flex max-w-[calc(100vw-8.5rem)] flex-wrap items-center gap-2 rounded-2xl border border-black/12 bg-white/95 px-3.5 py-2.5 shadow-xl backdrop-blur-sm"
      role="region"
      aria-label="Vehicle comparison selection"
    >
      <div className="flex items-center gap-2">
        <GitCompareArrows className="h-4 w-4 text-[#9B7D48] shrink-0" aria-hidden="true" />
        <span className="text-xs font-bold text-[#111214] whitespace-nowrap">
          Compare ({compareCars.length}/3)
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-1.5">
        {compareCars.map((c) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-1 rounded-full bg-[#F5F4F0] px-2.5 py-1 text-[11px] font-medium text-[#111214]"
          >
            <span className="max-w-[110px] truncate">{c.model}</span>
            <button
              type="button"
              onClick={() => removeFromCompare(c.id)}
              aria-label={`Remove ${c.model} from compare`}
              className="text-[#6B6D72] hover:text-[#111214] cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <Link
        to="/compare"
        className="rounded-full bg-[#111214] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#2A2C30] whitespace-nowrap"
      >
        Compare Now
      </Link>

      <button
        type="button"
        onClick={clearCompare}
        aria-label="Clear compare list"
        className="p-1 text-[#6B6D72] hover:text-[#111214] cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
