"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, Volume2, Globe, History, Copy, Check, X, LockKeyhole, LogOut, Mic, MicOff, FileText, Star, BookOpen, Menu, ArrowLeftRight, Download, MessageSquarePlus, Settings2, Mail, MessageCircle } from "lucide-react";
type UILang = "id" | "en" | "zh" | "es" | "ja" | "fr";

const uiDict: Record<UILang, any> = {
  id: {
    appSubtitle: "AI Translation & Grammar",
    placeholder: "Ketik, gunakan suara, atau seret file (.txt) ke sini...",
    targetLang: "Bahasa Tujuan (Cari/Ketik)",
    tone: "Gaya Bahasa",
    btnTranslate: "Terjemahkan",
    btnProcessing: "Memproses...",
    lblTranslation: "Hasil Terjemahan",
    lblGrammar: "Analisis Tata Bahasa",
    errEmpty: "Masukkan teks terlebih dahulu.",
    fromCache: "Memori Cache",
    btnReply: "Buat Balasan AI",
    lblReplies: "Saran Balasan Cerdas"
  },
  en: {
    appSubtitle: "AI Translation & Grammar",
    placeholder: "Type, speak, or drag a file (.txt) here...",
    targetLang: "Target Language (Type to search)",
    tone: "Tone & Register",
    btnTranslate: "Translate",
    btnProcessing: "Processing...",
    lblTranslation: "Translation Result",
    lblGrammar: "Grammar Analysis",
    errEmpty: "Please enter text first.",
    fromCache: "From Cache",
    btnReply: "Smart Replies",
    lblReplies: "Suggested Replies"
  },
  zh: { appSubtitle: "AI 翻译与语法", placeholder: "输入、朗读或拖放文件 (.txt)...", targetLang: "目标语言", tone: "语气", btnTranslate: "翻译", btnProcessing: "处理中...", lblTranslation: "翻译结果", lblGrammar: "语法分析", errEmpty: "请输入文本", fromCache: "缓存", btnReply: "智能回复", lblReplies: "推荐回复" },
  es: { appSubtitle: "Traducción IA y Gramática", placeholder: "Escribe, habla o arrastra un archivo (.txt)...", targetLang: "Idioma de Destino", tone: "Tono", btnTranslate: "Traducir", btnProcessing: "Procesando...", lblTranslation: "Resultado", lblGrammar: "Análisis Gramatical", errEmpty: "Introduce texto", fromCache: "Caché", btnReply: "Respuestas IA", lblReplies: "Respuestas sugeridas" },
  ja: { appSubtitle: "AI翻訳と文法", placeholder: "入力、音声、またはファイル(.txt)をドロップ...", targetLang: "ターゲット言語", tone: "トーン", btnTranslate: "翻訳", btnProcessing: "処理中...", lblTranslation: "翻訳結果", lblGrammar: "文法分析", errEmpty: "テキストを入力", fromCache: "キャッシュ", btnReply: "スマート返信", lblReplies: "返信の提案" },
  fr: { appSubtitle: "Traduction IA et Grammaire", placeholder: "Tapez, parlez ou glissez un fichier (.txt)...", targetLang: "Langue cible", tone: "Ton", btnTranslate: "Traduire", btnProcessing: "Traitement...", lblTranslation: "Résultat", lblGrammar: "Analyse Grammaticale", errEmpty: "Entrez du texte", fromCache: "Cache", btnReply: "Réponses IA", lblReplies: "Réponses suggérées" }
};

const RECOMMENDED_LANGUAGES = ["English", "Indonesian", "Japanese", "Mandarin Chinese", "Korean", "Spanish", "French", "German", "Arabic", "Hindi", "Thai", "Vietnamese", "Dutch"];

interface TranslationResult {
  detected_language: string;
  original_romanization?: string | null;
  grammar_check: { has_errors: boolean; corrected_text: string; feedback: string; };
  translation: { translated_text: string; romanization: string | null; iso_language_code: string; explanation: string; };
}
interface StarredItem { id: number; original: string; translated: string; language: string; }

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [uiLang, setUiLang] = useState<UILang>("id");
  const t = uiDict[uiLang];
  
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [targetRegister, setTargetRegister] = useState("Match original register");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState("");
  const [isCached, setIsCached] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const [starredItems, setStarredItems] = useState<StarredItem[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedWord, setSelectedWord] = useState("");
  const [dictLoading, setDictLoading] = useState(false);
  const [dictData, setDictData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  
  const [replies, setReplies] = useState<string[] | null>(null);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [repliesError, setRepliesError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("app_token");
    if (token) setIsAuthenticated(true);
    setAuthChecking(false);
    const saved = localStorage.getItem("starred_translations");
    if (saved) setStarredItems(JSON.parse(saved));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    localStorage.setItem("app_token", passwordInput);
    setIsAuthenticated(true); setLoginError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("app_token");
    setIsAuthenticated(false); setPasswordInput(""); setResult(null); setReplies(null);
  };

  const handleTranslate = async (textToTranslate = text) => {
    const trimmedText = textToTranslate.trim();
    if (!trimmedText) { setError(t.errEmpty); return; }
    const cacheKey = `trans_${trimmedText}_${targetLanguage}_${targetRegister}`;
    const cachedData = localStorage.getItem(cacheKey);
    setReplies(null); setRepliesError("");
    
    if (cachedData) { setResult(JSON.parse(cachedData)); setIsCached(true); setError(""); return; }

    setLoading(true); setError(""); setResult(null); setIsCached(false);
    try {
      const token = localStorage.getItem("app_token");
      const res = await fetch("/api/translate", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ text: trimmedText, targetLanguage, targetRegister }),
      });
      const data = await res.json();
      if (res.status === 401) { handleLogout(); throw new Error("Akses ditolak."); }
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem(cacheKey, JSON.stringify(data));
      setResult(data);
    } catch (err: any) { setError(err.message || t.errNetwork); } finally { setLoading(false); }
  };

  const handleGenerateReplies = async () => {
    if (!result) return;
    setRepliesLoading(true); setRepliesError("");
    try {
      const token = localStorage.getItem("app_token");
      const res = await fetch("/api/reply", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ text: result.translation.translated_text, language: targetLanguage, tone: targetRegister }),
      });
      const data = await res.json();
      if (res.status === 401) { handleLogout(); return; }
      if (!res.ok) throw new Error(data.error || "Gagal membuat balasan AI.");
      if (data.replies && Array.isArray(data.replies)) { setReplies(data.replies); } else { throw new Error("Format respon tidak valid."); }
    } catch (err: any) { setRepliesError(err.message || "Gagal membuat balasan AI."); } finally { setRepliesLoading(false); }
  };

  const handleSelectReply = (selectedReply: string) => {
    if (!result) return;
    setText(selectedReply); setTargetLanguage(result.detected_language || "English");
    setResult(null); setReplies(null);
  };

  const handleSpeech = (textToSpeak: string, langCode: string) => {
    if (!("speechSynthesis" in window)) return alert("Browser tidak mendukung TTS.");
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.lang.includes(langCode) || v.lang.includes(langCode.split('-')[0]));
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = langCode || 'en-US'; utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser tidak mendukung Voice Input.");
    if (isListening) { setIsListening(false); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = uiLang === 'id' ? 'id-ID' : 'en-US'; recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => { setText((prev) => prev + (prev ? " " : "") + event.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false); recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => { if (event.target?.result) setText(event.target.result as string); };
    reader.readAsText(file);
  };

  const exportToTxt = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([`Original:\n${text}\n\nTranslation (${targetLanguage}):\n${result.translation.translated_text}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file); element.download = "translation_export.txt";
    document.body.appendChild(element); element.click();
  };

  const handleSwapLanguage = () => {
    if (!result) return;
    setTargetLanguage(result.detected_language); setText(result.translation.translated_text);
    setResult(null); setReplies(null);
  };

  const isCurrentStarred = starredItems.some((item) => item.original === text && item.translated === result?.translation.translated_text && item.language === targetLanguage);
  const toggleStar = () => {
    if (!result) return;
    if (isCurrentStarred) {
      const updated = starredItems.filter((item) => !(item.original === text && item.translated === result.translation.translated_text && item.language === targetLanguage));
      setStarredItems(updated); localStorage.setItem("starred_translations", JSON.stringify(updated));
    } else {
      const newItem: StarredItem = { id: Date.now(), original: text, translated: result.translation.translated_text, language: targetLanguage };
      const updated = [newItem, ...starredItems].slice(0, 50);
      setStarredItems(updated); localStorage.setItem("starred_translations", JSON.stringify(updated));
    }
  };
  const removeStar = (id: number) => {
    const updated = starredItems.filter(item => item.id !== id);
    setStarredItems(updated); localStorage.setItem("starred_translations", JSON.stringify(updated));
  };

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) { setDictData(null); setSelectedWord(""); return; }
    const word = selection.toString().trim(); if (word.split(" ").length > 3) return;
    const range = selection.getRangeAt(0); const rect = range.getBoundingClientRect();
    setSelectedWord(word); setPopupPos({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY + 10 });
    setDictLoading(true); setDictData(null);
    try {
      const token = localStorage.getItem("app_token");
      const res = await fetch("/api/dictionary", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ word, context: result?.translation.translated_text || text, language: targetLanguage }),
      });
      const data = await res.json(); if (res.ok) setDictData(data);
    } catch (err) { console.error(err); } finally { setDictLoading(false); }
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (authChecking) return null;
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-100">
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-200 mb-5">
              <LockKeyhole className="w-7 h-7 text-white absolute" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Portal Pribadi</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Silakan masukkan kredensial Anda.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <input type="password" placeholder="Kata sandi..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} autoFocus />
            {loginError && <p className="text-red-500 text-sm font-medium">{loginError}</p>}
            <button type="submit" className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]">
              Otorisasi Akses
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 flex flex-col" onMouseUp={handleTextSelection}>
      
      {/* HEADER KOMERSIAL (SAAS NAVIGATION) */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 md:px-8 py-3.5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md shadow-indigo-200">
              <Globe className="w-5 h-5 text-white absolute" />
              <Sparkles className="w-3 h-3 text-indigo-200 absolute top-1 right-1" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold text-slate-900 leading-none tracking-tight">Linguist<span className="text-indigo-600">Pro</span></h1>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500">
            <Link href="/produk" className="hover:text-indigo-600 transition-colors">Produk</Link>
            <Link href="/solusi-bisnis" className="hover:text-indigo-600 transition-colors">Solusi Bisnis</Link>
            <Link href="/harga" className="hover:text-indigo-600 transition-colors">Harga</Link>
            <Link href="/api-docs" className="hover:text-indigo-600 transition-colors">API & Docs</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowSidebar(true)} className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl relative transition-colors" title="History">
            <History className="w-5 h-5" />
            {starredItems.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>}
          </button>
          <div className="h-5 w-px bg-slate-200 mx-2"></div>
          <select className="bg-transparent text-slate-600 text-sm font-semibold p-2 outline-none cursor-pointer" value={uiLang} onChange={(e) => setUiLang(e.target.value as UILang)}>
            <option value="id">ID</option><option value="en">EN</option><option value="zh">ZH</option><option value="es">ES</option><option value="ja">JA</option><option value="fr">FR</option>
          </select>
          <div className="h-5 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors" title="Kunci Sesi">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
              <span className="text-slate-500">ME</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Dictionary Pop-up (Modern Tooltip) */}
      {selectedWord && (dictLoading || dictData) && (
        <div className="absolute z-50 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-5 w-80 max-w-[90vw] ring-1 ring-black/5" style={{ top: `${popupPos.y}px`, left: `${Math.min(popupPos.x, window.innerWidth - 320)}px` }} onMouseDown={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg"><BookOpen className="w-4 h-4 text-indigo-600"/></div>
              {selectedWord}
            </h4>
            <button onClick={() => setSelectedWord("")} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><X className="w-4 h-4"/></button>
          </div>
          {dictLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium"><RefreshCw className="w-4 h-4 animate-spin text-indigo-500"/> Menganalisis Kamus AI...</div>
          ) : dictData ? (
            <div className="space-y-4 text-sm mt-2">
              <p className="text-slate-700 leading-relaxed font-medium">{dictData.definition}</p>
              {dictData.formal_synonyms?.length > 0 && (<div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Formal / Profesional</span> <span className="text-indigo-700 font-medium">{dictData.formal_synonyms.join(", ")}</span></div>)}
              {dictData.casual_synonyms?.length > 0 && (<div className="bg-orange-50/50 p-2.5 rounded-lg border border-orange-100/50"><span className="text-[10px] font-bold text-orange-400/80 uppercase tracking-wider block mb-1">Santai / Kasual</span> <span className="text-orange-600 font-medium">{dictData.casual_synonyms.join(", ")}</span></div>)}
            </div>
          ) : null}
        </div>
      )}

      {/* Sidebar Overlay */}
      {showSidebar && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={() => setShowSidebar(false)} />}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 flex flex-col ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><Star className="w-5 h-5 text-amber-400 fill-amber-400"/> Frasa Tersimpan</h3>
          <button onClick={() => setShowSidebar(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5"/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {starredItems.length === 0 ? (
            <div className="text-center mt-12"><Star className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400 font-medium">Belum ada histori.</p></div>
          ) : (
            starredItems.map(item => (
              <div key={item.id} className="bg-white border border-slate-200 p-4 rounded-2xl relative group hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer" onClick={() => {setText(item.original); setTargetLanguage(item.language); handleTranslate(item.original); setShowSidebar(false);}}>
                <button onClick={(e) => { e.stopPropagation(); removeStar(item.id); }} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white"><X className="w-4 h-4"/></button>
                <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1.5">{item.language}</div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-1 font-medium">{item.original}</p>
                <p className="text-sm font-bold text-slate-900">{item.translated}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* WORKSPACE UTAMA */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        
        {/* CONTROL PANEL */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm items-center ring-1 ring-slate-900/5">
          <div className="flex-1 relative w-full flex items-center pl-4">
            <Globe className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
            <input id="lang-input" list="language-options" className="w-full bg-transparent text-slate-900 py-3 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-slate-400" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} onFocus={(e) => e.target.select()} placeholder={t.targetLang} />
            {targetLanguage && <button type="button" onClick={() => { setTargetLanguage(""); document.getElementById("lang-input")?.focus(); }} className="mr-3 p-1 text-slate-400 hover:bg-slate-100 rounded-md"><X className="w-4 h-4" /></button>}
            <datalist id="language-options">{RECOMMENDED_LANGUAGES.map(lang => <option key={lang} value={lang} />)}</datalist>
          </div>
          
          <button onClick={handleSwapLanguage} disabled={!result} className="hidden sm:flex p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-slate-200" title="Tukar Bahasa Asli & Tujuan">
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <div className="flex-1 w-full flex items-center pl-4 sm:border-l border-slate-200 relative">
            <Settings2 className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
            <select className="w-full bg-transparent text-slate-900 py-3 text-sm font-semibold outline-none cursor-pointer appearance-none pr-8" value={targetRegister} onChange={(e) => setTargetRegister(e.target.value)}>
              <option value="Match original register">Otomatis / Bawaan Teks</option>
              <option value="Formal">Formal & Profesional</option>
              <option value="Informal / Slang">Santai & Kasual</option>
              <option value="Academic">Gaya Akademis</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 font-medium">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" /> <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* LEFT: Input Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col relative focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all min-h-[400px]">
            <div className="flex-1 relative flex flex-col">
              {/* PINYIN TEKS ASLI (Jika ada) */}
              {result?.original_romanization && (
                <div className="px-6 pt-4 pb-0">
                  <div className="bg-indigo-50/50 border border-indigo-100 px-3 py-2 rounded-lg inline-block text-xs font-mono text-indigo-700">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 mr-2">Pinyin Input:</span> 
                    {result.original_romanization}
                  </div>
                </div>
              )}
              <textarea
                className={`w-full h-full flex-1 bg-transparent p-6 text-slate-900 text-lg md:text-xl resize-none outline-none placeholder:text-slate-400 font-medium leading-relaxed ${isListening ? 'bg-indigo-50/30' : ''}`}
                placeholder={t.placeholder} value={text} onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTranslate(); } }}
              />
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-b-3xl">
              <div className="flex items-center gap-1">
                <button onClick={toggleListening} className={`p-2.5 rounded-xl transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`} title="Dikte Suara">
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Unggah Teks (.txt)">
                  <FileText className="w-5 h-5" />
                </button>
                <input type="file" accept=".txt,.md,.csv" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{text.length} Char</span>
                <button onClick={() => handleTranslate(text)} disabled={loading || !text.trim()} className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-200 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-sm">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  {loading ? t.btnProcessing : t.btnTranslate}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Output Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col relative min-h-[400px] overflow-hidden">
            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/30">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4"><Globe className="w-8 h-8 text-slate-300" /></div>
                <p className="font-semibold text-slate-500">{t.lblTranslation}</p>
                <p className="text-xs mt-2 text-slate-400 max-w-xs">Terjemahan, analisis grammar, dan konteks AI akan muncul di sini.</p>
              </div>
            )}
            
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-indigo-600 bg-indigo-50/10">
                <RefreshCw className="w-8 h-8 animate-spin mb-3" /> <span className="text-sm font-bold tracking-widest uppercase text-indigo-500">{t.btnProcessing}</span>
              </div>
            )}

            {result && !loading && (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                
                <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">{targetLanguage}</h2>
                    {isCached && <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-md flex items-center gap-1 uppercase tracking-widest"><History className="w-3 h-3" /> CACHE</span>}
                  </div>
                  <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    <button onClick={exportToTxt} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
                    <button onClick={toggleStar} className={`p-2 rounded-lg transition-colors ${isCurrentStarred ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}>
                      <Star className={`w-4 h-4 ${isCurrentStarred ? 'fill-amber-500' : ''}`} />
                    </button>
                    <button onClick={() => handleCopy(result.translation.translated_text)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleSpeech(result.translation.translated_text, result.translation.iso_language_code)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                  <p className="text-xl md:text-2xl font-medium text-slate-900 leading-relaxed selection:bg-indigo-200 selection:text-indigo-900 cursor-text">
                    {result.translation.translated_text}
                  </p>

                  {result.translation.romanization && <p className="text-indigo-700 font-mono text-sm bg-indigo-50 p-3 rounded-xl border border-indigo-100/50 mt-4 inline-block">{result.translation.romanization}</p>}
                  
                  {/* AI Smart Replies */}
                  <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-3xl rounded-full pointer-events-none"></div>
                    <div className="flex justify-between items-center mb-4 relative z-10">
                      <h3 className="text-xs font-extrabold text-indigo-700 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500"/> {t.lblReplies}</h3>
                      {!replies && (
                        <button onClick={handleGenerateReplies} disabled={repliesLoading} className="text-xs font-bold bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white px-4 py-2 rounded-xl transition-all shadow-sm border border-indigo-200 hover:border-transparent flex items-center gap-2 disabled:opacity-50">
                          {repliesLoading ? <RefreshCw className="w-3 h-3 animate-spin"/> : <MessageSquarePlus className="w-3 h-3"/>} {t.btnReply}
                        </button>
                      )}
                    </div>
                    {repliesError && <p className="text-xs text-red-500 font-medium relative z-10">{repliesError}</p>}
                    {replies && (
                      <div className="flex flex-col gap-2 relative z-10 animate-in slide-in-from-bottom-2">
                        {replies.map((reply, i) => (
                          <button key={i} onClick={() => handleSelectReply(reply)} className="text-sm text-left bg-white hover:bg-indigo-600 hover:text-white text-slate-700 p-3.5 rounded-xl shadow-sm border border-indigo-100/50 transition-all font-medium">
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="my-6 border-t border-slate-100"></div>

                  {/* Grammar Analysis */}
                  <div>
                    <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${result.grammar_check.has_errors ? 'text-amber-500' : 'text-emerald-500'}`} /> {t.lblGrammar}
                    </h3>
                    {result.grammar_check.has_errors ? (
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                        <p className="text-sm text-slate-500 flex flex-wrap gap-2 mb-2"><span className="text-emerald-600 font-bold">{result.grammar_check.corrected_text}</span></p>
                        <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">{result.grammar_check.feedback}</p>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200/50">
                        <Check className="w-4 h-4" /> Teks tata bahasa sempurna.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER KOMERSIAL PREMIUM */}
      <footer className="bg-slate-950 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">Linguist<span className="text-indigo-500">Pro</span></h2>
              </div>
              <p className="text-sm text-slate-500 mb-6">Membangun batas komunikasi tanpa hambatan untuk perusahaan global modern menggunakan kekuatan AI kontekstual.</p>
              <div className="flex gap-4">
                <a href="mailto:richard.yuwana@optimasolusi.com" className="hover:text-white transition-colors" title="Email Kami"><Mail className="w-5 h-5"/></a>
                <a href="#" className="hover:text-white transition-colors" title="Komunitas"><MessageCircle className="w-5 h-5"/></a>
                <a href="#" className="hover:text-white transition-colors" title="Global Network"><Globe className="w-5 h-5"/></a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Produk</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/api-docs" className="hover:text-indigo-400 transition-colors">Translator API</Link></li>
                <li><Link href="/produk" className="hover:text-indigo-400 transition-colors">Smart Replies</Link></li>
                <li><Link href="/produk" className="hover:text-indigo-400 transition-colors">Enterprise Server</Link></li>
                <li><Link href="/harga" className="hover:text-indigo-400 transition-colors">Harga</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Perusahaan</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/tentang-kami" className="hover:text-indigo-400 transition-colors">Tentang Kami</Link></li>
                <li><Link href="/blog" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
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
            <p>&copy; {new Date().getFullYear()} LinguistPro Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}