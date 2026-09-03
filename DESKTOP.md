# Pop!_OS desktop build

The desktop app uses Tauri 2 and bundles the Expo web export locally. The NeetCode roadmap, progress, and notes work without a network connection. Codeforces features require internet access.

## One-time Pop!_OS prerequisites

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

Rust is installed through `rustup`. Open a new terminal after installing it, or load it in the current terminal with:

```bash
source "$HOME/.cargo/env"
```

## Run during development

```bash
npm run desktop:dev
```

## Create Linux packages

```bash
npm run desktop:build
```

The `.deb` and AppImage files are created under `src-tauri/target/release/bundle/`.
