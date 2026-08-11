import type { Metadata } from "next";
import SiteHeader from "@/app/component/SiteHeader";
import SiteFooter from "@/app/component/SiteFooter";

export const metadata: Metadata = {
  title: "Tentang Kami | LinguistPro",
  description: "Kenapa LinguistPro dibangun, dan apa yang kami coba selesaikan.",
};

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-8">
          Tentang LinguistPro
        </h1>
        <div className="space-y-5 text-slate-600 leading-relaxed text-base md:text-lg">
          <p>
            LinguistPro dibangun dari satu masalah sederhana: penerjemah mesin biasa sering
            kehilangan nuansa — apakah sebuah kalimat itu formal atau santai, sopan atau akrab.
            Kami membangun platform ini supaya terjemahan tidak hanya benar secara kata, tapi
            juga tepat secara konteks dan gaya bahasa.
          </p>
          <p>
            Dengan memanfaatkan model bahasa besar (LLM), LinguistPro mendeteksi register bahasa
            asli, memeriksa tata bahasa, dan menerjemahkan sambil menjaga nada yang dimaksud —
            baik untuk komunikasi bisnis formal maupun percakapan sehari-hari.
          </p>
          <p>
            Proyek ini dikembangkan dan dikelola oleh Richard Yuwana. LinguistPro masih dalam
            tahap awal pengembangan, dan fiturnya terus bertambah berdasarkan kebutuhan nyata
            saat digunakan.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}