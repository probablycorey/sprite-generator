export const presets = [
  {
    name: "Water Tiles",
    holeThreshold: 0.1,
    drawRectThreshold: 0.8,
    paletteIndex: 25, // Use the index of a blue palette
    useBlackForOutline: false,
    customLogic: (x, y, context, color) => {
      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    },
  },
  {
    name: "Grass Tiles",
    holeThreshold: 0.2,
    drawRectThreshold: 0.6,
    paletteIndex: 24, // Use the index of a green palette
    useBlackForOutline: false,
    customLogic: (x, y, context, color) => {
      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    },
  },
  // Add more presets here...
];
