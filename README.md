# Digital SAGE

## Descrizione del Progetto e Obiettivi
**Digital SAGE** è un'implementazione web interattiva del **Self-Administered Gerocognitive Examination (SAGE)**. Il test SAGE è uno strumento auto-amministrato progettato per rilevare i primi segni di disturbi cognitivi, della memoria o del pensiero.

L'obiettivo principale del progetto è trasformare il tradizionale test carta-e-penna in un'esperienza digitale moderna e accessibile, ottimizzata per l'uso con tablet e stylus, facilitando la valutazione cognitiva attraverso una serie di compiti strutturati con la possibilità di calcolare automaticamente i punteggi (scoring) parziali.

## Funzionalità Principali
- **Valutazione Cognitiva Completa**: Include anamnesi iniziale e test per orientamento, linguaggio, ragionamento, visuo-spazialità, funzioni esecutive e memoria.
- **Input Ibrido (Hybrid Input)**: Supporto per input tramite tastiera o disegno a mano libera (ideale per l'uso con Apple Pencil o stylus).
- **Canvas Interattivi**: Area di disegno digitale integrata per copiare figure complesse (es. cubo), disegnare orologi e connettere nodi (Trail Making).
- **Scoring Automatico Parziale**: Algoritmo che calcola punteggi di base e fornisce un'indicazione (es. adeguamento demografico, punteggio per linguaggio e calcolo) con un'interfaccia di revisione finale dei disegni (SageReview) per la valutazione clinica.
- **Reportistica**: Possibilità di scaricare il report in formato JSON o di stamparlo/salvarlo in PDF.

## Architettura e Struttura delle Cartelle
Il progetto è una Single Page Application (SPA) basata su React. Il flusso logico prevede una Home Page introduttiva e una pagina di Test che gestisce lo stato di avanzamento attraverso vari step definiti in un file di configurazione dati.

Struttura principale:
```text
digital-sage-test/
├── public/                 # Asset statici (immagini, svg)
└── src/
    ├── components/         # Componenti UI riutilizzabili (Layout, Header, SimpleButton)
    │   ├── DrawingCanvas/  # Componente core per l'interazione touch/stylus
    │   ├── HybridInput/    # Input che accetta sia testo che disegno
    │   └── SageReview/     # Componente per la revisione finale e lo scoring
    ├── data/               # Dati statici e configurazione dei passaggi del test (testSteps.ts)
    ├── lib/                # Utility generali (es. merge delle classi Tailwind)
    ├── pages/              # Viste principali dell'applicazione (Home.tsx, Test.tsx)
    ├── utils/              # Logica di business (sageScoring.ts per il calcolo del punteggio)
    ├── App.tsx             # Entry point del routing dell'applicazione
    └── main.tsx            # Entry point di React
```

## Tecnologie Utilizzate
Lo stack tecnologico è orientato alle performance e all'esperienza utente:
- **React 19**: Libreria UI moderna per interfacce reattive.
- **Vite**: Strumento di build e server di sviluppo ultra-veloce.
- **TypeScript**: Superset di JavaScript per la tipizzazione statica e la robustezza del codice.
- **Tailwind CSS 4**: Framework CSS utility-first per uno styling rapido e coerente.
- **Framer Motion**: Libreria per animazioni fluide tra i vari step del test.
- **Lucide React**: Set di icone di alta qualità.
- **React Router 7**: Gestione della navigazione (routing client-side).

## Istruzioni di Installazione e Utilizzo

### Prerequisiti
- Node.js (versione 18 o superiore)
- npm o yarn

### Setup locale
1. **Clona il repository**:
   ```bash
   git clone <repository-url>
   cd digital-sage-test
   ```

2. **Installa le dipendenze**:
   ```bash
   npm install
   ```

3. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```
   L'applicazione sarà disponibile all'indirizzo `http://localhost:5173`.

4. **Compilazione per la produzione**:
   ```bash
   npm run build
   ```

## Esempi Pratici (Utilizzo)
- **Compilazione del Test**: L'utente accede dalla Home cliccando "Start the Test". Naviga tra le domande usando i pulsanti "Continue" / "Back". Nei compiti di disegno, può usare il mouse o il touch per disegnare. Per gli input di testo, l'utente può scegliere tra tastiera o modalità scrittura a mano tramite gli appositi toggle.
- **Fine del Test**: Al termine, viene visualizzata la schermata di "Score Evaluation" (`SageReview`), in cui un esaminatore può visualizzare il punteggio automatico, valutare manualmente i disegni (orologio, cubo, nodi) e inserire i punteggi parziali per ottenere il calcolo totale aggiornato.

## Eventuali Criticità o Limitazioni
Dall'analisi della codebase sono emerse le seguenti criticità:
- **Codice Ridondante e File Monolitici**: Il file `src/pages/Test.tsx` è estremamente lungo (>560 righe) e gestisce troppa logica contemporaneamente (rendering condizionale multiplo per i tipi di domande, gestione di stato complessa).
- **Incoerenza di Naming**: Gli asset all'interno di `/public/images/` mischiano lingue diverse (es. `fisarmonica.png`, `vulcano.png` contro `cube-iso.svg`). Inoltre la gestione dei percorsi è hardcoded nei file di dati.
- **Debolezze Strutturali nello Scoring**: Il file `sageScoring.ts` è semplificato. Il punteggio di "Orientation" è attualmente hardcoded a `0` e necessita di logica di parsing avanzata. Il controllo sulla fluidità verbale (12 animali) è molto basilare.
- **Tipizzazione Debole (uso di `any`)**: Sono presenti vari tipi `any` (es. in `HybridInput.tsx` e `sageScoring.ts`) che bypassano i controlli del compilatore TypeScript, riducendo la sicurezza del codice.
- **Bug Bloccanti in Build**: C'è un'importazione inutilizzata (`React`) nel file `src/components/Header.tsx` che causa un errore `TS6133`, bloccando la build del progetto (`npm run build`).

## Possibili Miglioramenti Futuri
- **Refactoring Componenti**: Dividere `Test.tsx` in sottomoduli dedicati ai vari tipi di step (es. `DrawingStep`, `TextQuestionStep`, `TrailMakingStep`) per facilitarne la manutenzione.
- **Miglioramento dell'Algoritmo di Scoring**: Implementare l'uso di NLP o regex più complesse per la validazione delle date in orientamento spaziale/temporale e per migliorare l'accuratezza del test del linguaggio (es. animali ripetuti, sinonimi).
- **Standardizzazione degli Asset e Internazionalizzazione (i18n)**: Uniformare la nomenclatura degli asset (es. tutti i file in inglese) e introdurre un sistema di traduzioni per separare il testo hardcoded dall'interfaccia.
- **Risoluzione Strict TypeScript**: Rimuovere l'uso di `any` definendo interfacce corrette per gli oggetti di stato e per la mappa di risposte (`answers`).
- **Validazione Form Avanzata**: Integrare librerie come React Hook Form e Zod per una gestione più robusta dello stato del form e la validazione dei dati dell'anamnesi.

---
*Disclaimer: Digital SAGE è uno strumento di screening e non fornisce una diagnosi definitiva. I risultati devono essere sempre interpretati da un professionista sanitario clinico.*