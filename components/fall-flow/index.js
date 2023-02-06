Component({
  options: {
    multipleSlots: true 
  },

  properties: {
    list: {
      type: Array,
      observer(list) {
        const leftList = []
        const rightList = []
        list.forEach((item, index) => {
          if (index % 2 === 0) {
            leftList.push(item)
          } else {
            rightList.push(item)
          }
        })
        this.setData({ leftList, rightList })
      }
    }
  },

  data: {
    leftList: [],
    rightList: []
  }
})
