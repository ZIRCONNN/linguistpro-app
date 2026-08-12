import Link from "next/link";
import { Globe, Mail, MessageCircle } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Linguist<span className="text-indigo-500">Pro</span>
              </h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Membangun batas komunikasi tanpa hambatan untuk perusahaan global modern
              menggunakan kekuatan AI kontekstual.
            </p>
            <div className="flex gap-4">
              <a href="mailto:richard.yuwana@optimasolusi.com" className="hover:text-white transition-colors" title="Email Kami">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" title="Komunitas">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Produk</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/api-docs" className="hover:text-indigo-400 transition-colors">Translator API</Link></li>
              <li><span className="text-slate-600">Smart Replies (segera)</span></li>
              <li><span className="text-slate-600">Enterprise Server (segera)</span></li>
              <li><Link href="/harga" className="hover:text-indigo-400 transition-colors">Harga</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/tentang-kami" className="hover:text-indigo-400 transition-colors">Tentang Kami</Link></li>
              <li><span className="text-slate-600">Blog (segera)</span></li>
              <li><span className="text-slate-600">Karir (segera)</span></li>
              <li><Link href="/kontak" className="hover:text-indigo-400 transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>
         <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/kebijakan-privasi" className="hover:text-indigo-400 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/syarat-ketentuan" className="hover:text-indigo-400 transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/keamanan-data" className="hover:text-indigo-400 transition-colors">Keamanan Data</Link></li>
            </ul>
          </div>
                  </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} LinguistPro. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}