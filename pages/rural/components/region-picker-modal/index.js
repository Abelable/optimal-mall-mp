Component({
  properties: {
    options: Array,
    pickedIdx: Number
  },

  methods: {
    pickRegion(e) {
      const pickedIdx = e.currentTarget.dataset.index;
      this.setData({ pickedIdx });
    },

    confirm() {
      this.triggerEvent("confirm", this.data.pickedIdx);
    },

    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});
