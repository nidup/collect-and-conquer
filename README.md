# AI Sandbox

Playing with steering behaviors, stacked FSM and A* path finding.

# Demo

https://nidup.github.io/phaserjs-ai-poc/

# Getting Started

## Pre-requisites

You need to have `docker` installed

## Build the dev image

```
docker build -t nidup/phaserjs .
```

Your image should appears in the list when typing,
```
docker images
```

## Run the dev image

Run to mount local project code inside the container and bind ports
```
docker run --name phaserjs -v "$PWD":/usr/src/app -p 8080:8080 -d nidup/phaserjs
```

Your container should appears in the list when typing,
```
docker ps
```

## Install / update project dependencies

```
docker exec -it phaserjs npm install
```

## Running the project in dev mode:

Launch webpack server in watch mode,
```
docker exec -it phaserjs npm run dev
```

You can access your project in your browser,
```
http://localhost:8080/
```

# Deploy in production

We deploy online version directly from our Github repository with https://pages.github.com/

## Checkout the gh-page and rebase master on

```
git checkout gh-pages
git rebase -i master
```

## Build the bundle.js

```
docker exec -it phaserjs npm run build
```

## Commit then push the bundle.js

```
git commit
git push
```

## Check the deployment

The game is available on the following website,
```
https://nidup.github.io/phaserjs-ai-poc/
```

# Troubleshooting

## Conflict. The container name "/phaserjs" is already in use by container

```
docker rm phaserjs
```

# Utils

## Connect in bash to the dev image

Run,
```
docker exec -it phaserjs bash
```

Your local files should be mounted in the container,
```
ls
Dockerfile  LICENSE  README.md	assets	bin  doc  index.html  lib  package.json  src  tsconfig.json  webpack.config.js
```

