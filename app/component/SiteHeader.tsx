import Link from "next/link";
import { Globe, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/harga", label: "Harga" },
  { href: "/api-docs", label: "API & Docs" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

export default function SiteHeader() {
  return (
    <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <Link href="/" className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md shadow-indigo-200">
          <Globe className="w-5 h-5 text-white absolute" />
          <Sparkles className="w-3 h-3 text-indigo-200 absolute top-1 right-1" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 leading-none tracking-tight">
          Linguist<span className="text-indigo-600">Pro</span>
        </h1>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-indigo-600 transition-colors">
            {link.label}
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-colors"
      >
        Buka Aplikasi
      </Link>
    </nav>
  );
}