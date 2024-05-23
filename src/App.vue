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
  () => size,
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
  <h1>Sprite Generator</h1>
  <form>
    <div>w: <input type="number" v-model="size.width" /></div>
    <div>h: <input type="number" v-model="size.height" /></div>
    <div>zoom: <input type="number" v-model="zoom" /></div>
    <button @click="save">Save</button>
  </form>
  <canvas ref="canvasEl" :style="{ zoom: 3 * zoom }" />
</template>

<style scoped>
canvas {
  image-rendering: pixelated;
}

button {
  width: 100px;
}

form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
</style>
