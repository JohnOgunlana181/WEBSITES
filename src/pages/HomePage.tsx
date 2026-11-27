import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
  Truck,
  Check,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import {
  AUTOSAT_ASSETS,
  BUSINESS_INFO,
  NIGERIAN_STATES,
  SHOWROOM_BRANDS,
  buildWhatsAppUrl,
  formatNaira,
} from '../data/constants';
import { CarCard } from '../components/CarCard';
import { BrandLogo, SafeImage } from '../components/BrandMark';
import { SearchBar } from '../components/SearchBar';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const TESTIMONIALS = [
  {
    name: 'Engr. Babatunde Adeyemi',
    role: 'Managing Director, Crestline Energy',
    city: 'Abuja (FCT)',
    quote:
      'I inspected the Land Cruiser Prado via live video from Abuja, settled payment at 11 AM, and AUTOSAT delivered it on an enclosed carrier to Maitama the next evening with every customs document intact.',
  },
  {
    name: 'Dr. Chidinma Okafor',
    role: 'Consultant Physician',
    city: 'Victoria Island, Lagos',
    quote:
      'Zero pressure and complete transparency at 24 Unity Road. Their diagnostic scan matched our independent mechanic report 100%. Easily the most trustworthy showroom in Ikeja.',
  },
  {
    name: 'Alhaji Musa Danjuma',
    role: 'Executive Logistics Partner',
    city: 'Kano State',
    quote:
      'We sourced three corporate SUVs from AUTOSAT LIMITED. Pricing was straight in Naira with zero hidden clearing surprises, and after-sales servicing support has been exemplary.',
  },
];

const CABIN_PREVIEWS = [
  {
    label: 'Mercedes GLE Cockpit',
    image: '/images/cars/mercedes-gle-450-2022-int.jpg',
    carId: 'mercedes-gle-450-2022',
  },
  {
    label: 'Range Rover L460 Cabin',
    image: '/images/cars/range-rover-autobiography-2023-int.jpg',
    carId: 'range-rover-autobiography-2023',
  },
  {
    label: 'Lexus LX 600 Interior',
    image: '/images/cars/lexus-lx-600-2022-int.jpg',
    carId: 'lexus-lx-600-2022',
  },
  {
    label: 'S 580 Executive Trim',
    image: '/images/cars/mercedes-s580-2022-int.jpg',
    carId: 'mercedes-s580-2022',
  },
  {
    label: 'Land Cruiser 300 Cabin',
    image: '/images/cars/toyota-land-cruiser-300-2023-int.jpg',
    carId: 'toyota-land-cruiser-300-2023',
  },
];

const QUICK_SEARCHES = [
  'SUV under 80M',
  'Mercedes GLE',
  '2022 Toyota',
  'Black Range Rover',
  'Lexus ES',
];

export const HomePage: React.FC = () => {
  const { cars } = useInventory();
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const [selectedState, setSelectedState] = useState(NIGERIAN_STATES[1].state);
  const [videoFailed, setVideoFailed] = useState(false);
  const [mobileBrandDrawer, setMobileBrandDrawer] = useState(false);

  useDocumentMeta({
    title: 'AUTOSAT LIMITED – Premium Cars Delivered Across Nigeria',
    description:
      'African-owned luxury, foreign-used, and Nigerian-used car dealership at 24 Unity Road, Ikeja, Lagos. Inspect in 3D, buy, sell, or rent with insured delivery across all 36 states and FCT.',
  });

  const availableCars = cars.filter((c) => c.status === 'available');
  const latestArrivals = availableCars.slice(0, 8);
  const featuredCars = availableCars.filter((c) => c.isFeatured).slice(0, 6);

  const activeDeliveryState =
    NIGERIAN_STATES.find((s) => s.state === selectedState) || NIGERIAN_STATES[0];

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const step = carouselRef.current.clientWidth * 0.78;
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      {/* 1. FULL-SCREEN UPLOADED VIDEO HERO + PROMINENT SEARCH */}
      <section className="relative flex min-h-[82vh] items-center overflow-hidden bg-[#0E0F11] py-16 text-white sm:py-20">
        {/* Static Poster / Error Fallback */}
        <img
          src={AUTOSAT_ASSETS.heroPoster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
        />

        {/* User Uploaded Looping Hero Video */}
        {!videoFailed && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={AUTOSAT_ASSETS.heroPoster}
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 h-full w-full object-cover object-center"
          >
            <source src={AUTOSAT_ASSETS.heroVideo} type="video/mp4" />
          </video>
        )}

        {/* High-Contrast Dark Gradient Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#08090B]/92 via-[#08090B]/74 to-[#08090B]/60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#08090B]/85 via-transparent to-[#08090B]/40"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E5C98E]">
              {BUSINESS_INFO.name} ({BUSINESS_INFO.rcNumber}) · IKEJA, LAGOS
            </p>
            <h1 className="mt-4 font-editorial text-4xl font-bold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
              Premium cars. Delivered across Nigeria.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#E5E7EB] sm:text-base">
              Verified foreign-used, Nigerian-used, and brand-new vehicles at 24 Unity Road, Ikeja — inspected, documented, and delivered insured to all 36 states &amp; FCT.
            </p>

            {/* Primary Hero CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 rounded-full bg-[#B5945B] px-6 py-3 text-xs font-semibold text-[#111214] hover:bg-[#CCA96D] transition-colors whitespace-nowrap"
              >
                Browse Cars
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                to="/sell-your-car"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white hover:text-[#111214] transition-colors whitespace-nowrap"
              >
                Sell Your Car
              </Link>
              <a
                href={buildWhatsAppUrl(
                  'Hello AUTOSAT LIMITED, I would like to enquire about available cars in your Ikeja showroom.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-6 py-3 text-xs font-semibold text-white hover:border-[#B5945B] transition-colors whitespace-nowrap"
              >
                WhatsApp Us
              </a>
            </div>

            {/* Prominent Fuzzy Search Bar on Hero */}
            <div className="mt-9 max-w-2xl">
              <SearchBar
                variant="hero"
                placeholder="Search by brand, model, year, colour, or 'SUV under 20 million'..."
              />
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#D1D5DB]">
                <span className="text-[#9CA3AF]">Try:</span>
                {QUICK_SEARCHES.map((q) => (
                  <Link
                    key={q}
                    to={`/search?q=${encodeURIComponent(q)}`}
                    className="rounded-full border border-white/15 bg-white/8 px-3 py-1 hover:border-[#B5945B] hover:text-[#E5C98E] transition-colors"
                  >
                    {q}
                  </Link>
                ))}
              </div>
            </div>

            {/* 3 Clean KPI Stats */}
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-6">
              <div>
                <p className="font-editorial text-2xl font-bold text-white">100%</p>
                <p className="mt-0.5 text-[11px] text-[#D1D5DB]">Inspected before listing</p>
              </div>
              <div>
                <p className="font-editorial text-2xl font-bold text-white">36 States</p>
                <p className="mt-0.5 text-[11px] text-[#D1D5DB]">+ FCT door delivery</p>
              </div>
              <div>
                <p className="font-editorial text-2xl font-bold text-white">Ikeja, Lagos</p>
                <p className="mt-0.5 text-[11px] text-[#D1D5DB]">24 Unity Road bay</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. BRANDS VERTICAL SIDEBAR LAYOUT + FEATURED SHOWROOM (Matches Inspiration Split Layout) */}
      <section className="bg-[#F5F4F0] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile Horizontal Brands Strip + Drawer Trigger (< lg) */}
          <div className="mb-8 lg:hidden space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9B7D48]">
                BROWSE BY BRAND
              </p>
              <button
                type="button"
                onClick={() => setMobileBrandDrawer(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#111214] cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                All Brands
              </button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {SHOWROOM_BRANDS.map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/brands/${brand.slug}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-black/8 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#111214] shadow-2xs hover:border-[#9B7D48]"
                >
                  <BrandLogo brand={brand.name} className="h-5 w-5" showFallbackText={false} />
                  <span className="whitespace-nowrap">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Desktop Vertical Brands Sidebar Column (Inspiration Layout: Logo + Brand Name Only, No Counts) */}
            <aside className="hidden lg:block lg:col-span-3" aria-label="Browse showroom by brand">
              <div className="sticky top-24 rounded-2xl border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between border-b border-black/8 pb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6D72]">
                    BRANDS
                  </p>
                  <Link
                    to="/inventory"
                    className="text-[11px] font-semibold text-[#9B7D48] hover:text-[#111214]"
                  >
                    View all
                  </Link>
                </div>

                <nav className="mt-3 max-h-[540px] space-y-1 overflow-y-auto pr-1" aria-label="Car brands">
                  {SHOWROOM_BRANDS.map((brand) => (
                    <Link
                      key={brand.slug}
                      to={`/brands/${brand.slug}`}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#111214] transition-all hover:bg-[#F5F4F0] hover:translate-x-0.5"
                    >
                      <BrandLogo
                        brand={brand.name}
                        className="h-5 w-5"
                        wrapperClassName="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F5F4F0] p-1 group-hover:bg-white"
                        showFallbackText={false}
                      />
                      <span className="truncate group-hover:text-[#9B7D48] transition-colors">
                        {brand.name}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Right Main Showroom Content Next to Vertical Brands Sidebar */}
            <div className="lg:col-span-9">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
                    FEATURED THIS WEEK
                  </p>
                  <h2 className="mt-1.5 font-editorial text-3xl font-bold text-[#111214] sm:text-4xl">
                    Hand-picked for you
                  </h2>
                </div>
                <Link
                  to="/inventory"
                  className="text-xs font-semibold text-[#111214] underline underline-offset-4 hover:text-[#9B7D48]"
                >
                  Browse full showroom
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {featuredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Slide-In Brand Drawer */}
      {mobileBrandDrawer && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label="Browse car brands"
        >
          <div className="flex h-full w-80 max-w-[85vw] flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/8 pb-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#111214]">
                Car Brands
              </p>
              <button
                type="button"
                onClick={() => setMobileBrandDrawer(false)}
                aria-label="Close brands drawer"
                className="rounded-full p-1.5 text-[#6B6D72] hover:bg-[#F5F4F0] hover:text-[#111214]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex-1 overflow-y-auto space-y-1">
              {SHOWROOM_BRANDS.map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/brands/${brand.slug}`}
                  onClick={() => setMobileBrandDrawer(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#111214] hover:bg-[#F5F4F0]"
                >
                  <BrandLogo brand={brand.name} className="h-5 w-5" showFallbackText={false} />
                  <span>{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileBrandDrawer(false)} />
        </div>
      )}

      {/* 3. DARK EDITORIAL CONTRAST SECTION ("Fresh off the carrier." + Latest Arrivals Carousel) */}
      <section className="adire-dark-subtle bg-[#111214] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B5945B]">
                JUST ARRIVED
              </p>
              <h2 className="font-editorial text-3xl font-bold text-white sm:text-4xl">
                Fresh off the carrier.
              </h2>
              <p className="text-sm leading-relaxed text-[#9CA3AF]">
                New foreign-used, Nigerian-used, and luxury stock lands every week at 24 Unity Road. Every car is scanned, detailed and photographed before it hits the showroom floor.
              </p>

              <ul className="space-y-2.5 text-xs text-[#D1D5DB]">
                {[
                  '200-point inspection report on every car',
                  'Nigerian Customs duty and documents cleared',
                  'Delivered to your city across all 36 states & FCT',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#B5945B]/20 text-[#B5945B]">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  to="/inventory"
                  className="inline-flex items-center rounded-full bg-[#B5945B] px-5 py-2.5 text-xs font-semibold text-[#111214] hover:bg-[#C9AA71] transition-colors"
                >
                  See new arrivals
                </Link>
                <div className="flex items-center gap-2 ml-auto lg:ml-4">
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    aria-label="Scroll latest arrivals left"
                    className="rounded-full border border-white/15 bg-white/5 p-2 text-white hover:border-[#B5945B] cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    aria-label="Scroll latest arrivals right"
                    className="rounded-full border border-white/15 bg-white/5 p-2 text-white hover:border-[#B5945B] cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div
                ref={carouselRef}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
              >
                {latestArrivals.map((car) => (
                  <div key={car.id} className="w-[82vw] shrink-0 snap-start sm:w-[290px]">
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INSIDE THE CABIN ("See before you drive") */}
      <section className="bg-[#F5F4F0] pt-16 pb-8 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
            INSIDE THE CABIN &amp; SHOWROOM
          </p>
          <h2 className="mt-1.5 font-editorial text-3xl font-bold text-[#111214] sm:text-4xl">
            See before you drive
          </h2>

          <div className="mt-7 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
            {CABIN_PREVIEWS.map((tile) => (
              <Link
                key={tile.label}
                to={`/cars/${tile.carId}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#E9E7E0]"
              >
                <SafeImage
                  src={tile.image}
                  alt={tile.label}
                  className="transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#111214]/85 px-2.5 py-1 text-[10px] font-semibold text-white">
                  {tile.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY AUTOSAT + TESTIMONIALS + 36-STATE DELIVERY + SELL YOUR CAR CTA */}
      <section className="bg-[#F5F4F0] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Inspected, every time',
                desc: 'A multi-point diagnostic check on engine, body, transmission and electronics, shared transparently before you pay.',
              },
              {
                icon: FileCheck2,
                title: 'Clean documents',
                desc: 'Verified Nigerian Customs duty, genuine Carfax/VIN history and full ownership papers sorted and handed over.',
              },
              {
                icon: Truck,
                title: 'Delivered anywhere',
                desc: 'Insured delivery to your door across all 36 states and the FCT, or collect from our Ikeja showroom with a full handover.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-black/8 bg-white p-7"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F4F0] text-[#111214]">
                  <card.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-bold text-[#111214]">{card.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B6D72]">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Client Proof */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col justify-between rounded-2xl border border-black/8 bg-white p-6"
              >
                <blockquote className="text-xs leading-relaxed text-[#525459] sm:text-sm">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-black/8 pt-4">
                  <p className="text-xs font-bold text-[#111214]">{t.name}</p>
                  <p className="text-[11px] text-[#6B6D72]">
                    {t.role} · <span className="text-[#9B7D48] font-medium">{t.city}</span>
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* 36 States & FCT Quick Estimator */}
          <div className="grid grid-cols-1 items-center gap-8 rounded-2xl border border-black/8 bg-white p-6 sm:p-10 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
                NATIONWIDE LOGISTICS
              </p>
              <h2 className="font-editorial text-2xl font-bold text-[#111214] sm:text-3xl">
                We deliver to all 36 states and the FCT.
              </h2>
              <p className="text-sm text-[#525459] leading-relaxed">
                Buying from Abuja, Port Harcourt, Kano, Enugu, or Ibadan? Inspect live on WhatsApp video with our Ikeja team and receive insured carrier delivery to your gate.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/delivery"
                  className="inline-flex items-center gap-2 rounded-full bg-[#111214] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2A2C30]"
                >
                  Request Delivery Quote
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-full border border-black/15 px-5 py-2.5 text-xs font-semibold text-[#111214] hover:border-[#111214]"
                >
                  Visit 24 Unity Road, Ikeja
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-xl bg-[#F5F4F0] p-5 space-y-4">
              <div>
                <label htmlFor="home-state-select" className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6D72]">
                  Quick Transit Estimator
                </label>
                <select
                  id="home-state-select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-[#111214]"
                >
                  {NIGERIAN_STATES.map((st) => (
                    <option key={st.state} value={st.state}>
                      {st.state} ({st.zone})
                    </option>
                  ))}
                </select>
              </div>
              <dl className="space-y-2 border-t border-black/8 pt-3 text-xs">
                <div className="flex justify-between">
                  <dt className="text-[#6B6D72]">Estimated Transit</dt>
                  <dd className="font-mono font-semibold text-[#111214]">{activeDeliveryState.transitDays}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6B6D72]">Insured Carrier From</dt>
                  <dd className="font-mono font-bold tabular-nums text-[#9B7D48]">
                    {formatNaira(activeDeliveryState.estimatedFee)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Dual CTA Band: Sell Your Car + Sourcing Request */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col justify-between gap-5 rounded-2xl border border-black/8 bg-white px-7 py-8 sm:px-9">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
                  DIRECT BUYING DESK
                </p>
                <h2 className="mt-2 font-editorial text-2xl font-bold leading-snug text-[#111214] sm:text-3xl">
                  Sell your car to Autosat quickly and get a fair offer.
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#525459] leading-relaxed">
                  Share your specs and real photos online — get an honest valuation, rapid inspection, and instant bank payment.
                </p>
              </div>
              <div>
                <Link
                  to="/sell-your-car"
                  className="inline-flex items-center gap-2 rounded-full bg-[#111214] px-6 py-3 text-xs font-semibold text-white hover:bg-[#2A2C30] transition-colors whitespace-nowrap"
                >
                  Sell Your Car
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5 rounded-2xl bg-[#A98B4F] px-7 py-8 text-white sm:px-9">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                  BESPOKE SOURCING
                </p>
                <h2 className="mt-2 font-editorial text-2xl font-bold leading-snug text-white sm:text-3xl">
                  Can&apos;t see the car you want? We&apos;ll find it.
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-white/90 leading-relaxed">
                  Tell our Ikeja sourcing desk your desired model, trim, colour, and Naira budget — delivered cleared in 14–21 days.
                </p>
              </div>
              <div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#111214] px-6 py-3 text-xs font-semibold text-white hover:bg-[#2A2C30] transition-colors whitespace-nowrap"
                >
                  Request a car
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
