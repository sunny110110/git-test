// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  
  // 根据日期生成固定的种子（同一天相同）
  let seed = 0
  for (let i = 0; i < dateStr.length; i++) {
    seed += dateStr.charCodeAt(i)
  }
  
  try {
    // 从数据库获取所有体质数据
    const res = await db.collection('quotes').get()
    const quotes = res.data
    
    if (quotes.length === 0) {
      return { success: false, error: '数据库无数据' }
    }
    
    // 根据种子选择当天数据
    const index = seed % quotes.length
    const data = quotes[index]
    
    return {
      success: true,
      data: {
        date: dateStr,
        type: data.type,
        quote: data.quote,
        foods_good: data.foods_good,
        foods_bad: data.foods_bad,
        emotion: data.emotion,
        suggestion: data.suggestion
      },
      openid: cloud.getWXContext().OPENID,
      timestamp: Date.now()
    }
  } catch (err) {
    console.error(err)
    return { success: false, error: err.message }
  }
}