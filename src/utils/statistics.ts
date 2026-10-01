import type { RegionData, MetricKey } from '../types/geography';
import { METRIC_CONFIG } from '../types/geography';

export function computeAggregates(regions: RegionData[]) {
  return {
    totalRegions: regions.length,
    totalWisata: regions.reduce((s, r) => s + r.wisata, 0),
    totalKuliner: regions.reduce((s, r) => s + r.kuliner, 0),
    totalHotel: regions.reduce((s, r) => s + r.hotel, 0),
  };
}

export function getMetricValue(region: RegionData, metric: MetricKey): number {
  const field = METRIC_CONFIG[metric].field;
  return region[field] as number;
}

export function getRankedRegions(regions: RegionData[], metric: MetricKey): RegionData[] {
  return [...regions].sort((a, b) => getMetricValue(b, metric) - getMetricValue(a, metric));
}

export function getMetricRange(regions: RegionData[], metric: MetricKey): { min: number; max: number } {
  const values = regions.map(r => getMetricValue(r, metric));
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}
