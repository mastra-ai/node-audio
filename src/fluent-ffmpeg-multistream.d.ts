declare module "fluent-ffmpeg-multistream" {
  export class StreamInput {
    constructor(stream: NodeJS.WritableStream);
    url: string;
  }
}
