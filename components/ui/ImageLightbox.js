'use client'

import { useEffect } from 'react'

export default function ImageLightbox({ src, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white hover:opacity-80 transition-opacity cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.15)' }}
      >
        ×
      </button>
      <img
        src={src}
        alt="원본 이미지"
        className="max-w-full max-h-full w-auto h-auto rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
