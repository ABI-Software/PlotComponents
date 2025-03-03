# Plot Components

[![npm version](https://badge.fury.io/js/%40abi-software%2Fplotcomponents.svg)](https://badge.fury.io/js/%40abi-software%2Fplotcomponents)

This project is for providing plot interface components for Plotly plots.

## Project installation

```
yarn add @abi-software/plotcomponents
```

### Compiles and minifies for production

```
yarn build-package
```

## How to use

Include the package in your script.

````javascript
<setup script>
import { ZoomManagement, DataFiltering } from '@abi-software/plotcomponents'
import '@abi-software/plotcomponents/dist/plotcomponents.css'
</setup>

You can now use the plotcomponents in your vue template as followed:

```html
<zoom-management
  v-model="plotly_layout"
  :plotlyPlot="plotly_plot_ref"
  :plotlyPlotReady="plotly_plot_ready"
  :dataReset="dataReset"
></zoom-management>
<data-filtering
  v-model:selection-x="filteredx"
  v-model:selection-y="filteredy"
  :titles="titles"
  @filter-clicked="onFilterClicked"
></data-filtering>
````

## Developer Documentation

The documentation is developed with `vitepress` and `vuese`. Documentation pages are in the `docs` folder.

### To run in local development mode

```bash
yarn docs:watch
```

This will start the documentation server with `vitepress` on port `:5173` and watch the components' changes.
