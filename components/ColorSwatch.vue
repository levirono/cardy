<template>
  <div class="color-swatch">
    <div class="flex items-center justify-between mb-2">
      <label :for="inputId" class="text-sm font-medium text-text/80">
        {{ label }}
      </label>
      <div class="text-xs text-text/60">
        {{ modelValue }}
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <div class="relative">
        <input
          :id="inputId"
          type="color"
          :value="modelValue"
          class="w-10 h-10 rounded-lg shadow-sm cursor-pointer border border-border/50 hover:border-primary/50 transition-colors"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        >
        <div 
          v-if="showCustomIndicator"
          class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary ring-2 ring-background"
          :style="{ backgroundColor: modelValue }"
          :title="'Custom color: ' + modelValue"
        />
      </div>
      
      <div class="flex-1 flex flex-wrap gap-2">
        <button
          v-for="(color, index) in swatches"
          :key="index"
          type="button"
          class="relative w-8 h-8 rounded-lg shadow-sm transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
          :class="[{
            'ring-2 ring-offset-1 ring-primary': isSelectedColor(color),
            'ring-1 ring-border/30': !isSelectedColor(color)
          }]"
          :style="{ backgroundColor: color }"
          :aria-label="`Select ${color} color`"
          @click="selectColor(color)"
        >
          <span 
            v-if="isSelectedColor(color)" 
            class="absolute inset-0 flex items-center justify-center text-white/90 drop-shadow"
          >
            <UIcon name="i-heroicons-check" class="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  swatches: {
    type: Array as () => string[],
    required: true
  },
  id: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const inputId = computed(() => props.id || `color-swatch-${Math.random().toString(36).substr(2, 9)}`);

const showCustomIndicator = computed(() => {
  return !props.swatches.includes(props.modelValue);
});

function isSelectedColor(color: string) {
  return props.modelValue?.toLowerCase() === color.toLowerCase();
}

function selectColor(color: string) {
  emit('update:modelValue', color);
}
</script>

<style scoped>
.color-swatch {
  width: 100%;
}

input[type="color"] {
  -webkit-appearance: none;
  appearance: none;
  padding: 0;
  border: none;
  cursor: pointer;
  background: transparent;
}

input[type="color"]::-webkit-color-swatch {
  border-radius: 0.5rem;
  border: none;
}

input[type="color"]::-moz-color-swatch {
  border-radius: 0.5rem;
  border: none;
}

button {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

button:active {
  transform: scale(0.95);
}
</style>
