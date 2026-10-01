import { X, BookOpen, AlertTriangle, ShieldCheck, Layers } from 'lucide-react';

interface MethodologyPanelProps {
  onClose: () => void;
}

export default function MethodologyPanel({ onClose }: MethodologyPanelProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 lg:p-6 fade-in">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Metodologi & Sumber Data</h2>
              <p className="text-xs text-slate-400 mt-0.5">Transparansi sumber data dan perumusan analitik spasial</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <section className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3>Sumber Data Resmi</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 border border-slate-800 p-3.5 rounded-xl">
            Data berasal dari publikasi resmi: <strong className="text-white">Jumlah Objek Wisata, Kuliner, dan Hotel Menurut Kabupaten/Kota di Provinsi Sumatera Utara, 2023</strong> (Open Data Pemerintah Provinsi Sumatera Utara).
          </p>
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3>Cakupan Wilayah & Geometri</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Mencakup tepat <strong className="text-white">33 Kabupaten dan Kota</strong> se-Provinsi Sumatera Utara. Batas poligon spasial disinkronisasi menggunakan kode wilayah resmi Kemendagri / BPS dengan batas administrasi ADM2.
          </p>
        </section>

        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3>Formulasi Hospitality Index (Derived)</h3>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              Hospitality Index merupakan skor analitik komposit turunan untuk mengukur kepadatan ekosistem pariwisata terpadu:
            </p>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 font-mono text-xs text-amber-300/90 leading-relaxed overflow-x-auto">
              <div>index = ((norm_wisata + norm_kuliner + norm_hotel) / 3) × 100</div>
              <div className="text-[11px] text-slate-500 mt-2 font-sans">
                di mana: <span className="font-mono text-slate-400">norm(x) = (x - min) / (max - min)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Setiap indikator dinormalisasi secara independen ke rentang 0 hingga 1 sebelum dirata-ratakan, sehingga ketiga pilar pariwisata memiliki bobot yang seimbang tanpa didominasi oleh satu indikator saja.
            </p>
          </div>
        </section>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>SUMUT ATLAS © 2023 · Visualisasi Geospatial Mutakhir</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
