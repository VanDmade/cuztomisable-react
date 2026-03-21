// src/formatters/formatImage.ts

export function fileFromUri(uri: string) {
  const uriParts = uri.split('/');
  const lastPart = uriParts[uriParts.length - 1] ?? '';
  const name = lastPart || 'upload.jpg';
  const ext = lastPart.split('.').pop()?.toLowerCase();
  let type = 'image/jpeg';
  if (ext === 'png') {
    type = 'image/png';
  } else if (ext === 'webp') {
    type = 'image/webp';
  } else if (ext === 'heic') {
    type = 'image/heic';
  }
  // jpg/jpeg default to 'image/jpeg'
  return {
    uri,
    type,
    name,
  };
}