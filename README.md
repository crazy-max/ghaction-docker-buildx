[![GitHub release](https://img.shields.io/github/release/crazy-max/ghaction-docker-buildx.svg?style=flat-square)](https://github.com/crazy-max/ghaction-docker-buildx/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-docker--buildx-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/docker-buildx)
[![Release workflow](https://github.com/crazy-max/ghaction-docker-buildx/workflows/release/badge.svg)](https://github.com/crazy-max/ghaction-docker-buildx/actions)
[![Test workflow](https://github.com/crazy-max/ghaction-docker-buildx/workflows/test/badge.svg)](https://github.com/crazy-max/ghaction-docker-buildx/actions)
[![Support me on Patreon](https://img.shields.io/badge/donate-patreon-f96854.svg?logo=patreon&style=flat-square)](https://www.patreon.com/crazymax) 
[![Paypal Donate](https://img.shields.io/badge/donate-paypal-00457c.svg?logo=paypal&style=flat-square)](https://www.paypal.me/crazyws)

## ✨ About

GitHub Action to set up Docker [Buildx](https://github.com/docker/buildx).

> **:warning: Note:** To use this action, you must have access to the [GitHub Actions](https://github.com/features/actions) feature. GitHub Actions are currently only available in public beta. You can [apply for the GitHub Actions beta here](https://github.com/features/actions/signup/).

## 🚀 Usage

Below is a simple snippet to use this action. A [live example](https://github.com/crazy-max/ghaction-docker-buildx/actions) is also available for this repository.

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
        uses: actions/checkout@v1
      -
        name: Set up Docker Buildx
        id: buildx
        uses: crazy-max/ghaction-docker-buildx@v1
        with:
          version: latest
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

## 💅 Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name          | Type    | Default   | Description                        |
|---------------|---------|-----------|------------------------------------|
| `version`     | String  | `latest`  | Buildx version. Example: `v0.3.0`  |

### outputs

Following outputs are available

| Name          | Type    | Description                           |
|---------------|---------|---------------------------------------|
| `platforms`   | String  | Available platforms (comma separated) |

## :warning: Limitation

This action is only available for Linux [virtual environments](https://help.github.com/en/articles/virtual-environments-for-github-actions#supported-virtual-environments-and-hardware-resources).

## 🤝 How can I help ?

All kinds of contributions are welcome :raised_hands:!<br />
The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon:<br />
But we're not gonna lie to each other, I'd rather you buy me a beer or two :beers:!

[![Support me on Patreon](.res/patreon.png)](https://www.patreon.com/crazymax) 
[![Paypal Donate](.res/paypal.png)](https://www.paypal.me/crazyws)

## 📝 License

MIT. See `LICENSE` for more details.
