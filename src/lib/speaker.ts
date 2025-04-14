import Speaker from "@mastra/node-speaker";
import ffmpeg from "fluent-ffmpeg";
import { isPath, isStream } from "./utils";

export const defaultSpeakerOptions: Speaker.Options = {
  sampleRate: 24100,  // Audio sample rate in Hz - standard for high-quality audio on MacBook Pro
  bitDepth: 16,       // Bit depth for audio quality - CD quality standard (16-bit resolution)
  channels: 1,        // Mono audio output (as opposed to stereo which would be 2)
};

export function playAudio(pathUrlOrStream: string | NodeJS.ReadableStream, options: Speaker.Options = defaultSpeakerOptions) {
  if (isPath(pathUrlOrStream)) {
    const speaker = new Speaker(options);
    const stream = ffmpeg(pathUrlOrStream);
    stream.pipe(speaker);
  } else if (isStream(pathUrlOrStream)) {
    const speaker = new Speaker(options);
    pathUrlOrStream.pipe(speaker);
  } else {
    throw new Error("Invalid path, url, or stream");
  }
}