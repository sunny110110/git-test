const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {

  const foods = [
    "小米粥 + 青菜 + 鸡蛋（清淡养胃）",
    "燕麦 + 牛奶 + 香蕉（能量早餐）",
    "米饭 + 豆腐 + 西兰花（均衡营养）",
    "山药粥 + 红枣（健脾养气）",
    "玉米 + 鸡蛋 + 菠菜（轻食组合）"
  ]

  const tips = [
    "今日宜清淡饮食",
    "避免辛辣油炸",
    "少冰冷饮品",
    "注意规律三餐"
  ]

  const food = foods[Math.floor(Math.random() * foods.length)]
  const tip = tips[Math.floor(Math.random() * tips.length)]

  return {
    text: `今日宜：${food}\n\n建议：${tip}`
  }
}