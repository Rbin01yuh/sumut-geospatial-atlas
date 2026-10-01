import type { RegionData, RegionProperties } from '../types/geography';

export function minMaxNormalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  if (range === 0) return values.map(() => 0);
  return values.map(v => (v - min) / range);
}

export function computeHospitalityIndex(regions: RegionProperties[]): RegionData[] {
  const wisataValues = regions.map(r => r.wisata);
  const kulinerValues = regions.map(r => r.kuliner);
  const hotelValues = regions.map(r => r.hotel);

  const normWisata = minMaxNormalize(wisataValues);
  const normKuliner = minMaxNormalize(kulinerValues);
  const normHotel = minMaxNormalize(hotelValues);

  return regions.map((r, i) => ({
    ...r,
    hospitalityIndex: Math.round(
      ((normWisata[i] + normKuliner[i] + normHotel[i]) / 3) * 100
    ),
  }));
}

export function getColorForValue(
  value: number,
  min: number,
  max: number,
  colorScale: string[]
): string {
  if (max === min) return colorScale[Math.floor(colorScale.length / 2)];
  const ratio = (value - min) / (max - min);
  const index = Math.min(
    Math.floor(ratio * (colorScale.length - 1)),
    colorScale.length - 1
  );
  return colorScale[index];
}
