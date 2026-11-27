import React, { useState } from 'react';
import { Clock, Instagram, Facebook, MapPin, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO, buildWhatsAppUrl } from '../data/constants';
import { IkejaMap } from '../components/IkejaMap';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Walk-In Showroom Inspection');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  useDocumentMeta({
    title: 'Contact & Visit Us – 24 Unity Road, Ikeja, Lagos | AUTOSAT LIMITED',
    description:
      'Visit AUTOSAT LIMITED at 24 Unity Road, Ikeja, Lagos (near Lateef Jakande Road). Call +234 913 867 8236 or +234 818 353 3837.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl border-b border-black/10 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
          IKEJA SHOWROOM &amp; CONCIERGE
        </p>
        <h1 className="mt-2 font-editorial text-4xl font-bold text-[#111214] sm:text-5xl">
          Visit or Speak With Us
        </h1>
        <p className="mt-3 text-sm text-[#525459]">
          Walk in seven days a week for physical vehicle inspections, diagnostics verification, rental bookings, or nationwide delivery consultations.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Direct Info + Map */}
        <div className="lg:col-span-7 space-y-6">
          <IkejaMap />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/8 bg-white p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111214]">
                <MapPin className="h-4 w-4 text-[#9B7D48]" aria-hidden="true" />
                Showroom Address
              </div>
              <p className="text-sm font-medium text-[#111214]">{BUSINESS_INFO.addressPrimary}</p>
              <p className="text-xs text-[#6B6D72]">{BUSINESS_INFO.addressLandmark}</p>
            </div>

            <div className="rounded-2xl border border-black/8 bg-white p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111214]">
                <Clock className="h-4 w-4 text-[#9B7D48]" aria-hidden="true" />
                Opening Hours
              </div>
              <div className="space-y-1.5 text-xs text-[#525459]">
                {BUSINESS_INFO.hours.map((h) => (
                  <div key={h.days} className="flex justify-between">
                    <span className="text-[#6B6D72]">{h.days}</span>
                    <span className="font-mono font-medium text-[#111214] tabular-nums">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/8 bg-white p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9B7D48]">
                CALL OR WHATSAPP DIRECT
              </p>
              <div className="flex flex-wrap gap-4 font-mono text-sm font-semibold tabular-nums text-[#111214]">
                <a href={`tel:${BUSINESS_INFO.phonePrimaryRaw}`} className="hover:text-[#9B7D48] flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#9B7D48]" aria-hidden="true" />
                  {BUSINESS_INFO.phonePrimary}
                </a>
                <a href={`tel:${BUSINESS_INFO.phoneSecondaryRaw}`} className="hover:text-[#9B7D48] flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#9B7D48]" aria-hidden="true" />
                  {BUSINESS_INFO.phoneSecondary}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#525459] hover:text-[#111214]"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                {BUSINESS_INFO.instagram}
              </a>
              <a
                href={BUSINESS_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#525459] hover:text-[#111214]"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
                {BUSINESS_INFO.facebook}
              </a>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
            <h2 className="font-editorial text-2xl font-bold text-[#111214]">
              Send an Enquiry
            </h2>
            <p className="mt-1 text-xs text-[#6B6D72]">
              Our Lagos sales desk responds within 15 minutes during business hours.
            </p>

            {sent ? (
              <div className="mt-6 space-y-4 rounded-xl border border-black/8 bg-[#F9F8F6] p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Enquiry Ready
                </div>
                <p className="text-xs text-[#525459] leading-relaxed">
                  Thank you, {name}. Click below to forward your message directly to our showroom WhatsApp desk for priority response.
                </p>
                <a
                  href={buildWhatsAppUrl(
                    `Hello AUTOSAT LIMITED (${subject}), my name is ${name} (${phone}). ${message}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F7A4D] py-3 text-xs font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Send via WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Phone / WhatsApp</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 80..."
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Enquiry Type</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  >
                    <option>Walk-In Showroom Inspection</option>
                    <option>Vehicle Purchase &amp; Negotiation</option>
                    <option>Executive Car Rental</option>
                    <option>Nationwide 36-State Delivery</option>
                    <option>Custom Import / Sourcing Order</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#525459] mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us the car model, budget, or preferred visit time..."
                    className="w-full rounded-lg border border-black/15 bg-[#F9F8F6] px-3 py-2.5 text-sm text-[#111214]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#111214] py-3 text-xs font-semibold text-white hover:bg-[#2A2C30] cursor-pointer"
                >
                  Submit Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
