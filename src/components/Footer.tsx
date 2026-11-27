import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { BUSINESS_INFO } from '../data/constants';
import { PWAInstallButton } from './PWAInstallButton';
import { AutosatLogo } from './AutosatLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0E0F11] text-[#D1D5DB]">
      <div className="adire-divider" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" aria-label="AUTOSAT LIMITED Home" className="inline-block">
              <AutosatLogo variant="onDark" size="md" />
            </Link>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              {BUSINESS_INFO.name} ({BUSINESS_INFO.rcNumber}). {BUSINESS_INFO.tagline}
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Luxury, foreign-used, and Nigerian-used vehicles, inspected and delivered across Nigeria.
            </p>
            <div className="pt-1">
              <PWAInstallButton className="!border-[#B5945B]/40 !bg-[#B5945B]/15 !text-[#E5C98E] hover:!bg-[#B5945B] hover:!text-[#111214]" />
            </div>
          </div>

          {/* Showroom */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Showroom</h3>
            <p className="flex items-start gap-2.5 text-sm text-[#9CA3AF]">
              <MapPin className="w-4 h-4 text-[#B5945B] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                {BUSINESS_INFO.addressPrimary}
                <br />
                <span className="text-xs text-[#6B7280]">{BUSINESS_INFO.addressLandmark}</span>
              </span>
            </p>
            <div className="flex items-start gap-2.5 text-sm text-[#9CA3AF]">
              <Clock className="w-4 h-4 text-[#B5945B] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1 text-xs">
                {BUSINESS_INFO.hours.map((h) => (
                  <p key={h.days}>
                    <span className="text-[#E5E7EB]">{h.days}:</span> {h.time}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Visit &amp; Call</h3>
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${BUSINESS_INFO.phonePrimaryRaw}`}
                className="flex items-center gap-2.5 text-[#D1D5DB] hover:text-[#E5C98E] transition-colors font-mono tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#B5945B]" aria-hidden="true" />
                {BUSINESS_INFO.phonePrimary}
              </a>
              <a
                href={`tel:${BUSINESS_INFO.phoneSecondaryRaw}`}
                className="flex items-center gap-2.5 text-[#D1D5DB] hover:text-[#E5C98E] transition-colors font-mono tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#B5945B]" aria-hidden="true" />
                {BUSINESS_INFO.phoneSecondary}
              </a>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#E5C98E] transition-colors"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
                {BUSINESS_INFO.instagram}
              </a>
              <a
                href={BUSINESS_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#E5C98E] transition-colors"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
                {BUSINESS_INFO.facebook}
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Company</h3>
            <ul className="space-y-2 text-sm text-[#9CA3AF]">
              <li><Link to="/inventory" className="hover:text-[#E5C98E] transition-colors">Showroom Inventory</Link></li>
              <li><Link to="/search" className="hover:text-[#E5C98E] transition-colors">Search Vehicles</Link></li>
              <li><Link to="/sell-your-car" className="hover:text-[#E5C98E] transition-colors">Sell Your Car</Link></li>
              <li><Link to="/compare" className="hover:text-[#E5C98E] transition-colors">Compare Cars</Link></li>
              <li><Link to="/rentals" className="hover:text-[#E5C98E] transition-colors">Executive Rentals</Link></li>
              <li><Link to="/delivery" className="hover:text-[#E5C98E] transition-colors">Nationwide Delivery</Link></li>
              <li><Link to="/reserve" className="hover:text-[#E5C98E] transition-colors">Reserve a Vehicle</Link></li>
              <li><Link to="/about" className="hover:text-[#E5C98E] transition-colors">About AUTOSAT</Link></li>
              <li><Link to="/admin" className="text-xs text-[#6B7280] hover:text-[#E5C98E] transition-colors">Staff Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#6B7280] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.name} ({BUSINESS_INFO.rcNumber}). All rights reserved.</p>
          <p>24 Unity Road, Ikeja, Lagos · Delivering across all 36 States &amp; FCT Abuja</p>
        </div>
      </div>
    </footer>
  );
};
