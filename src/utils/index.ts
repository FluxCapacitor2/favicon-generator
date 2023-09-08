export function formatFileSize(fileSize: number) {
  if (fileSize < 1000) {
    return `${fileSize} bytes`;
  } else if (fileSize < 1_000_000) {
    return `${Math.round(fileSize / 1_000)} kB`;
  } else if (fileSize < 1_000_000_000) {
    return `${Math.round(fileSize / 1_000_000)} MB`;
  } else {
    return `${Math.round(fileSize / 1_000_000_000)} GB`;
  }
}
