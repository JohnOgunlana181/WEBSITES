import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { buildWhatsAppUrl, formatNaira } from '../data/constants';

export const FloatingWhatsApp: React.FC = () => {
  const location = useLocation();
  const { getCarById } = useInventory();

  let message = 'Hello AUTOSAT LIMITED, I would like to speak with a sales advisor regarding a vehicle.';

  const match = location.pathname.match(/^\/cars\/([^/]+)$/);
  if (match) {
    const car = getCarById(match[1]);
    if (car) {
      message = `Hello AUTOSAT LIMITED, I am interested in the ${car.year} ${car.brand} ${car.model} listed at ${formatNaira(car.price)}. Please share availability and inspection details.`;
    }
  }

  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AUTOSAT on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#1F7A4D] px-4 py-3 text-xs font-semibold text-white shadow-lg border border-black/10 hover:bg-[#258E5A] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#111214]"
    >
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline whitespace-nowrap">WhatsApp Advisor</span>
    </a>
  );
};
