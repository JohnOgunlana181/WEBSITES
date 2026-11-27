import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { AutosatLogo } from './AutosatLogo';
import { SearchBar } from './SearchBar';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navLinks = [
    { to: '/inventory', label: 'Showroom' },
    { to: '/sell-your-car', label: 'Sell Your Car' },
    { to: '/rentals', label: 'Rentals' },
    { to: '/delivery', label: 'Delivery' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F5F4F0]/95 backdrop-blur-sm border-b border-black/10">
      {/* Slim dark announcement strip */}
      <div className="bg-[#111214] px-4 py-1.5 text-center text-[11px] text-[#D1D5DB]">
        <span>Nationwide delivery across all 36 states &amp; FCT</span>
        <span className="mx-2.5 text-[#B5945B]" aria-hidden="true">·</span>
        <span className="hidden sm:inline">Every car inspected at 24 Unity Road, Ikeja</span>
        <span className="hidden md:inline mx-2.5 text-[#B5945B]" aria-hidden="true">·</span>
        <span className="hidden md:inline">RC 1643628</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Uploaded AUTOSAT Logo */}
        <Link
          to="/"
          aria-label="AUTOSAT LIMITED Home"
          className="shrink-0 hover:opacity-90 transition-opacity"
        >
          <AutosatLogo variant="onLight" size="sm" />
        </Link>

        {/* Concise Single-Line Nav Links */}
        <nav className="hidden xl:flex items-center gap-5" aria-label="Primary Navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-xs lg:text-sm font-medium whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b ${
                  isActive
                    ? 'text-[#111214] border-[#111214]'
                    : 'text-[#525459] border-transparent hover:text-[#111214] hover:border-black/30'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Prominent Navbar Search Bar (Desktop & Tablet) */}
        <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm">
          <SearchBar
            variant="navbar"
            placeholder="Search car, year, colour, or 'SUV under 80M'..."
          />
        </div>

        {/* Primary Action & Mobile Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="inline-flex md:hidden items-center justify-center rounded-md border border-black/15 bg-white p-2 text-[#111214]"
            aria-label="Toggle search bar"
            aria-expanded={mobileSearchOpen}
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#111214] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2A2C30] transition-colors whitespace-nowrap shrink-0"
          >
            Book a viewing
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex xl:hidden items-center justify-center rounded-md border border-black/15 bg-white p-2 text-[#111214]"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Strip */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-black/8 bg-[#F5F4F0] px-4 py-3">
          <SearchBar
            variant="navbar"
            placeholder="Search brand, model, colour, 'SUV under 20m'..."
          />
        </div>
      )}

      {/* Mobile / Tablet Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-black/10 bg-white px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-2.5" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `py-2 text-base font-medium ${
                    isActive ? 'text-[#111214] font-semibold' : 'text-[#525459] hover:text-[#111214]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-3 border-t border-black/10 flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center rounded-full bg-[#111214] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Book a viewing
            </Link>
            <PWAInstallButton className="w-full justify-center" />
          </div>
        </div>
      )}
    </header>
  );
};
