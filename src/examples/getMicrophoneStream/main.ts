import { getMicrophoneStream, recordAudioToFile } from "../../main";

const stream = getMicrophoneStream();

const recorder = recordAudioToFile(stream, {
  outputPath: 'src/examples/getMicrophoneStream/output.mp3',
});

recorder.on('start', () => {
  console.log('Recording started... Ctrl+C to stop');
});

recorder.on('progress', (data) => {
  console.log(`Recording progress: ${data.percent}%`);
});

recorder.on('end', () => {
  console.log('Recording ended');
});

recorder.on('error', (error) => {
  console.error(error);
});