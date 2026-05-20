/**
 * 24节气背景图案
 * 每个节气配有独特的SVG背景元素
 * 风格：清新水墨风
 */

const TERM_BACKGROUNDS = {
  '小寒': {
    color: '#E8F4F8',
    pattern: 'snow',
    icon: '❄️',
    desc: '寒风凛冽，雪花纷飞'
  },
  '大寒': {
    color: '#E0F0F5',
    pattern: 'ice',
    icon: '🧊',
    desc: '冰天雪地，寒极待春'
  },
  '立春': {
    color: '#F0F8E8',
    pattern: 'sprout',
    icon: '🌱',
    desc: '春回大地，万物复苏'
  },
  '雨水': {
    color: '#E8F4F0',
    pattern: 'rain',
    icon: '💧',
    desc: '春雨绵绵，滋润万物'
  },
  '惊蛰': {
    color: '#F0F5E8',
    pattern: 'thunder',
    icon: '⚡',
    desc: '春雷乍动，蛰虫苏醒'
  },
  '春分': {
    color: '#F5F8E8',
    pattern: 'flower',
    icon: '🌸',
    desc: '百花齐放，昼夜平分'
  },
  '清明': {
    color: '#E8F5E8',
    pattern: 'willow',
    icon: '🌿',
    desc: '柳绿花红，踏青祭祖'
  },
  '谷雨': {
    color: '#E8F0E8',
    pattern: 'grain',
    icon: '🌾',
    desc: '雨生百谷，采茶时节'
  },
  '立夏': {
    color: '#F0F8E8',
    pattern: 'lotus',
    icon: '🪷',
    desc: '夏日初至，荷叶田田'
  },
  '小满': {
    color: '#F5F8E0',
    pattern: 'wheat',
    icon: '🌾',
    desc: '麦穗渐满，籽粒灌浆'
  },
  '芒种': {
    color: '#F8F5E0',
    pattern: 'plum',
    icon: '🍑',
    desc: '梅雨时节，青梅煮酒'
  },
  '夏至': {
    color: '#FFF8E0',
    pattern: 'sun',
    icon: '☀️',
    desc: '日长之至，荷花盛开'
  },
  '小暑': {
    color: '#FFF5E8',
    pattern: 'heat',
    icon: '🌞',
    desc: '暑气渐盛，蝉鸣阵阵'
  },
  '大暑': {
    color: '#FFF0E0',
    pattern: 'firefly',
    icon: '✨',
    desc: '酷暑难耐，萤火夜飞'
  },
  '立秋': {
    color: '#F8F0E0',
    pattern: 'maple',
    icon: '🍂',
    desc: '秋风送爽，叶落知秋'
  },
  '处暑': {
    color: '#F5F0E8',
    pattern: 'cloud',
    icon: '☁️',
    desc: '暑去凉来，天高云淡'
  },
  '白露': {
    color: '#F0F5F0',
    pattern: 'dew',
    icon: '💧',
    desc: '露凝而白，秋意渐浓'
  },
  '秋分': {
    color: '#F5F0E8',
    pattern: 'chrysanthemum',
    icon: '🌼',
    desc: '昼夜均分，菊花盛开'
  },
  '寒露': {
    color: '#F0F0E8',
    pattern: 'reed',
    icon: '🌾',
    desc: '露气寒冷，芦苇苍苍'
  },
  '霜降': {
    color: '#E8F0F0',
    pattern: 'frost',
    icon: '❄️',
    desc: '初霜出现，柿红菊黄'
  },
  '立冬': {
    color: '#E8F0F5',
    pattern: 'winter',
    icon: '🧣',
    desc: '冬日伊始，万物收藏'
  },
  '小雪': {
    color: '#E5F0F8',
    pattern: 'light-snow',
    icon: '🌨️',
    desc: '初雪飘落，银装素裹'
  },
  '大雪': {
    color: '#E0F0F8',
    pattern: 'heavy-snow',
    icon: '⛄',
    desc: '雪量增大，天地一色'
  },
  '冬至': {
    color: '#E8F0F5',
    pattern: 'solstice',
    icon: '🥟',
    desc: '日短夜长，饺子飘香'
  }
}

/**
 * 获取节气背景信息
 * @param {string} termName 节气名称
 * @returns {object|null}
 */
export function getTermBackground(termName) {
  return TERM_BACKGROUNDS[termName] || null
}

/**
 * 获取所有节气背景
 * @returns {object}
 */
export function getAllTermBackgrounds() {
  return TERM_BACKGROUNDS
}

export default TERM_BACKGROUNDS
