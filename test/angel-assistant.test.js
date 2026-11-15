const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const { DEFAULTS, resolveShortcuts } = require('../src/shortcuts');
const { clampBackgroundOpacity, clampOpacity } = require('../src/store');

test('shortcuts includes compact and emergency click-through shortcuts', () => {
  assert.strictEqual(DEFAULTS.compact, 'CommandOrControl+Shift+M');
  assert.strictEqual(DEFAULTS.emergencyClickThrough, 'CommandOrControl+Shift+F12');
  const resolved = resolveShortcuts({});
  assert.strictEqual(resolved.compact, 'CommandOrControl+Shift+M');
  assert.strictEqual(resolved.emergencyClickThrough, 'CommandOrControl+Shift+F12');
});

test('clampBackgroundOpacity allows 0% to 100% (0.0 to 1.0)', () => {
  assert.strictEqual(clampBackgroundOpacity(0), 0);
  assert.strictEqual(clampBackgroundOpacity(0.5), 0.5);
  assert.strictEqual(clampBackgroundOpacity(1.0), 1.0);
  assert.strictEqual(clampBackgroundOpacity(-0.5), 0);
  assert.strictEqual(clampBackgroundOpacity(1.5), 1.0);
  assert.strictEqual(clampBackgroundOpacity('invalid'), 0.85); // default fallback
});

test('clampOpacity retains minimum 0.2 for backwards compatibility', () => {
  assert.strictEqual(clampOpacity(0.1), 0.2);
  assert.strictEqual(clampOpacity(0.85), 0.85);
  assert.strictEqual(clampOpacity(1.0), 1.0);
});

test('HTML structure includes Angel X overlay controls and GPT toolbar', () => {
  const html = fs.readFileSync(path.join(__dirname, '../renderer/index.html'), 'utf8');
  assert.ok(html.includes('id="compact-btn"'), 'compact button in toolbar');
  assert.ok(html.includes('id="clickthrough-btn"'), 'click-through button in toolbar');
  assert.ok(html.includes('id="pin-btn"'), 'pin/always-on-top button in toolbar');
  assert.ok(html.includes('id="clickthrough-banner"'), 'clickthrough banner overlay');
  assert.ok(html.includes('id="resize-handle"'), 'custom resize handle');
  assert.ok(html.includes('id="tb-gpt-btn"'), 'quick GPT key and model button in toolbar');
  assert.ok(html.includes('id="tb-gpt-badge"'), 'GPT active badge in toolbar');
  assert.ok(html.includes('class="cyber-api-callout"'), 'HUD GPT API callout');
  assert.ok(html.includes('class="model-presets"'), 'quick model preset chips');
  assert.ok(html.includes('data-tab="shortcuts"'), 'shortcuts settings tab');
  assert.ok(html.includes('data-pane="shortcuts"'), 'shortcuts settings panel');
  assert.ok(html.includes('data-tab="context"'), 'docs & context settings tab');
  assert.ok(html.includes('data-pane="context"'), 'docs & context settings panel');
  assert.ok(html.includes('id="tb-context-btn"'), 'quick docs & context toolbar button');
  assert.ok(html.includes('id="pre-session-bar"'), 'pre-session prep & context banner');
  assert.ok(html.includes('id="upload-resume-btn"'), 'resume upload button');
  assert.ok(html.includes('id="upload-jd-btn"'), 'job description upload button');
  assert.ok(html.includes('id="upload-session-doc-btn"'), 'session context document upload button');
  assert.ok(html.includes('id="session-context"'), 'session context textarea');
  assert.ok(html.includes('id="resume-text"'), 'resume text textarea');
  assert.ok(html.includes('id="job-description"'), 'job description textarea');
  assert.ok(html.includes('id="s-always-on-top"'), 'always-on-top setting checkbox');
  assert.ok(html.includes('id="s-compact-mode"'), 'compact mode setting checkbox');
  assert.ok(html.includes('id="quick-gemini-key"'), 'quick Gemini key input');
  assert.ok(html.includes('id="quick-groq-key"'), 'quick Groq key input');
  assert.ok(html.includes('id="get-gemini-key-btn"'), 'get free Gemini key link button');
  assert.ok(html.includes('id="get-groq-key-btn"'), 'get free Groq key link button');
  assert.ok(html.includes('id="free-combo-badge"'), 'free combo active badge');
  assert.ok(html.includes('id="auto-answer-btn"'), 'live auto-answer toggle button');
  assert.ok(html.includes('id="tb-scan-btn"'), '1-click scan screen button in toolbar');
});

test('CSS styles support high-contrast transparent background and HUD theme', () => {
  const css = fs.readFileSync(path.join(__dirname, '../renderer/styles.css'), 'utf8');
  assert.ok(css.includes('--cue-bg-opacity'), 'variable for dynamic transparency');
  assert.ok(css.includes('text-shadow'), 'readable high-contrast text shadow for transparent overlays');
  assert.ok(css.includes('.compact-mode'), 'compact mode layout rules');
  assert.ok(css.includes('.clickthrough-banner'), 'click-through mode indicator style');
  assert.ok(css.includes('.resize-handle'), 'resize handle styling');
  assert.ok(css.includes('--cyber-cyan'), 'cyan accent token');
  assert.ok(css.includes('--cyber-yellow'), 'yellow accent token');
  assert.ok(css.includes('.tb-gpt-chip'), 'quick GPT access chip style');
  assert.ok(css.includes('.cyber-api-callout'), 'GPT API banner style');
});

test('preload bridge exposes Angel AI and GPT capabilities', () => {
  const preload = fs.readFileSync(path.join(__dirname, '../preload.js'), 'utf8');
  assert.ok(preload.includes('clickThroughToggle'), 'clickThroughToggle bridge');
  assert.ok(preload.includes('compactToggle'), 'compactToggle bridge');
  assert.ok(preload.includes('alwaysOnTopToggle'), 'alwaysOnTopToggle bridge');
  assert.ok(preload.includes('windowResize'), 'windowResize bridge');
  assert.ok(preload.includes('screenCaptureAnalyze'), 'screenCaptureAnalyze bridge');
  assert.ok(preload.includes('click-through:changed'), 'click-through:changed IPC event');
  assert.ok(preload.includes('compact:changed'), 'compact:changed IPC event');
  assert.ok(preload.includes('always-on-top:changed'), 'always-on-top:changed IPC event');
  assert.ok(preload.includes('settings:open-gpt'), 'settings:open-gpt IPC event');
});

test('tray and icon assets exist and are valid PNGs', () => {
  const trayIcon = fs.readFileSync(path.join(__dirname, '../build-resources/tray-icon.png'));
  const appIcon = fs.readFileSync(path.join(__dirname, '../build-resources/icon.png'));
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const pngSig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  assert.ok(trayIcon.subarray(0, 8).equals(pngSig), 'tray-icon.png is a valid PNG');
  assert.ok(appIcon.subarray(0, 8).equals(pngSig), 'icon.png is a valid PNG');
});

test('opacity chip selector only attaches to elements with data-val so preset chips never reset opacity to 0', () => {
  const renderer = fs.readFileSync(path.join(__dirname, '../renderer/renderer.js'), 'utf8');
  assert.ok(renderer.includes(".querySelectorAll('.opacity-chip, .s-opacity-presets .s-chip[data-val]')"), 'scoped opacity chip selector');
  assert.ok(!renderer.includes(".querySelectorAll('.opacity-chip, .s-chip')"), 'unscoped .s-chip opacity listener removed');
});

test('AppLinkServer falls back to PID-suffixed pipe on Windows EADDRINUSE instead of crashing', () => {
  const serverSrc = fs.readFileSync(path.join(__dirname, '../vendor/app-link/lib/server.js'), 'utf8');
  assert.ok(serverSrc.includes('error.code === "EADDRINUSE"'), 'handles EADDRINUSE on Windows named pipe');
  assert.ok(serverSrc.includes('`${pipePath}-${process.pid}`'), 'falls back to PID-suffixed pipe');
});

test('Mock test & MCQ screen scan uses vision-capable Groq fallback and image-aware prompt', () => {
  const { MODES } = require('../src/prompts');
  const { createLLM } = require('../src/llm');
  const prompt = MODES.assist.build({ transcript: [], userText: '', hasImage: true });
  assert.match(prompt, /mock test|multiple-choice|MCQ/i);
  const sys = MODES.assist.buildSystem(null);
  assert.match(sys, /MOCK TEST|EXAM|MCQ/i);

  const groqLlm = createLLM({ provider: 'groq', apiKeys: { groq: 'gsk_test_123' }, models: { groq: { fast: 'qwen/qwen3.8-27b' } } });
  assert.equal(groqLlm.visionModel, 'meta-llama/llama-4-scout-17b-16e-instruct');
});

test('Elongated toolbar and Settings layout prevent congestion and overlapping tabs', () => {
  const css = fs.readFileSync(path.join(__dirname, '../renderer/styles.css'), 'utf8');
  const mainSrc = fs.readFileSync(path.join(__dirname, '../main.js'), 'utf8');
  assert.match(mainSrc, /const MAIN_W = 880/);
  assert.ok(css.includes('--main-w: 880px;'), 'elongated panel width variable');
  assert.ok(css.includes('min-width: max-content'), 'settings tabs size to fit labels without overlapping');
  assert.ok(css.includes('.s-tab-pane > * { flex-shrink: 0; }'), 'settings inputs/textareas never collapse to slits');
});

test('Taskbar hiding and window invisibility preserve content protection and Angel.exe identity', () => {
  const mainSrc = fs.readFileSync(path.join(__dirname, '../main.js'), 'utf8');
  const renameSrc = fs.readFileSync(path.join(__dirname, '../scripts/rename-electron.js'), 'utf8');

  const skipTaskbarTrueMatches = mainSrc.match(/skipTaskbar:\s*true/g) || [];
  assert.ok(skipTaskbarTrueMatches.length >= 2, 'createWindow and createPermissionsWindow both set skipTaskbar: true');
  assert.ok(!/skipTaskbar:\s*false/.test(mainSrc), 'no BrowserWindow leaves skipTaskbar: false');
  assert.ok(mainSrc.includes('win.setSkipTaskbar(true);'), 'explicit win.setSkipTaskbar(true)');
  assert.ok(mainSrc.includes('permWin.setSkipTaskbar(true);'), 'explicit permWin.setSkipTaskbar(true)');
  assert.ok(mainSrc.includes('win.setContentProtection(true);'), 'preserves win.setContentProtection(true)');

  assert.ok(renameSrc.includes("const DISPLAY_NAME = 'Angel.exe';"), 'keeps Angel.exe display name');
  assert.ok(!/msmp\.exe/i.test(renameSrc), 'never masks process or binary as msmp.exe');
  assert.ok(!/msmp\.exe/i.test(mainSrc), 'main.js never masks process as msmp.exe');
});

test('AudioWorklet processor uses 2048-sample chunks and applies Float32 RMS AGC safely', () => {
  const vm = require('node:vm');
  const src = fs.readFileSync(path.join(__dirname, '../renderer/audio-worklet-processor.js'), 'utf8');

  let RegisteredClass = null;
  class StubAudioWorkletProcessor {
    constructor() {
      this.posted = [];
      this.port = { postMessage: (buf) => this.posted.push(new Int16Array(buf)) };
    }
  }
  const ctx = vm.createContext({
    AudioWorkletProcessor: StubAudioWorkletProcessor,
    Float32Array,
    Int16Array,
    Math,
    registerProcessor: (_name, cls) => { RegisteredClass = cls; }
  });
  vm.runInContext(src, ctx);
  assert.ok(RegisteredClass, 'processor registered');

  const proc = new RegisteredClass();
  assert.strictEqual(proc._bufferSize, 2048);

  const feedConstant = (amp, samples = 2048) => {
    proc.posted.length = 0;
    for (let offset = 0; offset < samples; offset += 128) {
      const len = Math.min(128, samples - offset);
      const block = new Float32Array(len).fill(amp);
      proc.process([[block]], [], {});
    }
    return proc.posted[proc.posted.length - 1];
  };

  // Quiet speech (rms = 0.01 in [0.0018, 0.09)) -> gain = min(4.0, 0.09 / 0.01) = 4.0 -> 0.04 -> ~1310
  const quietOut = feedConstant(0.01);
  assert.strictEqual(quietOut.length, 2048);
  assert.ok(quietOut[0] >= 1300 && quietOut[0] <= 1320, `expected ~4x gain (got ${quietOut[0]})`);

  // Moderate quiet speech (rms = 0.045) -> gain = 0.09 / 0.045 = 2.0 -> 0.09 -> ~2949
  const midOut = feedConstant(0.045);
  assert.ok(midOut[0] >= 2935 && midOut[0] <= 2960, `expected 2x gain to 0.09 target (got ${midOut[0]})`);

  // Near-silence noise floor (rms = 0.0005 < 0.0018) -> gain = 1.0 -> ~16
  const silenceOut = feedConstant(0.0005);
  assert.ok(silenceOut[0] <= 25, `silence should not be amplified (got ${silenceOut[0]})`);

  // Loud signal (rms = 0.5 >= 0.09, and >1.0 clamp edge) -> gain = 1.0, clamped [-32768, 32767]
  const loudOut = feedConstant(0.5);
  assert.ok(loudOut[0] >= 16350 && loudOut[0] <= 16400, `loud speech unboosted (got ${loudOut[0]})`);
  const clipOut = feedConstant(1.5);
  assert.strictEqual(clipOut[0], 32767);
});

test('STT buildVocabPrompt includes sessionContext and groq/openai/custom pass promptWithContext + continuedText', async () => {
  const sttPath = require.resolve('../src/stt');
  const openaiPath = require.resolve('openai');
  const prevOpenAI = require.cache[openaiPath];
  const prevStt = require.cache[sttPath];

  const capturedCalls = [];
  class FakeOpenAI {
    constructor(opts) {
      this.opts = opts;
      this.audio = {
        transcriptions: {
          create: async (req) => {
            capturedCalls.push({ baseURL: opts.baseURL, model: req.model, prompt: req.prompt });
            return { text: 'describe a time you shipped fast.' };
          }
        }
      };
    }
  }
  FakeOpenAI.toFile = async (buf, name) => ({ buf, name });

  try {
    require.cache[openaiPath] = { id: openaiPath, filename: openaiPath, loaded: true, exports: FakeOpenAI };
    delete require.cache[sttPath];
    const { buildVocabPrompt, createSTT } = require('../src/stt');

    const vocab = buildVocabPrompt({
      sessionContext: 'System design round covering EnvoyProxy, DynamoDB, ClickHouse',
      resumeText: 'Built Raft services',
      jobDescription: ''
    });
    assert.ok(vocab.includes('EnvoyProxy'), 'vocab prompt includes sessionContext terms');
    assert.ok(vocab.includes('DynamoDB'), 'vocab prompt extracts capitalized session terms');
    assert.ok(vocab.length <= 850, 'vocab prompt stays within 850-char cap');

    const wav = Buffer.alloc(6400);
    const context = 'Tell me about deadlines.';

    // Groq chain: without context uses vocabPrompt (with sessionContext); with context uses promptWithContext + continuedText
    const groqStt = createSTT({
      sttProvider: 'groq',
      apiKeys: { groq: 'gsk_test_key' },
      sessionContext: 'EnvoyProxy'
    });
    const groqVocabRes = await groqStt.transcribe(wav);
    assert.strictEqual(groqVocabRes.provider, 'groq');
    assert.ok(capturedCalls.at(-1).prompt.includes('EnvoyProxy'), 'groq without context sends sessionContext vocabPrompt');

    const groqRes = await groqStt.transcribe(wav, { context });
    assert.strictEqual(groqRes.provider, 'groq');
    assert.strictEqual(groqRes.text, 'Describe a time you shipped fast.');
    assert.strictEqual(capturedCalls.at(-1).prompt, 'Tell me about deadlines,', 'groq prompt uses promptWithContext');

    // OpenAI chain
    const openaiStt = createSTT({
      sttProvider: 'openai',
      apiKeys: { openai: 'sk_test_key' },
      sttModel: 'whisper-1'
    });
    const openaiRes = await openaiStt.transcribe(wav, { context });
    assert.strictEqual(openaiRes.provider, 'openai');
    assert.strictEqual(openaiRes.text, 'Describe a time you shipped fast.');
    assert.strictEqual(capturedCalls.at(-1).prompt, 'Tell me about deadlines,', 'openai prompt uses promptWithContext');

    // Custom chain
    const customStt = createSTT({
      sttProvider: 'custom',
      apiKeys: { custom: 'cust_test_key' },
      baseUrl: 'https://stt.example.com/v1',
      sttModel: 'whisper-large-v3'
    });
    const customRes = await customStt.transcribe(wav, { context });
    assert.strictEqual(customRes.provider, 'custom');
    assert.strictEqual(customRes.text, 'Describe a time you shipped fast.');
    assert.strictEqual(capturedCalls.at(-1).prompt, 'Tell me about deadlines,', 'custom prompt uses promptWithContext');
  } finally {
    if (prevOpenAI) require.cache[openaiPath] = prevOpenAI;
    else delete require.cache[openaiPath];
    if (prevStt) require.cache[sttPath] = prevStt;
    else delete require.cache[sttPath];
  }
});

test('Smart screen capture uses 1280px/quality 76/no window icons and overlaps capture with context building', async () => {
  const screenPath = require.resolve('../src/screen');
  const prevScreen = require.cache[screenPath];
  let electronPath = null;
  let prevElectron = null;
  try {
    electronPath = require.resolve('electron');
    prevElectron = require.cache[electronPath];
  } catch {
    electronPath = 'electron';
  }

  let capturedGetSourcesOpts = null;
  let capturedQuality = null;
  const fakeImg = {
    isEmpty: () => false,
    getSize: () => ({ width: 1280, height: 720 }),
    resize: () => fakeImg,
    toJPEG: (q) => {
      capturedQuality = q;
      return Buffer.from('fakejpeg');
    }
  };
  const fakeElectron = {
    desktopCapturer: {
      getSources: async (opts) => {
        capturedGetSourcesOpts = opts;
        return [{ display_id: '1', thumbnail: fakeImg }];
      }
    },
    screen: {
      getPrimaryDisplay: () => ({ id: '1', size: { width: 1920, height: 1080 }, scaleFactor: 2 })
    },
    nativeImage: {}
  };

  try {
    const resolvedElectronId = require.resolve('electron');
    require.cache[resolvedElectronId] = { id: resolvedElectronId, filename: resolvedElectronId, loaded: true, exports: fakeElectron };
  } catch {
    // Electron may not be resolvable directly in headless test runs without node_modules/electron; intercept Module._load below if needed.
  }

  const Module = require('node:module');
  const origLoad = Module._load;
  Module._load = function (request, parent, isMain) {
    if (request === 'electron') return fakeElectron;
    return origLoad.apply(this, arguments);
  };

  try {
    delete require.cache[screenPath];
    const screenMod = require('../src/screen');
    assert.strictEqual(screenMod.MAX_LONG_EDGE_PX, 1568);
    assert.strictEqual(screenMod.JPEG_QUALITY, 70);
    assert.strictEqual(screenMod.CAPTURE_MAX_LONG_EDGE_PX, 1280);
    assert.strictEqual(screenMod.CAPTURE_JPEG_QUALITY, 76);

    if (process.platform !== 'darwin') {
      const url = await screenMod.captureScreenshot();
      assert.ok(url && url.startsWith('data:image/jpeg;base64,'));
      assert.strictEqual(capturedGetSourcesOpts.fetchWindowIcons, false);
      assert.deepStrictEqual(capturedGetSourcesOpts.thumbnailSize, { width: 1280, height: 720 });
      assert.strictEqual(capturedQuality, 76);
    }

    const mainSrc = fs.readFileSync(path.join(__dirname, '../main.js'), 'utf8');
    const screenPromiseIdx = mainSrc.indexOf('const screenPromise = def.needsScreen');
    const contextIdx = mainSrc.indexOf('let contextBlock = buildInterviewContext');
    const awaitScreenIdx = mainSrc.indexOf('await screenPromise');
    const buildIdx = mainSrc.indexOf('const built = def.build(');
    assert.ok(screenPromiseIdx > 0 && contextIdx > screenPromiseIdx, 'screenPromise starts before buildInterviewContext');
    assert.ok(awaitScreenIdx > contextIdx && buildIdx > awaitScreenIdx, 'screenPromise awaits after context build and before def.build');
  } finally {
    Module._load = origLoad;
    if (prevScreen) require.cache[screenPath] = prevScreen;
    else delete require.cache[screenPath];
    if (prevElectron) require.cache[electronPath] = prevElectron;
  }
});

test('Gemini caches resolved fallback models with thinkingBudget and bypasses Gemini during quota cooldown', async () => {
  const llmPath = require.resolve('../src/llm');
  const genaiPath = require.resolve('@google/genai');
  const openaiPath = require.resolve('openai');
  const prevLlm = require.cache[llmPath];
  const prevGenai = require.cache[genaiPath];
  const prevOpenai = require.cache[openaiPath];

  const geminiCalls = [];
  const groqCalls = [];
  let mode = 'fallback-404';

  class FakeGoogleGenAI {
    constructor() {
      this.models = {
        generateContentStream: async ({ model, config }) => {
          geminiCalls.push({ model, thinkingConfig: config.thinkingConfig });
          if (mode === 'fallback-404') {
            if (model === 'gemini-3.9-flash') {
              const err = new Error('models/gemini-3.9-flash is not found for API version v1beta');
              err.status = 404;
              throw err;
            }
            return (async function* () { yield { text: 'Answer from fallback', candidates: [{ finishReason: 'STOP' }] }; })();
          }
          if (mode === 'quota-429') {
            const err = new Error('429 You exceeded your current quota, please check your plan and billing details.');
            err.status = 429;
            throw err;
          }
          return (async function* () { yield { text: 'Direct Gemini', candidates: [{ finishReason: 'STOP' }] }; })();
        }
      };
    }
  }

  class FakeOpenAI {
    constructor(opts) {
      this.chat = {
        completions: {
          create: async (req) => {
            groqCalls.push({ baseURL: opts.baseURL, model: req.model });
            return (async function* () {
              yield { choices: [{ delta: { content: 'Groq fallback answer' }, finish_reason: 'stop' }] };
            })();
          }
        }
      };
    }
  }

  try {
    require.cache[genaiPath] = { id: genaiPath, filename: genaiPath, loaded: true, exports: { GoogleGenAI: FakeGoogleGenAI } };
    require.cache[openaiPath] = { id: openaiPath, filename: openaiPath, loaded: true, exports: FakeOpenAI };
    delete require.cache[llmPath];
    const llmMod = require('../src/llm');
    llmMod._resetGeminiRuntimeState();

    // 1. First call: primary 404s, resolves 2.5 fallback with thinkingBudget: 0 and caches it
    const l1 = llmMod.createLLM({
      provider: 'gemini',
      apiKeys: { gemini: 'gm_test' },
      models: { gemini: { fast: 'gemini-3.9-flash' } },
      smart: false
    });
    const res1 = await l1.stream({ system: 'sys', turns: [{ role: 'user', text: 'hi' }], onToken: () => {} });
    assert.strictEqual(res1, 'Answer from fallback');
    assert.deepStrictEqual(geminiCalls.map((c) => c.model), ['gemini-3.9-flash', 'gemini-' + '2.5-flash']);
    assert.deepStrictEqual(geminiCalls[1].thinkingConfig, { thinkingBudget: 0 });

    // 2. Second call (smart: true): skips 3.9-flash 404 round-trip and passes thinkingBudget: 512
    geminiCalls.length = 0;
    const l2 = llmMod.createLLM({
      provider: 'gemini',
      apiKeys: { gemini: 'gm_test' },
      models: { gemini: { fast: 'gemini-3.9-flash', smart: 'gemini-3.9-flash' } },
      smart: true
    });
    await l2.stream({ system: 'sys', turns: [{ role: 'user', text: 'hi' }], onToken: () => {} });
    assert.deepStrictEqual(geminiCalls.map((c) => c.model), ['gemini-' + '2.5-flash']);
    assert.deepStrictEqual(geminiCalls[0].thinkingConfig, { thinkingBudget: 512 });

    // 3. Quota cooldown: first 429 falls back to Groq and sets cooldown; next call routes straight to Groq
    llmMod._resetGeminiRuntimeState();
    geminiCalls.length = 0;
    groqCalls.length = 0;
    mode = 'quota-429';
    const l3 = llmMod.createLLM({
      provider: 'gemini',
      apiKeys: { gemini: 'gm_test', groq: 'gsk_test' },
      models: { gemini: { fast: 'gemini-3.8-flash' } }
    });
    const q1 = await l3.stream({ system: 'sys', turns: [{ role: 'user', text: 'q1' }], onToken: () => {} });
    assert.strictEqual(q1, 'Groq fallback answer');
    assert.strictEqual(geminiCalls.length, 1);
    assert.strictEqual(groqCalls.length, 1);

    const q2 = await l3.stream({ system: 'sys', turns: [{ role: 'user', text: 'q2' }], onToken: () => {} });
    assert.strictEqual(q2, 'Groq fallback answer');
    assert.strictEqual(geminiCalls.length, 1, 'Gemini must not be called again while in quota cooldown');
    assert.strictEqual(groqCalls.length, 2, 'second call routes directly to streamGroq');
  } finally {
    if (prevLlm) require.cache[llmPath] = prevLlm;
    else delete require.cache[llmPath];
    if (prevGenai) require.cache[genaiPath] = prevGenai;
    else delete require.cache[genaiPath];
    if (prevOpenai) require.cache[openaiPath] = prevOpenai;
    else delete require.cache[openaiPath];
  }
});

test('Renderer continuous multi-question queue, pause-wait, speaker echo guard, and non-echo you questions', () => {
  const vm = require('node:vm');
  const rendererSrc = fs.readFileSync(path.join(__dirname, '../renderer/renderer.js'), 'utf8');

  // Extract SMART AUTO-FILL SYSTEM block (before syncPlaceholder) and IPC listener slice
  const autoFillStart = rendererSrc.indexOf('  // ========== SMART AUTO-FILL SYSTEM ==========');
  const autoFillEnd = rendererSrc.indexOf('  function syncPlaceholder()');
  const ipcStart = rendererSrc.indexOf("  cue.on('vad:state'");
  const ipcEnd = rendererSrc.indexOf('  // Transcript of a meeting resumed at launch:');
  assert.ok(autoFillStart > 0 && autoFillEnd > autoFillStart);
  assert.ok(ipcStart > 0 && ipcEnd > ipcStart);

  const autoFillSlice = rendererSrc.slice(autoFillStart, autoFillEnd);
  const ipcSlice = rendererSrc.slice(ipcStart, ipcEnd);

  let now = 1_000_000;
  let nextTimerId = 1;
  const timers = new Map();
  class FakeDate extends Date {
    constructor(...args) {
      super(...(args.length ? args : [now]));
    }
    static now() { return now; }
  }
  const fakeSetTimeout = (fn, delay) => {
    const id = nextTimerId++;
    timers.set(id, { id, at: now + Math.max(0, Number(delay) || 0), fn });
    return id;
  };
  const fakeClearTimeout = (id) => { timers.delete(id); };
  const advanceTimersBy = (ms) => {
    const target = now + ms;
    while (true) {
      let earliest = null;
      for (const entry of timers.values()) {
        if (entry.at <= target && (!earliest || entry.at < earliest.at || (entry.at === earliest.at && entry.id < earliest.id))) {
          earliest = entry;
        }
      }
      if (!earliest) break;
      timers.delete(earliest.id);
      now = earliest.at;
      earliest.fn();
    }
    now = target;
  };

  const makeClassList = () => {
    const set = new Set(['active']);
    return {
      add: (...c) => c.forEach((x) => set.add(x)),
      remove: (...c) => c.forEach((x) => set.delete(x)),
      contains: (c) => set.has(c),
      toggle: (c, force) => (force === undefined ? (set.has(c) ? set.delete(c) : set.add(c)) : (force ? set.add(c) : set.delete(c)))
    };
  };

  const handlers = {};
  const runModeCalls = [];
  const input = { value: '', style: {}, scrollHeight: 40 };
  const composer = { classList: makeClassList() };
  const stopBtn = { classList: makeClassList() };
  const sendBtn = { classList: makeClassList() };
  const messagesEl = { querySelector: () => null, appendChild: () => {} };

  const ctx = vm.createContext({
    Date: FakeDate,
    setTimeout: fakeSetTimeout,
    clearTimeout: fakeClearTimeout,
    Math, Map, Set, Array, String, Number, RegExp, Error,
    settings: { autoAnswer: true },
    busy: false,
    isWindows: true,
    aiEl: null,
    caretEl: null,
    responseCount: 0,
    MAX_RESPONSES: 20,
    followAnswer: true,
    lastSTTValue: '',
    input,
    composer,
    messages: messagesEl,
    $: (sel) => (sel === '#stop-btn' ? stopBtn : sel === '#send-btn' ? sendBtn : null),
    document: {
      getElementById: (id) => (id === 'send-btn' ? sendBtn : null),
      createElement: () => ({ className: '', dataset: {}, appendChild: () => {}, textContent: '' })
    },
    cue: { on: (ev, fn) => { handlers[ev] = fn; } },
    syncPlaceholder: () => {},
    clearInputInterim: () => {},
    showToast: () => {},
    setLiveDotState: () => {},
    appendTranscriptHistoryTurn: () => {},
    expandPanel: () => {},
    scrollMessagesToEnd: () => {},
    showThinking: () => {},
    appendToken: () => {},
    onAnswerActivity: () => {},
    startAi: () => { ctx.aiEl = { dataset: {} }; },
    finalizeAi: () => {},
    setBusy: (b) => { ctx.busy = b; },
    send: () => {
      const q = input.value.trim();
      input.value = '';
      ctx.busy = true;
      runModeCalls.push({ mode: 'answerThis', text: q });
    },
    runMode: (mode, text) => {
      ctx.busy = true;
      runModeCalls.push({ mode, text });
    }
  });

  vm.runInContext(
    autoFillSlice + '\n' + ipcSlice +
    '\nthis.__api = { isLikelyCompleteQuestion, splitIntoQuestions, autoAnswerQueue, vadSpeaking };',
    ctx
  );

  const api = ctx.__api;

  // 1. Question splitting preserves preambles, dots inside Node.js/3.5, and splits multiple questions
  assert.strictEqual(api.isLikelyCompleteQuestion('hi there'), false);
  assert.strictEqual(api.isLikelyCompleteQuestion('Tell me about a time you solved a difficult latency bug'), true);
  assert.deepStrictEqual(
    Array.from(api.splitIntoQuestions('What is React? How does Fiber work? Why use keys?')),
    ['What is React?', 'How does Fiber work?', 'Why use keys?']
  );
  assert.deepStrictEqual(
    Array.from(api.splitIntoQuestions('We run Node.js v20 on AWS with 3.5 ms SLA. How do you debug slow queries? What indexes help?')),
    ['We run Node.js v20 on AWS with 3.5 ms SLA. How do you debug slow queries?', 'What indexes help?']
  );
  assert.deepStrictEqual(
    Array.from(api.splitIntoQuestions('Tell me about yourself. Why do you want this role. What is your biggest strength.')),
    ['Tell me about yourself.', 'Why do you want this role.', 'What is your biggest strength.']
  );

  // 2. While vadSpeaking.them is true, timer extends until pause, and speaker echo on 'you' does NOT wipe/cancel
  handlers['vad:state']({ channel: 'them', speaking: true });
  handlers['transcript']({ channel: 'them', text: 'What is CAP theorem? How does Raft handle leader election?' });
  handlers['transcript']({ channel: 'you', text: 'CAP theorem How does Raft handle leader election' }); // speaker echo!

  advanceTimersBy(1000);
  assert.strictEqual(runModeCalls.length, 0, 'waits while interviewer vadSpeaking.them is still active');
  assert.ok(input.value.includes('CAP theorem'), 'speaker echo did not clear pending question');

  // Interviewer pauses -> pause timer finishes -> Q1 fires first, Q2 stays queued
  handlers['vad:state']({ channel: 'them', speaking: false });
  advanceTimersBy(1200);
  assert.strictEqual(runModeCalls.length, 1);
  assert.strictEqual(runModeCalls[0].text, 'What is CAP theorem?');
  assert.strictEqual(api.autoAnswerQueue.length, 1);

  // Completing Q1 via llm:done immediately advances queue to Q2
  handlers['llm:done']();
  assert.strictEqual(runModeCalls.length, 2);
  assert.strictEqual(runModeCalls[1].text, 'How does Raft handle leader election?');

  // Duplicate Q1 repeated immediately does not re-trigger
  handlers['llm:done']();
  handlers['transcript']({ channel: 'them', text: 'What is CAP theorem?' });
  advanceTimersBy(2000);
  assert.strictEqual(runModeCalls.length, 2, 'deduplicates recently answered question');

  // 3. Non-echo 'you' question (e.g. interview test played into microphone without loopback) is also answered
  handlers['transcript']({ channel: 'you', text: 'How would you design an LRU cache from scratch?' });
  advanceTimersBy(2000);
  assert.strictEqual(runModeCalls.length, 3);
  assert.strictEqual(runModeCalls[2].text, 'How would you design an LRU cache from scratch?');
});
