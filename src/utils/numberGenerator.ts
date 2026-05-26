/**
 * Generiert ein Array mit genau 6 einzigartigen Zufallszahlen im Bereich von 0 bis 9.
 */
export function generateUniqueNumbers(): number[] {
  const numbers = new Set<number>();

  // Solange keine 6 Zahlen vorhanden sind, wird weiter generiert
  while (numbers.size < 6) {
    const randomNum = Math.floor(Math.random() * 10); // Generiert 0 bis 9
    numbers.add(randomNum);
  }

  // Wandelt das Set in ein Array um, damit es leichter zu handhaben ist
  return Array.from(numbers);
}

//Bestimmt das mathematische Muster zwischen den Zahlen.
export function getPattern(numbers: number[]): string[] {
  const pattern: string[] = [];

  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] < numbers[i + 1]) {
      pattern.push('<');
    } else {
      pattern.push('>');
    }
  }

  return pattern;
}

/**
 * Vergleicht zwei Muster-Arrays auf Gleichheit.
 * Gibt true zurück, wenn alle Elemente an der gleichen Stelle identisch sind.
 */
export function isSamePattern(pattern1: string[], pattern2: string[]): boolean {
  if (pattern1.length !== pattern2.length) return false;
  return pattern1.every((char, index) => char === pattern2[index]);
}