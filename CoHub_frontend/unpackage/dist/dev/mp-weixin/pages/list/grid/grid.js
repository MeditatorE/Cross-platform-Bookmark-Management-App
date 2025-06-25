"use strict";
const common_vendor = require("../../../common/vendor.js");
const CmdNavBar = () => "../../../components/cmd-nav-bar/cmd-nav-bar.js";
const Add = () => "./add.js";
const _sfc_main = {
  components: {
    CmdNavBar,
    Add
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
        const url = `http://127.0.0.1:8000/backend/profile/${uni_id}/all/`;
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
    addGoods() {
      console.log("tap add new Collections");
      this.$refs.addComponent.open();
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
    editSelected() {
      if (this.selectedItems.length === 1) {
        this.editingItemId = this.selectedItems[0];
        const item = this.goodsList.find((item2) => item2.id === this.editingItemId);
        this.newTitle = item.name;
        this.isEditPopupVisible = true;
      } else {
        alert("Please select exactly one item to edit.");
      }
    },
    saveTitle() {
      if (this.editingItemId !== null) {
        const item = this.goodsList.find((item2) => item2.id === this.editingItemId);
        item.name = this.newTitle;
        this.isEditPopupVisible = false;
        this.newTitle = "";
        this.editingItemId = null;
      }
    },
    closeEditPopup() {
      this.isEditPopupVisible = false;
      this.newTitle = "";
      this.editingItemId = null;
    },
    shareLink() {
      if (this.selectedItems.length === 1) {
        const item = this.goodsList.find((item2) => item2.id === this.selectedItems[0]);
        this.currentLink = item.link;
        this.isSharePopupVisible = true;
      } else {
        alert("Please select exactly one item to share.");
      }
    },
    copyLink() {
      const selectedItem = this.goodsList.find((item) => item.id === this.selectedItems[0]);
      if (selectedItem) {
        const link = selectedItem.link;
        this.copyToClipboard(link);
        alert("Link copied to clipboard");
      }
      this.isSharePopupVisible = false;
    },
    copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch((err) => {
          console.error("Could not copy text: ", err);
        });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          document.body.removeChild(textArea);
        } catch (err) {
          console.error("Could not copy text: ", err);
        }
        document.body.removeChild(textArea);
      }
    },
    closeSharePopup() {
      this.isSharePopupVisible = false;
    },
    archiveSelected() {
      console.log("Archive selected items", this.selectedItems);
    },
    deleteSelected() {
      console.log("Delete selected items", this.selectedItems);
      this.goodsList = this.goodsList.filter((item) => !this.selectedItems.includes(item.id));
      this.selectedItems = [];
    },
    addItem(newItem) {
      this.goodsList.push(newItem);
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_add = common_vendor.resolveComponent("add");
  (_easycom_uni_icons2 + _component_add)();
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
    d: 1 == $data.goodsNav ? 1 : "",
    e: common_vendor.f($data.goodsList, (item, index, i0) => {
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
    f: $options.isAnyItemSelected
  }, $options.isAnyItemSelected ? {
    g: common_vendor.p({
      type: "compose",
      size: "30"
    }),
    h: common_vendor.o((...args) => $options.editSelected && $options.editSelected(...args)),
    i: common_vendor.p({
      type: "link",
      size: "30"
    }),
    j: common_vendor.o((...args) => $options.shareLink && $options.shareLink(...args)),
    k: common_vendor.p({
      type: "download",
      size: "30"
    }),
    l: common_vendor.o((...args) => $options.archiveSelected && $options.archiveSelected(...args)),
    m: common_vendor.p({
      type: "trash",
      size: "30",
      color: "red"
    }),
    n: common_vendor.o((...args) => $options.deleteSelected && $options.deleteSelected(...args))
  } : {}, {
    o: common_vendor.o(($event) => $options.addGoods()),
    p: $data.isEditPopupVisible
  }, $data.isEditPopupVisible ? {
    q: $data.newTitle,
    r: common_vendor.o(($event) => $data.newTitle = $event.detail.value),
    s: common_vendor.o((...args) => $options.closeEditPopup && $options.closeEditPopup(...args)),
    t: common_vendor.o((...args) => $options.saveTitle && $options.saveTitle(...args))
  } : {}, {
    v: $data.isSharePopupVisible
  }, $data.isSharePopupVisible ? {
    w: common_vendor.o((...args) => $options.copyLink && $options.copyLink(...args)),
    x: common_vendor.o((...args) => $options.closeSharePopup && $options.closeSharePopup(...args))
  } : {}, {
    y: common_vendor.sr("addComponent", "307aa608-4"),
    z: common_vendor.o($options.addItem)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-307aa608"], ["__file", "D:/Download/CoHub/CoHub_frontend/pages/list/grid/grid.vue"]]);
wx.createPage(MiniProgramPage);
