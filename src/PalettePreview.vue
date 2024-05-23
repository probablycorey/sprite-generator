<template>
  <div class="palette-preview" :class="{ selected: isSelected }" @click="selectPalette">
    <span class="palette-name" style='display:block;font-size: 8px; margin-bottom: 2px;'>
      <span>{{ palette.name }}</span>
    </span>
    <div class="colors">
      <div v-for="color in palette.colors" :key="color" :style="{ backgroundColor: `#${color}` }" class="color-block"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  palette: Object,
  isSelected: Boolean,
  index: Number
});

const emits = defineEmits(['select']);

const selectPalette = () => {
  emits('select', props.index);
};
</script>

<style scoped>
.palette-preview {
  padding: 8px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-right-width: 0;
  border-left-width: 0;
  border-style: solid;
  border-color: transparent;
}

.palette-preview.selected {
  border-color: black;
  --dotSize: 0.025rem;
  --bgSize: 1rem;
  --bgPosition: calc(var(--bgSize) / 2);
    background-color: black;
      color: white;

  background-image: radial-gradient(
      circle at center,
      currentColor var(--dotSize),
      transparent 0
    ),
    radial-gradient(
      circle at center,
      currentColor var(--dotSize),
      transparent 0
    );
  background-size: var(--bgSize) var(--bgSize);
  background-position:
    0 0,
    var(--bgPosition) var(--bgPosition);
}

.colors {
  display: flex;
  gap: 1px;
}

.color-block {
  width: 100%;
  height: 8px;
}

</style>
