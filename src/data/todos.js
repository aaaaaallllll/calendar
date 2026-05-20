/**
 * 待办事项数据管理模块
 * 使用 localStorage 持久化存储
 */

const STORAGE_KEY = 'chinese-calendar-todos'

/**
 * 获取某年某月某日的待办事项
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {Array<{id, text, done, createdAt}>}
 */
export function getTodosForDate(year, month, day) {
  const todos = getAllTodos()
  const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return todos[dateKey] || []
}

/**
 * 获取某月所有有待办事项的日期
 * @param {number} year
 * @param {number} month
 * @returns {Array<{day, count, hasUndone}>}
 */
export function getTodoDaysForMonth(year, month) {
  const todos = getAllTodos()
  const prefix = `${year}-${String(month).padStart(2, '0')}-`
  const days = []

  Object.entries(todos).forEach(([dateKey, todoList]) => {
    if (dateKey.startsWith(prefix) && todoList.length > 0) {
      const day = parseInt(dateKey.slice(-2))
      const hasUndone = todoList.some(t => !t.done)
      days.push({
        day,
        count: todoList.length,
        hasUndone
      })
    }
  })

  return days.sort((a, b) => a.day - b.day)
}

/**
 * 添加待办事项
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {string} text
 * @returns {object} 新增的待办事项
 */
export function addTodo(year, month, day, text) {
  const todos = getAllTodos()
  const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const newTodo = {
    id: Date.now().toString(),
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString()
  }

  if (!todos[dateKey]) {
    todos[dateKey] = []
  }
  todos[dateKey].push(newTodo)
  saveTodos(todos)

  return newTodo
}

/**
 * 切换待办事项完成状态
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {string} todoId
 * @returns {boolean}
 */
export function toggleTodo(year, month, day, todoId) {
  const todos = getAllTodos()
  const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  if (!todos[dateKey]) return false

  const todo = todos[dateKey].find(t => t.id === todoId)
  if (todo) {
    todo.done = !todo.done
    saveTodos(todos)
    return true
  }
  return false
}

/**
 * 删除待办事项
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {string} todoId
 * @returns {boolean}
 */
export function deleteTodo(year, month, day, todoId) {
  const todos = getAllTodos()
  const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  if (!todos[dateKey]) return false

  const index = todos[dateKey].findIndex(t => t.id === todoId)
  if (index > -1) {
    todos[dateKey].splice(index, 1)
    if (todos[dateKey].length === 0) {
      delete todos[dateKey]
    }
    saveTodos(todos)
    return true
  }
  return false
}

/**
 * 编辑待办事项文本
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {string} todoId
 * @param {string} newText
 * @returns {boolean}
 */
export function editTodo(year, month, day, todoId, newText) {
  const todos = getAllTodos()
  const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  if (!todos[dateKey]) return false

  const todo = todos[dateKey].find(t => t.id === todoId)
  if (todo) {
    todo.text = newText.trim()
    saveTodos(todos)
    return true
  }
  return false
}

/**
 * 获取所有待办事项
 * @returns {object}
 */
function getAllTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    console.error('Failed to load todos:', e)
    return {}
  }
}

/**
 * 保存所有待办事项
 * @param {object} todos
 */
function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (e) {
    console.error('Failed to save todos:', e)
  }
}

/**
 * 导出数据（备份）
 * @returns {string} JSON字符串
 */
export function exportTodos() {
  return JSON.stringify(getAllTodos(), null, 2)
}

/**
 * 导入数据（恢复）
 * @param {string} jsonString
 * @returns {boolean}
 */
export function importTodos(jsonString) {
  try {
    const data = JSON.parse(jsonString)
    saveTodos(data)
    return true
  } catch (e) {
    console.error('Failed to import todos:', e)
    return false
  }
}
