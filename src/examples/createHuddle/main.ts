import { createHuddle, pathUrlOrStreamToStream } from "../../main";

const stream = pathUrlOrStreamToStream("src/examples/playAudio/hello.wav");

const huddle = createHuddle({
  record: {
    outputPath: 'src/examples/createHuddle/output.mp3',
  }
});

huddle.start();

huddle.play(stream);

huddle.on("start", () => {
  console.log("Huddle started. Ctrl+C to stop.");
});