import AccountService from "../../utils/accountService";

const accountService = new AccountService();

Component({
  properties: {
    show: Boolean,
  },

  data: {
  },

  methods: {
    hide() {
      this.triggerEvent("hide");
    }
  }
});
