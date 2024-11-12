<!-- 设置密码 -->
<template>
  <view class="uni-content">
    <match-media :min-width="690">
      <view class="login-logo">
        <image :src="logo"></image>
      </view>
      <!-- 顶部文字 -->
      <text class="title title-box ">Set password</text>
    </match-media>

    <uni-forms class="set-password-form" ref="form" :value="formData" err-show-type="toast">
      <text class="tip">Input password</text>
      <uni-forms-item name="newPassword">
        <uni-easyinput :focus="focusNewPassword" @blur="focusNewPassword = false" class="input-box"
                       type="password" :inputBorder="false" v-model="formData.newPassword" placeholder="Please enter the password">
        </uni-easyinput>
      </uni-forms-item>
      <text class="tip">Please enter the password again</text>
      <uni-forms-item name="newPassword2">
        <uni-easyinput :focus="focusNewPassword2" @blur="focusNewPassword2 = false" class="input-box"
                       type="password" :inputBorder="false" v-model="formData.newPassword2" placeholder="Please enter the password again">
        </uni-easyinput>
      </uni-forms-item>
      <uni-id-pages-sms-form v-model="formData.code" type="set-pwd-by-sms" ref="smsCode" :phone="userInfo.mobile">
      </uni-id-pages-sms-form>
      <view class="link-box">
        <button class="uni-btn send-btn" type="primary" @click="submit">OK</button>
        <button v-if="allowSkip" class="uni-btn send-btn" type="default" @click="skip">Jump</button>
      </view>

    </uni-forms>
    <uni-popup-captcha @confirm="submit" v-model="formData.captcha" scene="set-pwd-by-sms" ref="popup"></uni-popup-captcha>
  </view>
</template>

<script>
import passwordMod from '@/uni_modules/uni-id-pages/common/password.js'
import {store, mutations} from '@/uni_modules/uni-id-pages/common/store.js'
import config from '@/uni_modules/uni-id-pages/config.js'

const uniIdCo = uniCloud.importObject("uni-id-co", {
  customUI:true
})
export default {
  name: "set-pwd.vue",
  data () {
    return {
      uniIdRedirectUrl: '',
      loginType: '',
      logo: '/static/logo.png',
      focusNewPassword: false,
      focusNewPassword2: false,
      allowSkip: false,
      formData: {
        code: "",
        captcha: "",
        newPassword: "",
        newPassword2: ""
      },
      rules: passwordMod.getPwdRules('newPassword', 'newPassword2')
    }
  },
  computed: {
    userInfo () {
      return store.userInfo
    }
  },
  onReady() {
    this.$refs.form.setRules(this.rules)
  },
  onLoad (e) {
    this.uniIdRedirectUrl = e.uniIdRedirectUrl
    this.loginType = e.loginType

    if (config.setPasswordAfterLogin && config.setPasswordAfterLogin?.allowSkip) {
      this.allowSkip = true
    }
  },
  methods: {
    submit () {
      if(! /^\d{6}$/.test(this.formData.code)){
        this.$refs.smsCode.focusSmsCodeInput = true
        return uni.showToast({
          title: 'Verification code format is incorrect',
          icon: 'none'
        });
      }

      this.$refs.form.validate()
          .then(res => {
            uniIdCo.setPwd({
              password: this.formData.newPassword,
              code: this.formData.code,
              captcha: this.formData.captcha
            }).then(e => {
              uni.showModal({
                content: 'Password set successfully',
                showCancel: false,
                success: () => {
                  mutations.loginBack({
                    uniIdRedirectUrl: this.uniIdRedirectUrl,
                    loginType: this.loginType
                  })
                }
              });
            }).catch(e => {
              uni.showModal({
                content: e.message,
                showCancel: false
              });
            })
          }).catch(e => {
            if (e.errCode == 'uni-id-captcha-required') {
              this.$refs.popup.open()
            } else {
              console.log(e.errMsg);
            }
          }).finally(e => {
            this.formData.captcha = ''
          })
    },
    skip () {
      mutations.loginBack({
		uniIdRedirectUrl: this.uniIdRedirectUrl,
	  })
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/uni_modules/uni-id-pages/common/login-page.scss";

.uni-btn[type="default"] {
  color: inherit!important;
}

.uni-content ::v-deep .uni-forms-item {
  margin-bottom: 10px;
}

.popup-captcha {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  padding: 20rpx;
  background-color: #FFF;
  border-radius: 2px;
  flex-direction: column;
  position: relative;
}

.popup-captcha .title {
  font-weight: normal;
  padding: 0;
  padding-bottom: 15px;
  color: #666;
}

.popup-captcha .close {
  position: absolute;
  bottom: -40px;
  margin-left: -13px;
  left: 50%;
}

.popup-captcha .uni-btn {
  margin: 0;
}
</style>
