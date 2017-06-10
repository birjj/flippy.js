# Issues

If you have found a bug in the library, feel free to open an issue. It'd ease the work significantly if you include a JSFiddle or similar of the problem, so the problem can be reproduced.

# Pull requests

Pull requests are very welcome! Note that `develop` is the branch most pull requests should point at, as `master` is reserved for actual releases.

Developing on FlippyJS usually looks as follows:

```shell
$ git pull  # pull in updates from remote
$ npm start # run tests as we're developing
[do some developing]
# if you'd like to test the GitHub page with your new changes:
$ npm run demo # requires Jekyll to be installed locally
$ git commit -a -m ...
$ git push
```