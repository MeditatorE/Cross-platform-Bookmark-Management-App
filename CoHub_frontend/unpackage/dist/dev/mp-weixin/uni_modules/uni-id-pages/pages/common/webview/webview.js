"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  onLoad({ url, title }) {
    if (url.substring(0, 4) != "http") {
      common_vendor.index.showModal({
        title: "Error",
        content: 'Not a valid website link,"' + url + '"',
        showCancel: false,
        confirmText: "OK",
        complete: () => {
          common_vendor.index.navigateBack();
        }
      });
      title = "Path error";
    } else {
      this.url = url;
    }
    if (title) {
      common_vendor.index.setNavigationBarTitle({ title });
    }
  },
  data() {
    return {
      url: null
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.url
  }, $data.url ? {
    b: $data.url
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Download/CoHub/CoHub_frontend/uni_modules/uni-id-pages/pages/common/webview/webview.vue"]]);
wx.createPage(MiniProgramPage);
