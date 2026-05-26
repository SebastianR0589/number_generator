'use client';

import { useState } from 'react';
import { generateUniqueNumbers, getPattern, isSamePattern } from '@/utils/numberGenerator';

// Struktur für die Historie der Generierungen
interface HistoricGeneration {
  numbers: number[];
  pattern: string[];
}

export default function Home() {
  const [numbers, setNumbers] = useState<number[]>([]);
  // Die Historie speichert maximal die letzten 3 Generationen
  const [history, setHistory] = useState<HistoricGeneration[]>([]);
  // State für das visuelle "Kopiert!" Feedback
  const [copied, setCopied] = useState(false);

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

      // Wenn es NICHT existiert, ist die Generierung valide!
      if (!patternExistsInHistory) {
        isValid = true;
      }
      attempts++;
    }
    // Aktuellen State setzen
    setNumbers(newNumbers);
    setCopied(false); // Reset falls vorher kopiert wurde

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
    
    const textToCopy = numbers.join('-');
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      // Nach 2 Sekunden das Feedback wieder ausblenden
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fehler beim Kopieren:', err);
    }
  };

  // Kompletter Reset der App
  const handleReset = () => {
    setNumbers([]);
    setHistory([]);
    setCopied(false);
  };

  const currentPattern = getPattern(numbers);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 text-zinc-900">
      <div className="p-6 bg-white rounded-xl shadow-md border border-zinc-200 w-full max-w-md relative">
        
        {/* Reset-Button oben rechts */}
        {(numbers.length > 0 || history.length > 0) && (
          <button 
            onClick={handleReset}
            className="absolute top-4 right-4 text-xs text-zinc-400 hover:text-red-500 transition-colors font-medium"
          >
            Zurücksetzen
          </button>
        )}

        <h1 className="text-xl font-bold mb-6 text-center">Zahlen-Generator Pro</h1>
        
        {/* Hauptanzeige */}
        <div className="min-h-[120px] flex flex-col justify-center items-center bg-zinc-50 rounded-lg p-4 mb-6 border border-dashed border-zinc-300 relative group">
          {numbers.length > 0 ? (
            <>
              <p className="font-mono text-2xl font-bold text-blue-600 tracking-wider mb-2">
                {numbers.join(' - ')}
              </p>
              <p className="font-mono text-sm text-emerald-600 font-semibold mb-2">
                Muster: {currentPattern.join(' ')}
              </p>
              
              {/* Kopieren Button */}
              <button
                onClick={handleCopy}
                className={`mt-1 text-xs font-medium px-2.5 py-1 rounded transition-all ${
                  copied 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700'
                }`}
              >
                {copied ? '✓ Kopiert!' : 'Zahlen kopieren'}
              </button>
            </>
          ) : (
            <p className="text-sm text-zinc-400 italic text-center">Klicke auf den Button, um Zahlen zu generieren.</p>
          )}
        </div>

        {/* Visueller Indikator für gesperrte Muster */}
        {history.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <span className="font-semibold block mb-1">🛡️ Aktiv gesperrte Muster (aus Historie):</span>
            <div className="flex gap-2 flex-wrap font-mono">
              {history.map((entry, idx) => (
                <span key={idx} className="bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                  {entry.pattern.join('')}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl transition-colors shadow-sm mb-6"
        >
          Zahlen würfeln
        </button>

        {/* Historie Anzeige */}
        <div className="border-t border-zinc-200 pt-4">
          <h2 className="text-sm font-bold text-zinc-500 mb-3 uppercase tracking-wider">
            Historie (Letzte 3)
          </h2>
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.map((entry, idx) => (
                <div key={idx} className="flex justify-between items-center bg-zinc-50 p-2 rounded border border-zinc-100 text-xs font-mono">
                  <span className="text-zinc-600">{entry.numbers.join('-')}</span>
                  <span className="bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded text-[10px]">
                    {entry.pattern.join('')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 italic">Noch keine Historie vorhanden.</p>
          )}
        </div>
      </div>
    </main>
  );
}