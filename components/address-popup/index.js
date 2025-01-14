import { checkLogin } from "../../utils/index";
import BaseService from "../../services/baseService";

const baseService = new BaseService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    addressId: Number,
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          this.setAddressList();
        }
      }
    }
  },

  pageLifetimes: {
    show() {
      this.setAddressList();
    }
  },

  data: {
    addressList: [],
    selectedIndex: 0
  },

  methods: {
    setAddressList() {
      checkLogin(async () => {
        const addressList = await baseService.getAddressList();
        this.setData({ addressList });
  
        const { addressId } = this.properties;
        if (addressId) {
          const selectedIndex = addressList.findIndex(
            item => item.id === addressId
          );
          this.setData({ selectedIndex });
        }
      }, false)
    },

    selectAddress(e) {
      this.setData({
        selectedIndex: Number(e.detail.value)
      });
    },

    confirm() {
      const { addressList, selectedIndex } = this.data;
      const { id } = addressList[selectedIndex]
      this.triggerEvent("confirm", { id });
    },

    hide() {
      this.triggerEvent("hide");
    },

    navToAddressListPage() {
      checkLogin(() => {
        wx.navigateTo({
          url: "/pages/mine/subpages/address-list/index"
        });
      })
    }
  }
});
