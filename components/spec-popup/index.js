import { checkLogin } from "../../utils/index";
import BaseService from "../../services/baseService";

const baseService = new BaseService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy && !this.data.specList.length) {
          const { goodsInfo, cartInfo } = this.properties;
          if (goodsInfo.specList.length) {
            const { selectedSkuName, selectedSkuIndex, number } =
              cartInfo || {};
            const { name, stock } = goodsInfo.skuList[selectedSkuIndex] || {};
            if (
              cartInfo &&
              selectedSkuName !== "" &&
              selectedSkuIndex !== -1 &&
              name === selectedSkuName
            ) {
              const specList = goodsInfo.specList.map(item => ({
                ...item,
                options: item.options.map(_item => ({
                  name: _item,
                  selected: selectedSkuName.includes(_item)
                }))
              }));
              this.setData({
                specList,
                count: number > stock ? stock : number
              });
            } else {
              const specList = goodsInfo.specList.map(item => ({
                ...item,
                options: item.options.map((_item, _index) => ({
                  name: _item,
                  selected: _index === 0
                }))
              }));
              this.setData({ specList });
            }
          }
        }
      }
    },
    mode: {
      type: Number,
      value: 0
    },
    goodsInfo: Object,
    commission: Number,
    commissionVisible: Boolean,
    cartInfo: Object
  },

  data: {
    specList: [],
    selectedSkuName: "",
    selectedSkuIndex: -1,
    count: 1,
    couponDiscount: 0,
    btnActive: false
  },

  observers: {
    specList: function (list) {
      if (list.length) {
        const { goodsInfo, count } = this.data;
        const selectedSkuName = list
          .map(item => item.options.find(_item => _item.selected).name)
          .join();
        const selectedSkuIndex = goodsInfo.skuList.findIndex(
          item => item.name === selectedSkuName
        );
        this.setData({ selectedSkuName, selectedSkuIndex });
        this.setCouponDiscount();
        this.triggerEvent("selectSpec", { selectedSkuIndex, count });
      }
    },
    selectedSkuIndex: function (index) {
      const { goodsInfo } = this.properties;
      this.setData({
        btnActive:
          index !== -1
            ? goodsInfo.skuList[index].stock !== 0
            : goodsInfo.stock !== 0
      });
    }
  },

  methods: {
    // 选择规格
    selectSpec(e) {
      const { index, optionIndex } = e.currentTarget.dataset;
      const specList = this.data.specList.map((item, specIndex) =>
        index === specIndex
          ? {
              ...item,
              options: item.options.map((_item, _index) => ({
                ..._item,
                selected: _index === optionIndex
              }))
            }
          : item
      );
      this.setData({ specList });
    },

    countChange({ detail: count }) {
      this.setData({ count });
      this.setCouponDiscount();
    },

    // 加入购物车
    addCart() {
      if (this.data.btnActive) {
        checkLogin(async () => {
          const { goodsInfo, selectedSkuIndex, count } = this.data;
          const cartGoodsNumber = await baseService.addCart(
            goodsInfo.id,
            selectedSkuIndex,
            count
          );
          cartGoodsNumber &&
            this.triggerEvent("addCartSuccess", { cartGoodsNumber });
        });
      }
    },

    // 立即购买
    buyNow() {
      if (this.data.btnActive) {
        checkLogin(async () => {
          const { goodsInfo, selectedSkuIndex, count } = this.data;
          const cartGoodsId = await baseService.fastAddCart(
            goodsInfo.id,
            selectedSkuIndex,
            count
          );
          const cartGoodsIds = JSON.stringify([cartGoodsId]);
          const url = `/pages/home/subpages/order-check/index?cartGoodsIds=${cartGoodsIds}`;
          wx.navigateTo({ url });
        });
      }
    },

    editSpec() {
      if (this.data.btnActive) {
        const { cartInfo, selectedSkuIndex, count } = this.data;
        baseService.editCart(
          cartInfo.id,
          cartInfo.goodsId,
          selectedSkuIndex,
          count,
          res => {
            this.triggerEvent("editSpecSuccess", { cartInfo: res.data });
          }
        );
      }
    },

    setCouponDiscount() {
      const { couponList, skuList } = this.properties.goodsInfo;
      if (couponList.length) {
        if (!this.couponList) {
          this.couponList = couponList.filter(item => item.isReceived);
        }
        const { selectedSkuIndex, count } = this.data;
        const couponDiscount =
          this.couponList
            .filter(({ type, numLimit, priceLimit }) => {
              if (type === 1) {
                return true;
              }
              if (type === 2 && count >= numLimit) {
                return true;
              }
              if (
                type === 3 &&
                skuList[selectedSkuIndex].price * count > priceLimit
              ) {
                return true;
              }
              return false;
            })
            .map(item => item.denomination)
            .sort((a, b) => b - a)[0] || 0;
        this.setData({ couponDiscount });
      }
    },

    checkSpecImg(e) {
      const { url } = e.currentTarget.dataset;
      wx.previewImage({
        current: url,
        urls: [url]
      });
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
