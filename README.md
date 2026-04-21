# Blog Platform

A full-stack blog platform with a **Node.js/Express** REST API backend and a **React** frontend. Blog posts are stored in MongoDB and the UI supports creating, reading, editing, and deleting posts — all in a single-page interface with an inline form.

---

## Features

- **Post feed** — all posts listed newest-first, each showing title, author, date, and content
- **Create post** — inline form with title, author, and content fields
- **Edit post** — pre-fills the same form with existing data; submits a `PUT` update
- **Delete post** — confirmation dialog before permanent removal
- **Loading state** — spinner shown while initial posts are fetched
- **Responsive layout** — stacked layout on mobile via CSS media queries

---

## Tech Stack

### Backend

| Package | Purpose |
|---|---|
| [Express 4](https://expressjs.com/) | HTTP server & REST routing |
| [Mongoose](https://mongoosejs.com/) | MongoDB ODM |
| [cors](https://github.com/expressjs/cors) | Cross-origin request handling |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable loading |
| [nodemon](https://nodemon.io/) | Dev auto-restart |

### Frontend

| Package | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite 7](https://vitejs.dev/) | Dev server & bundler |
| [axios](https://axios-http.com/) | HTTP client for API calls |

---

## Project Structure

```
Bog_Platform/
├── backend/
│   ├── server.js       # Express app, Mongoose schema, all API routes
│   ├── .env            # Environment variables (PORT, MONGODB_URI)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx     # Root component — post list, form, CRUD handlers
│   │   ├── App.css     # All component styles + responsive breakpoints
│   │   └── main.jsx    # React root mount (StrictMode)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── package.json        # Root (no scripts)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

---

### Backend Setup

```bash
cd backend
npm install
```

The `.env` file is already configured:

```env
MONGODB_URI=mongodb://localhost:27017/blog
PORT=5000
```

Start the server:

```bash
# Development (auto-restart on save)
npx nodemon server.js

# Production
node server.js
```

> **Note:** The backend has no `start` or `dev` script in `package.json`. Add the following to `backend/package.json` for convenience:
> ```json
> "scripts": {
>   "start": "node server.js",
>   "dev": "nodemon server.js"
> }
> ```

The API will be available at `http://localhost:5000`.

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** The API base URL is hardcoded in `App.jsx` as `http://localhost:5000/api`. Update this to an environment variable (`VITE_API_URL`) when deploying to a non-local environment.

---

## REST API Reference

All routes are prefixed with `/api/posts`. Posts are sorted newest-first.

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `GET` | `/api/posts` | — | Fetch all posts (newest first) |
| `GET` | `/api/posts/:id` | — | Fetch a single post by ID |
| `POST` | `/api/posts` | `{ title, content, author }` | Create a new post |
| `PUT` | `/api/posts/:id` | `{ title, content, author }` | Update an existing post |
| `DELETE` | `/api/posts/:id` | — | Delete a post |

All three fields (`title`, `content`, `author`) are required for `POST`. The `updatedAt` timestamp is refreshed automatically on `PUT`.

---

## Database Schema

**Collection: `posts`**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | ✓ | |
| `content` | String | ✓ | Stored with whitespace preserved (`pre-wrap`) |
| `author` | String | ✓ | Free-text name field |
| `createdAt` | Date | — | Auto-set to `Date.now` on creation |
| `updatedAt` | Date | — | Auto-set on creation; updated manually on `PUT` |

---

## Known Issues & Improvements

- `react-scripts` is listed as a frontend dependency but is unused — the project uses Vite, not Create React App. It should be removed.
- The `title` in `index.html` still reads "Vite + React" — update it to "My Blog Platform".
- There is no authentication — anyone can create, edit, or delete any post.
- The backend has no `start`/`dev` npm scripts, making `npm start` a no-op.
- The API URL is hardcoded in `App.jsx` and should be moved to a `.env` file as `VITE_API_URL`.
- `updatedAt` is manually set in the `PUT` handler rather than using Mongoose's built-in `timestamps` option — switching to `{ timestamps: true }` in the schema would handle both fields automatically.
