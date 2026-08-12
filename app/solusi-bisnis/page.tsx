import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function SolusiBisnisPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-semibold mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <Building2 className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Solusi B2B Perusahaan</h1>
        <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          LinguistPro dirancang untuk tim Customer Service internasional, ekspansi pemasaran lintas negara, dan komunikasi internal perusahaan multinasional. Tingkatkan efisiensi tim Anda dengan kualitas bahasa setara penutur asli.
        </p>
        <Link href="/kontak" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors">
          Jadwalkan Demo
        </Link>
      </div>
    </div>
  );
}