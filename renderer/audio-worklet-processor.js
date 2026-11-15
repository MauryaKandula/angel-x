// AudioWorklet processor — runs off the main thread for low-latency audio capture.
// Replaces the deprecated ScriptProcessor. Receives Float32 audio, converts to Int16 PCM,
// and sends to the main thread via MessagePort.

class CueAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._bufferSize = 2048; // 128ms chunks at 16kHz for lower transcription latency
    this._buffer = new Float32Array(this._bufferSize);
    this._writeIndex = 0;
  }

  process(inputs, _outputs, _parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const ch0 = input[0];
    const ch1 = input.length > 1 ? input[1] : null;
    for (let i = 0; i < ch0.length; i++) {
      this._buffer[this._writeIndex++] = ch1 ? (ch0[i] + ch1[i]) * 0.5 : ch0[i];
      if (this._writeIndex >= this._bufferSize) {
        this._flush();
      }
    }
    return true;
  }

  _flush() {
    const n = this._writeIndex;
    let sumSq = 0;
    for (let i = 0; i < n; i++) {
      const raw = this._buffer[i];
      const sample = Number.isFinite(raw) ? raw : 0;
      sumSq += sample * sample;
    }
    const rms = n > 0 ? Math.sqrt(sumSq / n) : 0;
    const gain = (rms >= 0.0018 && rms < 0.09) ? Math.min(4.0, 0.09 / rms) : 1.0;

    // Convert Float32 [-1,1] to Int16 PCM with smooth AGC on quiet speech
    const pcm = new Int16Array(n);
    for (let i = 0; i < n; i++) {
      const raw = this._buffer[i];
      const sample = Number.isFinite(raw) ? raw : 0;
      const s = Math.max(-1, Math.min(1, sample * gain));
      pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    this.port.postMessage(pcm.buffer, [pcm.buffer]);
    this._writeIndex = 0;
  }
}

registerProcessor('cue-audio-processor', CueAudioProcessor);
