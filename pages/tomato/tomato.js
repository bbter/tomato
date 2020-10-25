const {
  http
} = require('../../lib/http.js')
Page({
  data: {
    time: 1500,
    timeStr: "",
    timer: null,
    timerStatus: 'stop',
    confirmVisible: false,
    againButtonVisible: false,
    finshConfirmVisible: false,
    tomato: {}
  },
  onShow() {
    wx.vibrateLong()
    this.startTimer()
    http.post('/tomatoes').then(response => {
      this.setData({
        tomato: response.data.resource
      })
    })
  },
  onHide(){
    this.clearTimer()
    http.put(`/tomatoes/${this.data.tomato.id}`, {
      description: "退出放弃",
      aborted: true
    })
  },
  confirmFinish(event) {
    const content = event.detail
    console.log(content)
  },
  hideFinishConfirm() {
    this.setData({
      finshConfirmVisible: false
    })
  },
  startTimer() {
    this.setData({
      timerStatus: 'start'
    })
    this.changeTime()
    this.data.timer = setInterval(() => {
      this.data.time--
      this.changeTime()
      if (this.data.time === 0) {
        this.setData({
          againButtonVisible: true
        })
        this.setData({
          finshConfirmVisible: true
        })
        return this.clearTimer()
      }
    }, 1000)
  },
  againTimer() {
    this.data.time = 1500
    this.changeTime()
    this.setData({
      againButtonVisible: false
    })
  },
  clearTimer() {
    clearInterval(this.data.timer)
    this.setData({
      timerStatus: 'stop'
    })
  },
  confirmAbandon(event) {
    const content = event.detail
    http.put(`/tomatoes/${this.data.tomato.id}`, {
      description: content,
      aborted: true
    }).then(response => {
      wx.navigateBack({to: -1})
    })
  },
  showConfirm() {
    this.setData({
      confirmVisible: true
    })
    this.clearTimer()
  },
  hideAbandonConfirm() {
    this.setData({
      confirmVisible: false
    })
    this.startTimer()
  },
  changeTime() {
    let m = Math.floor(this.data.time / 60)
    let s = Math.floor(this.data.time % 60)
    if (s === 0) {
      s = "00"
    }
    if ((s + "").length === 1) {
      s = "0" + s
    }
    if ((m + "").length === 1) {
      m = "0" + m
    }
    this.setData({
      timeStr: `${m}:${s}`
    })
  }
})