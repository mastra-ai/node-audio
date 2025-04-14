import { pathUrlOrStreamToStream } from "../../lib/utils";
import { recordAudioToFile } from "../../main";

/**
 * Play an audio file from the local filesystem.
 */

const stream = pathUrlOrStreamToStream("https://www.soundjay.com/nature/fire-2.wav");
recordAudioToFile(stream, {
  outputPath: "src/examples/recordAudioToFile/output.wav",

  ffmpeg: {
    inputOptions: ["-f", "wav"],
    outputOptions: ["-acodec", "pcm_s16le"],
  },
});
