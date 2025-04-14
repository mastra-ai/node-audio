import { playAudio } from "../../main";

/**
 * Play an audio file from the local filesystem.
 */
playAudio("https://github.com/mastra-ai/node-audio/raw/refs/heads/main/src/examples/playRemoteAudio/fire-2.wav", {
  bitDepth: 16,
  sampleRate: 48000, // 48kHz
});