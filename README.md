# Liip 10 years timeline game

Jump and run through Liip's 10 year history.

## Installation

1. Clone this repository
1. ```npm install```

## Start local server

```
npm run dev
```

This will run a server so you can run the game in a browser.

Open your browser and enter `localhost:3000` into the address bar.

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser.


## Build for deployment:

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.

## Credits

Built with [Phaser+ES6+Webpack](https://github.com/lean/phaser-es6-webpack).

## Server

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
