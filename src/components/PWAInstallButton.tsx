import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={`inline-flex items-center gap-2 rounded-full border border-[#B5945B]/50 bg-[#B5945B]/15 px-4 py-2 text-xs font-semibold text-[#111214] hover:bg-[#B5945B] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${className}`}
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        Install AUTOSAT App
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-[#111214] hover:border-[#B5945B] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-[#B5945B]" aria-hidden="true" />
          Install on iPhone
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Install AUTOSAT App on iOS">
            <div className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-6 text-left text-[#111214]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Install AUTOSAT App</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 text-[#6B6D72] hover:text-[#111214]"
                  aria-label="Close install instructions"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-[#525459] leading-relaxed">
                1. Tap the <strong className="text-[#111214]">Share</strong> button in your Safari toolbar.<br />
                2. Scroll down and select <strong className="text-[#111214]">Add to Home Screen</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-full bg-[#111214] py-2.5 text-xs font-semibold text-white hover:bg-[#2A2C30] transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
