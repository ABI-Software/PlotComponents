import { resolve } from "node:path";
import { defineConfig } from 'vitepress'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// Version number
const versionNumber = process.env.npm_package_version

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "PlotComponents",
  description: "API documentation for PlotComponents",
  base: '/PlotComponents/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'API Reference DataFiltering',
        link: '/components/DataFiltering'
      },
      {
        text: 'API Reference ZoomManagement',
        link: '/components/ZoomManagement'
      }
    ],

    sidebar: [
      {
        text: 'API Reference DataFiltering',
        link: '/components/DataFiltering'
      },
      {
        text: 'API Reference ZoomManagement',
        link: '/components/ZoomManagement'
      },
      {
        text: 'Version',
        items: [
          {
            text: `${versionNumber}`
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ABI-Software/plotcomponents' }
    ]
  },
  markdown: { attrs: { disable: true } },
  vite: {
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "../../src") }, {
        // this is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: '$1',
      }],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '../src/assets/styles' as *;`
        },
      },
    },
    plugins: [
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'css',
          }),
        ],
      }),

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
    ]
  }
})
