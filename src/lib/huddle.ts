import Speaker from "@mastra/node-speaker";
import { defaultMicOptions } from "./microphone"
import { defaultSpeakerOptions } from "./speaker"
import NodeMic, { MicOptions } from "node-mic";
import { Recorder, RecorderOptions } from "./recorder";
import { EventEmitter } from "events";

export type HuddleOptions = {
  mic?: Partial<MicOptions>;
  speaker?: Speaker.Options;
  record?: RecorderOptions;
};

export type HuddleEvents = {
  start: [];
  stop: [];
  error: [Error];
  "mic.pause": [];
  "mic.resume": [];
  "mic.error": [Error];
  "speaker.error": [Error];
  "recorder.start": [];
  "recorder.end": [];
  "recorder.error": [Error];
};

class Huddle extends EventEmitter<HuddleEvents> {
  private mic?: NodeMic;
  private speaker?: Speaker;
  private recorder?: Recorder;
  private micStream?: NodeJS.ReadableStream;

  constructor(public options: HuddleOptions) {
    super();
  }

  private makeMic() {
    return new NodeMic({
      ...defaultMicOptions,
      ...this.options.mic,
    });
  }

  private makeSpeaker() {
    return new Speaker({
      ...defaultSpeakerOptions,
      ...this.options.speaker,
    });
  }

  private makeRecorder() {
    if (this.options.record?.outputPath) {
      return new Recorder({
        outputPath: this.options.record.outputPath,
      });
    }
  }

  public start() {
    if (this.mic) {
      throw new Error("Huddle already started");
    }

    this.mic = this.makeMic();

    
    this.recorder = this.makeRecorder();

    if (this.recorder) {
      this.recorder.on("error", (error) => {
        this.emit("recorder.error", error);
        this.emit("error", error);
      });

      this.recorder?.on('start', () => {
        this.emit('recorder.start');
        this.emit('start');
      })

      this.recorder?.on('end', () => {
        this.emit('recorder.end');
      })
    } else {
      this.emit('start');
    }

    this.mic.start();
    this.micStream = this.mic.getAudioStream();

    if (this.recorder) {
      this.recorder.start();
      this.micStream.pipe(this.recorder.stream, { end: false });
    }
  }

  public stop() {
    this.mic?.stop();
    this.speaker?.close(true);
    this.recorder?.end();
  }

  public interrupt() {
    if (this.speaker) {
      this.speaker.close(true);
      this.speaker = undefined;
    }
  }

  public play(stream: NodeJS.ReadableStream) {
    if (this.speaker) {
      this.speaker.removeAllListeners();
      this.speaker.close(true);
    }

    this.emit("mic.pause");
    this.mic?.pause();

    this.speaker = this.makeSpeaker();

    stream.pipe(this.speaker);
    stream.on("data", (chunk: Buffer) => {
      this.recorder?.write(chunk);
    });
    
    this.speaker.on("error", (error) => {
      this.emit("speaker.error", error);
      this.emit("error", error);
    });

    this.speaker.once("close", () => {
      this.emit("mic.resume");
      this.mic?.resume();
    });
  }

  public getMicrophoneStream() {
    if (!this.micStream) {
      throw new Error("Huddle not started yet");
    }
    return this.micStream;
  }
}

export function createHuddle(options: HuddleOptions): Huddle {
  return new Huddle(options);
}
