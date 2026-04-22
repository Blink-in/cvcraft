# CVCraft — Professional CV & Cover Letter Builder

A production-grade MERN stack application for creating stunning CVs and AI-powered cover letters. **No login required** — start building instantly.

---

## ✨ Features

- **5 Professional Templates** — Classic, Modern, Minimal, Executive, Creative
- **AI Cover Letter Writer** — Powered by Claude (Anthropic API), tailored to each job
- **Live Preview** — Real-time split-screen editing
- **Full Customization** — Color picker, fonts, spacing
- **PDF Export** — High-fidelity via browser print engine
- **JSON Backup/Restore** — Import/export your data anytime
- **No Auth Required** — UUID session, data in localStorage
- **Optional MongoDB Persistence** — Backend stores data by session ID
- **Rich Text Editor** — TipTap-powered for cover letters

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (optional — app works without it using localStorage)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd cvcraft

# Install all dependencies (root + client + server)
npm run install:all
```

### 2. Configure Environment

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env — set MONGO_URI if you have MongoDB

# Client
cp client/.env.example client/.env
# VITE_API_URL defaults to /api (proxied through Vite)
```

### 3. Run Development

```bash
# Starts both client (port 3000) and server (port 5000) concurrently
npm run dev
```

Open **http://localhost:3000**

---

## 📁 Project Structure

```
cvcraft/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── cv/            # CV builder components
│   │   │   │   ├── sections/  # Personal, Experience, Education, Skills, Projects, Certs
│   │   │   │   ├── templates/ # Classic, Modern, Minimal, Executive, Creative
│   │   │   │   ├── CVPreview.jsx
│   │   │   │   ├── EditorSidebar.jsx
│   │   │   │   ├── TemplateSelector.jsx
│   │   │   │   ├── CustomizationPanel.jsx
│   │   │   │   └── ExportMenu.jsx
│   │   │   ├── cover/         # Cover letter components
│   │   │   └── ui/            # Shared UI (RichTextEditor, etc.)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CVBuilder.jsx
│   │   │   └── CoverLetterBuilder.jsx
│   │   ├── store/
│   │   │   └── index.js       # Zustand store with localStorage persistence
│   │   └── utils/
│   │       ├── api.js         # Axios client for backend
│   │       ├── exportPDF.js   # PDF export logic
│   │       ├── io.js          # JSON import/export
│   │       └── date.js        # Date formatting
│   └── package.json
│
├── server/                    # Node.js + Express backend
│   ├── controllers/
│   │   ├── cvController.js
│   │   └── coverLetterController.js
│   ├── models/
│   │   ├── CV.js
│   │   └── CoverLetter.js
│   ├── routes/
│   │   ├── cv.js
│   │   └── coverLetter.js
│   ├── index.js
│   └── package.json
│
├── package.json               # Root workspace scripts
└── README.md
```

---

## 🔑 AI Cover Letter Setup

1. Get a free API key at [console.anthropic.com](https://console.anthropic.com)
2. Open any Cover Letter in the app
3. Click **Generate with AI** → enter your key when prompted
4. Your key is stored **only in your browser's localStorage**

---

## 🎨 CV Templates

| Template   | Style                          | Best For              |
|------------|--------------------------------|-----------------------|
| Classic    | Gold-accented, two-column      | Finance, Law, Consult |
| Modern     | Navy blue, left accent border  | Tech, Product, Design |
| Minimal    | Pure typography, editorial     | Creative, Academic    |
| Executive  | Diagonal header, slate tones   | C-Suite, Senior roles |
| Creative   | Purple diagonal, bold layout   | Design, Marketing     |

---

## 📤 Export Options

| Format       | Method                         | Notes                    |
|--------------|--------------------------------|--------------------------|
| PDF          | Browser print dialog           | Best quality, true WYSIWYG |
| Print        | `window.print()`               | Direct to printer        |
| JSON Backup  | File download                  | Restore on any device    |

---

## 🗄️ Backend API

The backend is **optional** — the app works fully offline via localStorage. When available, it provides MongoDB persistence keyed by session UUID.

### CV Endpoints
```
GET    /api/cv/:sessionId      — Get all CVs for a session
POST   /api/cv                 — Create CV
PUT    /api/cv/:id             — Update CV
DELETE /api/cv/:id             — Delete CV
```

### Cover Letter Endpoints
```
GET    /api/cover-letter/:sessionId
POST   /api/cover-letter
PUT    /api/cover-letter/:id
DELETE /api/cover-letter/:id
```

---

## 🌐 Deployment (Free Hosting)

### Frontend Only (Vercel / Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder
```
Add `_redirects` file for SPA routing (Netlify):
```
/*  /index.html  200
```

### Full Stack (Railway / Render)
- Deploy server to Railway/Render with MongoDB Atlas
- Set `VITE_API_URL` to your deployed server URL
- Deploy client to Vercel

### Environment Variables for Production
```bash
# Server
MONGO_URI=mongodb+srv://...
CLIENT_URL=https://your-domain.vercel.app
PORT=5000

# Client
VITE_API_URL=https://your-server.railway.app/api
```

---

## 🧩 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS  |
| State      | Zustand + localStorage persist|
| Forms      | React Hook Form               |
| Editor     | TipTap                        |
| HTTP       | Axios                         |
| Backend    | Node.js, Express.js           |
| Database   | MongoDB + Mongoose            |
| AI         | Anthropic Claude API          |
| Fonts      | Google Fonts (Cormorant + DM Sans) |

---

## 📝 License

MIT — free to use and modify.
