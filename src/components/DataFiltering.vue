<template>
  <el-select
    v-if="titles.x.length > 0"
    v-model="selectionX"
    class="channel-select"
    multiple
    filterable
    collapse-tags
    default-first-option
    placeholder="select"
  >
    <el-option v-for="title in titles.x" :key="title" :label="title" :value="title"></el-option>
  </el-select>
  <el-select
    v-if="titles.y.length > 0"
    v-model="selectionY"
    class="channel-select"
    multiple
    filterable
    collapse-tags
    default-first-option
    placeholder="select"
  >
    <el-option v-for="title in titles.y" :key="title" :label="title" :value="title"></el-option>
  </el-select>
  <el-button v-if="titles.x.length > 0 || titles.y.length > 0" class="view-heatmap-button" @click="$emit('filter-clicked')">Filter plot</el-button>
</template>

<script setup>
// import {ref} from 'vue'
defineEmits(['filter-clicked'])
const selectionX = defineModel('selectionX')
const selectionY = defineModel('selectionY')

const props = defineProps({
  titles: {
    type: Object,
    required: true,
    validator(value) {
      if (value.x && value.y) {
        return value.x.constructor === Array && value.y.constructor === Array
      }
      return false
    }
  }
})
</script>

<style scoped>
.channel-select {
  min-width: 220px;
  margin: 8px;
  margin-left: 0px;
  margin-right: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
}
</style>
