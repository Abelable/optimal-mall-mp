import BaseService from "../../../../../../services/baseService";

const baseService = new BaseService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  methods: {
    navToUserCenter(e) {
      const { id } = this.properties.item;
      const url = `/pages/subpages/home/media/author-center/index?id=${id}`;
      wx.navigateTo({ url });
    },

    toggleFollowStatus() {
      const { id, isFollow } = this.properties.item;
      if (!isFollow) {
        baseService.followAuthor(id, () => {
          this.setData({
            ["item.isFollow"]: true
          });
        });
      } else {
        baseService.cancelFollowAuthor(id, () => {
          this.setData({
            ["item.isFollow"]: false
          });
        });
      }
    }
  }
});
