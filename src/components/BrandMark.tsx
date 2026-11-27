import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { brandLogoPath } from '../data/constants';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  placeholderLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  placeholderLabel = 'Upload real photo',
  loading = 'lazy',
  ...rest
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');

  useEffect(() => {
    setStatus(src ? 'loading' : 'error');
  }, [src]);

  if (!src || status === 'error') {
    return (
      <div
        className={`flex flex-col items-center justify-center border border-dashed border-black/15 bg-[#E9E7E0] text-[#6B6D72] p-4 text-center h-full w-full ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || placeholderLabel}
      >
        <Camera className="w-6 h-6 text-[#9B7D48] mb-1.5" aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#111214]/80">
          {placeholderLabel}
        </span>
        {fallbackTitle && (
          <span className="mt-0.5 text-[11px] text-[#6B6D72] line-clamp-1">{fallbackTitle}</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#E9E7E0]">
      {status === 'loading' && (
        <div className="absolute inset-0 bg-[#E9E7E0]" aria-hidden="true" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...rest}
      />
    </div>
  );
};

interface BrandLogoProps {
  brand: string;
  className?: string;
  wrapperClassName?: string;
  showFallbackText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brand,
  className = 'h-7 w-7',
  wrapperClassName,
  showFallbackText = true,
}) => {
  const logoSrc = brandLogoPath(brand);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [logoSrc]);

  if (failed) {
    if (!showFallbackText) return null;
    return (
      <span
        className="inline-flex items-center justify-center text-center text-[10px] font-bold uppercase tracking-wider text-[#111214]/80 leading-tight"
        aria-label={`${brand} logo`}
      >
        {brand}
      </span>
    );
  }

  const imgEl = (
    <img
      src={logoSrc}
      alt={`${brand} official logo`}
      onError={() => setFailed(true)}
      className={`object-contain shrink-0 ${className}`}
      loading="lazy"
      decoding="async"
    />
  );

  if (wrapperClassName) {
    return <span className={wrapperClassName}>{imgEl}</span>;
  }

  return imgEl;
};

export const BrandEmblem = BrandLogo;
