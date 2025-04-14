export function isPath(pathUrlOrStream: string | NodeJS.ReadableStream): pathUrlOrStream is string {
  return typeof pathUrlOrStream === "string";
}

export function isStream(pathUrlOrStream: string | NodeJS.ReadableStream): pathUrlOrStream is NodeJS.ReadableStream {
  return typeof pathUrlOrStream === "object" && pathUrlOrStream !== null && "pipe" in pathUrlOrStream;
}