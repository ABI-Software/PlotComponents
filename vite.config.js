import path from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const config = {
    resolve: {
      alias: [
        {find: '@', replacement: path.resolve(__dirname, './src')},
        {
          // this is required for the SCSS modules
          find: /^~(.*)$/,
          replacement: '$1'
        }
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern", "legacy"
        }
      }
    },
    plugins: [
      vue(),
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ]
      })

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, './src/index.js'),
        name: 'PlotComponents',
        fileName: 'plotcomponents'
      },
      build: {
        commonjsOptions: {transformMixedEsModules: true} // Change
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    }
  }

  return config
})
