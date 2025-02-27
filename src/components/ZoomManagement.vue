<template>
  <div class="container">
    <map-svg-sprite-color />
    <div :class="{inactive: !enableControls}" class="bottom-right-control">
      <el-popover
        v-model="hoverVisibilities[0].value"
        content="Zoom in"
        placement="left"
        :teleported="false"
        trigger="manual"
        popper-class="plot-popper"
      >
        <template #reference>
          <map-svg-icon
            icon="zoomIn"
            :class="{inactive: zoomInDisabled}"
            class="icon-button zoom-in"
            @click="zoomIn()"
            @mouseover="showTooltip(0)"
            @mouseout="hideTooltip(0)"
          />
        </template>
      </el-popover>
      <el-popover
        v-model="hoverVisibilities[1].value"
        content="Zoom out"
        placement="top-end"
        :teleported="false"
        trigger="manual"
        popper-class="plot-popper popper-zoomout"
      >
        <template #reference>
          <map-svg-icon
            icon="zoomOut"
            :class="{inactive: zoomOutDisabled}"
            class="icon-button zoom-out"
            @click="zoomOut()"
            @mouseover="showTooltip(1)"
            @mouseout="hideTooltip(1)"
          />
        </template>
      </el-popover>

      <el-select size="small" v-model="selectZoom" placeholder="100%">
        <el-option v-for="item in zoomLevels" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <!-- The commented part remains unchanged -->
      <el-popover
        v-model="hoverVisibilities[2].value"
        content="Reset"
        placement="top"
        :teleported="false"
        trigger="manual"
        popper-class="plot-popper"
      >
        <template #reference>
          <map-svg-icon
            icon="resetZoom"
            :class="{inactive: zoomResetDisabled}"
            class="icon-button reset-view"
            @click="resetView()"
            @mouseover="showTooltip(2)"
            @mouseout="hideTooltip(2)"
          />
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import {ElSelect, ElOption, ElPopover} from 'element-plus'
import {MapSvgSpriteColor, MapSvgIcon} from '@abi-software/svg-sprite'
import {computed, ref, toValue, watch} from 'vue'

const plotlyLayout = defineModel()

const {plotlyPlot, plotlyPlotReady, dataReset, helpModeOn} = defineProps({
  plotlyPlot: {
    type: Element,
    default: null
  },
  plotlyPlotReady: {
    type: Boolean
  },
  dataReset: {
    type: Boolean,
    default: false
  },
  helpModeOn: {
    type: Boolean,
    default: false
  }
})

const hoverVisibilities = ref([{value: false}, {value: false}, {value: false}])
const zoomLevels = ref([])
const selectZoom = ref('100%')
const zoom = ref(100)
const maxZoom = 800

let initialisationPerformed = false
let tooltipWait = null
let initialRange = []

const enableControls = computed(() => toValue(plotlyPlot) instanceof Element && toValue(plotlyPlotReady))
const zoomInDisabled = computed(() => zoom.value >= maxZoom)
const zoomOutDisabled = computed(() => zoom.value <= 100)
const zoomResetDisabled = computed(() => zoom.value == 100)

function layoutRangeToArray() {
  const layout = toValue(plotlyLayout)
  let arr = [0, 0, 0, 0]
  if (layout?.xaxis?.range !== undefined) {
    arr[0] = layout.xaxis.range[0]
    arr[1] = layout.xaxis.range[1]
  }
  if (layout?.yaxis?.range !== undefined) {
    arr[2] = layout.yaxis.range[0]
    arr[3] = layout.yaxis.range[1]
  }
  return arr
}

watch(
  () => dataReset,
  () => {
    if (toValue(dataReset)) {
      initialRange = layoutRangeToArray()
    }
  }
)

watch(
  () => plotlyPlotReady,
  () => {
    if (toValue(plotlyPlotReady) && !initialisationPerformed) {
      initialRange = layoutRangeToArray()
      plotlyPlot.on('plotly_relayout', plotLayoutChanged)
      initialisationPerformed = true
    }
  }
)

watch(selectZoom, () => {
  const selectZoomValue = typeof toValue(selectZoom) === "number" ? toValue(selectZoom) : Number(toValue(selectZoom).replace("%", ""))
  if (selectZoomValue !== toValue(zoom)) {
    const positiveChange = selectZoomValue > toValue(zoom)
    const zoomOffset = toValue(zoom) % 100
    zoom.value -= zoomOffset
    while (selectZoomValue !== toValue(zoom)) {
      positiveChange ? zoomIn(true) : zoomOut(true)
    }
  }
})

function resetView() {
  zoom.value = 100
  selectZoom.value = toValue(zoom)
  plotlyLayout.value = {...toValue(plotlyLayout), ...{xaxis: {autorange: true, showspikes: false}, yaxis: {autorange: true, showspikes: false}}}
}

function calcZoom(level) {
  const xInterval = (initialRange[1] - initialRange[0]) / (2 * level)
  const xMidPoint = (initialRange[1] + initialRange[0]) / 2
  const yInterval = (initialRange[3] - initialRange[2]) / (2 * level)
  const yMidPoint = (initialRange[3] + initialRange[2]) / 2
  return [xMidPoint - xInterval, xMidPoint + xInterval, yMidPoint - yInterval, yMidPoint + yInterval]
}

function calcZoomPercentage(range) {
  return Math.round((100 * (initialRange[1] - initialRange[0])) / (range[1] - range[0]))
}

function applyZoomToLayout(newZoom) {
  let newLayout = {...toValue(plotlyLayout), ...{xaxis: {range: [newZoom[0], newZoom[1]]}, yaxis: {range: [newZoom[2], newZoom[3]]}}}
  delete newLayout.xaxis.autorange
  delete newLayout.yaxis.autorange

  plotlyLayout.value = newLayout
}

function zoomIn(suppress) {
  zoom.value += 100
  if (suppress !== true) {
    selectZoom.value = toValue(zoom)
  }
  const newZoom = calcZoom(zoom.value / 100)
  applyZoomToLayout(newZoom)
}

function zoomOut(suppress) {
  zoom.value -= 100
  if (suppress !== true) {
    selectZoom.value = toValue(zoom)
  }
  const newZoom = calcZoom(zoom.value / 100)
  applyZoomToLayout(newZoom)
}

function createZoomPercentages() {
  zoomLevels.value = []
  for (let i = 0; i < maxZoom / 100; i++) {
    zoomLevels.value.push({
      value: (i + 1) * 100,
      label: (i + 1) * 100 + '%'
    })
  }
}

function plotLayoutChanged(eventData) {
  const now = layoutRangeToArray()
  const limitedRange = [
    Math.max(now[0], initialRange[0]),
    Math.min(now[1], initialRange[1]),
    Math.max(now[2], initialRange[2]),
    Math.min(now[3], initialRange[3])
  ]
  applyZoomToLayout(limitedRange)
  zoom.value = calcZoomPercentage(limitedRange)
  selectZoom.value = `${toValue(zoom)}%`
}

createZoomPercentages()

function showTooltip(tooltipNumber) {
  if (toValue(helpModeOn)) {
    hoverVisibilities.value[tooltipNumber].value = true
    tooltipWait = setTimeout(() => {
      hoverVisibilities.value[tooltipNumber].value = true
    }, 1000)
  }
}

function hideTooltip(tooltipNumber) {
  if (!toValue(helpModeOn)) {
    hoverVisibilities.value[tooltipNumber].value = false
    clearInterval(tooltipWait)
  }
}
</script>

<style scoped>
.inactive {
  pointer-events: none;
  opacity: 0.4;
}
</style>
