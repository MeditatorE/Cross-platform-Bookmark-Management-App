"use strict";
const common_vendor = require("../../../common/vendor.js");
const CmdNavBar = () => "../../../components/cmd-nav-bar/cmd-nav-bar.js";
const _sfc_main = {
  components: {
    CmdNavBar
  },
  data() {
    return {
      goodsList: [
        {
          id: 1,
          image: "/static/pic/13.png",
          name: "👋 Title for Collection 1",
          tags: ["Tag1", "Tag2"],
          date: "2021/01/09",
          link: "https://example.com/link1"
        },
        {
          id: 2,
          image: "/static/pic/12.png",
          name: "👋 Title for Collection 2",
          tags: ["Tag1", "Tag3"],
          date: "2022/01/09",
          link: "https://example.com/link2"
        }
      ],
      goodsNav: 1,
      selectedItems: [],
      isSelectionMode: false,
      isEditPopupVisible: false,
      isSharePopupVisible: false,
      currentLink: "",
      newTitle: "",
      editingItemId: null,
      startX: 0,
      startY: 0,
      sortByLatest: true,
      isListView: false
    };
  },
  onLoad() {
  },
  computed: {
    isAnyItemSelected() {
      return this.selectedItems.length > 0;
    },
    sortedGoodsList() {
      let sortedList = [...this.goodsList];
      if (this.sortByLatest) {
        sortedList.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        sortedList.sort((a, b) => a.name.localeCompare(b.name));
      }
      return sortedList;
    }
  },
  methods: {
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
    toggleSortByLatest() {
      this.sortByLatest = !this.sortByLatest;
    },
    toggleView() {
      this.isListView = !this.isListView;
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
    d: common_vendor.p({
      type: "refreshempty",
      size: "20"
    }),
    e: $data.sortByLatest ? 1 : "",
    f: common_vendor.o((...args) => $options.toggleSortByLatest && $options.toggleSortByLatest(...args)),
    g: common_vendor.p({
      type: $data.isListView ? "list" : "tune",
      size: "20"
    }),
    h: common_vendor.t($data.isListView ? "List" : "Filter"),
    i: $data.isListView ? 1 : "",
    j: common_vendor.o((...args) => $options.toggleView && $options.toggleView(...args)),
    k: common_vendor.f($options.sortedGoodsList, (item, index, i0) => {
      return common_vendor.e(!$data.isListView ? {
        a: item.image
      } : {}, {
        b: common_vendor.t(item.name)
      }, !$data.isListView ? {} : {}, {
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
      });
    }),
    l: !$data.isListView,
    m: !$data.isListView,
    n: $options.isAnyItemSelected
  }, $options.isAnyItemSelected ? {
    o: common_vendor.p({
      type: "compose",
      size: "30"
    }),
    p: common_vendor.o((...args) => $options.editSelected && $options.editSelected(...args)),
    q: common_vendor.p({
      type: "link",
      size: "30"
    }),
    r: common_vendor.o((...args) => $options.shareLink && $options.shareLink(...args)),
    s: common_vendor.p({
      type: "download",
      size: "30"
    }),
    t: common_vendor.o((...args) => $options.archiveSelected && $options.archiveSelected(...args)),
    v: common_vendor.p({
      type: "trash",
      size: "30",
      color: "red"
    }),
    w: common_vendor.o((...args) => $options.deleteSelected && $options.deleteSelected(...args))
  } : {}, {
    x: $data.isEditPopupVisible
  }, $data.isEditPopupVisible ? {
    y: $data.newTitle,
    z: common_vendor.o(($event) => $data.newTitle = $event.detail.value),
    A: common_vendor.o((...args) => $options.closeEditPopup && $options.closeEditPopup(...args)),
    B: common_vendor.o((...args) => $options.saveTitle && $options.saveTitle(...args))
  } : {}, {
    C: $data.isSharePopupVisible
  }, $data.isSharePopupVisible ? {
    D: common_vendor.o((...args) => $options.copyLink && $options.copyLink(...args)),
    E: common_vendor.o((...args) => $options.closeSharePopup && $options.closeSharePopup(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6d2a9a62"], ["__file", "D:/Download/CoHub/CoHub_frontend/pages/list/all/all.vue"]]);
wx.createPage(MiniProgramPage);
