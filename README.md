<div align="center">

<img src="build-resources/icon.png" width="160" alt="Angel X Icon" />

```
   █████╗ ███╗   ██╗ ██████╗ ███████╗██╗     ██╗  ██╗
  ██╔══██╗████╗  ██║██╔════╝ ██╔════╝██║     ╚██╗██╔╝
  ███████║██╔██╗ ██║██║  ███╗█████╗  ██║      ╚███╔╝ 
  ██╔══██║██║╚██╗██║██║   ██║██╔══╝  ██║      ██╔██╗ 
  ██║  ██║██║ ╚████║╚██████╔╝███████╗███████╗██╔╝ ██╗
  ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
       T R A N S P A R E N T   D E S K T O P   A I   H U D
```

### Next-Generation Transparent HUD Assistant for Windows

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-00f0ff.svg?style=for-the-badge&logo=gnu)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011%20x64-fcee0a.svg?style=for-the-badge&logo=windows)](https://github.com/MauryaKandula/angel-x)
[![Author](https://img.shields.io/badge/Author-Maurya%20Kandula-ff0055.svg?style=for-the-badge&logo=github)](https://github.com/MauryaKandula)
[![Tests](https://img.shields.io/badge/Tests-562%20Passing-00ff9f.svg?style=for-the-badge&logo=node.js)](test/)
[![Stealth](https://img.shields.io/badge/Stealth-WDA__EXCLUDEFROMCAPTURE-9d4edd.svg?style=for-the-badge)](README.md#screen-share-invisibility)

**Angel X** is a high-performance transparent desktop AI overlay for Windows. Designed to float unobtrusively on top of your workspace, Angel X gives you real-time visual reasoning, screen problem-solving, live meeting transcription, and conversational co-piloting — while remaining completely invisible to screen recording and screen sharing tools.

[Key Features](#key-features) • [Installation](#installation) • [Shortcuts](#global-shortcuts) • [API Setup](#byok-ai-model-matrix) • [Architecture](#architecture) • [License](#license)

</div>

---

## ⚡ Key Features

### 1. 🪟 Minimalist Floating HUD Bar
- **Ultra-Compact 75px Footprint:** Starts collapsed into a sleek, floating pill bar hugging the top of your screen. Expands dynamically when asking questions or reviewing transcripts.
- **Zero-Blur Laser Sharp Obsidian:** No muddy milky smearing across video playback or desktop windows. Powered by high-contrast obsidian RGBA styling with electric cyan (`#00f0ff`) and amber (`#fcee0a`) accents.
- **0% to 100% Background Opacity Slider:** Dial in your exact transparency from 0% pure floating wireframe text to 100% solid obsidian HUD directly from the toolbar slider or settings.

### 2. 🛡️ Native Screen Share Invisibility
- **`WDA_EXCLUDEFROMCAPTURE` Hardware Protection:** Excludes the Angel X window from Windows Desktop Duplication, BitBlt, PrintWindow, and DirectX capture pipelines.
- **Stealth During Meetings:** Invisible on Discord, Zoom, Microsoft Teams, Google Meet, OBS Studio, and Windows Snipping Tool. Your AI stays private to your physical display.

### 3. 🖱️ Click-Through Mode
- **Zero-Interference Overlay:** Hit `Ctrl+Shift+I` to make Angel X transparent to all mouse clicks. Work, code, and game directly beneath the overlay while keeping AI guidance in your line of sight.
- **Fail-Safe Recovery:** Dedicated indicator banner with emergency restore shortcut (`Ctrl+Shift+F12`) and tray restoration.

### 4. 🧠 Universal GPT & LLM Matrix (BYOK)
- **Direct Multi-Provider Support:** Plug in your own API keys for:
  - **OpenAI:** GPT-4o, o1, o3-mini, GPT-4o-mini
  - **Anthropic:** Claude 3.5 Sonnet, Claude 3.7 Sonnet, Claude 3.5 Haiku
  - **Google Gemini:** Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash
  - **Groq & DeepSeek:** Ultra-fast sub-second token generation
  - **Local Ollama / vLLM:** Complete offline privacy via custom OpenAI-compatible endpoints
- **Quick Chip Access:** Click the glowing `⚡ GPT [API]` badge directly on the toolbar to access and edit keys on the fly.

### 5. 🎙️ Dual-Channel Speech-to-Text Loopback
- **Local CUDA Whisper Sidecar:** Runs a checksum-verified `whisper.cpp` engine locally on your GPU (e.g. NVIDIA RTX 3060) without sending raw audio to cloud servers.
- **Two-Way Audio Capture:** Captures your microphone ("You") and incoming call audio ("Them") via Windows WASAPI loopback capture.
- **Live Meeting Notes:** Automatically summarizes conversations, extracts action items, and stores session transcripts locally.

---

## 🚀 Installation & Running

### Method 1 — One-Click Launch (Recommended)

Clone the repository and run the standalone Windows launcher:

```powershell
git clone https://github.com/MauryaKandula/angel-x.git
cd angel-x
npm install
.\start-angel.bat
```

> **Tip:** You can also run `.\start-angel.ps1` from PowerShell.

### Method 2 — Building Standalone Windows Executable

To build a native Windows NSIS installer or unpacked portable executable:

```bash
# Build unpacked Windows portable directory (dist/win-unpacked/Angel X.exe)
npm run pack:win

# Build official Windows NSIS Installer (.exe)
npm run dist:win
```

The resulting installer will be located in the `dist/` directory.

---

## ⌨️ Global Shortcuts

Angel X responds to system-wide global shortcuts, allowing instantaneous interaction from any application:

| Shortcut | Action | Description |
|---|---|---|
| `Ctrl + Shift + Enter` | **Smart Assist** | Takes a screenshot + reviews recent conversation to suggest next actions |
| `Ctrl + Enter` | **What should I say?** | Analyzes what the speaker just said and suggests the best response |
| `Ctrl + H` | **Solve Problem** | Captures active screen region and generates a code solution |
| `Ctrl + Shift + M` | **Compact Mode** | Toggles the HUD between ultra-minimal bar and expanded view |
| `Ctrl + Shift + I` | **Click-Through** | Enables mouse click-through mode |
| `Ctrl + Shift + F12` | **Emergency Escape** | Immediately restores mouse interaction from click-through mode |
| `Ctrl + Shift + X` | **Quit Angel X** | Instantly closes the Angel X overlay |

---

## ⚙️ BYOK AI Model Matrix Setup

Angel X supports both direct API keys and self-hosted local endpoints.

1. Launch Angel X.
2. Click the `⚡ GPT [API]` chip on the floating toolbar (or click the Settings gear icon `⚙️`).
3. Under the **Keys / Provider** tab, select your preferred engine:
   - **OpenAI:** Enter your `sk-...` API key. Default: `gpt-4o-mini` (fast) / `gpt-4o` (smart).
   - **Anthropic:** Enter your `sk-ant-...` key. Default: `claude-3-5-sonnet-20241022`.
   - **Google Gemini:** Enter your Gemini API key. Default: `gemini-2.0-flash`.
   - **Custom / Local (Ollama, vLLM, Groq):** Provide Base URL (e.g., `http://localhost:11434/v1`) and Model Name.
4. Click **Done** — settings persist locally in encrypted storage.

---

## 🏗️ Architecture

```
                    ┌──────────────────────────────────┐
                    │       Angel X Desktop HUD        │
                    │   (Electron Frameless Window)    │
                    └─────────────────┬────────────────┘
                                      │ IPC Bridge
                    ┌─────────────────▼────────────────┐
                    │       Main Process (Node.js)      │
                    │  • WDA_EXCLUDEFROMCAPTURE        │
                    │  • Global Shortcut Dispatcher    │
                    │  • Window Geometry Manager       │
                    └───────┬──────────────────┬───────┘
                            │                  │
            ┌───────────────▼────────┐  ┌──────▼─────────────────┐
            │   Audio & STT Engine   │  │   LLM Multi-Gateway    │
            │  • WASAPI Loopback     │  │  • OpenAI (GPT-4o/o1)  │
            │  • Local Whisper.cpp   │  │  • Anthropic Claude    │
            │  • System Microphone   │  │  • Gemini & Ollama     │
            └────────────────────────┘  └────────────────────────┘
```

- **Transparent Compositor:** Built on Electron with DirectComposition alpha blending and `hasShadow: false` to eliminate rectangular drop-shadow artifacts.
- **Sidecar Whisper Architecture:** Embedded C++ whisper binary running out-of-process for zero interference with renderer framerates.
- **Automated Test Suite:** 562 unit tests verifying model failover, streaming token parsing, window positioning, and settings persistence.

---

## 🧪 Verification & Testing

To run the complete automated test suite:

```bash
npm test
```

Expected output:
```
ℹ tests 562
ℹ suites 0
ℹ pass 562
ℹ fail 0
```

---

## 📜 Legal & License

**Angel X** is released under the **GNU General Public License v3.0 (GPL-3.0-or-later)**.

- **Primary Author & Maintainer:** **Kandula Paul Saketh Maurya (MK)** ([@MauryaKandula](https://github.com/MauryaKandula))
- **Copyright:** Copyright (C) 2026 Kandula Paul Saketh Maurya.
- **Portions Copyright:** Portions Copyright (C) 2025-2026 Cue Contributors.

See [`LICENSE`](LICENSE) for full legal terms.

---

<div align="center">
  <sub>Engineered by Kandula Paul Saketh Maurya • Built for power users, developers, and creators.</sub>
</div>
