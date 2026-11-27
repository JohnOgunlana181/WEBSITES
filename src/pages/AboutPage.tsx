import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Globe2, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/constants';
import { SafeImage } from '../components/BrandMark';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const TEAM = [
  {
    name: 'Oluwaseun Adebayo',
    role: 'Founder & Managing Director',
    bio: '14 years in Nigerian automotive retail, customs compliance, and international fleet sourcing across Lagos and North America.',
  },
  {
    name: 'Amina Bello-Suleiman',
    role: 'Head of Nationwide Logistics & Client Relations',
    bio: 'Leads insured 36-state & FCT vehicle dispatches, corporate fleet procurement, and VIP executive concierge.',
  },
  {
    name: 'Chukwuemeka Nwosu',
    role: 'Chief Diagnostics & Quality Lead',
    bio: 'Oversees our 200-point mechanical, ECU diagnostic, and chassis verification protocols at 24 Unity Road.',
  },
];

export const AboutPage: React.FC = () => {
  useDocumentMeta({
    title: 'About AUTOSAT LIMITED (RC 1643628) – Ikeja, Lagos',
    description:
      'Proudly African-owned automotive dealership at 24 Unity Road, Ikeja, Lagos. Discover our mission, verification standards, and leadership team.',
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Editorial Split Header matching Screenshot 2 */}
      <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
            ABOUT {BUSINESS_INFO.name} · {BUSINESS_INFO.rcNumber}
          </p>
          <h1 className="mt-3 font-editorial text-4xl font-bold leading-[1.06] text-[#111214] sm:text-5xl">
            Good cars.
            <br />
            Honest dealing.
          </h1>
        </div>
        <div className="lg:col-span-6 space-y-4">
          <p className="text-sm leading-relaxed text-[#525459] sm:text-base">
            We bring in clean, inspected luxury and Nigerian-used cars and sell them the way we&apos;d want to buy one — clear Naira prices, verified customs papers, and no surprises on handover day at 24 Unity Road, Ikeja.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/inventory"
              className="inline-flex items-center gap-2 rounded-full bg-[#111214] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2A2C30]"
            >
              Explore Showroom
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full border border-black/15 bg-white px-5 py-2.5 text-xs font-semibold text-[#111214] hover:border-[#111214]"
            >
              Visit Ikeja Showroom
            </Link>
          </div>
        </div>
      </div>

      {/* Wide Editorial Showcase Photo */}
      <div className="mt-10 aspect-[16/8] w-full overflow-hidden rounded-2xl border border-black/8 bg-[#E9E7E0]">
        <SafeImage
          src="/images/cars/mercedes-s580-2022-ext-1.jpg"
          alt="Showroom-inspected Mercedes-Benz S 580 at AUTOSAT LIMITED, 24 Unity Road, Ikeja"
          loading="eager"
        />
      </div>

      {/* Mission Pillars */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: 'Zero Hidden History',
            text: 'Every Nigerian-used and imported car carries a verifiable VIN report and verified Nigerian Customs duty clearance.',
          },
          {
            icon: Award,
            title: 'Showroom-Grade Curation',
            text: 'We decline flood-damaged, salvage-rebuilt, or clocked vehicles. Only clean-title stock enters Unity Road.',
          },
          {
            icon: Globe2,
            title: 'Pan-Nigerian Reach',
            text: 'Whether you walk into Ikeja or order remotely from Abuja, Kano, or Enugu, you receive identical white-glove care.',
          },
        ].map((p) => (
          <div key={p.title} className="rounded-2xl border border-black/8 bg-white p-7">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F4F0] text-[#9B7D48]">
              <p.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-editorial text-xl font-bold text-[#111214]">{p.title}</h2>
            <p className="mt-2 text-xs text-[#525459] leading-relaxed sm:text-sm">{p.text}</p>
          </div>
        ))}
      </div>

      {/* Leadership Team */}
      <section className="mt-14 border-t border-black/10 pt-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9B7D48]">
          LEADERSHIP
        </p>
        <h2 className="mt-1.5 font-editorial text-3xl font-bold text-[#111214]">
          The Team Behind AUTOSAT
        </h2>
        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TEAM.map((member) => (
            <div key={member.name} className="rounded-2xl border border-black/8 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111214] font-editorial text-base font-bold text-[#E5C98E]">
                {member.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <h3 className="mt-4 text-base font-bold text-[#111214]">{member.name}</h3>
              <p className="text-xs font-semibold text-[#9B7D48]">{member.role}</p>
              <p className="mt-3 text-xs text-[#525459] leading-relaxed sm:text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
