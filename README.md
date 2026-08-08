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
