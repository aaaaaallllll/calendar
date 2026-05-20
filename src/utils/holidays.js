/**
 * 中国节假日数据模块
 * 包含固定节假日和调休安排
 * 支持动态计算和手动配置
 */

/**
 * 固定公历节假日（每年固定日期）
 */
const FIXED_HOLIDAYS = [
  { month: 1, day: 1, name: '元旦', type: 'public', emoji: '🎉' },
  { month: 3, day: 8, name: '妇女节', type: 'partial', emoji: '💐' },
  { month: 4, day: 1, name: '愚人节', type: 'other', emoji: '🤡' },
  { month: 5, day: 1, name: '劳动节', type: 'public', emoji: '👷' },
  { month: 5, day: 4, name: '青年节', type: 'partial', emoji: '🌟' },
  { month: 6, day: 1, name: '儿童节', type: 'partial', emoji: '🎈' },
  { month: 7, day: 1, name: '建党节', type: 'other', emoji: '🚩' },
  { month: 8, day: 1, name: '建军节', type: 'other', emoji: '🎖️' },
  { month: 9, day: 10, name: '教师节', type: 'other', emoji: '📚' },
  { month: 10, day: 1, name: '国庆节', type: 'public', emoji: '🇨🇳' },
  { month: 10, day: 2, name: '国庆节', type: 'public', emoji: '🇨🇳' },
  { month: 10, day: 3, name: '国庆节', type: 'public', emoji: '🇨🇳' },
  { month: 12, day: 24, name: '平安夜', type: 'other', emoji: '🎄' },
  { month: 12, day: 25, name: '圣诞节', type: 'other', emoji: '🎅' },
]

/**
 * 农历节日（农历固定日期，需要农历转换）
 * 这里用公历近似日期存储，每年需要更新
 * 简化处理：存储常见农历节日的大致公历日期范围
 */
const LUNAR_HOLIDAYS_INFO = [
  { name: '春节', type: 'public', emoji: '🧨', lunarMonth: 1, lunarDay: 1 },
  { name: '元宵节', type: 'traditional', emoji: '🏮', lunarMonth: 1, lunarDay: 15 },
  { name: '龙抬头', type: 'traditional', emoji: '🐉', lunarMonth: 2, lunarDay: 2 },
  { name: '端午节', type: 'public', emoji: '🐉', lunarMonth: 5, lunarDay: 5 },
  { name: '七夕节', type: 'traditional', emoji: '💕', lunarMonth: 7, lunarDay: 7 },
  { name: '中秋节', type: 'public', emoji: '🌕', lunarMonth: 8, lunarDay: 15 },
  { name: '重阳节', type: 'traditional', emoji: '🏔️', lunarMonth: 9, lunarDay: 9 },
  { name: '腊八节', type: 'traditional', emoji: '🥣', lunarMonth: 12, lunarDay: 8 },
  { name: '小年', type: 'traditional', emoji: '🧹', lunarMonth: 12, lunarDay: 23 },
  { name: '除夕', type: 'public', emoji: '🎆', lunarMonth: 12, lunarDay: 30 },
]

/**
 * 简化的农历数据表（2024-2030年主要农历节日公历日期）
 * 数据格式: { year: { 'MM-DD': '节日名' } }
 */
const LUNAR_HOLIDAYS_DATES = {
  2024: {
    '02-10': { name: '除夕', type: 'public', emoji: '🎆' },
    '02-11': { name: '春节', type: 'public', emoji: '🧨' },
    '02-24': { name: '元宵节', type: 'traditional', emoji: '🏮' },
    '03-11': { name: '龙抬头', type: 'traditional', emoji: '🐉' },
    '06-10': { name: '端午节', type: 'public', emoji: '🐉' },
    '08-10': { name: '七夕节', type: 'traditional', emoji: '💕' },
    '09-17': { name: '中秋节', type: 'public', emoji: '🌕' },
    '10-11': { name: '重阳节', type: 'traditional', emoji: '🏔️' },
    '12-08': { name: '腊八节', type: 'traditional', emoji: '🥣' },
    '02-02': { name: '小年', type: 'traditional', emoji: '🧹' },
  },
  2025: {
    '01-28': { name: '除夕', type: 'public', emoji: '🎆' },
    '01-29': { name: '春节', type: 'public', emoji: '🧨' },
    '02-12': { name: '元宵节', type: 'traditional', emoji: '🏮' },
    '02-28': { name: '龙抬头', type: 'traditional', emoji: '🐉' },
    '05-31': { name: '端午节', type: 'public', emoji: '🐉' },
    '07-31': { name: '七夕节', type: 'traditional', emoji: '💕' },
    '10-06': { name: '中秋节', type: 'public', emoji: '🌕' },
    '10-29': { name: '重阳节', type: 'traditional', emoji: '🏔️' },
    '12-28': { name: '腊八节', type: 'traditional', emoji: '🥣' },
    '01-22': { name: '小年', type: 'traditional', emoji: '🧹' },
  },
  2026: {
    '02-16': { name: '除夕', type: 'public', emoji: '🎆' },
    '02-17': { name: '春节', type: 'public', emoji: '🧨' },
    '03-03': { name: '元宵节', type: 'traditional', emoji: '🏮' },
    '03-18': { name: '龙抬头', type: 'traditional', emoji: '🐉' },
    '06-19': { name: '端午节', type: 'public', emoji: '🐉' },
    '08-19': { name: '七夕节', type: 'traditional', emoji: '💕' },
    '09-25': { name: '中秋节', type: 'public', emoji: '🌕' },
    '10-18': { name: '重阳节', type: 'traditional', emoji: '🏔️' },
    '12-17': { name: '腊八节', type: 'traditional', emoji: '🥣' },
    '02-07': { name: '小年', type: 'traditional', emoji: '🧹' },
  },
  2027: {
    '02-05': { name: '除夕', type: 'public', emoji: '🎆' },
    '02-06': { name: '春节', type: 'public', emoji: '🧨' },
    '02-20': { name: '元宵节', type: 'traditional', emoji: '🏮' },
    '03-08': { name: '龙抬头', type: 'traditional', emoji: '🐉' },
    '06-09': { name: '端午节', type: 'public', emoji: '🐉' },
    '08-09': { name: '七夕节', type: 'traditional', emoji: '💕' },
    '09-15': { name: '中秋节', type: 'public', emoji: '🌕' },
    '10-08': { name: '重阳节', type: 'traditional', emoji: '🏔️' },
    '12-06': { name: '腊八节', type: 'traditional', emoji: '🥣' },
    '01-27': { name: '小年', type: 'traditional', emoji: '🧹' },
  },
  2028: {
    '01-25': { name: '除夕', type: 'public', emoji: '🎆' },
    '01-26': { name: '春节', type: 'public', emoji: '🧨' },
    '02-09': { name: '元宵节', type: 'traditional', emoji: '🏮' },
    '02-26': { name: '龙抬头', type: 'traditional', emoji: '🐉' },
    '05-28': { name: '端午节', type: 'public', emoji: '🐉' },
    '07-27': { name: '七夕节', type: 'traditional', emoji: '💕' },
    '10-03': { name: '中秋节', type: 'public', emoji: '🌕' },
    '10-26': { name: '重阳节', type: 'traditional', emoji: '🏔️' },
    '11-24': { name: '腊八节', type: 'traditional', emoji: '🥣' },
    '01-16': { name: '小年', type: 'traditional', emoji: '🧹' },
  },
  2029: {
    '02-12': { name: '除夕', type: 'public', emoji: '🎆' },
    '02-13': { name: '春节', type: 'public', emoji: '🧨' },
    '02-27': { name: '元宵节', type: 'traditional', emoji: '🏮' },
    '03-14': { name: '龙抬头', type: 'traditional', emoji: '🐉' },
    '06-16': { name: '端午节', type: 'public', emoji: '🐉' },
    '08-15': { name: '七夕节', type: 'traditional', emoji: '💕' },
    '09-22': { name: '中秋节', type: 'public', emoji: '🌕' },
    '10-15': { name: '重阳节', type: 'traditional', emoji: '🏔️' },
    '12-13': { name: '腊八节', type: 'traditional', emoji: '🥣' },
    '02-03': { name: '小年', type: 'traditional', emoji: '🧹' },
  },
  2030: {
    '02-02': { name: '除夕', type: 'public', emoji: '🎆' },
    '02-03': { name: '春节', type: 'public', emoji: '🧨' },
    '02-17': { name: '元宵节', type: 'traditional', emoji: '🏮' },
    '03-04': { name: '龙抬头', type: 'traditional', emoji: '🐉' },
    '06-05': { name: '端午节', type: 'public', emoji: '🐉' },
    '08-05': { name: '七夕节', type: 'traditional', emoji: '💕' },
    '09-12': { name: '中秋节', type: 'public', emoji: '🌕' },
    '10-05': { name: '重阳节', type: 'traditional', emoji: '🏔️' },
    '12-02': { name: '腊八节', type: 'traditional', emoji: '🥣' },
    '01-23': { name: '小年', type: 'traditional', emoji: '🧹' },
  }
}

/**
 * 获取某一天的节假日信息
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {object|null}
 */
export function getHolidayForDate(year, month, day) {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  const dateKey = `${mm}-${dd}`

  // 检查农历节日
  if (LUNAR_HOLIDAYS_DATES[year] && LUNAR_HOLIDAYS_DATES[year][dateKey]) {
    return LUNAR_HOLIDAYS_DATES[year][dateKey]
  }

  // 检查固定公历节日
  const fixed = FIXED_HOLIDAYS.find(h => h.month === month && h.day === day)
  if (fixed) {
    return { name: fixed.name, type: fixed.type, emoji: fixed.emoji }
  }

  return null
}

/**
 * 获取某月所有节假日
 * @param {number} year
 * @param {number} month
 * @returns {Array<{name, type, emoji, day}>}
 */
export function getHolidaysForMonth(year, month) {
  const holidays = []

  // 固定公历节日
  FIXED_HOLIDAYS.forEach(h => {
    if (h.month === month) {
      holidays.push({ ...h, day: h.day })
    }
  })

  // 农历节日
  if (LUNAR_HOLIDAYS_DATES[year]) {
    Object.entries(LUNAR_HOLIDAYS_DATES[year]).forEach(([dateKey, info]) => {
      const [m, d] = dateKey.split('-').map(Number)
      if (m === month) {
        holidays.push({ ...info, day: d })
      }
    })
  }

  return holidays.sort((a, b) => a.day - b.day)
}

/**
 * 判断是否是法定节假日
 */
export function isPublicHoliday(year, month, day) {
  const holiday = getHolidayForDate(year, month, day)
  return holiday && (holiday.type === 'public' || holiday.type === 'traditional')
}

export { FIXED_HOLIDAYS, LUNAR_HOLIDAYS_INFO }
