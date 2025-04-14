import { playAudio } from "../../main";

/**
 * Play an audio file from the local filesystem.
 */
playAudio("https://www.soundjay.com/nature/fire-2.wav", {
  bitDepth: 16,
  sampleRate: 48000, // 48kHz
});