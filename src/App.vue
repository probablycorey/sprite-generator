<script setup lang="ts">
import { generateSprite } from "./generateSprite"
import { palettes } from "./palettes"
import { presets } from "./presets"
import { onMounted, ref, watch } from "vue"
import PalettePreview from './PalettePreview.vue';

const canvasEl = ref<HTMLCanvasElement>()
const size = ref({ width: 8, height: 16 })
const zoom = ref(2)
const countRegen = ref(0)
const countSave = ref(0)
const holeThreshold = ref(0.2)
const drawRectThreshold = ref(0.5)
const usePalette = ref(true)
const selectedPaletteIndex = ref(4)
const selectedPresetIndex = ref(-1) // -1 means no preset is selected
const useBlackForOutline = ref(true)
const durableObjectNameRegen = 'COUNTER_VOID_SPRITE_REGEN'
const durableObjectNameSave = 'COUNTER_VOID_SPRITE_SAVE'

const fetchCount = async (counterName: string, countRef: any) => {
  try {
    const response = await fetch(`https://ts-gen-count.adam-f8f.workers.dev/?name=${counterName}`)
    const data = await response.text()
    countRef.value = parseInt(data, 10)
  } catch (error) {
    console.error(`Error fetching ${counterName}:`, error)
  }
}

const handleIncrement = async (counterName: string) => {
  try {
    await fetch(`https://ts-gen-count.adam-f8f.workers.dev/increment?name=${counterName}`, {
      method: 'POST',
    })
    fetchCount(counterName, counterName === durableObjectNameRegen ? countRegen : countSave)
  } catch (error) {
    console.error(`Error incrementing ${counterName}:`, error)
  }
}

const updateSprite = () => {
  const canvas = canvasEl.value
  if (!canvas) throw new Error("Canvas element not found")
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas context not found")

  canvas.width = size.value.width
  canvas.height = size.value.height

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (selectedPresetIndex.value >= 0) {
    generateSprite(ctx, size.value, selectedPresetIndex.value)
  } else {
    const customPreset = {
      holeThreshold: holeThreshold.value,
      drawRectThreshold: drawRectThreshold.value,
      paletteIndex: selectedPaletteIndex.value,
      useBlackForOutline: useBlackForOutline.value,
      customLogic: (x, y, context, color) => {
        context.fillStyle = color;
        context.fillRect(x, y, 1, 1);
      },
    };
    generateSprite(ctx, size.value, -1, customPreset)
  }
}

const save = async (event: Event) => {
  const canvas = canvasEl.value
  if (!canvas) throw new Error("Canvas element not found")
  const dataUrl = canvas.toDataURL("image/png")
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = "sprite.png"
  a.click()
  event.preventDefault()
  await handleIncrement(durableObjectNameSave) // Increment the count when save is clicked
}

const regenerate = async () => {
  updateSprite()
  await handleIncrement(durableObjectNameRegen) // Increment the count when regenerate is clicked
}

onMounted(() => {
  updateSprite()
  fetchCount(durableObjectNameRegen, countRegen) // Fetch the initial count for regenerations
  fetchCount(durableObjectNameSave, countSave) // Fetch the initial count for saves
})

watch(
  () => [size.value, holeThreshold.value, drawRectThreshold.value, usePalette.value, selectedPaletteIndex.value, useBlackForOutline.value, selectedPresetIndex.value],
  () => {
    updateSprite()
  },
  { deep: true }
)
</script>

<template>
  <div style='height: 100dvh; display: grid; grid-template-columns: minmax(320px, 1fr) 3fr;'>
    <aside style='border-right: 1px solid; position: relative;'>
      <h1 style='border-bottom: 1px solid; margin: 0; padding: 8px 16px; font-size: 10px;'>Endless Sprites</h1>
      <form style='padding: 16px; width: 100%; display: block;'>
        <label style='display: flex; align-items: center; gap: 4px;' title='Width'>
          <span style='font-size: 10px;'>w</span> 
          <input type="range" v-model="size.width" min='0' max='512' style='width:100%;'/>
          <input type="number" v-model="size.width" style='max-width: 6ch; font-size: 10px;'/>
        </label>
        <label style='display: flex; justify-content: space-between; align-items: center; gap: 4px;' title='Height'>
          <span style='font-size: 10px;'>h</span> 
          <input type="range" v-model="size.height" min='1' max='1440' style='font-size: 10px; width: 100%;'/>
          <input type="number" v-model="size.height" style='max-width: 6ch; font-size: 10px;'/>
        </label>
        <label style='font-size: 10px; display: flex; align-items: center; gap: 8px;'>
          <span style='font-size: 10px;'>zoom</span> 
          <input type="range" min='1' max='64' step='1' v-model="zoom" style='width:100%;'/>
          {{ zoom }}
        </label>
        <label style='font-size: 10px; display: flex; align-items: center; gap: 8px;'>
          <span style='font-size: 10px;'>hole</span> 
          <input type="range" min='0' max='1' step='0.01' v-model="holeThreshold" style='width:100%;'/>
          {{ holeThreshold }}
        </label>
        <label style='font-size: 10px; display: flex; align-items: center; gap: 8px;'>
          <span style='font-size: 10px;'>drawRect</span> 
          <input type="range" min='0' max='1' step='0.01' v-model="drawRectThreshold" style='width:100%;'/>
          {{ drawRectThreshold }}
        </label>
        <div style='display: flex; justify-content: space-between; margin-top: 32px;'>
          <label style='font-size: 10px; display: flex; align-items: center; gap: 8px;'>
            <span style='font-size: 10px;'>🎨 Palette</span> 
            <input type="checkbox" v-model="usePalette" />
          </label>
          <label style='font-size: 10px; display: flex; align-items: center; gap: 8px;'>
            <span style='font-size: 10px;'>Black Outline</span> 
            <input type="checkbox" v-model="useBlackForOutline" />
          </label>
        </div>
        <div style='max-height: 256px; overflow: scroll; border: 1px solid;'>
          <div v-for="(palette, index) in palettes" :key="index">
            <PalettePreview :palette="palette" :isSelected="index === selectedPaletteIndex" @select="selectedPaletteIndex = index" />
          </div>
        </div>
        <div style='margin-top: 16px;'>
          <label style='font-size: 10px; display: block;'>Preset</label>
          <select v-model="selectedPresetIndex" style='width: 100%; font-size: 10px;'>
            <option :value="-1">Custom</option>
            <option v-for="(preset, index) in presets" :key="index" :value="index">
              {{ preset.name }}
            </option>
          </select>
        </div>
        <div style='margin-top: 48px; display: flex; gap: 8px;'>
          <button @click="save" style='display: inline-block; background: black; appearance: none; color: white; border: 0; padding: 4px 12px; font-size: 10px; cursor: pointer;'>Save</button>
          <button type="button" @click="regenerate" style='background: blue; appearance: none; color: white; border: 0; padding: 4px 12px; font-size: 10px; cursor: pointer;'>Regenerate</button>
        </div>
      </form>
      <footer style="background: white; position: absolute; bottom: 0; left: 0; right: 0; font-size: 10px; padding: 8px 16px;">
        <p style='margin: 0; padding: 0;'>Regenerations: {{ countRegen }}</p>
        <p style='margin-top: 8px; padding: 0;'>Saves: {{ countSave }}</p>
      </footer>
    </aside>
    <main class='bg-checkered' style='padding: 64px; height: calc(100dvh - 33px);'>
      <canvas ref="canvasEl" :style="{ zoom: 3 * zoom }" />
    </main>
  </div>
</template>

<style>
* { box-sizing: border-box; }
html, body {
  margin: 0;
  font-family: monospace!important;
  font-size: 12px;
}

canvas {
  image-rendering: pixelated;
}

.bg-checkered {
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
}
</style>
