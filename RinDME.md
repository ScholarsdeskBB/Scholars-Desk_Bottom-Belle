# Scholars Tuition & Registry Portal

This project was built using Google AI Studio and is ready for local development in VS Code.

## 🚀 Getting Started Locally

Follow these steps to run the application on your computer:

### 1. Prerequisites
- **Node.js**: Install the latest LTS version from [nodejs.org](https://nodejs.org/).
- **VS Code**: Recommended editor with Tailwind CSS IntelliSense extension.

### 2. Setup
1. **Download and Extract**: Download the project as a ZIP from the AI Studio settings menu and extract it.
2. **Open in VS Code**: Open the extracted folder in VS Code.
3. **Install Dependencies**:
   Open a terminal in VS Code and run:
   ```bash
   npm install
   ```
4. **Environment Variables**:
   - Create a file named `.env` in the root directory.
   - Copy the content from `.env.example` into `.env`.
   - Replace `MY_GEMINI_API_KEY` with your actual Google Gemini API key from [AI Studio Keys](https://aistudio.google.com/app/apikey).

### 3. Run Development Server
Start the app by running:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 📂 Project Structure
- `src/`: Core application logic and components.
- `src/pages/`: Main application views (Auth, Dashboard, Registry, etc.).
- `src/lib/`: Mock database and utility functions.
- `vite.config.ts`: Configuration for Vite and environment variables.

## 🛠 Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Motion (framer-motion)
- **Icons**: Lucide React
- **AI**: Google Gemini API (@google/genai)

## 📦 Deployment
To build for production:
```bash
npm run build
```
The production-ready files will be in the `dist/` folder.
