<script setup>
import { ref, watch } from 'vue'
import CalendarMain from './components/CalendarMain.vue'

const currentAnimation = ref(null)
const animationKey = ref(0)

// 节气动画类型
const ANIMATION_TYPES = {
  // 冬季 - 雪花
  '小寒': 'snow', '大寒': 'snow', '小雪': 'light-snow', '大雪': 'heavy-snow', '冬至': 'snow',
  // 早春 - 细雨
  '立春': 'rain', '雨水': 'rain', '惊蛰': 'rain',
  // 春季 - 花瓣/柳絮
  '春分': 'petals', '清明': 'petals', '谷雨': 'rain',
  // 初夏 - 柳絮
  '立夏': 'willow', '小满': 'willow',
  // 夏季 - 萤火虫
  '芒种': 'fireflies', '夏至': 'fireflies', '小暑': 'fireflies', '大暑': 'fireflies',
  // 夏末秋初 - 落叶
  '立秋': 'leaves', '处暑': 'leaves',
  // 秋季 - 枫叶/菊花
  '白露': 'leaves', '秋分': 'leaves', '寒露': 'leaves', '霜降': 'leaves',
  // 初冬
  '立冬': 'snow'
}

// 节气特效配置
const TERM_EFFECTS = {
  '小寒': { bg: '#E8F4F8', color: '#4a90a4', particle: '❄️', name: '雪花' },
  '大寒': { bg: '#E0F0F5', color: '#7ab8c4', particle: '❄️', name: '雪花' },
  '立春': { bg: '#F0F8E8', color: '#68a357', particle: '💧', name: '春雨' },
  '雨水': { bg: '#E8F4F0', color: '#5a8a9c', particle: '💧', name: '细雨' },
  '惊蛰': { bg: '#F0F5E8', color: '#7a8a5a', particle: '⚡', name: '春雷' },
  '春分': { bg: '#F5F8E8', color: '#e8a8c8', particle: '🌸', name: '花瓣' },
  '清明': { bg: '#E8F5E8', color: '#78a860', particle: '🌿', name: '柳絮' },
  '谷雨': { bg: '#E8F0E8', color: '#5a7a8a', particle: '💧', name: '谷雨' },
  '立夏': { bg: '#F0F8E8', color: '#68a060', particle: '🍃', name: '新绿' },
  '小满': { bg: '#F5F8E0', color: '#b8a860', particle: '🌾', name: '麦穗' },
  '芒种': { bg: '#F8F5E0', color: '#98c878', particle: '✨', name: '萤火' },
  '夏至': { bg: '#FFF8E0', color: '#f4d060', particle: '☀️', name: '骄阳' },
  '小暑': { bg: '#FFF5E8', color: '#e8a060', particle: '🔥', name: '热浪' },
  '大暑': { bg: '#FFF0E0', color: '#e89040', particle: '✨', name: '萤火' },
  '立秋': { bg: '#F8F0E0', color: '#d48440', particle: '🍂', name: '落叶' },
  '处暑': { bg: '#F5F0E8', color: '#a8b8c8', particle: '☁️', name: '云霞' },
  '白露': { bg: '#F0F5F0', color: '#78a8c0', particle: '💧', name: '露珠' },
  '秋分': { bg: '#F5F0E8', color: '#e8d040', particle: '🌼', name: '菊花' },
  '寒露': { bg: '#F0F0E8', color: '#b8a880', particle: '🍂', name: '枫叶' },
  '霜降': { bg: '#E8F0F0', color: '#78a8b8', particle: '❄️', name: '霜花' },
  '立冬': { bg: '#E8F0F5', color: '#80a0b0', particle: '❄️', name: '初雪' },
  '小雪': { bg: '#E5F0F8', color: '#80a0b0', particle: '🌨️', name: '小雪' },
  '大雪': { bg: '#E0F0F8', color: '#7090a0', particle: '❄️', name: '大雪' },
  '冬至': { bg: '#E8F0F5', color: '#80a0a0', particle: '❄️', name: '雪花' }
}

// 显示节气动画
function showAnimation(termName) {
  const effect = TERM_EFFECTS[termName]
  if (effect) {
    currentAnimation.value = {
      term: termName,
      ...effect
    }
    animationKey.value++
  }
}

// 隐藏动画
function hideAnimation() {
  currentAnimation.value = null
}
</script>

<template>
  <div class="app-container">
    <!-- 基础背景装饰 -->
    <div class="bg-decoration">
      <div class="ink-circle ink-circle-1"></div>
      <div class="ink-circle ink-circle-2"></div>
      <div class="ink-circle ink-circle-3"></div>
    </div>

    <!-- 节气动态背景 -->
    <Transition name="bg-fade">
      <div
        v-if="currentAnimation"
        :key="animationKey"
        class="term-bg-overlay"
        @click="hideAnimation"
      >
        <!-- 渐变背景层 -->
        <div class="term-bg-gradient" :style="{ background: `linear-gradient(135deg, ${currentAnimation.bg}88 0%, transparent 60%)` }"></div>
        <!-- 动态粒子 -->
        <div class="particles-container">
          <!-- 雪花 -->
          <template v-if="currentAnimation.name === '雪花' || currentAnimation.name === '初雪' || currentAnimation.name === '小雪' || currentAnimation.name === '大雪'">
            <div v-for="n in 50" :key="n" class="particle snow-particle" :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
              fontSize: `${12 + Math.random() * 16}px`,
              opacity: 0.3 + Math.random() * 0.5
            }">❄️</div>
          </template>

          <!-- 花瓣 -->
          <template v-if="currentAnimation.name === '花瓣'">
            <div v-for="n in 40" :key="n" class="particle petal-particle" :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              fontSize: `${14 + Math.random() * 14}px`,
              opacity: 0.3 + Math.random() * 0.4
            }">🌸</div>
          </template>

          <!-- 春雨 -->
          <template v-if="currentAnimation.name === '春雨' || currentAnimation.name === '细雨' || currentAnimation.name === '谷雨'">
            <div v-for="n in 80" :key="n" class="particle rain-particle" :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: 0.2 + Math.random() * 0.3
            }"></div>
          </template>

          <!-- 萤火虫 -->
          <template v-if="currentAnimation.name === '萤火'">
            <div v-for="n in 30" :key="n" class="particle firefly-particle" :style="{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              fontSize: `${10 + Math.random() * 12}px`
            }">✨</div>
          </template>

          <!-- 落叶 -->
          <template v-if="currentAnimation.name === '落叶' || currentAnimation.name === '枫叶'">
            <div v-for="n in 35" :key="n" class="particle leaf-particle" :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
              fontSize: `${16 + Math.random() * 12}px`,
              opacity: 0.4 + Math.random() * 0.3
            }">🍂</div>
          </template>

          <!-- 新绿 -->
          <template v-if="currentAnimation.name === '新绿'">
            <div v-for="n in 30" :key="n" class="particle leaf-particle" :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              fontSize: `${14 + Math.random() * 10}px`,
              opacity: 0.3 + Math.random() * 0.4
            }">🍃</div>
          </template>

          <!-- 麦穗 -->
          <template v-if="currentAnimation.name === '麦穗'">
            <div v-for="n in 25" :key="n" class="particle wheat-particle" :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              fontSize: `${16 + Math.random() * 10}px`,
              opacity: 0.4 + Math.random() * 0.3
            }">🌾</div>
          </template>

          <!-- 菊花 -->
          <template v-if="currentAnimation.name === '菊花'">
            <div v-for="n in 30" :key="n" class="particle petal-particle" :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 7}s`,
              animationDuration: `${6 + Math.random() * 5}s`,
              fontSize: `${14 + Math.random() * 12}px`,
              opacity: 0.3 + Math.random() * 0.4
            }">🌼</div>
          </template>

          <!-- 柳絮 -->
          <template v-if="currentAnimation.name === '柳絮'">
            <div v-for="n in 40" :key="n" class="particle willow-particle" :style="{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
              fontSize: `${10 + Math.random() * 8}px`,
              opacity: 0.3 + Math.random() * 0.4
            }">🌿</div>
          </template>
        </div>

        <!-- 节气提示 -->
        <div class="term-hint" :style="{ color: currentAnimation.color }">
          {{ currentAnimation.term }} · {{ currentAnimation.name }}
        </div>
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
        <CalendarMain @show-term-animation="showAnimation" />
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

/* 节气动态背景 */
.term-bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  pointer-events: none;
}

.term-bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  animation: gradientFadeIn 1.2s ease forwards;
}

@keyframes gradientFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

/* 粒子基础样式 */
.particle {
  position: absolute;
  top: -50px;
  pointer-events: none;
}

/* 雪花飘落 */
.snow-particle {
  animation: snowFall linear infinite;
}

@keyframes snowFall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* 花瓣飘落 */
.petal-particle {
  animation: petalFall linear infinite;
}

@keyframes petalFall {
  0% {
    transform: translateY(-20px) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) translateX(30px) rotate(180deg);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(-20px) rotate(360deg);
    opacity: 0;
  }
}

/* 雨滴 */
.rain-particle {
  width: 2px;
  height: 15px;
  background: linear-gradient(to bottom, transparent, rgba(100, 150, 200, 0.6));
  border-radius: 0 0 2px 2px;
  animation: rainFall linear infinite;
}

@keyframes rainFall {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0.3;
  }
}

/* 萤火虫 */
.firefly-particle {
  animation: fireflyGlow ease-in-out infinite;
}

@keyframes fireflyGlow {
  0%, 100% {
    opacity: 0;
    transform: translate(0, 0);
  }
  25% {
    opacity: 1;
    transform: translate(20px, -20px);
  }
  50% {
    opacity: 0.5;
    transform: translate(-10px, 10px);
  }
  75% {
    opacity: 1;
    transform: translate(15px, 15px);
  }
}

/* 落叶飘落 */
.leaf-particle {
  animation: leafFall linear infinite;
}

@keyframes leafFall {
  0% {
    transform: translateY(-30px) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  25% {
    transform: translateY(25vh) translateX(40px) rotate(90deg);
  }
  50% {
    transform: translateY(50vh) translateX(-20px) rotate(180deg);
  }
  75% {
    transform: translateY(75vh) translateX(30px) rotate(270deg);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(10px) rotate(360deg);
    opacity: 0;
  }
}

/* 柳絮飘飞 */
.willow-particle {
  animation: willowFloat linear infinite;
}

@keyframes willowFloat {
  0% {
    transform: translateY(-20px) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  30% {
    transform: translateY(30vh) translateX(50px);
  }
  50% {
    transform: translateY(50vh) translateX(-30px);
  }
  70% {
    transform: translateY(70vh) translateX(40px);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
}

/* 麦穗摇曳 */
.wheat-particle {
  animation: wheatSway ease-in-out infinite;
}

@keyframes wheatSway {
  0% {
    transform: translateY(-20px) rotate(-15deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  25% {
    transform: translateY(25vh) rotate(15deg);
  }
  50% {
    transform: translateY(50vh) rotate(-10deg);
  }
  75% {
    transform: translateY(75vh) rotate(20deg);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(-5deg);
    opacity: 0;
  }
}

/* 节气提示 */
.term-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
  animation: hintPulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* 背景过渡 */
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
