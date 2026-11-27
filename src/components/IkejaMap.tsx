import React, { useState } from 'react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { BUSINESS_INFO } from '../data/constants';

export const IkejaMap: React.FC = () => {
  const [selectedPin, setSelectedPin] = useState<'showroom' | 'jakande' | 'allen'>('showroom');

  const pinDetails = {
    showroom: {
      title: 'AUTOSAT LIMITED Showroom',
      subtitle: '24 Unity Road, Ikeja, Lagos',
      note: 'Main walk-in inspection bay, 3D lounge & customer parking.',
    },
    jakande: {
      title: 'Lateef Jakande Road, Agidingbi',
      subtitle: '4 mins from showroom',
      note: 'Easy access via Ikeja City Mall / Alausa corridor.',
    },
    allen: {
      title: 'Allen Avenue / Obafemi Awolowo Way',
      subtitle: '2 mins from Unity Road',
      note: 'Direct junction linking Ikeja GRA & Airport Road.',
    },
  };

  return (
    <div className="overflow-hidden rounded-xl border border-black/8 bg-white">
      <div className="relative aspect-[16/10] w-full bg-[#111214] p-4 sm:p-5">
        <svg
          viewBox="0 0 800 460"
          className="h-full w-full rounded-lg border border-white/10 bg-[#0D0E10]"
          role="img"
          aria-label="Map showing AUTOSAT LIMITED at 24 Unity Road, Ikeja, Lagos near Lateef Jakande Road"
        >
          <defs>
            <pattern id="ikeja-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeOpacity="0.03" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="460" fill="url(#ikeja-grid)" />

          <text x="580" y="75" fill="#6B7280" fontSize="13" letterSpacing="3">AGIDINGBI</text>
          <text x="110" y="395" fill="#6B7280" fontSize="13" letterSpacing="3">IKEJA GRA</text>
          <text x="495" y="385" fill="#6B7280" fontSize="13" letterSpacing="3">ALAUSA</text>

          <path d="M 80 430 L 260 60" stroke="#1F242D" strokeWidth="16" strokeLinecap="round" />
          <path d="M 80 430 L 260 60" stroke="#B5945B" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="6 6" />
          <text x="125" y="295" fill="#9CA3AF" fontSize="11" transform="rotate(-63 125 295)">Obafemi Awolowo Way</text>

          <path d="M 260 60 L 680 120" stroke="#1F242D" strokeWidth="16" strokeLinecap="round" />
          <text x="415" y="76" fill="#9CA3AF" fontSize="11" transform="rotate(8 415 76)">Lateef Jakande Rd (Agidingbi)</text>

          <path d="M 190 280 L 660 295" stroke="#1F242D" strokeWidth="14" strokeLinecap="round" />
          <text x="480" y="276" fill="#9CA3AF" fontSize="11">Allen Avenue</text>

          <path d="M 320 190 L 535 288" stroke="#2D333F" strokeWidth="12" strokeLinecap="round" />
          <path d="M 320 190 L 535 288" stroke="#B5945B" strokeOpacity="0.55" strokeWidth="2" />
          <text x="355" y="248" fill="#E5C98E" fontSize="11" fontWeight="600" transform="rotate(24 355 248)">Unity Road</text>

          <path d="M 150 365 L 590 365" stroke="#1B1F27" strokeWidth="10" strokeLinecap="round" />
          <text x="330" y="384" fill="#6B7280" fontSize="10">Toyin Street</text>

          <g className="cursor-pointer" onClick={() => setSelectedPin('jakande')}>
            <circle cx="520" cy="97" r="9" fill={selectedPin === 'jakande' ? '#B5945B' : '#272C35'} stroke="#F8F7F4" strokeWidth="1.5" />
            <text x="520" y="126" textAnchor="middle" fill="#D1D5DB" fontSize="11">Ikeja City Mall / Agidingbi</text>
          </g>

          <g className="cursor-pointer" onClick={() => setSelectedPin('allen')}>
            <circle cx="215" cy="281" r="9" fill={selectedPin === 'allen' ? '#B5945B' : '#272C35'} stroke="#F8F7F4" strokeWidth="1.5" />
            <text x="215" y="308" textAnchor="middle" fill="#D1D5DB" fontSize="11">Allen Junction</text>
          </g>

          <g className="cursor-pointer" onClick={() => setSelectedPin('showroom')}>
            <circle cx="412" cy="232" r="24" fill="#B5945B" fillOpacity="0.18" />
            <circle cx="412" cy="232" r="12" fill="#B5945B" stroke="#111214" strokeWidth="2.5" />
            <rect x="338" y="164" width="148" height="36" rx="6" fill="#111214" stroke="#B5945B" strokeWidth="1" />
            <text x="412" y="181" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">AUTOSAT SHOWROOM</text>
            <text x="412" y="194" textAnchor="middle" fill="#E5C98E" fontSize="9.5">24 Unity Road, Ikeja</text>
          </g>
        </svg>
      </div>

      <div className="flex flex-col gap-4 border-t border-black/8 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-[#9B7D48] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-[#111214]">{pinDetails[selectedPin].title}</p>
            <p className="text-xs font-medium text-[#9B7D48]">{pinDetails[selectedPin].subtitle}</p>
            <p className="mt-0.5 text-xs text-[#6B6D72]">{pinDetails[selectedPin].note}</p>
          </div>
        </div>
        <a
          href={BUSINESS_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111214] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#2A2C30] transition-colors whitespace-nowrap shrink-0"
        >
          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
          Open in Google Maps
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};
