// pages/result/result.js
Page({
  data: {
    loading: true,
    foodData: null
  },

  onLoad() {
    this.getDailyFood()
  },

  getDailyFood() {
    this.setData({ loading: true })
    
    wx.cloud.callFunction({
      name: 'getDailyFood',
      data: { fixedByDate: true }
    }).then(res => {
      console.log('云函数返回：', res)
      
      if (res.result && res.result.success && res.result.data) {
        this.setData({
          foodData: res.result.data,
          loading: false
        })
      } else {
        this.setData({ loading: false })
        wx.showToast({ title: '数据错误', icon: 'none' })
      }
    }).catch(err => {
      console.error('调用失败：', err)
      this.setData({ loading: false })
      wx.showToast({ title: '获取失败', icon: 'none' })
    })
  },

  refresh() {
    this.getDailyFood()
  },

  goBack() {
    wx.navigateBack()
  },

  // ========== 生成海报（Canvas 2D 版） ==========
  async generatePoster() {
    const foodData = this.data.foodData
    if (!foodData) {
      wx.showToast({ title: '数据加载中', icon: 'none' })
      return
    }

    wx.showLoading({ title: '生成中...', mask: true })

    try {
      const query = wx.createSelectorQuery()
      const res = await new Promise((resolve) => {
        query.select('#posterCanvas')
          .fields({ node: true, size: true })
          .exec((res) => resolve(res[0]))
      })
      
      const canvas = res.node
      const ctx = canvas.getContext('2d')
      
      const width = 750
      const height = 1500
      canvas.width = width
      canvas.height = height
      
      // 1. 背景
      ctx.fillStyle = '#e8e0d5'
      ctx.fillRect(0, 0, width, height)
      
      // 2. 白色卡片
      ctx.fillStyle = '#fdf9f2'
      ctx.fillRect(30, 60, 690, 1380)
      
      // 3. 标题
      ctx.fillStyle = '#C23B22'
      ctx.font = 'bold 52px "KaiTi", "楷体"'
      ctx.textAlign = 'center'
      ctx.fillText('日日有膳', width / 2, 150)
      
      // 4. 副标题
      ctx.fillStyle = '#9b8b7a'
      ctx.font = '22px "KaiTi", "楷体"'
      ctx.fillText('顺应四时 · 好好吃饭', width / 2, 210)
      
      // 5. 分割线
      ctx.beginPath()
      ctx.strokeStyle = '#e8dfd3'
      ctx.lineWidth = 2
      ctx.moveTo(60, 240)
      ctx.lineTo(690, 240)
      ctx.stroke()
      
      // 6. 日期
      ctx.fillStyle = '#6b5b4b'
      ctx.font = '26px "KaiTi", "楷体"'
      ctx.fillText(foodData.date, width / 2, 300)
      
      // 7. 体质类型
      const typeColor = foodData.type === '火旺' ? '#f5576c' : (foodData.type === '湿重' ? '#4facfe' : '#43e97b')
      ctx.fillStyle = typeColor
      ctx.fillRect(280, 320, 190, 50)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 36px "KaiTi", "楷体"'
      ctx.fillText(foodData.type, width / 2, 365)
      
      // 8. 签语
      ctx.fillStyle = '#5a4a3a'
      ctx.font = '26px "KaiTi", "楷体"'
      ctx.fillText(foodData.quote, width / 2, 430)
      
      // 9. 推荐食物标题
      ctx.fillStyle = '#6b7b5a'
      ctx.font = 'bold 30px "KaiTi", "楷体"'
      ctx.textAlign = 'left'
      ctx.fillText('今日宜食', 60, 510)
      
      // 10. 推荐食物内容
      ctx.fillStyle = '#7a6b5b'
      ctx.font = '24px "KaiTi", "楷体"'
      let goodText = foodData.foods_good.join('  ·  ')
      ctx.fillText(goodText, 60, 560)
      
      // 11. 避免食物标题
      ctx.fillStyle = '#b56a5c'
      ctx.font = 'bold 30px "KaiTi", "楷体"'
      ctx.fillText('今日少食', 60, 640)
      
      // 12. 避免食物内容
      ctx.fillStyle = '#7a6b5b'
      ctx.font = '24px "KaiTi", "楷体"'
      let badText = foodData.foods_bad.join('  ·  ')
      ctx.fillText(badText, 60, 690)
      
      // 13. 情绪
      ctx.fillStyle = '#6b5b4b'
      ctx.font = '24px "KaiTi", "楷体"'
      ctx.fillText('💭 ' + foodData.emotion, 60, 770)
      
      // 14. 建议
      ctx.fillText('📌 ' + foodData.suggestion, 60, 820)
      
      // 15. 底部装饰
      ctx.beginPath()
      ctx.strokeStyle = '#e8dfd3'
      ctx.lineWidth = 1
      ctx.moveTo(60, 880)
      ctx.lineTo(690, 880)
      ctx.stroke()
      
      // 16. 底部文字
      ctx.fillStyle = '#9b8b7a'
      ctx.font = '20px "KaiTi", "楷体"'
      ctx.textAlign = 'center'
      ctx.fillText('日日有膳 · 每日膳食指南', width / 2, 930)
      
      wx.canvasToTempFilePath({
        canvas: canvas,
        success: (res) => {
          wx.hideLoading()
          this.savePosterToAlbum(res.tempFilePath)
        },
        fail: (err) => {
          console.error('导出失败：', err)
          wx.hideLoading()
          wx.showToast({ title: '生成失败', icon: 'none' })
        }
      })
      
    } catch (err) {
      console.error('生成海报失败：', err)
      wx.hideLoading()
      wx.showToast({ title: '生成失败', icon: 'none' })
    }
  },

  // 保存海报到相册，点击确定后返回首页
  savePosterToAlbum(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        wx.showModal({
          title: '保存成功',
          content: '海报已保存到相册',
          showCancel: false,
          confirmText: '好的',
          success: (res) => {
            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要授权保存图片到相册',
            success: (res) => {
              if (res.confirm) wx.openSetting()
            }
          })
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' })
        }
      }
    })
  }
})