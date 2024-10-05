import { expressOptions } from "../../../../../../utils/index";
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
    expressOptions,
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
    const refundInfo = await orderService.getRefund(
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
        imageList,
        shipCode,
        shipSn
      } = refundInfo;
      this.refundInfoId = id;
      this.setData({
        status,
        failureReason,
        refundAmount,
        refundType: refundType - 1,
        refundReason,
        imageList: imageList.map(item => ({ url: item }))
      });

      if (status === 1 || status === 2) {
        this.setMerchantInfo();
      }
      if (status === 2) {
        this.setData({
          selectedExpressIdx: this.data.expressOptions.findIndex(
            item => item.value === shipCode
          ),
          shipSn
        });
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

  uploadImage(e) {
    const { index, file } = e.detail;
    file.forEach(async (item, _index) => {
      this.setData({
        imageList: [
          ...this.data.imageList,
          { status: "uploading", message: "上传中", deletable: true },
        ],
      });
      const url = (await orderService.uploadFile(item.url)) || "";
      if (url) {
        this.setData({
          [`imageList[${index + _index}]`]: {
            ...this.data.imageList[index + _index],
            status: "done",
            message: "上传成功",
            url,
          },
        });
      } else {
        this.setData({
          [`imageList[${index + _index}]`]: {
            ...this.data.imageList[index + _index],
            status: "fail",
            message: "上传失败",
          },
        });
      }
    })
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
        orderService.editRefund(
          this.refundInfoId,
          refundType + 1,
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
        orderService.addRefund(
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
  },

  navToShipping() {
    const { expressOptions, selectedExpressIdx, shipSn, merchantInfo } =
      this.data;
    const url = `../shipping/index?shipCode=${expressOptions[selectedExpressIdx].value}&shipSn=${shipSn}&mobile=${merchantInfo.mobile}`;
    wx.navigateTo({ url });
  }
});
