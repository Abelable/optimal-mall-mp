Page({
  async onLoad({ pay_params }) {
    const payParams = JSON.parse(decodeURIComponent(pay_params))
    Object.keys(payParams).forEach(
      (key) => (payParams[key] = decodeURIComponent(payParams[key]))
    )
    wx.requestPayment({
      ...payParams,
      complete: () => {
        wx.navigateBack()
      }
    })
  },
})
