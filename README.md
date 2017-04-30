# PhaserJs AI POC

TODO

# Demo

TODO

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

## Install / update project dependencies

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

## Build the bundle.js to prepare prod mode deploy

Run,
```
docker exec -it phaserjs npm run build
```

Then deploy the index.html + lib/phaser.js + build/bundle.js on the server of your choice.

For this project, i deploy on github gh-pages branch commiting the bundle.js file on this branch.


## Troubleshooting

### Conflict. The container name "/phaserjs" is already in use by container

```
docker rm phaserjs
```

### Connect in bash to the dev image

Run,
```
docker exec -it phaserjs bash
```

Your local files should be mounted in the container,
```
root@91f762a14068:/usr/src/app# ls
Dockerfile  LICENSE  README.md	assets	bin  doc  index.html  lib  package.json  src  tsconfig.json  webpack.config.js
```

## TODO:

- webpack auto refresh
- permissions when doing exec
