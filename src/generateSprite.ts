// Adapted from ZzSprite by Frank Force 2020, Corey doesn't fully understand how this code works and wants to make it more readable!

export const generateSprite = (
  context: CanvasRenderingContext2D,
  size: { width: number; height: number },
  seed?: number
) => {
  seed ??= Math.floor(Math.random() * 1e9)
  const center = Math.floor(size.width / 2)
  const doubleCenterOffset = size.width % 2 == 0 ? 1 : 0

  let color: string | undefined = undefined
  const randomColor = makeRNG(seed)

  ;["outline", "fill"].forEach((drawType) => {
    const random = makeRNG(seed)

    for (let y = 0; y < size.height - 2; ++y) {
      for (let x = 0; x < (size.width - 1) / 2; ++x) {
        if (!color || randomColor() < 0.05) {
          const hue = Math.floor(randomColor(360))
          color = `hsl(${hue},${randomColor(90, 50) | 0}%,${randomColor(80, 50) | 0}%)`
        }

        const hole = random() < 0.2
        const drawRect = random() < 0.5

        if (drawRect && !hole) {
          if (drawType == "outline") {
            context.fillStyle = "black"
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
