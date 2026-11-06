<div align="center">

# Angel X

**A minimalist, hardware-accelerated desktop AI overlay for Windows.**  
*Real-time screen reasoning, dual-channel meeting transcription, and zero-distraction workflow co-piloting — engineered to stay invisible during screen shares.*

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-22d3ee.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011%20x64-38bdf8.svg?style=flat-square)](https://github.com/MauryaKandula/angel-x)
[![Author](https://img.shields.io/badge/Author-Maurya%20Kandula-f43f5e.svg?style=flat-square)](https://github.com/MauryaKandula)
[![Tests](https://img.shields.io/badge/Tests-562%20Passing-34d399.svg?style=flat-square)](test/)
[![Protection](https://img.shields.io/badge/Stealth-WDA__EXCLUDEFROMCAPTURE-a855f7.svg?style=flat-square)](#screen-share-invisibility)

[Features](#features) • [Quick Start](#quick-start) • [Keyboard Shortcuts](#keyboard-shortcuts) • [Model Setup](#model-configuration-byok) • [Architecture](#architecture) • [License](#license)

</div>

---

## Overview

**Angel X** is a desktop assistant that lives directly in your line of sight without getting in the way. It collapses into an ultra-compact 75px pill bar at the top of your screen and expands on demand when you need code analysis, meeting notes, or screen reasoning.

Unlike web-based assistants or bulky sidebar panels, Angel X runs as a native transparent overlay with full mouse click-through support and native OS-level screen protection.

```
+-----------------------------------------------------------------------------------------+
|  [::: Angel X]  (?)  (*)  [v Hide]  [> Start session]  [⚡ GPT API]  [↔]  [🖱]  [📌]  [✕]  |
+-----------------------------------------------------------------------------------------+
```

---

## Features

### 🪟 Minimalist Floating HUD
- **Zero-Blur Transparent Glass:** Deep obsidian background (`rgba(6, 10, 20, 0.94)`) with high-contrast text. No muddy blur rectangles or smearing over background video and code.
- **Dynamic Collapse & Expand:** Rests in a 75px top bar when idle. Automatically expands to 600px when you ask a question or review transcripts, and snaps back when hidden.
- **Continuous Opacity Control:** Adjust background transparency from 0% (floating wireframe text) to 100% (solid obsidian) via the toolbar slider or hotkey presets.

### 🛡️ Screen Share Invisibility
- **Native DWM Protection:** Leverages Windows `WDA_EXCLUDEFROMCAPTURE` (`win.setContentProtection(true)`).
- **Private by Default:** Completely hidden from Discord, Zoom, Microsoft Teams, Google Meet, OBS Studio, and Windows Snipping Tool. Only you see it on your physical monitor.

### 🖱️ Mouse Click-Through
- **Work Directly Beneath the Window:** Press `Ctrl+Shift+I` to let all mouse events pass straight through to your browser, IDE, or terminal.
- **Emergency Escape:** Press `Ctrl+Shift+F12` anytime to instantly restore mouse interactivity.

### 🎙️ Local Whisper Speech-to-Text
- **On-Device GPU Acceleration:** Embedded `whisper.cpp` sidecar runs locally on your GPU (NVIDIA RTX / CUDA) with zero audio data leaving your machine.
- **Two-Way Audio Capture:** Records both your microphone input ("You") and system audio output ("Them") through Windows WASAPI loopback capture.
- **Automated Meeting Notes:** Formats live discussions into concise summaries, decision records, and action items saved to local storage.

### ⚡ Universal Model Gateway (BYOK)
- **Direct Provider Integration:** Bring your own keys for:
  - **OpenAI:** GPT-4o, o1, o3-mini, GPT-4o-mini
  - **Anthropic:** Claude 3.5 Sonnet, Claude 3.7 Sonnet, Claude 3.5 Haiku
  - **Google Gemini:** Gemini 2.0 Flash, Gemini 1.5 Pro
  - **Groq & DeepSeek:** High-throughput streaming
  - **Local Models:** Connect directly to local Ollama or vLLM endpoints via standard OpenAI-compatible format.

---

## Quick Start

### Option 1: Standalone Installer & Portable Executable

Download the latest release from the [Releases](https://github.com/MauryaKandula/angel-x/releases) page:
- **Installer:** `Angel X-win-x64.exe` (standard Windows setup wizard with desktop shortcut)
- **Portable:** `dist/win-unpacked/Angel X.exe` (run directly without installation)

### Option 2: Run from Source

**Requirements:** Node.js 22.12+ (LTS recommended) and Windows 10/11 x64.

```bash
# Clone the repository
git clone https://github.com/MauryaKandula/angel-x.git
cd angel-x

# Install dependencies
npm install

# Launch Angel X
npm start
```

You can also use the one-click Windows batch launcher:
```cmd
.\start-angel.bat
```

---

## Keyboard Shortcuts

Angel X binds global system shortcuts for instant access from any application:

| Shortcut | Action | Description |
|---|---|---|
| `Ctrl + Shift + Enter` | **Smart Assist** | Scans current screen region and active conversation to suggest next actions |
| `Ctrl + Enter` | **What should I say?** | Analyzes the last spoken statement and proposes an immediate talking point |
| `Ctrl + H` | **Solve Screen Problem** | Captures active editor/screen region and provides a code solution |
| `Ctrl + Shift + M` | **Compact Mode** | Toggles HUD between minimal floating bar and full view |
| `Ctrl + Shift + I` | **Click-Through** | Enables hardware mouse event pass-through |
| `Ctrl + Shift + F12` | **Restore Mouse** | Emergency reset to bring mouse control back to Angel X |
| `Ctrl + Shift + X` | **Quit Application** | Cleanly terminates the overlay and background sidecars |

---

## Model Configuration (BYOK)

All credentials are saved locally in encrypted storage and never leave your device.

1. Click the **⚡ GPT [API]** button on the floating bar (or click the Settings gear icon `⚙️`).
2. Navigate to the **Keys** tab and choose your provider:
   - **OpenAI:** Enter your `sk-...` API key.
   - **Anthropic:** Enter your `sk-ant-...` API key.
   - **Google Gemini:** Enter your Gemini API key.
   - **Local / Self-Hosted (Ollama):** Select Custom endpoint, enter your Base URL (e.g., `http://localhost:11434/v1`), and specify your model tag.
3. Click **Done** to persist settings.

---

## Architecture

```
                 +-----------------------------------------+
                 |          Angel X Top HUD (Bar)          |
                 |     Electron Layered Frameless Window   |
                 +--------------------+--------------------+
                                      | IPC
                 +--------------------v--------------------+
                 |          Main Process (Node.js)         |
                 |   - WDA_EXCLUDEFROMCAPTURE Affinity     |
                 |   - Dynamic Bounds Hugging (75px)       |
                 |   - Global Keyboard Hook Dispatcher     |
                 +----------+-------------------+----------+
                            |                   |
            +---------------v-------+   +-------v------------------+
            |  Audio Loopback (STT) |   |    LLM Gateway Client    |
            |   - WASAPI Loopback   |   |   - OpenAI / Anthropic   |
            |   - Local Whisper.cpp |   |   - Gemini / DeepSeek    |
            |   - Microphone Stream |   |   - Local Ollama / vLLM  |
            +-----------------------+   +--------------------------+
```

---

## Build Targets

```bash
# Build standalone unpacked folder (dist/win-unpacked/Angel X.exe)
npm run pack:win

# Build Windows NSIS setup installer (dist/Angel X-win-x64.exe)
npm run dist:win

# Run complete automated test suite
npm test
```

---

## License & Attribution

Angel X is open source under the **GNU General Public License v3.0 (GPL-3.0-or-later)**.

- **Author & Maintainer:** **Kandula Paul Saketh Maurya** ([@MauryaKandula](https://github.com/MauryaKandula))
- **Copyright:** Copyright (C) 2026 Kandula Paul Saketh Maurya.
- **Portions Copyright:** Portions Copyright (C) 2025-2026 Cue Contributors.

See [`LICENSE`](LICENSE) for complete terms.
