<script setup lang="ts">
import { generateSprite } from "./generateSprite"
import { onMounted, ref, watch } from "vue"

const canvasEl = ref<HTMLCanvasElement>()
const size = ref({ width: 8, height: 16 })
const zoom = ref(2)

onMounted(() => {
  updateSprite()
})

watch(
  () => size.value,
  () => updateSprite(),
  { deep: true }
)

const updateSprite = () => {
  const canvas = canvasEl.value
  if (!canvas) throw new Error("Canvas element not found")
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas context not found")

  canvas.width = size.value.width
  canvas.height = size.value.height

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  generateSprite(ctx, size.value)
}

const save = (event: Event) => {
  const canvas = canvasEl.value
  if (!canvas) throw new Error("Canvas element not found")
  const dataUrl = canvas.toDataURL("image/png")
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = "sprite.png"
  a.click()
  event.preventDefault()
}
</script>

<template>
  <div>
    <header style='border-bottom: 1px solid;padding-left: 1rem; padding-right: 1rem; display: flex; align-items: center; height: 32px;'>
      <h1 style='margin: 0; line-height: 1; font-size: 10px;white-space:nowrap;margin-right: 2rem; height: 100%; display: inline-flex; align-items: center; border-right: 1px solid currentColor; padding-right: 1rem;'>Endless Sprites</h1>
      <form style='display: flex; align-items: center; justify-content: space-between; font-size:12px; width: 100%; gap: 2rem;'>
        <label style='display: flex; align-items: center; gap: 4px;' title='Width'>
          <span style='font-size: 10px;'>w</span> 
          <input type="range" v-model="size.width" min='0' max='512' />
          <input type="number" v-model="size.width" style='max-width: 6ch; font-size: 10px;'/>
        </label>
        <label style='display: flex; align-items: center; gap: 4px;' title='Height'>
          <span style='font-size: 10px;'>h</span> 
          <input type="range" v-model="size.height" min='1' max='1440' style='font-size: 10px;'/>
          <input type="number" v-model="size.height" style='max-width: 6ch; font-size: 10px;'/>
        </label>
        <label style='font-size: 10px; display: flex; align-items: center; gap: 8px;'><span style='font-size: 10px;'>zoom</span> <input type="range" min='1' max='64' step='1' v-model="zoom" />{{ zoom }}</label>
        <button type="button" @click="updateSprite" style='margin-left: auto; background: black; appearance: none; color: white; border: 0; padding: 4px 12px; font-size: 10px; cursor: pointer;'>Regenerate</button>
        <button @click="save" style='display: inline-block; background: black; appearance: none; color: white; margin: 0; border: 0; padding: 4px 12px; font-size: 10px; cursor: pointer;'>Save</button>
      </form>
    </header>
    <main class='bg-checkered' style='padding: 64px;'>
      <canvas ref="canvasEl" :style="{ zoom: 3 * zoom }" />
    </main>
  </div>
</template>

<style>
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
