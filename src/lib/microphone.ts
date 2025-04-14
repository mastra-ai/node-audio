import NodeMic, { MicOptions } from "node-mic";

export const defaultMicOptions: Partial<MicOptions> = {
  rate: 24100,
};

export function getMicrophoneStream(options: Partial<MicOptions> = defaultMicOptions): NodeJS.ReadableStream {
  const mic = new NodeMic(options);
  
  mic.start();
  
  return mic.getAudioStream();
}