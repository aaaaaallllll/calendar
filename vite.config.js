import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze'

  return {
    base: './',

    plugins: [
      // Vue 3 支持
      vue(),

      // PWA 支持 - 离线缓存、Service Worker
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
                }
              }
            }
          ]
        },
        manifest: {
          name: '岁时记 - 二十四节气日历',
          short_name: '岁时记',
          description: '中国传统日历，包含24节气、节假日和待办事项',
          theme_color: '#8B5A2B',
          background_color: '#F8F5F0',
          display: 'standalone',
          start_url: './',
          icons: [
            {
              src: './icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: './icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),

      // Gzip 压缩
      compression({
        algorithm: 'gzip',
        exclude: [/\.(br)$/, /\.(gz)$/],
        threshold: 1024 // 大于1KB的文件才压缩
      }),

      // Brotli 压缩（比gzip压缩率更高）
      compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(br)$/, /\.(gz)$/],
        threshold: 1024
      }),

      // 旧浏览器兼容（IE11+）
      legacy({
        targets: ['defaults', 'not IE 11'],
        modernPolyfills: true
      }),

      // 打包分析（仅在 analyze 模式下启用）
      isAnalyze && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html'
      })
    ].filter(Boolean),

    // 构建优化
    build: {
      target: 'es2015',
      cssTarget: 'chrome61',

      // 代码分割策略
      rollupOptions: {
        output: {
          // 手动代码分割
          manualChunks: {
            // Vue 核心库单独打包
            'vue-vendor': ['vue'],
            // 工具函数打包
            'utils': ['./src/utils/solarTerms.js', './src/utils/holidays.js'],
            // 数据打包
            'data': ['./src/data/poems.js', './src/data/termBackgrounds.js', './src/data/todos.js']
          },
          // 静态资源命名
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash][extname]`
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },
          // JS 文件命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          // 入口文件命名
          entryFileNames: 'assets/js/[name]-[hash].js'
        }
      },

      // 压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // 移除 console
          drop_debugger: true, // 移除 debugger
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2
        },
        mangle: {
          safari10: true // Safari 10 兼容
        },
        format: {
          comments: false // 移除注释
        }
      },

      // CSS 优化
      cssCodeSplit: true,
      cssMinify: true,

      // 资源内联阈值（小于4KB内联为base64）
      assetsInlineLimit: 4096,

      // 源码映射（生产环境关闭）
      sourcemap: false,

      // 报告压缩后大小
      reportCompressedSize: true
    },

    // 开发服务器配置
    server: {
      port: 5173,
      open: true,
      cors: true
    },

    // 预览服务器配置
    preview: {
      port: 4173,
      open: true
    },

    // 解析配置
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@data': resolve(__dirname, 'src/data')
      }
    },

    // CSS 配置
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: ''
        }
      }
    },

    // 依赖优化
    optimizeDeps: {
      include: ['vue'],
      exclude: []
    }
  }
})
