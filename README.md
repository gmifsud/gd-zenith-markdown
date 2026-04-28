# Zenith Markdown Editor

A premium, local-first markdown editor built with React, Electron, and hexogonal architecture. Designed to run as a standalone Desktop App or an Obsidian Plugin.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- NPM

### 1. Install Dependencies
```bash
npm install
```

### 2. Development (Web Mode)
Run the build script in watch mode (requires manual modification of esbuild config to watch, currently compiles once):
```bash
npm run dev
# Then open index.html in your browser
```
*Note: Since this uses a specific `esbuild` setup, simply opening `index.html` after `npm run dev` will load the compiled `dist/bundle.js`.*

### 3. Desktop App (Electron)
To launch the native desktop application:
```bash
npm run electron:start
```
This command compiles the React code and launches the Electron shell.

### 4. Obsidian Plugin
To install as an Obsidian plugin:
1. Run `npm run build` for a production build, or `npm run dev` for watch mode.
2. Create a folder `zenith-markdown` inside your Obsidian Vault's `.obsidian/plugins/` directory.
3. Copy `main.js`, `manifest.json`, and `styles.css` (if you have external styles) to that folder.

#### Hot Reloading Setup (Recommended)
1. Install the [Hot Reload plugin](https://github.com/pjeby/hot-reload) in Obsidian.
2. In this project, run `npm run dev`. This will start watch mode and create a `.hotreload` file.
3. If you symlink your `zenith-markdown` output folder to your Obsidian plugins folder, the Hot Reload plugin will detect changes to `main.js` and automatically reload the plugin within Obsidian.

## 🏗️ Architecture

- **Core**: `src/` (React UI, Zustand Store)
- **Adapters**:
  - `WebAdapter`: In-memory filesystem for browser preview.
  - `ElectronAdapter`: IPC bridge to Node `fs`.
  - `ObsidianAdapter`: Bridge to `app.vault`.
- **Ports**: `src/types/adapter.ts` defines the contract.

## 🎨 Styling
Tailwind CSS is scoped to `#deep-focus-app` to prevent conflicts within Obsidian.