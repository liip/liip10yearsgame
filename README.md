# Liip 10 years timeline game

[![Build Status](https://travis-ci.org/liip/liip10yearsgame.svg?branch=master)](https://travis-ci.org/liip/liip10yearsgame)
[![dependencies Status](https://david-dm.org/liip/liip10yearsgame/status.svg)](https://david-dm.org/liip/liip10yearsgame)
[![devDependencies Status](https://david-dm.org/liip/liip10yearsgame/dev-status.svg)](https://david-dm.org/liip/liip10yearsgame?type=dev)

Jump and run through Liip's 10 year history.

Play the game: https://liip.github.io/liip10yearsgame/

## Development

1. Clone this repository
1. Run ```npm install```

### Run game locally

```
npm run dev
```

This will run a server so you can run the game in a browser.

Open your browser and enter `localhost:3000` into the address bar.

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser.

### Start highscores server

Required for storing `highscores`

```sh
cd src/server
npm i
npm start
```

```bash
npm run dev
curl localhost:3002/scores
```


## Build for deployment

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.

## Credits

Built with [Phaser+ES6+Webpack](https://github.com/lean/phaser-es6-webpack).
