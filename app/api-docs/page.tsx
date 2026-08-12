import type { Metadata } from "next";
import SiteHeader from "@/app/component/SiteHeader";
import SiteFooter from "@/app/component/SiteFooter";

export const metadata: Metadata = {
  title: "API & Dokumentasi | LinguistPro",
  description: "Dokumentasi REST API untuk integrasi LinguistPro ke dalam aplikasi Anda.",
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Dokumentasi API Terjemahan
        </h1>
        <p className="text-slate-500 text-lg mb-10">
          Integrasikan kekuatan AI kontekstual LinguistPro ke dalam aplikasi, situs web, atau alur kerja internal perusahaan Anda dengan REST API kami.
        </p>

        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center gap-4">
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">Post</span>
              <code className="text-indigo-300 font-mono text-sm">/api/translate</code>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-900 mb-2">Headers</h3>
              <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 overflow-x-auto mb-6">
                <code>
Authorization: Bearer YOUR_API_KEY{"\n"}
Content-Type: application/json
                </code>
              </pre>

              <h3 className="font-bold text-slate-900 mb-2">Request Body (JSON)</h3>
              <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 overflow-x-auto mb-6">
                <code>
{`{
  "text": "Hello, how are you?",
  "targetLanguage": "Indonesian",
  "targetRegister": "Formal"
}`}
                </code>
              </pre>

              <h3 className="font-bold text-slate-900 mb-2">Response</h3>
              <pre className="bg-slate-900 p-4 rounded-xl text-sm text-emerald-400 overflow-x-auto">
                <code>
{`{
  "detected_language": "English",
  "grammar_check": {
    "has_errors": false,
    "corrected_text": "Hello, how are you?",
    "feedback": "Perfect grammar."
  },
  "translation": {
    "translated_text": "Halo, apa kabar Anda?",
    "romanization": null,
    "iso_language_code": "id-ID",
    "explanation": "Diterjemahkan secara formal."
  }
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
        
        <p className="mt-10 text-sm text-slate-500 italic">
          *Catatan: API Key pihak ketiga (Enterprise) saat ini dalam tahap beta. Silakan hubungi dukungan teknis melalui email untuk meminta akses.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}