"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_jsonGps_js_sdk_gps = require("../../uni_modules/json-gps/js_sdk/gps.js");
const statusBar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar.js";
const cmdNavBar = () => "../../components/cmd-nav-bar/cmd-nav-bar.js";
const gps = new uni_modules_jsonGps_js_sdk_gps.Gps(), db = common_vendor.Ws.database();
const _sfc_main = {
  components: {
    statusBar,
    cmdNavBar
  },
  computed: {
    inputPlaceholder(e) {
      if (common_vendor.index.getStorageSync("CURRENT_LANG") == "en") {
        return "Please enter the search content";
      } else {
        return "Quick Search";
      }
    },
    colList() {
      return [
        db.collection("opendb-news-articles").where(this.where).field("avatar,title,last_modify_date,user_id").getTemp(),
        db.collection("uni-id-users").field("_id,nickname").getTemp()
      ];
    }
  },
  data() {
    return {
      where: '"article_status" == 1',
      keyword: "",
      showRefresh: false,
      listHight: 0,
      swipeOptions: [],
      rightOptionsTemplate: [
        {
          text: "Edit",
          style: {
            backgroundColor: "#0C79FE",
            backgroundImage: "/static/pic/edit.png",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "100%",
            margin: "0"
          },
          click: (folderType, folderIndex, itemIndex) => this.handleEdit(folderType, folderIndex, itemIndex)
        },
        {
          text: "Archived",
          style: {
            backgroundColor: "#979797",
            color: "#FFFFFF"
          },
          click: (folderType, folderIndex, itemIndex) => this.handleArchived(folderType, folderIndex, itemIndex)
        },
        {
          text: "Delete",
          style: {
            backgroundColor: "#FF3B30",
            color: "#FFFFFF"
          },
          click: (folderType, folderIndex, itemIndex) => this.handleDelete(folderType, folderIndex, itemIndex)
        }
      ],
      folders: [
        {
          name: "Personal Folders",
          isExpanded: false,
          items: []
        }
      ],
      sharedFolders: [
        {
          name: "Shared Folders",
          isExpanded: false,
          items: []
        }
      ],
      utilities: [
        {
          name: "Utilities",
          isExpanded: false,
          items: [
            { name: "Recently Deleted" }
          ]
        }
      ],
      showPopup: false,
      newItemName: "",
      currentFolderType: "",
      currentFolderIndex: null,
      showColorPicker: false,
      selectedColor: "#F14C3C",
      colors: ["#F14C3C", "#FFA033", "#F7CE45", "#5DC466", "#0C79FE", "#B67AD5", "#998667"]
    };
  },
  watch: {
    keyword(keyword, oldValue) {
      let where = '"article_status" == 1 ';
      if (keyword) {
        this.where = where + `&& /${keyword}/.test(title)`;
      } else {
        this.where = where;
      }
    }
  },
  async onReady() {
    this.listHight = "auto";
    cdbRef = this.$refs.udb;
  },
  async onShow() {
    this.keyword = getApp().globalData.searchText;
    getApp().globalData.searchText = "";
    await gps.getLocation({
      geocode: true
    });
    this.getFolders();
    this.getSharedFolders();
  },
  onLoad() {
    cdbRef = this;
    this.listHight = common_vendor.index.getSystemInfoSync().windowHeight - common_vendor.index.upx2px(440);
    this.getListData();
  },
  methods: {
    async getFolders() {
      try {
        const uni_id = JSON.parse(common_vendor.index.getStorageSync("uni_id"));
        const url = `http://127.0.0.1:8000/backend/profile/${uni_id}/folders/`;
        const { data } = await common_vendor.index.request({
          url,
          method: "GET",
          header: {
            "content-type": "application/json"
            // 默认值
          }
        });
        console.log(data);
        if (data && data.items) {
          const folderItems = data.items.map((item) => {
            return {
              name: item.folderName,
              icon: this.getIconForLabel(item.label),
              folderId: item.folderId
            };
          });
          this.folders[0].items = folderItems;
        }
      } catch (error) {
        console.error("error:", error);
        common_vendor.index.showToast({
          title: "error",
          icon: "none",
          duration: 2e3
        });
      }
    },
    async getSharedFolders() {
      try {
        const uni_id = JSON.parse(common_vendor.index.getStorageSync("uni_id"));
        const url = `http://127.0.0.1:8000/backend/profile/${uni_id}/sharefolders/`;
        const { data } = await common_vendor.index.request({
          url,
          method: "GET",
          header: {
            "content-type": "application/json"
            // 默认值
          }
        });
        console.log(data);
        if (data && data.items) {
          const sharedFolderItems = data.items.map((item) => {
            return {
              name: item.folderName,
              icon: this.getIconForLabel(item.label),
              folderId: item.folderId
            };
          });
          this.sharedFolders[0].items = sharedFolderItems;
        }
      } catch (error) {
        console.error("获取共享文件夹失败:", error);
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none",
          duration: 2e3
        });
      }
    },
    getIconForLabel(label) {
      const iconMapping = {
        "Yellow": "/static/pic/clr5.png",
        // 在这里添加其他 label 到 icon 的映射
        "Red": "/static/pic/clr3.png",
        "Blue": "/static/pic/clr.png",
        "Green": "/static/pic/clr2.png",
        "Purple": "/static/pic/clr6.png",
        "Brown": "/static/pic/clr7.png"
      };
      return iconMapping[label] || "/static/pic/default.png";
    },
    goToAllInfoPage() {
      common_vendor.index.navigateTo({
        url: "/pages/list/all/all"
      });
    },
    goToArchivedInfoPage() {
      common_vendor.index.navigateTo({
        url: "/pages/list/archived/archived"
      });
    },
    navigateToGrid() {
      common_vendor.index.navigateTo({
        url: "/pages/grid/grid"
      });
    },
    searchClick() {
      common_vendor.index.hideKeyboard();
      common_vendor.index.navigateTo({
        url: "/pages/list/search/search",
        animationType: "fade-in"
      });
    },
    retry() {
      this.refresh();
    },
    refresh() {
      cdbRef.loadData({
        clear: true
      }, () => {
        common_vendor.index.stopPullDownRefresh();
      });
    },
    loadMore() {
      cdbRef.loadMore();
    },
    onqueryerror(e) {
      console.error(e);
    },
    onpullingdown(e) {
      this.showRefresh = true;
      if (e.pullingDistance > 100) {
        this.refresh();
      }
    },
    handleCollapseItemClick(item) {
      if (item.name === "Recently Deleted") {
        common_vendor.index.navigateTo({
          url: "/pages/list/delete/delete"
        });
      }
    },
    handleCollapseItemClickone(item) {
      common_vendor.index.navigateTo({
        url: "/pages/list/grid/grid"
      });
    },
    handleCollapseItemClicktwo(item) {
      common_vendor.index.navigateTo({
        url: "/pages/list/gridmul/gridmul"
      });
    },
    openAddItemDialog(folderType, index) {
      this.currentFolderType = folderType;
      this.currentFolderIndex = index;
      this.showPopup = true;
    },
    async addItem() {
      if (this.newItemName.trim() !== "") {
        try {
          const { data } = await common_vendor.index.request({
            url: "http://127.0.0.1:8000/backend/profile/" + JSON.parse(common_vendor.index.getStorageSync("uni_id")) + "/folder/create/",
            method: "POST",
            data: {
              folderName: this.newItemName,
              label: "Yellow"
            },
            header: {
              "content-type": "application/json"
              // 默认值
            }
          });
          console.log(data);
          if (data && data.response) {
            this.getFolders();
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: "Network error",
            icon: "none",
            duration: 2e3
          });
        }
        this.newItemName = "";
        this.selectedColor = this.colors[0];
        this.showPopup = false;
      }
    },
    cancelAddItem() {
      this.newItemName = "";
      this.selectedColor = this.colors[0];
      this.showPopup = false;
    },
    toggleColorPicker() {
      this.showColorPicker = !this.showColorPicker;
    },
    selectColor(color) {
      this.selectedColor = color;
      this.showColorPicker = false;
    },
    getColorIcon(color) {
      return color;
    },
    async getListData() {
      const [err, res] = await common_vendor.Ws.database().collection("opendb-news-articles").where(this.where).field("avatar,title,last_modify_date,user_id").get();
      if (res) {
        this.swipeOptions = res.result.data;
      }
    },
    getRightOptions(folderType, folderIndex, itemIndex) {
      return this.rightOptionsTemplate.map((option) => {
        return {
          ...option,
          click: () => this[option.click](folderType, folderIndex, itemIndex)
        };
      });
    },
    handleEdit(folderType, folderIndex, itemIndex) {
      this.showPopup = true;
      console.log("Edit:", folderType, folderIndex, itemIndex);
    },
    handleArchived(folderType, folderIndex, itemIndex) {
      console.log("Archived:", folderType, folderIndex, itemIndex);
      this[folderType][folderIndex].items.splice(itemIndex, 1);
    },
    handleDelete(folderType, folderIndex, itemIndex) {
      console.log("Delete:", folderType, folderIndex, itemIndex);
      this[folderType][folderIndex].items.splice(itemIndex, 1)[0];
      if (this[folderType][folderIndex].items.length === 0) {
        this[folderType].splice(folderIndex, 1);
      }
    }
  },
  onPullDownRefresh() {
    this.refresh();
  },
  onReachBottom() {
    this.loadMore();
  }
};
if (!Array) {
  const _component_statusBar = common_vendor.resolveComponent("statusBar");
  const _easycom_cmd_nav_bar2 = common_vendor.resolveComponent("cmd-nav-bar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  (_component_statusBar + _easycom_cmd_nav_bar2 + _easycom_uni_search_bar2 + _easycom_uni_icons2 + _easycom_uni_swipe_action_item2 + _easycom_uni_collapse_item2 + _easycom_uni_collapse2)();
}
const _easycom_cmd_nav_bar = () => "../../components/cmd-nav-bar/cmd-nav-bar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_collapse_item = () => "../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
if (!Math) {
  (_easycom_cmd_nav_bar + _easycom_uni_search_bar + _easycom_uni_icons + _easycom_uni_swipe_action_item + _easycom_uni_collapse_item + _easycom_uni_collapse)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      fixed: false,
      leftTitle: "My Collection",
      ["font-size"]: "30cm",
      iconTwo: "add",
      ["font-color"]: "#000",
      ["background-color"]: "#fff",
      fontWeight: "bold",
      avatarUrl: "/static/pic/LeftAccessory.png"
    }),
    b: common_vendor.sr("searchBar", "96c6bf44-2"),
    c: common_vendor.o(($event) => $data.keyword = $event),
    d: common_vendor.p({
      radius: "20",
      cancelButton: "none",
      disabled: true,
      placeholder: $options.inputPlaceholder,
      modelValue: $data.keyword
    }),
    e: common_vendor.o((...args) => $options.searchClick && $options.searchClick(...args)),
    f: common_vendor.o((...args) => $options.goToAllInfoPage && $options.goToAllInfoPage(...args)),
    g: common_vendor.o((...args) => $options.goToArchivedInfoPage && $options.goToArchivedInfoPage(...args)),
    h: common_vendor.f($data.folders, (folder, index, i0) => {
      return {
        a: common_vendor.t(folder.name),
        b: common_vendor.o(($event) => $options.openAddItemDialog("folders", index), index),
        c: "96c6bf44-4-" + i0 + ",96c6bf44-3",
        d: common_vendor.f(folder.items, (item, itemIndex, i1) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.name),
            c: common_vendor.o(($event) => $options.navigateToGrid(item), itemIndex),
            d: "96c6bf44-6-" + i0 + "-" + i1 + "," + ("96c6bf44-5-" + i0),
            e: common_vendor.p({
              ["right-options"]: $options.getRightOptions("folders", index, itemIndex)
            }),
            f: itemIndex,
            g: common_vendor.o(($event) => $options.handleCollapseItemClickone(item), itemIndex)
          };
        }),
        e: "96c6bf44-5-" + i0 + ",96c6bf44-3",
        f: common_vendor.p({
          title: folder.name
        }),
        g: index
      };
    }),
    i: common_vendor.p({
      type: "plus",
      size: "30"
    }),
    j: common_vendor.f($data.sharedFolders, (folder, index, i0) => {
      return {
        a: common_vendor.t(folder.name),
        b: common_vendor.o(($event) => $options.openAddItemDialog("sharedFolders", index), index),
        c: "96c6bf44-8-" + i0 + ",96c6bf44-7",
        d: common_vendor.f(folder.items, (item, itemIndex, i1) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.name),
            c: common_vendor.o(($event) => $options.navigateToGrid(item), itemIndex),
            d: "96c6bf44-10-" + i0 + "-" + i1 + "," + ("96c6bf44-9-" + i0),
            e: common_vendor.p({
              ["right-options"]: $options.getRightOptions("sharedFolders", index, itemIndex)
            }),
            f: itemIndex,
            g: common_vendor.o(($event) => $options.handleCollapseItemClicktwo(item), itemIndex)
          };
        }),
        e: "96c6bf44-9-" + i0 + ",96c6bf44-7",
        f: common_vendor.p({
          title: folder.name
        }),
        g: index
      };
    }),
    k: common_vendor.p({
      type: "plus",
      size: "30"
    }),
    l: common_vendor.f($data.utilities, (folder, index, i0) => {
      return {
        a: common_vendor.t(folder.name),
        b: common_vendor.f(folder.items, (item, itemIndex, i1) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.name),
            c: common_vendor.o(($event) => $options.navigateToGrid(item), itemIndex),
            d: "96c6bf44-13-" + i0 + "-" + i1 + "," + ("96c6bf44-12-" + i0),
            e: common_vendor.p({
              ["right-options"]: $options.getRightOptions("utilities", index, itemIndex)
            }),
            f: itemIndex,
            g: common_vendor.o(($event) => $options.handleCollapseItemClick(item), itemIndex)
          };
        }),
        c: "96c6bf44-12-" + i0 + ",96c6bf44-11",
        d: common_vendor.p({
          title: folder.name
        }),
        e: index
      };
    }),
    m: $data.showPopup
  }, $data.showPopup ? common_vendor.e({
    n: common_vendor.o((...args) => $options.cancelAddItem && $options.cancelAddItem(...args)),
    o: common_vendor.o((...args) => $options.addItem && $options.addItem(...args)),
    p: common_vendor.o((...args) => $options.toggleColorPicker && $options.toggleColorPicker(...args)),
    q: $data.newItemName,
    r: common_vendor.o(($event) => $data.newItemName = $event.detail.value),
    s: $data.showColorPicker
  }, $data.showColorPicker ? {
    t: common_vendor.f($data.colors, (color, k0, i0) => {
      return {
        a: color,
        b: color,
        c: common_vendor.o(($event) => $options.selectColor(color), color)
      };
    })
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-96c6bf44"], ["__file", "D:/Download/CoHub/CoHub_frontend/pages/list/list.nvue"]]);
wx.createPage(MiniProgramPage);
