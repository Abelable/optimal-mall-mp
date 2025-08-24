import dayjs from "dayjs";
import { store } from "../../../../../store/index";

let canvas = null;
let ctx = null;

Component({
  properties: {
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
      const {
        status,
        cover,
        title,
        authorInfo,
        noticeTime,
        startTime,
        qrcode
      } = this.properties.info || {};

      await this.drawImage(
        "https://static.chengxinxingqiu.cn/mp/poster_bg.png",
        0,
        0,
        300,
        533
      );
      await this.drawImage(
        "https://static.chengxinxingqiu.cn/mp/poster_logo.png",
        12,
        14,
        96,
        32
      );
      this.setText(
        14,
        "#fff",
        150,
        510,
        "让  时  间  见  证  信  任",
        "center"
      );

      this.roundRect(
        187,
        15,
        100,
        30,
        15,
        "",
        null,
        "rgba(255, 255, 255, 0.5)"
      );
      if (store.userInfo) {
        const { avatar, nickname } = store.userInfo;
        await this.roundRect(190, 18, 24, 24, 12, avatar);
        this.setText(10, "#000", 217, 29, nickname, "left");
      } else {
        await this.roundRect(
          190,
          18,
          24,
          24,
          12,
          "https://static.chengxinxingqiu.cn/mp/logo.png"
        );
        this.setText(10, "#000", 217, 29, "诚信星球", "left");
      }
      this.setText(7, "#6A6F75", 217, 40, "为您推荐精彩直播");

      this.roundRect(12, 55, 274, 426, 10, "", null, "#fff");
      await this.roundRect(24, 67, 250, 325, 5, cover);

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

      this.setWrapText(16, "#333", 24, 420, title, 22, 180, false, 1);

      const time = `直播时间：${dayjs(
        status === 3 ? noticeTime : startTime
      ).format("MM-DD HH:mm")}`;
      this.setText(10, "#999", 24, 440, time);

      await this.roundRect(24, 453, 18, 18, 9, authorInfo.avatar);
      this.setText(10, "#333", 46, 466, authorInfo.nickname);

      await this.drawImage(qrcode, 210, 400, 56, 56);
      this.setText(8, "#F5701D", 238, 468, "长按识别进入直播", "center");

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

    setPrice(price, x, y) {
      this.setText(14, "#ff5040", x, y, "¥");

      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#ff5040";
      ctx.fillText(price, x + 10, y);
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
      c = "transparent",
      lineColor,
      lineWidth
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

      if (lineColor) {
        ctx.moveTo(x + r1, y);
      } else {
        ctx.moveTo(x, y);
      }

      r2 ? ctx.arcTo(x + w, y, x + w, y + h, r2) : ctx.lineTo(x + w, y);
      r3 ? ctx.arcTo(x + w, y + h, x, y + h, r3) : ctx.lineTo(x + w, y + h);
      r4 ? ctx.arcTo(x, y + h, x, y, r4) : ctx.lineTo(x, y + h);
      r1 ? ctx.arcTo(x, y, x + w, y, r1) : ctx.lineTo(x, y);

      ctx.fillStyle = c;
      if (lineColor) {
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
      ctx.fill();

      if (cover) {
        ctx.clip();
        await this.drawImage(cover, x, y, w, h);
      }
      ctx.restore();
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
