// image_url 컬럼은 단일 URL 문자열 또는 JSON 배열 문자열로 저장됨
export function parseImageUrls(image_url) {
  if (!image_url) return []
  if (image_url.startsWith('[')) {
    try { return JSON.parse(image_url) } catch { return [] }
  }
  return [image_url]
}

export function serializeImageUrls(urls) {
  if (!urls || urls.length === 0) return null
  if (urls.length === 1) return urls[0]
  return JSON.stringify(urls)
}
