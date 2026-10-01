import { useMemo, useState } from 'react';
import { X, MapPin, Landmark, Utensils, Hotel, ZoomIn, Share2, Sparkles, Trophy, Check } from 'lucide-react';
import type { RegionData, MetricKey } from '../../types/geography';
import { getMetricValue, getMetricRange, computeAggregates } from '../../utils/statistics';

interface RegionDetailProps {
  region: RegionData;
  allRegions: RegionData[];
  metric: MetricKey;
  onClose: () => void;
  onZoom: () => void;
}

function BarIndicator({
  label,
  value,
  max,
  gradient,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  gradient: string;
  unit: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline text-xs">
        <span className="font-semibold text-slate-200">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-white tabular-nums font-mono text-sm">
            {value.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-slate-400">{unit}</span>
        </div>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${gradient}`}
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
    </div>
  );
}

export default function RegionDetail({
  region,
  allRegions,
  metric,
  onClose,
  onZoom,
}: RegionDetailProps) {
  const [copied, setCopied] = useState(false);

  const aggregates = useMemo(() => computeAggregates(allRegions), [allRegions]);

  const maxes = useMemo(
    () => ({
      wisata: Math.max(...allRegions.map(r => r.wisata)),
      kuliner: Math.max(...allRegions.map(r => r.kuliner)),
      hotel: Math.max(...allRegions.map(r => r.hotel)),
    }),
    [allRegions]
  );

  const rank = useMemo(() => {
    const sorted = [...allRegions].sort(
      (a, b) => getMetricValue(b, metric) - getMetricValue(a, metric)
    );
    return sorted.findIndex(r => r.kode_wilayah_dagri === region.kode_wilayah_dagri) + 1;
  }, [allRegions, region, metric]);

  const { min: metricMin, max: metricMax } = useMemo(
    () => getMetricRange(allRegions, metric),
    [allRegions, metric]
  );

  const isKota = region.nama_wilayah.toLowerCase().startsWith('kota');

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?metric=${metric}&region=${region.kode_wilayah_dagri}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getIndexLabel = (val: number) => {
    if (val >= 60) return { text: 'Hospitalitas Tinggi', color: 'text-emerald-400' };
    if (val >= 35) return { text: 'Hospitalitas Menengah', color: 'text-amber-400' };
    return { text: 'Potensi Berkembang', color: 'text-sky-400' };
  };

  const indexStatus = getIndexLabel(region.hospitalityIndex);

  return (
    <>
      {/* Desktop side panel */}
      <aside className="hidden lg:flex flex-col w-96 xl:w-[26rem] border-l border-slate-800/80 bg-slate-900/95 backdrop-blur-2xl overflow-y-auto shrink-0 slide-in-right z-10 shadow-2xl">
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                  isKota
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {isKota ? 'Kota Otonom' : 'Kabupaten'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Kode: {region.kode_wilayah_dagri}
                </span>
              </div>
              <h2 className="text-xl font-black text-white leading-tight">
                {region.nama_wilayah}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Provinsi Sumatera Utara</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors shrink-0"
              title="Tutup panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-px bg-slate-800/80" />

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-2">
            {/* Wisata */}
            <div className="rounded-xl p-3 bg-slate-950/60 border border-slate-800/90 text-center flex flex-col justify-between">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-1.5">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-white tabular-nums font-mono leading-none">
                {region.wisata}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Wisata
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                {((region.wisata / (aggregates.totalWisata || 1)) * 100).toFixed(1)}% sumut
              </div>
            </div>

            {/* Kuliner */}
            <div className="rounded-xl p-3 bg-slate-950/60 border border-slate-800/90 text-center flex flex-col justify-between">
              <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-1.5">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-white tabular-nums font-mono leading-none">
                {region.kuliner}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Kuliner
              </div>
              <div className="text-[10px] text-sky-400/80 font-mono mt-0.5">
                {((region.kuliner / (aggregates.totalKuliner || 1)) * 100).toFixed(1)}% sumut
              </div>
            </div>

            {/* Hotel */}
            <div className="rounded-xl p-3 bg-slate-950/60 border border-slate-800/90 text-center flex flex-col justify-between">
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-1.5">
                <Hotel className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-white tabular-nums font-mono leading-none">
                {region.hotel}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Hotel
              </div>
              <div className="text-[10px] text-purple-400/80 font-mono mt-0.5">
                {((region.hotel / (aggregates.totalHotel || 1)) * 100).toFixed(1)}% sumut
              </div>
            </div>
          </div>

          {/* Hospitality Index Card */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 p-4 shadow-lg shadow-amber-500/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  Hospitality Index
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                Derived
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-amber-300 tabular-nums font-mono">
                  {region.hospitalityIndex}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>
              <span className={`text-xs font-bold ${indexStatus.color}`}>
                {indexStatus.text}
              </span>
            </div>

            <div className="h-2 bg-slate-950/80 rounded-full overflow-hidden p-0.5 mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                style={{ width: `${Math.max(region.hospitalityIndex, 3)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Skor normalisasi komposit dari ketiga indikator pariwisata daerah.
            </p>
          </div>

          {/* Profil Komparasi Bars */}
          <div className="rounded-2xl bg-slate-950/50 border border-slate-800/80 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Profil Komparasi Indikator
            </h3>
            <BarIndicator
              label="Objek Wisata"
              value={region.wisata}
              max={maxes.wisata}
              gradient="from-emerald-500 to-teal-400"
              unit="objek"
            />
            <BarIndicator
              label="Kuliner"
              value={region.kuliner}
              max={maxes.kuliner}
              gradient="from-sky-500 to-blue-400"
              unit="usaha"
            />
            <BarIndicator
              label="Hotel & Penginapan"
              value={region.hotel}
              max={maxes.hotel}
              gradient="from-purple-500 to-violet-400"
              unit="unit"
            />
          </div>

          {/* Rank & Stats Summary */}
          <div className="rounded-xl p-3 bg-slate-950/50 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-white">
                  Peringkat #{rank} dari {allRegions.length} Wilayah
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Rentang se-Sumut: {metricMin} – {metricMax}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={onZoom}
              className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:via-indigo-500 hover:to-sky-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            >
              <ZoomIn className="w-4 h-4" />
              Fokus ke Wilayah
            </button>
            <button
              onClick={handleShare}
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95 shrink-0"
              title="Salin tautan wilayah ini"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1500] slide-in-up">
        <div className="bg-slate-900/98 backdrop-blur-2xl border-t border-slate-800 rounded-t-3xl p-5 max-h-[75vh] overflow-y-auto shadow-2xl space-y-3.5">
          <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-2" />
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30">
                  {isKota ? 'Kota' : 'Kabupaten'}
                </span>
                <span className="text-xs text-slate-400 font-mono">{region.kode_wilayah_dagri}</span>
              </div>
              <h2 className="text-lg font-black text-white">{region.nama_wilayah}</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-center">
              <div className="text-base font-extrabold text-white tabular-nums font-mono">{region.wisata}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Wisata</div>
            </div>
            <div className="rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-center">
              <div className="text-base font-extrabold text-white tabular-nums font-mono">{region.kuliner}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Kuliner</div>
            </div>
            <div className="rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-center">
              <div className="text-base font-extrabold text-white tabular-nums font-mono">{region.hotel}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Hotel</div>
            </div>
            <div className="rounded-xl p-2.5 bg-amber-500/10 border border-amber-500/30 text-center">
              <div className="text-base font-black text-amber-300 tabular-nums font-mono">
                {region.hospitalityIndex}
              </div>
              <div className="text-[10px] font-bold text-amber-400 uppercase mt-0.5">Index</div>
            </div>
          </div>

          <button
            onClick={onZoom}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/25"
          >
            <ZoomIn className="w-4 h-4" />
            Fokus ke Wilayah
          </button>
        </div>
      </div>
    </>
  );
}
