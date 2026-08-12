import type { Metadata } from "next";
import SiteHeader from "@/app/component/SiteHeader";
import SiteFooter from "@/app/component/SiteFooter";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | LinguistPro",
  description: "Syarat dan ketentuan penggunaan layanan LinguistPro.",
};

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-8">
          Syarat & Ketentuan
        </h1>
        <div className="space-y-6 text-slate-600 leading-relaxed text-base">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Penerimaan Syarat</h2>
            <p>
              Dengan mengakses dan menggunakan LinguistPro, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan ini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Penggunaan Layanan & Batasan API</h2>
            <p>
              Anda setuju untuk menggunakan layanan ini hanya untuk tujuan yang sah. Anda dilarang keras mencoba mengeksploitasi <em>API endpoint</em> kami, melakukan manipulasi <em>rate-limiting</em>, atau menyuntikkan kode berbahaya. Penyalahgunaan akan mengakibatkan pemblokiran alamat IP atau pencabutan akses secara permanen tanpa pengembalian dana.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Akurasi Terjemahan</h2>
            <p>
              Meskipun LinguistPro menggunakan AI tingkat lanjut yang memahami konteks, hasil terjemahan adalah produk mesin. Kami tidak bertanggung jawab atas kerugian bisnis, kesalahpahaman kontrak, atau masalah legal yang mungkin timbul akibat ketidakakuratan terjemahan. Anda disarankan untuk melakukan peninjauan akhir pada dokumen kritis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Pembayaran & Pengembalian Dana</h2>
            <p>
              Pembayaran untuk paket langganan (Pro/Bisnis) ditagihkan di muka. Berdasarkan sifat dari infrastruktur <em>cloud</em> dan biaya pemrosesan AI, semua pembayaran bersifat final dan kami tidak memberikan pengembalian dana untuk sisa waktu langganan yang tidak digunakan.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}