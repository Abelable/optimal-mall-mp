import dayjs from "dayjs";
import OrderService from "../../utils/orderService";

const orderService = new OrderService();

Page({
  data: {
    goodsList: [],
    score: 0,
    content: "",
    imageList: [],
    submitBtnVisible: true
  },

  onLoad({ goodsList, orderId, status }) {
    goodsList = JSON.parse(goodsList);
    this.setData({ goodsList });

    this.orderId = orderId;
    this.status = +status;

    if (this.status === 501) {
      this.setEvaluationInfo();
    }
  },

  async setEvaluationInfo() {
    const { createdAt, score, content, imageList } =
      await orderService.getEvaluation(this.orderId);
    if (dayjs().diff(dayjs(createdAt), "day") > 30 || score == 5) {
      this.setData({ submitBtnVisible: false });
    }
    this.setData({
      score,
      content,
      imageList: imageList.map(url => ({
        status: "done",
        message: "上传成功",
        url
      }))
    });
  },

  setScore(e) {
    this.setData({ score: e.detail });
  },

  setContent(e) {
    const content = e.detail.value;
    this.setData({ content });
  },

  uploadImage(e) {
    const { index, file } = e.detail;
    file.forEach(async (item, _index) => {
      this.setData({
        imageList: [
          ...this.data.imageList,
          { status: "uploading", message: "上传中", deletable: true }
        ]
      });
      const url = (await orderService.uploadFile(item.url)) || "";
      if (url) {
        this.setData({
          [`imageList[${index + _index}]`]: {
            ...this.data.imageList[index + _index],
            status: "done",
            message: "上传成功",
            url
          }
        });
      } else {
        this.setData({
          [`imageList[${index + _index}]`]: {
            ...this.data.imageList[index + _index],
            status: "fail",
            message: "上传失败"
          }
        });
      }
    });
  },

  deleteImage(e) {
    const { imageList } = this.data;
    imageList.splice(e.detail.index, 1);
    this.setData({ imageList });
  },

  submit() {
    const { score, content } = this.data;
    if (!score) {
      wx.showToast({
        title: "给商品评个分吧！",
        icon: "none"
      });
      return;
    }
    if (!content) {
      wx.showToast({
        title: "商品评价不能为空哦！",
        icon: "none"
      });
      return;
    }
    if (score <= 2) {
      wx.showModal({
        title: "评分较低哦",
        content: "确定要给出低分评价吗？",
        showCancel: true,
        cancelText: "再想想",
        success: result => {
          if (result.confirm) {
            this.evaluate();
          }
        }
      });
    } else {
      this.evaluate();
    }
  },

  evaluate() {
    const { score, content, goodsList, imageList } = this.data;
    const goodsIds = goodsList.map(item => item.goodsId);
    orderService.submitEvaluation(
      this.status,
      this.orderId,
      goodsIds,
      score,
      content,
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
});
