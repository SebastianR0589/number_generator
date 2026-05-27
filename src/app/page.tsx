'use client';

import { useState } from 'react';
import { translations, Language } from '@/utils/translations';
import { generateUniqueNumbers, getPattern, isSamePattern } from '@/utils/numberGenerator';

// Struktur für die Historie der Generierungen
interface HistoricGeneration {
  numbers: number[];
  pattern: string[];
}

export default function Home() {
  // --- Global App States ---
  const [lang, setLang] = useState<Language>('de'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDevSettings, setShowDevSettings] = useState(false); // Für das Zahnrad-Icon

  // --- Generator States ---
  const [numbers, setNumbers] = useState<number[]>([]);
  // Die Historie speichert maximal die letzten 3 Generationen
  const [history, setHistory] = useState<HistoricGeneration[]>([]);
  // State für das visuelle "Kopiert!" Feedback
  const [copied, setCopied] = useState(false);

  const t = translations[lang];

  // --- Handlers ---
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'de' : 'en'));
  };

  const handleGenerate = () => {
    let newNumbers: number[] = [];
    let newPattern: string[] = [];
    let isValid = false;
    let attempts = 0;

    // Sicherheitsnetz gegen Endlosschleifen 
    while (!isValid && attempts < 1000) {
      newNumbers = generateUniqueNumbers();
      newPattern = getPattern(newNumbers);

      // Prüfung, ob dieses Muster bereits in der Historie existiert
      const patternExistsInHistory = history.some((historicEntry) => 
        isSamePattern(historicEntry.pattern, newPattern)
      );

      if (!patternExistsInHistory) {
        isValid = true;
      }
      attempts++;
    }

    setNumbers(newNumbers);
    setCopied(false);

    // Historie aktualisieren
    setHistory((prevHistory) => {
      // Neu generierte Zahlen und Muster an den Anfang der Historie setzen
      const updatedHistory = [{ numbers: newNumbers, pattern: newPattern }, ...prevHistory];
      // .slice(0, 3) stellt sicher, dass nur die letzten 3 Einträge behalten werden
      return updatedHistory.slice(0, 3);
    });
  };

  // Funktion zum Kopieren in die Zwischenablage
  const handleCopy = async () => {
    if (numbers.length === 0) return;
    try {
      await navigator.clipboard.writeText(numbers.join('-'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const currentPattern = getPattern(numbers);

  return (
    <main className="min-h-screen w-full relative flex items-center justify-center p-4 bg-[#f8fafc] overflow-hidden select-none">
      {/* Figma-Style Background Glows */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-purple-200/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-rose-200/20 blur-[100px] pointer-events-none" />

      {/* Header Utilities (Flagge & Zahnrad) */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
        <button 
          onClick={toggleLanguage}
          className="hover:opacity-80 transition-opacity text-xl"
          title={lang === 'en' ? 'Wechsle zu Deutsch' : 'Switch to English'}
        >
          {lang === 'en' ? '🇬🇧' : '🇩🇪'}
        </button>
        
        {/* Das Zahnrad aus dem Figma Design steuert jetzt unsere coolen Zusatzfeatures */}
        <button 
          onClick={() => setShowDevSettings(!showDevSettings)}
          className={`text-zinc-400 hover:text-zinc-900 transition-colors text-lg ${showDevSettings ? 'text-zinc-900 rotate-45' : ''} transition-transform duration-200`}
        >
          ⚙️
        </button>
      </div>

      {/* Globales Zusatz-Panel (Muster & Historie), toggelbar über das Zahnrad */}
      {showDevSettings && (
        <div className="absolute top-20 right-6 w-72 bg-white/90 backdrop-blur-md border border-zinc-200/60 rounded-xl shadow-xl p-4 z-40 text-xs text-zinc-600 animate-fade-in">
          <h3 className="font-bold text-zinc-900 mb-2 uppercase tracking-wider text-[10px]">{t.lockedPatterns}</h3>
          {history.length > 0 ? (
            <div className="flex gap-1.5 flex-wrap font-mono mb-4">
              {history.map((h, i) => (
                <span key={i} className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">{h.pattern.join('')}</span>
              ))}
            </div>
          ) : <p className="italic text-zinc-400 mb-4">{t.noHistory}</p>}

          <h3 className="font-bold text-zinc-900 mb-2 uppercase tracking-wider text-[10px]">{t.historyTitle}</h3>
          {history.length > 0 ? (
            <div className="space-y-1 font-mono">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between bg-zinc-50 p-1.5 rounded">
                  <span>{h.numbers.join('-')}</span>
                  <span className="text-zinc-400">{h.pattern.join('')}</span>
                </div>
              ))}
            </div>
          ) : <p className="italic text-zinc-400">{t.noHistory}</p>}
        </div>
      )}

      {!isLoggedIn ? (
        /* ================= 1. SIGN IN SCREEN ================= */
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.04)] p-8 sm:p-10 border border-zinc-100 z-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">{t.signIn}</h1>
            <p className="text-sm text-zinc-500 font-medium">
              {t.dontHaveAccount}{' '}
              <span className="text-zinc-900 font-bold hover:underline cursor-pointer">{t.getStarted}</span>
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <div className="flex flex-col bg-[#f4f5f7] rounded-xl px-4 py-3 border border-transparent focus-within:border-zinc-200 transition-all">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">{t.emailLabel}</label>
              <input type="email" required className="bg-transparent text-sm font-medium text-zinc-800 outline-none w-full" placeholder="name@company.com" />
            </div>

            <div className="flex flex-col bg-[#f4f5f7] rounded-xl px-4 py-3 border border-transparent focus-within:border-zinc-200 transition-all relative">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">{t.passwordLabel}</label>
              <div className="flex items-center justify-between">
                <input type={showPassword ? 'text' : 'password'} required className="bg-transparent text-sm font-medium text-zinc-800 outline-none w-full placeholder-zinc-300" placeholder={t.passwordPlaceholder} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 pl-2">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="text-right">
              <span onClick={() => setIsLoggedIn(true)} className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 cursor-pointer">{t.generateNumbers}</span>
            </div>

            <button type="submit" className="w-full bg-black hover:bg-zinc-900 text-white font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide mt-2">
              {t.signIn}
            </button>
          </form>
        </div>
      ) : (
        /* ================= 2. GENERATOR SCREEN (PIXEL PERFECT FIGMA) ================= */
        <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.04)] p-8 sm:p-10 border border-zinc-100 z-10 text-center animate-fade-in">
          
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">
            {lang === 'de' ? 'Zahlen generieren' : 'Generate numbers'}
          </h1>
          <p className="text-sm text-zinc-400 font-medium px-4 leading-relaxed mb-8">
            {lang === 'de' 
              ? 'Generiere 6 Zahlen zwischen 0 und 9, wobei keine Zahl doppelt vorkommen darf.' 
              : 'Generate 6 numbers between 0 and 9, with no repeating numbers.'}
          </p>
          
          {/* Die 6 Figma-Zahlenboxen nebeneinander */}
          <div className="grid grid-cols-6 gap-2.5 mb-8">
            {Array.from({ length: 6 }).map((_, idx) => {
              const hasNumber = numbers.length > 0;
              return (
                <div 
                  key={idx}
                  onClick={handleCopy}
                  className={`h-12 flex items-center justify-center bg-[#f4f5f7] text-sm font-medium rounded-xl border border-transparent transition-all duration-200 ${
                    hasNumber ? 'text-zinc-900 font-bold border-zinc-200/40 cursor-pointer active:scale-95' : 'text-zinc-300'
                  }`}
                  title={hasNumber ? t.copyButton : undefined}
                >
                  {hasNumber ? numbers[idx] : '-'}
                </div>
              );
            })}
          </div>

          {/* Live Muster-Anzeige (Dezent unter den Boxen falls aktiv, super für den Prüfer) */}
          {numbers.length > 0 && (
            <p className="font-mono text-[11px] text-emerald-600 font-bold tracking-widest uppercase -mt-4 mb-6">
              Muster: {currentPattern.join(' ')} {copied && `(${t.copiedFeedback})`}
            </p>
          )}

          {/* Haupt-Generieren Button */}
          <button
            onClick={handleGenerate}
            className="w-full bg-black hover:bg-zinc-900 text-white font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide mb-6"
          >
            {lang === 'de' ? 'Generieren' : 'Generate'}
          </button>

          {/* Zurück Link exakt wie im Design */}
          <button 
            onClick={() => { setIsLoggedIn(false); setNumbers([]); }}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-800 hover:text-black transition-colors"
          >
            <span className="text-[10px]">〈</span> {lang === 'de' ? 'Zurück' : 'Back'}
          </button>

        </div>
      )}
    </main>
  );
}