import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import { StreamInput } from "fluent-ffmpeg-multistream";
import { PassThrough } from "stream";
import { EventEmitter } from "events";

ffmpeg.setFfmpegPath(ffmpegPath.path);

export const defaultFfmpegOptions = {
  inputOptions: ["-f s16le", "-ar 24k", "-ac 1"] as string[],
  outputOptions: [] as string[], // ["-c:a libmp3lame", "-b:a 128k"]
}

export type RecorderOptions = {
  outputPath: string;
  ffmpeg?: {
    inputOptions?: string[];
    outputOptions?: string[];
  }
};

export type RecorderEvents = {
  start: [];
  end: [];
  progress: [{
    frames: number;
    currentFps: number;
    currentKbps: number;
    targetSize: number;
    timemark: string;
    percent?: number | undefined;
  }];
  error: [Error];
}

export class Recorder extends EventEmitter<RecorderEvents> {
  stream: NodeJS.WritableStream;

  ffmpeg = defaultFfmpegOptions;

  constructor(public options: RecorderOptions) {
    super();
    this.stream = new PassThrough();
    if (options.ffmpeg?.inputOptions) {
      this.ffmpeg.inputOptions = options.ffmpeg.inputOptions
    }
    if (options.ffmpeg?.outputOptions) {
      this.ffmpeg.outputOptions = options.ffmpeg.outputOptions;
    }
  }

  start() {
    const proc = ffmpeg()
      .addInput(new StreamInput(this.stream).url)
      .addInputOptions(this.ffmpeg.inputOptions || [])
      .outputOptions(this.ffmpeg.outputOptions || [])
      .on('start', () => {
        this.emit('start');
      })
      .on('progress', (progress) => {
        this.emit('progress', progress);
      })
      .on('end', () => {
        this.emit('end');
      })
      .on('error', (err) => {
        this.emit('error', err);
      })
      .output(this.options.outputPath); // Specify the output file path

    proc.run()
  }

  write (data: Buffer) {
    this.stream.write(data);
  }
}


export function recordAudioToFile(stream: NodeJS.ReadableStream, options: RecorderOptions): Recorder {
  const recorder = new Recorder(options);
  recorder.start();
  stream.pipe(recorder.stream);
  return recorder;
}
