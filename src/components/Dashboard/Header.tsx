import { useMemo } from 'react';
import { Map, Database, Info, MapPin, Landmark, Utensils, Hotel, Sparkles } from 'lucide-react';
import type { RegionData } from '../../types/geography';
import { computeAggregates } from '../../utils/statistics';

interface HeaderProps {
  regions: RegionData[];
  onDataClick: () => void;
  onMethodologyClick: () => void;
}

export default function Header({ regions, onDataClick, onMethodologyClick }: HeaderProps) {
  const stats = useMemo(() => computeAggregates(regions), [regions]);

  return (
    <header className="h-16 px-4 lg:px-6 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />
          <div className="relative w-9 h-9 rounded-xl bg-slate-900 border border-white/15 flex items-center justify-center shadow-md">
            <Map className="w-5 h-5 text-sky-400" />
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base lg:text-lg font-black tracking-tight text-white leading-none font-sans">
              SUMUT ATLAS
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
              <Sparkles className="w-2.5 h-2.5" />
              2023
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium truncate mt-1">
            Geospatial Culinary, Tourism & Hospitality Intelligence
          </p>
        </div>
      </div>

      {/* Center Provincial Quick KPIs (Desktop) */}
      <div className="hidden xl:flex items-center gap-2.5 bg-slate-950/60 border border-slate-800/90 rounded-2xl px-3 py-1.5 shadow-inner">
        {/* Wilayah */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-white/[0.04] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-white font-mono">{stats.totalRegions}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wilayah</div>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-800" />

        {/* Wisata */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-white/[0.04] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-white font-mono">{stats.totalWisata.toLocaleString('id-ID')}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wisata</div>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-800" />

        {/* Kuliner */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-white/[0.04] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Utensils className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-white font-mono">{stats.totalKuliner.toLocaleString('id-ID')}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kuliner</div>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-800" />

        {/* Hotel */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-white/[0.04] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Hotel className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-white font-mono">{stats.totalHotel.toLocaleString('id-ID')}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotel</div>
          </div>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onMethodologyClick}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-slate-600 transition-all shadow-sm active:scale-95"
          title="Buka Metodologi & Sumber Data"
        >
          <Info className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">Metodologi</span>
        </button>

        <button
          onClick={onDataClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:via-indigo-500 hover:to-sky-500 border border-sky-400/30 transition-all shadow-md shadow-blue-500/20 active:scale-95"
          title="Buka Tabel Data Lengkap & Unduh CSV"
        >
          <Database className="w-4 h-4" />
          <span className="hidden sm:inline">Data Explorer</span>
        </button>
      </div>
    </header>
  );
}
