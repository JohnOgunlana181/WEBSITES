import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageCircle, ShoppingBag, X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useGarage } from '../context/GarageContext';
import { SHOWROOM_BRANDS, buildWhatsAppUrl, formatNaira } from '../data/constants';
import { searchCarsWithDetails } from '../utils/carSearch';
import { CarCard } from '../components/CarCard';
import { BrandLogo } from '../components/BrandMark';
import { SearchBar } from '../components/SearchBar';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { cars, isLoading } = useInventory();
  const { garageIds, setDrawerOpen } = useGarage();

  const [queryText, setQueryText] = useState(initialQuery);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [bodyFilter, setBodyFilter] = useState<string>('all');
  const [fuelFilter, setFuelFilter] = useState<string>('all');
  const [transmissionFilter, setTransmissionFilter] = useState<string>('all');
  const [minYear, setMinYear] = useState<string>('all');
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(420000000);
  const [sortBy, setSortBy] = useState<string>('relevance');

  useDocumentMeta({
    title: queryText.trim()
      ? `Search: "${queryText.trim()}" – AUTOSAT LIMITED`
      : 'Search Showroom Vehicles – AUTOSAT LIMITED',
    description:
      'Search AUTOSAT LIMITED vehicles by brand, model, year, colour, body type, or budget in Naira.',
  });

  const handleQueryUpdate = (q: string) => {
    setQueryText(q);
    if (q.trim()) {
      setSearchParams({ q: q.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const toggleBrandSelection = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  const filteredCars = useMemo(() => {
    const searchMatches = searchCarsWithDetails(cars, queryText);

    const narrowed = searchMatches.filter(({ car }) => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(car.brand)) return false;
      if (conditionFilter !== 'all' && car.condition !== conditionFilter) return false;
      if (bodyFilter !== 'all' && car.bodyType !== bodyFilter) return false;
      if (fuelFilter !== 'all' && car.fuel !== fuelFilter) return false;
      if (transmissionFilter !== 'all' && car.transmission !== transmissionFilter) return false;
      if (minYear !== 'all' && car.year < Number(minYear)) return false;
      if (car.price > maxPriceLimit) return false;
      return true;
    });

    if (sortBy === 'relevance') {
      return narrowed.map((m) => m.car);
    }

    return narrowed
      .map((m) => m.car)
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'mileage-asc') return a.mileage - b.mileage;
        return b.year - a.year;
      });
  }, [
    cars,
    queryText,
    selectedBrands,
    conditionFilter,
    bodyFilter,
    fuelFilter,
    transmissionFilter,
    minYear,
    maxPriceLimit,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedBrands([]);
    setConditionFilter('all');
    setBodyFilter('all');
    setFuelFilter('all');
    setTransmissionFilter('all');
    setMinYear('all');
    setMaxPriceLimit(420000000);
    setSortBy('relevance');
  };

  const activeChips: { label: string; onClear: () => void }[] = [
    ...selectedBrands.map((b) => ({
      label: b,
      onClear: () => toggleBrandSelection(b),
    })),
    ...(conditionFilter !== 'all'
      ? [{ label: conditionFilter, onClear: () => setConditionFilter('all') }]
      : []),
    ...(bodyFilter !== 'all'
      ? [{ label: bodyFilter, onClear: () => setBodyFilter('all') }]
      : []),
    ...(fuelFilter !== 'all'
      ? [{ label: fuelFilter, onClear: () => setFuelFilter('all') }]
      : []),
    ...(transmissionFilter !== 'all'
      ? [{ label: transmissionFilter, onClear: () => setTransmissionFilter('all') }]
      : []),
    ...(minYear !== 'all'
      ? [{ label: `${minYear}+`, onClear: () => setMinYear('all') }]
      : []),
    ...(maxPriceLimit < 420000000
      ? [{ label: `Up to ${formatNaira(maxPriceLimit)}`, onClear: () => setMaxPriceLimit(420000000) }]
      : []),
  ];

  const availableBrands = useMemo(() => {
    return SHOWROOM_BRANDS.filter((b) => cars.some((c) => c.brand === b.name));
  }, [cars]);

  const requestWhatsAppUrl = buildWhatsAppUrl(
    queryText.trim()
      ? `Hello AUTOSAT LIMITED, I searched your showroom for "${queryText.trim()}" and couldn't find an exact match. Can you source this vehicle for me?`
      : 'Hello AUTOSAT LIMITED, I would like to request a custom vehicle search from your Ikeja sourcing desk.'
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-3 text-xs text-[#6B6D72]" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#111214]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[#111214] font-medium">Search</span>
      </nav>

      {/* Search Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-editorial text-4xl font-bold text-[#111214]">
            Search Results
          </h1>
          <p className="mt-1 text-sm text-[#6B6D72]">
            {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}
            {queryText.trim() ? ` matching “${queryText.trim()}”` : ' in showroom'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {garageIds.length > 0 && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-[#111214] hover:border-[#111214] cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              Your garage ({garageIds.length})
            </button>
          )}

          <div className="flex items-center gap-2 text-xs text-[#6B6D72]">
            <span>Sort by</span>
            <select
              aria-label="Sort search results"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-[#111214] focus:outline-none cursor-pointer"
            >
              <option value="relevance">Best Match</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="mileage-asc">Lowest Mileage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prominent Inline Refine Search Bar */}
      <div className="mt-6">
        <SearchBar
          variant="page"
          initialQuery={queryText}
          onQueryChange={handleQueryUpdate}
          placeholder="Try 'black Mercedes GLE', 'SUV under 80 million', '2022 Toyota', or 'red'..."
        />
      </div>

      {/* Split Filter Sidebar + Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="rounded-2xl border border-black/8 bg-white p-5 space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6D72]">
                BRAND
              </p>
              <div className="mt-3 max-h-60 space-y-2.5 overflow-y-auto pr-1">
                {availableBrands.map((b) => {
                  const checked = selectedBrands.includes(b.name);
                  return (
                    <label
                      key={b.slug}
                      className="flex cursor-pointer items-center gap-2.5 text-xs text-[#111214]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBrandSelection(b.name)}
                        className="h-4 w-4 rounded border-black/25 accent-[#111214]"
                      />
                      <BrandLogo brand={b.name} className="h-4 w-4" showFallbackText={false} />
                      <span className={checked ? 'font-semibold' : ''}>{b.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-black/8 pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6D72]">
                CONDITION
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'Brand New', label: 'Brand new' },
                  { value: 'Foreign Used', label: 'Foreign used' },
                  { value: 'Nigerian Used', label: 'Nigerian used' },
                ].map((opt) => {
                  const active = conditionFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setConditionFilter(opt.value)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#111214] text-white'
                          : 'border border-black/12 bg-white text-[#525459] hover:border-[#111214]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-black/8 pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6D72]">
                PRICE
              </p>
              <input
                type="range"
                aria-label="Maximum price"
                min={10000000}
                max={420000000}
                step={5000000}
                value={maxPriceLimit}
                onChange={(e) => setMaxPriceLimit(Number(e.target.value))}
                className="mt-3 w-full accent-[#111214] cursor-pointer"
              />
              <div className="mt-1.5 flex justify-between font-mono text-[11px] text-[#525459]">
                <span>₦10M</span>
                <span>{formatNaira(maxPriceLimit)}</span>
              </div>
            </div>

            <div className="border-t border-black/8 pt-5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6D72] mb-1.5">
                  BODY TYPE
                </label>
                <select
                  aria-label="Filter by body type"
                  value={bodyFilter}
                  onChange={(e) => setBodyFilter(e.target.value)}
                  className="w-full rounded-lg border border-black/12 bg-[#F9F8F6] px-3 py-2 text-xs text-[#111214]"
                >
                  <option value="all">All Body Types</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6D72] mb-1.5">
                  YEAR
                </label>
                <select
                  aria-label="Filter by minimum year"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  className="w-full rounded-lg border border-black/12 bg-[#F9F8F6] px-3 py-2 text-xs text-[#111214]"
                >
                  <option value="all">Any Year</option>
                  <option value="2023">2023+</option>
                  <option value="2022">2022+</option>
                  <option value="2021">2021+</option>
                  <option value="2019">2019+</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6D72] mb-1.5">
                  FUEL &amp; TRANSMISSION
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    aria-label="Filter by fuel"
                    value={fuelFilter}
                    onChange={(e) => setFuelFilter(e.target.value)}
                    className="w-full rounded-lg border border-black/12 bg-[#F9F8F6] px-2.5 py-2 text-xs text-[#111214]"
                  >
                    <option value="all">Any Fuel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                  <select
                    aria-label="Filter by transmission"
                    value={transmissionFilter}
                    onChange={(e) => setTransmissionFilter(e.target.value)}
                    className="w-full rounded-lg border border-black/12 bg-[#F9F8F6] px-2.5 py-2 text-xs text-[#111214]"
                  >
                    <option value="all">Any Gear</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
            </div>

            {activeChips.length > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="w-full rounded-full border border-black/15 py-2 text-xs font-semibold text-[#111214] hover:bg-[#F5F4F0] cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        <div className="lg:col-span-9">
          {activeChips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.onClear}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/12 bg-white px-3 py-1 text-xs font-medium text-[#111214] hover:border-[#111214] cursor-pointer"
                >
                  {chip.label}
                  <X className="h-3 w-3 text-[#6B6D72]" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 animate-pulse rounded-xl border border-black/8 bg-white" />
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="rounded-2xl border border-black/8 bg-white p-10 sm:p-14 text-center space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
                NO EXACT MATCH IN SHOWROOM
              </p>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#111214]">
                Can&apos;t find it? We&apos;ll source it for you.
              </h2>
              <p className="mx-auto max-w-lg text-sm text-[#525459] leading-relaxed">
                Tell our Ikeja sourcing desk the exact model, year, colour, and Naira budget you want{queryText.trim() ? ` (like “${queryText.trim()}”)` : ''}. We inspect and clear bespoke orders in 14–21 days.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <a
                  href={requestWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1F7A4D] px-6 py-3 text-xs font-semibold text-white hover:bg-[#258E5A]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Request This Car on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    handleQueryUpdate('');
                    resetFilters();
                  }}
                  className="rounded-full border border-black/15 px-6 py-3 text-xs font-semibold text-[#111214] hover:bg-[#F5F4F0] cursor-pointer"
                >
                  View All Showroom Cars
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
