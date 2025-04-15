import { getMicrophoneStream, recordAudioToFile } from "../../main";

const stream = getMicrophoneStream();

const outputPath = 'src/examples/getMicrophoneStream/output.mp3';

const recorder = recordAudioToFile(stream, { outputPath });

recorder.on('start', () => {
  console.log(`Recording to ${outputPath}... Ctrl+C to stop`);
});