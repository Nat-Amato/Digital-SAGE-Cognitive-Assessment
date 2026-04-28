# Digital SAGE

## Project Description and Goals
**Digital SAGE** is an interactive web-based implementation of the **Self-Administered Gerocognitive Examination (SAGE)**. The SAGE test is a self-administered screening tool designed to detect early signs of cognitive, memory, or thinking impairments.

The main goal of this project is to transform the traditional paper-and-pen test into a modern, accessible digital experience optimized for use with tablets and styluses. It facilitates cognitive assessment through a series of structured tasks and provides automatic calculation of partial scores.

## Key Features
- **Comprehensive Cognitive Assessment**: Includes an initial anamnesis and tests for orientation, language, reasoning, visuospatial abilities, executive functions, and memory.
- **Hybrid Input**: Support for both keyboard input and freehand drawing (ideal for use with an Apple Pencil or stylus).
- **Interactive Canvases**: Integrated digital drawing area for copying complex figures (e.g., a cube), drawing clocks, and connecting nodes (Trail Making).
- **Automatic Partial Scoring**: An algorithm that calculates basic scores and provides an initial indication (e.g., demographic adjustments, language, and calculation scores), alongside a final review interface (`SageReview`) for clinical evaluation of drawings.
- **Reporting**: Ability to download the report in JSON format or print/save it as a PDF.

## Architecture and Folder Structure
The project is a Single Page Application (SPA) built with React. The logical flow includes an introductory Home Page and a Test page that manages the progress state through various steps defined in a data configuration file.

Main structure:
```text
digital-sage-test/
├── public/                 # Static assets (images, svg)
└── src/
    ├── components/         # Reusable UI components (Layout, Header, SimpleButton)
    │   ├── DrawingCanvas/  # Core component for touch/stylus interaction
    │   ├── HybridInput/    # Input component accepting both text and drawing
    │   └── SageReview/     # Component for final review and scoring
    ├── data/               # Static data and test steps configuration (testSteps.ts)
    ├── lib/                # General utilities (e.g., Tailwind class merging)
    ├── pages/              # Main application views (Home.tsx, Test.tsx)
    ├── utils/              # Business logic (sageScoring.ts for score calculation)
    ├── App.tsx             # Application routing entry point
    └── main.tsx            # React entry point
```

## Technologies Used
The technology stack is performance and user-experience oriented:
- **React 19**: Modern UI library for reactive interfaces.
- **Vite**: Ultra-fast build tool and development server.
- **TypeScript**: A superset of JavaScript providing static typing and code robustness.
- **Tailwind CSS 4**: A utility-first CSS framework for rapid and consistent styling.
- **Framer Motion**: Library for smooth animations between test steps.
- **Lucide React**: High-quality icon set.
- **React Router 7**: Client-side navigation management.

## Installation and Usage Instructions

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Local Setup
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd digital-sage-test
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

## Practical Examples (Usage)
- **Taking the Test**: The user starts from the Home page by clicking "Start the Test". They navigate through questions using the "Continue" / "Back" buttons. For drawing tasks, they can use a mouse or touch/stylus to draw. For text inputs, the user can choose between a keyboard or handwriting mode via the designated toggles.
- **Test Completion**: At the end, the "Score Evaluation" screen (`SageReview`) is displayed. Here, an examiner can view the automatic score, manually evaluate the drawings (clock, cube, trail making), and input partial scores to obtain the updated total score.

## Known Issues and Limitations
An analysis of the codebase revealed the following critical issues:
- **Redundant Code and Monolithic Files**: The `src/pages/Test.tsx` file is extremely large (>560 lines) and manages too much logic concurrently (multiple conditional renderings for question types, complex state management).
- **Inconsistent Naming Conventions**: Assets inside `/public/images/` mix different languages (e.g., `fisarmonica.png`, `vulcano.png` vs. `cube-iso.svg`). Additionally, paths are hardcoded in the data files.
- **Structural Weaknesses in Scoring**: The `sageScoring.ts` file is overly simplified. The "Orientation" score is currently hardcoded to `0` and requires advanced parsing logic. The verbal fluency check (12 animals) is very basic.
- **Weak Typing (Use of `any`)**: There are several instances of `any` types (e.g., in `HybridInput.tsx` and `sageScoring.ts`) that bypass TypeScript compiler checks, reducing code safety.

## Possible Future Improvements
- **Component Refactoring**: Split `Test.tsx` into dedicated sub-modules for various step types (e.g., `DrawingStep`, `TextQuestionStep`, `TrailMakingStep`) to improve maintainability.
- **Scoring Algorithm Enhancement**: Implement NLP or complex regex for date validation in spatial/temporal orientation and to improve language test accuracy (e.g., handling repeated animals, synonyms).
- **Asset Standardization and Internationalization (i18n)**: Standardize asset naming (e.g., all files in English) and introduce a translation system to separate hardcoded text from the UI.
- **Strict TypeScript Resolution**: Remove the use of `any` by defining proper interfaces for state objects and the answers map.
- **Advanced Form Validation**: Integrate libraries like React Hook Form and Zod for more robust form state management and anamnesis data validation.

---
*Disclaimer: Digital SAGE is a screening tool and does not provide a definitive diagnosis. Results should always be interpreted by a clinical healthcare professional.*