import { createHuddle, pathUrlOrStreamToStream } from "../../main";

const stream = pathUrlOrStreamToStream("src/examples/playAudio/hello.wav");

const outputPath = 'src/examples/createHuddle/output.mp3';

const huddle = createHuddle({
  record: {
    outputPath,
  }
});

huddle.on("recorder.start", () => {
  console.log(`Recording to ${outputPath}`);
});

huddle.start();

huddle.play(stream);

huddle.on("start", () => {
  console.log("Huddle started. Ctrl+C to stop.");
});