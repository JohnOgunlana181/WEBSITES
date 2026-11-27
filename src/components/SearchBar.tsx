import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Search, X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { searchCarsWithDetails } from '../utils/carSearch';
import { buildWhatsAppUrl, formatNaira } from '../data/constants';
import { SafeImage } from './BrandMark';

interface SearchBarProps {
  variant?: 'navbar' | 'hero' | 'page';
  initialQuery?: string;
  placeholder?: string;
  onQueryChange?: (q: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'navbar',
  initialQuery = '',
  placeholder = 'Search brand, model, year, colour, or "SUV under 80M"...',
  onQueryChange,
  className = '',
}) => {
  const { cars } = useInventory();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return searchCarsWithDetails(cars, query).slice(0, 6);
  }, [cars, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    const trimmed = query.trim();
    if (variant === 'page' && onQueryChange) {
      onQueryChange(trimmed);
      return;
    }
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  const handleInput = (val: string) => {
    setQuery(val);
    setOpen(val.trim().length > 0 && variant !== 'page');
    if (onQueryChange) onQueryChange(val);
  };

  const isHero = variant === 'hero';
  const isNavbar = variant === 'navbar';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Search Autosat inventory"
        className={`flex items-center gap-2 transition-colors ${
          isHero
            ? 'rounded-2xl border border-white/20 bg-white/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-sm'
            : variant === 'page'
            ? 'rounded-2xl border border-black/15 bg-white p-2 shadow-xs'
            : 'rounded-full border border-black/15 bg-white px-3 py-1.5 focus-within:border-[#111214]'
        }`}
      >
        <Search
          className={`shrink-0 ${
            isNavbar ? 'h-3.5 w-3.5 text-[#6B6D72]' : 'ml-2 h-4 w-4 text-[#6B6D72]'
          }`}
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 0 && variant !== 'page') setOpen(true);
          }}
          placeholder={placeholder}
          aria-label="Search cars by brand, model, year, body type, colour or price"
          className={`w-full bg-transparent text-[#111214] placeholder-[#6B6D72] focus:outline-none ${
            isNavbar ? 'text-xs' : 'px-2 py-2 text-sm'
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              handleInput('');
              setOpen(false);
            }}
            aria-label="Clear search"
            className="rounded-full p-1 text-[#6B6D72] hover:bg-[#F5F4F0] hover:text-[#111214] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {!isNavbar && (
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[#111214] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2A2C30] transition-colors cursor-pointer whitespace-nowrap"
          >
            Search Cars
          </button>
        )}
      </form>

      {/* Live Dropdown Suggestions */}
      {open && query.trim().length > 0 && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl text-[#111214]"
          role="listbox"
          aria-label="Matching vehicles"
        >
          {suggestions.length > 0 ? (
            <>
              <div className="divide-y divide-black/6 max-h-80 overflow-y-auto">
                {suggestions.map(({ car, matchedColors }) => (
                  <Link
                    key={car.id}
                    to={`/cars/${car.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F4F0] transition-colors"
                  >
                    <div className="h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-[#E9E7E0]">
                      <SafeImage
                        src={car.colors[0]?.images[0] || car.images[0] || ''}
                        alt={`${car.brand} ${car.model}`}
                        placeholderLabel="Photo"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#111214]">
                        {car.year} {car.brand} {car.model}
                      </p>
                      <p className="truncate text-[11px] text-[#6B6D72]">
                        {car.bodyType} · {car.condition}
                        {matchedColors.length > 0 ? ` · ${matchedColors[0]}` : ''}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-[#111214]">
                      {formatNaira(car.price)}
                    </span>
                  </Link>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex w-full items-center justify-between border-t border-black/8 bg-[#F9F8F6] px-4 py-2.5 text-xs font-semibold text-[#111214] hover:bg-[#EFECE4] cursor-pointer"
              >
                <span>See all results for “{query.trim()}”</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <div className="p-4 text-center space-y-2.5">
              <p className="text-xs font-semibold text-[#111214]">
                No instant matches for “{query.trim()}”
              </p>
              <p className="text-[11px] text-[#6B6D72]">
                Can&apos;t find it? We&apos;ll source it for you directly.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <a
                  href={buildWhatsAppUrl(
                    `Hello AUTOSAT LIMITED, I searched for "${query.trim()}" and couldn't find it on the site. Please help source this car for me.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1F7A4D] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#258E5A]"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Request on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-full border border-black/15 px-3.5 py-1.5 text-[11px] font-semibold text-[#111214] hover:bg-[#F5F4F0] cursor-pointer"
                >
                  Full Search Page
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
