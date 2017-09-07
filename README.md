# FlippyJS GitHub Page

The GitHub page for FlippyJS. Created using Jekyll.

## Workflow

All files related to the GitHub page should be kept in the `gh-pages` branch.

The site is built automatically by GitHub, with new versions of FlippyJS being pushed into the `dist/` folder by TravisCI. The only files you have to build is JS files using babel; to do this, run `npm run build` (or `npm start` to build and run jekyll) whenever you want to commit new changes.

The usual workflow goes:

```shell
$ git pull
[make changes]
$ npm start
[open localhost:4000 and preview changes]
$ git commit -a -m ...
$ git push
```

Other than that, feel free to edit as much as you'd like. To build the site locally, follow [this guide](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/).

The entire Git history is unfortunately deleted every time a new version of FlippyJS is released. This is done by TravisCI as part of their deployment process.