<script setup>
import CalendarMain from './components/CalendarMain.vue'
</script>

<template>
  <div class="app-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="ink-circle ink-circle-1"></div>
      <div class="ink-circle ink-circle-2"></div>
      <div class="ink-circle ink-circle-3"></div>
    </div>

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
        <CalendarMain />
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

/* 水墨背景装饰 */
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

/* 头部 */
.app-header {
  position: relative;
  z-index: 1;
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
  z-index: 1;
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
  z-index: 1;
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
}
</style>
