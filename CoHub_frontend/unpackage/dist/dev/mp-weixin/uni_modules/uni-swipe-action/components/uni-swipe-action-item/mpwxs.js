"use strict";
let mpMixins = {};
mpMixins = {
  data() {
    return {
      is_show: "none"
    };
  },
  watch: {
    show(newVal) {
      this.is_show = this.show;
    }
  },
  created() {
    this.swipeaction = this.getSwipeAction();
    if (this.swipeaction && Array.isArray(this.swipeaction.children)) {
      this.swipeaction.children.push(this);
    }
  },
  mounted() {
    this.is_show = this.show;
  },
  methods: {
    // wxs 中调用
    closeSwipe(e) {
      if (this.autoClose && this.swipeaction) {
        this.swipeaction.closeOther(this);
      }
    },
    change(e) {
      this.$emit("change", e.open);
      if (this.is_show !== e.open) {
        this.is_show = e.open;
      }
    },
    appTouchStart(e) {
      const {
        clientX
      } = e.changedTouches[0];
      this.clientX = clientX;
      this.timestamp = (/* @__PURE__ */ new Date()).getTime();
    },
    appTouchEnd(e, index, item, position) {
      const {
        clientX
      } = e.changedTouches[0];
      let diff = Math.abs(this.clientX - clientX);
      let time = (/* @__PURE__ */ new Date()).getTime() - this.timestamp;
      if (diff < 40 && time < 300) {
        this.$emit("click", {
          content: item,
          index,
          position
        });
      }
    },
    onClickForPC(index, item, position) {
      return;
    }
  }
};
const mpwxs = mpMixins;
exports.mpwxs = mpwxs;
