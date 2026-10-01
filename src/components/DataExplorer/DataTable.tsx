import { useState, useMemo, useCallback } from 'react';
import { X, Search, ArrowUpDown, ArrowDown, ArrowUp, Download, MapPin, Database } from 'lucide-react';
import type { RegionData } from '../../types/geography';

type SortKey = 'nama_wilayah' | 'wisata' | 'kuliner' | 'hotel' | 'total' | 'hospitalityIndex';
type SortDir = 'asc' | 'desc';

interface DataTableProps {
  regions: RegionData[];
  onClose: () => void;
  onSelectRegion: (code: string) => void;
}

export default function DataTable({ regions, onClose, onSelectRegion }: DataTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('nama_wilayah');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'nama_wilayah' ? 'asc' : 'desc');
    }
  }, [sortKey]);

  const filtered = useMemo(() => {
    let data = [...regions];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r => r.nama_wilayah.toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return data;
  }, [regions, search, sortKey, sortDir]);

  const handleExportCSV = useCallback(() => {
    const header = 'Wilayah,Kode,Objek Wisata,Kuliner,Hotel,Total,Hospitality Index\n';
    const rows = regions.map(r =>
      `"${r.nama_wilayah}",${r.kode_wilayah_dagri},${r.wisata},${r.kuliner},${r.hotel},${r.total},${r.hospitalityIndex}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sumut-atlas-pariwisata-2023.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [regions]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="w-3.5 h-3.5 opacity-30" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
      : <ArrowDown className="w-3.5 h-3.5 text-sky-400" />;
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 lg:p-6 fade-in">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Data Explorer — 33 Kabupaten & Kota</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tabel komparasi statistik pariwisata Sumatera Utara 2023</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              Unduh CSV
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Info */}
        <div className="px-6 py-3 shrink-0 border-b border-slate-800/80 bg-slate-950/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Saring nama daerah..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
            />
          </div>
          <p className="text-xs text-slate-400 font-medium self-end sm:self-center">
            Menampilkan <span className="font-bold text-white">{filtered.length}</span> dari {regions.length} daerah · <span className="text-sky-400">Klik baris untuk fokus di peta</span>
          </p>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-bold">
                  <button onClick={() => handleSort('nama_wilayah')} className="flex items-center gap-1.5 hover:text-white transition-colors">
                    Wilayah <SortIcon column="nama_wilayah" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  <button onClick={() => handleSort('wisata')} className="flex items-center gap-1.5 ml-auto hover:text-emerald-300 transition-colors">
                    Wisata <SortIcon column="wisata" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-sky-400 font-bold">
                  <button onClick={() => handleSort('kuliner')} className="flex items-center gap-1.5 ml-auto hover:text-sky-300 transition-colors">
                    Kuliner <SortIcon column="kuliner" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-purple-400 font-bold">
                  <button onClick={() => handleSort('hotel')} className="flex items-center gap-1.5 ml-auto hover:text-purple-300 transition-colors">
                    Hotel <SortIcon column="hotel" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-slate-300 font-bold">
                  <button onClick={() => handleSort('total')} className="flex items-center gap-1.5 ml-auto hover:text-white transition-colors">
                    Total <SortIcon column="total" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-amber-400 font-bold">
                  <button onClick={() => handleSort('hospitalityIndex')} className="flex items-center gap-1.5 ml-auto hover:text-amber-300 transition-colors">
                    Index (0–100) <SortIcon column="hospitalityIndex" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(region => (
                <tr
                  key={region.kode_wilayah_dagri}
                  onClick={() => { onSelectRegion(region.kode_wilayah_dagri); onClose(); }}
                  className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 text-slate-200 group-hover:text-white font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                      <span>{region.nama_wilayah}</span>
                      <span className="text-[11px] text-slate-400 font-mono ml-1">({region.kode_wilayah_dagri})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-mono text-emerald-300 font-semibold">{region.wisata}</td>
                  <td className="py-3 px-4 text-right tabular-nums font-mono text-sky-300 font-semibold">{region.kuliner}</td>
                  <td className="py-3 px-4 text-right tabular-nums font-mono text-purple-300 font-semibold">{region.hotel}</td>
                  <td className="py-3 px-4 text-right tabular-nums font-mono text-slate-100 font-bold">{region.total}</td>
                  <td className="py-3 px-4 text-right tabular-nums font-mono text-amber-300 font-extrabold">{region.hospitalityIndex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
