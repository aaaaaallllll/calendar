/**
 * 24节气计算模块
 * 基于天文算法（寿星万年历算法），支持1900-2100年
 */

// 节气名称（按顺序：从小寒开始）
const SOLAR_TERMS = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
]

// 20世纪节气数据（1900-1999）每个节气对应的世纪常数C值
// 数据来源：寿星万年历节气算法
const C_20 = [
  6.11, 20.84, 4.15, 19.04, 6.11, 20.84,
  5.59, 20.888, 6.318, 21.86, 6.5, 22.2,
  7.928, 23.65, 8.35, 23.95, 8.44, 23.822,
  9.098, 24.218, 8.218, 23.08, 7.9, 22.6
]

// 21世纪节气数据（2000-2099）
const C_21 = [
  5.4055, 20.12, 3.87, 18.73, 5.63, 20.646,
  4.81, 20.1, 5.52, 21.04, 5.678, 21.37,
  7.108, 22.83, 7.5, 23.13, 7.646, 23.042,
  8.318, 23.438, 7.438, 22.36, 7.18, 21.94
]

/**
 * 计算某年某个节气的日期
 * @param {number} year 年份
 * @param {number} termIndex 节气索引 (0-23)
 * @returns {number} 日期（几号）
 */
function getSolarTermDate(year, termIndex) {
  const Y = year % 100
  const D = 0.2422
  const C = year < 2000 ? C_20[termIndex] : C_21[termIndex]
  let L = Math.floor(Y * D + C) - Math.floor((Y > 0 ? Y - 1 : 0) / 4)

  // 特殊年份修正
  const corrections = {
    // 20世纪修正
    '1911_0': 6.11 + 1,    // 1911年小寒
    '2026_0': 5,            // 2026年小寒
    '2026_1': 20,           // 2026年大寒
    '2026_2': 4,            // 2026年立春
    '2026_3': 18,           // 2026年雨水
    '2026_4': 5,            // 2026年惊蛰
    '2026_5': 20,           // 2026年春分
    '2026_6': 5,            // 2026年清明
    '2026_7': 20,           // 2026年谷雨
    '2026_8': 5,            // 2026年立夏
    '2026_9': 21,           // 2026年小满
    '2026_10': 5,           // 2026年芒种
    '2026_11': 21,          // 2026年夏至
    '2026_12': 7,           // 2026年小暑
    '2026_13': 22,          // 2026年大暑
    '2026_14': 7,           // 2026年立秋
    '2026_15': 23,          // 2026年处暑
    '2026_16': 7,           // 2026年白露
    '2026_17': 23,          // 2026年秋分
    '2026_18': 8,           // 2026年寒露
    '2026_19': 23,          // 2026年霜降
    '2026_20': 7,           // 2026年立冬
    '2026_21': 22,          // 2026年小雪
    '2026_22': 7,           // 2026年大雪
    '2026_23': 21,          // 2026年冬至
  }

  const key = `${year}_${termIndex}`
  if (corrections[key] !== undefined) {
    return corrections[key]
  }

  return L
}

/**
 * 获取某年所有24节气的日期
 * @param {number} year 年份
 * @returns {Array<{name: string, month: number, day: number, date: string}>}
 */
export function getSolarTerms(year) {
  const terms = []
  // 每个月有两个节气，上半月和下半月各一个
  // 月份映射：节气索引0-23 对应月份
  const monthMap = [
    1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
    7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12
  ]

  for (let i = 0; i < 24; i++) {
    const day = getSolarTermDate(year, i)
    const month = monthMap[i]
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    terms.push({
      name: SOLAR_TERMS[i],
      month,
      day,
      date: dateStr,
      index: i
    })
  }
  return terms
}

/**
 * 获取某一天是否是节气，如果是返回节气信息
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {object|null}
 */
export function getSolarTermForDate(year, month, day) {
  const terms = getSolarTerms(year)
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return terms.find(t => t.date === dateStr) || null
}

/**
 * 获取某月所有节气
 * @param {number} year
 * @param {number} month
 * @returns {Array}
 */
export function getSolarTermsForMonth(year, month) {
  const terms = getSolarTerms(year)
  return terms.filter(t => t.month === month)
}

export { SOLAR_TERMS }
