import Speaker from "@mastra/node-speaker";
import { pathUrlOrStreamToStream } from "./utils";

export const defaultSpeakerOptions: Speaker.Options = {
  sampleRate: 24100,  // Audio sample rate in Hz - standard for high-quality audio on MacBook Pro
  bitDepth: 16,       // Bit depth for audio quality - CD quality standard (16-bit resolution)
  channels: 1,        // Mono audio output (as opposed to stereo which would be 2),
};

export function playAudio(pathUrlOrStream: string | NodeJS.ReadableStream, options: Speaker.Options = defaultSpeakerOptions) {
  const stream = pathUrlOrStreamToStream(pathUrlOrStream);
  const speaker = new Speaker(options);
  stream.pipe(speaker);
  return speaker;
}