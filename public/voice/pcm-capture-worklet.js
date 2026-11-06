/*
 * Mic capture: downsample the context's native rate to 16 kHz mono and post
 * Int16 PCM chunks of ~40 ms. Linear interpolation; good enough for speech.
 */
class PcmCaptureProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.target = (options && options.processorOptions && options.processorOptions.targetRate) || 16000;
    this.ratio = sampleRate / this.target;
    this.chunk = Math.round(this.target * 0.04);
    this.out = new Int16Array(this.chunk);
    this.fill = 0;
    this.pos = 0;
    this.prev = 0;
  }

  process(inputs) {
    const input = inputs[0];
    const ch = input && input[0];
    if (!ch) return true;
    let pos = this.pos;
    while (pos < ch.length) {
      const i = Math.floor(pos);
      const frac = pos - i;
      const a = i === 0 ? this.prev : ch[i - 1];
      const b = ch[i];
      let s = a + (b - a) * frac;
      s = s < -1 ? -1 : s > 1 ? 1 : s;
      this.out[this.fill++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      if (this.fill === this.chunk) {
        this.port.postMessage(this.out.buffer, [this.out.buffer]);
        this.out = new Int16Array(this.chunk);
        this.fill = 0;
      }
      pos += this.ratio;
    }
    this.pos = pos - ch.length;
    this.prev = ch[ch.length - 1];
    return true;
  }
}

registerProcessor('pcm-capture', PcmCaptureProcessor);
