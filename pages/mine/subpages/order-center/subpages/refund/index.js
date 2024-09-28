import OrderService from "../../utils/orderService";

const orderService = new OrderService();

Page({
  data: {
    typeList: ["仅退款", "退货退款"],
    status: undefined,
    failureReason: "",
    refundAmount: "",
    refundType: undefined,
    refundReason: "",
    imageList: []
  },

  async onLoad({ orderId, goodsId, couponId }) {
    this.orderId = orderId;
    this.goodsId = goodsId;
    this.couponId = couponId;

    this.setRefundInfo();
    this.setRefundAmount();
  },

  async setRefundInfo() {
    const refundInfo = await orderService.getRefundApplication(
      this.orderId,
      this.goodsId
    );
    if (refundInfo) {
      const {
        id,
        status,
        failureReason,
        refundAmount,
        refundType,
        refundReason,
        imageList
      } = refundInfo;
      this.refundInfoId = id;
      this.setData({
        status,
        failureReason,
        refundAmount,
        refundType,
        refundReason,
        imageList: imageList.map(item => ({ url: item }))
      });
    }
  },

  async setRefundAmount() {
    const refundAmount = await orderService.getRefundAmount(
      this.orderId,
      this.goodsId,
      this.couponId
    );
    this.setData({ refundAmount: refundAmount.toFixed(2) });
  },

  selectRefundType(e) {
    const refundType = Number(e.detail.value);
    this.setData({ refundType });
  },

  setRefundReason(e) {
    const refundReason = e.detail.value;
    this.setData({ refundReason });
  },

  async uploadImage(e) {
    const { index, file } = e.detail;
    this.setData({
      imageList: [
        ...this.data.imageList,
        { status: "uploading", message: "上传中", deletable: true }
      ]
    });
    const url = (await orderService.uploadFile(file.url)) || "";
    if (url) {
      this.setData({
        [`imageList[${index}]`]: {
          ...this.data.imageList[index],
          status: "done",
          message: "上传成功",
          url
        }
      });
    } else {
      this.setData({
        [`imageList[${index}]`]: {
          ...this.data.imageList[index],
          status: "fail",
          message: "上传失败"
        }
      });
    }
  },

  deleteImage(e) {
    const { imageList } = this.data;
    imageList.splice(e.detail.index, 1);
    this.setData({ imageList });
  },

  submit() {
    const { refundType, refundReason, imageList } = this.data;
    if (!refundType) {
      wx.showToast({
        title: "请选择退款方式",
        icon: "none"
      });
      return;
    }
    if (!refundReason) {
      wx.showToast({
        title: "请补充退款说明",
        icon: "none"
      });
      return;
    }
    if (this.refundInfoId) {
      orderService.editRefundApplication(
        this.refundInfoId,
        refundType,
        refundReason,
        imageList.map(item => item.url),
        () => {
          wx.showToast({
            title: "提交成功",
            icon: "none"
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      );
    } else {
      orderService.addRefundApplication(
        this.orderId,
        this.goodsId,
        this.couponId,
        refundType,
        refundReason,
        imageList.map(item => item.url),
        () => {
          wx.showToast({
            title: "提交成功",
            icon: "none"
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      );
    }
  }
});
