# Vansh — Portfolio Website

A multi-page, semantic HTML5 portfolio site (Home, About, Projects, Contact) with WCAG-focused accessibility features. No build tools or dependencies required — it's plain HTML/CSS/JS.

## Folder structure

```
portfolio/
├── index.html          Home page
├── about.html           About / skills / timeline
├── projects.html         Project write-ups
├── contact.html          Accessible contact form
├── css/
│   └── style.css        Shared stylesheet
└── js/
    └── main.js           Nav toggle + form validation
```

## Step 1 — Download the files

From the chat, click each file (or the folder, if your interface offers a "Download all") and save them into a single folder on your computer, keeping the same structure shown above. The `css` and `js` folders must sit alongside the four `.html` files — don't flatten them into one folder, or the styles and scripts won't load.

## Step 2 — Verify the folder structure

Open the folder in File Explorer (Windows) or Finder (Mac) and confirm it looks like this:

```
portfolio/
├── index.html
├── about.html
├── projects.html
├── contact.html
├── css/style.css
└── js/main.js
```

If `css` or `js` ended up empty, re-download `style.css` and `main.js` into those subfolders manually.

## Step 3 — Open it in a browser (fastest way to preview)

Just double-click `index.html`. It'll open directly in your default browser using a `file://` URL. This works fine for browsing all four pages and testing the contact form's validation — nothing here requires a server to function.

## Step 4 — (Optional) Run it through a local server instead

Opening via `file://` is fine for viewing, but some browser dev tools and Lighthouse audits behave more accurately when served over `http://`. If you have Python installed:

```bash
cd path/to/portfolio
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

If you have Node.js instead:

```bash
cd path/to/portfolio
npx serve .
```

It'll print a local URL to open.

## Step 5 — (Optional) Open it in VS Code

If you use VS Code, install the **Live Server** extension, then right-click `index.html` in the file explorer and choose **"Open with Live Server."** This auto-reloads the page whenever you edit a file, which is convenient if you're customizing colors, copy, or your real contact links.

## Step 6 — Personalize before sharing it

Before sending this to anyone, update the placeholders in `contact.html`:

- `hello@example.com` → your real email
- `github.com/example` → your real GitHub
- `linkedin.com/in/example` → your real LinkedIn

Also update the `og:url` and `canonical` link tags in each `<head>` once you know the site's real deployed URL.

## Step 7 — (Optional) Deploy it for free

Once you're happy with it locally, you can host it for free on any static site host — GitHub Pages, Netlify, or Vercel are the most common choices for a project like this. All three support dragging in a folder or connecting a GitHub repo, with no build step needed since this is plain HTML/CSS/JS.
