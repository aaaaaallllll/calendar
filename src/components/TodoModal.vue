<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <button class="modal-close" @click="close">×</button>

        <div class="modal-header">
          <div class="date-title">{{ year }}年{{ month }}月{{ day }}日</div>
          <div class="weekday">{{ weekday }}</div>
        </div>

        <!-- 添加新待办 -->
        <div class="add-todo">
          <input
            v-model="newTodoText"
            type="text"
            placeholder="添加待办事项..."
            @keyup.enter="addTodoItem"
          />
          <button class="add-btn" @click="addTodoItem" :disabled="!newTodoText.trim()">
            添加
          </button>
        </div>

        <!-- 待办列表 -->
        <div class="todo-list">
          <div v-if="todos.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <div class="empty-text">暂无待办事项</div>
          </div>

          <div
            v-for="todo in todos"
            :key="todo.id"
            class="todo-item"
            :class="{ done: todo.done, editing: editingId === todo.id }"
          >
            <label class="checkbox">
              <input
                type="checkbox"
                :checked="todo.done"
                @change="toggleTodoItem(todo.id)"
              />
              <span class="checkmark"></span>
            </label>

            <div v-if="editingId === todo.id" class="edit-input-wrapper">
              <input
                v-model="editingText"
                type="text"
                class="edit-input"
                @keyup.enter="saveEdit(todo.id)"
                @keyup.esc="cancelEdit"
                ref="editInput"
              />
              <button class="save-btn" @click="saveEdit(todo.id)">✓</button>
              <button class="cancel-btn" @click="cancelEdit">✕</button>
            </div>

            <span v-else class="todo-text" @dblclick="startEdit(todo)">{{ todo.text }}</span>

            <div v-if="editingId !== todo.id" class="todo-actions">
              <button class="action-btn edit" @click="startEdit(todo)" title="编辑">✎</button>
              <button class="action-btn delete" @click="deleteTodoItem(todo.id)" title="删除">🗑</button>
            </div>
          </div>
        </div>

        <!-- 统计 -->
        <div v-if="todos.length > 0" class="todo-stats">
          <span>共 {{ todos.length }} 项</span>
          <span v-if="doneCount > 0">，已完成 {{ doneCount }} 项</span>
          <span v-if="undoneCount > 0" class="undone">，待完成 {{ undoneCount }} 项</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { getTodosForDate, addTodo, toggleTodo, deleteTodo, editTodo } from '../data/todos.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number, required: true }
})

const emit = defineEmits(['close', 'update'])

const todos = ref([])
const newTodoText = ref('')
const editingId = ref(null)
const editingText = ref('')
const editInput = ref(null)

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const weekday = computed(() => {
  const date = new Date(props.year, props.month - 1, props.day)
  return '星期' + weekdays[date.getDay()]
})

const doneCount = computed(() => todos.value.filter(t => t.done).length)
const undoneCount = computed(() => todos.value.filter(t => !t.done).length)

// 加载待办事项
function loadTodos() {
  todos.value = getTodosForDate(props.year, props.month, props.day)
}

// 添加待办
function addTodoItem() {
  const text = newTodoText.value.trim()
  if (!text) return

  addTodo(props.year, props.month, props.day, text)
  newTodoText.value = ''
  loadTodos()
  emit('update')
}

// 切换完成状态
function toggleTodoItem(todoId) {
  toggleTodo(props.year, props.month, props.day, todoId)
  loadTodos()
  emit('update')
}

// 删除待办
function deleteTodoItem(todoId) {
  if (confirm('确定要删除这条待办事项吗？')) {
    deleteTodo(props.year, props.month, props.day, todoId)
    loadTodos()
    emit('update')
  }
}

// 开始编辑
function startEdit(todo) {
  editingId.value = todo.id
  editingText.value = todo.text
  nextTick(() => {
    editInput.value?.focus()
  })
}

// 保存编辑
function saveEdit(todoId) {
  const text = editingText.value.trim()
  if (text) {
    editTodo(props.year, props.month, props.day, todoId, text)
    loadTodos()
    emit('update')
  }
  editingId.value = null
  editingText.value = ''
}

// 取消编辑
function cancelEdit() {
  editingId.value = null
  editingText.value = ''
}

// 关闭弹窗
function close() {
  editingId.value = null
  editingText.value = ''
  newTodoText.value = ''
  emit('close')
}

// 监听显示状态
watch(() => props.visible, (val) => {
  if (val) {
    loadTodos()
    // ESC关闭
    document.addEventListener('keydown', handleEsc)
  } else {
    document.removeEventListener('keydown', handleEsc)
  }
})

function handleEsc(e) {
  if (e.key === 'Escape') {
    if (editingId.value) {
      cancelEdit()
    } else {
      close()
    }
  }
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
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
  border-radius: 16px;
  padding: 28px;
  max-width: 420px;
  width: 100%;
  max-height: 80vh;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(139, 90, 43, 0.1);
  animation: modalIn 0.3s ease;
  display: flex;
  flex-direction: column;
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
}

.modal-close:hover {
  background: rgba(139, 90, 43, 0.15);
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(139, 90, 43, 0.1);
}

.date-title {
  font-size: 20px;
  font-weight: 600;
  color: #3E2723;
  letter-spacing: 2px;
}

.weekday {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

/* 添加待办 */
.add-todo {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.add-todo input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid rgba(139, 90, 43, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  color: #3E2723;
  outline: none;
  transition: all 0.2s;
}

.add-todo input:focus {
  border-color: rgba(139, 90, 43, 0.4);
  background: rgba(255, 255, 255, 0.8);
}

.add-todo input::placeholder {
  color: #bbb;
}

.add-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #8B5A2B;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-btn:hover:not(:disabled) {
  background: #6d4c1a;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 待办列表 */
.todo-list {
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #bbb;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.6);
}

.todo-item.done .todo-text {
  text-decoration: line-through;
  color: #999;
}

/* 复选框 */
.checkbox {
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
}

.checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(139, 90, 43, 0.3);
  border-radius: 4px;
  background: white;
  transition: all 0.2s;
}

.checkbox input:checked ~ .checkmark {
  background: #2E8B57;
  border-color: #2E8B57;
}

.checkmark::after {
  content: '';
  position: absolute;
  display: none;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox input:checked ~ .checkmark::after {
  display: block;
}

/* 待办文本 */
.todo-text {
  flex: 1;
  font-size: 14px;
  color: #3E2723;
  word-break: break-all;
  cursor: pointer;
}

/* 编辑输入 */
.edit-input-wrapper {
  flex: 1;
  display: flex;
  gap: 6px;
}

.edit-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid rgba(139, 90, 43, 0.3);
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.save-btn, .cancel-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn {
  background: #2E8B57;
  color: white;
}

.cancel-btn {
  background: rgba(139, 90, 43, 0.1);
  color: #8B5A2B;
}

/* 操作按钮 */
.todo-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(139, 90, 43, 0.1);
}

.action-btn.delete:hover {
  background: rgba(192, 57, 43, 0.1);
  color: #C0392B;
}

/* 统计 */
.todo-stats {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding-top: 12px;
  border-top: 1px solid rgba(139, 90, 43, 0.1);
}

.todo-stats .undone {
  color: #8B5A2B;
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
    padding: 20px;
    max-height: 85vh;
  }

  .date-title {
    font-size: 18px;
  }

  .todo-actions {
    opacity: 1;
  }

  .todo-list {
    max-height: 250px;
  }
}
</style>
