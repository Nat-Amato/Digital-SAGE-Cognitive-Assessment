# Digital SAGE
![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![License](https://img.shields.io/badge/license-AGPL--3.0-green.svg)
![React](https://img.shields.io/badge/react-19.2.0-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/typescript-5.9.3-3178C6.svg?logo=typescript)

**Digital SAGE** is an interactive, web-based implementation of the **Self-Administered Gerocognitive Examination (SAGE)**. The SAGE test is a self-administered screening tool designed to detect early signs of cognitive, memory, or thinking impairments.

The main goal of this project is to transform the traditional paper-and-pen test into a modern and accessible digital experience, optimized for use with tablets and styluses. It facilitates cognitive assessment through a series of structured tasks and provides automatic calculation of partial scores.

## 📑 Index
- [Architecture and Structure](#%EF%B8%8F-architecture-and-structure)
- [Prerequisites and Dependencies](#-prerequisites-and-dependencies)
- [Installation and Setup](#-installation-and-setup)
- [Usage](#-usage)
- [Workflows and CI/CD](#-workflows-and-cicd)
- [Contributing and License](#-contributing-and-license)

## 🏗️ Architecture and Structure
The project is a Single Page Application (SPA) built with **React 19** and **TypeScript**, using **Vite** as the bundler. The user interface is styled using **Tailwind CSS 4** and animations are handled with **Framer Motion**. Client-side navigation is implemented with **React Router 7**.

The logic is divided between the user interface (Pages and Components) and state/evaluation configurations (Data and Utils). The scoring evaluation and results are implemented in the code but separated from the active routes to facilitate clinical review.

**Key Directory Tree:**
```text
digital-sage-test/
├── public/                 # Static assets (images, SVG icons)
└── src/
    ├── components/         # Reusable UI components (Layout, Header, SimpleButton)
    │   ├── DrawingCanvas/  # Core component for touch/stylus interaction
    │   ├── HybridInput/    # Hybrid input for text and freehand drawing
    │   └── SageReview/     # Component for final review and score calculation
    ├── data/               # Static data and test step configurations (testSteps.ts)
    ├── lib/                # General utilities (e.g., Tailwind class merging)
    ├── pages/              # Main application views (Home.tsx, Test.tsx)
    ├── utils/              # Business logic (e.g., sageScoring.ts for calculations)
    ├── App.tsx             # React routing entry point
    └── main.tsx            # React application entry point
```

## 📦 Prerequisites and Dependencies
To run the project locally, the following tools are required:
- **Node.js**: Version 18 or higher (LTS version recommended)
- **npm** (Node Package Manager) or **Yarn**

**Technology Stack and Main Dependencies:**
- `react` / `react-dom` (^19.2.0)
- `react-router-dom` (^7.12.0)
- `tailwindcss` (^4.1.18) & `@tailwindcss/postcss`
- `framer-motion` (^12.25.0) for animations
- `lucide-react` (^0.562.0) for icons
- `typescript` (~5.9.3)
- `vite` (^7.2.4)

## 🚀 Installation and Setup
Follow these steps to configure your local development environment:

1. **Clone the repository:**
   ```bash
   git clone <REPOSITORY_URL>
   cd digital-sage-test
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 💻 Usage
To start the local development environment and view the application:

1. **Start the development server:**
   ```bash
   npm run dev
   ```
2. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

**Concrete Usage Examples:**
- **Taking the Test:** From the Home page, click "Start the Test". Navigate through the questions using the "Continue" and "Back" buttons.
- **Stylus-First Interaction:** To best simulate the traditional pen-and-paper experience, the primary interaction method is through freehand drawing using a capacitive stylus (e.g., Apple Pencil) on a tablet. This applies to both input fields and dedicated drawing areas (such as the clock drawing test or Trail Making). A keyboard input fallback is available and can be toggled on, but should only be used if absolutely necessary.
- **Evaluation (Review):** At the end of the test, the application automatically calculates an initial partial score (considering age, education, calculation, and textual elements). The final clinical view (SageReview component) allows a human evaluator to analyze the drawings and input manual scores to generate the total score.

## 🔄 Workflows and CI/CD
Local workflows are managed via the npm scripts defined in `package.json`:

- **Development:** Starts the Vite server in watch mode.
  ```bash
  npm run dev
  ```
- **Build:** Executes type checking with TypeScript and generates the optimized build with Vite in the `dist` folder.
  ```bash
  npm run build
  ```
- **Linting:** Analyzes the code to detect stylistic issues and errors using ESLint.
  ```bash
  npm run lint
  ```
- **Preview:** Starts a local server to test the production build.
  ```bash
  npm run preview
  ```

## 🤝 Contributing and License

### Contributing
To contribute to the project:
1. Fork the repository.
2. Create a branch for your feature (`git checkout -b feature/new-feature`).
3. Apply your changes and ensure there are no errors (`npm run lint` and `npm run build`).
4. Submit a Pull Request detailing the changes introduced.

### License
This project is distributed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
See the `LICENSE` file in the repository for full details.