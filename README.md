Dokumentation: Zahlengenerator mit Sign-In Gate
1. Herangehensweise an die Aufgabe
Bei der Umsetzung dieses Projekts bin ich nach einem modularen Ansatz vorgegangen, um die Geschäftslogik strikt vom UI-Design zu trennen:

Logik-Fundament (Core Logic): Isolierter Aufbau der mathematischen Funktionen (Generierung der Zufallszahlen und Mustererkennung) ohne visuelle Abhängigkeiten.

Architektur & Setup: Aufsetzen des Next.js 16 Projekts mit TypeScript im Strict Mode und TailwindCSS.

UI/UX & Responsiveness: Umsetzung der Figma-Layouts für Desktop und Mobile, ergänzt durch die impliziten Anforderungen aus dem Design.

Allgemein habe ich bei diesem Projekt zuerst mit der Logik begonnen und zum Schluss habe ich das vorgegebene Design nachgebildet. In einem echten Projekt würde ich dieser Herangehensweise nicht nachgehen, da vor allem fachfremde Kunden meist besser darauf reagieren wenn der optische Teil zuerst präsentiert werden kann.

2. Technische Entscheidungen und Architektur
Algorithmus: Einzigartigkeit über das Set-Objekt
Für die Generierung der 6 einzigartigen Zahlen von 0 bis 9 wird ein natives JavaScript Set verwendet.

Der Grund: Ein Set kann keine Duplikate enthalten. Anstatt bei jeder neuen Zahl rechenintensiv mittels Arraysuche nach Dopplungen zu filtern, sorgt die native Funktionsweise des Sets für eine performante und saubere Lösung. Die Schleife bricht exakt ab, sobald die Größe des Sets 6 beträgt.

State-Management: Keine redundanten States
Das mathematische Muster (z. B. <<>><) wird nicht in einem separaten React-State gespeichert, sondern während des Renderings live aus den aktuellen Zahlen berechnet (const currentPattern = getPattern(numbers);).

Der Grund: Das vermeidet unnötige, kaskadierende Render-Zyklen und stellt sicher, dass die Daten immer synchron sind. Es entspricht dem React-Best-Practice, berechnete Werte dynamisch abzuleiten, statt den State künstlich aufzublähen.

Leichtgewichtige Sprachumwandlung
Da die Figma-Screens eine Sprachauswahl per Flagge beinhalten, wurde ein strukturiertes Übersetzungsobjekt (translations.ts) aufgesetzt.

Der Grund: Für eine Anwendung dieser Größe wäre eine externe Lokalisierungs-Library unnötiger Overhead gewesen. Die gewählte Lösung ist schlank, voll typisiert und ermöglicht das synchrone Umschalten aller Texte zwischen Deutsch und Englisch.

3. Qualitätssicherung und UX-Details
Umgang mit unvollständigen Anforderungen (Der Sign-In Screen)
Die schriftliche Aufgabe beschrieb primär den Generator, die Figma-Dateien enthielten jedoch auch ein Login-Formular. Da das Design im Frontend bindend ist, wurde der Sign-In Screen originalgetreu nachgebaut und als Client-seitiges Dummy-Gate vorgeschaltet. Über den Link "Zahlen generieren" lässt sich der Login zudem direkt überspringen, um dem Prüfer das Testen der App so einfach wie möglich zu machen.

Featureerweiterungen
Zusätzlich wurden weitere Features eingebaut die zwar nicht direkt gefragt waren, aber in ihrem Aufwand relativ gering waren und die App meiner Meinung nach jedoch enorm aufwerten. Diese Features beinhalten ein Kopieren des Zahlenmusters in die Zwischenablage um leichtes copy-paste zu ermöglichen, eine Historie über die letzten drei Zeichen- und Zahlenmuster, sowie eine optische Darstellung des aktuellen Zeichenmusters.

Erhalt des Designs bei erweiterten Features (Das Zahnrad-Icon)
Die Vorgabe verlangt, dass das aktuelle Muster nicht mit den letzten 3 Generationen übereinstimmen darf. Um das cleane, minimale Figma-Design des Generators nicht durch eine nachträglich angefügte Historie zu stören, wurde das vorhandene Zahnrad-Icon funktional genutzt: Ein Klick darauf öffnet ein dezentes Entwickler-Panel, das die gesperrten Muster und die Historie live anzeigt. So bleibt die Optik gewahrt, während die mathematische Korrektheit visuell nachgewiesen wird.

Vermeidung von SSR-Hydrations-Fehlern
Da Math.random() auf dem Server ein anderes Ergebnis liefert als im Browser, führt ein direkter Aufruf beim Initialisieren der Seite in Next.js zu einem Hydration Mismatch. Die App wurde daher so konzipiert, dass sie im exakten Figma-Startzustand mit Platzhaltern (-) lädt und die Logik rein an das User-Event (onClick) gekoppelt ist. Die Browser-Konsole bleibt dadurch absolut fehlerfrei.

4. Projekt-Struktur

src/
├── app/
│   └── page.tsx         # Hauptkomponente (UI-Steuerung, Views & States)
└── utils/
    ├── numberGenerator.ts  # Mathematische Logik (Set-Generierung, Muster-Vergleich)
    └── translations.ts     # Typisierte Sprachdateien (DE / EN)

5. Testen
Gestartet werden kann die App durch npm run dev wonach die App unter http://localhost:3000 erreicht werden kann.