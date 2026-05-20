<template>
  <div class="calendar-main">
    <!-- 头部导航 -->
    <div class="calendar-nav">
      <div class="nav-left">
        <button class="nav-btn today-btn" @click="goToday">今天</button>
      </div>

      <div class="nav-center">
        <button class="nav-btn" @click="prevYear">
          <span class="arrow">«</span>
        </button>
        <button class="nav-btn" @click="prevMonth">
          <span class="arrow">‹</span>
        </button>
        <div class="nav-title" @click="showYearPicker = !showYearPicker">
          <span class="nav-year">{{ currentYear }}</span>
          <span class="nav-sep">年</span>
          <span class="nav-month">{{ currentMonth }}</span>
          <span class="nav-sep">月</span>
        </div>
        <button class="nav-btn" @click="nextMonth">
          <span class="arrow">›</span>
        </button>
        <button class="nav-btn" @click="nextYear">
          <span class="arrow">»</span>
        </button>
      </div>

      <div class="nav-right">
        <div class="legend">
          <span class="legend-item term-legend">节气</span>
          <span class="legend-item holiday-legend">假日</span>
          <span class="legend-item todo-legend">待办</span>
        </div>
      </div>
    </div>

    <!-- 年份快速选择 -->
    <Transition name="picker">
      <div v-if="showYearPicker" class="year-picker">
        <div class="year-picker-header">
          <button class="picker-btn" @click="pickerPage--">‹</button>
          <span>{{ pickerStartYear }} - {{ pickerStartYear + 11 }}</span>
          <button class="picker-btn" @click="pickerPage++">›</button>
        </div>
        <div class="year-grid">
          <button
            v-for="y in pickerYears"
            :key="y"
            class="year-btn"
            :class="{ active: y === currentYear }"
            @click="selectYear(y)"
          >
            {{ y }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- 星期头部 -->
    <div class="weekday-header">
      <div v-for="d in weekdays" :key="d" class="weekday-cell" :class="{ weekend: d === '日' || d === '六' }">
        {{ d }}
      </div>
    </div>

    <!-- 日历网格 -->
    <Transition :name="slideAnimation" mode="out-in">
      <div
        class="calendar-grid"
        :key="`${currentYear}-${currentMonth}`"
        ref="calendarGrid"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <CalendarCell
        v-for="cell in calendarCells"
        :key="`${cell.year}-${cell.month}-${cell.day}`"
        :year="cell.year"
        :month="cell.month"
        :day="cell.day"
        :is-current-month="cell.isCurrentMonth"
        :is-today="cell.isToday"
        @click="handleCellClick"
        @show-todo="handleShowTodo"
        @show-term-animation="handleTermAnimation"
      />
      </div>
    </Transition>

    <!-- 底部节气信息 -->
    <div class="month-terms">
      <div class="month-terms-title">本月节气</div>
      <div class="month-terms-list">
        <div
          v-for="term in currentMonthTerms"
          :key="term.name"
          class="month-term-item"
          @click="handleTermClick(term)"
        >
          <span class="term-dot"></span>
          <span class="term-name">{{ term.name }}</span>
          <span class="term-date">{{ term.month }}月{{ term.day }}日</span>
        </div>
        <div v-if="currentMonthTerms.length === 0" class="no-terms">本月无节气</div>
      </div>
    </div>

    <!-- 节气/节假日详情弹窗 -->
    <TermDetail
      :visible="showDetail"
      :info="detailInfo"
      @close="showDetail = false"
      @show-todo="handleShowTodoFromDetail"
    />

    <!-- 待办事项弹窗 -->
    <TodoModal
      :visible="showTodoModal"
      :year="todoDate.year"
      :month="todoDate.month"
      :day="todoDate.day"
      @close="showTodoModal = false"
      @update="handleTodoUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CalendarCell from './CalendarCell.vue'
import TermDetail from './TermDetail.vue'
import TodoModal from './TodoModal.vue'
import { getSolarTermsForMonth } from '../utils/solarTerms.js'

const emit = defineEmits(['showTermAnimation'])

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth() + 1)
const showYearPicker = ref(false)
const showDetail = ref(false)
const detailInfo = ref(null)
const pickerPage = ref(Math.floor(today.getFullYear() / 12))

// 待办弹窗状态
const showTodoModal = ref(false)
const todoDate = ref({ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() })

// 触摸滑动状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const isSwiping = ref(false)
const swipeThreshold = 50 // 滑动阈值，超过此距离才切换

// 滑动动画方向
const slideAnimation = ref('slide-left')

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 年份选择器
const pickerStartYear = computed(() => pickerPage.value * 12)
const pickerYears = computed(() => {
  const start = pickerStartYear.value
  return Array.from({ length: 12 }, (_, i) => start + i)
})

function selectYear(y) {
  currentYear.value = y
  showYearPicker.value = false
}

// 日历格子数据
const calendarCells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  // 本月第一天是星期几
  const firstDay = new Date(year, month - 1, 1).getDay()
  // 本月天数
  const daysInMonth = new Date(year, month, 0).getDate()
  // 上月天数
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()

  const cells = []

  // 上月填充
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    cells.push({
      year: prevYear,
      month: prevMonth,
      day,
      isCurrentMonth: false,
      isToday: false
    })
  }

  // 本月
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      d === today.getDate()
    )
    cells.push({
      year,
      month,
      day: d,
      isCurrentMonth: true,
      isToday
    })
  }

  // 下月填充（补满6行）
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    cells.push({
      year: nextYear,
      month: nextMonth,
      day: d,
      isCurrentMonth: false,
      isToday: false
    })
  }

  return cells
})

// 本月节气
const currentMonthTerms = computed(() => {
  return getSolarTermsForMonth(currentYear.value, currentMonth.value)
})

// 导航方法
function prevMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
  showYearPicker.value = false
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
  showYearPicker.value = false
}

function prevYear() {
  currentYear.value--
  showYearPicker.value = false
}

function nextYear() {
  currentYear.value++
  showYearPicker.value = false
}

function goToday() {
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth() + 1
  showYearPicker.value = false
}

// 点击处理 - 节气/假日详情
function handleCellClick(info) {
  detailInfo.value = info
  showDetail.value = true
}

// 显示待办弹窗
function handleShowTodo({ year, month, day }) {
  todoDate.value = { year, month, day }
  showTodoModal.value = true
}

// 从节气/假日详情弹窗跳转到待办弹窗
function handleShowTodoFromDetail({ year, month, day }) {
  showDetail.value = false
  setTimeout(() => {
    todoDate.value = { year, month, day }
    showTodoModal.value = true
  }, 200)
}

// 显示节气动画
function handleTermAnimation(termName) {
  emit('showTermAnimation', termName)
}

// 触摸事件处理
function handleTouchStart(e) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isSwiping.value = false
}

function handleTouchMove(e) {
  if (!touchStartX.value) return
  
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  const diffX = touchStartX.value - currentX
  const diffY = touchStartY.value - currentY
  
  // 判断是否为水平滑动（水平移动距离大于垂直移动距离）
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
    isSwiping.value = true
    // 阻止默认滚动行为
    e.preventDefault()
  }
  
  touchEndX.value = currentX
}

function handleTouchEnd(e) {
  if (!isSwiping.value) {
    touchStartX.value = 0
    touchStartY.value = 0
    return
  }

  const diffX = touchStartX.value - touchEndX.value

  // 左滑（diffX > 0）→ 下一个月
  if (diffX > swipeThreshold) {
    slideAnimation.value = 'slide-left'
    nextMonth()
  }
  // 右滑（diffX < 0）→ 上一个月
  else if (diffX < -swipeThreshold) {
    slideAnimation.value = 'slide-right'
    prevMonth()
  }

  // 重置状态
  touchStartX.value = 0
  touchStartY.value = 0
  touchEndX.value = 0
  isSwiping.value = false
}

function handleTermClick(term) {
  detailInfo.value = {
    type: 'term',
    data: term,
    year: currentYear.value,
    month: term.month,
    day: term.day
  }
  showDetail.value = true
}

// 待办更新后刷新日历（触发重新渲染）
function handleTodoUpdate() {
  // 强制刷新日历单元格
  const temp = currentYear.value
  currentYear.value = 0
  setTimeout(() => {
    currentYear.value = temp
  }, 0)
}

// 点击外部关闭年份选择器
watch(showYearPicker, (val) => {
  if (val) {
    setTimeout(() => {
      document.addEventListener('click', closeYearPicker)
    }, 0)
  } else {
    document.removeEventListener('click', closeYearPicker)
  }
})

function closeYearPicker(e) {
  if (!e.target.closest('.year-picker') && !e.target.closest('.nav-title')) {
    showYearPicker.value = false
  }
}
</script>

<style scoped>
.calendar-main {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

/* 导航栏 */
.calendar-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  margin-bottom: 8px;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(139, 90, 43, 0.2);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #5D4037;
  font-size: 16px;
}

.nav-btn:hover {
  background: rgba(139, 90, 43, 0.1);
  border-color: rgba(139, 90, 43, 0.3);
}

.arrow {
  line-height: 1;
}

.today-btn {
  width: auto;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1px;
}

.nav-title {
  display: flex;
  align-items: baseline;
  cursor: pointer;
  padding: 4px 16px;
  border-radius: 8px;
  transition: background 0.2s;
  user-select: none;
}

.nav-title:hover {
  background: rgba(139, 90, 43, 0.06);
}

.nav-year {
  font-size: 22px;
  font-weight: 700;
  color: #3E2723;
  letter-spacing: 2px;
}

.nav-month {
  font-size: 22px;
  font-weight: 700;
  color: #3E2723;
  letter-spacing: 2px;
}

.nav-sep {
  font-size: 14px;
  color: #999;
  margin: 0 2px;
}

/* 图例 */
.legend {
  display: flex;
  gap: 12px;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #888;
}

.legend-item::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.term-legend::before {
  background: #2E8B57;
}

.holiday-legend::before {
  background: #C0392B;
}

.todo-legend::before {
  background: #E67E22;
  border-radius: 50%;
  width: 6px;
  height: 6px;
}

/* 年份选择器 */
.year-picker {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(139, 90, 43, 0.15);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.year-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.picker-btn {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(139, 90, 43, 0.15);
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #5D4037;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.picker-btn:hover {
  background: rgba(139, 90, 43, 0.08);
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.year-btn {
  padding: 8px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #5D4037;
  transition: all 0.2s;
}

.year-btn:hover {
  background: rgba(139, 90, 43, 0.08);
}

.year-btn.active {
  background: rgba(139, 90, 43, 0.12);
  border-color: rgba(139, 90, 43, 0.3);
  font-weight: 600;
  color: #8B5A2B;
}

/* 星期头部 */
.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;
}

.weekday-cell {
  text-align: center;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 500;
  color: #999;
  letter-spacing: 2px;
}

.weekday-cell.weekend {
  color: #C0392B;
}

/* 日历网格 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

/* 本月节气信息 */
.month-terms {
  margin-top: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(139, 90, 43, 0.08);
}

.month-terms-title {
  font-size: 14px;
  font-weight: 600;
  color: #5D4037;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.month-terms-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.month-term-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(46, 139, 87, 0.06);
  border: 1px solid rgba(46, 139, 87, 0.12);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.month-term-item:hover {
  background: rgba(46, 139, 87, 0.12);
  border-color: rgba(46, 139, 87, 0.25);
}

.term-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2E8B57;
}

.term-name {
  font-weight: 600;
  color: #2E8B57;
}

.term-date {
  color: #888;
  font-size: 12px;
}

.no-terms {
  font-size: 13px;
  color: #bbb;
}

/* 过渡动画 */
.picker-enter-active,
.picker-leave-active {
  transition: all 0.25s ease;
}

.picker-enter-from,
.picker-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 月份切换滑动动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 左滑动画：进入从右来，离开往左去 */
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 右滑动画：进入从左来，离开往右去 */
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .calendar-nav {
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 0;
  }

  .nav-left {
    order: 2;
    width: 100%;
    text-align: center;
  }

  .nav-center {
    order: 1;
    width: 100%;
    justify-content: center;
  }

  .nav-right {
    order: 3;
    width: 100%;
    text-align: center;
  }

  .nav-year,
  .nav-month {
    font-size: 18px;
  }

  .weekday-header {
    gap: 2px;
  }

  .weekday-cell {
    font-size: 12px;
    padding: 6px 0;
  }

  .calendar-grid {
    gap: 2px;
  }

  .month-terms {
    padding: 16px;
    margin-top: 16px;
  }

  .month-terms-list {
    gap: 6px;
  }

  .month-term-item {
    padding: 4px 10px;
    font-size: 12px;
  }

  .legend {
    justify-content: center;
  }
}
</style>
