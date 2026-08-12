import Link from "next/link";
import { Sparkles, MessageSquarePlus, Server, ArrowLeft } from "lucide-react";

export default function ProdukPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-semibold mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Aplikasi
        </Link>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Ekosistem Produk LinguistPro</h1>
        <p className="text-slate-500 mb-12 text-lg">Solusi bertenaga AI untuk berbagai skala kebutuhan komunikasi Anda.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <MessageSquarePlus className="w-10 h-10 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Smart Replies</h2>
            <p className="text-slate-600 mb-6">Asisten balasan otomatis yang memahami konteks email asing Anda dan menghasilkan 3 opsi balasan profesional secara instan.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <Server className="w-10 h-10 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Enterprise Server</h2>
            <p className="text-slate-600 mb-6">Instalasi server privat (on-premise) untuk perusahaan yang membutuhkan privasi tingkat tinggi tanpa data yang mengalir ke server publik.</p>
          </div>
        </div>
      </div>
    </div>
  );
}