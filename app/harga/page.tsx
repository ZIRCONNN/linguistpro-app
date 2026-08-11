import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import SiteHeader from "@/app/component/SiteHeader";
import SiteFooter from "@/app/component/SiteFooter";

export const metadata: Metadata = {
  title: "Harga | LinguistPro",
  description: "Paket harga LinguistPro — mulai gratis, upgrade kapan saja sesuai kebutuhan.",
};

const plans = [
  {
    name: "Starter",
    price: "Gratis",
    period: "",
    description: "Untuk mencoba dan penggunaan personal ringan.",
    features: [
      "5.000 karakter terjemahan / hari",
      "AI Smart Replies terbatas",
      "Riwayat tersimpan di browser",
      "Dukungan komunitas",
    ],
    cta: "Mulai Gratis",
    href: "/",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "Rp 29.000",
    period: "/ bulan",
    description: "Untuk pekerja lepas dan profesional individu.",
    features: [
      "Terjemahan tanpa batas karakter",
      "AI Smart Replies tanpa batas",
      "Kamus & sinonim interaktif",
      "Dukungan lewat email",
    ],
    cta: "Pilih Pro",
    href: "/",
    highlighted: true,
  },
  {
    name: "Bisnis",
    price: "Rp 79.000",
    period: "/ bulan",
    description: "Untuk tim kecil dan kebutuhan komersial.",
    features: [
      "Semua fitur paket Pro",
      "Dukungan teknis prioritas",
      "Akses lebih awal ke fitur baru",
      "Opsi kustomisasi API key tim",
    ],
    cta: "Hubungi Kami",
    href: "/kontak",
    highlighted: false,
  },
];

export default function HargaPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Harga yang Transparan untuk Setiap Kebutuhan
          </h1>
          <p className="text-slate-500 text-lg">
            Mulai gratis, upgrade kapan saja saat kebutuhan terjemahan Anda bertambah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border flex flex-col ${
                plan.highlighted
                  ? "bg-slate-900 border-slate-900 shadow-xl shadow-indigo-200/50"
                  : "bg-white border-slate-200"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Paling Populer
                </span>
              )}
              <h2 className={`text-lg font-bold mb-1 ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                {plan.name}
              </h2>
              <p className={`text-sm mb-6 ${plan.highlighted ? "text-slate-400" : "text-slate-500"}`}>
                {plan.description}
              </p>
              <div className="mb-6">
                <span className={`text-3xl font-extrabold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                  {plan.price}
                </span>
                <span className={plan.highlighted ? "text-slate-400" : "text-slate-500"}> {plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-indigo-400" : "text-indigo-600"}`} />
                    <span className={plan.highlighted ? "text-slate-300" : "text-slate-600"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`text-center py-3 rounded-xl font-bold text-sm transition-colors ${
                  plan.highlighted
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-10">
          Harga di atas masih estimasi berdasarkan diskusi kita — pastikan nominalnya sudah final sebelum menerima pembayaran sungguhan.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}