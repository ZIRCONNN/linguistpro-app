import type { Metadata } from "next";
import { ShieldCheck, Server, Key } from "lucide-react";
import SiteHeader from "@/app/component/SiteHeader";
import SiteFooter from "@/app/component/SiteFooter";

export const metadata: Metadata = {
  title: "Keamanan Data | LinguistPro",
  description: "Arsitektur dan infrastruktur keamanan yang melindungi data Anda.",
};

export default function KeamananDataPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Komitmen Keamanan Tingkat Enterprise
          </h1>
          <p className="text-slate-500 text-lg">
            Rahasia bisnis Anda adalah prioritas kami. Kami menggunakan infrastruktur modern untuk memastikan data Anda aman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Zero-Retention Policy</h3>
            <p className="text-slate-600 text-sm">Kami menganut prinsip "Proses dan Lupakan". Teks yang Anda terjemahkan tidak pernah disimpan dalam database pusat kami. Semuanya diproses di memori dan langsung dihancurkan.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Edge Computing</h3>
            <p className="text-slate-600 text-sm">Kami memproses permintaan melalui infrastruktur <em>Serverless Edge</em>. Ini meminimalkan latensi dan mencegah titik kegagalan tunggal (SPOF) pada server terpusat.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              <Key className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Enkripsi Transit (TLS)</h3>
            <p className="text-slate-600 text-sm">Seluruh lalu lintas data antara browser Anda dan server kami dienkripsi menggunakan protokol HTTPS/TLS terbaru untuk mencegah penyadapan pihak ketiga.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}