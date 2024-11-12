"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "cmd-icon",
  props: {
    /**
     * 自定义字体图标库前缀
     */
    prefixClass: {
      type: String,
      default: "cmd-icon"
    },
    /**
     * 图标类型
     */
    type: String,
    /**
     * 图标颜色
     */
    color: {
      type: String,
      default: "#fff"
    },
    /**
     * 图标大小
     */
    size: {
      type: [Number, String],
      default: "24"
    }
  },
  computed: {
    setStyle() {
      return `color:${this.color};
				font-size:${this.size}px;
				line-height:${this.size}px`;
    }
  },
  methods: {
    $_click(e) {
      this.$emit("click", e);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n($props.prefixClass),
    b: common_vendor.n($props.prefixClass + "-" + $props.type),
    c: common_vendor.s($options.setStyle),
    d: common_vendor.o((...args) => $options.$_click && $options.$_click(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Download/CoHub/CoHub_frontend/components/cmd-icon/cmd-icon.vue"]]);
wx.createComponent(Component);
