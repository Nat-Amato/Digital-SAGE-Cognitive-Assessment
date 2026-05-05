# Digital SAGE
![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![License](https://img.shields.io/badge/license-AGPL--3.0-green.svg)
![React](https://img.shields.io/badge/react-19.2.0-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/typescript-5.9.3-3178C6.svg?logo=typescript)

**Digital SAGE** è un'implementazione interattiva e basata sul web del **Self-Administered Gerocognitive Examination (SAGE)**. Il test SAGE è uno strumento di screening auto-somministrato progettato per rilevare i primi segni di deterioramento cognitivo, della memoria o del pensiero.

L'obiettivo principale di questo progetto è trasformare il tradizionale test cartaceo in un'esperienza digitale moderna e accessibile, ottimizzata per l'uso con tablet e pennini. Facilita la valutazione cognitiva attraverso una serie di compiti strutturati e fornisce un calcolo automatico dei punteggi parziali.

## 📑 Indice
- [Architettura e Struttura](#-architettura-e-struttura)
- [Prerequisiti e Dipendenze](#-prerequisiti-e-dipendenze)
- [Installazione e Setup](#-installazione-e-setup)
- [Utilizzo](#-utilizzo)
- [Flussi di Lavoro e CI/CD](#-flussi-di-lavoro-e-cicd)
- [Contribuire e Licenza](#-contribuire-e-licenza)

## 🏗️ Architettura e Struttura
Il progetto è una Single Page Application (SPA) sviluppata con **React 19** e **TypeScript**, utilizzando **Vite** come bundler. L'interfaccia utente è stilizzata tramite **Tailwind CSS 4** e le animazioni sono gestite con **Framer Motion**. La navigazione lato client è implementata con **React Router 7**.

La logica si divide tra l'interfaccia utente (Pagine e Componenti) e le configurazioni di stato e valutazione (Dati e Utils). La valutazione dei punteggi (Scoring) e i risultati sono implementati nel codice ma separati dai percorsi attivi per favorire una revisione clinica.

**Albero delle directory chiave:**
```text
digital-sage-test/
├── public/                 # Asset statici (immagini, icone SVG)
└── src/
    ├── components/         # Componenti UI riutilizzabili (Layout, Header, SimpleButton)
    │   ├── DrawingCanvas/  # Componente core per l'interazione touch/stylus
    │   ├── HybridInput/    # Input ibrido per testo e disegno libero
    │   └── SageReview/     # Componente per la revisione finale e il calcolo del punteggio
    ├── data/               # Dati statici e configurazione degli step del test (testSteps.ts)
    ├── lib/                # Utility generali (es. merge delle classi Tailwind)
    ├── pages/              # Viste principali dell'applicazione (Home.tsx, Test.tsx)
    ├── utils/              # Logica di business (es. sageScoring.ts per i calcoli)
    ├── App.tsx             # Entry point del routing React
    └── main.tsx            # Entry point dell'applicazione React
```

## 📦 Prerequisiti e Dipendenze
Per eseguire il progetto localmente, sono necessari i seguenti strumenti:
- **Node.js**: Versione 18 o superiore (consigliata versione LTS)
- **npm** (Node Package Manager) o **Yarn**

**Stack Tecnologico e Dipendenze Principali:**
- `react` / `react-dom` (^19.2.0)
- `react-router-dom` (^7.12.0)
- `tailwindcss` (^4.1.18) & `@tailwindcss/postcss`
- `framer-motion` (^12.25.0) per le animazioni
- `lucide-react` (^0.562.0) per le icone
- `typescript` (~5.9.3)
- `vite` (^7.2.4)

## 🚀 Installazione e Setup
Segui questi passaggi per configurare l'ambiente di sviluppo locale:

1. **Clonare il repository:**
   ```bash
   git clone <URL_DEL_REPOSITORY>
   cd digital-sage-test
   ```

2. **Installare le dipendenze:**
   ```bash
   npm install
   ```
   > **Nota:** In caso di errori di timeout durante `npm install` o se i collegamenti ai binari in `node_modules/.bin` risultano mancanti, potrebbe essere necessario rieseguire l'installazione o invocare i binari con percorsi assoluti.

3. **Configurare le variabili d'ambiente:**
   > **Nota:** Al momento non è presente un file `.env.example` né sono specificate variabili d'ambiente obbligatorie per il frontend. Se in futuro verranno aggiunte API di backend, sarà necessario configurare un file `.env`.

## 💻 Utilizzo
Per avviare l'ambiente di sviluppo locale e visualizzare l'applicazione:

1. **Avviare il server di sviluppo:**
   ```bash
   npm run dev
   ```
2. **Accedere all'applicazione:**
   Apri il browser e vai all'indirizzo `http://localhost:5173`.

**Esempi concreti di utilizzo:**
- **Compilazione del test:** Dalla Home, clicca su "Inizia il Test". Naviga tra le domande usando i pulsanti "Continua" e "Indietro".
- **Interazione Ibrida:** Per i campi di input, l'utente può alternare tra tastiera e scrittura a mano libera. Nelle aree di disegno (come il test dell'orologio o il Trail Making), l'utente può disegnare con il mouse, il tocco o un pennino capacitivo (es. Apple Pencil).
- **Valutazione (Review):** Al termine del test, l'applicazione calcola automaticamente un punteggio parziale iniziale (considerando età, scolarità, calcolo ed elementi testuali). La vista clinica finale (`SageReview`) permette a un valutatore umano di analizzare i disegni e inserire i punteggi manuali per generare il totale.

## 🔄 Flussi di Lavoro e CI/CD
I flussi di lavoro locali sono gestiti tramite gli script npm definiti nel `package.json`:

- **Sviluppo:** Avvia il server Vite in modalità watch.
  ```bash
  npm run dev
  ```
- **Compilazione (Build):** Esegue il controllo dei tipi con TypeScript e genera la build ottimizzata con Vite nella cartella `dist`.
  ```bash
  npm run build
  ```
- **Linting:** Analizza il codice per rilevare problemi stilistici ed errori tramite ESLint.
  ```bash
  npm run lint
  ```
- **Preview:** Avvia un server locale per testare la build di produzione.
  ```bash
  npm run preview
  ```

> **Nota:** Al momento non sono presenti pipeline CI/CD configurate nel repository (es. file in `.github/workflows` mancanti). Non è implementato alcun ambiente Docker né un framework di test automatizzati (come Jest o Vitest). Si consiglia l'introduzione di GitHub Actions per automatizzare linting, build e l'esecuzione di futuri test unitari.

## 🤝 Contribuire e 📄 Licenza

### Contribuire
Le linee guida specifiche per la contribuzione (es. `CONTRIBUTING.md`) non sono attualmente presenti. Tuttavia, per contribuire:
1. Effettua un fork del repository.
2. Crea una branch per la tua feature (`git checkout -b feature/nuova-funzionalita`).
3. Applica le modifiche e assicurati che non vi siano errori (`npm run lint` e `npm run build`).
4. Invia una Pull Request spiegando dettagliatamente le modifiche introdotte.

### Licenza
Questo progetto è distribuito sotto la licenza **GNU Affero General Public License v3.0 (AGPL-3.0)**.
Vedi il file `LICENSE` nel repository per i dettagli completi.