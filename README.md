# Underpants Gnomes

Small platformer game rushly developed #uglyCodeAndBugsInside with Typescript + Phaser JS for the Akeneo Game Jam #3.

![Image of GameJam](doc/game-jam-3.jpg)

# Demo

You can access to the demo here https://nidup.github.io/underpants-gnomes/

The demo is deployed on the `gh-pages` branch versionning the `build/bundles.js` file (npm run build to update).

# Screenshots

![Image of GameJam](doc/gnome-night.png)

![Image of GameJam](doc/gnome-day.png)

# Getting Started

## Pre-requisites

You need to have `docker` installed

## Build the dev image

Run,
```
docker build -t nidup/phaserjs .
```

Your image should appears in list when typing,
```
docker images
```

## Run the dev image

Run to mount local code inside the container and bind ports
```
docker run --name phaserjs -v "$PWD":/usr/src/app -p 49666:8080 -d nidup/phaserjs
```

Your container should appears in list when typing,
```
docker ps
```

## Install / update project dependencies

Run,
```
docker exec -it phaserjs npm install
```

### Running the project in dev mode:

Run,
```
docker exec -it phaserjs npm run dev
```

### Access to your project

Npm run dev running will launch webpack in watch mode, you can access your project in your browser at the following url,
```
http://localhost:49666/
```

### Build the bundle.js to prepare prod mode deploy

Run,
```
docker exec -it phaserjs npm run build
```

Then deploy the index.html + lib/phaser.js + build/bundle.js on the server of your choice.

For this project, i deploy on github gh-pages branch commiting the bundle.js file on this branch.


## Troubleshooting

### Conflict. The container name "/phaserjs" is already in use by container

```
docker rm phaserjs
```

### Connect in bash to the dev image

Run,
```
docker exec -it phaserjs bash
```

Your local files should be mounted in the container,
```
root@91f762a14068:/usr/src/app# ls
Dockerfile  LICENSE  README.md	assets	bin  doc  index.html  lib  package.json  src  tsconfig.json  webpack.config.js
```




## TODO:

- webpack auto refresh
- permissions when doing exec


## OLD / DEPRECATED

### Dependencies

To install dependencies, run:
```
npm install
```

This will install all required local dependencies

### Building the project

To build project you can use:

```
npm run build
```

### Running in dev mode:

```
npm run dev
```

# Artwork and special thanks

Thx @grena for the Game Jam org!

Thx @wlk for the following boilerplate https://github.com/wlk/phaser-typescript-boilerplate

Thx Buch for the Art Work http://opengameart.org/content/a-platformer-in-the-forest

Thx Puddin for the Art Work http://opengameart.org/content/rotating-coin

Thx Trey Parker & Matt Stone for the original Underpants Gnome idea https://en.wikipedia.org/wiki/Gnomes_(South_Park)
