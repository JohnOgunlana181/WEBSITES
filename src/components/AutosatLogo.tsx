import React from 'react';
import { AUTOSAT_ASSETS } from '../data/constants';

interface AutosatLogoProps {
  variant?: 'onLight' | 'onDark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AutosatLogo: React.FC<AutosatLogoProps> = ({
  variant = 'onLight',
  size = 'md',
  className = '',
}) => {
  const heightClass =
    size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14 sm:h-16' : 'h-10 sm:h-11';

  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-lg bg-black shrink-0 ${
        variant === 'onLight'
          ? 'px-2 py-0.5 border border-black/15 shadow-xs'
          : 'px-2 py-0.5 border border-white/10'
      } ${className}`}
    >
      <img
        src={AUTOSAT_ASSETS.logo}
        alt="AUTOSAT LIMITED"
        className={`${heightClass} w-auto object-contain select-none`}
        decoding="async"
      />
    </span>
  );
};

export const AutosatLoadingScreen: React.FC<{
  fullScreen?: boolean;
  label?: string;
}> = ({ fullScreen = false, label = 'Loading AUTOSAT Showroom...' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-[#0B0C0E] text-white ${
        fullScreen ? 'fixed inset-0 z-50' : 'min-h-[55vh] w-full rounded-2xl'
      }`}
      role="status"
      aria-live="polite"
    >
      <AutosatLogo variant="onDark" size="lg" />
      <div className="mt-5 h-6 w-6 animate-spin rounded-full border-2 border-[#B5945B] border-t-transparent" />
      <p className="mt-3 text-xs tracking-wide text-[#9CA3AF]">{label}</p>
    </div>
  );
};
