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

const model = defineModel()
</script>

<style scoped></style>
