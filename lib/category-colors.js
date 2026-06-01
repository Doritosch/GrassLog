export const CATEGORY_COLORS = [
  { bg: '#1a3a2a', text: '#3fb950', border: '#238636' }, // green
  { bg: '#1a2a3a', text: '#58a6ff', border: '#1f6feb' }, // blue
  { bg: '#3a1a2a', text: '#f778ba', border: '#bf4b8a' }, // pink
  { bg: '#2a1a3a', text: '#d2a8ff', border: '#8957e5' }, // purple
  { bg: '#3a2a1a', text: '#ffa657', border: '#d1812a' }, // orange
  { bg: '#3a3a1a', text: '#e3b341', border: '#9e6a03' }, // yellow
  { bg: '#1a3a3a', text: '#39d3d3', border: '#1b8080' }, // cyan
  { bg: '#3a1a1a', text: '#ff7b72', border: '#da3633' }, // red
]

// 카테고리 이름 기반으로 일관된 색상 반환
export function getCategoryColor(name) {
  if (!name) return CATEGORY_COLORS[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length]
}
