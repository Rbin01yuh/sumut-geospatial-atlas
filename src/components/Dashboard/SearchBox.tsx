import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import type { RegionData } from '../../types/geography';

interface SearchBoxProps {
  regions: RegionData[];
  onSelect: (code: string) => void;
}

export default function SearchBox({ regions, onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().replace(/kab\.|kota\s*/gi, '').trim();
    return regions
      .filter(r => r.nama_wilayah.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, regions]);

  const handleInput = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(value);
    }, 120);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative z-30">
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari kabupaten atau kota..."
          className="w-full h-11 pl-10 pr-9 rounded-xl bg-slate-950/70 border border-slate-800/90 text-sm font-medium text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-inner"
          onChange={e => {
            handleInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setOpen(false);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            title="Hapus pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl p-1.5 max-h-72 overflow-y-auto fade-in">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Hasil Pencarian ({results.length})
          </div>
          {results.map(r => (
            <button
              key={r.kode_wilayah_dagri}
              onClick={() => {
                onSelect(r.kode_wilayah_dagri);
                setOpen(false);
                setQuery('');
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:text-white hover:bg-slate-800/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-semibold truncate">{r.nama_wilayah}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50 shrink-0 ml-2">
                {r.kode_wilayah_dagri}
              </span>
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-4 text-center text-xs text-slate-400 shadow-2xl">
          Tidak ditemukan wilayah dengan nama &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
