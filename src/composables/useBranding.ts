import { watch, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useBranding() {
  const settingsStore = useSettingsStore()

  function hexToHsl(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    let h = 0,
      s,
      l = (max + min) / 2
    if (max === min) h = s = 0
    else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  function applyBrandColors(hex: string) {
    const { h, s } = hexToHsl(hex)
    const root = document.documentElement

    const shades = [
      { n: 50, l: 95 },
      { n: 100, l: 90 },
      { n: 200, l: 80 },
      { n: 300, l: 70 },
      { n: 400, l: 60 },
      { n: 500, l: 50 },
      { n: 600, l: 45 },
      { n: 700, l: 35 },
      { n: 800, l: 25 },
      { n: 900, l: 15 },
    ]

    shades.forEach((shade) => {
      root.style.setProperty(`--brand-${shade.n}`, `hsl(${h}, ${s}%, ${shade.l}%)`)
    })
  }

  watch(
    () => settingsStore.settings.brand_color,
    (newColor) => {
      applyBrandColors(newColor)
    },
    { immediate: true },
  )

  return { applyBrandColors }
}
