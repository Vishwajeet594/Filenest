# Filenest — PDF Tools, File Viewer & Converter

A full site of PDF and file tools that runs entirely in the browser: nothing
is uploaded anywhere. Built with **React (Vite)**, **Tailwind CSS**, and a
small **Node.js/Express** server for production hosting.

## What's included

**PDF Tools** — Merge, Split, Compress, PDF→JPG, JPG→PDF, Rotate, Watermark,
Remove Pages, Add Page Numbers.

**File Viewer** — open PDF, DOCX, XLSX, CSV, JSON, Markdown and TXT files
directly in the browser.

**File Converter** — JSON ↔ CSV, CSV ↔ XLSX, JSON → XML, XML → JSON,
Markdown → HTML, PNG ↔ JPG ↔ WEBP.

Every tool processes files client-side with `pdf-lib`, `pdfjs-dist`, `xlsx`,
`mammoth`, and `marked` — there's no backend file processing, which is what
makes it safe to deploy as a mostly-static site.

---

## 1. Run it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
# from the project root
npm run install:all   # installs client + server dependencies
npm run dev:client     # starts the Vite dev server at http://localhost:5173
```

That's all you need for local development — the dev server hot-reloads as
you edit files in `client/src`.

## 2. Build for production

```bash
npm run build           # builds the React app into client/dist
npm run start            # starts the Express server on http://localhost:8080
```

The Express server in `server/server.js` just serves the static files in
`client/dist` and falls back to `index.html` for client-side routes — it
doesn't do any file processing itself.

---

## 3. Deploy

### Option A — Google Cloud Run (Docker, matches "deploy on Google")

This repo includes a `Dockerfile` that builds the client and runs it behind
the Node/Express server, ready for Cloud Run.

```bash
# from the project root, with the Google Cloud CLI installed and
# `gcloud init` already run against your project
gcloud run deploy filenest \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

Cloud Run builds the Docker image from the included `Dockerfile` and gives
you a live HTTPS URL a minute or two later. You can attach a custom domain
under Cloud Run → **Manage Custom Domains**.

### Option B — Firebase Hosting (free, static, also a Google product)

Since the whole app is client-side, Firebase Hosting works well and skips
the Node server entirely:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # choose client/dist as the public directory,
                           # answer "yes" to configure as a single-page app
npm run build
firebase deploy
```

### Option C — Vercel or Netlify (also free, zero config)

Both platforms auto-detect Vite. Point them at the `client` folder as the
project root, with build command `npm run build` and output directory
`dist`. Push this repo to GitHub, import it on either platform, and it
deploys on every push.

---

## Before going live

- Update the domain in `client/public/robots.txt`.
- Add a `client/public/sitemap.xml` once your final domain is set (each
  route in `App.jsx` is a page worth listing).
- Swap the placeholder Google Fonts import in `client/index.html` if you
  want different typography.
- Run `npm run build` locally at least once to confirm there are no
  environment-specific issues before your first deploy.

## Project structure

```
filenest/
  client/           React + Vite + Tailwind app (all UI + tool logic)
    src/
      components/   Shared UI, PDF tools, viewer, converter
      pages/        Route-level pages
      lib/          Tool registry + file helpers
  server/           Minimal Express static server (production hosting only)
  Dockerfile        For Google Cloud Run / any container host
```
