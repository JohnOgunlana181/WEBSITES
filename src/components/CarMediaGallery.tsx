import React, { useEffect, useRef, useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, Expand, MoveHorizontal, Play, X } from 'lucide-react';
import { SafeImage } from './BrandMark';

interface CarMediaGalleryProps {
  carName: string;
  colorName?: string;
  images: string[];
  interiorImage: string;
  videoUrl?: string;
  activeTab: 'photos' | 'video' | 'spin360' | 'interior';
}

export const CarMediaGallery: React.FC<CarMediaGalleryProps> = ({
  carName,
  colorName,
  images,
  interiorImage,
  videoUrl,
  activeTab,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [spinAngle, setSpinAngle] = useState(0);
  const [panOffset, setPanOffset] = useState(50);
  const dragStartRef = useRef<number | null>(null);

  // Reset gallery index cleanly whenever selected color's images change
  useEffect(() => {
    setActiveIndex(0);
    setSpinAngle(0);
  }, [images, colorName]);

  const hasColorPhotos = images.length > 0;
  const safeImages = hasColorPhotos ? images : [];
  const currentImg = hasColorPhotos ? safeImages[activeIndex % safeImages.length] : '';

  const nextImg = () => {
    if (!hasColorPhotos) return;
    setActiveIndex((i) => (i + 1) % safeImages.length);
  };
  const prevImg = () => {
    if (!hasColorPhotos) return;
    setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  };

  if (activeTab === 'video') {
    return (
      <div className="flex h-[400px] sm:h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#111214] p-6 text-center">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            playsInline
            poster={currentImg || interiorImage}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#08090A]">
            {(currentImg || interiorImage) && (
              <SafeImage
                src={currentImg || interiorImage}
                alt={`${carName} video preview`}
                className="opacity-35"
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#B5945B]/60 bg-[#B5945B]/20 text-[#E5C98E]">
                <Play className="h-6 w-6 ml-0.5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Showroom Walkaround Video</h3>
              <p className="mt-1.5 max-w-md text-xs text-[#D1D5DB] leading-relaxed">
                Video walkaround coming soon — request a live WhatsApp video inspection of this {carName} directly from our 24 Unity Road, Ikeja bay.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'spin360') {
    if (!hasColorPhotos) {
      return (
        <div className="flex h-[400px] sm:h-[500px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-black/20 bg-[#E9E7E0] p-6 text-center">
          <Camera className="h-10 w-10 text-[#9B7D48] mb-3" aria-hidden="true" />
          <p className="text-sm font-bold text-[#111214]">
            Photos coming soon for {colorName || 'this colour'}
          </p>
          <p className="mt-1 text-xs text-[#6B6D72]">
            Upload real photos for this colour finish in the Admin Portal to enable 360° spin.
          </p>
        </div>
      );
    }

    const frameIndex = Math.abs(Math.floor(spinAngle / 45)) % safeImages.length;
    return (
      <div
        className="relative h-[400px] sm:h-[500px] w-full select-none overflow-hidden rounded-xl border border-black/10 bg-[#111214] cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          dragStartRef.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (dragStartRef.current === null) return;
          const delta = e.clientX - dragStartRef.current;
          dragStartRef.current = e.clientX;
          setSpinAngle((prev) => (prev + delta * 0.6) % 360);
        }}
        onPointerUp={() => {
          dragStartRef.current = null;
        }}
        onPointerLeave={() => {
          dragStartRef.current = null;
        }}
      >
        <div
          className="h-full w-full transition-transform duration-150"
          style={{ transform: `perspective(1200px) rotateY(${Math.sin((spinAngle * Math.PI) / 180) * 6}deg)` }}
        >
          <SafeImage
            src={safeImages[frameIndex]}
            alt={`${carName}${colorName ? ` in ${colorName}` : ''} 360 degree view`}
          />
        </div>
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-black/85 px-4 py-2 text-xs text-[#E5C98E] border border-white/10">
          <MoveHorizontal className="h-4 w-4" aria-hidden="true" />
          Drag left or right to spin{colorName ? ` · ${colorName}` : ''} ({Math.round(((spinAngle % 360) + 360) % 360)}°)
        </div>
      </div>
    );
  }

  if (activeTab === 'interior') {
    return (
      <div
        className="relative h-[400px] sm:h-[500px] w-full select-none overflow-hidden rounded-xl border border-black/10 bg-[#111214] cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          dragStartRef.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (dragStartRef.current === null) return;
          const delta = e.clientX - dragStartRef.current;
          dragStartRef.current = e.clientX;
          setPanOffset((prev) => Math.max(0, Math.min(100, prev - delta * 0.15)));
        }}
        onPointerUp={() => {
          dragStartRef.current = null;
        }}
        onPointerLeave={() => {
          dragStartRef.current = null;
        }}
      >
        {interiorImage ? (
          <img
            src={interiorImage}
            alt={`${carName} luxury cabin interior`}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover scale-110 transition-all duration-75"
            style={{ objectPosition: `${panOffset}% center` }}
          />
        ) : (
          <SafeImage src="" alt={`${carName} interior`} placeholderLabel="Upload real interior photo" />
        )}
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-black/85 px-4 py-2 text-xs text-[#E5C98E] border border-white/10">
          <MoveHorizontal className="h-4 w-4" aria-hidden="true" />
          Drag horizontally to pan cabin interior
        </div>
      </div>
    );
  }

  if (!hasColorPhotos) {
    return (
      <div className="flex h-[340px] sm:h-[440px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-black/20 bg-[#E9E7E0] p-6 text-center">
        <Camera className="h-10 w-10 text-[#9B7D48] mb-3" aria-hidden="true" />
        <p className="text-sm font-bold text-[#111214]">
          Upload real photo — Photos coming soon
        </p>
        <p className="mt-1 max-w-md text-xs text-[#6B6D72]">
          Real exterior and interior photographs for {carName} in {colorName || 'this colour'} have not been uploaded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative h-[340px] sm:h-[440px] w-full overflow-hidden rounded-xl border border-black/10 bg-[#E9E7E0]">
        <SafeImage
          src={currentImg}
          alt={`${carName}${colorName ? ` (${colorName})` : ''} photo ${activeIndex + 1}`}
        />

        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-[#111214]/85 px-3 py-1 text-[11px] font-medium text-white">
          {colorName ? `${colorName} · ` : ''}
          {activeIndex + 1} / {safeImages.length} photos
        </div>

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open photo in fullscreen lightbox"
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#111214] shadow-sm hover:bg-white cursor-pointer"
        >
          <Expand className="h-3.5 w-3.5" aria-hidden="true" />
          Fullscreen
        </button>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImg}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#111214] shadow-sm hover:bg-white cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextImg}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#111214] shadow-sm hover:bg-white cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {safeImages.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
              idx === activeIndex ? 'border-[#111214]' : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <SafeImage src={img} alt={`${carName} ${colorName || ''} thumbnail ${idx + 1}`} />
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${carName} photo lightbox`}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
            className="absolute top-5 right-5 rounded-full border border-white/20 bg-black/80 p-2.5 text-white hover:border-[#B5945B] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={prevImg}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/80 p-3 text-white hover:border-[#B5945B] cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <div className="max-h-[82vh] max-w-5xl overflow-hidden rounded-lg">
            <img
              src={currentImg}
              alt={`${carName} ${colorName || ''} fullscreen`}
              referrerPolicy="no-referrer"
              className="max-h-[82vh] w-auto object-contain"
            />
          </div>
          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={nextImg}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/80 p-3 text-white hover:border-[#B5945B] cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
