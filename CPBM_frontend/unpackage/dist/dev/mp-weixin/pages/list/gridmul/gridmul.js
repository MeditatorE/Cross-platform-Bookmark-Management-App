"use strict";
const common_vendor = require("../../../common/vendor.js");
const CmdNavBar = () => "../../../components/cmd-nav-bar/cmd-nav-bar.js";
const Addmul = () => "./addmul.js";
const _sfc_main = {
  components: {
    CmdNavBar,
    Addmul
  },
  data() {
    return {
      friends: [],
      friendsCount: 4,
      goodsList: [],
      goodsNav: 1,
      selectedItems: [],
      isSelectionMode: false,
      isEditPopupVisible: false,
      isSharePopupVisible: false,
      currentLink: "",
      newTitle: "",
      editingItemId: null,
      friendsCount: 3,
      startX: 0,
      startY: 0,
      sortByLatest: true,
      isListView: false
    };
  },
  onLoad() {
    this.getAllGoods();
    this.getSharedFolderUsers();
  },
  computed: {
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
              image: item.image,
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
    async getSharedFolderUsers() {
      try {
        const uni_id = JSON.parse(common_vendor.index.getStorageSync("uni_id"));
        const folderUrl = `http://127.0.0.1:8000/backend/profile/${uni_id}/folders/`;
        const folderResponse = await common_vendor.index.request({
          url: folderUrl,
          method: "GET",
          header: {
            "content-type": "application/json"
          }
        });
        const folderData = folderResponse.data;
        if (folderData && folderData.items && folderData.items.length > 0) {
          const owner = folderData.items[0].owner;
          const sharedFolderUrl = `http://127.0.0.1:8000/backend/sharedfolder/${owner}/users/`;
          const { data } = await common_vendor.index.request({
            url: sharedFolderUrl,
            method: "GET",
            header: {
              "content-type": "application/json"
            }
          });
          if (data && data.friends) {
            const friends = data.friends.map((friend) => ({
              image: friend.image,
              name: friend.name
            }));
            this.friends = friends;
            this.friendsCount = friends.length;
          }
        }
      } catch (error) {
        console.error("failed:", error);
        common_vendor.index.showToast({
          title: "network error",
          icon: "none",
          duration: 2e3
        });
      }
    },
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
    navigateToFriends() {
      common_vendor.index.navigateTo({
        url: "/pages/list/gridmul/friends/friends"
      });
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
  const _component_addmul = common_vendor.resolveComponent("addmul");
  (_easycom_uni_icons2 + _component_addmul)();
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
    e: common_vendor.f($data.friends.slice(0, 3), (friend, index, i0) => {
      return {
        a: index,
        b: friend.image
      };
    }),
    f: common_vendor.t($data.friendsCount),
    g: common_vendor.t($data.goodsList.length),
    h: common_vendor.p({
      type: "right",
      size: "20"
    }),
    i: common_vendor.o((...args) => $options.navigateToFriends && $options.navigateToFriends(...args)),
    j: common_vendor.p({
      type: "refreshempty",
      size: "20"
    }),
    k: $data.sortByLatest ? 1 : "",
    l: common_vendor.o((...args) => $options.toggleSortByLatest && $options.toggleSortByLatest(...args)),
    m: common_vendor.p({
      type: $data.isListView ? "list" : "tune",
      size: "20"
    }),
    n: common_vendor.t($data.isListView ? "List" : "Filter"),
    o: $data.isListView ? 1 : "",
    p: common_vendor.o((...args) => $options.toggleView && $options.toggleView(...args)),
    q: common_vendor.f($options.sortedGoodsList, (item, index, i0) => {
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
    r: !$data.isListView,
    s: !$data.isListView,
    t: $options.isAnyItemSelected
  }, $options.isAnyItemSelected ? {
    v: common_vendor.p({
      type: "compose",
      size: "30"
    }),
    w: common_vendor.o((...args) => $options.editSelected && $options.editSelected(...args)),
    x: common_vendor.p({
      type: "link",
      size: "30"
    }),
    y: common_vendor.o((...args) => $options.shareLink && $options.shareLink(...args)),
    z: common_vendor.p({
      type: "download",
      size: "30"
    }),
    A: common_vendor.o((...args) => $options.archiveSelected && $options.archiveSelected(...args)),
    B: common_vendor.p({
      type: "trash",
      size: "30",
      color: "red"
    }),
    C: common_vendor.o((...args) => $options.deleteSelected && $options.deleteSelected(...args))
  } : {}, {
    D: common_vendor.o(($event) => $options.addGoods()),
    E: $data.isEditPopupVisible
  }, $data.isEditPopupVisible ? {
    F: $data.newTitle,
    G: common_vendor.o(($event) => $data.newTitle = $event.detail.value),
    H: common_vendor.o((...args) => $options.closeEditPopup && $options.closeEditPopup(...args)),
    I: common_vendor.o((...args) => $options.saveTitle && $options.saveTitle(...args))
  } : {}, {
    J: $data.isSharePopupVisible
  }, $data.isSharePopupVisible ? {
    K: common_vendor.o((...args) => $options.copyLink && $options.copyLink(...args)),
    L: common_vendor.o((...args) => $options.closeSharePopup && $options.closeSharePopup(...args))
  } : {}, {
    M: common_vendor.sr("addComponent", "cc688b2d-7"),
    N: common_vendor.o($options.addItem)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cc688b2d"], ["__file", "D:/Download/CoHub/CoHub_frontend/pages/list/gridmul/gridmul.vue"]]);
wx.createPage(MiniProgramPage);
