"use strict";
const common_vendor = require("../../../common/vendor.js");
const CmdNavBar = () => "../../../components/cmd-nav-bar/cmd-nav-bar.js";
const _sfc_main = {
  components: {
    CmdNavBar
  },
  data() {
    return {
      goodsList: [],
      goodsNav: 1,
      selectedItems: [],
      isSelectionMode: false,
      isEditPopupVisible: false,
      isSharePopupVisible: false,
      currentLink: "",
      newTitle: "",
      editingItemId: null,
      startX: 0,
      startY: 0
    };
  },
  onLoad() {
    this.getAllGoods();
  },
  computed: {
    isAnyItemSelected() {
      return this.selectedItems.length > 0;
    }
  },
  methods: {
    async getAllGoods() {
      try {
        const uni_id = JSON.parse(common_vendor.index.getStorageSync("uni_id"));
        const url = `http://127.0.0.1:8000/backend/profile/${uni_id}/del/`;
        const { data } = await common_vendor.index.request({
          url,
          method: "GET",
          header: {
            "content-type": "application/json"
            // 默认值
          }
        });
        console.log(data);
        if (data && data.goodsList) {
          const goodsList = data.goodsList.map((item) => {
            return {
              id: item.id,
              image: "/static/pic/13.png",
              name: item.name,
              tags: item.tags,
              date: item.date,
              link: item.link
            };
          });
          this.goodsList = goodsList;
        }
      } catch (error) {
        console.error("error:", error);
        common_vendor.index.showToast({
          title: "network error",
          icon: "none",
          duration: 2e3
        });
      }
    },
    handleClick(id) {
      if (this.isSelectionMode) {
        this.toggleSelectItem(id);
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/webview/webview?url=https://www.baidu.com"
        });
      }
    },
    handleLongPress(id) {
      this.isSelectionMode = true;
      this.toggleSelectItem(id);
    },
    toggleSelectItem(id) {
      const index = this.selectedItems.indexOf(id);
      if (index === -1) {
        this.selectedItems.push(id);
      } else {
        this.selectedItems.splice(index, 1);
      }
    },
    startSwipe(event, id) {
      this.startX = event.touches[0].pageX;
      this.startY = event.touches[0].pageY;
    },
    moveSwipe(event, id) {
      const deltaX = event.touches[0].pageX - this.startX;
      if (Math.abs(deltaX) > 50) {
        this.selectItem(id);
      }
    },
    endSwipe(event, id) {
      this.startX = 0;
      this.startY = 0;
    },
    selectAll() {
      this.selectedItems = this.goodsList.map((item) => item.id);
    },
    done() {
      this.selectedItems = [];
      this.isSelectionMode = false;
    },
    recoverSelected() {
      console.log("Recover selected items", this.selectedItems);
    },
    deleteSelected() {
      console.log("Delete selected items", this.selectedItems);
      this.goodsList = this.goodsList.filter((item) => !this.selectedItems.includes(item.id));
      this.selectedItems = [];
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.isAnyItemSelected
  }, $options.isAnyItemSelected ? {
    b: common_vendor.o((...args) => $options.selectAll && $options.selectAll(...args)),
    c: common_vendor.o((...args) => $options.done && $options.done(...args))
  } : {}, {
    d: common_vendor.f($data.goodsList, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.name),
        c: common_vendor.f(item.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        d: common_vendor.t(item.date),
        e: item.id,
        f: $data.selectedItems.includes(item.id) ? 1 : "",
        g: common_vendor.o(($event) => $options.handleClick(item.id), item.id),
        h: common_vendor.o(($event) => $options.handleLongPress(item.id), item.id)
      };
    }),
    e: $options.isAnyItemSelected
  }, $options.isAnyItemSelected ? {
    f: common_vendor.p({
      type: "refreshempty",
      size: "30"
    }),
    g: common_vendor.o((...args) => $options.recoverSelected && $options.recoverSelected(...args)),
    h: common_vendor.p({
      type: "trash",
      size: "30",
      color: "red"
    }),
    i: common_vendor.o((...args) => $options.deleteSelected && $options.deleteSelected(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3d7be036"], ["__file", "D:/Download/CoHub/CoHub_frontend/pages/list/delete/delete.vue"]]);
wx.createPage(MiniProgramPage);
