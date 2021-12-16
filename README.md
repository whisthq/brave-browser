Whist README
=============

This repository is Whist's fork of `brave-browser`, with a few modifications. We forked `brave-browser` so that we could build Whist integrated within Chromium on top of Brave, to benefit from Brave's features and development pipeline.

## Whist Changelog

Nothing yet! When we make changes, we'll add the list here.

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
3. Resolve merge conflicts, if any arise, and push to the Whist FFmpeg repository
```
git push origin <current branch>
```

## Building

To see building in action on all OSes, with the flags currently used in production, you can refer to `build-and-publish-ffmpeg.yml`.

### macOS

To build FFmpeg on macOS, first install Homebrew and the FFmpeg dependencies via `brew install x264 ...`. See `build-and-publish.yml` for the full list of dependencies to install.

Then, run `./configure` with the desired flags. See `build-and-publish.yml` for the full list of flags used in production.

To customize the build, run `./configure --help` or read `configure` to see what flags are available. Finally, run `make`. The libraries will be in the `libavcodec`, `libavdevice`, etc. folders.

### Linux Ubuntu 20.04 (via Docker)

To build FFmpeg targeting Linux Ubuntu 20.04 inside of a Docker container, install and setup `docker` on your machine, then run `./docker-build.sh 20.04`. Currently, only Ubuntu 20.04 is supported, via `Dockerfile.20`, for consistency with our infrastructure in `whisthq/whist`.

The built dynamic libraries will appear in the `docker-builds` folder. The Docker build script contains the flags we use when building on Linux, so if you want to build static libraries or enable/disable different components, you must modify `docker-build.sh`. As above, to see what flags are valid, run `./configure --help` or read the `configure` file.

### Windows

We use Media Autobuild Suite to compile FFmpeg on Windows, whose `media-autobuild_suite.bat` file is the equivalent of `./configure && make` on Unix.

First, clone `https://github.com/whisthq/media-autobuild_suite` into `C:\media-autobuild_suite` and `cd` into the folder; our own fork uses our fork of FFmpeg rather than upstream FFmpeg. Then, copy all files except the `.ps1` script in this repository's `.github/workflows/helpers/` to the `build/` directory in `C:\media-autobuild_suite`. You should not need to touch the `.sh` scripts. Configuration is done through `media-autobuild_suite.ini`, `ffmpeg_options.txt`, and `mpv_options.txt`. The `options.txt` files contain compile flags for their respective programs. You should feel free to comment/uncomment flags, and add new ones under the Whist-added options heading, to modify the build settings. Please only enable the minimum required flags, to keep libraries as small as possible. The `.ini` file contains Media Autobuild Suite options. The options in the `.ini` file are documented in `media-autobuild_suite.bat`. Importantly, to build shared or static libraries, you MUST change `ffmpegB2` instead of changing the flags in `ffmpeg_options.txt`.

Then, make sure CUDA is installed. You can install the desired version of CUDA either through the Nvidia website or using the `install_cuda_windows.ps1` script in `.github/workflows/helpers/`. Before running the script, set `$env:cuda` to the desired version you want.

Finally, run `media-autobuild_suite.bat`. The first build will take a while, probably at least an hour, because the batch file also needs to install a lot of packages via `msys2`. The shared libraries will be in `local64/bin-video` and static libraries will be in `local64/lib`.

## Publishing

For every push to `main`, for instance when we pull the latest changes from upstream or if we make changes to FFmpeg and merge to `main`, the shared version of FFmpeg on Windows, macOS and Linux Ubuntu will be built and published to AWS S3, via the GitHub Actions workflow `.github/workflows/build-and-publish-ffmpeg.yml`, from where the Whist protocol retrieves its libraries. The newly-uploaded FFmpeg libraries and headers will be automatically deployed with the next `whisthq/whist` update. Note that not all header files are needed; see the YAML workflow for which ones the Whist Protocol uses. **Only stable changes should make it to `main`.**

See the Changelog above for the list of changes on top of the public version of FFmpeg that are incorporated in our internal Whist version of FFmpeg.

---



Brave README
=============

## Overview

This repository holds the build tools needed to build the Brave desktop browser for macOS, Windows, and Linux.  In particular, it fetches and syncs code from the projects we define in `package.json` and `src/brave/DEPS`:

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

* iOS - [brave/brave-ios](https://github.com/brave/brave-ios)

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
git clone git@github.com:brave/brave-browser.git
cd brave-browser
npm install

# this takes 30-45 minutes to run
# the Chromium source is downloaded which has a large history
npm run init
```
brave-core based android builds should use `npm run init -- --target_os=android --target_arch=arm` (or whatever cpu type you want to build for)

You can also set the target_os and target_arch for init and build using

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

Running a release build with `npm run build Release` can be very slow and use a lot of RAM especially on Linux with the Gold LLVM plugin.

To run a statically linked build (takes longer to build, but starts faster)

```bash
npm run build -- Static
```

To run a debug build (Component build with is_debug=true)

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
|`[no flags]`|updates chromium if needed and re-applies patches. If the chromium version did not change it will only re-apply patches that have changed. Will update child dependencies **only if any project needed updating during this script run** <br> **Use this if you want the script to manage keeping you up to date instead of pulling or switching branch manually. **|
|`--force`|updates both _Chromium_ and _brave-core_ to the latest remote commit for the current brave-core branch and the _Chromium_ ref specified in brave-browser/package.json (e.g. `master` or `74.0.0.103`). Will re-apply all patches. Will force update all child dependencies <br> **Use this if you're having trouble and want to force the branches back to a known state. **|
|`--init`|force update both _Chromium_ and _brave-core_ to the versions specified in brave-browser/package.json and force updates all dependent repos - same as `npm run init`|
|`--ignore_chromium`|Will not update the chromium version when applicable. Useful if you want to avoid a minor update when not ready for the larger build time a chromium update may result in. A warning will be output about the current code state expecting a different chromium version. Your build may fail as a result.|


Run `npm run sync brave_core_ref` to checkout the specified _brave-core_ ref and update all dependent repos including chromium if needed

### Scenarios

#### Create a new branch

```bash
brave-core> git checkout -b branch_name
```

### Checkout an existing branch or tag

```bash
brave-core> git fetch origin
brave-core> git checkout [-b] branch_name
brave-core> npm run sync
...Updating 2 patches...
...Updating child dependencies...
...Running hooks...
```

### Update the current branch to latest remote

```bash
brave-core> git pull
brave-core> npm run sync
...Updating 2 patches...
...Updating child dependencies...
...Running hooks...
```

#### Reset to latest brave-browser master, and brave-core master (via `init`, will always result in a longer build and will remove any pending changes in your brave-core working directory)

```bash
brave-browser> git checkout master
brave-browser> git pull
brave-browser> npm run sync -- --init
```

#### When you know that DEPS didn't change, but .patch files did (quickest attempt to perform a mini-sync before a build)

```bash
brave-core> git checkout featureB
brave-core> git pull
brave-browser> npm run apply_patches
...Applying 2 patches...
```

# Enabling third-party APIs:

1. **Google Safe Browsing**: Get an API key with SafeBrowsing API enabled from https://console.developers.google.com/. Update the `GOOGLE_API_KEY` environment variable with your key as per https://www.chromium.org/developers/how-tos/api-keys to enable Google SafeBrowsing.

# Troubleshooting

See [Troubleshooting](https://github.com/brave/brave-browser/wiki/Troubleshooting) for solutions to common problems.
