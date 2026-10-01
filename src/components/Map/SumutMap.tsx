import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MetricKey, RegionData, SumutGeoJSON } from '../../types/geography';
import { METRIC_CONFIG } from '../../types/geography';
import { getColorForValue } from '../../utils/normalization';
import { getMetricValue, getMetricRange } from '../../utils/statistics';
import MapLegend from './MapLegend';
import { RotateCcw, Maximize } from 'lucide-react';

const SUMUT_CENTER: L.LatLngTuple = [2.5, 99.0];
const SUMUT_ZOOM = 7;
const DARK_TILES = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
const DARK_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>';

interface SumutMapProps {
  geoData: SumutGeoJSON;
  regions: RegionData[];
  metric: MetricKey;
  selectedCode: string | null;
  flyToCode: string | null;
  onSelectRegion: (code: string | null) => void;
  onFlyDone: () => void;
}

function MapController({ flyToCode, geoData, onFlyDone }: {
  flyToCode: string | null;
  geoData: SumutGeoJSON;
  onFlyDone: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!flyToCode) return;
    const feature = geoData.features.find(
      f => f.properties.kode_wilayah_dagri === flyToCode
    );
    if (feature) {
      const layer = L.geoJSON(feature as any);
      const bounds = layer.getBounds();
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 11, animate: true, duration: 0.8 });
    }
    onFlyDone();
  }, [flyToCode, geoData, map, onFlyDone]);

  return null;
}

function MapControls() {
  const map = useMap();
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.setView(SUMUT_CENTER, SUMUT_ZOOM, { animate: true })}
        className="w-9 h-9 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        title="Reset tampilan peta (Sumatera Utara)"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          const el = map.getContainer();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            el.requestFullscreen();
          }
        }}
        className="w-9 h-9 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        title="Mode Layar Penuh"
      >
        <Maximize className="w-4 h-4" />
      </button>
    </div>
  );
}

function RegionLabels({ geoData }: { geoData: SumutGeoJSON }) {
  const map = useMap();
  const labelsRef = useRef<L.LayerGroup>(L.layerGroup());

  useEffect(() => {
    const group = labelsRef.current;

    const updateLabels = () => {
      group.clearLayers();
      const currentZoom = map.getZoom();

      if (currentZoom < 8) {
        group.remove();
        return;
      }

      geoData.features.forEach(feature => {
        const layer = L.geoJSON(feature as any);
        const center = layer.getBounds().getCenter();
        const shortName = feature.properties.nama_wilayah
          .replace(/^Kab\.\s*/, '')
          .replace(/^Kota\s*/, '');

        const marker = L.marker(center, {
          icon: L.divIcon({
            className: 'region-label',
            html: shortName,
            iconSize: [100, 20],
            iconAnchor: [50, 10],
          }),
          interactive: false,
        });
        group.addLayer(marker);
      });

      group.addTo(map);
    };

    updateLabels();
    map.on('zoomend', updateLabels);
    return () => {
      map.off('zoomend', updateLabels);
      group.remove();
    };
  }, [geoData, map]);

  return null;
}

export default function SumutMap({
  geoData,
  regions,
  metric,
  selectedCode,
  flyToCode,
  onSelectRegion,
  onFlyDone,
}: SumutMapProps) {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  const config = METRIC_CONFIG[metric];
  const { min, max } = useMemo(() => getMetricRange(regions, metric), [regions, metric]);

  const regionMap = useMemo(() => {
    const m = new Map<string, RegionData>();
    regions.forEach(r => m.set(r.kode_wilayah_dagri, r));
    return m;
  }, [regions]);

  const styleFeature = useCallback(
    (feature: any) => {
      const code = feature.properties.kode_wilayah_dagri;
      const region = regionMap.get(code);
      const value = region ? getMetricValue(region, metric) : 0;
      const fillColor = getColorForValue(value, min, max, config.colorScale);
      const isSelected = code === selectedCode;

      return {
        fillColor,
        fillOpacity: isSelected ? 0.88 : 0.74,
        color: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.16)',
        weight: isSelected ? 3 : 1,
        opacity: 1,
      };
    },
    [regionMap, metric, min, max, config.colorScale, selectedCode]
  );

  const onEachFeature = useCallback(
    (feature: any, layer: L.Layer) => {
      const code = feature.properties.kode_wilayah_dagri;
      const region = regionMap.get(code);
      if (!region) return;

      const value = getMetricValue(region, metric);
      const isKota = region.nama_wilayah.toLowerCase().startsWith('kota');
      const valColor = config.colorScale[config.colorScale.length - 2] || '#38bdf8';
      const tooltipContent = `
        <div class="tooltip-code">${isKota ? 'KOTA OTONOM' : 'KABUPATEN'} · ${region.kode_wilayah_dagri}</div>
        <div class="tooltip-name">${region.nama_wilayah}</div>
        <div class="tooltip-metric">${config.label}</div>
        <div class="tooltip-value" style="color: ${valColor}">
          ${value.toLocaleString('id-ID')}
          ${metric === 'index' ? '<span style="font-size:13px;opacity:0.6;color:#cbd5e1">/100</span>' : ''}
        </div>
      `;

      layer.bindTooltip(tooltipContent, {
        className: 'region-tooltip',
        sticky: true,
        direction: 'top',
        offset: [0, -12],
      });

      (layer as L.Path).on({
        mouseover: (e: L.LeafletMouseEvent) => {
          const target = e.target as L.Path;
          target.setStyle({
            fillOpacity: 0.92,
            weight: 2.5,
            color: '#38bdf8',
          });
          target.bringToFront();
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          if (geoJsonRef.current) {
            geoJsonRef.current.resetStyle(e.target);
          }
        },
        click: () => {
          onSelectRegion(code === selectedCode ? null : code);
        },
      });
    },
    [regionMap, metric, config.label, config.colorScale, selectedCode, onSelectRegion]
  );

  // Force re-render when metric or selection changes
  const geoJsonKey = useMemo(
    () => `${metric}-${selectedCode}`,
    [metric, selectedCode]
  );

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={SUMUT_CENTER}
        zoom={SUMUT_ZOOM}
        minZoom={6}
        maxZoom={14}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#0d1117' }}
        scrollWheelZoom
        doubleClickZoom
        zoomSnap={0.5}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={120}
      >
        <TileLayer url={DARK_TILES} attribution={DARK_ATTR} />
        <ZoomControl position="bottomleft" />

        <GeoJSON
          key={geoJsonKey}
          ref={(ref) => { geoJsonRef.current = ref; }}
          data={geoData as any}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />

        <MapController flyToCode={flyToCode} geoData={geoData} onFlyDone={onFlyDone} />
        <RegionLabels geoData={geoData} />
        <MapControls />
      </MapContainer>

      <MapLegend metric={metric} min={min} max={max} />

      <div className="absolute bottom-6 left-14 z-[1000] text-[9px] text-slate-600 hidden lg:block">
        Data: 2023 regional statistics · Spatial: administrative GeoJSON · Built with Leaflet
      </div>
    </div>
  );
}
