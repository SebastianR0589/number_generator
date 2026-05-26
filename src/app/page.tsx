'use client';

import { useState } from 'react';
import { generateUniqueNumbers, getPattern } from '@/utils/numberGenerator';

export default function Home() {
  // Wir starten mit einem leeren Array. Keine Zahlen vorhanden = Startzustand.
  const [numbers, setNumbers] = useState<number[]>([]);

  // Die Funktion wird NUR aufgerufen, wenn der User aktiv klickt.
  // Das ist für React 100% sauber, da es ein Event ist und kein Seiteneffekt beim Laden.
  const handleGenerate = () => {
    const newNumbers = generateUniqueNumbers();
    setNumbers(newNumbers);
  };

  // Wir berechnen das Muster wieder live aus dem State
  const pattern = getPattern(numbers);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 text-zinc-900">
      <div className="p-6 bg-white rounded-xl shadow-md border border-zinc-200 w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-6">Zahlen-Generator</h1>
        
        {/* Anzeige-Bereich */}
        <div className="min-h-[100px] flex flex-col justify-center items-center bg-zinc-50 rounded-lg p-4 mb-6 border border-dashed border-zinc-300">
          {numbers.length > 0 ? (
            <>
              <p className="font-mono text-xl font-bold text-blue-600 tracking-wider mb-2">
                {numbers.join(' - ')}
              </p>
              <p className="font-mono text-sm text-emerald-600 font-semibold">
                Muster: {pattern.join(' ')}
              </p>
            </>
          ) : (
            <p className="text-sm text-zinc-400 italic">Klicke auf den Button, um Zahlen zu generieren.</p>
          )}
        </div>

        {/* Interaktiver Button */}
        <button
          onClick={handleGenerate}
          className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          Zahlen würfeln
        </button>
      </div>
    </main>
  );
}