# samq64.github.io

Samq64's personal [Hugo](https://gohugo.io) site.

## Building

[Install](https://gohugo.io/installation) Hugo. The version CI builds with is pinned in [the workflow](.github/workflows/hugo.yml) instead.

```sh
git clone https://github.com/Samq64/samq64.github.io
cd samq64.github.io
npm install
npm run dev
```

`npm install` only pulls in Pagefind and Prettier.

## Scripts

| Name     | Description                                              |
| -------- | -------------------------------------------------------- |
| `dev`    | Hugo's dev server, drafts included. Search does not work |
| `build`  | Build the site into `public/`                            |
| `index`  | Build the search index from `public/`                    |
| `format` | Run Prettier                                             |
| `check`  | Verify Prettier formatting without writing. CI runs this |

Pagefind indexes the built HTML rather than the Markdown, so `index` has to run after
`build`, and has to run again whenever the output changes. To preview the finished site
with search working:

```sh
npm run build && npm run index -- --serve
```

Pass extra flags through the same way, for example `npm run build -- --buildDrafts`.

## Where things go

| Directory | Holds                                       | Published         |
| --------- | ------------------------------------------- | ----------------- |
| `content` | Pages, and the media they render            | Everything in it  |
| `assets`  | CSS, JS, and images only templates read     | Only what is used |
| `static`  | Files wanted verbatim, such as the favicons | Everything in it  |
| `design`  | Drawings Hugo never reads, kept for editing | Nothing           |

The split between the first two is whether a reader ever sees the file. A page's illustration
is content and belongs beside it; a stylesheet, a script, or an app icon that only the manifest
reads is not, and lives in `assets`, where it can be hashed and where nothing unused ships.
Code has to be there regardless, since that is the only place esbuild can resolve an import.

A drawing in `design` records the command that regenerates whatever it produces, because
nothing in the build checks the two still match.

## Page-specific assets

A page names its own stylesheets and scripts, by their path within `assets`:

```yaml
styles:
  - projects/bliss/style.css
scripts:
  - projects/bliss/script.js
```

Both are built, hashed and emitted by `_partials/page-assets.html`. Stylesheets land after the
site's own so they can override it; scripts are bundled, so a script's imports need no mention
and arrive under its hash. They are deferred rather than modules, the bundles being iife, so a
script cannot rely on reaching the page through a global.

Adding a `pwa` map makes a page installable, with a manifest and a service worker written into
its own directory so the app's scope is that directory alone:

```yaml
pwa:
  short_name: Bliss Board
  icon: projects/bliss/icon.png
```

The icon is one 512 square, framed to be shown whole; the padded variant Android's circular
crop needs is grown from it at build time. The worker serves pages from the network first and
hashed assets from the cache, so a deploy is never held back by it.
