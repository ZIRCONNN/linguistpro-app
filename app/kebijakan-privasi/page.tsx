import type { Metadata } from "next";
import SiteHeader from "@/app/component/SiteHeader";
import SiteFooter from "@/app/component/SiteFooter";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | LinguistPro",
  description: "Bagaimana kami memproses, melindungi, dan menangani data Anda.",
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-8">
          Kebijakan Privasi
        </h1>
        <div className="space-y-6 text-slate-600 leading-relaxed text-base">
          <p className="text-sm text-slate-400">Pembaruan Terakhir: 11 Agustus 2026</p>
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Pengumpulan Data</h2>
            <p>
              Kami mengumpulkan informasi minimal yang diperlukan untuk menyediakan layanan kepada Anda. Ini termasuk alamat email (jika Anda mendaftar) dan data telemetri dasar untuk memastikan stabilitas server. 
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Pemrosesan Teks & AI</h2>
            <p>
              LinguistPro menggunakan API model bahasa besar (LLM) pihak ketiga (Google Gemini). Teks yang Anda masukkan akan dikirimkan ke server kami dan diteruskan ke penyedia AI untuk diproses secara instan.
              <strong> Kami menerapkan kebijakan Zero-Retention pada memori server kami: </strong> 
              teks asli dan terjemahan Anda tidak disimpan di database kami setelah sesi terjemahan selesai.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Penyimpanan Lokal (Local Storage)</h2>
            <p>
              Fitur "Histori Tersimpan" (ikon bintang) dan preferensi antarmuka disimpan secara lokal di dalam peramban (browser) Anda menggunakan <em>Local Storage</em>. Data ini sepenuhnya berada di bawah kendali Anda dan dapat dihapus kapan saja melalui pengaturan peramban.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan terkait privasi data Anda, silakan hubungi kami di <strong>richard.yuwana@optimasolusi.com</strong>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}