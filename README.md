[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-docker-buildx.svg?style=flat-square)](https://github.com/crazy-max/ghaction-docker-buildx/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-docker--buildx-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/docker-buildx)
[![Test workflow](https://img.shields.io/github/workflow/status/crazy-max/ghaction-docker-buildx/test?label=test&logo=github&style=flat-square)](https://github.com/crazy-max/ghaction-docker-buildx/actions?workflow=test)
[![Codecov](https://img.shields.io/codecov/c/github/crazy-max/ghaction-docker-buildx?logo=codecov&style=flat-square)](https://codecov.io/gh/crazy-max/ghaction-docker-buildx)
[![Become a sponsor](https://img.shields.io/badge/sponsor-crazy--max-181717.svg?logo=github&style=flat-square)](https://github.com/sponsors/crazy-max)
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## About

GitHub Action to set up Docker [Buildx](https://github.com/docker/buildx).

If you are interested, [check out](https://git.io/Je09Y) my other :octocat: GitHub Actions!

![GitHub Action to set up Docker Buildx](.github/ghaction-docker-buildx.png)

## Usage

```yaml
name: buildx

on:
  pull_request:
    branches: master
  push:
    branches: master
    tags:

jobs:
  buildx:
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@v2
      -
        name: Set up Docker Buildx
        id: buildx
        uses: crazy-max/ghaction-docker-buildx@v2
        with:
          buildx-version: latest
          skip-cache: false
          qemu-version: latest
      -
        name: Available platforms
        run: echo ${{ steps.buildx.outputs.platforms }}
      -
        name: Run Buildx
        run: |
          docker buildx build \
            --platform linux/386,linux/amd64,linux/arm/v6,linux/arm/v7,linux/arm64,linux/ppc64le,linux/s390x \
            --output "type=image,push=false" \
            --file ./test/Dockerfile ./test
```

## Projects using this action

* [Diun](https://github.com/crazy-max/diun)
* [GO Simple Tunnel](https://github.com/ginuerzh/gost)
* [RSSHub](https://github.com/DIYgod/RSSHub)
* [Cloudflared](https://github.com/crazy-max/docker-cloudflared)

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name             | Type    | Default   | Description                        |
|------------------|---------|-----------|------------------------------------|
| `buildx-version` | String  | `latest`  | [Buildx](https://github.com/docker/buildx) version. Example: `v0.3.0` |
| `skip-cache   `  | Bool    | `false`   | Skip cache of Buildx binary        |
| `qemu-version`   | String  | `latest`  | [qemu-user-static](https://github.com/multiarch/qemu-user-static) version (Docker tag). Example: `4.2.0-7` |

### outputs

Following outputs are available

| Name          | Type    | Description                           |
|---------------|---------|---------------------------------------|
| `platforms`   | String  | Available platforms (comma separated) |

### environment variables

The following [official docker environment variables](https://docs.docker.com/engine/reference/commandline/cli/#environment-variables) are supported:

| Name            | Type    | Default      | Description                                    |
|-----------------|---------|-------------|-------------------------------------------------|
| `DOCKER_CONFIG` | String  | `~/.docker` | The location of your client configuration files |

## Limitation

This action is only available for Linux [virtual environments](https://help.github.com/en/articles/virtual-environments-for-github-actions#supported-virtual-environments-and-hardware-resources).

## How can I help?

All kinds of contributions are welcome :raised_hands:! The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon: You can also support this project by [**becoming a sponsor on GitHub**](https://github.com/sponsors/crazy-max) :clap: or by making a [Paypal donation](https://www.paypal.me/crazyws) to ensure this journey continues indefinitely! :rocket:

Thanks again for your support, it is much appreciated! :pray:

## License

MIT. See `LICENSE` for more details.
