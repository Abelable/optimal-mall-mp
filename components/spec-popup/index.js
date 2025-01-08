import { checkLogin } from "../../utils/index";
import BaseService from "../../services/baseService";

const baseService = new BaseService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: Boolean,
    mode: {
      type: Number,
      value: 0
    },
    goodsInfo: {
      type: Object,
      observer: async function (newInfo, oldInfo) {
        // 优惠券领取
        if (newInfo && newInfo.couponList) {
          this.setReceivedCouponList();
          this.setCouponDiscount();
        }

        if ((newInfo && !this.purchasedList) || newInfo.id !== oldInfo.id) {
          if (wx.getStorageSync("token")) {
            await this.setPurchasedList();
          }
          this.setSpecList();
        }
      }
    },
    cartInfo: Object,
    commission: Number,
    commissionVisible: Boolean
  },

  data: {
    specList: [],
    selectedSkuName: "",
    selectedSkuIndex: -1,
    count: 1,
    maxCount: 10000,
    receivedCouponList: [],
    couponDiscount: 0,
    btnActive: false
  },

  observers: {
    specList(list) {
      if (list.length) {
        const { goodsInfo, count } = this.data;
        const selectedSkuName = list
          .map(item => item.options.find(_item => _item.selected).name)
          .join();
        const selectedSkuIndex = goodsInfo.skuList.findIndex(
          item => item.name === selectedSkuName
        );
        const btnActive =
          selectedSkuIndex !== -1
            ? goodsInfo.skuList[selectedSkuIndex].stock !== 0
            : goodsInfo.stock !== 0;
        this.setData({ selectedSkuName, selectedSkuIndex, btnActive });
        this.setCouponDiscount();
        this.setMaxCount();
        this.triggerEvent("selectSpec", { selectedSkuIndex, count });
      }
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

    setSpecList() {
      const { goodsInfo, cartInfo } = this.properties;
      if (goodsInfo.specList.length) {
        const {
          selectedSkuName,
          selectedSkuIndex,
          number: count
        } = cartInfo || {};
        const { name } = goodsInfo.skuList[selectedSkuIndex] || {};
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
            count
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
    },

    setReceivedCouponList() {
      const { couponList } = this.properties.goodsInfo;
      const receivedCouponList = couponList.filter(item => item.isReceived);
      this.setData({ receivedCouponList });
    },

    setCouponDiscount() {
      const { skuList } = this.properties.goodsInfo;
      const { receivedCouponList } = this.data;
      if (receivedCouponList.length) {
        const { selectedSkuIndex, count } = this.data;
        const couponDiscount =
          receivedCouponList
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

    setMaxCount() {
      const {
        skuList,
        stock: totalStock,
        numberLimit
      } = this.properties.goodsInfo;
      const { selectedSkuIndex, selectedSkuName } = this.data;

      if (selectedSkuIndex !== -1) {
        const { limit, stock } = skuList[selectedSkuIndex];
        const _limit = limit || numberLimit;
        const _stock = stock || totalStock;
        if (_limit) {
          const purchasedItem = this.purchasedList.find(
            ({ skuName, skuIndex }) =>
              skuName === selectedSkuName && skuIndex === selectedSkuIndex
          );
          const purchasedNum = purchasedItem ? purchasedItem.number : 0;

          this.setData({
            maxCount: Math.min(_limit, _stock) - purchasedNum
          });
        } else {
          this.setData({ maxCount: _stock });
        }
      } else {
        if (numberLimit) {
          const purchasedNum = this.purchasedList[0].number || 0;
          this.setData({
            maxCount: Math.min(numberLimit, totalStock) - purchasedNum
          });
        } else {
          this.setData({ maxCount: totalStock });
        }
      }
    },

    // 加入购物车
    addCart() {
      const { btnActive, maxCount } = this.data
      if (btnActive && maxCount > 0) {
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
      const { btnActive, maxCount } = this.data
      if (btnActive && maxCount > 0) {
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
      const { btnActive, maxCount } = this.data
      if (btnActive && maxCount > 0) {
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

    checkSpecImg(e) {
      const { url } = e.currentTarget.dataset;
      wx.previewImage({
        current: url,
        urls: [url]
      });
    },

    async setPurchasedList() {
      const { goodsInfo, cartInfo } = this.properties;
      this.purchasedList = await baseService.getPurchasedGoodsList(
        goodsInfo.id,
        cartInfo ? 2 : 1
      );
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
