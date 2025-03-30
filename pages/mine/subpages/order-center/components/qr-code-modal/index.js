import { API_BASE_URL, VERSION } from "../../../../../../config";

Component({
  properties: {
    code: String
  },

  data: {
    qrCode: ""
  },

  lifetimes: {
    attached() {
      const qrCode = `${API_BASE_URL}/api/${VERSION}/order/qr_code?code=${this.properties.code}`;
      this.setData({ qrCode });
    }
  },

  methods: {
    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});
