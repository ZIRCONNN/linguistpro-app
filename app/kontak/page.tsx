import type { Metadata } from "next";
import { Mail } from "lucide-react";
import SiteHeader from "@/app/component/SiteHeader";
import SiteFooter from "@/app/component/SiteFooter";

export const metadata: Metadata = {
  title: "Kontak | LinguistPro",
  description:
    "Hubungi tim LinguistPro untuk pertanyaan produk, harga, atau kerja sama.",
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 md:px-8 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Hubungi Kami
        </h1>

        <p className="text-slate-500 mb-10">
          Ada pertanyaan soal fitur, harga, atau kerja sama bisnis? Kirim email
          dan kami akan membalas secepatnya.
        </p>

        <a
          href="mailto:richard.yuwana@optimasolusi.com"
          className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-8 py-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Email
            </p>

            <p className="text-slate-900 font-semibold">
              richard.yuwana@optimasolusi.com
            </p>
          </div>
        </a>

        <p className="text-xs text-slate-400 mt-10">
          Belum ada formulir kontak otomatis di halaman ini — tautan di atas
          langsung membuka aplikasi email Anda. Kalau nanti mau formulir yang
          benar-benar mengirim ke server tanpa membuka aplikasi email, itu
          butuh layanan tambahan seperti Resend atau Formspree, karena proyek
          ini belum punya backend untuk mengirim email.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}