import NodeMic, { type MicOptions } from "node-mic";

type AudioStream = ReturnType<NodeMic['getAudioStream']>;

export const defaultMicOptions: Partial<MicOptions> = {
  rate: 24100,
};

export function getMicrophone(options: Partial<MicOptions> = defaultMicOptions): { stream: AudioStream, mic: NodeMic } {
  const mic = new NodeMic(options);

  mic.start();

  return { stream: mic.getAudioStream(), mic };
}

export function getMicrophoneStream(options: Partial<MicOptions> = defaultMicOptions): AudioStream {
  return getMicrophone(options).stream;
}
