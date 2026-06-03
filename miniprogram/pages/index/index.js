// pages/index/index.js
const db = wx.cloud.database()

Page({
  data: {
    seasonName: "今日 · 芒种",
    seasonTime: "6月5日-6月21日",
    seasonText: "仲夏将至，宜养脾胃，慎食生冷。湿热渐盛，宜清淡饮食。",
    goodFoods: ["山药", "莲子", "小米粥", "冬瓜"],
    badFoods: ["辛辣", "油炸", "冷饮", "过饱"],
    quoteText: "芒种时节，仲夏将至。养生之道，贵在顺时而行，食疗为先。",
    suggestionText: "食不过饱，味不过浓，身自安和。",
    imageDesc: "山药莲子小米粥 · 宋代工笔意境",
    dailyQuote: "",
    quoteAuthor: ""
  },

  onLoad() {
    this.loadDailyQuote()
  },

  loadDailyQuote() {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    
    let seed = 0
    for (let i = 0; i < dateStr.length; i++) {
      seed += dateStr.charCodeAt(i)
    }
    
    db.collection('daily_quotes').get().then(res => {
      const quotes = res.data
      if (quotes.length > 0) {
        const index = seed % quotes.length
        this.setData({
          dailyQuote: quotes[index].text,
          quoteAuthor: quotes[index].author || ""
        })
      }
    }).catch(err => {
      console.error('获取签语失败：', err)
      this.setData({
        dailyQuote: "食不过饱，味不过浓，身自安和。",
        quoteAuthor: "养生论"
      })
    })
  },

  goToResult() {
    wx.navigateTo({
      url: '/pages/result/result'
    })
  },

  // 隐私政策
  goToPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '日日有膳小程序仅收集用户的openid用于区分用户，不收集其他个人信息。所有膳食推荐数据均基于传统养生理念生成，仅供参考。',
      showCancel: false
    })
  },

  onShareAppMessage() {
    return {
      title: '日日有膳 - 顺应四时，好好吃饭',
      path: '/pages/index/index'
    }
  }
})