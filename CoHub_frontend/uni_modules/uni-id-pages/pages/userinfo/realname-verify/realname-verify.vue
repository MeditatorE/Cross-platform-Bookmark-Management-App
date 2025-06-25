<template>
  <view>
    <template v-if="isCertify">
      <uni-list>
        <uni-list-item class="item" title="Name" :rightText="userInfo.realNameAuth.realName"></uni-list-item>
        <uni-list-item class="item" title="ID" :rightText="userInfo.realNameAuth.identity"></uni-list-item>
      </uni-list>
    </template>
    <template v-else>
      <view class="uni-content">
        <template v-if="verifyFail">
          <view class="face-icon">
            <image src="./face-verify-icon.svg" class="face-icon-image" />
          </view>
          <view class="error-title">{{verifyFailTitle}}</view>
          <view class="error-description">{{verifyFailContent}}</view>
          <button type="primary" @click="retry" v-if="verifyFailCode !== 10013">Restart verification</button>
          <button type="primary" @click="retry" v-else>Back</button>
          <view class="dev-tip" v-if="isDev">Please check the detailed error</view>
        </template>
        <template v-else>
          <text class="title">Real-name verification</text>
          <uni-forms>
            <uni-forms-item name="realName">
              <uni-easyinput placeholder="Name" class="input-box" v-model="realName" :clearable="false">
              </uni-easyinput>
            </uni-forms-item>
            <uni-forms-item name="idCard">
              <uni-easyinput placeholder="ID" class="input-box" v-model="idCard" :clearable="false">
              </uni-easyinput>
            </uni-forms-item>
          </uni-forms>
          <uni-id-pages-agreements scope="realNameVerify" ref="agreements" style="margin-bottom: 20px;">
          </uni-id-pages-agreements>
          <button type="primary" :disabled="!certifyIdNext" @click="getCertifyId">OK</button>
        </template>
      </view>
    </template>
  </view>
</template>

<script>
import checkIdCard from '@/uni_modules/uni-id-pages/common/check-id-card.js';
import mixin from '@/uni_modules/uni-id-pages/common/login-page.mixin.js';

import {
  store,
  mutations
} from '@/uni_modules/uni-id-pages/common/store.js'

const uniIdCo = uniCloud.importObject('uni-id-co')
const tempFrvInfoKey = 'uni-id-pages-temp-frv'
export default {
  mixins: [mixin],
  data() {
    return {
      realName: '',
      idCard: '',
      certifyId: '',
      verifyFail: false,
      verifyFailCode: 0,
      verifyFailTitle: '',
      verifyFailContent: ''
    }
  },
  computed: {
    userInfo() {
      return store.userInfo
    },
    certifyIdNext() {
      return Boolean(this.realName) && Boolean(this.idCard) && (this.needAgreements && this.agree)
    },
    isCertify() {
      return this.userInfo.realNameAuth && this.userInfo.realNameAuth.authStatus === 2
    },
    isDev() {
      return process.env.NODE_ENV === 'development'
    }
  },
  onLoad() {
    const tempFrvInfo = uni.getStorageSync(tempFrvInfoKey);
    if (tempFrvInfo) {
      this.realName = tempFrvInfo.realName
      this.idCard = tempFrvInfo.idCard
    }
  },
  methods: {
    async getCertifyId() {
      if (!this.certifyIdNext) return

      // #ifndef APP
      return uni.showModal({
        content: "Real-name authentication is not supported yet",
        showCancel: false
      })
      // #endif

      if (!checkIdCard(this.idCard)) {
        uni.showToast({
          title: "Invalid ID",
          icon: "none"
        })
        return
      }

      if (
          typeof this.realName !== 'string' ||
          this.realName.length < 2 ||
          !/^[\u4e00-\u9fa5]{1,10}(·?[\u4e00-\u9fa5]{1,10}){0,5}$/.test(this.realName)
      ) {
        uni.showToast({
          title: "The name can only be in Chinese characters",
          icon: "none"
        })
        return
      }

      uni.setStorage({
        key: tempFrvInfoKey,
        data: {
          realName: this.realName,
          idCard: this.idCard
        }
      });

      const metaInfo = uni.getFacialRecognitionMetaInfo()

      const res = await uniIdCo.getFrvCertifyId({
        realName: this.realName,
        idCard: this.idCard,
        metaInfo
      })

      this.certifyId = res.certifyId

      this.startFacialRecognitionVerify()
    },
    startFacialRecognitionVerify() {

      // #ifdef APP
      uni.startFacialRecognitionVerify({
        certifyId: this.certifyId,
        progressBarColor: "#2979ff",
        success: () => {
          this.verifyFail = false
          this.getFrvAuthResult()
        },
        fail: (e) => {
          let title = "Verification failed"
          let content

          console.log(
              `[frv-debug] certifyId auth error: certifyId -> ${this.certifyId}, error -> ${JSON.stringify(e, null, 4)}`
          )

          switch (e.errCode) {
            case 10001:
              content = 'Authentication ID is empty'
              break
            case 10010:
              title = 'Abnormal facial recognition'
              content = e.cause.message || 'Error code: 10010'
              break
            case 10011:
              title = 'Authentication interrupted'
              content = e.cause.message || 'Error code: 10011'
              break
            case 10012:
              content = 'Network anomaly'
              break
            case 10013:
              this.verifyFailCode = e.errCode
              this.verifyFailContent = e.cause.message || 'Error code: 10013'
              this.getFrvAuthResult()

              console.log(
                  `[frv-debug] Failed to scan face, certifyId -> ${this.certifyId}, If you are in the development environment, please check whether the user's name, ID number and the user who swiped the face are the same user. If the certification ID is already used, please check the certificateId status in the opendb-frv-logs table.`
              )
              return
            case 10020:
              content = 'Device setup time varies'
              break
            default:
              title = ''
              content = `Validate unknown error (${e.errCode})`
              break
          }

          this.verifyFail = true
          this.verifyFailCode = e.errCode
          this.verifyFailTitle = title
          this.verifyFailContent = content
        }
      })
      // #endif
    },
    async getFrvAuthResult() {
      const uniIdCo = uniCloud.importObject('uni-id-co', {
        customUI: true
      })
      try {
        uni.showLoading({
          title: "Verifying...",
          mask: false
        })
        const res = await uniIdCo.getFrvAuthResult({
          certifyId: this.certifyId
        })

        const {
          errCode,
          ...rest
        } = res

        if (this.verifyFailContent) {
          console.log(`[frv-debug] The client fails to scan the face. The real person authentication service will query the specific reason. The reason is:${this.verifyFailContent}`)
        }

        uni.showModal({
          content: "Real-name authentication successful",
          showCancel: false,
          success: () => {
            mutations.setUserInfo({
              realNameAuth: rest
            })
            this.verifyFail = false
          }
        })

        uni.removeStorage({
          key: tempFrvInfoKey
        })
      } catch (e) {
        this.verifyFail = true
        this.verifyFailTitle = e.errMsg
        console.error(JSON.stringify(e));
      } finally {
        uni.hideLoading()
      }
    },
    retry() {
      if (this.verifyFailCode !== 10013) {
        this.getCertifyId()
      } else {
        this.verifyFail = false
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/uni_modules/uni-id-pages/common/login-page.scss";

.checkbox-box,
.uni-label-pointer {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.item {
  flex-direction: row;
}

.text {
  line-height: 26px;
}

.checkbox-box ::v-deep .uni-checkbox-input {
  border-radius: 100%;
}

.checkbox-box ::v-deep .uni-checkbox-input.uni-checkbox-input-checked {
  border-color: $uni-color-primary;
  color: #FFFFFF !important;
  background-color: $uni-color-primary;
}

.agreements {
  margin-bottom: 20px;
}

.face-icon {
  width: 100px;
  height: 100px;
  margin: 50px auto 30px;
}

.face-icon-image {
  width: 100%;
  height: 100%;
  display: block;
}

.error-title {
  font-size: 18px;
  text-align: center;
  font-weight: bold;
}

.error-description {
  font-size: 13px;
  color: #999999;
  margin: 10px 0 20px;
  text-align: center;
}

.dev-tip {
  margin-top: 20px;
  font-size: 13px;
  color: #999;
  text-align: center;
}
</style>
