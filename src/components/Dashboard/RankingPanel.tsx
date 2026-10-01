import { useMemo } from 'react';
import { Trophy, ChevronRight } from 'lucide-react';
import type { RegionData, MetricKey } from '../../types/geography';
import { METRIC_CONFIG } from '../../types/geography';
import { getRankedRegions, getMetricValue } from '../../utils/statistics';

interface RankingPanelProps {
  regions: RegionData[];
  metric: MetricKey;
  selectedCode: string | null;
  onSelect: (code: string) => void;
}

export default function RankingPanel({
  regions,
  metric,
  selectedCode,
  onSelect,
}: RankingPanelProps) {
  const ranked = useMemo(() => getRankedRegions(regions, metric), [regions, metric]);
  const config = METRIC_CONFIG[metric];
  const maxValue = ranked.length > 0 ? getMetricValue(ranked[0], metric) : 1;

  const barGradient = (() => {
    switch (metric) {
      case 'kuliner': return 'from-sky-500 to-blue-600';
      case 'wisata':  return 'from-emerald-400 to-teal-600';
      case 'hotel':   return 'from-purple-400 to-violet-600';
      case 'index':   return 'from-amber-400 to-amber-600';
    }
  })();

  const valColor = (() => {
    switch (metric) {
      case 'kuliner': return 'text-sky-300';
      case 'wisata':  return 'text-emerald-300';
      case 'hotel':   return 'text-purple-300';
      case 'index':   return 'text-amber-300';
    }
  })();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between mb-2.5 px-1 shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Peringkat {config.shortLabel}
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          33 Daerah
        </span>
      </div>

      <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 max-h-[calc(100vh-360px)]">
        {ranked.map((region, i) => {
          const value = getMetricValue(region, metric);
          const isSelected = region.kode_wilayah_dagri === selectedCode;
          const barWidth = maxValue > 0 ? Math.max((value / maxValue) * 100, 3) : 0;
          const isTop3 = i < 3;

          return (
            <button
              key={region.kode_wilayah_dagri}
              onClick={() => onSelect(region.kode_wilayah_dagri)}
              className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 group border ${
                isSelected
                  ? 'bg-slate-800/90 border-sky-500/60 shadow-md shadow-sky-500/10'
                  : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Rank Number Badge */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    i === 0
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : i === 1
                      ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                      : i === 2
                      ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                      : 'text-slate-400 font-mono text-[11px]'
                  }`}
                >
                  {i + 1}
                </div>

                {/* Region Name & Bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-semibold truncate ${
                        isSelected
                          ? 'text-white'
                          : isTop3
                          ? 'text-slate-100 group-hover:text-white'
                          : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {region.nama_wilayah}
                    </span>
                    <span className={`text-sm font-bold font-mono shrink-0 ml-2 ${isSelected ? 'text-white' : valColor}`}>
                      {value.toLocaleString('id-ID')}
                      {metric === 'index' ? <span className="text-[10px] text-slate-400 font-normal">/100</span> : ''}
                    </span>
                  </div>

                  {/* Relative Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-300`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>

                <ChevronRight className={`w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0 ${isSelected ? 'text-sky-400' : ''}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
