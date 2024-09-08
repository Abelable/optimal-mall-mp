import dayjs from "dayjs";
import { store } from "../../store/index";

const descList = [
  "发现精彩直播",
  "发现趣味短视频",
  "发现趣味游记",
  "推荐秀美景点",
  "推荐舒适酒店",
  "推荐美味餐厅",
  "推荐优质好物",
  "推荐优质店铺",
  "发现有趣达人"
];
let canvas = null;
let ctx = null;

Component({
  properties: {
    scene: String,
    info: Object
  },

  lifetimes: {
    async attached() {
      wx.showLoading({ title: "海报生成中..." });
      await this.init();
      await this.createPoster();
      wx.hideLoading();
    }
  },

  methods: {
    init() {
      return new Promise(resolve => {
        this.createSelectorQuery()
          .select("#poster")
          .fields({ node: true, size: true })
          .exec(res => {
            if (res && res.length) {
              canvas = res[0].node;
              const renderWidth = res[0].width;
              const renderHeight = res[0].height;
              ctx = canvas.getContext("2d");

              const dpr = getApp().globalData.systemInfo.pixelRatio;
              canvas.width = renderWidth * dpr;
              canvas.height = renderHeight * dpr;
              ctx.scale(dpr, dpr);
              resolve();
            }
          });
      });
    },

    async createPoster() {
      const { avatar, nickname } = store.userInfo;
      const { scene, info } = this.properties;
      const {
        status,
        cover,
        title,
        content,
        price,
        marketPrice,
        salesVolume,
        authorInfo,
        shopInfo,
        likeNumber,
        noticeTime,
        startTime,
        auchorDataDesc,
        tagList,
        qrcode
      } = info || {};

      await this.drawImage(
        "https://static.youbozhenxuan.cn/img/poster-bg.png",
        0,
        0,
        291,
        416
      );

      await this.roundRect(15, 17, 32, 32, 16, avatar);
      this.setText(13, "#fff", 55, 30, nickname);
      this.setText(8, "#fff", 55, 45, descList[scene - 1]);

      if (["8", "9"].includes(scene)) {
        await this.roundRect(27, 116, 237, 130, 5, cover);
        const linearGradient = this.createLinearGradient(
          27,
          166,
          27,
          246,
          "rgba(0, 0, 0, 0)",
          "rgba(0, 0, 0, 0.5)"
        );
        this.roundRect(
          27,
          166,
          237,
          80,
          [0, 0, 5, 5],
          "",
          null,
          linearGradient
        );
        this.roundRect(100, 71, 90, 90, 45, "", null, "#fff");
        await this.roundRect(
          105,
          76,
          80,
          80,
          40,
          scene === "8" ? shopInfo.avatar : authorInfo.avatar
        );
        this.setText(
          16,
          "#fff",
          145,
          195,
          scene === "8" ? title : authorInfo.nickname,
          "center",
          true
        );
        if (scene === "8") {
          this.roundRect(115, 210, 60, 20, 10, "", null, "#434D5E");
          this.setText(
            10,
            "#FFE5BD",
            145,
            224,
            shopInfo.type === 1 ? "个人店铺" : "企业店铺",
            "center",
            true
          );
        } else {
          this.setText(10, "#fff", 145, 220, auchorDataDesc, "center");
        }

        await this.roundRect(100, 270, 90, 90, 45, qrcode);
        this.setText(10, "#999", 145, 380, "长按识别二维码", "center");
      } else {
        await this.roundRect(27, 71, 237, 240, 5, cover);

        if (scene === "1") {
          this.roundRect(
            38,
            82,
            status === 1 ? 57 : 47,
            22,
            11,
            "",
            null,
            "rgba(0, 0, 0, 0.5)"
          );
          this.roundRect(
            45,
            91,
            5,
            5,
            2.5,
            "",
            null,
            ["#00D011", "#5562F9", "#D07A00"][status - 1]
          );
          this.setText(
            10,
            "#fff",
            55,
            96.5,
            ["直播中", "回放", "预告"][status - 1]
          );
        }

        if (scene === "2") {
          this.roundRect(
            126,
            171,
            40,
            40,
            20,
            "",
            null,
            "rgba(225, 225, 225, 0.6)"
          );
          await this.drawImage(
            "https://img.ubo.vip/tiddler/poster/play-icon.png",
            139,
            183,
            16,
            16
          );
        }

        if (scene === "3") {
          const linearGradient = this.createLinearGradient(
            27,
            281,
            27,
            311,
            "rgba(0, 0, 0, 0)",
            "rgba(0, 0, 0, 0.5)"
          );
          this.roundRect(
            27,
            281,
            237,
            30,
            [0, 0, 5, 5],
            "",
            null,
            linearGradient
          );

          this.roundRect(128, 300, 4, 4, 2, "", null, "#00cffc");
          this.roundRect(138, 300, 4, 4, 2, "", null, "#fff");
          this.roundRect(148, 300, 4, 4, 2, "", null, "#fff");
          this.roundRect(158, 300, 4, 4, 2, "", null, "#fff");
        }

        this.setWrapText(
          12,
          "#333",
          27,
          334,
          title,
          16,
          173,
          true,
          ["1", "3", "4", "5", "6"].includes(scene) ? 1 : 2
        );

        if (scene === "1") {
          const time = `直播时间：${dayjs(
            status === 3 ? noticeTime : startTime
          ).format("MM-DD HH:mm")}`;
          this.setText(10, "#999", 27, 354, time);
        }

        if (scene === "3") {
          this.setWrapText(10, "#666", 27, 354, content, 16, 173, false, 1);
        }

        if (["4", "5", "6"].includes(scene)) {
          this.roundRect(
            39,
            83,
            32,
            16.8,
            4,
            "",
            null,
            ["rgb(184, 64, 211)", "rgb(98, 97, 238)", "rgb(251, 49, 105)"][
              scene - 4
            ]
          );
          this.setText(10, "#fff", 45, 95, ["景点", "酒店", "美食"][scene - 4]);

          this.setTagList(tagList, 27, 356);
        }

        if (["4", "5", "6", "7"].includes(scene)) {
          if (scene === "7") {
            this.setGoodsPrice(price, `¥${marketPrice}`, 27, 382);
          } else {
            this.setPrice(price, 27, 382);
          }
          this.setText(10, "#999", 197, 382, `已售${salesVolume}`, "right");
        }

        if (["1", "2", "3"].includes(scene)) {
          await this.roundRect(27, 366, 18, 18, 9, authorInfo.avatar);
          this.setText(10, "#333", 50, 379, authorInfo.nickname);
          if (["2", "3"].includes(scene)) {
            await this.setLikeNumber(likeNumber, 197, 380);
          }
        }

        await this.drawImage(qrcode, 208, 318, 56, 56);
        this.setText(7, "#999", 237, 382, "长按识别二维码", "center");
      }

      wx.canvasToTempFilePath(
        {
          canvas,
          success: res => {
            this.posterUrl = res.tempFilePath;
          }
        },
        this
      );
    },

    setTagList(tagList, x, y) {
      for (let i = 0; i < tagList.length; i++) {
        const tag = tagList[i];
        ctx.font = "8px sans-serif";
        ctx.fillStyle = "#999";
        const { width } = ctx.measureText(tag);
        this.roundRect(x, y - 11, width + 8, 16, 5, "", null, "#f1f1f1");
        ctx.fillText(tag, x + 4, y);
        x = x + width + 12;
      }
    },

    setGoodsPrice(price, marketPrice, x, y) {
      this.setText(10, "#ff5040", x, y, "¥");

      ctx.font = "bold 15px sans-serif";
      ctx.fillStyle = "#ff5040";
      ctx.fillText(price, x + 7, y);

      const priceWidth = ctx.measureText(price).width;
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "#bbb";
      ctx.fillText(marketPrice, x + priceWidth + 12, y);

      ctx.beginPath();
      const marketPriceWidth = ctx.measureText(marketPrice).width;
      ctx.rect(x + priceWidth + 12, y - 4, marketPriceWidth, 1);
      ctx.fillStyle = "#bbb";
      ctx.fill();

      ctx.restore();
    },

    setPrice(price, x, y) {
      this.setText(10, "#ff5040", x, y, "¥");

      ctx.font = "bold 15px sans-serif";
      ctx.fillStyle = "#ff5040";
      ctx.fillText(price, x + 7, y);

      const priceWidth = ctx.measureText(price).width;
      ctx.font = "9px sans-serif";
      ctx.fillStyle = "#999";
      ctx.fillText("起", x + priceWidth + 9, y);
    },

    async setLikeNumber(likeNumber, x, y) {
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "#333";
      ctx.textAlign = "right";
      ctx.fillText(likeNumber, x, y);

      const likeNumberWidth = ctx.measureText(likeNumber).width;
      await this.drawImage(
        "https://img.ubo.vip/tiddler/media-item/heart.png",
        x - likeNumberWidth - 15,
        y - 9,
        13,
        12
      );
    },

    /**
     * 绘制圆角矩形
     * @param {Number} x - 矩形的x坐标
     * @param {Number} y - 矩形的y坐标
     * @param {Number} w - 矩形的宽度
     * @param {Number} h - 矩形的高度
     * @param {Number} r - 矩形的圆角半径
     * @param {String} cover - 矩形的封面
     * @param {Object} shadow - 矩形的阴影
     * @param {String} [c = 'transparent'] - 矩形的填充色
     */
    async roundRect(
      x,
      y,
      w,
      h,
      r = 0,
      cover = "",
      shadow = null,
      c = "transparent"
    ) {
      ctx.save();
      ctx.beginPath();

      if (shadow) {
        let { x, y, blur, color } = shadow;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
        ctx.shadowBlur = blur;
        ctx.shadowColor = color;
      }
      let r1, r2, r3, r4;
      typeof r === "number" ? (r1 = r2 = r3 = r4 = r) : ([r1, r2, r3, r4] = r);

      ctx.moveTo(x, y);
      r2 ? ctx.arcTo(x + w, y, x + w, y + h, r2) : ctx.lineTo(x + w, y);
      r3 ? ctx.arcTo(x + w, y + h, x, y + h, r3) : ctx.lineTo(x + w, y + h);
      r4 ? ctx.arcTo(x, y + h, x, y, r4) : ctx.lineTo(x, y + h);
      r1 ? ctx.arcTo(x, y, x + w, y, r1) : ctx.lineTo(x, y);

      ctx.fillStyle = c;
      ctx.fill();

      if (cover) {
        ctx.clip();
        await this.drawImage(cover, x, y, w, h);
      }
      ctx.restore();
    },

    createLinearGradient(startX, startY, stopX, stopY, startColor, stopColor) {
      const grad = ctx.createLinearGradient(startX, startY, stopX, stopY);
      grad.addColorStop(0, startColor);
      grad.addColorStop(1, stopColor);
      return grad;
    },

    setText(
      fs,
      color,
      x,
      y,
      c,
      align = "left",
      bold = false,
      fontFamily = "sans-serif"
    ) {
      ctx.font = bold ? `bold ${fs}px ${fontFamily}` : `${fs}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(c, x, y);
      ctx.restore();
    },

    setWrapText(
      fs,
      color,
      x,
      y,
      c,
      lineHeight,
      maxWidth,
      bold = false,
      maxRow = 2,
      fontFamily = "sans-serif"
    ) {
      ctx.font = bold ? `bold ${fs}px ${fontFamily}` : `${fs}px ${fontFamily}`;
      ctx.fillStyle = color;
      let line = "";
      let row = 0;
      for (let i = 0; i < c.length; i++) {
        const tempLine = line + c[i];
        const tempLineWidth = ctx.measureText(tempLine).width;
        if (tempLineWidth > maxWidth && i > 0) {
          row++;
          if (row === maxRow) {
            line = tempLine.slice(0, -2) + "...";
            break;
          } else {
            ctx.fillText(line, x, y);
            line = c[i];
            y += lineHeight;
          }
        } else {
          line = tempLine;
        }
      }
      ctx.fillText(line, x, y);
      ctx.restore();
    },

    drawImage(src, x, y, w, h, mode = "cover") {
      return new Promise(resolve => {
        const image = canvas.createImage();
        image.src = src;
        image.onload = () => {
          switch (mode) {
            case "cover":
              this.drawCoverImage(image, x, y, w, h);
              break;

            case "contain":
              this.drawContainImage(image, x, y, w, h);
              break;

            case "fill":
              ctx.drawImage(image, x, y, w, h);
              break;

            case "none":
              ctx.drawImage(image, x, y, image.width, image.height);
              break;
          }
          resolve();
        };
      });
    },

    drawCoverImage(image, x, y, w, h) {
      const scale = this.calcCoverScale(image.width, image.height, w, h);
      const _w = image.width * scale;
      const _h = image.height * scale;
      const { _x, _y } = this.calcPos(_w, _h, w, h);
      ctx.drawImage(image, x + _x, y + _y, _w, _h);
    },

    drawContainImage() {
      const scale = this.calcContainScale(image.width, image.height, w, h);
      const _w = image.width * scale;
      const _h = image.height * scale;
      const { _x, _y } = this.calcPos(_w, _h, w, h);
      ctx.drawImage(image, x + _x, y + _y, _w, _h);
    },

    /**
     * cover 模式
     * @param {number} w 图片宽度
     * @param {number} h 图片高度
     * @param {number} cw 容器宽度
     * @param {number} ch 容器高度
     * @returns {number} 缩放比
     */
    calcCoverScale(w, h, cw, ch) {
      const scaleW = cw / w;
      const scaleH = ch / h;
      const scale = Math.max(scaleW, scaleH); // 取大值
      return scale;
    },

    /**
     * contain 模式
     * @param {number} w 图片宽度
     * @param {number} h 图片高度
     * @param {number} cw 容器宽度
     * @param {number} ch 容器高度
     * @returns {number} 缩放比
     */
    calcContainScale(w, h, cw, ch) {
      const scaleW = cw / w;
      const scaleH = ch / h;
      const scale = Math.min(scaleW, scaleH); // 取小值
      return scale;
    },

    // 计算让图片居中需要设置的 x，y
    calcPos(w, h, cw, ch) {
      return {
        _x: (cw - w) / 2,
        _y: (ch - h) / 2
      };
    },

    save() {
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.writePhotosAlbum"] !== false)
            this.saveImageToPhotosAlbum();
          else
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
                      this.saveImageToPhotosAlbum();
                    }
                  });
              }
            });
        }
      });
    },

    saveImageToPhotosAlbum() {
      wx.saveImageToPhotosAlbum({
        filePath: this.posterUrl,
        success: () => {
          this.triggerEvent("hide");
          wx.showToast({ title: "成功保存", icon: "none" });
        }
      });
    },

    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});
