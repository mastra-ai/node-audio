import NodeMic, { MicOptions } from "node-mic";
import { AudioStream } from "node-mic/dist/audio";

export const defaultMicOptions: Partial<MicOptions> = {
  rate: 24100,
};

export function getMicrophoneStream(options: Partial<MicOptions> = defaultMicOptions): AudioStream {
  const mic = new NodeMic(options);
  
  mic.start();
  
  return mic.getAudioStream();
}