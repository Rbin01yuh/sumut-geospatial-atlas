import { Utensils, Landmark, Hotel, Sparkles } from 'lucide-react';
import type { MetricKey } from '../../types/geography';

interface MetricOption {
  key: MetricKey;
  label: string;
  badge: string;
  icon: typeof Utensils;
  accent: 'sky' | 'emerald' | 'purple' | 'amber';
  glowBorder: string;
  activeBg: string;
  iconBg: string;
  iconColor: string;
}

const metrics: MetricOption[] = [
  {
    key: 'kuliner',
    label: 'Kuliner',
    badge: '1.293 Unit',
    icon: Utensils,
    accent: 'sky',
    glowBorder: 'border-sky-500/60 shadow-lg shadow-sky-500/15',
    activeBg: 'bg-sky-500/10',
    iconBg: 'bg-sky-500/20 text-sky-400',
    iconColor: 'text-sky-400',
  },
  {
    key: 'wisata',
    label: 'Objek Wisata',
    badge: '383 Lokasi',
    icon: Landmark,
    accent: 'emerald',
    glowBorder: 'border-emerald-500/60 shadow-lg shadow-emerald-500/15',
    activeBg: 'bg-emerald-500/10',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    iconColor: 'text-emerald-400',
  },
  {
    key: 'hotel',
    label: 'Hotel',
    badge: '326 Sarana',
    icon: Hotel,
    accent: 'purple',
    glowBorder: 'border-purple-500/60 shadow-lg shadow-purple-500/15',
    activeBg: 'bg-purple-500/10',
    iconBg: 'bg-purple-500/20 text-purple-400',
    iconColor: 'text-purple-400',
  },
  {
    key: 'index',
    label: 'Hospitality Index',
    badge: 'Skor 0–100',
    icon: Sparkles,
    accent: 'amber',
    glowBorder: 'border-amber-500/60 shadow-lg shadow-amber-500/15',
    activeBg: 'bg-amber-500/10',
    iconBg: 'bg-amber-500/20 text-amber-400',
    iconColor: 'text-amber-400',
  },
];

interface MetricSelectorProps {
  active: MetricKey;
  onChange: (m: MetricKey) => void;
  compact?: boolean;
}

export default function MetricSelector({ active, onChange, compact }: MetricSelectorProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {metrics.map(m => {
          const isActive = active === m.key;
          return (
            <button
              key={m.key}
              onClick={() => onChange(m.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? `${m.glowBorder} ${m.activeBg} border text-white`
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <m.icon className={`w-3.5 h-3.5 ${isActive ? m.iconColor : 'text-slate-500'}`} />
              {m.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Lapisan Peta (Map Layer)
        </h3>
        <span className="text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
          Choropleth
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {metrics.map(m => {
          const isActive = active === m.key;
          return (
            <button
              key={m.key}
              onClick={() => onChange(m.key)}
              className={`relative p-3 rounded-xl text-left transition-all duration-200 group flex flex-col justify-between ${
                isActive
                  ? `${m.glowBorder} ${m.activeBg} border bg-slate-900/90`
                  : 'bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isActive ? m.iconBg : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <m.icon className="w-4 h-4" />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ color: m.accent === 'sky' ? '#38bdf8' : m.accent === 'emerald' ? '#10b981' : m.accent === 'purple' ? '#c084fc' : '#f59e0b' }} />
                )}
              </div>

              <div>
                <div className={`text-xs font-extrabold truncate ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                  {m.label}
                </div>
                <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                  {m.badge}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
