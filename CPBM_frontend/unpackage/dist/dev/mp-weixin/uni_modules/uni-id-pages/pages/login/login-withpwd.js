"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_common_loginPage_mixin = require("../../common/login-page.mixin.js");
const uniIdCo = common_vendor.Ws.importObject("uni-id-co", {
  errorOptions: {
    type: "toast"
  }
});
const _sfc_main = {
  mixins: [uni_modules_uniIdPages_common_loginPage_mixin.mixin],
  data() {
    return {
      "password": "",
      "username": "",
      "captcha": "",
      "needCaptcha": false,
      "focusUsername": false,
      "focusPassword": false,
      "logo": "/static/logo.png"
    };
  },
  onShow() {
  },
  methods: {
    async login() {
      try {
        const { data } = await common_vendor.index.request({
          url: "http://127.0.0.1:8000/login/",
          // 替换为你的实际登录API地址
          method: "POST",
          sslVerify: false,
          data: {
            username: this.username,
            password: this.password
          },
          header: {
            "content-type": "application/json"
            // 默认值
          }
        });
        console.log(data);
        if (data && data.user) {
          common_vendor.index.setStorageSync("uni_id", data.user.profileId);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success",
            duration: 2e3
          });
          common_vendor.index.switchTab({
            url: "/pages/list/list",
            animationType: "fade-in"
          });
        } else {
          common_vendor.index.showToast({
            title: "登录失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        console.error("登录失败:", error);
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none",
          duration: 2e3
        });
      }
    },
    // 页面跳转，找回密码
    toRetrievePwd() {
      let url = "/uni_modules/uni-id-pages/pages/retrieve/retrieve";
      if (/^1\d{10}$/.test(this.username)) {
        url += `?phoneNumber=${this.username}`;
      }
      common_vendor.index.navigateTo({
        url
      });
    },
    /**
     * 密码登录
     */
    pwdLogin() {
      if (!this.password.length) {
        this.focusPassword = true;
        return common_vendor.index.showToast({
          title: "Please enter password",
          icon: "none",
          duration: 3e3
        });
      }
      if (!this.username.length) {
        this.focusUsername = true;
        return common_vendor.index.showToast({
          title: "Please enter your mobile phone number/username/email",
          icon: "none",
          duration: 3e3
        });
      }
      if (this.needCaptcha && this.captcha.length != 4) {
        this.$refs.captcha.getImageCaptcha();
        return common_vendor.index.showToast({
          title: "please enter verification code",
          icon: "none",
          duration: 3e3
        });
      }
      if (this.needAgreements && !this.agree) {
        return this.$refs.agreements.popup(this.pwdLogin);
      }
      let data = {
        "password": this.password,
        "captcha": this.captcha
      };
      if (/^1\d{10}$/.test(this.username)) {
        data.mobile = this.username;
      } else if (/@/.test(this.username)) {
        data.email = this.username;
      } else {
        data.username = this.username;
      }
      uniIdCo.login(data).then((e) => {
        this.loginSuccess(e);
      }).catch((e) => {
        if (e.errCode == "uni-id-captcha-required") {
          this.needCaptcha = true;
        } else if (this.needCaptcha) {
          this.$refs.captcha.getImageCaptcha();
        }
      });
    },
    /* 前往注册 */
    toRegister() {
      common_vendor.index.navigateTo({
        url: this.config.isAdmin ? "/uni_modules/uni-id-pages/pages/register/register-admin" : "/uni_modules/uni-id-pages/pages/register/register",
        fail(e) {
          console.error(e);
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_captcha2 = common_vendor.resolveComponent("uni-captcha");
  const _easycom_uni_id_pages_agreements2 = common_vendor.resolveComponent("uni-id-pages-agreements");
  const _easycom_uni_id_pages_fab_login2 = common_vendor.resolveComponent("uni-id-pages-fab-login");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2 + _easycom_uni_captcha2 + _easycom_uni_id_pages_agreements2 + _easycom_uni_id_pages_fab_login2)();
}
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../../uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_captcha = () => "../../../uni-captcha/components/uni-captcha/uni-captcha.js";
const _easycom_uni_id_pages_agreements = () => "../../components/uni-id-pages-agreements/uni-id-pages-agreements.js";
const _easycom_uni_id_pages_fab_login = () => "../../components/uni-id-pages-fab-login/uni-id-pages-fab-login.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms + _easycom_uni_captcha + _easycom_uni_id_pages_agreements + _easycom_uni_id_pages_fab_login)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.logo,
    b: common_vendor.o(($event) => $data.focusUsername = false),
    c: common_vendor.o(($event) => $data.username = $event),
    d: common_vendor.p({
      focus: $data.focusUsername,
      inputBorder: false,
      placeholder: "Please enter your mobile phone number/username/email",
      modelValue: $data.username
    }),
    e: common_vendor.p({
      name: "username"
    }),
    f: common_vendor.o(($event) => $data.focusPassword = false),
    g: common_vendor.o(($event) => $data.password = $event),
    h: common_vendor.p({
      focus: $data.focusPassword,
      clearable: true,
      type: "password",
      inputBorder: false,
      placeholder: "Please enter password",
      modelValue: $data.password
    }),
    i: common_vendor.p({
      name: "password"
    }),
    j: $data.needCaptcha
  }, $data.needCaptcha ? {
    k: common_vendor.sr("captcha", "58ed63b0-5"),
    l: common_vendor.o(($event) => $data.captcha = $event),
    m: common_vendor.p({
      focus: true,
      scene: "login-by-pwd",
      modelValue: $data.captcha
    })
  } : {}, {
    n: common_vendor.sr("agreements", "58ed63b0-6"),
    o: common_vendor.p({
      scope: "login"
    }),
    p: !_ctx.config.isAdmin
  }, !_ctx.config.isAdmin ? {
    q: common_vendor.o((...args) => $options.toRetrievePwd && $options.toRetrievePwd(...args))
  } : {}, {
    r: common_vendor.t(_ctx.config.isAdmin ? "Register an administrator account" : "Register an account"),
    s: common_vendor.o((...args) => $options.toRegister && $options.toRegister(...args)),
    t: common_vendor.sr("uniFabLogin", "58ed63b0-7"),
    v: common_vendor.o((...args) => $options.login && $options.login(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-58ed63b0"], ["__file", "D:/Download/CoHub/CoHub_frontend/uni_modules/uni-id-pages/pages/login/login-withpwd.vue"]]);
wx.createPage(MiniProgramPage);
