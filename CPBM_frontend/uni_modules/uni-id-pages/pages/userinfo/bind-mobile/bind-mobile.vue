<!-- 绑定手机号码页 -->
<template>
	<view class="uni-content">
		<match-media :min-width="690">
			<view class="login-logo">
				<image :src="logo"></image>
			</view>
			<!-- 顶部文字 -->
			<text class="title title-box">Bind phone number</text>
		</match-media>
		<!-- 登录框 -->
		<uni-easyinput clearable :focus="focusMobile" @blur="focusMobile = false" type="number" class="input-box" :inputBorder="false" v-model="formData.mobile"
			maxlength="11" placeholder="Please enter phone number"></uni-easyinput>
		<uni-id-pages-sms-form ref="smsForm" type="bind-mobile-by-sms" v-model="formData.code" :phone="formData.mobile">
		</uni-id-pages-sms-form>
		<button class="uni-btn send-btn-box" type="primary" @click="submit">Submit</button>
		<uni-popup-captcha @confirm="submit" v-model="formData.captcha" scene="bind-mobile-by-sms" ref="popup">
		</uni-popup-captcha>
	</view>
</template>
<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		data() {
			return {
				formData: {
					mobile: "",
					code: "",
					captcha: ""
				},
				focusMobile:true,
				logo: "/static/logo.png"
			}
		},
		computed: {
			tipText() {
				return `The verification code has been sent via SMS to ${this.formData.mobile}. Password must be between 6 and 20 digits`
			}
		},
		onLoad(event) {},
		onReady() {},

		methods: {
			/**
			 * 完成并提交
			 */
			submit() {
				if(! /^1\d{10}$/.test(this.formData.mobile)){
					this.focusMobile = true 
					return uni.showToast({
						title: 'Mobile phone number format is incorrect',
						icon: 'none',
						duration: 3000
					});
				}
				if(! /^\d{6}$/.test(this.formData.code)){
					this.$refs.smsForm.focusSmsCodeInput = true 
					return uni.showToast({
						title: 'Verification code format is incorrect',
						icon: 'none',
						duration: 3000
					});
				}
				
				const uniIdCo = uniCloud.importObject("uni-id-co")
				uniIdCo.bindMobileBySms(this.formData).then(e => {
					uni.showToast({
						title: e.errMsg,
						icon: 'none',
						duration: 3000
					});
					// #ifdef APP-NVUE
					const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
					// #endif
					// #ifndef APP-NVUE
					const eventChannel = this.getOpenerEventChannel();
					// #endif
					mutations.setUserInfo(this.formData)
					uni.navigateBack()
				}).catch(e => {
					console.log(e);
					if (e.errCode == 'uni-id-captcha-required') {
						this.$refs.popup.open()
					}
				}).finally(e => {
					this.formData.captcha = ""
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uni-id-pages/common/login-page.scss";

	.uni-content {
		padding: 0;
		align-items: center;
		justify-content: center;
		padding: 50rpx;
		padding-top: 10px;
	}
	
	
	@media screen and (min-width: 690px) {
		.uni-content{
			padding: 30px 40px 40px;
		}
	}

	/* #ifndef APP-NVUE  || VUE3 */
	.uni-content ::v-deep .uni-easyinput__content {}

	/* #endif */
	.input-box {
		width: 100%;
		margin-top: 16px;
		background-color: #f9f9f9;
		border-radius: 6rpx;
		flex-direction: row;
		flex-wrap: nowrap;
		margin-bottom: 10px;
	}

	.send-btn-box {
		margin-top: 15px;
	}
</style>
