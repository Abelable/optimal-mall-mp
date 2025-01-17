import AddressService from "./utils/addressService";

const addressService = new AddressService();

Page({
  data: {
    addressList: []
  },

  onShow() {
    this.setAddressList();
  },

  async setAddressList() {
    const addressList = (await addressService.getAddressList()) || [];
    this.setData({ addressList });
  },

  editAddress(e) {
    wx.navigateTo({
      url: `./subpages/edit/index?id=${e.currentTarget.dataset.id}`
    });
  },

  // 显示新建收货地址
  addAddress() {
    wx.navigateTo({ url: "./subpages/add/index" });
  },

  deleteAddress(e) {
    const { id, index } = e.currentTarget.dataset;
    const { position, instance } = e.detail;
    if (position === "right") {
      wx.showModal({
        title: "提示",
        content: "确定删除该收货地址吗？",
        showCancel: true,
        success: async res => {
          if (res.confirm) {
            addressService.deleteAddress(id, () => {
              const addressList = this.data.addressList;
              addressList.splice(index, 1);
              this.setData({ addressList });
              instance.close();
            });
          } else {
            instance.close();
          }
        }
      });
    }
  },

  getWxAddress() {
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.address"] !== false) {
          this.chooseWxAddress();
        } else {
          wx.showModal({
            title: "信息授权提示",
            content: "您当前为未授权状态，请到小程序的设置中打开授权",
            showCancel: true,
            cancelText: "取消",
            confirmText: "去设置",
            success: res => {
              if (res.confirm)
                wx.openSetting({
                  success: () => {
                    this.chooseWxAddress();
                  }
                });
            }
          });
        }
      }
    });
  },

  chooseWxAddress() {
    wx.chooseAddress({
      success({
        userName,
        telNumber,
        nationalCode,
        provinceName,
        cityName,
        countyName,
        detailInfo
      }) {
        const regionCodeList = [
          `${nationalCode.slice(0, 2)}0000`,
          `${nationalCode.slice(0, 4)}00`,
          nationalCode
        ];
        const regionDesc = `${provinceName} ${cityName} ${countyName}`;
        addressService.addAddress(
          userName,
          telNumber,
          JSON.stringify(regionCodeList),
          regionDesc,
          detailInfo,
          0,
          () => {
            this.setAddressList();
          }
        );
      }
    });
  },

  copy(e) {
    const { name, mobile, regionDesc, addressDetail } =
      e.currentTarget.dataset.info;
    wx.setClipboardData({
      data: `收件人: ${name}\n手机号码: ${mobile}\n所在地区: ${regionDesc}\n详细地址: ${addressDetail}`,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      }
    });
  }
});
