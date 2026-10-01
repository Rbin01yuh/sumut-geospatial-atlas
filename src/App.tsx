import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MetricKey, RegionData, SumutGeoJSON } from './types/geography';
import { computeHospitalityIndex } from './utils/normalization';
import Header from './components/Dashboard/Header';
import MetricSelector from './components/Dashboard/MetricSelector';
import RankingPanel from './components/Dashboard/RankingPanel';
import SumutMap from './components/Map/SumutMap';
import RegionDetail from './components/Region/RegionDetail';
import DataTable from './components/DataExplorer/DataTable';
import MethodologyPanel from './components/Dashboard/MethodologyPanel';
import SearchBox from './components/Dashboard/SearchBox';
import './index.css';

function getInitialState() {
  const params = new URLSearchParams(window.location.search);
  const metric = (params.get('metric') as MetricKey) || 'kuliner';
  const region = params.get('region') || null;
  return { metric, region };
}

export default function App() {
  const [geoData, setGeoData] = useState<SumutGeoJSON | null>(null);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [activeMetric, setActiveMetric] = useState<MetricKey>(getInitialState().metric);
  const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(getInitialState().region);
  const [showDataExplorer, setShowDataExplorer] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const [mapFlyTo, setMapFlyTo] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/sumatera-utara.geojson')
      .then(res => res.json())
      .then((data: SumutGeoJSON) => {
        setGeoData(data);
        const regionProps = data.features.map(f => f.properties);
        const enriched = computeHospitalityIndex(regionProps);
        setRegions(enriched);

        if (enriched.length !== 33) {
          console.warn(
            `Data join mismatch: expected 33 regions, got ${enriched.length}`
          );
        }
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('metric', activeMetric);
    if (selectedRegionCode) params.set('region', selectedRegionCode);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', url);
  }, [activeMetric, selectedRegionCode]);

  const selectedRegion = useMemo(
    () => regions.find(r => r.kode_wilayah_dagri === selectedRegionCode) || null,
    [regions, selectedRegionCode]
  );

  const handleSelectRegion = useCallback((code: string | null) => {
    setSelectedRegionCode(code);
    if (code) setMapFlyTo(code);
  }, []);

  const handleSearchSelect = useCallback((code: string) => {
    setSelectedRegionCode(code);
    setMapFlyTo(code);
  }, []);

  const handleMapFlyDone = useCallback(() => {
    setMapFlyTo(null);
  }, []);

  if (!geoData || regions.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-sm font-semibold tracking-wide">Memuat SUMUT Atlas…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Header
        regions={regions}
        onDataClick={() => setShowDataExplorer(true)}
        onMethodologyClick={() => setShowMethodology(true)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col w-88 xl:w-96 border-r border-slate-800/80 bg-slate-900/95 backdrop-blur-2xl overflow-y-auto shrink-0 z-10 shadow-2xl">
          <div className="p-4 lg:p-5 space-y-4 lg:space-y-5 flex-1 flex flex-col min-h-0">
            <SearchBox regions={regions} onSelect={handleSearchSelect} />
            <MetricSelector active={activeMetric} onChange={setActiveMetric} />
            <RankingPanel
              regions={regions}
              metric={activeMetric}
              selectedCode={selectedRegionCode}
              onSelect={handleSelectRegion}
            />
          </div>
        </aside>

        {/* Central Map area */}
        <main className="flex-1 relative">
          <SumutMap
            geoData={geoData}
            regions={regions}
            metric={activeMetric}
            selectedCode={selectedRegionCode}
            flyToCode={mapFlyTo}
            onSelectRegion={handleSelectRegion}
            onFlyDone={handleMapFlyDone}
          />

          {/* Mobile top search bar */}
          <div className="lg:hidden absolute top-3 left-3 right-3 z-[1000] flex gap-2">
            <div className="flex-1">
              <SearchBox regions={regions} onSelect={handleSearchSelect} />
            </div>
          </div>

          {/* Mobile bottom metric toggle */}
          <div className="lg:hidden absolute bottom-3 left-3 right-14 z-[1000] flex gap-2 overflow-x-auto p-1 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10">
            <MetricSelector active={activeMetric} onChange={setActiveMetric} compact />
          </div>
        </main>

        {/* Right Region detail panel */}
        {selectedRegion && (
          <RegionDetail
            region={selectedRegion}
            allRegions={regions}
            metric={activeMetric}
            onClose={() => setSelectedRegionCode(null)}
            onZoom={() => setMapFlyTo(selectedRegion.kode_wilayah_dagri)}
          />
        )}
      </div>

      {showDataExplorer && (
        <DataTable
          regions={regions}
          onClose={() => setShowDataExplorer(false)}
          onSelectRegion={handleSelectRegion}
        />
      )}

      {showMethodology && (
        <MethodologyPanel onClose={() => setShowMethodology(false)} />
      )}
    </div>
  );
}
