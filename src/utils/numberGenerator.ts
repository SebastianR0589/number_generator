/**
 * Generiert ein Array mit genau 6 einzigartigen Zufallszahlen im Bereich von 0 bis 9.
 */
export function generateUniqueNumbers(): number[] {
  const numbers = new Set<number>();

  // Solange wir keine 6 Zahlen haben, würfeln wir weiter
  while (numbers.size < 6) {
    const randomNum = Math.floor(Math.random() * 10); // Generiert 0 bis 9
    numbers.add(randomNum);
  }

  // Am Ende wandeln wir das Set wieder in ein normales Array um
  return Array.from(numbers);
}

/**
 * Bestimmt das mathematische Muster zwischen den Zahlen.
 * Beispiel: [0, 5, 6, 2, 1, 9] -> ['<', '<', '>', '>', '<']
 */
export function getPattern(numbers: number[]): string[] {
  const pattern: string[] = [];

  // Wir laufen bis "length - 1", weil die letzte Zahl keinen rechten Nachbarn mehr hat
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] < numbers[i + 1]) {
      pattern.push('<');
    } else {
      pattern.push('>');
    }
  }

  return pattern;
}