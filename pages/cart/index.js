import { checkLogin } from "../../utils/index";
import CartService from "./utils/cartService";

const cartService = new CartService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    cartList: [],
    recommendGoodsList: [],
    isSelectAll: false,
    totalPrice: 0,
    selectedCount: 0,
    deleteBtnVisible: false,
    goodsInfo: null,
    cartInfo: null,
    specPopupVisible: false
  },

  onShow() {
    checkLogin(this.init);
  },

  async init() {
    const { cartList: list, recommendGoodsList } =
      (await cartService.getCartList()) || {};
    const cartList = list.map(item => ({
      ...item,
      checked: false
    })).sort((a, b) => a.goodsId - b.goodsId);
    this.setData({ cartList, recommendGoodsList });
  },

  /**
   * 切换商品列表选中状态
   */
  async toggleGoodsChecked(e) {
    const { index } = e.currentTarget.dataset;
    let { cartList, deleteBtnVisible } = this.data;
    let goodsCheckStatus = cartList[index].checked;
    cartList[index].checked = !goodsCheckStatus;
    let unCheckedIndex = cartList.findIndex(item => {
      if (deleteBtnVisible || (!deleteBtnVisible && item.status === 1))
        return item.checked === false;
    });
    const isSelectAll = unCheckedIndex === -1;
    this.setData({ cartList, isSelectAll }, () => {
      this.acount();
    });
  },

  /**
   * 切换全选状态
   */
  toggleAllChecked() {
    let { cartList, isSelectAll, deleteBtnVisible } = this.data;
    if (deleteBtnVisible) {
      cartList.map(item => {
        item.checked = !isSelectAll;
      });
      this.setData({ cartList }, () => {
        this.acount();
      });
    } else {
      cartList.map(item => {
        if (item.status === 1) item.checked = !isSelectAll;
      });
      this.setData({ cartList }, () => {
        this.acount();
      });
    }
  },

  async countChange(e) {
    const { cartIndex } = e.currentTarget.dataset;
    const { id, goodsId, selectedSkuIndex } =
      this.data.cartList[cartIndex];
    cartService.editCart(id, goodsId, selectedSkuIndex, e.detail, () => {
      this.setData(
        {
          [`cartList[${cartIndex}].number`]: e.detail
        },
        () => {
          this.acount();
        }
      );
    });
  },

  deleteGoodsList() {
    this.data.selectedCount &&
      wx.showModal({
        title: "提示",
        content: "确定删除这些商品吗？",
        showCancel: true,
        success: res => {
          if (res.confirm) {
            cartService.deleteCartList(this.selectedCartIdArr, () => {
              this.init();
            });
          }
        }
      });
  },

  async deleteGoods(e) {
    const { id, index } = e.currentTarget.dataset;
    const { position, instance } = e.detail;
    if (position === "right") {
      wx.showModal({
        title: "提示",
        content: "确定删除该商品吗？",
        showCancel: true,
        success: async res => {
          if (res.confirm) {
            cartService.deleteCartList([id], () => {
              const cartList = this.data.cartList;
              cartList.splice(index, 1);
              this.setData({ cartList });
              if (!cartList.length) {
                this.init();
              }
              this.acount();
              instance.close();
            });
          } else {
            instance.close();
          }
        }
      });
    }
  },

  async showSpecPopup(e) {
    const { info: cartInfo, cartIndex, goodsIndex } = e.currentTarget.dataset;
    const goodsInfo = await cartService.getGoodsInfo(cartInfo.goodsId);
    this.setData({
      cartInfo,
      goodsInfo,
      specPopupVisible: true
    });
    this.editingCartIndex = cartIndex;
    this.editingGoodsIndex = goodsIndex;
  },

  hideSpecPopup(e) {
    const cartInfo =
      this.data.cartList[this.editingCartIndex];
    this.setData(
      {
        [`cartList[${this.editingCartIndex}]`]:
          {
            ...cartInfo,
            ...e.detail.cartInfo
          },
        specPopupVisible: false
      },
      () => {
        this.acount();
      }
    );
  },

  toggleDeleteBtnVisible() {
    this.setData({
      deleteBtnVisible: !this.data.deleteBtnVisible
    });
  },

  acount() {
    this.totalCount = 0;
    let selectedCount = 0;
    let totalPrice = 0;
    this.selectedCartIdArr = [];

    const { cartList, deleteBtnVisible } = this.data;

    if (deleteBtnVisible) {
      cartList.forEach(item => {
        if (item.checked) {
          this.selectedCartIdArr.push(item.id);
          selectedCount += item.number;
        }
        this.totalCount += item.number;
      });
      this.setData({
        selectedCount,
        isSelectAll: selectedCount && selectedCount === this.totalCount
      });
    } else {
      cartList.forEach(item => {
        if (item.status === 1 && item.checked) {
          this.selectedCartIdArr.push(item.id);
          selectedCount += item.number;
          totalPrice += item.number * item.price;
        }
        this.totalCount += item.number;
      });
      this.setData({
        selectedCount,
        totalPrice,
        isSelectAll: selectedCount && selectedCount === this.totalCount
      });
    }
  },

  submit() {
    if (this.data.selectedCount) {
      wx.navigateTo({
        url: `/pages/home/subpages/order-check/index?cartGoodsIds=${JSON.stringify(
          this.selectedCartIdArr
        )}`
      });
    }
  },

  showGoodsDetail(e) {
    wx.navigateTo({
      url: `/pages/home/subpages/goods-detail/index?id=${e.currentTarget.dataset.id}`
    });
  },

  catchtap() {}
});
