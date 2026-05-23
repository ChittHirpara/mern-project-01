# SnapLink — URL Shortener

A full-stack MERN URL Shortener. Paste a long URL, get a short one, track every click.

![Tech Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node.js-purple)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| Frontend | *(Vercel link after deploy)* |
| Backend API | *(Render link after deploy)* |

---

## ✅ Features

- 🔗 Shorten any URL — get a 7-character short code via `nanoid`
- ↩️ Redirect — visiting the short URL redirects to the original
- 📈 Click tracking — every redirect increments a click counter
- 📋 Copy button — one click to copy the short URL
- 🗑️ Delete — remove any link from the dashboard
- 📊 Dashboard — view all your links with stats

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Short codes | nanoid |
| Deployment | Render (backend) + Vercel (frontend) |

---

## 📁 Folder Structure

```
url-shortener/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── InputBox.jsx    # URL input form
│       │   ├── Dashboard.jsx   # List of all short links
│       │   └── LinkCard.jsx    # Individual link card
│       ├── App.jsx
│       └── index.css
│
└── server/                     # Node + Express backend
    ├── models/Url.model.js     # Mongoose schema
    ├── routes/url.routes.js    # API route definitions
    ├── controllers/url.controller.js  # Business logic
    └── index.js                # Server entry point
```

---

## 🔌 API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/shorten` | Takes long URL, returns short code |
| `GET` | `/:shortCode` | Redirects to original URL + counts click |
| `GET` | `/api/urls` | Returns all URLs with click counts |
| `DELETE` | `/api/urls/:id` | Deletes a URL by MongoDB ID |

---

## 🗄️ MongoDB Schema

```js
{
  originalUrl: String,   // the long URL
  shortCode:   String,   // e.g. "abc1234" — unique
  clicks:      Number,   // default 0
  createdAt:   Date      // default Date.now
}
```

---

## ⚙️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/ChittHirpara/mern-project-01.git
cd mern-project-01
```

### 2. Create `.env` in the root folder
```env
MONGO_URI=mongodb://localhost:27017/url-shortener
PORT=5000
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

### 3. Install & run the backend
```bash
cd server
npm install
npm run dev
```

### 4. Install & run the frontend (new terminal)
```bash
cd client
npm install
npm run dev
```

### 5. Open the app
Go to **http://localhost:5173**

---

## 🌐 Deployment

### Backend → Render
- Connect your GitHub repo on [render.com](https://render.com)
- Root directory: `server`
- Build command: `npm install`
- Start command: `node index.js`
- Add environment variables: `MONGO_URI`, `PORT`, `BASE_URL`, `CLIENT_URL`

### Frontend → Vercel
- Connect your GitHub repo on [vercel.com](https://vercel.com)
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable: `VITE_API_URL` = your Render backend URL

---

## 🔄 CI/CD Pipeline

Every push to `main` branch triggers:
1. **GitHub Actions** — installs dependencies and builds both client & server to check for errors
2. **Render** — auto-deploys the backend
3. **Vercel** — auto-deploys the frontend

---

## 📄 License

MIT © [Chitt Hirpara](https://github.com/ChittHirpara)
