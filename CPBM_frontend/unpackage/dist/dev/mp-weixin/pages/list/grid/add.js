"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isVisible: false,
      isInputFocused: false,
      inputValue: "",
      isFolderListVisible: false,
      isTagListVisible: false,
      candidates: ["Folder 1", "Folder 2", "Folder 3", "Folder 4", "Folder 5", "Folder 6", "Folder 7"],
      city: "",
      newTag: "",
      checkbox2: [0],
      selectedTags: [],
      hobby: [
        { text: "Tag 1", value: 0 },
        { text: "Tag 2", value: 1 },
        { text: "Tag 3", value: 2 },
        { text: "Tag 4", value: 3 },
        { text: "Tag 5", value: 4 },
        { text: "Tag 6", value: 5 }
      ]
    };
  },
  methods: {
    open() {
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
      this.isInputFocused = false;
      this.isFolderListVisible = false;
      this.isTagListVisible = false;
    },
    toggleFolderList() {
      this.isFolderListVisible = !this.isFolderListVisible;
    },
    toggleTagList() {
      if (this.isTagListVisible) {
        this.selectedTags = this.checkbox2.map((tagValue) => {
          const tag = this.hobby.find((h) => h.value === tagValue);
          return tag ? tag.text : "";
        });
        this.$emit("update-tags", this.selectedTags);
      }
      this.isTagListVisible = !this.isTagListVisible;
    },
    addNewTag() {
      const trimmedTag = this.newTag.trim();
      if (trimmedTag) {
        const newValue = this.hobby.length;
        this.hobby.push({ text: trimmedTag, value: newValue });
        this.checkbox2.push(newValue);
        this.newTag = "";
      }
    },
    addTagFromInput() {
      if (this.newTag.trim()) {
        this.tags.push(this.newTag.trim());
        this.newTag = "";
      }
    },
    done() {
      if (this.inputValue.trim() !== "") {
        this.selectedTags.map((tagValue) => {
          const tag = this.hobby.find((h) => h.value === tagValue);
          return tag ? tag.text : "";
        });
        const newItem = {
          id: Date.now(),
          image: "/static/pic/13.png",
          name: this.inputValue.trim(),
          date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          tags: this.selectedTags
        };
        this.$emit("add-item", newItem);
      }
      this.close();
    },
    addTag() {
      console.log("Add Tag:", this.inputValue);
      this.close();
    },
    onFocus() {
      this.isInputFocused = true;
      this.fixBackgroundPosition();
    },
    onBlur() {
      this.isInputFocused = false;
      this.resetBackgroundPosition();
    },
    fixBackgroundPosition() {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    },
    resetBackgroundPosition() {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(document.body.style.top || "0") * -1);
    },
    selectPredefinedTag(tag) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
      }
    },
    removeTag(tag) {
      this.tags = this.tags.filter((t) => t !== tag);
    }
  }
};
if (!Array) {
  const _easycom_uni_combox2 = common_vendor.resolveComponent("uni-combox");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  (_easycom_uni_combox2 + _easycom_uni_section2 + _easycom_uni_data_checkbox2)();
}
const _easycom_uni_combox = () => "../../../uni_modules/uni-combox/components/uni-combox/uni-combox.js";
const _easycom_uni_section = () => "../../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_uni_data_checkbox = () => "../../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
if (!Math) {
  (_easycom_uni_combox + _easycom_uni_section + _easycom_uni_data_checkbox)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.isInputFocused || $data.isFolderListVisible ? 1 : "",
    b: common_vendor.o((...args) => $options.done && $options.done(...args)),
    c: common_vendor.o((...args) => $options.onFocus && $options.onFocus(...args)),
    d: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args)),
    e: $data.inputValue,
    f: common_vendor.o(($event) => $data.inputValue = $event.detail.value),
    g: common_vendor.o((...args) => $options.toggleFolderList && $options.toggleFolderList(...args)),
    h: common_vendor.o((...args) => $options.toggleTagList && $options.toggleTagList(...args)),
    i: common_vendor.o((...args) => $options.toggleFolderList && $options.toggleFolderList(...args)),
    j: common_vendor.o(($event) => $data.city = $event),
    k: common_vendor.p({
      candidates: $data.candidates,
      placeholder: "Select your folder",
      modelValue: $data.city
    }),
    l: common_vendor.t($data.city),
    m: common_vendor.p({
      title: "Folder Name",
      type: "line"
    }),
    n: $data.isFolderListVisible ? 1 : "",
    o: common_vendor.o((...args) => $options.toggleTagList && $options.toggleTagList(...args)),
    p: $data.newTag,
    q: common_vendor.o(($event) => $data.newTag = $event.detail.value),
    r: common_vendor.o((...args) => $options.addNewTag && $options.addNewTag(...args)),
    s: common_vendor.t(JSON.stringify($data.checkbox2)),
    t: common_vendor.o(($event) => $data.checkbox2 = $event),
    v: common_vendor.p({
      mode: "button",
      multiple: true,
      localdata: $data.hobby,
      modelValue: $data.checkbox2
    }),
    w: common_vendor.p({
      title: "Tag Name",
      type: "line"
    }),
    x: $data.isTagListVisible ? 1 : "",
    y: $data.isVisible ? 1 : ""
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9df3086c"], ["__file", "D:/Download/CoHub/CoHub_frontend/pages/list/grid/add.vue"]]);
wx.createComponent(Component);
