// Adapted from ZzSprite by Frank Force 2020, Corey doesn't fully understand how this code works and wants to make it more readable!

import { palettes } from './palettes';

export const generateSprite = (
  context: CanvasRenderingContext2D,
  size: { width: number; height: number },
  holeThreshold: number,
  drawRectThreshold: number,
  usePalette: boolean,
  paletteIndex: number,
  useBlackForOutline: boolean,
  seed?: number
) => {
  seed ??= Math.floor(Math.random() * 1e9)
  const center = Math.floor(size.width / 2)
  const doubleCenterOffset = size.width % 2 == 0 ? 1 : 0

  let color: string | undefined = undefined
  const randomColor = makeRNG(seed)
  const palette = palettes[paletteIndex]?.colors.map(color => `#${color}`)

  // Function to calculate luminance
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return l;
  };

  // Determine the darkest color in the palette
  const darkestColor = palette?.reduce((darkest, color) => {
    return getLuminance(color) < getLuminance(darkest) ? color : darkest;
  }, palette[0]) || 'black';

  ;["outline", "fill"].forEach((drawType) => {
    const random = makeRNG(seed)

    for (let y = 0; y < size.height - 2; ++y) {
      for (let x = 0; x < (size.width - 1) / 2; ++x) {
        if (!color || randomColor() < 0.05) {
          if (usePalette && palette) {
            color = palette[Math.floor(randomColor(palette.length))]
          } else {
            const hue = Math.floor(randomColor(360))
            color = `hsl(${hue},${randomColor(90, 50) | 0}%,${randomColor(80, 50) | 0}%)`
          }
        }

        const hole = random() < holeThreshold
        const drawRect = random() < drawRectThreshold

        if (drawRect && !hole) {
          if (drawType == "outline") {
            context.fillStyle = useBlackForOutline ? "black" : darkestColor
            context.fillRect(center + x - doubleCenterOffset - 1, y, 3, 3)
            if (doubleCenterOffset) {
              context.fillRect(center - x - 1, y, 3, 3)
            } else {
              context.fillRect(center - x - doubleCenterOffset - 1, y, 3, 3)
            }
          } else {
            context.fillStyle = color

            context.fillRect(center + x - doubleCenterOffset, y + 1, 1, 1)
            context.fillRect(center - x, y + 1, 1, 1)
          }
        }
      }
    }
  })
}

const makeRNG = (randomSeed: number) => {
  return (max = 1, min = 0) => {
    randomSeed ^= randomSeed << 13
    randomSeed ^= randomSeed >>> 17
    return ((Math.abs((randomSeed ^= randomSeed << 5)) % 1e9) / 1e9) * (max - min) + min
  }
}
