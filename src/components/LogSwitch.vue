<template>
  <div class="container">
    <div class="controls" v-if="model !== undefined">
      <el-switch v-model="model" inline-prompt active-text="Log"
      inactive-text="Lin."> </el-switch>
    </div>
  </div>
</template>

<script setup>
import {computed, toValue} from 'vue'

defineEmits([
  /**
   * Emitted when the scale mode is switched.
   */
  'scale-mode-switched'
])

const model = defineModel()


const {plotMetadata} = defineProps({
  /**
   * The metadata for the plot.
   */
   plotMetadata: {
    type: Object,
    default: undefined
  },
})

const logScaleAvailable = computed(() => toValue(plotMetadata)?.attrs?.logScale)
</script>

<style scoped></style>
