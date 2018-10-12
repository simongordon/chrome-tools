# chrome-tools

A range of tools for Chrome that I've wanted.

- Close duplicate tabs
- Reorder tabs (based on URL or title)
- More coming...?

_Not yet published to Chrome extension store_

---

## To Install

```
git clone https://github.com/simongordon/chrome-tools.git
yarn
```

## To Run

```
yarn build
```

or, in separate consoles:

```
yarn watch-ts
yarn watch-pug
yarn watch-css
```

Then, in the Chrome extensions page, click `Load unpacked`, and find the `extension` directory under this repo.

---

## TODO

- [ ] Publish to store
- [ ] Add webpack
  - [ ] Split TS files, compile into one
  - [ ] Universal `watch` command(?)
- [ ] Add decent styling
- [ ] Ignore sub-domains when sorting (i.e. `www.website.com` & `dev.website.com`)
- [ ] Create real icons
- [ ] Sort by category / common words?
