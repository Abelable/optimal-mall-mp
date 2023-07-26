import ScenicService from "../../utils/scenicService";

const scenicService = new ScenicService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarVisible: false,
    menuList: [],
    curMenuIdx: -1,
    scenicInfo: null,
    curOpenTime: null,
    isOpen: true,
    curDot: 1,
    muted: true,
    ticketTypeList: [],
    curTicketTypeIdx: 0,
    ticketList: [],
    combinedTicketTypeList: [],
    curCombinedTicketTypeIdx: 0,
    combinedTicketList: [],
    commentList: [
      {
        userInfo: {
          avatar:
            "http://img.ubo.vip/uploads/15099395_642329416d5f9/i0hX323HiYx8uIbCsHISlbbDATrzieNfFUgcfhHf.jpeg",
          nickname: "沫沫",
        },
        rate: 4.2,
        content:
          "下一次恋爱要从纯爱开始，支支吾吾地把我约出来，结果只是为了看今晚的月色的美丽，为了听拂过耳畔的风，为了送一份我随口一说想吃的提拉米苏。他是坦诚的，明亮的，会在汹涌的人群里朝我伸出手，也会傻傻倚在楼下老榕树旁等我。不小心碰到了手，脸明明红得像个柿子，还要傲娇地说：“要不要和我牵个手呀？",
        imageList: [
          "http://img.ubo.vip/uploads/15099395_6423292630915/xBIuViXth3XLAxeqT4CUFCNNLIK2hBFgdwhqNs7J.jpeg",
          "http://img.ubo.vip/uploads/15099395_642329267e4f8/ISOiz9t2EvRE6qVtFZ2xjh32jZClfYnArgw6hzIZ.jpeg",
          "http://img.ubo.vip/uploads/15099395_64232926ec7c3/P8vDwhVWkc2mhCcYBkGc7gQC0gTAfgXSFXm9s19D.jpeg",
          "http://img.ubo.vip/uploads/15099395_6423292630915/xBIuViXth3XLAxeqT4CUFCNNLIK2hBFgdwhqNs7J.jpeg",
          "http://img.ubo.vip/uploads/15099395_642329267e4f8/ISOiz9t2EvRE6qVtFZ2xjh32jZClfYnArgw6hzIZ.jpeg",
          "http://img.ubo.vip/uploads/15099395_64232926ec7c3/P8vDwhVWkc2mhCcYBkGc7gQC0gTAfgXSFXm9s19D.jpeg",
        ],
      },
      {
        userInfo: {
          avatar:
            "http://img.ubo.vip/uploads/15099395_642329416d5f9/i0hX323HiYx8uIbCsHISlbbDATrzieNfFUgcfhHf.jpeg",
          nickname: "沫沫",
        },
        rate: 4.2,
        content:
          "下一次恋爱要从纯爱开始，支支吾吾地把我约出来，结果只是为了看今晚的月色的美丽，为了听拂过耳畔的风，为了送一份我随口一说想吃的提拉米苏。他是坦诚的，明亮的，会在汹涌的人群里朝我伸出手，也会傻傻倚在楼下老榕树旁等我。不小心碰到了手，脸明明红得像个柿子，还要傲娇地说：“要不要和我牵个手呀？",
        imageList: [
          "http://img.ubo.vip/uploads/15099395_6423292630915/xBIuViXth3XLAxeqT4CUFCNNLIK2hBFgdwhqNs7J.jpeg",
          "http://img.ubo.vip/uploads/15099395_642329267e4f8/ISOiz9t2EvRE6qVtFZ2xjh32jZClfYnArgw6hzIZ.jpeg",
          "http://img.ubo.vip/uploads/15099395_64232926ec7c3/P8vDwhVWkc2mhCcYBkGc7gQC0gTAfgXSFXm9s19D.jpeg",
          "http://img.ubo.vip/uploads/15099395_6423292630915/xBIuViXth3XLAxeqT4CUFCNNLIK2hBFgdwhqNs7J.jpeg",
          "http://img.ubo.vip/uploads/15099395_642329267e4f8/ISOiz9t2EvRE6qVtFZ2xjh32jZClfYnArgw6hzIZ.jpeg",
          "http://img.ubo.vip/uploads/15099395_64232926ec7c3/P8vDwhVWkc2mhCcYBkGc7gQC0gTAfgXSFXm9s19D.jpeg",
        ],
      },
    ],
    nearbyHotelList: [
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖美客爱途民宿",
        rate: 4.6,
        type: "舒适民宿",
        tag: "停车场",
        distance: "4.5km",
        basePrice: 566,
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖瑞利淡竹度假",
        rate: 4.2,
        type: "高档酒店",
        tag: "商务出行",
        distance: "4.1km",
        basePrice: 500,
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖美客爱途民宿",
        rate: 4.6,
        type: "舒适民宿",
        tag: "停车场",
        distance: "4.5km",
        basePrice: 566,
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖瑞利淡竹度假",
        rate: 4.2,
        type: "高档酒店",
        tag: "商务出行",
        distance: "4.1km",
        basePrice: 500,
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖美客爱途民宿",
        rate: 4.6,
        type: "舒适民宿",
        tag: "停车场",
        distance: "4.5km",
        basePrice: 566,
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖瑞利淡竹度假",
        rate: 4.2,
        type: "高档酒店",
        tag: "商务出行",
        distance: "4.1km",
        basePrice: 500,
      },
    ],
    nearbyScenicSpotList: [
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖啤酒小镇",
        rate: 4.6,
        distance: "4.5km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖欢乐水世界",
        rate: 4.2,
        distance: "4.1km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖啤酒小镇",
        rate: 4.6,
        distance: "4.5km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖欢乐水世界",
        rate: 4.2,
        distance: "4.1km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖啤酒小镇",
        rate: 4.6,
        distance: "4.5km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖欢乐水世界",
        rate: 4.2,
        distance: "4.1km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc85e023/4uPSXbFzNsQt13bvyvURZtMj1YOqc7okLbSKdxSv.jpeg",
        name: "千岛湖啤酒小镇",
        rate: 4.6,
        distance: "4.5km",
      },
      {
        image:
          "http://img.ubo.vip/uploads/15095212_63f83fc80e25d/uF2jdRqXSBtSAxRdX4cdLJvvApNreExaVw51LU5t.jpeg",
        name: "千岛湖欢乐水世界",
        rate: 4.2,
        distance: "4.1km",
      },
    ],
    mediaList: [
      {
        address: "浙江省杭州市临平区龙王塘路67号",
        authorInfo: {
          id: 2,
          avatar:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKiakPc4hxfvs8nTgLkh3jhN6B8jP2oz5J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
          nickname: "徐九爷_",
        },
        collectionTimes: 0,
        commentsNumber: 1,
        createdAt: "2023-03-23T09:29:12.000000Z",
        id: 8,
        imageList: [
          "https://img-oss.zjseca.com/tiddler/20230323/scbUJL8yqYkx3797935b97f13c42952827c2ef6c6ad0.jpeg",
          "https://img-oss.zjseca.com/tiddler/20230323/TA5rWT4s4GdZb18d5133f1d73ae62e933e7dc23e0a8b.jpeg",
        ],
        isPrivate: 0,
        likeNumber: 1,
        shareTimes: 0,
        title: "德鲁执杖走天涯",
        type: 3,
      },
      {
        address: "浙江省杭州市临平区龙王塘路67号",
        authorInfo: {
          id: 2,
          avatar:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKiakPc4hxfvs8nTgLkh3jhN6B8jP2oz5J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
          nickname: "徐九爷_",
        },
        collectionTimes: 0,
        commentsNumber: 1,
        createdAt: "2023-03-23T09:20:48.000000Z",
        id: 7,
        imageList: [
          "https://img-oss.zjseca.com/tiddler/20230323/dTQ27KTCWLn316e54ed95df3478b397dec459abcfc6e.jpeg",
          "https://img-oss.zjseca.com/tiddler/20230323/hkPKOlR3fOqa34e9859fb717f10a61db1a7ab7495af3.jpeg",
          "https://img-oss.zjseca.com/tiddler/20230323/aTD6FUXdKoNWe4dc2ff790c33830645a31f2ae73de1b.jpeg",
        ],
        isPrivate: 0,
        likeNumber: 1,
        shareTimes: 0,
        title: "我是大狮子",
        type: 3,
      },
      {
        address: "浙江省杭州市临平区龙王塘路67号",
        authorInfo: {
          id: 2,
          avatar:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKiakPc4hxfvs8nTgLkh3jhN6B8jP2oz5J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
          nickname: "徐九爷_",
        },
        collectionTimes: 0,
        commentsNumber: 1,
        cover:
          "http://img.ubo.vip/uploads/15037274_62e775067a757/kKWJhRpC3DfZldffTNQf8N9O4NBkJhRN3nt5TNHg.jpeg",
        createdAt: "2023-03-18T09:15:50.000000Z",
        id: 1,
        isPrivate: 0,
        likeNumber: 1,
        shareTimes: 0,
        title: "长相差一点没关系，但气质这一块咱不能输！",
        type: 2,
        videoUrl:
          "http://1301400133.vod2.myqcloud.com/d9ed72b2vodcq1301400133/8fdda551387702304098139138/nRWbjkRO2oYA.mp4",
      },
      {
        address: "浙江省杭州市临平区龙王塘路67号",
        authorInfo: {
          id: 2,
          avatar:
            "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKiakPc4hxfvs8nTgLkh3jhN6B8jP2oz5J9ar1HbPxQ1DV5kzKhQKTTuum4BaZ6EvgOspTaNDIkUQg/132",
          nickname: "徐九爷_",
        },
        collectionTimes: 0,
        commentsNumber: 0,
        cover:
          "http://1301400133.vod2.myqcloud.com/d9ed72b2vodcq1301400133/cf27f5ad5285890814604444619/5285890814604444621.jpg",
        createdAt: "2023-03-18T12:43:20.000000Z",
        id: 5,
        isPrivate: 0,
        likeNumber: 1,
        shareTimes: 0,
        title: "致逝去的青春",
        type: 2,
        videoUrl:
          "http://1301400133.vod2.myqcloud.com/d9ed72b2vodcq1301400133/cf27f5ad5285890814604444619/61lKaPKWj4cA.mp4",
      },
    ],
    curTicketInfo: null,
    noticePopupVisible: false,
  },

  async onLoad({ id }) {
    this.scenicId = +id;
    await this.setScenicCategoryOptions();
    await this.setScenicInfo();
    await this.setSourceTicketList();
    this.setMenuList();
  },

  async setScenicCategoryOptions() {
    this.categoryOptions = await scenicService.getTicketCategoryOptions();
  },

  async setScenicInfo() {
    const scenicInfo = await scenicService.getScenicInfo(this.scenicId);
    this.setData({ scenicInfo });

    const { openTimeList } = scenicInfo;
    openTimeList.length && this.setCurOpenTime(openTimeList);
  },

  setCurOpenTime(openTimeList) {
    const date = new Date();

    const curMonth = date.getMonth() + 1;
    const curOpenTime = openTimeList.find(
      (item) => curMonth >= item.openMonth && curMonth <= item.closeMonth
    );

    const { openTime, closeTime } = curOpenTime;
    const openDate = new Date(openTime);
    const closeDate = new Date(closeTime);
    const openTimeUnit = Number(
      `${openDate.getHours()}` + `${openDate.getMinutes()}`.padStart(2, "0")
    );
    const closeTimeUnit = Number(
      `${closeDate.getHours()}` + `${closeDate.getMinutes()}`.padStart(2, "0")
    );
    const curTime = Number(
      `${date.getHours()}` + `${date.getMinutes()}`.padStart(2, "0")
    );
    const isOpen = curTime >= openTimeUnit && curTime <= closeTimeUnit;

    this.setData({ curOpenTime, isOpen });
  },

  async setSourceTicketList() {
    const list = await scenicService.getScenicTicketList(this.scenicId);

    const ticketCategoryIds = [];
    const combinedTicketCategoryIds = [];
    this.ticketList = [];
    this.combinedTicketList = [];

    const curDate = new Date();
    const curHour = `${curDate.getHours()}`.padStart(2, "0");
    const curMinute = `${curDate.getMinutes()}`.padStart(2, "0");
    const curTime = +`${curHour}${curMinute}`;

    list.forEach(
      ({ type, name, briefName, bookingTime, specList, ...rest }) => {
        const todayBookable = curTime <= +bookingTime.replace(":", "");
        const item = {
          ...rest,
          type,
          specList,
          bookingTime,
          todayBookable,
          bookingTips: todayBookable ? "可定今日" : "可定明日",
          name: type === 1 ? briefName : name,
          categoryIds: specList.map(({ categoryId }) => {
            if (type === 1) {
              ticketCategoryIds.push(categoryId);
            } else {
              combinedTicketCategoryIds.push(categoryId);
            }
            return categoryId;
          }),
        };
        if (type === 1) {
          this.ticketList.push(item);
        } else {
          this.combinedTicketList.push(item);
        }
      }
    );

    if (ticketCategoryIds.length) {
      const ticketTypeList = Array.from(new Set(ticketCategoryIds))
        .sort()
        .map((categoryId) =>
          this.categoryOptions.find((item) => item.id === categoryId)
        );
      this.setData({ ticketTypeList });
      this.setTicketList();
    }

    if (combinedTicketCategoryIds.length) {
      const combinedTicketTypeList = Array.from(
        new Set(combinedTicketCategoryIds)
      )
        .sort()
        .map((categoryId) =>
          this.categoryOptions.find((item) => item.id === categoryId)
        );
      this.setData({ combinedTicketTypeList });
      this.setCombinedTicketList();
    }
  },

  setTicketList() {
    const { ticketTypeList, curTicketTypeIdx } = this.data;
    const { id: curCategoryId, name: curCategoryName } =
      ticketTypeList[curTicketTypeIdx];
    const ticketList = this._setTicketList(
      curCategoryId,
      curCategoryName,
      this.ticketList
    );
    this.setData({ ticketList });
  },

  setCombinedTicketList() {
    const { combinedTicketTypeList, curCombinedTicketTypeIdx } = this.data;
    const { id: curCategoryId, name: curCategoryName } =
      combinedTicketTypeList[curCombinedTicketTypeIdx];
    const combinedTicketList = this._setTicketList(
      curCategoryId,
      curCategoryName,
      this.combinedTicketList
    );
    this.setData({ combinedTicketList });
  },

  _setTicketList(curCategoryId, curCategoryName, sourceTicketList) {
    const ticketList = [];
    sourceTicketList.forEach(({ categoryIds, specList, ...item }) => {
      if (
        categoryIds.findIndex((categoryId) => categoryId === curCategoryId) !==
        -1
      ) {
        const priceList = JSON.parse(
          specList.find((spec) => spec.categoryId === curCategoryId).priceList
        );
        const curTicketIndex = ticketList.findIndex(
          (ticket) => ticket.name === item.name
        );
        if (curTicketIndex === -1) {
          ticketList.push({
            name: item.name,
            basePrice: item.price,
            fold: true,
            list: [
              {
                categoryId: curCategoryId,
                categoryName: curCategoryName,
                priceList,
                ...item,
              },
            ],
          });
        } else {
          const { basePrice, list, ...rest } = ticketList[curTicketIndex];
          ticketList[curTicketIndex] = {
            ...rest,
            basePrice: item.price < basePrice ? item.price : basePrice,
            list: [
              ...list,
              {
                categoryId: curCategoryId,
                categoryName: curCategoryName,
                priceList,
                ...item,
              },
            ],
          };
        }
      }
    });
    return ticketList;
  },

  setMenuList() {
    const { combinedTicketTypeList } = this.data;
    const menuList = combinedTicketTypeList.length
      ? [
          "景点门票",
          "多景点联票",
          "用户点评",
          "热门问答",
          "附近酒店",
          "附近景点",
          "达人打卡",
        ]
      : [
          "景点门票",
          "用户点评",
          "热门问答",
          "附近酒店",
          "附近景点",
          "达人打卡",
        ];
    this.setData({ menuList }, () => {
      this.setNavBarVisibleLimit();
      this.setMenuChangeLimitList();
    });
  },

  setNavBarVisibleLimit() {
    const query = wx.createSelectorQuery();
    query.select(".scenic-spot-name").boundingClientRect();
    query.exec((res) => {
      this.navBarVisibleLimit = res[0].bottom;
    });
  },

  setMenuChangeLimitList() {
    const query = wx.createSelectorQuery();
    query.selectAll(".content-title").boundingClientRect();
    query.exec((res) => {
      this.menuChangeLimitList = res[0].map(
        (item) => item.top + (this.scrollTop || 0)
      );
    });
  },

  bannerChange(e) {
    this.setData({
      curDot: e.detail.current + 1,
    });
  },

  toggleMuted() {
    this.setData({
      muted: !this.data.muted,
    });
  },

  fullScreenPlay() {
    const { video } = this.data.scenicInfo;
    const url = `/pages/subpages/common/video-play/index?url=${video}`;
    wx.navigateTo({ url });
  },

  previewImage(e) {
    const { current, urls } = e.currentTarget.dataset;
    wx.previewImage({ current, urls });
  },

  selectMenu(e) {
    const { index } = e.currentTarget.dataset;
    wx.pageScrollTo({
      scrollTop: this.menuChangeLimitList[index] - statusBarHeight - 100,
    });
  },

  selectTicketType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData(
      {
        curTicketTypeIdx: Number(index),
      },
      () => {
        this.setTicketList();
        this.setMenuChangeLimitList();
      }
    );
  },

  toggleTicketsFold(e) {
    const index = e.detail;
    const { ticketList } = this.data;
    this.setData(
      {
        [`ticketList[${index}].fold`]: !ticketList[index].fold,
      },
      () => {
        this.setMenuChangeLimitList();
      }
    );
  },

  selectCombinedTicketType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData(
      {
        curCombinedTicketTypeIdx: Number(index),
      },
      () => {
        this.setCombinedTicketList();
        this.setMenuChangeLimitList();
      }
    );
  },

  toggleCombinedTicketsFold(e) {
    const index = e.detail;
    const { combinedTicketList } = this.data;
    this.setData(
      {
        [`combinedTicketList[${index}].fold`]: !combinedTicketList[index].fold,
      },
      () => {
        this.setMenuChangeLimitList();
      }
    );
  },

  onPageScroll({ scrollTop }) {
    this.scrollTop = scrollTop;

    if (scrollTop >= this.navBarVisibleLimit) {
      !this.data.navBarVisible &&
        this.setData({
          navBarVisible: true,
        });
    } else {
      this.data.navBarVisible &&
        this.setData({
          navBarVisible: false,
        });
    }

    const menuLimit = scrollTop + statusBarHeight + 108;
    if (menuLimit < this.menuChangeLimitList[0]) {
      if (this.data.curMenuIdx !== -1) this.setData({ curMenuIdx: -1 });
    } else if (
      menuLimit >= this.menuChangeLimitList[0] &&
      menuLimit < this.menuChangeLimitList[1]
    ) {
      if (this.data.curMenuIdx !== 0) this.setData({ curMenuIdx: 0 });
    } else if (
      menuLimit >= this.menuChangeLimitList[1] &&
      menuLimit < this.menuChangeLimitList[2]
    ) {
      if (this.data.curMenuIdx !== 1) this.setData({ curMenuIdx: 1 });
    } else if (
      menuLimit >= this.menuChangeLimitList[2] &&
      menuLimit < this.menuChangeLimitList[3]
    ) {
      if (this.data.curMenuIdx !== 2) this.setData({ curMenuIdx: 2 });
    } else if (
      menuLimit >= this.menuChangeLimitList[3] &&
      menuLimit < this.menuChangeLimitList[4]
    ) {
      if (this.data.curMenuIdx !== 3) this.setData({ curMenuIdx: 3 });
    } else if (
      menuLimit >= this.menuChangeLimitList[4] &&
      menuLimit < this.menuChangeLimitList[5]
    ) {
      if (this.data.curMenuIdx !== 4) this.setData({ curMenuIdx: 4 });
    } else if (
      menuLimit >= this.menuChangeLimitList[5] &&
      menuLimit < this.menuChangeLimitList[6]
    ) {
      if (this.data.curMenuIdx !== 5) this.setData({ curMenuIdx: 5 });
    } else if (menuLimit >= this.menuChangeLimitList[6]) {
      if (this.data.curMenuIdx !== 6) this.setData({ curMenuIdx: 6 });
    }
  },

  onReachBottom() {
    console.log("onReachBottom");
  },

  showNoticePopup(e) {
    this.setData({
      curTicketInfo: e.detail,
      noticePopupVisible: true,
    });
  },

  hideNoticePopup() {
    this.setData({
      noticePopupVisible: false,
    });
  },

  checkMoreInfo() {
    const url = `./subpages/more-info/index?info=${JSON.stringify(
      this.data.scenicInfo
    )}`;
    wx.navigateTo({ url });
  },

  checkPolicy() {
    const url = `./subpages/more-info/index?info=${JSON.stringify(
      this.data.scenicInfo
    )}&scene=policy`;
    wx.navigateTo({ url });
  },

  navigation() {
    const { name, address, latitude, longitude } = this.data.scenicInfo;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address,
    });
  },

  onShareAppMessage() {},
});
