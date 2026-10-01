import { useMemo } from 'react';
import type { MetricKey } from '../../types/geography';
import { METRIC_CONFIG } from '../../types/geography';

interface MapLegendProps {
  metric: MetricKey;
  min: number;
  max: number;
}

export default function MapLegend({ metric, min, max }: MapLegendProps) {
  const config = METRIC_CONFIG[metric];

  const gradient = useMemo(() => {
    return config.colorScale.join(', ');
  }, [config.colorScale]);

  const mid = useMemo(() => {
    return Math.round((min + max) / 2);
  }, [min, max]);

  return (
    <div className="absolute bottom-6 right-4 z-[1000] rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-3.5 shadow-2xl min-w-[190px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {config.shortLabel}
          </h4>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
          {config.unit}
        </span>
      </div>

      <div
        className="h-2.5 rounded-full mb-2 shadow-inner border border-white/10"
        style={{ background: `linear-gradient(to right, ${gradient})` }}
      />

      <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
        <span>{metric === 'index' ? '0' : min.toLocaleString('id-ID')}</span>
        <span className="text-slate-500 font-normal">{metric === 'index' ? '50' : mid.toLocaleString('id-ID')}</span>
        <span className="text-slate-200">{metric === 'index' ? '100' : max.toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
}
