"use strict";
const common_vendor = require("../../common/vendor.js");
const cmdIcon = () => "../cmd-icon/cmd-icon.js";
const _sfc_main = {
  name: "cmd-nav-bar",
  components: {
    cmdIcon
  },
  props: {
    /**
     * 固定到页面顶部
     */
    fixed: {
      type: Boolean,
      default: true
    },
    fontWeight: {
      type: String,
      default: "bold"
      // 默认字体粗细
    },
    /**
     * 文字图标颜色
     */
    fontSize: {
      type: String,
      default: ""
    },
    fontColor: {
      type: String,
      default: ""
    },
    /**
     * 导航栏背景颜色
     */
    backgroundColor: {
      type: String,
      default: ""
    },
    /**
     * 导航栏标题
     */
    title: {
      type: String,
      default: ""
    },
    /**
     * 导航栏左侧返回按钮，默认点击返回上层
     */
    back: {
      type: Boolean,
      default: false
    },
    /**
     * 左侧文字可同显返回按钮
     */
    leftText: {
      type: String,
      default: ""
    },
    /**
     * 左侧显示标题，不可显示左侧文字图标
     */
    leftTitle: {
      type: String,
      default: ""
    },
    /**
     * 右侧文字
     */
    rightText: {
      type: String,
      default: ""
    },
    /**
     * 右侧文字颜色
     */
    rightColor: {
      type: String,
      default: ""
    },
    /**
     * 图标一，不可与返回按钮,左侧标题同显
     */
    iconOne: {
      type: String,
      default: ""
    },
    /**
     * 图标二
     */
    iconTwo: {
      type: String,
      default: ""
    },
    /**
     * 图标三，须显有图标二
     */
    iconThree: {
      type: String,
      default: ""
    },
    /**
     * 图标四，不可与右侧文字同显
     */
    iconFour: {
      type: String,
      default: ""
    },
    avatarUrl: {
      type: String,
      default: ""
    }
  },
  computed: {
    /**
     * 设置中心标题
     */
    setCenterTitle() {
      let centerTitle = "";
      if (this.title) {
        if (this.title.length > 8) {
          centerTitle = this.title.slice(0, 6) + "...";
        } else {
          centerTitle = this.title;
        }
      }
      return centerTitle;
    },
    /**
     * 设置标题图标颜色
     */
    setFontColor() {
      let fontColor = "#000";
      if (this.fontColor) {
        fontColor = this.fontColor;
      }
      return fontColor;
    },
    /**
     * 设置背景颜色
     */
    setBackgroundColor() {
      let backgroundColor = "#fff";
      if (this.backgroundColor) {
        backgroundColor = `background: ${this.backgroundColor};`;
      }
      return backgroundColor;
    }
  },
  methods: {
    /**
     * 图标一点击事件
     */
    $_iconOneClick() {
      if (this.back) {
        common_vendor.index.navigateBack();
      } else {
        this.$emit("iconOne");
      }
    },
    /**
     * 图标二点击事件
     */
    $_iconTwoClick() {
      this.$emit("iconTwo");
    },
    /**
     * 图标三点击事件
     */
    $_iconThreeClick() {
      this.$emit("iconThree");
    },
    /**
     * 图标四点击事件
     */
    $_iconFourClick() {
      this.$emit("iconFour");
    },
    /**
     * 左侧文字点击事件
     */
    $_leftTextClick() {
      this.$emit("leftText");
    },
    /**
     * 右侧文字点击事件
     */
    $_rightTextClick() {
      this.$emit("rightText");
    },
    $_avatarClick() {
      common_vendor.index.navigateTo({
        url: "/pages/ucenter/settings/settings"
      });
    }
  }
};
if (!Array) {
  const _easycom_cmd_icon2 = common_vendor.resolveComponent("cmd-icon");
  _easycom_cmd_icon2();
}
const _easycom_cmd_icon = () => "../cmd-icon/cmd-icon.js";
if (!Math) {
  _easycom_cmd_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.back && !$props.leftTitle || $props.iconOne && !$props.leftTitle
  }, $props.back && !$props.leftTitle || $props.iconOne && !$props.leftTitle ? {
    b: common_vendor.p({
      type: $props.back ? "chevron-left" : $props.iconOne,
      size: "50",
      color: $options.setFontColor
    }),
    c: common_vendor.o((...args) => $options.$_iconOneClick && $options.$_iconOneClick(...args))
  } : {}, {
    d: common_vendor.t($props.leftTitle),
    e: $props.fontWeight,
    f: !$props.leftTitle
  }, !$props.leftTitle ? {
    g: common_vendor.t($options.setCenterTitle),
    h: common_vendor.s("color:" + $options.setFontColor)
  } : {}, {
    i: $props.avatarUrl,
    j: common_vendor.o((...args) => $options.$_avatarClick && $options.$_avatarClick(...args)),
    k: $props.iconThree && $props.iconFour && !$props.rightText
  }, $props.iconThree && $props.iconFour && !$props.rightText ? {
    l: common_vendor.p({
      type: $props.iconFour,
      size: "24",
      color: $options.setFontColor
    }),
    m: common_vendor.o((...args) => $options.$_iconFourClick && $options.$_iconFourClick(...args))
  } : {}, {
    n: $props.iconTwo && $props.iconThree
  }, $props.iconTwo && $props.iconThree ? {
    o: common_vendor.p({
      type: $props.iconThree,
      size: "24",
      color: $options.setFontColor
    }),
    p: common_vendor.o((...args) => $options.$_iconThreeClick && $options.$_iconThreeClick(...args))
  } : {}, {
    q: $props.iconTwo
  }, $props.iconTwo ? {
    r: common_vendor.p({
      type: $props.iconTwo,
      size: "24",
      color: $options.setFontColor
    }),
    s: common_vendor.o((...args) => $options.$_iconTwoClick && $options.$_iconTwoClick(...args))
  } : {}, {
    t: $props.rightText
  }, $props.rightText ? {
    v: common_vendor.t($props.rightText),
    w: common_vendor.o((...args) => $options.$_rightTextClick && $options.$_rightTextClick(...args)),
    x: common_vendor.s($props.rightColor != "" ? "color:" + $props.rightColor : "color:" + $options.setFontColor)
  } : {}, {
    y: common_vendor.n($props.fixed ? "cmd-nav-bar-fixed" : ""),
    z: common_vendor.s($options.setBackgroundColor)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Download/CoHub/CoHub_frontend/components/cmd-nav-bar/cmd-nav-bar.vue"]]);
wx.createComponent(Component);
