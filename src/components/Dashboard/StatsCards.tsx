import { useMemo } from 'react';
import { MapPin, Utensils, Landmark, Hotel } from 'lucide-react';
import type { RegionData } from '../../types/geography';
import { computeAggregates } from '../../utils/statistics';

interface StatsCardsProps {
  regions: RegionData[];
}

export default function StatsCards({ regions }: StatsCardsProps) {
  const stats = useMemo(() => computeAggregates(regions), [regions]);

  const cards = [
    { label: 'Kabupaten / Kota', value: stats.totalRegions, icon: MapPin, color: 'text-sky-400' },
    { label: 'Objek Wisata', value: stats.totalWisata, icon: Landmark, color: 'text-emerald-400' },
    { label: 'Kuliner', value: stats.totalKuliner, icon: Utensils, color: 'text-blue-400' },
    { label: 'Hotel', value: stats.totalHotel, icon: Hotel, color: 'text-purple-400' },
  ];

  return (
    <div className="flex items-stretch border-b border-white/8 shrink-0 overflow-x-auto">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`flex-1 min-w-0 flex items-center gap-3 px-4 lg:px-5 py-2.5 ${
            i > 0 ? 'border-l border-white/6' : ''
          }`}
        >
          <card.icon className={`w-4 h-4 ${card.color} shrink-0 opacity-70`} />
          <div className="min-w-0">
            <div className="text-lg font-extrabold text-white tabular-nums leading-none">
              {card.value.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5 truncate">
              {card.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
