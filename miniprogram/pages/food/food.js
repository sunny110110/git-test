// pages/food/food.js
Page({
  data: {
    started: false,
    loading: false,
    foodData: null
  },

  startRecommend() {
    console.log('=== 按钮被点击 ===')
    this.setData({ started: true, loading: true })
    
    wx.cloud.callFunction({
      name: 'getDailyFood',
      data: { fixedByDate: true }
    }).then(res => {
      console.log('=== 云函数返回成功 ===', res)
      if (res.result && res.result.data) {
        this.setData({
          foodData: res.result.data,
          loading: false
        })
        console.log('数据设置成功', this.data.foodData)
      } else {
        console.error('数据格式异常', res.result)
        this.setData({ loading: false })
        wx.showToast({ title: '数据错误', icon: 'none' })
      }
    }).catch(err => {
      console.error('=== 云函数调用失败 ===', err)
      this.setData({ loading: false })
      wx.showToast({ title: '获取失败', icon: 'none' })
    })
  },

  refresh() {
    this.setData({ loading: true })
    this.startRecommend()
  }
})