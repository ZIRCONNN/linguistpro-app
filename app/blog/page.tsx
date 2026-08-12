import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-32 px-4 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Blog LinguistPro</h1>
      <p className="text-slate-500 mb-8">Artikel wawasan bahasa, AI, dan studi kasus B2B sedang kami siapkan.</p>
      <Link href="/" className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Utama
      </Link>
    </div>
  );
}