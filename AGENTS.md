# Angel X Workspace Rules

## Angel X Build, Sync & Runtime Hygiene
- Always run `npm test` in `S:\Work\cue\cue-0.2.14` after editing `main.js`, `preload.js`, `src/`, `renderer/`, or `scripts/`.
- Sync modified app files to `S:\Work\cue\cue-0.2.14\dist\win-unpacked\resources\app` and verify SHA-256 parity.
- Never leave `Angel X.exe` or `electron.exe` running from automated tool commands; always exit cleanly so desktop GUI launches can acquire the single-instance lock.
- Keep `scripts/rename-electron.js` configured with `Angel.exe`; never spoof OS or security binary names (e.g., `msmp.exe`).

## Angel X Audio & Auto-Answer Invariants
- Keep `isLikelyCompleteQuestion()` as the single source of truth for question completeness in `enqueueAutoAnswerQuestions()`; test short follow-ups (`"Why Redis?"`, `"Is it fast?"`) in `test/angel-assistant.test.js`.
- Keep `Number.isFinite` clamping synchronized between `renderer/audio-worklet-processor.js` (`_flush()`) and `renderer/renderer.js` (`floatToPcm16WithAgc()`).
- Key shared STT cooldown state by provider + API key hash (`chain.length > 1` only), and evict cached LLM model fallbacks when they return HTTP 404.
