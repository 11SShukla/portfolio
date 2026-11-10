# Shrestha Shukla: Portfolio

An interactive, story-driven portfolio told as a night sky. Plain HTML, CSS and JavaScript. There is no build step and nothing to install.

## Run it locally

Open `index.html` in a browser. To serve it from a local web server instead, run this in this folder:

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | Page structure and chapter text |
| `css/style.css` | All styling (colors and fonts are tokens at the top) |
| `js/main.js` | Star canvas, timeline, star map, orbit |
| `assets/favicon.svg` | Browser tab icon |

## Edit your content

Open `js/main.js`. These are the sections you will change most:

- `PROJECTS`: the six project stars (name, story, flow steps, stack, link, commit count). Star size comes from `commits`.
- `ROLES`: the timeline bars (title, organization, start and end month, dates).
- `AREAS`: the four FutureVerse areas on the orbit.

Chapter text, the hero line and the GitHub and LinkedIn links are in `index.html`.

## Deploy

Any static host works. The site is just these files.

**Netlify (fastest):** go to https://app.netlify.com/drop and drag this folder onto the page.

**Vercel:** run `npx vercel` in this folder, or import the GitHub repo in the Vercel dashboard. Leave the build command empty and the output directory as `.`.

**GitHub Pages:** push this folder to a repo, then open Settings, then Pages, choose the `main` branch and the root folder, and save.

Fonts load from Google Fonts, so the deployed site needs an internet connection to show them. Without it, the page falls back to system fonts.
