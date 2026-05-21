<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-content" :style="contentStyle">
        <!-- 节气背景装饰 -->
        <div v-if="termBg" class="term-bg-decoration">
          <div class="bg-icon">{{ termBg.icon }}</div>
          <div class="bg-pattern" :class="termBg.pattern"></div>
        </div>

        <button class="modal-close" @click="close">×</button>

        <!-- 节气详情 -->
        <template v-if="info && info.type === 'term'">
          <div class="modal-header term-header">
            <div class="term-badge">{{ info.data.name }}</div>
            <div class="term-date">{{ info.year }}年{{ info.month }}月{{ info.day }}日</div>
            <div v-if="termBg" class="term-desc">{{ termBg.desc }}</div>
          </div>

          <div class="poem-section">
            <div class="poem-title">
              《{{ poemData.title }}》
              <span class="poem-author">{{ poemData.dynasty }} · {{ poemData.author }}</span>
            </div>
            <div class="poem-body">
              <p v-for="(line, i) in poemData.poem.split('\n')" :key="i">{{ line }}</p>
            </div>
            <div class="poem-divider"></div>
            <div class="poem-appreciation">{{ poemData.appreciation }}</div>
          </div>
        </template>

        <!-- 节假日详情 -->
        <template v-if="info && info.type === 'holiday'">
          <div class="modal-header holiday-header">
            <div class="holiday-emoji">{{ info.data.emoji }}</div>
            <div class="holiday-name">{{ info.data.name }}</div>
            <div class="holiday-date">{{ info.year }}年{{ info.month }}月{{ info.day }}日</div>
          </div>

          <div class="holiday-info">
            <div class="holiday-type">
              <span class="type-badge" :class="info.data.type">
                {{ typeLabel }}
              </span>
            </div>
            <div class="holiday-desc">{{ holidayDesc }}</div>
          </div>
        </template>

        <!-- 管理待办按钮 -->
        <button class="todo-entry-btn" @click="openTodo">
          📝 管理待办事项
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, watch } from 'vue'
import { getPoemForTerm } from '../data/poems.js'
import { getTermBackground } from '../data/termBackgrounds.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  info: { type: Object, default: null }
})

const emit = defineEmits(['close', 'showTodo'])

const poemData = computed(() => {
  if (props.info && props.info.type === 'term') {
    return getPoemForTerm(props.info.data.name) || {
      title: props.info.data.name,
      author: '佚名',
      dynasty: '',
      poem: '暂无古诗',
      appreciation: ''
    }
  }
  return null
})

const termBg = computed(() => {
  if (props.info && props.info.type === 'term') {
    return getTermBackground(props.info.data.name)
  }
  return null
})

const contentStyle = computed(() => {
  if (termBg.value) {
    return {
      background: `linear-gradient(135deg, ${termBg.value.color} 0%, #f5f0e8 100%)`
    }
  }
  return {
    background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)'
  }
})

const typeLabel = computed(() => {
  const labels = {
    public: '法定假日',
    traditional: '传统节日',
    partial: '部分公民假日',
    other: '纪念日'
  }
  return labels[props.info?.data?.type] || '节日'
})

const holidayDesc = computed(() => {
  const descs = {
    '元旦': '新年的第一天，公历1月1日，标志着新一年的开始。',
    '劳动节': '国际劳动节，纪念劳动人民的伟大贡献。',
    '国庆节': '中华人民共和国国庆日，举国同庆。',
    '妇女节': '国际妇女节，庆祝女性在社会各领域的成就。',
    '青年节': '纪念五四运动，弘扬青年精神。',
    '儿童节': '国际儿童节，关爱儿童成长。',
    '教师节': '感念师恩，尊师重教。',
    '春节': '中国最重要的传统节日，阖家团圆，辞旧迎新。',
    '元宵节': '农历正月十五，赏花灯、吃元宵，春节的尾声。',
    '端午节': '纪念屈原，赛龙舟、吃粽子。',
    '中秋节': '赏月团圆的日子，吃月饼，共赏明月。',
    '重阳节': '登高望远、敬老爱老的节日。',
    '七夕节': '中国情人节，牛郎织女鹊桥相会。',
    '除夕': '一年的最后一天，全家团聚，守岁迎新。',
    '腊八节': '农历十二月初八，喝腊八粥，寓意丰收吉祥。',
    '小年': '祭灶神、扫尘土，为春节做准备。',
    '龙抬头': '农历二月初二，理发祈福，春耕开始。',
  }
  return descs[props.info?.data?.name] || '一个值得纪念的日子。'
})

function close() {
  emit('close')
}

function openTodo() {
  if (props.info) {
    emit('showTodo', { year: props.info.year, month: props.info.month, day: props.info.day })
  }
}

// ESC关闭
watch(() => props.visible, (val) => {
  if (val) {
    document.addEventListener('keydown', handleEsc)
  } else {
    document.removeEventListener('keydown', handleEsc)
  }
})

function handleEsc(e) {
  if (e.key === 'Escape') close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  border-radius: 16px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(139, 90, 43, 0.1);
  animation: modalIn 0.3s ease;
  overflow: hidden;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 节气背景装饰 */
.term-bg-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  pointer-events: none;
  opacity: 0.15;
  z-index: 0;
}

.bg-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 80px;
  filter: blur(1px);
}

.bg-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: top right;
  background-size: 120px;
}

/* 各种背景图案 */
.bg-pattern.snow {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='20' cy='20' r='2' fill='%234a90a4' opacity='0.3'/%3E%3Ccircle cx='50' cy='40' r='3' fill='%234a90a4' opacity='0.2'/%3E%3Ccircle cx='80' cy='30' r='2' fill='%234a90a4' opacity='0.3'/%3E%3Ccircle cx='30' cy='60' r='2.5' fill='%234a90a4' opacity='0.25'/%3E%3Ccircle cx='70' cy='70' r='2' fill='%234a90a4' opacity='0.3'/%3E%3C/svg%3E");
}

.bg-pattern.ice {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 L60 35 L85 25 L65 50 L85 75 L60 65 L50 90 L40 65 L15 75 L35 50 L15 25 L40 35 Z' fill='%237ab8c4' opacity='0.15'/%3E%3C/svg%3E");
}

.bg-pattern.sprout {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 80 Q50 50 30 40 Q50 50 50 20 Q50 50 70 40 Q50 50 50 80' fill='%2368a357' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.rain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cline x1='30' y1='20' x2='25' y2='40' stroke='%235a8a9c' stroke-width='2' opacity='0.2'/%3E%3Cline x1='50' y1='30' x2='45' y2='50' stroke='%235a8a9c' stroke-width='2' opacity='0.25'/%3E%3Cline x1='70' y1='25' x2='65' y2='45' stroke='%235a8a9c' stroke-width='2' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.thunder {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M55 20 L45 45 L60 45 L40 80 L50 50 L35 50 Z' fill='%23d4a84b' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.flower {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='8' fill='%23e8a8c8' opacity='0.3'/%3E%3Ccircle cx='50' cy='35' r='6' fill='%23f0c4d8' opacity='0.25'/%3E%3Ccircle cx='65' cy='50' r='6' fill='%23f0c4d8' opacity='0.25'/%3E%3Ccircle cx='50' cy='65' r='6' fill='%23f0c4d8' opacity='0.25'/%3E%3Ccircle cx='35' cy='50' r='6' fill='%23f0c4d8' opacity='0.25'/%3E%3C/svg%3E");
}

.bg-pattern.willow {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 20 Q25 50 20 80' stroke='%2378a860' stroke-width='2' fill='none' opacity='0.2'/%3E%3Cpath d='M35 15 Q40 45 35 85' stroke='%2378a860' stroke-width='2' fill='none' opacity='0.25'/%3E%3Cpath d='M50 20 Q55 50 50 80' stroke='%2378a860' stroke-width='2' fill='none' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cellipse cx='50' cy='50' rx='3' ry='8' fill='%23b8a860' opacity='0.3'/%3E%3Cellipse cx='40' cy='55' rx='3' ry='7' fill='%23b8a860' opacity='0.25'/%3E%3Cellipse cx='60' cy='55' rx='3' ry='7' fill='%23b8a860' opacity='0.25'/%3E%3C/svg%3E");
}

.bg-pattern.lotus {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 30 Q30 50 35 70 Q50 60 65 70 Q70 50 50 30' fill='%23e8a8b8' opacity='0.25'/%3E%3Cpath d='M50 60 L50 85' stroke='%2368a060' stroke-width='3' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.wheat {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 80 L50 40' stroke='%23c4a040' stroke-width='2' opacity='0.3'/%3E%3Cellipse cx='50' cy='35' rx='4' ry='6' fill='%23d4b050' opacity='0.25'/%3E%3Cellipse cx='45' cy='42' rx='3' ry='5' fill='%23d4b050' opacity='0.2'/%3E%3Cellipse cx='55' cy='42' rx='3' ry='5' fill='%23d4b050' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.plum {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='40' cy='40' r='5' fill='%23e8a0a0' opacity='0.3'/%3E%3Ccircle cx='60' cy='35' r='4' fill='%23e8a0a0' opacity='0.25'/%3E%3Ccircle cx='55' cy='55' r='4' fill='%23e8a0a0' opacity='0.25'/%3E%3Cpath d='M40 40 Q50 50 60 35' stroke='%23604040' stroke-width='1' fill='none' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.sun {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='20' fill='%23f4d060' opacity='0.25'/%3E%3Cline x1='50' y1='15' x2='50' y2='25' stroke='%23f4d060' stroke-width='3' opacity='0.2'/%3E%3Cline x1='50' y1='75' x2='50' y2='85' stroke='%23f4d060' stroke-width='3' opacity='0.2'/%3E%3Cline x1='15' y1='50' x2='25' y2='50' stroke='%23f4d060' stroke-width='3' opacity='0.2'/%3E%3Cline x1='75' y1='50' x2='85' y2='50' stroke='%23f4d060' stroke-width='3' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.heat {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M30 30 Q35 40 30 50' stroke='%23e8a060' stroke-width='3' fill='none' opacity='0.2'/%3E%3Cpath d='M50 25 Q55 35 50 45' stroke='%23e8a060' stroke-width='3' fill='none' opacity='0.25'/%3E%3Cpath d='M70 30 Q75 40 70 50' stroke='%23e8a060' stroke-width='3' fill='none' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.firefly {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='30' cy='30' r='3' fill='%23f4e860' opacity='0.4'/%3E%3Ccircle cx='70' cy='40' r='2' fill='%23f4e860' opacity='0.35'/%3E%3Ccircle cx='50' cy='60' r='3' fill='%23f4e860' opacity='0.4'/%3E%3Ccircle cx='80' cy='70' r='2' fill='%23f4e860' opacity='0.35'/%3E%3C/svg%3E");
}

.bg-pattern.maple {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20 L60 40 L80 35 L65 50 L75 70 L50 55 L25 70 L35 50 L20 35 L40 40 Z' fill='%23d48440' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.cloud {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cellipse cx='40' cy='40' rx='15' ry='10' fill='%23a8b8c8' opacity='0.2'/%3E%3Cellipse cx='60' cy='45' rx='12' ry='8' fill='%23a8b8c8' opacity='0.15'/%3E%3Cellipse cx='50' cy='35' rx='10' ry='7' fill='%23a8b8c8' opacity='0.15'/%3E%3C/svg%3E");
}

.bg-pattern.dew {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cellipse cx='35' cy='35' rx='4' ry='6' fill='%2378a8c0' opacity='0.25'/%3E%3Cellipse cx='65' cy='45' rx='3' ry='5' fill='%2378a8c0' opacity='0.2'/%3E%3Cellipse cx='50' cy='65' rx='4' ry='6' fill='%2378a8c0' opacity='0.25'/%3E%3C/svg%3E");
}

.bg-pattern.chrysanthemum {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='6' fill='%23e8d040' opacity='0.3'/%3E%3Cpath d='M50 30 L50 44 M50 56 L50 70 M30 50 L44 50 M56 50 L70 50 M35 35 L45 45 M55 55 L65 65 M65 35 L55 45 M45 55 L35 65' stroke='%23e8d040' stroke-width='3' opacity='0.2'/%3E%3C/svg%3E");
}

.bg-pattern.reed {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M30 80 Q35 50 30 30' stroke='%23b8a880' stroke-width='2' fill='none' opacity='0.25'/%3E%3Cpath d='M50 80 Q55 45 50 25' stroke='%23b8a880' stroke-width='2' fill='none' opacity='0.3'/%3E%3Cpath d='M70 80 Q65 50 70 30' stroke='%23b8a880' stroke-width='2' fill='none' opacity='0.25'/%3E%3C/svg%3E");
}

.bg-pattern.frost {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 30 L50 50 L35 35 M50 50 L65 35 M50 50 L35 65 M50 50 L65 65' stroke='%2378a8b8' stroke-width='2' fill='none' opacity='0.25'/%3E%3C/svg%3E");
}

.bg-pattern.winter {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M40 40 L60 60 M60 40 L40 60' stroke='%2380a0b0' stroke-width='3' opacity='0.15'/%3E%3C/svg%3E");
}

.bg-pattern.light-snow {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='35' cy='35' r='2' fill='%2380a0b0' opacity='0.3'/%3E%3Ccircle cx='65' cy='40' r='2' fill='%2380a0b0' opacity='0.25'/%3E%3Ccircle cx='50' cy='60' r='2' fill='%2380a0b0' opacity='0.3'/%3E%3C/svg%3E");
}

.bg-pattern.heavy-snow {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='30' cy='30' r='3' fill='%237090a0' opacity='0.25'/%3E%3Ccircle cx='60' cy='35' r='3' fill='%237090a0' opacity='0.3'/%3E%3Ccircle cx='45' cy='55' r='3' fill='%237090a0' opacity='0.25'/%3E%3Ccircle cx='75' cy='60' r='3' fill='%237090a0' opacity='0.3'/%3E%3C/svg%3E");
}

.bg-pattern.solstice {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='15' fill='none' stroke='%2380a0a0' stroke-width='2' opacity='0.2'/%3E%3Cpath d='M35 50 L30 50 M65 50 L70 50 M50 35 L50 30 M50 65 L50 70' stroke='%2380a0a0' stroke-width='2' opacity='0.15'/%3E%3C/svg%3E");
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(139, 90, 43, 0.08);
  border-radius: 50%;
  font-size: 20px;
  color: #8B5A2B;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 1;
}

.modal-close:hover {
  background: rgba(139, 90, 43, 0.15);
}

/* 节气头部 */
.term-header {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.term-badge {
  display: inline-block;
  font-size: 28px;
  font-weight: 700;
  color: #2E8B57;
  letter-spacing: 4px;
  margin-bottom: 8px;
}

.term-date {
  font-size: 14px;
  color: #888;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.term-desc {
  font-size: 13px;
  color: #999;
  font-style: italic;
}

/* 古诗区域 */
.poem-section {
  text-align: center;
  position: relative;
  z-index: 1;
}

.poem-title {
  font-size: 18px;
  font-weight: 600;
  color: #5D4037;
  margin-bottom: 16px;
}

.poem-author {
  font-size: 14px;
  font-weight: 400;
  color: #999;
  margin-left: 4px;
}

.poem-body {
  margin: 20px 0;
  line-height: 2;
}

.poem-body p {
  font-size: 16px;
  color: #3E2723;
  letter-spacing: 1px;
  margin: 0;
}

.poem-divider {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #C4A882, transparent);
  margin: 20px auto;
}

.poem-appreciation {
  font-size: 13px;
  color: #888;
  line-height: 1.8;
  text-align: left;
  padding: 12px 16px;
  background: rgba(139, 90, 43, 0.04);
  border-radius: 8px;
  border-left: 3px solid #C4A882;
}

/* 节假日头部 */
.holiday-header {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.holiday-emoji {
  font-size: 48px;
  margin-bottom: 8px;
}

.holiday-name {
  font-size: 28px;
  font-weight: 700;
  color: #C0392B;
  letter-spacing: 4px;
  margin-bottom: 8px;
}

.holiday-date {
  font-size: 14px;
  color: #888;
}

.holiday-info {
  text-align: center;
  position: relative;
  z-index: 1;
}

.type-badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.type-badge.public {
  background: rgba(192, 57, 43, 0.1);
  color: #C0392B;
}

.type-badge.traditional {
  background: rgba(139, 90, 43, 0.1);
  color: #8B5A2B;
}

.type-badge.partial {
  background: rgba(52, 152, 219, 0.1);
  color: #2980B9;
}

.type-badge.other {
  background: rgba(149, 165, 166, 0.1);
  color: #7F8C8D;
}

.holiday-desc {
  margin-top: 16px;
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  padding: 12px 16px;
  background: rgba(192, 57, 43, 0.03);
  border-radius: 8px;
  border-left: 3px solid #E8D5C4;
}

/* 管理待办按钮 */
.todo-entry-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  border: 1px dashed rgba(139, 90, 43, 0.25);
  border-radius: 10px;
  background: rgba(139, 90, 43, 0.04);
  color: #8B5A2B;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  z-index: 1;
}

.todo-entry-btn:hover {
  background: rgba(139, 90, 43, 0.1);
  border-color: rgba(139, 90, 43, 0.4);
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .modal-content {
    padding: 24px 20px;
    border-radius: 12px;
    max-width: 100%;
  }

  .term-badge,
  .holiday-name {
    font-size: 24px;
  }

  .poem-body p {
    font-size: 15px;
  }

  .holiday-emoji {
    font-size: 40px;
  }

  .bg-icon {
    font-size: 60px;
  }

  .term-bg-decoration {
    width: 100px;
    height: 100px;
  }
}
</style>