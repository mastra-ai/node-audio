# @mastra/node-audio

Cross-platform audio I/O toolkit for Node.js — play audio, stream microphone input, and record to disk. Designed for use with voice-enabled agents like Mastra.

## 🎧 Features

- ✅ Play audio from file, URL, or stream
- 🎤 Get microphone stream with sane defaults
- 📼 Record audio to disk using `ffmpeg`
- 🔄 Unified `createHuddle` API for mic/speaker coordination
- 🧰 Built on `node-mic`, `@mastra/node-speaker`, and `fluent-ffmpeg`

---

## 🚀 Getting Started

### 1. Install

```bash
npm install @mastra/node-audio
```

### 2. System Requirements

This package wraps native audio libraries. You may need additional system dependencies:

#### 🖥 Speaker
- Docs: [node-speaker - Audio selection](https://github.com/TooTallNate/node-speaker?tab=readme-ov-file#audio-backend-selection)

#### 🎙 Microphone Input
- Docs: [node-mic](https://github.com/Symbitic/node-mic)

#### 💾 Recording Audio
- Docs: [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg)
- You must have `ffmpeg` installed and available in your system path

```bash
# macOS
brew install ffmpeg

# Debian/Ubuntu
sudo apt-get install ffmpeg

# Windows
choco install ffmpeg
```

---

## 📚 API Reference

### `playAudio(input: string | Readable, options?: Speaker.Options): void`
Plays a local file, URL, or raw audio stream.

```ts
import { playAudio } from "@mastra/node-audio";

playAudio("./response.wav");
```

You can also pass a stream:

```ts
const stream = fs.createReadStream("./hello.wav");
playAudio(stream);
```

### `getMicrophoneStream(options?: MicOptions): Readable`
Starts recording from the default system mic and returns a stream.

```ts
import { getMicrophoneStream } from "@mastra/node-audio";

const micStream = getMicrophoneStream({ rate: 24100 });
micStream.pipe(fs.createWriteStream("raw_input.pcm"));
```

### `recordAudioToFile(stream: Readable, outputPath: string, options?: RecorderOptions): Recorder`
Records audio from a stream to disk using `ffmpeg`.

```ts
import { getMicrophoneStream, recordAudioToFile } from "@mastra/node-audio";

const mic = getMicrophoneStream();
const recorder = recordAudioToFile(mic, "output.mp3");

// Optionally stop recording later:
// recorder.stream.end();
```

### `createHuddle(options: HuddleOptions): Huddle`
Unified helper for managing mic + speaker + recording.

```ts
import { createHuddle } from "@mastra/node-audio";

const huddle = createHuddle({
  mic: { rate: 24100 },
  speaker: { sampleRate: 24100 },
  record: { outputPath: "session.mp3" },
});

huddle.start();

// Stream mic to agent
const micStream = huddle.getMicrophoneStream();
agent.voice.send(micStream);

// Play response from agent
agent.voice.on("speaker", (stream) => {
  huddle.play(stream);
});

// Gracefully stop
huddle.stop();
```

---

## 🛠 Development

Build both ESM and CommonJS outputs:

```bash
npm run build
```

---

## 🧩 License
MIT — built for the Mastra ecosystem