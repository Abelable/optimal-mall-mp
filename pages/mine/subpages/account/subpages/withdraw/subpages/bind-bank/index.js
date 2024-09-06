Page({
  data: {
    name: "",
    account: "",
    bankName: ""
  },

  setName(e) {
    const name = e.detail.value;
    this.setData({ name });
  },

  setAcount(e) {
    const account = e.detail.value;
    this.setData({ account });
  },

  setBankName(e) {
    const bankName = e.detail.value;
    this.setData({ bankName });
  },

  submit() {
    const { name, account, bankName } = this.data;
    if (name && account && bankName) {
    }
  }
});
