# Whist README

This repository is Whist's fork of `brave-browser`, with a few modifications. We forked `brave-browser` so that we could build Whist integrated within Chromium on top of Brave, to benefit from Brave's features and development pipeline.

## Whist Changelog

Nothing yet! When we make changes, we'll add them to the list here.

## Development

Before building or modifying the code, you should pull the latest changes from the public [`brave/brave-browser`](https://github.com/brave/brave-browser) repository that this repository is forked from. To setup your repository, follow these steps:

1. Clone and enter the repository

```
git clone https://github.com/whisthq/brave-browser && cd brave-browser
```

2. Add the upstream repository as a remote

```
git remote add upstream https://github.com/brave/brave-browser
```

3. Disable pushing to upstream Brave Browser

```
git remote set-url --push upstream DISABLE
```

After this, you should be able to list your remotes with `git remote -v` if you ever need to debug.

Since Brave Browser is a large and active project, we will very often want to work with the latest upstream code; meanwhile, we need to make sure that our own repository has a sane commit history -- we cannot simply periodically merge the latest Brave Browser on top of our own modifications.

Instead, perform the following steps to incorporate changes from upstream:

1. Fetch the latest changes to the `upstream` remote

```
git fetch upstream
```

2. Rebase on top of your current work

```
git rebase upstream/master
# git rebase upstream/<desired branch> for other upstream branches
```

3. Resolve merge conflicts, if any arise, and push to the Whist Brave Browser repository

```
git push origin <current branch>
```

## Building

We currently don't have a pipeline to build this project in CI. To build this project for local development, first configure your environment for building Brave (Chromium, really): 

- You need a NodeJS LTS version to build Brave. As of writing, this is NodeJS 16.x. Note that some build commands might still work if you don't have that version, and things will fail later on with cryptic errors, so it is better to make sure you are on the right version at the start. We recommend that you install Node Version Manager via `brew install nvm` or `apt-get install nvm` to easily manage your NodeJS versions. You can then install a specific version of NodeJS, here `nvm install 16`, and switch to it via `nvm use 16`. 

- If you are building on macOS, you also need to have Xcode fully installed (both the application and the CLI tools). You can install the application from the macOS App Store, and you can install the CLI tools via `xcode-select --install` in your terminal, once you have the Xcode application. Note that this will require >18GB of available storage.

- Lastly, building Brave requires >82GB of available storage. We recommend that you have at least 100GB of available storage on your device before starting to work on Brave/Chromium to avoid any issues.

Once you're ready, simply follow the instructions from the [Build Brave](#build-brave) section below!

## Publishing

We do not have a pipeline to publish this project in CI. Once we do, we will document it here.

---

# Brave README

## Overview

This repository holds the build tools needed to build the Brave desktop browser for macOS, Windows, and Linux.  In particular, it fetches and syncs code from the projects defined in `package.json` and `src/brave/DEPS`:

- [Chromium](https://chromium.googlesource.com/chromium/src.git)
  - Fetches code via `depot_tools`.
  - sets the branch for Chromium (ex: 65.0.3325.181).
- [brave-core](https://github.com/brave/brave-core)
  - Mounted at `src/brave`.
  - Maintains patches for 3rd party Chromium code.
- [adblock-rust](https://github.com/brave/adblock-rust)
  - Implements Brave's ad-block engine.
  - Linked through [brave/adblock-rust-ffi](https://github.com/brave/brave-core/tree/master/components/adblock_rust_ffi).

## Downloads

You can [visit our website](https://brave.com/download) to get the latest stable release.

## Other repositories

For other versions of our browser, please see:

- iOS - [brave/brave-ios](https://github.com/brave/brave-ios)

## Contributing

Please see the [contributing guidelines](./CONTRIBUTING.md).

## Community

[Join the Q&A community](https://community.brave.com/) if you'd like to get more involved with Brave. You can [ask for help](https://community.brave.com/c/support-and-troubleshooting),
[discuss features you'd like to see](https://community.brave.com/c/brave-feature-requests), and a lot more. We'd love to have your help so that we can continue improving Brave.

Help us translate Brave to your language by submitting translations at https://www.transifex.com/brave/brave/.

Follow [@brave](https://twitter.com/brave) on Twitter for important news and announcements.

## Install prerequisites

Follow the instructions for your platform:

- [macOS](https://github.com/brave/brave-browser/wiki/macOS-Development-Environment)
- [Windows](https://github.com/brave/brave-browser/wiki/Windows-Development-Environment)
- [Linux/Android](https://github.com/brave/brave-browser/wiki/Linux-Development-Environment)

## Clone and initialize the repo

Once you have the prerequisites installed, you can get the code and initialize the build environment.

```bash
git clone git@github.com:whisthq/brave-browser.git
cd brave-browser
npm install

# the Chromium source is downloaded, which has a large history
# this might take really long to finish

npm run init
```
brave-core based android builds should use `npm run init -- --target_os=android --target_arch=arm` (or whichever CPU type you want to build for)

You can also set the target_os and target_arch for init and build using (for Android only! If you run this on macOS/another OS, it will break `npm run build`)

```
npm config set target_os android
npm config set target_arch arm
```

## Build Brave

The default build type is component.

```
# start the component build compile
npm run build
```

To do a release build:

```
# start the release compile
npm run build Release
```

brave-core based android builds should use `npm run build -- --target_os=android --target_arch=arm` or set the npm config variables as specified above for `init`

### Build Configurations

Running a release build with `npm run build Release` can be very slow and use a lot of RAM, especially on Linux with the Gold LLVM plugin.

To run a statically linked build (takes longer to build, but starts faster):

```bash
npm run build -- Static
```

To run a debug build (Component build with is_debug=true):

```bash
npm run build -- Debug
```

Brave staff may also want to try [Goma](https://github.com/brave/devops/wiki/Faster-browser-builds#goma) for faster builds.

## Run Brave

To start the build:

`npm start [Release|Component|Static|Debug]`

# Update Brave

`npm run sync -- [--force] [--init] [--create] [brave_core_ref]`

**This will attempt to stash your local changes in brave-core, but it's safer to commit local changes before running this**

`npm run sync` will (depending on the below flags):

1. 📥 Update sub-projects (chromium, brave-core) to latest commit of a git ref (e.g. tag or branch)
2. 🤕 Apply patches
3. 🔄 Update gclient DEPS dependencies
4. ⏩ Run hooks (e.g. to perform `npm install` on child projects)

| flag | Description |
|---|---|
|`[no flags]`|updates chromium if needed and re-applies patches. If the chromium version did not change, it will only re-apply patches that have changed. Will update child dependencies **only if any project needed updating during this script run**. <br> **Use this if you want the script to manage keeping you up to date instead of pulling or switching branches manually. **|
|`--force`|updates both _Chromium_ and _brave-core_ to the latest remote commit for the current brave-core branch and the _Chromium_ ref specified in brave-browser/package.json (e.g. `master` or `74.0.0.103`). Will re-apply all patches. Will force update all child dependencies. <br> **Use this if you're having trouble and want to force the branches back to a known state. **|
|`--init`|force update both _Chromium_ and _brave-core_ to the versions specified in brave-browser/package.json and force updates all dependent repos - same as `npm run init`|
|`--ignore_chromium`|Will not update the chromium version when applicable. Useful if you want to avoid a minor update when not ready for the larger build time a chromium update may result in. A warning will be output about the current code state expecting a different chromium version. Your build may fail as a result.|


Run `npm run sync brave_core_ref` to checkout the specified _brave-core_ ref and update all dependent repos including chromium if needed.

## Scenarios

#### Create a new branch:
```bash
brave-core> git checkout -b branch_name
```

#### Checkout an existing branch or tag:
```bash
brave-core> git fetch origin
brave-core> git checkout [-b] branch_name
brave-core> npm run sync
...Updating 2 patches...
...Updating child dependencies...
...Running hooks...
```

#### Update the current branch to the latest remote:
```bash
brave-core> git pull
brave-core> npm run sync
...Updating 2 patches...
...Updating child dependencies...
...Running hooks...
```

#### Reset to latest brave-browser master and brave-core master (via `init`, will always result in a longer build and will remove any pending changes in your brave-core working directory):
```bash
brave-browser> git checkout master
brave-browser> git pull
brave-browser> npm run sync -- --init
```

#### When you know that DEPS didn't change, but .patch files did (quickest attempt to perform a mini-sync before a build):
```bash
brave-core> git checkout featureB
brave-core> git pull
brave-browser> npm run apply_patches
...Applying 2 patches...
```

# Enabling third-party APIs:

1. **Google Safe Browsing**: Get an API key with SafeBrowsing API enabled from https://console.developers.google.com/. Update the `GOOGLE_API_KEY` environment variable with your key as per https://www.chromium.org/developers/how-tos/api-keys to enable Google SafeBrowsing.

# Development
- Security rules: https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/security/rules.md

# Troubleshooting

See [Troubleshooting](https://github.com/brave/brave-browser/wiki/Troubleshooting) for solutions to common problems.
