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
        if (truthy) {
          // const { goodsInfo, cartInfo } = this.properties;
          // const { specList } = this.data;





          if (!this.data.specList.length) {
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

          // 场景1：商品详情
          // 场景2：购物车


          // 初始化逻辑
          // 1.商品详情 - 加载一次specList
          // 2.购物车 - 商品不一样就需要加载一次specList

          // 计算优惠券抵扣价
          // 根据库存判断按钮激活状态
          // 限购逻辑



          // if (this.properties.goodsInfo.specList.length && !this.data.specList.length) {
          //   const specList = this.properties.goodsInfo.specList.map(item => ({
          //     ...item,
          //     options: item.options.map((_item, _index) => ({
          //       name: _item,
          //       selected: _index === 0
          //     }))
          //   }))
          //   this.setData({
          //     specList,
          //     selectedSkuIndex: 0
          //   });
          // }
        }
      }
    },
    mode: {
      type: Number,
      value: 0
    },
    goodsInfo: {
      type: Object,
      observer(newInfo, oldInfo) {
        if (newInfo) {
          console.log('newInfo_id', newInfo.id)
        }
        if (oldInfo) {
          console.log('oldInfo_id', oldInfo.id)
        }
      } 
    },
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
    maxLimit: 1,
    btnActive: false,
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
        this.setData({ selectedSkuName, selectedSkuIndex });
        this.triggerEvent("selectSpec", { selectedSkuIndex, count });
      }
    },

    selectedSkuIndex(index) {
      const { goodsInfo } = this.properties;
      this.setData({
        btnActive:
          index !== -1
            ? goodsInfo.skuList[index].stock !== 0
            : goodsInfo.stock !== 0
      });
      this.setCouponDiscount();
      // this.setMaxLimit();
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

    setMaxLimit() {
      const { goodsInfo, cartInfo } = this.properties;
      const { isGift, skuList, stock, numberLimit } = goodsInfo;
      const { selectedSkuIndex, selectedSkuName, maxLimit } = this.data

      if (isGift) {
        if (maxLimit !== 1) {
          this.setData({ maxLimit: 1 })
        }
      } else {
        const userPurchasedList = cartInfo.userPurchasedList || goodsInfo.userPurchasedList
        if (selectedSkuIndex !== -1) {
          if (skuList[selectedSkuIndex].limit) {
            const purchasedNum = userPurchasedList.find(({ skuName, skuIndex }) => skuName === selectedSkuName && skuIndex === selectedSkuIndex).number || 0;
            this.setData({ maxLimit: skuList[selectedSkuIndex].limit - purchasedNum })
          } else {
            this.setData({ maxLimit: skuList[selectedSkuIndex].stock })
          }
        } else {
          if (numberLimit) {
            this.setData({ maxLimit: numberLimit - userPurchasedList[0].number })
          } else {
            this.setData({ maxLimit: stock })
          }
        }
      }
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
