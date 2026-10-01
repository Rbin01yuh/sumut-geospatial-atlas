export type MetricKey = 'kuliner' | 'wisata' | 'hotel' | 'index';

export interface RegionProperties {
  kode_wilayah_dagri: string;
  nama_wilayah: string;
  wisata: number;
  kuliner: number;
  hotel: number;
  total: number;
}

export interface RegionData extends RegionProperties {
  hospitalityIndex: number;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: GeoJSON.Geometry;
  properties: RegionProperties;
}

export interface SumutGeoJSON {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export const METRIC_CONFIG: Record<MetricKey, {
  label: string;
  shortLabel: string;
  field: keyof RegionProperties | 'hospitalityIndex';
  colorScale: string[];
  unit: string;
  description: string;
}> = {
  kuliner: {
    label: 'Kuliner & Gastronomi — 2023',
    shortLabel: 'Kuliner',
    field: 'kuliner',
    colorScale: ['#082f49', '#0369a1', '#0284c7', '#38bdf8', '#7dd3fc', '#bae6fd'],
    unit: 'usaha kuliner',
    description: 'Jumlah usaha kuliner dan rumah makan per daerah',
  },
  wisata: {
    label: 'Objek & Daya Tarik Wisata — 2023',
    shortLabel: 'Objek Wisata',
    field: 'wisata',
    colorScale: ['#064e3b', '#047857', '#059669', '#10b981', '#34d399', '#6ee7b7'],
    unit: 'objek wisata',
    description: 'Jumlah destinasi dan objek wisata terdata',
  },
  hotel: {
    label: 'Akomodasi & Hotel — 2023',
    shortLabel: 'Hotel',
    field: 'hotel',
    colorScale: ['#3b0764', '#581c87', '#7e22ce', '#a855f7', '#c084fc', '#e9d5ff'],
    unit: 'unit hotel',
    description: 'Jumlah sarana akomodasi dan hotel beroperasi',
  },
  index: {
    label: 'Indeks Hospitalitas Komposit',
    shortLabel: 'Hospitality Index',
    field: 'hospitalityIndex',
    colorScale: ['#451a03', '#78350f', '#b45309', '#d97706', '#f59e0b', '#fde68a'],
    unit: 'skor (0–100)',
    description: 'Indeks komposit terbobot normalisasi (Wisata, Kuliner, Hotel)',
  },
};
