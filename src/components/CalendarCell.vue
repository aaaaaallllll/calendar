<template>
  <div class="calendar-cell" :class="cellClasses" @click="handleClick">
    <div class="cell-day">{{ day }}</div>
    <div v-if="solarTerm" class="cell-term" :title="solarTerm.name + ' - 点击查看古诗'">
      {{ solarTerm.name }}
    </div>
    <div v-if="holiday && !solarTerm" class="cell-holiday" :title="holiday.name">
      {{ holiday.name }}
    </div>
    <!-- 待办标记 -->
    <div v-if="hasTodos" class="todo-indicator" :class="{ 'all-done': !hasUndoneTodos }">
      <span class="todo-dot"></span>
      <span v-if="todoCount > 1" class="todo-count">{{ todoCount }}</span>
    </div>
    <div v-if="isToday" class="today-dot"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getSolarTermForDate } from '../utils/solarTerms.js'
import { getHolidayForDate } from '../utils/holidays.js'
import { getTodosForDate } from '../data/todos.js'

const props = defineProps({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number, required: true },
  isCurrentMonth: { type: Boolean, default: true },
  isToday: { type: Boolean, default: false }
})

const emit = defineEmits(['click', 'showTodo'])

const solarTerm = computed(() => {
  if (!props.isCurrentMonth) return null
  return getSolarTermForDate(props.year, props.month, props.day)
})

const holiday = computed(() => {
  if (!props.isCurrentMonth) return null
  return getHolidayForDate(props.year, props.month, props.day)
})

// 获取待办信息
const todos = computed(() => {
  if (!props.isCurrentMonth) return []
  return getTodosForDate(props.year, props.month, props.day)
})

const hasTodos = computed(() => todos.value.length > 0)
const todoCount = computed(() => todos.value.length)
const hasUndoneTodos = computed(() => todos.value.some(t => !t.done))

const cellClasses = computed(() => ({
  'other-month': !props.isCurrentMonth,
  'is-today': props.isToday,
  'is-term': !!solarTerm.value,
  'is-holiday': !!holiday.value && !solarTerm.value,
  'is-public-holiday': holiday.value && (holiday.value.type === 'public' || holiday.value.type === 'traditional'),
  'has-todos': hasTodos.value
}))

function handleClick() {
  // 如果有节气或假日，显示详情
  if (solarTerm.value) {
    emit('click', { type: 'term', data: solarTerm.value, year: props.year, month: props.month, day: props.day })
    return
  }
  if (holiday.value) {
    emit('click', { type: 'holiday', data: holiday.value, year: props.year, month: props.month, day: props.day })
    return
  }
  // 否则显示待办
  emit('showTodo', { year: props.year, month: props.month, day: props.day })
}
</script>

<style scoped>
.calendar-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70px;
  padding: 4px 2px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.calendar-cell:hover {
  background: rgba(139, 90, 43, 0.06);
  border-color: rgba(139, 90, 43, 0.15);
}

.other-month {
  opacity: 0.3;
  cursor: default;
}

.other-month:hover {
  background: transparent;
  border-color: transparent;
}

.cell-day {
  font-size: 16px;
  font-weight: 500;
  color: #2c2c2c;
  line-height: 1.4;
}

.other-month .cell-day {
  color: #999;
}

.is-today .cell-day {
  color: #8B5A2B;
  font-weight: 700;
}

.is-today {
  background: rgba(139, 90, 43, 0.08);
  border-color: rgba(139, 90, 43, 0.3);
}

.today-dot {
  position: absolute;
  bottom: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #8B5A2B;
}

.cell-term {
  font-size: 11px;
  color: #2E8B57;
  font-weight: 600;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;
}

.is-term {
  background: rgba(46, 139, 87, 0.06);
  border-color: rgba(46, 139, 87, 0.2);
}

.is-term:hover {
  background: rgba(46, 139, 87, 0.12);
  border-color: rgba(46, 139, 87, 0.35);
}

.cell-holiday {
  font-size: 11px;
  color: #C0392B;
  font-weight: 500;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;
}

.is-public-holiday {
  background: rgba(192, 57, 43, 0.05);
  border-color: rgba(192, 57, 43, 0.15);
}

.is-public-holiday:hover {
  background: rgba(192, 57, 43, 0.1);
  border-color: rgba(192, 57, 43, 0.3);
}

/* 待办指示器 */
.todo-indicator {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.todo-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E67E22;
}

.todo-indicator.all-done .todo-dot {
  background: #95A5A6;
}

.todo-count {
  font-size: 9px;
  color: #E67E22;
  font-weight: 600;
}

.todo-indicator.all-done .todo-count {
  color: #95A5A6;
}

.has-todos {
  border-color: rgba(230, 126, 34, 0.15);
}

.has-todos:hover {
  border-color: rgba(230, 126, 34, 0.3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .calendar-cell {
    min-height: 52px;
    padding: 2px 1px;
    border-radius: 4px;
  }

  .cell-day {
    font-size: 14px;
  }

  .cell-term,
  .cell-holiday {
    font-size: 9px;
  }

  .todo-dot {
    width: 5px;
    height: 5px;
  }

  .todo-count {
    font-size: 8px;
  }
}
</style>
