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
  assert.ok(html.includes('id="s-always-on-top"'), 'always-on-top setting checkbox');
  assert.ok(html.includes('id="s-compact-mode"'), 'compact mode setting checkbox');
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
