import Speaker from "@mastra/node-speaker";
import { defaultMicOptions } from "./microphone"
import { defaultSpeakerOptions } from "./speaker"
import NodeMic, { MicOptions } from "node-mic";
import { Recorder, RecorderOptions } from "./recorder";

export type HuddleOptions = {
  mic?: Partial<MicOptions>;
  speaker?: Speaker.Options;
  record?: RecorderOptions;
};

export type Huddle = {
  start(): void;
  stop(): void;
  play(stream: NodeJS.ReadableStream): void;
  getMicrophoneStream(): NodeJS.ReadableStream;
};

export function createHuddle(options: HuddleOptions): Huddle {
  const mic = new NodeMic({
    ...defaultMicOptions,
    ...options.mic,
  });

  const speakerOptions: Speaker.Options = {
    ...defaultSpeakerOptions,
    ...options.speaker,
  };

  let speaker: Speaker | undefined;
  let recorder: Recorder | undefined;
  let micStream: NodeJS.ReadableStream | null = null;

  if (options.record?.outputPath) {
    recorder = new Recorder({ outputPath: options.record.outputPath });
  }

  function makeSpeaker() {
    if (speaker) {
      speaker.removeAllListeners();
      speaker.close(true);
    }
    speaker = new Speaker(speakerOptions);
    return speaker;
  }

  function start() {
    mic.start();
    micStream = mic.getAudioStream();

    if (recorder) {
      recorder.start();
      micStream.pipe(recorder.stream, { end: false });
    }
  }

  function stop() {
    mic.stop();
    if (speaker) {
      speaker.close(true);
      speaker = undefined;
    }
    recorder?.stream.end();
  }

  function play(stream: NodeJS.ReadableStream) {
    mic.pause();
    const currentSpeaker = makeSpeaker();

    stream.pipe(currentSpeaker);
    stream.on("data", (chunk: Buffer) => {
      recorder?.write(chunk);
    });

    currentSpeaker.once("close", () => {
      mic.resume();
    });
  }

  function getMicrophoneStream() {
    if (!micStream) throw new Error("Huddle not started yet");
    return micStream;
  }

  return {
    start,
    stop,
    play,
    getMicrophoneStream,
  };
}
