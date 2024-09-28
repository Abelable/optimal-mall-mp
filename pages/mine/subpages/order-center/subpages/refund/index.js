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
    imageList: [],
    merchantInfo: null,
    expressOptions: [
      { name: "中通快递", value: "ZTO" },
      { name: "圆通速递", value: "YTO" },
      { name: "韵达速递", value: "YD" },
      { name: "申通快递", value: "STO" },
      { name: "顺丰速运", value: "SF" },
      { name: "京东快递", value: "JD" },
      { name: "邮政快递包裹", value: "YZPY" },
      { name: "EMS", value: "EMS" },
      { name: "极兔速递", value: "JTSD" },
      { name: "德邦快递", value: "DBL" },
      { name: "丰网速运", value: "FWX" },
      { name: "百世快递", value: "HTKY" },
      { name: "优速快递", value: "UC" },
      { name: "众邮快递", value: "ZYE" },
      { name: "宅急送", value: "ZJS" }
    ],
    selectedExpressIdx: undefined,
    shipSn: ""
  },

  onLoad({ orderId, orderSn, goodsId, couponId, merchantId }) {
    this.orderId = +orderId;
    this.orderSn = orderSn;
    this.goodsId = +goodsId;
    this.couponId = +couponId;
    this.merchantId = +merchantId;

    this.setRefundInfo();
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

      if (status === 1) {
        this.setMerchantInfo();
      }
    } else {
      this.setRefundAmount();
    }
  },

  async setRefundAmount() {
    const refundAmount = await orderService.getRefundAmount(
      this.orderId,
      this.goodsId,
      this.couponId
    );
    this.setData({ refundAmount });
  },

  async setMerchantInfo() {
    if (this.merchantId === 0) {
      this.setData({
        merchantInfo: {
          consigneeName: "令先生",
          mobile: "13957118152",
          addressDetail: "浙江省杭州市余杭区五常街道向往街368号2幢11层1143室"
        }
      });
    } else {
      const merchantInfo = await orderService.getMerchantInfo(this.merchantId);
      this.setData({ merchantInfo });
    }
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

  selectExpress(e) {
    const selectedExpressIdx = Number(e.detail.value);
    this.setData({ selectedExpressIdx });
  },

  setShipSn(e) {
    const shipSn = e.detail.value;
    this.setData({ shipSn });
  },

  submit() {
    if (this.data.status === 1) {
      const { expressOptions, selectedExpressIdx, shipSn } = this.data;
      if (selectedExpressIdx === undefined) {
        wx.showToast({
          title: "请选择物流公司",
          icon: "none"
        });
        return;
      }
      if (!shipSn) {
        wx.showToast({
          title: "请填写物流单号",
          icon: "none"
        });
        return;
      }
      orderService.submitShipInfo(
        this.refundInfoId,
        expressOptions[selectedExpressIdx].value,
        shipSn,
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
          this.orderSn,
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
  }
});
