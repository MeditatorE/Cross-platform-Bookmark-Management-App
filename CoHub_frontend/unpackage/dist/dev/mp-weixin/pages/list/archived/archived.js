"use strict";
const common_vendor = require("../../../common/vendor.js");
const uni_modules_jsonGps_js_sdk_gps = require("../../../uni_modules/json-gps/js_sdk/gps.js");
let cdbRef;
const statusBar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar.js";
const cmdNavBar = () => "../../../components/cmd-nav-bar/cmd-nav-bar.js";
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
        return "Quick Search1";
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
      rightOptions: [
        {
          text: "Recover",
          style: {
            backgroundColor: "#0C79FE",
            backgroundImage: "/static/pic/edit.png",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "100%",
            margin: "0"
          },
          click: (item) => this.handleRecover(item)
        },
        {
          text: "Delete",
          style: {
            backgroundColor: "#FF3B30",
            color: "#FFFFFF"
          },
          click: (item) => this.handleDelete(item)
        }
      ],
      folders: [
        {
          name: "All Archived Cards",
          isExpanded: false,
          items: [
            { name: "All Archived Cards", icon: "/static/pic/10.png" }
          ]
        },
        {
          name: "Archived Folders",
          isExpanded: false,
          items: [
            { name: "Folder1", icon: "/static/pic/10.png" },
            { name: "Folder2", icon: "/static/pic/10.png" },
            { name: "Folder3", icon: "/static/pic/10.png" }
          ]
        }
        // Add more folders as needed
      ]
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
  },
  methods: {
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
    searchClick(e) {
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
        console.log("end");
      });
      console.log("refresh");
    },
    loadMore() {
      cdbRef.loadMore();
    },
    onqueryerror(e) {
      console.error(e);
    },
    onpullingdown(e) {
      console.log(e);
      this.showRefresh = true;
      if (e.pullingDistance > 100) {
        this.refresh();
      }
    },
    handleCollapseItemClick(item) {
      if (item.name === "All Archived Cards") {
        common_vendor.index.navigateTo({
          url: "/pages/list/archived/AllArchivedCards"
        });
      }
    }
  },
  handleRecover(item) {
    console.log("Recover:", item);
  },
  handleDelete(item) {
    console.log("Delete:", item);
  },
  onPullDownRefresh() {
    this.refresh();
  },
  onReachBottom() {
    this.loadMore();
  }
};
if (!Array) {
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  (_easycom_uni_swipe_action_item2 + _easycom_uni_collapse_item2 + _easycom_uni_collapse2)();
}
const _easycom_uni_swipe_action_item = () => "../../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_collapse_item = () => "../../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
if (!Math) {
  (_easycom_uni_swipe_action_item + _easycom_uni_collapse_item + _easycom_uni_collapse)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.folders, (folder, index, i0) => {
      return {
        a: common_vendor.f(folder.items, (item, itemIndex, i1) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.name),
            c: common_vendor.o(($event) => $options.navigateToGrid(item), itemIndex),
            d: "47587fad-2-" + i0 + "-" + i1 + "," + ("47587fad-1-" + i0),
            e: itemIndex,
            f: common_vendor.o(($event) => $options.handleCollapseItemClick(item), itemIndex)
          };
        }),
        b: index,
        c: "47587fad-1-" + i0 + ",47587fad-0",
        d: common_vendor.p({
          title: folder.name
        })
      };
    }),
    b: common_vendor.p({
      ["right-options"]: $data.rightOptions
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-47587fad"], ["__file", "D:/Download/CoHub/CoHub_frontend/pages/list/archived/archived.vue"]]);
wx.createPage(MiniProgramPage);
