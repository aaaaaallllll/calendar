<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import CalendarMain from './components/CalendarMain.vue'

const currentAnimation = ref(null)
const canvasRef = ref(null)
let animationFrameId = null
let particles = []

// 节气特效配置
const TERM_EFFECTS = {
  '小寒': { bg: '#E8F4F8', color: '#4a90a4', name: '雪花', type: 'snow' },
  '大寒': { bg: '#E0F0F5', color: '#7ab8c4', name: '雪花', type: 'snow' },
  '立春': { bg: '#F0F8E8', color: '#68a357', name: '春雨', type: 'rain' },
  '雨水': { bg: '#E8F4F0', color: '#5a8a9c', name: '细雨', type: 'rain' },
  '惊蛰': { bg: '#F0F5E8', color: '#7a8a5a', name: '春雷', type: 'rain' },
  '春分': { bg: '#F5F8E8', color: '#e8a8c8', name: '花瓣', type: 'petal' },
  '清明': { bg: '#E8F5E8', color: '#78a860', name: '柳絮', type: 'willow' },
  '谷雨': { bg: '#E8F0E8', color: '#5a7a8a', name: '谷雨', type: 'rain' },
  '立夏': { bg: '#F0F8E8', color: '#68a060', name: '新绿', type: 'leaf' },
  '小满': { bg: '#F5F8E0', color: '#b8a860', name: '麦穗', type: 'wheat' },
  '芒种': { bg: '#F8F5E0', color: '#98c878', name: '萤火', type: 'firefly' },
  '夏至': { bg: '#FFF8E0', color: '#f4d060', name: '骄阳', type: 'firefly' },
  '小暑': { bg: '#FFF5E8', color: '#e8a060', name: '热浪', type: 'firefly' },
  '大暑': { bg: '#FFF0E0', color: '#e89040', name: '萤火', type: 'firefly' },
  '立秋': { bg: '#F8F0E0', color: '#d48440', name: '落叶', type: 'leaf' },
  '处暑': { bg: '#F5F0E8', color: '#a8b8c8', name: '云霞', type: 'petal' },
  '白露': { bg: '#F0F5F0', color: '#78a8c0', name: '露珠', type: 'rain' },
  '秋分': { bg: '#F5F0E8', color: '#e8d040', name: '菊花', type: 'petal' },
  '寒露': { bg: '#F0F0E8', color: '#b8a880', name: '枫叶', type: 'leaf' },
  '霜降': { bg: '#E8F0F0', color: '#78a8b8', name: '霜花', type: 'snow' },
  '立冬': { bg: '#E8F0F5', color: '#80a0b0', name: '初雪', type: 'snow' },
  '小雪': { bg: '#E5F0F8', color: '#80a0b0', name: '小雪', type: 'snow' },
  '大雪': { bg: '#E0F0F8', color: '#7090a0', name: '大雪', type: 'snow' },
  '冬至': { bg: '#E8F0F5', color: '#80a0a0', name: '雪花', type: 'snow' }
}

// ========== Canvas 粒子系统 ==========

function createParticles(type, w, h) {
  const list = []
  const count = { snow: 60, rain: 100, petal: 45, willow: 40, leaf: 40, wheat: 30, firefly: 35 }[type] || 40

  for (let i = 0; i < count; i++) {
    const p = {
      x: Math.random() * w,
      y: Math.random() * h - h, // 从屏幕上方开始
      size: 0,
      speedX: 0,
      speedY: 0,
      opacity: 0,
      rotation: Math.random() * 360,
      rotationSpeed: 0,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.03,
      life: 0,
      maxLife: 0
    }

    switch (type) {
      case 'snow':
        p.size = 3 + Math.random() * 6
        p.speedY = 0.5 + Math.random() * 1.5
        p.speedX = -0.3 + Math.random() * 0.6
        p.opacity = 0.3 + Math.random() * 0.5
        p.rotationSpeed = -1 + Math.random() * 2
        p.maxLife = 999999
        break
      case 'rain':
        p.y = Math.random() * h * 2 - h
        p.size = 1.5
        p.length = 12 + Math.random() * 10
        p.speedY = 8 + Math.random() * 6
        p.speedX = -1
        p.opacity = 0.15 + Math.random() * 0.2
        p.maxLife = 999999
        break
      case 'petal':
        p.size = 4 + Math.random() * 6
        p.speedY = 0.8 + Math.random() * 1.2
        p.speedX = -0.5 + Math.random() * 1
        p.opacity = 0.3 + Math.random() * 0.4
        p.rotationSpeed = -2 + Math.random() * 4
        p.maxLife = 999999
        break
      case 'willow':
        p.size = 3 + Math.random() * 4
        p.speedY = 0.4 + Math.random() * 0.8
        p.speedX = 0.5 + Math.random() * 1.5
        p.opacity = 0.2 + Math.random() * 0.3
        p.rotationSpeed = -1 + Math.random() * 2
        p.maxLife = 999999
        break
      case 'leaf':
        p.size = 5 + Math.random() * 8
        p.speedY = 0.6 + Math.random() * 1.2
        p.speedX = -0.8 + Math.random() * 1.6
        p.opacity = 0.4 + Math.random() * 0.3
        p.rotationSpeed = -3 + Math.random() * 6
        p.maxLife = 999999
        break
      case 'wheat':
        p.size = 5 + Math.random() * 6
        p.speedY = 0.5 + Math.random() * 1
        p.speedX = -0.3 + Math.random() * 0.6
        p.opacity = 0.4 + Math.random() * 0.3
        p.rotationSpeed = -2 + Math.random() * 4
        p.maxLife = 999999
        break
      case 'firefly':
        p.y = Math.random() * h
        p.size = 2 + Math.random() * 4
        p.speedX = -0.5 + Math.random() * 1
        p.speedY = -0.5 + Math.random() * 1
        p.opacity = 0
        p.targetOpacity = 0.4 + Math.random() * 0.6
        p.rotationSpeed = 0
        p.glowPhase = Math.random() * Math.PI * 2
        p.glowSpeed = 0.02 + Math.random() * 0.03
        p.maxLife = 999999
        break
    }
    list.push(p)
  }
  return list
}

function drawParticle(ctx, p, type, color) {
  ctx.save()
  ctx.globalAlpha = p.opacity

  switch (type) {
    case 'snow': {
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      // 绘制六角雪花
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 * Math.PI) / 180
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size)
        // 小分支
        const bx = Math.cos(angle) * p.size * 0.6
        const by = Math.sin(angle) * p.size * 0.6
        ctx.moveTo(bx, by)
        ctx.lineTo(bx + Math.cos(angle + 0.5) * p.size * 0.3, by + Math.sin(angle + 0.5) * p.size * 0.3)
        ctx.moveTo(bx, by)
        ctx.lineTo(bx + Math.cos(angle - 0.5) * p.size * 0.3, by + Math.sin(angle - 0.5) * p.size * 0.3)
      }
      ctx.stroke()
      break
    }
    case 'rain': {
      ctx.strokeStyle = `rgba(100, 160, 220, ${p.opacity})`
      ctx.lineWidth = p.size
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(p.x + p.speedX * 2, p.y + (p.length || 15))
      ctx.stroke()
      break
    }
    case 'petal': {
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()
      // 花瓣纹理
      ctx.globalAlpha = p.opacity * 0.3
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.25, 0, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'willow': {
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.fillStyle = '#8aaa60'
      ctx.globalAlpha = p.opacity * 0.6
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size * 0.4, p.size * 1.2, 0, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'leaf': {
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.fillStyle = color
      ctx.beginPath()
      // 叶子形状
      ctx.moveTo(0, -p.size)
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.3, p.size * 0.6, p.size * 0.5, 0, p.size)
      ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.5, -p.size * 0.8, -p.size * 0.3, 0, -p.size)
      ctx.fill()
      // 叶脉
      ctx.strokeStyle = `rgba(0,0,0,0.1)`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(0, -p.size)
      ctx.lineTo(0, p.size)
      ctx.stroke()
      break
    }
    case 'wheat': {
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.fillStyle = '#c4a040'
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size * 0.3, p.size, 0, 0, Math.PI * 2)
      ctx.fill()
      // 麦芒
      ctx.strokeStyle = '#a08030'
      ctx.lineWidth = 0.5
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath()
        ctx.moveTo(0, p.size * 0.8)
        ctx.lineTo(i * p.size * 0.3, p.size * 1.3)
        ctx.stroke()
      }
      break
    }
    case 'firefly': {
      // 光晕
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
      gradient.addColorStop(0, `rgba(255, 240, 100, ${p.opacity * 0.6})`)
      gradient.addColorStop(0.5, `rgba(255, 220, 50, ${p.opacity * 0.2})`)
      gradient.addColorStop(1, 'rgba(255, 220, 50, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
      ctx.fill()
      // 中心亮点
      ctx.fillStyle = `rgba(255, 255, 200, ${p.opacity})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
      ctx.fill()
      break
    }
  }
  ctx.restore()
}

function updateParticle(p, type, w, h) {
  p.life++
  p.wobble += p.wobbleSpeed

  switch (type) {
    case 'snow':
      p.x += p.speedX + Math.sin(p.wobble) * 0.3
      p.y += p.speedY
      p.rotation += p.rotationSpeed
      if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w }
      if (p.x < -20) p.x = w + 20
      if (p.x > w + 20) p.x = -20
      break
    case 'rain':
      p.x += p.speedX
      p.y += p.speedY
      if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w }
      break
    case 'petal':
      p.x += p.speedX + Math.sin(p.wobble) * 0.8
      p.y += p.speedY
      p.rotation += p.rotationSpeed
      if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w }
      break
    case 'willow':
      p.x += p.speedX + Math.sin(p.wobble) * 1.2
      p.y += p.speedY
      p.rotation += p.rotationSpeed
      if (p.y > h + 20 || p.x > w + 20) { p.y = -20; p.x = Math.random() * w * 0.8 }
      break
    case 'leaf':
      p.x += p.speedX + Math.sin(p.wobble) * 0.6
      p.y += p.speedY
      p.rotation += p.rotationSpeed
      if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w }
      break
    case 'wheat':
      p.x += p.speedX + Math.sin(p.wobble) * 0.4
      p.y += p.speedY
      p.rotation += p.rotationSpeed
      if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w }
      break
    case 'firefly':
      p.glowPhase += p.glowSpeed
      p.opacity = p.targetOpacity * (0.3 + 0.7 * Math.abs(Math.sin(p.glowPhase)))
      p.x += Math.sin(p.wobble) * 0.5
      p.y += Math.cos(p.wobble * 0.7) * 0.3
      // 边界反弹
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0
      break
  }
}

// ========== 动画控制 ==========

let fadeOpacity = 0
let fadeTarget = 0
let isRunning = false

function animate() {
  if (!isRunning) return
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  // 渐变透明度
  if (fadeTarget === 1 && fadeOpacity < 1) {
    fadeOpacity = Math.min(1, fadeOpacity + 0.015)
  } else if (fadeTarget === 0 && fadeOpacity > 0) {
    fadeOpacity = Math.max(0, fadeOpacity - 0.03)
    if (fadeOpacity <= 0) {
      isRunning = false
      ctx.clearRect(0, 0, w, h)
      return
    }
  }

  ctx.clearRect(0, 0, w, h)
  ctx.globalAlpha = fadeOpacity

  const effect = currentAnimation.value
  if (!effect) { isRunning = false; return }

  particles.forEach(p => {
    updateParticle(p, effect.type, w, h)
    drawParticle(ctx, p, effect.type, effect.color)
  })

  animationFrameId = requestAnimationFrame(animate)
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function startAnimation(termName) {
  const effect = TERM_EFFECTS[termName]
  if (!effect) return

  currentAnimation.value = { term: termName, ...effect }
  fadeOpacity = 0
  fadeTarget = 1
  isRunning = true

  nextTick(() => {
    resizeCanvas()
    particles = createParticles(effect.type, canvasRef.value.width, canvasRef.value.height)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    animate()
  })
}

function stopAnimation() {
  fadeTarget = 0
  // animate 循环会在 fadeOpacity 到 0 时自动停止
}

// 窗口大小变化时重置 Canvas
function handleResize() {
  if (currentAnimation.value) {
    resizeCanvas()
    particles = createParticles(currentAnimation.value.type, canvasRef.value.width, canvasRef.value.height)
  }
}

window.addEventListener('resize', handleResize)

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="app-container">
    <!-- 基础背景装饰 -->
    <div class="bg-decoration">
      <div class="ink-circle ink-circle-1"></div>
      <div class="ink-circle ink-circle-2"></div>
      <div class="ink-circle ink-circle-3"></div>
    </div>

    <!-- Canvas 节气动画层 -->
    <canvas
      v-show="currentAnimation"
      ref="canvasRef"
      class="term-canvas"
    ></canvas>

    <!-- 渐变背景层 -->
    <Transition name="bg-fade">
      <div
        v-if="currentAnimation"
        class="term-bg-gradient"
        :style="{ background: `radial-gradient(ellipse at 30% 20%, ${currentAnimation.bg}66 0%, transparent 60%)` }"
      ></div>
    </Transition>

    <!-- 节气提示 -->
    <Transition name="hint-fade">
      <div v-if="currentAnimation" class="term-hint" :style="{ color: currentAnimation.color }">
        {{ currentAnimation.term }} · {{ currentAnimation.name }}
      </div>
    </Transition>

    <!-- 头部 -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-icon">📅</div>
          <div>
            <h1 class="header-title">岁时记</h1>
            <p class="header-subtitle">二十四节气 · 中国传统日历</p>
          </div>
        </div>
      </div>
    </header>

    <!-- 日历主体 -->
    <main class="app-main">
      <div class="calendar-container">
        <CalendarMain
          @show-term-animation="startAnimation"
          @hide-term-animation="stopAnimation"
        />
      </div>
    </main>

    <!-- 底部 -->
    <footer class="app-footer">
      <p>岁时记 · 感受四季流转的诗意</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* 基础背景装饰 */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.ink-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.03;
}

.ink-circle-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #2E8B57, transparent);
  top: -200px;
  right: -100px;
  animation: float1 20s ease-in-out infinite;
}

.ink-circle-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #8B5A2B, transparent);
  bottom: -150px;
  left: -100px;
  animation: float2 25s ease-in-out infinite;
}

.ink-circle-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #4A6741, transparent);
  top: 40%;
  left: 50%;
  animation: float3 18s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-30px, 30px); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

@keyframes float3 {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -20px); }
}

/* Canvas 动画层 */
.term-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
}

/* 渐变背景层 */
.term-bg-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  pointer-events: none;
}

/* 节气提示 */
.term-hint {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
  z-index: 6;
  pointer-events: none;
  animation: hintPulse 2s ease-in-out infinite;
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* 背景渐变过渡 */
.bg-fade-enter-active {
  transition: opacity 1s ease;
}

.bg-fade-leave-active {
  transition: opacity 0.6s ease;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

/* 提示文字过渡 */
.hint-fade-enter-active {
  transition: opacity 0.8s ease 0.3s;
}

.hint-fade-leave-active {
  transition: opacity 0.4s ease;
}

.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
}

/* 头部 */
.app-header {
  position: relative;
  z-index: 10;
  padding: 32px 24px 16px;
  text-align: center;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.logo-icon {
  font-size: 40px;
  line-height: 1;
}

.header-title {
  font-size: 32px;
  font-weight: 800;
  color: #3E2723;
  letter-spacing: 8px;
  margin: 0;
  font-family: 'Noto Serif SC', 'STSong', 'SimSun', serif;
}

.header-subtitle {
  font-size: 14px;
  color: #999;
  letter-spacing: 4px;
  margin: 4px 0 0;
}

/* 主体 */
.app-main {
  position: relative;
  z-index: 10;
  padding: 0 24px 32px;
}

.calendar-container {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(139, 90, 43, 0.08);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.04);
}

/* 底部 */
.app-footer {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 24px;
  color: #bbb;
  font-size: 13px;
  letter-spacing: 2px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .app-header {
    padding: 20px 16px 12px;
  }

  .header-title {
    font-size: 24px;
    letter-spacing: 6px;
  }

  .header-subtitle {
    font-size: 12px;
    letter-spacing: 2px;
  }

  .logo-icon {
    font-size: 32px;
  }

  .app-main {
    padding: 0 12px 24px;
  }

  .calendar-container {
    padding: 16px 12px;
    border-radius: 16px;
  }

  .app-footer {
    padding: 16px;
    font-size: 12px;
  }

  .term-hint {
    font-size: 14px;
    bottom: 20px;
  }
}
</style>
