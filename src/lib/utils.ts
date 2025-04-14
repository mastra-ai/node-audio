import { PassThrough } from "stream";
import { pipeline } from "stream/promises";
import { createReadStream } from "fs";
export function isUrl(pathUrlOrStream: string | NodeJS.ReadableStream): pathUrlOrStream is string {
  return typeof pathUrlOrStream === "string" && pathUrlOrStream.startsWith("http");
}

export function isPath(pathUrlOrStream: string | NodeJS.ReadableStream): pathUrlOrStream is string {
  return typeof pathUrlOrStream === "string";
}

export function isStream(pathUrlOrStream: string | NodeJS.ReadableStream): pathUrlOrStream is NodeJS.ReadableStream {
  return typeof pathUrlOrStream === "object" && pathUrlOrStream !== null && "pipe" in pathUrlOrStream;
}

export function pathUrlOrStreamToStream(pathUrlOrStream: string | NodeJS.ReadableStream): NodeJS.ReadableStream {
  if (isUrl(pathUrlOrStream)) {
    const stream = new PassThrough();
    
    fetch(pathUrlOrStream).then(response => {
      if (response.ok && response.body) {
        pipeline(response.body, stream);
      } else {
        throw new Error("Failed to fetch audio file");
      }
    }).catch(error => {
      stream.emit("error", error);
    });

    return stream;
  } else if (isPath(pathUrlOrStream)) {
    return createReadStream(pathUrlOrStream);
  } else if (isStream(pathUrlOrStream)) {
    return pathUrlOrStream;
  } else {
    throw new Error("Invalid path, url, or stream");
  }
}